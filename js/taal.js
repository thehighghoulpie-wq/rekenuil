'use strict';
/* =====================================================================
   TAAL (Woordspreuken) – spelling, woordenschat, lezen, grammatica
   Woordenlijsten uitbreiden? Voeg gewoon regels toe aan de lijsten hieronder.
   ===================================================================== */

registerSubject({
  id: 'taal', name: 'Woordspreuken', school: 'Taal', ico: '📚', place: 'bieb', placeName: 'De Woordenbibliotheek',
  teacher: 'inkie', teacherName: 'Juf Inkie', color: '#E85D9E', light: '#FFEEF6', dark: '#B8326F',
  hello: 'Hallo-hallo! Ik ben Juf Inkie. Met mijn acht armen schrijf ik acht woorden tegelijk. Welke spreuk leren we vandaag?'
});

// zin met ~ op de plek van het woord; het woord krijgt een gat
function gapSentence(sentence, word, gapRe, cls = '') {
  const gw = word.replace(gapRe, '<span class="gap">__</span>');
  return sentence.replace('~', `<b class="gapword ${cls}">${gw}</b>`);
}
const fullSentence = (sentence, word) => sentence.replace('~', `<b>${word}</b>`);

/* ---------- ei / ij ---------- */
const EIIJ = [
  ['trein', 'De ~ vertrekt om acht uur.'], ['klein', 'Pip is een heel ~ draakje.'], ['plein', 'We spelen tikkertje op het ~.'], ['geit', 'De ~ eet het gras op.'],
  ['reis', 'We maken een lange ~ naar Curaçao.'], ['meisje', 'Het ~ draagt een tovermantel.'], ['eiland', 'Curaçao is een mooi ~.'], ['zeil', 'Het ~ van de boot is wit.'],
  ['steil', 'De berg is erg ~.'], ['veilig', 'Steek ~ over bij het zebrapad.'], ['weinig', 'Er zit nog maar ~ limonade in de fles.'], ['geheim', 'Kun jij een ~ bewaren?'],
  ['feit', 'Dat is een ~: de aarde is rond.'], ['reiger', 'Een ~ staat stil in het water.'], ['eind', 'Aan het ~ van de dag ben ik moe.'], ['trein', 'In de ~ lees ik een boek.'],
  ['ijs', 'Ik wil een ~je met aardbeiensmaak.'], ['prijs', 'Wat is de ~ van dit boek?'], ['tijd', 'Hoe laat is het? Het is ~ voor de les!'], ['lijn', 'Teken een rechte ~.'],
  ['blij', 'Ik ben ~ met mijn cadeau.'], ['fijn', 'Wat een ~e vakantie!'], ['vrij', 'Morgen zijn we ~ van school.'], ['pijl', 'De ~ wijst naar links.'],
  ['spijker', 'Papa slaat een ~ in de muur.'], ['krijt', 'De juf schrijft met ~ op het bord.'], ['tijger', 'De ~ heeft strepen.'], ['ijzer', 'Een magneet trekt ~ aan.'],
  ['schrijven', 'Ik kan al mooi ~.'], ['kijken', 'Mag ik even ~?'], ['glijbaan', 'De ~ is superhoog.'], ['dijk', 'Achter de ~ ligt de zee.'],
  ['wijzer', 'De grote ~ staat op de 12.'], ['rijst', 'We eten ~ met kip.'], ['vrolijk', 'Pip zingt een ~ liedje.'], ['eerlijk', 'Het is ~ om de snoepjes te verdelen.'],
  ['gezondheid', 'Hatsjoe! ~!'], ['waarheid', 'Vertel altijd de ~.']
];
const eiijRule = w => /lijk$/.test(w) ? 'Woorden die eindigen op <b>-lijk</b> schrijf je altijd met <b>ij</b>: vrolijk, eerlijk, vriendelijk.'
  : /heid$/.test(w) ? 'Woorden die eindigen op <b>-heid</b> schrijf je altijd met <b>ei</b>: gezondheid, waarheid, snelheid.'
  : w.includes('ij') ? `<b>${w}</b> schrijf je met de <b>lange ij</b>. Dit woord moet je onthouden. Tip: schrijf het een paar keer op!` : `<b>${w}</b> schrijf je met de <b>korte ei</b>. Dit woord moet je onthouden. Tip: schrijf het een paar keer op!`;
function genEiij(diff) {
  let list = EIIJ; if (diff === 'easy') list = EIIJ.filter(([w]) => !/(lijk|heid)$/.test(w));
  const [w, s] = kies(list), ans = w.includes('ij') ? 'ij' : 'ei';
  const c = { kind: 'choice', choices: ['ei', 'ij'], answer: ans === 'ei' ? 0 : 1, big: true };
  return Object.assign(c, { text: 'Kies: <b>ei</b> of <b>ij</b>?', visual: `<div class="sentence">${gapSentence(s, w, /ei|ij/)}</div>`, key: 'eiij' + w + s,
    hint: 'Er is geen klank-verschil tussen ei en ij. Bij woorden op <b>-lijk</b> is het altijd ij, bij <b>-heid</b> altijd ei. De rest moet je onthouden.',
    explain: `<div class="sentence">${fullSentence(s, w)}</div>${eiijRule(w)}` });
}

/* ---------- au / ou ---------- */
const AUOU = [
  ['auto', 'De ~ is rood.'], ['saus', 'Wil je ~ op je patat?'], ['pauze', 'In de ~ eten we fruit.'], ['blauw', 'De zee bij Curaçao is heel ~.'], ['gauw', 'Kom ~ binnen, het regent!'],
  ['kauwgom', 'Er plakt ~ onder mijn schoen.'], ['augustus', 'In ~ is het zomervakantie.'], ['klauw', 'De kat steekt zijn ~ uit.'], ['pauw', 'De ~ laat zijn mooie veren zien.'], ['dinosaurus', 'Een ~ leefde heel lang geleden.'],
  ['flauw', 'Dat is een ~e grap.'], ['rauw', 'Wortels kun je ook ~ eten.'], ['astronaut', 'De ~ vliegt naar de maan.'],
  ['oud', 'Mijn opa is al heel ~.'], ['goud', 'De schat is van ~.'], ['hout', 'De tafel is van ~ gemaakt.'], ['zout', 'Zeewater is ~.'], ['koud', 'In de winter is het ~.'],
  ['kous', 'Ik heb een gat in mijn ~.'], ['fout', 'Een ~ maken is niet erg.'], ['vrouw', 'De ~ zwaait naar ons.'], ['touw', 'We springen over het ~.'], ['mouw', 'Mijn ~ is nat.'],
  ['schouder', 'Pip zit op mijn ~.'], ['kabouter', 'De ~ heeft een rode muts.'], ['bouwen', 'We ~ een zandkasteel.'], ['vouwen', 'Ik kan een vliegtuigje ~.'], ['houden', 'Ik ~ van pastechi.']
];
function genAuou(diff) {
  const [w, s] = kies(AUOU), ans = w.includes('au') ? 'au' : 'ou';
  return { text: 'Kies: <b>au</b> of <b>ou</b>?', kind: 'choice', choices: ['au', 'ou'], answer: ans === 'au' ? 0 : 1, big: true, key: 'auou' + w,
    visual: `<div class="sentence">${gapSentence(s, w, /au|ou/)}</div>`,
    hint: 'au en ou klinken hetzelfde. Woorden die van ver komen (auto, pauze, astronaut) hebben vaak au. Maar meestal moet je het woord gewoon onthouden.',
    explain: `<div class="sentence">${fullSentence(s, w)}</div><b>${w}</b> schrijf je met <b>${ans}</b>. ${ans === 'au' ? 'Ezelsbruggetje: in de <b>au</b>to is het <b>au</b>!' : 'Ezelsbruggetje: <b>ou</b>d en g<b>ou</b>d, h<b>ou</b>t en z<b>ou</b>t.'}` };
}

