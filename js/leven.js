'use strict';
/* =====================================================================
   Toverschool 2.0, stap C: Pip en het plezier
   - een ster vliegt naar de tegenstand bij een goed antwoord
   - Pip's mond beweegt mee met de stem (opgenomen familiestem: volume; computerstem: ritme)
   - scènes als gegevens: { stappen: [{ t, zeg, stem, beweeg, geluid }] }
   - Rustmoment (ademen met Pip) en een poets-timer met een eigen liedje
   Alles uit bij "minder beweging"; geen straf, geen druk.
   ===================================================================== */

/* ---------- ster vliegt naar de teller ---------- */
function starFly(from) {
  if (!motionOK() || !from) return;
  const to = $('#qpts') || $('.starcount'); if (!to) return;
  const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const s = document.createElement('div'); s.className = 'flystar'; s.textContent = '⭐';
  s.style.cssText = `left:${a.left + a.width / 2 - 14}px;top:${a.top + Math.min(a.height / 2, 80) - 14}px`;
  document.body.appendChild(s);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + Math.min(a.height / 2, 80));
  const an = s.animate([{ transform: 'translate(0,0) scale(.1)', opacity: 0 }, { transform: 'translate(0,-14px) scale(1.25)', opacity: 1, offset: .25 }, { transform: 'translate(0,-14px) scale(1.25)', opacity: 1, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(.6)`, opacity: .9 }], { duration: 1100, easing: 'cubic-bezier(.3,.7,.3,1)' });
  const end = () => { s.remove(); tone([784, 1175], .18, 'sine', .04); move(to.closest('.pill') || to, 'pop'); };
  an.onfinish = end; setTimeout(() => { if (s.isConnected) end(); }, 1500);   // vangnet
}

/* ---------- Pip's mond volgt de stem ---------- */
let LIP = { t: 0, raf: 0, ctx: null };
function pipMouthEls() { return $$('.screen.active .pip .pip-mouth, .screen.active .pip-actor .pip-mouth, .modal.show .pip .pip-mouth'); }
function pipLipStop() { cancelAnimationFrame(LIP.raf); clearInterval(LIP.t); $$('.pip.talk, .cast-img.talk').forEach(p => p.classList.remove('talk')); pipMouthEls().forEach(m => { m.style.transform = ''; }); }
function pipLipAudio(audio) {
  pipLipStop(); if (!motionOK()) return;
  const pips = $$('.screen.active .pip, .screen.active .cast-img'); pips.forEach(p => p.classList.add('talk'));
  try {
    LIP.ctx = LIP.ctx || new (window.AudioContext || window.webkitAudioContext)();
    const src = LIP.ctx.createMediaElementSource(audio), an = LIP.ctx.createAnalyser(); an.fftSize = 256; src.connect(an); an.connect(LIP.ctx.destination);
    const buf = new Uint8Array(an.frequencyBinCount), mouths = pipMouthEls();
    const loop = () => {
      an.getByteFrequencyData(buf); const v = buf.reduce((a, b) => a + b, 0) / buf.length / 255;
      mouths.forEach(m => { m.style.transformOrigin = '100px 128px'; m.style.transform = `scaleY(${(.6 + Math.min(1.6, v * 5)).toFixed(2)})`; });
      if (!audio.paused && !audio.ended) LIP.raf = requestAnimationFrame(loop); else pipLipStop();
    };
    audio.addEventListener('ended', pipLipStop, { once: true }); loop();
  } catch (e) { audio.addEventListener('ended', pipLipStop, { once: true }); }
}
// een opgenomen stem afspelen: Pip praat mee
{ const _vp = voicePlay; voicePlay = k => _vp(k).then(r => { if (typeof voiceAudio !== 'undefined' && voiceAudio) pipLipAudio(voiceAudio); return r; }); }
// een computerstem: Pip praat zolang hij praat
{ const _sp = speakNL; speakNL = (txt, el) => { _sp(txt, el); try { if (window.speechSynthesis && window.speechSynthesis.speaking && motionOK()) { pipLipStop(); $$('.screen.active .pip, .screen.active .cast-img').forEach(p => p.classList.add('talk')); LIP.t = setInterval(() => { if (!window.speechSynthesis.speaking) pipLipStop(); }, 300); } } catch (e) { } }; }

/* ---------- scènes als gegevens ---------- */
// { stappen: [{ t: ms, zeg: 'tekst', stem: 'zwaai', beweeg: 'hop', geluid: 'pop', klaar: fn }] }
function speel(el, scene, done) {
  const timers = []; let ended = false;
  el.innerHTML = `<div class="scene2"><div class="sc2-pip" id="sc2pip">${pipSVG(scene.start || 'blij')}</div><div class="bubble big" id="sc2say" aria-live="polite"></div></div>`;
  const pip = $('#sc2pip', el), say = $('#sc2say', el);
  const end = () => { if (ended) return; ended = true; timers.forEach(clearTimeout); if (done) done(); };
  scene.stappen.forEach(st => timers.push(setTimeout(() => {
    if (!el.isConnected) return end();
    if (st.zeg != null) { say.innerHTML = st.zeg; if (typeof move === 'function') move(say, 'pop'); }
    if (st.stem) { pip.innerHTML = pipSVG(st.stem); }
    if (st.beweeg && typeof move === 'function') move(pip, st.beweeg);
    if (st.geluid && SND[st.geluid]) SND[st.geluid]();
    if (st.klaar) st.klaar();
  }, st.t)));
  timers.push(setTimeout(end, (scene.stappen[scene.stappen.length - 1].t || 0) + 900));
  return { skip: end };
}

/* ---------- Rustmoment ---------- */
function startRust() {
  G.over = false; G.again = startRust;
  gameShell('🌙 ' + t('g_rust'), `<div class="rust"><div class="rust-pip" id="rustpip">${castImg('maanlicht', 'cast-idle')}</div><div class="rust-ring" id="rustring"><span id="rusttxt">${tri(['Klaar? Adem rustig mee met Pip.', 'Pronto? Rospiná trankil huntu ku Pip.', 'Ready? Breathe slowly with Pip.'])}</span></div>
    <div class="center"><button class="btn primary huge" id="rustgo">${tri(['Begin', 'Kuminsá', 'Start'])}</button></div></div>`);
  let timers = [], on = false;
  const stop = () => { timers.forEach(clearTimeout); timers = []; on = false; };
  const prev = G.timer; G.timer = null;
  $('#gback').onclick = () => { stop(); stopGame(); };
  $('#rustgo').onclick = () => {
    if (on) return; on = true; $('#rustgo').classList.add('hidden');
    const ring = $('#rustring'), txt = $('#rusttxt'); let c = 0, total = 6;
    const cycle = () => {
      if (!on || current !== 'game') return stop();
      if (c >= total) { txt.textContent = tri(['Goed gedaan. Wat een rustige tovenaar!', 'Bon hasi. Kuantu trankil!', 'Well done. What a calm wizard!']); ring.style.transform = 'scale(1)'; castReact($('#rustpip'), 'hart'); addStars(2); toast('⭐ +2'); return stop(); }
      txt.textContent = tri(['Adem in…', 'Hala rospiná…', 'Breathe in…']); ring.style.transform = 'scale(1.45)';
      timers.push(setTimeout(() => { txt.textContent = tri(['Adem uit…', 'Saka rospiná…', 'Breathe out…']); ring.style.transform = 'scale(1)'; }, 4000));
      timers.push(setTimeout(() => { c++; cycle(); }, 8000));
    };
    cycle();
  };
}

/* ---------- poets-timer met een eigen liedje ---------- */
Object.assign(SONGS, { poets: { title: 'Het poetsliedje', ico: '🪥', bpm: 108, lines: [
  ['Boven-kant, on-der-kant,', [['E4', 1], ['G4', 1], ['G4', 1], ['E4', 1], ['C4', 2]]],
  ['poets-poets, kring-kring-kring,', [['D4', 1], ['F4', 1], ['F4', 1], ['D4', 1], ['G4', 2]]],
  ['voor-kant, ach-ter-kant,', [['E4', 1], ['G4', 1], ['G4', 1], ['E4', 1], ['C4', 2]]],
  ['schoon en blin-kend, lach maar mee!', [['D4', 1], ['E4', 1], ['F4', 1], ['G4', 1], ['A4', 1], ['G4', 1], ['C5', 2]]]] } });
function startPoets() {
  G.over = false; G.again = startPoets;
  gameShell('🪥 ' + t('g_poets'), `<div class="rust"><div class="poets-t" id="poetsT">2:00</div><div class="poets-bar"><i id="poetsB"></i></div><div class="songlist"><div class="card pad songcard" id="poetsSong"></div></div>
    <div class="center"><button class="btn primary huge" id="poetsGo">${tri(['Start de timer', 'Kuminsá e timer', 'Start the timer'])}</button></div></div>`);
  WIDGETS.liedje($('#poetsSong'), { song: 'poets' });
  let iv = 0; const total = 120;
  $('#gback').onclick = () => { clearInterval(iv); stopGame(); };
  $('#poetsGo').onclick = () => {
    $('#poetsGo').classList.add('hidden'); const t0 = Date.now();
    iv = setInterval(() => {
      if (current !== 'game') return clearInterval(iv);
      const left = Math.max(0, total - Math.round((Date.now() - t0) / 1000)); $('#poetsT').textContent = `${Math.floor(left / 60)}:${pad2(left % 60)}`; $('#poetsB').style.width = (100 - left / total * 100) + '%';
      if (!left) { clearInterval(iv); $('#poetsT').textContent = '✨'; toast(tri(['Klaar! Schone tanden!', 'Pronto! Djente limpi!', 'Done! Clean teeth!']), 3500); SND.fanfare(); }
    }, 500);
  };
}
Object.assign(STR, {
  g_rust: ['Rustmoment', 'Momentu di rosamentu', 'Calm moment'], gs_rust: ['Een minuut ademen met Pip', 'Un minüt di rospiná ku Pip', 'One minute of breathing with Pip'],
  g_poets: ['Poets-timer', 'Timer pa limpia djente', 'Brushing timer'], gs_poets: ['Twee minuten met een liedje', 'Dos minüt ku un kantika', 'Two minutes with a song']
});
