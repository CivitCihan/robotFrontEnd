(function () {
  window.RobotGames = window.RobotGames || {};

  const COLORS = [
    { name: "Kirmizi", value: "#e74c3c" },
    { name: "Mavi", value: "#3498db" },
    { name: "Sari", value: "#f1c40f" },
    { name: "Yesil", value: "#2ecc71" },
    { name: "Turuncu", value: "#f39c12" },
    { name: "Mor", value: "#8e44ad" },
    { name: "Pembe", value: "#ff6fae" },
    { name: "Siyah", value: "#2d3436" },
  ];

  window.RobotGames["teach-colors-name"] = {
    id: "teach-colors-name",
    name: "Renk Ismi",
    iconPath: "games/icon-find-color.svg",
    description: "Renkle ismini eslestir",
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
        const target = COLORS[Math.floor(Math.random() * COLORS.length)];
        const options = buildOptions(target, COLORS, 4);

        ctx.instructionText.innerText = round + ". tur: Bu rengin adi ne?";
        ctx.drawFace("thinking");
        ctx.speak("Bu rengin adi ne");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const colorCard = document.createElement("div");
        colorCard.style.width = "150px";
        colorCard.style.height = "150px";
        colorCard.style.borderRadius = "20px";
        colorCard.style.border = "3px solid #ffffff";
        colorCard.style.boxShadow = "0 10px 24px -16px rgba(0,0,0,0.35)";
        colorCard.style.background = target.value;
        colorCard.style.margin = "8px 0 16px";
        ctx.gameContent.appendChild(colorCard);

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexWrap = "wrap";
        row.style.gap = "10px";
        ctx.gameContent.appendChild(row);

        options.forEach(function (option) {
          const btn = document.createElement("button");
          btn.className = "game-button";
          btn.type = "button";
          btn.style.minWidth = "130px";
          btn.style.padding = "14px";
          btn.style.fontSize = "20px";
          btn.innerText = option.name;

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (option.name === target.name) {
              score += 1;
              ctx.drawFace("happy");
              ctx.speak("Dogru cevap");
            } else {
              ctx.drawFace("sad");
              ctx.speak("Yanlis cevap");
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
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Renk Ismi");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Renk Ismi");
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
