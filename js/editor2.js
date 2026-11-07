'use strict';
/* =====================================================================
   Toverspiegel 4.0: de personage-editor met onderdelen en kleurplekken
   Naar het idee van een "paper doll"-editor (eigen uitwerking):
   - elk onderdeel heeft pijltjes (◀ ▶), een dobbelsteen (🎲) en een rooster
   - kleurplekken (huid, haar, ogen, mantel, rand, extra, cape, omlijning) met
     een kleurenwiel en eigen opgeslagen kleuren
   - gezichtsvoorbeelden en outfit-sets om snel te beginnen
   - omlijning aan/uit, hoed voor of achter het haar, lichaamsvorm
   - vleugels, staart en cape
   - 12 poses en 8 gezichtjes
   - tot 8 personages bewaren, laden, en alleen de kleding of alleen het hoofd kopiëren
   Vervangt lookPanel en bindLookPanel uit extra.js (die blijven daar als reserve staan).
   ===================================================================== */

const FACE_PRESETS = [
  ['lief', ['Lief', 'Dushi', 'Sweet'], { eyeShape: 'rond', brows: 'zacht', blush: 2, lashes: true, sproet: false }],
  ['stoer', ['Stoer', 'Duru', 'Tough'], { eyeShape: 'kat', brows: 'recht', blush: 0, lashes: false, sproet: false }],
  ['sprankel', ['Sprankel', 'Briyante', 'Sparkle'], { eyeShape: 'ster', brows: 'boog', blush: 1, lashes: true }],
  ['slaperig', ['Slaperig', 'Sunchi', 'Sleepy'], { eyeShape: 'slaperig', brows: 'zacht', blush: 1, lashes: false }],
  ['verliefd', ['Verliefd', 'Namorá', 'In love'], { eyeShape: 'hart', brows: 'boog', blush: 2, lashes: true }],
  ['groot', ['Grote ogen', 'Wowo grandi', 'Big eyes'], { eyeShape: 'groot', brows: 'zacht', blush: 1, lashes: true }],
  ['dromer', ['Dromer', 'Soño', 'Dreamer'], { eyeShape: 'druppel', brows: 'boog', blush: 1, lashes: false }],
  ['zonnig', ['Zonnig', 'Solo', 'Sunny'], { eyeShape: 'sprank', brows: 'dik', blush: 1, lashes: false, sproet: true }]
];
const LOOK_SETS = [
  ['fee', ['Fee', 'Fada', 'Fairy'], { wings: 'fee', staart: 'geen', cape: 'geen', col: { robe: '#FFB3E6', trim: '#FFFFFF', extra: '#9FE6F5' } }],
  ['draak', ['Draak-ridder', 'Kabalero di drake', 'Dragon knight'], { wings: 'draak', staart: 'draak', cape: 'kort', col: { robe: '#3B4D7A', trim: '#FFD36E', extra: '#58C98A', cape: '#7C1F3A' } }],
  ['kat', ['Kattenkind', 'Yu di pushi', 'Cat kid'], { wings: 'geen', staart: 'kat', cape: 'geen', col: { robe: '#FFC0D9', trim: '#FFFFFF', extra: '#9D7CF2' } }],
  ['engel', ['Engel', 'Angel', 'Angel'], { wings: 'engel', staart: 'geen', cape: 'geen', col: { robe: '#FFFFFF', trim: '#FFD36E', extra: '#FFFFFF' } }],
  ['vos', ['Vosje', 'Vos', 'Foxy'], { wings: 'geen', staart: 'vos', cape: 'geen', col: { robe: '#F29A4B', trim: '#FFFFFF', extra: '#F29A4B' } }],
  ['nacht', ['Nachtwacht', 'Guardia di anochi', 'Night guard'], { wings: 'geen', staart: 'geen', cape: 'lang', col: { robe: '#2A2366', trim: '#B18CF0', cape: '#12123A' } }]
];
const COLOR_NAME = { skin: ['Huid', 'Kuero', 'Skin'], hair: ['Haar', 'Kabei', 'Hair'], eyes: ['Ogen', 'Wowo', 'Eyes'], robe: ['Mantel', 'Mantel', 'Robe'], trim: ['Rand', 'Bordo', 'Trim'], extra: ['Vleugels en staart', 'Alanan i rabu', 'Wings and tail'], cape: ['Cape', 'Kapa', 'Cape'], bottom: ['Broek of rok', 'Pantalon òf saya', 'Trousers or skirt'], shoes: ['Schoenen', 'Sapatu', 'Shoes'], gloves: ['Handschoenen', 'Wantu', 'Gloves'], outline: ['Omlijning', 'Lineanan', 'Outline'] };
const PARTLIST = { hair: HAIRSTYLES.map(h => h.id), eyeShape: EYESHAPES, brows: BROWS, bril: GLASSES, oorbel: EARRINGS, clip: CLIPS, baard: BEARDS, wings: WINGS, staart: TAILS, cape: CAPES, vorm: VORMEN, top: TOP_IDS, bottom: BOTTOM_IDS, shoes: SHOE_IDS, gloves: GLOVE_IDS, neck: NECK_IDS, masker: MASK_IDS };
const SWATCH_COL = { skin: 'skin', hairColor: 'hair', eyes: 'eyes', robeColor: 'robe' };   // een gewone kleurkeuze wist de eigen kleur
const CP = { open: null, last: {} };

