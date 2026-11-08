// ===== Dados =====
// Regra: pedra > tesoura > papel > pedra
const CARDS = [
  { id: 0, name: "Dragão Branco de Olhos Azuis", img: "dragon.png", beats: [1] },  // papel
  { id: 1, name: "Exodia, o Proibido", img: "exodia.png", beats: [2] },             // pedra
  { id: 2, name: "Mago Negro", img: "magician.png", beats: [0] },                   // tesoura
];
const ICONS = "./src/assets/icons/";
const AUDIO = "./src/assets/audios/";
const BASE_DMG = 1000, COMBO_BONUS = 500, MAX_DMG = 3000, SAVE_KEY = "yugioh-jokenpo-v3";

const DIFFS = {
  easy:   { label: "Fácil",   lp: 6000, time: 12, info: "6000 LP | 12s por rodada | oponente às vezes joga a carta mais fraca" },
  normal: { label: "Normal",  lp: 5000, time: 8,  info: "5000 LP | 8s por rodada | oponente aleatório" },
  hard:   { label: "Difícil", lp: 4000, time: 5,  info: "4000 LP | 5s por rodada | oponente aprende seu padrão" },
};
const ITEMS = { shield: "Escudo", double: "Dano x2", eye: "Olho do Milênio" };
const freshItems = () => ({ shield: true, double: true, eye: true });
const freshStats = () => ({ w: 0, l: 0, d: 0, duelsW: 0, duelsL: 0, bestCombo: 0 });

// ===== Estado manual =====
const state = {
  diff: "normal", seriesLen: 1,
  lp: { player: 5000, cpu: 5000 },
  series: { p: 0, c: 0 }, seriesOver: false,
  streak: 0, cpuStreak: 0, round: 1, timeLeft: 0, elapsed: 0,
  locked: false, paused: false, over: false,
  history: [0, 0, 0], cpuNext: null,
  items: freshItems(), active: { shield: false, double: false },
  music: false,
  opt: { timer: true, sfx: true, vol: 40 },
  stats: freshStats(),
  ranking: { easy: [], normal: [], hard: [] },
};

const $ = (id) => document.getElementById(id);
const ui = {
  hand: $("hand"), cardP: $("card-player"), cardC: $("card-cpu"),
  text: $("result-text"), sub: $("result-sub"), log: $("log"),
  bgm: $("bgm"), btnMusic: $("btn-music"), btnReset: $("btn-reset"), btnPause: $("btn-pause"),
  timerBar: $("timer-bar"), timerNum: $("timer-num"),
};

// ===== Funções puras =====
const randomCard = () => CARDS[Math.floor(Math.random() * CARDS.length)];
const cardThatBeats = (id) => CARDS.find((c) => c.beats.includes(id));
const cardThatLosesTo = (id) => CARDS.find((c) => CARDS[id].beats.includes(c.id));
const judge = (a, b) => (a.id === b.id ? 0 : a.beats.includes(b.id) ? 1 : -1);
const damage = (streak) => Math.min(MAX_DMG, BASE_DMG + COMBO_BONUS * (streak - 1));
const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
const favorite = () => {
  const max = Math.max(...state.history);
  return max > 0 ? state.history.indexOf(max) : -1;
};

// IA: a carta do oponente é escolhida no início da rodada
function pickCpuCard() {
  const fav = favorite();
  if (fav >= 0) {
    if (state.diff === "hard" && Math.random() < 0.55) return cardThatBeats(fav);
    if (state.diff === "easy" && Math.random() < 0.35) return cardThatLosesTo(fav);
  }
  return randomCard();
}

// ===== Persistência =====
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      stats: state.stats, opt: state.opt, diff: state.diff, seriesLen: state.seriesLen, ranking: state.ranking,
    }));
  } catch (e) {}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!d) return;
    Object.assign(state.stats, d.stats); Object.assign(state.opt, d.opt);
    if (DIFFS[d.diff]) state.diff = d.diff;
    if (d.seriesLen === 3) state.seriesLen = 3;
    if (d.ranking) Object.assign(state.ranking, d.ranking);
  } catch (e) {}
}

// ===== Renderização =====
function renderHand() {
  ui.hand.innerHTML = "";
  CARDS.forEach((c, i) => {
    const el = document.createElement("button");
    el.className = "hand-card";
    el.innerHTML = `<img src="${ICONS}${c.img}" alt="${c.name}" /><span>${i + 1}</span>`;
    el.title = c.name;
    el.addEventListener("click", () => play(c));
    el.addEventListener("mouseenter", () => { if (!state.locked) ui.log.textContent = c.name; });
    ui.hand.appendChild(el);
  });
}

