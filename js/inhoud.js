'use strict';
/* =====================================================================
   Toverschool 2.0, stap B: meer inhoud voor groep 1 t/m 8 + de Route
   - groep 1-3: patronen, cijfers, groter/kleiner, wat komt erna, op volgorde,
     de of het, leesboekjes (met woord voor woord voorlezen)
   - groep 6-8: gemiddelde, snelheid, schaal, kans, onder nul, eindtoets-training
   - De Route: elk onderwerp is een stapje met een eigen figuurtje en een kalme medaille
   Alle antwoorden worden uitgerekend.
   ===================================================================== */

/* ========================= groep 1-3 ========================= */
const NUMW = ['nul', 'één', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien', 'twintig'];
const PAT_E = ['🔴', '🔵', '🟡', '🟢', '⭐', '🌙', '🍎', '🐟', '🌺', '🐢'];
function genPatroon(diff) {
  const units = diff === 'easy' ? [[0, 1]] : diff === 'medium' ? [[0, 1], [0, 0, 1]] : [[0, 1, 2], [0, 0, 1], [0, 1, 1, 2]];
  const u = kies(units), pool = shuffle(PAT_E).slice(0, 3), seq = [];
  for (let i = 0; i < u.length * 3 + 1; i++) seq.push(pool[u[i % u.length]]);
  const shown = seq.slice(0, -1), ans = seq[seq.length - 1];
  return Object.assign(bigChoice(ans, pool.concat(shuffle(PAT_E).slice(3, 5)), 3), {
    text: 'Wat komt er daarna?', say: 'Kijk goed naar het patroon. Wat komt er daarna?', key: 'pat' + shown.join(''),
    visual: `<div class="patrow">${shown.map(x => `<span>${x}</span>`).join('')}<span class="patq">?</span></div>`,
    hint: 'Zoek wat steeds terugkomt. Dat is het patroon. Zeg het hardop!', explain: `Het patroon herhaalt zich. Daarna komt ${ans}.` });
}
function genCijfers(diff) {
  const max = diff === 'easy' ? 10 : diff === 'medium' ? 15 : 20, n = rnd(0, max);
  return Object.assign(bigChoice(String(n), [n - 1, n + 1, n - 2, n + 2, n + 10, n - 10].filter(x => x >= 0 && x <= 20).map(String), 3), {
    text: `Welk getal is <b>${NUMW[n]}</b>?`, say: `Welk getal is ${NUMW[n]}?`, key: 'cijf' + n,
    hint: `Tel maar: ${n > 0 ? '1, 2, … ' : ''}${NUMW[n]}.`, explain: `${NUMW[n]} schrijf je als <b>${n}</b>.` });
}
function genGroterKleiner(diff) {
  const max = diff === 'easy' ? 10 : diff === 'medium' ? 20 : 100, big = Math.random() < .5;
  let a = rnd(0, max), b = rnd(0, max); while (a === b) b = rnd(0, max);
  const ans = big ? Math.max(a, b) : Math.min(a, b);
  return Object.assign(bigChoice(String(ans), [String(a === ans ? b : a)], 2), {
    text: `Welk getal is <b>${big ? 'groter' : 'kleiner'}</b>?`, say: `Welk getal is ${big ? 'groter' : 'kleiner'}?`, key: `gk${a}-${b}-${big}`,
    hint: 'Denk aan de getallenrij. Wat verder naar rechts staat, is groter.', explain: `${a} en ${b}: ${ans} is ${big ? 'groter' : 'kleiner'}.` });
}
function genErna(diff) {
  const max = diff === 'easy' ? 9 : diff === 'medium' ? 19 : 99, n = rnd(1, max), after = Math.random() < .6;
  const ans = after ? n + 1 : n - 1;
  return Object.assign(bigChoice(String(ans), [n, n + 2, n - 2, after ? n - 1 : n + 1].filter(x => x >= 0 && x !== ans).map(String), 3), {
    text: `Welk getal komt <b>${after ? 'na' : 'voor'}</b> ${n}?`, say: `Welk getal komt ${after ? 'na' : 'voor'} ${n}?`, key: `ern${n}${after}`,
    hint: after ? `Tel één verder vanaf ${n}.` : `Tel één terug vanaf ${n}.`, explain: `${after ? 'Na' : 'Voor'} ${n} komt <b>${ans}</b>.` });
}
function genVolgorde(diff) {
  const n = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5, max = diff === 'hard' ? 50 : 20;
  const set = new Set(); while (set.size < n) set.add(rnd(0, max));
  const toks = [...set].sort((a, b) => a - b).map(String), up = Math.random() < .7, ans = up ? toks : toks.slice().reverse();
  return { kind: 'order', tokens: ans.slice(), answer: ans, key: 'volg' + toks.join('-') + up, text: `Zet op volgorde, van ${up ? '<b>klein naar groot</b>' : '<b>groot naar klein</b>'}.`,
    say: `Zet de getallen op volgorde, van ${up ? 'klein naar groot' : 'groot naar klein'}.`, hint: up ? 'Begin met het kleinste getal.' : 'Begin met het grootste getal.',
    explain: `Goed is: <b>${ans.join(', ')}</b>.`, answerText: ans.join(', ') };
}
const DEHET = {
  de: ['stoel', 'tafel', 'hond', 'boom', 'fiets', 'school', 'deur', 'bloem', 'vis', 'auto', 'appel', 'maan', 'zon', 'ster', 'jas', 'tas', 'kat', 'vogel', 'bus', 'lamp', 'melk', 'brug', 'boot', 'kaas', 'pen'],
  het: ['huis', 'boek', 'paard', 'water', 'brood', 'raam', 'bed', 'kind', 'schaap', 'ei', 'meisje', 'konijn', 'potlood', 'licht', 'eiland', 'weer', 'hout', 'vuur', 'fruit', 'speelgoed', 'dier', 'woord', 'strand', 'bord']
};
function genDeHet(diff) {
  const art = Math.random() < .5 ? 'de' : 'het', w = kies(DEHET[art]);
  return Object.assign(bigChoice(art, [art === 'de' ? 'het' : 'de'], 2), {
    text: `<b>${diff === 'hard' ? 'Eén ' : ''}…</b> ${w}`, say: `De of het? ${w}`, key: 'dh' + w,
    hint: diff === 'easy' ? 'Zeg het hardop: wat klinkt goed? De of het?' : 'Meervoud met -en kan bij beide. Zeg het hardop en luister.',
    explain: `Het is <b>${art} ${w}</b>.${art === 'het' ? ' Verkleinwoordjes zijn altijd “het”.' : ''}` });
}
/* leesboekjes: korte eigen verhaaltjes, woord voor woord */
const BOEKJES = [
  { id: 'vis', title: 'Pip en de vis', ico: '🐟', pages: ['Pip loopt naar het strand.', 'Hij ziet een vis in het water.', 'De vis is rood.', 'Pip zwaait naar de vis.'], qs: [
    ['Waar loopt Pip naartoe?', 'naar het strand', ['naar school', 'naar het bos']], ['Wat ziet Pip in het water?', 'een vis', ['een boot', 'een kat']],
    ['Welke kleur heeft de vis?', 'rood', ['blauw', 'geel']], ['Wat doet Pip?', 'Hij zwaait.', ['Hij zingt.', 'Hij slaapt.']]] },
  { id: 'kat', title: 'De kat op de brug', ico: '🐱', pages: ['Kiki de kat zit op de brug.', 'De zon is warm.', 'Een boot vaart onder de brug door.', 'Kiki kijkt naar de boot.'], qs: [
    ['Wie zit op de brug?', 'Kiki de kat', ['Pip', 'een hond']], ['Hoe is de zon?', 'warm', ['koud', 'weg']], ['Wat vaart onder de brug door?', 'een boot', ['een auto', 'een vis']], ['Waar kijkt Kiki naar?', 'naar de boot', ['naar de zon', 'naar Pip']]] },
  { id: 'mango', title: 'Een mand vol mango’s', ico: '🥭', pages: ['Mila heeft een mand.', 'In de mand liggen vijf mango’s.', 'Ze geeft twee mango’s aan Wela.', 'Nu zijn er nog drie.'], qs: [
    ['Hoeveel mango’s liggen er in de mand?', 'vijf', ['drie', 'twee']], ['Aan wie geeft Mila twee mango’s?', 'aan Wela', ['aan Pip', 'aan de kat']], ['Hoeveel mango’s blijven er over?', 'drie', ['vijf', 'twee']]] }
];
function genBoekje(diff) {
  const b = kies(BOEKJES), [q, good, bad] = kies(b.qs);
  return Object.assign(bigChoice(good, bad, 3), { long: true, text: `<b>${b.title}</b><br>${q}`, say: `${b.pages.join(' ')} ${q}`, key: 'boek' + b.id + q,
    visual: `<div class="booktext">${b.ico} ${b.pages.join(' ')}</div>`, hint: 'Lees de tekst nog een keer. Zoek het antwoord in de zin.', explain: `Het staat in de tekst: <b>${good}</b>.` });
}
registerWidget('boekje', (el, o = {}) => {
  const b = BOEKJES.find(x => x.id === o.id) || BOEKJES[0]; let p = 0;
  const draw = () => {
    const words = b.pages[p].split(' ');
    el.innerHTML = `<div class="w-boekje"><div class="bk-art">${b.ico}</div><div class="bk-text">${words.map((w, i) => `<span class="bk-w" data-i="${i}">${w}</span>`).join(' ')}</div>
      <div class="wrow"><button class="wbtn" data-prev ${p === 0 ? 'disabled' : ''}>←</button><button class="wbtn primary" data-read>🔊 Lees voor</button><button class="wbtn" data-next ${p === b.pages.length - 1 ? 'disabled' : ''}>→</button></div>
      <div class="w-small">Pagina ${p + 1} van ${b.pages.length}. Tik op een woord om het te horen.</div></div>`;
    const say = txt => { if (typeof canRead === 'function' && canRead()) speakNL(txt); else toast('Voorlezen werkt alleen als je tablet een Nederlandse stem heeft.', 2600); };
    $$('.bk-w', el).forEach(s => s.onclick = () => { s.classList.add('on'); say(s.textContent); setTimeout(() => s.classList.remove('on'), 700); });
    $('[data-read]', el).onclick = () => {
      say(b.pages[p]);
      const ws = $$('.bk-w', el); ws.forEach((s, i) => setTimeout(() => { if (!el.isConnected) return; ws.forEach(x => x.classList.remove('on')); s.classList.add('on'); }, i * 420));
      setTimeout(() => ws.forEach(x => x.classList.remove('on')), ws.length * 420 + 300);
    };
    $('[data-prev]', el).onclick = () => { p--; draw(); }; $('[data-next]', el).onclick = () => { p++; draw(); };
  };
  draw();
});

/* ========================= groep 6-8 ========================= */
function genGemiddelde(diff) {
  const n = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 5, avg = rnd(diff === 'hard' ? 20 : 4, diff === 'hard' ? 90 : 20);
  const xs = Array.from({ length: n - 1 }, () => Math.max(1, avg + rnd(-Math.min(avg - 1, 6), 6))); xs.push(avg * n - xs.reduce((a, b) => a + b, 0));
  if (xs[n - 1] < 1) return genGemiddelde(diff);
  const sum = xs.reduce((a, b) => a + b, 0), ctx = kies([['Zo veel punten haalde ze', 'punten'], ['Zo veel kilometer liep ze', 'km'], ['Zo veel euro spaarde ze', 'euro']]);
  return { kind: 'num', answer: avg, key: 'gem' + xs.join('-'), text: `${ctx[0]} in ${n} dagen: <b>${shuffle(xs).join(', ')}</b>. Wat is het <b>gemiddelde</b>?`,
    hint: `Tel alles bij elkaar op (${sum}) en deel door ${n}.`, explain: `${xs.join(' + ')} = ${sum}. ${sum} : ${n} = <b>${avg}</b>.` };
}
function genSnelheid(diff) {
  const v = kies(diff === 'easy' ? [10, 20, 30, 40, 50, 60] : [12, 15, 18, 24, 35, 45, 70, 80, 90]), h = kies(diff === 'easy' ? [1, 2, 3] : [2, 3, 4, 5]), half = diff === 'hard' && v % 2 === 0 && Math.random() < .5;
  const time = half ? h + .5 : h, d = v * time, who = kies([['Een fietser rijdt', 'km per uur'], ['Een bus rijdt', 'km per uur'], ['Een boot vaart', 'km per uur']]);
  return { kind: 'num', answer: d, unit: 'km', key: `snel${v}-${time}`, text: `${who[0]} <b>${v} ${who[1]}</b>. Hoe ver komt hij in <b>${fmt(time)} uur</b>?`,
    hint: half ? `Eerst ${h} uur: ${h} × ${v}. Dan een half uur: de helft van ${v}.` : 'Afstand = snelheid × tijd. Hoeveel kilometer in 1 uur? Doe dat keer het aantal uren.', explain: `${fmt(time)} × ${v} = <b>${fmt(d)} km</b>.` };
}
function genSchaal(diff) {
  const sc = kies(diff === 'easy' ? [10, 100] : diff === 'medium' ? [20, 50, 100, 200] : [25, 50, 500, 1000]), cm = rnd(2, 9), real = cm * sc;
  const inM = real >= 100 && real % 100 === 0 && Math.random() < .6;
  return { kind: 'num', answer: inM ? real / 100 : real, unit: inM ? 'm' : 'cm', comma: false, key: `schaal${sc}-${cm}-${inM}`,
    text: `Op de tekening is een muur <b>${cm} cm</b>. De schaal is <b>1 : ${sc}</b>. Hoe lang is de muur echt${inM ? ' (in meter)' : ''}?`,
    hint: `1 cm op de tekening is ${sc} cm in het echt. Doe ${cm} × ${sc}${inM ? ' en reken om naar meter (: 100)' : ''}.`, explain: inM ? `${cm} × ${sc} = ${real} cm = <b>${real / 100} m</b>.` : `${cm} × ${sc} = <b>${real} cm</b>.` };
}
function genKans(diff) {
  const r = rnd(1, diff === 'easy' ? 4 : 7), b = rnd(1, diff === 'easy' ? 4 : 7), g = diff === 'hard' ? rnd(1, 4) : 0, tot = r + b + g;
  const colors = [['rode', r], ['blauwe', b], ['groene', g]].filter(x => x[1] > 0), [cn, cc] = kies(colors);
  const f = (a, bb) => `${a} van de ${bb}`;
  return Object.assign(mkChoice(f(cc, tot), [f(tot - cc, tot), f(cc, tot - cc), f(cc + 1, tot), f(cc, tot + 1)], 3), {
    text: `In een zak zitten ${colors.map(c => `<b>${c[1]}</b> ${c[0]}`).join(', ')} knikkers. Je pakt zonder te kijken één knikker. Wat is de kans op een <b>${cn}</b>?`,
    key: `kans${r}-${b}-${g}-${cn}`, hint: 'Kans = het aantal goede knikkers van het totaal. Tel eerst alle knikkers.', explain: `Er zijn ${tot} knikkers, ${cc} ${cn}. De kans is <b>${f(cc, tot)}</b>.` });
}
function genOnderNul(diff) {
  const a = -rnd(1, diff === 'easy' ? 5 : 12), b = rnd(1, diff === 'easy' ? 6 : 15), d = b - a;
  return { kind: 'num', answer: d, unit: 'graden', key: `nul${a}-${b}`, text: `Vanochtend was het <b>${fmt(a)} °C</b> (onder nul). Vanmiddag is het <b>${b} °C</b>. Hoeveel graden is het warmer geworden?`,
    hint: `Ga eerst van ${fmt(a)} naar 0, en dan verder naar ${b}.`, explain: `Van ${fmt(a)} naar 0 is ${-a} graden. Van 0 naar ${b} is ${b} graden. Samen <b>${d}</b>.` };
}
function genEindtoets(diff) {
  const pool = ['rekenen/procenten', 'rekenen/verhouding', 'rekenen/gemiddelde', 'rekenen/snelheid', 'rekenen/schaal', 'rekenen/kans', 'rekenen/onder0', 'rekenen/breuken', 'rekenen/meten', 'rekenen/grafiek', 'rekenen/verhaal'].filter(k => TOPIC[k] && k !== 'rekenen/eindtoets');
  return TOPIC[kies(pool)].gen(diff);
}

/* ========================= aanmelden ========================= */
const regB = (subj, tp) => registerTopic(subj, Object.assign({ comma: false, pace: { easy: 6, medium: 5, hard: 4 } }, tp));
regB('rekenen', { id: 'patroon', name: 'Patronen', sub: 'wat komt er daarna?', ico: '🔁', grades: [1, 3], gen: genPatroon, lesson: [
  { t: 'Wat is een patroon?', h: 'Een <b>patroon</b> is iets dat zich steeds herhaalt: rood, blauw, rood, blauw, …', v: '<div class="patrow"><span>🔴</span><span>🔵</span><span>🔴</span><span>🔵</span><span class="patq">?</span></div>' },
  { t: 'Zoek het stukje dat terugkomt', h: 'Kijk waar het patroon opnieuw begint. Dat stukje blijft zich herhalen.', v: '<div class="patrow"><span>⭐</span><span>⭐</span><span>🌙</span><span>⭐</span><span>⭐</span><span>🌙</span><span class="patq">?</span></div>' }] });
regB('rekenen', { id: 'cijfers', name: 'Cijfers en getallen', sub: 'vijf is 5', ico: '5️⃣', grades: [1, 3], gen: genCijfers, lesson: [
  { t: 'Getal en woord', h: 'Elk getal heeft een naam: <b>1</b> is één, <b>2</b> is twee, <b>3</b> is drie…', v: `<div class="shaperow">${[1, 2, 3, 4, 5].map(n => `<span><b style="font-size:1.8rem">${n}</b><small>${NUMW[n]}</small></span>`).join('')}</div>` },
  { t: 'Zing mee', h: 'Tel mee met Pip.', w: 'liedje', o: { song: 'tellen' } }] });
regB('rekenen', { id: 'groterkleiner', name: 'Groter of kleiner', sub: '7 of 9?', ico: '↔️', grades: [1, 3], gen: genGroterKleiner, lesson: [
  { t: 'Groter of kleiner?', h: 'Op de getallenrij staat het grootste getal het verst naar rechts.', v: numberLine(0, 10, 1, [{ v: 7, label: '7' }, { v: 9, label: '9' }], { labelEvery: 1 }) }] });
regB('rekenen', { id: 'erna', name: 'Wat komt erna?', sub: 'na en voor', ico: '➡️', grades: [1, 3], gen: genErna, lesson: [
  { t: 'Na en voor', h: 'Het getal <b>na</b> 6 is 7. Het getal <b>voor</b> 6 is 5. Tel maar mee: 5, 6, 7.' }] });
regB('rekenen', { id: 'volgorde', name: 'Op volgorde', sub: 'klein naar groot', ico: '🔢', grades: [1, 4], gen: genVolgorde, lesson: [
  { t: 'Zet ze op een rij', h: 'Begin bij het <b>kleinste</b> getal als het van klein naar groot moet. Zoek steeds het kleinste dat nog over is.' }] });
regB('taal', { id: 'dehet', name: 'De of het?', sub: 'de stoel, het huis', ico: '🅰️', grades: [3, 6], gen: genDeHet, lesson: [
  { t: 'De of het?', h: 'Voor de meeste woorden zeg je <b>de</b>: de stoel, de hond. Voor sommige zeg je <b>het</b>: het huis, het boek. Alle verkleinwoordjes zijn <b>het</b>: het meisje, het boekje.' },
  { t: 'Kaartjes', h: 'Tik op een kaartje.', w: 'kaarten', o: { cards: [['de', 'de stoel', '🪑'], ['het', 'het huis', '🏠'], ['de', 'de hond', '🐶'], ['het', 'het boek', '📖'], ['de', 'de boom', '🌳'], ['het', 'het ei', '🥚']] } }] });
regB('taal', { id: 'boekjes', name: 'Leesboekjes', sub: 'lezen en vragen', ico: '📚', grades: [3, 5], gen: genBoekje, pace: { easy: 3, medium: 3, hard: 3 }, lesson: BOEKJES.map(b => ({ t: b.title, h: 'Lees mee. Tik op een woord om het te horen.', w: 'boekje', o: { id: b.id } })) });
regB('rekenen', { id: 'gemiddelde', name: 'Gemiddelde', sub: 'optellen en delen', ico: '📐', grades: [6, 8], gen: genGemiddelde, lesson: [
  { t: 'Wat is het gemiddelde?', h: 'Het <b>gemiddelde</b> is wat iedereen zou hebben als alles eerlijk verdeeld was. Tel alles op en deel door het aantal.' },
  { t: 'Stap voor stap', h: 'Zo doe je het.', w: 'stappen', o: { lines: ['De getallen: <b>4, 6, 8</b>', 'Samen: 4 + 6 + 8 = 18', 'Het zijn er 3: 18 : 3 = <b>6</b>'] } }] });
regB('rekenen', { id: 'snelheid', name: 'Snelheid', sub: 'km per uur', ico: '🚴', grades: [7, 8], gen: genSnelheid, lesson: [
  { t: 'Afstand, snelheid en tijd', h: 'Als je <b>40 km per uur</b> rijdt, kom je in 1 uur 40 km ver, in 2 uur 80 km. <b>afstand = snelheid × tijd</b>.' }] });
regB('rekenen', { id: 'schaal', name: 'Schaal', sub: '1 : 50', ico: '🗺️', grades: [7, 8], gen: genSchaal, lesson: [
  { t: 'Wat is schaal?', h: 'Bij schaal <b>1 : 50</b> is <b>1 cm</b> op de tekening <b>50 cm</b> in het echt. Doe de lengte op de tekening keer 50.' }] });
regB('rekenen', { id: 'kans', name: 'Kans', sub: 'knikkers pakken', ico: '🎲', grades: [7, 8], gen: genKans, lesson: [
  { t: 'Wat is kans?', h: 'De <b>kans</b> zeg je met een breuk: het aantal goede van het totaal. 3 rode van 8 knikkers: kans <b>3 van de 8</b>.' }] });
regB('rekenen', { id: 'onder0', name: 'Onder nul', sub: 'min-getallen', ico: '🥶', grades: [6, 8], gen: genOnderNul, lesson: [
  { t: 'Onder nul', h: 'Een temperatuur van <b>−4</b> is onder nul. Van −4 naar 0 is 4 graden warmer, en dan nog verder erbij.', v: numberLine(-5, 5, 1, [{ v: -4, label: '−4' }], { labelEvery: 5 }) }] });
regB('rekenen', { id: 'eindtoets', name: 'Eindtoets-training', sub: 'van alles wat', ico: '🎯', grades: [7, 8], gen: genEindtoets, pace: { easy: 4, medium: 3.5, hard: 3 }, lesson: [
  { t: 'Eindtoets-training', h: 'Hier oefen je een beetje van alles wat in groep 7 en 8 belangrijk is: procenten, verhoudingen, gemiddelde, snelheid, schaal, kans, breuken en meten. Lees elke vraag rustig twee keer.' }] });

/* ========================= De Route ========================= */
const CREATURE = {
  tafels: '🐲', delen: '🍕', plusmin: '⚖️', groot: '🏰', breuken: '🍰', geld: '🪙', meten: '📏', opp: '🔲', grafiek: '📊', klok: '🕰️', verhaal: '📖', lab: '🔭',
  tellen: '🐢', meerminder: '🦆', vormen: '🔷', tot20: '🧮', splitsen: '✂️', verhouding: '🥤', procenten: '💯', patroon: '🦋', cijfers: '5️⃣', groterkleiner: '🦒', erna: '🐜', volgorde: '🚂', gemiddelde: '🏊', snelheid: '🚴', schaal: '🗺️', kans: '🎲', onder0: '🐧', eindtoets: '🎯',
  eiij: '🐣', auou: '🦉', gch: '🐸', dubbel: '🎈', dt: '🐕', woorden: '🐙', lezen: '📜', zinsdelen: '🧩', woordsoort: '🏷️', meervoud: '🐑', spreuk: '🦉', klank: '🔤', rijmen: '🎶', woordlezen: '📗', kofschip: '⛵', dehet: '🅰️', boekjes: '📚',
  groeten: '👋', getallen: '🔢', kleuren: '🎨', familie: '👨‍👩‍👧', eten: '🥟', dieren: '🦎', dagen: '📅', zinnen: '💬', grammatika: '🧩', weetjes: '🌴'
};
function routeHTML(sid, list) {
  const nodes = list.map((tp, i) => {
    const st = topicStatus(tp.key), done = st === 'super', ts = D.topics[tp.key];
    return `<button class="rnode st-${st}" data-rt="${tp.key}" aria-label="${esc(tTopic(tp))}"><span class="rn-c">${CREATURE[tp.id] || tp.ico}</span><span class="rn-b">${done ? '🏅' : (ts && ts.answered ? '•' : '')}</span><small>${esc(tTopic(tp))}</small></button>${i < list.length - 1 ? '<i class="rline"></i>' : ''}`;
  }).join('');
  const nDone = list.filter(tp => topicStatus(tp.key) === 'super').length;
  return `<div class="route card"><div class="route-h"><b>🧭 ${tri(['Jouw route', 'Bo ruta', 'Your route'])}</b><span>${nDone} / ${list.length} 🏅</span></div><div class="route-path">${nodes}</div></div>`;
}
function routeBind(el) {
  $$('[data-rt]', el).forEach(b => b.onclick = () => { SND.click(); const tp = $(`.topic [data-learn="${b.dataset.rt}"]`, el); const card = tp && tp.closest('.topic'); if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); move(card, 'pop'); } });
}
