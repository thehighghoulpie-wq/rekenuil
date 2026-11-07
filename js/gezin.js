'use strict';
/* =====================================================================
   Toverschool 2.0, stap F: gezin en eerste start
   - ei uitbroeden bij de eerste start (3 tikken)
   - Brievenbus: familie spreekt berichtjes in, zij vindt ze op haar eiland
   - sterren van mama/papa/wela met een reden (alleen positief)
   - gastspeler (voortgang wordt niet bewaard) en meerdere spelers (broertjes en zusjes)
   - speeltijden: Pip slaapt buiten de uren; een vriendelijke dagtimer
   - "wie mag wat" en huiswerkgidsen in de Ouderhoek
   Alles blijft op het apparaat. Geen account, geen server.
   ===================================================================== */

/* ---------- ei uitbroeden ---------- */
const EGG = { taps: 0, done: false };
function eggSVG(n) {
  const cr = [`<path d="M70 70 L82 84 L72 92 L86 108" fill="none" stroke="#3C2A6E" stroke-width="3" stroke-linecap="round"/>`, `<path d="M118 62 L108 78 L120 88 L110 104" fill="none" stroke="#3C2A6E" stroke-width="3" stroke-linecap="round"/>`, `<path d="M62 120 L84 112 L98 124 L120 114 L140 124" fill="none" stroke="#3C2A6E" stroke-width="3.4" stroke-linecap="round"/>`];
  return `<svg viewBox="0 0 200 220" class="eggsvg" aria-hidden="true"><ellipse cx="100" cy="196" rx="56" ry="9" fill="rgba(0,0,0,.18)"/><path d="M100 14 C150 14 176 96 176 140 C176 186 140 206 100 206 C60 206 24 186 24 140 C24 96 50 14 100 14Z" fill="#9C84F2"/>
    <path d="M100 14 C150 14 176 96 176 140 C176 186 140 206 100 206 C60 206 24 186 24 140 C24 96 50 14 100 14Z" fill="none" stroke="#6C54C9" stroke-width="4"/>
    ${[[70, 60], [128, 84], [90, 150], [140, 160], [58, 120]].map(([x, y]) => `<path d="${starPath(x, y, 9)}" fill="#FFE27A"/>`).join('')}${cr.slice(0, n).join('')}</svg>`;
}
function eggHTML() {
  if (EGG.done) return `<div class="intro-pip">${pipSVG('zwaai')}</div><div class="bubble big">${t('introHi')}</div>`;
  return `<button class="egg" id="egg" aria-label="${tri(['Ei', 'Webo', 'Egg'])}">${eggSVG(EGG.taps)}</button><div class="bubble big" id="eggsay">${eggSay()}</div>`;
}
const eggSay = () => [
  tri(['Klop klop… het is nog donker hier. Tik op het ei!', 'Klop klop… ainda ta skur akí. Primi riba e webo!', 'Knock knock… it is dark in here. Tap the egg!']),
  tri(['Au! Het kraakt! Nog een keer!', 'Ay! E ta kibra! Un biaha mas!', 'Ooh! It is cracking! Once more!']),
  tri(['Bijna! Nog één tik!', 'Kasi! Un primi mas!', 'Almost! One more tap!'])][Math.min(2, EGG.taps)];
function eggBind(el) {
  const e = $('#egg', el); if (!e) return;
  e.onclick = () => {
    EGG.taps++; SND.pop(); tone([380 + EGG.taps * 90, 520 + EGG.taps * 90], .08, 'triangle', .05);
    if (EGG.taps < 3) { e.innerHTML = eggSVG(EGG.taps); $('#eggsay', el).textContent = eggSay(); move(e, 'jelly'); return; }
    EGG.done = true; e.classList.add('hatch'); SND.fanfare();
    setTimeout(() => { const box = e.parentNode; const tmp = document.createElement('div'); tmp.innerHTML = eggHTML(); e.remove(); const old = $('#eggsay', box); if (old) old.remove(); [...tmp.children].forEach(c => box.insertBefore(c, $('h3', box))); sparkleBurst($('.intro-pip', box), 14); move($('.intro-pip', box), 'pop'); confetti(60); }, motionOK() ? 500 : 0);
  };
}

