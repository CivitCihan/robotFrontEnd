(function () {
  window.RobotGames = window.RobotGames || {};

  const COLORS = [
    { name: "Kirmizi", value: "#e74c3c" },
    { name: "Mavi", value: "#3498db" },
    { name: "Sari", value: "#f1c40f" },
    { name: "Yesil", value: "#2ecc71" },
  ];

  window.RobotGames["find-color"] = {
    id: "find-color",
    name: "Renk Sec",
    iconPath: "games/icon-find-color.svg",
    description: "Dogru rengi bul",
    accent: "game-accent-a",
    start: function (ctx) {
      const totalRounds = 5;
      const winScore = 3;
      let round = 0;
      let score = 0;
      let lock = false;

      nextRound();

      function nextRound() {
        if (round >= totalRounds) {
          showFinal();
          return;
        }

        round += 1;
        const target = COLORS[Math.floor(Math.random() * COLORS.length)];
        const options = shuffle(COLORS).slice(0, 3);

        if (!options.some((item) => item.name === target.name)) {
          options[0] = target;
        }

        ctx.instructionText.innerText = round + ". tur: " + target.name + " rengi sec";
        ctx.drawFace("neutral");
        ctx.speak(target.name + " rengi sec");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        options.forEach(function (option) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.background = option.value;
          btn.innerText = option.name;

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (option.name === target.name) {
              score += 1;
              ctx.drawFace("happy");
              ctx.speak("Aferin");
            } else {
              ctx.drawFace("sad");
              ctx.speak("Tekrar dene");
            }

            setTimeout(function () {
              lock = false;
              nextRound();
            }, 700);
          });

          ctx.gameContent.appendChild(btn);
        });
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Renk Oyunu");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Renk Oyunu");
      }
    },
  };

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }
})();
