'use strict';
/* =====================================================================
   Puzzelmotoren (naar de bouwstenen uit het onderzoek: één motor, veel vragen)
   Elke motor meldt zich aan met registerKind en krijgt onderwerpen met
   gegenereerde vragen. Alles wordt uitgerekend, niets geraden.
   Motoren: blokken (plaatswaarde), balans (weegschaal), kassa (betalen en
   wisselgeld), klokzet (klok instellen), meter (thermometer, maatbeker,
   liniaal), taart (breuken), hop (lettergrepen), typ (dictee), sorteer
   (sorteerband), verbind (stippen met de tafels), kaart (schatkaart),
   poort (poortrenner), spiegel (spiegelbeeld), paren (paren zoeken),
   echo (muziekpatroon herhalen).
   Elke vraag heeft voor het testen een goede (sol) en een foute (bad) invoer.
   ===================================================================== */

const fold = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const mtBox = (inner, cls = '') => `<div class="xk mt ${cls}">${inner}</div><button class="btn primary cast" id="cast">${t('cast')}</button>`;
const mtDone = (box, api) => { const c = $('#cast', box); if (c) c.onclick = () => api.submit(); };
const mtMark = (ok, sel = '.mt') => { const m = $(sel); if (m) m.classList.add(ok ? 'right' : 'wrong'); $$('.mt button, .mt input').forEach(b => { b.disabled = true; }); };
const mtBeat = (f, d = .16) => tone([f], d, 'triangle', .06);

/* ---------- 1. blokken: plaatswaarde ---------- */
registerKind('blokken', {
  render(q, box, api) {
    const X = S.ext; X.d = [0, 0, 0]; const cols = q.blok.hundreds ? [0, 1, 2] : [1, 2], names = ['honderdtallen', 'tientallen', 'eenheden'], col = ['#7C5CD6', '#2FA36B', '#FFB547'];
    const draw = () => {
      box.innerHTML = mtBox(`<div class="bl-total" aria-live="polite">${X.d[0] * 100 + X.d[1] * 10 + X.d[2]}</div><div class="bl-cols">${cols.map(c => `<div class="bl-col"><b>${names[c]}</b><div class="bl-stack">${Array.from({ length: X.d[c] }, () => `<i style="background:${col[c]}"></i>`).join('')}</div>
        <div class="bl-btn"><button class="chip" data-bm="${c}">−</button><span>${X.d[c]}</span><button class="chip" data-bp="${c}">+</button></div></div>`).join('')}</div>`);
      $$('[data-bp]', box).forEach(b => b.onclick = () => { const c = +b.dataset.bp; if (X.d[c] < 9) X.d[c]++; SND.click(); draw(); });
      $$('[data-bm]', box).forEach(b => b.onclick = () => { const c = +b.dataset.bm; if (X.d[c] > 0) X.d[c]--; SND.click(); draw(); });
      mtDone(box, api);
    };
    draw();
  },
  guess: () => ({ n: S.ext.d[0] * 100 + S.ext.d[1] * 10 + S.ext.d[2] }), empty: g => g.n === 0, check: (q, g) => g.n === q.blok.target,
  answerText: q => String(q.blok.target), givenText: (q, g) => String(g.n), mark(q, g) { mtMark(g.n === q.blok.target); }
});
function genBlokken(diff) {
  const h = diff !== 'easy', n = diff === 'easy' ? rnd(11, 99) : diff === 'medium' ? rnd(101, 899) : kies([rnd(1, 9) * 100 + rnd(0, 9), rnd(1, 9) * 100 + rnd(1, 9) * 10, rnd(101, 999)]);
  const H = Math.floor(n / 100), T = Math.floor(n / 10) % 10, E = n % 10;
  return { kind: 'blokken', text: `Bouw het getal <b>${n}</b> met blokjes.`, blok: { target: n, hundreds: h }, key: 'blok' + n, sol: { n }, bad: { n: n + 1 },
    hint: h ? `Kijk naar elk cijfer: ${H} honderdtallen, ${T} tientallen en ${E} eenheden.` : `${T} tientallen en ${E} eenheden.`, explain: `${n} = ${h ? H + ' honderdtallen, ' : ''}${T} tientallen en ${E} eenheden.` };
}

/* ---------- 2. balans: weegschaal ---------- */
registerKind('balans', {
  render(q, box, api) {
    const X = S.ext; X.st = []; const stones = q.bal.stones;
    const draw = () => {
      const sum = X.st.reduce((a, b) => a + b, 0), diff = Math.max(-1, Math.min(1, (sum - q.bal.left) / Math.max(4, q.bal.left)));
      box.innerHTML = mtBox(`<div class="bal"><div class="bal-beam" style="transform:rotate(${(diff * 12).toFixed(1)}deg)"><div class="bal-pan l"><b>${q.bal.leftTxt}</b></div><div class="bal-pan r">${X.st.map((s, i) => `<button class="bal-st" data-r="${i}">${s}</button>`).join('') || '<small>…</small>'}</div></div><div class="bal-foot"></div></div>
        <div class="bal-sum" aria-live="polite">${sum}</div><div class="bal-stones">${stones.map(s => `<button class="chip big" data-s="${s}">${s}</button>`).join('')}</div>`);
      $$('[data-s]', box).forEach(b => b.onclick = () => { X.st.push(+b.dataset.s); mtBeat(300 + 20 * X.st.length); draw(); });
      $$('[data-r]', box).forEach(b => b.onclick = () => { X.st.splice(+b.dataset.r, 1); SND.click(); draw(); });
      mtDone(box, api);
    };
    draw();
  },
  guess: () => ({ sum: S.ext.st.reduce((a, b) => a + b, 0) }), empty: g => g.sum === 0, check: (q, g) => g.sum === q.bal.left,
  answerText: q => String(q.bal.left), givenText: (q, g) => String(g.sum), mark(q, g) { mtMark(g.sum === q.bal.left); }
});
function genBalans(diff) {
  let left, txt;
  if (diff === 'easy') { left = rnd(4, 15); txt = String(left); }
  else if (diff === 'medium') { const a = rnd(3, 12), b = rnd(3, 15); left = a + b; txt = `${a} + ${b}`; }
  else { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(1, 12); left = a * b + c; txt = `${a} × ${b} + ${c}`; }
  const stones = diff === 'easy' ? [1, 2, 5] : [1, 2, 5, 10];
  return { kind: 'balans', text: `Links ligt <b>${txt}</b>. Leg gewichtjes rechts tot de weegschaal in balans is.`, bal: { left, leftTxt: txt, stones }, key: 'bal' + txt, sol: { sum: left }, bad: { sum: left + 1 },
    hint: `Reken eerst uit wat links ligt${txt === String(left) ? '' : ` (${txt} = ${left})`}. Zoek gewichtjes die samen ${left} zijn.`, explain: `${txt}${txt === String(left) ? '' : ' = ' + left}. Rechts moet ook ${left} liggen.` };
}

