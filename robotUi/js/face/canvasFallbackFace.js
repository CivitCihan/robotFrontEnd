import { getRobotSkin, mergePartStyle } from "./robotSkinRegistry.js";

function resolveCanvas(targetEl) {
  if (!targetEl) throw new Error("faceCanvas elementi bulunamadi.");
  if (targetEl.tagName === "CANVAS") return targetEl;

  const existing = targetEl.querySelector("canvas");
  if (existing) return existing;

  const created = document.createElement("canvas");
  created.style.width = "100%";
  created.style.height = "100%";
  created.style.display = "block";
  targetEl.appendChild(created);
  return created;
}

function normalizeState(state) {
  if (state === "neutral") return "idle";
  if (state === "serious" || state === "confused") return "thinking";
  return state || "idle";
}

export class CanvasFallbackFace {
  constructor(targetEl, options = {}) {
    this.targetEl = targetEl;
    this.canvas = resolveCanvas(targetEl);
    this.ctx = null;
    this.running = false;
    this.raf = 0;
    this.currentState = "idle";
    this.blink = 0;
    this.blinkCooldown = 110;
    this.mouthPhase = 0;
    this.time = 0;
    this.skin = getRobotSkin(options.skin, options.skinOverrides);
    this.resizeBound = () => this.resizeCanvas();
  }

