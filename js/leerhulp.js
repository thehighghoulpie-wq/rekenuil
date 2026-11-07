'use strict';
/* =====================================================================
   Toverschool 2.0, stap A: de lesmotor
   1. Foute vragen komen later in dezelfde les nog één keer terug.
   2. Hulp die vanzelf opklimt (nooit straf): hulpknop wiebelt, Pip biedt de
      uitleg aan, bij een keuzevraag haalt Pip één fout antwoord weg.
   3. "Bijna!": een korte opmerking bij een fout getal (1 ernaast, cijfers
      omgedraaid, tientallen/honderdtallen).
   4. Niveau per vak: rekenen, taal en Papiamentu kunnen elk een stapje
      makkelijker of moeilijker staan dan de groep. Pip stelt het voor; ouders
      kunnen het ook zelf zetten.
   5. "Ik kan…" per onderwerp.
   ===================================================================== */

/* ---------- 1. foute vragen komen terug ---------- */
const retryOn = () => S.mode === 'practice' && !S.potion && !S.challenge && !S.queue && !S.placement;
function retryAdd(q) {
  if (!retryOn() || q.retried) return;
  (S.retry = S.retry || []).push({ q, due: S.i + 3 });
}
// geeft een eerder foute vraag terug als het tijd is (of als de les bijna klaar is)
function retryPick() {
  if (!retryOn() || !S.retry || !S.retry.length) return null;
  const left = S.count - S.i, k = S.retry.findIndex(r => r.due <= S.i || left <= S.retry.length);
  if (k < 0) return null;
  const q = Object.assign({}, S.retry.splice(k, 1)[0].q, { retried: true });
  return q;
}

/* ---------- 2. hulp die vanzelf opklimt ---------- */
const HELP_AT = [14000, 28000, 45000];   // wiebelen, uitleg aanbieden, fout antwoord weghalen
function helpStop() { (S.helpT || []).forEach(clearTimeout); S.helpT = []; }
function helpStart() {
  helpStop();
  if (S.mode !== 'practice' || S.challenge || !S.q) return;
  const q = S.q, qNow = S.i;
  const live = () => S.q === q && S.i === qNow && !S.locked && current === 'quiz';
  S.helpT = [
    setTimeout(() => { if (!live()) return; const h = $('#qhint'); if (h && !h.classList.contains('hidden')) h.classList.add('wiggle'); }, HELP_AT[0]),
    setTimeout(() => {
      if (!live() || !q.hint) return;
      const hb = $('#hintbox'); if (hb.classList.contains('show')) return;
      hb.innerHTML = `<div class="helpoffer">${pipSVG('blij', 'tiny')}<span>${tri(['Zal ik helpen? Tik op “Hoe doe je dit?”', 'Mi yuda bo? Primi riba “Kon bo ta hasi esaki?”', 'Shall I help? Tap “How do I do this?”'])}</span></div>`;
      hb.classList.add('show');
    }, HELP_AT[1]),
    setTimeout(() => {
      if (!live() || q.kind !== 'choice' || q.choices.length < 3) return;
      const btns = $$('#qinput .choice'), wrong = btns.filter((b, i) => i !== q.answer && !b.disabled && !b.classList.contains('gone'));
      if (wrong.length < 2) return;
      const b = kies(wrong); b.classList.add('gone'); b.disabled = true; S.helped = true;
      toast(tri(['Pip haalt een fout antwoord weg 🪄', 'Pip a kita un kontesta robes 🪄', 'Pip removed a wrong answer 🪄']), 2200);
    }, HELP_AT[2])];
}