function showCard(slot, card) {
  slot.classList.remove("flip", "peek"); void slot.offsetWidth;
  slot.querySelector("img").src = ICONS + (card ? card.img : "card-back.png");
  if (card) slot.classList.add("flip");
}
const hideCards = () => { showCard(ui.cardP, null); showCard(ui.cardC, null); };

function renderLP() {
  const max = DIFFS[state.diff].lp;
  for (const who of ["player", "cpu"]) {
    const v = Math.max(0, state.lp[who]);
    $(`lp-${who}-num`).textContent = v;
    $(`lp-${who}-bar`).style.width = (v / max) * 100 + "%";
  }
}

function renderHud() {
  $("hud-round").textContent = state.round;
  $("hud-elapsed").textContent = fmt(state.elapsed);
  $("hud-series-box").hidden = state.seriesLen === 1;
  $("hud-series").textContent = `${state.series.p} x ${state.series.c}`;
  const total = DIFFS[state.diff].time;
  if (!state.opt.timer) { ui.timerNum.textContent = "∞"; ui.timerBar.style.width = "100%"; return; }
  ui.timerNum.textContent = Math.ceil(state.timeLeft) + "s";
  ui.timerBar.style.width = (state.timeLeft / total) * 100 + "%";
  ui.timerBar.classList.toggle("low", state.timeLeft <= 3);
}

function renderItems() {
  document.querySelectorAll("[data-item]").forEach((b) => {
    const k = b.dataset.item;
    b.disabled = !state.items[k] && !state.active[k];
    b.classList.toggle("on", !!state.active[k]);
  });
}

function renderStats() {
  const s = state.stats;
  $("st-rounds").textContent = `${s.w}/${s.l}/${s.d}`;
  $("st-duels").textContent = `${s.duelsW}/${s.duelsL}`;
  $("st-combo").textContent = s.bestCombo;
  const top = state.ranking[state.diff];
  $("rank").textContent = top.length
    ? `Ranking ${DIFFS[state.diff].label}: ` + top.map((r, i) => `${i + 1}º ${fmt(r.t)} (${r.r} rod.)`).join("  ")
    : `Ranking ${DIFFS[state.diff].label}: vença um duelo para entrar!`;
}

function renderSettings() {
  document.querySelectorAll("[data-diff]").forEach((b) => b.classList.toggle("on", b.dataset.diff === state.diff));
  document.querySelectorAll("[data-series]").forEach((b) => b.classList.toggle("on", Number(b.dataset.series) === state.seriesLen));
  $("diff-info").textContent = DIFFS[state.diff].info;
  $("opt-timer").textContent = "Tempo: " + (state.opt.timer ? "ON" : "OFF");
  $("opt-sfx").textContent = "Efeitos: " + (state.opt.sfx ? "ON" : "OFF");
  $("opt-vol").value = state.opt.vol;
  ui.bgm.volume = (state.opt.vol / 100) * 0.6;
}

const setResult = (text, sub, cls) => { ui.text.textContent = text; ui.sub.textContent = sub; ui.text.className = cls || ""; };
function hit(target) {
  const el = target === "player" ? ui.cardP : ui.cardC;
  el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
}
function sfx(file) {
  if (!state.opt.sfx) return;
  const a = new Audio(AUDIO + file); a.volume = state.opt.vol / 100; a.play().catch(() => {});
}

// ===== Poderes especiais (1 uso de cada por duelo) =====
function useItem(k) {
  if (state.locked || state.paused || state.over || !state.items[k]) return;
  state.items[k] = false;
  if (k === "eye") {
    showCard(ui.cardC, state.cpuNext); ui.cardC.classList.add("peek");
    ui.log.textContent = `Olho do Milênio: o oponente jogará ${state.cpuNext.name}!`;
  } else {
    state.active[k] = true;
    ui.log.textContent = k === "shield" ? "Escudo ativado: a próxima derrota não causa dano." : "Dano x2 ativado: sua próxima vitória causa o dobro.";
  }
  renderItems();
}

