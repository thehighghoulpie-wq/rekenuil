'use strict';
/* =====================================================================
   Toverschool Sterrenlicht – de vriendjes (cast v2)
   Vijf getekende leraren en klasgenoten met hun maatje. De plaatjes staan
   in img/cast/. Meer houdingen later? Voeg een veld toe aan CAST2 (bijv.
   poses: { blij: 'img/cast/...' }) en laat castImg die gebruiken.
   Teksten: [nl, pap, en]. pap = null betekent: Nederlands tonen (Papiamentu
   moet eerst nagekeken worden: needs family check).
   ===================================================================== */
const CAST2 = [
  { id: 'kiko', name: 'Professor Kiko', img: 'img/cast/uitvinder.webp', col: '#2FA36B', subject: 'rekenen',
    job: ['Professor van Getallenmagie', null, 'Professor of Number Magic'], buddy: ['Krabbel, de heremietkreeft in het potje', null, 'Krabbel, the hermit crab in the jar'],
    line: ['Klik-klak! Eerst proberen, dan weten. Elke som is een proefje!', null, 'Click-clack! Try first, then you know. Every sum is an experiment!'] },
  { id: 'maanlicht', name: 'Juf Maanlicht', img: 'img/cast/maanboek.webp', col: '#7C6BD6', subject: 'taal',
    job: ['Juf van Woordspreuken', null, 'Teacher of Word Spells'], buddy: ['Wolkje, het konijntje', null, 'Wolkje, the little bunny'],
    line: ['Ssst, luister! Elk woord heeft een geheim. Zal ik voorlezen?', null, 'Shh, listen! Every word has a secret. Shall I read aloud?'] },
  { id: 'yuana', name: 'Shon Yuana', img: 'img/cast/vissertje.webp', col: '#14A3C7', subject: 'papiamentu',
    job: ['Shon van Eilandmagie', null, 'Teacher of Island Magic'], buddy: ['Flo, de flamingo', null, 'Flo, the flamingo'],
    line: ['Bon bini! Vandaag duiken we in de taal van Curaçao.', 'Bon bini! Awe nos ta bula den e idioma di Kòrsou.', 'Bon bini! Today we dive into the language of Curaçao.'] },
  { id: 'nova', name: 'Nova', img: 'img/cast/sterrenstaf.webp', col: '#A56BE0', subject: null,
    job: ['Klasgenoot en gids', null, 'Classmate and guide'], buddy: ['Miepie, de sterrenkat', null, 'Miepie, the star cat'],
    line: ['Hoera! Samen toveren we het mooist. Een high five?', null, 'Hooray! Together we make the best magic. High five?'] },
  { id: 'dax', name: 'Dax', img: 'img/cast/uilridder.webp', col: '#5D5470', subject: null,
    job: ['Klasgenoot van de Uitdagingen', null, 'Classmate of the Challenges'], buddy: ['Oeloe, het uiltje', null, 'Oeloe, the little owl'],
    line: ['Een dappere poging is altijd goed. Een fout is een spreuk die nog oefent!', null, 'A brave try is always good. A mistake is a spell that is still practising!'] }
];
const CASTIMG = {}; CAST2.forEach(c => CASTIMG[c.id] = c);

// plaatje van een vriendje (neemt de plaats van de oude getekende leraren)
function castImg(id, cls = '') {
  const c = CASTIMG[id]; if (!c) return '';
  return `<img class="teacher cast-img ${cls}" src="${c.img}" alt="${esc(c.name)}" width="640" height="685" draggable="false">`;
}

function openFriends() {
  const el = $('#friends');
  el.innerHTML = backbar('🧙 ' + t('friendsTitle')) + `<div class="wrap"><p class="muted center">${t('friendsSub')}</p>
    <div class="friends">${CAST2.map((c, i) => `<button class="friend card" data-i="${i}" style="--fc:${c.col}" aria-label="${esc(c.name)}">
      ${castImg(c.id, 'fimg')}<b>${esc(c.name)}</b><span class="fjob">${esc(tri(c.job))}</span><span class="fbuddy">🐾 ${esc(tri(c.buddy))}</span>
      <span class="fline bubble small">${esc(tri(c.line))}</span></button>`).join('')}</div></div>`;
  bindCommon(el); show('friends');
  $$('.friend', el).forEach(b => b.onclick = () => {
    SND.click(); const open = b.classList.contains('open');
    $$('.friend.open', el).forEach(x => x.classList.remove('open'));
    if (!open) { b.classList.add('open'); move($('.fimg', b), 'jelly'); }
  });
  stagger($$('.friend', el), 'pop', 60, 100);
}
