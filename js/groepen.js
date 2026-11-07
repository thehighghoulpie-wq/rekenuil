'use strict';
/* =====================================================================
   Groep 1 t/m 8
   - Elk onderwerp krijgt een bereik van groepen (grades: [van, tot]).
     Groep 6 ziet alles wat er al was, plus een paar nieuwe onderwerpen.
   - Nieuwe onderwerpen voor de kleuters (groep 1-2), de onderbouw (3-4)
     en de bovenbouw (6-8).
   - Liedjes: eigen teksten en eigen melodietjes (geen bestaande liedjes),
     gespeeld met de toonopwekker van de app.
   Alle antwoorden worden uitgerekend, nooit geraden.
   ===================================================================== */

/* ---------- bereik per bestaand onderwerp (alle bevatten groep 6) ---------- */
const GRADE_RANGE = {
  'rekenen/tafels': [4, 8], 'rekenen/delen': [5, 8], 'rekenen/plusmin': [5, 8], 'rekenen/groot': [5, 8], 'rekenen/breuken': [6, 8],
  'rekenen/geld': [4, 8], 'rekenen/meten': [5, 8], 'rekenen/opp': [6, 8], 'rekenen/grafiek': [5, 8], 'rekenen/klok': [3, 8], 'rekenen/verhaal': [5, 8],
  'rekenen/lab': [5, 8],
  'taal/eiij': [4, 8], 'taal/auou': [4, 8], 'taal/gch': [4, 8], 'taal/dubbel': [5, 8], 'taal/dt': [5, 8], 'taal/woorden': [4, 8], 'taal/lezen': [4, 8],
  'taal/zinsdelen': [6, 8], 'taal/woordsoort': [5, 8], 'taal/meervoud': [3, 8], 'taal/spreuk': [6, 8],
  'papiamentu/grammatika': [5, 8], 'papiamentu/weetjes': [3, 8]
};
for (const [k, g] of Object.entries(GRADE_RANGE)) if (TOPIC[k]) TOPIC[k].grades = g;
const GROEP_BANDS = [[1, 2, 'band_kleuter'], [3, 4, 'band_onder'], [5, 6, 'band_midden'], [7, 8, 'band_boven']];
const groepBand = g => (GROEP_BANDS.find(b => g >= b[0] && g <= b[1]) || GROEP_BANDS[2])[2];

/* ---------- liedjes: eigen tekst, eigen melodie ----------
   Elke regel: tekst en noten [toon, tellen]. */