// ===== Lógica de rodada =====
function play(mine) {                // mine = null quando o tempo acaba
  if (state.locked || state.paused || state.over) return;
  state.locked = true;
  const theirs = state.cpuNext;
  if (mine) state.history[mine.id]++;
  showCard(ui.cardP, mine); showCard(ui.cardC, theirs);

  const r = mine ? judge(mine, theirs) : -1;
  if (r === 0) {
    state.streak = state.cpuStreak = 0; state.stats.d++;
    setResult("EMPATE", "Nenhum LP perdido", "draw");
    ui.log.textContent = `${mine.name} e ${theirs.name} se anulam.`;
  } else if (r === 1) {
    state.streak++; state.cpuStreak = 0; state.stats.w++;
    state.stats.bestCombo = Math.max(state.stats.bestCombo, state.streak);
    const d = damage(state.streak) * (state.active.double ? 2 : 1);
    state.active.double = false;
    state.lp.cpu -= d; hit("cpu"); sfx("win.wav");
    setResult("VOCÊ GANHOU!", `-${d} LP` + (state.streak > 1 ? ` | COMBO x${state.streak}` : ""), "win");
    ui.log.textContent = `${mine.name} destrói ${theirs.name}!`;
  } else {
    state.cpuStreak++; state.streak = 0; state.stats.l++;
    let d = damage(state.cpuStreak);
    const blocked = state.active.shield;
    if (blocked) { d = 0; state.active.shield = false; }
    state.lp.player -= d; hit("player"); sfx("lose.wav");
    setResult(blocked ? "ESCUDO ATIVADO!" : mine ? "VOCÊ PERDEU" : "TEMPO ESGOTADO!",
      `-${d} LP` + (state.cpuStreak > 1 ? ` | COMBO x${state.cpuStreak}` : ""), blocked ? "draw" : "lose");
    ui.log.textContent = mine ? `${theirs.name} destrói ${mine.name}...` : "Você demorou demais e o oponente atacou!";
  }
  renderLP(); renderStats(); renderItems(); save();

  if (state.lp.cpu <= 0 || state.lp.player <= 0) return endGame();
  setTimeout(nextRound, 1500);
}

function nextRound() {
  if (state.over) return;
  state.round++;
  state.cpuNext = pickCpuCard();
  hideCards();
  state.timeLeft = DIFFS[state.diff].time;
  state.locked = false;
  renderHud();
}

function addRanking() {
  const list = state.ranking[state.diff];
  list.push({ t: state.elapsed, r: state.round });
  list.sort((a, b) => a.t - b.t || a.r - b.r);
  list.length = Math.min(list.length, 5);
}

function endGame() {
  state.over = true;
  const won = state.lp.cpu <= 0;
  won ? (state.stats.duelsW++, state.series.p++, addRanking()) : (state.stats.duelsL++, state.series.c++);
  const need = Math.ceil((state.seriesLen + 0.5) / 2);        // 1 -> 1 vitória, 3 -> 2 vitórias
  state.seriesOver = state.series.p >= need || state.series.c >= need;
  const info = `${state.round} rodadas em ${fmt(state.elapsed)}`;
  if (state.seriesLen > 1 && !state.seriesOver) {
    setResult(won ? "DUELO VENCIDO!" : "DUELO PERDIDO", `Série ${state.series.p} x ${state.series.c} | clique em Próximo duelo`, won ? "win" : "lose");
  } else if (state.seriesLen > 1) {
    setResult(won ? "SÉRIE VENCIDA!" : "SÉRIE PERDIDA", `Placar final ${state.series.p} x ${state.series.c}`, won ? "win" : "lose");
  } else {
    setResult(won ? "VITÓRIA DO DUELO!" : "DERROTA DO DUELO", info, won ? "win" : "lose");
  }
  ui.log.textContent = won ? `Vitória em ${info}. O Rei dos Jogos reconhece sua habilidade.` : "Volte ao deck e tente de novo.";
  ui.btnReset.querySelector("p").textContent = state.seriesLen > 1 && !state.seriesOver ? "Próximo duelo" : "Novo duelo";
  document.body.classList.toggle("victory", won);
  renderHud(); renderStats(); renderItems(); save();
}

