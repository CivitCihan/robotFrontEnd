const lessonTitleEl = document.getElementById("lessonTitle");
const lessonSubtitleEl = document.getElementById("lessonSubtitle");
const lessonLevelEl = document.getElementById("lessonLevel");
const lessonProgressTextEl = document.getElementById("lessonProgressText");
const lessonProgressFillEl = document.getElementById("lessonProgressFill");
const lessonTrackEl = document.getElementById("lessonTrack");
const lessonPickerEl = document.getElementById("lessonPicker");
const stepTitleEl = document.getElementById("stepTitle");
const stepPromptEl = document.getElementById("stepPrompt");
const stepInteractionEl = document.getElementById("stepInteraction");
const stepFeedbackEl = document.getElementById("stepFeedback");
const stepActionButtonEl = document.getElementById("stepActionButton");

const LESSON_LIBRARY = {
  "sayi-tanima": {
    title: "Sayi Tanima",
    level: "Baslangic",
    score: 20,
    subtitle: "Rakam ve miktar iliskisi kur.",
    steps: [
      { name: "Isinma", type: "info", prompt: "Bugun 1, 2 ve 3 sayilarini taniyacagiz. Hazirsan devam et." },
      { name: "Secmeli Soru", type: "choice", prompt: "Hangi secenekte 2 rakami var?", options: ["1", "2", "3"], answer: "2" },
      { name: "Yazma", type: "text", prompt: "Bes sayisini rakamla yaz.", answer: "5" },
      { name: "Pekistirme", type: "choice", prompt: "3 elmali resim hangi sayiya karsilik gelir?", options: ["2", "3", "4"], answer: "3" },
    ],
  },
  "renkleri-eslestir": {
    title: "Renkleri Eslestir",
    level: "Baslangic",
    score: 15,
    subtitle: "Nesne ve renk baglantisini kur.",
    steps: [
      { name: "Isinma", type: "info", prompt: "Kirmizi, mavi ve sari renklerini gozden geciriyoruz." },
      { name: "Secmeli Soru", type: "choice", prompt: "Gokyuzu genelde hangi renktir?", options: ["Mavi", "Kirmizi", "Yesil"], answer: "Mavi" },
      { name: "Yazma", type: "text", prompt: "Muzun rengi nedir?", answer: "Sari" },
      { name: "Pekistirme", type: "choice", prompt: "Domates icin en uygun renk hangisi?", options: ["Kirmizi", "Mavi", "Mor"], answer: "Kirmizi" },
    ],
  },
  "hayvan-sesleri": {
    title: "Hayvan Sesleri",
    level: "Orta",
    score: 25,
    subtitle: "Hayvan ve ses iliskisini ogren.",
    steps: [
      { name: "Isinma", type: "info", prompt: "Bazi hayvanlarin cikardigi sesleri birlikte taniyoruz." },
      { name: "Secmeli Soru", type: "choice", prompt: "Miyav sesi hangi hayvana ait?", options: ["Kedi", "Kopek", "Kus"], answer: "Kedi" },
      { name: "Yazma", type: "text", prompt: "Hav hav sesi cikaran hayvani yaz.", answer: "Kopek" },
      { name: "Pekistirme", type: "choice", prompt: "Moo sesi en cok hangisine aittir?", options: ["Inek", "Koyun", "Tavuk"], answer: "Inek" },
    ],
  },
  "sekil-ailesi": {
    title: "Sekil Ailesi",
    level: "Orta",
    score: 30,
    subtitle: "Temel sekiller arasindaki farklari pekistir.",
    steps: [
      { name: "Isinma", type: "info", prompt: "Kare, ucgen ve daire sekillerini hatirliyoruz." },
      { name: "Secmeli Soru", type: "choice", prompt: "Uc kenari olan sekil hangisi?", options: ["Kare", "Ucgen", "Daire"], answer: "Ucgen" },
      { name: "Yazma", type: "text", prompt: "Kosesi olmayan sekli yaz.", answer: "Daire" },
      { name: "Pekistirme", type: "choice", prompt: "4 esit kenari olan sekil hangisi?", options: ["Ucgen", "Dikdortgen", "Kare"], answer: "Kare" },
    ],
  },
  "hafiza-kartlari": {
    title: "Hafiza Kartlari",
    level: "Ileri",
    score: 35,
    subtitle: "Dikkat ve kisa sureli hafizayi guclendir.",
    steps: [
      { name: "Isinma", type: "info", prompt: "Es kartlari bulmak icin dikkati topluyoruz." },
      { name: "Secmeli Soru", type: "choice", prompt: "Hafiza oyununda en onemli beceri hangisi?", options: ["Dikkat", "Hiz", "Sans"], answer: "Dikkat" },
      { name: "Yazma", type: "text", prompt: "Kisa sureli hafiza icin tek kelime yaz.", answer: "Hafiza" },
      { name: "Pekistirme", type: "choice", prompt: "Ayni iki kart bulunca ne olur?", options: ["Eslesme", "Kayip", "Durma"], answer: "Eslesme" },
    ],
  },
  "sayi-siralama": {
    title: "Sayi Siralama",
    level: "Ileri",
    score: 40,
    subtitle: "Sayilari dogru siraya diz.",
    steps: [
      { name: "Isinma", type: "info", prompt: "Kucukten buyuge siralama yapacagiz." },
      { name: "Secmeli Soru", type: "choice", prompt: "Hangi sira dogru?", options: ["1-2-3", "3-2-1", "2-1-3"], answer: "1-2-3" },
      { name: "Yazma", type: "text", prompt: "7'den sonra gelen sayiyi yaz.", answer: "8" },
      { name: "Pekistirme", type: "choice", prompt: "En buyuk sayi hangisi?", options: ["6", "9", "4"], answer: "9" },
    ],
  },
};