/* ---------- g / ch ---------- */
const GCH = [
  ['da_', 'g', 'dagen', 'Wat een mooie ~!'], ['ber_', 'g', 'bergen', 'We klimmen op een hoge ~.'], ['vla_', 'g', 'vlaggen', 'De ~ van Curaçao is blauw met geel.'], ['we_', 'g', 'wegen', 'De ~ naar school is lang.'],
  ['oo_', 'g', 'ogen', 'Ik doe één ~ dicht.'], ['zor_', 'g', 'zorgen', 'De juf draagt ~ voor de plantjes.'], ['bru_', 'g', 'bruggen', 'De boot vaart onder de ~ door.'], ['vraa_', 'g', 'vragen', 'Mag ik een ~ stellen?'],
  ['ploe_', 'g', 'ploegen', 'Onze ~ heeft gewonnen!'], ['dee_', 'g', 'degen', 'Van ~ bak je brood.'], ['hoo_', 'g', 'hoger', 'De vogel vliegt heel ~.'],
  ['la_', 'ch', 'lachen', 'Wat een grappige ~!'], ['ku_', 'ch', 'kuchen', 'Opa geeft een ~je.'], ['to_', 'ch', 'tochten', 'We maken een ~ door het bos.'],
  ['li_t', 'ch', '', 'Doe het ~ aan, het is donker.'], ['na_t', 'ch', '', 'In de ~ zie je sterren.'], ['a_t', 'ch', '', 'Een spin heeft ~ poten.'], ['lu_t', 'ch', '', 'De ~ is blauw.'],
  ['za_t', 'ch', '', 'Het kussen is heel ~.'], ['kra_t', 'ch', '', 'Een draak heeft veel ~.'], ['gra_t', 'ch', '', 'In Amsterdam varen bootjes door de ~.'], ['sle_t', 'ch', '', 'Wat een ~ weer vandaag!'],
  ['e_t', 'ch', '', 'Is dat ~ waar?'], ['di_t', 'ch', '', 'Doe de deur ~.'], ['bo_t', 'ch', '', 'De weg maakt een ~.'], ['zu_t', 'ch', '', 'Pip slaakt een diepe ~.']
];
function genGch(diff) {
  const [gw, ans, long, s] = kies(GCH), w = gw.replace('_', ans);
  const why = /_t$/.test(gw) ? `Vóór een <b>t</b> schrijf je bijna altijd <b>ch</b>: nacht, licht, lucht, kracht.`
    : `Verleng het woord: <b>${long}</b>. ${ans === 'g' ? 'Je hoort een <b>g</b>, dus schrijf je g.' : 'Je hoort een <b>ch</b>, dus schrijf je ch.'}`;
  return { text: 'Kies: <b>g</b> of <b>ch</b>?', kind: 'choice', choices: ['g', 'ch'], answer: ans === 'g' ? 0 : 1, big: true, key: 'gch' + w,
    visual: `<div class="sentence">${s.replace('~', `<b class="gapword">${gw.replace('_', '<span class="gap">__</span>')}</b>`)}</div>`,
    hint: 'Twee trucs: 1) Staat er een <b>t</b> achter? Dan meestal <b>ch</b>. 2) Maak het woord langer (meervoud of werkwoord). Hoor je dan een g of een ch?',
    explain: `<div class="sentence">${fullSentence(s, w)}</div>${why}` };
}

/* ---------- één of twee letters ---------- */
const DUBBEL = [
  ['boom', 'bomen', 'boomen|bommen'], ['bal', 'ballen', 'balen|baallen'], ['raam', 'ramen', 'raamen|rammen'], ['pop', 'poppen', 'popen|poopen'], ['been', 'benen', 'beenen|bennen'],
  ['kat', 'katten', 'katen|kaaten'], ['maan', 'manen', 'maanen|mannen'], ['man', 'mannen', 'manen|maanen'], ['buur', 'buren', 'buuren|burren'], ['bus', 'bussen', 'busen|buussen'],
  ['vuur', 'vuren', 'vuuren|vurren'], ['kam', 'kammen', 'kamen|kaamen'], ['slot', 'sloten', 'slooten|slotten'], ['stok', 'stokken', 'stoken|stookken'], ['boot', 'boten', 'booten|botten'],
  ['vis', 'vissen', 'visen|viesen'], ['zak', 'zakken', 'zaken|zaakken'], ['jas', 'jassen', 'jasen|jaassen'], ['haan', 'hanen', 'haanen|hannen'], ['peer', 'peren', 'peeren|perren'],
  ['zwemmen', 'zwemmen', 'zwemen|zweemen', 1], ['lopen', 'lopen', 'loopen|loppen', 1], ['stoppen', 'stoppen', 'stopen|stoopen', 1], ['praten', 'praten', 'praaten|pratten', 1],
  ['bakken', 'bakken', 'baken|baakken', 1], ['maken', 'maken', 'maaken|makken', 1], ['slapen', 'slapen', 'slaapen|slappen', 1], ['kloppen', 'kloppen', 'klopen|kloopen', 1], ['eten', 'eten', 'eeten|etten', 1], ['zitten', 'zitten', 'ziten|zieten', 1]
];
function lettergrepen(w) {
  // eenvoudige splitsing voor de uitleg: bo-men, bal-len
  const m = w.match(/^(.*?[aeiouy]+)([^aeiouy]?)([^aeiouy][aeiouy].*)$/);
  return m ? (m[1] + m[2]) + '-' + m[3] : w;
}
function genDubbel(diff) {
  const [base, good, wr, verb] = kies(DUBBEL), wrongs = wr.split('|');
  const c = mkChoice(good, wrongs, 3);
  const split = lettergrepen(good), first = split.split('-')[0], open = /[aeiouy]$/.test(first);
  return Object.assign(c, { big: true, key: 'dub' + good,
    text: verb ? 'Welk werkwoord is goed geschreven?' : `Wat is het meervoud van <b>${base}</b>?`,
    hint: 'Klap het woord in stukjes (lettergrepen). Hoor je een <b>lange</b> klank aan het eind van het stukje? Dan één klinker: <b>bo-men</b>. Hoor je een <b>korte</b> klank? Dan twee medeklinkers: <b>bal-len</b>.',
    explain: `Klap: <b>${split}</b>. ${open ? `Het eerste stukje eindigt met een lange klank. Dan schrijf je maar één klinker: <b>${good}</b>.` : `Het eerste stukje heeft een korte klank. Dan verdubbel je de medeklinker: <b>${good}</b>.`}` });
}

/* ---------- d / t ---------- */
const DT_END = [['hon_', 'd', 'honden', 'De ~ blaft.'], ['han_', 'd', 'handen', 'Steek je ~ op.'], ['paar_', 'd', 'paarden', 'Het ~ galoppeert.'], ['kaar_', 't', 'kaarten', 'Ik stuur oma een ~.'],
  ['be_', 'd', 'bedden', 'Mijn ~ is lekker zacht.'], ['broo_', 'd', 'broden', 'De bakker bakt ~.'], ['win_', 'd', 'winden', 'De ~ waait hard.'], ['kran_', 't', 'kranten', 'Opa leest de ~.'],
  ['plan_', 't', 'planten', 'De ~ heeft water nodig.'], ['fees_', 't', 'feesten', 'Wat een leuk ~!'], ['woor_', 'd', 'woorden', 'Dat ~ is moeilijk.'], ['tan_', 'd', 'tanden', 'Mijn ~ wiebelt.'],
  ['hoe_', 'd', 'hoeden', 'De tovenaar draagt een ~.'], ['voe_', 't', 'voeten', 'Mijn ~ is koud.'], ['vrien_', 'd', 'vrienden', 'Pip is mijn beste ~.'], ['baar_', 'd', 'baarden', 'De tovenaar heeft een lange ~.'], ['poor_', 't', 'poorten', 'De ~ van het kasteel is dicht.']];