/* ---------- Brievenbus ---------- */
const briefKeys = () => [...VOICE_KEYS].filter(k => String(k).startsWith('brief:')).sort().reverse();
async function openBrievenbus() {
  const rows = [];
  for (const k of briefKeys()) { const v = await voiceGet(k); if (v) rows.push([k, v]); }
  modal(`<div class="m-ico">📮</div><h2>${tri(['Brievenbus', 'Bùsnan di karta', 'Mailbox'])}</h2>${rows.length ? `<div class="briefs">${rows.map(([k, v]) => `<div class="brief"><span>💌 <b>${esc(v.who || '?')}</b> <small>${new Date(v.t || 0).toLocaleDateString(lang() === 'nl' ? 'nl-NL' : lang() === 'pap' ? 'nl-CW' : 'en-GB', { day: 'numeric', month: 'short' })}</small></span><button class="btn small" data-brief="${esc(k)}">▶</button></div>`).join('')}</div>`
    : `<p>${tri(['Nog geen berichtjes. Vraag aan mama, papa of wela of ze er één inspreken!', 'Ainda no tin mensahe. Puntra mama, tata òf wela pa grabá un!', 'No messages yet. Ask mum, dad or grandma to record one!'])}</p>`}`, [{ label: t('ok'), cls: 'primary' }]);
  $$('[data-brief]').forEach(b => b.onclick = () => { voicePlay(b.dataset.brief); b.classList.add('playing'); });
}

/* ---------- sterren met een reden ---------- */
const STAR_WHY = [
  ['Je bleef proberen', 'Bo a keda purba', 'You kept trying'], ['Je hielp iemand', 'Bo a yuda un hende', 'You helped someone'], ['Mooi nagedacht', 'Bon pensá', 'Nicely thought out'],
  ['Netjes gewerkt', 'Bon trabou', 'Neat work'], ['Dit was moeilijk en je ging door', 'Esaki tabata difísil i bo a sigui', 'This was hard and you carried on'], ['Een goede vraag gesteld', 'Bo a hasi un bon pregunta', 'You asked a good question']];
function giveParentStar(who, n, why) {
  D.parentStars = D.parentStars || []; D.parentStars.unshift({ d: today(), n, who: who || '', why, seen: false }); D.parentStars = D.parentStars.slice(0, 30);
  addStars(n); save();
}

/* ---------- gast en meerdere spelers ---------- */
const GUEST = { on: false, snap: null };
{ const _s = save; save = () => { if (!GUEST.on) _s(); }; }
function guestStart() { GUEST.snap = JSON.stringify(D); GUEST.on = true; toast(tri(['Gast speelt mee: er wordt niets bewaard.', 'Bishita ta hunga: nada no ta wardá.', 'Guest is playing: nothing is saved.']), 3500); openMap(); }
function guestStop() { if (!GUEST.on) return; D = cleanSave(JSON.parse(GUEST.snap)); GUEST.on = false; GUEST.snap = null; save(); applySettings(); toast(tri(['Terug bij jouw eiland!', 'Bèk na bo isla!', 'Back to your island!']), 2500); openMap(); }
const PROF_KEY = 'toverschool-profiles', ACT_KEY = 'toverschool-active';
function profList() { try { const l = JSON.parse(localStorage.getItem(PROF_KEY) || '[]'); return Array.isArray(l) ? l.filter(x => x && /^p\d+$/.test(x.id)) : []; } catch (e) { return []; } }
const profActive = () => { try { return localStorage.getItem(ACT_KEY) || 'p1'; } catch (e) { return 'p1'; } };
function profSlot(id) { return KEY + '-' + id; }
function profStoreCurrent() {
  const id = profActive(), l = profList().filter(x => x.id !== id); l.push({ id, name: (D.profile && D.profile.name) || '' });
  try { localStorage.setItem(PROF_KEY, JSON.stringify(l)); localStorage.setItem(profSlot(id), JSON.stringify(D)); } catch (e) { }
}
function profSwitch(id) {
  if (id === profActive()) return;
  GUEST.on = false; profStoreCurrent();
  try { const raw = localStorage.getItem(profSlot(id)); if (!raw) return; D = cleanSave(JSON.parse(raw)); localStorage.setItem(ACT_KEY, id); } catch (e) { return; }
  save(); applySettings(); openMap();
}
function profNew() {
  GUEST.on = false; profStoreCurrent();
  const ids = profList().map(x => +x.id.slice(1)), id = 'p' + (Math.max(1, ...ids) + 1), lg = D.settings.lang;
  D = defaults(); D.settings.lang = lg;
  try { localStorage.setItem(ACT_KEY, id); } catch (e) { }
  save(); applySettings(); openIntro();
}
function profDelete(id) {
  if (id === profActive()) return;
  try { localStorage.removeItem(profSlot(id)); localStorage.setItem(PROF_KEY, JSON.stringify(profList().filter(x => x.id !== id))); } catch (e) { }
}