const lessonKeys = Object.keys(LESSON_LIBRARY);
const searchParams = new URLSearchParams(window.location.search);
const requestedLessonKey = window.LearningProgress
  ? window.LearningProgress.getLessonKey(searchParams.get("lesson") || "")
  : "";
const currentLessonKey = lessonKeys.includes(requestedLessonKey) ? requestedLessonKey : lessonKeys[0];
const lessonData = LESSON_LIBRARY[currentLessonKey];
const totalSteps = lessonData.steps.length;

const storedProgress = window.LearningProgress
  ? window.LearningProgress.getLessonProgress(lessonData.title)
  : null;

let completedSteps = Math.min(
  storedProgress && storedProgress.completed ? totalSteps : (storedProgress && storedProgress.completedSteps) || 0,
  totalSteps
);
let selectedStepIndex = Math.min(completedSteps, totalSteps - 1);
let selectedChoice = "";

function saveLessonProgress() {
  if (!window.LearningProgress) {
    return;
  }

  window.LearningProgress.setLessonProgress(lessonData.title, {
    completed: completedSteps >= totalSteps,
    completedSteps: completedSteps,
    totalSteps: totalSteps,
    level: lessonData.level,
    score: lessonData.score,
  });
}

function getStepState(index) {
  if (index < completedSteps) return "done";
  if (index === completedSteps && completedSteps < totalSteps) return "current";
  return "locked";
}

function setStepFeedback(message, type) {
  stepFeedbackEl.textContent = message || "";
  stepFeedbackEl.className = "lesson-step-feedback";
  if (type) {
    stepFeedbackEl.classList.add("is-" + type);
  }
}

function renderLessonPicker() {
  lessonPickerEl.innerHTML = "";

  lessonKeys.forEach((lessonKey) => {
    const item = LESSON_LIBRARY[lessonKey];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "main-btn lesson-picker-btn";
    button.textContent = item.title;
    if (lessonKey === currentLessonKey) {
      button.classList.add("is-active");
      button.disabled = true;
    } else {
      button.addEventListener("click", function () {
        const params = new URLSearchParams({ lesson: item.title });
        window.location.href = "lesson.html?" + params.toString();
      });
    }
    lessonPickerEl.appendChild(button);
  });
}

function updateHeader() {
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  lessonTitleEl.textContent = lessonData.title;
  lessonSubtitleEl.textContent = lessonData.subtitle;
  lessonLevelEl.textContent = lessonData.level;
  lessonProgressTextEl.textContent = completedSteps + "/" + totalSteps + " tamamlandi";
  lessonProgressFillEl.style.width = progressPercent + "%";
  lessonProgressFillEl.parentElement.setAttribute("aria-valuenow", String(progressPercent));
}

