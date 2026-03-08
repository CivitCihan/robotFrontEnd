(function () {
  var STORAGE_KEY = "robot-learning-progress-v1";

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { lessons: {} };
      }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return { lessons: {} };
      }
      if (!parsed.lessons || typeof parsed.lessons !== "object") {
        parsed.lessons = {};
      }
      return parsed;
    } catch (error) {
      return { lessons: {} };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getLessonProgress(lessonTitle) {
    var lessonKey = slugify(lessonTitle);
    var state = loadState();
    return state.lessons[lessonKey] || null;
  }

  function setLessonProgress(lessonTitle, patch) {
    var lessonKey = slugify(lessonTitle);
    var state = loadState();
    var current = state.lessons[lessonKey] || { title: lessonTitle };
    var next = Object.assign({}, current, patch || {});

    next.title = lessonTitle;
    if (next.completed) {
      next.completedAt = next.completedAt || new Date().toISOString();
    }
    next.updatedAt = new Date().toISOString();

    state.lessons[lessonKey] = next;
    saveState(state);
    return next;
  }

  function isLessonCompleted(lessonTitle) {
    var record = getLessonProgress(lessonTitle);
    return Boolean(record && record.completed);
  }

  function ensureDefaults(lessons) {
    if (!Array.isArray(lessons) || lessons.length === 0) {
      return;
    }

    var state = loadState();
    var changed = false;

    lessons.forEach(function (lesson) {
      if (!lesson || !lesson.title || !lesson.done) {
        return;
      }
      var key = slugify(lesson.title);
      if (state.lessons[key]) {
        return;
      }
      state.lessons[key] = {
        title: lesson.title,
        completed: true,
        completedSteps: 1,
        totalSteps: 1,
        score: lesson.score || 0,
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      changed = true;
    });

    if (changed) {
      saveState(state);
    }
  }

  function listCompletedLessonTitles() {
    var state = loadState();
    return Object.keys(state.lessons)
      .map(function (key) { return state.lessons[key]; })
      .filter(function (item) { return item && item.completed && item.title; })
      .map(function (item) { return item.title; });
  }

  window.LearningProgress = {
    getLessonKey: slugify,
    getLessonProgress: getLessonProgress,
    setLessonProgress: setLessonProgress,
    isLessonCompleted: isLessonCompleted,
    ensureDefaults: ensureDefaults,
    listCompletedLessonTitles: listCompletedLessonTitles,
  };
})();