POSES.push(['juich', '🙌'], ['dans', '💃'], ['denk', '🤔'], ['buig', '🙇']);
Object.assign(STR, {
  pose_juich: ['Juichen', 'Hurá', 'Cheer'], pose_dans: ['Dansen', 'Baila', 'Dance'], pose_denk: ['Nadenken', 'Pensa', 'Think'], pose_buig: ['Buigen', 'Hasi reverensha', 'Bow'],
  lpColors: ['Kleuren', 'Koló', 'Colours']
});

/* ---------- kleur hulpjes ---------- */
function hslHex(h, s, l) {
  s /= 100; l /= 100; const a = s * Math.min(l, 1 - l);
  const f = n => { const k = (n + h / 30) % 12, c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, '0'); };
  return '#' + f(0) + f(8) + f(4);
}
function hexHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
const defColor = (L, k) => ({ skin: SKINS[L.skin] || SKINS[3], hair: HAIRCOLORS[L.hairColor] || HAIRCOLORS[0], eyes: EYECOLORS[L.eyes] || EYECOLORS[0], robe: robeCol(L), trim: '#FFD36E', extra: '#B18CF0', cape: '#B8323F', outline: '#2B2147', bottom: botOf(L).c, shoes: (SHOES[L.shoes] || SHOES.sneaker).c, gloves: (GLOVES[L.gloves] || GLOVES.wanten).c }[k]);

