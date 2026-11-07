'use strict';
/* =====================================================================
   Verzamelen en vieren (Update 5)
   Drie dagopdrachtjes, het Eilandalbum met stickers, het karnavalskostuum
   in stukjes, het Toverboek van de maand en de stempelkalender.
   Alles vast en voorspelbaar: je ziet altijd wat je krijgt en wat je ervoor doet.
   Niet gehaald is nooit erg: er komt geen straf of "kwijt".
   ===================================================================== */
const placeIsOpen = id => placeOpen(PLACES.find(p => p.id === id));

/* ---------- drie kleine dagopdrachtjes ---------- */
const QUESTS = [
  { id: 'les', ico: '📖', txt: ['Maak 1 les af', 'Kaba 1 lès', 'Finish 1 lesson'], need: 1, val: d => d.counters.lessonRuns },
  { id: 'goed', ico: '🎯', txt: ['Beantwoord 10 vragen goed', 'Kontestá 10 pregunta bon', 'Answer 10 questions right'], need: 10, val: d => d.counters.correct },
  { id: 'drank', ico: '🧪', txt: ['Brouw de Toverdrank', 'Prepará e Bebida di Magia', 'Brew the Magic Potion'], need: 1, val: d => d.potion.total },
  { id: 'spel', ico: '🎮', txt: ['Speel een spelletje', 'Hunga un wega', 'Play a game'], need: 1, val: d => d.counters.games, ok: () => placeIsOpen('speel') },
  { id: 'tuin', ico: '🌱', txt: ['Kijk in de Geheime Tuin', 'Bai wak e Hardin Sekreto', 'Visit the Secret Garden'], need: 1, val: d => d.counters.garden, ok: () => placeIsOpen('tuin') },
  { id: 'pap', ico: '🏝️', txt: ['Beantwoord 5 Papiamentu-vragen goed', 'Kontestá 5 pregunta di Papiamentu bon', 'Answer 5 Papiamentu questions right'], need: 5, val: d => d.counters.pap },
  { id: 'aai', ico: '🐾', txt: ['Aai je huisdier', 'Karisiá bo bestia di kas', 'Cuddle your pet'], need: 1, val: d => d.counters.pets, ok: () => look().pet !== 'geen' },
  { id: 'rij', ico: '🔥', txt: ['Haal 5 goed op een rij', 'Haña 5 bon un tras di otro', 'Get 5 right in a row'], need: 1, abs: true, val: d => (d.quests && d.quests.s5 ? 1 : 0) },
  { id: 'loop', ico: '🚶', txt: ['Maak een eilandwandeling', 'Hasi un kaminata riba isla', 'Take an island walk'], need: 1, val: d => d.counters.walks, ok: () => placeIsOpen('speel') }
];
function questsToday() {
  const day = today();
  if (!D.quests || D.quests.day !== day) {
    const pool = QUESTS.filter(q => !q.ok || q.ok()).slice();
    let seed = [...day].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const ids = [];
    while (ids.length < 3 && pool.length) { seed = (seed * 1103515245 + 12345) >>> 0; ids.push(pool.splice(seed % pool.length, 1)[0].id); }
    const base = {}; for (const q of QUESTS) base[q.id] = q.abs ? 0 : q.val(D);
    D.quests = { day, ids, base, done: [], s5: 0, all: 0 }; save();
  }
  return D.quests;
}
const questOf = id => QUESTS.find(q => q.id === id);
const questProg = (q, Q) => Math.max(0, Math.min(q.need, q.abs ? q.val(D) : q.val(D) - (Q.base[q.id] || 0)));
function questsCheck() {
  if (!D.profile) return;
  const Q = questsToday(); let fresh = 0;
  for (const id of Q.ids) {
    const q = questOf(id); if (!q || Q.done.includes(id)) continue;
    if (questProg(q, Q) >= q.need) { Q.done.push(id); fresh++; addStars(3); toast(`${q.ico} ${t('questDone')}: <b>${tri(q.txt)}</b> +3 ⭐`); }
  }
  if (Q.ids.length && Q.done.length === Q.ids.length && !Q.all) {
    Q.all = 1; D.counters.questAll++; addStars(5);
    setTimeout(() => { toast(`🏆 ${t('questAll')} +5 ⭐`, 3200); confetti(70); }, 1200);
  }
  if (fresh) save();
}
function questCardHTML() {
  const Q = questsToday();
  return `<div class="questcard card"><div class="qc-head"><b>📜 ${t('questTitle')}</b><span class="pill">${Q.done.length}/${Q.ids.length}</span></div>
    ${Q.ids.map(id => {
      const q = questOf(id); if (!q) return '';
      const p = questProg(q, Q), done = Q.done.includes(id);
      return `<div class="qrow ${done ? 'done' : ''}"><span class="qr-ico">${done ? '✅' : q.ico}</span><span class="qr-t">${tri(q.txt)}</span><span class="qr-bar"><i style="width:${Math.round(p / q.need * 100)}%"></i></span><span class="qr-n">${p}/${q.need}</span></div>`;
    }).join('')}<p class="muted qc-note">${t('questNote')}</p></div>`;
}

