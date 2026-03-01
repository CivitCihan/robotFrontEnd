# Rive Face Asset Contract

Place your face animation file here:

- `robotUi/assets/rive/robot-face.riv`

Current JS integration expects:

1. State machine name: `RobotMachine`
2. App states mapped from JS:
   - `idle`
   - `listening`
   - `thinking`
   - `speaking`
   - `happy`

Supported input strategies in the state machine:

- Trigger/boolean inputs with the same names above (or aliases like `toHappy`, `isThinking`)
- A single numeric input named `state`, `mode`, `mood`, or `faceState`
  where indices are:
  - `idle = 0`
  - `listening = 1`
  - `thinking = 2`
  - `speaking = 3`
  - `happy = 4`

If your names differ, pass options in `initFace(targetEl, options)`:

```js
await initFace(canvasEl, {
  src: "./assets/rive/my-bot.riv",
  stateMachine: "MyStateMachine",
  artboard: "Main",
});
```

