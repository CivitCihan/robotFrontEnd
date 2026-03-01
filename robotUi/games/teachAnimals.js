(function () {
  window.RobotGames = window.RobotGames || {};

  const ANIMALS = [
    { name: "Kedi", image: "assets/animalsAssets/cat.png" },
    { name: "Kopek", image: "assets/animalsAssets/dog.png" },
    { name: "Aslan", image: "assets/animalsAssets/lion.png" },
    { name: "Fil", image: "assets/animalsAssets/elephant.png" },
    { name: "At", image: "assets/animalsAssets/horse.png" },
    { name: "Penguen", image: "assets/animalsAssets/penguin.png" },
    { name: "Kus", image: "assets/animalsAssets/parrot.png" },
    { name: "Ayicik", image: "assets/animalsAssets/bear.png" },
    { name: "Kartal", image: "assets/animalsAssets/eagle.png" },
    { name: "Balik", image: "assets/animalsAssets/fishB.png" },
  ];

  window.RobotGames["teach-animals"] = {
    id: "teach-animals",
    name: "Hayvan Ogren",
    iconPath: "assets/animalsAssets/cat.png",
    description: "Hayvani bul ve ogren",
    accent: "game-accent-a",
    start: function (ctx) {
      const totalRounds = 6;
      const winScore = 4;
      const rounds = shuffle(ANIMALS).slice(0, totalRounds);
      let roundIndex = 0;
      let score = 0;
      let lock = false;

      renderRound();

      function renderRound() {
        if (roundIndex >= rounds.length) {
          showFinal();
          return;
        }

        const target = rounds[roundIndex];
        const options = buildOptions(target, ANIMALS, 4);

        ctx.instructionText.innerText =
          roundIndex + 1 + ". tur: " + target.name + " hayvanini bul";
        ctx.drawFace("thinking");
        ctx.speak(target.name + " hayvanini bul");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const grid = document.createElement("div");
        grid.className = "visual-choice-grid";
        ctx.gameContent.appendChild(grid);

        options.forEach(function (animal) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "visual-choice-btn";

          const img = document.createElement("img");
          img.className = "visual-choice-image";
          img.src = animal.image;
          img.alt = animal.name;
          img.loading = "lazy";
          img.decoding = "async";

          const label = document.createElement("span");
          label.className = "visual-choice-label";
          label.innerText = animal.name;

          btn.appendChild(img);
          btn.appendChild(label);

          btn.addEventListener("click", function () {
            if (lock) return;
            lock = true;

            if (animal.name === target.name) {
              score += 1;
              btn.classList.add("is-correct");
              ctx.drawFace("happy");
              ctx.speak("Aferin. Bu bir " + target.name);
            } else {
              ctx.drawFace("sad");
              ctx.speak("Tekrar dene");
              btn.classList.add("is-wrong");
            }

            setTimeout(function () {
              roundIndex += 1;
              lock = false;
              renderRound();
            }, 900);
          });

          grid.appendChild(btn);
        });
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage(
            "Kazandin. Puan: " + score + " / " + totalRounds,
            "Hayvan Oyunu"
          );
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage(
          "Kaybettin. Puan: " + score + " / " + totalRounds,
          "Hayvan Oyunu"
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
