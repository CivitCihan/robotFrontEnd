const friendSearch = document.getElementById("friendSearch");
const friendsList = document.getElementById("friendsList");

const friends = [
  { name: "Mert", age: 6, status: "Aktif", badge: "Takim Oyuncusu" },
  { name: "Elif", age: 7, status: "Mesgul", badge: "Hizli Ogrenen" },
  { name: "Deniz", age: 6, status: "Aktif", badge: "Matematik Ustasi" },
  { name: "Zeynep", age: 8, status: "Cevrimdisi", badge: "Yaratici Dusunce" },
  { name: "Can", age: 7, status: "Aktif", badge: "Dil Kahramani" },
  { name: "Lina", age: 6, status: "Mesgul", badge: "Renk Uzmani" },
];

function createFriendCard(friend) {
  const card = document.createElement("article");
  card.className = "card friend-card";

  const statusClassMap = {
    Aktif: "is-active",
    Mesgul: "is-busy",
    Cevrimdisi: "is-offline",
  };
  const statusClass = statusClassMap[friend.status] || "is-offline";

  card.innerHTML = `
    <div class="friend-top">
      <h2>${friend.name}</h2>
      <span class="friend-status ${statusClass}">${friend.status}</span>
    </div>
    <p class="friend-meta">${friend.age} yas</p>
    <p class="friend-badge">${friend.badge}</p>
    <button class="main-btn friend-action" type="button">Davet Gonder</button>
  `;

  const button = card.querySelector(".friend-action");
  button.addEventListener("click", () => {
    button.textContent = "Gonderildi";
    button.disabled = true;
  });

  return card;
}

function renderFriends() {
  const query = (friendSearch.value || "").trim().toLowerCase();
  friendsList.innerHTML = "";

  const filtered = friends.filter((friend) =>
    friend.name.toLowerCase().includes(query)
  );

  if (!filtered.length) {
    const empty = document.createElement("article");
    empty.className = "card";
    empty.innerHTML = "<p class='friend-meta'>Sonuc bulunamadi.</p>";
    friendsList.appendChild(empty);
    return;
  }

  filtered.forEach((friend) => {
    friendsList.appendChild(createFriendCard(friend));
  });
}

friendSearch.addEventListener("input", renderFriends);
renderFriends();
