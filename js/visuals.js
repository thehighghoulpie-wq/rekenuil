'use strict';
/* =====================================================================
   Plaatjes (SVG) en interactieve lesonderdelen
   ===================================================================== */

/* ---------- klok ---------- */
function clockSVG(h, m, cls = '') {
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  let ticks = '', nums = '';
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, big = i % 5 === 0, r1 = big ? 83 : 88, r2 = 94;
    ticks += `<line x1="${(100 + r1 * Math.sin(a)).toFixed(1)}" y1="${(100 - r1 * Math.cos(a)).toFixed(1)}" x2="${(100 + r2 * Math.sin(a)).toFixed(1)}" y2="${(100 - r2 * Math.cos(a)).toFixed(1)}" class="tk${big ? ' big' : ''}"/>`;
  }
  for (let i = 1; i <= 12; i++) {
    const a = i * 30 * Math.PI / 180;
    nums += `<text x="${(100 + 68 * Math.sin(a)).toFixed(1)}" y="${(100 - 68 * Math.cos(a)).toFixed(1)}" class="cn">${i}</text>`;
  }
  return `<svg class="clock ${cls}" viewBox="0 0 200 200" role="img" aria-label="Klok"><circle cx="100" cy="100" r="96" class="cface"/>${ticks}${nums}` +
    `<line x1="100" y1="108" x2="100" y2="54" class="hh" transform="rotate(${ha.toFixed(1)} 100 100)"/>` +
    `<line x1="100" y1="112" x2="100" y2="22" class="mh" transform="rotate(${ma} 100 100)"/><circle cx="100" cy="100" r="7" class="cc"/></svg>`;
}
const digital = (h, m) => `<div class="digital">${pad2(h)}:${pad2(m)}</div>`;

/* ---------- breuken ---------- */
function fracBar(n, d, cls = '') {
  const w = 300, h = 54, cw = w / d;
  let s = `<svg class="fbar ${cls}" viewBox="0 0 ${w + 6} ${h + 6}" role="img" aria-label="${n} van de ${d} delen gekleurd">`;
  for (let i = 0; i < d; i++) s += `<rect x="${(3 + i * cw).toFixed(2)}" y="3" width="${cw.toFixed(2)}" height="${h}" class="${i < n ? 'fon' : 'foff'}"/>`;
  return s + '</svg>';
}
function fracPie(n, d) {
  const cx = 60, cy = 60, r = 55;
  let s = `<svg class="fpie" viewBox="0 0 120 120" role="img" aria-label="${n} van de ${d} stukken gekleurd">`;
  for (let i = 0; i < d; i++) {
    const a1 = (i / d) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    s += `<path d="M${cx} ${cy} L${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" class="${i < n ? 'fon' : 'foff'}"/>`;
  }
  return s + '</svg>';
}

/* ---------- getallenlijn ---------- */
// marks: [{v, label, cls}]
function numberLine(min, max, step, marks = [], opts = {}) {
  const W = 520, H = 92, x0 = 26, x1 = W - 26, X = v => x0 + (v - min) / (max - min) * (x1 - x0);
  let s = `<svg class="nline" viewBox="0 0 ${W} ${H}" role="img" aria-label="Getallenlijn van ${min} tot ${max}">`;
  s += `<line x1="${x0 - 12}" y1="50" x2="${x1 + 12}" y2="50" class="nl-axis"/>`;
  const labelEvery = opts.labelEvery || step;
  for (let v = min; v <= max + 1e-9; v += step) {
    const big = Math.abs((v - min) / labelEvery - Math.round((v - min) / labelEvery)) < 1e-9;
    s += `<line x1="${X(v)}" y1="${big ? 40 : 44}" x2="${X(v)}" y2="${big ? 60 : 56}" class="nl-tick"/>`;
    if (big && !opts.noLabels) s += `<text x="${X(v)}" y="80" class="nl-lab">${opts.fmt ? opts.fmt(v) : fmtBig(Math.round(v * 1000) / 1000)}</text>`;
  }
  for (const m of marks) {
    s += `<g class="nl-mark ${m.cls || ''}"><circle cx="${X(m.v)}" cy="50" r="8"/>${m.label != null ? `<text x="${X(m.v)}" y="26" class="nl-mlab">${m.label}</text>` : ''}</g>`;
  }
  if (opts.arc) { const [a, b] = opts.arc; s += `<path d="M${X(a)} 42 Q${(X(a) + X(b)) / 2} 4 ${X(b)} 42" class="nl-arc"/>`; }
  return s + '</svg>';
}

