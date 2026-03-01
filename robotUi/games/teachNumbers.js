(function () {
  window.RobotGames = window.RobotGames || {};

  window.RobotGames["teach-numbers"] = {
    id: "teach-numbers",
    name: "Sayi Ogren",
    iconPath: "games/icon-counting.svg",
    description: "Dogru sayiyi bul",
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
          showFinal();
          return;
        }

        round += 1;
        const target = randomInt(1, 10);
        const options = buildOptions(target, 4, 1, 10);

        ctx.instructionText.innerText = round + ". tur: " + target + " sayisini sec";
        ctx.drawFace("neutral");
        ctx.speak(target + " sayisini sec");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexWrap = "wrap";
        row.style.gap = "12px";
        ctx.gameContent.appendChild(row);

        options.forEach(function (n) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "96px";
          btn.style.padding = "16px";
          btn.style.fontSize = "30px";
          btn.innerText = String(n);

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (n === target) {
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
            }, 750);
          });

          row.appendChild(btn);
        });
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Sayi Oyunu");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Sayi Oyunu");
      }
    },
  };

  function buildOptions(target, count, min, max) {
    const set = new Set([target]);
    while (set.size < count) {
      set.add(randomInt(min, max + 1));
    }
    return shuffle(Array.from(set));
  }

  function randomInt(min, maxExclusive) {
    return min + Math.floor(Math.random() * (maxExclusive - min));
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
