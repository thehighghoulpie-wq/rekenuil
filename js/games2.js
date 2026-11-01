'use strict';
/* =====================================================================
   Nieuwe spelletjes in de Speelzaal (Update 5)
   Koppelkoorts, Toverpiano, Eilandwandeling en Bellen met Wela.
   Geen levens en geen straf: een fout schudt alleen even.
   (De spelvariabelen staan in G, uit extra.js.)
   ===================================================================== */

/* --- Koppelkoorts: zoveel mogelijk paren in 60 seconden --- */
function startKoppel(kind) {
  if (!kind) {
    modal(`<h2>⚡ ${t('g_koppel')}</h2><div class="catgrid"><button class="chip" data-kk="tafels">✖️ ${t('kkTables')}</button><button class="chip" data-kk="woorden">🏝️ ${t('kkWords')}</button></div>`, [{ label: t('cancel'), cls: 'ghost' }]);
    $$('[data-kk]').forEach(b => b.onclick = () => { closeModal(); startKoppel(b.dataset.kk); });
    return;
  }
  G.over = false; G.again = () => startKoppel(kind);
  const words = kind === 'woorden' ? catWords('all', 60) : [];
  let wi = 0, score = 0, run = 0, sel = null; const end = Date.now() + 60000;
  const used = () => $$('.kk[data-s="r"]').map(b => b.dataset.v);
  const newPair = () => {
    for (let n = 0; n < 30; n++) {
      if (kind === 'tafels') { const a = rnd(2, 10), b = rnd(2, 10), v = String(a * b); if (!used().includes(v)) return [`${a} × ${b}`, v, v]; }
      else { const w = words[wi++ % words.length]; if (!used().includes(w[1])) return [`<span class="pap">${w[0]}</span>`, `${w[2]} ${w[1]}`, w[1]]; }
    }
    return ['?', '?', String(Math.random())];
  };
  gameShell('⚡ ' + t('g_koppel'), `<p class="muted center">${t('gs_koppel')}</p><div class="match koppel"><div class="mcol" id="kkl"></div><div class="mcol" id="kkr"></div></div>`);
  const L = $('#kkl'), R = $('#kkr');
  const fill = (li, ri) => {
    const [q, a, v] = newPair(), id = 'p' + Math.random().toString(36).slice(2, 7);
    const lb = `<button class="mt kk" data-s="l" data-id="${id}">${q}</button>`, rb = `<button class="mt kk" data-s="r" data-id="${id}" data-v="${esc(v)}">${a}</button>`;
    if (li == null) { L.insertAdjacentHTML('beforeend', lb); R.insertAdjacentHTML('beforeend', rb); }
    else { L.children[li].outerHTML = lb; R.children[ri].outerHTML = rb; move(L.children[li], 'pop'); move(R.children[ri], 'pop'); }
  };
  for (let i = 0; i < 4; i++) fill();
  // de rechterkant door elkaar
  [...R.children].sort(() => Math.random() - .5).forEach(c => R.appendChild(c));
  $('.koppel').addEventListener('click', e => {
    const b = e.target.closest('.kk'); if (!b || G.over) return;
    if (!sel || sel.dataset.s === b.dataset.s) { $$('.kk.sel').forEach(x => x.classList.remove('sel')); sel = b; b.classList.add('sel'); SND.click(); return; }
    if (sel.dataset.id === b.dataset.id) {
      score++; run++; okTone(run); buzz(10); sparkleBurst(b, 6);
      const l = sel.dataset.s === 'l' ? sel : b, r = l === sel ? b : sel;
      fill([...L.children].indexOf(l), [...R.children].indexOf(r)); sel = null;
    } else { run = 0; SND.boing(); shake(b); shake(sel); sel.classList.remove('sel'); sel = null; }
  });
  G.timer = setInterval(() => {
    const left = end - Date.now(); $('#gstat').textContent = `⏱️ ${fmtSec(Math.max(0, left))} · ⚡ ${score}`;
    if (left <= 0) { G.result = score; if (score > 0) gameWin('koppel', `⚡ ${score} ${t('kkPairs')}`, best => score > (best || 0)); else { clearInterval(G.timer); G.over = true; openGames(); } }
  }, 250);
}