/* ---------- 3. kassa: betalen en wisselgeld ---------- */
registerKind('kassa', {
  render(q, box, api) {
    const X = S.ext; X.c = [];
    const draw = () => {
      const sum = X.c.reduce((a, b) => a + b, 0);
      box.innerHTML = mtBox(`<div class="ks-top"><div class="ks-tag">${q.kassa.tag}</div><div class="ks-sum" aria-live="polite">${euro(sum)}</div></div>
        <div class="ks-coins">${q.kassa.coins.map(c => `<button class="coin ${c >= 500 ? 'note' : c >= 100 ? 'gold' : ''}" data-c="${c}">${c >= 100 ? '€ ' + c / 100 : c + ' ct'}</button>`).join('')}</div><button class="chip" data-undo>↶</button>`);
      $$('[data-c]', box).forEach(b => b.onclick = () => { X.c.push(+b.dataset.c); mtBeat(500 + 30 * X.c.length, .1); draw(); });
      $('[data-undo]', box).onclick = () => { X.c.pop(); SND.click(); draw(); };
      mtDone(box, api);
    };
    draw();
  },
  guess: () => ({ sum: S.ext.c.reduce((a, b) => a + b, 0) }), empty: g => g.sum === 0, check: (q, g) => g.sum === q.kassa.target,
  answerText: q => euro(q.kassa.target), givenText: (q, g) => euro(g.sum), mark(q, g) { mtMark(g.sum === q.kassa.target); }
});
function genKassa(diff) {
  const coins = diff === 'easy' ? [10, 20, 50, 100, 200] : [5, 10, 20, 50, 100, 200, 500, 1000];
  const step = diff === 'easy' ? 10 : 5;
  if (diff !== 'easy' && Math.random() < .5) {
    const cost = rnd(2, 19) * 50 + (diff === 'hard' ? rnd(0, 9) * 5 : 0), paid = [500, 1000, 2000].find(p => p > cost + 30), back = paid - cost;
    return { kind: 'kassa', text: `Het kost <b>${euro(cost)}</b>. Je betaalt met <b>${euro(paid)}</b>. Geef het <b>wisselgeld</b>.`, kassa: { target: back, coins, tag: '🛍️ ' + euro(cost) }, key: 'kassaT' + cost + paid, sol: { sum: back }, bad: { sum: back + 5 },
      hint: `Reken uit: ${euro(paid)} min ${euro(cost)}. Tel vanaf de prijs omhoog naar ${euro(paid)}.`, explain: `${euro(paid)} − ${euro(cost)} = <b>${euro(back)}</b>.` };
  }
  const price = (diff === 'easy' ? rnd(2, 19) * 10 : rnd(4, 60) * 5 + (rnd(0, 1) ? 0 : 100));
  return { kind: 'kassa', text: `Betaal precies <b>${euro(price)}</b> met munten en briefjes.`, kassa: { target: price, coins, tag: '🛍️ ' + euro(price) }, key: 'kassaB' + price, sol: { sum: price }, bad: { sum: price + step },
    hint: 'Begin met het grootste geldstuk dat past, en vul aan met kleinere.', explain: `Samen precies ${euro(price)}.` };
}

/* ---------- 4. klokzet: klok instellen ---------- */
function mtClock(tmin) {
  const h = (tmin / 60) % 12, m = tmin % 60, ah = h * 30, am = m * 6, p = (a, r) => `${100 + r * Math.sin(a * Math.PI / 180)} ${100 - r * Math.cos(a * Math.PI / 180)}`;
  return `<svg viewBox="0 0 200 200" class="mt-clock" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="#fff" stroke="#7C5CD6" stroke-width="6"/>${Array.from({ length: 12 }, (_, i) => { const a = (i + 1) * 30; return `<text x="${100 + 76 * Math.sin(a * Math.PI / 180)}" y="${100 - 76 * Math.cos(a * Math.PI / 180) + 6}" text-anchor="middle" font-size="16" font-weight="800" fill="#2B2140">${i + 1}</text>`; }).join('')}
    <line x1="100" y1="100" x2="${p(ah, 46).split(' ')[0]}" y2="${p(ah, 46).split(' ')[1]}" stroke="#2B2140" stroke-width="7" stroke-linecap="round"/><line x1="100" y1="100" x2="${p(am, 68).split(' ')[0]}" y2="${p(am, 68).split(' ')[1]}" stroke="#E8402A" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="#2B2140"/></svg>`;
}
registerKind('klokzet', {
  render(q, box, api) {
    const X = S.ext; X.t = q.klok.start;
    const draw = () => {
      box.innerHTML = mtBox(`${mtClock(X.t)}<div class="kz-dig" aria-live="polite">${tstr(Math.floor(X.t / 60) % 12 || 12, X.t % 60)}</div><div class="kz-btn"><button class="chip" data-d="-60">−1 uur</button><button class="chip" data-d="60">+1 uur</button><button class="chip" data-d="-${q.klok.step}">−${q.klok.step} min</button><button class="chip" data-d="${q.klok.step}">+${q.klok.step} min</button></div>`);
      $$('[data-d]', box).forEach(b => b.onclick = () => { X.t = ((X.t + +b.dataset.d) % 720 + 720) % 720; mtBeat(400 + (X.t % 60)); draw(); });
      mtDone(box, api);
    };
    draw();
  },
  guess: () => ({ t: S.ext.t }), empty: () => false, check: (q, g) => g.t === q.klok.target,
  answerText: q => tstr(q.klok.target / 60 | 0 || 12, q.klok.target % 60), givenText: (q, g) => tstr(Math.floor(g.t / 60) % 12 || 12, g.t % 60), mark(q, g) { mtMark(g.t === q.klok.target); }
});
function genKlokzet(diff) {
  const step = diff === 'easy' ? 30 : diff === 'medium' ? 15 : 5, h = rnd(1, 12), m = rnd(0, 59 / step | 0) * step, target = (h % 12) * 60 + m;
  let start = rnd(0, 11) * 60; if (start === target) start = (start + 60) % 720;
  const say = m === 0 ? `${h} uur` : m === 30 ? `half ${h % 12 + 1}` : m === 15 ? `kwart over ${h}` : m === 45 ? `kwart voor ${h % 12 + 1}` : `${tstr(h, m)}`;
  return { kind: 'klokzet', text: `Zet de klok op <b>${tstr(h, m)}</b> (${say}).`, klok: { target, start, step: Math.min(step, 15) }, key: 'klokzet' + h + ':' + m, sol: { t: target }, bad: { t: (target + 60) % 720 },
    hint: 'De korte wijzer wijst de uren, de lange wijzer de minuten. Zet eerst het uur, dan de minuten.', explain: `${tstr(h, m)}: de korte wijzer bij de ${h}${m ? ', de lange wijzer op de ' + m / 5 : ', de lange wijzer omhoog'}.` };
}