function reset(full = false) {
  const keepSeries = state.over && !state.seriesOver && !full;
  if (!keepSeries) state.series = { p: 0, c: 0 };
  const d = DIFFS[state.diff];
  state.lp.player = state.lp.cpu = d.lp;
  Object.assign(state, {
    streak: 0, cpuStreak: 0, round: 1, elapsed: 0, timeLeft: d.time,
    locked: false, paused: false, over: false, seriesOver: false,
    history: [0, 0, 0], items: freshItems(), active: { shield: false, double: false },
  });
  state.cpuNext = pickCpuCard();
  document.body.classList.remove("victory", "paused");
  ui.btnPause.textContent = "Pausar";
  ui.btnReset.querySelector("p").textContent = "Novo duelo";
  hideCards();
  setResult("ESCOLHA UMA CARTA", "1, 2, 3 = cartas | Q W E = poderes | P = pausa");
  ui.log.textContent = `Novo duelo (${d.label}) iniciado!`;
  renderSettings(); renderLP(); renderHud(); renderItems(); renderStats();
}

function togglePause() {
  if (state.over) return;
  state.paused = !state.paused;
  ui.btnPause.textContent = state.paused ? "Continuar" : "Pausar";
  document.body.classList.toggle("paused", state.paused);
  state.paused ? setResult("PAUSADO", "Pressione P para continuar")
               : setResult("ESCOLHA UMA CARTA", "1, 2, 3 = cartas | Q W E = poderes | P = pausa");
}

function toggleMusic() {
  state.music = !state.music;
  state.music ? ui.bgm.play().catch(() => {}) : ui.bgm.pause();
  ui.btnMusic.textContent = "Música: " + (state.music ? "ON" : "OFF");
}

// ===== Instruções =====
const helpEl = $("help");
const HELP_KEY = "yugioh-jokenpo-help-seen";
let helpPaused = false;
function openHelp() {
  if (!helpEl.hidden) return;
  helpEl.hidden = false;
  helpEl.querySelector(".modal-box").scrollTop = 0;
  if (!state.paused && !state.over) { togglePause(); helpPaused = true; }
}
function closeHelp() {
  if (helpEl.hidden) return;
  helpEl.hidden = true;
  try { localStorage.setItem(HELP_KEY, "1"); } catch (e) {}
  if (helpPaused) { helpPaused = false; togglePause(); }
}

// ===== Relógio (a cada 100ms) =====
let tick = 0;
setInterval(() => {
  if (state.paused || state.over) return;
  if (++tick % 10 === 0) state.elapsed++;
  if (!state.locked && state.opt.timer) {
    state.timeLeft = Math.max(0, state.timeLeft - 0.1);
    if (state.timeLeft <= 0) play(null);
  }
  renderHud();
}, 100);

// ===== Eventos =====
ui.btnReset.addEventListener("click", () => reset());
ui.btnPause.addEventListener("click", togglePause);
ui.btnMusic.addEventListener("click", toggleMusic);
document.querySelectorAll("[data-diff]").forEach((b) =>
  b.addEventListener("click", () => { state.diff = b.dataset.diff; save(); reset(true); }));
document.querySelectorAll("[data-series]").forEach((b) =>
  b.addEventListener("click", () => { state.seriesLen = Number(b.dataset.series); save(); reset(true); }));
document.querySelectorAll("[data-item]").forEach((b) => b.addEventListener("click", () => useItem(b.dataset.item)));
$("opt-timer").addEventListener("click", () => { state.opt.timer = !state.opt.timer; state.timeLeft = DIFFS[state.diff].time; save(); renderSettings(); renderHud(); });
$("opt-sfx").addEventListener("click", () => { state.opt.sfx = !state.opt.sfx; save(); renderSettings(); });
$("opt-vol").addEventListener("input", (e) => { state.opt.vol = Number(e.target.value); save(); renderSettings(); });
$("btn-clear").addEventListener("click", () => { state.stats = freshStats(); state.ranking = { easy: [], normal: [], hard: [] }; save(); renderStats(); });
$("btn-help").addEventListener("click", openHelp);
$("btn-help-close").addEventListener("click", closeHelp);
helpEl.addEventListener("click", (e) => { if (e.target === helpEl) closeHelp(); });
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (!helpEl.hidden) { if (k === "escape" || k === "h" || k === "?") closeHelp(); return; }
  if (k === "h" || k === "?") return openHelp();
  if (k === "p") return togglePause();
  const item = { q: "shield", w: "double", e: "eye" }[k];
  if (item) return useItem(item);
  const c = CARDS[Number(k) - 1];
  if (c) play(c);
});

load();
renderHand();
reset(true);

// Primeira visita: abre as instruções automaticamente
try { if (!localStorage.getItem(HELP_KEY)) openHelp(); } catch (e) {}
