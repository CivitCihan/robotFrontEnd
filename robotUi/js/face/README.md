# 2D Robot Character Structure

Main API is still exposed from `js/faceCanvas.js`:

- `initFace(targetEl, options)`
- `setFaceState(state)`
- `setCharacterSkin(skinId, overrides?)`
- `setCharacterPartSkin(partName, partPatch)`

## Skin packs

Defined in `js/face/robotSkinRegistry.js`:

- `robotClassic`
- `robotNeon`
- `robotCopper`

Each skin has per-part styles:

- `headOuter`, `headInner`
- `eye`, `cheek`, `mouth`
- `antenna`, `neck`
- `bodyOuter`, `bodyInner`
- `arm`, `hand`
- `panel`

## Runtime examples

```js
setCharacterSkin("robotNeon");
setCharacterPartSkin("eye", { fill: "#FF66C4" });
setCharacterPartSkin("panel", { light: "#FFD166" });
```

## Notes

- If Rive fails to load, app automatically falls back to the 2D canvas robot renderer.
- 2D renderer is state-driven (`idle`, `listening`, `thinking`, `speaking`, `happy`).

