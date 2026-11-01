'use strict';
/* =====================================================================
   Geheime Tuin: elk onderwerp is een plant van Curaçao.
   Hoe beter het onderwerp gaat, hoe verder de plant groeit:
   0 zaadje · 1 jong plantje · 2 knoppen · 3 in bloei (of met vruchten).
   Feiten zijn nagekeken (zie toverschool-update4-onderzoek.md).
   pap = naam op Curaçao; ok = Papiamentu nagekeken (anders: familie vragen, en dan tonen we hem nog niet).
   ===================================================================== */
const CUR_PLANTS = [
  { id: 'kibrahacha', nl: 'Kibrahacha', pap: 'Kibrahacha', ok: true,
    fact: 'Kibrahacha betekent "bijlbreker": het hout is zo hard dat een bijl kan breken! De boom bloeit pas als het flink regent na een lange droge tijd. Dan staat hij een paar dagen helemaal geel, en daarna ligt er een geel tapijt van bloemen.' },
  { id: 'dividivi', nl: 'Dividiviboom', pap: 'Dividivi', ok: true,
    fact: 'De nationale boom van Curaçao! De wind waait er bijna altijd van oost naar west. Daarom groeit de dividivi scheef, met zijn kruin naar het westen. Zo kun je met een boom de weg vinden.' },
  { id: 'kadushi', nl: 'Zuilcactus', pap: 'Kadushi', ok: false,
    fact: 'Een hoge cactus met veel stammen vol stekels. Zijn bloemen gaan \'s nachts open, en vleermuizen komen de nectar drinken. Van de kadushi maken mensen op Curaçao soep.' },
  { id: 'kabes', nl: 'Meloencactus', pap: 'Kabes di Indjan', ok: true,
    fact: 'Een ronde cactus. Pas als hij oud genoeg is, groeit er een rood mutsje bovenop. Uit dat mutsje komen roze bloempjes en kleine roze vruchtjes.' },
  { id: 'sentebibu', nl: 'Aloë', pap: 'Sentebibu', ok: true,
    fact: 'De aloë kan goed tegen droogte en wind. In de dikke bladeren zit gel die helpt als je verbrand bent door de zon. Op Curaçao is zelfs een aloëboerderij met meer dan honderdduizend planten.' },
  { id: 'flamboyan', nl: 'Flamboyant', pap: 'Flamboyan', ok: true,
    fact: 'In de zomer staat de flamboyant vol vuurrode bloemen. Zijn kruin is breed als een paraplu, dus eronder heb je lekker schaduw.' },
  { id: 'kalabas', nl: 'Kalebasboom', pap: 'Kalabas', ok: true,
    fact: 'De bloemen en vruchten groeien gewoon aan de stam! De ronde vrucht heeft een keiharde schil en heeft wel zeven maanden nodig om rijp te worden. Van de schalen maken mensen kommen en rammelaars.' },
  { id: 'shimaruku', nl: 'Acerola', pap: 'Shimaruku', ok: false,
    fact: 'Een struik met kleine rode kersjes. Ze zitten bomvol vitamine C, veel meer dan een sinaasappel. Er wordt lekker sap van gemaakt.' },
  { id: 'mango', nl: 'Mangoboom', pap: 'Mango', ok: false,
    fact: 'Eerst krijgt de mangoboom pluimen met heel veel kleine bloempjes. Daarna groeien de mango\'s, die aan lange steeltjes hangen. Een mangoboom kan heel groot en heel oud worden.' }
];
const STAGE_OF = { nieuw: 0, oefenen: 1, goed: 2, super: 3 };

/* ---------- tekenen (viewBox 0 0 100 110, grond onderaan) ---------- */
const GD = {
  soil: '<ellipse cx="50" cy="101" rx="36" ry="7" fill="#9C6A3E"/><ellipse cx="50" cy="99" rx="31" ry="5" fill="#C48B57"/>',
  stem: (x1, y1, x2, y2, w, c = '#8A5A35') => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`,
  dot: (x, y, r, c, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${extra}/>`,
  leaf: (x, y, ang, len, c) => `<ellipse cx="${x}" cy="${y - len / 2}" rx="${len / 3.2}" ry="${len / 2}" fill="${c}" transform="rotate(${ang} ${x} ${y})"/>`
};
const gsprout = c => GD.stem(50, 98, 50, 84, 2.5, '#5E9E3C') + GD.leaf(50, 86, -55, 13, c) + GD.leaf(50, 86, 55, 13, c);
const gdots = (pts, r, c) => pts.map(([x, y]) => GD.dot(x, y, r, c)).join('');