const VERBS = [
  ['worden', 'word', '~ heel goed in toveren.'], ['vinden', 'vind', '~ de sleutel onder de mat.'], ['rijden', 'rijd', '~ op een vliegende bezem.'], ['antwoorden', 'antwoord', '~ heel snel op de vraag.'],
  ['landen', 'land', '~ zachtjes op het dak.'], ['houden', 'houd', '~ van pastechi.'], ['raden', 'raad', '~ het geheime woord.'], ['snijden', 'snijd', '~ de taart in acht stukken.'],
  ['wachten', 'wacht', '~ op de bus.'], ['praten', 'praat', '~ met een pratende kat.'], ['lopen', 'loop', '~ naar de toren.'], ['werken', 'werk', '~ hard aan een spreuk.'],
  ['spelen', 'speel', '~ buiten op het plein.'], ['fietsen', 'fiets', '~ naar school.'], ['zitten', 'zit', '~ op een wolkje.'], ['eten', 'eet', '~ een maankoekje.'], ['schrijven', 'schrijf', '~ een brief aan oma.']
];
function genDt(diff) {
  if (Math.random() < (diff === 'easy' ? .5 : .3)) {
    const [gw, ans, long, s] = kies(DT_END), w = gw.replace('_', ans);
    return { text: 'Kies: <b>d</b> of <b>t</b>?', kind: 'choice', choices: ['d', 't'], answer: ans === 'd' ? 0 : 1, big: true, key: 'dte' + w,
      visual: `<div class="sentence">${s.replace('~', `<b class="gapword">${gw.replace('_', '<span class="gap">__</span>')}</b>`)}</div>`,
      hint: 'Je hoort aan het eind altijd een t. Maak het woord langer (meervoud). Hoor je dan een d of een t?',
      explain: `<div class="sentence">${fullSentence(s, w)}</div>Verleng het woord: <b>${long}</b>. Je hoort een <b>${ans}</b>, dus: <b>${w}</b>.` };
  }
  const [inf, stam, tail] = kies(VERBS);
  const subj = diff === 'easy' ? kies(['Ik', 'Hij', 'Zij', 'Pip']) : kies(['Ik', 'Hij', 'Zij', 'Pip', 'Juf Inkie', 'Jij', 'Het meisje', 'INV']);
  const tEnd = /t$/.test(stam);
  let form, sentence, why;
  if (subj === 'INV') {
    form = stam; sentence = `<span class="gap">___</span> jij ${tail.replace('~ ', '').replace(/\.$/, '?')}`;
    why = `Staat <b>jij</b> áchter het werkwoord? Dan krijgt het werkwoord <b>geen t</b>: ${cap(stam)} jij…? (Net als: Loop jij?)`;
  } else if (subj === 'Ik') {
    form = stam; sentence = `Ik <span class="gap">___</span> ${tail.replace('~ ', '')}`;
    why = `Bij <b>ik</b> schrijf je alleen de <b>stam</b>. De stam van ${inf} is <b>${stam}</b>. (Net als: ik loop.)`;
  } else {
    form = tEnd ? stam : stam + 't'; sentence = `${subj} <span class="gap">___</span> ${tail.replace('~ ', '')}`;
    why = tEnd ? `Bij ${subj.toLowerCase() === 'jij' ? 'jij' : 'hij/zij'} is het stam + t. De stam <b>${stam}</b> eindigt al op een t. Twee t's achter elkaar schrijf je niet, dus: <b>${stam}</b>.`
      : `Bij <b>${subj === 'Jij' ? 'jij' : 'hij, zij, het'}</b> schrijf je <b>stam + t</b>. ${stam} + t = <b>${stam}t</b>. (Net als: ${subj === 'Jij' ? 'jij loopt' : 'hij loopt'}.)`;
  }
  const opts = [...new Set([stam, stam + 't', tEnd ? stam + 't' : stam.replace(/d$/, 't'), stam.replace(/t$/, 'd'), stam + 'dt'].filter(x => x !== form))].slice(0, 2);
  const c = mkChoice(subj === 'INV' ? cap(form) : form, opts.map(o => subj === 'INV' ? cap(o) : o), 3);
  return Object.assign(c, { big: true, key: 'dtv' + inf + subj,
    text: `Welke vorm van <b>${inf}</b> past?`, visual: `<div class="sentence">${sentence}</div>`,
    hint: 'Zoek eerst de <b>stam</b>: het hele werkwoord min -en (lopen → loop). Bij <b>ik</b>: stam. Bij <b>hij/zij/het</b>: stam + t. Tip: vervang het door <b>lopen</b> en luister of je een t hoort.',
    explain: why });
}

/* ---------- woordenschat ---------- */
const WOORDEN = [
  ['nieuwsgierig', 'iets graag willen weten', 'Pip is ~ wat er in het pakje zit.'], ['verbaasd', 'heel erg verrast', 'Ik was ~ toen de kat begon te praten.'], ['eerlijk', 'je liegt niet en je bedriegt niet', 'Wees ~ als je iets kapot hebt gemaakt.'],
  ['gierig', 'je wilt niets weggeven', 'De ~e draak deelt zijn snoep met niemand.'], ['vergelijken', 'kijken wat hetzelfde is en wat anders is', 'We gaan de twee tekeningen ~.'], ['behulpzaam', 'je helpt graag anderen', 'Lisa is ~: ze draagt de tas van oma.'],
  ['verlegen', 'je durft niet zo goed, je bent een beetje bang voor anderen', 'Het nieuwe meisje is nog wat ~.'], ['schitteren', 'heel fel glinsteren', 'De sterren ~ aan de hemel.'], ['onzichtbaar', 'je kunt het niet zien', 'Met deze mantel word je ~!'],
  ['de oplossing', 'het antwoord op een probleem', 'Na lang denken vond ik ~.'], ['voorzichtig', 'je let goed op, zodat er niets misgaat', 'Doe ~ met het toverdrankje!'], ['uitgeput', 'heel erg moe', 'Na de wandeling was ik ~.'],
  ['dapper', 'je durft iets wat eng is', 'De ~e ridder liep het donkere bos in.'], ['ontdekken', 'iets nieuws vinden', 'We gaan een geheime kamer ~.'], ['verdwijnen', 'weggaan zodat je het niet meer ziet', 'Met een knip laat de tovenaar het konijn ~.'],
  ['fluisteren', 'heel zachtjes praten', 'In de bibliotheek moet je ~.'], ['de toekomst', 'de tijd die nog gaat komen', 'Wat wil je worden in ~?'], ['het verleden', 'de tijd die al geweest is', 'In ~ waren er nog geen telefoons.'],
  ['beroemd', 'heel veel mensen kennen je', 'Ze is een ~e zangeres.'], ['de uitvinding', 'iets nieuws dat iemand heeft bedacht', 'De lamp was een geweldige ~.'], ['breekbaar', 'het gaat snel kapot', 'Pas op, die vaas is ~.'],
  ['tevreden', 'blij met hoe iets is', 'Juf is ~ over mijn werk.'], ['geduldig', 'rustig kunnen wachten', 'Wees ~, de taart is bijna klaar.'], ['de omgeving', 'alles wat om je heen is', 'In de ~ van de school is een park.'],
  ['ruziën', 'boos tegen elkaar doen', 'De broers ~ over de laatste koek.'], ['trots', 'blij over iets wat jij of een ander goed gedaan heeft', 'Mama is ~ op mijn rapport.'], ['zorgvuldig', 'heel netjes en precies', 'Ze kleurt de tekening ~ in.'],
  ['de gewoonte', 'iets wat je altijd doet', 'Het is mijn ~ om voor het slapen te lezen.'], ['vermoeiend', 'het maakt je moe', 'Rennen in de hitte is ~.'], ['het geheim', 'iets wat anderen niet mogen weten', 'Pip vertelt zijn ~ aan niemand.'],
  ['bewonderen', 'iets of iemand heel goed of mooi vinden', 'We ~ het vuurwerk.'], ['de herinnering', 'iets wat je nog weet van vroeger', 'Ik heb een fijne ~ aan de vakantie.']
];
const TEGEN = [['groot', 'klein'], ['warm', 'koud'], ['dapper', 'bang'], ['snel', 'langzaam'], ['vrolijk', 'verdrietig'], ['licht', 'donker'], ['open', 'dicht'], ['vol', 'leeg'], ['hoog', 'laag'], ['nat', 'droog'], ['sterk', 'zwak'], ['oud', 'jong'], ['lawaaierig', 'stil'], ['zwaar', 'licht'], ['vroeg', 'laat'], ['winnen', 'verliezen'], ['geven', 'nemen'], ['vriend', 'vijand']];
const SYN = [['blij', 'vrolijk'], ['snel', 'vlug'], ['groot', 'reusachtig'], ['praten', 'spreken'], ['beginnen', 'starten'], ['mooi', 'prachtig'], ['bang', 'angstig'], ['eng', 'griezelig'], ['moe', 'vermoeid'], ['boos', 'kwaad'], ['slim', 'verstandig'], ['klein', 'piepklein'], ['kijken', 'staren'], ['lachen', 'giechelen']];
function genWoord(diff) {
  const t = diff === 'easy' ? kies(['bet', 'tegen', 'syn']) : kies(['bet', 'bet', 'zin', 'tegen', 'syn']);
  if (t === 'tegen') {
    const [a, b] = kies(TEGEN), [q, ans] = Math.random() < .5 ? [a, b] : [b, a];
    const c = mkChoice(ans, shuffle(TEGEN).flat().filter(w => w !== q && w !== ans), 4);
    return Object.assign(c, { text: `Wat is het <b>tegenovergestelde</b> van <b>${q}</b>?`, key: 'teg' + q, hint: 'Het tegenovergestelde is het woord dat precies andersom betekent. Warm ↔ koud.', explain: `Het tegenovergestelde van ${q} is <b>${ans}</b>.` });
  }
  if (t === 'syn') {
    const [a, b] = kies(SYN), [q, ans] = Math.random() < .5 ? [a, b] : [b, a];
    const c = mkChoice(ans, shuffle(SYN).flat().filter(w => w !== q && w !== ans), 4);
    return Object.assign(c, { text: `Welk woord betekent (bijna) <b>hetzelfde</b> als <b>${q}</b>?`, key: 'syn' + q, hint: 'Zoek een woord dat je in een zin in plaats van het andere woord kunt zetten.', explain: `${cap(q)} en <b>${ans}</b> betekenen bijna hetzelfde.` });
  }
  const [w, m, s] = kies(diff === 'easy' ? WOORDEN.slice(0, 20) : WOORDEN);
  const c = mkChoice(m, shuffle(WOORDEN).map(x => x[1]).filter(x => x !== m), diff === 'easy' ? 3 : 4);
  const bare = w.replace(/^(de|het) /, '');
  if (t === 'zin') return Object.assign(c, { text: 'Wat betekent het dikgedrukte woord?', visual: `<div class="sentence">${s.replace('~', `<b>${bare}</b>`)}</div>`, key: 'wz' + w, hint: 'Lees de hele zin. Welke betekenis past in de zin?', explain: `<b>${w}</b> betekent: ${m}.` });
  return Object.assign(c, { text: `Wat betekent <b>${w}</b>?`, key: 'wb' + w, hint: `Hier is het woord in een zin: <i>${s.replace('~', '<b>' + bare + '</b>')}</i>`, explain: `<b>${w}</b> betekent: ${m}.<br><i>${s.replace('~', bare)}</i>` });
}

