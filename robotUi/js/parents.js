const childSelect = document.getElementById("childSelect");
const timeLimit = document.getElementById("timeLimit");
const timeValue = document.getElementById("timeValue");
const progressText = document.getElementById("progressText");

const children = [
  { name: "Ali", age: 5, level: 2 },
  { name: "Ayse", age: 7, level: 3 },
];

children.forEach((child) => {
  const option = document.createElement("option");
  option.text = `${child.name} (${child.age})`;
  childSelect.add(option);
});

function renderProgress(index) {
  const child = children[index];
  if (!child) {
    progressText.textContent = "Henuz veri yok";
    return;
  }

  const focus = child.level >= 3 ? "cok iyi" : "iyi";
  const memory = child.level >= 3 ? "guclu" : "gelisiyor";
  progressText.textContent = `Odak suresi: ${focus}\nHafiza: ${memory}\nSeviye: ${child.level}`;
}

function renderTimeValue() {
  timeValue.textContent = `${timeLimit.value} dk`;
}

childSelect.addEventListener("change", () => {
  renderProgress(childSelect.selectedIndex);
});

timeLimit.addEventListener("input", renderTimeValue);

function addChild() {
  const name = prompt("Cocugun adi?");
  const age = prompt("Yasi?");
  if (!name || !age) {
    return;
  }

  children.push({ name, age, level: 1 });
  const option = document.createElement("option");
  option.text = `${name} (${age})`;
  childSelect.add(option);
  childSelect.selectedIndex = childSelect.options.length - 1;
  renderProgress(childSelect.selectedIndex);
}

renderTimeValue();
renderProgress(0);
