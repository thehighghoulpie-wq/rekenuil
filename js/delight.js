'use strict';
/* =====================================================================
   Plezier en gevoel (Update 5)
   Pip met veel gezichtjes en een mond die praat, bliksem bij 5 en 10 goed,
   tonen die steeds hoger klinken, labeltjes bij vragen, voortgangsbalk met
   glinsters, zacht trillen, uitdagingsmodus, de cast viert mee, een teller
   die oprolt, figuurtjes op de kaart, feestdagen, geheimpjes, een welkom,
   voorlezen en de Toverspiegel 3.0.
   Alles positief: een reeks die breekt geeft nooit straf.
   ===================================================================== */
// tekst in de taal van de app: [nl, pap, en]; zonder vertaling valt hij terug op Nederlands
const tri = a => (a && (a[LANGI[lang()]] || a[0])) || '';

/* ---------- geluid en trillen ---------- */
function buzz(p) { try { if (D.settings.vibrate && navigator.vibrate) navigator.vibrate(p); } catch (e) { } }
// elk goed antwoord op rij klinkt een stapje hoger (do-re-mi), tot 8 stappen
function okTone(n) {
  const step = [0, 2, 4, 5, 7, 9, 11, 12][Math.max(0, Math.min(n, 8) - 1)], f = 523 * Math.pow(2, step / 12);
  tone([f, f * 1.26, f * 1.5], .09, 'triangle', .06);
}
function pipTalk(box, ms = 1400) {
  const p = box && (box.classList && box.classList.contains('pip') ? box : box.querySelector && box.querySelector('.pip'));
  if (!p) return; p.classList.add('talk'); clearTimeout(p._talk); p._talk = setTimeout(() => p.classList.remove('talk'), ms);
}
function pipJoyMood() {
  if (S.streak >= 10) return 'cool';
  if (S.streak === 5) return 'wow';
  return kies(['lach', 'lach', 'hart', 'dans', 'trots', 'wow']);
}

/* ---------- quiz: bliksem, labels, balk ---------- */
function zap(text) {
  const q = $('#quiz'); if (!q) return;
  const z = document.createElement('div'); z.className = 'zap'; z.innerHTML = `<span class="zap-bolt">⚡</span><b>${text}</b>`;
  q.appendChild(z); setTimeout(() => z.remove(), 1800);
  tone([523, 659, 784, 1047, 1319], .07, 'square', .035);
}
function barMilestone() {
  if (S.mode !== 'practice' || !S.count) return;
  const q4 = Math.floor(S.answered / S.count * 4);
  if (q4 <= (S.lastQ4 || 0)) return;
  S.lastQ4 = q4;
  const bar = $('.qbar'); if (!bar) return;
  bar.classList.remove('shine'); void bar.offsetWidth; bar.classList.add('shine');
  sparkleBurst(bar, 6); tone([587 + q4 * 110], .1, 'sine', .045);
}
function delightCorrect(chosen) {
  okTone(S.streak); buzz(12); barMilestone();
  if (S.streak === 5) zap(t('zap5'));
  if (S.streak === 10) zap(t('zap10'));
  if (S.streak >= 5 && D.quests) D.quests.s5 = 1;
  if (S.qLabel === 'again') { const sb = $('#spellbanner'); if (sb) sb.insertAdjacentHTML('beforeend', `<div class="streakmsg">💪 ${t('lblAgainOk')}</div>`); }
}
function delightWrong() { buzz([8, 40, 8]); barMilestone(); }
const COACH_LINES = [['Jij kan dit!', 'Bo por!', 'You can do this!'], ['Rustig lezen, dan pas rekenen.', 'Lesa trankil, despues kalkulá.', 'Read calmly, then work it out.'],
  ['Moeilijk is goed: zo groeit je brein.', 'Difísil ta bon: asina bo sesu ta krese.', 'Hard is good: that is how your brain grows.'], ['Een fout mag. Proberen is toveren!', 'Un eror por. Purba ta hasi magia!', 'Mistakes are fine. Trying is magic!']];
