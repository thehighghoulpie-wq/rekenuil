'use strict';
/* =====================================================================
   Toverschool 2.0, stap E: Mijn Eiland
   Een eigen eiland bouwen en spelen. Niets verdort, niets verloopt.
   - Bouwen / Spelen met één knop; tik een voorwerp in de lade, tik een plek
   - voorwerpen weten waar ze horen (land, water, lucht) en vallen netjes in het vak
   - Willemstad-huisjes verven; een verdieping erbij per 100 goede antwoorden
   - plekken ontgrendelen door lessen af te maken; cadeautjes van Pip de postbode (nooit verlopen)
   - tikken in Spelen: lampje aan, fontein spuit, geit springt, plantje groeit met je lessen
   - dag, avond en nacht; ongedaan maken; prullenbak
   ===================================================================== */

const EI_COLS = 8, EI_ROWS = 6;
const EI_HUIS = ['#F2B8C6', '#FFD36E', '#7FD3E8', '#9AD9A0', '#F29A6E', '#B6A5F0', '#F7F2E4', '#E5778A'];
const EI_FLOOR = [['gras', '#8ED081'], ['zand', '#F3DFA2'], ['pad', '#C9B8A2']];
const zoneOfRow = y => y === 0 ? 'lucht' : y <= 3 ? 'land' : 'water';
const EI_ITEMS = [
  { id: 'huis', cat: 'land', zone: 'land', name: 'Huisje', svg: true, act: 'pop' },
  { id: 'palm', cat: 'land', zone: 'land', name: 'Palmboom', e: '🌴', act: 'dance' },
  { id: 'bloem', cat: 'land', zone: 'land', name: 'Groeiplantje', grow: ['🌱', '🌿', '🌺'], act: 'pop' },
  { id: 'bank', cat: 'land', zone: 'land', name: 'Bankje', e: '🪑', act: 'pop' },
  { id: 'lamp', cat: 'land', zone: 'land', name: 'Lampje', states: ['🪔', '💡'], act: 'pop' },
  { id: 'fontein', cat: 'land', zone: 'land', name: 'Fontein', states: ['⛲', '⛲'], act: 'jelly', splash: true },
  { id: 'geit', cat: 'land', zone: 'land', name: 'Geit', e: '🐐', act: 'hop' },
  { id: 'leguaan', cat: 'land', zone: 'land', name: 'Leguaan', e: '🦎', act: 'hop' },
  { id: 'flamingo', cat: 'land', zone: 'land', name: 'Flamingo', e: '🦩', act: 'dance' },
  { id: 'kadushi', cat: 'land', zone: 'land', name: 'Kadushi', e: '🌵', act: 'pop' },
  { id: 'parasol', cat: 'land', zone: 'land', name: 'Parasol', e: '⛱️', act: 'jelly' },
  { id: 'brievenbus', cat: 'land', zone: 'land', name: 'Brievenbus', e: '📮', act: 'mail' },
  { id: 'boot', cat: 'water', zone: 'water', name: 'Zeilboot', e: '⛵', act: 'dance' },
  { id: 'vis', cat: 'water', zone: 'water', name: 'Visje', e: '🐟', act: 'hop' },
  { id: 'schildpad', cat: 'water', zone: 'water', name: 'Schildpad', e: '🐢', act: 'dance' },
  { id: 'kano', cat: 'water', zone: 'water', name: 'Kano', e: '🛶', act: 'dance' },
  { id: 'wolk', cat: 'lucht', zone: 'lucht', name: 'Wolkje', e: '☁️', act: 'jelly' },
  { id: 'vlieger', cat: 'lucht', zone: 'lucht', name: 'Vlieger', e: '🪁', act: 'dance' },
  { id: 'ballon', cat: 'lucht', zone: 'lucht', name: 'Ballon', e: '🎈', act: 'hop' },
  { id: 'vogel', cat: 'lucht', zone: 'lucht', name: 'Vogeltje', e: '🐦', act: 'hop' },
  { id: 'ik', cat: 'vrienden', zone: 'land', name: 'Ik', me: true, act: 'hop' },
  { id: 'pip', cat: 'vrienden', zone: 'land', name: 'Pip', pip: true, act: 'dance' },
  { id: 'huisdier', cat: 'vrienden', zone: 'land', name: 'Mijn huisdier', pet: true, act: 'hop' },
  // werelden: eigen voorwerpen per eiland (ws = in welke werelden het te vinden is)
  { id: 'den', cat: 'land', zone: 'land', name: 'Dennenboom', e: '🌲', act: 'dance', ws: ['bos'] }, { id: 'eik', cat: 'land', zone: 'land', name: 'Eikenboom', e: '🌳', act: 'dance', ws: ['bos'] },
  { id: 'paddo', cat: 'land', zone: 'land', name: 'Paddenstoel', e: '🍄', act: 'pop', ws: ['bos'] }, { id: 'vosje', cat: 'land', zone: 'land', name: 'Vosje', e: '🦊', act: 'hop', ws: ['bos'] },
  { id: 'hert', cat: 'land', zone: 'land', name: 'Hert', e: '🦌', act: 'dance', ws: ['bos'] }, { id: 'eekhoorn', cat: 'land', zone: 'land', name: 'Eekhoorn', e: '🐿️', act: 'hop', ws: ['bos'] },
  { id: 'tent', cat: 'land', zone: 'land', name: 'Tent', e: '⛺', act: 'pop', ws: ['bos'] }, { id: 'stam', cat: 'land', zone: 'land', name: 'Boomstam', e: '🪵', act: 'pop', ws: ['bos'] },
  { id: 'uil', cat: 'lucht', zone: 'lucht', name: 'Uil', e: '🦉', act: 'hop', ws: ['bos'] }, { id: 'vlinder', cat: 'lucht', zone: 'lucht', name: 'Vlinder', e: '🦋', act: 'dance', ws: ['bos', 'strand'] },
  { id: 'kikker', cat: 'water', zone: 'water', name: 'Kikker', e: '🐸', act: 'hop', ws: ['bos'] },
  { id: 'fiets', cat: 'land', zone: 'land', name: 'Fiets', e: '🚲', act: 'dance', ws: ['stad'] }, { id: 'bus', cat: 'land', zone: 'land', name: 'Bus', e: '🚌', act: 'jelly', ws: ['stad'] },
  { id: 'stoplicht', cat: 'land', zone: 'land', name: 'Stoplicht', states: ['🚦', '🚦'], act: 'pop', ws: ['stad'] }, { id: 'museum', cat: 'land', zone: 'land', name: 'Museum', e: '🏛️', act: 'pop', ws: ['stad'] },
  { id: 'winkel', cat: 'land', zone: 'land', name: 'Winkel', e: '🏪', act: 'pop', ws: ['stad'] }, { id: 'toren', cat: 'land', zone: 'land', name: 'Toren', e: '🗼', act: 'pop', ws: ['stad'] },
  { id: 'brugje', cat: 'water', zone: 'water', name: 'Brug', e: '🌉', act: 'jelly', ws: ['stad'] }, { id: 'veerboot', cat: 'water', zone: 'water', name: 'Veerboot', e: '⛴️', act: 'dance', ws: ['stad'] },
  { id: 'koraal', cat: 'land', zone: 'land', name: 'Koraal', e: '🪸', act: 'dance', ws: ['rif'] }, { id: 'schelp', cat: 'land', zone: 'land', name: 'Schelp', e: '🐚', act: 'pop', ws: ['rif', 'strand'] },
  { id: 'krab', cat: 'land', zone: 'land', name: 'Krab', e: '🦀', act: 'hop', ws: ['rif', 'strand'] }, { id: 'octopus', cat: 'water', zone: 'water', name: 'Octopus', e: '🐙', act: 'dance', ws: ['rif'] },
  { id: 'dolfijn', cat: 'water', zone: 'water', name: 'Dolfijn', e: '🐬', act: 'hop', ws: ['rif'] }, { id: 'tropvis', cat: 'water', zone: 'water', name: 'Tropenvis', e: '🐠', act: 'dance', ws: ['rif'] },
  { id: 'haai', cat: 'water', zone: 'water', name: 'Vriendelijke haai', e: '🦈', act: 'dance', ws: ['rif'] }, { id: 'bubbel', cat: 'lucht', zone: 'lucht', name: 'Bubbels', e: '🫧', act: 'jelly', ws: ['rif'] },
  { id: 'raket', cat: 'land', zone: 'land', name: 'Raket', e: '🚀', act: 'hop', ws: ['ruimte'] }, { id: 'astronaut', cat: 'land', zone: 'land', name: 'Astronaut', e: '🧑‍🚀', act: 'hop', ws: ['ruimte'] },
  { id: 'robot', cat: 'land', zone: 'land', name: 'Robot', e: '🤖', act: 'dance', ws: ['ruimte'] }, { id: 'krater', cat: 'land', zone: 'land', name: 'Krater', e: '🕳️', act: 'pop', ws: ['ruimte'] },
  { id: 'ufo', cat: 'lucht', zone: 'lucht', name: 'Ufo', e: '🛸', act: 'dance', ws: ['ruimte'] }, { id: 'planeet', cat: 'lucht', zone: 'lucht', name: 'Planeet', e: '🪐', act: 'jelly', ws: ['ruimte'] },
  { id: 'ster', cat: 'lucht', zone: 'lucht', name: 'Ster', e: '⭐', act: 'pop', ws: ['ruimte'] }, { id: 'komeet', cat: 'lucht', zone: 'lucht', name: 'Komeet', e: '☄️', act: 'dance', ws: ['ruimte'] },
  { id: 'satelliet', cat: 'lucht', zone: 'lucht', name: 'Satelliet', e: '🛰️', act: 'dance', ws: ['ruimte'] }, { id: 'melkweg', cat: 'water', zone: 'water', name: 'Melkweg', e: '🌌', act: 'jelly', ws: ['ruimte'] },
  // tover-regels: tik erop en er gebeurt iets op het hele eiland
  { id: 'lichtknop', cat: 'regels', zone: 'land', name: 'Lichtknop', e: '🔘', act: 'pop', rule: 'licht' }, { id: 'feestknop', cat: 'regels', zone: 'land', name: 'Feestknop', e: '🥁', act: 'pop', rule: 'feest' },
  { id: 'regenknop', cat: 'regels', zone: 'lucht', name: 'Regenwolk', e: '🌦️', act: 'jelly', rule: 'regen' },
  // cadeautjes van Pip de postbode
  { id: 'draak', cat: 'cadeaus', zone: 'land', name: 'Drakentje', e: '🐉', act: 'dance', gift: true },
  { id: 'regenboog', cat: 'cadeaus', zone: 'lucht', name: 'Regenboog', e: '🌈', act: 'jelly', gift: true },
  { id: 'kasteel', cat: 'cadeaus', zone: 'land', name: 'Kasteel', e: '🏰', act: 'pop', gift: true },
  { id: 'draaimolen', cat: 'cadeaus', zone: 'land', name: 'Draaimolen', e: '🎠', act: 'jelly', gift: true },
  { id: 'eenhoorn', cat: 'cadeaus', zone: 'land', name: 'Eenhoorn', e: '🦄', act: 'dance', gift: true },
  { id: 'vuurwerk', cat: 'cadeaus', zone: 'lucht', name: 'Vuurwerk', e: '🎆', act: 'pop', gift: true }
];
const EI_BY = Object.fromEntries(EI_ITEMS.map(i => [i.id, i]));
const EI_GIFTS = EI_ITEMS.filter(i => i.gift).map(i => i.id);
const EI_CATS = [['land', '🏝️'], ['water', '🌊'], ['lucht', '☁️'], ['vrienden', '🧒'], ['regels', '⚙️'], ['cadeaus', '🎁']];
// werelden: elk eiland heeft een eigen uiterlijk en eigen voorwerpen; ze gaan open door lessen af te maken (nooit voor geld)
const EI_WORLDS = [['strand', '🏝️', ['Strand', 'Playa', 'Beach'], 0], ['bos', '🌲', ['Bos', 'Mondi', 'Forest'], 4], ['stad', '🏙️', ['Stad', 'Stat', 'City'], 8], ['rif', '🐠', ['Koraalrif', 'Rif di koral', 'Reef'], 12], ['ruimte', '🚀', ['Ruimte', 'Espasio', 'Space'], 16]];
const EI_ALLW = EI_WORLDS.map(w => w[0]);
const EI_WS = { palm: ['strand', 'stad'], kadushi: ['strand'], flamingo: ['strand'], parasol: ['strand', 'stad'], geit: ['strand', 'bos'], leguaan: ['strand', 'bos'], huis: ['strand', 'bos', 'stad'], bloem: ['strand', 'bos', 'stad'], bank: ['strand', 'bos', 'stad'], lamp: ['strand', 'bos', 'stad', 'ruimte'], fontein: ['strand', 'stad'], boot: ['strand', 'stad'], vis: ['strand', 'bos', 'rif'], schildpad: ['strand', 'rif'], kano: ['strand', 'bos'], wolk: ['strand', 'bos', 'stad'], vlieger: ['strand', 'stad'], ballon: ['strand', 'stad'], vogel: ['strand', 'bos', 'stad'] };
EI_ITEMS.forEach(i => { if (!i.ws) i.ws = EI_WS[i.id] || EI_ALLW; });
const eiWorldOpen = id => eiLessons() >= ((EI_WORLDS.find(w => w[0] === id) || [0, 0, 0, 0])[3]);
function eiSwitchWorld(id) {
  const I = D.island; eiRestore(); I.worlds = I.worlds || {};
  I.worlds[I.world || 'strand'] = { cells: I.cells, floor: I.floor };
  const w = I.worlds[id] = I.worlds[id] || { cells: {}, floor: {} };
  I.cells = w.cells; I.floor = w.floor; I.world = id; EI.undo = []; EI.sel = null; EI.tool = null; EI.tab = 'land';
  save(); renderIsland();
}
// tover-regels: "als dit, dan dat"
function eiRule(r) {
  const board = $('.ei-board'); if (!board) return; const els = $$('.ei-it', board);
  if (r === 'licht') {
    const lamps = Object.values(D.island.cells).filter(c => c.id === 'lamp');
    if (!lamps.length) { toast(tri(['Zet eerst een lampje neer.', 'Pon un lampi promé.', 'Place a lamp first.']), 2200); return; }
    const on = lamps.some(c => !c.st); lamps.forEach(c => { c.st = on ? 1 : 0; }); save(); renderIsland(); tone(on ? [660, 880] : [880, 660], .1, 'triangle', .05); return;
  }
  if (r === 'feest') {
    els.forEach((el, i) => setTimeout(() => { const it = EI_BY[el.dataset.id]; if (it && !it.rule && el.isConnected) { move(el, it.act === 'mail' ? 'pop' : (it.act || 'hop')); sparkleBurst(el, 4, ['🎉', '✨']); } }, i * 90));
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone([f], .14, 'triangle', .05), i * 120)); return;
  }
  if (r === 'regen') {
    const grow = ['bloem', 'den', 'eik', 'palm', 'koraal', 'paddo', 'kadushi'];
    els.forEach((el, i) => setTimeout(() => { if (el.isConnected && grow.includes(el.dataset.id)) { sparkleBurst(el, 6, ['💧', '✨']); move(el, 'pop'); } }, i * 120));
    [392, 330, 262].forEach((f, i) => setTimeout(() => tone([f], .16, 'sine', .05), i * 160));
  }
}
const EI_TOD = [['dag', '☀️'], ['avond', '🌇'], ['nacht', '🌙']];

