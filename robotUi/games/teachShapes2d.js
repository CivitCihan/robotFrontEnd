(function () {
  window.RobotGames = window.RobotGames || {};

  const SHAPES_2D = [
    { name: "Daire", hint: "Yuvarlak sekil" },
    { name: "Kare", hint: "4 esit kenar" },
    { name: "Dikdortgen", hint: "Uzun kare gibi" },
    { name: "Ucgen", hint: "3 kenarli" },
    { name: "Besgen", hint: "5 kenarli" },
    { name: "Altigen", hint: "6 kenarli" },
  ];

  window.RobotGames["teach-shapes-2d"] = {
    id: "teach-shapes-2d",
    name: "2D Sekiller",
    iconPath: "games/icon-shape.svg",
    description: "Duz sekilleri ogren",
    accent: "game-accent-a",
    start: function (ctx) {
      const totalRounds = 6;
      const winScore = 4;
      let round = 0;
      let score = 0;
      let lock = false;

      nextRound();

      function nextRound() {
        if (round >= totalRounds) {
          return showFinal();
        }

        round += 1;
        const target = SHAPES_2D[Math.floor(Math.random() * SHAPES_2D.length)];
        const options = buildOptions(target, SHAPES_2D, 4);

        ctx.instructionText.innerText = round + ". tur: " + target.name + " sekli sec";
        ctx.drawFace("thinking");
        ctx.speak(target.name + " sekli sec");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const hint = document.createElement("p");
        hint.className = "game-message";
        hint.innerText = "Ipucu: " + target.hint;
        ctx.gameContent.appendChild(hint);

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexWrap = "wrap";
        row.style.gap = "12px";
        ctx.gameContent.appendChild(row);

        options.forEach(function (shape) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "150px";
          btn.style.padding = "16px";
          btn.style.fontSize = "22px";
          btn.innerText = shape.name;

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (shape.name === target.name) {
              score += 1;
              ctx.drawFace("happy");
              ctx.speak("Dogru");
            } else {
              ctx.drawFace("sad");
              ctx.speak("Tekrar dene");
            }

            setTimeout(function () {
              lock = false;
              nextRound();
            }, 800);
          });

          row.appendChild(btn);
        });
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "2D Sekiller");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "2D Sekiller");
      }
    },
  };

  function buildOptions(target, allItems, optionCount) {
    const pool = allItems.filter(function (item) {
      return item.name !== target.name;
    });
    const picked = shuffle(pool).slice(0, Math.max(0, optionCount - 1));
    picked.push(target);
    return shuffle(picked);
  }

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
