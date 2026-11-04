'use strict';
/* =====================================================================
   Toverschool Sterrenlicht – vragen-motor 2.0 (stap 1)
   - Nieuwe soorten vragen melden zich aan met registerKind (zie util.js).
   - Nakijken staat in gegevens (gradeSpec), niet in losse code per vraag.
   - Nieuwe soorten: 'line' (schatten op een getallenlijn, bijna goed is goed),
     'grid' (vakjes kleuren), 'multi' (kies alles wat klopt).
   - Onderwerp: Toverlab (rekenen).
   ===================================================================== */

/* ---------- nakijken als gegevens ----------
   spec = { method: 'value' | 'set' | 'order', exact: [..], interval: [{min,max}], required: 1, distinct: false }
   given = lijst met waarden (getallen of indexen) */
function gradeSpec(spec, given) {
  const g = (given || []).slice();
  const E = 1e-9;
  if (spec.method === 'set') {
    const a = [...new Set(g)].sort((x, y) => x - y), b = spec.exact.slice().sort((x, y) => x - y);
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  if (spec.method === 'order') return g.length === spec.exact.length && g.every((v, i) => v === spec.exact[i]);
  const hit = v => (spec.exact || []).some(e => Math.abs(e - v) < E) || (spec.interval || []).some(r => v >= r.min - E && v <= r.max + E);
  if (spec.distinct && new Set(g).size !== g.length) return false;
  return g.length >= (spec.required || 1) && g.every(hit);
}

/* ---------- getallenlijn met schuif: schatten ---------- */
const roundTo = (v, step) => Math.round(Math.round(v / step) * step * 1e6) / 1e6;
registerKind('line', {
  render(q, box, api) {
    const L = q.line, X = S.ext;
    X.val = null;
    const pos = v => ((v - L.lo) / (L.hi - L.lo)) * 100;
    box.innerHTML = `<div class="xk lineq">
        <div class="lq-bubble" id="lqv" aria-live="polite">${t('lineMove')}</div>
        <input type="range" class="lq-range" id="lqr" min="${L.lo}" max="${L.hi}" step="${L.step}" value="${L.lo}" aria-label="${esc(strip(q.text))}">
        <div class="lq-ticks">${L.labels.map(l => `<span style="left:${pos(l.v)}%">${l.txt}</span>`).join('')}</div>
      </div>
      <button class="btn primary cast" id="cast">${t('cast')}</button>`;
    const r = $('#lqr', box), bub = $('#lqv', box);
    const set = () => { X.val = roundTo(+r.value, L.step); bub.textContent = fmt(X.val) + (L.unit ? ' ' + L.unit : ''); bub.classList.add('on'); SND.click(); };
    r.addEventListener('input', set);
    r.addEventListener('change', set);
    $('#cast', box).onclick = () => api.submit();
  },
  guess: () => ({ v: S.ext.val }),
  empty: g => g.v == null,
  check: (q, g) => gradeSpec(q.spec, [g.v]),
  answerText: q => fmt(q.line.target) + (q.line.unit ? ' ' + q.line.unit : ''),
  givenText: (q, g) => g.v == null ? '–' : fmt(g.v),
  mark(q, g) { const b = $('#lqv'); if (b) { b.classList.add(gradeSpec(q.spec, [g.v]) ? 'right' : 'wrong'); } const r = $('#lqr'); if (r) r.disabled = true; }
});

/* ---------- vakjes kleuren ---------- */
registerKind('grid', {
  render(q, box, api) {
    const G = q.grid, X = S.ext; X.n = 0;
    const cells = Array.from({ length: G.total }, (_, i) => `<button class="gc" data-i="${i}" aria-label="${i + 1}"></button>`).join('');
    box.innerHTML = `<div class="xk gridq"><div class="gq-count" id="gqc" aria-live="polite">0 ${t('gridOf')} ${G.total}</div>
      <div class="gq-grid" style="grid-template-columns:repeat(${G.cols},1fr);max-width:${Math.min(G.cols * 44, 440)}px">${cells}</div></div>
      <button class="btn primary cast" id="cast">${t('cast')}</button>`;
    const paint = () => { $$('.gc', box).forEach((b, i) => b.classList.toggle('on', i < X.n)); $('#gqc', box).textContent = `${X.n} ${t('gridOf')} ${G.total}`; };
    $$('.gc', box).forEach(b => b.onclick = () => { const i = +b.dataset.i; X.n = (X.n === i + 1) ? i : i + 1; SND.click(); paint(); });
    $('#cast', box).onclick = () => api.submit();
  },
  guess: () => ({ n: S.ext.n }),
  empty: g => !g.n,
  check: (q, g) => gradeSpec(q.spec, [g.n]),
  answerText: q => q.answerText,
  givenText: (q, g) => `${g.n} ${t('gridOf')} ${q.grid.total}`,
  mark(q, g) {
    const ok = gradeSpec(q.spec, [g.n]);
    $$('.gc').forEach((b, i) => { b.disabled = true; if (!ok && i < q.spec.exact[0]) b.classList.add('hint'); });
    $('#gqc')?.classList.add(ok ? 'right' : 'wrong');
  }
});

/* ---------- kies alles wat klopt ---------- */
registerKind('multi', {
  render(q, box, api) {
    const X = S.ext; X.sel = new Set();
    box.innerHTML = `<div class="xk"><div class="choices ${q.big ? 'bigc' : ''} n${q.choices.length > 4 ? 3 : q.choices.length}">${q.choices.map((c, i) => `<button class="choice mchoice" data-c="${i}" aria-pressed="false">${c}</button>`).join('')}</div></div>
      <button class="btn primary cast" id="cast">${t('cast')}</button>`;
    $$('.mchoice', box).forEach(b => b.onclick = () => { const i = +b.dataset.c; X.sel.has(i) ? X.sel.delete(i) : X.sel.add(i); b.classList.toggle('on'); b.setAttribute('aria-pressed', X.sel.has(i)); SND.click(); });
    $('#cast', box).onclick = () => api.submit();
  },
  guess: () => ({ sel: [...S.ext.sel] }),
  empty: g => !g.sel.length,
  check: (q, g) => gradeSpec(q.spec, g.sel),
  answerText: q => q.spec.exact.map(i => q.plain ? q.plain[i] : strip(q.choices[i])).join(', '),
  givenText: (q, g) => g.sel.map(i => q.plain ? q.plain[i] : strip(q.choices[i])).join(', ') || '–',
  mark(q, g) {
    $$('.mchoice').forEach((b, i) => { b.disabled = true; const should = q.spec.exact.includes(i), did = g.sel.includes(i); if (should) b.classList.add('right'); else if (did) b.classList.add('wrong'); });
  }
});

/* ---------- vragen maken (alles uitgerekend, niets geraden) ---------- */
function labelsFor(lo, hi, fm) { return [lo, (lo + hi) / 2, hi].map(v => ({ v, txt: fm(v) })); }

function labGenLine(diff) {
  const variants = diff === 'easy' ? ['whole', 'dec'] : diff === 'medium' ? ['whole', 'dec', 'frac'] : ['wholeBig', 'dec', 'frac'];
  const kind = kies(variants);
  let lo = 0, hi, step, target, tol, unit = '', txt, shown, explain, hint;
  if (kind === 'whole' || kind === 'wholeBig') {
    hi = kind === 'whole' ? 100 : 1000; step = kind === 'whole' ? 1 : 10;
    target = kind === 'whole' ? rnd(2, 19) * 5 : rnd(11, 95) * 10;
    tol = hi * (diff === 'easy' ? .06 : diff === 'medium' ? .04 : .03);
    shown = fmt(target);
    txt = `Sleep naar <b>${shown}</b>. Op een streepje precies hoeft niet, dichtbij is goed!`;
    hint = `De lijn loopt van ${fmt(lo)} tot ${fmt(hi)}. Het midden is ${fmt(hi / 2)}. Zit ${shown} links of rechts van het midden?`;
    explain = `${shown} is ${fmt(target / hi * 100)}% van de lijn. Dat is ongeveer ${target < hi / 2 ? 'links van' : target > hi / 2 ? 'rechts van' : 'precies in'} het midden. Goed gaat tot ${fmt(tol)} ernaast.`;
  } else if (kind === 'dec') {
    hi = 1; step = .01;
    target = diff === 'easy' ? rnd(1, 9) / 10 : rnd(2, 98) / 100;
    tol = diff === 'hard' ? .03 : .05;
    shown = fmt(target);
    txt = `Waar hoort <b>${shown}</b> op de lijn van 0 tot 1?`;
    hint = `Eén heel is 1,00. ${shown} is ${fmt(Math.round(target * 100))} honderdsten van de lijn.`;
    explain = `${shown} = ${fmt(Math.round(target * 100))} van de 100 stukjes. Het midden (0,5) is een goed anker.`;
  } else {
    hi = 1; step = .01;
    const d = kies([2, 4, 5, 8, 10]); const n = rnd(1, d - 1);
    target = n / d; tol = .05;
    shown = frac(n, d);
    txt = `Waar hoort ${shown} op de lijn van 0 tot 1?`;
    hint = `Verdeel de lijn in ${d} gelijke stukken. Tel ${n} stuk${n > 1 ? 'ken' : ''} vanaf 0.`;
    explain = `${n}/${d} = ${fmt(Math.round(target * 100) / 100)}. Dat zit bij ${Math.round(target * 100)}% van de lijn.`;
  }
  const spec = { method: 'value', exact: [target], interval: [{ min: target - tol, max: target + tol }] };
  return { kind: 'line', text: txt, line: { lo, hi, step, target, unit, labels: labelsFor(lo, hi, fmt) }, spec, hint, explain, key: 'line' + kind + target };
}

function labGenGrid(diff) {
  const mode = kies(diff === 'easy' ? ['dec100', 'pct'] : ['dec100', 'pct', 'frac']);
  let total, cols, n, txt, hint, explain, ansT;
  if (mode === 'frac') {
    const d = kies([5, 8, 10, 4]); n = rnd(1, d - 1); total = d; cols = d <= 5 ? d : d / 2 === Math.floor(d / 2) ? d / 2 : d;
    txt = `Kleur ${frac(n, d)} van het rooster.`;
    hint = `Het rooster heeft ${d} vakjes. De noemer ${d} zegt: ${d} gelijke stukken. De teller ${n} zegt: kleur er ${n}.`;
    explain = `${n}/${d} betekent ${n} van de ${d} vakjes.`; ansT = `${n} ${t('gridOf')} ${d}`;
  } else {
    total = 100; cols = 10;
    if (mode === 'pct') { n = diff === 'easy' ? rnd(1, 9) * 10 : rnd(1, 19) * 5; txt = `Kleur <b>${n}%</b> van het rooster.`; hint = `100% is het hele rooster van 100 vakjes. Dus ${n}% is ${n} vakjes.`; explain = `${n}% = ${n} van de 100 vakjes.`; }
    else { n = diff === 'easy' ? rnd(1, 9) * 10 : rnd(3, 97); txt = `Kleur <b>${fmt(n / 100)}</b> van het rooster.`; hint = `Het hele rooster is 1. Een vakje is dus 0,01. Je hebt ${n} vakjes nodig.`; explain = `${fmt(n / 100)} = ${n} honderdsten = ${n} van de 100 vakjes.`; }
    ansT = `${n} ${t('gridOf')} 100`;
  }
  return { kind: 'grid', text: txt, grid: { total, cols }, spec: { method: 'value', exact: [n] }, answerText: ansT, hint, explain, key: 'grid' + mode + n + total };
}

function labGenMulti(diff) {
  const sub = kies(['dec', 'eq']);
  if (sub === 'dec') {
    const ref = diff === 'easy' ? kies([1, 2, 3]) : rnd(10, 40) / 10; const pool = new Set();
    while (pool.size < 6) pool.add(Math.round((ref + (rnd(-15, 15) / 10) + rnd(0, 9) / 100) * 100) / 100);
    let vals = shuffle([...pool]).filter(v => Math.abs(v - ref) > .005);
    vals = vals.slice(0, 6); const exact = vals.map((v, i) => v > ref ? i : -1).filter(i => i >= 0);
    if (exact.length < 1 || exact.length > 4) return labGenMulti(diff);
    return { kind: 'multi', text: `Kies <b>alle</b> getallen die <b>groter</b> zijn dan <b>${fmt(ref)}</b>.`, choices: vals.map(fmt), plain: vals.map(fmt), spec: { method: 'set', exact }, hint: `Vergelijk eerst de hele getallen, kijk dan naar de tienden en honderdsten.`, explain: `Groter dan ${fmt(ref)} zijn: ${exact.map(i => fmt(vals[i])).join(', ')}.`, key: 'multidec' + ref + vals.join() };
  }
  const base = kies([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5]]);
  const eq = [], other = [];
  for (const k of [2, 3, 4, 5]) eq.push([base[0] * k, base[1] * k]);
  for (let tries = 0; tries < 40 && other.length < 4; tries++) { const d = rnd(3, 12), n = rnd(1, d - 1); if (n * base[1] !== d * base[0] && !other.some(o => o[0] === n && o[1] === d)) other.push([n, d]); }
  const items = shuffle([...shuffle(eq).slice(0, rnd(1, 3)).map(p => ({ p, ok: true })), ...other.slice(0, 5).map(p => ({ p, ok: false }))]).slice(0, 6);
  const exact = items.map((x, i) => x.ok ? i : -1).filter(i => i >= 0);
  if (!exact.length) return labGenMulti(diff);
  return { kind: 'multi', big: true, text: `Kies <b>alle</b> breuken die <b>evenveel</b> zijn als ${frac(base[0], base[1])}.`, choices: items.map(x => frac(x.p[0], x.p[1])), plain: items.map(x => `${x.p[0]}/${x.p[1]}`), spec: { method: 'set', exact }, hint: `Maak de breuk ${base[0]}/${base[1]} twee keer, drie keer zo groot: vermenigvuldig teller en noemer met hetzelfde getal.`, explain: `${base[0]}/${base[1]} = ${[2, 3, 4].map(k => `${base[0] * k}/${base[1] * k}`).join(' = ')}. Teller en noemer met hetzelfde getal vermenigvuldigen geeft evenveel.`, key: 'multieq' + base + items.map(x => x.p).join('|') };
}

