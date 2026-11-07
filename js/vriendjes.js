'use strict';
/* =====================================================================
   De vriendjes overal (cast v2 uitgebreid)
   Elk vriendje heeft één getekend plaatje. Gevoelens maken we met beweging
   (huppen, wiebelen, knikken) en een klein wolkje (🎉 ❓ 💭 💤), zodat ze
   overal kunnen meedoen zonder dat er voor elke bui een nieuw plaatje is.
   - quiz: de leraar van het vak staat naast je en reageert op je antwoord
     (Nova bij de Toverdrank, Dax bij een Uitdaging)
   - uitslag: Nova viert mee, of de leraar troost en moedigt aan
   - kaart: Nova staat op de brug en vertelt grapjes
   - Mijn Eiland: alle vijf kun je neerzetten
   - voorlezen: ze knikken mee terwijl er gepraat wordt
   Uit bij "minder beweging": dan alleen het wolkje.
   ===================================================================== */

const CAST_BUBBLE = { cheer: '🎉', oeps: '💭', denk: '❓', wow: '❗', slaap: '💤', hart: '💜', blij: '✨', lach: '🎉' };
const CAST_SUBJ = { rekenen: 'kiko', taal: 'maanlicht', papiamentu: 'yuana' };

function castReact(box, mood) {
  const img = box && $('.cast-img', box); if (!img) return;
  const bubble = CAST_BUBBLE[mood] || '✨';
  if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
  const b = document.createElement('span'); b.className = 'castbub'; b.textContent = bubble; box.appendChild(b);
  setTimeout(() => b.remove(), 1500);
  if (!motionOK()) return;
  const A = {
    cheer: [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-22px) scale(1.08) rotate(-4deg)', offset: .3 }, { transform: 'translateY(0) scale(.96,1.04)', offset: .55 }, { transform: 'translateY(-14px) rotate(4deg)', offset: .78 }, { transform: 'translateY(0)' }],
    oeps: [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0)' }],
    blij: [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px) scale(1.04)', offset: .4 }, { transform: 'translateY(0) scale(.98,1.02)' }],
    denk: [{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg) translateY(-2px)', offset: .4 }, { transform: 'rotate(-8deg) translateY(-2px)', offset: .8 }, { transform: 'rotate(0)' }],
    slaap: [{ transform: 'translateY(0)' }, { transform: 'translateY(4px) scale(1,.97)' }, { transform: 'translateY(0)' }]
  };
  const key = mood === 'lach' ? 'cheer' : A[mood] ? mood : 'blij';
  img.animate(A[key], { duration: key === 'cheer' ? 850 : key === 'denk' ? 900 : 520, easing: 'ease-out' });
}
// overal waar Pip een bui kreeg: staat daar een vriendje, dan reageert die
{ const _pr = pipReact; pipReact = (box, mood, how) => { if (box && $('.cast-img', box)) return castReact(box, mood); return _pr(box, mood, how); }; }

/* ---------- quiz ---------- */
const castForQuiz = () => S.challenge ? 'dax' : S.potion || !S.subject ? 'nova' : CAST_SUBJ[S.subject] || 'nova';
function castQuizSwap() {
  const b = $('#qpip'); if (!b) return;
  const id = castForQuiz();
  if (b.dataset.cast !== id || !$('.cast-img', b)) { b.innerHTML = castImg(id, 'qcast cast-idle'); b.dataset.cast = id; }
}
{ const _rq = renderQuestion; renderQuestion = () => { _rq(); castQuizSwap(); }; }

/* ---------- uitslag ---------- */
{
  const _rr = renderResults;
  renderResults = r => {
    _rr(r);
    const el = $('#results'), p = $('.pipline .pip', el); if (!p) return;
    const id = r.stars >= 2 ? 'nova' : r.stars === 0 ? 'dax' : castForQuiz();
    p.outerHTML = castImg(id, 'tiny cast-idle');
    const line = $('.pipline', el);
    setTimeout(() => castReact(line, r.stars >= 2 ? 'cheer' : r.stars === 0 ? 'hart' : 'blij'), 600);
  };
}

/* ---------- kaart ---------- */
{
  const _om = onMapShown;
  onMapShown = el => {
    _om(el);
    const pj = $('#pipjoke', el); if (pj && !$('.cast-img', pj)) pj.innerHTML = castImg('nova', 'actor-cast cast-idle');
  };
}

/* ---------- Mijn Eiland: alle vijf neerzetten ---------- */
CAST2.forEach(c => { const it = { id: c.id, cat: 'vrienden', zone: 'land', name: c.name.replace(/^(Professor|Juf|Shon) /, ''), cast: c.id, act: 'hop' }; EI_ITEMS.push(it); EI_BY[c.id] = it; });
{ const _ea = eiArt; eiArt = (it, cell) => it.cast ? `<span class="ei-av">${castImg(it.cast, 'ei-cast')}</span>` : _ea(it, cell); }
