'use strict';
/* =====================================================================
   Kledingkamer, Dierenweide, Speelzaal, Sterrentoren, Grappenzolder,
   Geheime Tuin, Eilandfeest, instellingen en de introductie.
   ===================================================================== */

/* ---------- personage-keuzes (gedeeld door intro en kledingkamer) ---------- */
function lookPanel(L, onChange, withName = true) {
  const sw = (arr, key, cls = '') => `<div class="swatches ${cls}">${arr.map((c, i) => `<button class="sw ${L[key] === i ? 'on' : ''}" data-k="${key}" data-v="${i}" style="--c:${c}" aria-label="${key} ${i + 1}"></button>`).join('')}</div>`;
  return `<div class="lookpanel">
    ${withName ? `<label class="lbl">${t('name')}</label><input id="nameinp" class="nameinp" maxlength="16" value="${esc((D.profile && D.profile.name) || '')}" placeholder="${t('namePh')}" autocomplete="off">` : ''}
    <label class="lbl">${t('skin')}</label>${sw(SKINS, 'skin')}
    <label class="lbl">${t('hair')}</label><div class="hairstyles">${HAIRSTYLES.map(h => `<button class="hs ${L.hair === h.id ? 'on' : ''}" data-hair="${h.id}">${avatarSVG(Object.assign({}, L, { hair: h.id, hat: 'geen', pet: 'geen' }), 'blij', 'mini')}<span>${h.name}</span></button>`).join('')}</div>
    <label class="lbl">${t('hairColor')}</label>${sw(HAIRCOLORS, 'hairColor')}
    <label class="lbl">${t('eyes')}</label>${sw(EYECOLORS, 'eyes')}</div>`;
}
function bindLookPanel(root, L, onChange) {
  $$('.sw', root).forEach(b => b.onclick = () => { L[b.dataset.k] = +b.dataset.v; SND.click(); onChange(); });
  $$('.hs', root).forEach(b => b.onclick = () => { L.hair = b.dataset.hair; SND.click(); onChange(); });
  const n = $('#nameinp', root); if (n) n.oninput = () => { D.profile.name = n.value.trim() || D.profile.name; save(); };
}

/* =====================================================================
   KLEDINGKAMER
   ===================================================================== */
let wardTab = 'look';
function openWardrobe() { renderWardrobe(); show('wardrobe'); }
function renderWardrobe() {
  const el = $('#wardrobe'), L = Object.assign({}, look());
  const tabs = [['look', t('look')], ['outfit', t('outfits')], ['hat', t('hats')], ['wand', t('wands')]];
  let body;
  if (wardTab === 'look') body = lookPanel(L);
  else body = `<div class="items">${ITEMS[wardTab].map(it => {
    const own = D.owned[wardTab].includes(it.id), on = L[wardTab] === it.id;
    const prev = avatarSVG(Object.assign({}, L, { [wardTab]: it.id, pet: 'geen' }), 'blij', 'mini');
    return `<button class="item ${own ? 'own' : ''} ${on ? 'on' : ''}" data-id="${it.id}">${prev}<span class="i-name">${it.name}</span>
      <span class="i-price">${on ? '✅ ' + t('wearing') : own ? t('owned') : `⭐ ${it.price}`}</span></button>`;
  }).join('')}</div>`;
  el.innerHTML = backbar(t('pl_kast')) + `<div class="wrap"><div class="ward">
    <div class="ward-prev card">${avatarSVG(L, 'blij')}${L.pet !== 'geen' ? petSVG(L.pet, 'ward-pet') : ''}<div class="ward-name">${esc(playerName())}</div></div>
    <div class="ward-side"><div class="tabs">${tabs.map(([k, n]) => `<button class="tab ${wardTab === k ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('')}</div>${body}</div></div></div>`;
  bindCommon(el);
  $$('[data-tab]', el).forEach(b => b.onclick = () => { wardTab = b.dataset.tab; SND.click(); renderWardrobe(); });
  if (wardTab === 'look') bindLookPanel(el, L, () => { D.profile.look = L; save(); renderWardrobe(); });
  $$('.item', el).forEach(b => b.onclick = () => buyOrWear(wardTab, b.dataset.id, renderWardrobe));
}
function buyOrWear(kind, id, rerender) {
  const it = ITEM[kind + ':' + id], L = Object.assign({}, look());
  if (D.owned[kind].includes(id)) { L[kind] = id; D.profile.look = L; save(); SND.click(); rerender(); return; }
  if (D.stars < it.price) { SND.boing(); modal(`<div class="m-ico">${pipSVG('oeps')}</div><p>${t('needMore', { n: it.price - D.stars })}</p>`); return; }
  modal(`<div class="m-ico">${kind === 'pet' ? petSVG(id) : avatarSVG(Object.assign({}, L, { [kind]: id }), 'wow', 'mini')}</div><p>${t('buyQ', { i: it.name, p: it.price })}</p>`,
    [{ label: `${t('buy')} ⭐ ${it.price}`, cls: 'primary', fn: () => {
      D.stars -= it.price; D.owned[kind].push(id); L[kind] = id; D.profile.look = L; D.counters.purchases++; save(); updateStarCount();
      SND.buy(); confetti(70); toast(t('bought')); checkBadges(); rerender();
    } }, { label: t('cancel'), cls: 'ghost' }]);
}