function genLab(diff) {
  return kies([labGenLine, labGenLine, labGenGrid, labGenGrid, labGenMulti])(diff);
}

registerTopic('rekenen', {
  id: 'lab', name: 'Toverlab', sub: 'schatten, vakjes & kiezen', ico: '🔭', gen: genLab, comma: false, pace: { easy: 7, medium: 6, hard: 5 }, lesson: [
    { t: 'Schatten mag!', h: 'Soms hoef je niet precies te zijn. Op de lijn mag je <b>dichtbij</b> slepen: een klein beetje ernaast is ook goed. Zoek eerst het midden en de helft van de helft.', v: numberLine(0, 100, 10, [{ v: 50, label: '50' }, { v: 35, label: '35?', cls: 'q' }], { labelEvery: 50 }) },
    { t: 'Honderd vakjes', h: '<b>0,35</b> = <b>35 honderdsten</b> = <b>35%</b>. Op een rooster van 100 kleur je dus 35 vakjes. Tik op het laatste vakje dat je wilt kleuren: alles ervoor wordt ook gekleurd.' },
    { t: 'Evenveel breuken', h: 'Vermenigvuldig teller en noemer met <b>hetzelfde</b> getal: 1/2 = 2/4 = 3/6 = 4/8. Zo vind je alle breuken die evenveel zijn.', w: 'stappen', o: { lines: ['<b>1/2</b>', 'Keer 2: <b>2/4</b>', 'Keer 3: <b>3/6</b>', 'Alle drie zijn evenveel! ✔️'] } }
  ]
});
