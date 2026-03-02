const ROBOT_CLASSIC = {
  id: "robotClassic",
  parts: {
    headOuter: { fill: "#E8EDF4", stroke: "#A8B3C2", lineWidth: 5 },
    headInner: { fill: "#0B1C3D", stroke: "#203D66", lineWidth: 2 },
    eye: { fill: "#2EC5F4", highlight: "#FFFFFF", stroke: "#8EF0FF", lineWidth: 2 },
    cheek: { fill: "#D98C8C" },
    mouth: { stroke: "#FFFFFF", fill: "#FFFFFF", lineWidth: 4 },
    antenna: { stem: "#A8B3C2", tip: "#39E2B3" },
    neck: { fill: "#A8B3C2", stroke: "#8792A1", lineWidth: 2 },
    bodyOuter: { fill: "#F2F6FC", stroke: "#A8B3C2", lineWidth: 5 },
    bodyInner: { fill: "#D8E1EE", stroke: "#A8B3C2", lineWidth: 2 },
    arm: { fill: "#E2E9F3", stroke: "#9EABBC", lineWidth: 4 },
    hand: { fill: "#D2DBE8", stroke: "#97A3B2", lineWidth: 3 },
    panel: { fill: "#0F2F5F", stroke: "#2C5A8E", light: "#39E2B3", lineWidth: 2 },
    lowerBody: { fill: "#C9D4E4", stroke: "#8D9CB0", lineWidth: 4, shadow: "#A7B5C9" },
    hip: { fill: "#B8C5D8", stroke: "#7E8FA4", lineWidth: 3 },
    wheelTire: { fill: "#2D3440", stroke: "#151922", lineWidth: 4, tread: "#3A4250" },
    wheelRim: { fill: "#C8D4E5", stroke: "#8B9BB1", lineWidth: 3 },
    wheelCore: { fill: "#7CE7FF", stroke: "#CFFDFF", lineWidth: 2 },
  },
  motion: {
    bobAmp: 7,
    bobSpeed: 0.04,
    armSwingIdle: 0.2,
    armSwingSpeaking: 0.4,
    armSwingHappy: 0.55,
    antennaSwing: 0.08,
    wheelSpinSpeedIdle: 0.05,
    wheelSpinSpeedSpeaking: 0.08,
    wheelSpinSpeedHappy: 0.12,
  },
};

const ROBOT_NEON = {
  id: "robotNeon",
  parts: {
    headOuter: { fill: "#EAF8FF", stroke: "#8CE0FF", lineWidth: 5 },
    headInner: { fill: "#12223F", stroke: "#2D4D83", lineWidth: 2 },
    eye: { fill: "#7DFFCE", highlight: "#FFFFFF", stroke: "#B8FFE5", lineWidth: 2 },
    cheek: { fill: "#FF9AB8" },
    mouth: { stroke: "#C8FFE9", fill: "#C8FFE9", lineWidth: 4 },
    antenna: { stem: "#9CD5FF", tip: "#7DFFCE" },
    neck: { fill: "#A9D4EE", stroke: "#79B8D8", lineWidth: 2 },
    bodyOuter: { fill: "#EEFBFF", stroke: "#8BD8F9", lineWidth: 5 },
    bodyInner: { fill: "#D6F2FF", stroke: "#8BD8F9", lineWidth: 2 },
    arm: { fill: "#DCF6FF", stroke: "#8ECBE5", lineWidth: 4 },
    hand: { fill: "#CDEBFA", stroke: "#7EB5CC", lineWidth: 3 },
    panel: { fill: "#123568", stroke: "#2B67A8", light: "#7DFFCE", lineWidth: 2 },
    lowerBody: { fill: "#C9EBF9", stroke: "#73B3D0", lineWidth: 4, shadow: "#A9DDEE" },
    hip: { fill: "#B7E0F1", stroke: "#68A3C2", lineWidth: 3 },
    wheelTire: { fill: "#273140", stroke: "#111722", lineWidth: 4, tread: "#344257" },
    wheelRim: { fill: "#CBEFFC", stroke: "#79B9D7", lineWidth: 3 },
    wheelCore: { fill: "#7DFFCE", stroke: "#D2FFEF", lineWidth: 2 },
  },
  motion: {
    bobAmp: 8,
    bobSpeed: 0.045,
    armSwingIdle: 0.22,
    armSwingSpeaking: 0.45,
    armSwingHappy: 0.6,
    antennaSwing: 0.1,
    wheelSpinSpeedIdle: 0.055,
    wheelSpinSpeedSpeaking: 0.09,
    wheelSpinSpeedHappy: 0.13,
  },
};