  async init() {
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeBound);
    this.running = true;
    this.loop();
  }

  resizeCanvas() {
    if (!this.canvas) return;

    if (this.targetEl.tagName !== "CANVAS") {
      const rect = this.targetEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.canvas.width = Math.floor(rect.width);
        this.canvas.height = Math.floor(rect.height);
      }
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      this.canvas.width = Math.floor(rect.width);
      this.canvas.height = Math.floor(rect.height);
    }
  }

  setState(state) {
    this.currentState = normalizeState(state);
  }

  setSkin(skinId, overrides = {}) {
    this.skin = getRobotSkin(skinId, overrides);
  }

  setPartSkin(partName, partPatch = {}) {
    this.skin = mergePartStyle(this.skin, partName, partPatch);
  }

  updateFrame() {
    this.time += 1;
    this.blinkCooldown -= 1;
    if (this.blinkCooldown <= 0) {
      this.blink = 6;
      this.blinkCooldown = 90 + Math.random() * 140;
    }
    if (this.blink > 0) this.blink -= 1;

    if (this.currentState === "speaking") {
      this.mouthPhase += 0.22;
    } else {
      this.mouthPhase = 0;
    }
  }

  drawEye(x, y, r, palette) {
    const ctx = this.ctx;
    if (!ctx) return;

    if (this.blink > 0) {
      ctx.strokeStyle = palette.eye;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x - r, y);
      ctx.lineTo(x + r, y);
      ctx.stroke();
      return;
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = palette.eye;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = palette.highlight;
    ctx.fill();
  }

  drawFrame() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) return;

    const palette = {
      dark: this.skin.parts.headInner.fill,
      border: this.skin.parts.headOuter.fill,
      eye: this.skin.parts.eye.fill,
      cheek: this.skin.parts.cheek.fill,
      highlight: this.skin.parts.eye.highlight,
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width * 0.5;
    const cyBase = canvas.height * 0.5;
    const bob = Math.sin(this.time * this.skin.motion.bobSpeed) * this.skin.motion.bobAmp;
    const cy = cyBase + bob;

    const headW = Math.min(canvas.width * 0.45, 320);
    const headH = headW * 0.55;
    const bodyW = headW * 0.9;
    const bodyH = headH * 1.8;
    const bodyY = cy + headH * 1.05;
    const neckW = headW * 0.18;
    const neckH = headH * 0.25;
    const armAnchorY = bodyY - bodyH * 0.25;
    const armLen = bodyH * 0.6;
    const armSwing =
      this.currentState === "happy"
        ? this.skin.motion.armSwingHappy
        : this.currentState === "speaking"
          ? this.skin.motion.armSwingSpeaking
          : this.skin.motion.armSwingIdle;
    const armWave = Math.sin(this.time * 0.06) * armSwing;

    const antennaX = cx;
    const antennaY = cy - headH * 0.55;
    const antennaTipX = antennaX + Math.sin(this.time * 0.08) * (headW * this.skin.motion.antennaSwing);
    const antennaTipY = antennaY - headH * 0.5;

    // Antenna
    ctx.strokeStyle = this.skin.parts.antenna.stem;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(antennaX, antennaY);
    ctx.lineTo(antennaTipX, antennaTipY);
    ctx.stroke();
    ctx.fillStyle = this.skin.parts.antenna.tip;
    ctx.beginPath();
    ctx.arc(antennaTipX, antennaTipY, 9, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = this.skin.parts.neck.fill;
    ctx.strokeStyle = this.skin.parts.neck.stroke;
    ctx.lineWidth = this.skin.parts.neck.lineWidth;
    this.pathRoundedRect(cx - neckW / 2, cy + headH * 0.4, neckW, neckH, 8);
    ctx.fill();
    ctx.stroke();

    // Arms (behind body)
    this.drawArm(cx - bodyW * 0.52, armAnchorY, armLen, Math.PI * (0.74 + armWave * 0.2), true);
    this.drawArm(cx + bodyW * 0.52, armAnchorY, armLen, Math.PI * (0.26 - armWave), false);

    // Body
    ctx.fillStyle = this.skin.parts.bodyOuter.fill;
    ctx.strokeStyle = this.skin.parts.bodyOuter.stroke;
    ctx.lineWidth = this.skin.parts.bodyOuter.lineWidth;
    this.pathRoundedRect(cx - bodyW / 2, bodyY - bodyH / 2, bodyW, bodyH, 36);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = this.skin.parts.bodyInner.fill;
    ctx.strokeStyle = this.skin.parts.bodyInner.stroke;
    ctx.lineWidth = this.skin.parts.bodyInner.lineWidth;
    this.pathRoundedRect(cx - bodyW * 0.32, bodyY - bodyH * 0.28, bodyW * 0.64, bodyH * 0.56, 24);
    ctx.fill();
    ctx.stroke();

    // Panel light
    const panel = this.skin.parts.panel;
    ctx.fillStyle = panel.fill;
    ctx.strokeStyle = panel.stroke;
    ctx.lineWidth = panel.lineWidth;
    this.pathRoundedRect(cx - bodyW * 0.16, bodyY - bodyH * 0.05, bodyW * 0.32, bodyH * 0.16, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = panel.light;
    ctx.beginPath();
    ctx.arc(cx, bodyY + bodyH * 0.03, 8 + Math.sin(this.time * 0.1) * 2, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.ellipse(cx, cy, headW / 2, headH / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.skin.parts.headOuter.fill;
    ctx.strokeStyle = this.skin.parts.headOuter.stroke;
    ctx.lineWidth = this.skin.parts.headOuter.lineWidth;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, cy, headW * 0.44, headH * 0.42, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.skin.parts.headInner.fill;
    ctx.strokeStyle = this.skin.parts.headInner.stroke;
    ctx.lineWidth = this.skin.parts.headInner.lineWidth;
    ctx.fill();
    ctx.stroke();

    const eyeOffset = headW * 0.18;
    const eyeY = cy - 8;
    const eyeRadius = Math.max(10, Math.floor(headW * 0.06));

    this.drawEye(cx - eyeOffset, eyeY, eyeRadius, palette);
    this.drawEye(cx + eyeOffset, eyeY, eyeRadius, palette);

    ctx.fillStyle = this.skin.parts.cheek.fill;
    ctx.beginPath();
    ctx.arc(cx - headW * 0.22, cy + 10, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx + headW * 0.22, cy + 10, 6, 0, Math.PI * 2);
    ctx.fill();

    const mouthY = cy + 18;
    ctx.strokeStyle = this.skin.parts.mouth.stroke;
    ctx.lineWidth = this.skin.parts.mouth.lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();

    if (this.currentState === "speaking") {
      const open = 6 + Math.sin(this.mouthPhase) * 4;
      ctx.ellipse(cx, mouthY, 8, open, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.skin.parts.mouth.fill;
      ctx.fill();
      return;
    }

    if (this.currentState === "thinking") {
      ctx.arc(cx, mouthY + 3, 10, Math.PI + 0.3, -0.3, true);
      ctx.stroke();
      return;
    }

    if (this.currentState === "happy") {
      ctx.arc(cx, mouthY, 12, 0.1, Math.PI - 0.1);
      ctx.stroke();
      return;
    }

    ctx.arc(cx, mouthY, 10, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  loop() {
    if (!this.running) return;
    this.updateFrame();
    this.drawFrame();
    this.raf = requestAnimationFrame(() => this.loop());
  }

  destroy() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resizeBound);
  }

  drawArm(x, y, armLen, angle, leftSide) {
    const ctx = this.ctx;
    if (!ctx) return;

    const elbowX = x + Math.cos(angle) * (armLen * 0.55);
    const elbowY = y + Math.sin(angle) * (armLen * 0.55);
    const wristX = x + Math.cos(angle) * armLen;
    const wristY = y + Math.sin(angle) * armLen;

    ctx.strokeStyle = this.skin.parts.arm.stroke;
    ctx.lineWidth = this.skin.parts.arm.lineWidth * 2.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(elbowX, elbowY);
    ctx.lineTo(wristX, wristY);
    ctx.stroke();

    ctx.fillStyle = this.skin.parts.hand.fill;
    ctx.strokeStyle = this.skin.parts.hand.stroke;
    ctx.lineWidth = this.skin.parts.hand.lineWidth;
    ctx.beginPath();
    ctx.ellipse(wristX + (leftSide ? -4 : 4), wristY + 1, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  pathRoundedRect(x, y, w, h, r) {
    const ctx = this.ctx;
    if (!ctx) return;
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
