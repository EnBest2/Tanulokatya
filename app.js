const API_URL = "https://tanulokartya-proxy-production.up.railway.app/generate";

const input = document.getElementById("tetelInput");
const btn = document.getElementById("generateBtn");
const select = document.getElementById("categorySelect");
const container = document.getElementById("cardsContainer");
const tabs = document.querySelectorAll(".tab");
const modeToggle = document.getElementById("modeToggle");

let currentCategory = "irodalom";

const saveCards = (category, cards) => {
  localStorage.setItem(`cards-${category}`, JSON.stringify(cards));
};

const loadCards = (category) => {
  const saved = localStorage.getItem(`cards-${category}`);
  return saved ? JSON.parse(saved) : [];
};

const renderCards = (category) => {
  container.innerHTML = "";
  const cards = loadCards(category);
  cards.forEach(card => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<strong>${card.question}</strong><br>${card.answer}`;
    container.appendChild(el);
  });
};

btn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  btn.disabled = true;
  btn.textContent = "Generálás folyamatban...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${res.statusText}\n${errorText}`);
    }

    const data = await res.json();

    const cards = loadCards(currentCategory).concat(data);
    saveCards(currentCategory, cards);
    renderCards(currentCategory);
  } catch (err) {
    const fullError =
      "Hiba történt a generálás során:\n" +
      (err.message || "Ismeretlen hiba") +
      "\n\n" +
      (err.stack || "");
    alert(fullError);
    console.error("Részletes hiba:", err);
  }

  input.value = "";
  btn.disabled = false;
  btn.textContent = "Generálás";
};

tabs.forEach(tab => {
  tab.onclick = () => {
    currentCategory = tab.dataset.category;
    renderCards(currentCategory);
  };
});

modeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

renderCards(currentCategory);
