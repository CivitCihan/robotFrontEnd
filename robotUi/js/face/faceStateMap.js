export const FACE_STATES = ["idle", "listening", "thinking", "speaking", "happy"];

const STATE_ALIASES = {
  idle: ["idle", "isIdle", "toIdle"],
  listening: ["listening", "listen", "isListening", "toListening"],
  thinking: ["thinking", "think", "isThinking", "toThinking"],
  speaking: ["speaking", "talking", "speak", "isSpeaking", "toSpeaking"],
  happy: ["happy", "isHappy", "toHappy"],
};

export function getStateAliases(state) {
  return STATE_ALIASES[state] || [state];
}

