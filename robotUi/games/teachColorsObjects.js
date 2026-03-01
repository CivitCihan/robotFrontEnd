(function () {
  window.RobotGames = window.RobotGames || {};

  const QUESTIONS = [
    { object: "Elma", color: "Kirmizi" },
    { object: "Muz", color: "Sari" },
    { object: "Yaprak", color: "Yesil" },
    { object: "Gokyuzu", color: "Mavi" },
    { object: "Patlican", color: "Mor" },
    { object: "Portakal", color: "Turuncu" },
    { object: "Gece", color: "Siyah" },
    { object: "Pamuk", color: "Beyaz" },
  ];

  const COLOR_OPTIONS = [
    "Kirmizi",
    "Mavi",
    "Sari",
    "Yesil",
    "Turuncu",
    "Mor",
    "Siyah",
    "Beyaz",
  ];

  window.RobotGames["teach-colors-objects"] = {
    id: "teach-colors-objects",
    name: "Nesne Rengi",
    iconPath: "games/icon-find-color.svg",
    description: "Nesnenin rengini bul",
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
        const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        const options = buildOptions(q.color, COLOR_OPTIONS, 4);

        ctx.instructionText.innerText = round + ". tur: " + q.object + " hangi renk?";
        ctx.drawFace("neutral");
        ctx.speak(q.object + " hangi renk");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexWrap = "wrap";
        row.style.gap = "10px";
        ctx.gameContent.appendChild(row);

        options.forEach(function (name) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "130px";
          btn.style.padding = "14px";
          btn.style.fontSize = "20px";
          btn.innerText = name;

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (name === q.color) {
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
            }, 800);
          });

          row.appendChild(btn);
        });
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Nesne Rengi");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Nesne Rengi");
      }
    },
  };

  function buildOptions(target, allItems, optionCount) {
    const pool = allItems.filter(function (item) {
      return item !== target;
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