/* ---------- speeltijden en dagtimer ---------- */
function gezinOutside() {
  const p = D.settings.play; if (!p || !p.on) return false;
  const now = new Date(), m = now.getHours() * 60 + now.getMinutes(), [fh, fm] = p.from.split(':').map(Number), [th, tm] = p.to.split(':').map(Number), f = fh * 60 + fm, to = th * 60 + tm;
  return !(f <= to ? (m >= f && m <= to) : (m >= f || m <= to));
}
const gezinMin = () => { const l = D.daylog[today()]; return l ? l.sec / 60 : 0; };
const gezinTimeUp = () => { const p = D.settings.play; return !!(p && p.on && p.max && gezinMin() >= p.max); };
function gezinSleepModal(out) {
  modal(`<div class="m-ico">${pipSVG('slaap')}</div><h2>${out ? tri(['Pip slaapt 😴', 'Pip ta drumi 😴', 'Pip is asleep 😴']) : tri(['Genoeg getoverd voor vandaag!', 'Basta magia pa awe!', 'Enough magic for today!'])}</h2><p>${tri(['Tot morgen! Je kunt nog wel spelen op je eiland.', 'Te mañan! Bo por hunga ketu riba bo isla.', 'See you tomorrow! You can still play on your island.'])}</p>`, [{ label: tri(['Naar mijn eiland', 'Bai mi isla', 'To my island']), cls: 'primary', fn: () => openIsland() }, { label: t('ok'), cls: 'ghost' }]);
}
{ const _sq = startQuiz; startQuiz = () => { if (gezinOutside()) return gezinSleepModal(true); if (gezinTimeUp()) return gezinSleepModal(false); _sq(); }; }
{ const _nx = next; next = first => { if (!first && gezinTimeUp() && current === 'quiz' && !S.potion) { toast(tri(['Pip wordt moe. Tot morgen!', 'Pip ta kansa. Te mañan!', 'Pip is getting tired. See you tomorrow!']), 3000); return finish(); } _nx(first); }; }

/* ---------- op de kaart ---------- */
{ const _o = onMapShown; onMapShown = el => { _o(el); gezinMap(el); }; }
function gezinMap(el) {
  const anchor = $('.hero-row', el); if (!anchor) return;
  const out = [];
  if (GUEST.on) out.push(`<div class="gcard guest">👤 ${tri(['Gast speelt mee: er wordt niets bewaard.', 'Bishita ta hunga: nada no ta wardá.', 'Guest is playing: nothing is saved.'])} <button class="btn small" id="guestoff">${tri(['Gast klaar', 'Bishita kaba', 'Guest done'])}</button></div>`);
  if (gezinOutside()) out.push(`<div class="gcard sleep">${pipSVG('slaap', 'tiny')}<span>${tri(['Pip slaapt. Tot morgen!', 'Pip ta drumi. Te mañan!', 'Pip is asleep. See you tomorrow!'])}</span></div>`);
  const ps = (D.parentStars || []).find(x => !x.seen);
  if (ps) out.push(`<div class="gcard pstar">⭐ <span><b>${esc(ps.who || tri(['Thuis', 'Kas', 'Home']))}</b> ${tri(['gaf je', 'a duna bo', 'gave you'])} <b>${ps.n}</b> ${tri(['sterren', 'strea', 'stars'])}: ${tri(STAR_WHY.find(w => w[0] === ps.why) || [esc(ps.why), esc(ps.why), esc(ps.why)])}</span> <button class="btn small" id="pstarok">💜</button></div>`);
  if (eiPending() > 0) out.push(`<div class="gcard gift">🎁 <span>${tri(['Pip de postbode heeft iets voor je eiland!', 'Pip e kartero tin algu pa bo isla!', 'Pip the postman has something for your island!'])}</span> <button class="btn small" id="giftgo">${tri(['Kijken', 'Wak', 'Look'])}</button></div>`);
  if (!out.length) return;
  anchor.insertAdjacentHTML('afterend', `<div class="gcards">${out.join('')}</div>`);
  const g = $('#guestoff', el); if (g) g.onclick = guestStop;
  const p = $('#pstarok', el); if (p) p.onclick = () => { ps.seen = true; save(); sparkleBurst(p, 10, ['💜', '⭐']); SND.pop(); setTimeout(() => $('.gcard.pstar', el) && $('.gcard.pstar', el).remove(), 400); };
  const gg = $('#giftgo', el); if (gg) gg.onclick = () => { EI.tab = 'cadeaus'; EI.mode = 'bouw'; openIsland(); };
}

