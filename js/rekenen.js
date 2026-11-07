'use strict';
/* =====================================================================
   REKENEN (Getallenmagie) – vragen, uitleg en lessen
   Nieuwe vragen? Schrijf een functie gen(diff) die een vraag-object
   teruggeeft en meld hem aan met registerTopic (zie onderaan).
   ===================================================================== */
/* =====================================================================
   1. TAFELS
   ===================================================================== */
function jumps(a, b) { return Array.from({ length: b }, (_, i) => (i + 1) * a).join(', '); }
// item = 'bxa' (bijv. '7x8'): die som komt terug in de herhaling
function genTafels(diff, item) {
  const tables = diff === 'easy' ? [1, 2, 3, 4, 5, 10] : diff === 'medium' ? [2, 3, 4, 5, 6, 7, 8, 9, 10] : [3, 4, 6, 7, 8, 9];
  let a = kies(tables);
  let b = diff === 'hard' ? rnd(2, 10) : rnd(1, 10);
  if (item) [b, a] = String(item).split('x').map(Number);
  const r = Math.random();
  const variant = item || diff === 'easy' ? 'plain' : diff === 'medium' ? (r < .25 ? 'missing' : 'plain') : (r < .3 ? 'missing' : r < .5 ? 'tens' : 'plain');
  const p = a * b, it = `${b}x${a}`;
  if (variant === 'missing') return {
    text: `${BOX} × ${a} = ${p}`, kind: 'num', answer: b, item: it,
    hint: `Zeg de tafel van ${a} op: ${a}, ${2 * a}, ${3 * a}, … Bij de hoeveelste kom je op ${p}?`,
    explain: `${b} × ${a} = ${p}. Dus op de plaats van het vraagteken hoort <b>${b}</b>.`
  };
  if (variant === 'tens') return {
    text: `${a} × ${b * 10} =`, kind: 'num', answer: p * 10, item: it,
    hint: `Reken eerst ${a} × ${b}. Zet er daarna een 0 achter.`,
    explain: `${a} × ${b} = ${p}. ${b * 10} is tien keer zo veel als ${b}, dus het antwoord is ook tien keer zo veel: <b>${p * 10}</b>.`
  };
  let hint, explain;
  if (b === 10) { hint = `Keer 10: zet een 0 achter ${a}.`; explain = `10 × ${a} = <b>${p}</b>. Bij keer 10 zet je een 0 achter het getal.`; }
  else if (b === 1) { hint = `1 keer een getal is gewoon dat getal.`; explain = `1 × ${a} = <b>${a}</b>.`; }
  else if (b === 5) { hint = `5 × ${a} is de helft van 10 × ${a} = ${10 * a}.`; explain = `5 × ${a} = <b>${p}</b>. Dat is de helft van 10 × ${a} = ${10 * a}.`; }
  else if (b > 5) { hint = `Weet je 5 × ${a}? Dat is ${5 * a}. Tel er dan nog ${b - 5} × ${a} bij.`; explain = `${b} × ${a} = <b>${p}</b>. Handig: 5 × ${a} = ${5 * a} en ${b - 5} × ${a} = ${(b - 5) * a}. Samen ${p}.`; }
  else { hint = `Tel in sprongen van ${a}: ${a}, ${2 * a}, …`; explain = `${b} × ${a} = <b>${p}</b>. In sprongen van ${a}: ${jumps(a, b)}.`; }
  return { text: `${b} × ${a} =`, kind: 'num', answer: p, item: it, hint, explain };
}

/* =====================================================================
   2. DELEN (ook met rest)
   ===================================================================== */
function genDelen(diff) {
  if (diff === 'easy') {
    const d = kies([2, 3, 4, 5, 10]), q = rnd(1, 10), n = d * q;
    return { text: `${n} : ${d} =`, kind: 'num', answer: q,
      hint: `Welk getal keer ${d} is ${n}? Denk aan de tafel van ${d}.`,
      explain: `${q} × ${d} = ${n}, dus ${n} : ${d} = <b>${q}</b>.` };
  }
  const restQ = (n, d, q, r, extra) => ({
    text: `${n} : ${d} =`, kind: 'rest', answer: { q, r },
    hint: extra && extra.hint || `Zoek in de tafel van ${d} het grootste getal dat niet groter is dan ${n}. Wat er overblijft is de rest.`,
    explain: extra && extra.explain || (r
      ? `${q} × ${d} = ${d * q}. Er blijft ${n} − ${d * q} = ${r} over. Dus ${n} : ${d} = <b>${q} rest ${r}</b>.`
      : `${q} × ${d} = ${n}. Er blijft niets over, dus ${n} : ${d} = <b>${q}</b> (rest 0).`)
  });
  if (diff === 'medium') {
    const d = rnd(2, 10), q = rnd(1, 10), r = Math.random() < .6 ? rnd(1, d - 1) : 0;
    return restQ(d * q + r, d, q, r);
  }
  // moeilijk
  const v = Math.random();
  if (v < .6) {
    const d = rnd(3, 9), q = rnd(11, 29), r = Math.random() < .5 ? rnd(1, d - 1) : 0, n = d * q + r;
    const t = Math.floor(q / 10) * 10, p1 = d * t, rest = n - p1;
    return restQ(n, d, q, r, {
      hint: `Splits ${n} in twee handige stukken. Begin met ${p1}: dat is ${t} × ${d}.`,
      explain: `Splits ${n} in ${p1} en ${rest}.<br>${p1} : ${d} = ${t}.<br>${rest} : ${d} = ${q - t}${r ? ' rest ' + r : ''}.<br>Samen: <b>${q}${r ? ' rest ' + r : ''}</b>.`
    });
  }
  if (v < .85) {
    const d = rnd(2, 9), q = rnd(2, 9) * 10, n = d * q;
    return restQ(n, d, q, 0, {
      hint: `Reken eerst ${n / 10} : ${d}. Zet er dan een 0 achter.`,
      explain: `${n / 10} : ${d} = ${q / 10}. Dan is ${n} : ${d} tien keer zo veel: <b>${q}</b>.`
    });
  }
  const q = rnd(12, 99), n = q * 10;
  return restQ(n, 10, q, 0, {
    hint: `Bij delen door 10 haal je een 0 weg.`,
    explain: `${n} : 10 = <b>${q}</b>. Bij delen door 10 haal je de 0 aan het eind weg.`
  });
}

/* =====================================================================
   3. PLUS EN MIN tot 10.000
   ===================================================================== */
const placeVal = (n, p) => p === 1000 ? Math.floor(n / 1000) * 1000 : Math.floor(n / p) % 10 * p;
function explainPlus(a, b) {
  const parts = [], sums = [];
  for (const p of [1000, 100, 10, 1]) {
    const pa = placeVal(a, p), pb = placeVal(b, p);
    if (pa || pb) { parts.push(`${fmt(pa)} + ${fmt(pb)} = ${fmt(pa + pb)}`); sums.push(fmt(pa + pb)); }
  }
  if (parts.length === 1) return `${fmt(a)} + ${fmt(b)} = <b>${fmt(a + b)}</b>.`;
  return `Splits de getallen:<br>${parts.join('<br>')}<br>Samen: ${sums.join(' + ')} = <b>${fmt(a + b)}</b>.`;
}
function explainMinus(a, b) {
  let cur = a; const steps = [];
  for (const p of [1000, 100, 10, 1]) {
    const pb = placeVal(b, p);
    if (pb) { steps.push(`${fmt(cur)} − ${fmt(pb)} = ${fmt(cur - pb)}`); cur -= pb; }
  }
  if (steps.length === 1) return `${fmt(a)} − ${fmt(b)} = <b>${fmt(a - b)}</b>.`;
  return `Haal er stap voor stap af:<br>${steps.join('<br>')}<br>Het antwoord is <b>${fmt(a - b)}</b>.`;
}
function genPlusMin(diff) {
  const op = Math.random() < .5 ? '+' : '−';
  let a, b;
  if (diff === 'easy') {
    if (op === '+') { a = rnd(10, 80) * 10; b = rnd(1, 100 - a / 10) * 10; }
    else { a = rnd(20, 100) * 10; b = rnd(1, a / 10 - 1) * 10; }
  } else if (diff === 'medium') {
    if (Math.random() < .5) {
      if (op === '+') { a = rnd(10, 90) * 100; b = rnd(1, 100 - a / 100) * 100; }
      else { a = rnd(20, 100) * 100; b = rnd(1, a / 100 - 1) * 100; }
    } else {
      if (op === '+') { a = rnd(120, 899); b = rnd(100, 999); }
      else { a = rnd(300, 999); b = rnd(100, a - 50); }
    }
  } else {
    if (op === '+') { a = rnd(1000, 7999); b = rnd(1000, 10000 - a); }
    else { a = rnd(2000, 9999); b = rnd(1000, a - 100); }
    if (Math.random() < .25) {
      if (op === '+') {
        const c = a + b;
        return { text: `${fmt(a)} + ${BOX} = ${fmt(c)}`, kind: 'num', answer: b,
          hint: `Reken terug met een minsom: ${fmt(c)} − ${fmt(a)}.`,
          explain: `Reken terug: ${fmt(c)} − ${fmt(a)} = <b>${fmt(b)}</b>. Controle: ${fmt(a)} + ${fmt(b)} = ${fmt(c)}.` };
      }
      const c = a - b;
      return { text: `${fmt(a)} − ${BOX} = ${fmt(c)}`, kind: 'num', answer: b,
        hint: `Hoeveel moet je van ${fmt(a)} afhalen om op ${fmt(c)} te komen? Reken: ${fmt(a)} − ${fmt(c)}.`,
        explain: `${fmt(a)} − ${fmt(c)} = <b>${fmt(b)}</b>. Controle: ${fmt(a)} − ${fmt(b)} = ${fmt(c)}.` };
    }
  }
  if (op === '+') return { text: `${fmt(a)} + ${fmt(b)} =`, kind: 'num', answer: a + b,
    hint: `Splits de getallen: tel eerst de duizendtallen en honderdtallen op, daarna de tientallen en de eenheden.`,
    explain: explainPlus(a, b) };
  return { text: `${fmt(a)} − ${fmt(b)} =`, kind: 'num', answer: a - b,
    hint: `Haal er eerst de duizendtallen af, dan de honderdtallen, de tientallen en de eenheden.`,
    explain: explainMinus(a, b) };
}

/* =====================================================================
   4. BREUKEN & KOMMAGETALLEN
   ===================================================================== */