/* ---------- begrijpend lezen ---------- */
// elke tekst: titel, soort, tekst (alinea's), vragen [vraag, goed, fout1, fout2, uitleg]
const TEKSTEN = [
  { t: 'Roze vogels op één poot', soort: 'informatieve tekst', p: ['Op Curaçao kun je flamingo\'s zien. Ze staan vaak in zoutmeren, zoals bij Sint Willibrordus. Flamingo\'s zijn roze, maar ze worden grijs geboren!', 'Hun roze kleur komt van hun eten. Ze eten kleine garnaaltjes en algen. Daar zit een kleurstof in die hun veren roze maakt.', 'Flamingo\'s staan vaak op één poot. Zo houden ze hun lichaam warm. De andere poot trekken ze op tegen hun buik.'],
    q: [['Welke kleur hebben flamingo\'s als ze geboren worden?', 'grijs', 'roze', 'wit', 'In de eerste alinea staat: ze worden grijs geboren.'], ['Waarom worden flamingo\'s roze?', 'door hun eten', 'door de zon', 'door het zoute water', 'In de tweede alinea staat dat de kleurstof in hun eten de veren roze maakt.'], ['Waarom staan flamingo\'s vaak op één poot?', 'om warm te blijven', 'omdat ze moe zijn', 'om beter te kunnen zien', 'In de laatste alinea staat: zo houden ze hun lichaam warm.'], ['Wat voor tekst is dit?', 'een informatieve tekst', 'een sprookje', 'een recept', 'De tekst geeft informatie over echte dieren. Dat is een informatieve tekst.']] },
  { t: 'Pip en de verdwenen toverstok', soort: 'verhaal', p: ['Het was maandagochtend. Pip vloog naar het lokaal van Professor Uilenbal. Maar waar was zijn toverstok? Hij zocht onder zijn bed, in zijn rugzak en zelfs in de koelkast.', '"Misschien heb ik hem weggetoverd," zuchtte Pip. Toen hoorde hij gegiechel. Sterrenkat Miepie zat op de kast. Ze speelde met iets glimmends.', '"Miepie!" riep Pip. De kat liet de toverstok vallen. Pip lachte opgelucht. "Volgende keer verstop ik hem beter," zei hij.'],
    q: [['Op welke dag speelt het verhaal?', 'maandag', 'zondag', 'vrijdag', 'De eerste zin is: Het was maandagochtend.'], ['Wie had de toverstok?', 'Sterrenkat Miepie', 'Professor Uilenbal', 'Pip zelf', 'Miepie zat op de kast te spelen met iets glimmends: de toverstok.'], ['Hoe voelde Pip zich aan het eind?', 'opgelucht', 'boos', 'bang', 'Er staat: Pip lachte opgelucht. Hij was blij dat de stok terug was.'], ['Wat betekent "gegiechel"?', 'zacht lachen', 'hard huilen', 'luid zingen', 'Giechelen is zacht en een beetje stiekem lachen.']] },
  { t: 'Zo vouw je een papieren vliegtuig', soort: 'instructie', p: ['Je hebt nodig: één vel papier (A4).', '1. Vouw het papier in de lengte dubbel en vouw het weer open.', '2. Vouw de twee bovenhoeken naar de middenvouw. Zo krijg je een punt.', '3. Vouw de schuine kanten nog een keer naar het midden.', '4. Vouw het vliegtuig dubbel en vouw de vleugels naar beneden. Klaar! Gooi het rustig naar voren.'],
    q: [['Wat heb je nodig?', 'een vel papier', 'een schaar en lijm', 'karton en tape', 'Bovenaan staat: Je hebt nodig: één vel papier.'], ['Wat doe je bij stap 2?', 'de bovenhoeken naar het midden vouwen', 'de vleugels naar beneden vouwen', 'het vliegtuig gooien', 'Bij stap 2 vouw je de twee bovenhoeken naar de middenvouw.'], ['Waarom staan er nummers voor de zinnen?', 'zodat je de stappen in de goede volgorde doet', 'omdat het een rekenles is', 'om de zinnen te tellen', 'Bij een instructie moet je de stappen in volgorde doen. De nummers helpen daarbij.']] },
  { t: 'De brug die opzij zwaait', soort: 'informatieve tekst', p: ['In Willemstad, de hoofdstad van Curaçao, ligt een bijzondere brug: de Koningin Emmabrug. Het is een pontonbrug. Dat betekent dat de brug op drijvende boten ligt.', 'Als er een groot schip aankomt, zwaait de brug opzij. Een klein bootje met een motor duwt de brug naar de kant. Dan kan het schip erdoor.', 'Mensen noemen de brug ook wel "de swingende oude dame". Wil je toch naar de overkant terwijl de brug open is? Dan kun je gratis met een pontje mee.'],
    q: [['In welke stad ligt de brug?', 'Willemstad', 'Amsterdam', 'Rotterdam', 'In de eerste zin staat: in Willemstad.'], ['Wat is een pontonbrug?', 'een brug die op drijvende boten ligt', 'een brug van touw', 'een brug onder water', 'Dat wordt uitgelegd in de eerste alinea.'], ['Wat gebeurt er als er een groot schip komt?', 'de brug zwaait opzij', 'het schip wacht een dag', 'de brug zakt onder water', 'In de tweede alinea staat dat de brug opzij zwaait.'], ['Hoe kom je aan de overkant als de brug open is?', 'met een gratis pontje', 'met de trein', 'je moet zwemmen', 'In de laatste zin staat: met een pontje mee, gratis.']] },
  { t: 'Het schoolfeest', soort: 'verhaal', p: ['Vandaag was het schoolfeest. Noor had een prachtige jurk aan, maar ze bleef in een hoekje staan. Ze kende bijna niemand, want ze zat pas twee weken op deze school.', 'Toen kwam Sem naar haar toe. "Wil je meedoen met de stoelendans?" vroeg hij. Noor knikte voorzichtig.', 'Ze lachten zo hard dat Noor buikpijn kreeg. Aan het eind van de avond had ze drie nieuwe vriendinnen. "Ik heb zin in morgen," zei ze tegen mama.'],
    q: [['Waarom bleef Noor eerst in een hoekje staan?', 'ze kende bijna niemand', 'ze had buikpijn', 'ze vond het feest saai', 'Er staat dat ze pas twee weken op school zat en bijna niemand kende.'], ['Wat vroeg Sem?', 'of ze mee wilde doen met de stoelendans', 'of ze naar huis wilde', 'waar haar mama was', 'Sem vroeg: "Wil je meedoen met de stoelendans?"'], ['Hoe voelde Noor zich aan het eind?', 'blij', 'verlegen', 'verdrietig', 'Ze had nieuwe vriendinnen en had zin in morgen. Dus ze was blij.'], ['Wat is de les van dit verhaal?', 'het helpt als je iemand uitnodigt om mee te doen', 'je moet altijd een jurk aan naar een feest', 'stoelendans is gevaarlijk', 'Doordat Sem Noor uitnodigde, ging ze zich fijn voelen.']] },
  { t: 'Leguanen', soort: 'informatieve tekst', p: ['De leguaan is een grote hagedis. Op Curaçao heet hij "yuana". Leguanen kunnen wel anderhalve meter lang worden, met staart!', 'Leguanen zijn koudbloedig. Hun lichaam wordt niet vanzelf warm. Daarom liggen ze \'s ochtends in de zon. Pas als ze warm zijn, kunnen ze snel bewegen.', 'Leguanen eten vooral planten, bloemen en vruchten. Ze kunnen ook goed zwemmen en klimmen.'],
    q: [['Hoe heet de leguaan in het Papiamentu?', 'yuana', 'kachó', 'pushi', 'In de eerste alinea staat: Op Curaçao heet hij "yuana".'], ['Waarom liggen leguanen \'s ochtends in de zon?', 'om warm te worden', 'om bruin te worden', 'om te slapen', 'Ze zijn koudbloedig en moeten opwarmen in de zon.'], ['Wat eten leguanen vooral?', 'planten en vruchten', 'vlees', 'vis', 'In de laatste alinea staat: vooral planten, bloemen en vruchten.']] },
  { t: 'Een brief aan oma', soort: 'brief', p: ['Lieve oma,', 'Hoe gaat het op Curaçao? Hier in Nederland is het koud. Gisteren lag er zelfs sneeuw! Ik heb met mijn klas een sneeuwpop gemaakt. Hij had een wortel als neus.', 'Ik mis jouw pastechi. Mama probeert ze ook te maken, maar die van jou zijn het lekkerst. In de zomer kom ik je bezoeken. Dan gaan we samen naar het strand.', 'Dushi brasa (dikke knuffel),<br>Kaylee'],
    q: [['Wie schrijft de brief?', 'Kaylee', 'oma', 'mama', 'Onderaan de brief staat de naam van de schrijver: Kaylee.'], ['Waar woont oma?', 'op Curaçao', 'in Nederland', 'in de sneeuw', 'Kaylee vraagt: Hoe gaat het op Curaçao?'], ['Wat mist Kaylee?', 'de pastechi van oma', 'de sneeuw', 'haar klas', 'Ze schrijft: Ik mis jouw pastechi.'], ['Wanneer gaat Kaylee naar oma?', 'in de zomer', 'morgen', 'met kerst', 'Er staat: In de zomer kom ik je bezoeken.']] },
  { t: 'Regels van de toverbibliotheek', soort: 'regels', p: ['Welkom in de Woordenbibliotheek! Om het hier fijn te houden, hebben we een paar regels:', '• Fluister. Boeken schrikken van harde geluiden en klappen dan dicht.', '• Eten en drinken mag niet. Een plakkerige spreuk werkt niet meer.', '• Leen maximaal drie boeken tegelijk. Breng ze binnen twee weken terug.', '• Vliegende boeken? Niet achterna rennen! Roep Juf Inkie.'],
    q: [['Hoeveel boeken mag je tegelijk lenen?', 'drie', 'twee', 'tien', 'Er staat: Leen maximaal drie boeken tegelijk.'], ['Waarom moet je fluisteren?', 'boeken schrikken van harde geluiden', 'Juf Inkie slaapt', 'het is verboden om te praten', 'Er staat: Boeken schrikken van harde geluiden en klappen dan dicht.'], ['Wat doe je als er een boek wegvliegt?', 'Juf Inkie roepen', 'het boek achterna rennen', 'het boek vangen met een net', 'De laatste regel zegt: Niet achterna rennen! Roep Juf Inkie.'], ['Waarom is deze tekst geschreven?', 'om te vertellen wat de regels zijn', 'om je aan het lachen te maken', 'om te leren koken', 'De tekst vertelt de regels van de bibliotheek.']] }
];
function genLezen(diff) {
  const T = kies(TEKSTEN), [vr, good, w1, w2, uitleg] = kies(T.q);
  const c = mkChoice(good, [w1, w2], 3);
  return Object.assign(c, { key: 'lz' + vr,
    text: vr, visual: `<div class="readtext"><h4>${T.t}</h4>${T.p.map(p => `<p>${p}</p>`).join('')}</div>`, long: true,
    hint: 'Lees de vraag eerst goed. Zoek dan in de tekst naar de woorden uit de vraag. Het antwoord staat vaak vlak daarbij.',
    explain: `Het goede antwoord is: <b>${good}</b>. ${uitleg}` });
}