const ROBOT_COPPER = {
  id: "robotCopper",
  parts: {
    headOuter: { fill: "#F6E4D4", stroke: "#BA8A62", lineWidth: 5 },
    headInner: { fill: "#2C201A", stroke: "#5A4033", lineWidth: 2 },
    eye: { fill: "#FFD35A", highlight: "#FFF8DD", stroke: "#FFE7A8", lineWidth: 2 },
    cheek: { fill: "#E5A78C" },
    mouth: { stroke: "#FFF0CC", fill: "#FFF0CC", lineWidth: 4 },
    antenna: { stem: "#C19370", tip: "#FFD35A" },
    neck: { fill: "#D0A27D", stroke: "#A57A5A", lineWidth: 2 },
    bodyOuter: { fill: "#F5E7DA", stroke: "#BE916C", lineWidth: 5 },
    bodyInner: { fill: "#E8D2BE", stroke: "#BE916C", lineWidth: 2 },
    arm: { fill: "#EEDBC9", stroke: "#B78A67", lineWidth: 4 },
    hand: { fill: "#E3CAB2", stroke: "#A87A57", lineWidth: 3 },
    panel: { fill: "#3D2C22", stroke: "#77553F", light: "#FFD35A", lineWidth: 2 },
    lowerBody: { fill: "#DCC2A8", stroke: "#9F7659", lineWidth: 4, shadow: "#C3A78D" },
    hip: { fill: "#CCAE92", stroke: "#956A4D", lineWidth: 3 },
    wheelTire: { fill: "#312A28", stroke: "#17110F", lineWidth: 4, tread: "#433733" },
    wheelRim: { fill: "#E3C6AB", stroke: "#A97959", lineWidth: 3 },
    wheelCore: { fill: "#FFD35A", stroke: "#FFF1C3", lineWidth: 2 },
  },
  motion: {
    bobAmp: 6,
    bobSpeed: 0.038,
    armSwingIdle: 0.18,
    armSwingSpeaking: 0.36,
    armSwingHappy: 0.48,
    antennaSwing: 0.07,
    wheelSpinSpeedIdle: 0.048,
    wheelSpinSpeedSpeaking: 0.072,
    wheelSpinSpeedHappy: 0.11,
  },
};

const SKIN_REGISTRY = {
  robotClassic: ROBOT_CLASSIC,
  robotNeon: ROBOT_NEON,
  robotCopper: ROBOT_COPPER,
};

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(base, patch) {
  if (!isObject(base) || !isObject(patch)) return patch ?? base;
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    const baseValue = base[key];
    const patchValue = patch[key];
    out[key] = isObject(baseValue) && isObject(patchValue)
      ? deepMerge(baseValue, patchValue)
      : patchValue;
  }
  return out;
}

export function listRobotSkins() {
  return Object.keys(SKIN_REGISTRY);
}

export function getRobotSkin(skinId = "robotClassic", overrides = {}) {
  const base = SKIN_REGISTRY[skinId] || SKIN_REGISTRY.robotClassic;
  return deepMerge(base, overrides);
}

export function mergePartStyle(currentSkin, partName, partPatch) {
  if (!partPatch || !currentSkin?.parts?.[partName]) return currentSkin;
  const nextSkin = { ...currentSkin, parts: { ...currentSkin.parts } };
  nextSkin.parts[partName] = deepMerge(currentSkin.parts[partName], partPatch);
  return nextSkin;
}
