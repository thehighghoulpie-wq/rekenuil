'use strict';
/* =====================================================================
   PAPIAMENTU (Eilandmagie) – woordjes, zinnetjes en weetjes over Curaçao
   Woordenlijst uitbreiden? Voeg een regel toe: ['papiamentu', 'nederlands', 'emoji'].
   ===================================================================== */

registerSubject({
  id: 'papiamentu', name: 'Eilandmagie', school: 'Papiamentu', ico: '🏝️', place: 'strand', placeName: 'Het Eilandstrand',
  teacher: 'yuana', teacherName: 'Shon Yuana', color: '#14A3C7', light: '#E3F7FC', dark: '#0B7A96',
  hello: 'Bon bini! Mi ta Shon Yuana. (Welkom! Ik ben Shon Yuana.) Kom, dan leer ik je de taal van Curaçao. Dushi, hè?'
});

const PAP = {
  groeten: [['Bon dia', 'Goedemorgen', '☀️'], ['Bon tardi', 'Goedemiddag', '🌤️'], ['Bon nochi', 'Goedenavond / goedenacht', '🌙'], ['Kon ta bai?', 'Hoe gaat het?', '🙂'],
    ['Mi ta bon', 'Het gaat goed met me', '👍'], ['Danki', 'Dank je', '🙏'], ['Masha danki', 'Heel erg bedankt', '💖'], ['Di nada', 'Graag gedaan', '😊'], ['Ayó', 'Dag! / Doei!', '👋'],
    ['Te aweró', 'Tot straks', '⏳'], ['Te mañan', 'Tot morgen', '📅'], ['Bon bini', 'Welkom', '🎉'], ['Por fabor', 'Alsjeblieft', '🥺'], ['Despensá', 'Sorry / pardon', '🙇'],
    ['Kon bo yama?', 'Hoe heet je?', '❓'], ['Bon probechu', 'Eet smakelijk', '🍽️']],
  getallen: [['un', '1', '1️⃣'], ['dos', '2', '2️⃣'], ['tres', '3', '3️⃣'], ['kuater', '4', '4️⃣'], ['sinku', '5', '5️⃣'], ['seis', '6', '6️⃣'], ['shete', '7', '7️⃣'],
    ['ocho', '8', '8️⃣'], ['nuebe', '9', '9️⃣'], ['dies', '10', '🔟'], ['diesun', '11', '🕚'], ['diesdos', '12', '🕛'], ['binti', '20', '👐'], ['shen', '100', '💯'], ['mil', '1000', '🏰']],
  kleuren: [['kòrá', 'rood', '🔴'], ['blou', 'blauw', '🔵'], ['hel', 'geel', '🟡'], ['bèrdè', 'groen', '🟢'], ['pretu', 'zwart', '⚫'], ['blanku', 'wit', '⚪'],
    ['maron', 'bruin', '🟤'], ['rosa', 'roze', '🩷'], ['orañá', 'oranje', '🟠'], ['gris', 'grijs', '🩶']],
  familie: [['mama', 'mama', '👩'], ['tata', 'papa', '👨'], ['ruman', 'broer of zus', '🧒'], ['ruman muhé', 'zus', '👧'], ['ruman hòmber', 'broer', '👦'], ['yu', 'kind (zoon of dochter)', '🧒'],
    ['wela', 'oma', '👵'], ['welo', 'opa', '👴'], ['tanta', 'tante', '👩‍🦱'], ['tio', 'oom', '👨‍🦱'], ['primo', 'neef', '🧑'], ['prima', 'nicht', '👩‍🦰'], ['famia', 'familie', '👨‍👩‍👧‍👦'], ['bebi', 'baby', '👶']],
  eten: [['pan', 'brood', '🍞'], ['keshi', 'kaas', '🧀'], ['piská', 'vis', '🐟'], ['galiña', 'kip', '🍗'], ['aros', 'rijst', '🍚'], ['funchi', 'maïspap', '🌽'], ['pastechi', 'gevuld pasteitje', '🥟'],
    ['sòpi', 'soep', '🍲'], ['awa', 'water', '💧'], ['lechi', 'melk', '🥛'], ['webu', 'ei', '🥚'], ['bakoba', 'banaan', '🍌'], ['patia', 'watermeloen', '🍉'], ['kuminda', 'eten', '🍽️'], ['fruta', 'fruit', '🍎']],
  dieren: [['kachó', 'hond', '🐶'], ['pushi', 'kat', '🐱'], ['kabritu', 'geit', '🐐'], ['baka', 'koe', '🐄'], ['kabai', 'paard', '🐴'], ['para', 'vogel', '🐦'], ['yuana', 'leguaan', '🦎'],
    ['dònki', 'ezel', '🫏'], ['turtuga', 'schildpad', '🐢'], ['kangreu', 'krab', '🦀'], ['makaku', 'aap', '🐒'], ['kolebra', 'slang', '🐍'], ['flamingo', 'flamingo', '🦩'], ['raton', 'muis', '🐭']],
  dagen: [['djadumingu', 'zondag', '☀️'], ['djaluna', 'maandag', '🌙'], ['djamars', 'dinsdag', '📘'], ['djarason', 'woensdag', '📗'], ['djaweps', 'donderdag', '📙'], ['djabièrnè', 'vrijdag', '🎈'], ['djasabra', 'zaterdag', '🎉'],
    ['awe', 'vandaag', '📍'], ['ayera', 'gisteren', '⬅️'], ['mañan', 'morgen', '➡️'], ['siman', 'week', '🗓️'], ['luna', 'maand', '🌕'], ['aña', 'jaar', '🎂']],
  maanden: [['yanüari', 'januari', '❄️'], ['febrüari', 'februari', '💝'], ['mart', 'maart', '🌱'], ['aprel', 'april', '🌷'], ['mei', 'mei', '🌸'], ['yüni', 'juni', '🌞'],
    ['yüli', 'juli', '🏖️'], ['ougùstùs', 'augustus', '🍦'], ['sèptèmber', 'september', '🎒'], ['òktober', 'oktober', '🍂'], ['novèmber', 'november', '🌧️'], ['desèmber', 'december', '🎄']],
  zinnen: [['Mi stima bo.', 'Ik hou van jou.', '💕'], ['Mi tin hamber.', 'Ik heb honger.', '🍽️'], ['Mi tin sed.', 'Ik heb dorst.', '🥤'], ['Mi ta kontentu.', 'Ik ben blij.', '😄'],
    ['Mi ta kansá.', 'Ik ben moe.', '😴'], ['Ban hunga!', 'Laten we spelen!', '⚽'], ['Mi no sa.', 'Ik weet het niet.', '🤷'], ['Unda bo ta?', 'Waar ben je?', '📍'],
    ['Kuantu aña bo tin?', 'Hoe oud ben je?', '🎂'], ['Mi tin dies aña.', 'Ik ben tien jaar.', '🔟'], ['E kuminda ta dushi!', 'Het eten is lekker!', '😋'], ['Drumi dushi.', 'Slaap lekker.', '🌙'],
    ['Mi ta bai skol.', 'Ik ga naar school.', '🏫'], ['Kon ta bai ku bo?', 'Hoe gaat het met jou?', '💬'], ['Ta bon.', 'Het is goed. / Oké.', '👌'], ['Mi yama…', 'Ik heet…', '📛']]
};
const PAPCAT = { groeten: 'Groeten', getallen: 'Getallen', kleuren: 'Kleuren', familie: 'Familie', eten: 'Eten & drinken', dieren: 'Dieren', dagen: 'Dagen & tijd', maanden: 'Maanden', zinnen: 'Zinnetjes' };
const ALLPAP = Object.entries(PAP).flatMap(([c, l]) => l.map(x => [...x, c]));