function quizLabel(q) {
  stopSpeech();
  if (S.i === 1) S.lastQ4 = 0;
  if (window.scrollY > 0) window.scrollTo(0, 0);   // na de uitleg van een fout weer bovenaan beginnen
  const txt = strip(q.text).slice(0, 90), qe = S.queue && S.queue[S.i - 1];
  let lab = '';
  if ((qe && qe.item != null) || (D.recentWrong || []).some(w => w.q === txt)) lab = 'again';
  else if (!S.potion && !(D.topics[q.topic.key] && D.topics[q.topic.key].answered)) lab = 'new';
  else if (S.diff === 'hard') lab = 'spicy';
  S.qLabel = lab;
  const names = { again: '🔁 ' + t('lblAgain'), new: '✨ ' + t('lblNew'), spicy: '🌶️ ' + t('lblSpicy') };
  const top = $('#qtopic');
  if (lab) top.insertAdjacentHTML('beforeend', ` <span class="qlabel ql-${lab}">${names[lab]}</span>`);
  if (S.challenge) top.insertAdjacentHTML('beforeend', `<div class="coach">${teacherSVG('dax', 'tiny')}<span>${tri(kies(COACH_LINES))}</span></div>`);
  // voorlezen: lange teksten, vragen met een eigen voorleestekst en alles voor groep 1-3
  const readTxt = q.say || strip(q.text);
  if ((q.long || q.say || D.grade <= 3) && canRead()) {
    if (!$('#qread')) $('.qhelp').insertAdjacentHTML('afterbegin', `<button class="btn small ghost" id="qread">🔊 ${t('readAloud')}</button>`);
    $('#qread').onclick = () => speakNL(readTxt);
    if (D.grade <= 2 && !S.challenge) setTimeout(() => { if (S.q === q && current === 'quiz') speakNL(readTxt); }, 400);   // kleuters: vanzelf voorlezen
  } else if ($('#qread')) $('#qread').remove();
}

/* ---------- uitdagingsmodus: zelf gekozen, met Dax ---------- */
function challengeHTML() {
  return `<button class="opt chall ${S.challenge ? 'on' : ''}" id="chall"><span class="o-ico">🌶️🦉</span><b>${t('challT')}</b><small>${t('challS')}</small></button>`;
}
function challengeBonus() {
  S.challengeWon = false;
  if (!S.challenge || S.potion || !S.answered) return 0;
  S.challengeWon = S.correct / S.answered >= .7;
  if (S.challengeWon) D.counters.challenge++;
  return S.challengeWon ? 5 : 0;
}

/* ---------- uitslag: perfecte les, uitdaging en de cast viert mee ---------- */
const CAST = [['pet', 'kat', 'Miepie'], ['pet', 'flamingo', 'Flip'], ['pet', 'leguaan', 'Luna'], ['pet', 'uil', 'Hoepla'], ['pet', 'schildpad', 'Turbo'],
  ['pet', 'wolk', 'Pluis'], ['teacher', 'kiko', 'Professor Kiko'], ['teacher', 'maanlicht', 'Juf Maanlicht'], ['teacher', 'yuana', 'Shon Yuana'], ['teacher', 'nova', 'Nova'], ['teacher', 'dax', 'Dax']];
const CHEERS = [['Hoera!', 'Hurá!', 'Hooray!'], ['Wat knap!', 'Bon hasi!', 'So clever!'], ['Ik ben trots op je!', null, 'I am proud of you!'], ['Feest!', 'Fiesta!', 'Party!']];
function resultsExtras(el, r) {
  const res = $('.res', el); if (!res) return;
  if (S.answered >= 5 && S.correct === S.answered) {
    $('h2', res).insertAdjacentHTML('afterend', `<div class="banner zapb">⚡ ${t('perfect')}</div>`);
    setTimeout(() => tone([523, 659, 784, 1047, 1319, 1568], .08, 'square', .035), 500);
    const pp = $('.pipline .pip', el); if (pp) pp.outerHTML = pipSVG('cool', 'tiny');
  }
  if (S.challengeWon) $('h2', res).insertAdjacentHTML('afterend', `<div class="banner">🌶️ ${t('challWon')}</div>`);
  if (r.stars >= 1) {
    const c = CAST[D.counters.quizzes % CAST.length], art = c[0] === 'pet' ? petSVG(c[1], 'cast-cheer') : teacherSVG(c[1], 'cast-cheer');
    const box = $('.res-art', el);
    if (box) { box.insertAdjacentHTML('beforeend', `<div class="castbox">${art}<span class="bubble small">${c[2]}: ${tri(kies(CHEERS))}</span></div>`); move($('.castbox .cast-cheer', el), 'dance', { delay: 1000 }); }
  }
  if (typeof questsCheck === 'function') setTimeout(() => { questsCheck(); stickersCheck(); costumeCheck(); }, 1400);
}

