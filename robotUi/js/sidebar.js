(function () {
  var THEME_KEY = "robot-theme";

  function getStoredTheme() {
    var savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    return "light";
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }

  function setTheme(theme, controlsRoot) {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
    syncThemeControls(controlsRoot, theme);
  }

  function syncThemeControls(controlsRoot, theme) {
    if (!controlsRoot) return;
    var toggle = controlsRoot.querySelector(".theme-toggle");
    if (!toggle) return;
    var isDark = theme === "dark";
    toggle.classList.toggle("is-dark", isDark);
    toggle.setAttribute("aria-checked", isDark ? "true" : "false");
    toggle.setAttribute("aria-label", isDark ? "Koyu mod acik" : "Aydinlik mod acik");
    var icon = toggle.querySelector(".theme-icon");
    if (icon) {
      icon.textContent = isDark ? "☾" : "☀";
    }
  }

  function buildThemeControls() {
    var currentTheme = getStoredTheme();
    var wrap = document.createElement("div");
    wrap.className = "theme-switch";
    wrap.setAttribute("aria-label", "Tema anahtari");

    var toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.setAttribute("role", "switch");

    var thumb = document.createElement("span");
    thumb.className = "theme-toggle-thumb";
    thumb.innerHTML = '<span class="theme-icon" aria-hidden="true">☀</span>';
    toggle.appendChild(thumb);

    toggle.addEventListener("click", function () {
      var current = getStoredTheme();
      var nextTheme = current === "dark" ? "light" : "dark";
      setTheme(nextTheme, wrap);
    });

    wrap.appendChild(toggle);
    syncThemeControls(wrap, currentTheme);
    return wrap;
  }

  function getPageName() {
    var path = window.location.pathname || "";
    var file = path.split("/").pop();
    return file || "index.html";
  }

  function buildSidebar() {
    var pageName = getPageName();
    var items = [
      { href: "index.html", label: "Ana Sayfa", icon: "&#127968;" },
      { href: "game.html", label: "Oyun", icon: "&#127918;" },
      { href: "friends.html", label: "Arkadaslar", icon: "&#128101;" },
      { href: "education.html", label: "Egitim", icon: "&#127891;" },
      { href: "settings.html", label: "Ayarlar", icon: "&#9881;" },
    ];

    var sidebar = document.createElement("nav");
    sidebar.className = "app-sidebar gallery-sidebar";
    sidebar.setAttribute("aria-label", "Sol menu");

    var list = document.createElement("div");
    list.className = "sidebar-list";

    items.forEach(function (item) {
      var link = document.createElement("a");
      var isActive = pageName === item.href;

      link.href = item.href;
      link.className = "main-btn icon-btn gallery-btn";
      link.setAttribute("aria-label", item.label);
      link.title = item.label;
      link.innerHTML = [
        '<span class="btn-icon" aria-hidden="true">' + item.icon + "</span>",
      ].join("");

      if (isActive) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }

      list.appendChild(link);
    });

    sidebar.appendChild(list);
    sidebar.appendChild(buildThemeControls());
    return sidebar;
  }

  function ensureSidebar() {
    var body = document.body;
    if (!body || !body.classList.contains("has-sidebar")) {
      return;
    }

    if (!document.querySelector(".app-sidebar")) {
      var sidebar = buildSidebar();
      body.insertBefore(sidebar, body.firstChild);
    }
  }

  function setupLongPressLabels() {
    var sidebarButtons = document.querySelectorAll(".gallery-btn");

    sidebarButtons.forEach(function (button) {
      var holdTimer = null;
      var hideTimer = null;
      var holdTriggered = false;

      function clearHoldTimer() {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      }

      function hideLabel() {
        button.classList.remove("show-label");
      }

      button.addEventListener("pointerdown", function () {
        holdTriggered = false;
        clearHoldTimer();

        holdTimer = setTimeout(function () {
          holdTriggered = true;
          button.classList.add("show-label");

          if (hideTimer) {
            clearTimeout(hideTimer);
          }

          hideTimer = setTimeout(hideLabel, 1400);
        }, 1000);
      });

      button.addEventListener("pointerup", clearHoldTimer);
      button.addEventListener("pointerleave", clearHoldTimer);
      button.addEventListener("pointercancel", clearHoldTimer);

      button.addEventListener("click", function (event) {
        if (holdTriggered) {
          event.preventDefault();
          holdTriggered = false;
        }
      });
    });
  }

  applyTheme(getStoredTheme());
  ensureSidebar();
  setupLongPressLabels();
})();
