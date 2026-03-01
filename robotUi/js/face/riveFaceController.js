import { FACE_STATES, getStateAliases } from "./faceStateMap.js";

const DEFAULT_OPTIONS = {
  src: "./assets/rive/robot-face.riv",
  stateMachine: "RobotMachine",
  artboard: undefined,
  autoplay: true,
  fit: "contain",
  alignment: "center",
};

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

function findNamedInput(inputs, names) {
  const lowerNames = names.map((name) => name.toLowerCase());
  return inputs.find((input) => lowerNames.includes(input.name.toLowerCase()));
}

function pickRiveEnum(rive, groupName, enumName) {
  if (!rive || !rive[groupName]) return undefined;
  return rive[groupName][enumName];
}

export class RiveFaceController {
  constructor(targetEl, options = {}) {
    this.targetEl = targetEl;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.canvas = resolveCanvas(targetEl);
    this.riveInstance = null;
    this.smInputs = [];
    this.loaded = false;
    this.lastState = null;
    this.resizeObserver = null;
    this.hostTimeline = null;
  }

  async init() {
    const rive = window.rive;
    if (!rive || typeof rive.Rive !== "function") {
      throw new Error("Rive runtime bulunamadi. index.html dosyasini kontrol edin.");
    }

    const fit = pickRiveEnum(rive, "Fit", this.options.fit) ?? rive.Fit.Contain;
    const alignment = pickRiveEnum(rive, "Alignment", this.options.alignment) ?? rive.Alignment.Center;

    await new Promise((resolve, reject) => {
      this.riveInstance = new rive.Rive({
        src: this.options.src,
        canvas: this.canvas,
        stateMachines: this.options.stateMachine,
        artboard: this.options.artboard,
        autoplay: this.options.autoplay,
        layout: new rive.Layout({ fit, alignment }),
        onLoad: () => {
          this.loaded = true;
          this.smInputs = this.riveInstance.stateMachineInputs(this.options.stateMachine) || [];
          this.resize();
          resolve();
        },
        onLoadError: (err) => {
          reject(err instanceof Error ? err : new Error("Rive dosyasi yuklenemedi."));
        },
      });
    });

    this.setupResizeHandling();
    this.startHostMotion();
    this.setState("idle");
  }

  setupResizeHandling() {
    if (typeof ResizeObserver !== "undefined" && this.targetEl.tagName !== "CANVAS") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.targetEl);
    }
    window.addEventListener("resize", this.resizeBound ?? (this.resizeBound = () => this.resize()));
  }

  resize() {
    if (!this.canvas || !this.riveInstance) return;

    if (this.targetEl.tagName !== "CANVAS") {
      const rect = this.targetEl.getBoundingClientRect();
      this.canvas.width = Math.max(1, Math.floor(rect.width));
      this.canvas.height = Math.max(1, Math.floor(rect.height));
    }

    if (typeof this.riveInstance.resizeDrawingSurfaceToCanvas === "function") {
      this.riveInstance.resizeDrawingSurfaceToCanvas();
    }
  }

  setState(state) {
    if (!FACE_STATES.includes(state) || !this.loaded) return;
    this.lastState = state;

    const matchedStateInput = this.applyMappedInput(state);
    if (!matchedStateInput) {
      this.applyEnumLikeInput(state);
    }
  }

  applyMappedInput(state) {
    const aliases = getStateAliases(state);
    const matched = findNamedInput(this.smInputs, aliases);
    if (!matched) return false;

    if (typeof matched.fire === "function") {
      matched.fire();
      return true;
    }

    if (typeof matched.value === "boolean") {
      this.resetStateBooleans();
      matched.value = true;
      return true;
    }

    if (typeof matched.value === "number") {
      matched.value = FACE_STATES.indexOf(state);
      return true;
    }

    return false;
  }

  applyEnumLikeInput(state) {
    const enumInput = findNamedInput(this.smInputs, ["state", "mode", "mood", "faceState"]);
    if (!enumInput || typeof enumInput.value !== "number") return;
    enumInput.value = FACE_STATES.indexOf(state);
  }

  resetStateBooleans() {
    for (const name of FACE_STATES) {
      const input = findNamedInput(this.smInputs, getStateAliases(name));
      if (input && typeof input.value === "boolean") {
        input.value = false;
      }
    }
  }

  startHostMotion() {
    const gsap = window.gsap;
    if (!gsap || !this.canvas) return;

    this.hostTimeline = gsap.timeline({ repeat: -1, yoyo: true });
    this.hostTimeline.to(this.canvas, {
      y: 4,
      duration: 2.2,
      ease: "sine.inOut",
    });
  }

  destroy() {
    if (this.hostTimeline) {
      this.hostTimeline.kill();
      this.hostTimeline = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.resizeBound) {
      window.removeEventListener("resize", this.resizeBound);
    }

    if (this.riveInstance && typeof this.riveInstance.cleanup === "function") {
      this.riveInstance.cleanup();
    }

    this.riveInstance = null;
    this.smInputs = [];
    this.loaded = false;
  }
}