function brOfQty(diff) {
  let n, d, k;
  if (diff === 'easy') { d = kies([2, 3, 4, 5, 10]); n = 1; k = rnd(2, 10); }
  else if (diff === 'medium') { d = kies([3, 4, 5, 6, 8, 10]); n = rnd(2, d - 1); k = rnd(2, 10); }
  else { d = kies([4, 5, 6, 8, 10, 12]); n = rnd(2, d - 1); k = rnd(5, 25); }
  const tot = d * k, ans = n * k;
  return {
    text: `${frac(n, d)} deel van ${tot} =`, kind: 'num', answer: ans,
    visual: d <= 12 ? fracBar(n, d) : '',
    hint: `Deel ${tot} eerst door ${d} (de noemer).${n > 1 ? ` Doe dat daarna keer ${n} (de teller).` : ''}`,
    explain: `${tot} : ${d} = ${k}.${n > 1 ? ` En ${n} × ${k} = ${ans}.` : ''} Dus ${frac(n, d)} van ${tot} = <b>${ans}</b>.`
  };
}
function brPicture(diff) {
  const d = diff === 'easy' ? kies([2, 3, 4, 5, 6, 8]) : kies([3, 4, 5, 6, 8, 10]);
  const n = rnd(1, d - 1);
  const shape = d <= 8 && Math.random() < .5 ? fracPie(n, d) : fracBar(n, d);
  const c = mkChoice(frac(n, d), [frac(d - n, d), frac(n, d - n), frac(n, d + 1), frac(Math.min(n + 1, d), d), frac(1, d)], 3);
  return Object.assign(c, {
    text: 'Welk deel is gekleurd?', visual: shape, key: `pic${n}/${d}`,
    hint: `Tel eerst alle stukken: dat getal komt onder de streep. Tel dan de gekleurde stukken: dat getal komt boven de streep.`,
    explain: `Er zijn ${d} gelijke stukken en ${n} ${plural(n, 'is', 'zijn')} gekleurd. Dat is <b>${frac(n, d)}</b>.`,
    big: true
  });
}
function brCompare(diff) {
  let A, B;
  const ds = [2, 3, 4, 5, 6, 8, 10];
  if (diff === 'easy') {
    if (Math.random() < .5) { const d = kies([3, 4, 5, 6, 8, 10]); let n1 = rnd(1, d - 1), n2; do { n2 = rnd(1, d - 1); } while (n2 === n1); A = [n1, d]; B = [n2, d]; }
    else { const d1 = kies(ds); let d2; do { d2 = kies(ds); } while (d2 === d1); A = [1, d1]; B = [1, d2]; }
  } else if (diff === 'medium') {
    const d1 = kies([2, 3, 4, 5]), d2 = d1 * kies([2, 3]);
    A = [rnd(1, d1 - 1), d1]; B = [rnd(1, d2 - 1), d2];
  } else {
    let d1, d2;
    do { d1 = kies([2, 3, 4, 5, 6, 8, 10, 12]); d2 = kies([3, 4, 5, 6, 8, 10, 12]); } while (d1 === d2 || lcm(d1, d2) > 60);
    A = [rnd(1, d1 - 1), d1]; B = [rnd(1, d2 - 1), d2];
    if (Math.random() < .2) { const m = kies([2, 3, 4]); A = [rnd(1, d1 - 1), d1]; B = [A[0] * m, A[1] * m]; }
  }
  if (Math.random() < .5) [A, B] = [B, A];
  const va = A[0] / A[1], vb = B[0] / B[1];
  const ans = va > vb ? 0 : vb > va ? 1 : 2;
  const win = ans === 0 ? A : B;
  let explain;
  const L = lcm(A[1], B[1]);
  if (A[1] === B[1]) explain = `De noemers zijn gelijk (${A[1]} stukken). Dan kijk je naar de teller: ${ans === 2 ? 'die zijn ook gelijk' : `${win[0]} is meer`}.`;
  else if (A[0] === 1 && B[0] === 1) explain = `Hoe meer stukken, hoe kleiner elk stuk. ${fracP(ans === 0 ? A : B)} is dus meer dan ${fracP(ans === 0 ? B : A)}.`;
  else explain = `Maak de noemers gelijk: ${fracP(A)} = ${frac(A[0] * L / A[1], L)} en ${fracP(B)} = ${frac(B[0] * L / B[1], L)}.`;
  explain += ans === 2 ? ` Ze zijn dus <b>even groot</b>.` : ` Dus <b>${fracP(win)}</b> is meer.`;
  return {
    text: 'Wat is meer?', kind: 'choice', choices: [fracP(A), fracP(B), 'Even veel'], answer: ans, big: true,
    key: `cmp${A}|${B}`,
    hint: `Kijk naar de stroken:<div class="cmpbars"><span>${fracP(A)}</span>${fracBar(A[0], A[1])}<span>${fracP(B)}</span>${fracBar(B[0], B[1])}</div>`,
    explain
  };
}
function brEquiv(diff) {
  if (diff === 'hard' && Math.random() < .5) {
    const b = kies([2, 3, 4, 5, 6, 8, 10]), a = rnd(1, b - 1), m = rnd(2, 6);
    return { text: `${frac(a * m, b * m)} = ${frac(BOX, b)}`, kind: 'num', answer: a,
      hint: `Wat gebeurt er met de noemer? Doe met de teller hetzelfde.`,
      explain: `De noemer gaat van ${b * m} naar ${b}: dat is gedeeld door ${m}. Doe de teller ook gedeeld door ${m}: ${a * m} : ${m} = <b>${a}</b>.` };
  }
  const b = diff === 'hard' ? kies([3, 4, 5, 6, 8]) : kies([2, 3, 4, 5]), a = rnd(1, b - 1), m = rnd(2, diff === 'hard' ? 6 : 5);
  return { text: `${frac(a, b)} = ${frac(BOX, b * m)}`, kind: 'num', answer: a * m,
    hint: `Met hoeveel is de noemer keer gedaan? Doe de teller ook zo keer.`,
    explain: `De noemer gaat van ${b} naar ${b * m}: dat is keer ${m}. Doe de teller ook keer ${m}: ${a} × ${m} = <b>${a * m}</b>.` };
}
function brDecAdd(diff) {
  const op = Math.random() < .5 ? '+' : '−';
  let s, a, b;
  if (diff === 'easy') { s = 10; a = rnd(1, 40); b = rnd(1, 30); }
  else if (diff === 'medium') { if (Math.random() < .4) { s = 100; a = rnd(1, 40) * 25; b = rnd(1, 30) * 25; } else { s = 10; a = rnd(10, 99); b = rnd(5, 80); } }
  else { s = 100; a = rnd(100, 999); b = Math.random() < .5 ? rnd(10, 99) * 10 : rnd(50, 600); }
  if (op === '−') { if (b > a) [a, b] = [b, a]; if (a === b) a += s === 10 ? 3 : 25; }
  const res = op === '+' ? a + b : a - b, ans = res / s;
  const w = s === 10 ? 'tienden' : 'honderdsten';
  return {
    text: `${fmt(a / s)} ${op} ${fmt(b / s)} =`, kind: 'num', answer: ans,
    hint: `Zet de komma's onder elkaar. Reken eerst wat achter de komma staat, dan de hele getallen.`,
    explain: `Reken in ${w}: ${fmt(a / s)} is ${a} ${w} en ${fmt(b / s)} is ${b} ${w}.<br>${a} ${op} ${b} = ${res} ${w} = <b>${fmt(ans)}</b>.`
  };
}
function brTimes10(diff) {
  const ops = diff === 'hard' ? [['×', 10], ['×', 100], ['×', 1000], [':', 10], [':', 100]] : [['×', 10], [':', 10], ['×', 100]];
  const [op, f] = kies(ops), z = Math.log10(f);
  let x, ans;
  if (op === '×') { const h = diff === 'hard' ? rnd(1, 999) : rnd(1, 99) * 10; x = h / 100; ans = h * f / 100; }
  else { const n = diff === 'hard' ? rnd(1, 999) : rnd(1, 99); x = n; ans = n / f; }
  const pl = `${z} ${plural(z, 'plaats', 'plaatsen')}`;
  return {
    text: `${fmt(x)} ${op} ${f} =`, kind: 'num', answer: ans,
    hint: op === '×' ? `Bij keer ${f} wordt het getal ${f} keer zo groot. De komma schuift ${pl} naar rechts.` : `Bij gedeeld door ${f} wordt het getal ${f} keer zo klein. De komma schuift ${pl} naar links.`,
    explain: `${fmt(x)} ${op} ${f} = <b>${fmt(ans)}</b>. De komma schuift ${pl} naar ${op === '×' ? 'rechts' : 'links'}.`
  };
}
const FD = {
  easy: [[1, 2], [1, 10], [3, 10], [7, 10], [9, 10], [5, 10]],
  medium: [[1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 2], [7, 10], [1, 100], [25, 100]],
  hard: [[1, 8], [3, 8], [7, 20], [3, 25], [9, 100], [13, 50], [3, 2], [5, 4], [3, 4]]
};
function brFracDec(diff) {
  const [n, d] = kies(FD[diff]);
  const p = [10, 100, 1000].find(p => p % d === 0), k = p / d;
  const explain = `${frac(n, d)} = ${frac(n * k, p)} = <b>${fmt(n / d)}</b>. (${p === 10 ? 'tienden' : p === 100 ? 'honderdsten' : 'duizendsten'})`;
  const hint = `Maak er tienden of honderdsten van. Hoe vaak past ${d} in ${p}?`;
  if (Math.random() < .5) return { text: `${frac(n, d)} als kommagetal =`, kind: 'num', answer: n / d, hint, explain };
  const all = [...FD.easy, ...FD.medium, ...FD.hard].filter(f => f[0] / f[1] !== n / d);
  const wrongs = shuffle(all).map(fracP);
  wrongs.unshift(frac(Math.round(n / d * 100) % 100 || n, 10));
  const c = mkChoice(fracP([n, d]), wrongs, 3);
  return Object.assign(c, { text: `${fmt(n / d)} is hetzelfde als …`, hint, explain, big: true });
}
function brDecOrder(diff) {
  const w = diff === 'hard' ? rnd(0, 9) : diff === 'medium' ? rnd(0, 4) : 0;
  const t = rnd(3, 8);
  const A = w * 1000 + t * 100;
  const B = w * 1000 + (t - 1) * 100 + rnd(5, 9) * 10;
  const C = w * 1000 + (t - 1) * 100 + rnd(1, 4) * 10 + rnd(1, 9);
  const D = w * 1000 + rnd(1, 9) * 10;
  const vals = diff === 'easy' ? [A, B, D] : [A, B, C, D];
  const big = Math.random() < .6;
  const target = big ? Math.max(...vals) : Math.min(...vals);
  const opts = shuffle(vals);
  return {
    text: `Welk getal is het <b>${big ? 'grootst' : 'kleinst'}</b>?`, kind: 'choice', choices: opts.map(v => fmt(v / 1000)), answer: opts.indexOf(target), big: true,
    hint: `Kijk eerst naar het getal vóór de komma. Dan naar het eerste cijfer na de komma (de tienden), dan het tweede (de honderdsten).`,
    explain: `Vergelijk eerst de tienden, dan de honderdsten. <b>${fmt(target / 1000)}</b> is het ${big ? 'grootst' : 'kleinst'}. Let op: meer cijfers na de komma betekent niet dat het getal groter is!`
  };
}
function genBreuken(diff) {
  const list = {
    easy: [brOfQty, brPicture, brPicture, brCompare, brDecAdd, brFracDec],
    medium: [brOfQty, brPicture, brEquiv, brCompare, brDecAdd, brFracDec, brDecOrder, brTimes10],
    hard: [brOfQty, brEquiv, brCompare, brDecAdd, brFracDec, brDecOrder, brTimes10]
  }[diff];
  return kies(list)(diff);
}

/* =====================================================================
   5. METEN (lengte, gewicht, inhoud)
   ===================================================================== */
