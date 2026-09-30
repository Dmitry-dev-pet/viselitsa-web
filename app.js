const WORDS = [
  { word: "виселица", category: "игра" },
  { word: "библиотека", category: "место" },
  { word: "космонавт", category: "профессия" },
  { word: "подсолнечник", category: "растение" },
  { word: "снеговик", category: "зима" },
  { word: "шоколад", category: "еда" },
  { word: "гитара", category: "музыка" },
  { word: "ракета", category: "техника" },
  { word: "океан", category: "природа" },
  { word: "ландшафт", category: "искусство" },
  { word: "телеграм", category: "связь" },
  { word: "алгоритм", category: "программирование" },
  { word: "компас", category: "путешествие" },
  { word: "пирожное", category: "еда" },
  { word: "фонарь", category: "свет" },
  { word: "медведь", category: "животное" },
  { word: "вулкан", category: "природа" },
  { word: "театр", category: "культура" },
  { word: "корабль", category: "транспорт" },
  { word: "зеркало", category: "дом" }
];
const LETTERS = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя".split("");
const MAX_MISSES = 6;
const wordEl = document.getElementById("word");
const statusEl = document.getElementById("status");
const categoryEl = document.getElementById("category");
const keyboardEl = document.getElementById("keyboard");
const againEl = document.getElementById("again");
const parts = [...document.querySelectorAll(".part")];
let secret = "";
let guessed = new Set();
let misses = 0;
let over = false;
function pickWord() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }
function normalize(letter) { return letter.toLowerCase(); }
function masked() { return [...secret].map((ch) => (guessed.has(ch) ? ch : "_")).join(" "); }
function render() {
  wordEl.textContent = masked();
  parts.forEach((part, index) => part.classList.toggle("visible", index < misses));
}
function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = "status" + (kind ? " " + kind : "");
}
function finish(win) {
  over = true;
  guessed = new Set(secret.split(""));
  render();
  setStatus(win ? "Вы угадали слово." : "Вы проиграли. Слово: " + secret, win ? "win" : "lose");
  keyboardEl.querySelectorAll("button").forEach((btn) => { btn.disabled = true; });
}
function guess(letter) {
  if (over) return;
  const ch = normalize(letter);
  if (!LETTERS.includes(ch) || guessed.has(ch)) return;
  const btn = keyboardEl.querySelector(`[data-letter="${ch}"]`);
  if (secret.includes(ch)) {
    guessed.add(ch);
    if (btn) btn.classList.add("hit");
    if ([...secret].every((s) => guessed.has(s))) finish(true);
    else { render(); setStatus("Осталось ошибок: " + (MAX_MISSES - misses)); }
  } else {
    guessed.add(ch);
    misses += 1;
    if (btn) btn.classList.add("miss");
    render();
    if (misses >= MAX_MISSES) finish(false);
    else setStatus("Осталось ошибок: " + (MAX_MISSES - misses));
  }
  if (btn) btn.disabled = true;
}
function buildKeyboard() {
  keyboardEl.innerHTML = "";
  LETTERS.forEach((letter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "key";
    btn.dataset.letter = letter;
    btn.textContent = letter;
    btn.addEventListener("click", () => guess(letter));
    keyboardEl.appendChild(btn);
  });
}
function start() {
  const item = pickWord();
  secret = item.word;
  guessed = new Set();
  misses = 0;
  over = false;
  categoryEl.textContent = "категория: " + item.category;
  buildKeyboard();
  render();
  setStatus("Осталось ошибок: " + MAX_MISSES);
}
againEl.addEventListener("click", start);
document.addEventListener("keydown", (event) => { if (event.key.length === 1) guess(event.key); });
start();
