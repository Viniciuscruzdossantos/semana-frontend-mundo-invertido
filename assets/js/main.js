// ===== Mundo Invertido: tema, música, esporos, D20 e inscrições =====
const $ = (s) => document.querySelector(s);
const body = document.body, music = $("#music"), themeBtn = $("#switch-theme-button"), soundBtn = $("#sound-toggle");

const THEMES = {
  light: { track: "assets/musics/normal-world.mpeg", button: "Inverter Mundos", title: "Mundo Invertido | Semana Front-end", label: "O site está utilizando o tema light" },
  dark:  { track: "assets/musics/inverted-world.mpeg", button: "Voltar ao Mundo Normal", title: "Vecna está te observando... | Mundo Invertido", label: "O site está utilizando o tema dark, o Mundo Invertido" },
};
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const state = { theme: store.get("mi-theme", "light"), sound: store.get("mi-sound", true), started: false };

// ----- Música com fade -----
function fadeTo(vol, ms = 500) {
  clearInterval(fadeTo.t);
  const step = (vol - music.volume) / (ms / 40);
  fadeTo.t = setInterval(() => {
    music.volume = Math.min(1, Math.max(0, music.volume + step));
    if (Math.abs(music.volume - vol) < Math.abs(step) + 0.001) { music.volume = vol; clearInterval(fadeTo.t); }
  }, 40);
}
function playTrack() {
  if (!state.sound || !state.started) return;
  music.play().then(() => fadeTo(0.5)).catch(() => {});
}
function changeTrack(src) {
  fadeTo(0, 350);
  setTimeout(() => { music.src = src; playTrack(); }, 380);
}
function renderSound() {
  soundBtn.setAttribute("aria-pressed", String(state.sound));
  if (!state.sound) { fadeTo(0, 300); setTimeout(() => music.pause(), 320); }
}
soundBtn.addEventListener("click", () => {
  state.sound = !state.sound; state.started = true; store.set("mi-sound", state.sound);
  renderSound(); playTrack();
});
// Navegadores bloqueiam autoplay: a música começa no primeiro toque na página
addEventListener("pointerdown", () => { if (!state.started) { state.started = true; playTrack(); } }, { once: true });

// ----- Tema -----
function applyTheme(t, { withMusic = true } = {}) {
  state.theme = t;
  const cfg = THEMES[t];
  body.className = `${t}-theme` + (body.classList.contains("switching") ? " switching" : "");
  body.setAttribute("aria-label", cfg.label);
  themeBtn.textContent = cfg.button;
  document.title = cfg.title;
  store.set("mi-theme", t);
  if (withMusic) changeTrack(cfg.track);
}
function switchTheme() {
  if (body.classList.contains("switching")) return;
  body.classList.add("switching");
  setTimeout(() => applyTheme(state.theme === "light" ? "dark" : "light"), 330);   // troca no meio do flash
  setTimeout(() => body.classList.remove("switching"), 950);
}
window.switchTheme = switchTheme;
themeBtn.addEventListener("click", switchTheme);
addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "i" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) switchTheme();
});

// ----- Esporos do Mundo Invertido -----
const spores = $("#spores");
for (let i = 0; i < 40; i++) {
  const s = document.createElement("span");
  s.style.cssText = `left:${Math.random() * 100}%;--s:${2 + Math.random() * 4}px;--d:${9 + Math.random() * 12}s;--delay:-${Math.random() * 15}s;--x:${(Math.random() - 0.5) * 160}px`;
  spores.appendChild(s);
}

// ----- Aparecer ao rolar -----
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll("main section").forEach((el) => { el.classList.add("reveal"); io.observe(el); });

// ----- D20 -----
const msg = $("#formMsg"), levelInput = $("#txtLevel");
function say(text, type) { msg.textContent = text; msg.className = type || ""; }
$("#btnRoll").addEventListener("click", (e) => {
  const btn = e.currentTarget; if (btn.disabled) return;
  btn.disabled = true; btn.classList.add("rolling");
  let n = 0;
  const t = setInterval(() => {
    levelInput.value = 1 + Math.floor(Math.random() * 20);
    if (++n >= 14) {
      clearInterval(t); btn.disabled = false; btn.classList.remove("rolling");
      const v = Number(levelInput.value);
      say(v === 20 ? "20 natural! Crítico! O Mestre aprova." : v === 1 ? "1... falha crítica. Vecna ri de você." : `Os dados decidiram: nível ${v}.`, "dice");
    }
  }, 70);
});

// ----- Inscrição (salva no navegador) -----
// Para usar Firebase: troque o corpo de saveSubscription() por addDoc(collection(db, "inscritos"), data).
const KEY = "mi-inscritos";
const saveSubscription = (data) => store.set(KEY, [...store.get(KEY, []), data]);

function renderRoster() {
  const list = store.get(KEY, []);
  $("#roster").hidden = list.length === 0;
  $("#rosterCount").textContent = list.length;
  $("#rosterList").innerHTML = "";
  list.slice(-5).reverse().forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.name;                         // textContent evita injeção de HTML
    const small = document.createElement("small");
    small.textContent = `Level ${p.level} | ${p.character.slice(0, 60)}`;
    li.appendChild(small);
    $("#rosterList").appendChild(li);
  });
}

function validate() {
  const f = { name: $("#txtName"), email: $("#txtEmail"), level: levelInput, character: $("#txtCharacter") };
  const v = Object.fromEntries(Object.entries(f).map(([k, el]) => [k, el.value.trim()]));
  const level = Number(v.level);
  const checks = {
    name: v.name.length >= 3 ? "" : "Informe seu nome completo.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? "" : "Digite um e-mail válido.",
    level: Number.isInteger(level) && level >= 1 && level <= 20 ? "" : "O level deve ser um número de 1 a 20 (ou role o D20).",
    character: v.character.length >= 5 ? "" : "Descreva seu personagem em poucas palavras.",
  };
  Object.keys(f).forEach((k) => f[k].classList.toggle("invalid", !!checks[k]));
  const error = Object.values(checks).find(Boolean);
  return { error, data: { ...v, level, date: new Date().toISOString() }, fields: f };
}

$("#btnSubscribe").addEventListener("click", () => {
  const { error, data, fields } = validate();
  if (error) return say(error, "error");
  saveSubscription(data);
  Object.values(fields).forEach((el) => (el.value = ""));
  say(`Bem-vindo(a) ao clube, ${data.name.split(" ")[0]}! Sua inscrição foi registrada.`, "ok");
  renderRoster();
});
document.querySelectorAll("input, textarea").forEach((el) => el.addEventListener("input", () => el.classList.remove("invalid")));

// ----- Início -----
applyTheme(state.theme, { withMusic: false });
music.src = THEMES[state.theme].track;
music.volume = 0.5;
renderSound();
renderRoster();