/* =====================================================================
   DIERENWEIDE
   ===================================================================== */
const PETLINES = { kat: ['Miauw! Nog een keer aaien!', 'Ik spin als een sterrenmotor!'], flamingo: ['Ik sta op één been van blijdschap!', 'Roze is de mooiste kleur!'], leguaan: ['Mmm, lekker warm in de zon.', 'Dushi! Nog een keer!'], uil: ['Hoe-hoe, wat fijn!', 'Ik weet alles van sommen!'], wolk: ['Ik regen een klein beetje van geluk!', 'Zachtjes, ik ben van watten!'], schildpad: ['Langzaam maar heel blij!', 'Turbo zegt: dankjewel!'], eenhoorn: ['Glitterglitter!', 'Mijn hoorn gaat ervan glimmen!'], draak: ['Ik nies… een vonkje! Oeps!', 'Grrr… dat betekent: ik vind je lief!'] };
function openPets() { renderPets(); show('pets'); }
function renderPets() {
  const el = $('#pets'), cur = look().pet;
  el.innerHTML = backbar(t('pl_weide')) + `<div class="wrap">
    <div class="petstage card">${cur !== 'geen' ? `${petSVG(cur, 'bigpet')}<div class="petname">${ITEM['pet:' + cur].name}</div><div class="bubble" id="petsay">…</div><button class="btn primary" id="cuddle">${t('cuddle')}</button>` : `<p>${t('noPet')}</p>`}</div>
    <div class="items pets">${ITEMS.pet.filter(p => p.id !== 'geen').map(p => {
      const own = D.owned.pet.includes(p.id), on = cur === p.id;
      return `<button class="item ${own ? 'own' : ''} ${on ? 'on' : ''}" data-id="${p.id}">${petSVG(p.id)}<span class="i-name">${p.name}</span><span class="i-price">${on ? '✅' : own ? t('choose') : `⭐ ${p.price}`}</span></button>`;
    }).join('')}</div></div>`;
  bindCommon(el);
  $$('.item', el).forEach(b => b.onclick = () => buyOrWear('pet', b.dataset.id, renderPets));
  const c = $('#cuddle');
  if (c) c.onclick = () => {
    D.counters.pets++; save(); SND.pop();
    $('#petsay').textContent = kies(PETLINES[cur] || ['💖']);
    const big = $('.bigpet'); big.classList.remove('hop'); void big.offsetWidth; big.classList.add('hop');
    for (let i = 0; i < 5; i++) { const h = document.createElement('span'); h.className = 'heart'; h.textContent = kies(['💖', '💕', '✨']); h.style.left = (40 + Math.random() * 20) + '%'; h.style.animationDelay = i * 80 + 'ms'; $('.petstage').appendChild(h); setTimeout(() => h.remove(), 1400); }
  };
}

