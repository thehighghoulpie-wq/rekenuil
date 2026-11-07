'use strict';
/* =====================================================================
   Nep-3D: diepte zonder 3D-motor
   - personages kantelen een beetje mee met je vinger of muis
   - een tik op je personage in de spiegel laat hem helemaal ronddraaien
   - de haven op de kaart en Mijn Eiland krijgen lagen die verschuiven
     (parallax), met de muis, je vinger of door de tablet te kantelen
   - zachte schaduwen onder personages (in de stijlen)
   Alles uit bij "minder beweging" en bij Animaties uit.
   ===================================================================== */

const D3_TILT = '.scene .actor, .ward-prev, .qpip, .res-art, .friend, .intro-done, .gcard';
const D3_PAR = '.scene, .ei-board';
let d3Tilted = null, d3Par = null, d3Gyro = 0;

const d3Clamp = (v, a = -1, b = 1) => Math.max(a, Math.min(b, v));
function d3Reset(el) { if (!el) return; el.style.transition = 'transform .45s ease-out'; el.style.transform = ''; }
function d3SetPar(el, px, py) { el.style.setProperty('--px', px.toFixed(3)); el.style.setProperty('--py', py.toFixed(3)); }

document.addEventListener('pointermove', e => {
  if (!motionOK() || !e.target.closest) return;
  const tilt = e.target.closest(D3_TILT);
  if (d3Tilted && d3Tilted !== tilt) { d3Reset(d3Tilted); d3Tilted = null; }
  if (tilt) {
    const r = tilt.getBoundingClientRect(), x = d3Clamp(((e.clientX - r.left) / r.width - .5) * 2), y = d3Clamp(((e.clientY - r.top) / r.height - .5) * 2);
    tilt.style.transition = 'transform .12s ease-out';
    tilt.style.transform = `perspective(520px) rotateY(${(x * 12).toFixed(1)}deg) rotateX(${(-y * 8).toFixed(1)}deg)`;
    d3Tilted = tilt;
  }
  const par = e.target.closest(D3_PAR);
  if (d3Par && d3Par !== par) { d3SetPar(d3Par, 0, 0); d3Par = null; }
  if (par) {
    const r = par.getBoundingClientRect();
    d3SetPar(par, d3Clamp(((e.clientX - r.left) / r.width - .5) * 2), d3Clamp(((e.clientY - r.top) / r.height - .5) * 2));
    d3Par = par;
  }
}, { passive: true });
document.addEventListener('pointerleave', () => { if (d3Tilted) d3Reset(d3Tilted); if (d3Par) d3SetPar(d3Par, 0, 0); d3Tilted = d3Par = null; }, { passive: true });
document.addEventListener('pointerup', e => { if (e.pointerType === 'touch') { if (d3Tilted) d3Reset(d3Tilted); if (d3Par) d3SetPar(d3Par, 0, 0); d3Tilted = d3Par = null; } }, { passive: true });

// tablet kantelen: de lagen schuiven mee (alleen op de kaart en op het eiland)
window.addEventListener('deviceorientation', e => {
  if (!motionOK() || d3Gyro || e.gamma == null) return;
  d3Gyro = requestAnimationFrame(() => {
    d3Gyro = 0;
    const target = current === 'map' ? $('.scene') : current === 'island' ? $('.ei-board') : null;
    if (target) d3SetPar(target, d3Clamp(e.gamma / 24), d3Clamp((e.beta - 45) / 24));
  });
}, { passive: true });

// een tik op je personage in de spiegel: helemaal rondjes draaien
function d3Spin(el) {
  if (!motionOK() || !el) return;
  el.animate([{ transform: 'perspective(600px) rotateY(0deg)' }, { transform: 'perspective(600px) rotateY(360deg) scale(1.04)', offset: .85 }, { transform: 'perspective(600px) rotateY(360deg)' }], { duration: 900, easing: 'cubic-bezier(.3,.7,.3,1)' });
  tone([523, 659, 784], .07, 'triangle', .04);
}
document.addEventListener('click', e => {
  const w = e.target.closest && e.target.closest('.ward-prev');
  if (w && !e.target.closest('button')) d3Spin(w);
});