// gewone woordvraag: Papiamentu → Nederlands of andersom
function papWordQ(cat, diff) {
  const list = PAP[cat], [p, n, e] = kies(list);
  const dir = diff === 'easy' ? (Math.random() < .7 ? 'pn' : 'np') : Math.random() < .5 ? 'pn' : 'np';
  const N = diff === 'hard' ? 4 : 3;
  if (dir === 'pn') {
    const c = mkChoice(n, list.map(x => x[1]).filter(x => x !== n), N);
    return Object.assign(c, { key: 'pap' + p, text: `Wat betekent <b class="pap">${p}</b>?`, visual: diff === 'easy' ? `<div class="emo">${e}</div>` : '',
      hint: `Kijk naar het plaatje of denk aan de woordjes uit de les ${PAPCAT[cat]}.`, explain: `<b class="pap">${p}</b> ${e} betekent <b>${n}</b>.` });
  }
  const c = mkChoice(p, list.map(x => x[0]).filter(x => x !== p), N);
  return Object.assign(c, { key: 'pap' + p, choiceCls: 'pap', text: `Hoe zeg je <b>${n}</b> in het Papiamentu?`, visual: `<div class="emo">${e}</div>`,
    hint: `Het is een woordje uit de les ${PAPCAT[cat]}.`, explain: `<b>${n}</b> is in het Papiamentu: <b class="pap">${p}</b> ${e}.` });
}
// zinnetje bouwen: tik de woorden in de goede volgorde
function papOrderQ() {
  const usable = PAP.zinnen.filter(z => z[0].split(' ').length >= 3 && !z[0].includes('…'));
  const [p, n, e] = kies(usable);
  const words = p.replace(/[.!?]/g, '').split(' ');
  return { kind: 'order', tokens: words, answer: words, key: 'ord' + p, text: `Maak de zin: <b>${n}</b> ${e}`,
    hint: `Het eerste woord is <b class="pap">${words[0]}</b>.`, explain: `<b class="pap">${p}</b> betekent: ${n}`, answerText: p };
}
// rekenen in het Papiamentu
function papSumQ(diff) {
  const nums = PAP.getallen.slice(0, 10);
  const a = rnd(1, 5), b = rnd(1, 10 - a), ans = a + b;
  const c = mkChoice(nums[ans - 1][0], nums.map(x => x[0]).filter((x, i) => i !== ans - 1), 3);
  return Object.assign(c, { key: 'psum' + a + b, choiceCls: 'pap', text: `<b class="pap">${nums[a - 1][0]}</b> + <b class="pap">${nums[b - 1][0]}</b> = ?`,
    hint: `${nums[a - 1][0]} = ${a} en ${nums[b - 1][0]} = ${b}.`, explain: `${a} + ${b} = ${ans}, en ${ans} is <b class="pap">${nums[ans - 1][0]}</b>.` });
}
function papDayQ() {
  const days = PAP.dagen.slice(0, 7), order = [1, 2, 3, 4, 5, 6, 0];
  const k = rnd(0, 6), cur = days[order[k]], nxt = days[order[(k + 1) % 7]];
  const c = mkChoice(nxt[0], days.map(d => d[0]).filter(d => d !== nxt[0] && d !== cur[0]), 3);
  return Object.assign(c, { key: 'pday' + k, choiceCls: 'pap', text: `Welke dag komt na <b class="pap">${cur[0]}</b> (${cur[1]})?`,
    hint: 'Alle dagen beginnen met <b>dja</b>. Denk aan de volgorde: maandag, dinsdag, woensdag…', explain: `Na ${cur[1]} komt ${nxt[1]}: <b class="pap">${nxt[0]}</b>.` });
}

