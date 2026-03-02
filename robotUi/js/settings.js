console.log("Settings JS çalışıyor");

const volume = document.getElementById("volume");
const brightness = document.getElementById("brightness");
const profileSelect = document.getElementById("profileSelect");

const profiles = [
  { name: "Ali", age: 5 },
  { name: "Ayşe", age: 7 }
];

// PROFİLLERİ YÜKLE
profiles.forEach(p => {
  const option = document.createElement("option");
  option.text = `${p.name} (${p.age})`;
  profileSelect.add(option);
});

// SES
volume.addEventListener("input", () => {
  drawFace("happy");
  speak("Ses ayarlandı");
});

// PARLAKLIK
brightness.addEventListener("input", () => {
  document.body.style.filter = `brightness(${brightness.value}%)`;
});

// EBEVEYN KİLİDİ
function openParentLock() {
  document.getElementById("parentLock").classList.remove("hidden");
  drawFace("serious");
  speak("Bu alan büyükler içindir");
}

function closeParentLock() {
  document.getElementById("parentLock").classList.add("hidden");
  drawFace("neutral");
}

function checkPin() {
  const pin = document.getElementById("pinInput").value;

  if (pin === "1234") {
    // Mutlu ifade + yönlendirme
    drawFace("happy");
    speak("Ebeveyn paneline geçiliyor");

    // Kısa bir gecikme, yüz ve ses hissedilsin
    setTimeout(() => {
      window.location.href = "parents.html";
    }, 800);

  } else {
    // Hatalı giriş
    drawFace("sad");
    speak("Yanlış şifre");
  }
}


// SES
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "tr-TR";
  window.speechSynthesis.speak(msg);
}
