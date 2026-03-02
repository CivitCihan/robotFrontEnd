console.log("Parent panel çalışıyor");

const childSelect = document.getElementById("childSelect");
const timeLimit = document.getElementById("timeLimit");
const timeValue = document.getElementById("timeValue");
const progressText = document.getElementById("progressText");

let children = [
  { name: "Ali", age: 5, level: 2 },
  { name: "Ayşe", age: 7, level: 3 }
];

// PROFİL YÜKLE
children.forEach(c => {
  const option = document.createElement("option");
  option.text = `${c.name} (${c.age})`;
  childSelect.add(option);
});

// PROFİL SEÇİMİ
childSelect.addEventListener("change", () => {
  progressText.innerText = "Odak süresi: iyi\nHafıza: gelişiyor";
});

// ZAMAN LİMİTİ
timeLimit.addEventListener("input", () => {
  timeValue.innerText = `${timeLimit.value} dk`;
});

// YENİ PROFİL
function addChild() {
  const name = prompt("Çocuğun adı?");
  const age = prompt("Yaşı?");
  if (name && age) {
    children.push({ name, age, level: 1 });
    const option = document.createElement("option");
    option.text = `${name} (${age})`;
    childSelect.add(option);
  }
}