/* ---------- het Eilandalbum: stickers van Curaçao ----------
   [id, plaatje, naam [nl, pap, en], hoe verdien je hem [nl, pap, en], test]
   Papiamentu alleen waar het woord al is nagekeken; anders staat er Nederlands. */
const STICKERS = [
  ['flamingo', '🦩', ['Flamingo', 'Flamingo', 'Flamingo'], ['Beantwoord 25 vragen goed', null, 'Answer 25 questions right'], d => d.counters.correct >= 25],
  ['yuana', '🦎', ['Leguaan', 'Yuana', 'Iguana'], ['Maak 3 lessen af', null, 'Finish 3 lessons'], d => Object.keys(d.lessons).length >= 3],
  ['kabritu', '🐐', ['Geitje', 'Kabritu', 'Goat'], ['Brouw je eerste Toverdrank', null, 'Brew your first potion'], d => d.potion.total >= 1],
  ['piska', '🐠', ['Tropische vis', 'Piská', 'Tropical fish'], ['Beantwoord 100 vragen goed', null, 'Answer 100 questions right'], d => d.counters.correct >= 100],
  ['kibrahacha', '🌼', ['Kibrahacha', 'Kibrahacha', 'Kibrahacha'], ['Laat een plant helemaal bloeien in de tuin', null, 'Make a garden plant bloom fully'], () => Object.keys(TOPIC).some(k => topicStatus(k) === 'super')],
  ['schildpad', '🐢', ['Zeeschildpad', null, 'Sea turtle'], ['Oefen op 3 verschillende dagen', null, 'Practise on 3 different days'], d => d.days.length >= 3],
  ['dividivi', '🌳', ['Dividiviboom', 'Dividivi', 'Divi-divi tree'], ['Oefen in alle drie de klassen', null, 'Practise in all three classes'], d => Object.keys(d.subjectsTried).length >= 3],
  ['brug', '🌉', ['Emmabrug', null, 'Queen Emma bridge'], ['Win een uitdaging met Dax', null, 'Win a challenge with Dax'], d => d.counters.challenge >= 1],
  ['cactus', '🌵', ['Cactus', null, 'Cactus'], ['Haal 3 sterren op Moeilijk', null, 'Get 3 stars on Hard'], d => d.counters.hard3 >= 1],
  ['zeester', '⭐', ['Zeester', null, 'Starfish'], ['Haal 10 goed op een rij', null, 'Get 10 right in a row'], d => d.counters.bestStreak >= 10],
  ['parkiet', '🦜', ['Parkiet', null, 'Parakeet'], ['Beantwoord 50 Papiamentu-vragen goed', null, 'Answer 50 Papiamentu questions right'], d => d.counters.pap >= 50],
  ['huisjes', '🏘️', ['Handelskade', null, 'Handelskade'], ['Maak 3 eilandwandelingen', null, 'Take 3 island walks'], d => d.counters.walks >= 3],
  ['telefoon', '📞', ['Telefoon van Wela', null, 'Wela’s phone'], ['Bel 2 keer met Wela', null, 'Call Wela twice'], d => d.counters.calls >= 2],
  ['muziek', '🎵', ['Muzieknoot', null, 'Music note'], ['Speel een liedje na op de Toverpiano', null, 'Repeat a tune on the Magic Piano'], d => d.counters.piano >= 1],
  ['geheim', '🐉', ['Het geheim van Pip', null, 'Pip’s secret'], ['Vind het geheim van Pip (tik vaak op hem!)', null, 'Find Pip’s secret (tap him a lot!)'], d => d.counters.secret >= 1],
  ['vlag', '🇨🇼', ['Vlag van Curaçao', null, 'Flag of Curaçao'], ['Maak op één dag alle dagopdrachtjes af', null, 'Finish all daily quests in one day'], d => d.counters.questAll >= 1]
];
function stickersCheck() {
  if (!D.profile) return;
  const fresh = STICKERS.filter(s => !D.stickers.includes(s[0]) && s[4](D));
  if (!fresh.length) return;
  fresh.forEach(s => D.stickers.push(s[0])); save();
  fresh.forEach((s, i) => setTimeout(() => toast(`📒 ${t('stickerNew')}: ${s[1]} <b>${tri(s[2])}</b>!`, 3200), 400 + i * 1500));
}

