import { initFace, setFaceState } from "./faceCanvas.js";

const canvas = document.getElementById("faceCanvas");

await initFace(canvas);

console.log("main.js calisiyor");

const states = ["idle", "listening", "thinking", "speaking", "happy"];
let i = 0;

setInterval(() => {
  setFaceState(states[i % states.length]);
  i++;
}, 10000);
  
