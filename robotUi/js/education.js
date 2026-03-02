const completedCount = document.getElementById("completedCount");
const totalScore = document.getElementById("totalScore");
const streakCount = document.getElementById("streakCount");
const lessonList = document.getElementById("lessonList");

const lessons = [
  { title: "Sayi Tanima", level: "Baslangic", score: 20, done: true },
  { title: "Renkleri Eslestir", level: "Baslangic", score: 15, done: true },
  { title: "Hayvan Sesleri", level: "Orta", score: 25, done: false },
  { title: "Sekil Ailesi", level: "Orta", score: 30, done: false },
  { title: "Hafiza Kartlari", level: "Ileri", score: 35, done: false },
  { title: "Sayi Siralama", level: "Ileri", score: 40, done: false },
];

function updateStats() {
  const doneLessons = lessons.filter((lesson) => lesson.done);
  const points = doneLessons.reduce((total, lesson) => total + lesson.score, 0);

  completedCount.textContent = String(doneLessons.length);
  totalScore.textContent = `${points} puan`;
  streakCount.textContent = `${Math.max(1, doneLessons.length)} gun`;
}

function renderLessons() {
  lessonList.innerHTML = "";

  lessons.forEach((lesson, index) => {
    const card = document.createElement("article");
    card.className = "card lesson-card";

    card.innerHTML = `
      <div class="lesson-top">
        <h2>${lesson.title}</h2>
        <span class="lesson-level">${lesson.level}</span>
      </div>
      <p class="lesson-score">${lesson.score} puan</p>
      <button class="main-btn lesson-action" type="button">
        ${lesson.done ? "Tamamlandi" : "Dersi Baslat"}
      </button>
    `;

    const action = card.querySelector(".lesson-action");
    if (lesson.done) {
      action.disabled = true;
      action.classList.add("is-done");
    } else {
      action.addEventListener("click", () => {
        lessons[index].done = true;
        updateStats();
        renderLessons();
      });
    }

    lessonList.appendChild(card);
  });
}

updateStats();
renderLessons();