/* --- Toverpiano: vrij spelen, of een melodietje van Pip naspelen --- */
const NOTES = [['do', 262], ['re', 294], ['mi', 330], ['fa', 349], ['sol', 392], ['la', 440], ['si', 494], ['do', 523]];
function startPiano() {
  G.over = false; G.again = startPiano;
  gameShell('🎹 ' + t('g_piano'), `<div class="pianotop"><div id="ppip">${pipSVG('blij')}</div><div class="bubble" id="psay">${t('pianoHi')}</div></div>
    <div class="piano">${NOTES.map(([n], i) => `<button class="pkey k${i}" data-i="${i}"><span>${n}</span></button>`).join('')}</div>
    <div class="center"><button class="btn primary" id="pplay">🎵 ${t('pianoListen')}</button></div>`);
  let mel = [], pos = 0, len = 3, busy = false, repeat = false;
  const say = s => { $('#psay').textContent = s; pipTalk($('#ppip')); };
  const play = i => { tone([NOTES[i][1]], .34, 'triangle', .08); const k = $(`.pkey[data-i="${i}"]`); if (k) { k.classList.add('on'); setTimeout(() => k.classList.remove('on'), 260); } };
  const newMel = () => { mel = Array.from({ length: len }, () => rnd(0, 7)); };
  $('#gstat').textContent = `🎵 ${len}`;
  $('#pplay').onclick = () => {
    if (busy) return; if (!mel.length) newMel();
    busy = true; repeat = false; say(t('pianoWatch'));
    mel.forEach((n, i) => setTimeout(() => { if (G.over) return; play(n); if (i === mel.length - 1) setTimeout(() => { busy = false; repeat = true; pos = 0; say(t('pianoYou')); }, 450); }, 450 + i * 520));
  };
  $$('.pkey').forEach(k => k.onclick = () => {
    if (busy || G.over) return; const i = +k.dataset.i; play(i); buzz(6);
    if (!repeat) return;
    if (i !== mel[pos]) { repeat = false; pipReact($('#ppip'), 'oeps'); say(t('pianoAgain')); return; }
    if (++pos < mel.length) return;
    repeat = false; sparkleBurst(k, 8); pipReact($('#ppip'), 'dans');
    if (len >= 6) { D.counters.piano++; G.result = len; gameWin('piano', `🎵 ${len} ${t('pianoNotes')}`, best => len > (best || 0)); return; }
    len++; newMel(); $('#gstat').textContent = `🎵 ${len}`; say(t('pianoNext', { n: len }));
  });
}

/* --- Eilandwandeling: tik op dingen in de haven en leer het woord --- */
// alleen woorden die al zijn nagekeken (PAP_VERIFIED)
const WALKS = [
  { cat: 'eten', ico: '🍽️', title: ['Vind 3 dingen om te eten', null, 'Find 3 things to eat'] },
  { cat: 'dieren', ico: '🐾', title: ['Vind 3 dieren', null, 'Find 3 animals'] },
  { cat: 'familie', ico: '👨‍👩‍👧', title: ['Vind 3 familieleden', null, 'Find 3 family members'] }
];
function startWalk() {
  const w = WALKS[D.counters.walks % WALKS.length], ok = c => PAP[c].filter(x => PAP_VERIFIED.has(x[0]));
  const targets = shuffle(ok(w.cat)).slice(0, 3), others = shuffle(WALKS.filter(x => x !== w).flatMap(x => ok(x.cat))).slice(0, 5);
  const items = shuffle([...targets.map(x => [...x, 1]), ...others.map(x => [...x, 0])]);
  const spots = shuffle([[6, 56], [18, 70], [30, 58], [42, 72], [56, 57], [68, 71], [80, 58], [91, 72]]);
  G.over = false; G.again = startWalk;
  gameShell('🚶 ' + t('g_walk'), `<div class="walkq card"><b>${w.ico} ${tri(w.title)}</b> <span class="pill" id="wfound">0/${targets.length}</span></div>
    <div class="walkscene">${sceneHTML('')}${items.map((x, i) => `<button class="witem" data-i="${i}" style="left:${spots[i][0]}%;top:${spots[i][1]}%" aria-label="${esc(x[1])}">${x[2]}</button>`).join('')}</div>
    <div class="walkcard card" id="wcard" aria-live="polite">${pipSVG('zwaai', 'tiny')}<span>${t('walkTap')}</span></div>`);
  let found = 0;
  $$('.witem').forEach(b => b.onclick = () => {
    const x = items[+b.dataset.i]; SND.pop(); move(b, 'hop');
    $('#wcard').innerHTML = `<span class="wc-e">${x[2]}</span><div><b class="pap big">${x[0]}</b> ${voiceBtn(x[0])}<br><span>${x[1]}</span></div>`;
    if (x[3] && !b.classList.contains('got')) {
      b.classList.add('got'); found++; okTone(found); sparkleBurst(b, 8); $('#wfound').textContent = `${found}/${targets.length}`;
      if (found === targets.length) { D.counters.walks++; G.result = D.counters.walks; setTimeout(() => gameWin('walk', `${w.ico} ${tri(w.title)} ✅`, () => true), 700); }
    }
  });
}