/* ---------- grammatica: zinsdelen en woordsoorten ---------- */
// woord|tags  (ow = onderwerp, pv = persoonsvorm, ww = werkwoord, zn = zelfstandig nw, bn = bijvoeglijk nw)
const ZINNEN = [
  'De|ow kleine|bn,ow kat|zn,ow springt|pv,ww op de tafel|zn .', 'Pip|ow,zn eet|pv,ww een grote|bn pastechi|zn .', 'Mijn|ow oma|zn,ow woont|pv,ww op Curaçao|zn .',
  'Morgen gaan|pv,ww wij|ow naar het strand|zn .', 'De|ow juf|zn,ow leest|pv,ww een spannend|bn verhaal|zn .', 'Het|ow witte|bn,ow konijn|zn,ow huppelt|pv,ww door de tuin|zn .',
  'Wij|ow hebben|pv,ww een nieuwe|bn toverstok|zn gekocht|ww .', 'In de zomer|zn zwemmen|pv,ww de|ow kinderen|zn,ow in de zee|zn .', 'De|ow flamingo|zn,ow staat|pv,ww op één poot|zn .',
  'Professor|ow,zn Uilenbal|ow,zn schrijft|pv,ww een moeilijke|bn som|zn op het bord|zn .', 'Kun|pv,ww jij|ow mij helpen|ww ?', 'De|ow oude|bn,ow brug|zn,ow drijft|pv,ww op het water|zn .',
  'Mijn|ow broertje|zn,ow heeft|pv,ww rode|bn laarzen|zn .', 'Gisteren vond|pv,ww Yara|ow,zn een glimmende|bn schelp|zn .', 'De|ow leguaan|zn,ow ligt|pv,ww in de warme|bn zon|zn .',
  'Zij|ow wil|pv,ww later piloot|zn worden|ww .', 'Het|ow kleine|bn,ow draakje|zn,ow niest|pv,ww gouden|bn sterretjes|zn .', 'Wanneer begint|pv,ww de|ow les|zn,ow ?',
  'De|ow kinderen|zn,ow van|ow groep|zn,ow 6|ow spelen|pv,ww op het plein|zn .', 'Papa|ow,zn bakt|pv,ww heerlijke|bn pannenkoeken|zn .', 'Op zaterdag|zn gaat|pv,ww de|ow hele|bn,ow familie|zn,ow naar de markt|zn .',
  'Een|ow grote|bn,ow vogel|zn,ow vliegt|pv,ww over het huis|zn .', 'Lisa|ow,zn en|ow Noor|ow,zn maken|pv,ww een mooie|bn tekening|zn .', 'De|ow tovenaar|zn,ow is|pv,ww zijn hoed|zn verloren|ww .',
  'Vanavond kijken|pv,ww wij|ow naar de heldere|bn sterren|zn .', 'De|ow slimme|bn,ow uil|zn,ow zit|pv,ww op een dikke|bn tak|zn .'
];
const parseZin = z => z.split(' ').map(t => { const [w, tags] = t.split('|'); return { w, tags: tags ? tags.split(',') : [], p: /^[.?!,]$/.test(w) }; });
const ZD = {
  pv: { ask: 'Tik op de <b>persoonsvorm</b>.', hint: 'Maak van de zin een vraag. Het werkwoord dat dan vooraan komt, is de persoonsvorm. Of: zet de zin in een andere tijd. Het woord dat verandert, is de persoonsvorm.', name: 'persoonsvorm' },
  ow: { ask: 'Tik op alle woorden van het <b>onderwerp</b>.', hint: 'Zoek eerst de persoonsvorm. Vraag dan: <b>Wie of wat</b> + persoonsvorm? Het antwoord is het onderwerp.', name: 'onderwerp' },
  zn: { ask: 'Tik op alle <b>zelfstandige naamwoorden</b>.', hint: 'Een zelfstandig naamwoord is een mens, dier, ding of plek. Je kunt er <b>de</b>, <b>het</b> of <b>een</b> voor zetten. Namen tellen ook mee!', name: 'zelfstandig naamwoord' },
  bn: { ask: 'Tik op alle <b>bijvoeglijke naamwoorden</b>.', hint: 'Een bijvoeglijk naamwoord vertelt hoe iets is: klein, rode, spannend. Het staat vaak vóór een zelfstandig naamwoord.', name: 'bijvoeglijk naamwoord' },
  ww: { ask: 'Tik op alle <b>werkwoorden</b>.', hint: 'Een werkwoord zegt wat iemand doet of wat er gebeurt. Er kunnen meer werkwoorden in een zin staan! Je kunt er <b>ik</b> of <b>wij</b> voor zetten.', name: 'werkwoord' }
};
function genZin(diff, types) {
  let toks, tag, tries = 0;
  do { toks = parseZin(kies(ZINNEN)); tag = kies(types); tries++; } while (!toks.some(t => t.tags.includes(tag)) && tries < 50);
  const ans = toks.map((t, i) => t.tags.includes(tag) ? i : -1).filter(i => i >= 0);
  const shown = toks.map((t, i) => t.p ? t.w : (ans.includes(i) ? `<b class="hl">${t.w}</b>` : t.w)).join(' ').replace(/ ([.?!,])/g, '$1');
  const pv = toks.find(t => t.tags.includes('pv'));
  let extra = '';
  if (tag === 'pv') extra = ` De persoonsvorm is <b>${pv.w}</b>.`;
  if (tag === 'ow') extra = ` Wie of wat ${pv.w}? → <b>${ans.map(i => toks[i].w).join(' ')}</b>.`;
  return { kind: 'tap', tokens: toks.map(t => ({ w: t.w, p: t.p })), answer: ans, text: ZD[tag].ask, key: 'zin' + tag + toks.map(t => t.w).join(''),
    hint: ZD[tag].hint, explain: `<div class="sentence">${shown}</div>${ZD[tag].hint.split('.')[0]}.${extra}`,
    answerText: ans.map(i => toks[i].w).join(', ') };
}
const genZinsdelen = diff => genZin(diff, diff === 'easy' ? ['pv'] : ['pv', 'ow']);
const genWoordsoort = diff => genZin(diff, diff === 'easy' ? ['zn'] : diff === 'medium' ? ['zn', 'bn', 'ww'] : ['zn', 'bn', 'ww']);

