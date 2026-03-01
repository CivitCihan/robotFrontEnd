(function () {
  window.RobotGames = window.RobotGames || {};

  window.RobotGames["counting"] = {
    id: "counting",
    name: "Sayma Oyunu",
    iconPath: "games/icon-counting.svg",
    description: "Dogru sayiyi sec",
    accent: "game-accent-c",
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
        const target = randomInt(1, 10);

        ctx.instructionText.innerText = round + ". tur: Kac tane nokta var?";
        ctx.drawFace("neutral");
        ctx.speak("Kac tane nokta var?");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const dots = document.createElement("div");
        dots.style.display = "grid";
        dots.style.gridTemplateColumns = "repeat(3, 26px)";
        dots.style.gap = "10px";
        dots.style.margin = "8px 0 16px";

        for (let i = 0; i < target; i += 1) {
          const dot = document.createElement("span");
          dot.style.width = "26px";
          dot.style.height = "26px";
          dot.style.borderRadius = "50%";
          dot.style.background = "#0ac4e0";
          dots.appendChild(dot);
        }
        ctx.gameContent.appendChild(dots);

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexWrap = "wrap";
        row.style.gap = "12px";
        ctx.gameContent.appendChild(row);

        for (let n = 1; n <= 10; n += 1) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "90px";
          btn.style.padding = "18px";
          btn.style.fontSize = "24px";
          btn.innerText = String(n);

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (n === target) {
              score += 1;
              ctx.drawFace("happy");
              ctx.speak("Dogru saydin");
            } else {
              ctx.drawFace("sad");
              ctx.speak("Bir daha dene");
            }

            setTimeout(function () {
              lock = false;
              nextRound();
            }, 700);
          });
          row.appendChild(btn);
        }
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Sayma Oyunu");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Sayma Oyunu");
      }
    },
  };

  function randomInt(min, maxExclusive) {
    return min + Math.floor(Math.random() * (maxExclusive - min));
  }
})();
