(function () {
  window.RobotGames = window.RobotGames || {};

  const SHAPE_FAMILY = [
    { item: "Kare", group: "2D" },
    { item: "Daire", group: "2D" },
    { item: "Ucgen", group: "2D" },
    { item: "Kup", group: "3D" },
    { item: "Kure", group: "3D" },
    { item: "Silindir", group: "3D" },
  ];

  window.RobotGames["shape-family"] = {
    id: "shape-family",
    name: "2D mi 3D mi",
    iconPath: "games/icon-shape.svg",
    description: "Sekli siniflandir",
    accent: "game-accent-d",
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
        const target = SHAPE_FAMILY[Math.floor(Math.random() * SHAPE_FAMILY.length)];

        ctx.instructionText.innerText = round + ". tur: " + target.item + " 2D mi 3D mi?";
        ctx.drawFace("thinking");
        ctx.speak(target.item + " 2D mi 3D mi");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "12px";
        row.style.flexWrap = "wrap";
        ctx.gameContent.appendChild(row);

        ["2D", "3D"].forEach(function (group) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "150px";
          btn.style.fontSize = "30px";
          btn.innerText = group;

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (group === target.group) {
              score += 1;
              ctx.drawFace("happy");
              ctx.speak("Dogru");
            } else {
              ctx.drawFace("sad");
              ctx.speak("Yanlis");
            }

            setTimeout(function () {
              lock = false;
              nextRound();
            }, 750);
          });

          row.appendChild(btn);
        });
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Sekil Ailesi");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Sekil Ailesi");
      }
    },
  };
})();