/* ---------- het paneel ---------- */
function lookPanel(L, onChange, withName = true) {
  const sw = (arr, key, order) => `<div class="swatches">${(order || arr.map((_, i) => i)).map(i => `<button class="sw ${L[key] === i && !(SWATCH_COL[key] && L.col && L.col[SWATCH_COL[key]]) ? 'on' : ''}" data-k="${key}" data-v="${i}" style="--c:${arr[i]}" aria-label="${key} ${i + 1}"></button>`).join('')}</div>`;
  const zm = (svg, key) => ZOOM[key] ? svg.replace('viewBox="-6 -50 212 300"', `viewBox="${ZOOM[key]}"`) : svg;
  const pick = (key, vals, label = v => partName(key, v) || '') => `<div class="hairstyles">${vals.map(v => `<button class="hs ${L[key] === v ? 'on' : ''}" data-k="${key}" data-s="${v}">${zm(avatarSVG(Object.assign({}, L, { [key]: v, hat: key === 'bril' ? L.hat : 'geen', pet: 'geen' }), 'blij', 'mini'), key)}<span>${label(v)}</span></button>`).join('')}</div>`;
  const tog = (key, on, off) => `<div class="chips"><button class="chip ${!L[key] ? 'on' : ''}" data-k="${key}" data-b="0">${off}</button><button class="chip ${L[key] ? 'on' : ''}" data-k="${key}" data-b="1">${on}</button></div>`;
  const pname = (key, v) => partName(key, v) || (key === 'hair' ? ((HAIRSTYLES.find(h => h.id === v) || {}).name || v) : key === 'baard' ? t('beard_' + v) : cap(String(v)));
  const partRow = (key, label) => {
    const list = PARTLIST[key], i = Math.max(0, list.indexOf(L[key] == null ? list[0] : L[key]));
    return `<label class="lbl">${label}</label><div class="partrow"><button class="chip" data-prt="${key}:-1" aria-label="vorige">◀</button><b>${pname(key, list[i])}</b><button class="chip" data-prt="${key}:1" aria-label="volgende">▶</button><button class="chip" data-prnd="${key}" aria-label="dobbelsteen">🎲</button></div>`;
  };
  const colorRow = key => {
    const cur = L.col && L.col[key], open = CP.open === key, pres = D.colorPresets || [], label = tri(COLOR_NAME[key]);
    const [h, s, l] = hexHsl(cur || CP.last[key] || defColor(L, key));
    return `<div class="colrow"><label class="lbl">${label}</label><div class="colbtns"><button class="sw wheelbtn ${cur ? 'on' : ''}" style="--c:${cur || '#fff'}" data-copen="${key}" aria-label="${label}">🎨</button>
      ${pres.map(c => `<button class="sw ${cur === c ? 'on' : ''}" style="--c:${c}" data-cset="${key}:${c}" aria-label="${c}"></button>`).join('')}
      <button class="chip" data-crnd="${key}" aria-label="dobbelsteen">🎲</button>${cur ? `<button class="chip" data-creset="${key}" aria-label="terug">↺</button>` : ''}</div>
      ${open ? `<div class="wheel" data-wheel="${key}"><div class="wprev" style="background:${cur || hslHex(h, s, l)}"></div>
        <label>${tri(['Kleur', 'Koló', 'Hue'])}<input type="range" class="w-range hue" min="0" max="360" value="${h}" data-cw="h"></label>
        <label>${tri(['Fel', 'Bibu', 'Vivid'])}<input type="range" class="w-range" min="5" max="100" value="${s}" data-cw="s"></label>
        <label>${tri(['Licht', 'Kla', 'Light'])}<input type="range" class="w-range" min="8" max="96" value="${l}" data-cw="l"></label>
        <button class="btn small ghost" data-csave="${key}">💾 ${tri(['Bewaar kleur', 'Warda koló', 'Save colour'])}</button></div>` : ''}</div>`;
  };
  const tabs = [['face', '🙂 ' + t('lpFace')], ['hair', '💇 ' + t('hair')], ['eyes', '👀 ' + t('eyes')], ['extra', '✨ ' + t('lpExtra')], ['wear', '👕 ' + tri(['Kleren', 'Paña', 'Clothes'])], ['robe', '🧥 ' + t('lpRobe')], ['color', '🎨 ' + t('lpColors')], ['magic', '🪄 ' + t('lpMagic')]];
  let body = '';
  if (lpTab === 'face') body = `<label class="lbl">${t('lpBody')}</label><div class="hairstyles starters">${STARTERS.map(s => `<button class="hs" data-starter="${s.id}">${avatarSVG(Object.assign({}, DEFAULT_LOOK, s.look), 'blij', 'mini')}<span>${s.name}</span></button>`).join('')}</div><p class="muted">${t('lpBodyInfo')}</p>
    <label class="lbl">${t('lpMantel')}</label><div class="chips big">${BODIES.map(([id, e]) => `<button class="chip ${(L.body || 'meisje') === id ? 'on' : ''}" data-body="${id}">${e} ${t('body_' + id)}</button>`).join('')}</div>
    ${partRow('vorm', tri(['Lichaamsvorm', 'Forma di kurpa', 'Body shape']))}
    <label class="lbl">${t('skin')}</label>${sw(SKINS, 'skin', SKIN_ORDER)}${colorRow('skin')}
    <label class="lbl">${t('lpTint')}</label><input type="range" class="w-range" min="-3" max="3" step="1" value="${L.tint || 0}" data-tint aria-label="${t('lpTint')}">
    <label class="lbl">${t('lpFreckles')}</label>${tog('sproet', '✅', '—')}
    <label class="lbl">${t('lpBlush')}</label><div class="chips">${[0, 1, 2].map(i => `<button class="chip ${L.blush === i ? 'on' : ''}" data-k="blush" data-v="${i}">${['—', '🌸', '🌸🌸'][i]}</button>`).join('')}</div>
    ${partRow('brows', t('lpBrows'))}${pick('brows', BROWS)}`;
  if (lpTab === 'hair') body = `${partRow('hair', t('hair'))}<div class="hairstyles">${HAIRSTYLES.map(h => `<button class="hs ${L.hair === h.id ? 'on' : ''}" data-k="hair" data-s="${h.id}">${avatarSVG(Object.assign({}, L, { hair: h.id, hat: 'geen', pet: 'geen' }), 'blij', 'mini')}<span>${h.name}</span></button>`).join('')}</div>
    <label class="lbl">${t('hairColor')}</label>${sw(HAIRCOLORS, 'hairColor')}${colorRow('hair')}
    <label class="lbl">${t('lpTips')}</label><div class="swatches"><button class="sw none ${L.tips < 0 ? 'on' : ''}" data-k="tips" data-v="-1" aria-label="geen">—</button>${HAIRCOLORS.map((c, i) => `<button class="sw ${L.tips === i ? 'on' : ''}" data-k="tips" data-v="${i}" style="--c:${c}"></button>`).join('')}</div>`;
  if (lpTab === 'eyes') body = `<label class="lbl">${tri(['Gezichtjes om mee te beginnen', 'Kara pa kuminsá', 'Faces to start with'])}</label><div class="hairstyles">${FACE_PRESETS.map(([id, nm, set]) => `<button class="hs" data-fpre="${id}">${avatarSVG(Object.assign({}, L, set, { hat: 'geen', pet: 'geen' }), 'blij', 'mini')}<span>${tri(nm)}</span></button>`).join('')}</div>
    <label class="lbl">${t('lpEyeColor')}</label>${sw(EYECOLORS, 'eyes')}${colorRow('eyes')}
    ${partRow('eyeShape', t('lpEyeShape'))}${pick('eyeShape', EYESHAPES)}<label class="lbl">${t('lpLashes')}</label>${tog('lashes', '✅', '—')}`;
  if (lpTab === 'extra') body = `<label class="lbl">${tri(['Outfit-sets', 'Sets di paña', 'Outfit sets'])}</label><div class="hairstyles">${LOOK_SETS.map(([id, nm, set]) => `<button class="hs" data-set="${id}">${avatarSVG(Object.assign({}, L, set, { col: Object.assign({}, L.col, set.col), hat: 'geen', pet: 'geen' }), 'blij', 'mini')}<span>${tri(nm)}</span></button>`).join('')}</div>
    ${partRow('wings', tri(['Vleugels', 'Alanan', 'Wings']))}${partRow('staart', tri(['Staart', 'Rabu', 'Tail']))}${colorRow('extra')}${partRow('cape', tri(['Cape', 'Kapa', 'Cape']))}${colorRow('cape')}
    <label class="lbl">${tri(['Hoed', 'Sombré', 'Hat'])}: ${tri(['voor of achter het haar', 'dilanti òf patras di kabei', 'in front of or behind the hair'])}</label><div class="chips"><button class="chip ${!L.hatBack ? 'on' : ''}" data-k="hatBack" data-b="0">${tri(['Voor', 'Dilanti', 'Front'])}</button><button class="chip ${L.hatBack ? 'on' : ''}" data-k="hatBack" data-b="1">${tri(['Achter', 'Patras', 'Behind'])}</button></div>
    ${partRow('bril', t('lpGlasses'))}${pick('bril', GLASSES)}${partRow('oorbel', t('lpEarrings'))}${pick('oorbel', EARRINGS)}${partRow('clip', t('lpClips'))}${pick('clip', CLIPS)}
    ${partRow('baard', t('lpBeard'))}
    <label class="lbl">${t('lpLeg')}</label><div class="chips">${LEGS.map(b => `<button class="chip ${(L.prothese || 'geen') === b ? 'on' : ''}" data-k="prothese" data-s="${b}">${t('leg_' + b)}</button>`).join('')}</div>`;
  if (lpTab === 'wear') body = `<p class="muted">${tri(['Kies een shirt, broek, schoenen en meer. Alles los van elkaar, dus je mixt zelf je outfit. Kies je niets, dan draag je de toverkleding.', 'Kies kamisa, pantalon, sapatu i mas. Tur kos apart, asina bo mixa bo mes outfit.', 'Pick a top, bottoms, shoes and more, all separate, so you mix your own outfit. Pick nothing and you keep the magic robe.'])}</p>
    ${[['top', tri(['Shirt of jas', 'Kamisa òf jas', 'Top or jacket'])], ['bottom', tri(['Broek of rok', 'Pantalon òf saya', 'Trousers or skirt'])], ['shoes', tri(['Schoenen', 'Sapatu', 'Shoes'])], ['gloves', tri(['Handschoenen', 'Wantu', 'Gloves'])], ['neck', tri(['Sjaal en ketting', 'Bufanda i kadena', 'Scarf and necklace'])], ['masker', tri(['Gezicht', 'Kara', 'Face'])]].map(([k, lb]) => `${partRow(k, lb)}${pick(k, PARTLIST[k])}`).join('')}
    ${colorRow('robe')}${colorRow('trim')}${colorRow('bottom')}${colorRow('shoes')}${colorRow('gloves')}
    <button class="btn ghost wide" data-wearreset>↺ ${tri(['Terug naar de toverkleding', 'Bèk na e paña di mágia', 'Back to the magic robe'])}</button>`;
  if (lpTab === 'robe') body = `<label class="lbl">${t('lpRobeColor')}</label>${sw(ROBECOLS, 'robeColor')}${colorRow('robe')}${colorRow('trim')}<p class="muted">${t('lpRobeNote')}</p>
    <label class="lbl">${t('lpSign')}</label><div class="chips big">${TEKENS.map(([id, e]) => `<button class="chip ${L.teken === id ? 'on' : ''}" data-k="teken" data-s="${id}">${e} ${t('sign_' + id)}</button>`).join('')}</div>`;
  if (lpTab === 'color') body = `<p class="muted">${tri(['Elke kleurplek heeft een kleurenwiel (🎨), je opgeslagen kleuren, een dobbelsteen en een terug-knop.', 'Kada koló tin un rueda (🎨), bo koló warda, un dados i un boton pa bai bèk.', 'Every colour spot has a colour wheel (🎨), your saved colours, a dice and a reset button.'])}</p>
    ${['skin', 'hair', 'eyes', 'robe', 'trim', 'extra', 'cape'].map(colorRow).join('')}
    <label class="lbl">${tri(['Omlijning', 'Lineanan', 'Outline'])}</label>${tog('outline', tri(['Aan', 'Aña', 'On']), tri(['Uit', 'Paga', 'Off']))}${colorRow('outline')}
    <button class="btn ghost wide" data-colreset>↺ ${tri(['Alle eigen kleuren wissen', 'Kita tur koló propio', 'Clear all my own colours'])}</button>`;
  if (lpTab === 'magic') {
    const chars = D.chars || [];
    body = `<label class="lbl">${t('lpBg')}</label><div class="chips">${MIRROR_BGS.map(([id, e]) => `<button class="chip ${L.bg === id ? 'on' : ''}" data-k="bg" data-s="${id}">${e} ${t('bg_' + id)}</button>`).join('')}</div>
    <label class="lbl">${t('lpGlitter')}</label><div class="chips">${GLITTERS.map(([id, e]) => `<button class="chip ${L.glitter === id ? 'on' : ''}" data-k="glitter" data-s="${id}">${e} ${t('gl_' + id)}</button>`).join('')}</div>
    <label class="lbl">${t('lpPose')}</label><div class="chips">${POSES.map(([id, e]) => `<button class="chip" data-pose="${id}">${e} ${t('pose_' + id)}</button>`).join('')}</div>
    <label class="lbl">${t('lpFaceNow')}</label><div class="chips big">${FACES.map(([id, e]) => `<button class="chip ${spiegelMood === id ? 'on' : ''}" data-face="${id}" aria-label="${id}">${e}</button>`).join('')}</div>
    <label class="lbl">${tri(['Mijn personages', 'Mi karakternan', 'My characters'])} (${chars.length}/8)</label>
    <div class="hairstyles chars">${chars.map((c, i) => `<div class="charslot"><button class="hs" data-cload="${i}">${avatarSVG(c.look, 'blij', 'mini')}<span>${esc(c.name || '#' + (i + 1))}</span></button><button class="chip x" data-cdel="${i}" aria-label="wissen">🗑</button></div>`).join('')}</div>
    <button class="btn ghost wide" id="csave">💾 ${tri(['Bewaar dit personage', 'Warda e karakter aki', 'Save this character'])}</button>`;
  }
  return `<div class="lookpanel">
    ${withName ? `<label class="lbl">${t('name')}</label><input id="nameinp" class="nameinp" maxlength="16" value="${esc((D.profile && D.profile.name) || '')}" placeholder="${t('namePh')}" autocomplete="off">` : ''}
    <div class="tabs small">${tabs.map(([k, n]) => `<button class="tab ${lpTab === k ? 'on' : ''}" data-lp="${k}">${n}</button>`).join('')}</div>${body}
    <button class="btn ghost wide" id="surprise">🎲 ${t('lpSurprise')}</button></div>`;
}