/* ---------- 5. meter: thermometer, maatbeker, liniaal ---------- */
registerKind('meter', {
  render(q, box, api) {
    const X = S.ext, M = q.meter; X.v = M.lo;
    box.innerHTML = mtBox(`<div class="mm-wrap"><div class="mm-vis ${M.kind}"><div class="mm-fill" id="mmf"></div>${M.kind === 'liniaal' ? '<div class="mm-ticks">' + Array.from({ length: M.hi - M.lo + 1 }, (_, i) => `<span style="left:${i / (M.hi - M.lo) * 100}%">${i + M.lo}</span>`).join('') + '</div>' : ''}</div>
      <div class="mm-read" id="mmr" aria-live="polite">${M.lo} ${M.unit}</div><input type="range" class="w-range" id="mms" min="${M.lo}" max="${M.hi}" step="${M.step}" value="${M.lo}" aria-label="${esc(M.unit)}"></div>`);
    const upd = () => { X.v = +$('#mms', box).value; $('#mmf', box).style[M.kind === 'liniaal' ? 'width' : 'height'] = ((X.v - M.lo) / (M.hi - M.lo) * 100) + '%'; $('#mmr', box).textContent = `${fmt(X.v)} ${M.unit}`; };
    $('#mms', box).oninput = () => { upd(); SND.click(); }; upd(); mtDone(box, api);
  },
  guess: () => ({ v: S.ext.v }), empty: () => false, check: (q, g) => Math.abs(g.v - q.meter.target) < 1e-9,
  answerText: q => `${fmt(q.meter.target)} ${q.meter.unit}`, givenText: (q, g) => `${fmt(g.v)} ${q.meter.unit}`, mark(q, g) { mtMark(Math.abs(g.v - q.meter.target) < 1e-9); }
});
function genMeter(diff) {
  const kind = kies(['thermo', 'beker', 'liniaal']);
  let M, txt;
  if (kind === 'thermo') { const t0 = diff === 'easy' ? rnd(1, 8) * 5 : rnd(1, 39); M = { kind, lo: 0, hi: 40, step: 1, unit: '°C', target: t0 }; txt = `Maak de thermometer <b>${t0} graden</b>.`; }
  else if (kind === 'beker') { const ml = diff === 'easy' ? rnd(1, 9) * 50 : rnd(1, 19) * 25; M = { kind, lo: 0, hi: 500, step: 25, unit: 'ml', target: Math.min(500, ml) }; txt = `Vul de maatbeker met <b>${M.target} ml</b>.`; }
  else { const c = diff === 'easy' ? rnd(1, 14) : rnd(2, 29) / 2; M = { kind, lo: 0, hi: 15, step: .5, unit: 'cm', target: c }; txt = `Teken een streep van <b>${fmt(c)} cm</b> op de liniaal.`; }
  return { kind: 'meter', text: txt, meter: M, key: 'meter' + kind + M.target, sol: { v: M.target }, bad: { v: M.target + M.step },
    hint: kind === 'thermo' ? 'Elk streepje is 1 graad. Schuif tot het getal klopt.' : kind === 'beker' ? 'Elk streepje is 25 ml. Twee streepjes zijn 50 ml.' : 'Begin bij de 0. Een heel streepje is 1 cm, een half streepje is 0,5 cm.', explain: `Het antwoord is ${fmt(M.target)} ${M.unit}.` };
}

/* ---------- 6. taart: breuken inkleuren ---------- */
registerKind('taart', {
  render(q, box, api) {
    const X = S.ext, d = q.taart.d; X.on = new Set();
    const slice = i => { const a0 = i * 360 / d - 90, a1 = (i + 1) * 360 / d - 90, r = 90, pt = a => `${100 + r * Math.cos(a * Math.PI / 180)} ${100 + r * Math.sin(a * Math.PI / 180)}`; return `M100 100 L${pt(a0)} A${r} ${r} 0 ${360 / d > 180 ? 1 : 0} 1 ${pt(a1)}Z`; };
    box.innerHTML = mtBox(`<svg viewBox="0 0 200 200" class="tp-svg">${Array.from({ length: d }, (_, i) => `<path class="tp-s" data-i="${i}" d="${slice(i)}" fill="#F3E9FF" stroke="#7C5CD6" stroke-width="3"/>`).join('')}</svg><div class="tp-cnt" id="tpc" aria-live="polite">0 / ${d}</div>`);
    $$('.tp-s', box).forEach(p => p.onclick = () => { const i = +p.dataset.i; X.on.has(i) ? X.on.delete(i) : X.on.add(i); p.setAttribute('fill', X.on.has(i) ? '#FF8FB8' : '#F3E9FF'); $('#tpc', box).textContent = `${X.on.size} / ${d}`; SND.click(); });
    mtDone(box, api);
  },
  guess: () => ({ n: S.ext.on.size }), empty: g => !g.n, check: (q, g) => g.n === q.taart.n, answerText: q => `${q.taart.n} van ${q.taart.d}`, givenText: (q, g) => `${g.n} van ${q.taart.d}`, mark(q, g) { mtMark(g.n === q.taart.n); }
});
function genTaart(diff) {
  const d = kies(diff === 'easy' ? [2, 4] : diff === 'medium' ? [3, 4, 5, 6, 8] : [5, 6, 8, 10, 12]), n = rnd(1, d - 1), pct = n / d * 100;
  const txt = diff === 'hard' && Number.isInteger(pct) ? `Kleur <b>${pct}%</b> van de taart.` : `Kleur ${frac(n, d)} van de taart.`;
  return { kind: 'taart', text: txt, taart: { d, n }, key: `taart${n}/${d}${txt.length}`, sol: { n }, bad: { n: n === d - 1 ? n - 1 : n + 1 }, hint: `De taart heeft ${d} gelijke stukken. Kleur er ${n}.`, explain: `${n} van de ${d} stukken${Number.isInteger(pct) ? ` = ${pct}%` : ''}.` };
}

/* ---------- 7. hop: lettergrepen ---------- */
const SYL = [['olifant', 3, '🐘'], ['vis', 1, '🐟'], ['bloemkool', 2, '🥦'], ['banaan', 2, '🍌'], ['fiets', 1, '🚲'], ['giraffe', 3, '🦒'], ['schildpad', 2, '🐢'], ['vlinder', 2, '🦋'], ['tafel', 2, '🪑'], ['computer', 3, '💻'], ['paraplu', 3, '☂️'], ['kangoeroe', 3, '🦘'],
  ['spin', 1, '🕷️'], ['ijsbeer', 2, '🐻‍❄️'], ['flamingo', 3, '🦩'], ['eiland', 2, '🏝️'], ['brug', 1, '🌉'], ['ananas', 3, '🍍'], ['regenboog', 3, '🌈'], ['konijn', 2, '🐰'], ['zonnebloem', 3, '🌻'], ['strand', 1, '🏖️']];
registerKind('hop', {
  render(q, box, api) {
    const X = S.ext; X.n = 0;
    box.innerHTML = mtBox(`<div class="hp-word"><span class="hp-e">${q.hop.emoji}</span><b>${q.hop.word}</b></div><div class="hp-pads" id="hpp"></div><div class="hp-btn"><button class="btn big" id="hphop">🐾 Hop!</button><button class="chip" id="hpreset">↺</button></div>`);
    const draw = () => { $('#hpp', box).innerHTML = Array.from({ length: X.n }, () => '<i class="hp-pad">🐾</i>').join('') || '<small>…</small>'; };
    $('#hphop', box).onclick = () => { if (X.n < 8) X.n++; mtBeat(330 + X.n * 60); draw(); if (motionOK()) move($('#hpp', box).lastElementChild, 'pop'); };
    $('#hpreset', box).onclick = () => { X.n = 0; SND.click(); draw(); }; draw(); mtDone(box, api);
  },
  guess: () => ({ n: S.ext.n }), empty: g => !g.n, check: (q, g) => g.n === q.hop.n, answerText: q => `${q.hop.n}`, givenText: (q, g) => `${g.n}`, mark(q, g) { mtMark(g.n === q.hop.n); }
});
function genHop(diff) {
  const pool = diff === 'easy' ? SYL.filter(x => x[1] <= 2) : SYL, [w, n, e] = kies(pool);
  return { kind: 'hop', text: 'Hoeveel <b>lettergrepen</b> heeft dit woord? Hop er één voor elke klap.', say: `Hoeveel lettergrepen heeft ${w}? Klap het woord en hop mee.`, hop: { word: w, n, emoji: e }, key: 'hop' + w, sol: { n }, bad: { n: n + 1 },
    hint: 'Zeg het woord langzaam en klap bij elk stukje. Voelt je kin bij elk stukje naar beneden? Dat is een lettergreep.', explain: `<b>${w}</b> heeft ${n} lettergreep${n > 1 ? 'pen' : ''}.` };
}