/* ---------- plaatswaarde (getallenkaart) ---------- */
const PV = [['M', 'miljoenen', 1e6], ['HD', 'honderd­duizendtallen', 1e5], ['TD', 'tien­duizendtallen', 1e4], ['D', 'duizendtallen', 1000], ['H', 'honderdtallen', 100], ['T', 'tientallen', 10], ['E', 'eenheden', 1]];
function placeChart(n, cols = 5, hi = null) {
  const use = PV.slice(PV.length - cols);
  return `<table class="pv"><tr>${use.map(c => `<th class="${hi === c[0] ? 'hi' : ''}" title="${c[1]}">${c[0]}</th>`).join('')}</tr>` +
    `<tr>${use.map(c => `<td class="${hi === c[0] ? 'hi' : ''}">${Math.floor(n / c[2]) % 10}</td>`).join('')}</tr></table>`;
}
// getal in woorden (tot 999.999.999)
const NW1 = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
const NW10 = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];
function nlWords(n) {
  if (n < 20) return NW1[n];
  if (n < 100) { const e = n % 10, t = NW10[Math.floor(n / 10)]; if (!e) return t; const u = NW1[e]; return u + (/e$/.test(u) ? 'ën' : 'en') + t; }
  if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h > 1 ? NW1[h] : '') + 'honderd' + (r ? nlWords(r) : ''); }
  if (n < 1e6) { const d = Math.floor(n / 1000), r = n % 1000; return (d > 1 ? nlWords(d) : '') + 'duizend' + (r ? ' ' + nlWords(r) : ''); }
  const m = Math.floor(n / 1e6), r = n % 1e6; return (m > 1 ? nlWords(m) : 'een') + ' miljoen' + (r ? ' ' + nlWords(r) : '');
}

/* ---------- cijferen (onder elkaar) ---------- */
function digitsOf(n, len) { return String(n).padStart(len, ' ').split(''); }
// geeft {html, steps} – steps zijn uitlegzinnen per kolom
function columnCalc(a, b, op, opts = {}) {
  const res = op === '+' ? a + b : a - b;
  const len = Math.max(String(a).length, String(b).length, String(res).length);
  const A = digitsOf(a, len), B = digitsOf(b, len), R = digitsOf(res, len);
  const carry = Array(len).fill(''), steps = [], names = ['eenheden', 'tientallen', 'honderdtallen', 'duizendtallen', 'tienduizendtallen'];
  const borrowed = Array(len).fill(false);
  let c = 0;
  for (let i = len - 1, k = 0; i >= 0; i--, k++) {
    const da = A[i] === ' ' ? 0 : +A[i], db = B[i] === ' ' ? 0 : +B[i];
    if (A[i] === ' ' && B[i] === ' ' && !c) continue;
    if (op === '+') {
      const s = da + db + c;
      steps.push(`<b>${cap(names[k])}:</b> ${da} + ${db}${c ? ' + ' + c + ' (onthouden)' : ''} = ${s}. ${s >= 10 ? `Schrijf <b>${s % 10}</b> op en onthoud <b>1</b>.` : `Schrijf <b>${s}</b> op.`}`);
      c = s >= 10 ? 1 : 0; if (c && i > 0) carry[i - 1] = '1';
    } else {
      let top = da - c;
      if (top < 0) {
        steps.push(`<b>${cap(names[k])}:</b> hier staat een 0 en er is al 1 geleend. Leen 10 van de ${names[k + 1]}: 10 − 1 − ${db} = <b>${9 - db}</b>.`);
        if (i > 0) { carry[i - 1] = '−1'; borrowed[i - 1] = true; }
        c = 1;
      } else if (top < db) {
        steps.push(`<b>${cap(names[k])}:</b> ${top} − ${db} kan niet. Leen 10 van de ${names[k + 1]}: ${top + 10} − ${db} = <b>${top + 10 - db}</b>.`);
        if (i > 0) { carry[i - 1] = '−1'; borrowed[i - 1] = true; }
        c = 1;
      } else {
        steps.push(`<b>${cap(names[k])}:</b> ${top} − ${db} = <b>${top - db}</b>.${c ? ' (Er was er al 1 geleend.)' : ''}`);
        c = 0;
      }
    }
  }
  const show = opts.result !== false, rv = opts.reveal;
  const vis = i => rv == null ? show : (len - 1 - i) < rv;
  const html = `<table class="colcalc">` +
    (opts.carry !== false ? `<tr class="carry">${carry.map((x, i) => `<td>${rv == null || (len - 2 - i) < rv ? x : ''}</td>`).join('')}<td></td></tr>` : '') +
    `<tr>${A.map(d => `<td>${d === ' ' ? '' : d}</td>`).join('')}<td></td></tr>` +
    `<tr class="opr">${B.map(d => `<td>${d === ' ' ? '' : d}</td>`).join('')}<td class="op">${op}</td></tr>` +
    `<tr class="res">${R.map((d, i) => `<td>${vis(i) ? (d === ' ' ? '' : d) : '<span class="qm">?</span>'}</td>`).join('')}<td></td></tr></table>`;
  return { html, steps, res };
}