/* =====================================================================
   SPEELZAAL
   ===================================================================== */
const G = {};
function openGames() {
  const el = $('#games'), gm = D.games;
  const card = (id, ico, best) => `<button class="gamecard card" data-g="${id}"><span class="g-ico">${ico}</span><b>${t('g_' + id)}</b><small>${t('gs_' + id)}</small>${best ? `<span class="pill">🏆 ${t('best')}: ${best}</span>` : ''}</button>`;
  el.innerHTML = backbar(t('pl_speel')) + `<div class="wrap"><h2 class="sect">${t('games')}</h2><div class="gamegrid">
    ${card('match', '🧩', gm.match && gm.match.best ? fmtSec(gm.match.best * 1000) : '')}${card('memory', '🃏', gm.memory && gm.memory.best ? gm.memory.best + ' ' + t('moves') : '')}${card('bellen', '🫧', gm.bellen && gm.bellen.best)}</div></div>`;
  bindCommon(el);
  $$('[data-g]', el).forEach(b => b.onclick = () => { SND.click(); b.dataset.g === 'bellen' ? startBellen() : pickCategory(b.dataset.g); });
  show('games');
}
function pickCategory(game) {
  const cats = Object.keys(PAP).filter(c => c !== 'zinnen');
  modal(`<h2>${t('category')}</h2><div class="catgrid">${cats.map(c => `<button class="chip" data-cat="${c}">${PAP[c][0][2]} ${PAPCAT[c]}</button>`).join('')}<button class="chip" data-cat="all">🎲 ${t('allWords')}</button></div>`, [{ label: t('cancel'), cls: 'ghost' }]);
  $$('[data-cat]').forEach(b => b.onclick = () => { closeModal(); game === 'match' ? startMatch(b.dataset.cat) : startMemory(b.dataset.cat); });
}
const catWords = (cat, n) => shuffle(cat === 'all' ? ALLPAP.filter(w => w[3] !== 'zinnen') : PAP[cat]).filter((w, i, a) => a.findIndex(x => x[1] === w[1]) === i).slice(0, n);
function gameShell(title, inner) {
  const el = $('#game');
  el.innerHTML = `<div class="topbar"><button class="iconbtn" id="gback" aria-label="${t('back')}">←</button><div class="tb-title">${title}</div><div class="tb-stats"><span class="pill" id="gstat"></span></div></div><div class="wrap">${inner}</div>`;
  $('#gback').onclick = stopGame; show('game');
}
function stopGame() { clearInterval(G.timer); cancelAnimationFrame(G.raf); G.over = true; openGames(); }
function gameWin(game, scoreLine, better) {
  clearInterval(G.timer); G.over = true;
  const gs = D.games[game] || (D.games[game] = { wins: 0, best: 0 });
  gs.wins = (gs.wins || 0) + 1; if (better(gs.best)) gs.best = G.result; save();
  addStars(5); SND.fanfare(); confetti(120); checkBadges();
  modal(`<div class="m-ico">${pipSVG('lach')}</div><h2>${t('done')}</h2><p>${scoreLine}<br><b>+5 ⭐</b></p>`, [{ label: t('playAgain'), cls: 'primary', fn: G.again }, { label: t('back'), cls: 'ghost', fn: openGames }]);
}