/* ---------- de sterrenteller rolt op als een kilometerteller ---------- */
updateStarCount = function () {
  $$('.starcount').forEach(e => {
    const from = parseInt(e.textContent, 10) || 0, to = D.stars;
    if (from === to || !motionOK()) { e.textContent = to; return; }
    const pill = e.closest('.pill'); if (pill) { pill.classList.remove('roll'); void pill.offsetWidth; pill.classList.add('roll'); }
    const t0 = performance.now(), ms = 650;
    (function f(now) { const p = Math.min(1, (now - t0) / ms); e.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
    setTimeout(() => { e.textContent = D.stars; }, ms + 150);
  });
};

/* ---------- voorlezen (spraak van de tablet zelf) ---------- */
/* Voorlezen gebruikt alleen stemmen die op het apparaat zelf draaien (localService).
   Online stemmen (zoals "Google Nederlands" in Chrome op de pc) sturen de tekst naar Google of Microsoft:
   dat mag niet (regel: data blijft op het apparaat). Is er geen lokale Nederlandse stem, dan zwijgt de app en legt het uit. */
function pickNlVoice() {
  const ss = window.speechSynthesis; if (!ss) return null;
  const score = v => (/natural|neural|enhanced|premium|hq|wavenet/i.test(v.name) ? 4 : 0) + (/^nl[-_]NL$/i.test(v.lang) ? 2 : 0) + (v.default ? 1 : 0);
  return ss.getVoices().filter(v => /^nl([-_]|$)/i.test(v.lang) && v.localService === true).sort((a, b) => score(b) - score(a))[0] || null;
}
// is voorlezen mogelijk? (de lijst met stemmen laadt soms pas later: dan laten we de knop staan)
function canRead() { const ss = window.speechSynthesis; return !!ss && (ss.getVoices().length === 0 || !!pickNlVoice()); }
function stopSpeech() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { } $$('.talking').forEach(x => x.classList.remove('talking')); }
function speakNL(txt, el) {
  try {
    const ss = window.speechSynthesis; if (!ss || !txt) return;
    const v = pickNlVoice();
    if (!v) { toast(t('noLocalVoice'), 4500); return; }
    ss.cancel();
    const u = new SpeechSynthesisUtterance(txt); u.voice = v; u.lang = v.lang; u.rate = .9;
    if (el) { el.classList.add('talking'); u.onend = u.onerror = () => el.classList.remove('talking'); }
    ss.speak(u);
  } catch (e) { }
}
function lessonShown(el, st) {
  stopSpeech();
  const tch = $('.l-head .teacher', el);
  if (tch) { tch.classList.add('talking'); setTimeout(() => tch.classList.remove('talking'), 1300); }
  if (!canRead()) return;
  $('.l-head', el).insertAdjacentHTML('beforeend', `<button class="iconbtn readbtn" id="lread" aria-label="${t('readAloud')}">🔊</button>`);
  $('#lread').onclick = () => speakNL(`${st.t || ''}. ${strip(st.h || '')}`, tch);
}

/* ---------- de schoolkaart: figuurtjes, feestdagen, geheimpjes ---------- */
const MAPCAST = {
  day: [['leguaan', 'Luna', 'sun', 'left:3%;bottom:23%'], ['kat', 'Miepie', 'nap', 'left:21%;top:18%'], ['flamingo', 'Flip', 'wade', 'right:3%;bottom:1%'],
    ['schildpad', 'Turbo', 'walk', 'left:13%;bottom:22%'], ['uil', 'Hoepla', 'read', 'right:17%;top:16%']],
  night: [['uil', 'Hoepla', 'hoot', 'left:21%;top:17%'], ['kat', 'Miepie', 'stars', 'right:16%;top:17%'], ['wolk', 'Pluis', 'float', 'left:48%;top:4%'], ['leguaan', 'Luna', 'nap', 'left:3%;bottom:23%']]
};
const ACT_EMO = { sun: '😎', nap: '💤', read: '📖', hoot: '🌙', stars: '✨' };
const MAPLINES = {
  leguaan: [['Lekker in de zon liggen…', null, 'Lovely sunbathing…'], ['Dushi warm vandaag!', null, 'Nice and warm today!']],
  kat: [['Zzz… ik droom van sterren.', null, 'Zzz… dreaming of stars.'], ['Miauw! Kijk eens hoe hoog ik zit!', null, 'Meow! Look how high I am!']],
  flamingo: [['Ik sta op één been. Kun jij dat ook?', null, 'I stand on one leg. Can you?'], ['Het water is lekker koel!', null, 'The water is nice and cool!']],
  schildpad: [['Ik loop naar de brug. Rustig aan!', null, 'I am walking to the bridge. Slowly!'], ['Langzaam kom je er ook!', null, 'Slow and steady!']],
  uil: [['Ik lees een boek over toverspreuken.', null, 'I am reading a book of spells.'], ['Hoe-hoe! Mooie nacht, hè?', null, 'Hoo-hoo! Lovely night, right?']],
  wolk: [['Ik zweef over de haven.', null, 'I float over the harbour.'], ['Wil je een regenboogje?', null, 'Want a little rainbow?']]
};
function mapCastHTML() {
  const night = document.body.classList.contains('dark'), list = MAPCAST[night ? 'night' : 'day'];
  const d = new Date(), seed = d.getDate() + d.getMonth() * 31;
  const pick = list.map((x, i) => [x, (i * 7 + seed) % list.length]).sort((a, b) => a[1] - b[1]).slice(0, 3).map(x => x[0]);
  return `<div class="mapcast">${pick.map(([id, name, act, pos]) => `<button class="mc-actor act-${act}" style="${pos}" data-cast="${id}" data-name="${name}" aria-label="${name}">${petSVG(id)}${ACT_EMO[act] ? `<span class="mc-emo">${ACT_EMO[act]}</span>` : ''}</button>`).join('')}</div>`;
}
function easterDay(y) {   // paasdatum (Gregoriaanse berekening)
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, mo - 1, da);
}
const HOLIDAYS = {
  nieuwjaar: ['🎆', ['Gelukkig nieuwjaar!', 'Felis Aña Nobo!', 'Happy New Year!'], '🎆✨🎇✨🎆'],
  karnaval: ['🎭', ['Het is Karnaval!', 'Ta Karnaval!', 'It is Carnival!'], '🎭🎉🪅🎉🎭'],
  seu: ['🌾', ['Vandaag is het Seú, het oogstfeest!', 'Awe ta Seú!', 'Today is Seú, the harvest festival!'], '🌾🥁🌽🥁🌾'],
  koningsdag: ['👑', ['Fijne Koningsdag!', null, 'Happy King’s Day!'], '🧡👑🧡👑🧡'],
  bandera: ['🇨🇼', ['Dag van het volkslied en de vlag van Curaçao!', 'Dia di Himno i Bandera!', 'Curaçao Flag and Anthem Day!'], '💙💛💙💛💙'],
  korsou: ['🇨🇼', ['Fijne Dia di Kòrsou!', 'Felis Dia di Kòrsou!', 'Happy Curaçao Day!'], '💙⭐💛⭐💙'],
  sinterklaas: ['🎁', ['Sinterklaas komt eraan!', null, 'Sinterklaas is coming!'], '🎁🍪🐴🍪🎁'],
  kerst: ['🎄', ['Fijne kerst!', 'Bon Pasku!', 'Merry Christmas!'], '🎄⭐🎁⭐🎄'],
  oudjaar: ['🎇', ['Oudjaarsavond: morgen een nieuw jaar!', null, 'New Year’s Eve!'], '🎇✨🎆✨🎇']
};
function holidayToday(d = new Date()) {
  const y = d.getFullYear(), md = (d.getMonth() + 1) * 100 + d.getDate();
  const day0 = new Date(y, d.getMonth(), d.getDate()), fromEaster = Math.round((day0 - easterDay(y)) / 864e5);
  const king = new Date(y, 3, 27).getDay() === 0 ? 426 : 427;
  if (md === 101) return 'nieuwjaar';
  if (fromEaster >= -56 && fromEaster <= -47) return 'karnaval';   // de week voor Aswoensdag, met de Gran Marcha
  if (fromEaster === 0 || fromEaster === 1) return 'seu';           // Seú is op tweede paasdag
  if (md === king) return 'koningsdag';
  if (md === 702) return 'bandera';
  if (md === 1010) return 'korsou';
  if (md >= 1201 && md <= 1205) return 'sinterklaas';
  if (md >= 1224 && md <= 1226) return 'kerst';
  if (md === 1231) return 'oudjaar';
  return '';
}
function onMapShown(el) {
  const scene = $('.scene', el); if (!scene) return;
  // feestdag
  const hd = holidayToday();
  if (hd) {
    const [emo, txt, deco] = HOLIDAYS[hd];
    scene.insertAdjacentHTML('beforeend', `<div class="festoon" aria-hidden="true">${deco.repeat(3)}</div>`);
    $('.hero-row', el).insertAdjacentHTML('beforebegin', `<div class="holiday card">${emo} <b>${tri(txt)}</b></div>`);
    if (hd === 'nieuwjaar' || hd === 'oudjaar' || hd === 'korsou') setTimeout(() => confetti(90), 600);
  }
  // figuurtjes langs de haven
  scene.insertAdjacentHTML('beforeend', mapCastHTML());
  $$('.mc-actor', scene).forEach(b => b.onclick = e => {
    e.stopPropagation(); SND.pop(); move(b, 'hop'); sparkleBurst(b, 6);
    $('#pipsay').innerHTML = `<b>${b.dataset.name}:</b> ${tri(kies(MAPLINES[b.dataset.cast]))}`; move($('#pipsay'), 'pop');
  });
  // dagopdrachtjes onder de toverdrank
  if (typeof questCardHTML === 'function') { const pc = $('.potcard', el) || $('.hero-row', el); pc.insertAdjacentHTML('afterend', questCardHTML()); }
  // Pip praat als hij iets zegt
  pipTalk($('#pipjoke')); $('#pipjoke').addEventListener('click', () => setTimeout(() => pipTalk($('#pipjoke'), 1800), 30));
  // geheimpje: tik 7 keer snel op Pip
  let taps = 0, tapT = 0;
  $('#pipjoke').addEventListener('click', () => {
    const now = Date.now(); taps = now - tapT < 3000 ? taps + 1 : 1; tapT = now;
    if (taps === 7) {
      taps = 0; const p = $('#pipjoke .pip'); if (p) { p.classList.remove('superspin'); void p.getBoundingClientRect(); p.classList.add('superspin'); }
      confetti(80); tone([523, 784, 1047, 1568], .1, 'triangle', .05); toast('🐉 ' + t('secretPip'), 3500);
      if (!D.counters.secret) { D.counters.secret = 1; save(); }
    }
  });
  // je eigen tovenaar draait een rondje als je 5 keer tikt
  let mt = 0, mtT = 0;
  $('#meact').addEventListener('click', () => {
    const now = Date.now(); mt = now - mtT < 2500 ? mt + 1 : 1; mtT = now;
    if (mt === 5) { mt = 0; const a = $('#meact .avatar'); if (a) { a.classList.remove('twirl'); void a.getBoundingClientRect(); a.classList.add('twirl'); } sparkleBurst($('#meact'), 16, glitterSyms()); }
  });
  // tik in de lucht: een wolkje "poef"
  scene.addEventListener('click', e => {
    if (e.target.closest('button')) return;
    const r = scene.getBoundingClientRect(), s = document.createElement('span');
    s.className = 'poof'; s.textContent = kies(['☁️', '💨', '✨', '⭐']); s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
    scene.appendChild(s); setTimeout(() => s.remove(), 900); tone([880, 1175], .05, 'sine', .03);
  });
  // tik op je sterren
  $$('.pill.star', el).forEach(p => p.addEventListener('click', () => { sparkleBurst(p, 8); p.classList.remove('roll'); void p.offsetWidth; p.classList.add('roll'); }));
  if (typeof questsCheck === 'function') setTimeout(() => { questsCheck(); stickersCheck(); costumeCheck(); }, 700);
  if (!D.toured) setTimeout(startTour, 900);
}