const eiLessons = () => Object.keys(D.lessons || {}).length;
const eiCols = () => Math.min(EI_COLS, 3 + Math.floor(eiLessons() / 2));
const eiFloors = () => 1 + Math.min(3, Math.floor((D.counters.correct || 0) / 100));
const eiEarned = () => Math.floor((D.counters.quizzes || 0) / 3);
const eiGrow = () => { const n = eiLessons(); return n >= 6 ? 2 : n >= 2 ? 1 : 0; };
const eiOwns = id => !EI_BY[id].gift || (D.island.owned || []).includes(id);

// een opgetild voorwerp gaat terug naar zijn plek als je iets anders doet
function eiRestore() { if (EI._lift && D.island) { D.island.cells[EI._liftK] = EI._lift; EI.undo.pop(); } EI._lift = null; }
let EI = { mode: 'bouw', sel: null, tool: null, colour: 0, tab: 'land', undo: [], lastTod: null };

/* ---------- tekeningen ---------- */
function eiHouse(col, n) {
  const H = 22 * n, top = 96 - H, c = EI_HUIS[col] || EI_HUIS[0];
  let w = '';
  for (let f = 0; f < n; f++) { const y = 96 - 22 * (f + 1); w += `<rect x="9" y="${y + 6}" width="9" height="11" rx="2" fill="#7FB6D6"/><rect x="25" y="${y + 6}" width="10" height="11" rx="2" fill="#7FB6D6"/><rect x="42" y="${y + 6}" width="9" height="11" rx="2" fill="#7FB6D6"/>`; }
  return `<svg viewBox="0 0 60 100" class="ei-house" aria-hidden="true"><rect x="4" y="${top}" width="52" height="${H}" fill="${c}"/>${w}<rect x="24" y="80" width="12" height="16" rx="3" fill="#8C5A3C"/><path d="M2 ${top} L12 ${top - 8} L20 ${top - 8} L30 ${top - 18} L40 ${top - 8} L48 ${top - 8} L58 ${top} Z" fill="#C8553D"/><rect x="2" y="95" width="56" height="4" rx="2" fill="#6E5A48"/></svg>`;
}
function eiArt(it, cell) {
  if (it.svg) return eiHouse(cell.c || 0, eiFloors());
  if (it.me) return `<span class="ei-av">${avatarSVG(look(), 'blij', 'mini')}</span>`;
  if (it.pip) return `<span class="ei-av">${pipSVG('blij')}</span>`;
  if (it.pet) { const pt = look().pet; return pt && pt !== 'geen' ? `<span class="ei-av">${petSVG(pt, 'ei-pet')}</span>` : '<span class="ei-e">🐾</span>'; }
  if (it.grow) return `<span class="ei-e">${it.grow[eiGrow()]}</span>`;
  if (it.states) return `<span class="ei-e ${(cell.st || 0) === 1 ? 'on' : ''}">${it.states[(cell.st || 0) % it.states.length]}</span>`;
  return `<span class="ei-e">${it.e}</span>`;
}

