'use strict';
/* =====================================================================
   Toverschool Sterrenlicht – de app zelf
   (opslaan, schoolkaart, klassen, lessen, quiz, resultaten)
   ===================================================================== */

/* ---------- opslaan op deze tablet ---------- */
const KEY = 'toverschool-v1';
function defaults() {
  return {
    v: 1, profile: null, stars: 0, starsTotal: 0,
    owned: { outfit: ['paars'], hat: ['geen', 'puntmuts'], wand: ['ster'], pet: ['geen'] },
    topics: {}, highs: {}, badges: {}, days: [], lessons: {}, jokes: [], games: {}, unlocked: [], gifts: {},
    grade: 6, daylog: {}, review: {}, potion: { streak: 0, last: '', best: 0, total: 0, got: {}, freezeWeek: '' },
    settings: { sound: true, anim: !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches), big: false, jokes: true, lang: 'nl', dailyGoal: 10, theme: 'auto' },
    counters: { correct: 0, answered: 0, quizzes: 0, perfect: 0, bestStreak: 0, timed: 0, pap: 0, hard3: 0, purchases: 0, pets: 0 },
    lastSetup: { mode: 'practice', diff: 'easy', count: 10, duration: 60 }, subjectsTried: {}, created: Date.now()
  };
}
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return cleanSave(JSON.parse(raw)); } catch (e) { }
  return defaults();
}
/* Een opgeslagen stand (of een teruggezette reservekopie) controleren:
   alleen bekende velden, getallen worden echte getallen, tekst wordt ingekort.
   Zo kan een kapot of vreemd bestand de app niet laten vastlopen of code toevoegen. */
function cleanSave(d) {
  const def = defaults(), num = (v, lo = 0, hi = 1e9) => { v = +v; return isFinite(v) ? Math.min(hi, Math.max(lo, Math.round(v))) : lo; };
  const obj = v => v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  const str = (v, n = 40) => typeof v === 'string' ? v.slice(0, n) : '';
  const isDay = s => typeof s === 'string' && /^\d{4}-\d\d-\d\d$/.test(s);
  const pick = (v, list, dflt) => list.includes(v) ? v : dflt;
  const map = (o, fn) => { const r = {}; for (const k of Object.keys(obj(o))) if (k !== '__proto__' && k.length < 80) { const v = fn(o[k], k); if (v !== undefined) r[k] = v; } return r; };
  if (!d || typeof d !== 'object') return def;
  const out = def;
  out.stars = num(d.stars); out.starsTotal = num(d.starsTotal); out.grade = num(d.grade || 6, 3, 8); out.created = num(d.created, 0, 1e13) || Date.now();
  if (d.profile && typeof d.profile === 'object') {
    const l = obj(d.profile.look), L = Object.assign({}, DEFAULT_LOOK);
    for (const k of ['skin', 'hairColor', 'eyes', 'robeColor', 'blush']) if (l[k] != null) L[k] = num(l[k], 0, 20);
    if (l.tips != null) L.tips = num(l.tips, -1, 20);
    L.hair = pick(l.hair, HAIRSTYLES.map(h => h.id), L.hair); L.eyeShape = pick(l.eyeShape, EYESHAPES, L.eyeShape); L.brows = pick(l.brows, BROWS, L.brows);
    L.bril = pick(l.bril, GLASSES, L.bril); L.oorbel = pick(l.oorbel, EARRINGS, L.oorbel); L.clip = pick(l.clip, CLIPS, L.clip); L.teken = pick(l.teken, TEKENS.map(x => x[0]), L.teken);
    for (const k of ['outfit', 'hat', 'wand', 'pet']) L[k] = pick(l[k], ITEMS[k].map(i => i.id), L[k]);
    L.sproet = !!l.sproet; L.lashes = !!l.lashes;
    out.profile = { name: str(d.profile.name, 16), look: L };
  }
  for (const k of Object.keys(def.owned)) { const ids = ITEMS[k].map(i => i.id); out.owned[k] = [...new Set([...def.owned[k], ...(Array.isArray(obj(d.owned)[k]) ? d.owned[k] : []).filter(x => ids.includes(x))])]; }
  out.topics = map(d.topics, t => { t = obj(t); return { answered: num(t.answered), correct: num(t.correct), quizzes: num(t.quizzes), best: num(t.best, 0, 3), recent: (Array.isArray(t.recent) ? t.recent : []).slice(-20).map(x => x ? 1 : 0) }; });
  out.highs = map(d.highs, v => num(v));
  for (const k of ['badges', 'lessons', 'gifts', 'subjectsTried']) out[k] = map(d[k], v => num(v, 0, 1e13) || 1);
  out.games = map(d.games, g => map(g, v => num(v)));
  out.days = (Array.isArray(d.days) ? d.days : []).filter(isDay).slice(-400);
  out.jokes = (Array.isArray(d.jokes) ? d.jokes : []).map(x => num(x, -1)).filter(x => x >= 0 && x < JOKES.length);
  out.unlocked = (Array.isArray(d.unlocked) ? d.unlocked : []).filter(x => typeof x === 'string').map(x => x.slice(0, 20));
  out.daylog = map(d.daylog, (v, k) => isDay(k) ? { sec: num(obj(v).sec), q: num(obj(v).q), ok: num(obj(v).ok) } : undefined);
  out.review = map(d.review, r => { r = obj(r); return TOPIC[r.topic] && isDay(r.due) ? { topic: r.topic, item: typeof r.item === 'number' ? r.item : str(r.item, 200), box: num(r.box, 1, 5), due: r.due } : undefined; });
  out.recentWrong = (Array.isArray(d.recentWrong) ? d.recentWrong : []).slice(0, 12).map(w => ({ k: str(obj(w).k, 60), q: str(obj(w).q, 90), a: str(obj(w).a, 40), d: str(obj(w).d, 10) }));
  const s = obj(d.settings);
  for (const k of ['sound', 'anim', 'big', 'jokes']) if (s[k] != null) out.settings[k] = !!s[k];
  out.settings.lang = pick(s.lang, LANGS.map(l => l[0]), 'nl'); out.settings.dailyGoal = pick(+s.dailyGoal, [5, 10, 15, 20], 10);
  out.settings.theme = pick(s.theme, ['auto', 'day', 'night'], 'auto');
  out.settings.voiceWho = pick(s.voiceWho, ['Mama', 'Papa', 'Wela', 'Welo', 'Tanta'], '');
  for (const k of Object.keys(def.counters)) out.counters[k] = num(obj(d.counters)[k]);
  const ls = obj(d.lastSetup);
  out.lastSetup = { mode: pick(ls.mode, ['practice', 'timed'], 'practice'), diff: pick(ls.diff, ['easy', 'medium', 'hard'], 'easy'), count: pick(+ls.count, [5, 10, 15, 20], 10), duration: pick(+ls.duration, [60, 120, 300], 60) };
  const p = obj(d.potion);
  out.potion = { streak: num(p.streak), best: num(p.best), total: num(p.total), last: isDay(p.last) ? p.last : '', freezeWeek: str(p.freezeWeek, 12), got: map(p.got, v => num(v)) };
  return out;
}
let D = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { } }
const look = () => (D.profile && D.profile.look) || DEFAULT_LOOK;
const playerName = () => (D.profile && D.profile.name) || 'toverleerling';

