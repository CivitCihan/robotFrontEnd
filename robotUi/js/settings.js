const volume = document.getElementById("volume");
const brightness = document.getElementById("brightness");
const profileSelect = document.getElementById("profileSelect");
const volumeValue = document.getElementById("volumeValue");
const brightnessValue = document.getElementById("brightnessValue");

const profiles = [
  { name: "Ali", age: 5 },
  { name: "Ayse", age: 7 },
];

profiles.forEach((profile) => {
  const option = document.createElement("option");
  option.text = `${profile.name} (${profile.age})`;
  profileSelect.add(option);
});

function setVolumeLabel() {
  if (volumeValue) {
    volumeValue.textContent = `${volume.value}%`;
  }
}

function setBrightnessLabel() {
  if (brightnessValue) {
    brightnessValue.textContent = `${brightness.value}%`;
  }
}

setVolumeLabel();
setBrightnessLabel();

volume.addEventListener("input", () => {
  setVolumeLabel();
  if (typeof window.drawFace === "function") {
    window.drawFace("happy");
  }
});

volume.addEventListener("change", () => {
  speak("Ses ayari guncellendi");
});

brightness.addEventListener("input", () => {
  setBrightnessLabel();
  document.body.style.filter = `brightness(${brightness.value}%)`;
});

function openParentLock() {
  document.getElementById("parentLock").classList.remove("hidden");
  if (typeof window.drawFace === "function") {
    window.drawFace("serious");
  }
  speak("Bu alan buyukler icindir");
}

function closeParentLock() {
  document.getElementById("parentLock").classList.add("hidden");
  if (typeof window.drawFace === "function") {
    window.drawFace("neutral");
  }
}

function checkPin() {
  const pin = document.getElementById("pinInput").value;

  if (pin === "1234") {
    if (typeof window.drawFace === "function") {
      window.drawFace("happy");
    }
    speak("Ebeveyn paneline geciliyor");
    setTimeout(() => {
      window.location.href = "parents.html";
    }, 800);
    return;
  }

  if (typeof window.drawFace === "function") {
    window.drawFace("sad");
  }
  speak("Yanlis sifre");
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "tr-TR";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}