/* ---------- 3. "Bijna!" bij een fout getal ---------- */
function mistakeNote(q, g) {
  if (!g || g.skip || q.kind !== 'num' || g.a == null || g.a === '') return '';
  const given = parseDec(String(g.a)), ans = q.answer;
  if (!isFinite(given) || !isFinite(ans) || given === ans) return '';
  const tm = q.item && /^(\d+)x(\d+)$/.exec(String(q.item));
  if (tm) { const A = +tm[1], B = +tm[2], near = [[A + 1, B], [A - 1, B], [A, B + 1], [A, B - 1]].find(([x, y]) => x * y === given); if (near) return `<div class="mnote">💡 ${tri([`Dat is het antwoord van ${near[0]} × ${near[1]}. Let op: de som is ${A} × ${B}.`, `Esei ta e kontesta di ${near[0]} × ${near[1]}. Wak: e som ta ${A} × ${B}.`, `That is the answer to ${near[0]} × ${near[1]}. Careful: the sum is ${A} × ${B}.`])}</div>`; }
  const om = /^\s*(\d+) ([+−]) (\d+)/.exec(strip(q.text));
  if (om) { const a = +om[1], b = +om[3]; if (om[2] === '+' && given === a - b) return `<div class="mnote">💡 ${tri(['Je hebt min gedaan, maar het is een plussom.', 'Bo a hasi resta, ma e ta un suma.', 'You subtracted, but it is a plus sum.'])}</div>`; if (om[2] === '−' && given === a + b) return `<div class="mnote">💡 ${tri(['Je hebt plus gedaan, maar het is een minsom.', 'Bo a hasi suma, ma e ta un resta.', 'You added, but it is a minus sum.'])}</div>`; }
  const d = Math.abs(given - ans), gs = String(Math.abs(given)).replace(/\D/g, ''), as = String(Math.abs(ans)).replace(/\D/g, '');
  let msg = '';
  if (d === 1) msg = ['Je zat er maar 1 naast. Tel nog eens rustig na.', 'Bo tabata un so mas leu. Konta atrobe trankil.', 'You were only 1 off. Count again, slowly.'];
  else if (gs.length > 1 && gs.length === as.length && gs.split('').reverse().join('') === as) msg = ['Je hebt de cijfers omgedraaid. Kijk goed welk cijfer vooraan hoort.', 'Bo a trese e number bira. Wak bon kua number ta bai dilanti.', 'You swapped the digits. Check which digit goes first.'];
  else if (d === 10 || d === 100 || (given !== 0 && ans !== 0 && (given / ans === 10 || ans / given === 10))) msg = ['Bijna! Let op de tientallen en honderdtallen: staat elk cijfer op de goede plek?', 'Kasi! Wak e dieznan i e shennan: ta kada number riba su lugá?', 'Almost! Watch the tens and hundreds: is every digit in the right place?'];
  return msg ? `<div class="mnote">💡 ${tri(msg)}</div>` : '';
}