/* ---------- 8. typ: dictee ---------- */
const DICT = [...WLEES.map(x => [x[1], x[0]]), ...KLANK.map(x => [x[1], x[0]]), ['school', '🏫'], ['tafel', '🪑'], ['stoel', '💺'], ['boek', '📖'], ['water', '💧'], ['appel', '🍎'], ['brood', '🍞'], ['melk', '🥛'], ['hond', '🐶'], ['fiets', '🚲']].filter((x, i, a) => a.findIndex(y => y[0] === x[0]) === i);
registerKind('typ', {
  render(q, box, api) {
    const X = S.ext; X.s = '';
    box.innerHTML = mtBox(`<div class="ty-top"><span class="ty-e">${q.typ.emoji}</span><button class="btn small" id="tysay">🔊 ${tri(['Luister', 'Skucha', 'Listen'])}</button></div><div class="ty-len">${'_ '.repeat(q.typ.answer.length)}</div><input id="tyin" class="nameinp ty-in" maxlength="20" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="typ het woord">`);
    const hasSay = !q.typ.pap || (typeof VOICE_KEYS !== 'undefined' && VOICE_KEYS.has(q.typ.answer));
    if (!hasSay && $('#tysay', box)) $('#tysay', box).remove();
    const say = () => { if (!hasSay) return; if (q.typ.pap) return voicePlay(q.typ.answer); if (typeof canRead === 'function' && canRead()) speakNL(q.typ.answer); else toast(tri(['Dit toestel kan niet voorlezen. Kijk naar het plaatje.', 'E aparato aki no por lesa. Wak e plachi.', 'This device cannot read aloud. Look at the picture.']), 2800); };
    if ($('#tysay', box)) $('#tysay', box).onclick = say; $('#tyin', box).oninput = e => { X.s = e.target.value; }; $('#tyin', box).onkeydown = e => { if (e.key === 'Enter') api.submit(); };
    setTimeout(() => { const i = $('#tyin'); if (i) i.focus(); say(); }, 300); mtDone(box, api);
  },
  guess: () => ({ s: String(S.ext.s || '').trim().toLowerCase() }), empty: g => !g.s, check: (q, g) => q.typ.loose ? fold(g.s) === fold(q.typ.answer) : g.s === q.typ.answer, answerText: q => q.typ.answer, givenText: (q, g) => g.s || '–', mark(q, g) { mtMark(q.typ.loose ? fold(g.s) === fold(q.typ.answer) : g.s === q.typ.answer); }
});
function genDictee(diff) {
  const pool = diff === 'easy' ? DICT.filter(x => x[0].length <= 4) : diff === 'medium' ? DICT.filter(x => x[0].length <= 6) : DICT, [w, e] = kies(pool);
  return { kind: 'typ', text: 'Luister naar het woord en <b>typ</b> het.', say: w, typ: { answer: w, emoji: diff === 'hard' ? '🔊' : e }, key: 'typ' + w, sol: { s: w }, bad: { s: w + 'x' },
    hint: `Het woord heeft ${w.length} letters en begint met een <b>${w[0]}</b>.`, explain: `Het woord is <b>${w}</b>.` };
}