/* --- woordjes-match --- */
function startMatch(cat) {
  const words = catWords(cat, 6); G.over = false; G.again = () => startMatch(cat);
  const left = shuffle(words.map((w, i) => ({ i, txt: w[0], pap: 1 }))), right = shuffle(words.map((w, i) => ({ i, txt: `${w[2]} ${w[1]}` })));
  gameShell(t('g_match'), `<p class="muted center">${t('gs_match')}</p><div class="match"><div class="mcol">${left.map(x => `<button class="mt pap" data-i="${x.i}" data-s="l">${x.txt}</button>`).join('')}</div><div class="mcol">${right.map(x => `<button class="mt" data-i="${x.i}" data-s="r">${x.txt}</button>`).join('')}</div></div>`);
  let sel = null, left2 = words.length; const t0 = Date.now();
  G.timer = setInterval(() => { $('#gstat').textContent = '⏱️ ' + fmtSec(Date.now() - t0); }, 300);
  $$('.mt').forEach(b => b.onclick = () => {
    if (b.classList.contains('gone')) return;
    if (!sel || sel.dataset.s === b.dataset.s) { $$('.mt.sel').forEach(x => x.classList.remove('sel')); sel = b; b.classList.add('sel'); SND.click(); return; }
    if (sel.dataset.i === b.dataset.i) {
      [sel, b].forEach(x => { x.classList.remove('sel'); x.classList.add('gone'); }); sparkleBurst(b, 8); SND.ok(); sel = null;
      if (--left2 === 0) { G.result = Math.round((Date.now() - t0) / 1000); gameWin('match', `⏱️ ${fmtSec(G.result * 1000)}`, best => !best || G.result < best); }
    } else { SND.boing(); shake(b); shake(sel); sel.classList.remove('sel'); sel = null; }
  });
}

/* --- memory --- */
function startMemory(cat) {
  const words = catWords(cat, 6); G.over = false; G.again = () => startMemory(cat);
  const cards = shuffle(words.flatMap((w, i) => [{ i, f: `<span class="pap">${w[0]}</span>` }, { i, f: `<span class="m-e">${w[2]}</span>${w[1]}` }]));
  gameShell(t('g_memory'), `<p class="muted center">${t('gs_memory')}</p><div class="memory">${cards.map((c, k) => `<button class="mc" data-k="${k}"><span class="mc-in"><span class="mc-back">✨</span><span class="mc-front">${c.f}</span></span></button>`).join('')}</div>`);
  let open = [], moves = 0, found = 0, busy = false;
  const stat = () => $('#gstat').textContent = `${moves} ${t('moves')}`; stat();
  $$('.mc').forEach(b => b.onclick = () => {
    if (busy || b.classList.contains('flip')) return;
    b.classList.add('flip'); SND.click(); open.push(b);
    if (open.length < 2) return;
    moves++; stat(); const [a, c] = open; busy = true;
    if (cards[a.dataset.k].i === cards[c.dataset.k].i) {
      setTimeout(() => { a.classList.add('found'); c.classList.add('found'); SND.ok(); sparkleBurst(c, 8); open = []; busy = false; if (++found === words.length) { G.result = moves; gameWin('memory', `${moves} ${t('moves')}`, best => !best || moves < best); } }, 350);
    } else setTimeout(() => { a.classList.remove('flip'); c.classList.remove('flip'); open = []; busy = false; }, 900);
  });
}

/* --- toverbellen (tafels) --- */
function startBellen() {
  G.over = false; G.again = startBellen;
  gameShell(t('g_bellen'), `<div class="bq" id="bq"></div><div class="bfield" id="bfield"></div>`);
  let score = 0, a, b, ans; const end = Date.now() + 60000;
  const field = $('#bfield');
  const newQ = () => {
    a = rnd(2, 10); b = rnd(2, 10); ans = a * b;
    $('#bq').innerHTML = `${a} × ${b} = ?`;
    field.innerHTML = '';
    const opts = shuffle([ans, ...shuffle([...new Set([ans + a, ans - b, ans + 10, ans - 1, (a + 1) * b, a * (b - 1)].filter(x => x > 0 && x !== ans))]).slice(0, 3)]);
    opts.forEach((v, k) => {
      const e = document.createElement('button'); e.className = 'bubble-b'; e.textContent = v;
      e.style.left = (6 + k * 23 + rnd(0, 4)) + '%'; e.style.animationDuration = (5 + Math.random() * 2.5) + 's'; e.style.animationDelay = (k * .25) + 's';
      e.onclick = () => {
        if (G.over) return;
        if (v === ans) { score++; SND.pop(); sparkleBurst(e, 8); newQ(); }
        else { SND.boing(); e.classList.add('popped'); e.textContent = kies(['🐸', '🧦', '🍌', '🐔']); }
      };
      e.addEventListener('animationend', () => { if (!G.over && e.parentNode && v === ans) newQ(); });
      field.appendChild(e);
    });
  };
  newQ();
  G.timer = setInterval(() => {
    const left = end - Date.now(); $('#gstat').textContent = `⏱️ ${fmtSec(Math.max(0, left))} · 🫧 ${score}`;
    if (left <= 0) {
      G.result = score; field.innerHTML = '';
      if (score > 0) gameWin('bellen', `🫧 ${score} ${t('score')}`, best => score > (best || 0));
      else { clearInterval(G.timer); G.over = true; openGames(); }
    }
  }, 250);
}