function topicStats(key) { return D.topics[key] || (D.topics[key] = { answered: 0, correct: 0, recent: [], quizzes: 0, best: 0 }); }
function topicAcc(key) { const t = D.topics[key]; if (!t || !t.recent.length) return null; return t.recent.reduce((a, b) => a + b, 0) / t.recent.length; }
function topicStatus(key) {
  const t = D.topics[key]; if (!t || t.answered < 5) return 'nieuw';
  const a = topicAcc(key); return a >= .85 ? 'super' : a >= .65 ? 'goed' : 'oefenen';
}
const statusName = st => t('st_' + st);
const dayStr = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const today = () => dayStr(new Date());
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return dayStr(d); };
// past dit onderwerp bij de groep van het kind? (voor later: meer leeftijden)
const topicFits = tp => !tp.grades || (D.grade >= tp.grades[0] && D.grade <= tp.grades[1]);
function logDay(sec, ok) {
  const d = D.daylog[today()] || (D.daylog[today()] = { sec: 0, q: 0, ok: 0 });
  d.sec += sec; d.q++; if (ok) d.ok++;
  const keys = Object.keys(D.daylog); if (keys.length > 120) delete D.daylog[keys.sort()[0]];
}
function dayStreak() {
  const set = new Set(D.days); let n = 0; const d = new Date();
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  while (set.has(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`)) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function addStars(n, why) {
  if (n <= 0) return;
  D.stars += n; D.starsTotal += n; save(); updateStarCount();
}
function updateStarCount() { $$('.starcount').forEach(e => e.textContent = D.stars); }

/* ---------- geluid ---------- */
let AC = null;
function tone(freqs, dur = .12, type = 'sine', vol = .07) {
  if (!D.settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    let t = AC.currentTime;
    for (const f of freqs) {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + .02); t += dur * .8;
    }
  } catch (e) { }
}
const SND = {
  ok: () => tone([784, 988, 1319], .1, 'triangle', .06),
  bad: () => { tone([330, 247], .16, 'sine', .06); },
  click: () => tone([660], .04, 'triangle', .03),
  buy: () => tone([523, 659, 784, 1047], .09, 'triangle', .06),
  fanfare: () => tone([523, 659, 784, 1047, 784, 1047, 1319], .12, 'triangle', .06),
  pop: () => tone([900, 1200], .05, 'sine', .05),
  boing: () => { if (!D.settings.sound) return; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime; o.type = 'sine'; o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(140, t + .35); g.gain.setValueAtTime(.07, t); g.gain.exponentialRampToValueAtTime(.0001, t + .4); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + .42); } catch (e) { } }
};

/* ---------- effecten ---------- */
function confetti(amount = 140) {
  if (!D.settings.anim) return;
  const c = $('#confetti'), ctx = c.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  const W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr;
  c.classList.add('on');
  const cols = ['#FFD36E', '#FF8FB8', '#8B6CF0', '#4FC8BA', '#6DB8F7', '#FFFFFF'];
  const P = Array.from({ length: amount }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .45, vx: (Math.random() - .5) * 22 * dpr, vy: (-Math.random() * 20 - 6) * dpr, s: (5 + Math.random() * 7) * dpr, c: kies(cols), r: Math.random() * 6, vr: (Math.random() - .5) * .3, star: Math.random() < .4 }));
  let f = 0;
  (function step() {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.vy += .55 * dpr; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      if (p.star) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? p.s * .45 : p.s; ctx.lineTo(q * Math.cos(a), q * Math.sin(a)); } ctx.fill(); }
      else ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66);
      ctx.restore();
    }
    if (++f < 150) requestAnimationFrame(step); else { ctx.clearRect(0, 0, W, H); c.classList.remove('on'); }
  })();
}
// spreuk-vonken passen bij je toverstaf
const WAND_SPARKS = { ster: ['✨', '⭐', '💫', '🌟'], hart: ['💖', '💗', '✨', '💕'], maan: ['🌙', '✨', '⭐', '💫'], schelp: ['🐚', '💧', '✨', '🫧'], kristal: ['💎', '✨', '💠', '❄️'], regenboog: ['🌈', '✨', '💖', '⭐'] };
function sparkleBurst(el, n = 12, syms) {
  if (!D.settings.anim || !el) return;
  syms = syms || ['✨', '⭐', '💫', '🌟'];
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'); s.className = 'spark'; s.textContent = kies(syms);
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
    s.style.left = cx + 'px'; s.style.top = cy + 'px'; s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
    document.body.appendChild(s); setTimeout(() => s.remove(), 900);
  }
}
// een sterretje vliegt van het ene element naar het andere
function flyTo(from, to, sym = '⭐') {
  if (!D.settings.anim || !from || !to) return;
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), s = document.createElement('span');
  s.className = 'flystar'; s.textContent = sym;
  s.style.left = a.left + a.width / 2 + 'px'; s.style.top = a.top + a.height / 3 + 'px';
  s.style.setProperty('--dx', (b.left + b.width / 2) - (a.left + a.width / 2) + 'px');
  s.style.setProperty('--dy', (b.top + b.height / 2) - (a.top + a.height / 3) + 'px');
  document.body.appendChild(s); setTimeout(() => s.remove(), 800);
  setTimeout(() => { to.classList.remove('bump'); void to.offsetWidth; to.classList.add('bump'); }, 700);
}
// getallen tellen op (uitslag)
function countUp(el, to, ms = 700) {
  if (!el) return;
  const t0 = performance.now(), pre = el.dataset.pre || '';
  if (!D.settings.anim || to <= 0) { el.textContent = pre + to; return; }
  (function f(now) { const p = Math.min(1, (now - t0) / ms); el.textContent = pre + Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
}
function toast(html, ms = 2600) {
  const t = $('#toast'); t.innerHTML = html; t.classList.add('show');
  clearTimeout(toast.tid); toast.tid = setTimeout(() => t.classList.remove('show'), ms);
}
function modal(html, buttons = [{ label: t('ok'), cls: 'primary' }], opts = {}) {
  const m = $('#modal'), card = $('#modal-card');
  card.innerHTML = html + `<div class="mbtns">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-i="${i}">${b.label}</button>`).join('')}</div>`;
  m.classList.add('show'); m.dataset.closable = opts.closable === false ? '0' : '1';
  $$('.mbtns .btn', card).forEach(b => b.onclick = () => { closeModal(); const fn = buttons[+b.dataset.i].fn; if (fn) fn(); });
}
function closeModal() { $('#modal').classList.remove('show'); }
function shake(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

/* ---------- navigatie (ook de terugknop van Android) ---------- */
let current = 'map';
const PARENT = { class: 'map', setup: 'class', results: 'class', wardrobe: 'map', pets: 'map', games: 'map', game: 'games', progress: 'map', jokes: 'map', garden: 'map', party: 'map', parents: 'map' };
let navBack = false;   // terug-knop: scherm schuift van links in plaats van rechts
function show(id) {
  const prev = current;
  $$('.screen').forEach(s => {
    const on = s.id === id; s.classList.toggle('active', on);
    if (on && prev !== id && D.settings.anim) { s.classList.remove('in-fwd', 'in-back'); void s.offsetWidth; s.classList.add(navBack ? 'in-back' : 'in-fwd'); }
  });
  navBack = false; current = id; window.scrollTo(0, 0);
}
history.replaceState({ app: 1 }, ''); history.pushState({ app: 2 }, '');
window.addEventListener('popstate', () => {
  history.pushState({ app: 2 }, '');
  goBack();
});
function goBack() {
  if ($('#modal').classList.contains('show')) { if ($('#modal').dataset.closable !== '0') closeModal(); return; }
  if (current === 'quiz') return askStop();
  if (current === 'lesson') return lessonBack();
  if (current === 'game') return stopGame();
  if (current === 'intro' || current === 'map') return;
  navBack = true;
  if (current === 'results' && S.potion) return openMap();
  const p = PARENT[current] || 'map';
  if (p === 'class' && L.subject) return openClass(L.subject);
  if (p === 'games') return openGames();
  openMap();
}

/* =====================================================================
   SCHOOLKAART
   ===================================================================== */
const PLACES = [
  { id: 'toren', subject: 'rekenen', need: 0 }, { id: 'bieb', subject: 'taal', need: 0 }, { id: 'strand', subject: 'papiamentu', need: 0 },
  { id: 'kast', need: 0, open: () => openWardrobe() },
  { id: 'sterren', need: 0, open: () => openProgress() },
  { id: 'speel', need: 15, open: () => openGames() },
  { id: 'weide', need: 30, open: () => openPets() },
  { id: 'zolder', need: 50, open: () => openJokes() },
  { id: 'tuin', need: 150, open: () => openGarden() },
  { id: 'feest', need: 300, open: () => openParty() }
];
PLACES.forEach(p => {
  Object.defineProperty(p, 'name', { get: () => p.subject ? t('place_' + p.subject) : t('pl_' + p.id) });
  Object.defineProperty(p, 'sub', { get: () => p.subject ? t('subj_' + p.subject) : t('pls_' + p.id) });
});
function placeOpen(p) { return D.starsTotal >= p.need; }
function topbar(title = '') {
  return `<div class="topbar"><button class="iconbtn" data-act="settings" aria-label="Instellingen">⚙️</button>
    <div class="tb-title">${title}</div>
    <div class="tb-stats"><span class="pill star">⭐ <b class="starcount">${D.stars}</b></span>${dayStreak() ? `<span class="pill fire">🔥 ${dayStreak()}</span>` : ''}</div></div>`;
}
function bindCommon(root) {
  $$('[data-act="settings"]', root).forEach(b => b.onclick = openSettings);
  $$('[data-act="back"]', root).forEach(b => b.onclick = goBack);
  $$('[data-act="map"]', root).forEach(b => b.onclick = openMap);
}
function backbar(title, color) {
  return `<div class="topbar"><button class="iconbtn" data-act="back" aria-label="Terug">←</button><div class="tb-title">${title}</div>
    <div class="tb-stats"><span class="pill star">⭐ <b class="starcount">${D.stars}</b></span></div></div>`;
}
function openMap() {
  if (!D.profile) return openIntro();
  checkUnlocks(true);
  const el = $('#map');
  const pipLine = kies(tList(PIP_HELLO, PIPHELLO_I18N));
  // je eigen tovenaar, je huisdier en Pip staan op de Emmabrug in Willemstad
  const actors = `<div class="actors">${look().pet !== 'geen' ? petSVG(look().pet, 'actor-pet') : ''}<button class="actor me" id="meact" aria-label="${esc(playerName())}">${avatarSVG(look())}</button>
    <button class="actor pip-actor" id="pipjoke" aria-label="${t('pipJokeBtn')}">${pipSVG('blij')}</button></div>`;
  el.innerHTML = topbar(t('appName')) + `<div class="wrap">
    ${sceneHTML(actors)}
    <div class="hero-row"><div class="hello-box"><div class="hello">${t('hi')} <b>${esc(playerName())}</b>!</div><div class="sub">${t('student')}</div></div>
      <div class="bubble pipsay" id="pipsay" aria-live="polite">${pipLine}</div></div>
    ${potionCard()}
    <h2 class="sect">${t('chooseWhere')}</h2>
    <div class="map">${PLACES.map(p => {
      const s = p.subject ? SUBJECT[p.subject] : null, open = placeOpen(p);
      return `<button class="place ${open ? '' : 'locked'} ${s ? 'cls' : ''}" data-p="${p.id}" style="${s ? `--pc:${s.color};--pl:${s.light}` : ''}">
        <span class="p-art">${placeArt(p.id)}</span><span class="p-name">${p.name}</span><span class="p-sub">${open ? p.sub : `🔒 ${t('needStars', { n: p.need - D.starsTotal })}`}</span></button>`;
    }).join('')}</div>
    <p class="foot">${t('footStars', { n: D.starsTotal })}</p></div>`;
  bindCommon(el);
  $$('.place', el).forEach(b => b.onclick = () => {
    const p = PLACES.find(x => x.id === b.dataset.p);
    if (!placeOpen(p)) { shake(b); toast(t('lockedToast', { n: p.need })); return; }
    SND.click(); p.subject ? openClass(p.subject) : p.open();
  });
  $('#potgo').onclick = () => { SND.click(); startPotion(); };
  let jk = -1;
  $('#pipjoke').onclick = () => {
    SND.pop(); const pool = JOKES; jk = (jk + 1 + rnd(0, pool.length - 2)) % pool.length; const j = pool[jk];
    $('#pipsay').innerHTML = `<b>${j[0]}</b><br><span class="punch">${j[1]}</span>`;
    pipReact($('#pipjoke'), 'lach');
    sparkleBurst($('#pipjoke'), 8);   // Pip niest glitter
    move($('#pipsay'), 'pop');
  };
  $('#meact').onclick = () => { SND.pop(); move($('#meact .avatar'), 'hop'); sparkleBurst($('#meact'), 10, WAND_SPARKS[look().wand]); };
  show('map');
  move($('.scene', el), 'inUp', { duration: 700 });
  stagger([$('.hero-row', el), $('.potcard', el)].filter(Boolean), 'inUp', 80, 120);
  stagger($$('.place', el), 'inUp', 40, 220);
}

/* =====================================================================
   KLAS (vak) met onderwerpen
   ===================================================================== */
const L = { subject: null, topic: null, step: 0, from: null };
function openClass(sid) {
  const s = SUBJECT[sid]; L.subject = sid;
  const el = $('#class');
  const weak = s.topics.filter(t => topicStatus(t.key) === 'oefenen');
  const say = weak.length && Math.random() < .6 ? t('tipWeak', { t: tTopic(weak[0]) }) : t('hello_' + sid);
  el.innerHTML = backbar(t('place_' + sid)) + `<div class="wrap" style="--sc:${s.color};--sl:${s.light};--sd:${s.dark}">
    <div class="classhead">${teacherSVG(s.teacher)}<div class="bubble big">${say}<div class="who">— ${s.teacherName}</div></div></div>
    <h2 class="sect">${t('subj_' + sid)}</h2>${lang() !== 'nl' ? `<p class="muted cnote">${t('contentNote')}</p>` : ''}
    <div class="topics">${s.topics.map(tp => {
      const st = topicStatus(tp.key), ts = D.topics[tp.key], best = ts ? ts.best : 0;
      return `<div class="topic st-${st}"><div class="t-ico">${tp.ico}</div><div class="t-body"><div class="t-name">${tTopic(tp)}</div><div class="t-sub">${lang() === 'nl' ? tp.sub : tp.name}</div>
        <div class="t-meta"><span class="spill ${st}">${statusName(st)}</span><span class="tstars">${[1, 2, 3].map(i => STARICO(i <= best)).join('')}</span></div></div>
        <div class="t-btns"><button class="btn small ghost" data-learn="${tp.key}">📖 ${t('learn')}</button><button class="btn small" data-play="${tp.key}">✨ ${t('practise')}</button></div></div>`;
    }).join('')}
    <div class="topic mix"><div class="t-ico">🎲</div><div class="t-body"><div class="t-name">${t('mix')}</div><div class="t-sub">${t('mixSub')}</div></div>
      <div class="t-btns"><button class="btn small" data-play="${sid}/mix">✨ ${t('practise')}</button></div></div></div></div>`;
  bindCommon(el);
  $$('[data-learn]', el).forEach(b => b.onclick = () => { SND.click(); openLesson(b.dataset.learn, 0, 'class'); });
  stagger($$('.topic', el), 'inUp', 40, 120);
  $$('[data-play]', el).forEach(b => b.onclick = () => { SND.click(); openSetup(b.dataset.play); });
  show('class');
}

/* =====================================================================
   LES ("Leren")
   ===================================================================== */
function openLesson(key, step = 0, from = 'class') {
  const t = TOPIC[key]; L.topic = key; L.step = step; L.from = from; L.subject = t.subject;
  renderLesson();
  show('lesson');
}
function renderLesson() {
  const tp = TOPIC[L.topic], s = SUBJECT[tp.subject], steps = tp.lesson || [], st = steps[L.step] || {};
  const last = L.step >= steps.length - 1, el = $('#lesson');
  el.innerHTML = `<div class="topbar"><button class="iconbtn" data-act="lback" aria-label="${t('back')}">←</button><div class="tb-title">📖 ${tTopic(tp)}</div>
    <div class="tb-stats"><span class="pill">${L.step + 1} / ${steps.length}</span></div></div>
    <div class="wrap narrow" style="--sc:${s.color};--sl:${s.light};--sd:${s.dark}">
    <div class="dots">${steps.map((_, i) => `<span class="${i === L.step ? 'on' : i < L.step ? 'done' : ''}"></span>`).join('')}</div>
    <div class="lesson card"><div class="l-head">${teacherSVG(s.teacher, 'small')}<h2>${st.t || ''}</h2></div>
      <div class="l-text">${st.h || ''}</div>${st.v ? `<div class="l-vis">${st.v}</div>` : ''}${st.w ? `<div class="l-widget" id="lwidget"></div>` : ''}</div>
    <div class="l-nav"><button class="btn ghost" data-l="prev" ${L.step === 0 ? 'disabled' : ''}>${t('prev')}</button>
      ${last ? (L.from === 'quiz' ? `<button class="btn primary" data-l="quiz">${t('backToQuiz')}</button>` : `<button class="btn primary" data-l="play">${t('nowPractise')}</button>`) : `<button class="btn primary" data-l="next">${t('next')}</button>`}</div></div>`;
  if (st.w && WIDGETS[st.w]) WIDGETS[st.w]($('#lwidget'), st.o || {});
  $('[data-act="lback"]', el).onclick = lessonBack;
  $$('[data-l]', el).forEach(b => b.onclick = () => {
    SND.click();
    const a = b.dataset.l;
    if (a === 'prev') { L.step--; renderLesson(); window.scrollTo(0, 0); }
    if (a === 'next') { L.step++; renderLesson(); window.scrollTo(0, 0); }
    if (a === 'play' || a === 'quiz') {
      if (!D.lessons[L.topic]) { D.lessons[L.topic] = Date.now(); addStars(3); save(); toast(t('lessonDone')); checkBadges(); }
      a === 'play' ? openSetup(L.topic) : returnToQuiz();
    }
  });
}
function lessonBack() { if (L.from === 'quiz') return returnToQuiz(); openClass(L.subject); }

/* =====================================================================
   QUIZ INSTELLEN
   ===================================================================== */
const S = {};
const diffName = d => t(d);
const isMix = k => /\/mix$/.test(k);
const topicName = k => isMix(k) ? t('mix') : tTopic(TOPIC[k]);
function highKey() { return `${S.topicKey}|${S.mode}|${S.diff}|${S.mode === 'timed' ? S.duration : S.count}`; }
function openSetup(key) {
  S.topicKey = key; S.subject = key.split('/')[0]; L.subject = S.subject; S.potion = false; S.queue = null;
  Object.assign(S, { mode: D.lastSetup.mode, diff: D.lastSetup.diff, count: D.lastSetup.count, duration: D.lastSetup.duration });
  renderSetup(); show('setup');
}
function renderSetup() {
  const s = SUBJECT[S.subject], el = $('#setup'), rec = D.highs[highKey()] || 0;
  const tp = isMix(S.topicKey) ? null : TOPIC[S.topicKey];
  el.innerHTML = backbar(topicName(S.topicKey)) + `<div class="wrap narrow" style="--sc:${s.color};--sl:${s.light};--sd:${s.dark}">
    <div class="setuphead"><span class="t-ico big">${tp ? tp.ico : '🎲'}</span><div><h2>${topicName(S.topicKey)}</h2><div class="muted">${t('subj_' + S.subject)}</div></div></div>
    <h3>${t('howPractise')}</h3>
    <div class="seg two">
      <button class="opt ${S.mode === 'practice' ? 'on' : ''}" data-mode="practice"><span class="o-ico">🧘</span><b>${t('practiceMode')}</b><small>${t('practiceSub')}</small></button>
      <button class="opt ${S.mode === 'timed' ? 'on' : ''}" data-mode="timed"><span class="o-ico">⏱️</span><b>${t('timedMode')}</b><small>${t('timedSub')}</small></button></div>
    <h3>${t('howHard')}</h3>
    <div class="seg three">${['easy', 'medium', 'hard'].map((d, i) => `<button class="opt ${S.diff === d ? 'on' : ''}" data-diff="${d}"><span class="o-ico">${'⭐'.repeat(i + 1)}</span><b>${diffName(d)}</b></button>`).join('')}</div>
    ${S.mode === 'practice'
      ? `<h3>${t('howMany')}</h3><div class="chips">${[5, 10, 15, 20].map(n => `<button class="chip ${S.count === n ? 'on' : ''}" data-count="${n}">${n}</button>`).join('')}</div>`
      : `<h3>${t('howLong')}</h3><div class="chips">${[60, 120, 300].map(n => `<button class="chip ${S.duration === n ? 'on' : ''}" data-dur="${n}">${n / 60} ${t('min')}</button>`).join('')}</div>`}
    <div class="record">${t('yourRecord', { n: rec })}</div>
    <button class="btn primary huge" id="go">${t('begin')}</button>
    ${tp ? `<button class="btn ghost wide" id="tolesson">${t('lessonFirst')}</button>` : ''}</div>`;
  bindCommon(el);
  $$('[data-mode]', el).forEach(b => b.onclick = () => { S.mode = b.dataset.mode; renderSetup(); });
  $$('[data-diff]', el).forEach(b => b.onclick = () => { S.diff = b.dataset.diff; renderSetup(); });
  $$('[data-count]', el).forEach(b => b.onclick = () => { S.count = +b.dataset.count; renderSetup(); });
  $$('[data-dur]', el).forEach(b => b.onclick = () => { S.duration = +b.dataset.dur; renderSetup(); });
  $('#go').onclick = startQuiz;
  if ($('#tolesson')) $('#tolesson').onclick = () => openLesson(S.topicKey, 0, 'class');
}

/* =====================================================================
   QUIZ
   ===================================================================== */
let timerId = null;
const subjOf = () => S.potion ? POTION_SUBJ : SUBJECT[S.subject];
function startQuiz() {
  if (!S.potion) D.lastSetup = { mode: S.mode, diff: S.diff, count: S.count, duration: S.duration };
  save();
  Object.assign(S, { i: 0, score: 0, streak: 0, bestStreak: 0, correct: 0, answered: 0, wrong: [], recentKeys: [], wrongByTopic: {}, suggested: {}, locked: false, pausedAt: 0 });
  if (!D.days.includes(today())) { D.days.push(today()); if (D.days.length > 400) D.days = D.days.slice(-400); save(); }
  if (!S.potion) D.subjectsTried[S.subject] = 1;
  const s = subjOf(), el = $('#quiz');
  el.style.setProperty('--sc', s.color); el.style.setProperty('--sl', s.light); el.style.setProperty('--sd', s.dark);
  el.innerHTML = `<div class="qtop"><button class="iconbtn" id="qstop" aria-label="Stoppen">✕</button>
      <div class="qprog"><div class="qbar"><i id="qbarfill"></i></div><div class="qinfo" id="qinfo"></div></div>
      <div class="qscore"><span id="qstreak" class="pill fire hidden"></span><span class="pill">✨ <b id="qpts">0</b></span></div></div>
    <div class="qmain">
      <div class="qcard card" id="qcard"><div class="qtopic" id="qtopic"></div><div class="qtext" id="qtext"></div><div class="qvis" id="qvis"></div>
        <div class="qhelp"><button class="btn small ghost" id="qhint">${t('how')}</button><button class="btn small ghost" id="qskip">${t('dunno')}</button></div>
        <div class="hintbox" id="hintbox"></div></div>
      <div class="qside"><div class="qme" id="qme">${avatarSVG(look(), 'blij', 'small')}</div><div class="qpip" id="qpip">${pipSVG('blij')}</div>${look().pet !== 'geen' ? petSVG(look().pet, 'qpet') : ''}${S.potion ? `<div class="potbottle" id="potb">${potionSVG(0, nextPotion()[1])}</div>` : ''}</div>
    </div>
    <div class="qinput" id="qinput"></div>
    <div class="fb" id="fb"></div>
    <div class="spellbanner" id="spellbanner"></div>`;
  $('#qstop').onclick = askStop; $('#qhint').onclick = showHint; $('#qskip').onclick = skip;
  show('quiz');
  if (S.mode === 'timed') { S.endAt = Date.now() + S.duration * 1000; startTimer(); }
  next(true);
}
function pickTopic() {
  if (!isMix(S.topicKey)) return TOPIC[S.topicKey];
  return kies(SUBJECT[S.subject].topics);
}
function makeQuestion() {
  if (S.queue) {   // Toverdrank: vaste lijst van onderwerpen (en woordjes om te herhalen)
    const e = S.queue[S.i] || S.queue[S.queue.length - 1], tp = TOPIC[e.topic];
    S.diff = e.diff; const q = tp.gen(e.diff, e.item); q.topic = tp; return q;
  }
  let q, t, k, tries = 0;
  do { t = pickTopic(); q = t.gen(S.diff); k = q.key || strip(q.text) + strip(q.visual || '').slice(0, 60); tries++; }
  while (S.recentKeys.includes(k) && tries < 12);
  S.recentKeys.push(k); if (S.recentKeys.length > 10) S.recentKeys.shift();
  q.topic = t; return q;
}
function next(first) {
  if (!first && S.mode === 'practice' && S.i >= S.count) return finish();
  if (S.mode === 'timed' && Date.now() >= S.endAt) return finish();
  S.q = makeQuestion(); S.i++; S.hintUsed = false; S.locked = false;
  S.input = { a: '', r: '', field: 'a' }; S.sel = new Set(); S.order = [];
  renderQuestion();
}
function renderQuestion() {
  const q = S.q;
  $('#fb').className = 'fb'; $('#fb').innerHTML = '';
  $('#quiz').classList.remove('showfb');
  $('#qtopic').innerHTML = `${q.topic.ico} ${tTopic(q.topic)} · ${diffName(S.diff)}`;
  $('#qtext').innerHTML = q.text; $('#qtext').className = 'qtext' + (q.long ? ' long' : '');
  $('#qvis').innerHTML = q.visual || ''; $('#qvis').classList.toggle('empty', !q.visual);
  $('#hintbox').classList.remove('show'); $('#hintbox').innerHTML = '';
  $('#qhint').classList.toggle('hidden', S.mode === 'timed' || !q.hint);
  $('#qme').innerHTML = avatarSVG(look(), 'blij', 'small');
  S.qStart = Date.now();
  renderInput(); updateBar();
  if (S.pipMood !== 'blij') { $('#qpip').innerHTML = pipSVG('blij'); S.pipMood = 'blij'; }
  move($('#qcard'), 'inUp', { duration: 480 });
  stagger($$('.choice, .tw, .orderpool .ow', $('#qinput')), 'pop', 35, 120, 10);
}
function updateBar() {
  const p = S.mode === 'practice' ? (S.i - 1) / S.count : 1 - Math.max(0, S.endAt - Date.now()) / (S.duration * 1000);
  $('#qbarfill').style.width = Math.min(100, p * 100) + '%';
  $('#qinfo').innerHTML = S.mode === 'practice' ? t('qOf', { i: S.i, n: S.count }) : `⏱️ <b id="qtime">${fmtSec(Math.max(0, S.endAt - Date.now()))}</b> · ${S.correct} ${t('right')}`;
  $('#qpts').textContent = S.score;
  const st = $('#qstreak'); st.classList.toggle('hidden', S.streak < 2); st.textContent = `🔥 ${S.streak}`;
}
const fmtSec = ms => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${pad2(s % 60)}`; };
function tick() {
  if (S.pausedAt) return;
  const left = S.endAt - Date.now();
  const t = $('#qtime'); if (t) t.textContent = fmtSec(Math.max(0, left));
  $('#qbarfill').style.width = Math.min(100, (1 - Math.max(0, left) / (S.duration * 1000)) * 100) + '%';
  if (left <= 0 && !S.locked) finish();
}
function startTimer() { stopTimer(); timerId = setInterval(tick, 200); }
function stopTimer() { clearInterval(timerId); timerId = null; }
function pause() { if (S.mode === 'timed' && timerId && !S.pausedAt) S.pausedAt = Date.now(); }
function resume() { if (S.pausedAt) { S.endAt += Date.now() - S.pausedAt; S.pausedAt = 0; tick(); } }

/* ---------- invoer ---------- */
function renderInput() {
  const q = S.q, box = $('#qinput');
  if (q.kind === 'choice') {
    box.innerHTML = `<div class="choices ${q.choiceCls || ''} ${q.big ? 'bigc' : ''} n${q.choices.length}">${q.choices.map((c, i) => `<button class="choice" data-c="${i}">${c}</button>`).join('')}</div>`;
    $$('.choice', box).forEach(b => b.onclick = () => submit(+b.dataset.c));
    return;
  }
  if (q.kind === 'tap') {
    box.innerHTML = `<div class="tapzin">${q.tokens.map((t, i) => t.p ? `<span class="tp">${t.w}</span>` : `<button class="tw ${S.sel.has(i) ? 'on' : ''}" data-t="${i}">${t.w}</button>`).join(' ')}</div>
      <button class="btn primary cast" id="cast">${t('cast')}</button>`;
    $$('.tw', box).forEach(b => b.onclick = () => { const i = +b.dataset.t; S.sel.has(i) ? S.sel.delete(i) : S.sel.add(i); b.classList.toggle('on'); SND.click(); });
    $('#cast').onclick = () => { if (!S.sel.size) return shake($('.tapzin')); submit(); };
    return;
  }
  if (q.kind === 'order') {
    if (!S.pool) S.pool = null;
    if (!S.order.length && !S.poolFor) { }
    if (S.poolFor !== q) { S.pool = shuffle(q.tokens.map((w, i) => ({ w, i }))); if (S.pool.map(p => p.w).join() === q.tokens.join() && q.tokens.length > 1) S.pool.reverse(); S.poolFor = q; }
    const used = new Set(S.order.map(o => o.i));
    box.innerHTML = `<div class="orderbuilt">${S.order.length ? S.order.map((o, k) => `<button class="ow on pap" data-k="${k}">${o.w}</button>`).join(' ') : `<span class="muted">${t('tapOrder')}</span>`}</div>
      <div class="orderpool">${S.pool.map(p => `<button class="ow pap ${used.has(p.i) ? 'used' : ''}" data-i="${p.i}" ${used.has(p.i) ? 'disabled' : ''}>${p.w}</button>`).join(' ')}</div>
      <button class="btn primary cast" id="cast" ${S.order.length === q.tokens.length ? '' : 'disabled'}>${t('cast')}</button>`;
    $$('.orderpool .ow', box).forEach(b => b.onclick = () => { const p = S.pool.find(x => x.i === +b.dataset.i); S.order.push(p); SND.click(); renderInput(); });
    $$('.orderbuilt .ow', box).forEach(b => b.onclick = () => { S.order.splice(+b.dataset.k, 1); SND.click(); renderInput(); });
    $('#cast').onclick = () => submit();
    return;
  }
  // getallen: num, rest, time
  const comma = q.kind === 'num' && q.topic.comma !== false && q.comma !== false;
  const extra = q.kind === 'time' ? ':' : comma ? ',' : '';
  box.innerHTML = `<div class="ansrow" id="ansrow"></div>
    <div class="pad">${['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(k => `<button class="key" data-k="${k}">${k}</button>`).join('')}
      <button class="key ${extra ? '' : 'blank'}" data-k="${extra}" ${extra ? '' : 'disabled'}>${extra}</button><button class="key" data-k="0">0</button><button class="key del" data-k="del" aria-label="Wissen">⌫</button></div>
    <button class="btn primary cast" id="cast">${t('cast')}</button>`;
  $$('.key', box).forEach(b => b.onclick = () => pressKey(b.dataset.k));
  $('#cast').onclick = () => submit();
  renderDisplay();
}
function renderDisplay() {
  const q = S.q, I = S.input, row = $('#ansrow'); if (!row) return;
  const cell = (f, val, ph) => `<button class="ansbox ${I.field === f ? 'focus' : ''}" data-f="${f}">${val ? esc(val) : `<span class="ph">${ph}</span>`}${I.field === f ? '<i class="caret"></i>' : ''}</button>`;
  if (q.kind === 'rest') row.innerHTML = `${cell('a', I.a, '?')}<span class="restlbl">rest</span>${cell('r', I.r, '0')}`;
  else row.innerHTML = `${q.prefix ? `<span class="unit">${q.prefix}</span>` : ''}${cell('a', I.a, q.kind === 'time' ? 'uu:mm' : '?')}${q.unit ? `<span class="unit">${q.unit}</span>` : ''}`;
  $$('.ansbox', row).forEach(b => b.onclick = () => { I.field = b.dataset.f; renderDisplay(); });
}
function pressKey(k) {
  if (S.locked) return;
  const I = S.input, f = I.field;
  SND.click();
  if (k === 'del') I[f] = I[f].slice(0, -1);
  else if (k === ',' || k === ':') { if (f === 'a' && !I.a.includes(k) && I.a.length) I.a += k; }
  else if (I[f].length < 9) I[f] += k;
  renderDisplay();
}
document.addEventListener('keydown', e => {
  if (current !== 'quiz' || S.locked || !S.q) return;
  const q = S.q;
  if (e.key === 'Enter') { e.preventDefault(); if ($('#fb').classList.contains('show')) { const n = $('#fbnext'); if (n) n.click(); } else submit(); return; }
  if (!['num', 'rest', 'time'].includes(q.kind)) { if (q.kind === 'choice' && /^[1-4]$/.test(e.key) && +e.key <= q.choices.length) submit(+e.key - 1); return; }
  if (/^\d$/.test(e.key)) pressKey(e.key);
  else if (e.key === 'Backspace') pressKey('del');
  else if ((e.key === ',' || e.key === '.') && q.kind === 'num') pressKey(',');
  else if (e.key === ':' && q.kind === 'time') pressKey(':');
  else if (e.key === 'Tab' && q.kind === 'rest') { e.preventDefault(); S.input.field = S.input.field === 'a' ? 'r' : 'a'; renderDisplay(); }
});

/* ---------- antwoord controleren ---------- */
function parseDec(s) { if (!s) return NaN; s = s.replace(',', '.'); if (!/^\d*\.?\d*$/.test(s) || s === '.') return NaN; return parseFloat(s); }
function parseTime(s) {
  if (!s) return null; let h, m;
  if (s.includes(':')) { const [a, b] = s.split(':'); if (a === '' || !b || b.length !== 2) return null; h = +a; m = +b; }
  else { if (s.length < 3 || s.length > 4) return null; h = +s.slice(0, -2); m = +s.slice(-2); }
  if (isNaN(h) || isNaN(m) || m > 59 || h > 24) return null; return { h, m };
}
function checkAnswer(q, g) {
  switch (q.kind) {
    case 'num': { const v = parseDec(g.a); return !isNaN(v) && Math.abs(v - q.answer) < 1e-6; }
    case 'rest': return /^\d+$/.test(g.a) && +g.a === q.answer.q && (g.r === '' || g.r == null ? 0 : +g.r) === q.answer.r;
    case 'time': { const t = parseTime(g.a); if (!t || t.m !== q.answer.m) return false; return q.twelve ? t.h % 12 === q.answer.h % 12 : t.h % 24 === q.answer.h % 24; }
    case 'choice': return g.choice === q.answer;
    case 'tap': { const s = g.sel || []; return s.length === q.answer.length && q.answer.every(i => s.includes(i)); }
    case 'order': return (g.order || []).join(' ') === q.answer.join(' ');
  }
  return false;
}
function answerText(q) {
  if (q.answerText) return q.answerText;
  switch (q.kind) {
    case 'num': return (q.prefix ? q.prefix + ' ' : '') + fmt(q.answer) + (q.unit ? ' ' + q.unit : '');
    case 'rest': return q.answer.r ? `${q.answer.q} rest ${q.answer.r}` : `${q.answer.q}`;
    case 'time': return tstr(q.answer.h, q.answer.m);
    case 'choice': return q.choices[q.answer];
  }
  return '';
}
function givenText(q, g) {
  if (g.skip) return 'overgeslagen';
  switch (q.kind) {
    case 'num': return (q.prefix ? q.prefix + ' ' : '') + esc(g.a) + (q.unit ? ' ' + q.unit : '');
    case 'rest': return g.r && g.r !== '0' ? `${esc(g.a)} rest ${esc(g.r)}` : esc(g.a);
    case 'time': return esc(g.a);
    case 'choice': return q.choices[g.choice];
    case 'tap': return (g.sel || []).sort((a, b) => a - b).map(i => q.tokens[i].w).join(', ') || '–';
    case 'order': return (g.order || []).join(' ');
  }
  return '';
}
function currentGuess(choiceIdx) {
  const q = S.q;
  if (q.kind === 'choice') return { choice: choiceIdx };
  if (q.kind === 'tap') return { sel: [...S.sel] };
  if (q.kind === 'order') return { order: S.order.map(o => o.w) };
  return { a: S.input.a, r: S.input.r };
}
function submit(choiceIdx) {
  if (S.locked) return;
  const q = S.q, g = currentGuess(choiceIdx);
  if (['num', 'time'].includes(q.kind) && !g.a) { shake($('#ansrow')); return; }
  if (q.kind === 'rest' && !g.a) { shake($('#ansrow')); return; }
  if (q.kind === 'time' && !parseTime(g.a)) { shake($('#ansrow')); toast(t('timeFormat')); return; }
  const ok = checkAnswer(q, g);
  record(q, ok, g); feedback(ok, g, choiceIdx);
}
function skip() { if (S.locked) return; const g = { skip: true }; record(S.q, false, g); feedback(false, g); }
function showHint() {
  const q = S.q; if (!q.hint) return;
  S.hintUsed = true;
  const hb = $('#hintbox'); hb.innerHTML = `<b>${t('how')}</b><br>${q.hint}`; hb.classList.add('show');
  $('#qhint').classList.add('hidden');
}
function record(q, ok, g) {
  S.locked = true; S.answered++;
  const ts = topicStats(q.topic.key);
  ts.answered++; ts.recent.push(ok ? 1 : 0); if (ts.recent.length > 20) ts.recent.shift();
  D.counters.answered++;
  if (ok) {
    S.correct++; S.streak++; ts.correct++; D.counters.correct++;
    if (q.topic.subject === 'papiamentu') D.counters.pap++;
    S.bestStreak = Math.max(S.bestStreak, S.streak); D.counters.bestStreak = Math.max(D.counters.bestStreak, S.streak);
    const base = { easy: 10, medium: 15, hard: 20 }[S.diff];
    S.score += Math.round(base * (S.hintUsed ? .5 : 1)) + (S.streak >= 5 ? 10 : S.streak >= 3 ? 5 : 0);
  } else {
    S.streak = 0; S.wrong.push({ q, g });
    S.wrongByTopic[q.topic.key] = (S.wrongByTopic[q.topic.key] || 0) + 1;
    D.recentWrong = [{ k: q.topic.key, q: strip(q.text).slice(0, 90), a: strip(answerText(q)).slice(0, 40), d: today() }, ...(D.recentWrong || [])].slice(0, 12);
  }
  logDay(Math.min(90, Math.round((Date.now() - (S.qStart || Date.now())) / 1000)), ok);
  srRecord(q, ok);
  if (S.potion && $('#potb')) $('#potb').innerHTML = potionSVG(S.correct / S.count, nextPotion()[1]);
  save();
}
function feedback(ok, g, choiceIdx) {
  const q = S.q, timed = S.mode === 'timed';
  if (q.kind === 'choice') $$('.choice').forEach((b, i) => { b.disabled = true; if (i === q.answer) b.classList.add('right'); else if (i === choiceIdx) b.classList.add('wrong'); });
  if (q.kind === 'tap') $$('.tw').forEach(b => { const i = +b.dataset.t; b.disabled = true; if (q.answer.includes(i)) b.classList.add('right'); else if (S.sel.has(i)) b.classList.add('wrong'); });
  updateBar();
  const chosen = choiceIdx != null ? $$('.choice')[choiceIdx] : null;
  if (ok) {
    SND.ok();
    S.pipMood = 'lach'; pipReact($('#qpip'), 'lach');
    move(chosen || $('#ansrow') || $('.tapzin') || $('.orderbuilt'), 'jelly');
    move($('#qbarfill'), 'jelly', { duration: 420 });
    $('#qme').innerHTML = avatarSVG(look(), 'lach', 'small casting');
    const sb = $('#spellbanner');
    const sm = STREAK_MSG[S.streak];
    sb.innerHTML = `<div class="spellname">✨ ${kies(SPELLS)}</div><div class="praise">${kies(tList(PRAISE, PRAISE_I18N))}${S.hintUsed ? ` <small>${t('withHelp')}</small>` : ''}</div>${sm ? `<div class="streakmsg">${sm}</div>` : ''}`;
    sb.classList.add('show'); sparkleBurst($('#qme'), sm ? 20 : 12, WAND_SPARKS[look().wand]);
    flyTo($('#qme'), $('#qpts').parentNode, '✨');
    const pet = $('.qpet'); if (pet) { pet.classList.remove('hop'); void pet.offsetWidth; pet.classList.add('hop'); }
    const go = () => { sb.classList.remove('show'); sb.onclick = null; clearTimeout(S.autoT); next(); };
    sb.onclick = go;
    S.autoT = setTimeout(go, timed ? 650 : (sm ? 1600 : 1100));
    return;
  }
  SND.boing();
  $('#qme').innerHTML = avatarSVG(look(), 'oeps', 'small');
  S.pipMood = 'oeps'; pipReact($('#qpip'), 'oeps');
  if (chosen) { move(chosen, 'nope'); move($$('.choice')[q.answer], 'jelly', { delay: 260 }); }
  const fb = $('#fb'), [fe, ft] = kies(FAILS);
  $('#quiz').classList.add('showfb');
  if (timed) {
    fb.innerHTML = `<div class="fb-in short"><span class="fb-emo">${fe}</span><div>${t('goodAnsLong')}: <b class="ans">${answerText(q)}</b></div></div>`;
    fb.className = 'fb show bad';
    S.autoT = setTimeout(() => { fb.className = 'fb'; next(); }, 1700);
    return;
  }
  let sugg = '';
  const tk = q.topic.key;
  if (S.wrongByTopic[tk] >= 3 && !S.suggested[tk] && q.topic.lesson) {
    S.suggested[tk] = 1;
    sugg = `<div class="suggest">${pipSVG('blij', 'tiny')}<div><b>Pip:</b> ${t('suggestQ', { t: tTopic(q.topic) })}<div class="sbtns"><button class="btn small" id="fblesson">${t('toLesson')}</button></div></div></div>`;
  }
  fb.innerHTML = `<div class="fb-in"><div class="fb-fun">${D.settings.jokes ? `<span class="fb-emo">${fe}</span><span>${ft}</span>` : `<span class="fb-emo">💫</span><span>${t('almost')}</span>`}</div>
    <div class="fb-comfort">${kies(tList(COMFORT, COMFORT_I18N))}</div>
    <div class="fb-ans">${g.skip ? '' : `${t('youSaid')}: <s>${givenText(q, g)}</s> · `}${t('goodAns')}: <b class="ans">${answerText(q)}</b></div>
    <div class="fb-exp">${q.explain || ''}</div>${sugg}
    <button class="btn primary" id="fbnext">${S.mode === 'practice' && S.i >= S.count ? t('toResults') : t('nextQ')}</button></div>`;
  fb.className = 'fb show bad';
  move($('.fb-in', fb), 'inUp');
  $('#fbnext').onclick = () => { fb.className = 'fb'; next(); };
  if ($('#fblesson')) $('#fblesson').onclick = () => { pause(); openLesson(tk, 0, 'quiz'); };
  setTimeout(() => fb.scrollIntoView({ behavior: D.settings.anim ? 'smooth' : 'auto', block: 'nearest' }), 50);
}
function returnToQuiz() { show('quiz'); resume(); }
function askStop() {
  pause();
  modal(`<div class="m-ico">${pipSVG('oeps')}</div><h2>${t('stopQ')}</h2><p>${t('stopSub')}</p>`,
    [{ label: t('goOn'), cls: 'primary', fn: resume }, { label: t('stop'), cls: 'ghost', fn: () => { stopTimer(); clearTimeout(S.autoT); S.answered ? finish(true) : S.potion ? openMap() : openClass(S.subject); } }]);
}

/* ---------- uitslag ---------- */
function resultStars() {
  const acc = S.answered ? S.correct / S.answered : 0;
  if (S.mode === 'practice') return acc >= .9 ? 3 : acc >= .7 ? 2 : acc >= .5 ? 1 : 0;
  const pace = isMix(S.topicKey) ? 5 : TOPIC[S.topicKey].pace[S.diff], target = pace * S.duration / 60;
  if (acc < .6) return S.correct >= 1 ? 1 : 0;
  return S.correct >= target ? 3 : S.correct >= target * .66 ? 2 : S.correct >= target * .33 ? 1 : 0;
}
function finish(stopped = false) {
  stopTimer(); clearTimeout(S.autoT); S.locked = true;
  const stars = resultStars(), key = highKey(), prev = D.highs[key] || 0, isRecord = S.score > prev && S.score > 0;
  if (isRecord) D.highs[key] = S.score;
  let earned = S.correct + [0, 2, 5, 10][stars] + (isRecord && prev > 0 ? 5 : 0);
  if (stopped && S.answered < 3) earned = S.correct;
  D.counters.quizzes++;
  if (S.mode === 'timed') D.counters.timed++;
  if (S.mode === 'practice' && S.count >= 10 && S.correct === S.count) D.counters.perfect++;
  if (S.diff === 'hard' && stars === 3 && !S.potion) D.counters.hard3++;
  if (!isMix(S.topicKey) && !S.potion) { const ts = topicStats(S.topicKey); ts.quizzes++; ts.best = Math.max(ts.best || 0, stars); }
  let potion = null;
  if (S.potion && !stopped) { potion = potionComplete(); if (potion.bonus) earned += potion.bonus; }
  let newJoke = null;
  if (stars >= 2 && D.jokes.length < JOKES.length) { const free = JOKES.map((_, i) => i).filter(i => !D.jokes.includes(i)); const j = kies(free); D.jokes.push(j); newJoke = JOKES[j]; }
  save(); addStars(earned);
  const newBadges = checkBadges(true);
  renderResults({ stars, earned, isRecord, prev, newJoke, newBadges, stopped, potion });
  setTimeout(() => checkUnlocks(), 900);
}
function renderResults(r) {
  const s = subjOf(), el = $('#results'), acc = S.answered ? Math.round(S.correct / S.answered * 100) : 0, P = r.potion;
  const title = t('r' + r.stars);
  const pipsay = t(r.stars === 3 ? 'pip3' : r.stars >= 1 ? 'pip1' : 'pip0');
  const weakTopic = Object.entries(S.wrongByTopic).sort((a, b) => b[1] - a[1])[0];
  const suggestLesson = (acc < 60 || (weakTopic && weakTopic[1] >= 3)) && weakTopic && TOPIC[weakTopic[0]].lesson;
  el.innerHTML = backbar(t('results')) + `<div class="wrap narrow" style="--sc:${s.color};--sl:${s.light};--sd:${s.dark}">
    <div class="res card">
      <div class="res-art">${avatarSVG(look(), r.stars >= 2 ? 'lach' : 'blij')}${look().pet !== 'geen' ? petSVG(look().pet, 'res-pet') : ''}</div>
      <h2>${title}</h2>
      <div class="bigstars">${[1, 2, 3].map(i => `<span class="${i <= r.stars ? 'on' : ''}" style="--d:${i * 220}ms">${STARICO(i <= r.stars)}</span>`).join('')}</div>
      <div class="res-grid"><div><b data-n="${S.correct}">${S.correct}</b><span>${t('ofRight', { n: S.answered })}</span></div><div><b data-n="${S.score}">${S.score}</b><span>${t('points')}</span></div><div><b data-n="${S.bestStreak}">${S.bestStreak}</b><span>${t('bestStreak')}</span></div><div class="gold"><b data-n="${r.earned}" data-pre="+">+${r.earned}</b><span>${t('magicStars')}</span></div></div>
      ${P && !P.again ? `<div class="potdone">${potionSVG(1, POTIONS[P.potion][1], 'big')}<div><b>${t('potReady', { p: potionName(P.potion) })}</b><br>🔥 ${streakTxt(P.streak)}${P.warm ? `<br><small>${t('potWarm')}</small>` : ''}</div></div>` : ''}
      ${P && P.again ? `<div class="potdone"><div>${t('potExtra')}</div></div>` : ''}
      ${r.isRecord && !S.potion ? `<div class="banner">${t('newRecord')} ${r.prev ? `(${t('was')} ${r.prev})` : ''}</div>` : ''}
      <div class="pipline">${pipSVG(r.stars >= 2 ? 'lach' : 'blij', 'tiny')}<span>${pipsay}</span></div>
      ${r.newJoke ? `<div class="newjoke"><b>${t('newJoke')}</b><br>${r.newJoke[0]}<br><i>${r.newJoke[1]}</i></div>` : ''}
      ${r.newBadges.length ? `<div class="newbadges">${r.newBadges.map(b => `<div class="badge on"><span>${b[1]}</span><b>${b[2]}</b><small>${b[3]}</small></div>`).join('')}</div>` : ''}
      ${suggestLesson ? `<div class="suggest">${teacherSVG(s.teacher, 'tiny')}<div><b>${s.teacherName}:</b> ${t('weakLesson', { t: tTopic(TOPIC[weakTopic[0]]) })}<div class="sbtns"><button class="btn small" id="reslesson">${t('toLesson')}</button></div></div></div>` : ''}
    </div>
    ${S.wrong.length ? `<h3 class="sect">${t('trickyOnes')}</h3><div class="review">${S.wrong.map(({ q, g }) => `<details class="rv card"><summary><span class="rv-q">${q.topic.ico} ${q.text}</span><span class="rv-a">${g.skip ? '' : `<span class="rv-you">✗ ${t('youSaid')}: ${givenText(q, g)}</span>`}<span class="rv-ok">✓ ${t('goodAns')}: ${answerText(q)}</span></span></summary>
      ${q.visual && !q.long ? `<div class="rv-vis">${q.visual}</div>` : ''}<div class="rv-exp">${q.explain || ''}</div></details>`).join('')}</div>` : (S.answered ? `<div class="allgood card">${t('allRight')}</div>` : '')}
    <div class="res-btns">${S.potion ? `<button class="btn primary" data-act="map">${t('schoolMap')}</button>` : `<button class="btn primary" id="again">${t('again')}</button><button class="btn ghost" id="toclass">${t('place_' + S.subject)}</button><button class="btn ghost" data-act="map">${t('schoolMap')}</button>`}</div></div>`;
  bindCommon(el);
  if ($('#again')) $('#again').onclick = () => openSetup(S.topicKey);
  if ($('#toclass')) $('#toclass').onclick = () => openClass(S.subject);
  if ($('#reslesson')) $('#reslesson').onclick = () => openLesson(weakTopic[0], 0, 'class');
  show('results');
  move($('.res', el), 'inUp');
  // sterren ploppen één voor één, elk met een eigen toontje
  $$('.bigstars .on', el).forEach((sp, i) => {
    const at = 320 + i * 300; move(sp, 'starIn', { delay: at });
    setTimeout(() => { if (!sp.isConnected) return; sparkleBurst(sp, 6); tone([660 + i * 200], .12, 'triangle', .05); }, at + 330);
  });
  if (r.stars >= 2) move($('.pipline .pip', el), 'dance', { delay: 1300 });
  $$('.res-grid b[data-n]', el).forEach((b, i) => setTimeout(() => countUp(b, +b.dataset.n), 150 + i * 120));
  if (r.stars >= 2) { setTimeout(() => { confetti(r.stars === 3 ? 180 : 90); SND.fanfare(); }, 300); }
}

/* ---------- prijzen: badges en nieuwe delen van de school ---------- */
const BADGES = [
  ['eerste', '🎓', 'Eerste spreuk', 'Maak je eerste quiz af', d => d.counters.quizzes >= 1],
  ['tien', '📚', 'Ijverige leerling', 'Maak 10 quizzen af', d => d.counters.quizzes >= 10],
  ['vijftig', '🏅', 'Toverstudent', 'Maak 50 quizzen af', d => d.counters.quizzes >= 50],
  ['honderd', '💯', 'Honderd!', 'Beantwoord 100 vragen goed', d => d.counters.correct >= 100],
  ['vijfhonderd', '🌟', 'Sterrenregen', 'Beantwoord 500 vragen goed', d => d.counters.correct >= 500],
  ['duizend', '👑', 'Koningin van de kennis', 'Beantwoord 1000 vragen goed', d => d.counters.correct >= 1000],
  ['reeks10', '🔥', 'Vuurspreuk', '10 goed op een rij', d => d.counters.bestStreak >= 10],
  ['reeks20', '☄️', 'Komeet', '20 goed op een rij', d => d.counters.bestStreak >= 20],
  ['perfect', '💎', 'Foutloos', 'Een quiz van 10+ vragen helemaal goed', d => d.counters.perfect >= 1],
  ['perfect5', '💠', 'Diamanten brein', '5 foutloze quizzen', d => d.counters.perfect >= 5],
  ['drie', '🧭', 'Ontdekkingsreiziger', 'Oefen in alle drie de klassen', d => Object.keys(d.subjectsTried).length >= 3],
  ['les1', '📖', 'Leergierig', 'Maak je eerste les af', d => Object.keys(d.lessons).length >= 1],
  ['les10', '🦉', 'Wijze uil', 'Maak 10 lessen af', d => Object.keys(d.lessons).length >= 10],
  ['tijd', '⏱️', 'Bliksemspreuk', 'Speel een quiz op tijd', d => d.counters.timed >= 1],
  ['dagen3', '📅', 'Drie dagen', '3 dagen achter elkaar geoefend', () => dayStreak() >= 3],
  ['dagen7', '🗓️', 'Weekheld', '7 dagen achter elkaar geoefend', () => dayStreak() >= 7],
  ['huisdier', '🐾', 'Dierenvriend', 'Neem een magisch huisdier', d => d.owned.pet.length > 1],
  ['mode', '👗', 'Modetovenaar', 'Koop 5 spullen', d => d.counters.purchases >= 5],
  ['match', '🧩', 'Matchmaker', 'Maak het woordjes-matchspel af', d => (d.games.match || {}).wins >= 1],
  ['memory', '🃏', 'Geheugenkampioen', 'Maak memory af', d => (d.games.memory || {}).wins >= 1],
  ['bellen', '🫧', 'Bellenblazer', 'Haal 15 punten bij Toverbellen', d => (d.games.bellen || {}).best >= 15],
  ['papi', '🏝️', 'Dushi!', 'Beantwoord 50 Papiamentu-vragen goed', d => d.counters.pap >= 50],
  ['meester', '🧙', 'Meester-tovenaar', 'Haal 3 sterren op Moeilijk', d => d.counters.hard3 >= 1],
  ['grappen', '😂', 'Grapjas', 'Verzamel 10 grapjes', d => d.jokes.length >= 10]
];
function checkBadges(silent) {
  const got = [];
  for (const b of BADGES) if (!D.badges[b[0]] && b[4](D)) { D.badges[b[0]] = Date.now(); got.push(b); }
  if (got.length) { save(); if (!silent) got.forEach(b => toast(`${b[1]} ${t('newBadge')}: <b>${b[2]}</b>!`)); }
  return got;
}
const GIFTS = { tuin: ['wand', 'regenboog', 'Regenboogstaf'], feest: ['hat', 'kroon', 'Sterrenkroon'] };
function checkUnlocks(silent) {
  const fresh = PLACES.filter(p => p.need > 0 && placeOpen(p) && !D.unlocked.includes(p.id));
  if (!fresh.length) return;
  fresh.forEach(p => {
    D.unlocked.push(p.id);
    const g = GIFTS[p.id]; if (g && !D.owned[g[0]].includes(g[1])) D.owned[g[0]].push(g[1]);
  });
  save();
  if (silent) return;
  const p = fresh[fresh.length - 1], g = GIFTS[p.id];
  SND.fanfare(); confetti(120);
  modal(`<div class="m-art unlock">${placeArt(p.id)}</div><h2>${t('newPlace')}</h2><p>${t('placeOpenNow', { p: p.name })} ${p.sub}.${g ? `<br>${t('giftReady', { g: g[2] })}` : ''}</p>`,
    [{ label: t('goLook'), cls: 'primary', fn: () => p.open() }, { label: t('later'), cls: 'ghost' }]);
}
