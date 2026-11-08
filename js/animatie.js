/* =====================================================================
   LEVENDE SCHERMEN (v24): tikgloed, vallende sterren, personage dat zwaait
   en lacht, en een regenboog-golf bij een goed antwoord.
   Alles staat uit bij "Rustig" (D.settings.anim) en bij prefers-reduced-motion.
   ===================================================================== */
const reduceMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const animOK = () => !!(D && D.settings && D.settings.anim) && !reduceMotion() && !document.hidden;
const mapShown = () => { const m = document.getElementById('map'); return !!(m && m.classList.contains('active')); };

/* ---------- 1. een tik geeft een zacht lichtkringetje met sterretjes ---------- */
document.addEventListener('pointerdown', e => {
  if (!animOK()) return;
  const hit = e.target.closest && e.target.closest('button, .place, .item, .choice, .key, .opt, .chip, .tab, .hs');
  if (!hit || hit.disabled) return;
  const fx = document.createElement('div'); fx.className = 'tapfx'; fx.setAttribute('aria-hidden', 'true');
  fx.style.left = e.clientX + 'px'; fx.style.top = e.clientY + 'px';
  fx.innerHTML = '<i class="ring"></i>' + [0, 1, 2, 3, 4].map(i => `<b style="--a:${i * 72 + Math.floor(Math.random() * 30)}deg;--d:${26 + Math.floor(Math.random() * 16)}px">✦</b>`).join('');
  document.body.appendChild(fx); setTimeout(() => fx.remove(), 700);
}, { passive: true });

/* ---------- 2. vallende sterren boven de kaart ---------- */
function shootingStar() {
  if (!animOK() || !mapShown()) return;
  const s = document.createElement('div'); s.className = 'shoot'; s.setAttribute('aria-hidden', 'true');
  s.style.top = (6 + Math.random() * 24) + 'vh'; s.style.left = (30 + Math.random() * 60) + 'vw';
  document.body.appendChild(s); setTimeout(() => s.remove(), 1500);
}
(function loopStar() { setTimeout(() => { shootingStar(); loopStar(); }, 9000 + Math.random() * 9000); })();

/* ---------- 3. het personage op de kaart zwaait en lacht af en toe ---------- */
function heroEmote() {
  if (!animOK() || !mapShown()) return;
  const a = document.querySelector('#map .actor.me svg.avatar'); if (!a || typeof avatarSVG !== 'function') return;
  const mood = kies(['lach', 'knipoog', 'wow']), cls = a.getAttribute('class').replace(/\bpose-\w+|\bhopnow/g, '').replace(/^avatar\s*/, '');
  a.outerHTML = avatarSVG(look(), mood, cls + ' hopnow pose-zwaai');
  setTimeout(() => {
    const b = document.querySelector('#map .actor.me svg.avatar');
    if (b && mapShown()) b.outerHTML = avatarSVG(look(), 'blij', cls);
  }, 1700);
}
(function loopEmote() { setTimeout(() => { heroEmote(); loopEmote(); }, 14000 + Math.random() * 10000); })();

/* ---------- 4. goed antwoord: een gouden golf over het scherm ---------- */
{
  const _re = typeof castReact === 'function' ? castReact : null;
  document.addEventListener('animatie-goed', () => {
    if (!animOK()) return;
    const w = document.createElement('div'); w.className = 'winwave'; w.setAttribute('aria-hidden', 'true');
    document.body.appendChild(w); setTimeout(() => w.remove(), 900);
  });
  // het quiz-scherm geeft een melding via de bestaande klasse ".choice.right"; we kijken mee
  const mo = new MutationObserver(list => {
    for (const m of list) if (m.type === 'attributes' && m.target.classList && m.target.classList.contains('right') && m.target.classList.contains('choice') && !m.oldValue.includes('right')) { document.dispatchEvent(new Event('animatie-goed')); return; }
  });
  const q = document.getElementById('quiz'); if (q) mo.observe(q, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
}