/* =====================================================================
   STERRENTOREN (voortgang)
   ===================================================================== */
function openProgress() {
  const el = $('#progress'), c = D.counters;
  el.innerHTML = backbar(t('pl_sterren')) + `<div class="wrap"><h2 class="sect">${t('progress')}</h2>
    <div class="stats">${[['⭐', D.starsTotal, t('totalStars')], ['📝', c.quizzes, t('quizzes')], ['✅', c.correct, t('correctAns')], ['🔥', c.bestStreak, t('bestStreak')], ['📅', dayStreak(), t('days')]].map(([i, n, l]) => `<div class="stat card"><span>${i}</span><b>${n}</b><small>${l}</small></div>`).join('')}</div>
    ${SUBJECTS.map(s => `<div class="psub card" style="--sc:${s.color};--sl:${s.light}"><h3>${s.ico} ${t('subj_' + s.id)}</h3>${s.topics.map(tp => {
      const st = topicStatus(tp.key), a = topicAcc(tp.key), ts = D.topics[tp.key];
      return `<div class="prow"><span class="p-ico">${tp.ico}</span><span class="p-n">${tTopic(tp)}</span><span class="pbar"><i style="width:${a == null ? 0 : Math.round(a * 100)}%"></i></span>
        <span class="p-v">${a == null ? `<small>${t('notYet')}</small>` : Math.round(a * 100) + '% ' + t('accuracy')}</span><span class="spill ${st}">${statusName(st)}</span>
        <button class="btn small ghost" data-learn="${tp.key}">📖</button><button class="btn small" data-play="${tp.key}">✨</button></div>`;
    }).join('')}</div>`).join('')}
    <h2 class="sect">${t('badges')}</h2><div class="badges">${BADGES.map(b => `<div class="badge ${D.badges[b[0]] ? 'on' : ''}"><span>${b[1]}</span><b>${b[2]}</b><small>${b[3]}</small></div>`).join('')}</div></div>`;
  bindCommon(el);
  $$('[data-learn]', el).forEach(b => b.onclick = () => openLesson(b.dataset.learn, 0, 'class'));
  $$('[data-play]', el).forEach(b => b.onclick = () => openSetup(b.dataset.play));
  show('progress');
}

/* =====================================================================
   GRAPPENZOLDER, GEHEIME TUIN, EILANDFEEST
   ===================================================================== */