/* ---------- 9. sorteer: sorteerband ---------- */
registerKind('sorteer', {
  render(q, box, api) {
    const X = S.ext, Z = q.sort; X.place = {}; X.sel = null;
    const draw = () => {
      const unplaced = Z.items.map((it, i) => [it, i]).filter(([, i]) => X.place[i] == null);
      box.innerHTML = mtBox(`<div class="so-belt">${unplaced.map(([it, i]) => `<button class="so-it ${X.sel === i ? 'on' : ''}" data-i="${i}">${it.t}</button>`).join('') || '<small>✔</small>'}</div>
        <div class="so-bins">${Z.bins.map((b, bi) => `<div class="so-bin" data-b="${bi}"><b>${b}</b><div class="so-in">${Z.items.map((it, i) => X.place[i] === bi ? `<button class="so-it in" data-un="${i}">${it.t}</button>` : '').join('')}</div></div>`).join('')}</div>`);
      $$('[data-i]', box).forEach(b => b.onclick = () => { X.sel = X.sel === +b.dataset.i ? null : +b.dataset.i; SND.click(); draw(); });
      $$('.so-bin', box).forEach(b => b.onclick = e => { if (e.target.closest('[data-un]')) return; if (X.sel != null) { X.place[X.sel] = +b.dataset.b; X.sel = null; mtBeat(420); draw(); } });
      $$('[data-un]', box).forEach(b => b.onclick = () => { delete X.place[+b.dataset.un]; SND.click(); draw(); });
      mtDone(box, api);
    }; draw();
  },
  guess: () => ({ place: Object.assign({}, S.ext.place) }), empty: g => !Object.keys(g.place).length,
  check: (q, g) => q.sort.items.every((it, i) => g.place[i] === it.b) && Object.keys(g.place).length === q.sort.items.length,
  answerText: q => q.sort.bins.map((b, bi) => `${b}: ${q.sort.items.filter(it => it.b === bi).map(it => strip(it.t)).join(', ')}`).join(' · '),
  givenText: (q, g) => q.sort.bins.map((b, bi) => `${b}: ${q.sort.items.filter((it, i) => g.place[i] === bi).map(it => strip(it.t)).join(', ')}`).join(' · '),
  mark(q, g) { mtMark(q.sort.items.every((it, i) => g.place[i] === it.b)); }
});
const sortSol = q => { q.sol = { place: Object.fromEntries(q.sort.items.map((it, i) => [i, it.b])) }; q.bad = { place: Object.fromEntries(q.sort.items.map((it, i) => [i, 1 - it.b])) }; delete q.mk; return q; };
function genSorteerGetal(diff) { return sortSol(genSorteerGetal0(diff)); }
function genSorteerGetal0(diff) {
  const v = diff === 'easy' ? 'eo' : kies(['eo', 'tafel']);
  if (v === 'eo') { const ns = [...new Set(Array.from({ length: 12 }, () => rnd(1, diff === 'easy' ? 20 : 99)))].slice(0, 6); const it = ns.map(n => ({ t: String(n), b: n % 2 })); if (!it.some(x => x.b) || it.every(x => x.b)) return genSorteerGetal0(diff);
    return { kind: 'sorteer', text: 'Sorteer de getallen: <b>even</b> of <b>oneven</b>?', sort: { bins: ['even', 'oneven'].map((x, i) => x), items: it.map(x => ({ t: x.t, b: x.b ? 1 : 0 })) }, key: 'soe' + ns.join(','), sol: null, hint: 'Even getallen eindigen op 0, 2, 4, 6 of 8.', explain: 'Even: eindigt op 0, 2, 4, 6, 8. Oneven: eindigt op 1, 3, 5, 7, 9.', mk: true }; }
  const [a, b] = kies([[2, 5], [3, 4], [3, 5], [4, 5], [6, 7], [3, 7], [4, 7], [5, 6], [2, 7], [7, 8], [4, 9], [5, 9]]), items = [], seen = new Set();
  for (let tries = 0; tries < 400 && items.length < 6; tries++) { const k = rnd(1, 12), which = items.filter(x => !x.b).length < 3 ? Math.random() < .5 : false, base = items.length % 2 ? b : a, n = base * k; if ((n % a === 0) !== (n % b === 0) && !seen.has(n)) { seen.add(n); items.push({ t: String(n), b: n % a === 0 ? 0 : 1 }); } }
  if (items.length < 4 || !items.some(x => x.b) || items.every(x => x.b)) return genSorteerGetal0(diff);
  items.sort(() => Math.random() - .5);
  return { kind: 'sorteer', text: `Sorteer de getallen: in de tafel van <b>${a}</b> of van <b>${b}</b>?`, sort: { bins: [`tafel van ${a}`, `tafel van ${b}`], items }, key: 'sot' + items.map(x => x.t).join(','), hint: `Tel op in sprongen van ${a} en van ${b}.`, explain: `Bij de ${a}: ${items.filter(x => !x.b).map(x => x.t).join(', ')}. Bij de ${b}: ${items.filter(x => x.b).map(x => x.t).join(', ')}.`, mk: true };
}
function genSorteerTaal(diff) { return sortSol(genSorteerTaal0(diff)); }
function genSorteerTaal0(diff) {
  if (Math.random() < .5) { const items = shuffle([...shuffle(DEHET.de).slice(0, 3).map(w => ({ t: w, b: 0 })), ...shuffle(DEHET.het).slice(0, 3).map(w => ({ t: w, b: 1 }))]);
    return { kind: 'sorteer', text: 'Sorteer de woorden: <b>de</b> of <b>het</b>?', sort: { bins: ['de', 'het'], items }, key: 'dh' + items.map(x => x.t).join(','), hint: 'Zeg het hardop met “de” of “het”: wat klinkt goed?', explain: `de: ${items.filter(x => !x.b).map(x => x.t).join(', ')}. het: ${items.filter(x => x.b).map(x => x.t).join(', ')}.` }; }
  const N = ['hond', 'huis', 'boom', 'fiets', 'school', 'vis', 'tafel', 'bal'], V = ['lopen', 'eten', 'slapen', 'zingen', 'springen', 'tekenen', 'lezen', 'dansen'];
  const items = shuffle([...shuffle(N).slice(0, 3).map(w => ({ t: w, b: 0 })), ...shuffle(V).slice(0, 3).map(w => ({ t: w, b: 1 }))]);
  return { kind: 'sorteer', text: 'Sorteer de woorden: <b>zelfstandig naamwoord</b> of <b>werkwoord</b>?', sort: { bins: ['zelfstandig naamwoord', 'werkwoord'], items }, key: 'nw' + items.map(x => x.t).join(','), hint: 'Een zelfstandig naamwoord kun je zien of aanraken. Een werkwoord is iets wat je doet.', explain: `Zelfstandig naamwoord: ${items.filter(x => !x.b).map(x => x.t).join(', ')}. Werkwoord: ${items.filter(x => x.b).map(x => x.t).join(', ')}.` };
}

/* ---------- 10. verbind: stippen verbinden met de tafels ---------- */
registerKind('verbind', {
  render(q, box, api) {
    const X = S.ext, V = q.verbind; X.tap = [];
    const draw = () => {
      const pts = V.pts, line = X.tap.map(i => `${pts[i].x},${pts[i].y}`).join(' ');
      box.innerHTML = mtBox(`<svg viewBox="0 0 300 240" class="vb-svg"><polyline points="${line}" fill="none" stroke="#7C5CD6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${pts.map((p, i) => `<g class="vb-dot ${X.tap.includes(i) ? 'on' : ''}" data-i="${i}"><circle cx="${p.x}" cy="${p.y}" r="17"/><text x="${p.x}" y="${p.y + 5}" text-anchor="middle">${p.v}</text></g>`).join('')}</svg><div class="vb-info">${X.tap.length} / ${V.order.length}</div>`);
      $$('.vb-dot', box).forEach(g => g.onclick = () => { const i = +g.dataset.i; if (X.tap.includes(i)) { if (X.tap[X.tap.length - 1] === i) X.tap.pop(); } else X.tap.push(i); mtBeat(350 + X.tap.length * 40, .1); draw(); });
      mtDone(box, api);
    }; draw();
  },
  guess: () => ({ tap: S.ext.tap.slice() }), empty: g => !g.tap.length, check: (q, g) => g.tap.length === q.verbind.order.length && g.tap.every((v, i) => v === q.verbind.order[i]),
  answerText: q => q.verbind.order.map(i => q.verbind.pts[i].v).join(' → '), givenText: (q, g) => g.tap.map(i => q.verbind.pts[i].v).join(' → ') || '–', mark(q, g) { mtMark(g.tap.length === q.verbind.order.length && g.tap.every((v, i) => v === q.verbind.order[i])); }
});
function genVerbind(diff) {
  const N = kies(diff === 'easy' ? [2, 5, 10] : [3, 4, 6, 7]), k = diff === 'easy' ? 6 : 8, multiples = Array.from({ length: k }, (_, i) => N * (i + 1));
  const dec = new Set(); while (dec.size < 12 - k) { const v = rnd(1, N * k); if (v % N) dec.add(v); }
  const vals = shuffle([...multiples, ...dec]), pts = vals.map((v, i) => { const a = i / 12 * 2 * Math.PI - Math.PI / 2; return { v, x: Math.round(150 + 105 * Math.cos(a)), y: Math.round(120 + 90 * Math.sin(a)) }; });
  const order = multiples.map(m => vals.indexOf(m));
  return { kind: 'verbind', text: `Verbind de getallen van de <b>tafel van ${N}</b>, van klein naar groot.`, verbind: { N, pts, order }, key: 'vb' + N + vals.join(','), sol: { tap: order }, bad: { tap: order.slice().reverse() },
    hint: `Tel op in sprongen van ${N}: ${multiples.slice(0, 4).join(', ')}, …`, explain: `De tafel van ${N}: ${multiples.join(', ')}.` };
}