const NOTE_HZ = { C4: 262, D4: 294, E4: 330, F4: 349, G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659 };
const SONGS = {
  tellen: { title: 'Tel mee met Pip', ico: '🔢', bpm: 104, lines: [
    ['Eén, twee, drie, vier,', [['C4', 1], ['D4', 1], ['E4', 1], ['F4', 1]]],
    ['Pip is hier!', [['G4', 1], ['G4', 1], ['E4', 2]]],
    ['Vijf, zes, ze-ven,', [['A4', 1], ['A4', 1], ['G4', 1], ['F4', 1]]],
    ['ster-ren zwe-ven,', [['F4', 1], ['E4', 1], ['D4', 1], ['C4', 1]]],
    ['acht, ne-gen, tien:', [['C4', 1], ['E4', 1], ['G4', 1], ['C5', 2]]],
    ['tel maar mee met mij!', [['C5', 1], ['A4', 1], ['G4', 1], ['E4', 1], ['C4', 2]]]] },
  week: { title: 'Het weeklied', ico: '📅', bpm: 112, lines: [
    ['Maan-dag, dins-dag,', [['E4', 1], ['G4', 1], ['E4', 1], ['G4', 1]]],
    ['woens-dag, don-der-dag,', [['A4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1]]],
    ['vrij-dag, za-ter-dag,', [['E4', 1], ['G4', 1], ['C5', 1], ['B4', 1], ['A4', 1]]],
    ['zon-dag is het feest,', [['G4', 1], ['G4', 1], ['A4', 1], ['G4', 1], ['E4', 2]]],
    ['en dan weer van voor af aan!', [['D4', 1], ['E4', 1], ['F4', 1], ['E4', 1], ['D4', 1], ['C4', 1], ['C4', 2]]]] },
  vormen: { title: 'Het vormenlied', ico: '🔷', bpm: 100, lines: [
    ['Een cir-kel is rond,', [['C4', 1], ['E4', 1], ['G4', 1], ['G4', 1], ['E4', 2]]],
    ['een vier-kant heeft vier kan-ten,', [['F4', 1], ['A4', 1], ['A4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 2]]],
    ['een drie-hoek heeft drie punt-jes,', [['E4', 1], ['G4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1], ['C4', 2]]],
    ['en Pip vindt ze al-le-maal mooi!', [['C4', 1], ['E4', 1], ['G4', 1], ['C5', 1], ['B4', 1], ['A4', 1], ['G4', 1], ['C5', 2]]]] },
  tafel: { title: 'De tafel-rap van 2', ico: '✖️', bpm: 120, lines: [
    ['Twee, vier, zes, acht,', [['G4', 1], ['G4', 1], ['A4', 1], ['G4', 1]]],
    ['tien, en dan heel zacht:', [['E4', 1], ['G4', 1], ['G4', 1], ['E4', 1], ['C4', 1]]],
    ['twaalf, veer-tien, zes-tien,', [['G4', 1], ['A4', 1], ['A4', 1], ['G4', 1], ['G4', 1]]],
    ['acht-tien, twin-tig: klaar!', [['E4', 1], ['E4', 1], ['G4', 1], ['G4', 1], ['C5', 2]]]] }
};
// lesonderdeel: een liedje met meezing-regels die oplichten
registerWidget('liedje', (el, o = {}) => {
  const song = SONGS[o.song] || SONGS.tellen;
  let playing = false, slow = false, timers = [];
  const gone = () => !el.isConnected || el.offsetParent === null;   // scherm weg? dan stoppen
  const stop = () => {
    timers.forEach(clearTimeout); timers = []; playing = false;
    $$('.ls-line', el).forEach(l => l.classList.remove('on'));
    const b = $('[data-play]', el); if (b) b.textContent = '▶ Zing mee';
  };
  el.innerHTML = `<div class="w-liedje"><div class="ls-title">${song.ico} ${song.title}</div><div class="ls-lines">${song.lines.map(([tx], i) => `<div class="ls-line" data-i="${i}">${tx}</div>`).join('')}</div>
    <div class="wrow"><button class="wbtn primary" data-play>▶ Zing mee</button><button class="wbtn" data-slow>🐢 Langzaam</button></div>
    <div class="w-small">Een eigen liedje van Toverschool. Zing mee en klap op de tel!</div></div>`;
  $('[data-slow]', el).onclick = e => { slow = !slow; e.currentTarget.classList.toggle('on', slow); };
  $('[data-play]', el).onclick = e => {
    if (playing) return stop();
    playing = true; e.currentTarget.textContent = '■ Stop';
    const beat = 60000 / song.bpm * (slow ? 1.5 : 1);
    let t0 = 0;
    song.lines.forEach(([, notes], i) => {
      timers.push(setTimeout(() => { if (gone()) return stop(); $$('.ls-line', el).forEach(l => l.classList.toggle('on', +l.dataset.i === i)); }, t0));
      notes.forEach(([n, b]) => { timers.push(setTimeout(() => { if (!gone()) tone([NOTE_HZ[n]], Math.min(.5, b * beat / 1000 * .85), 'triangle', .07); }, t0)); t0 += b * beat; });
      t0 += beat * .5;
    });
    timers.push(setTimeout(stop, t0 + 200));
  };
});

/* ---------- hulpjes ---------- */
const bigChoice = (correct, wrongs, n) => Object.assign(mkChoice(correct, wrongs, n), { big: true });
const emojiGrid = (n, e) => { let r = '', left = n; while (left > 0) { r += `<div>${e.repeat(Math.min(5, left))}</div>`; left -= 5; } return `<div class="emorows big">${r}</div>`; };
const COUNT_THINGS = ['🍎', '⭐', '🐟', '🌺', '🐢', '🎈', '🐞', '🍌', '🐚', '🦩'];
const commonEnd = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[a.length - 1 - i] === b[b.length - 1 - i]) i++; return a.slice(a.length - i); };

/* ========================= REKENEN ========================= */
// groep 1-3: tellen
function genTellen(diff) {
  const max = diff === 'easy' ? 5 : diff === 'medium' ? 10 : 15, n = rnd(1, max), e = kies(COUNT_THINGS);
  const wrong = [n - 1, n + 1, n + 2, n - 2].filter(x => x >= 1 && x <= max + 2).map(String);
  const rows = Math.floor(n / 5), rest = n % 5;
  return Object.assign(bigChoice(String(n), wrong, diff === 'easy' ? 3 : 4), {
    text: `Hoeveel ${e} zie je?`, say: 'Hoeveel zie je? Tel maar mee.', visual: emojiGrid(n, e), key: 'tel' + n + e,
    hint: 'Tel ze één voor één. Wijs ze aan met je vinger.',
    explain: `Het zijn er <b>${n}</b>.${n > 5 ? ` ${rows === 1 ? 'Eén rij' : rows + ' rijen'} van 5${rest ? ` en nog ${rest}` : ''}.` : ''}` });
}
// groep 1-2: meer of minder
function genMeerMinder(diff) {
  const max = diff === 'easy' ? 5 : 10, e = kies(COUNT_THINGS);
  let a = rnd(1, max), b = rnd(1, max);
  if (diff === 'easy' && Math.abs(a - b) < 2 && Math.random() < .7) b = a + 2 <= max ? a + 2 : a - 2;
  const ans = a > b ? 0 : b > a ? 1 : 2;
  return { kind: 'choice', big: true, choices: ['👈 Links', 'Rechts 👉', '🟰 Evenveel'], answer: ans, key: 'mm' + a + 'v' + b,
    text: 'Waar zijn er <b>meer</b>?', say: 'Waar zijn er meer? Links, rechts, of evenveel?',
    visual: `<div class="twobox"><div class="box2">${emojiGrid(a, e)}</div><div class="box2">${emojiGrid(b, e)}</div></div>`,
    hint: 'Tel beide kanten. Of leg ze in gedachten naast elkaar.',
    explain: `Links ${a}, rechts ${b}. ${ans === 2 ? 'Dat is <b>evenveel</b>.' : `Er zijn meer aan de <b>${ans === 0 ? 'linkerkant' : 'rechterkant'}</b>.`}` };
}
// groep 1-3: vormen en kleuren
const SHAPES = {
  cirkel: c => `<circle cx="50" cy="50" r="38" fill="${c}"/>`,
  vierkant: c => `<rect x="14" y="14" width="72" height="72" rx="4" fill="${c}"/>`,
  driehoek: c => `<path d="M50 10 L90 86 L10 86Z" fill="${c}"/>`,
  rechthoek: c => `<rect x="4" y="28" width="92" height="44" rx="4" fill="${c}"/>`,
  ster: c => `<path d="${starPath(50, 52, 44)}" fill="${c}"/>`,
  hart: c => `<path d="${heartPath(50, 50, 4.6)}" fill="${c}"/>`,
  ruit: c => `<path d="M50 4 L88 50 L50 96 L12 50Z" fill="${c}"/>`,
  zeshoek: c => `<path d="M30 12 L70 12 L92 50 L70 88 L30 88 L8 50Z" fill="${c}"/>`
};
const KLEUREN_NL = { rood: '#E8402A', blauw: '#2F6FD6', geel: '#F7D21E', groen: '#3CB878', oranje: '#F29A2E', paars: '#8B5CF6', roze: '#FF8FB8' };
const shapeSVG = (s, c, cls = 'shapebig') => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true">${SHAPES[s](c)}</svg>`;
function genVormen(diff) {
  const names = diff === 'easy' ? ['cirkel', 'vierkant', 'driehoek', 'ster', 'hart'] : Object.keys(SHAPES);
  const shape = kies(names), kleur = kies(Object.keys(KLEUREN_NL)), svg = shapeSVG(shape, KLEUREN_NL[kleur]);
  if (Math.random() < .55) return Object.assign(bigChoice(shape, names.filter(n => n !== shape), diff === 'easy' ? 3 : 4),
    { text: 'Welke <b>vorm</b> is dit?', say: 'Welke vorm is dit?', visual: svg, key: 'vorm' + shape, hint: 'Kijk naar de hoeken en de randen. Is hij rond, of heeft hij punten?', explain: `Dit is een <b>${shape}</b>.` });
  return Object.assign(bigChoice(kleur, Object.keys(KLEUREN_NL).filter(k => k !== kleur), diff === 'easy' ? 3 : 4),
    { text: `Welke <b>kleur</b> heeft de ${shape}?`, say: `Welke kleur heeft de ${shape}?`, visual: svg, key: 'kleur' + kleur + shape, hint: 'Kijk goed naar de kleur.', explain: `De ${shape} is <b>${kleur}</b>.` });
}
// groep 2-4: rekenen tot 20
function genTot20(diff) {
  let a, b, plus = true;
  if (diff === 'easy') { a = rnd(1, 9); b = rnd(1, 10 - a); }
  else if (diff === 'medium') { plus = Math.random() < .6; if (plus) { a = rnd(3, 15); b = rnd(1, 20 - a); } else { a = rnd(4, 10); b = rnd(1, a); } }
  else { plus = Math.random() < .5; if (plus) { a = rnd(6, 14); b = rnd(2, 20 - a); } else { a = rnd(11, 20); b = rnd(2, a - 1); } }
  const ans = plus ? a + b : a - b, sign = plus ? '+' : '−';
  const over = plus && a < 10 && ans > 10, under = !plus && a > 10 && ans < 10;
  return { kind: 'num', text: `${a} ${sign} ${b} =`, say: `${a} ${plus ? 'plus' : 'min'} ${b}`, answer: ans, key: `t20${a}${plus ? 'p' : 'm'}${b}`,
    visual: diff === 'easy' ? `<div class="sumvis">${emojiGrid(a, '🔵')}<b class="opplus">${sign}</b>${emojiGrid(b, '🟡')}</div>` : '',
    hint: over ? `Spring eerst naar 10: ${a} + ${10 - a} = 10. Dan nog ${b - (10 - a)} erbij.`
      : under ? `Spring eerst terug naar 10: ${a} − ${a - 10} = 10. Dan nog ${b - (a - 10)} eraf.`
      : plus ? 'Begin bij het grootste getal en tel verder.' : 'Begin bij het eerste getal en tel terug.',
    explain: `${a} ${sign} ${b} = <b>${ans}</b>` };
}
// groep 2-4: splitsen
function genSplitsen(diff) {
  const T = diff === 'easy' ? kies([5, 6]) : diff === 'medium' ? kies([7, 8, 9, 10]) : kies([10, 12, 15, 20]);
  const a = rnd(1, T - 1), ans = T - a;
  return { kind: 'num', text: `Splits <b>${T}</b>: ${a} en ?`, say: `Splits ${T}. ${a} en hoeveel?`, answer: ans, key: `spl${T}-${a}`,
    visual: T <= 10 ? `<div class="emorows big"><div>${'🟣'.repeat(a)}${'⚪'.repeat(ans)}</div></div>` : '',
    hint: `Hoeveel moet er nog bij ${a} om ${T} te maken? Tel verder vanaf ${a}.`, explain: `${a} + ${ans} = ${T}. Dus <b>${ans}</b>.` };
}
// groep 7-8: procenten
function genProcenten(diff) {
  const pcts = diff === 'easy' ? [50, 10, 100] : diff === 'medium' ? [25, 20, 75, 50, 10] : [5, 15, 30, 40, 60, 75, 35];
  const p = kies(pcts), unit = 100 / gcd(p, 100);
  const base = unit * rnd(1, Math.max(1, Math.floor((diff === 'hard' ? 600 : 400) / unit)));
  const ans = base * p / 100;
  const ctx = p < 100 && base >= 40 && Math.random() < .4;
  const how = p === 50 ? 'de helft' : p === 25 ? 'een kwart' : p === 75 ? 'drie kwart' : p === 10 ? 'deel door 10' : p === 100 ? 'alles' : `${p}% = ${p % 10 === 0 ? (p / 10) + ' × 10%' : (p / 5) + ' × 5%'}`;
  return { kind: 'num', answer: ans, key: `pct${p}-${base}`, prefix: ctx ? '€' : '',
    text: ctx ? `Een fiets kost <b>€ ${base}</b>. Je krijgt <b>${p}%</b> korting. Hoeveel euro korting is dat?` : `Hoeveel is <b>${p}%</b> van <b>${base}</b>?`,
    hint: `Procent betekent: van de honderd. 10% van ${base} is ${base} : 10 = ${fmt(base / 10)}. Tip: ${how}.`,
    explain: `${p}% van ${base}: 1% is ${base} : 100 = ${fmt(base / 100)}, en ${p} × ${fmt(base / 100)} = <b>${ans}</b>.` };
}
// groep 6-8: verhoudingen
const VH_THINGS = [['pakjes sap', '🧃'], ['schriften', '📒'], ['zakjes chips', '🍟'], ['ijsjes', '🍦'], ['kaartjes voor de boot', '⛴️']];
function genVerhouding(diff) {
  const [ding, e] = kies(VH_THINGS), u = rnd(diff === 'easy' ? 1 : 2, diff === 'hard' ? 12 : 6), n1 = rnd(2, 5);
  let n2 = diff === 'easy' ? n1 * rnd(2, 4) : diff === 'medium' ? (Math.random() < .5 ? n1 * rnd(2, 5) : rnd(2, 12)) : rnd(6, 25);
  if (n2 === n1) n2++;
  const c1 = n1 * u, ans = n2 * u;
  return { kind: 'num', prefix: '€', answer: ans, key: `vh${n1}-${c1}-${n2}`,
    text: `${e} ${n1} ${ding} kosten samen <b>€ ${c1}</b>. Hoeveel kosten <b>${n2}</b> ${ding}?`,
    visual: `<table class="vhtab"><tr><th>aantal</th><td>${n1}</td><td>1</td><td>${n2}</td></tr><tr><th>euro</th><td>${c1}</td><td>?</td><td>?</td></tr></table>`,
    hint: `Reken eerst uit wat er 1 kost: ${c1} : ${n1}.`, explain: `1 kost ${c1} : ${n1} = € ${u}. ${n2} × € ${u} = <b>€ ${ans}</b>.` };
}

/* ========================= TAAL ========================= */
// groep 1-3: met welke letter begint het? (alleen woorden waar je de letter ook echt hoort)
const KLANK = [['🍎', 'appel'], ['⚽', 'bal'], ['🚪', 'deur'], ['🦆', 'eend'], ['🚲', 'fiets'], ['🐐', 'geit'], ['🏠', 'huis'], ['🧥', 'jas'], ['🐱', 'kat'],
  ['🦁', 'leeuw'], ['🌙', 'maan'], ['👃', 'neus'], ['🐘', 'olifant'], ['🍐', 'peer'], ['🚀', 'raket'], ['🐌', 'slak'], ['🚆', 'trein'], ['🐟', 'vis'], ['☁️', 'wolk'], ['☀️', 'zon']];
function genKlank(diff) {
  const [e, w] = kies(KLANK), l = w[0];
  const pool = [...new Set(KLANK.map(x => x[1][0]))].filter(x => x !== l);
  return Object.assign(bigChoice(l, pool, diff === 'easy' ? 3 : 4), {
    text: `${e} Met welke letter begint dit woord?`, say: `Met welke letter begint het woord ${w}?`, visual: `<div class="bigemo">${e}</div>`, key: 'klank' + w,
    hint: `Zeg het woord heel langzaam. Wat hoor je als eerste?`, explain: `<b>${w}</b> begint met de <b>${l}</b>.` });
}
// groep 1-3: rijmen
const RIJM = [['huis', '🏠', 'muis', '🐭'], ['zon', '☀️', 'ton', '🛢️'], ['koek', '🍪', 'boek', '📖'], ['beer', '🐻', 'peer', '🍐'], ['kip', '🐔', 'schip', '🚢'],
  ['jas', '🧥', 'tas', '👜'], ['mond', '👄', 'hond', '🐶'], ['rok', '👗', 'sok', '🧦'], ['been', '🦵', 'steen', '🪨'], ['maan', '🌙', 'kraan', '🚰']];
function genRijm(diff) {
  const r = kies(RIJM), flip = Math.random() < .5, [q, qe, a, ae] = flip ? [r[2], r[3], r[0], r[1]] : r;
  const others = shuffle(RIJM.filter(x => x !== r)).flatMap(x => [`${x[1]} ${x[0]}`, `${x[3]} ${x[2]}`]);
  return Object.assign(bigChoice(`${ae} ${a}`, others, diff === 'easy' ? 3 : 4), {
    text: `Wat rijmt op <b>${qe} ${q}</b>?`, say: `Wat rijmt op ${q}?`, key: 'rijm' + q,
    hint: `Rijmwoorden klinken aan het eind hetzelfde. Zeg ${q} en luister naar het einde.`,
    explain: `<b>${q}</b> en <b>${a}</b> rijmen: ze eindigen allebei op <b>-${commonEnd(q, a)}</b>.` });
}
// groep 3-4: korte woorden lezen
const WLEES = [['🐟', 'vis', ['vos', 'mis']], ['🌙', 'maan', ['man', 'baan']], ['🐱', 'kat', ['kam', 'pet']], ['⚽', 'bal', ['bel', 'bak']], ['🌳', 'boom', ['room', 'boot']],
  ['☀️', 'zon', ['zoon', 'ton']], ['🐭', 'muis', ['huis', 'mus']], ['🐮', 'koe', ['koek', 'kou']], ['🥚', 'ei', ['eik', 'ijs']], ['🐝', 'bij', ['bijl', 'bus']],
  ['🚌', 'bus', ['bos', 'buis']], ['🍐', 'peer', ['beer', 'veer']], ['🧦', 'sok', ['rok', 'zak']], ['🎒', 'tas', ['jas', 'tak']], ['🐔', 'kip', ['kap', 'kist']]];
function genWoordLezen(diff) {
  const [e, w, wr] = kies(WLEES), more = diff === 'easy' ? [] : shuffle(WLEES.filter(x => x[1] !== w)).map(x => x[1]);
  return Object.assign(bigChoice(w, [...wr, ...more], diff === 'easy' ? 3 : 4), {
    text: 'Welk woord hoort bij het plaatje?', visual: `<div class="bigemo">${e}</div>`, key: 'wl' + w,
    hint: 'Lees elk woord letter voor letter. Plak de klanken aan elkaar.', explain: `Bij het plaatje hoort <b>${w}</b>.` });
}
// groep 6-8: verleden tijd met 't kofschip (alleen regelmatige werkwoorden)
const KOF = [['werken', 'werk', 'hard'], ['fietsen', 'fiets', 'naar school'], ['praten', 'praat', 'met Pip'], ['maken', 'maak', 'een tekening'], ['hopen', 'hoop', 'op zon'],
  ['lachen', 'lach', 'om de grap'], ['koken', 'kook', 'rijst'], ['dansen', 'dans', 'op het feest'], ['stoppen', 'stop', 'bij het stoplicht'], ['knippen', 'knip', 'een ster'],
  ['poetsen', 'poets', 'de ramen'], ['plakken', 'plak', 'een sticker'],
  ['spelen', 'speel', 'buiten'], ['wonen', 'woon', 'op Curaçao', 'vroeger'], ['horen', 'hoor', 'een vogel'], ['leren', 'leer', 'de tafels'], ['bouwen', 'bouw', 'een zandkasteel'],
  ['huilen', 'huil', 'bij de film'], ['tekenen', 'teken', 'een vis'], ['bellen', 'bel', 'met Wela'], ['roeien', 'roei', 'naar het eiland'], ['luisteren', 'luister', 'naar muziek']];
const KOF_LETTERS = ['ch', 't', 'k', 'f', 's', 'p'];
const kofEnd = stam => KOF_LETTERS.find(x => stam.endsWith(x));
function genKofschip(diff) {
  const [inf, stam, rest, when = 'gisteren'] = kies(KOF), end = kofEnd(stam), uit = end ? 'te' : 'de', plural = diff !== 'easy' && Math.random() < .5;
  const goed = stam + uit + (plural ? 'n' : ''), fout = stam + (end ? 'de' : 'te') + (plural ? 'n' : '');
  const wie = plural ? kies(['Wij', 'Jullie', 'Zij']) : kies(['Ik', 'Jij', 'Hij', 'Zij', 'Pip']);
  const wrongs = diff === 'hard' ? [fout, stam + 'd' + (plural ? 'en' : '')] : [fout];
  return Object.assign(mkChoice(goed, wrongs, wrongs.length + 1), {
    text: `${wie} <span class="gap">…</span> ${when} ${rest}. <small>(${inf})</small>`, key: 'kof' + inf + plural,
    hint: `Neem de stam: <b>${stam}</b>. Eindigt die op een letter uit <b>'t kofschip</b> (t, k, f, s, ch, p)? Dan -te. Anders -de.`,
    explain: `Stam <b>${stam}</b>: ${end ? `de <b>${end}</b> zit in 't kofschip` : `de <b>${stam.slice(-1)}</b> zit niet in 't kofschip`}, dus ${stam} + ${uit}${plural ? ' + n' : ''} = <b>${goed}</b>.` });
}

/* ========================= AANMELDEN ========================= */
const regGroep = (subj, tp) => registerTopic(subj, Object.assign({ comma: false, pace: { easy: 6, medium: 5, hard: 4 } }, tp));
regGroep('rekenen', { id: 'tellen', name: 'Tellen', sub: 'tot 10 en verder', ico: '🔢', grades: [1, 3], gen: genTellen, lesson: [
  { t: 'Tellen met Pip', h: 'Wijs elk ding één keer aan en zeg het getal hardop: één, twee, drie…', v: emojiGrid(7, '🍎') },
  { t: 'Rijtjes van vijf', h: 'Een volle rij is <b>5</b>. Twee volle rijen is <b>10</b>. Zo tel je sneller!', v: emojiGrid(10, '⭐') },
  { t: 'Zing mee', h: 'Tel mee in het liedje van Pip.', w: 'liedje', o: { song: 'tellen' } }] });
regGroep('rekenen', { id: 'meerminder', name: 'Meer of minder', sub: 'waar zijn er meer?', ico: '⚖️', grades: [1, 2], gen: genMeerMinder, lesson: [
  { t: 'Meer of minder?', h: 'Waar de meeste dingen zijn, daar is het <b>meer</b>. Zijn het er aan allebei de kanten even veel? Dan is het <b>evenveel</b>.',
    v: `<div class="twobox"><div class="box2">${emojiGrid(3, '🐟')}</div><div class="box2">${emojiGrid(5, '🐟')}</div></div>` }] });
regGroep('rekenen', { id: 'vormen', name: 'Vormen & kleuren', sub: 'cirkel, vierkant, driehoek', ico: '🔷', grades: [1, 3], gen: genVormen, lesson: [
  { t: 'De vormen', h: 'Een <b>cirkel</b> is rond. Een <b>vierkant</b> heeft 4 even lange kanten. Een <b>driehoek</b> heeft 3 punten.',
    v: `<div class="shaperow">${['cirkel', 'vierkant', 'driehoek', 'rechthoek', 'ster', 'hart'].map((s, i) => `<span>${shapeSVG(s, Object.values(KLEUREN_NL)[i], 'shapesm')}<small>${s}</small></span>`).join('')}</div>` },
  { t: 'Zing mee', h: 'Het vormenlied van Pip.', w: 'liedje', o: { song: 'vormen' } }] });
regGroep('rekenen', { id: 'tot20', name: 'Rekenen tot 20', sub: 'plus en min', ico: '🧮', grades: [2, 4], gen: genTot20, lesson: [
  { t: 'Plus', h: '<b>3 + 2</b>: je hebt er 3 en er komen 2 bij. Tel verder vanaf 3: vier, vijf. Dus <b>5</b>.', v: `<div class="sumvis">${emojiGrid(3, '🔵')}<b class="opplus">+</b>${emojiGrid(2, '🟡')}</div>` },
  { t: 'Over de 10', h: 'Spring eerst naar de 10.', w: 'stappen', o: { lines: ['<b>8 + 5</b> = ?', '8 + 2 = 10', 'Nog 3 erbij: 10 + 3 = <b>13</b>'] } },
  { t: 'Probeer zelf', h: 'Spring naar de 10.', w: 'probeer', o: { q: 'Wat is <b>7 + 6</b>?', opts: ['13', '12', '14'], ok: 0, uitleg: '7 + 3 = 10, en nog 3 erbij: <b>13</b>.', hint: '7 + 3 = 10. Dan nog 3.' } }] });
regGroep('rekenen', { id: 'splitsen', name: 'Splitsen', sub: '10 is 6 en 4', ico: '✂️', grades: [2, 4], gen: genSplitsen, lesson: [
  { t: 'Splitsen', h: 'Je kunt een getal in twee stukjes delen. <b>10</b> is <b>6</b> en <b>4</b>. Samen weer 10!', v: `<div class="emorows big"><div>${'🟣'.repeat(6)}${'⚪'.repeat(4)}</div></div>` },
  { t: 'Vriendjes van 10', h: 'Deze getallen maken samen 10: <b>1+9, 2+8, 3+7, 4+6, 5+5</b>. Als je die kent, reken je veel sneller.' }] });
regGroep('rekenen', { id: 'verhouding', name: 'Verhoudingen', sub: 'de verhoudingstabel', ico: '⚖️', grades: [6, 8], gen: genVerhouding, lesson: [
  { t: 'De verhoudingstabel', h: 'In een verhoudingstabel doe je boven en onder <b>hetzelfde</b>. Keer 2 boven? Dan ook keer 2 onder.',
    v: '<table class="vhtab"><tr><th>pakjes</th><td>3</td><td>1</td><td>6</td></tr><tr><th>euro</th><td>6</td><td>2</td><td>12</td></tr></table>' },
  { t: 'Eerst naar 1', h: 'Weet je niet hoe? Reken eerst uit wat <b>één</b> kost.', w: 'stappen', o: { lines: ['3 pakjes kosten € 6', '1 pakje: 6 : 3 = € 2', '7 pakjes: 7 × 2 = <b>€ 14</b>'] } },
  { t: 'Probeer zelf', h: 'Reken eerst naar 1.', w: 'probeer', o: { q: '4 ijsjes kosten € 8. Wat kosten <b>5</b> ijsjes?', opts: ['€ 10', '€ 9', '€ 12'], ok: 0, uitleg: '1 ijsje: 8 : 4 = € 2. 5 × 2 = <b>€ 10</b>.', hint: 'Wat kost 1 ijsje?' } }] });
regGroep('rekenen', { id: 'procenten', name: 'Procenten', sub: '25% van 80', ico: '💯', grades: [7, 8], gen: genProcenten, lesson: [
  { t: 'Wat is procent?', h: 'Procent betekent <b>van de honderd</b>. 25% is 25 van de 100: een kwart.', w: 'honderdveld' },
  { t: 'Handige procenten', h: '<ul class="tips"><li><b>50%</b> = de helft</li><li><b>25%</b> = een kwart</li><li><b>10%</b> = deel door 10</li><li><b>1%</b> = deel door 100</li></ul>' },
  { t: 'Rekenen met 10%', h: 'Moeilijk percentage? Begin bij 10%.', w: 'stappen', o: { lines: ['<b>30% van 70</b> = ?', '10% van 70 = 7', '30% = 3 × 10% = 3 × 7 = <b>21</b>'] } },
  { t: 'Probeer zelf', h: 'Gebruik 10%.', w: 'probeer', o: { q: 'Hoeveel is <b>20%</b> van <b>60</b>?', opts: ['12', '6', '20'], ok: 0, uitleg: '10% van 60 = 6, dus 20% = 2 × 6 = <b>12</b>.', hint: '10% van 60 = 6.' } }] });
regGroep('taal', { id: 'klank', name: 'Eerste letter', sub: 'met welke letter?', ico: '🔤', grades: [1, 3], gen: genKlank, lesson: [
  { t: 'Luister naar het begin', h: 'Zeg het woord heel langzaam: <b>v-i-s</b>. Het begint met de <b>v</b>.', v: '<div class="bigemo">🐟</div>' },
  { t: 'Letterkaarten', h: 'Tik op een kaart en kijk welk woord erbij hoort.', w: 'kaarten', o: { cards: KLANK.slice(0, 8).map(([e, w]) => [w[0], w, e]) } }] });
regGroep('taal', { id: 'rijmen', name: 'Rijmen', sub: 'huis en muis', ico: '🎶', grades: [1, 3], gen: genRijm, lesson: [
  { t: 'Wat is rijmen?', h: 'Woorden <b>rijmen</b> als ze aan het eind hetzelfde klinken: <b>huis</b> en <b>muis</b>, <b>zon</b> en <b>ton</b>.', v: '<div class="bigemo">🏠 🐭</div>' },
  { t: 'Rijmkaarten', h: 'Tik op een kaart: wat rijmt erop?', w: 'kaarten', o: { cards: RIJM.slice(0, 6).map(r => [r[0], r[3] + ' ' + r[2], r[1]]) } }] });
regGroep('taal', { id: 'woordlezen', name: 'Woorden lezen', sub: 'vis, maan, kat', ico: '📗', grades: [3, 4], gen: genWoordLezen, lesson: [
  { t: 'Klanken plakken', h: 'Lees letter voor letter en plak de klanken aan elkaar: <b>m-aa-n</b> → <b>maan</b>.', v: '<div class="bigemo">🌙</div>' },
  { t: 'Woordkaarten', h: 'Lees het woord en tik dan op de kaart.', w: 'kaarten', o: { cards: WLEES.slice(0, 8).map(([e, w]) => [w, e]) } }] });
regGroep('taal', { id: 'kofschip', name: "Verleden tijd: 't kofschip", sub: 'werkte of werkde?', ico: '⛵', grades: [6, 8], gen: genKofschip, lesson: [
  { t: "'t Kofschip", h: "Bij de verleden tijd kijk je naar de <b>stam</b>. Eindigt die op een letter uit <b>'t kofschip</b> (t, k, f, s, ch, p)? Dan komt er <b>-te</b> achter. Anders <b>-de</b>. Meer mensen? Dan <b>-ten</b> of <b>-den</b>." },
  { t: 'Stap voor stap', h: 'Zo doe je het.', w: 'stappen', o: { lines: ['Werkwoord: <b>werken</b>', 'Stam: <b>werk</b>', "De k zit in 't kofschip", 'werk + te = <b>werkte</b>'] } },
  { t: 'Probeer zelf', h: 'Kijk naar de stam.', w: 'probeer', o: { q: 'Ik … gisteren buiten. (spelen)', opts: ['speelde', 'speelte'], ok: 0, uitleg: "Stam <b>speel</b>: de l zit niet in 't kofschip, dus <b>speelde</b>.", hint: "Zit de l in 't kofschip?" } }] });

/* ---------- voor de rest van de app ---------- */
// onderwerpen voor de groep van het kind; vroege onderwerpen (kleuters, onderbouw) eerst
const fitTopics = s => {
  const f = s.topics.filter(topicFits), list = f.length ? f : s.topics;
  return [...list.filter(tp => tp.grades && tp.grades[1] < 5), ...list.filter(tp => !(tp.grades && tp.grades[1] < 5))];
};
const groepLabel = sid => { const g = typeof effGrade === 'function' && sid ? effGrade(sid) : D.grade; return `${t('groep')} ${g} · ${t(groepBand(g))}`; };
// Liedjes in de Speelzaal
function startLiedjes() {
  G.over = false; G.again = startLiedjes;
  gameShell('🎵 ' + t('g_liedjes'), `<p class="muted center">${t('liedjesInfo')}</p><div class="songlist">${Object.keys(SONGS).map(k => `<div class="card pad songcard" id="song-${k}"></div>`).join('')}</div>`);
  Object.keys(SONGS).forEach(k => WIDGETS.liedje($('#song-' + k), { song: k }));
}