/* ---------- Ouderhoek: tab Gezin ---------- */
let gezinWho = '', gezinN = 1;
const HW_SUBJ = {
  rekenen: ['Laat haar hardop vertellen hoe ze het deed.', 'Zoek de som in het echt: geld bij de winkel, de klok in de keuken, een recept met breuken.', 'Een fout is informatie: vraag “waar twijfelde je?”'],
  taal: ['Laat haar de regel zelf uitleggen, vóór je zegt wat goed is.', 'Lees samen een stukje voor en zoek de moeilijke woorden.', 'Schrijf een boodschap voor Wela en let samen op de spelling.'],
  papiamentu: ['Gebruik het woord die dag drie keer in huis.', 'Laat Wela of opa het woord inspreken in de Ouderhoek (tab Stemmen).', 'Controleer samen de spelling van onze eilandtaal: klopt het zo bij jullie thuis?']
};
const HW_TOPIC = {
  tafels: 'Oefen korte stukjes (2 minuten) en vaak. Begin bij de tafels die ze al kent en voeg er steeds één bij.', breuken: 'Gebruik een pizza of chocoladereep: laat haar echt verdelen en vraag “hoeveel is dat van het geheel?”', klok: 'Zet de klok op een wandelmoment: “hoe laat is het over 20 minuten?”',
  geld: 'Laat haar bij de winkel zelf afrekenen en het wisselgeld nakijken.', dt: 'Verlengen helpt: “hond” → “honden”, dus met d. Laat haar het woord eerst langer maken.', kofschip: "Vraag: wat is de stam? Zit de laatste letter in 't kofschip (t, k, f, s, ch, p)? Dan -te, anders -de.",
  lezen: 'Laat haar eerst de vraag lezen, dan de tekst, en dan het antwoord onderstrepen.', zinsdelen: 'Zoek eerst de persoonsvorm: maak de zin vragend en kijk welk woord verandert.', procenten: '10% is delen door 10. Bouw daar de rest op.', verhouding: 'Reken eerst uit wat er één kost, daarna het aantal dat je nodig hebt.'
};
function gezinParentHTML() {
  const I = D.settings.play || { on: false, from: '07:00', to: '19:30', max: 0 }, who = ['Mama', 'Papa', 'Wela', 'Welo', 'Tanta'];
  const profs = profList().filter(p => p.id !== profActive());
  const briefs = briefKeys();
  return `<h3>💜 ${tri(['Een ster met een reden', 'Un strea ku un motibu', 'A star with a reason'])}</h3><p class="muted">${tri(['Alleen positief. Ze ziet het op de kaart van haar school.', 'Solamente positivo. E ta mira esaki riba e mapa.', 'Positive only. She sees it on her school map.'])}</p>
    <div class="chips">${who.map(w => `<button class="chip ${gezinWho === w ? 'on' : ''}" data-gwho="${w}">${w}</button>`).join('')}</div>
    <div class="chips">${[1, 2, 3].map(n => `<button class="chip ${gezinN === n ? 'on' : ''}" data-gn="${n}">${'⭐'.repeat(n)}</button>`).join('')}</div>
    <div class="chips whys">${STAR_WHY.map((w, i) => `<button class="chip" data-gwhy="${i}">${tri(w)}</button>`).join('')}</div>
    ${(D.parentStars || []).length ? `<p class="muted">${D.parentStars.slice(0, 3).map(s => `${s.d}: ${s.n}⭐ ${esc(s.who)} · ${esc(s.why)}`).join('<br>')}</p>` : ''}
    <h3>📮 ${tri(['Brievenbus', 'Bùsnan di karta', 'Mailbox'])}</h3><p class="muted">${tri(['Spreek een berichtje in. Ze vindt het in de brievenbus op haar eiland (bouw hem uit de lade bij het land).', 'Grabá un mensahe. E ta haña esaki den e bùsnan riba su isla.', 'Record a message. She finds it in the mailbox on her island.'])}</p>
    <div class="chips">${who.map(w => `<button class="chip ${D.settings.voiceWho === w ? 'on' : ''}" data-who="${w}">${w}</button>`).join('')}</div>
    <button class="btn wide" data-rec="brief:${Date.now()}">⏺ ${tri(['Neem een berichtje op', 'Grabá un mensahe', 'Record a message'])}</button>
    ${briefs.map(k => `<div class="vrow"><span class="vw">💌 ${esc(k.slice(6, 16))}</span><span class="vbtns"><button class="btn small ghost" data-play="${esc(k)}">▶</button><button class="btn small ghost" data-del="${esc(k)}">🗑</button></span></div>`).join('')}
    <h3>⏰ ${tri(['Speeltijden', 'Ora di hunga', 'Play times'])}</h3>
    <div class="chips"><button class="chip ${!I.on ? 'on' : ''}" data-play-on="0">${t('off')}</button><button class="chip ${I.on ? 'on' : ''}" data-play-on="1">${t('on')}</button></div>
    ${I.on ? `<p class="muted">${tri(['Buiten deze uren slaapt Pip en start er geen quiz. Het eiland blijft open.', 'Foramente di e ora aki Pip ta drumi. E isla ta keda habrí.', 'Outside these hours Pip sleeps and no quiz starts. The island stays open.'])}</p>
      <div class="nivrow"><span>${tri(['Van', 'Di', 'From'])}</span><input type="time" id="pfrom" value="${I.from}"><span>${tri(['tot', 'te', 'to'])}</span><input type="time" id="pto" value="${I.to}"></div>
      <label class="lbl">${tri(['Vriendelijke dagtimer (minuten)', 'Timer amigable (minüt)', 'Friendly daily timer (minutes)'])}</label><div class="chips">${[0, 15, 20, 30, 45, 60].map(m => `<button class="chip ${I.max === m ? 'on' : ''}" data-pmax="${m}">${m ? m : t('off')}</button>`).join('')}</div>
      <p class="muted">${tri(['Ze maakt de vraag af; daarna zegt Pip “tot morgen”. Alles blijft bewaard.', 'E ta kaba e pregunta; despues Pip ta bisa “te mañan”. Tur ta keda wardá.', 'She finishes the question; then Pip says “see you tomorrow”. Everything is kept.'])}</p>` : ''}
    <h3>👥 ${tri(['Spelers', 'Hogadónan', 'Players'])}</h3><p class="muted">${tri(['Broertjes, zusjes of een neefje: ieder krijgt een eigen eiland en eigen voortgang op deze tablet. Een gast speelt mee zonder dat er iets verandert.', 'Ruman òf primo: kada un tin su mes isla i progreso riba e tablet aki. Un bishita ta hunga sin ku nada kambia.', 'Siblings or a cousin: each gets their own island and progress on this tablet. A guest plays without changing anything.'])}</p>
    <div class="chips"><button class="chip on" disabled>${esc(playerName() || '?')}</button>${profs.map(p => `<button class="chip" data-pswitch="${p.id}">${esc(p.name || p.id)}</button><button class="chip" data-pdel="${p.id}" aria-label="delete">🗑</button>`).join('')}<button class="chip" id="pnew">➕ ${tri(['Nieuwe speler', 'Hogadó nobo', 'New player'])}</button></div>
    <button class="btn ghost wide" id="guest">👤 ${tri(['Gast speelt mee', 'Bishita ta hunga', 'Guest plays'])}</button>
    <h3>🔑 ${tri(['Wie mag wat?', 'Ken por kiko?', 'Who can change what?'])}</h3>
    <table class="dtable"><tr><td>${tri(['Haar', 'Esun', 'Her'])}</td><td>${tri(['kleren en personage, huisdier, eiland, vragen oefenen, kiezen wanneer ze speelt', 'paña i karakter, mascota, isla, praktiká, skohe ora pa hunga', 'clothes and character, pet, island, practising, choosing when she plays'])}</td></tr>
      <tr><td>${tri(['Alleen een ouder', 'Solamente un mayor', 'Only a parent'])}</td><td>${tri(['groep en niveau, speeltijden, stemmen opnemen, reservekopie, wissen, spelers, sterren geven', 'grupo i nivel, ora di hunga, grabá bos, backup, kita, hogadónan, duna strea', 'groep and level, play times, recordings, backup, reset, players, giving stars'])}</td></tr>
      <tr><td>${tri(['Nooit', 'Nunka', 'Never'])}</td><td>${tri(['advertenties, chatten met vreemden, betalen, links naar andere sites', 'anunsio, chat ku stranhero, paga, link pa otro sitio', 'ads, chatting with strangers, paying, links to other sites'])}</td></tr></table>
    <h3>🏠 ${tri(['Thuis helpen', 'Yuda na kas', 'Helping at home'])}</h3>
    ${SUBJECTS.map(s => `<details class="card pad vcat"><summary><b>${s.ico} ${t('subj_' + s.id)}</b></summary><ul class="tips">${(HW_SUBJ[s.id] || []).map(x => `<li>${x}</li>`).join('')}</ul>
      ${s.topics.filter(tp => HW_TOPIC[tp.id] || ikKan(tp)).map(tp => `<p><b>${tp.ico} ${esc(tTopic(tp))}</b>${ikKan(tp) ? `<br><small>${esc(ikKan(tp))}</small>` : ''}${HW_TOPIC[tp.id] ? `<br>${HW_TOPIC[tp.id]}` : ''}</p>`).join('')}</details>`).join('')}`;
}
function gezinParentBind(el, redraw) {
  const P = () => { D.settings.play = D.settings.play || { on: false, from: '07:00', to: '19:30', max: 0 }; return D.settings.play; };
  $$('[data-gwho]', el).forEach(b => b.onclick = () => { gezinWho = b.dataset.gwho; redraw(); });
  $$('[data-gn]', el).forEach(b => b.onclick = () => { gezinN = +b.dataset.gn; redraw(); });
  $$('[data-gwhy]', el).forEach(b => b.onclick = () => { if (!gezinWho) return toast(tri(['Kies eerst wie je bent (Mama, Papa…)', 'Skohe promé ken bo ta', 'First choose who you are']), 2600); giveParentStar(gezinWho, gezinN, STAR_WHY[+b.dataset.gwhy][0]); toast('⭐ ' + gezinN); redraw(); });
  $$('[data-play-on]', el).forEach(b => b.onclick = () => { P().on = b.dataset.playOn === '1'; save(); redraw(); });
  const f = $('#pfrom', el), to = $('#pto', el); if (f) f.onchange = () => { if (f.value) { P().from = f.value; save(); } }; if (to) to.onchange = () => { if (to.value) { P().to = to.value; save(); } };
  $$('[data-pmax]', el).forEach(b => b.onclick = () => { P().max = +b.dataset.pmax; save(); redraw(); });
  $$('[data-pswitch]', el).forEach(b => b.onclick = () => profSwitch(b.dataset.pswitch));
  $$('[data-pdel]', el).forEach(b => b.onclick = () => modal(`<h2>${tri(['Deze speler wissen?', 'Kita e hogadó aki?', 'Delete this player?'])}</h2><p>${tri(['Alle voortgang van deze speler gaat weg.', 'Tur progreso di e hogadó aki ta bai.', 'All progress of this player will be lost.'])}</p>`, [{ label: t('cancel'), cls: 'primary' }, { label: t('resetYes'), cls: 'ghost danger', fn: () => { profDelete(b.dataset.pdel); redraw(); } }]));
  const n = $('#pnew', el); if (n) n.onclick = () => modal(`<h2>${tri(['Nieuwe speler?', 'Hogadó nobo?', 'New player?'])}</h2><p>${tri(['Jouw voortgang blijft bewaard. De nieuwe speler begint met een eigen eiland.', 'Bo progreso ta keda wardá. E hogadó nobo ta kuminsá ku su mes isla.', 'Your progress is kept. The new player starts with their own island.'])}</p>`, [{ label: t('cancel'), cls: 'ghost' }, { label: t('ok'), cls: 'primary', fn: profNew }]);
  const g = $('#guest', el); if (g) g.onclick = guestStart;
}
Object.assign(STR, { parGezin: ['Gezin', 'Famia', 'Family'] });