/* ---------- 4. niveau per vak ---------- */
const NIVEAU_SUBJ = ['rekenen', 'taal', 'papiamentu'];
const niveauOf = sid => (D.niveau && D.niveau[sid]) || 0;
const effGrade = sid => Math.min(8, Math.max(1, D.grade + niveauOf(sid)));
function setNiveau(sid, v) {
  D.niveau = D.niveau || {}; D.niveau[sid] = Math.max(-3, Math.min(3, v)); save();
}
// na een les: Pip biedt een stapje aan (alleen bij een duidelijk resultaat, altijd vrijblijvend)
function levelOffer(el, r) {
  if (S.potion || r.stopped || S.answered < (S.placement ? 3 : 8) || !S.subject) return;
  const sid = S.subject, acc = S.correct / S.answered, now = niveauOf(sid);
  let dir = 0;
  if (acc >= .9 && (S.placement || S.diff !== 'easy') && now < 3 && effGrade(sid) < 8) dir = 1;
  else if (acc <= (S.placement ? .34 : .4) && now > -3 && effGrade(sid) > 1) dir = -1;
  if (!dir) { if (S.placement) { const bx = document.createElement('div'); bx.className = 'suggest leveloffer'; bx.innerHTML = `${pipSVG('lach', 'tiny')}<div><b>Pip:</b> ${tri(['Dit past goed bij jou! Je begint precies op de goede plek.', 'Esaki ta bon pa bo! Bo ta kuminsá presis unda mester.', 'This fits you well! You start in exactly the right place.'])}</div>`; const an = $('.pipline', el); if (an) an.after(bx); } return; }
  const msg = dir > 0
    ? ['Dit ging heel goed! Zullen we iets moeilijkers proberen?', 'Esaki a bai masha bon! Nos purba algu mas difísil?', 'That went really well! Shall we try something harder?']
    : ['Dit was best lastig. Zullen we een stapje makkelijker beginnen? Dat mag altijd terug.', 'Esaki tabata difísil. Nos kuminsá un pida mas fásil? Bo por bolbe.', 'That was tricky. Shall we start a step easier? You can always switch back.'];
  const box = document.createElement('div'); box.className = 'suggest leveloffer';
  box.innerHTML = `${pipSVG('blij', 'tiny')}<div><b>Pip:</b> ${tri(msg)}<div class="sbtns"><button class="btn small" id="lvyes">${dir > 0 ? tri(['Ja, moeilijker!', 'Si, mas difísil!', 'Yes, harder!']) : tri(['Ja, makkelijker', 'Si, mas fásil', 'Yes, easier'])}</button><button class="btn small ghost" id="lvno">${tri(['Nee, zo laten', 'No, laga e asina', 'No, keep it'])}</button></div></div>`;
  const anchor = $('.pipline', el); if (anchor) anchor.after(box); else $('.res', el).appendChild(box);
  $('#lvyes', box).onclick = () => { setNiveau(sid, now + dir); box.innerHTML = `<div>${tri(['Gedaan! In de klas zie je nu andere onderwerpen.', 'Hasí! Den klas bo ta wak otro tema awor.', 'Done! You will now see other topics in class.'])}</div>`; };
  $('#lvno', box).onclick = () => box.remove();
}
const niveauText = n => n === 0 ? tri(['zoals je groep', 'manera bo grupo', 'like your groep']) : n > 0 ? tri(['+' + n + ' moeilijker', '+' + n + ' mas difísil', '+' + n + ' harder']) : tri(['−' + (-n) + ' makkelijker', '−' + (-n) + ' mas fásil', '−' + (-n) + ' easier']);
// ouderhoek: per vak een niveau
function niveauParentHTML() {
  return `<label class="lbl">${tri(['Niveau per vak', 'Nivel pa kurso', 'Level per subject'])}</label><p class="muted">${tri(['Rekenen, taal en Papiamentu kunnen elk een stapje makkelijker of moeilijker staan dan de groep.', 'Matematika, idioma i Papiamentu por tin un nivel mas fásil òf mas difísil ku e grupo.', 'Maths, language and Papiamentu can each be a step easier or harder than the groep.'])}</p>
    ${NIVEAU_SUBJ.map(sid => `<div class="nivrow"><b>${SUBJECT[sid].ico} ${t('subj_' + sid)}</b><span class="chips">${[-2, -1, 0, 1, 2].map(n => `<button class="chip ${niveauOf(sid) === n ? 'on' : ''}" data-niv="${sid}:${n}">${n > 0 ? '+' + n : n < 0 ? '−' + (-n) : '0'}</button>`).join('')}</span></div>`).join('')}
    <p class="muted">${NIVEAU_SUBJ.map(sid => t('subj_' + sid) + ': ' + niveauText(niveauOf(sid)) + ' (' + tri(['groep', 'grupo', 'groep']) + ' ' + effGrade(sid) + ')').join(' · ')}</p>`;
}
function niveauParentBind(el, redraw) {
  $$('[data-niv]', el).forEach(b => b.onclick = () => { const [sid, n] = b.dataset.niv.split(':'); setNiveau(sid, +n); redraw(); });
}

