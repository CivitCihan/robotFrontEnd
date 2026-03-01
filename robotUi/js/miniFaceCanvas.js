const canvas = document.getElementById("faceCanvas");
let ctx = null;

let currentState = "idle";
let blink = 0;
let blinkCooldown = 110;
let mouthPhase = 0;
let running = false;

const palette = {
  dark: "#0B1C3D",
  border: "#E6E6E6",
  eye: "#2EC5F4",
  cheek: "#D98C8C",
  highlight: "#FFFFFF"
};


function normalizeState(state) {
  if (state === "neutral") return "idle";
  if (state === "serious") return "thinking";
  if (state === "confused") return "thinking";
  return state || "idle";
}

function resizeCanvas() {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);
  }
}

function drawRoundRect(x, y, w, h, r) {
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

function drawEye(x, y, r) {
  if (blink > 0) {
    ctx.strokeStyle = palette.eye;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.stroke();
    return;
  }

  // Ana göz
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = palette.eye;
  ctx.fill();

  // Parlama
  ctx.beginPath();
  ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = palette.highlight;
  ctx.fill();
}


function drawFaceFrame() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width * 0.5;
  const cy = canvas.height * 0.5;

  const headW = Math.min(canvas.width * 0.8, 260);
  const headH = headW * 0.55;

  // === DIŞ BEYAZ ÇERÇEVE ===
  ctx.beginPath();
  ctx.ellipse(cx, cy, headW / 2, headH / 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = palette.border;
  ctx.fill();

  // === İÇ KOYU YÜZ ===
  ctx.beginPath();
  ctx.ellipse(cx, cy, headW * 0.44, headH * 0.42, 0, 0, Math.PI * 2);
  ctx.fillStyle = palette.dark;
  ctx.fill();

  // === GÖZLER ===
  const eyeOffset = headW * 0.18;
  const eyeY = cy - 8;
  const eyeRadius = 16;

  drawEye(cx - eyeOffset, eyeY, eyeRadius);
  drawEye(cx + eyeOffset, eyeY, eyeRadius);

  // === YANAKLAR ===
  ctx.fillStyle = palette.cheek;
  ctx.beginPath();
  ctx.arc(cx - headW * 0.22, cy + 10, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + headW * 0.22, cy + 10, 6, 0, Math.PI * 2);
  ctx.fill();

  // === AĞIZ ===
  const mouthY = cy + 18;

  ctx.strokeStyle = palette.highlight;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();

  if (currentState === "sad") {
    ctx.arc(cx, mouthY + 6, 12, Math.PI + 0.2, -0.2, true);
  } else if (currentState === "speaking") {
    const open = 6 + Math.sin(mouthPhase) * 4;
    ctx.beginPath();
    ctx.ellipse(cx, mouthY, 8, open, 0, 0, Math.PI * 2);
    ctx.fillStyle = palette.highlight;
    ctx.fill();
    return;
  } else {
    ctx.arc(cx, mouthY, 12, 0.2, Math.PI - 0.2);
  }

  ctx.stroke();
}


function updateFrame() {
  blinkCooldown -= 1;
  if (blinkCooldown <= 0) {
    blink = 6;
    blinkCooldown = 90 + Math.random() * 140;
  }
  if (blink > 0) blink -= 1;

  if (currentState === "speaking") {
    mouthPhase += 0.22;
  } else {
    mouthPhase = 0;
  }
}

function loop() {
  if (!running) return;
  updateFrame();
  drawFaceFrame();
  requestAnimationFrame(loop);
}

function start() {
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  running = true;
  requestAnimationFrame(loop);
}

window.drawFace = function drawFace(state) {
  currentState = normalizeState(state);
};

start();
