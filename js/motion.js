'use strict';
/* =====================================================================
   Beweging: één set veerkrachtige bewegingen voor de hele app.
   Alleen transform en opacity (soepel op de tablet). Alles staat uit met
   de knop "Animaties" of de instelling "minder beweging" van de tablet.
   ===================================================================== */
const motionOK = () => D.settings.anim && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) && !!Element.prototype.animate;

// Een veer (licht doorschieten, dan stil), één keer uitgerekend als lineaire curve.
const SPRING = (() => {
  const z = .48, w = 14, wd = w * Math.sqrt(1 - z * z), pts = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push((1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + z * w / wd * Math.sin(wd * t))).toFixed(3)); }
  pts[40] = '1';
  const css = `linear(${pts.join(', ')})`;
  return window.CSS && CSS.supports && CSS.supports('animation-timing-function', css) ? css : 'cubic-bezier(.3, 1.5, .5, 1)';
})();

const MOVES = {
  pop: [[{ transform: 'scale(.5)', opacity: 0 }, { transform: 'none', opacity: 1 }], 560, SPRING],
  inUp: [[{ transform: 'translateY(22px) scale(.96)', opacity: 0 }, { transform: 'none', opacity: 1 }], 620, SPRING],
  jelly: [[{ transform: 'none' }, { transform: 'scale(1.14, .86)', offset: .22 }, { transform: 'scale(.93, 1.08)', offset: .45 }, { transform: 'scale(1.04, .97)', offset: .7 }, { transform: 'none' }], 560, 'ease-out'],
  nope: [[{ transform: 'none' }, { transform: 'translateX(-9px) rotate(-2deg)', offset: .2 }, { transform: 'translateX(8px) rotate(2deg)', offset: .45 }, { transform: 'translateX(-4px)', offset: .7 }, { transform: 'none' }], 460, 'ease-out'],
  hop: [[{ transform: 'none' }, { transform: 'translateY(3px) scale(1.08, .92)', offset: .14 }, { transform: 'translateY(-22px) scale(.95, 1.06)', offset: .45 }, { transform: 'translateY(0) scale(1.08, .92)', offset: .76 }, { transform: 'none' }], 640, 'ease-out'],
  think: [[{ transform: 'none' }, { transform: 'rotate(-9deg) translateY(-2px)', offset: .3 }, { transform: 'rotate(-6deg)', offset: .75 }, { transform: 'none' }], 1100, 'ease-in-out'],
  dance: [[{ transform: 'none' }, { transform: 'translateY(-14px) rotate(-8deg)', offset: .2 }, { transform: 'translateY(0) rotate(0)', offset: .4 }, { transform: 'translateY(-14px) rotate(8deg)', offset: .6 }, { transform: 'translateY(0) rotate(0)', offset: .8 }, { transform: 'none' }], 1300, 'ease-in-out'],
  starIn: [[{ transform: 'scale(0) rotate(-50deg)', opacity: 0 }, { transform: 'scale(1.3) rotate(10deg)', opacity: 1, offset: .6 }, { transform: 'none', opacity: 1 }], 620, 'ease-out'],
  release: [[{ transform: 'scale(.93)' }, { transform: 'none' }], 420, SPRING]
};
// Speel een beweging af op een element. Zonder animaties gebeurt er niets (de eindstand is altijd de gewone stand).
function move(el, name, opt = {}) {
  if (!el || !motionOK()) return null;
  const [kf, dur, ease] = MOVES[name];
  const d = opt.duration || dur, wait = opt.delay || 0;
  let a; try { a = el.animate(kf, { duration: d, easing: opt.easing || ease, delay: wait, fill: 'backwards' }); } catch (e) { return null; }
  // vangnet: als de tablet de beweging niet kan afspelen, staat alles toch netjes op zijn plek
  setTimeout(() => { try { if (a.playState !== 'finished') a.finish(); } catch (e) { } }, wait + d + 400);
  return a;
}
// Een rijtje elementen één voor één laten verschijnen.
function stagger(els, name = 'inUp', gap = 45, start = 0, max = 14) {
  if (!motionOK()) return;
  [...els].forEach((el, i) => move(el, name, { delay: start + Math.min(i, max) * gap }));
}

/* ---------- knoppen voelen zacht en veerkrachtig ----------
   Indrukken = even kleiner; loslaten = met een veertje terug. */
const PRESSABLE = '.btn, .choice, .place, .key, .chip, .tab, .iconbtn, .sw, .hs, .ow, .tw, .ansbox, .pipbox, .actor';
let pressed = null;
document.addEventListener('pointerdown', e => {
  const el = e.target.closest && e.target.closest(PRESSABLE);
  if (!el || el.disabled || !motionOK()) return;
  pressed = el;
  try { el._press = el.animate([{ transform: 'none' }, { transform: 'scale(.93)' }], { duration: 90, easing: 'ease-out', fill: 'forwards' }); } catch (err) { }
}, { passive: true });
const letGo = () => {
  const el = pressed; pressed = null; if (!el) return;
  if (el._press) { el._press.cancel(); el._press = null; }
  if (el.isConnected) move(el, 'release');
};
['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => document.addEventListener(ev, letGo, { passive: true }));

/* ---------- Pip reageert ---------- */
function pipReact(box, mood, how) {
  if (!box) return;
  box.innerHTML = pipSVG(mood);
  move(box.firstElementChild, how || (mood === 'lach' ? 'hop' : mood === 'oeps' ? 'think' : 'pop'));
}