function openJokes() {
  const el = $('#jokes');
  el.innerHTML = backbar(t('pl_zolder')) + `<div class="wrap narrow"><h2 class="sect">${t('jokesTitle')} <span class="muted">${D.jokes.length} / ${JOKES.length}</span></h2>
    ${D.jokes.length ? `<div class="jokelist">${D.jokes.map(i => `<button class="joke card"><b>${JOKES[i][0]}</b><span class="punch">${JOKES[i][1]}</span><small>${t('tapAnswer')}</small></button>`).join('')}</div>` : `<div class="card center">${pipSVG('blij')}<p>${t('jokesNone')}</p></div>`}</div>`;
  bindCommon(el);
  $$('.joke', el).forEach(j => j.onclick = () => { j.classList.toggle('open'); SND.pop(); });
  show('jokes');
}
function openGarden() {
  const el = $('#garden');
  const flower = st => ({ nieuw: '🌱', oefenen: '🌿', goed: '🌷', super: '🌺' }[st]);
  el.innerHTML = backbar(t('pl_tuin')) + `<div class="wrap"><div class="card center garden-intro">${pipSVG('lach')}<p>${t('gardenTitle')}</p><p class="legend">🌱 ${statusName('nieuw')} · 🌿 ${statusName('oefenen')} · 🌷 ${statusName('goed')} · 🌺 ${statusName('super')}</p></div>
    ${SUBJECTS.map(s => `<div class="bed" style="--sc:${s.color};--sl:${s.light}"><h3>${s.ico} ${t('subj_' + s.id)}</h3><div class="plots">${s.topics.map(tp => { const st = topicStatus(tp.key); return `<div class="plot st-${st}"><span class="fl">${flower(st)}</span><small>${tTopic(tp)}</small></div>`; }).join('')}</div></div>`).join('')}</div>`;
  bindCommon(el); show('garden');
}
function openParty() {
  const el = $('#party'), pets = D.owned.pet.filter(p => p !== 'geen');
  const d = new Date();
  el.innerHTML = backbar(t('pl_feest')) + `<div class="wrap narrow"><div class="party card"><div class="dance">${avatarSVG(look(), 'lach', 'dancer')}${pets.map((p, i) => petSVG(p, 'dancer d' + (i % 3))).join('')}${pipSVG('lach', 'dancer')}</div>
    <h2>${t('partyTitle')}</h2>
    <div class="diploma"><div class="dp-t">🎓 ${t('certificate')}</div><div class="dp-n">${esc(playerName())}</div><div class="dp-s">⭐ ${D.starsTotal} · ✅ ${D.counters.correct} · 🏅 ${Object.keys(D.badges).length}</div><div class="dp-d">${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} · Toverschool Sterrenlicht</div></div></div></div>`;
  bindCommon(el); show('party'); SND.fanfare(); confetti(200);
}

/* =====================================================================
   INSTELLINGEN
   ===================================================================== */
function applySettings() {
  document.body.classList.toggle('noanim', !D.settings.anim);
  document.body.classList.toggle('big', !!D.settings.big);
  document.documentElement.lang = lang() === 'pap' ? 'pap' : lang();
  document.title = t('appName');
}
function openSettings() {
  const tg = (k, label) => `<div class="setrow"><span>${label}</span><button class="toggle ${D.settings[k] ? 'on' : ''}" data-set="${k}">${D.settings[k] ? t('on') : t('off')}</button></div>`;
  modal(`<h2>⚙️ ${t('settings')}</h2>
    <div class="setrow col"><span>${t('language')}</span><div class="langs">${LANGS.map(([c, f, n]) => `<button class="chip ${lang() === c ? 'on' : ''}" data-lang="${c}">${f} ${n}</button>`).join('')}</div></div>
    ${tg('sound', '🔊 ' + t('sound'))}${tg('anim', '✨ ' + t('anim'))}${tg('big', '🔠 ' + t('bigText'))}${tg('jokes', '😂 ' + t('pipJokes'))}
    <button class="btn ghost wide" id="editme">${t('editMe')}</button>
    <details class="parents"><summary>${t('forParents')}</summary><p>${t('parentInfo')}</p><p class="muted">${t('contentNote')}</p><button class="btn ghost wide danger" id="reset">${t('reset')}</button></details>`,
    [{ label: t('close'), cls: 'primary' }]);
  $$('[data-set]').forEach(b => b.onclick = () => { const k = b.dataset.set; D.settings[k] = !D.settings[k]; save(); applySettings(); b.classList.toggle('on'); b.textContent = D.settings[k] ? t('on') : t('off'); });
  $$('[data-lang]').forEach(b => b.onclick = () => { D.settings.lang = b.dataset.lang; save(); applySettings(); closeModal(); refreshCurrent(); openSettings(); });
  $('#editme').onclick = () => { closeModal(); wardTab = 'look'; openWardrobe(); };
  $('#reset').onclick = () => modal(`<div class="m-ico">${pipSVG('oeps')}</div><h2>${t('resetQ')}</h2><p>${t('resetSub')}</p>`,
    [{ label: t('cancel'), cls: 'primary' }, { label: t('resetYes'), cls: 'ghost danger', fn: () => { const l = D.settings.lang; D = defaults(); D.settings.lang = l; save(); applySettings(); openIntro(); } }]);
}
function refreshCurrent() {
  const r = { map: openMap, class: () => openClass(L.subject), wardrobe: openWardrobe, pets: openPets, games: openGames, progress: openProgress, jokes: openJokes, garden: openGarden, party: openParty, setup: renderSetup, lesson: renderLesson }[current];
  if (r) r();
}