/* ---------- opslaan en ongedaan maken ---------- */
const eiSnap = () => JSON.stringify({ cells: D.island.cells, floor: D.island.floor });
function eiPush() { EI.undo.push(eiSnap()); if (EI.undo.length > 20) EI.undo.shift(); }
function eiUndo() {
  const s = EI.undo.pop(); if (!s) { toast(tri(['Niets om ongedaan te maken', 'Nada pa dekumbertí', 'Nothing to undo'])); return; }
  const o = JSON.parse(s); D.island.cells = o.cells; D.island.floor = o.floor; save(); SND.click(); renderIsland();
}

/* ---------- scherm ---------- */
function openIsland() {
  if (!$('#island')) { const s = document.createElement('section'); s.className = 'screen'; s.id = 'island'; $('main').appendChild(s); }
  D.island = D.island || { cells: {}, floor: {}, tod: 'dag', owned: [], got: 0 }; eiRestore(); EI.undo = []; EI.sel = null; EI.tool = null;
  renderIsland(); show('island');
}
function renderIsland() {
  const el = $('#island'), I = D.island, cols = eiCols(), earned = eiEarned(), pending = earned - (I.got || 0);
  let grid = '';
  for (let y = 0; y < EI_ROWS; y++) for (let x = 0; x < EI_COLS; x++) {
    const k = x + ',' + y, cell = I.cells[k] && EI_BY[I.cells[k].id] ? I.cells[k] : null, z = zoneOfRow(y), locked = x >= cols, fl = I.floor[k];
    const ok = EI.sel && !locked && !cell && EI_BY[EI.sel].zone === z;
    grid += `<button class="eic z-${z} ${locked ? 'locked' : ''} ${ok ? 'ok' : ''} ${fl != null && z === 'land' ? 'fl-' + EI_FLOOR[fl][0] : ''}" data-x="${x}" data-y="${y}" aria-label="${locked ? tri(['Nog dicht', 'Ainda sera', 'Still closed']) : z}">${locked ? '🔒' : cell ? `<span class="ei-it" data-id="${cell.id}">${eiArt(EI_BY[cell.id], cell)}</span>` : ''}</button>`;
  }
  const items = EI_ITEMS.filter(i => i.cat === EI.tab && (!i.gift || eiOwns(i.id)) && i.ws.includes(I.world || 'strand'));
  el.innerHTML = backbar('🏝️ ' + t('pl_eiland')) + `<div class="wrap island-wrap">
    <div class="chips ei-worlds">${EI_WORLDS.map(([id, e, nm]) => `<button class="chip ${(I.world || 'strand') === id ? 'on' : ''} ${eiWorldOpen(id) ? '' : 'locked'}" data-world="${id}">${eiWorldOpen(id) ? e : '🔒'} ${tri(nm)}</button>`).join('')}</div>
    <div class="ei-bar"><div class="chips"><button class="chip ${EI.mode === 'bouw' ? 'on' : ''}" data-mode="bouw">🪄 ${tri(['Bouwen', 'Traha', 'Build'])}</button><button class="chip ${EI.mode === 'speel' ? 'on' : ''}" data-mode="speel">▶️ ${tri(['Spelen', 'Hunga', 'Play'])}</button></div>
      <div class="chips"><button class="chip" data-undo aria-label="undo">↶</button>${EI_TOD.map(([id, e]) => `<button class="chip ${I.tod === id ? 'on' : ''}" data-tod="${id}" aria-label="${id}">${e}</button>`).join('')}</div></div>
    <div class="ei-board tod-${I.tod} ${EI.mode} w-${I.world || 'strand'}">${grid}${I.tod === 'nacht' ? '<i class="ei-stars"></i>' : ''}</div>
    ${cols < EI_COLS ? `<p class="muted center">🔒 ${tri(['Maak lessen af om meer eiland open te maken.', 'Kaba lès pa habri mas isla.', 'Finish lessons to open more island.'])}</p>` : ''}
    ${pending > 0 ? `<button class="btn primary wide" id="eigift">🎁 ${tri(['Pip de postbode heeft een cadeautje voor je!', 'Pip e kartero tin un regalo pa bo!', 'Pip the postman has a gift for you!'])}</button>` : ''}
    ${EI.mode === 'bouw' ? `<div class="ei-drawer card">
      <div class="chips ei-cats">${EI_CATS.map(([c, e]) => `<button class="chip ${EI.tab === c ? 'on' : ''}" data-tab="${c}">${e}</button>`).join('')}<span class="ei-sp"></span>
        <button class="chip ${EI.tool === 'verf' ? 'on' : ''}" data-tool="verf" aria-label="paint">🎨</button><button class="chip ${EI.tool === 'bin' ? 'on' : ''}" data-tool="bin" aria-label="bin">🗑️</button></div>
      ${EI.tool === 'verf' ? `<div class="ei-paint"><div class="swatches">${EI_HUIS.map((c, i) => `<button class="sw ${EI.colour === 'h' + i ? 'on' : ''}" data-col="h${i}" style="--c:${c}" aria-label="huis ${i + 1}"></button>`).join('')}</div>
        <div class="swatches">${EI_FLOOR.map(([n, c], i) => `<button class="sw ${EI.colour === 'f' + i ? 'on' : ''}" data-col="f${i}" style="--c:${c}" aria-label="${n}"></button>`).join('')}</div><p class="muted">${tri(['Tik een kleur en dan een huisje of een stukje land.', 'Primi un koló i despues un kas òf tera.', 'Tap a colour, then a house or some land.'])}</p></div>`
      : EI.tool === 'bin' ? `<p class="muted">${tri(['Tik op iets dat weg mag. Je kunt het altijd terugzetten met ↶.', 'Primi riba loke por bai. Bo por pon e bèk ku ↶.', 'Tap something to remove it. You can always bring it back with ↶.'])}</p>`
      : `<div class="ei-items">${items.map(i => `<button class="ei-itm ${EI.sel === i.id ? 'on' : ''}" data-sel="${i.id}"><span class="eic-prev">${eiArt(i, { c: EI.colour && String(EI.colour)[0] === 'h' ? +String(EI.colour).slice(1) : 0 })}</span><small>${i.name}</small></button>`).join('') || `<p class="muted">${tri(['Nog niets hier. Maak quizzen af voor cadeautjes!', 'Ainda nada. Kaba kuis pa regalo!', 'Nothing here yet. Finish quizzes for gifts!'])}</p>`}</div>`}
    </div>` : `<p class="muted center">${tri(['Tik op dingen op je eiland!', 'Primi riba kosnan riba bo isla!', 'Tap things on your island!'])}</p>`}</div>`;
  bindCommon(el); eiBind(el);
}
function eiBind(el) {
  $$('[data-world]', el).forEach(b => b.onclick = () => { const id = b.dataset.world, need = (EI_WORLDS.find(w => w[0] === id) || [0, 0, 0, 0])[3]; if (!eiWorldOpen(id)) { shake(b); toast(tri([`Maak nog ${need - eiLessons()} lessen af om dit eiland te openen.`, `Kaba ainda ${need - eiLessons()} lès pa habri e isla aki.`, `Finish ${need - eiLessons()} more lessons to open this island.`]), 3000); return; } if (id !== (D.island.world || 'strand')) { SND.pop(); eiSwitchWorld(id); } });
  $$('[data-mode]', el).forEach(b => b.onclick = () => { eiRestore(); EI.mode = b.dataset.mode; EI.sel = null; EI.tool = null; SND.click(); renderIsland(); });
  $$('[data-tab]', el).forEach(b => b.onclick = () => { eiRestore(); EI.tab = b.dataset.tab; EI.tool = null; SND.click(); renderIsland(); });
  $$('[data-tool]', el).forEach(b => b.onclick = () => { eiRestore(); EI.tool = EI.tool === b.dataset.tool ? null : b.dataset.tool; EI.sel = null; if (EI.tool === 'verf' && !EI.colour) EI.colour = 'h0'; SND.click(); renderIsland(); });
  $$('[data-col]', el).forEach(b => b.onclick = () => { EI.colour = b.dataset.col; SND.click(); renderIsland(); });
  $$('[data-sel]', el).forEach(b => b.onclick = () => { eiRestore(); EI.sel = EI.sel === b.dataset.sel ? null : b.dataset.sel; SND.click(); renderIsland(); });
  $$('[data-tod]', el).forEach(b => b.onclick = () => { D.island.tod = b.dataset.tod; save(); SND.click(); renderIsland(); });
  const u = $('[data-undo]', el); if (u) u.onclick = eiUndo;
  const g = $('#eigift', el); if (g) g.onclick = eiGift;
  $$('.eic', el).forEach(c => c.onclick = () => eiCell(c));
}
function eiGift() {
  const I = D.island, id = EI_GIFTS.find(x => !(I.owned || []).includes(x)) || EI_GIFTS[(I.got || 0) % EI_GIFTS.length];
  I.owned = I.owned || []; if (!I.owned.includes(id)) I.owned.push(id); I.got = (I.got || 0) + 1; save();
  SND.fanfare(); confetti(70);
  modal(`<div class="m-ico">${castImg('nova', 'mcast')}</div><h2>🎁 ${EI_BY[id].name}!</h2><p>${tri(['Pip de postbode bracht een cadeautje voor je eiland. Je vindt het in de lade onder 🎁.', 'Pip e kartero a trese un regalo pa bo isla. Bo ta haña esaki den e laman bou 🎁.', 'Pip the postman brought a gift for your island. Find it in the drawer under 🎁.'])}</p>`, [{ label: t('ok'), cls: 'primary', fn: () => { EI.tab = 'cadeaus'; EI.mode = 'bouw'; renderIsland(); } }]);
}
function eiCell(c) {
  const x = +c.dataset.x, y = +c.dataset.y, k = x + ',' + y, I = D.island, cell = I.cells[k], z = zoneOfRow(y);
  if (x >= eiCols()) { shake(c); toast(tri(['Hier kun je later bouwen. Maak eerst lessen af!', 'Aki bo por traha despues. Kaba lès promé!', 'You can build here later. Finish lessons first!']), 2600); return; }
  if (EI.mode === 'speel') { if (cell) eiPlay(c, cell, k); return; }
  if (EI.tool === 'bin') { if (cell) { eiPush(); delete I.cells[k]; save(); SND.pop(); renderIsland(); } return; }
  if (EI.tool === 'verf') {
    const col = String(EI.colour || 'h0'), n = +col.slice(1);
    if (col[0] === 'h' && cell && cell.id === 'huis') { eiPush(); cell.c = n; save(); SND.pop(); renderIsland(); }
    else if (col[0] === 'f' && z === 'land' && !cell) { eiPush(); I.floor[k] = n; save(); SND.pop(); renderIsland(); }
    else if (col[0] === 'f' && z === 'land' && cell) { eiPush(); I.floor[k] = n; save(); SND.pop(); renderIsland(); }
    else shake(c);
    return;
  }
  if (cell && !EI.sel) { EI.sel = cell.id; eiPush(); delete I.cells[k]; EI._lift = cell; EI._liftK = k; SND.pop(); renderIsland(); return; }   // optillen om te verplaatsen
  if (EI.sel && !cell) {
    const it = EI_BY[EI.sel];
    if (it.zone !== z) { shake(c); toast(tri([`${it.name} hoort in ${it.zone === 'water' ? 'het water' : it.zone === 'lucht' ? 'de lucht' : 'het land'}.`, `${it.name} ta pertenesé ${it.zone === 'water' ? 'den awa' : it.zone === 'lucht' ? 'den aire' : 'riba tera'}.`, `${it.name} belongs in the ${it.zone === 'water' ? 'water' : it.zone === 'lucht' ? 'sky' : 'land'}.`]), 2400); return; }
    if (!EI._lift) eiPush();
    I.cells[k] = { id: it.id, st: 0, c: (EI._lift && EI._lift.c) || (String(EI.colour)[0] === 'h' ? +String(EI.colour).slice(1) : 0) };
    EI._lift = null; save(); SND.pop(); if (EI._lastEl) EI._lastEl = null; EI.sel = null; renderIsland();
    const n = $(`.eic[data-x="${x}"][data-y="${y}"] .ei-it`); if (n) move(n, 'pop');
  }
}
function eiPlay(c, cell, k) {
  const it = EI_BY[cell.id], n = $('.ei-it', c); SND.pop();
  if (it.act === 'mail') { if (typeof openBrievenbus === 'function') openBrievenbus(); return; }
  if (it.rule) { if (n) move(n, 'pop'); return eiRule(it.rule); }
  if (it.states) { cell.st = ((cell.st || 0) + 1) % it.states.length; save(); renderIsland(); const nn = $(`.eic[data-x="${c.dataset.x}"][data-y="${c.dataset.y}"] .ei-it`); if (nn) move(nn, it.act); return; }
  if (it.splash) sparkleBurst(n, 10, ['💧', '💦']);
  else if (it.me || it.pip || it.pet) sparkleBurst(n, 8, glitterSyms());
  else if (it.id === 'bloem') sparkleBurst(n, 6, ['✨']);
  else sparkleBurst(n, 5, ['✨']);
  if (n) move(n, it.act);
}
// mailbox/cadeau-hulp voor andere onderdelen
const eiPending = () => eiEarned() - ((D.island && D.island.got) || 0);