/* ---------- weetjes over Curaçao ---------- */
const WEETJES = [
  ['Wat is de hoofdstad van Curaçao?', 'Willemstad', 'Oranjestad', 'Kralendijk', 'De hoofdstad is Willemstad. Oranjestad ligt op Aruba en Kralendijk op Bonaire.', '🏙️'],
  ['Welke kleuren heeft de vlag van Curaçao?', 'blauw, geel en wit', 'rood, wit en blauw', 'groen, geel en rood', 'De vlag is blauw met een gele streep en twee witte sterren.', '🏳️'],
  ['Waar staan de twee sterren op de vlag voor?', 'Curaçao en Klein Curaçao', 'de zon en de maan', 'papa en mama', 'De twee sterren staan voor Curaçao en het kleine eilandje Klein Curaçao.', '⭐'],
  ['Wat is de hoogste berg van Curaçao?', 'de Christoffelberg', 'de Mont Blanc', 'de Vaalserberg', 'De Christoffelberg is ongeveer 372 meter hoog.', '⛰️'],
  ['Hoe heet de drijvende brug in Willemstad?', 'Koningin Emmabrug', 'Erasmusbrug', 'Magere Brug', 'De Koningin Emmabrug drijft en zwaait opzij voor schepen.', '🌉'],
  ['Welke eilanden noemen we de ABC-eilanden?', 'Aruba, Bonaire en Curaçao', 'Amerika, Brazilië en Canada', 'Ameland, Borkum en Cadzand', 'A van Aruba, B van Bonaire en C van Curaçao.', '🏝️'],
  ['Wat betekent het woord "dushi"?', 'lekker, lief of schatje', 'heel snel', 'goedemorgen', 'Dushi is het bekendste woordje: eten is dushi, en jij bent ook dushi!', '🍬'],
  ['In welke zee ligt Curaçao?', 'de Caraïbische Zee', 'de Noordzee', 'de Middellandse Zee', 'Curaçao ligt in de warme Caraïbische Zee, vlak bij Venezuela.', '🌊'],
  ['Welk roze dier zie je vaak in de zoutmeren van Curaçao?', 'de flamingo', 'de papegaai', 'de roze olifant', 'Flamingo\'s staan graag in ondiep zout water.', '🦩'],
  ['Wat is pastechi?', 'een gevuld deegpasteitje', 'een soort dans', 'een vis', 'Pastechi is een krokant pasteitje met bijvoorbeeld kaas, kip of vlees erin.', '🥟'],
  ['Wat is funchi?', 'een stevige maïspap', 'een vrucht', 'een vogel', 'Funchi wordt gemaakt van maïsmeel. Je eet het bij soep of vis.', '🌽'],
  ['Welke boom groeit helemaal scheef door de wind?', 'de watapana (dividivi)', 'de appelboom', 'de kerstboom', 'De passaatwind blaast steeds uit dezelfde hoek. Daardoor groeit de watapana scheef.', '🌳'],
  ['Wat is Klein Curaçao?', 'een klein onbewoond eiland', 'een kleine stad', 'een snoepje', 'Klein Curaçao is een eilandje waar niemand woont, met een vuurtoren en schildpadden.', '🏖️'],
  ['Wat is tambú?', 'muziek met trommels en dans', 'een soort soep', 'een vis', 'Tambú is traditionele muziek van Curaçao, met trommels, zang en dans.', '🥁'],
  ['Wat is Seú?', 'een oogstfeest met muziek en dans', 'een berg', 'een kleur', 'Bij Seú vieren mensen de oogst met een vrolijke optocht.', '🌾'],
  ['Welk feest met optochten en kleurige kostuums is heel groot op Curaçao?', 'Karnaval', 'Sinterklaas', 'Koningsdag', 'Het karnaval op Curaçao duurt weken, met grote optochten en muziek!', '🎭'],
  ['Hoe heet de kade met de vrolijk gekleurde huizen in Willemstad?', 'de Handelskade', 'de Wallen', 'het Binnenhof', 'De huizen aan de Handelskade zijn geel, roze, blauw en groen.', '🏘️'],
  ['Welke talen spreken veel mensen op Curaçao?', 'Papiamentu, Nederlands, Engels en Spaans', 'alleen Frans', 'Duits en Pools', 'Veel mensen op Curaçao spreken wel drie of vier talen!', '🗣️'],
  ['Wanneer is Dia di Bandera (de Dag van de Vlag)?', '2 juli', '25 december', '1 januari', 'Op 2 juli vieren ze de vlag en het volkslied van Curaçao.', '🎌'],
  ['Hoe warm is het meestal op Curaçao?', 'rond de 30 graden', 'rond de 0 graden', 'rond de 10 graden', 'Het is er bijna altijd zomer, met een frisse wind.', '🌡️'],
  ['Wie was Tula?', 'een man die in 1795 opkwam voor vrijheid', 'een zanger', 'een piraat', 'Op 17 augustus herdenkt Curaçao Tula, die in 1795 in opstand kwam tegen de slavernij.', '🕊️']
];
function genWeetje(diff) {
  const [q, good, w1, w2, uitleg, e] = kies(WEETJES);
  const c = mkChoice(good, [w1, w2], 3);
  return Object.assign(c, { key: 'wt' + q, text: q, visual: `<div class="emo">${e}</div>`, hint: 'Denk aan de weetjes uit de les. Weet je het niet? Gok maar, dan leer je het meteen!', explain: `<b>${cap(good)}</b>. ${uitleg}` });
}

