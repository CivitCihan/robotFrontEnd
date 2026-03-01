(function () {
  window.RobotGames = window.RobotGames || {};

  window.RobotGames["number-order"] = {
    id: "number-order",
    name: "Sayi Sirala",
    iconPath: "games/icon-counting.svg",
    description: "Kucukten buyuge tikla",
    accent: "game-accent-b",
    start: function (ctx) {
      const totalRounds = 4;
      const winScore = 3;
      let round = 0;
      let score = 0;

      nextRound();

      function nextRound() {
        if (round >= totalRounds) {
          showFinal();
          return;
        }

        round += 1;
        const base = randomInt(1, 6);
        const numbers = [base, base + 1, base + 2, base + 3];
        const shuffled = shuffle(numbers);
        let expectedIndex = 0;
        let locked = false;

        ctx.instructionText.innerText = round + ". tur: Sayilari kucukten buyuge tikla";
        ctx.drawFace("thinking");
        ctx.speak("Sayilari kucukten buyuge tikla");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexWrap = "wrap";
        row.style.gap = "12px";
        ctx.gameContent.appendChild(row);

        shuffled.forEach(function (n) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "96px";
          btn.style.padding = "16px";
          btn.style.fontSize = "30px";
          btn.innerText = String(n);

          btn.addEventListener("click", function () {
            if (locked) return;

            const expected = numbers[expectedIndex];
            if (n === expected) {
              btn.disabled = true;
              btn.style.opacity = "0.6";
              expectedIndex += 1;
              ctx.drawFace("happy");

              if (expectedIndex === numbers.length) {
                score += 1;
                locked = true;
                ctx.speak("Super, dogru siraladin");
                setTimeout(nextRound, 850);
              }
            } else {
              locked = true;
              ctx.drawFace("sad");
              ctx.speak("Sirayi karistirdin");
              setTimeout(nextRound, 850);
            }
          });

          row.appendChild(btn);
        });
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Siralama Oyunu");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Siralama Oyunu");
      }
    },
  };

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