/* ---------- karnavalskostuum in drie stukjes ---------- */
const COSTUME = [
  ['hat', 'karnaval', ['Brouw 3 keer de Toverdrank', null, 'Brew the potion 3 times'], d => d.potion.total >= 3, d => [Math.min(3, d.potion.total), 3]],
  ['outfit', 'karnaval', ['Maak 6 lessen af', null, 'Finish 6 lessons'], d => Object.keys(d.lessons).length >= 6, d => [Math.min(6, Object.keys(d.lessons).length), 6]],
  ['wand', 'karnaval', ['Beantwoord 200 vragen goed', null, 'Answer 200 questions right'], d => d.counters.correct >= 200, d => [Math.min(200, d.counters.correct), 200]]
];
function costumeCheck() {
  if (!D.profile) return;
  for (const [k, id, , ok] of COSTUME) if (!D.owned[k].includes(id) && ok(D)) {
    D.owned[k].push(id); save();
    setTimeout(() => { toast(`🎭 ${t('costumeNew')}: <b>${ITEM[k + ':' + id].name}</b>!`, 3600); confetti(60); }, 600);
  }
}
const costumeHint = (k, id) => { const c = COSTUME.find(x => x[0] === k && x[1] === id); return c ? `🎭 ${tri(c[2])}` : ''; };