/* ---------- oppervlakte & omtrek ---------- */
// rechthoek op een rooster; cut = [cw, ch] haalt rechtsboven een hoek weg (L-vorm)
function gridShape(w, h, opts = {}) {
  const cs = Math.min(34, Math.floor(300 / Math.max(w, h))), pad = 34;
  const W = w * cs + pad * 2, H = h * cs + pad * 2;
  const cut = opts.cut || null;
  let s = `<svg class="gshape" viewBox="0 0 ${W} ${H}" role="img" aria-label="Figuur op een rooster">`;
  if (opts.grid !== false) {
    for (let x = 0; x <= w; x++) s += `<line x1="${pad + x * cs}" y1="${pad}" x2="${pad + x * cs}" y2="${pad + h * cs}" class="g-line"/>`;
    for (let y = 0; y <= h; y++) s += `<line x1="${pad}" y1="${pad + y * cs}" x2="${pad + w * cs}" y2="${pad + y * cs}" class="g-line"/>`;
  }
  let pts;
  if (cut) {
    const [cw, ch] = cut;
    pts = [[0, 0], [w - cw, 0], [w - cw, ch], [w, ch], [w, h], [0, h]];
    if (opts.grid !== false) s += `<rect x="${pad + (w - cw) * cs}" y="${pad}" width="${cw * cs}" height="${ch * cs}" class="g-cut"/>`;
  } else pts = [[0, 0], [w, 0], [w, h], [0, h]];
  s += `<polygon points="${pts.map(([x, y]) => `${pad + x * cs},${pad + y * cs}`).join(' ')}" class="g-shape"/>`;
  if (opts.labels) {
    const u = opts.unit || 'cm';
    if (!cut) {
      s += `<text x="${pad + w * cs / 2}" y="${pad - 10}" class="g-lab">${w} ${u}</text>`;
      s += `<text x="${pad - 10}" y="${pad + h * cs / 2}" class="g-lab" text-anchor="end" dominant-baseline="middle">${h} ${u}</text>`;
    } else {
      const [cw, ch] = cut;
      s += `<text x="${pad + (w - cw) * cs / 2}" y="${pad - 10}" class="g-lab">${w - cw} ${u}</text>`;
      s += `<text x="${pad - 10}" y="${pad + h * cs / 2}" class="g-lab" text-anchor="end" dominant-baseline="middle">${h} ${u}</text>`;
      s += `<text x="${pad + w * cs / 2}" y="${pad + h * cs + 24}" class="g-lab">${w} ${u}</text>`;
      s += `<text x="${pad + w * cs + 8}" y="${pad + (ch + h) * cs / 2}" class="g-lab" text-anchor="start" dominant-baseline="middle">${h - ch} ${u}</text>`;
    }
  }
  return s + '</svg>';
}