/* ---------- bedienen ---------- */
function refreshPreview(root, L) {
  const a = $('.ward-prev svg.avatar', root); if (a) a.outerHTML = avatarSVG(L, spiegelMood || 'blij');
}
function copyLook(L, c, what) {
  const clone = JSON.parse(JSON.stringify(c.look));
  if (what === 'all') { Object.keys(L).forEach(k => delete L[k]); Object.assign(L, clone); return; }
  const cloth = ['outfit', 'hat', 'wand', 'robeColor', 'teken', 'body', 'vorm', 'wings', 'staart', 'cape', 'hatBack', 'top', 'bottom', 'shoes', 'gloves', 'neck', 'masker'];
  const head = ['hair', 'hairColor', 'tips', 'eyes', 'eyeShape', 'lashes', 'brows', 'sproet', 'blush', 'bril', 'oorbel', 'clip', 'baard', 'skin', 'tint'];
  const keys = what === 'cloth' ? cloth : head, colKeys = what === 'cloth' ? ['robe', 'trim', 'extra', 'cape', 'bottom', 'shoes', 'gloves'] : ['skin', 'hair', 'eyes'];
  keys.forEach(k => { if (clone[k] !== undefined) L[k] = clone[k]; });
  L.col = Object.assign({}, L.col); colKeys.forEach(k => { if (clone.col && clone.col[k]) L.col[k] = clone.col[k]; else delete L.col[k]; });
}
function bindLookPanel(root, L, onChange) {
  const done = () => { SND.click(); lookHop = D.settings.anim; onChange(); lookHop = false; spiegelPoof(root); };
  const ensureCol = () => { if (!L.col || typeof L.col !== 'object') L.col = {}; return L.col; };
  $$('[data-lp]', root).forEach(b => b.onclick = () => { lpTab = b.dataset.lp; SND.click(); onChange(); });
  $$('[data-k][data-v]', root).forEach(b => b.onclick = () => { const k = b.dataset.k; L[k] = +b.dataset.v; if (SWATCH_COL[k] && L.col) delete L.col[SWATCH_COL[k]]; done(); });
  $$('[data-k][data-s]', root).forEach(b => b.onclick = () => { L[b.dataset.k] = b.dataset.s; done(); });
  $$('[data-k][data-b]', root).forEach(b => b.onclick = () => { L[b.dataset.k] = b.dataset.b === '1'; done(); });
  $$('[data-prt]', root).forEach(b => b.onclick = () => { const [k, d] = b.dataset.prt.split(':'), list = PARTLIST[k], i = Math.max(0, list.indexOf(L[k] == null ? list[0] : L[k])); L[k] = list[(i + +d + list.length) % list.length]; done(); });
  $$('[data-prnd]', root).forEach(b => b.onclick = () => { const k = b.dataset.prnd, list = PARTLIST[k]; L[k] = kies(list); done(); });
  $$('[data-fpre]', root).forEach(b => b.onclick = () => { const p = FACE_PRESETS.find(x => x[0] === b.dataset.fpre); if (p) { Object.assign(L, { sproet: false }, p[2]); done(); } });
  $$('[data-set]', root).forEach(b => b.onclick = () => { const p = LOOK_SETS.find(x => x[0] === b.dataset.set); if (p) { Object.assign(L, p[2], { col: Object.assign({}, L.col, p[2].col) }); done(); } });
  $$('[data-wearreset]', root).forEach(b => b.onclick = () => { Object.assign(L, { top: 'geen', bottom: 'geen', shoes: 'geen', gloves: 'geen', neck: 'geen', masker: 'geen' }); done(); });
  // kleuren
  $$('[data-copen]', root).forEach(b => b.onclick = () => { CP.open = CP.open === b.dataset.copen ? null : b.dataset.copen; SND.click(); onChange(); });
  $$('[data-cset]', root).forEach(b => b.onclick = () => { const [k, c] = b.dataset.cset.split(':'); ensureCol()[k] = c; CP.last[k] = c; done(); });
  $$('[data-crnd]', root).forEach(b => b.onclick = () => { const k = b.dataset.crnd; const c = hslHex(rnd(0, 360), rnd(45, 95), rnd(30, 80)); ensureCol()[k] = c; CP.last[k] = c; done(); });
  $$('[data-creset]', root).forEach(b => b.onclick = () => { if (L.col) delete L.col[b.dataset.creset]; done(); });
  $$('[data-colreset]', root).forEach(b => b.onclick = () => { L.col = {}; L.outline = true; done(); });
  $$('[data-csave]', root).forEach(b => b.onclick = () => {
    const k = b.dataset.csave, c = L.col && L.col[k]; if (!c) return toast(tri(['Kies eerst een kleur met het wiel', 'Skohe promé un koló ku e rueda', 'Pick a colour with the wheel first']), 2400);
    D.colorPresets = D.colorPresets || []; if (!D.colorPresets.includes(c)) { D.colorPresets.unshift(c); D.colorPresets = D.colorPresets.slice(0, 12); save(); }
    SND.pop(); toast(tri(['Kleur bewaard', 'Koló warda', 'Colour saved']), 1600); onChange();
  });
  $$('[data-wheel]', root).forEach(w => {
    const k = w.dataset.wheel, inputs = $$('[data-cw]', w), get = n => +inputs.find(i => i.dataset.cw === n).value;
    inputs.forEach(i => { i.oninput = () => { const c = hslHex(get('h'), get('s'), get('l')); ensureCol()[k] = c; CP.last[k] = c; $('.wprev', w).style.background = c; refreshPreview(root, L); }; i.onchange = () => { onChange(); }; });
  });
  // bewaarde personages
  const cs = $('#csave', root); if (cs) cs.onclick = () => {
    D.chars = D.chars || []; if (D.chars.length >= 8) return toast(tri(['Je hebt al 8 personages. Wis er eerst een.', 'Bo tin 8 karakter kaba. Kita un promé.', 'You already have 8 characters. Delete one first.']), 3000);
    D.chars.push({ name: tri(['Personage', 'Karakter', 'Character']) + ' ' + (D.chars.length + 1), look: JSON.parse(JSON.stringify(L)) }); save(); SND.pop(); toast('💾 ' + D.chars.length + '/8', 1600); onChange();
  };
  $$('[data-cdel]', root).forEach(b => b.onclick = () => modal(`<h2>${tri(['Dit personage wissen?', 'Kita e karakter aki?', 'Delete this character?'])}</h2>`, [{ label: t('cancel'), cls: 'primary' }, { label: t('resetYes'), cls: 'ghost danger', fn: () => { D.chars.splice(+b.dataset.cdel, 1); save(); onChange(); } }]));
  $$('[data-cload]', root).forEach(b => b.onclick = () => {
    const c = (D.chars || [])[+b.dataset.cload]; if (!c) return;
    modal(`<h2>${tri(['Wat wil je laden?', 'Kiko bo ke karga?', 'What do you want to load?'])}</h2><p>${esc(c.name || '')}</p>`, [
      { label: tri(['Alles', 'Tur kos', 'Everything']), cls: 'primary', fn: () => { copyLook(L, c, 'all'); done(); } },
      { label: tri(['Alleen kleding', 'Solamente paña', 'Clothes only']), cls: 'ghost', fn: () => { copyLook(L, c, 'cloth'); done(); } },
      { label: tri(['Alleen gezicht en haar', 'Solamente kara i kabei', 'Face and hair only']), cls: 'ghost', fn: () => { copyLook(L, c, 'head'); done(); } }]);
  });
  const sp = $('#surprise', root); if (sp) sp.onclick = () => { sp.classList.remove('diceshake'); void sp.offsetWidth; sp.classList.add('diceshake'); tone([300, 360, 420], .05, 'square', .03); setTimeout(() => { Object.assign(L, randomLook(L)); SND.pop(); onChange(); spiegelPoof(root); }, 300); };
  $$('[data-pose]', root).forEach(b => b.onclick = () => spiegelPose(root, b.dataset.pose));
  $$('[data-body]', root).forEach(b => b.onclick = () => { L.body = b.dataset.body; done(); });
  $$('[data-starter]', root).forEach(b => b.onclick = () => { const st = STARTERS.find(x => x.id === b.dataset.starter); if (!st) return; Object.assign(L, { sproet: false, clip: 'geen', oorbel: 'geen', tips: -1, bril: 'geen', baard: 'geen', prothese: 'geen', tint: 0, wings: 'geen', staart: 'geen', cape: 'geen', col: {}, vorm: 'normaal' }, st.look); SND.click(); done(); });
  $$('[data-tint]', root).forEach(r => r.onchange = () => { L.tint = +r.value; done(); });
  $$('[data-face]', root).forEach(b => b.onclick = () => { spiegelMood = b.dataset.face; SND.click(); onChange(); });
  const n = $('#nameinp', root); if (n) n.oninput = () => { D.profile.name = n.value.trim() || D.profile.name; save(); };
}

// poses: alle pose-klassen eerst weghalen
spiegelPose = (root, pose) => {
  const a = $('.ward-prev .avatar', root); if (!a) return;
  SND.pop(); [...a.classList].filter(c => c.startsWith('pose-')).forEach(c => a.classList.remove(c)); void a.getBoundingClientRect(); a.classList.add('pose-' + pose);
  if (pose === 'pose' || pose === 'juich') sparkleBurst($('.ward-prev', root), 12, glitterSyms());
};