/* ---------- 11. kaart: schatkaart met coördinaten ---------- */
registerKind('kaart', {
  render(q, box, api) {
    const X = S.ext, K = q.kaart; X.c = null;
    const L = 'ABCDEF';
    const draw = () => {
      box.innerHTML = mtBox(`<div class="km"><div class="km-top"><span></span>${Array.from({ length: K.n }, (_, c) => `<b>${L[c]}</b>`).join('')}</div>${Array.from({ length: K.n }, (_, r) => `<div class="km-row"><b>${r + 1}</b>${Array.from({ length: K.n }, (_, c) => `<button class="km-c ${X.c && X.c[0] === c && X.c[1] === r ? 'on' : ''}" data-c="${c}" data-r="${r}">${K.deco[c + ',' + r] || ''}</button>`).join('')}</div>`).join('')}</div>`);
      $$('.km-c', box).forEach(b => b.onclick = () => { X.c = [+b.dataset.c, +b.dataset.r]; mtBeat(450); draw(); });
      mtDone(box, api);
    }; draw();
  },
  guess: () => ({ c: S.ext.c }), empty: g => !g.c, check: (q, g) => !!g.c && g.c[0] === q.kaart.target[0] && g.c[1] === q.kaart.target[1],
  answerText: q => 'ABCDEF'[q.kaart.target[0]] + (q.kaart.target[1] + 1), givenText: (q, g) => g.c ? 'ABCDEF'[g.c[0]] + (g.c[1] + 1) : '–', mark(q, g) { mtMark(!!g.c && g.c[0] === q.kaart.target[0] && g.c[1] === q.kaart.target[1]); }
});
function genKaart(diff) {
  const n = diff === 'easy' ? 4 : 6, deco = {}, em = ['🌴', '⛵', '🐚', '🦀', '🏝️', '🐢', '🌺', '⚓'];
  for (const e of shuffle(em).slice(0, 5)) deco[rnd(0, n - 1) + ',' + rnd(0, n - 1)] = e;
  const target = [rnd(0, n - 1), rnd(0, n - 1)]; delete deco[target.join(',')];
  const name = 'ABCDEF'[target[0]] + (target[1] + 1);
  return { kind: 'kaart', text: `Tik op <b>${name}</b> om de schat te vinden. Eerst de letter (naar rechts), dan het cijfer (naar beneden).`, kaart: { n, target, deco }, key: 'kaart' + name + n, sol: { c: target }, bad: { c: [(target[0] + 1) % n, target[1]] },
    hint: `Zoek de letter ${name[0]} bovenaan. Ga dan naar beneden tot rij ${name.slice(1)}.`, explain: `${name[0]} is de kolom, ${name.slice(1)} is de rij. Daar ligt de schat.` };
}

/* ---------- 12. poort: poortrenner ---------- */
registerKind('poort', {
  render(q, box, api) {
    const X = S.ext, P = q.poort; X.i = 0; X.pk = [];
    const draw = () => {
      if (X.i >= P.gates.length) return;
      const g = P.gates[X.i];
      box.innerHTML = `<div class="xk mt"><div class="pt-run">${P.gates.map((_, i) => `<i class="${i < X.i ? (X.pk[i] === P.gates[i].ok ? 'ok' : 'no') : i === X.i ? 'now' : ''}">🚪</i>`).join('')}</div><div class="pt-q">${g.q}</div><div class="pt-opts">${g.o.map((o, i) => `<button class="choice big" data-o="${i}">${o}</button>`).join('')}</div></div>`;
      $$('[data-o]', box).forEach(b => b.onclick = () => { X.pk.push(+b.dataset.o); mtBeat(X.pk[X.pk.length - 1] === g.ok ? 600 : 220); X.i++; if (X.i >= P.gates.length) { api.submit(); } else draw(); });
    }; draw();
  },
  guess: () => ({ pk: S.ext.pk.slice() }), empty: g => !g.pk.length, check: (q, g) => g.pk.length === q.poort.gates.length && g.pk.every((p, i) => p === q.poort.gates[i].ok),
  answerText: q => q.poort.gates.map(g => g.o[g.ok]).join(' · '), givenText: (q, g) => g.pk.map((p, i) => q.poort.gates[i].o[p]).join(' · '), mark(q, g) { mtMark(g.pk.every((p, i) => p === q.poort.gates[i].ok)); }
});
function genPoortGetal(diff) {
  const max = diff === 'easy' ? 10 : 30, gates = Array.from({ length: 4 }, () => { let a = rnd(1, max), b = rnd(1, max); while (a === b) b = rnd(1, max); const big = Math.random() < .5; return { q: `Welk getal is <b>${big ? 'groter' : 'kleiner'}</b>?`, o: [String(a), String(b)], ok: (big ? a > b : a < b) ? 0 : 1 }; });
  return { kind: 'poort', text: 'Ren door de poortjes. Kies bij elke poort het goede getal!', poort: { gates }, key: 'pg' + gates.map(g => g.o.join('')).join('-'), sol: { pk: gates.map(g => g.ok) }, bad: { pk: gates.map(g => 1 - g.ok) }, hint: 'Lees bij elke poort goed: groter of kleiner?', explain: gates.map(g => g.o[g.ok]).join(', ') + ' waren de goede.' };
}
function genPoortTaal(diff) {
  const gates = Array.from({ length: 4 }, () => { const art = Math.random() < .5 ? 'de' : 'het', w = kies(DEHET[art]); return { q: `<b>…</b> ${w}`, o: ['de', 'het'], ok: art === 'de' ? 0 : 1 }; });
  return { kind: 'poort', text: 'Ren door de poortjes. Kies bij elk woord <b>de</b> of <b>het</b>!', poort: { gates }, key: 'pt' + gates.map(g => g.q).join(''), sol: { pk: gates.map(g => g.ok) }, bad: { pk: gates.map(g => 1 - g.ok) }, hint: 'Zeg het woord hardop met “de” of “het”.', explain: gates.map(g => strip(g.q).replace('…', g.o[g.ok])).join(', ') + '.' };
}

/* ---------- 13. spiegel: spiegelbeeld ---------- */
registerKind('spiegel', {
  render(q, box, api) {
    const X = S.ext, S0 = q.spiegel; X.on = new Set();
    const draw = () => {
      box.innerHTML = mtBox(`<div class="sg" style="grid-template-columns:repeat(${S0.w * 2},1fr)">${Array.from({ length: S0.h }, (_, r) => Array.from({ length: S0.w * 2 }, (_, c) => { const left = c < S0.w, k = c + ',' + r, on = left ? S0.src.has(k) : X.on.has(k); return `<button class="sg-c ${left ? 'src' : 'mine'} ${on ? 'on' : ''} ${c === S0.w ? 'mid' : ''}" ${left ? 'disabled' : `data-k="${k}"`}></button>`; }).join('')).join('')}</div>`);
      $$('[data-k]', box).forEach(b => b.onclick = () => { const k = b.dataset.k; X.on.has(k) ? X.on.delete(k) : X.on.add(k); SND.click(); draw(); });
      mtDone(box, api);
    }; draw();
  },
  guess: () => ({ cells: [...S.ext.on].sort() }), empty: g => !g.cells.length, check: (q, g) => g.cells.join('|') === q.spiegel.want.join('|'),
  answerText: q => `${q.spiegel.want.length} vakjes`, givenText: (q, g) => `${g.cells.length} vakjes`, mark(q, g) { mtMark(g.cells.join('|') === q.spiegel.want.join('|')); }
});
function genSpiegel(diff) {
  const w = 3, h = diff === 'easy' ? 4 : 5, n = diff === 'easy' ? 4 : diff === 'medium' ? 6 : 8, src = new Set();
  while (src.size < n) src.add(rnd(0, w - 1) + ',' + rnd(0, h - 1));
  const want = [...src].map(k => { const [c, r] = k.split(',').map(Number); return (2 * w - 1 - c) + ',' + r; }).sort();
  return { kind: 'spiegel', text: 'Teken het <b>spiegelbeeld</b>: kleur rechts de vakjes die de spiegel laat zien.', spiegel: { w, h, src, want }, key: 'sg' + [...src].sort().join(';'), sol: { cells: want }, bad: { cells: [...src].sort() },
    hint: 'De middenlijn is de spiegel. Een vakje links naast de lijn komt rechts náást de lijn. Een vakje helemaal links komt helemaal rechts.', explain: 'Alles aan de linkerkant komt omgekeerd aan de rechterkant.' };
}