/* ---------- uitspraak-tips ---------- */
const UITSPRAAK = `<ul class="tips"><li><b>u</b> klinkt als <b>oe</b>: un = oen</li><li><b>ch</b> klinkt als <b>tsj</b>: ocho = otsjo</li><li><b>sh</b> klinkt als <b>sj</b>: shete = sjete</li><li><b>y</b> klinkt als <b>j</b>: yuana = joeana</li><li><b>ñ</b> klinkt als <b>nj</b>: mañan = manjan</li><li><b>dj</b> klinkt als in <b>dj</b>embé: djaluna</li><li><b>ò</b> en <b>è</b> zijn open klanken, <b>ü</b> klinkt als de Nederlandse <b>u</b></li></ul>`;
const papCards = cat => PAP[cat].map(([p, n, e]) => [`<span class="pap">${p}</span>`, n, e]);
const papTable = cat => `<table class="dtable pap-t">${PAP[cat].map(([p, n, e]) => `<tr><td>${e}</td><td class="pap">${p}</td><td>${n}</td></tr>`).join('')}</table>`;

/* ---------- onderwerpen aanmelden ---------- */
const papTopic = (id, name, sub, ico, gen, lessonExtra = []) => registerTopic('papiamentu', { id, name, sub, ico, gen, pace: { easy: 5, medium: 4, hard: 3 }, comma: false,
  lesson: [{ t: name, h: 'Tik op een kaart om te zien wat het betekent. Zeg het woord hardop!', w: 'kaarten', o: { cards: papCards(id) } }, ...lessonExtra, { t: 'Alles op een rij', h: 'Hier zijn alle woordjes nog een keer.', v: papTable(id) }] });

