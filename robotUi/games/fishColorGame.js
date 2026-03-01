(function () {
  window.RobotGames = window.RobotGames || {};

  const FISH_COLORS = [
    { name: "Kirmizi", image: "assets/animalsAssets/fishR.png" },
    { name: "Mavi", image: "assets/animalsAssets/fishB.png" },
    { name: "Sari", image: "assets/animalsAssets/fishY.png" },
    { name: "Yesil", image: "assets/animalsAssets/fishG.png" },
    { name: "Pembe", image: "assets/animalsAssets/fishP.png" },
    { name: "Siyah", image: "assets/animalsAssets/fishBla.png" },
    { name: "Beyaz", image: "assets/animalsAssets/fishW.png" },
  ];

  window.RobotGames["fish-color"] = {
    id: "fish-color",
    name: "Balik Renk",
    iconPath: "assets/animalsAssets/fishB.png",
    description: "Renkli baligi sec",
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
        const target = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
        const options = buildOptions(target, FISH_COLORS, 3);

        ctx.instructionText.innerText = round + ". tur: " + target.name + " renkli baligi sec";
        ctx.drawFace("neutral");
        ctx.speak(target.name + " renkli baligi sec");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const grid = document.createElement("div");
        grid.className = "visual-choice-grid fish-choice-grid";
        ctx.gameContent.appendChild(grid);

        options.forEach(function (fish) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "visual-choice-btn";

          const img = document.createElement("img");
          img.className = "visual-choice-image fish-choice-image";
          img.src = fish.image;
          img.alt = fish.name + " balik";
          img.loading = "lazy";
          img.decoding = "async";

          const label = document.createElement("span");
          label.className = "visual-choice-label";
          label.innerText = fish.name;

          btn.appendChild(img);
          btn.appendChild(label);

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (fish.name === target.name) {
              score += 1;
              btn.classList.add("is-correct");
              ctx.drawFace("happy");
              ctx.speak("Dogru secim");
            } else {
              btn.classList.add("is-wrong");
              ctx.drawFace("sad");
              ctx.speak("Tekrar dene");
            }

            setTimeout(function () {
              lock = false;
              nextRound();
            }, 850);
          });

          grid.appendChild(btn);
        });
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage(
            "Kazandin. Puan: " + score + " / " + totalRounds,
            "Balik Renk Oyunu"
          );
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage(
          "Kaybettin. Puan: " + score + " / " + totalRounds,
          "Balik Renk Oyunu"
        );
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