/* ---------- grafieken & tabellen ---------- */
const BARCOL = ['#8B6CF0', '#FF8FB8', '#4FC8BA', '#FFB547', '#6DB8F7', '#7ED37E'];
function barChart(labels, values, opts = {}) {
  const max = opts.max || Math.ceil(Math.max(...values) / (opts.step || 5)) * (opts.step || 5);
  const step = opts.step || 5, W = 480, H = 260, L = 46, B = 40, T = 16, bw = (W - L - 16) / labels.length;
  const Y = v => H - B - v / max * (H - B - T);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Staafgrafiek">`;
  for (let v = 0; v <= max; v += step) s += `<line x1="${L}" y1="${Y(v)}" x2="${W - 10}" y2="${Y(v)}" class="ch-grid"/><text x="${L - 8}" y="${Y(v) + 5}" class="ch-y">${v}</text>`;
  labels.forEach((lab, i) => {
    const x = L + i * bw + bw * .18, w = bw * .64;
    s += `<rect x="${x}" y="${Y(values[i])}" width="${w}" height="${H - B - Y(values[i])}" rx="6" fill="${BARCOL[i % BARCOL.length]}"/>`;
    s += `<text x="${x + w / 2}" y="${H - B + 24}" class="ch-x">${lab}</text>`;
  });
  return s + `<line x1="${L}" y1="${H - B}" x2="${W - 10}" y2="${H - B}" class="ch-axis"/></svg>`;
}
function lineChart(labels, values, opts = {}) {
  const max = opts.max, min = opts.min || 0, step = opts.step || 5, W = 480, H = 250, L = 46, B = 40, T = 16;
  const X = i => L + 20 + i * (W - L - 40) / (labels.length - 1), Y = v => H - B - (v - min) / (max - min) * (H - B - T);
  let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Lijngrafiek">`;
  for (let v = min; v <= max; v += step) s += `<line x1="${L}" y1="${Y(v)}" x2="${W - 10}" y2="${Y(v)}" class="ch-grid"/><text x="${L - 8}" y="${Y(v) + 5}" class="ch-y">${v}</text>`;
  s += `<polyline points="${values.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" class="ch-line"/>`;
  values.forEach((v, i) => { s += `<circle cx="${X(i)}" cy="${Y(v)}" r="6" class="ch-dot"/><text x="${X(i)}" y="${H - B + 24}" class="ch-x">${labels[i]}</text>`; });
  return s + `<line x1="${L}" y1="${H - B}" x2="${W - 10}" y2="${H - B}" class="ch-axis"/></svg>`;
}
function tableHTML(head, rows) {
  return `<table class="dtable"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
}

/* ---------- geld ---------- */
const MONEY = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
function moneyItem(c) {
  if (c >= 500) { const col = { 500: '#9AA6B2', 1000: '#E4767A', 2000: '#6D9BE0', 5000: '#F2A65A' }[c]; return `<span class="note" style="--nc:${col}">€${c / 100}</span>`; }
  const gold = c >= 10 && c <= 50, bi = c >= 100;
  return `<span class="coin ${bi ? 'bi' : gold ? 'gold' : 'cop'} ${c < 10 ? 'sm' : ''}">${c >= 100 ? '€' + c / 100 : c + 'c'}</span>`;
}
const moneyHTML = list => `<div class="money">${list.map(moneyItem).join('')}</div>`;
function makeChange(c) { const out = []; for (const m of MONEY) while (c >= m) { out.push(m); c -= m; } return out; }

/* =====================================================================
   Interactieve lesonderdelen (widgets). Elke widget krijgt een element
   en opties, en vult het element zelf.
   ===================================================================== */
const btn = (txt, attrs = '') => `<button class="wbtn" ${attrs}>${txt}</button>`;

registerWidget('klok', (el, o = {}) => {
  let t = (o.h ?? 9) * 60 + (o.m ?? 0);
  const draw = () => {
    const h = Math.floor(norm(t) / 60), m = norm(t) % 60, w = timeWords(h, m);
    el.innerHTML = `<div class="w-klok"><div class="w-klok-face">${clockSVG(h, m)}</div><div class="w-klok-info">
      ${digital(h, m)}<div class="w-words">${w ? cap(w) + ' ' + daypart(h) : ''}</div>
      <div class="wrow">${btn('−1 uur', 'data-d="-60"')}${btn('−5 min', 'data-d="-5"')}${btn('+5 min', 'data-d="5"')}${btn('+1 uur', 'data-d="60"')}</div>
      <div class="w-small">Druk op de knoppen en kijk hoe de wijzers draaien!</div></div></div>`;
    $$('[data-d]', el).forEach(b => b.onclick = () => { t += +b.dataset.d; draw(); });
  };
  draw();
});

registerWidget('breuk', (el, o = {}) => {
  let d = o.d || 4, on = new Set();
  const draw = () => {
    const n = on.size, cw = 300 / d;
    let bar = `<svg class="fbar tap" viewBox="0 0 306 66">`;
    for (let i = 0; i < d; i++) bar += `<rect data-i="${i}" x="${(3 + i * cw).toFixed(2)}" y="3" width="${cw.toFixed(2)}" height="60" class="${on.has(i) ? 'fon' : 'foff'}"/>`;
    bar += '</svg>';
    const dec = [2, 4, 5, 10, 20, 25, 50, 100].includes(d) || (100 % d === 0) ? ` = ${fmt(n / d)}` : '';
    el.innerHTML = `<div class="w-breuk"><div class="wrow">${[2, 3, 4, 5, 6, 8, 10, 12].map(x => btn(`${x} stukken`, `data-dd="${x}" class="wbtn ${x === d ? 'on' : ''}"`)).join('')}</div>
      ${bar}<div class="w-big">${frac(n, d)}${dec}</div><div class="w-small">Tik op de stukken om ze te kleuren. ${n === d ? 'Alles gekleurd: dat is 1 hele!' : n * 2 === d ? 'Precies de helft!' : ''}</div></div>`;
    $$('[data-dd]', el).forEach(b => b.onclick = () => { d = +b.dataset.dd; on = new Set(); draw(); });
    $$('rect[data-i]', el).forEach(r => r.onclick = () => { const i = +r.dataset.i; on.has(i) ? on.delete(i) : on.add(i); draw(); });
  };
  draw();
});

registerWidget('afronden', (el, o = {}) => {
  let n = o.n || 3470, to = o.to || 100;
  const draw = () => {
    const lo = Math.floor(n / to) * to, hi = lo + to, r = Math.round(n / to) * to;
    el.innerHTML = `<div class="w-afr"><div class="wrow">${[10, 100, 1000].map(x => btn(`op ${fmtBig(x)}`, `data-to="${x}" class="wbtn ${x === to ? 'on' : ''}"`)).join('')}</div>
      ${numberLine(lo, hi, to / 10, [{ v: n, label: fmtBig(n), cls: 'q' }, { v: r, cls: 'ans' }], { labelEvery: to / 2 })}
      <div class="w-big">${fmtBig(n)} ≈ <b>${fmtBig(r)}</b></div>
      <div class="w-small">${fmtBig(n)} ligt tussen ${fmtBig(lo)} en ${fmtBig(hi)}. Het ligt het dichtst bij <b>${fmtBig(r)}</b>${n - lo === to / 2 ? ' (precies in het midden: dan rond je naar boven af)' : ''}.</div>
      <input type="range" min="${o.min || 1000}" max="${o.max || 9999}" value="${n}" class="w-range" aria-label="Kies een getal"></div>`;
    $$('[data-to]', el).forEach(b => b.onclick = () => { to = +b.dataset.to; draw(); });
    $('.w-range', el).oninput = e => { n = +e.target.value; draw(); };
  };
  draw();
});

registerWidget('plaats', (el, o = {}) => {
  let n = o.n || 4352; const cols = o.cols || 5;
  const draw = () => {
    const use = PV.slice(PV.length - cols);
    el.innerHTML = `<div class="w-plaats"><table class="pv big"><tr>${use.map(c => `<th>${c[0]}</th>`).join('')}</tr>
      <tr>${use.map(c => `<td><button class="pvb" data-p="${c[2]}" data-s="1" aria-label="meer ${c[1]}">▲</button><div class="pvd">${Math.floor(n / c[2]) % 10}</div><button class="pvb" data-p="${c[2]}" data-s="-1" aria-label="minder ${c[1]}">▼</button></td>`).join('')}</tr>
      <tr class="pvn">${use.map(c => `<td>${c[1]}</td>`).join('')}</tr></table>
      <div class="w-big">${fmtBig(n)}</div><div class="w-words">${nlWords(n)}</div>
      <div class="w-small">${use.filter(c => Math.floor(n / c[2]) % 10).map(c => fmtBig(Math.floor(n / c[2]) % 10 * c[2])).join(' + ') || '0'}</div></div>`;
    $$('.pvb', el).forEach(b => b.onclick = () => {
      const p = +b.dataset.p, dgt = Math.floor(n / p) % 10, nd = (dgt + +b.dataset.s + 10) % 10;
      n += (nd - dgt) * p; draw();
    });
  };
  draw();
});

registerWidget('cijferen', (el, o = {}) => {
  let op = o.op || '+', a, b, step;
  const fresh = () => {
    if (op === '+') { a = rnd(1200, 5999); b = rnd(1200, 3999); } else { a = rnd(4000, 9500); b = rnd(1200, a - 900); }
    step = 0;
  };
  const draw = () => {
    const c = columnCalc(a, b, op, { result: step >= 99 });
    const visSteps = c.steps.slice(0, step);
    el.innerHTML = `<div class="w-cijf"><div class="wrow">${btn('Plus', `data-op="+" class="wbtn ${op === '+' ? 'on' : ''}"`)}${btn('Min', `data-op="-" class="wbtn ${op === '-' ? 'on' : ''}"`)}${btn('🎲 Nieuwe som', 'data-new')}</div>
      <div class="w-cijf-body">${columnCalc(a, b, op === '-' ? '−' : '+', { reveal: step >= c.steps.length ? 99 : step }).html}
      <ol class="w-steps">${visSteps.map(s => `<li>${s}</li>`).join('')}</ol></div>
      ${step < c.steps.length ? btn('Volgende stap ➜', 'data-next class="wbtn primary"') : `<div class="w-big">Antwoord: <b>${fmt(c.res)}</b> 🎉</div>`}
      <div class="w-small">Begin altijd rechts, bij de eenheden!</div></div>`;
    $$('[data-op]', el).forEach(x => x.onclick = () => { op = x.dataset.op === '-' ? '-' : '+'; fresh(); draw(); });
    $('[data-new]', el).onclick = () => { fresh(); draw(); };
    const nx = $('[data-next]', el); if (nx) nx.onclick = () => { step++; draw(); };
  };
  fresh(); draw();
});

registerWidget('oppervlakte', (el, o = {}) => {
  let w = o.w || 5, h = o.h || 3;
  const draw = () => {
    el.innerHTML = `<div class="w-opp">${gridShape(w, h, { labels: true })}
      <div class="wrow">${btn('lengte −', 'data-k="w" data-s="-1"')}${btn('lengte +', 'data-k="w" data-s="1"')}${btn('breedte −', 'data-k="h" data-s="-1"')}${btn('breedte +', 'data-k="h" data-s="1"')}</div>
      <div class="w-two"><div class="pill omtrek">Omtrek = ${w} + ${h} + ${w} + ${h} = <b>${2 * (w + h)} cm</b></div>
      <div class="pill opp">Oppervlakte = ${w} × ${h} = <b>${w * h} cm²</b></div></div>
      <div class="w-small">De omtrek is de rand eromheen. De oppervlakte is het aantal hokjes erin.</div></div>`;
    $$('[data-k]', el).forEach(b => b.onclick = () => {
      if (b.dataset.k === 'w') w = Math.max(1, Math.min(9, w + +b.dataset.s)); else h = Math.max(1, Math.min(7, h + +b.dataset.s));
      draw();
    });
  };
  draw();
});

registerWidget('geld', (el, o = {}) => {
  let target = o.target || rnd(3, 19) * 50 + kies([0, 20, 70]), purse = [];
  const draw = () => {
    const tot = purse.reduce((a, b) => a + b, 0);
    el.innerHTML = `<div class="w-geld"><div class="w-big">Betaal precies <b>${euro(target)}</b></div>
      <div class="money pick">${[2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1].map(c => `<button class="mbtn" data-c="${c}" aria-label="${euro(c)}">${moneyItem(c)}</button>`).join('')}</div>
      <div class="purse">${purse.length ? moneyHTML(purse) : '<span class="w-small">Tik op munten en briefjes…</span>'}</div>
      <div class="w-big">${euro(tot)} ${tot === target ? '✅ Precies goed!' : tot > target ? '— te veel!' : ''}</div>
      <div class="wrow">${btn('↩︎ Terug', 'data-undo')}${btn('🎲 Nieuw bedrag', 'data-new')}</div></div>`;
    $$('[data-c]', el).forEach(b => b.onclick = () => { purse.push(+b.dataset.c); draw(); });
    $('[data-undo]', el).onclick = () => { purse.pop(); draw(); };
    $('[data-new]', el).onclick = () => { target = rnd(3, 39) * 50 + kies([0, 20, 70, 5]); purse = []; draw(); };
  };
  draw();
});

registerWidget('tafel', (el, o = {}) => {
  let n = o.n || 7;
  const draw = () => {
    el.innerHTML = `<div class="w-tafel"><div class="wrow">${Array.from({ length: 10 }, (_, i) => btn(i + 1, `data-n="${i + 1}" class="wbtn sq ${i + 1 === n ? 'on' : ''}"`)).join('')}</div>
      <div class="tafelgrid">${Array.from({ length: 10 }, (_, i) => `<div class="tg" style="--d:${i * 60}ms"><span>${i + 1} × ${n}</span><b>${(i + 1) * n}</b></div>`).join('')}</div>
      <div class="w-small">Tip: 5 × ${n} is de helft van 10 × ${n}. En 9 × ${n} = 10 × ${n} − ${n}.</div></div>`;
    $$('[data-n]', el).forEach(b => b.onclick = () => { n = +b.dataset.n; draw(); });
  };
  draw();
});

// flitskaarten: o.cards = [[voorkant, achterkant, emoji]]
registerWidget('kaarten', (el, o = {}) => {
  const cards = o.cards || [];
  el.innerHTML = `<div class="w-cards">${cards.map(([f, b, e]) => `<button class="fcard"><span class="fc-in"><span class="fc-f">${e ? `<span class="fc-e">${e}</span>` : ''}${f}</span><span class="fc-b">${b}</span></span></button>`).join('')}</div>
    <div class="w-small">Tik op een kaart om hem om te draaien.</div>`;
  $$('.fcard', el).forEach(c => c.onclick = () => c.classList.toggle('flip'));
  // oefenstapel: één kaart tegelijk; "nog een keer" gaat achteraan de stapel
  if (cards.length < 3) return;
  el.insertAdjacentHTML('beforeend', `<div class="wrow">${btn('🃏 Oefen met de stapel', 'data-stack class="wbtn primary"')}</div>`);
  $('[data-stack]', el).onclick = () => {
    let pile = shuffle(cards.slice()), done = 0;
    const draw = () => {
      if (!pile.length) { el.innerHTML = `<div class="w-big">🎉 Alle ${cards.length} kaarten gekend!</div><div class="wrow">${btn('↺ Nog een keer', 'data-again class="wbtn"')}</div>`; if (typeof SND !== 'undefined') SND.fanfare(); $('[data-again]', el).onclick = () => WIDGETS.kaarten(el, o); return; }
      const [f, b, e] = pile[0];
      el.innerHTML = `<div class="w-stack"><div class="w-small">Nog ${pile.length} · gekend ${done}</div><button class="fcard big"><span class="fc-in"><span class="fc-f">${e ? `<span class="fc-e">${e}</span>` : ''}${f}</span><span class="fc-b">${b}</span></span></button>
        <div class="wrow">${btn('↺ Nog een keer', 'data-no class="wbtn"')}${btn('✓ Ik wist het', 'data-yes class="wbtn primary"')}</div><div class="w-small">Tik op de kaart om hem om te draaien.</div></div>`;
      $('.fcard', el).onclick = e2 => e2.currentTarget.classList.toggle('flip');
      $('[data-yes]', el).onclick = () => { pile.shift(); done++; if (typeof okTone === 'function') okTone(Math.min(done, 8)); draw(); };
      $('[data-no]', el).onclick = () => { pile.push(pile.shift()); draw(); };
      if (typeof move === 'function') move($('.fcard', el), 'inUp');
    };
    draw();
  };
});

// honderdveld: 100 hokjes = 1 hele. Tik op hokjes of op een hele rij.
registerWidget('honderdveld', (el, o = {}) => {
  let on = new Set();
  const draw = () => {
    const n = on.size;
    let cells = ''; for (let i = 0; i < 100; i++) cells += `<span class="hv ${on.has(i) ? 'on' : ''}" data-i="${i}"></span>`;
    el.innerHTML = `<div class="w-hv"><div class="hv-grid">${cells}</div>
      <div class="w-big">${n} van de 100 = <b>${fmt(n / 100)}</b> = ${frac(n, 100)} = <b>${n}%</b></div>
      <div class="wrow">${btn('+ 1 rij (0,1)', 'data-row')}${btn('↩︎ Leeg', 'data-clear')}</div>
      <div class="w-small">1 hokje = 0,01 (een honderdste). Een hele rij = 0,1 (een tiende). Procent betekent: van de honderd.</div></div>`;
    $$('.hv', el).forEach(c => c.onclick = () => { const i = +c.dataset.i; on.has(i) ? on.delete(i) : on.add(i); draw(); });
    $('[data-row]', el).onclick = () => { for (let i = 0; i < 100 && on.size < 100; i++) if (!on.has(i)) { const r = Math.floor(i / 10) * 10; for (let k = r; k < r + 10; k++) on.add(k); break; } draw(); };
    $('[data-clear]', el).onclick = () => { on = new Set(); draw(); };
  };
  draw();
});

// liniaal: hoe lang is het potlood? (in cm en mm)
registerWidget('liniaal', (el, o = {}) => {
  let mm = o.mm || 73;
  const draw = () => {
    const W = 300, px = W / 120;   // 12 cm liniaal
    let ticks = ''; for (let i = 0; i <= 120; i++) { const h = i % 10 === 0 ? 16 : i % 5 === 0 ? 11 : 7; ticks += `<line x1="${10 + i * px}" y1="62" x2="${10 + i * px}" y2="${62 - h}" stroke="#2B2140" stroke-width="${i % 10 ? .6 : 1.2}"/>`; if (i % 10 === 0) ticks += `<text x="${10 + i * px}" y="78" font-size="9" text-anchor="middle" fill="#2B2140">${i / 10}</text>`; }
    const len = mm * px;
    el.innerHTML = `<div class="w-lin"><svg viewBox="0 0 320 84" class="lin-svg"><rect x="10" y="18" width="${len - 10}" height="12" rx="3" fill="#FFD36E"/><path d="M${10 + len - 10} 18 L${10 + len} 24 L${10 + len - 10} 30Z" fill="#E9BF5C"/><rect x="10" y="18" width="10" height="12" fill="#FF8FB8"/>
      <rect x="4" y="36" width="312" height="44" rx="5" fill="#FFF8E1" stroke="#E0C97A"/>${ticks}</svg>
      <div class="w-big">${Math.floor(mm / 10)} cm en ${mm % 10} mm = <b>${mm} mm</b> = <b>${fmt(mm / 10)} cm</b></div>
      <input type="range" min="15" max="118" value="${mm}" class="w-range" aria-label="Lengte van het potlood">
      <div class="w-small">Het potlood begint bij de 0. Tussen twee cijfers zitten 10 streepjes: dat zijn millimeters.</div></div>`;
    $('.w-range', el).oninput = e => { mm = +e.target.value; draw(); };
  };
  draw();
});

// gradenboog: hoe groot is de hoek? (voorbereiding op groep 7)
registerWidget('gradenboog', (el, o = {}) => {
  let a = o.a || 50;
  const draw = () => {
    const r = 110, cx = 150, cy = 140, rad = a * Math.PI / 180, x = cx + r * Math.cos(rad), y = cy - r * Math.sin(rad);
    let ticks = ''; for (let d = 0; d <= 180; d += 10) { const q = d * Math.PI / 180, l = d % 30 ? 8 : 14; ticks += `<line x1="${cx + r * Math.cos(q)}" y1="${cy - r * Math.sin(q)}" x2="${cx + (r - l) * Math.cos(q)}" y2="${cy - (r - l) * Math.sin(q)}" stroke="#5B47C9" stroke-width="1.2"/>`; if (d % 30 === 0) ticks += `<text x="${cx + (r - 26) * Math.cos(q)}" y="${cy - (r - 26) * Math.sin(q) + 4}" font-size="10" text-anchor="middle" fill="#5B47C9">${d}</text>`; }
    const kind = a === 90 ? 'een rechte hoek' : a < 90 ? 'een scherpe hoek' : a === 180 ? 'een gestrekte hoek' : 'een stompe hoek';
    el.innerHTML = `<div class="w-grd"><svg viewBox="0 0 300 160" class="grd-svg"><path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}Z" fill="#EFE9FF" stroke="#B18CF0"/>${ticks}
      <path d="M${cx + 30} ${cy} A30 30 0 0 0 ${cx + 30 * Math.cos(rad)} ${cy - 30 * Math.sin(rad)}" fill="none" stroke="#FF8A5C" stroke-width="4"/>
      <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#2B2140" stroke-width="3"/><line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#E8402A" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="4" fill="#2B2140"/></svg>
      <div class="w-big"><b>${a}°</b>: ${kind}</div>
      <input type="range" min="5" max="180" step="5" value="${a}" class="w-range" aria-label="Grootte van de hoek">
      <div class="w-small">Recht = precies 90°. Scherp = kleiner dan 90°. Stomp = tussen 90° en 180°.</div></div>`;
    $('.w-range', el).oninput = e => { a = +e.target.value; draw(); };
  };
  draw();
});

/* ---------- stappen: een uitgewerkt voorbeeld, regel voor regel ----------
   o.lines = [html, ...]. Eerst staat alleen de eerste regel er; de knop laat de volgende zien. */
registerWidget('stappen', (el, o = {}) => {
  const lines = o.lines || []; let n = 1, fresh = false;
  const draw = () => {
    el.innerHTML = `<div class="w-stappen"><ol class="ws-list">${lines.slice(0, n).map((l, i) => `<li class="${i === n - 1 && fresh ? 'ws-new' : ''}">${l}</li>`).join('')}</ol>
      <div class="wrow">${n < lines.length ? btn('Volgende stap ➜', 'data-next class="wbtn primary"') : btn('↺ Nog een keer', 'data-again class="wbtn"')}</div></div>`;
    const nw = $('.ws-new', el); if (nw && typeof move === 'function') move(nw, 'inUp');
    const nx = $('[data-next]', el); if (nx) nx.onclick = () => { n++; fresh = true; if (typeof SND !== 'undefined') SND.click(); draw(); };
    const ag = $('[data-again]', el); if (ag) ag.onclick = () => { n = 1; fresh = false; draw(); };
  };
  draw();
});

/* ---------- probeer zelf: één kleine vraag zonder druk ----------
   Geen sterren, geen fouten die tellen. Een fout antwoord grijst alleen die knop uit. */
registerWidget('probeer', (el, o = {}) => {
  const opts = (o.opts || []).map((x, i) => ({ x, ok: i === (o.ok || 0) }));
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
  let done = false, tries = 0;
  el.innerHTML = `<div class="w-probeer"><div class="wp-tag">✋ Probeer zelf</div><div class="wp-q">${o.q || ''}</div>
    <div class="wp-opts">${opts.map((p, i) => `<button class="wbtn wp-o" data-i="${i}">${p.x}</button>`).join('')}</div>
    <div class="wp-msg" aria-live="polite"></div></div>`;
  const msg = $('.wp-msg', el);
  $$('.wp-o', el).forEach(b => b.onclick = () => {
    if (done) return;
    const p = opts[+b.dataset.i];
    if (p.ok) {
      done = true; b.classList.add('good'); if (typeof SND !== 'undefined') SND.ok();
      msg.innerHTML = `🎉 <b>Goed gedaan!</b>${o.uitleg ? '<br>' + o.uitleg : ''}`;
      if (typeof move === 'function') { move(b, 'jelly'); move(msg, 'inUp'); }
    } else {
      tries++; b.classList.add('miss'); b.disabled = true; if (typeof SND !== 'undefined') SND.click();
      msg.innerHTML = tries > 1 && o.hint ? `Bijna! 💡 ${o.hint}` : 'Bijna! Kijk nog eens naar het voorbeeld en probeer opnieuw.';
      if (typeof move === 'function') move(b, 'nope');
    }
  });
});
