(function () {
  window.RobotGames = window.RobotGames || {};

  const SHAPES = [
    { name: "Daire", symbol: "O" },
    { name: "Kare", symbol: "[]" },
    { name: "Ucgen", symbol: "/\\" },
  ];

  window.RobotGames["shape-match"] = {
    id: "shape-match",
    name: "Sekil Bul",
    iconPath: "games/icon-shape.svg",
    description: "Dogru sekli sec",
    accent: "game-accent-d",
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
        const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];

        ctx.instructionText.innerText = round + ". tur: " + target.name + " sekli sec";
        ctx.drawFace("thinking");
        ctx.speak(target.name + " sekli sec");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const choices = shuffle(SHAPES);
        choices.forEach(function (shape) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "130px";
          btn.style.fontSize = "38px";
          btn.innerText = shape.symbol;

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (shape.name === target.name) {
              score += 1;
              ctx.drawFace("happy");
              ctx.speak("Super");
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
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Sekil Oyunu");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Sekil Oyunu");
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