/* ---------- welkom: Pip laat de school zien (één keer) ---------- */
function startTour() {
  if (current !== 'map' || D.toured) return;
  const steps = [['.potcard', 'tour1'], ['.questcard', 'tour2'], ['.map .place', 'tour3'], ['#meact', 'tour4']].filter(([s]) => $(s));
  let i = 0;
  const card = document.createElement('div'); card.className = 'tourcard card';
  document.body.appendChild(card);
  const end = () => { $$('.tourspot').forEach(x => x.classList.remove('tourspot')); card.remove(); D.toured = 1; save(); };
  const draw = () => {
    $$('.tourspot').forEach(x => x.classList.remove('tourspot'));
    if (i >= steps.length || current !== 'map') return end();
    const tg = $(steps[i][0]); tg.classList.add('tourspot'); tg.scrollIntoView({ behavior: D.settings.anim ? 'smooth' : 'auto', block: 'center' });
    card.innerHTML = `${pipSVG('zwaai', 'tiny')}<div><p>${t(steps[i][1])}</p><div class="sbtns"><button class="btn small primary" id="tnext">${i < steps.length - 1 ? t('next') : t('letsGo')}</button><button class="btn small ghost" id="tskip">${t('tourSkip')}</button></div></div>`;
    pipTalk(card, 1600); move(card, 'inUp');
    $('#tnext', card).onclick = () => { SND.click(); i++; draw(); };
    $('#tskip', card).onclick = end;
  };
  draw();
}