/* ---------- meervoud en verkleinwoord ---------- */
const MEERV = ['boek:boeken:boeks,boekes', 'kind:kinderen:kinden,kinds', 'ei:eieren:eien,eis', 'stad:steden:stadden,stads', 'schip:schepen:schippen,schips', 'koe:koeien:koes,koeën', 'auto:auto\'s:autos,autoos',
  'foto:foto\'s:fotos,fotoën', 'appel:appels:appelen,appel\'s', 'tafel:tafels:tafelen,tafel\'s', 'kat:katten:katen,kats', 'brug:bruggen:brugen,brugs', 'muis:muizen:muisen,muis\'s', 'huis:huizen:huisen,huises',
  'wolf:wolven:wolfen,wolfs', 'brief:brieven:briefen,briefs', 'oma:oma\'s:omas,omaas', 'baby:baby\'s:babys,babies', 'lied:liederen:lieden,lieds', 'tak:takken:taken,taks', 'dag:dagen:daggen,dags', 'lepel:lepels:lepelen,lepel\'s',
  'kip:kippen:kipen,kips', 'paraplu:paraplu\'s:paraplus,parapluen', 'leeuw:leeuwen:leeuws,leeuwes'];
const VERKL = ['boom:boompje:boomtje,boometje', 'huis:huisje:huistje,huizetje', 'bal:balletje:baltje,balje', 'vis:visje:vistje,visetje', 'kat:katje:kattje,katetje', 'man:mannetje:mantje,manje',
  'bloem:bloemetje:bloempje,bloemje', 'tafel:tafeltje:tafelje,tafeletje', 'auto:autootje:autotje,autoje', 'ring:ringetje:ringje,rinkje', 'koning:koninkje:koningje,koningetje', 'raam:raampje:raamtje,raametje',
  'zon:zonnetje:zontje,zonje', 'ster:sterretje:stertje,sterje', 'oma:omaatje:omatje,omaje', 'tuin:tuintje:tuinje,tuinetje', 'stoel:stoeltje:stoelje,stoeletje', 'deur:deurtje:deurje,deuretje', 'kam:kammetje:kampje,kamje',
  'boek:boekje:boektje,boeketje', 'pop:popje:poppetje,poptje', 'been:beentje:beenje,beenetje', 'weg:weggetje:wegje,wegtje'];