/* ---------- schermen: album en toverboek (vanuit de Sterrentoren) ---------- */
PARENT.album = 'progress'; PARENT.book = 'progress';
function openAlbum() {
  const el = $('#album'), have = STICKERS.filter(s => D.stickers.includes(s[0])).length;
  el.innerHTML = backbar('📒 ' + t('albumTitle')) + `<div class="wrap"><p class="muted center">${t('albumSub')} <b>${have}/${STICKERS.length}</b></p>
    <div class="stickers">${STICKERS.map(s => { const on = D.stickers.includes(s[0]); return `<div class="sticker card ${on ? 'on' : ''}"><span class="st-e">${on ? s[1] : '❔'}</span><b>${on ? tri(s[2]) : '…'}</b><small>${tri(s[3])}</small></div>`; }).join('')}</div>
    <h2 class="sect">🎭 ${t('costumeTitle')}</h2><p class="muted">${t('costumeSub')}</p>
    <div class="costume">${COSTUME.map(([k, id, how, ok, prog]) => { const own = D.owned[k].includes(id), [n, of] = prog(D);
      return `<div class="cpiece card ${own ? 'on' : ''}">${avatarSVG(Object.assign({}, look(), { [k]: id, pet: 'geen' }), own ? 'lach' : 'blij', 'mini')}<b>${ITEM[k + ':' + id].name}</b><small>${own ? '✅ ' + t('owned') : tri(how)}</small>${own ? '' : `<span class="qr-bar"><i style="width:${Math.round(n / of * 100)}%"></i></span><small>${n}/${of}</small>`}</div>`; }).join('')}</div></div>`;
  bindCommon(el); show('album');
  stagger($$('.sticker.on', el), 'pop', 40, 100);
}
const MONTHS_NL = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = m => lang() === 'en' ? MONTHS_EN[m] : lang() === 'pap' ? PAP.maanden[m][0] : MONTHS_NL[m];
// stempelkalender: elke dag dat je oefende krijgt een sterretje van Pip (nooit iets over "missen")
function calendarHTML(y, m) {
  const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), lead = (first.getDay() + 6) % 7, set = new Set(D.days), td = today();
  const wd = lang() === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
  let cells = wd.map(w => `<span class="cal-h">${w}</span>`).join('') + '<span></span>'.repeat(lead);
  for (let d = 1; d <= days; d++) { const k = `${y}-${pad2(m + 1)}-${pad2(d)}`; cells += `<span class="cal-d ${set.has(k) ? 'stamp' : ''} ${k === td ? 'today' : ''}">${set.has(k) ? '⭐' : d}</span>`; }
  return `<div class="calendar card"><h3>📅 ${monthName(m)} ${y}</h3><div class="cal-grid">${cells}</div><p class="muted">${t('calNote')}</p></div>`;
}
function progressExtras(el) {
  const now = new Date(), h = $('.sect', el); if (!h) return;
  h.insertAdjacentHTML('afterend', `<div class="pbtns"><button class="btn" id="toalbum">📒 ${t('albumTitle')}</button><button class="btn" id="tobook">📖 ${t('bookTitle')}</button><button class="btn" id="tofriends">🧙 ${t('friendsTitle')}</button></div>${calendarHTML(now.getFullYear(), now.getMonth())}`);
  $('#toalbum', el).onclick = () => { SND.click(); openAlbum(); };
  $('#tobook', el).onclick = () => { SND.click(); openBook(); };
  $('#tofriends', el).onclick = () => { SND.click(); openFriends(); };
}
function openBook() {
  const el = $('#book'), now = new Date(), y = now.getFullYear(), m = now.getMonth(), ym = `${y}-${pad2(m + 1)}`;
  const inMonth = ts => { const d = new Date(+ts); return d.getFullYear() === y && d.getMonth() === m; };
  const days = D.days.filter(d => d.startsWith(ym)).length;
  const logs = Object.entries(D.daylog).filter(([k]) => k.startsWith(ym));
  const q = logs.reduce((a, [, v]) => a + v.q, 0), ok = logs.reduce((a, [, v]) => a + v.ok, 0), min = Math.round(logs.reduce((a, [, v]) => a + v.sec, 0) / 60);
  const best = logs.sort((a, b) => b[1].ok - a[1].ok)[0];
  const lessons = Object.values(D.lessons).filter(inMonth).length;
  const bloom = Object.keys(TOPIC).filter(k => topicStatus(k) === 'super');
  const fav = bloom.length ? TOPIC[bloom[0]] : null;
  const L = look();
  el.innerHTML = backbar('📖 ' + t('bookTitle')) + `<div class="wrap narrow"><div class="book card">
    <div class="book-head">${avatarSVG(L, 'lach', 'small')}<div><h2>${t('bookOf', { m: monthName(m) })}</h2><div class="muted">${esc(playerName())} · Toverschool Sterrenlicht</div></div></div>
    <div class="stats">${[['📅', days, t('days')], ['✅', ok, t('correctAns')], ['📝', q, t('bookQ')], ['⏱️', min, t('bookMin')], ['📖', lessons, t('bookLessons')], ['🌺', bloom.length, t('bookBloom')], ['📒', D.stickers.length, t('bookStickers')]].map(([i, n, l]) => `<div class="stat card"><span>${i}</span><b>${n}</b><small>${l}</small></div>`).join('')}</div>
    ${best ? `<p class="book-line">🌟 ${t('bookBest', { d: +best[0].slice(8), m: monthName(m), n: best[1].ok })}</p>` : ''}
    ${fav ? `<p class="book-line">🌺 ${t('bookFav', { t: tTopic(fav) })}</p>` : ''}
    <div class="pipline">${pipSVG('trots', 'tiny')}<span>${t(days ? 'bookPip' : 'bookPip0')}</span></div></div>
    ${calendarHTML(y, m)}</div>`;
  bindCommon(el); show('book');
  $$('.book .stat b', el).forEach((b, i) => { const n = +b.textContent; b.textContent = '0'; setTimeout(() => countUp(b, n), 120 + i * 90); });
}