/* ---------- Toverspiegel 3.0 ---------- */
let spiegelMood = 'blij';
const GLITTER_SYMS = { goud: ['✨', '⭐', '🌟', '💫'], roze: ['💖', '🌸', '💗', '✨'], blauw: ['💙', '🫧', '💎', '✨'], regenboog: ['🌈', '✨', '💫', '🦄'] };
function glitterSyms() { const L = look(); return GLITTER_SYMS[L.glitter] || WAND_SPARKS[L.wand]; }
function spiegelPoof(root) {
  const p = $('.ward-prev', root); if (!p) return;
  const L = Object.assign({}, DEFAULT_LOOK, (root === $('#intro') ? introLook : look()));
  sparkleBurst(p, 10, GLITTER_SYMS[L.glitter] || WAND_SPARKS[L.wand]);
  const a = $('.avatar', p); if (a) move(a, 'jelly');
  if (motionOK()) { const s = document.createElement('span'); s.className = 'poofcloud'; s.textContent = '💨'; p.appendChild(s); setTimeout(() => s.remove(), 700); }
}
function spiegelPose(root, pose) {
  const a = $('.ward-prev .avatar', root); if (!a) return;
  SND.pop(); a.classList.remove('pose-zwaai', 'pose-spring', 'pose-draai', 'pose-pose'); void a.getBoundingClientRect(); a.classList.add('pose-' + pose);
  if (pose === 'pose') sparkleBurst($('.ward-prev', root), 12, glitterSyms());
}
// de ogen kijken naar je vinger
function spiegelBind(root) {
  const p = $('.ward-prev', root); if (!p || !motionOK()) return;
  p.addEventListener('pointermove', e => {
    const r = p.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .35;
    $$('.eyes', p).forEach(g => g.setAttribute('transform', `translate(${(dx * 6).toFixed(1)} ${(dy * 4).toFixed(1)})`));
  });
  p.addEventListener('pointerleave', () => $$('.eyes', p).forEach(g => g.removeAttribute('transform')));
}
// plaatje van het personage bewaren op de tablet (alleen in de ouderhoek)
function savePortrait() {
  const L = look(), bg = { geen: '#F4EEFF', sterren: '#2A2366', strand: '#FFE2A8', haven: '#9FD8F5', regenboog: '#FFE3F1', nacht: '#10246B' }[L.bg] || '#F4EEFF';
  const svg = avatarSVG(L, 'lach').replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="852" ');
  const img = new Image(), url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = 600; c.height = 852; const x = c.getContext('2d');
    x.fillStyle = bg; x.fillRect(0, 0, 600, 852); x.drawImage(img, 0, 0, 600, 852); URL.revokeObjectURL(url);
    c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'toverleerling.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); toast('📸 ' + t('portraitDone')); }, 'image/png');
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast(t('portraitFail')); };
  img.src = url;
}

// de lijst met stemmen laadt asynchroon: daarna opnieuw bepalen of de voorleesknop moet blijven
if (window.speechSynthesis) window.speechSynthesis.addEventListener('voiceschanged', () => { if (!canRead()) $$('#lread, #qread').forEach(b => b.remove()); });