const FAM = {
  lengte: { ladder: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'], f: { km: 1e6, hm: 1e5, dam: 1e4, m: 1e3, dm: 100, cm: 10, mm: 1 } },
  gewicht: { ladder: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'], f: { ton: 1e9, kg: 1e6, hg: 1e5, dag: 1e4, g: 1e3, dg: 100, cg: 10, mg: 1 } },
  inhoud: { ladder: ['kl', 'hl', 'dal', 'l', 'dl', 'cl', 'ml'], f: { kl: 1e6, hl: 1e5, dal: 1e4, l: 1e3, dl: 100, cl: 10, ml: 1, 'dm³': 1e3, 'cm³': 1 } }
};
const famOf = u => Object.keys(FAM).find(k => u in FAM[k].f);
const un = u => u === 'l' ? 'liter' : u;
const PAIRS = {
  easy: [['m', 'cm'], ['cm', 'mm'], ['km', 'm'], ['kg', 'g'], ['l', 'dl'], ['l', 'ml'], ['m', 'dm']],
  medium: [['m', 'cm'], ['cm', 'mm'], ['km', 'm'], ['kg', 'g'], ['l', 'dl'], ['l', 'ml'], ['l', 'cl'], ['m', 'mm'], ['dm', 'cm'], ['dl', 'ml'], ['cl', 'ml']],
  hard: [['km', 'm'], ['m', 'cm'], ['m', 'mm'], ['kg', 'g'], ['ton', 'kg'], ['l', 'ml'], ['l', 'cl'], ['dm³', 'ml'], ['cm³', 'ml'], ['dm³', 'l'], ['g', 'mg'], ['dl', 'cl']]
};
function ladderHTML(fam, u1, u2) {
  return `<div class="ladder">${FAM[fam].ladder.map((u, i) => `<span class="step${u === u1 ? ' from' : ''}${u === u2 ? ' to' : ''}" style="--i:${i}">${u}</span>`).join('')}</div>`;
}
function ladderHint(u1, u2) {
  const fam = famOf(u1), L = FAM[fam].ladder, i1 = L.indexOf(u1), i2 = L.indexOf(u2);
  if (i1 < 0 || i2 < 0) return `Onthoud: 1 ton = 1000 kg, 1 dm³ = 1 liter = 1000 ml en 1 cm³ = 1 ml.`;
  const st = Math.abs(i1 - i2);
  return `Gebruik de meetladder. Van <b>${u1}</b> naar <b>${u2}</b> is ${st} ${plural(st, 'stap', 'stappen')} ${i2 > i1 ? 'naar beneden: keer' : 'naar boven: gedeeld door'} ${fmt(10 ** st)}.${ladderHTML(fam, u1, u2)}`;
}
function meConvert(diff) {
  let [u1, u2] = kies(PAIRS[diff]);
  if (Math.random() < .5) [u1, u2] = [u2, u1];
  const F = FAM[famOf(u1)].f, f1 = F[u1], f2 = F[u2];
  let n, dec;
  if (diff === 'easy') { n = rnd(1, 12); dec = 0; }
  else { dec = rnd(0, diff === 'medium' ? 1 : 2); n = dec === 0 ? rnd(2, 40) : dec === 1 ? rnd(11, 99) : rnd(5, 999); }
  const p = 10 ** dec;
  let v, ans;
  if (f1 >= f2) { v = n / p; ans = n * (f1 / f2) / p; } else { ans = n / p; v = n * (f2 / f1) / p; }
  let explain;
  if (f1 === f2) explain = `1 ${un(u1)} = 1 ${un(u2)}. Dus ${fmt(v)} ${un(u1)} = <b>${fmt(ans)} ${un(u2)}</b>.`;
  else if (f1 > f2) { const R = f1 / f2; explain = `1 ${un(u1)} = ${fmt(R)} ${un(u2)}. Dus ${fmt(v)} ${un(u1)} = ${fmt(v)} × ${fmt(R)} = <b>${fmt(ans)} ${un(u2)}</b>.`; }
  else { const K = f2 / f1; explain = `1 ${un(u2)} = ${fmt(K)} ${un(u1)}. Dus ${fmt(v)} ${un(u1)} = ${fmt(v)} : ${fmt(K)} = <b>${fmt(ans)} ${un(u2)}</b>.`; }
  return { text: `${fmt(v)} ${un(u1)} = ${BOX} ${un(u2)}`, kind: 'num', answer: ans, unit: un(u2), hint: ladderHint(u1, u2), explain };
}
function meCompound(diff) {
  const sub = diff === 'hard' && Math.random() < .5;
  const t = kies(diff === 'hard' ? ['m', 'kg', 'l', 'km'] : ['m', 'kg', 'l']);
  const cfg = { m: ['m', 'cm', 100], kg: ['kg', 'g', 1000], l: ['liter', 'dl', 10], km: ['km', 'm', 1000] }[t];
  const [big, small, R] = cfg;
  if (sub) {
    const a = rnd(1, 3), c = t === 'l' ? rnd(1, a * 10 - 1) : rnd(1, Math.min(a * R - 1, R === 100 ? 95 : 950));
    const ans = a * R - c;
    return { text: `${a} ${big} − ${c} ${small} = ${BOX} ${small}`, kind: 'num', answer: ans, unit: small,
      hint: `Maak eerst alles ${small}: hoeveel ${small} is ${a} ${big}?`,
      explain: `${a} ${big} = ${a * R} ${small}. ${a * R} − ${c} = <b>${ans} ${small}</b>.` };
  }
  const a = rnd(1, 9), c = rnd(1, R - 1), ans = a * R + c;
  return { text: `${a} ${big} en ${c} ${small} = ${BOX} ${small}`, kind: 'num', answer: ans, unit: small,
    hint: `Hoeveel ${small} is 1 ${big}? Reken ${a} ${big} om en tel de ${c} ${small} erbij.`,
    explain: `1 ${big} = ${R} ${small}, dus ${a} ${big} = ${a * R} ${small}. ${a * R} + ${c} = <b>${ans} ${small}</b>.` };
}
const EST = [
  ['🥛', 'Een pak melk bevat ongeveer', '1 liter', ['1 ml', '100 liter']],
  ['🍎', 'Een appel weegt ongeveer', '150 gram', ['150 kg', '1 gram']],
  ['🧍', 'Een volwassene is ongeveer', '1,75 m lang', ['17,5 m lang', '17,5 cm lang']],
  ['✏️', 'Een nieuw potlood is ongeveer', '18 cm lang', ['18 m lang', '18 mm lang']],
  ['🪣', 'In een emmer past ongeveer', '10 liter', ['10 ml', '1000 liter']],
  ['🚲', 'Een fiets weegt ongeveer', '15 kg', ['15 gram', '150 kg']],
  ['🥄', 'Op een theelepel past ongeveer', '5 ml', ['5 liter', '5 dl']],
  ['🐜', 'Een mier is ongeveer', '5 mm lang', ['5 cm lang', '5 m lang']],
  ['🥤', 'In een glas past ongeveer', '2 dl', ['2 liter', '2 ml']],
  ['🚪', 'Een deur is ongeveer', '2 m hoog', ['20 m hoog', '20 cm hoog']],
  ['🍞', 'Een brood weegt ongeveer', '800 gram', ['8 kg', '8 gram']],
  ['🐘', 'Een olifant weegt ongeveer', '5000 kg', ['500 gram', '50 kg']],
  ['🏊', 'Een zwembad is ongeveer', '25 m lang', ['25 km lang', '25 cm lang']],
  ['🛁', 'In een vol bad past ongeveer', '150 liter', ['1,5 liter', '15.000 liter']],
  ['🚗', 'Van Amsterdam naar Utrecht is ongeveer', '40 km', ['40 m', '4000 km']],
  ['📱', 'Een tablet weegt ongeveer', '500 gram', ['5 gram', '50 kg']],
  ['🐕', 'Een flinke hond weegt ongeveer', '30 kg', ['30 gram', '300 kg']],
  ['💧', 'Een druppel water is ongeveer', '1 ml', ['1 liter', '1 dl']]
];
function meEstimate() {
  const [e, phrase, good, wrong] = kies(EST);
  const c = mkChoice(good, wrong, 3);
  return Object.assign(c, { text: `${phrase} …`, visual: `<div class="emo">${e}</div>`, key: 'est' + phrase,
    hint: `Denk aan dingen die je kent: 1 liter is een pak melk, 1 kg is een pak suiker, 1 meter is een grote stap, 1 cm is zo breed als je pink.`,
    explain: `${phrase} <b>${good}</b>.` });
}
function meCompare() {
  const t = kies([['m', 'cm', 100, 5], ['kg', 'g', 1000, 50], ['l', 'ml', 1000, 50], ['km', 'm', 1000, 50]]);
  const [u1, u2, R, step] = t;
  const a10 = rnd(11, 49), aR = a10 * R / 10;
  const r = Math.random();
  const b = r < .25 ? aR : r < .5 ? a10 * R / 100 : aR + kies([-1, 1]) * rnd(1, 3) * step;
  let A = `${fmt(a10 / 10)} ${un(u1)}`, B = `${fmt(b)} ${un(u2)}`;
  let ans = aR > b ? 0 : b > aR ? 1 : 2;
  const swap = Math.random() < .5;
  if (swap) { [A, B] = [B, A]; if (ans < 2) ans = 1 - ans; }
  const cmpw = aR > b ? 'meer dan' : aR < b ? 'minder dan' : 'evenveel als';
  return {
    text: 'Wat is meer?', kind: 'choice', choices: [A, B, 'Even veel'], answer: ans, big: true,
    hint: `Maak eerst de eenheden gelijk. Hoeveel ${un(u2)} is 1 ${un(u1)}?`,
    explain: `Maak de eenheden gelijk: ${fmt(a10 / 10)} ${un(u1)} = ${fmt(aR)} ${un(u2)}. Dat is ${cmpw} ${fmt(b)} ${un(u2)}. ${ans === 2 ? 'Ze zijn dus <b>even veel</b>.' : `Dus <b>${ans === 0 ? A : B}</b> is meer.`}`
  };
}
function genMeten(diff) {
  const list = { easy: [meConvert, meConvert, meEstimate], medium: [meConvert, meConvert, meCompound, meEstimate], hard: [meConvert, meConvert, meCompound, meCompare] }[diff];
  return kies(list)(diff);
}

/* =====================================================================
   6. KLOKKIJKEN & REKENEN MET TIJD
   ===================================================================== */
const HOURW = ['twaalf', 'één', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf'];
const hw = n => HOURW[((n % 12) + 12) % 12];
function timeWords(h, m) {
  const c = hw(h), n = hw(h + 1);
  return { 0: `${c} uur`, 5: `vijf over ${c}`, 10: `tien over ${c}`, 15: `kwart over ${c}`, 20: `tien voor half ${n}`, 25: `vijf voor half ${n}`,
    30: `half ${n}`, 35: `vijf over half ${n}`, 40: `tien over half ${n}`, 45: `kwart voor ${n}`, 50: `tien voor ${n}`, 55: `vijf voor ${n}` }[m] || null;
}
const daypart = h => h < 6 ? "'s nachts" : h < 12 ? "'s ochtends" : h < 18 ? "'s middags" : "'s avonds";
function durText(d) { if (d < 60) return `${d} minuten`; const h = Math.floor(d / 60), m = d % 60; return `${h} uur` + (m ? ` en ${m} ${plural(m, 'minuut', 'minuten')}` : ''); }
function readExplain(h, m) {
  const h12 = h % 12 || 12, nh = h12 % 12 + 1;
  const pos = m === 0 ? 'op de 12: het is een heel uur' : m % 5 === 0 ? `op de ${m / 5}: dat is ${m} minuten` : `${m % 5} ${plural(m % 5, 'streepje', 'streepjes')} na de ${Math.floor(m / 5) || 12}: dat is ${m} minuten`;
  const hpos = m === 0 ? `precies op de ${h12}` : m < 20 ? `net voorbij de ${h12}` : m <= 40 ? `tussen de ${h12} en de ${nh}` : `bijna bij de ${nh}`;
  const w = timeWords(h, m);
  return `De lange (blauwe) wijzer staat ${pos}. De korte (rode) wijzer staat ${hpos}. ${w ? `Het is ${w}: ` : 'Het is '}<b>${tstr(h12, m)}</b>${h12 === 12 ? '' : ` (of ${tstr(h12 + 12, m)})`}.`;
}
function addExplain(t0, d, sign = 1) {
  const steps = []; let cur = t0, left = d;
  if (sign > 0) {
    const m = norm(cur) % 60;
    if (m > 0 && left >= 60 - m) { steps.push(`${tstrM(cur)} + ${60 - m} min = ${tstrM(cur + 60 - m)}`); cur += 60 - m; left -= 60 - m; }
    const h = Math.floor(left / 60); if (h) { steps.push(`${tstrM(cur)} + ${h} uur = ${tstrM(cur + h * 60)}`); cur += h * 60; left -= h * 60; }
    if (left) { steps.push(`${tstrM(cur)} + ${left} min = ${tstrM(cur + left)}`); cur += left; }
  } else {
    const m = norm(cur) % 60;
    if (m > 0 && left >= m) { steps.push(`${tstrM(cur)} − ${m} min = ${tstrM(cur - m)}`); cur -= m; left -= m; }
    const h = Math.floor(left / 60); if (h) { steps.push(`${tstrM(cur)} − ${h} uur = ${tstrM(cur - h * 60)}`); cur -= h * 60; left -= h * 60; }
    if (left) { steps.push(`${tstrM(cur)} − ${left} min = ${tstrM(cur - left)}`); cur -= left; }
  }
  return steps.join('<br>') + `<br>Het antwoord is <b>${tstrM(cur)}</b>.`;
}
function durExplain(a, b) {
  const total = b - a;
  if (Math.floor(a / 60) === Math.floor(b / 60)) return `Van ${tstrM(a)} tot ${tstrM(b)} is <b>${total} minuten</b>.`;
  const parts = [];
  const nh = Math.ceil(a / 60) * 60, lh = Math.floor(b / 60) * 60;
  if (nh > a) parts.push(`${tstrM(a)} → ${tstrM(nh)} = ${nh - a} min`);
  if (lh > nh) parts.push(`${tstrM(nh)} → ${tstrM(lh)} = ${lh - nh} min`);
  if (b > lh) parts.push(`${tstrM(lh)} → ${tstrM(b)} = ${b - lh} min`);
  return parts.join('<br>') + `<br>Samen: ${parts.map(p => p.split('= ')[1].replace(' min', '')).join(' + ')} = <b>${total} minuten</b>.`;
}
const KLOK = {
  read(diff) {
    const h = rnd(1, 12), m = diff === 'easy' ? kies([0, 30, 0, 30, 15, 45]) : diff === 'medium' ? rnd(0, 11) * 5 : rnd(0, 59);
    return { text: 'Hoe laat is het? Schrijf de tijd zoals op een digitale klok.', visual: clockSVG(h, m), key: `clk${h}:${m}`,
      kind: 'time', twelve: true, answer: { h, m }, answerText: h === 12 ? `12:${pad2(m)}` : `${tstr(h, m)} of ${tstr(h + 12, m)}`,
      hint: 'De korte (rode) wijzer wijst het uur aan. De lange (blauwe) wijzer de minuten: bij elk cijfer komen er 5 minuten bij. De 1 is 5 minuten, de 2 is 10 minuten, de 3 is 15 minuten …',
      explain: readExplain(h, m) };
  },
  words(diff) {
    const h = rnd(1, 12), m = diff === 'easy' ? kies([0, 15, 30, 45]) : rnd(0, 11) * 5;
    const m2 = m === 0 ? 30 : (60 - m) % 60;
    const c = mkChoice(timeWords(h, m), [timeWords(h - 1, m), timeWords(h, m2), timeWords(h + 1, m)], 3);
    return Object.assign(c, { text: 'Hoe zeg je deze tijd?', visual: clockSVG(h, m), key: `w${h}:${m}`,
      hint: 'Kijk eerst naar de lange wijzer. Staat die tussen de 4 en de 8? Dan zeg je "half" met het <b>volgende</b> uur erbij. Bij half vier is het dus 3:30!',
      explain: readExplain(h, m) });
  },
  pick(diff) {
    const h = rnd(1, 12), m = diff === 'easy' ? kies([0, 15, 30, 45]) : rnd(0, 11) * 5;
    const cands = [[h % 12 + 1, m], [h === 1 ? 12 : h - 1, m], [h, (m + 30) % 60], [m / 5 || 12, (h % 12) * 5]]
      .filter(([a, b]) => !(a === h && b === m));
    const uniq = []; cands.forEach(c => { if (!uniq.some(u => u[0] === c[0] && u[1] === c[1])) uniq.push(c); });
    const opts = shuffle([[h, m], ...shuffle(uniq).slice(0, 2)]);
    return { text: `Welke klok wijst <b>${timeWords(h, m)}</b> aan?`, kind: 'choice', choices: opts.map(([a, b]) => clockSVG(a, b, 'mini')),
      answer: opts.findIndex(o => o[0] === h && o[1] === m), choiceCls: 'c3', key: `p${h}:${m}`,
      answerText: clockSVG(h, m, 'mini'),
      hint: 'De lange wijzer laat de minuten zien, de korte wijzer het uur. Bij "half" staat de lange wijzer op de 6.',
      explain: `${cap(timeWords(h, m))} is ${tstr(h, m)}. ` + readExplain(h, m) };
  },
  add(diff) {
    let h, m, d;
    if (diff === 'easy') { h = rnd(7, 19); m = kies([0, 30]); d = kies([15, 30, 60, 120]); }
    else if (diff === 'medium') { h = rnd(7, 20); m = rnd(0, 11) * 5; d = kies([rnd(2, 11) * 5, rnd(13, 23) * 5]); }
    else { h = rnd(7, 20); m = rnd(0, 59); d = rnd(15, 150); }
    const t0 = h * 60 + m, t1 = t0 + d, N = kies(NAMES), s = tstr(h, m), dd = durText(d);
    const text = kies([
      `Het is nu <b>${s}</b>. Hoe laat is het over <b>${dd}</b>?`,
      `De bus vertrekt om <b>${s}</b>. De rit duurt <b>${dd}</b>. Hoe laat komt de bus aan?`,
      `Het feest begint om <b>${s}</b> en duurt <b>${dd}</b>. Hoe laat is het feest afgelopen?`,
      `${N} begint om <b>${s}</b> met tekenen en is <b>${dd}</b> bezig. Hoe laat is ${N} klaar?`
    ]);
    return { text, kind: 'time', answer: { h: Math.floor(t1 / 60) % 24, m: t1 % 60 },
      hint: m && d >= 60 - m ? `Reken eerst door naar het hele uur: van ${s} naar ${tstrM(t0 + 60 - m)} is ${60 - m} minuten.` : 'Tel de uren bij de uren en de minuten bij de minuten.',
      explain: addExplain(t0, d) };
  },
  sub(diff) {
    const h = rnd(10, 21), m = rnd(0, 59), d = rnd(20, 150), t0 = h * 60 + m, t1 = t0 - d;
    return { text: `Het is nu <b>${tstr(h, m)}</b>. Hoe laat was het <b>${durText(d)}</b> geleden?`, kind: 'time',
      answer: { h: Math.floor(t1 / 60), m: t1 % 60 },
      hint: `Reken terug. Ga eerst terug naar het hele uur: ${tstrM(t0 - m)}.`, explain: addExplain(t0, d, -1) };
  },
  dur(diff) {
    const h = rnd(8, 16), m = diff === 'hard' ? rnd(0, 59) : rnd(0, 11) * 5;
    const d = diff === 'hard' ? rnd(20, 180) : rnd(3, 24) * 5;
    const a = h * 60 + m, b = a + d, N = kies(NAMES);
    const text = kies([
      `De gymles begint om <b>${tstrM(a)}</b> en is om <b>${tstrM(b)}</b> afgelopen. Hoeveel minuten duurt de gymles?`,
      `De trein vertrekt om <b>${tstrM(a)}</b> en komt om <b>${tstrM(b)}</b> aan. Hoeveel minuten duurt de reis?`,
      `${N} gaat om <b>${tstrM(a)}</b> naar de speeltuin en is om <b>${tstrM(b)}</b> weer thuis. Hoeveel minuten was ${N} weg?`
    ]);
    return { text, kind: 'num', answer: d, unit: 'minuten', comma: false,
      hint: 'Reken in stapjes: eerst tot het hele uur, dan hele uren (1 uur = 60 minuten), dan de rest.',
      explain: durExplain(a, b) };
  },
  conv(diff) {
    const v = rnd(0, 4);
    if (v === 0) { const h = rnd(1, 3), m = rnd(1, 11) * 5; return { text: `Hoeveel minuten zijn <b>${h} uur en ${m} minuten</b>?`, kind: 'num', answer: h * 60 + m, unit: 'minuten', comma: false, hint: '1 uur = 60 minuten.', explain: `${h} × 60 = ${h * 60}. ${h * 60} + ${m} = <b>${h * 60 + m} minuten</b>.` }; }
    if (v === 1) { const n = rnd(2, 10); return { text: `Hoeveel seconden zijn <b>${n} minuten</b>?`, kind: 'num', answer: n * 60, unit: 'seconden', comma: false, hint: '1 minuut = 60 seconden.', explain: `${n} × 60 = <b>${n * 60} seconden</b>.` }; }
    if (v === 2) { const n = rnd(2, 5); return { text: `Hoeveel uur zijn <b>${n * 60} minuten</b>?`, kind: 'num', answer: n, unit: 'uur', comma: false, hint: '60 minuten = 1 uur.', explain: `${n * 60} : 60 = <b>${n} uur</b>.` }; }
    const [w, a] = kies([['een kwartier', 15], ['drie kwartier', 45], ['anderhalf uur', 90], ['een half uur', 30], ['twee en een half uur', 150], ['vijf kwartier', 75]]);
    return { text: `Hoeveel minuten is <b>${w}</b>?`, kind: 'num', answer: a, unit: 'minuten', comma: false, hint: '1 uur = 60 minuten. Een kwartier is een kwart van een uur.', explain: `${cap(w)} = <b>${a} minuten</b>. (Een kwartier = 15 minuten, een half uur = 30 minuten.)` };
  },
  to24(diff) {
    let h = kies([rnd(13, 23), rnd(13, 23), rnd(6, 11)]);
    if (diff === 'hard' && Math.random() < .2) h = rnd(0, 5);
    const m = diff === 'medium' ? kies([0, 15, 30, 45]) : rnd(0, 11) * 5;
    const w = `${timeWords(h, m)} ${daypart(h)}`;
    let explain;
    if (h >= 13) explain = `${cap(timeWords(h, m))} is ${tstr(h - 12, m)}. Het is ${daypart(h)}, dus tel je 12 uur erbij: ${h - 12} + 12 = ${h}. Het antwoord is <b>${pad2(h)}:${pad2(m)}</b>.`;
    else if (h === 0) explain = `Om middernacht begint de 24-uursklok weer bij 0. Dus ${w} is <b>00:${pad2(m)}</b>.`;
    else explain = `${cap(daypart(h))} hoef je niets op te tellen. Het is gewoon <b>${pad2(h)}:${pad2(m)}</b>.`;
    return { text: `Het is <b>${w}</b>. Hoe schrijf je dat met de 24-uursklok?`, kind: 'time', answer: { h, m }, answerText: `${pad2(h)}:${pad2(m)}`,
      hint: "Na 12 uur 's middags tel je bij de 24-uursklok gewoon door: 1 uur 's middags is 13:00, 2 uur is 14:00, enzovoort.", explain };
  },
  from24(diff) {
    const h = kies([rnd(13, 23), rnd(13, 23), rnd(7, 11)]);
    const m = diff === 'medium' ? kies([0, 15, 30, 45]) : rnd(0, 11) * 5;
    const m2 = m === 0 ? 30 : (60 - m) % 60, dp = daypart(h), other = h < 12 ? "'s avonds" : "'s ochtends";
    const c = mkChoice(`${timeWords(h, m)} ${dp}`, [`${timeWords(h - 2, m)} ${dp}`, `${timeWords(h, m2)} ${dp}`, `${timeWords(h, m)} ${other}`, `${timeWords(h + 1, m)} ${dp}`], 3);
    return Object.assign(c, { text: 'Hoe zeg je deze tijd?', visual: digital(h, m), key: `d${h}:${m}`,
      hint: 'Is het uur groter dan 12? Haal er dan 12 af. 15:00 is dus 3 uur \'s middags.',
      explain: h >= 13 ? `${h} − 12 = ${h - 12}. Dus ${pad2(h)}:${pad2(m)} is <b>${timeWords(h, m)} ${dp}</b>.` : `Het uur is kleiner dan 12, dus het is ${dp}: <b>${timeWords(h, m)} ${dp}</b>.` });
  }
};
function genKlok(diff) {
  const types = diff === 'easy' ? ['read', 'read', 'words', 'pick', 'add']
    : diff === 'medium' ? ['read', 'words', 'pick', 'to24', 'from24', 'add', 'dur', 'conv']
    : ['read', 'words', 'to24', 'from24', 'add', 'sub', 'dur', 'conv'];
  return KLOK[kies(types)](diff);
}

/* =====================================================================
   7. VERHAALTJESSOMMEN
   ===================================================================== */
const VERHAAL = {
  easy: [
    N => { const a = rnd(12, 60), b = rnd(5, 40); return { e: '🌟', text: `${N} heeft ${a} stickers. Op een feestje krijgt ${N} er ${b} bij. Hoeveel stickers heeft ${N} nu?`, answer: a + b, unit: 'stickers', hint: 'Krijg je er iets bij? Dan is het een plussom.', explain: `${a} + ${b} = <b>${a + b}</b> stickers.` }; },
    N => { const a = rnd(25, 60), b = rnd(5, a - 8); return { e: '🚌', text: `In de bus zitten ${a} mensen. Bij de halte stappen er ${b} uit. Hoeveel mensen zitten er nog in de bus?`, answer: a - b, unit: 'mensen', hint: 'Stappen er mensen uit? Dan worden het er minder: een minsom.', explain: `${a} − ${b} = <b>${a - b}</b> mensen.` }; },
    N => { const r = rnd(2, 6), k = kies([4, 5, 6, 10]); return { e: '🥚', text: `In een doos liggen ${r} rijen met ${k} eieren. Hoeveel eieren liggen er in de doos?`, answer: r * k, unit: 'eieren', hint: 'Rijen met steeds evenveel: dat is een keersom.', explain: `${r} × ${k} = <b>${r * k}</b> eieren.` }; },
    N => { const k = rnd(2, 6), e = rnd(2, 9), t = k * e; return { e: '🍬', text: `${t} snoepjes worden eerlijk verdeeld over ${k} kinderen. Hoeveel snoepjes krijgt elk kind?`, answer: e, unit: 'snoepjes', hint: 'Eerlijk verdelen is delen.', explain: `${t} : ${k} = <b>${e}</b>, want ${e} × ${k} = ${t}.` }; },
    N => { const p = rnd(2, 6), n = rnd(2, 5); return { e: '📒', text: `Een schrift kost ${p} euro. ${N} koopt ${n} schriften. Hoeveel euro moet ${N} betalen?`, answer: p * n, unit: 'euro', hint: `${n} keer hetzelfde bedrag: een keersom.`, explain: `${n} × ${p} = <b>${n * p}</b> euro.` }; },
    N => { const a = rnd(10, 45), b = rnd(10, 45); return { e: '🌷', text: `In de tuin staan ${a} rode en ${b} gele tulpen. Hoeveel tulpen zijn er samen?`, answer: a + b, unit: 'tulpen', hint: '"Samen" betekent meestal: optellen.', explain: `${a} + ${b} = <b>${a + b}</b> tulpen.` }; },
    N => { const n = rnd(3, 12), w = kies([['fietsen', 'fiets', 2, '🚲'], ["auto's", 'auto', 4, '🚗']]); return { e: w[3], text: `Op het plein staan ${n} ${w[0]}. Hoeveel wielen zijn dat samen?`, answer: n * w[2], unit: 'wielen', hint: `Een ${w[1]} heeft ${w[2]} wielen.`, explain: `${n} × ${w[2]} = <b>${n * w[2]}</b> wielen.` }; }
  ],
  medium: [
    N => { const pc = rnd(4, 19) * 25, pay = pc <= 450 ? 500 : 1000; return { e: '🍦', text: `Een ijsje kost ${euro(pc)}. ${N} betaalt met ${euro(pay)}. Hoeveel geld krijgt ${N} terug?`, answer: (pay - pc) / 100, prefix: '€', answerText: euro(pay - pc), hint: 'Trek de prijs af van het bedrag dat je betaalt. Of tel op vanaf de prijs.', explain: `${euro(pay)} − ${euro(pc)} = <b>${euro(pay - pc)}</b>.` }; },
    N => { const per = kies([3, 4, 5]); let k = rnd(17, 38); if (k % per === 0) k++; const q = Math.floor(k / per), r = k % per; return { e: '🚗', text: `${k} kinderen gaan naar het zwembad. In elke auto passen ${per} kinderen. Hoeveel auto's zijn er minstens nodig?`, answer: q + 1, unit: "auto's", hint: 'Deel de kinderen over de auto\'s. Vergeet de kinderen die overblijven niet!', explain: `${k} : ${per} = ${q} rest ${r}. Voor de ${r} ${plural(r, 'kind', 'kinderen')} die ${plural(r, 'overblijft', 'overblijven')} is nog een auto nodig. Dus <b>${q + 1}</b> auto's.` }; },
    N => { const t = rnd(250, 950), b = rnd(60, t - 40); return { e: '🏫', text: `Op school zitten ${t} kinderen. Vandaag gaan er ${b} op schoolreis. Hoeveel kinderen blijven er op school?`, answer: t - b, unit: 'kinderen', hint: 'Er gaan kinderen weg, dus het worden er minder.', explain: explainMinus(t, b).replace(/Het antwoord is <b>(.*?)<\/b>/, 'Er blijven <b>$1</b> kinderen op school') }; },
    N => { const p = kies([5, 8, 10, 12, 15, 20, 25]), d = rnd(4, 12), t = p * d; return { e: '📚', text: `Een boek heeft ${t} bladzijden. ${N} leest elke dag ${p} bladzijden. Na hoeveel dagen is het boek uit?`, answer: d, unit: 'dagen', hint: `Hoe vaak past ${p} in ${t}? Dat is een deelsom.`, explain: `${t} : ${p} = <b>${d}</b> dagen, want ${d} × ${p} = ${t}.` }; },
    N => { const d = kies([4, 6, 8]), e = rnd(1, d - 1); const c = mkChoice(frac(d - e, d), [frac(e, d), frac(d - e, e), frac(1, d - e), frac(d, d - e), frac(d - e - 1 || d, d)], 3); return Object.assign(c, { e: '🍕', text: `Een pizza is in ${d} gelijke stukken gesneden. ${N} eet er ${e} op. Welk deel van de pizza is er nog over?`, hint: `Hoeveel stukken blijven er over? En uit hoeveel stukken bestond de hele pizza?`, explain: `Er blijven ${d} − ${e} = ${d - e} van de ${d} stukken over. Dat is <b>${frac(d - e, d)}</b>.`, big: true }); },
    N => { const d = kies([2, 3, 4]), k = d === 2 ? rnd(10, 15) : d === 3 ? rnd(7, 10) : rnd(6, 8), n = d === 4 && Math.random() < .5 ? 3 : 1, t = d * k; return { e: '🐶', text: `In de klas zitten ${t} kinderen. ${frac(n, d)} deel van de kinderen heeft een huisdier. Hoeveel kinderen hebben een huisdier?`, answer: n * k, unit: 'kinderen', hint: `Deel ${t} eerst door ${d}.${n > 1 ? ` Doe het daarna keer ${n}.` : ''}`, explain: `${t} : ${d} = ${k}.${n > 1 ? ` ${n} × ${k} = ${n * k}.` : ''} Dus <b>${n * k}</b> kinderen.` }; },
    N => { const h = rnd(17, 20), m = rnd(0, 11) * 5, d = rnd(16, 25) * 5, t0 = h * 60 + m, t1 = t0 + d; return { e: '🎬', text: `De film begint om ${tstr(h, m)} en duurt ${d} minuten. Hoe laat is de film afgelopen?`, kind: 'time', answer: { h: Math.floor(t1 / 60), m: t1 % 60 }, hint: `${d} minuten is ${durText(d)}.`, explain: `${d} minuten = ${durText(d)}.<br>` + addExplain(t0, d) }; },
    N => { const p = rnd(12, 25), k = kies([4, 6, 8, 9]), t = Math.floor(p / 10) * 10; return { e: '📔', text: `Een stickeralbum heeft ${p} bladzijden. Op elke bladzijde passen ${k} stickers. Hoeveel stickers passen er in het album?`, answer: p * k, unit: 'stickers', hint: `Elke bladzijde evenveel: een keersom. Splits ${p} in ${t} en ${p - t}.`, explain: `${p} × ${k} = ${t} × ${k} + ${p - t} × ${k} = ${t * k} + ${(p - t) * k} = <b>${p * k}</b> stickers.` }; }
  ],
  hard: [
    N => { const n = rnd(2, 4), pc = rnd(20, 60) * 5, cc = rnd(15, 50) * 5, tot = n * pc + cc; return { e: '🛒', text: `${N} koopt ${n} pakken sap van ${euro(pc)} per pak en een zak chips van ${euro(cc)}. Hoeveel moet ${N} betalen?`, answer: tot / 100, prefix: '€', answerText: euro(tot), hint: 'Reken eerst uit wat de pakken sap samen kosten. Tel daarna de chips erbij.', explain: `${n} × ${euro(pc)} = ${euro(n * pc)}.<br>${euro(n * pc)} + ${euro(cc)} = <b>${euro(tot)}</b>.` }; },
    N => { const t = rnd(60, 150), a = rnd(15, Math.floor(t / 2)), b = rnd(10, t - a - 5); return { e: '🚴', text: `Een fietstocht is ${t} km lang. Op de eerste dag fietst de familie ${a} km en op de tweede dag ${b} km. Hoeveel km moeten ze nog fietsen?`, answer: t - a - b, unit: 'km', hint: 'Tel eerst op hoeveel ze al gefietst hebben. Haal dat van de hele tocht af.', explain: `${a} + ${b} = ${a + b} km gefietst.<br>${t} − ${a + b} = <b>${t - a - b} km</b>.` }; },
    N => { let L, g, cl; do { L = kies([1, 1.5, 2]); g = kies([20, 25, 30]); cl = L * 100; } while (cl / g < 3); const q = Math.floor(cl / g), r = cl % g; return { e: '🥤', text: `Een fles bevat ${fmt(L)} liter limonade. In een glas gaat ${g} cl. Hoeveel glazen kun je helemaal vol schenken?`, answer: q, unit: 'glazen', hint: 'Maak eerst van de liters centiliters: 1 liter = 100 cl.', explain: `${fmt(L)} liter = ${cl} cl.<br>${cl} : ${g} = ${q}${r ? ` rest ${r}` : ''}.<br>Je kunt <b>${q}</b> glazen helemaal vol schenken.` }; },
    N => { const [p, kg] = kies([[125, 1], [125, 2], [200, 1], [200, 2], [250, 1], [250, 2], [250, 3], [500, 2], [500, 3]]), a = kg * 1000 / p; return { e: '🍪', text: `Een pak koekjes weegt ${p} gram. Hoeveel pakken wegen samen ${kg} kg?`, answer: a, unit: 'pakken', hint: 'Maak van de kilo\'s eerst grammen: 1 kg = 1000 gram.', explain: `${kg} kg = ${kg * 1000} gram.<br>${kg * 1000} : ${p} = <b>${a}</b> pakken.` }; },
    N => { const r = rnd(3, 8), k = rnd(4, 9), p = rnd(2, 5); return { e: '⛺', text: `Op een camping staan ${r} rijen met elk ${k} tenten. In elke tent slapen ${p} mensen. Hoeveel mensen slapen er op de camping?`, answer: r * k * p, unit: 'mensen', hint: 'Reken eerst uit hoeveel tenten er zijn.', explain: `${r} × ${k} = ${r * k} tenten.<br>${r * k} × ${p} = <b>${r * k * p}</b> mensen.` }; },
    N => { const w = kies([3, 4, 5, 6, 7, 8]); let pr = rnd(30, 80); if (pr % w === 0) pr++; const q = Math.floor(pr / w), r = pr % w; return { e: '🐷', text: `${N} spaart elke week ${w} euro voor een spel van ${pr} euro. Hoeveel weken moet ${N} minstens sparen?`, answer: q + 1, unit: 'weken', hint: 'Deel de prijs door het bedrag per week. Is er nog iets over? Dan heb je nog een week nodig!', explain: `${pr} : ${w} = ${q} rest ${r}. Na ${q} weken heeft ${N} ${q * w} euro, dat is nog net te weinig. Dus <b>${q + 1}</b> weken.` }; },
    N => { const a = rnd(7 * 60, 16 * 60), d = rnd(65, 150), b = a + d; return { e: '🚆', text: `Een trein vertrekt om ${tstrM(a)} en komt om ${tstrM(b)} aan. Hoeveel minuten duurt de reis?`, answer: d, unit: 'minuten', hint: 'Reken in stapjes: eerst tot het hele uur, dan de hele uren, dan de rest.', explain: durExplain(a, b) }; },
    N => { const a = rnd(15, 25), k = rnd(8, 14), n = rnd(1, 3); return { e: '🦁', text: `Een kaartje voor de dierentuin kost ${a} euro voor een volwassene en ${k} euro voor een kind. Wat betaalt een gezin met 2 volwassenen en ${n} ${plural(n, 'kind', 'kinderen')}?`, answer: 2 * a + n * k, unit: 'euro', hint: 'Reken de volwassenen en de kinderen apart uit. Tel ze daarna op.', explain: `2 × ${a} = ${2 * a} euro. ${n} × ${k} = ${n * k} euro.<br>${2 * a} + ${n * k} = <b>${2 * a + n * k} euro</b>.` }; },
    N => { const m = kies([2, 3, 4, 5]), c = kies([20, 25, 50]), a = m * 100 / c; return { e: '🎀', text: `Een rol lint is ${m} meter lang. ${N} knipt er stukken van ${c} cm van af. Hoeveel stukken kan ${N} knippen?`, answer: a, unit: 'stukken', hint: 'Maak van de meters eerst centimeters: 1 m = 100 cm.', explain: `${m} m = ${m * 100} cm.<br>${m * 100} : ${c} = <b>${a}</b> stukken.` }; }
  ]
};
function genVerhaal(diff) {
  const r = kies(VERHAAL[diff])(kies(NAMES));
  const q = Object.assign({ kind: 'num' }, r, { visual: `<div class="emo">${r.e}</div>` });
  delete q.e;
  return q;
}

/* =====================================================================
   PLUS & MIN – extra: cijferen (onder elkaar)
   ===================================================================== */
function genCijferen(diff) {
  const op = Math.random() < .5 ? '+' : '−';
  let a, b;
  if (diff === 'easy') { if (op === '+') { a = rnd(120, 599); b = rnd(110, 399); } else { a = rnd(400, 999); b = rnd(110, a - 100); } }
  else if (diff === 'medium') { if (op === '+') { a = rnd(1200, 5999); b = rnd(1100, 3999); } else { a = rnd(3000, 9999); b = rnd(1100, a - 500); } }
  else { if (op === '+') { a = rnd(2500, 6999); b = rnd(1500, 9999 - a); } else { a = rnd(5000, 9999); b = rnd(1500, a - 300); if (Math.random() < .4) a = Math.floor(a / 100) * 100 + rnd(0, 3); } }
  const c = columnCalc(a, b, op, { result: false, carry: false });
  const full = columnCalc(a, b, op);
  return {
    text: 'Cijferen: reken uit onder elkaar.', visual: c.html, kind: 'num', answer: c.res, comma: false,
    hint: 'Begin rechts bij de eenheden. Dan de tientallen, de honderdtallen en de duizendtallen.<ol class="steps">' + full.steps.map(s => `<li>${s}</li>`).join('') + '</ol>',
    explain: full.html + `<ol class="steps">${full.steps.map(s => `<li>${s}</li>`).join('')}</ol>Het antwoord is <b>${fmt(c.res)}</b>.`
  };
}
function genPlusMinAll(diff) {
  if (diff !== 'easy' && Math.random() < .35) return genCijferen(diff);
  if (diff === 'easy' && Math.random() < .2) return genCijferen('easy');
  return genPlusMin(diff);
}

/* =====================================================================
   GROTE GETALLEN – plaatswaarde, afronden, schatten
   ===================================================================== */
const ggRange = d => d === 'easy' ? [1000, 9999] : d === 'medium' ? [10000, 99999] : [100000, 999999];
const ggCols = d => d === 'easy' ? 4 : d === 'medium' ? 5 : 6;
const PVN = { 1: 'eenheden', 10: 'tientallen', 100: 'honderdtallen', 1000: 'duizendtallen', 10000: 'tienduizendtallen', 100000: 'honderdduizendtallen' };
const PVC = { 1: 'E', 10: 'T', 100: 'H', 1000: 'D', 10000: 'TD', 100000: 'HD' };
function ggPlace(diff) {
  const [lo, hi] = ggRange(diff), n = rnd(lo, hi), cols = ggCols(diff);
  const p = 10 ** rnd(0, cols - 1), d = Math.floor(n / p) % 10;
  return { text: `In het getal <b>${fmtBig(n)}</b>: welk cijfer staat op de plaats van de <b>${PVN[p]}</b>?`, kind: 'num', answer: d, comma: false,
    hint: `Zet het getal in de getallenkaart. Van rechts naar links: eenheden, tientallen, honderdtallen, duizendtallen…${placeChart(n, cols)}`,
    explain: `${placeChart(n, cols, PVC[p])}Op de plaats van de ${PVN[p]} (${PVC[p]}) staat de <b>${d}</b>.` };
}
function ggValue(diff) {
  const [lo, hi] = ggRange(diff), cols = ggCols(diff);
  let n, p, d, tries = 0;
  do { n = rnd(lo, hi); p = 10 ** rnd(1, cols - 1); d = Math.floor(n / p) % 10; tries++; }
  while ((d === 0 || String(n).split(d).length !== 2) && tries < 200);
  const c = mkChoice(fmtBig(d * p), [fmtBig(d * p / 10), fmtBig(d * p * 10), String(d), fmtBig(d * p * 100)], 4);
  return Object.assign(c, { text: `Hoeveel is de <b>${d}</b> waard in <b>${fmtBig(n)}</b>?`, big: true,
    hint: `Zoek op welke plaats de ${d} staat in de getallenkaart.${placeChart(n, cols)}`,
    explain: `${placeChart(n, cols, PVC[p])}De ${d} staat op de plaats van de ${PVN[p]}. Hij is dus <b>${fmtBig(d * p)}</b> waard.` });
}
function ggWords(diff) {
  const [lo, hi] = ggRange(diff); let n = rnd(lo, hi);
  if (Math.random() < .5) { const p = 10 ** rnd(1, ggCols(diff) - 2); n = n - (Math.floor(n / p) % 10) * p; }
  return { text: `Schrijf in cijfers:<div class="words">${nlWords(n)}</div>`, kind: 'num', answer: n, comma: false,
    hint: 'Knip het woord in stukjes: eerst wat er vóór "duizend" staat, dan de honderdtallen, dan de rest. Let op nullen!',
    explain: `${placeChart(n, ggCols(diff))}${nlWords(n)} = <b>${fmtBig(n)}</b>.` };
}
function ggRound(diff) {
  const to = kies(diff === 'easy' ? [10, 100] : diff === 'medium' ? [100, 1000] : [1000, 10000]);
  const [lo0, hi0] = ggRange(diff); let n; do { n = rnd(lo0, hi0); } while (n % to === 0);
  const lo = Math.floor(n / to) * to, hi = lo + to, r = Math.round(n / to) * to, k = Math.floor(n / (to / 10)) % 10;
  const line = numberLine(lo, hi, to / 10, [{ v: n, label: fmtBig(n), cls: 'q' }], { labelEvery: to / 2 });
  return { text: `Rond <b>${fmtBig(n)}</b> af op <b>${PVN[to]}</b>.`, kind: 'num', answer: r, comma: false,
    hint: `Tussen welke twee ronde getallen ligt ${fmtBig(n)}? Kijk naar het cijfer rechts van de ${PVN[to]}: 0 t/m 4 → naar beneden, 5 t/m 9 → naar boven.${line}`,
    explain: `${line}${fmtBig(n)} ligt tussen ${fmtBig(lo)} en ${fmtBig(hi)}. Het cijfer na de ${PVN[to]} is een ${k}: ${k >= 5 ? '5 of meer, dus naar boven' : 'minder dan 5, dus naar beneden'}. Afgerond: <b>${fmtBig(r)}</b>.` };
}
function ggEstimate(diff) {
  const to = diff === 'easy' ? 100 : diff === 'medium' ? 1000 : 10000;
  const op = Math.random() < .5 ? '+' : '−';
  let a, b, ra, rb, ans;
  do {
    a = rnd(to * 1.2, to * 8.4 | 0); b = rnd(to * 1.2, to * 5.4 | 0);
    if (op === '−' && b >= a) [a, b] = [b, a];
    ra = Math.round(a / to) * to; rb = Math.round(b / to) * to;
    ans = op === '+' ? ra + rb : ra - rb;
  } while (a % to === 0 || b % to === 0 || ans !== Math.round((op === '+' ? a + b : a - b) / to) * to || ans <= to);
  const c = mkChoice(fmtBig(ans), [fmtBig(ans + to), fmtBig(ans - to), fmtBig(ans + 2 * to), fmtBig(ans * 10)], 3);
  return Object.assign(c, { text: `Schat: <b>${fmtBig(a)} ${op} ${fmtBig(b)}</b> is ongeveer…`, big: true,
    hint: `Rond eerst beide getallen af op ${PVN[to]}. Reken dan met de ronde getallen.`,
    explain: `${fmtBig(a)} ≈ ${fmtBig(ra)} en ${fmtBig(b)} ≈ ${fmtBig(rb)}.<br>${fmtBig(ra)} ${op} ${fmtBig(rb)} = <b>${fmtBig(ans)}</b>.` });
}
function ggCompare(diff) {
  const [lo, hi] = ggRange(diff), base = rnd(lo, hi), len = String(base).length;
  const vals = new Set([base]);
  while (vals.size < 4) {
    const pos = rnd(1, len - 1), s = String(base).split('');
    s[pos] = String(rnd(0, 9)); if (Math.random() < .4) { const p2 = rnd(1, len - 1); s[p2] = String(rnd(0, 9)); }
    vals.add(+s.join(''));
  }
  const arr = shuffle([...vals]), big = Math.random() < .5, t = big ? Math.max(...arr) : Math.min(...arr);
  return { text: `Welk getal is het <b>${big ? 'grootst' : 'kleinst'}</b>?`, kind: 'choice', choices: arr.map(fmtBig), answer: arr.indexOf(t), big: true,
    hint: 'Vergelijk de cijfers van links naar rechts. Het eerste cijfer dat verschilt, beslist.',
    explain: `Van links naar rechts vergelijken: <b>${fmtBig(t)}</b> is het ${big ? 'grootst' : 'kleinst'}.` };
}
function ggLine(diff) {
  let lo, span, step, v;
  if (diff === 'easy') { lo = rnd(1, 8) * 1000; span = 1000; step = 100; v = lo + rnd(1, 9) * 100; }
  else if (diff === 'medium') { lo = rnd(1, 8) * 10000; span = 10000; step = 1000; v = lo + rnd(1, 9) * 1000; }
  else { lo = rnd(0, 8) * 100000; span = 100000; step = 10000; v = lo + rnd(1, 9) * 10000 + (Math.random() < .4 ? 5000 : 0); }
  const k = (v - lo) / step;
  return { text: 'Welk getal hoort bij de pijl?', visual: numberLine(lo, lo + span, step, [{ v, label: '?', cls: 'q' }], { labelEvery: span / 2 }), kind: 'num', answer: v, comma: false,
    hint: `Hoeveel is één streepje? Van ${fmtBig(lo)} tot ${fmtBig(lo + span)} zijn 10 stapjes, dus één stapje is ${fmtBig(step)}.`,
    explain: `Elk streepje is ${fmtBig(step)}. De pijl staat ${Number.isInteger(k) ? k : fmt(k)} stapjes na ${fmtBig(lo)}: <b>${fmtBig(v)}</b>.` };
}
function ggMore(diff) {
  const [lo, hi] = ggRange(diff), n = rnd(lo, hi - 10000 > lo ? hi - 10000 : hi);
  const delta = kies(diff === 'easy' ? [10, 100, 1000] : diff === 'medium' ? [100, 1000, 10000] : [1000, 10000, 100000]);
  const more = Math.random() < .5 || n - delta < 0;
  const ans = more ? n + delta : n - delta;
  return { text: `Wat is <b>${fmtBig(delta)} ${more ? 'meer' : 'minder'}</b> dan ${fmtBig(n)}?`, kind: 'num', answer: ans, comma: false,
    hint: `Alleen het cijfer van de ${PVN[delta]} verandert (behalve als je over de 9 of de 0 heen gaat).`,
    explain: `${fmtBig(n)} ${more ? '+' : '−'} ${fmtBig(delta)} = <b>${fmtBig(ans)}</b>.` };
}
function genGroot(diff) {
  const list = { easy: [ggPlace, ggValue, ggWords, ggRound, ggLine, ggMore], medium: [ggPlace, ggValue, ggWords, ggRound, ggEstimate, ggCompare, ggLine, ggMore], hard: [ggValue, ggWords, ggRound, ggEstimate, ggCompare, ggLine, ggMore] }[diff];
  return kies(list)(diff);
}

/* =====================================================================
   GELD
   ===================================================================== */
const SHOP = [['🧪', 'toverdrankje', 245], ['🍭', 'sterrensnoep', 85], ['📒', 'spreukenboek', 650], ['🪄', 'oefenstaf', 395], ['🧦', 'toversokken', 320], ['🍪', 'maankoekje', 120], ['🎈', 'zweefballon', 175], ['🖍️', 'glitterkrijt', 230], ['🥤', 'bubbellimonade', 140], ['🥟', 'pastechi', 150]];
function geldCount(diff) {
  let c;
  if (diff === 'easy') c = rnd(2, 19) * 100 + kies([0, 0, 50]);
  else if (diff === 'medium') c = rnd(150, 3500);
  else c = rnd(2000, 9999);
  if (diff !== 'easy') c = Math.round(c / 5) * 5;
  const items = makeChange(c);
  let run = 0; const parts = items.map(x => { run += x; return euro(run); });
  return { text: 'Hoeveel geld is dit samen?', visual: moneyHTML(items), kind: 'num', answer: c / 100, prefix: '€', answerText: euro(c),
    hint: 'Begin bij het grootste: eerst de briefjes, dan de euromunten, dan de centen. Tel steeds verder.',
    explain: `Tel van groot naar klein: ${parts.join(' → ')}.<br>Samen is dat <b>${euro(c)}</b>.` };
}
function payNote(p) { return [100, 200, 500, 1000, 2000, 5000].find(n => n > p) || 10000; }
function changeSteps(p, P) {
  const pts = [p]; let cur = p;
  if (cur % 100) { cur = Math.ceil(cur / 100) * 100; pts.push(cur); }
  if (cur < P && cur % 500) { const n5 = Math.min(Math.ceil(cur / 500) * 500, P); if (n5 > cur) { cur = n5; pts.push(cur); } }
  if (cur < P) pts.push(P);
  const steps = []; for (let i = 1; i < pts.length; i++) steps.push(`${euro(pts[i - 1])} → ${euro(pts[i])}: ${euro(pts[i] - pts[i - 1])}`);
  return steps;
}
function geldChange(diff) {
  const [e, name] = kies(SHOP);
  const p = diff === 'easy' ? rnd(1, 9) * 50 : diff === 'medium' ? rnd(20, 190) * 5 : rnd(250, 999) * 5;
  const P = payNote(p), ch = P - p;
  return { text: `${e} Een ${name} kost <b>${euro(p)}</b>. Je betaalt met <b>${euro(P)}</b>. Hoeveel wisselgeld krijg je terug?`, kind: 'num', answer: ch / 100, prefix: '€', answerText: euro(ch),
    hint: `Tel op vanaf de prijs tot ${euro(P)}, net als in de winkel. Of reken ${euro(P)} − ${euro(p)}.`,
    explain: `Tel op vanaf de prijs:<br>${changeSteps(p, P).join('<br>')}<br>Samen: <b>${euro(ch)}</b> terug.` };
}
function geldTotal(diff) {
  const n = diff === 'easy' ? 2 : diff === 'medium' ? kies([2, 3]) : 3;
  const pick = shuffle(SHOP).slice(0, n).map(s => [...s, diff === 'hard' ? rnd(1, 3) : 1]);
  const menu = tableHTML(['Toverwinkel', 'Prijs'], pick.map(([e, nm, p]) => [`${e} ${nm}`, euro(p)]));
  const tot = pick.reduce((s, [, , p, q]) => s + p * q, 0);
  const list = pick.map(([, nm, , q]) => (q > 1 ? `${q} × ` : 'een ') + nm).join(', ').replace(/, ([^,]*)$/, ' en $1');
  return { text: `Je koopt ${list}. Hoeveel moet je betalen?`, visual: menu, kind: 'num', answer: tot / 100, prefix: '€', answerText: euro(tot),
    hint: 'Tel eerst de hele euro\'s op, daarna de centen. 100 cent = 1 euro.',
    explain: pick.map(([, nm, p, q]) => q > 1 ? `${q} × ${euro(p)} = ${euro(p * q)}` : `${nm}: ${euro(p)}`).join('<br>') + `<br>Samen: <b>${euro(tot)}</b>.` };
}
function geldSplit(diff) {
  const k = diff === 'hard' ? kies([3, 4, 5, 6]) : kies([2, 4, 5]);
  const each = diff === 'hard' ? rnd(30, 400) * 5 : rnd(4, 40) * 25, tot = each * k;
  return { text: `${k} vriendinnen vinden samen een schat van <b>${euro(tot)}</b> (toverfeeën-geld!). Ze verdelen het eerlijk. Hoeveel krijgt ieder?`, kind: 'num', answer: each / 100, prefix: '€', answerText: euro(each),
    hint: `Reken in centen: ${tot} cent : ${k}. Of verdeel eerst de hele euro's en dan de rest.`,
    explain: `${euro(tot)} = ${tot} cent. ${tot} : ${k} = ${each} cent = <b>${euro(each)}</b>.` };
}
function geldCompare() {
  const n = kies([3, 4, 5, 6]), per = rnd(30, 90) * 5, packPer = per + kies([-10, -5, 5, 10]);
  const pack = packPer * n, [e, nm] = kies(SHOP);
  const opts = [`Een pak van ${n} voor ${euro(pack)}`, `Los voor ${euro(per)} per stuk`, 'Even duur'];
  const ans = packPer < per ? 0 : packPer > per ? 1 : 2;
  return { text: `${e} Wat is <b>per stuk</b> het goedkoopst?`, kind: 'choice', choices: opts, answer: ans,
    hint: `Reken uit wat één ${nm} in het pak kost: ${euro(pack)} : ${n}.`,
    explain: `In het pak kost één stuk ${euro(pack)} : ${n} = ${euro(packPer)}. Los kost ${euro(per)}. Dus: <b>${opts[ans]}</b>.` };
}
function genGeld(diff) {
  const list = { easy: [geldCount, geldCount, geldChange, geldTotal], medium: [geldCount, geldChange, geldTotal, geldSplit], hard: [geldCount, geldChange, geldTotal, geldSplit, geldCompare] }[diff];
  return kies(list)(diff);
}

/* =====================================================================
   OMTREK & OPPERVLAKTE
   ===================================================================== */
function genOpp(diff) {
  const askArea = Math.random() < .5;
  if (diff === 'hard' && Math.random() < .3) {
    const area = Math.random() < .5, w = rnd(4, 12), h = rnd(2, 9);
    if (area) return { text: `Een rechthoekige tuin heeft een oppervlakte van <b>${w * h} m²</b>. Hij is <b>${w} m</b> lang. Hoe breed is de tuin?`, kind: 'num', answer: h, unit: 'm', comma: false,
      hint: 'Oppervlakte = lengte × breedte. Welk getal keer ' + w + ' is ' + w * h + '?', explain: `${w} × ? = ${w * h}. ${w * h} : ${w} = <b>${h} m</b>.` };
    return { text: `Een rechthoek heeft een omtrek van <b>${2 * (w + h)} cm</b>. Hij is <b>${w} cm</b> lang. Hoe breed is hij?`, kind: 'num', answer: h, unit: 'cm', comma: false,
      hint: 'De omtrek is 2 × lengte + 2 × breedte. Haal eerst 2 × de lengte eraf.', explain: `${2 * (w + h)} − ${w} − ${w} = ${2 * h}. Dat zijn twee breedtes, dus één breedte is ${2 * h} : 2 = <b>${h} cm</b>.` };
  }
  if (diff === 'hard') {
    const w = rnd(5, 9), h = rnd(4, 7), cw = rnd(2, w - 2), ch = rnd(1, h - 2);
    const vis = gridShape(w, h, { cut: [cw, ch], labels: true });
    if (askArea) return { text: 'Wat is de <b>oppervlakte</b> van deze figuur? (Elk hokje is 1 cm².)', visual: vis, kind: 'num', answer: w * h - cw * ch, unit: 'cm²', comma: false,
      hint: 'Maak er in gedachten een grote rechthoek van. Haal daarna het lege stuk eraf.',
      explain: `Grote rechthoek: ${w} × ${h} = ${w * h} cm².<br>Het lege stuk: ${cw} × ${ch} = ${cw * ch} cm².<br>${w * h} − ${cw * ch} = <b>${w * h - cw * ch} cm²</b>.` };
    return { text: 'Wat is de <b>omtrek</b> van deze figuur?', visual: vis, kind: 'num', answer: 2 * (w + h), unit: 'cm', comma: false,
      hint: `Tel alle zijden op, ook de twee korte zijden in de hoek. Die zijn ${cw} cm en ${ch} cm (reken maar na!).`,
      explain: `Zijden: ${w - cw} + ${ch} + ${cw} + ${h - ch} + ${w} + ${h} = <b>${2 * (w + h)} cm</b>. Handig: dat is net zoveel als de omtrek van de grote rechthoek!` };
  }
  const easy = diff === 'easy';
  const w = easy ? rnd(2, 8) : rnd(4, 15), h = easy ? rnd(2, 6) : rnd(3, 12), u = easy ? 'cm' : kies(['m', 'cm']);
  const vis = gridShape(w, h, { labels: true, unit: u, grid: easy });
  if (askArea) return { text: `Wat is de <b>oppervlakte</b> van deze rechthoek?`, visual: vis, kind: 'num', answer: w * h, unit: u + '²', comma: false,
    hint: easy ? 'Tel de hokjes. Of reken: lengte × breedte.' : 'Oppervlakte = lengte × breedte.',
    explain: `${w} × ${h} = <b>${w * h} ${u}²</b>.${easy ? ` Er zitten ${h} rijen van ${w} hokjes in.` : ''}` };
  return { text: `Wat is de <b>omtrek</b> van deze rechthoek?`, visual: vis, kind: 'num', answer: 2 * (w + h), unit: u, comma: false,
    hint: 'De omtrek is de rand eromheen. Tel alle vier de zijden op.',
    explain: `${w} + ${h} + ${w} + ${h} = <b>${2 * (w + h)} ${u}</b>.` };
}

/* =====================================================================
   TABELLEN & GRAFIEKEN
   ===================================================================== */
const CHARTS = [
  { title: 'Lievelingsfruit van groep 6', unit: 'kinderen', who: 'kinderen kozen', labels: ['appel', 'banaan', 'mango', 'aardbei', 'meloen'] },
  { title: 'Huisdieren van groep 6', unit: 'kinderen', who: 'kinderen hebben een', labels: ['hond', 'kat', 'konijn', 'vis', 'hamster'] },
  { title: 'Verkochte toverdrankjes', unit: 'flesjes', who: 'flesjes verkocht op', labels: ['ma', 'di', 'wo', 'do', 'vr'] },
  { title: 'Gevonden schelpen op het strand', unit: 'schelpen', who: 'schelpen gevonden op', labels: ['ma', 'di', 'wo', 'do', 'vr'] }
];
const DAYN = { ma: 'maandag', di: 'dinsdag', wo: 'woensdag', do: 'donderdag', vr: 'vrijdag' };
function grBar(diff) {
  const C = kies(CHARTS), n = diff === 'easy' ? 4 : 5, labels = C.labels.slice(0, n);
  const step = diff === 'easy' ? 2 : diff === 'medium' ? 5 : 10, unitStep = diff === 'hard' ? 5 : step;
  let values; do { values = labels.map(() => rnd(1, diff === 'easy' ? 8 : 8) * unitStep); } while (new Set(values).size < n);
  const chart = `<div class="ctitle">${C.title}</div>` + barChart(labels, values, { step, max: Math.ceil((Math.max(...values) + 1) / step) * step });
  const nm = l => DAYN[l] || l;
  const t = rnd(0, diff === 'easy' ? 2 : 3);
  const i = rnd(0, n - 1); let j; do { j = rnd(0, n - 1); } while (j === i);
  const read = 'Volg de bovenkant van de staaf naar links, naar de getallen.';
  if (t === 0) return { text: `Hoeveel ${C.unit} bij <b>${nm(labels[i])}</b>?`, visual: chart, kind: 'num', answer: values[i], unit: C.unit, comma: false, hint: read + (diff === 'hard' ? ' Staat de staaf tussen twee lijnen? Dan is het precies het midden.' : ''), explain: `De staaf bij ${nm(labels[i])} komt tot <b>${values[i]}</b>.` };
  if (t === 1) {
    const most = Math.random() < .6, v = most ? Math.max(...values) : Math.min(...values), k = values.indexOf(v);
    return { text: `Bij welke is het <b>${most ? 'meest' : 'minst'}</b>?`, visual: chart, kind: 'choice', choices: labels.map(nm), answer: k, hint: `Zoek de ${most ? 'hoogste' : 'laagste'} staaf.`, explain: `De ${most ? 'hoogste' : 'laagste'} staaf is <b>${nm(labels[k])}</b> (${v}).` };
  }
  if (t === 2) {
    const [a, b] = values[i] >= values[j] ? [i, j] : [j, i];
    return { text: `Hoeveel ${C.unit} <b>meer</b> bij ${nm(labels[a])} dan bij ${nm(labels[b])}?`, visual: chart, kind: 'num', answer: values[a] - values[b], unit: C.unit, comma: false, hint: 'Lees eerst beide staven af. Reken dan het verschil uit: groot − klein.', explain: `${nm(labels[a])}: ${values[a]}, ${nm(labels[b])}: ${values[b]}. ${values[a]} − ${values[b]} = <b>${values[a] - values[b]}</b>.` };
  }
  const tot = values.reduce((x, y) => x + y, 0);
  return { text: `Hoeveel ${C.unit} zijn het <b>samen</b>?`, visual: chart, kind: 'num', answer: tot, unit: C.unit, comma: false, hint: 'Lees alle staven af en tel ze op.', explain: `${values.join(' + ')} = <b>${tot}</b>.` };
}
function grTable(diff) {
  const days = ['ma', 'di', 'wo', 'do', 'vr'], rows = [['🍦 ijsjes'], ['🥤 drankjes'], ['🥟 pastechi']];
  const vals = rows.map(() => days.map(() => rnd(diff === 'easy' ? 2 : 10, diff === 'easy' ? 20 : 95)));
  const tbl = `<div class="ctitle">Verkocht in de schoolkantine</div>` + tableHTML(['', ...days], rows.map((r, i) => [r[0], ...vals[i]]));
  const r = rnd(0, 2), d = rnd(0, 4), nm = rows[r][0].split(' ')[1];
  const t = diff === 'easy' ? rnd(0, 1) : rnd(0, 2);
  if (t === 0) return { text: `Hoeveel ${nm} zijn er op <b>${DAYN[days[d]]}</b> verkocht?`, visual: tbl, kind: 'num', answer: vals[r][d], comma: false, hint: `Zoek de rij met ${nm} en de kolom van ${DAYN[days[d]]}. Waar ze elkaar kruisen, staat het antwoord.`, explain: `In de rij ${nm}, kolom ${days[d]}: <b>${vals[r][d]}</b>.` };
  if (t === 1) { const v = Math.max(...vals[r]); const ties = vals[r].filter(x => x === v).length; if (ties > 1) return grTable(diff); const k = vals[r].indexOf(v); return { text: `Op welke dag zijn de meeste <b>${nm}</b> verkocht?`, visual: tbl, kind: 'choice', choices: days.map(x => DAYN[x]), answer: k, hint: `Kijk alleen naar de rij met ${nm}. Zoek het grootste getal.`, explain: `Het grootste getal in de rij ${nm} is ${v}, op <b>${DAYN[days[k]]}</b>.` }; }
  const tot = vals[r].reduce((a, b) => a + b, 0);
  return { text: `Hoeveel ${nm} zijn er in de hele week verkocht?`, visual: tbl, kind: 'num', answer: tot, comma: false, hint: `Tel alle getallen in de rij ${nm} op.`, explain: `${vals[r].join(' + ')} = <b>${tot}</b>.` };
}
function grLine(diff) {
  const hrs = ['8:00', '10:00', '12:00', '14:00', '16:00'], base = rnd(18, 24);
  const temps = [base, base + rnd(1, 3), base + rnd(3, 6), base + rnd(5, 8), base + rnd(1, 4)];
  const chart = `<div class="ctitle">Temperatuur op Curaçao (°C)</div>` + lineChart(hrs, temps, { min: 15, max: 35, step: 5 });
  const i = rnd(0, 4), t = rnd(0, 2);
  if (t === 0) return { text: `Hoe warm was het om <b>${hrs[i]}</b>?`, visual: chart, kind: 'num', answer: temps[i], unit: '°C', comma: false, hint: 'Zoek de stip boven de tijd. Kijk dan naar links. Elk lijntje is 5 graden; tussen de lijntjes moet je schatten.', explain: `Om ${hrs[i]} was het <b>${temps[i]} °C</b>.` };
  if (t === 1) { const v = Math.max(...temps), k = temps.indexOf(v); return { text: 'Hoe laat was het het <b>warmst</b>?', visual: chart, kind: 'choice', choices: hrs, answer: k, hint: 'Zoek de hoogste stip.', explain: `De hoogste stip staat bij <b>${hrs[k]}</b>.` }; }
  const a = 0, b = rnd(2, 3);
  return { text: `Hoeveel graden warmer was het om ${hrs[b]} dan om ${hrs[a]}?`, visual: chart, kind: 'num', answer: temps[b] - temps[a], unit: 'graden', comma: false, hint: 'Lees beide temperaturen af en reken het verschil uit.', explain: `${temps[b]} − ${temps[a]} = <b>${temps[b] - temps[a]} graden</b>.` };
}
function genGrafiek(diff) {
  const list = { easy: [grBar, grBar, grTable], medium: [grBar, grTable, grLine], hard: [grBar, grTable, grLine] }[diff];
  return kies(list)(diff);
}

/* =====================================================================
   Vak en onderwerpen aanmelden
   ===================================================================== */
const emojiRows = (rows, n, e) => `<div class="emorows">${Array.from({ length: rows }, () => `<div>${e.repeat(n)}</div>`).join('')}</div>`;

registerSubject({
  id: 'rekenen', name: 'Getallenmagie', school: 'Rekenen', ico: '🔢', place: 'toren', placeName: 'De Getallentoren',
  teacher: 'kiko', teacherName: 'Professor Kiko', color: '#8B6CF0', light: '#F1ECFF', dark: '#5B47C9',
  hello: 'Klik-klak! Welkom in de Getallentoren. Hier toveren we met getallen. Kies een spreukenboek!'
});

registerTopic('rekenen', { id: 'tafels', name: 'Tafels', sub: '1 t/m 10', ico: '✖️', gen: genTafels, pace: { easy: 15, medium: 12, hard: 9 }, comma: false, lesson: [
  { t: 'Wat is keer?', h: '<b>3 × 4</b> betekent: <b>3 groepjes van 4</b>.<br>Dat is 4 + 4 + 4 = <b>12</b>.', v: emojiRows(3, 4, '⭐') },
  { t: 'Omdraaien mag!', h: '3 × 4 is hetzelfde als 4 × 3. Allebei 12!<br>Weet je 7 × 3? Dan weet je ook 3 × 7. Zo hoef je maar de helft te leren. 🎉', v: emojiRows(4, 3, '🌙') },
  { t: 'Toverslimme trucs', h: '<ul class="tips"><li><b>× 1</b>: het getal blijft hetzelfde.</li><li><b>× 2</b>: het dubbele. 2 × 8 = 8 + 8.</li><li><b>× 10</b>: zet een 0 erachter. 10 × 6 = 60.</li><li><b>× 5</b>: de helft van × 10. 5 × 6 = de helft van 60 = 30.</li><li><b>× 4</b>: dubbel en nog eens dubbel.</li><li><b>× 9</b>: × 10 en dan één keer eraf. 9 × 6 = 60 − 6 = 54.</li></ul>' },
  { t: 'Oefen de rijtjes', h: 'Kies een tafel en zeg hem hardop. Hoe vaker je hem zegt, hoe beter je spreuk werkt!', w: 'tafel', o: { n: 7 } },
  { t: 'Weet je er één niet?', h: 'Reken vanaf een som die je wél weet.', w: 'stappen', o: { lines: ['Je weet <b>6 × 8</b> niet?', 'Neem een som die je wél weet: <b>5 × 8 = 40</b>.', 'Er moet nog <b>één</b> 8 bij: 40 + 8 = <b>48</b>.'] } },
  { t: 'Probeer zelf', h: 'Gebruik dezelfde truc.', w: 'probeer', o: { q: 'Wat is <b>6 × 7</b>? Begin met 5 × 7 = 35.', opts: ['42', '36', '49'], ok: 0, uitleg: '5 × 7 = 35 en dan nog één 7 erbij: <b>42</b>.', hint: '35 + 7 = ?' } }
] });

registerTopic('rekenen', { id: 'delen', name: 'Delen', sub: 'ook met rest', ico: '➗', gen: genDelen, pace: { easy: 12, medium: 7, hard: 4 }, comma: false, lesson: [
  { t: 'Eerlijk verdelen', h: '<b>12 : 3</b> betekent: verdeel 12 eerlijk over 3.<br>Iedereen krijgt <b>4</b>.', v: emojiRows(3, 4, '🍬') },
  { t: 'Delen is keer, maar andersom', h: 'Weet je dat 4 × 3 = 12?<br>Dan weet je ook: 12 : 3 = 4 en 12 : 4 = 3.<br>Denk bij delen dus aan de tafels!' },
  { t: 'Delen met rest', h: 'Verdeel 14 koekjes over 4 kinderen. Tik op de knop en kijk stap voor stap.', w: 'stappen', o: { lines: ['<b>14 : 4</b> = ?', 'Zoek in de tafel van 4: <b>3 × 4 = 12</b> past ✔️', '<b>4 × 4 = 16</b> is te veel ✖️', 'Er blijft over: 14 − 12 = <b>2</b>', 'Dus 14 : 4 = <b>3 rest 2</b>'] }, v: '<div class="emorows"><div>🍪🍪🍪🍪</div><div>🍪🍪🍪🍪</div><div>🍪🍪🍪🍪</div><div class="rest">🍪🍪 ← rest</div></div>' },
  { t: 'Grote getallen delen', h: 'Splits het getal in handige stukken. Dan reken je twee makkelijke sommen.', w: 'stappen', o: { lines: ['<b>84 : 4</b>. Splits 84 in <b>80</b> en <b>4</b>.', '80 : 4 = <b>20</b>', '4 : 4 = <b>1</b>', '20 + 1 = <b>21</b>'] } },
  { t: 'Probeer zelf', h: 'Nu jij.', w: 'probeer', o: { q: 'Wat is <b>48 : 4</b>? Splits in 40 en 8.', opts: ['12', '11', '14'], ok: 0, uitleg: '40 : 4 = 10 en 8 : 4 = 2. Samen: <b>12</b>.', hint: '40 : 4 = 10 en 8 : 4 = 2.' } },
  { t: 'Zo vul je het in', h: 'Bij een som met rest zie je twee vakjes. Typ eerst het antwoord. Tik dan op het vakje <b>rest</b> en typ wat er overblijft. Geen rest? Laat het rest-vakje leeg.' }
] });

registerTopic('rekenen', { id: 'plusmin', name: 'Plus en min', sub: 'tot 10.000 & cijferen', ico: '➕', gen: genPlusMinAll, pace: { easy: 8, medium: 5, hard: 3 }, comma: false, lesson: [
  { t: 'Splitsen', h: 'Grote getallen tel je makkelijk op door ze te splitsen in duizendtallen, honderdtallen en tientallen.', w: 'stappen', o: { lines: ['<b>3.450 + 1.230</b>', '3.000 + 1.000 = <b>4.000</b>', '400 + 200 = <b>600</b>', '50 + 30 = <b>80</b>', '4.000 + 600 + 80 = <b>4.680</b>'] } },
  { t: 'Sprongen op de getallenlijn', h: '<b>4.560 − 1.300</b><br>Spring eerst 1.000 terug: 3.560.<br>Dan nog 300 terug: <b>3.260</b>.', v: numberLine(3000, 5000, 100, [{ v: 4560, label: '4.560' }, { v: 3260, label: '3.260', cls: 'ans' }], { labelEvery: 500, arc: [4560, 3260] }) },
  { t: 'Cijferen: onder elkaar', h: 'Bij cijferen zet je de getallen precies onder elkaar: eenheden onder eenheden, tientallen onder tientallen. Begin altijd <b>rechts</b>. Wordt het 10 of meer? Schrijf de eenheid op en <b>onthoud 1</b>.', w: 'cijferen', o: { op: '+' } },
  { t: 'Cijferen met lenen', h: 'Bij min kan het gebeuren dat het bovenste cijfer te klein is. Dan <b>leen</b> je 10 van het cijfer links ernaast.', w: 'cijferen', o: { op: '-' } },
  { t: 'Controleer jezelf', h: 'Een minsom kun je controleren met een plussom.<br>9.000 − 3.250 = 5.750?<br>Check: 5.750 + 3.250 = 9.000 ✅' }
] });

registerTopic('rekenen', { id: 'groot', name: 'Grote getallen', sub: 'afronden & schatten', ico: '🏰', gen: genGroot, pace: { easy: 7, medium: 6, hard: 5 }, comma: false, lesson: [
  { t: 'De getallenkaart', h: 'Elk cijfer heeft een plaats. Van rechts naar links: <b>E</b>enheden, <b>T</b>ientallen, <b>H</b>onderdtallen, <b>D</b>uizendtallen, <b>TD</b> tienduizendtallen, <b>HD</b> honderdduizendtallen. Druk op de pijltjes!', w: 'plaats', o: { n: 47352, cols: 6 } },
  { t: 'Punten in grote getallen', h: 'Lange getallen zijn moeilijk te lezen. Daarom zetten we om de drie cijfers (van rechts) een punt.<br>1000000 → <b>1.000.000</b> (een miljoen).<br>Een miljoen is duizend keer duizend!' },
  { t: 'Afronden', h: 'Afronden maakt een getal rond en makkelijk. Kijk naar het cijfer rechts van de plaats waarop je afrondt:<br><b>0, 1, 2, 3, 4</b> → naar beneden.<br><b>5, 6, 7, 8, 9</b> → naar boven.', w: 'afronden', o: { n: 3470, to: 100 } },
  { t: 'Schatten', h: 'Bij schatten rond je eerst af en reken je dan. Zo weet je snel <i>ongeveer</i> het antwoord.<br>398 + 512 ≈ 400 + 500 = <b>900</b>.' },
  { t: 'De getallenlijn', h: 'Op een getallenlijn kijk je eerst hoeveel één streepje is.<br>Van 4.000 tot 5.000 zijn 10 stapjes: elk stapje is 100.', v: numberLine(4000, 5000, 100, [{ v: 4700, label: '4.700' }], { labelEvery: 500 }) }
] });

registerTopic('rekenen', { id: 'breuken', name: 'Breuken & kommagetallen', sub: '½, ¼, 0,5 …', ico: '🍕', gen: genBreuken, pace: { easy: 6, medium: 5, hard: 4 }, lesson: [
  { t: 'Wat is een breuk?', h: 'Een breuk is een deel van een geheel. Kies in hoeveel stukken je de strook verdeelt en tik op stukken om ze te kleuren.', w: 'breuk', o: { d: 4 } },
  { t: 'Teller en noemer', h: `In ${frac(3, 4)} is de <b>4</b> de <b>noemer</b>: in hoeveel gelijke stukken het verdeeld is.<br>De <b>3</b> is de <b>teller</b>: hoeveel stukken je hebt.`, v: fracBar(3, 4) },
  { t: 'Een breuk van een getal', h: `Dit gaat altijd in twee stappen: eerst delen, dan keer.`, w: 'stappen', o: { lines: [`${frac(3, 4)} van 20 = ?`, 'Stap 1: deel door de <b>noemer</b>: 20 : 4 = <b>5</b>', 'Stap 2: keer de <b>teller</b>: 3 × 5 = <b>15</b>'] } },
  { t: 'Probeer zelf', h: 'Dezelfde twee stappen.', w: 'probeer', o: { q: 'Wat is 2/3 van <b>12</b>?', opts: ['8', '6', '4'], ok: 0, uitleg: '12 : 3 = 4 en 2 × 4 = <b>8</b>.', hint: 'Eerst 12 : 3. Dan keer 2.' } },
  { t: 'Even groot, andere naam', h: `${frac(1, 2)} = ${frac(2, 4)} = ${frac(4, 8)}<br>Doe je teller én noemer keer hetzelfde getal? Dan blijft de breuk even groot.`, v: fracBar(1, 2) + fracBar(2, 4) + fracBar(4, 8) },
  { t: 'Kommagetallen', h: `Na de komma komen de <b>tienden</b> en de <b>honderdsten</b>.<br>0,5 = ${frac(5, 10)} = ${frac(1, 2)}<br>0,25 = ${frac(25, 100)} = ${frac(1, 4)}<br>Bij geld ken je dit al: € 2,50 is twee en een halve euro!` },
  { t: 'Het honderdveld', h: 'Honderd hokjes zijn samen <b>1 hele</b>. Tik op de hokjes. Eén hokje is <b>0,01</b>, een hele rij is <b>0,1</b>.', w: 'honderdveld' },
  { t: 'Keer 10 en gedeeld door 10', h: 'Bij <b>× 10</b> schuift de komma 1 plaats naar <b>rechts</b>: 3,5 × 10 = 35.<br>Bij <b>: 10</b> schuift de komma 1 plaats naar <b>links</b>: 42 : 10 = 4,2.' }
] });

registerTopic('rekenen', { id: 'geld', name: 'Geld', sub: 'euro\'s en centen', ico: '💶', gen: genGeld, pace: { easy: 6, medium: 5, hard: 4 }, lesson: [
  { t: 'Munten en briefjes', h: 'Dit is ons geld. 100 cent = 1 euro.', v: moneyHTML([5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1]) },
  { t: 'Geld tellen', h: 'Tel altijd van groot naar klein: eerst de briefjes, dan de euromunten, dan de centen.<br>€10 + €5 + €2 + 50c + 20c = <b>€ 17,70</b>.', v: moneyHTML([1000, 500, 200, 50, 20]) },
  { t: 'Zelf betalen', h: 'Probeer het bedrag precies te betalen met zo weinig mogelijk munten.', w: 'geld' },
  { t: 'Wisselgeld', h: 'Je koopt iets van € 3,45 en betaalt met € 5. Tel op vanaf de prijs, net als de verkoper.', w: 'stappen', o: { lines: ['€ 3,45 → € 3,50 is <b>5 cent</b>', '€ 3,50 → € 4,00 is <b>50 cent</b>', '€ 4,00 → € 5,00 is <b>€ 1</b>', 'Samen: <b>€ 1,55</b> terug'] } },
  { t: 'Probeer zelf', h: 'Tel op, zoals de verkoper.', w: 'probeer', o: { q: 'Je koopt iets van € 2,35 en betaalt met € 5. Hoeveel krijg je terug?', opts: ['€ 2,65', '€ 3,65', '€ 2,35'], ok: 0, uitleg: '€ 2,35 → € 2,40 (5 cent) → € 3,00 (60 cent) → € 5,00 (€ 2). Samen <b>€ 2,65</b>.', hint: 'Tel op tot € 2,40, dan tot € 3,00, dan tot € 5,00.' } },
  { t: 'Op de tablet', h: 'Bij geld typ je een komma tussen de euro\'s en de centen: <b>1,55</b>. Gebruik de komma-knop op het toetsenbord.' }
] });

registerTopic('rekenen', { id: 'meten', name: 'Meten', sub: 'lengte, gewicht, inhoud', ico: '📏', gen: genMeten, pace: { easy: 6, medium: 5, hard: 4 }, lesson: [
  { t: 'De meetladder', h: 'Elke tree op de ladder is <b>10 keer</b> zo klein. Ga je naar beneden? Doe dan <b>× 10</b> per stap. Naar boven: <b>: 10</b> per stap.', v: ladderHTML('lengte', 'm', 'cm') },
  { t: 'Lengte', h: '1 km = 1000 m<br>1 m = 100 cm<br>1 cm = 10 mm<br>Een grote stap is ongeveer 1 meter. Je pink is ongeveer 1 cm breed.' },
  { t: 'Gewicht', h: '1 kg = 1000 gram<br>1 ton = 1000 kg<br>Een pak suiker weegt 1 kg. Een appel ongeveer 150 gram.', v: ladderHTML('gewicht', 'kg', 'g') },
  { t: 'Inhoud', h: '1 liter = 10 dl = 100 cl = 1000 ml<br>1 dm³ = 1 liter en 1 cm³ = 1 ml<br>Een pak melk is 1 liter. Een glas is ongeveer 2 dl.', v: ladderHTML('inhoud', 'l', 'ml') },
  { t: 'Meten met de liniaal', h: 'Leg het begin precies bij de <b>0</b>. Lees af waar het eind komt. Tussen twee cijfers zitten 10 millimeters.', w: 'liniaal' },
  { t: 'Hoeken meten (voor groep 7)', h: 'Een hoek meet je in <b>graden</b> met een gradenboog. Een rechte hoek is <b>90°</b>, zoals de hoek van een boek.', w: 'gradenboog' },
  { t: 'Twee eenheden tegelijk', h: '2 m en 35 cm = ? cm<br>2 m = 200 cm. 200 + 35 = <b>235 cm</b>.' }
] });

registerTopic('rekenen', { id: 'opp', name: 'Omtrek & oppervlakte', sub: 'rand en hokjes', ico: '🔲', gen: genOpp, pace: { easy: 6, medium: 5, hard: 4 }, comma: false, lesson: [
  { t: 'Omtrek = de rand', h: 'De <b>omtrek</b> is de lengte van de rand eromheen. Stel je voor dat een mier één rondje loopt.<br>5 + 3 + 5 + 3 = <b>16 cm</b>.', v: gridShape(5, 3, { labels: true }) },
  { t: 'Oppervlakte = de hokjes', h: 'De <b>oppervlakte</b> is hoeveel ruimte de figuur inneemt: het aantal hokjes. Bij een rechthoek: <b>lengte × breedte</b>. Probeer het!', w: 'oppervlakte', o: { w: 5, h: 3 } },
  { t: 'Eenheden', h: 'Omtrek meet je in <b>cm</b> of <b>m</b>.<br>Oppervlakte meet je in <b>cm²</b> of <b>m²</b> (vierkante centimeter of meter). Een hokje van 1 cm bij 1 cm is 1 cm².' },
  { t: 'Lastige vormen', h: 'Een L-vorm? Maak er een grote rechthoek van en haal het lege stuk eraf.', w: 'stappen', o: { lines: ['Grote rechthoek: 6 × 5 = <b>30</b>', 'Het lege stuk: 2 × 2 = <b>4</b>', '30 − 4 = <b>26 cm²</b>'] }, v: gridShape(6, 5, { cut: [2, 2], labels: true }) },
  { t: 'Probeer zelf', h: 'Een gewone rechthoek.', w: 'probeer', o: { q: 'Een rechthoek is <b>6 cm</b> lang en <b>4 cm</b> breed. Wat is de oppervlakte?', opts: ['24 cm²', '20 cm²', '10 cm²'], ok: 0, uitleg: 'Oppervlakte = lengte × breedte = 6 × 4 = <b>24 cm²</b>. (20 cm is de omtrek.)', hint: 'Oppervlakte is keer, omtrek is optellen.' } }
] });

registerTopic('rekenen', { id: 'grafiek', name: 'Tabellen & grafieken', sub: 'aflezen en vergelijken', ico: '📊', gen: genGrafiek, pace: { easy: 5, medium: 4, hard: 3.5 }, comma: false, lesson: [
  { t: 'Een tabel lezen', h: 'Zoek de goede <b>rij</b> (van links naar rechts) en de goede <b>kolom</b> (van boven naar beneden). Waar ze elkaar kruisen, staat het antwoord.', v: tableHTML(['', 'ma', 'di', 'wo'], [['🍦 ijsjes', 12, 18, 9], ['🥤 drankjes', 20, 15, 22]]) },
  { t: 'Staafgrafiek', h: 'Bij een staafgrafiek volg je de bovenkant van de staaf naar links. Daar lees je het getal af.<br>Hoeveel kinderen kozen mango? <b>14</b>.', v: barChart(['appel', 'banaan', 'mango', 'aardbei'], [8, 10, 14, 6], { step: 2, max: 16 }) },
  { t: 'Lijngrafiek', h: 'Een lijngrafiek laat zien hoe iets verandert, zoals de temperatuur op een dag. Hoe hoger de stip, hoe warmer.', v: lineChart(['8:00', '10:00', '12:00', '14:00', '16:00'], [22, 25, 29, 31, 27], { min: 15, max: 35, step: 5 }) },
  { t: 'Tips', h: '<ul class="tips"><li>Lees eerst de <b>titel</b>: waar gaat het over?</li><li>Kijk wat de <b>getallen</b> aan de zijkant betekenen.</li><li>Staat een staaf tussen twee lijnen? Dan schat je het midden.</li></ul>' }
] });

registerTopic('rekenen', { id: 'klok', name: 'Klokkijken', sub: 'en rekenen met tijd', ico: '🕒', gen: genKlok, pace: { easy: 6, medium: 4, hard: 3 }, comma: false, lesson: [
  { t: 'De wijzers', h: 'De <b>korte</b> (rode) wijzer wijst het uur aan. De <b>lange</b> (blauwe) wijzer de minuten. Bij elk cijfer komen er 5 minuten bij.', w: 'klok', o: { h: 3, m: 30 } },
  { t: 'Half en kwart', h: '<b>Half vier</b> = 3:30. Het is half op weg naar vier!<br><b>Kwart over drie</b> = 3:15.<br><b>Kwart voor vier</b> = 3:45.', v: `<div class="clockrow">${clockSVG(3, 30, 'mini')}${clockSVG(3, 15, 'mini')}${clockSVG(3, 45, 'mini')}</div>` },
  { t: 'De 24-uursklok', h: 'Na 12 uur \'s middags tel je door: 1 uur \'s middags = <b>13:00</b>, 2 uur = 14:00 … 11 uur \'s avonds = 23:00. Middernacht is 00:00.<br>Truc: tel er 12 bij of haal er 12 af.' },
  { t: 'Rekenen met tijd', h: '1 uur = 60 minuten. Een kwartier = 15 minuten. Hoe lang is het van 9:45 tot 11:20? Maak er hele stappen van.', w: 'stappen', o: { lines: ['9:45 → 10:00 = <b>15 min</b>', '10:00 → 11:00 = <b>60 min</b>', '11:00 → 11:20 = <b>20 min</b>', '15 + 60 + 20 = <b>95 minuten</b>'] } },
  { t: 'Op de tablet', h: 'Typ een tijd met de dubbele punt-knop: <b>14:30</b>. Of typ gewoon 1430.' }
] });

registerTopic('rekenen', { id: 'verhaal', name: 'Verhaaltjessommen', sub: 'lezen en rekenen', ico: '📖', gen: genVerhaal, pace: { easy: 4, medium: 3, hard: 2.5 }, lesson: [
  { t: 'Het toverstappenplan', h: '<ol class="tips"><li><b>Lees</b> het verhaal rustig.</li><li>Wat wordt er <b>gevraagd</b>?</li><li>Welke <b>getallen</b> heb je nodig?</li><li>Welke <b>som</b> hoort erbij?</li><li><b>Reken</b> uit.</li><li><b>Klopt</b> het antwoord? Kan het echt?</li></ol>' },
  { t: 'Signaalwoorden', h: '<ul class="tips"><li><b>samen, erbij, in totaal</b> → plus +</li><li><b>over, weg, minder, verschil</b> → min −</li><li><b>keer, elk, per, rijen van</b> → keer ×</li><li><b>verdelen, eerlijk, hoeveel keer past</b> → delen :</li></ul>' },
  { t: 'Voorbeeld', h: 'Pip koopt 3 zakjes snoep van €2. Hij betaalt met €10. Hoeveel krijgt hij terug? Soms heb je <b>twee</b> sommen nodig.', w: 'stappen', o: { lines: ['Wat wordt er gevraagd? Het <b>wisselgeld</b>.', 'Som 1: 3 × €2 = <b>€6</b> (kosten)', 'Som 2: €10 − €6 = <b>€4</b>', 'Antwoord: Pip krijgt <b>€4</b> terug.'] } },
  { t: 'Let op met rest!', h: '23 kinderen, in een auto passen 4 kinderen. Hoeveel auto\'s?<br>23 : 4 = 5 rest 3. Die 3 kinderen moeten ook mee! Dus <b>6</b> auto\'s.' }
] });