const PLANT_DRAW = {
  kibrahacha(s) {
    if (s === 0) return gsprout('#6DB34F');
    if (s === 1) return GD.stem(50, 98, 50, 66, 5) + GD.dot(50, 58, 16, '#5DAA4B') + GD.dot(40, 62, 10, '#4F9A42') + GD.dot(60, 62, 10, '#4F9A42');
    let o = GD.stem(50, 98, 50, 56, 6) + GD.stem(50, 66, 32, 46, 3.5) + GD.stem(50, 62, 70, 44, 3.5) + GD.stem(50, 56, 50, 34, 3) + GD.stem(41, 56, 28, 56, 2.5) + GD.stem(60, 54, 74, 56, 2.5);
    const tips = [[32, 46], [70, 44], [50, 34], [28, 56], [74, 56], [40, 40], [61, 38]];
    if (s === 2) return o + gdots(tips, 2.6, '#FFD21F');
    return o + tips.map(([x, y]) => GD.dot(x, y, 8, '#FFD21F') + GD.dot(x + 3, y - 2, 4.5, '#FFE873')).join('') + gdots([[30, 97], [38, 100], [62, 99], [70, 97], [56, 102]], 2.2, '#FFD21F');
  },
  dividivi(s) {
    if (s === 0) return gsprout('#3E8E3E');
    const k = s === 1 ? .6 : 1;
    let o = `<path d="M54 98 Q${54 - 2 * k} ${98 - 26 * k} ${54 - 22 * k} ${98 - 48 * k}" stroke="#7A4E2D" stroke-width="${4 + 2 * k}" fill="none" stroke-linecap="round"/>`
      + `<ellipse cx="${50 - 22 * k}" cy="${98 - 52 * k}" rx="${30 * k}" ry="${9 * k}" fill="#2F7D3A"/><ellipse cx="${46 - 22 * k}" cy="${98 - 58 * k}" rx="${20 * k}" ry="${6 * k}" fill="#3E9547"/>`;
    if (s === 2) o += gdots([[20, 44], [32, 41], [44, 45], [26, 49]], 1.8, '#FFF1A8');
    if (s === 3) o += gdots([[16, 46], [28, 42], [40, 45], [24, 50], [34, 49]], 2, '#FFF1A8')
      + [[22, 54], [36, 55], [46, 51]].map(([x, y]) => `<path d="M${x} ${y} q5 4 0 8 q-4 -3 0 -5" stroke="#8A5A35" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('');
    return o;
  },
  kadushi(s) {
    const col = (x, top, w) => `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${98 - top}" rx="${w / 2}" fill="#5C9E57"/><path d="M${x - w / 5} ${top + 4} V97 M${x + w / 5} ${top + 4} V97" stroke="#3F7F3D" stroke-width="1.4"/>`;
    if (s === 0) return col(50, 86, 10);
    if (s === 1) return col(50, 56, 13);
    let o = col(34, 64, 11) + col(66, 58, 11) + col(50, 38, 14);
    if (s === 3) o += [[50, 38], [66, 58], [34, 64]].map(([x, y]) => GD.dot(x, y - 3, 5, '#FFF8E1') + GD.dot(x, y - 3, 1.8, '#C5E1A5')).join('') + gdots([[56, 48], [40, 70], [72, 70]], 3.4, '#C2185B');
    return o;
  },
  kabes(s) {
    const r = [7, 12, 18, 19][s], cy = 98 - r;
    let o = `<ellipse cx="50" cy="${cy}" rx="${r}" ry="${r * .95}" fill="#5FA05A"/>`;
    for (let i = -2; i <= 2; i++) o += `<path d="M${50 + i * r / 3} ${cy - r * .9} Q${50 + i * r / 2.2} ${cy} ${50 + i * r / 3} ${cy + r * .9}" stroke="#3F7F3D" stroke-width="1.3" fill="none"/>`;
    if (s >= 2) o += `<rect x="${50 - r * .5}" y="${cy - r - (s === 3 ? 12 : 4)}" width="${r}" height="${s === 3 ? 16 : 7}" rx="5" fill="#B5442F"/>`;
    if (s === 3) o += gdots([[44, cy - r - 12], [52, cy - r - 13], [58, cy - r - 10]], 2.6, '#F06292') + gdots([[47, cy - r - 4], [55, cy - r - 5]], 2.2, '#F8BBD0');
    return o;
  },
  sentebibu(s) {
    const n = [3, 5, 7, 7][s], len = [12, 22, 32, 32][s];
    let o = '';
    for (let i = 0; i < n; i++) { const a = -70 + i * (140 / (n - 1)); o += GD.leaf(50, 98, a, len, i % 2 ? '#7FB77E' : '#6AA86C'); }
    if (s >= 2) o += GD.stem(50, 92, 50, s === 3 ? 28 : 50, 2.2, '#8DA05A');
    if (s === 2) o += gdots([[50, 50], [49, 55], [51, 59]], 2.2, '#9CCC65');
    if (s === 3) o += [28, 33, 38, 43, 48].map((y, i) => `<ellipse cx="${50 + (i % 2 ? 3 : -3)}" cy="${y}" rx="2" ry="4" fill="#F9A825" transform="rotate(${i % 2 ? 25 : -25} ${50 + (i % 2 ? 3 : -3)} ${y})"/>`).join('');
    return o;
  },
  flamboyan(s) {
    if (s === 0) return gsprout('#7CC35A');
    if (s === 1) return GD.stem(50, 98, 50, 66, 4) + `<ellipse cx="50" cy="62" rx="22" ry="8" fill="#7CC35A"/>`;
    let o = GD.stem(50, 98, 50, 56, 6) + GD.stem(50, 64, 30, 50, 3.5) + GD.stem(50, 64, 70, 50, 3.5) + `<ellipse cx="50" cy="46" rx="40" ry="12" fill="#7CC35A"/><ellipse cx="50" cy="42" rx="30" ry="8" fill="#8ED06A"/>`;
    const red = [[18, 47], [28, 42], [40, 39], [52, 38], [64, 40], [76, 44], [84, 48], [34, 49], [58, 48], [46, 45], [70, 49], [24, 51]];
    return o + (s === 2 ? gdots(red.slice(0, 4), 3, '#E8402A') : red.map(([x, y], i) => GD.dot(x, y, 5.5, i % 2 ? '#E8402A' : '#FF6A3D')).join(''));
  },
  kalabas(s) {
    if (s === 0) return gsprout('#3E9B45');
    const big = s >= 2, top = big ? 52 : 66;
    let o = GD.stem(50, 98, 50, top, big ? 7 : 4.5) + GD.dot(50, top - (big ? 12 : 8), big ? 24 : 15, '#3E9B45') + GD.dot(38, top - 6, big ? 12 : 8, '#348A3C');
    if (s === 2) o += [[45, 76], [55, 68], [45, 62]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="4.6" fill="#E9E6B0" stroke="#7B4B8E" stroke-width="1"/>`).join('');
    if (s === 3) o += [[42, 78, 7], [58, 70, 8], [42, 60, 6], [64, 46, 6]].map(([x, y, r]) => GD.dot(x, y, r, '#7CB342') + GD.dot(x - r / 3, y - r / 3, r / 3, '#AED581')).join('');
    return o;
  },
  shimaruku(s) {
    if (s === 0) return gsprout('#5BAA4A');
    const k = s === 1 ? .7 : 1, cy = 98 - 32 * k;
    let o = GD.stem(50, 98, 44, cy + 6, 2.5) + GD.stem(50, 98, 56, cy + 6, 2.5) + GD.stem(50, 98, 50, cy, 2.5)
      + gdots([[50, cy - 4], [38, cy + 2], [62, cy + 2], [44, cy + 10], [56, cy + 10]], 11 * k, '#5BAA4A') + gdots([[46, cy - 6], [58, cy]], 6 * k, '#6FBF5A');
    if (s === 2) o += gdots([[40, cy - 2], [56, cy - 8], [62, cy + 8], [46, cy + 12]], 2.8, '#F48FB1');
    if (s === 3) o += gdots([[40, cy - 2], [54, cy - 9], [63, cy + 6], [46, cy + 12], [34, cy + 9], [58, cy + 14]], 3.6, '#E53935') + gdots([[39, cy - 3], [53, cy - 10]], 1.2, '#FFCDD2');
    return o;
  },
  mango(s) {
    if (s === 0) return gsprout('#2E7D32');
    const k = s === 1 ? .65 : 1, cy = 98 - 52 * k;
    let o = GD.stem(50, 98, 50, cy + 10 * k, 6 * k + 1) + gdots([[50, cy], [34, cy + 8 * k], [66, cy + 8 * k], [42, cy - 10 * k], [58, cy - 10 * k]], 15 * k, '#2E7D32') + gdots([[44, cy - 6 * k], [60, cy + 2 * k]], 8 * k, '#388E3C');
    if (s === 2) o += [[36, 30], [50, 24], [64, 30]].map(([x, y]) => `<path d="M${x - 4} ${y + 8} L${x} ${y} L${x + 4} ${y + 8} Z" fill="#F3D27A"/>`).join('');
    if (s === 3) o += [[34, 64], [50, 68], [64, 62]].map(([x, y]) => GD.stem(x, y - 8, x, y - 4, 1.2, '#5D4037') + `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="6" fill="#FFA726"/><ellipse cx="${x + 1.5}" cy="${y + 1}" rx="3" ry="4" fill="#EF5350" opacity=".7"/>`).join('');
    return o;
  }
};
function curPlantSVG(id, stage, cls = '') {
  return `<svg class="cplant ${cls}" viewBox="6 16 88 92" aria-hidden="true">${GD.soil}<g class="sway">${PLANT_DRAW[id](stage)}</g></svg>`;
}

/* elk onderwerp krijgt vast dezelfde plant; per vak wisselt het af */
function plantFor(subjIndex, topicIndex) { return CUR_PLANTS[(topicIndex + subjIndex * 3) % CUR_PLANTS.length]; }

function openGarden() {
  const el = $('#garden');
  if (current !== 'garden') { D.counters.garden++; save(); }
  el.innerHTML = backbar(t('pl_tuin')) + `<div class="wrap"><div class="card center garden-intro">${pipSVG('lach')}<p>${t('gardenTitle')}</p>
      <div class="gstages">${[0, 1, 2, 3].map(s => `<span>${curPlantSVG('flamboyan', s, 'mini')}<small>${t('gStage' + s)}</small></span>`).join('')}</div></div>
    ${SUBJECTS.map((s, si) => `<div class="bed" style="--sc:${s.color};--sl:${s.light}"><h3>${s.ico} ${t('subj_' + s.id)}</h3><div class="plots">${s.topics.map((tp, ti) => {
      const st = STAGE_OF[topicStatus(tp.key)] ?? 0, p = plantFor(si, ti);
      return `<button class="plot gplot st-${st}" data-k="${tp.key}" data-si="${si}" data-ti="${ti}">${curPlantSVG(p.id, st)}<small>${tTopic(tp)}</small></button>`;
    }).join('')}</div></div>`).join('')}</div>`;
  bindCommon(el);
  $$('.gplot', el).forEach(b => b.onclick = () => plantCard(b.dataset.k, +b.dataset.si, +b.dataset.ti));
  if (typeof stagger === 'function') stagger($$('.gplot', el), 'pop', 35, 120, 20);
  show('garden');
}
function plantCard(key, si, ti) {
  const p = plantFor(si, ti), st = STAGE_OF[topicStatus(key)] ?? 0;
  SND.pop();
  modal(`<div class="pcard">${curPlantSVG(p.id, st, 'big')}
      <h2>${p.nl}</h2>${p.ok && p.pap !== p.nl ? `<p class="pap-name">${t('gOnCur')} <b class="pap">${p.pap}</b></p>` : ''}
      <div class="gstages">${[0, 1, 2, 3].map(s => `<span class="${s === st ? 'now' : s < st ? 'done' : ''}">${curPlantSVG(p.id, s, 'mini')}<small>${t('gStage' + s)}</small></span>`).join('')}</div>
      <p class="pfact">🌿 ${p.fact}</p>
      <p class="muted"><b>${tTopic(TOPIC[key])}</b>: ${t(st === 3 ? 'gFull' : 'gNext')}</p></div>`,
    [{ label: t('nowPractise'), cls: 'primary', fn: () => openSetup(key) }, { label: t('close'), cls: 'ghost' }]);
  const big = $('.pcard .cplant.big'); if (big && typeof move === 'function') move(big, 'pop');
}