function renderTrack() {
  lessonTrackEl.innerHTML = "";

  lessonData.steps.forEach((step, index) => {
    const state = getStepState(index);
    const node = document.createElement("article");
    node.className = "lesson-node is-" + state;

    const nodeButton = document.createElement("button");
    nodeButton.type = "button";
    nodeButton.className = "lesson-node-select";
    nodeButton.innerHTML = [
      '<div class="lesson-node-circle" aria-hidden="true">' + (state === "done" ? "OK" : String(index + 1)) + "</div>",
      "<h3>" + step.name + "</h3>",
      '<p class="lesson-node-meta">Adim ' + (index + 1) + "</p>",
    ].join("");

    if (state === "locked") {
      nodeButton.disabled = true;
    } else {
      nodeButton.addEventListener("click", function () {
        selectedStepIndex = index;
        setStepFeedback("", "");
        renderTrack();
        renderContent();
      });
    }

    if (index === selectedStepIndex) {
      node.classList.add("is-selected");
    }

    node.appendChild(nodeButton);
    lessonTrackEl.appendChild(node);
  });
}

function renderChoiceOptions(step) {
  selectedChoice = "";
  stepInteractionEl.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "lesson-choice-list";

  step.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-choice-btn";
    button.textContent = option;
    button.addEventListener("click", function () {
      selectedChoice = option;
      Array.from(wrap.children).forEach((child) => child.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
    wrap.appendChild(button);
  });

  stepInteractionEl.appendChild(wrap);
}

function renderTextInput() {
  stepInteractionEl.innerHTML = "";
  const input = document.createElement("input");
  input.type = "text";
  input.id = "lessonTextAnswer";
  input.className = "lesson-text-input";
  input.placeholder = "Cevabini yaz";
  stepInteractionEl.appendChild(input);
}

function renderContent() {
  const step = lessonData.steps[selectedStepIndex];
  const state = getStepState(selectedStepIndex);

  stepTitleEl.textContent = step.name;
  stepPromptEl.textContent = step.prompt;
  setStepFeedback("", "");

  if (state === "locked") {
    stepInteractionEl.innerHTML = '<p class="lesson-lock-note">Bu adim kilitli. Onceki adimi tamamla.</p>';
    stepActionButtonEl.disabled = true;
    stepActionButtonEl.textContent = "Kilitli";
    return;
  }

  if (state === "done") {
    stepInteractionEl.innerHTML = '<p class="lesson-done-note">Bu adim tamamlandi.</p>';
    stepActionButtonEl.disabled = true;
    stepActionButtonEl.textContent = "Tamamlandi";
    return;
  }

  if (step.type === "choice") {
    renderChoiceOptions(step);
  } else if (step.type === "text") {
    renderTextInput();
  } else {
    stepInteractionEl.innerHTML = '<p class="lesson-info-note">Metni okuduysan adimi tamamla.</p>';
  }

  stepActionButtonEl.disabled = false;
  stepActionButtonEl.textContent = "Cevabi Kontrol Et";
}

function isAnswerCorrect(step) {
  if (step.type === "info") {
    return true;
  }

  if (step.type === "choice") {
    return selectedChoice === step.answer;
  }

  const textInput = document.getElementById("lessonTextAnswer");
  const given = textInput ? textInput.value.trim().toLowerCase() : "";
  const expected = String(step.answer || "").trim().toLowerCase();
  return given === expected;
}

function completeCurrentStepIfCorrect() {
  const state = getStepState(selectedStepIndex);
  if (state !== "current") {
    return;
  }

  const step = lessonData.steps[selectedStepIndex];
  const correct = isAnswerCorrect(step);

  if (!correct) {
    setStepFeedback("Dogru degil. Tekrar dene.", "error");
    return;
  }

  completedSteps += 1;
  saveLessonProgress();
  setStepFeedback("Harika. Adim tamamlandi.", "success");

  if (completedSteps >= totalSteps) {
    selectedStepIndex = totalSteps - 1;
    setStepFeedback("Ders tamamlandi. Artik ilgili oyunlar acik.", "success");
  } else {
    selectedStepIndex = completedSteps;
  }

  updateHeader();
  renderTrack();
  renderContent();
}

stepActionButtonEl.addEventListener("click", completeCurrentStepIfCorrect);

renderLessonPicker();
updateHeader();
renderTrack();
renderContent();