/* =====================================================================
   INTRODUCTIE (eerste keer)
   ===================================================================== */
let introStep = 0, introLook = null;
function openIntro() {
  introStep = 0; introLook = Object.assign({}, DEFAULT_LOOK);
  if (!D.profile) D.profile = { name: '', look: introLook };
  renderIntro(); show('intro');
}
function renderIntro() {
  const el = $('#intro');
  let body = '', btn = t('continue');
  if (introStep === 0) body = `<div class="intro-pip">${pipSVG('lach')}</div><div class="bubble big">${t('introHi')}</div>
    <h3>${t('introLang')}</h3><div class="langs big">${LANGS.map(([c, f, n]) => `<button class="chip ${lang() === c ? 'on' : ''}" data-lang="${c}">${f} ${n}</button>`).join('')}</div>`;
  if (introStep === 1) body = `<div class="intro-pip">${pipSVG('blij')}</div><div class="bubble big">${t('introName')}</div><input id="introname" class="nameinp big" maxlength="16" placeholder="${t('namePh')}" value="${esc(D.profile.name || '')}" autocomplete="off">`;
  if (introStep === 2) body = `<h2>${t('introLook')}</h2><div class="ward"><div class="ward-prev card">${avatarSVG(introLook, 'blij')}</div><div class="ward-side">${lookPanel(introLook, null, false)}</div></div>`;
  if (introStep === 3) { body = `<div class="intro-done">${avatarSVG(introLook, 'lach')}${pipSVG('lach')}</div><div class="bubble big">${t('introDone', { n: esc(D.profile.name) })}</div>`; btn = t('letsGo'); }
  el.innerHTML = `<div class="wrap narrow intro"><div class="intro-title">✨ ${t('appName')} ✨</div>${body}<button class="btn primary huge" id="introgo">${btn}</button></div>`;
  $$('[data-lang]', el).forEach(b => b.onclick = () => { D.settings.lang = b.dataset.lang; save(); applySettings(); SND.click(); renderIntro(); });
  if (introStep === 2) bindLookPanel(el, introLook, renderIntro);
  $('#introgo').onclick = () => {
    if (introStep === 1) { const n = $('#introname').value.trim(); if (!n) { shake($('#introname')); return; } D.profile.name = n; }
    if (introStep === 3) {
      D.profile.look = introLook; addStars(10);
      try { if (localStorage.getItem('rekenuil-groep6-v1') && !D.gifts.rekenuil) { D.gifts.rekenuil = 1; addStars(20); setTimeout(() => toast(t('oldBonus'), 4000), 800); } } catch (e) { }
      save(); SND.fanfare(); confetti(150); openMap(); return;
    }
    introStep++; SND.click(); renderIntro();
    if (introStep === 1) setTimeout(() => { const i = $('#introname'); if (i) i.focus(); }, 100);
  };
}

/* ---------- starten ---------- */
applySettings();
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && $('#modal').dataset.closable !== '0') closeModal(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && current === 'quiz') pause(); else if (!document.hidden && current === 'quiz' && !$('#modal').classList.contains('show')) resume(); });
openMap();
window.Toverschool = { SUBJECTS, TOPIC, checkAnswer, answerText, D: () => D };
