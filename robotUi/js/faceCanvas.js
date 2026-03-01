import { RiveFaceController } from "./face/riveFaceController.js";
import { CanvasFallbackFace } from "./face/canvasFallbackFace.js";
import { listRobotSkins } from "./face/robotSkinRegistry.js";

let controller;

export async function initFace(targetEl, options = {}) {
  if (controller) {
    controller.destroy();
  }

  const renderer = options.renderer || "auto";

  if (renderer === "2d") {
    controller = new CanvasFallbackFace(targetEl, options);
    await controller.init();
    return controller;
  }

  controller = new RiveFaceController(targetEl, options);

  try {
    await controller.init();
  } catch (error) {
    console.error("Rive face init hatasi:", error);
    if (renderer === "rive") {
      throw error;
    }
    controller = new CanvasFallbackFace(targetEl, options);
    await controller.init();
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

export function setCharacterSkin(skinId, overrides = {}) {
  if (!controller || typeof controller.setSkin !== "function") return;
  controller.setSkin(skinId, overrides);
}

export function setCharacterPartSkin(partName, partPatch = {}) {
  if (!controller || typeof controller.setPartSkin !== "function") return;
  controller.setPartSkin(partName, partPatch);
}

export function getCharacterSkinList() {
  return listRobotSkins();
}
