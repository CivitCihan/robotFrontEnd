(function () {
  window.RobotGames = window.RobotGames || {};

  window.RobotGames["memory-cards"] = {
    id: "memory-cards",
    name: "Kart Eslestir",
    iconPath: "games/icon-memory.svg",
    description: "Ayni kartlari bul",
    accent: "game-accent-b",
    start: function (ctx) {
      const totalRounds = 3;
      const winScore = 2;
      let round = 0;
      let score = 0;

      nextRound();

      function nextRound() {
        if (round >= totalRounds) {
          showFinal();
          return;
        }

        round += 1;

        const symbols = ["A", "B", "C"];
        const deck = shuffle(symbols.concat(symbols));
        let openIndexes = [];
        let solvedCount = 0;
        let wrongCount = 0;
        let lock = false;
        const maxWrong = 4;

        ctx.instructionText.innerText = round + ". tur: Kartlari eslestir";
        ctx.drawFace("thinking");
        ctx.speak("Kartlari eslestir");

        ctx.gameContent.innerHTML = "";
        ctx.gameContent.className = "";
        ctx.gameContent.appendChild(ctx.createBackButton());

        const board = document.createElement("div");
        board.style.display = "grid";
        board.style.gridTemplateColumns = "repeat(3, minmax(80px, 1fr))";
        board.style.gap = "12px";
        board.style.width = "100%";
        board.style.maxWidth = "420px";
        board.style.marginTop = "10px";
        ctx.gameContent.appendChild(board);

        const info = document.createElement("p");
        info.className = "game-message";
        info.innerText = "Yanlis hakki: " + maxWrong;
        ctx.gameContent.appendChild(info);

        const buttons = deck.map(function (_, idx) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "main-btn";
          btn.style.height = "84px";
          btn.style.fontSize = "28px";
          btn.style.borderRadius = "16px";
          btn.style.padding = "0";
          btn.innerText = "?";

          btn.addEventListener("click", function () {
            if (lock) return;
            if (openIndexes.includes(idx)) return;
            if (btn.dataset.solved === "1") return;

            reveal(idx);
            openIndexes.push(idx);

            if (openIndexes.length === 2) {
              const a = openIndexes[0];
              const b = openIndexes[1];

              if (deck[a] === deck[b]) {
                buttons[a].dataset.solved = "1";
                buttons[b].dataset.solved = "1";
                buttons[a].style.opacity = "0.75";
                buttons[b].style.opacity = "0.75";
                openIndexes = [];
                solvedCount += 1;
                ctx.drawFace("happy");

                if (solvedCount === symbols.length) {
                  score += 1;
                  ctx.speak("Harika. Turu kazandin.");
                  lock = true;
                  setTimeout(function () {
                    lock = false;
                    nextRound();
                  }, 900);
                }
              } else {
                wrongCount += 1;
                info.innerText = "Yanlis hakki: " + Math.max(0, maxWrong - wrongCount);
                lock = true;
                setTimeout(function () {
                  hide(a);
                  hide(b);
                  openIndexes = [];
                  lock = false;

                  if (wrongCount >= maxWrong) {
                    ctx.drawFace("sad");
                    ctx.speak("Bu tur bitti. Yeni tur basliyor.");
                    lock = true;
                    setTimeout(function () {
                      lock = false;
                      nextRound();
                    }, 800);
                  }
                }, 700);
              }
            }
          });

          board.appendChild(btn);
          return btn;
        });

        function reveal(index) {
          buttons[index].innerText = deck[index];
        }

        function hide(index) {
          buttons[index].innerText = "?";
        }
      }

      function showFinal() {
        if (score >= winScore) {
          ctx.drawFace("happy");
          ctx.showMessage("Kazandin. Puan: " + score + " / " + totalRounds, "Kart Oyunu");
          return;
        }

        ctx.drawFace("sad");
        ctx.showMessage("Kaybettin. Puan: " + score + " / " + totalRounds, "Kart Oyunu");
      }
    },
  };

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
