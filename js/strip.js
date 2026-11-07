'use strict';
/* =====================================================================
   Stripmaker: zelf een kort stripverhaal maken (tot 4 plaatjes)
   Kies per plaatje een achtergrond, twee personages (jij, een vriendje van
   de klas, Pip, je huisdier of een bewaard personage), een gezichtje voor
   elk, en een tekstballon. Je kunt het verhaal bewaren (tot 6) en afspelen.
   Alles blijft op het apparaat. Geen delen, geen account.
   ===================================================================== */

const STRIP_BGS = [
  ['dag', '☀️', 'linear-gradient(#BFE7FF 62%, #8ED081 62%)'], ['avond', '🌇', 'linear-gradient(#FFB88C 62%, #7A9B6B 62%)'], ['nacht', '🌙', 'linear-gradient(#1B2370 62%, #2F5D4A 62%)'],
  ['strand', '🏖️', 'linear-gradient(#BFE7FF 50%, #4FB8EE 50% 64%, #F3DFA2 64%)'], ['zee', '🌊', 'linear-gradient(#BFE7FF 40%, #3A9FD8 40%)'], ['klas', '🏫', 'linear-gradient(#FFF6DD 70%, #C9A66B 70%)'],
  ['bos', '🌳', 'linear-gradient(#CFEFD0 55%, #5FA85A 55%)'], ['feest', '🎉', 'linear-gradient(135deg, #FFE0F0, #E0D4FF)'], ['haven', '🏘️', '']
];
const STRIP_ACTORS = ['me', 'nova', 'kiko', 'maanlicht', 'yuana', 'dax', 'pip', 'pet', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
const STRIP_MOODS = FACES.map(f => f[0]);
let SM = { story: null, i: 0, playing: false };

const stripNew = () => ({ title: '', panels: [{ bg: 'dag', l: { a: 'me', m: 'blij' }, r: { a: 'nova', m: 'lach' }, tl: '', tr: '' }] });
function stripActor(a, mood) {
  if (a === 'me') return avatarSVG(look(), mood);
  if (a === 'pip') return pipSVG({ blij: 'blij', lach: 'lach', wow: 'wow', oeps: 'oeps', knipoog: 'cool', sterogen: 'wow', hartogen: 'hart', verlegen: 'zweet', slaap: 'slaap' }[mood] || 'blij');
  if (a === 'pet') { const p = look().pet; return p && p !== 'geen' ? petSVG(p, 'strip-pet') : pipSVG('blij'); }
  if (/^c\d$/.test(a)) { const c = (D.chars || [])[+a[1]]; return c ? avatarSVG(c.look, mood) : ''; }
  if (typeof CASTIMG !== 'undefined' && CASTIMG[a]) return castImg(a, 'strip-cast');
  return '';
}
const stripActorName = a => a === 'me' ? tri(['Ik', 'Mi', 'Me']) : a === 'pip' ? 'Pip' : a === 'pet' ? tri(['Huisdier', 'Mascota', 'Pet']) : /^c\d$/.test(a) ? ((D.chars || [])[+a[1]] || {}).name || '?' : ((CASTIMG[a] || {}).name || a).replace(/^(Professor|Juf|Shon) /, '');
const stripActors = () => STRIP_ACTORS.filter(a => !/^c\d$/.test(a) || (D.chars || [])[+a[1]]);
function stripPanelHTML(p) {
  const bg = STRIP_BGS.find(b => b[0] === p.bg) || STRIP_BGS[0];
  const layers = p.bg === 'haven' ? ['sky-day', 'sea-day', 'houses', 'bridge'].map(f => `<img class="sp-l" src="img/scene/${f}.svg" alt="" draggable="false">`).join('') : '';
  const bub = (txt, side) => txt ? `<div class="sp-bub ${side}">${esc(txt)}</div>` : '';
  return `<div class="sp-panel" style="background:${bg[2]}">${layers}<div class="sp-act left">${stripActor(p.l.a, p.l.m)}</div><div class="sp-act right">${stripActor(p.r.a, p.r.m)}</div>${bub(p.tl, 'left')}${bub(p.tr, 'right')}</div>`;
}
const stripList = () => (D.strips || []);

function openStrip() {
  if (!$('#strip')) { const s = document.createElement('section'); s.className = 'screen'; s.id = 'strip'; $('main').appendChild(s); }
  if (!SM.story) SM.story = stripNew();
  SM.i = Math.min(SM.i, SM.story.panels.length - 1); SM.playing = false;
  renderStrip(); show('strip');
}
function renderStrip() {
  const el = $('#strip'), S0 = SM.story, p = S0.panels[SM.i], saved = stripList();
  el.innerHTML = backbar('🎬 ' + t('g_strip')) + `<div class="wrap narrow strip">
    ${stripPanelHTML(p)}
    <div class="chips sp-tabs">${S0.panels.map((_, i) => `<button class="chip ${i === SM.i ? 'on' : ''}" data-sp="${i}">${i + 1}</button>`).join('')}${S0.panels.length < 4 ? `<button class="chip" data-spadd>➕</button>` : ''}${S0.panels.length > 1 ? `<button class="chip" data-spdel aria-label="wissen">🗑</button>` : ''}</div>
    <label class="lbl">${tri(['Achtergrond', 'Fondo', 'Background'])}</label><div class="chips">${STRIP_BGS.map(b => `<button class="chip ${p.bg === b[0] ? 'on' : ''}" data-spbg="${b[0]}">${b[1]}</button>`).join('')}</div>
    ${['l', 'r'].map(side => `<div class="sp-side card pad"><label class="lbl">${side === 'l' ? tri(['Links', 'Robes', 'Left']) : tri(['Rechts', 'Drechi', 'Right'])}</label>
      <div class="chips">${stripActors().map(a => `<button class="chip ${p[side].a === a ? 'on' : ''}" data-spa="${side}:${a}">${esc(stripActorName(a))}</button>`).join('')}</div>
      <div class="chips big">${FACES.map(f => `<button class="chip ${p[side].m === f[0] ? 'on' : ''}" data-spm="${side}:${f[0]}" aria-label="${f[0]}">${f[1]}</button>`).join('')}</div>
      <input class="nameinp sp-text" maxlength="40" data-spt="${side}" placeholder="${tri(['Wat zegt hij of zij?', 'Kiko e ta bisa?', 'What do they say?'])}" value="${esc(side === 'l' ? p.tl : p.tr)}" autocomplete="off"></div>`).join('')}
    <div class="btnrow"><button class="btn primary" id="spplay">▶ ${tri(['Afspelen', 'Hunga', 'Play'])}</button><button class="btn" id="spsave">💾 ${tri(['Bewaar', 'Warda', 'Save'])} (${saved.length}/6)</button><button class="btn ghost" id="spnew">🆕 ${tri(['Nieuw', 'Nobo', 'New'])}</button></div>
    ${saved.length ? `<label class="lbl">${tri(['Mijn verhalen', 'Mi storia', 'My stories'])}</label><div class="chips">${saved.map((s, i) => `<span class="spsaved"><button class="chip" data-spload="${i}">📖 ${esc(s.title || (tri(['Verhaal', 'Storia', 'Story']) + ' ' + (i + 1)))}</button><button class="chip" data-spkill="${i}" aria-label="wissen">🗑</button></span>`).join('')}</div>` : ''}</div>`;
  bindCommon(el); stripBind(el);
}
function stripBind(el) {
  const S0 = SM.story, p = () => S0.panels[SM.i];
  $$('[data-sp]', el).forEach(b => b.onclick = () => { SM.i = +b.dataset.sp; SND.click(); renderStrip(); });
  const add = $('[data-spadd]', el); if (add) add.onclick = () => { const q = JSON.parse(JSON.stringify(p())); q.tl = ''; q.tr = ''; S0.panels.push(q); SM.i = S0.panels.length - 1; SND.pop(); renderStrip(); };
  const del = $('[data-spdel]', el); if (del) del.onclick = () => { S0.panels.splice(SM.i, 1); SM.i = Math.max(0, SM.i - 1); SND.click(); renderStrip(); };
  $$('[data-spbg]', el).forEach(b => b.onclick = () => { p().bg = b.dataset.spbg; SND.click(); renderStrip(); });
  $$('[data-spa]', el).forEach(b => b.onclick = () => { const [s, a] = b.dataset.spa.split(':'); p()[s].a = a; SND.click(); renderStrip(); });
  $$('[data-spm]', el).forEach(b => b.onclick = () => { const [s, m] = b.dataset.spm.split(':'); p()[s].m = m; SND.click(); renderStrip(); });
  $$('[data-spt]', el).forEach(i => i.oninput = () => { if (i.dataset.spt === 'l') p().tl = i.value; else p().tr = i.value; const bb = $('.sp-panel', el); const q = p(); bb.outerHTML = stripPanelHTML(q); });
  $('#spplay', el).onclick = () => stripPlay();
  $('#spsave', el).onclick = () => {
    D.strips = D.strips || []; if (D.strips.length >= 6) return toast(tri(['Je hebt al 6 verhalen. Wis er eerst een.', 'Bo tin 6 storia kaba. Kita un promé.', 'You already have 6 stories. Delete one first.']), 3000);
    D.strips.push({ title: tri(['Verhaal', 'Storia', 'Story']) + ' ' + (D.strips.length + 1), panels: JSON.parse(JSON.stringify(S0.panels)) }); save(); SND.pop(); toast('💾 ' + D.strips.length + '/6', 1600); renderStrip();
  };
  $('#spnew', el).onclick = () => { SM.story = stripNew(); SM.i = 0; SND.click(); renderStrip(); };
  $$('[data-spload]', el).forEach(b => b.onclick = () => { const s = stripList()[+b.dataset.spload]; if (!s) return; SM.story = { title: s.title, panels: JSON.parse(JSON.stringify(s.panels)) }; SM.i = 0; SND.click(); renderStrip(); });
  $$('[data-spkill]', el).forEach(b => b.onclick = () => modal(`<h2>${tri(['Dit verhaal wissen?', 'Kita e storia aki?', 'Delete this story?'])}</h2>`, [{ label: t('cancel'), cls: 'primary' }, { label: t('resetYes'), cls: 'ghost danger', fn: () => { D.strips.splice(+b.dataset.spkill, 1); save(); renderStrip(); } }]));
}
// afspelen: plaatje voor plaatje, met een tik of de knop verder
function stripPlay() {
  const S0 = SM.story, el = $('#strip'); let i = 0;
  const draw = () => {
    el.innerHTML = backbar('🎬 ' + t('g_strip')) + `<div class="wrap narrow strip play">${stripPanelHTML(S0.panels[i])}<div class="btnrow"><button class="btn ghost" id="spprev" ${i === 0 ? 'disabled' : ''}>←</button><span class="muted">${i + 1} / ${S0.panels.length}</span>${i < S0.panels.length - 1 ? `<button class="btn primary" id="spnext">→</button>` : `<button class="btn primary" id="spend">✔ ${tri(['Klaar', 'Kla', 'Done'])}</button>`}</div></div>`;
    bindCommon(el); const pn = $('.sp-panel', el); if (pn) move(pn, 'inUp', { duration: 400 });
    const t0 = S0.panels[i].tl || S0.panels[i].tr; if (t0 && typeof canRead === 'function' && canRead() && D.grade <= 3) speakNL([S0.panels[i].tl, S0.panels[i].tr].filter(Boolean).join('. '));
    const pr = $('#spprev', el); if (pr) pr.onclick = () => { i--; SND.click(); draw(); };
    const nx = $('#spnext', el); if (nx) nx.onclick = () => { i++; SND.click(); draw(); };
    const en = $('#spend', el); if (en) en.onclick = () => { SND.fanfare(); confetti(60); renderStrip(); };
  };
  draw();
}
Object.assign(STR, { g_strip: ['Stripmaker', 'Hasi un storia', 'Comic maker'], gs_strip: ['Maak een stripverhaal met je personages', 'Traha un storia ku bo karakternan', 'Make a comic with your characters'] });
PARENT.strip = 'games';
