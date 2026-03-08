(function () {
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
      { href: "lesson.html", label: "Dersler", icon: "&#127891;" },
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

  ensureSidebar();
  setupLongPressLabels();
})();
