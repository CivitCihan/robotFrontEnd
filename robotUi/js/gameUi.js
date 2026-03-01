const instructionText = document.getElementById("instructionText");
const gameContent = document.getElementById("gameContent");

if (!instructionText || !gameContent) {
  console.error("Game UI elements not found.");
} else {
  const gameIds = [
    "find-color",
    "memory-cards",
    "counting",
    "shape-match",
    "teach-animals",
    "fish-color",
    "teach-numbers",
    "number-order",
    "teach-shapes-2d",
    "teach-shapes-3d",
    "shape-family",
    "teach-colors-name",
    "teach-colors-objects",
  ];
  const registry = window.RobotGames || {};
  const games = gameIds
    .map((id) => registry[id])
    .filter(Boolean);

  renderGameList();

  function renderGameList() {
    instructionText.innerText = "Oyunlar";
    gameContent.innerHTML = "";
    gameContent.className = "game-list";
    safeDrawFace("idle");
    speak("Hangi oyunu oynamak istersin?");

    games.forEach((game) => {
      const card = document.createElement("button");
      card.className = `main-btn game-card ${game.accent || ""}`;
      card.type = "button";
      card.setAttribute("aria-label", game.name);

      const dot = document.createElement("span");
      dot.className = "game-card-dot";
      dot.setAttribute("aria-hidden", "true");

      const icon = document.createElement("span");
      icon.className = "game-card-icon";
      icon.setAttribute("aria-hidden", "true");

      const iconImage = document.createElement("img");
      iconImage.className = "game-card-icon-image";
      iconImage.src = game.iconPath;
      iconImage.alt = "";
      iconImage.loading = "lazy";
      iconImage.decoding = "async";
      iconImage.addEventListener("error", function () {
        iconImage.style.display = "none";
      });
      icon.appendChild(iconImage);

      const name = document.createElement("span");
      name.className = "game-card-name";
      name.textContent = game.name;

      const desc = document.createElement("span");
      desc.className = "game-card-desc";
      desc.textContent = game.description;

      card.appendChild(dot);
      card.appendChild(icon);
      card.appendChild(name);
      card.appendChild(desc);

      card.addEventListener("click", function () {
        launchGame(game);
      });

      gameContent.appendChild(card);
    });
  }

  function launchGame(game) {
    if (!game || typeof game.start !== "function") {
      showMessage("Oyun baslatilamadi.");
      return;
    }

    game.start({
      instructionText,
      gameContent,
      speak,
      drawFace: safeDrawFace,
      backToList: renderGameList,
      createBackButton,
      showMessage,
    });
  }

  function createBackButton() {
    const backButton = document.createElement("button");
    backButton.className = "back-btn";
    backButton.type = "button";
    backButton.innerText = "Oyunlara Don";
    backButton.addEventListener("click", renderGameList);
    return backButton;
  }

  function showMessage(message, title) {
    instructionText.innerText = title || "Bilgi";
    gameContent.className = "";
    gameContent.innerHTML = "";
    gameContent.appendChild(createBackButton());

    const p = document.createElement("p");
    p.className = "game-message";
    p.innerText = message;
    gameContent.appendChild(p);
  }

  function safeDrawFace(state) {
    if (typeof window.drawFace === "function") {
      window.drawFace(state);
    }
  }
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

