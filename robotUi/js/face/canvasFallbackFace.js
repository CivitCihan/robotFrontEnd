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
  constructor(targetEl) {
    this.targetEl = targetEl;
    this.canvas = resolveCanvas(targetEl);
    this.ctx = null;
    this.running = false;
    this.raf = 0;
    this.currentState = "idle";
    this.blink = 0;
    this.blinkCooldown = 110;
    this.mouthPhase = 0;
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

  updateFrame() {
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
      dark: "#0B1C3D",
      border: "#E6E6E6",
      eye: "#2EC5F4",
      cheek: "#D98C8C",
      highlight: "#FFFFFF",
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.5;

    const headW = Math.min(canvas.width * 0.8, 420);
    const headH = headW * 0.55;

    ctx.beginPath();
    ctx.ellipse(cx, cy, headW / 2, headH / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = palette.border;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx, cy, headW * 0.44, headH * 0.42, 0, 0, Math.PI * 2);
    ctx.fillStyle = palette.dark;
    ctx.fill();

    const eyeOffset = headW * 0.18;
    const eyeY = cy - 8;
    const eyeRadius = Math.max(10, Math.floor(headW * 0.06));

    this.drawEye(cx - eyeOffset, eyeY, eyeRadius, palette);
    this.drawEye(cx + eyeOffset, eyeY, eyeRadius, palette);

    ctx.fillStyle = palette.cheek;
    ctx.beginPath();
    ctx.arc(cx - headW * 0.22, cy + 10, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx + headW * 0.22, cy + 10, 6, 0, Math.PI * 2);
    ctx.fill();

    const mouthY = cy + 18;
    ctx.strokeStyle = palette.highlight;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();

    if (this.currentState === "speaking") {
      const open = 6 + Math.sin(this.mouthPhase) * 4;
      ctx.ellipse(cx, mouthY, 8, open, 0, 0, Math.PI * 2);
      ctx.fillStyle = palette.highlight;
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
}

