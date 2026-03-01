import {
  initFace,
  setFaceState,
  setCharacterSkin,
  setCharacterPartSkin,
  getCharacterSkinList,
} from "./faceCanvas.js";

const canvas = document.getElementById("faceCanvas");

await initFace(canvas, {
  renderer: "2d",
  skin: "robotClassic",
});

console.log("main.js calisiyor");

const states = ["idle", "listening", "thinking", "speaking", "happy"];
let i = 0;

setInterval(() => {
  setFaceState(states[i % states.length]);
  i++;
}, 10000);

window.setRobotSkin = setCharacterSkin;
window.setRobotPartSkin = setCharacterPartSkin;
window.getRobotSkinList = getCharacterSkinList;
  
