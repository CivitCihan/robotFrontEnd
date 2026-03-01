import { RiveFaceController } from "./face/riveFaceController.js";

let controller;

export async function initFace(targetEl, options = {}) {
  if (controller) {
    controller.destroy();
  }

  controller = new RiveFaceController(targetEl, options);

  try {
    await controller.init();
  } catch (error) {
    console.error("Rive face init hatasi:", error);
  }

  return controller;
}

export function setFaceState(state) {
  if (!controller) return;
  controller.setState(state);
}

export function destroyFace() {
  if (!controller) return;
  controller.destroy();
  controller = null;
}