papTopic('groeten', 'Groeten', 'bon dia!', '👋', d => papWordQ('groeten', d), [
  { t: 'Hoe zeg je het?', h: 'Papiamentu spreek je bijna uit zoals je het schrijft. Een paar letters zijn anders:' + UITSPRAAK },
  { t: 'Zo groet je wela (oma)', h: '<div class="dialog"><p><b class="pap">Bon dia, wela! Kon ta bai?</b><br><i>Goedemorgen, oma! Hoe gaat het?</i></p><p><b class="pap">Mi ta bon, danki. I bo?</b><br><i>Goed, dank je. En jij?</i></p><p><b class="pap">Mi ta bon tambe!</b><br><i>Met mij gaat het ook goed!</i></p></div>' }
]);
papTopic('getallen', 'Getallen', 'un, dos, tres', '🔢', d => d !== 'easy' && Math.random() < .35 ? papSumQ(d) : papWordQ('getallen', d), [
  { t: 'Tellen tot tien', h: '<b class="pap">un, dos, tres, kuater, sinku, seis, shete, ocho, nuebe, dies!</b><br>Tip: tel je vingers en zeg het hardop. Na tien komt <b class="pap">diesun</b> (tien-één = 11) en <b class="pap">diesdos</b> (12). Slim, hè?' }
]);
papTopic('kleuren', 'Kleuren', 'kòrá, blou, hel', '🎨', d => papWordQ('kleuren', d), [
  { t: 'Kleuren in een zin', h: 'In het Papiamentu komt de kleur meestal áchter het woord.<br><b class="pap">un kachó pretu</b> = een zwarte hond<br><b class="pap">un flor kòrá</b> = een rode bloem' }
]);
papTopic('familie', 'Familie', 'mama, tata, wela', '👨‍👩‍👧', d => papWordQ('familie', d), [
  { t: 'Mijn familie', h: '<b class="pap">Mi tin un ruman.</b> = Ik heb een broer of zus.<br><b class="pap">Mi wela ta biba na Kòrsou.</b> = Mijn oma woont op Curaçao.<br>(Kòrsou is Curaçao in het Papiamentu!)' }
]);
papTopic('eten', 'Eten & drinken', 'pan, keshi, pastechi', '🥟', d => papWordQ('eten', d), [
  { t: 'Aan tafel', h: '<b class="pap">Bon probechu!</b> = Eet smakelijk!<br><b class="pap">E kuminda ta dushi!</b> = Het eten is lekker!<br><b class="pap">Mi ke awa, por fabor.</b> = Ik wil water, alsjeblieft.' }
]);
papTopic('dieren', 'Dieren', 'kachó, pushi, yuana', '🦎', d => papWordQ('dieren', d), [
  { t: 'Dieren van het eiland', h: 'Op Curaçao zie je overal <b class="pap">yuana</b> (leguanen) in de zon liggen, <b class="pap">kabritu</b> (geiten) langs de weg en <b class="pap">flamingo</b>\'s in de zoutmeren.' }
]);
papTopic('dagen', 'Dagen & maanden', 'djaluna, djamars', '📅', d => {
  if (d !== 'easy' && Math.random() < .3) return papDayQ();
  return papWordQ(d === 'hard' && Math.random() < .5 ? 'maanden' : 'dagen', d);
}, [
  { t: 'De dagen', h: 'Alle dagen beginnen met <b class="pap">dja</b> (dag):<br><b class="pap">djaluna</b> maandag · <b class="pap">djamars</b> dinsdag · <b class="pap">djarason</b> woensdag · <b class="pap">djaweps</b> donderdag · <b class="pap">djabièrnè</b> vrijdag · <b class="pap">djasabra</b> zaterdag · <b class="pap">djadumingu</b> zondag' },
  { t: 'De maanden', h: 'De maanden lijken veel op het Nederlands!', w: 'kaarten', o: { cards: papCards('maanden') } }
]);
papTopic('zinnen', 'Zinnetjes', 'voor thuis en familie', '💬', d => d !== 'easy' && Math.random() < .4 ? papOrderQ() : papWordQ('zinnen', d), [
  { t: 'Verras je familie!', h: 'Probeer vandaag één zinnetje thuis. Zeg bijvoorbeeld tegen mama of papa: <b class="pap">Mi stima bo!</b> 💕 Of na het eten: <b class="pap">E kuminda ta dushi!</b>' },
  { t: 'Zinnen bouwen', h: 'In de quiz kun je zinnen bouwen: tik de woordjes in de goede volgorde. <b class="pap">Mi</b> = ik, <b class="pap">bo</b> = jij, <b class="pap">tin</b> = hebben, <b class="pap">ta</b> = zijn.' }
]);
registerTopic('papiamentu', { id: 'weetjes', name: 'Weetjes over Curaçao', sub: 'vlag, brug, flamingo', ico: '🌴', gen: genWeetje, pace: { easy: 4, medium: 4, hard: 3 }, comma: false, lesson: [
  { t: 'Dushi Kòrsou', h: 'Curaçao (in het Papiamentu: <b class="pap">Kòrsou</b>) is een eiland in de Caraïbische Zee. Het hoort bij het Koninkrijk der Nederlanden. Tik op de kaarten voor weetjes!', w: 'kaarten', o: { cards: WEETJES.slice(0, 10).map(w => [w[0], cap(w[1]), w[5]]) } },
  { t: 'Nog meer weetjes', h: 'Tik op de kaarten.', w: 'kaarten', o: { cards: WEETJES.slice(10).map(w => [w[0], cap(w[1]), w[5]]) } }
] });