/* --- Bellen met Wela: een gesprekje in het Papiamentu ---
   Elke beurt: wat Wela zegt, en twee antwoorden (het eerste is het goede).
   Alle zinnen komen uit de woordenlijst van de app, zodat ze dezelfde controle krijgen. */
const WELA_CALLS = [
  [['Bon dia', ['Bon dia', 'Bon nochi']], ['Kon ta bai?', ['Mi ta bon', 'Kon bo yama?']], ['Mi stima bo.', ['Mi stima bo.', 'Mi tin sed.']], ['Te mañan', ['Ayó', 'Bon bini']]],
  [['Bon tardi', ['Bon tardi', 'Bon dia']], ['Kon ta bai?', ['Mi tin hamber.', 'Di nada']], ['Bon probechu', ['Danki', 'Bon nochi']], ['Te aworo', ['Ayó', 'Por fabor']]],
  [['Bon bini', ['Danki', 'Mi no sa.']], ['Ban hunga!', ['Ban hunga!', 'Bon probechu']], ['Masha danki', ['Di nada', 'Bon dia']], ['Ayó', ['Ayó', 'Kon bo yama?']]]
];
const WELA_LOOK = { skin: 3, hair: 'knot', hairColor: 9, eyes: 0, outfit: 'curacao', hat: 'geen', wand: 'ster', pet: 'geen', bril: 'rond', oorbel: 'knopje', brows: 'zacht' };
const papMeaning = p => (ALLPAP.find(x => x[0] === p) || [p, ''])[1];
function startWela() {
  const call = WELA_CALLS[D.counters.calls % WELA_CALLS.length];
  G.over = false; G.again = startWela;
  gameShell('📞 ' + t('g_wela'), `<div class="phone card"><div class="ph-top">${avatarSVG(WELA_LOOK, 'blij', 'small wela-av')}<div><b>Wela</b><div class="muted" id="phstate">${t('welaRing')}</div></div></div>
    <div class="chat" id="chat"></div><div class="replies" id="replies"><button class="btn primary huge" id="pickup">📞 ${t('welaPickup')}</button></div></div>`);
  const av = $('.wela-av'); av.classList.add('ringing');
  const ring = setInterval(() => { if (G.over || !$('#pickup')) return clearInterval(ring); tone([880, 988], .08, 'sine', .04); }, 1200);
  let turn = 0;
  const chat = $('#chat'), rep = $('#replies');
  const bubble = (who, p) => { chat.insertAdjacentHTML('beforeend', `<div class="msg ${who}"><b class="pap">${p}</b> ${voiceBtn(p)}<small>${papMeaning(p)}</small></div>`); move(chat.lastElementChild, 'inUp'); chat.scrollTop = chat.scrollHeight; };
  const welaSays = () => {
    if (turn >= call.length) {
      D.counters.calls++; $('#phstate').textContent = t('welaBye'); rep.innerHTML = '';
      return setTimeout(() => gameWin('wela', `📞 ${t('welaDone')}`, () => true), 900);
    }
    const [line, opts] = call[turn];
    $('#phstate').textContent = t('welaTalking'); bubble('wela', line); tone([392, 523], .08, 'sine', .04);
    rep.innerHTML = shuffle(opts.map((o, i) => [o, i === 0])).map(([o, good]) => `<button class="btn reply" data-good="${good ? 1 : 0}"><span class="pap">${o}</span></button>`).join('');
    $$('.reply', rep).forEach(b => b.onclick = () => {
      const p = b.textContent.trim();
      if (b.dataset.good === '1') { okTone(turn + 1); buzz(10); bubble('me', p); rep.innerHTML = ''; turn++; setTimeout(welaSays, 900); }
      else { SND.boing(); shake(b); b.disabled = true; toast(`💡 ${t('welaHint', { w: line, m: papMeaning(line) })}`, 3600); }
    });
  };
  $('#pickup').onclick = () => { clearInterval(ring); av.classList.remove('ringing'); SND.pop(); rep.innerHTML = ''; setTimeout(welaSays, 400); };
}