/* ---------- 14. paren: paren zoeken ---------- */
registerKind('paren', {
  render(q, box, api) {
    const X = S.ext, P = q.paren; X.done = new Set(); X.mis = 0; X.sel = null;
    const L = P.left, R = P.right;
    const draw = () => {
      box.innerHTML = mtBox(`<div class="pr-cols"><div>${L.map((x, i) => `<button class="pr-b ${X.done.has(i) ? 'ok' : X.sel === i ? 'on' : ''}" data-l="${i}" ${X.done.has(i) ? 'disabled' : ''}>${x}</button>`).join('')}</div><div>${R.map((x, i) => `<button class="pr-b ${[...X.done].some(l => P.map[l] === i) ? 'ok' : ''}" data-r="${i}" ${[...X.done].some(l => P.map[l] === i) ? 'disabled' : ''}>${x}</button>`).join('')}</div></div><div class="pr-info">${X.done.size} / ${L.length}</div>`);
      $$('[data-l]', box).forEach(b => b.onclick = () => { X.sel = +b.dataset.l; SND.click(); draw(); });
      $$('[data-r]', box).forEach(b => b.onclick = () => { if (X.sel == null) return; if (P.map[X.sel] === +b.dataset.r) { X.done.add(X.sel); mtBeat(700); } else { X.mis++; mtBeat(200, .2); } X.sel = null; draw(); if (X.done.size === L.length) api.submit(); });
      if (X.done.size < L.length) mtDone(box, api);
    }; draw();
  },
  guess: () => ({ done: S.ext.done.size, mis: S.ext.mis }), empty: g => !g.done, check: (q, g) => g.done === q.paren.left.length && g.mis <= 2,
  answerText: q => q.paren.left.map((l, i) => `${strip(l)} = ${strip(q.paren.right[q.paren.map[i]])}`).join(' · '), givenText: (q, g) => `${g.done} van ${q.paren.left.length}, ${g.mis} fout`, mark(q, g) { mtMark(g.done === q.paren.left.length && g.mis <= 2); }
});
function mkParen(pairs) {
  const rIdx = shuffle(pairs.map((_, i) => i)); const left = pairs.map(p => p[0]), right = rIdx.map(i => pairs[i][1]), map = pairs.map((_, i) => rIdx.indexOf(i));
  return { left, right, map };
}
function genParen(diff) {
  const v = diff === 'easy' ? 'plaat' : kies(['tafel', 'helft', 'plaat']);
  let pairs, txt;
  if (v === 'tafel') { const set = new Set(), seen = new Set(); while (set.size < 5) { const a = rnd(2, 9), b = rnd(2, 9); if (!seen.has(a * b)) { seen.add(a * b); set.add(a + '×' + b); } } pairs = [...set].map(x => { const [a, b] = x.split('×').map(Number); return [`${a} × ${b}`, String(a * b)]; }); txt = 'Zoek de sommen en de uitkomsten die bij elkaar horen.'; }
  else if (v === 'helft') { const set = new Set(); while (set.size < 5) set.add(rnd(2, 30) * 2); pairs = [...set].map(n => [`helft van ${n}`, String(n / 2)]); txt = 'Zoek de helften die bij elkaar horen.'; }
  else { const pool = shuffle(WLEES).slice(0, 5); pairs = pool.map(x => [x[0], x[1]]); txt = 'Zoek het plaatje en het woord dat erbij hoort.'; }
  const P = mkParen(pairs);
  return { kind: 'paren', text: txt, paren: P, key: 'pr' + pairs.map(p => p[0]).join(','), sol: { done: 5, mis: 0 }, bad: { done: 3, mis: 5 }, hint: 'Begin met het makkelijkste paar. Wat overblijft wordt steeds makkelijker.', explain: pairs.map(p => `${p[0]} = ${p[1]}`).join(' · ') };
}

/* ---------- 15. echo: muziekpatroon herhalen ---------- */
const ECHO_F = [262, 330, 392, 523], ECHO_C = ['#FF5E8E', '#FFB547', '#4FC8A4', '#7C8CF4'];
registerKind('echo', {
  render(q, box, api) {
    const X = S.ext; X.taps = []; X.busy = false;
    box.innerHTML = mtBox(`<div class="ec-pads">${ECHO_C.map((c, i) => `<button class="ec-pad" data-p="${i}" style="--c:${c}" aria-label="klank ${i + 1}"></button>`).join('')}</div><button class="btn" id="ecplay">🎧 ${tri(['Luister', 'Skucha', 'Listen'])}</button><div class="ec-info" id="eci">${tri(['Luister en doe het na', 'Skucha i hasi mes', 'Listen, then copy it'])}</div>`);
    const flash = i => { const p = $(`[data-p="${i}"]`, box); if (p) { p.classList.add('lit'); setTimeout(() => p.classList.remove('lit'), 260); } mtBeat(ECHO_F[i], .22); };
    const play = () => { if (X.busy) return; X.busy = true; X.taps = []; q.echo.seq.forEach((n, k) => setTimeout(() => { if ($('#ecplay', box)) flash(n); if (k === q.echo.seq.length - 1) setTimeout(() => { X.busy = false; }, 400); }, 350 + k * 520)); };
    $$('.ec-pad', box).forEach(p => p.onclick = () => { if (X.busy) return; X.taps.push(+p.dataset.p); flash(+p.dataset.p); $('#eci', box).textContent = `${X.taps.length} / ${q.echo.seq.length}`; });
    $('#ecplay', box).onclick = play; setTimeout(play, 500); mtDone(box, api);
  },
  guess: () => ({ taps: S.ext.taps.slice() }), empty: g => !g.taps.length, check: (q, g) => g.taps.length === q.echo.seq.length && g.taps.every((v, i) => v === q.echo.seq[i]),
  answerText: q => q.echo.seq.map(i => ['rood', 'oranje', 'groen', 'blauw'][i]).join(' – '), givenText: (q, g) => g.taps.map(i => ['rood', 'oranje', 'groen', 'blauw'][i]).join(' – ') || '–', mark(q, g) { mtMark(g.taps.length === q.echo.seq.length && g.taps.every((v, i) => v === q.echo.seq[i])); }
});
function genEcho(diff) {
  const n = diff === 'easy' ? 3 : diff === 'medium' ? 4 : 6, seq = Array.from({ length: n }, () => rnd(0, 3));
  return { kind: 'echo', text: 'Luister naar de klanken en speel ze <b>precies na</b>.', echo: { seq }, key: 'echo' + seq.join(''), sol: { taps: seq }, bad: { taps: seq.map((v, i) => i === 0 ? (v + 1) % 4 : v) },
    hint: 'Zing de klanken zacht mee in je hoofd: rood, oranje, groen, blauw.', explain: `Het patroon was: ${seq.map(i => ['rood', 'oranje', 'groen', 'blauw'][i]).join(' – ')}.` };
}

