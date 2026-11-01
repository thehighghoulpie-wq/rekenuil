'use strict';
/* =====================================================================
   Dag en nacht: de app volgt de klok van de tablet.
   Dag 06:30–18:00, schemering tot 19:00, daarna de sterrenhemel.
   Alleen de klok: geen locatie, geen internet. Ouders kunnen het vastzetten.
   ===================================================================== */
const THEMES = ['auto', 'day', 'night'];
function themeNow() {
  const s = D.settings.theme || 'auto';
  if (s !== 'auto') return s;
  const d = new Date(), m = d.getHours() * 60 + d.getMinutes();
  return m >= 390 && m < 1080 ? 'day' : m >= 1080 && m < 1140 ? 'dusk' : 'night';
}
function applyTheme() {
  const th = themeNow(), b = document.body;
  if (b.dataset.theme === th) return;
  b.dataset.theme = th;
  b.classList.toggle('dark', th !== 'day');
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = { day: '#2FA8EE', dusk: '#3B2F7E', night: '#0B1450' }[th];
}
setInterval(applyTheme, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) applyTheme(); });

/* ---------- de haven van Willemstad: Handelskade en de Emmabrug ----------
   Lagen: lucht, wolken, zee, huizen, brug en (alleen 's avonds) de lichtjes.
   Dag en nacht wisselen door de lagen in en uit te laten vloeien. */
function sceneHTML(actors = '') {
  const L = (f, c) => `<img class="l ${c}" src="img/scene/${f}.svg" alt="" draggable="false">`;
  return `<div class="scene"><div class="layers" role="img" aria-label="${t('sceneAlt')}">
    ${L('sky-day', 'day')}${L('sky-night', 'night')}${L('clouds', 'day clouds')}${L('sea-day', 'day sea')}${L('sea-night', 'night sea')}
    ${L('houses', 'town')}${L('bridge', 'town')}${L('lights', 'night lights')}</div>${actors}</div>`;
}