/* ---------- op de kaart ---------- */
{
  const i = PLACES.findIndex(p => p.id === 'tuin');
  const place = { id: 'eiland', need: 60, open: () => openIsland() };
  Object.defineProperty(place, 'name', { get: () => t('pl_eiland') }); Object.defineProperty(place, 'sub', { get: () => t('pls_eiland') });
  PLACES.splice(i + 1, 0, place);
  PARENT.island = 'map';
  const _pa = placeArt;
  placeArt = id => id !== 'eiland' ? _pa(id) : `<rect x="0" y="62" width="100" height="30" fill="#5BC8F0"/><ellipse cx="50" cy="64" rx="38" ry="12" fill="#FFE2A8"/><path d="M50 62 Q52 40 46 24" stroke="#9A6B3E" stroke-width="5" fill="none"/><path d="M46 24 Q30 20 26 30 M46 24 Q60 14 68 22 M46 24 Q42 10 32 10 M46 24 Q62 28 64 38" stroke="#4FB35A" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="62" y="48" width="14" height="16" fill="#F2B8C6"/><path d="M60 48 L69 40 L78 48Z" fill="#C8553D"/>`;
}
Object.assign(STR, { pl_eiland: ['Mijn Eiland', 'Mi Isla', 'My Island'], pls_eiland: ['bouw en speel op je eigen eiland', 'traha i hunga riba bo mes isla', 'build and play on your own island'] });