/* ---------- 5. "Ik kan…" ---------- */
const IK_KAN = {
  tafels: 'de tafels uit mijn hoofd', delen: 'delen, ook met rest', plusmin: 'plussommen en minsommen met grote getallen', groot: 'grote getallen afronden en schatten', breuken: 'rekenen met breuken en kommagetallen',
  geld: 'rekenen met geld', meten: 'lengte, gewicht en inhoud meten', opp: 'omtrek en oppervlakte uitrekenen', grafiek: 'tabellen en grafieken lezen', klok: 'de klok lezen en rekenen met tijd', verhaal: 'verhaaltjessommen oplossen', lab: 'schatten en vakjes kleuren',
  tellen: 'tellen', meerminder: 'zien waar er meer zijn', vormen: 'vormen en kleuren benoemen', tot20: 'plussen en minnen tot 20', splitsen: 'getallen splitsen', verhouding: 'rekenen met een verhoudingstabel', procenten: 'procenten uitrekenen',
  eiij: 'ei en ij goed schrijven', auou: 'au en ou goed schrijven', gch: 'g en ch goed schrijven', dubbel: 'woorden met één of twee letters schrijven', dt: 'd en t aan het eind goed schrijven', woorden: 'moeilijke woorden uitleggen',
  lezen: 'een tekst begrijpen en vragen beantwoorden', zinsdelen: 'het onderwerp en de persoonsvorm vinden', woordsoort: 'woordsoorten herkennen', meervoud: 'het meervoud en verkleinwoord maken', spreuk: 'spreekwoorden uitleggen',
  klank: 'horen met welke letter een woord begint', rijmen: 'rijmwoorden vinden', woordlezen: 'korte woorden lezen', kofschip: "de verleden tijd goed schrijven met 't kofschip",
  groeten: 'groeten in het Papiamentu', getallen: 'tellen in het Papiamentu', kleuren: 'kleuren in het Papiamentu', familie: 'mijn familie noemen in het Papiamentu', eten: 'eten en drinken noemen in het Papiamentu',
  dieren: 'dieren noemen in het Papiamentu', dagen: 'de dagen en maanden in het Papiamentu', zinnen: 'korte zinnen in het Papiamentu', grammatika: 'een zin bouwen met ta, a en lo', weetjes: 'dingen vertellen over Curaçao'
};
const ikKan = tp => IK_KAN[tp.id] ? 'Ik kan ' + IK_KAN[tp.id] : '';

/* ---------- A2: "Samen in stapjes" na een fout ---------- */
function stapjesLines(q) {
  const ex = (q.explain || '').replace(/<br\s*\/?>/g, '. ');
  const parts = ex.split(/(?<=[.!?])\s+(?=[A-Z0-9<])/).map(x => x.trim()).filter(Boolean);
  return parts.length >= 2 ? parts : [];
}
const stapjesHTML = q => stapjesLines(q).length ? `<button class="btn small ghost" id="fbsteps">🪜 ${tri(['Laat het in stapjes zien', 'Mustra mi pasito pa pasito', 'Show me in small steps'])}</button><div id="fbstepbox"></div>` : '';
function stapjesBind(q) {
  const b = $('#fbsteps'); if (!b) return;
  b.onclick = () => { b.classList.add('hidden'); WIDGETS.stappen($('#fbstepbox'), { lines: stapjesLines(q) }); };
}

/* ---------- A3: "Waar begin je?" (3 vragen) ---------- */
function placeCardHTML(sid) {
  return `<div class="topic mix place"><div class="t-ico">🧭</div><div class="t-body"><div class="t-name">${tri(['Waar begin je?', 'Unda bo ta kuminsá?', 'Where do you start?'])}</div><div class="t-sub">${tri(['3 vragen. Papa of mama mag meekijken.', '3 pregunta. Tata òf mama por wak huntu.', '3 questions. A parent can watch along.'])}</div></div>
    <div class="t-btns"><button class="btn small" id="placebtn">🧭 ${tri(['Probeer', 'Purba', 'Try'])}</button></div></div>`;
}
function placeBind(el, sid) {
  const b = $('#placebtn', el); if (!b) return;
  b.onclick = () => {
    SND.click();
    Object.assign(S, { subject: sid, topicKey: sid + '/mix', mode: 'practice', diff: 'medium', count: 3, potion: false, challenge: false, queue: null, placement: true });
    startQuiz();
  };
}