/* ========================= onderwerpen ========================= */
const reg = (subj, tp) => registerTopic(subj, Object.assign({ comma: false, pace: { easy: 5, medium: 4, hard: 3 } }, tp));
const LES1 = (t1, h) => [{ t: t1, h }];
reg('rekenen', { id: 'blokken', name: 'Blokken bouwen', sub: 'plaatswaarde', ico: '🧱', grades: [2, 5], gen: genBlokken, lesson: LES1('Honderdtallen, tientallen, eenheden', 'Een getal bouw je van blokjes: <b>honderdtallen</b>, <b>tientallen</b> en <b>eenheden</b>. 345 is 3 honderdtallen, 4 tientallen en 5 eenheden.') });
reg('rekenen', { id: 'balans', name: 'Weegschaal', sub: 'in balans', ico: '⚖️', grades: [2, 6], gen: genBalans, lesson: LES1('Balans', 'Een weegschaal is in balans als links en rechts <b>evenveel</b> weegt. Reken eerst uit wat links ligt en zoek gewichtjes die samen net zo veel zijn.') });
reg('rekenen', { id: 'kassa', name: 'Kassa', sub: 'betalen en wisselgeld', ico: '🏪', grades: [3, 7], gen: genKassa, lesson: LES1('Betalen en wisselgeld', 'Wisselgeld = wat je betaalt <b>min</b> de prijs. Tel vanaf de prijs omhoog tot het bedrag dat je gaf.') });
reg('rekenen', { id: 'klokzet', name: 'Klok zetten', sub: 'stel de klok in', ico: '🕰️', grades: [3, 6], gen: genKlokzet, lesson: LES1('Klok zetten', 'De <b>korte wijzer</b> is voor de uren, de <b>lange wijzer</b> voor de minuten. Bij de 3 zijn het 15 minuten, bij de 6 zijn het 30 minuten, bij de 9 zijn het 45 minuten.') });
reg('rekenen', { id: 'meter', name: 'Meetgereedschap', sub: 'thermometer, beker, liniaal', ico: '🌡️', grades: [4, 8], gen: genMeter, lesson: LES1('Meten met gereedschap', 'Kijk goed naar de streepjes op het gereedschap. Hoeveel is één streepje? Tel dan door.') });
reg('rekenen', { id: 'taart', name: 'Taartpunten', sub: 'breuken inkleuren', ico: '🍰', grades: [3, 7], gen: genTaart, lesson: LES1('Een breuk van een taart', '<b>3/8</b> betekent: de taart is in 8 gelijke stukken gedeeld en je neemt er 3. De noemer (onder) zegt hoeveel stukken, de teller (boven) hoeveel je neemt.') });
reg('rekenen', { id: 'verbind', name: 'Stippen verbinden', sub: 'met de tafels', ico: '🔗', grades: [3, 5], gen: genVerbind, lesson: LES1('Tafels als stippen', 'Verbind alleen de getallen van één tafel, van klein naar groot. Zo teken je een figuur.') });
reg('rekenen', { id: 'schatkaart', name: 'Schatkaart', sub: 'letters en cijfers', ico: '🗺️', grades: [4, 7], gen: genKaart, lesson: LES1('Coördinaten', 'Op een kaart heeft elk vakje een naam: eerst de <b>letter</b> (naar rechts), dan het <b>cijfer</b> (naar beneden). B4 is de tweede kolom, de vierde rij.') });
reg('rekenen', { id: 'poortgetal', name: 'Poortrenner', sub: 'groter of kleiner', ico: '🚪', grades: [1, 4], gen: genPoortGetal, lesson: LES1('Poortrenner', 'Ren door vier poorten. Bij elke poort kies je het goede getal. Lees goed: groter of kleiner?') });
reg('rekenen', { id: 'spiegel', name: 'Spiegelbeeld', sub: 'links en rechts', ico: '🪞', grades: [3, 6], gen: genSpiegel, lesson: LES1('Spiegelen', 'Bij een spiegel komt wat links is rechts, en omgekeerd. Het vakje naast de spiegel blijft naast de spiegel.') });
reg('rekenen', { id: 'paren', name: 'Paren zoeken', sub: 'wat hoort bij elkaar', ico: '🧩', grades: [2, 6], gen: genParen, lesson: LES1('Paren zoeken', 'Tik links een kaartje en rechts het kaartje dat erbij hoort. Een paar dat klopt blijft staan.') });
reg('rekenen', { id: 'echo', name: 'Echo-muziek', sub: 'luister en speel na', ico: '🎶', grades: [1, 5], gen: genEcho, lesson: LES1('Echo', 'Luister goed naar de klanken en speel ze <b>in dezelfde volgorde</b> na. Zing ze zacht mee in je hoofd.') });
reg('rekenen', { id: 'sorteergetal', name: 'Sorteerband (getallen)', sub: 'even, oneven, tafels', ico: '🏭', grades: [2, 7], gen: genSorteerGetal, lesson: LES1('Sorteren', 'Tik een getal aan en dan het vak waar het in hoort. Tik op een getal in een vak om het terug te zetten.') });
reg('taal', { id: 'hop', name: 'Lettergrepen', sub: 'klap en hop', ico: '👏', grades: [1, 4], gen: genHop, lesson: LES1('Lettergrepen', 'Een woord kun je in stukjes klappen. <b>o-li-fant</b> heeft 3 klappen, dus 3 lettergrepen.') });
reg('taal', { id: 'dictee', name: 'Dictee', sub: 'luister en typ', ico: '✏️', grades: [2, 5], gen: genDictee, lesson: LES1('Dictee', 'Luister goed naar het woord. Zeg het langzaam in stukjes en typ wat je hoort.') });
reg('taal', { id: 'sorteertaal', name: 'Sorteerband (taal)', sub: 'de/het, woordsoorten', ico: '🏭', grades: [3, 7], gen: genSorteerTaal, lesson: LES1('Woorden sorteren', 'Zet elk woord in het juiste vak. Bij “de of het” helpt hardop zeggen.') });
reg('taal', { id: 'poorttaal', name: 'Poortrenner (de/het)', sub: 'ren door de poorten', ico: '🚪', grades: [3, 5], gen: genPoortTaal, lesson: LES1('Poortrenner', 'Kies bij elk woord <b>de</b> of <b>het</b>. Zeg het hardop: wat klinkt goed?') });

/* gegevens voor de test en voor de ouders: elke motor heeft zijn eigen soort vraag */
const MOTOREN = ['blokken', 'balans', 'kassa', 'klokzet', 'meter', 'taart', 'hop', 'typ', 'sorteer', 'verbind', 'kaart', 'poort', 'spiegel', 'paren', 'echo'];
