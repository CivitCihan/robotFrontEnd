(function () {
  window.RobotGames = window.RobotGames || {};

  const SHAPES_3D = [
    { name: "Kup", clue: "6 kare yuz" },
    { name: "Kure", clue: "Top gibi yuvarlak" },
    { name: "Silindir", clue: "Konserve kutusu gibi" },
    { name: "Koni", clue: "Dondurma kulahi gibi" },
    { name: "Prizma", clue: "Uzun kutu gibi" },
    { name: "Piramit", clue: "Misir piramidi gibi" },
  ];

  window.RobotGames["teach-shapes-3d"] = {
    id: "teach-shapes-3d",
    name: "3D Sekiller",
    iconPath: "games/icon-shape.svg",
    description: "Uzay sekillerini ogren",
    accent: "game-accent-c",
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
        const target = SHAPES_3D[Math.floor(Math.random() * SHAPES_3D.length)];
        const options = buildOptions(target, SHAPES_3D, 4);

        ctx.instructionText.innerText = round + ". tur: " + target.name + " sec";
        ctx.drawFace("neutral");
        ctx.speak(target.name + " sec");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const clue = document.createElement("p");
        clue.className = "game-message";
        clue.innerText = "Ipucu: " + target.clue;
        ctx.gameContent.appendChild(clue);

        const row = document.createElement("div");
        row.style.display = "grid";
        row.style.gridTemplateColumns = "repeat(2, minmax(140px, 1fr))";
        row.style.gap = "12px";
        row.style.width = "100%";
        row.style.maxWidth = "520px";
        ctx.gameContent.appendChild(row);

        options.forEach(function (shape) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "140px";
          btn.style.padding = "16px";
          btn.style.fontSize = "22px";
          btn.innerText = shape.name;

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (shape.name === target.name) {
              score += 1;
              ctx.drawFace("happy");
              ctx.speak("Super");
            } else {
              ctx.drawFace("sad");
              ctx.speak("Yanlis");
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
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "3D Sekiller");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "3D Sekiller");
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