function meervRule(base, pl) {
  if (/'s$/.test(pl)) return `${cap(base)} eindigt op een klinker (a, o, u, i, y). Dan krijgt het meervoud <b>'s</b>: ${pl}.`;
  if (/eren$/.test(pl) && !/eren$/.test(base + 'en')) return `Dit is een uitzondering: <b>${pl}</b>. Net als kinderen, eieren en liederen. Die moet je onthouden!`;
  if (/s$/.test(pl)) return `Woorden op <b>-el, -em, -en, -er</b> krijgen meestal <b>-s</b>: ${pl}.`;
  if (/(ven|zen)$/.test(pl) && /[fs]$/.test(base)) return `Hoor je bij het meervoud een v of z? Dan schrijf je dat ook: ${base} → <b>${pl}</b>.`;
  if (pl === 'steden' || pl === 'schepen') return `Uitzondering! Hier verandert de klank: ${base} → <b>${pl}</b>.`;
  return `Meestal komt er <b>-en</b> achter. Let op: korte klank → dubbele medeklinker (kat → katten), lange klank → één klinker (boom → bomen). Dus: <b>${pl}</b>.`;
}
function verklRule(base, v) {
  if (/pje$/.test(v)) return `Na een <b>m</b> met een lange klank komt <b>-pje</b>: ${v}.`;
  if (/kje$/.test(v)) return `Na <b>-ing</b> met de klemtoon vooraan komt <b>-kje</b>: koning → ${v}.`;
  if (/etje$/.test(v)) return `Korte klank op het eind? Dan verdubbel je de medeklinker en komt er <b>-etje</b>: ${v}.`;
  if (/tje$/.test(v)) return `Na een klinker of na <b>l, n, r, w</b> komt meestal <b>-tje</b>: ${v}.`;
  return `Meestal komt er gewoon <b>-je</b> achter: ${v}.`;
}
function genMeervoud(diff) {
  const verk = Math.random() < .5;
  const [base, good, wr] = kies(verk ? VERKL : MEERV).split(':');
  const c = mkChoice(good, wr.split(','), 3);
  return Object.assign(c, { big: true, key: (verk ? 'vk' : 'mv') + base,
    text: verk ? `Wat is het <b>verkleinwoord</b> van <b>${base}</b>?` : `Wat is het <b>meervoud</b> van <b>${base}</b>?`,
    hint: verk ? 'Zeg het hardop: één klein… Welke klinkt goed? -je, -tje, -pje, -etje of -kje?' : 'Zeg hardop: één ' + base + ', twee… Welke klinkt goed? Meestal -en of -s.',
    explain: verk ? verklRule(base, good) : meervRule(base, good) });
}

/* ---------- spreekwoorden en uitdrukkingen ---------- */
// [uitdrukking, betekenis, grappige 'letterlijke' betekenis]
const SPREUK = [
  ['Het regent pijpenstelen.', 'Het regent heel hard.', 'Er vallen pijpjes uit de lucht.'], ['Met de deur in huis vallen.', 'Meteen zeggen waar het om gaat.', 'Struikelen over de drempel.'],
  ['De kat uit de boom kijken.', 'Eerst rustig afwachten wat er gebeurt.', 'Een kat helpen om uit een boom te komen.'], ['Iemand in de maling nemen.', 'Iemand voor de gek houden.', 'Iemand in een molen stoppen.'],
  ['Het hart op de goede plaats hebben.', 'Een lief en goed mens zijn.', 'Je hart zit precies in het midden.'], ['Als een kip zonder kop rondrennen.', 'Druk rondrennen zonder na te denken.', 'Een kip die zijn hoofd kwijt is.'],
  ['Twee vliegen in één klap slaan.', 'Twee dingen tegelijk voor elkaar krijgen.', 'Twee vliegen tegelijk wegmeppen.'], ['Oost west, thuis best.', 'Thuis is het het fijnst.', 'Je huis staat in het westen.'],
  ['Wie niet waagt, die niet wint.', 'Je moet iets durven om iets te bereiken.', 'Wie niet weegt, die niet wint.'], ['Oefening baart kunst.', 'Door veel te oefenen word je er goed in.', 'Oefenen maakt kunstwerken.'],
  ['Al doende leert men.', 'Door iets te doen, leer je het.', 'Al dansend leer je rekenen.'], ['Een gat in de lucht springen.', 'Heel erg blij zijn.', 'Een gat maken in de wolken.'],
  ['Met je neus in de boter vallen.', 'Op een fijn moment ergens komen; geluk hebben.', 'Met je neus in een pakje boter vallen.'], ['Iemand een hart onder de riem steken.', 'Iemand moed geven.', 'Een hartje in een broekriem stoppen.'],
  ['Er geen kaas van gegeten hebben.', 'Er niets van weten.', 'Geen zin hebben in kaas.'], ['Uit je slof schieten.', 'Ineens boos worden.', 'Je pantoffel wegschoppen.'],
  ['Ergens geen touw aan vast kunnen knopen.', 'Iets helemaal niet begrijpen.', 'Je veters niet kunnen strikken.'], ['Iets onder de knie hebben.', 'Iets goed kunnen.', 'Iets onder je knie verstoppen.'],
  ['Haantje de voorste zijn.', 'Altijd de eerste willen zijn.', 'Een haan die vooraan staat.'], ['Kippenvel krijgen.', 'Rillen van spanning, kou of ontroering.', 'Veren krijgen op je armen.'],
  ['Iemand de les lezen.', 'Iemand flink vertellen wat hij fout deed.', 'Iemand voorlezen uit een lesboek.'], ['Op je tenen lopen.', 'Heel erg je best moeten doen.', 'Lopen als een balletdanser.'],
  ['Beter een vogel in de hand dan tien in de lucht.', 'Liever iets kleins wat zeker is, dan veel wat onzeker is.', 'Vogels vangen is een leuke hobby.'], ['Een appeltje met iemand te schillen hebben.', 'Nog iets met iemand moeten uitpraten.', 'Samen appels schillen.'],
  ['De kogel is door de kerk.', 'Er is eindelijk een besluit genomen.', 'Er is iets kapot in de kerk.'], ['Zo vader, zo zoon.', 'Kinderen lijken vaak op hun ouders.', 'Vader en zoon hebben dezelfde kleren aan.'],
  ['Hoge bomen vangen veel wind.', 'Wie opvalt, krijgt veel kritiek.', 'Grote bomen zijn handig om vliegers te vangen.'], ['Voor spek en bonen meedoen.', 'Meedoen, maar het telt niet echt.', 'Meedoen aan een kookwedstrijd.']
];
function genSpreuk(diff) {
  const [ex, m, silly] = kies(SPREUK);
  if (diff !== 'easy' && Math.random() < .35) {
    const c = mkChoice(ex, shuffle(SPREUK).map(s => s[0]).filter(x => x !== ex), 3);
    return Object.assign(c, { key: 'spr2' + ex, text: `Welke uitdrukking betekent: <b>${m.replace(/\.$/, '')}</b>?`, hint: 'Lees elke uitdrukking en bedenk wat ze betekent. Welke past?', explain: `<b>${ex}</b> betekent: ${m.toLowerCase()}` });
  }
  const wrongs = [silly, ...shuffle(SPREUK).map(s => s[1]).filter(x => x !== m)];
  const c = { kind: 'choice' }; const opts = shuffle([m, silly, wrongs[1]]); c.choices = opts; c.answer = opts.indexOf(m);
  return Object.assign(c, { key: 'spr' + ex, text: `Wat betekent: <i>"${ex}"</i>`, hint: 'Een uitdrukking betekent bijna nooit precies wat er staat. Wat zou iemand ermee bedoelen?',
    explain: `<b>${ex}</b> betekent: ${m.toLowerCase()} ${opts.includes(silly) ? `(Dus niet: "${silly.toLowerCase().replace(/\.$/, '')}"… al zou dat wel grappig zijn! 😄)` : ''}` });
}

/* ---------- onderwerpen aanmelden ---------- */
registerTopic('taal', { id: 'eiij', name: 'ei of ij?', sub: 'spelling', ico: '🥚', gen: genEiij, pace: { easy: 5, medium: 4, hard: 3 }, lesson: [
  { t: 'Korte ei en lange ij', h: 'De <b>ei</b> en de <b>ij</b> klinken precies hetzelfde. Daarom noemen we ze de <b>korte ei</b> (ei) en de <b>lange ij</b> (ij).', v: '<div class="bigwords"><span>tr<b>ei</b>n</span><span><b>ij</b>s</span></div>' },
  { t: 'Twee handige regels', h: '<ul class="tips"><li>Woorden op <b>-lijk</b> → altijd <b>ij</b>: vrolijk, eerlijk, vriendelijk.</li><li>Woorden op <b>-heid</b> → altijd <b>ei</b>: gezondheid, waarheid.</li></ul>' },
  { t: 'De rest: onthouden!', h: 'Voor de andere woorden is er geen regel. Die moet je inprenten. Tik op de kaarten.', w: 'kaarten', o: { cards: [['tr__n', 'trein (ei)', '🚆'], ['__s', 'ijs (ij)', '🍦'], ['kl__n', 'klein (ei)', '🐭'], ['t__d', 'tijd (ij)', '⏰'], ['g__t', 'geit (ei)', '🐐'], ['t__ger', 'tijger (ij)', '🐯'], ['__land', 'eiland (ei)', '🏝️'], ['kr__t', 'krijt (ij)', '🖍️']] } },
  { t: 'Toverspreuk', h: 'Een grappig zinnetje met veel <b>ei</b>-woorden: <i>Het kleine meisje reist met de trein naar het eiland met de geit.</i><br>Bedenk zelf een zin met ij-woorden!' }
] });
registerTopic('taal', { id: 'auou', name: 'au of ou?', sub: 'spelling', ico: '🚗', gen: genAuou, pace: { easy: 5, medium: 4, hard: 3 }, lesson: [
  { t: 'Twee keer dezelfde klank', h: '<b>au</b> en <b>ou</b> klinken hetzelfde. Je moet dus onthouden welke het is.', v: '<div class="bigwords"><span><b>au</b>to</span><span>g<b>ou</b>d</span></div>' },
  { t: 'Ezelsbruggetjes', h: '<ul class="tips"><li>In de <b>au</b>to eet ik s<b>au</b>s in de p<b>au</b>ze.</li><li><b>Ou</b>de vr<b>ou</b>w met g<b>ou</b>d, h<b>ou</b>t en z<b>ou</b>t.</li><li>Na <b>-auw</b> en <b>-ouw</b>: bl<b>auw</b>, vr<b>ouw</b>, t<b>ouw</b>.</li></ul>' },
  { t: 'Oefenkaarten', h: 'Tik op de kaarten om het antwoord te zien.', w: 'kaarten', o: { cards: [['bl__w', 'blauw (au)', '💙'], ['k__d', 'koud (ou)', '🥶'], ['p__ze', 'pauze (au)', '⏸️'], ['h__t', 'hout (ou)', '🪵'], ['kab__ter', 'kabouter (ou)', '🧙'], ['astron__t', 'astronaut (au)', '🧑‍🚀']] } }
] });
registerTopic('taal', { id: 'gch', name: 'g of ch?', sub: 'spelling', ico: '🌙', gen: genGch, pace: { easy: 5, medium: 4, hard: 3 }, lesson: [
  { t: 'Hetzelfde geluid', h: 'Aan het eind van een woord klinken <b>g</b> en <b>ch</b> hetzelfde. Hoe weet je wat je schrijft?' },
  { t: 'Truc 1: de t-regel', h: 'Komt er een <b>t</b> achter? Dan schrijf je bijna altijd <b>ch</b>.', v: '<div class="bigwords"><span>na<b>ch</b>t</span><span>li<b>ch</b>t</span><span>lu<b>ch</b>t</span></div>' },
  { t: 'Truc 2: verlengen', h: 'Maak het woord langer, bijvoorbeeld het meervoud. Dan hoor je het verschil!<br>da? → da<b>g</b>en → dag<br>la? → la<b>ch</b>en → lach', v: '<div class="bigwords"><span>berg → ber<b>g</b>en</span><span>lach → la<b>ch</b>en</span></div>' }
] });
registerTopic('taal', { id: 'dubbel', name: 'Eén of twee letters?', sub: 'bomen of bommen', ico: '🎈', gen: genDubbel, pace: { easy: 5, medium: 4, hard: 3 }, lesson: [
  { t: 'Klap het woord', h: 'Zeg het woord en klap bij elk stukje: <b>bo-men</b>, <b>bal-len</b>. Die stukjes heten lettergrepen.' },
  { t: 'Lange klank: één klinker', h: 'Eindigt het stukje met een <b>lange klank</b> (aa, ee, oo, uu)? Dan schrijf je maar één klinker.<br>boom → <b>bo-men</b><br>raam → <b>ra-men</b><br>been → <b>be-nen</b>' },
  { t: 'Korte klank: dubbele medeklinker', h: 'Hoor je een <b>korte klank</b> (a, e, i, o, u)? Dan zet je er twee medeklinkers achter, zodat de klank kort blijft.<br>bal → <b>bal-len</b><br>kat → <b>kat-ten</b><br>pop → <b>pop-pen</b>' },
  { t: 'Let op: man en maan', h: '<b>mannen</b> (meer dan één man) en <b>manen</b> (meer dan één maan). Eén letter verschil, heel andere betekenis! 🌙👨' }
] });
registerTopic('taal', { id: 'dt', name: 'd of t?', sub: 'verlengen & werkwoorden', ico: '✍️', gen: genDt, pace: { easy: 5, medium: 4, hard: 3 }, lesson: [
  { t: 'Verlengen bij woorden', h: 'Aan het eind hoor je altijd een t. Maak het woord langer:<br>hond → hon<b>d</b>en → <b>d</b><br>kaart → kaar<b>t</b>en → <b>t</b>' },
  { t: 'De stam van een werkwoord', h: 'De <b>stam</b> is het werkwoord min -en. Soms moet je een letter aanpassen.<br>lopen → loop<br>worden → word<br>schrijven → schrijf' },
  { t: 'Ik, jij, hij', h: '<ul class="tips"><li><b>ik</b> → stam: ik word, ik loop</li><li><b>jij</b> → stam + t: jij wordt, jij loopt</li><li><b>hij/zij/het</b> → stam + t: hij wordt, zij loopt</li></ul>Tip: vervang het werkwoord door <b>lopen</b>. Hoor je een t? Dan schrijf je een t!' },
  { t: 'Jij achter het werkwoord', h: 'Staat <b>jij</b> achter het werkwoord? Dan krijgt het werkwoord <b>geen t</b>.<br>Jij word<b>t</b> groot. → Word jij groot?<br>(Net als: Loop jij mee?)' }
] });
registerTopic('taal', { id: 'woorden', name: 'Woordenschat', sub: 'wat betekent het?', ico: '💬', gen: genWoord, pace: { easy: 5, medium: 4, hard: 3.5 }, lesson: [
  { t: 'Nieuwe woorden leren', h: 'Kom je een woord tegen dat je niet kent? Lees dan de hele zin. Vaak kun je raden wat het betekent.<br><i>Na de lange wandeling was ik <b>uitgeput</b>.</i> → heel erg moe.' },
  { t: 'Oefenkaarten', h: 'Tik op de kaart om de betekenis te zien.', w: 'kaarten', o: { cards: WOORDEN.slice(0, 8).map(([w, m]) => [w, m]) } },
  { t: 'Tegenovergestelde & hetzelfde', h: '<b>Tegenovergesteld</b>: precies andersom. warm ↔ koud, dapper ↔ bang.<br><b>Synoniem</b>: (bijna) hetzelfde. blij = vrolijk, snel = vlug.' }
] });
registerTopic('taal', { id: 'lezen', name: 'Begrijpend lezen', sub: 'teksten en vragen', ico: '📜', gen: genLezen, pace: { easy: 2, medium: 2, hard: 2 }, lesson: [
  { t: 'Voor het lezen', h: 'Kijk eerst naar de <b>titel</b>. Waar zal de tekst over gaan? Wat weet je er al van?' },
  { t: 'Tijdens het lezen', h: 'Lees rustig. Snap je een woord niet? Lees de zin nog een keer. Stel jezelf vragen: <b>Wie? Wat? Waar? Wanneer? Waarom?</b>' },
  { t: 'Vragen beantwoorden', h: '<ul class="tips"><li>Lees de vraag heel goed.</li><li>Zoek in de tekst naar woorden uit de vraag.</li><li>Lees de zinnen eromheen.</li><li>Soms staat het antwoord er niet letterlijk. Dan moet je <b>nadenken</b>: hoe voelt iemand zich? Waarom gebeurt iets?</li></ul>' },
  { t: 'Soorten teksten', h: '<ul class="tips"><li><b>Verhaal</b>: vertelt over iets wat (misschien) gebeurd is.</li><li><b>Informatieve tekst</b>: geeft uitleg over iets echts.</li><li><b>Instructie</b>: vertelt stap voor stap hoe je iets doet.</li><li><b>Brief</b>: met een aanhef (Lieve oma) en een afsluiting.</li></ul>' }
] });
registerTopic('taal', { id: 'zinsdelen', name: 'Onderwerp & persoonsvorm', sub: 'zinsdelen', ico: '🧩', gen: genZinsdelen, pace: { easy: 3, medium: 3, hard: 2.5 }, lesson: [
  { t: 'De persoonsvorm', h: 'De <b>persoonsvorm</b> is het werkwoord dat verandert als je de tijd verandert.<br>Pip <b>eet</b> een koekje. → Pip <b>at</b> een koekje.<br>Truc: maak er een vraag van. <b>Eet</b> Pip een koekje? Het woord dat vooraan komt, is de persoonsvorm!' },
  { t: 'Het onderwerp', h: 'Het <b>onderwerp</b> is wie of wat iets doet. Vraag: <b>Wie of wat</b> + persoonsvorm?<br><i>De kleine kat springt op tafel.</i><br>Wie springt? → <b>De kleine kat</b>.' },
  { t: 'Let op!', h: 'Het onderwerp staat niet altijd vooraan.<br><i>Morgen gaan <b>wij</b> naar het strand.</i><br>Wie gaan? → wij.<br>Het onderwerp kan ook uit meer woorden bestaan: <i><b>De kinderen van groep 6</b> spelen buiten.</i>' },
  { t: 'Zo doe je het in de quiz', h: 'Tik op de woorden. Ze worden gekleurd. Tik nog een keer om een woord weer los te laten. Klaar? Druk op <b>Tover!</b>' }
] });
registerTopic('taal', { id: 'woordsoort', name: 'Woordsoorten', sub: 'naamwoorden & werkwoorden', ico: '🏷️', gen: genWoordsoort, pace: { easy: 3, medium: 3, hard: 2.5 }, lesson: [
  { t: 'Zelfstandig naamwoord', h: 'Een mens, dier, ding of plek. Je kunt er <b>de</b>, <b>het</b> of <b>een</b> voor zetten.<br>de <b>kat</b>, het <b>huis</b>, een <b>draak</b>. Namen zoals <b>Curaçao</b> en <b>Pip</b> horen er ook bij.' },
  { t: 'Bijvoeglijk naamwoord', h: 'Vertelt <b>hoe</b> iets is. Het staat vaak vóór het zelfstandig naamwoord.<br>de <b>kleine</b> kat, een <b>spannend</b> boek, <b>rode</b> laarzen.' },
  { t: 'Werkwoord', h: 'Zegt wat iemand <b>doet</b> of wat er <b>gebeurt</b>. Je kunt er <b>ik</b> of <b>wij</b> voor zetten.<br>Pip <b>vliegt</b>. Wij <b>hebben</b> een taart <b>gebakken</b>. (Twee werkwoorden!)' }
] });
registerTopic('taal', { id: 'meervoud', name: 'Meervoud & verkleinwoord', sub: 'boeken, boekje', ico: '🐣', gen: genMeervoud, pace: { easy: 5, medium: 4, hard: 3.5 }, lesson: [
  { t: 'Meervoud', h: 'Meervoud = meer dan één.<ul class="tips"><li>Meestal <b>-en</b>: boek → boeken</li><li>Op -el, -em, -en, -er: <b>-s</b>: tafel → tafels</li><li>Op a, o, u, i, y: <b>\'s</b>: auto → auto\'s</li><li>f wordt v, s wordt z: wolf → wolven, huis → huizen</li><li>Uitzonderingen: kind → kinderen, ei → eieren, stad → steden</li></ul>' },
  { t: 'Verkleinwoord', h: 'Iets kleins maken:<ul class="tips"><li><b>-je</b>: boek → boekje</li><li><b>-tje</b>: na klinker, l, n, r, w: stoel → stoeltje</li><li><b>-pje</b>: na m: boom → boompje</li><li><b>-etje</b>: na korte klank: bal → balletje</li><li><b>-kje</b>: koning → koninkje</li></ul>' },
  { t: 'Oefenkaarten', h: 'Tik op de kaarten.', w: 'kaarten', o: { cards: [['kind', 'kinderen', '👧'], ['auto', 'auto\'s', '🚗'], ['wolf', 'wolven', '🐺'], ['bal (klein)', 'balletje', '⚽'], ['boom (klein)', 'boompje', '🌳'], ['zon (klein)', 'zonnetje', '☀️']] } }
] });
registerTopic('taal', { id: 'spreuk', name: 'Spreekwoorden', sub: 'en uitdrukkingen', ico: '🦉', gen: genSpreuk, pace: { easy: 4, medium: 3.5, hard: 3 }, lesson: [
  { t: 'Wat is een uitdrukking?', h: 'Een uitdrukking betekent iets anders dan er letterlijk staat.<br><i>Het regent pijpenstelen</i> betekent niet dat er pijpen uit de lucht vallen, maar dat het heel hard regent! 🌧️' },
  { t: 'Spreekwoord', h: 'Een spreekwoord is een wijze les in een korte zin.<br><i>Oefening baart kunst</i> = door veel te oefenen, word je er goed in. Dat is precies wat jij nu doet! ✨' },
  { t: 'Oefenkaarten', h: 'Tik op de kaarten.', w: 'kaarten', o: { cards: SPREUK.slice(0, 8).map(([e, m]) => [e, m]) } }
] });
