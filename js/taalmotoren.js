'use strict';
/* =====================================================================
   Taalmotoren: Nederlands en Papiamentu (naar de oefenvormen uit het onderzoek)
   - woordbank: bouw een zin uit woordjes, met een paar woorden die niet kloppen
   - letters: bouw een woord uit losse letters
   - gesprek: een kort gesprekje, kies steeds het goede antwoord
   - spreek: luister, neem jezelf op en luister terug (blijft op het toestel, geen cijfer)
   - werkwoordsvormen (gat in de zin), luister en kies, typ het Papiamentu
   - Dutch–Papiamentu woordparen
   - meer leesboekjes per niveau, woord van de dag, wizard-rangen
   Papiamentu: alleen woorden uit PAP_VERIFIED, behalve de zinnetjes die al in de
   app stonden (die staan op de lijst "needs family check").
   ===================================================================== */

const PAPW = ALLPAP.filter(x => x[3] !== 'zinnen' && PAP_VERIFIED.has(x[0]) && /^[a-zñáéíóúèòü]+$/i.test(x[0]) && x[0].length >= 3 && x[0].length <= 9);
const PAPZ = PAP.zinnen.filter(z => !z[0].includes('…') && z[0].replace(/[.!?]/g, '').split(' ').length >= 3 && z[0].replace(/[.!?]/g, '').split(' ').length <= 6);

/* ---------- woordbank ---------- */
registerKind('woordbank', {
  render(q, box, api) {
    const X = S.ext; X.w = [];
    const draw = () => {
      box.innerHTML = mtBox(`<div class="wb-line" aria-live="polite">${X.w.map((w, i) => `<button class="wb-t on" data-u="${i}">${w}</button>`).join('') || '<small>…</small>'}</div>
        <div class="wb-bank">${q.wb.bank.map((w, i) => `<button class="wb-t" data-b="${i}" ${X.w.includes(w) && X.used && X.used.includes(i) ? 'disabled' : ''}>${w}</button>`).join('')}</div>`);
      X.used = X.used || [];
      $$('[data-b]', box).forEach(b => { if (X.used.includes(+b.dataset.b)) b.disabled = true; b.onclick = () => { X.used.push(+b.dataset.b); X.w.push(q.wb.bank[+b.dataset.b]); mtBeat(380 + X.w.length * 40, .1); draw(); }; });
      $$('[data-u]', box).forEach(b => b.onclick = () => { const i = +b.dataset.u, word = X.w[i]; X.w.splice(i, 1); const k = X.used.findIndex(j => q.wb.bank[j] === word); if (k >= 0) X.used.splice(k, 1); SND.click(); draw(); });
      mtDone(box, api);
    }; X.used = []; draw();
  },
  guess: () => ({ w: S.ext.w.slice() }), empty: g => !g.w.length, check: (q, g) => g.w.join(' ') === q.wb.answer.join(' '),
  answerText: q => q.wb.answer.join(' '), givenText: (q, g) => g.w.join(' ') || '–', mark(q, g) { mtMark(g.w.join(' ') === q.wb.answer.join(' ')); }
});
function genWoordbank(diff) {
  const z = kies(PAPZ), words = z[0].replace(/[.!?]/g, '').split(' '), all = [...new Set(PAPZ.flatMap(x => x[0].replace(/[.!?]/g, '').split(' ')))].filter(w => !words.includes(w));
  const bank = shuffle([...words, ...shuffle(all).slice(0, diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3)]);
  return { kind: 'woordbank', text: `Zeg het in het Papiamentu: <b>${z[1]}</b> ${z[2] || ''}<br><small>Bouw de zin met de woordjes. Pas op: er zijn woordjes teveel.</small>`, wb: { answer: words, bank }, key: 'wb' + z[0],
    sol: { w: words }, bad: { w: words.slice().reverse().concat(words.length === 1 ? [] : []).map((w, i) => i ? w : words[0]) },
    hint: `De eerste twee woorden zijn <b class="pap">${words.slice(0, 2).join(' ')}</b>.`, explain: `<b class="pap">${z[0]}</b> betekent: ${z[1]}` };
}

/* ---------- letters ---------- */
registerKind('letters', {
  render(q, box, api) {
    const X = S.ext; X.s = []; X.used = [];
    const draw = () => {
      box.innerHTML = mtBox(`<div class="lt-top"><span class="lt-e">${q.lt.emoji}</span></div><div class="lt-slots" aria-live="polite">${q.lt.answer.split('').map((_, i) => `<i class="lt-s ${X.s[i] ? 'on' : ''}">${X.s[i] || ''}</i>`).join('')}</div>
        <div class="lt-bank">${q.lt.tiles.map((l, i) => `<button class="lt-t" data-i="${i}" ${X.used.includes(i) ? 'disabled' : ''}>${l}</button>`).join('')}</div><button class="chip" data-undo>↶</button>`);
      $$('[data-i]', box).forEach(b => b.onclick = () => { if (X.s.length >= q.lt.answer.length) return; X.used.push(+b.dataset.i); X.s.push(q.lt.tiles[+b.dataset.i]); mtBeat(360 + X.s.length * 50, .1); draw(); });
      $('[data-undo]', box).onclick = () => { X.s.pop(); X.used.pop(); SND.click(); draw(); }; mtDone(box, api);
    }; draw();
  },
  guess: () => ({ s: S.ext.s.join('') }), empty: g => !g.s, check: (q, g) => g.s === q.lt.answer, answerText: q => q.lt.answer, givenText: (q, g) => g.s || '–', mark(q, g) { mtMark(g.s === q.lt.answer); }
});
function genLetters(diff, pap) {
  let w, e, nl = '';
  if (pap) { const p = kies(PAPW); w = p[0]; e = p[2] || ''; nl = p[1]; } else { const pool = DICT.filter(x => x[0].length >= 3 && x[0].length <= (diff === 'easy' ? 4 : diff === 'medium' ? 6 : 8)); [w, e] = kies(pool); }
  const tiles = shuffle(w.split('').concat(diff === 'hard' ? [kies('aeioubdklmnrst'.split(''))] : []));
  return { kind: 'letters', text: pap ? `Maak het Papiamentu woord voor <b>${nl}</b> ${e}.` : 'Maak het woord van de letters.', lt: { answer: w, tiles, emoji: e || '🔤' }, key: 'lt' + w + (pap ? 'p' : ''), sol: { s: w }, bad: { s: w.split('').reverse().join('') === w ? w + 'x' : w.split('').reverse().join('') },
    hint: `Het woord begint met een <b>${w[0]}</b> en heeft ${w.length} letters.`, explain: `Het woord is <b${pap ? ' class="pap"' : ''}>${w}</b>${pap ? ` (${nl})` : ''}.` };
}

/* ---------- gesprek ---------- */
registerKind('gesprek', {
  render(q, box, api) {
    const X = S.ext, G = q.gs; X.i = 0; X.pk = [];
    const draw = () => {
      if (X.i >= G.turns.length) return;
      const tr = G.turns[X.i];
      box.innerHTML = `<div class="xk mt"><div class="gs-chat">${G.turns.slice(0, X.i).map((t0, i) => `<div class="gs-b them">${t0.say}</div><div class="gs-b me ${X.pk[i] === t0.ok ? 'ok' : 'no'}">${t0.o[X.pk[i]]}</div>`).join('')}<div class="gs-b them now">${tr.say}</div></div>
        <div class="gs-opts">${tr.o.map((o, i) => `<button class="choice" data-o="${i}">${o}</button>`).join('')}</div></div>`;
      $$('[data-o]', box).forEach(b => b.onclick = () => { X.pk.push(+b.dataset.o); mtBeat(X.pk[X.pk.length - 1] === tr.ok ? 620 : 230); X.i++; if (X.i >= G.turns.length) api.submit(); else draw(); });
    }; draw();
  },
  guess: () => ({ pk: S.ext.pk.slice() }), empty: g => !g.pk.length, check: (q, g) => g.pk.length === q.gs.turns.length && g.pk.every((p, i) => p === q.gs.turns[i].ok),
  answerText: q => q.gs.turns.map(t0 => `${t0.say} → ${t0.o[t0.ok]}`).join(' · '), givenText: (q, g) => g.pk.map((p, i) => q.gs.turns[i].o[p]).join(' · '), mark(q, g) { mtMark(g.pk.every((p, i) => p === q.gs.turns[i].ok)); }
});
const NL_TURNS = [
  ['Hallo! Hoe heet jij?', 'Ik heet Sam.', ['Ik ben tien jaar.', 'Het regent.']], ['Hoe gaat het met je?', 'Goed, dank je!', ['Op de fiets.', 'Dertig.']], ['Wil je een ijsje?', 'Ja, graag!', ['Het is blauw.', 'Tot morgen!']],
  ['Dag! Tot morgen!', 'Tot morgen!', ['Goedemorgen, hoe heet je?', 'Ik heb een hond.']], ['Mag ik het boek lenen?', 'Ja hoor, alsjeblieft.', ['Nee, het regent.', 'Om half vier.']], ['Hoe laat is het?', 'Het is vier uur.', ['Ik heet Pip.', 'Ja, graag!']],
  ['Waar woon je?', 'Ik woon op Curaçao.', ['Ik ben blij.', 'Om acht uur.']], ['Wat leuk je te zien!', 'Ik vind het ook leuk!', ['Het is groen.', 'Twee en twee.']]
];
function genGesprek(diff, pap) {
  const turns = pap ? shuffle((typeof WELA_CALLS !== 'undefined' ? WELA_CALLS : []).flat()).slice(0, 3).map(([say, o]) => { const opts = shuffle(o.slice()); return { say, o: opts, ok: opts.indexOf(o[0]) }; })
    : shuffle(NL_TURNS).slice(0, 3).map(([say, good, bad]) => { const opts = shuffle([good, ...bad]); return { say, o: opts, ok: opts.indexOf(good) }; });
  return { kind: 'gesprek', text: pap ? 'Praat met Wela in het Papiamentu. Kies steeds het goede antwoord.' : 'Praat mee! Kies steeds het antwoord dat bij de vraag past.', gs: { turns }, key: 'gs' + turns.map(t0 => t0.say).join('|'), sol: { pk: turns.map(t0 => t0.ok) }, bad: { pk: turns.map(t0 => (t0.ok + 1) % t0.o.length) },
    hint: pap ? 'Denk aan hoe je Wela begroet en bedankt.' : 'Lees de vraag goed. Welk antwoord past erbij?', explain: turns.map(t0 => `${t0.say} → ${t0.o[t0.ok]}`).join(' · ') };
}

/* ---------- spreek: luister, neem op, luister terug ---------- */
registerKind('spreek', {
  render(q, box, api) {
    const X = S.ext; X.rec = false; X.blob = null; X.on = false;
    const can = typeof voiceCanRecord === 'function' && voiceCanRecord();
    box.innerHTML = mtBox(`<div class="sp-say"><span class="ty-e">${q.sp.emoji}</span><b>${q.sp.word}</b></div><div class="sp-btns"><button class="btn" id="spmodel">🔊 ${tri(['Luister', 'Skucha', 'Listen'])}</button>
      ${can ? `<button class="btn" id="sprec">⏺ ${tri(['Zeg het zelf', 'Bisa e mes', 'Say it'])}</button><button class="btn" id="spback" disabled>▶ ${tri(['Luister terug', 'Skucha bèk', 'Listen back'])}</button>` : `<small>${tri(['Dit toestel kan niet opnemen.', 'E aparato aki no por grabá.', 'This device cannot record.'])}</small><button class="chip" id="spskip">${tri(['Zonder opnemen verder', 'Sigui sin grabá', 'Continue without recording'])}</button>`}</div><div class="muted center">${tri(['Je opname blijft op dit toestel.', 'Bo grabashon ta keda riba e aparato aki.', 'Your recording stays on this device.'])}</div>`);
    $('#spmodel', box).onclick = () => { if (typeof canRead === 'function' && canRead()) speakNL(q.sp.word); else toast(tri(['Voorlezen werkt alleen met een Nederlandse stem op je tablet.', 'Lesa duru ta traha solamente ku un bos hulandes.', 'Read aloud needs a Dutch voice on your tablet.']), 3000); };
    const rec = $('#sprec', box), back = $('#spback', box);
    if (rec) rec.onclick = () => {
      if (X.on) { voiceStop(); return; }
      voiceStart().then(r => { X.on = true; rec.textContent = '⏹'; rec.classList.add('recording'); r.done.then(blob => { X.on = false; rec.textContent = '⏺ ' + tri(['Nog een keer', 'Un biaha mas', 'Again']); rec.classList.remove('recording'); if (blob && blob.size) { X.blob = blob; X.rec = true; back.disabled = false; SND.pop(); } }); }).catch(() => toast(tri(['Geen microfoon. Vraag papa of mama om het aan te zetten.', 'No tin mikrofono. Puntra mama òf tata.', 'No microphone. Ask a parent to allow it.']), 3500));
    };
    if (back) back.onclick = () => { if (!X.blob) return; const a = new Audio(URL.createObjectURL(X.blob)); a.play().catch(() => { }); };
    const sk = $('#spskip', box); if (sk) sk.onclick = () => { X.rec = true; api.submit(); };
    mtDone(box, api);
  },
  guess: () => ({ rec: !!S.ext.rec }), empty: g => !g.rec, check: (q, g) => !!g.rec, answerText: () => '✔', givenText: (q, g) => g.rec ? '✔' : '–', mark(q, g) { mtMark(!!g.rec); }
});
function genSpreek(diff) {
  const phr = [['Goedemorgen', '🌅'], ['Dank je wel', '🙏'], ['Tot morgen', '👋'], ['Ik heet Pip', '🐲'], ['Het is mooi weer', '☀️'], ['Mag ik een ijsje?', '🍦']];
  const pool = diff === 'easy' ? DICT.filter(x => x[0].length <= 5).map(x => [x[0], x[1]]) : diff === 'medium' ? DICT.map(x => [x[0], x[1]]) : phr, [w, e] = kies(pool);
  return { kind: 'spreek', text: 'Luister naar het woord en zeg het zelf hardop.', sp: { word: w, emoji: e }, key: 'sp' + w, sol: { rec: true }, bad: { rec: false }, say: w, hint: 'Zeg het langzaam, stukje voor stukje.', explain: `Goed gedaan! Je zei: <b>${w}</b>.` };
}

/* ---------- werkwoordsvormen, luister-en-kies, typ in het Papiamentu ---------- */
const VORM_VERBS = [['spelen', 'speel'], ['lopen', 'loop'], ['werken', 'werk'], ['fietsen', 'fiets'], ['zingen', 'zing'], ['dansen', 'dans'], ['tekenen', 'teken'], ['lezen', 'lees'], ['wonen', 'woon'], ['bellen', 'bel']];
const SUBJ = [['Ik', 0, 'stam'], ['Jij', 1, 'stam+t'], ['Hij', 1, 'stam+t'], ['Pip', 1, 'stam+t'], ['Wij', 2, 'inf'], ['Jullie', 2, 'inf'], ['De kinderen', 2, 'inf']];
function genVorm(diff) {
  const [inf, stam] = kies(VORM_VERBS), [wie, k] = kies(diff === 'easy' ? SUBJ.filter(s => s[1] !== 1 || s[0] === 'Pip') : SUBJ), good = k === 0 ? stam : k === 1 ? stam + 't' : inf;
  const wrong = [stam, stam + 't', inf].filter(x => x !== good);
  return Object.assign(mkChoice(good, wrong, 3), { text: `${wie} <span class="gap">…</span> elke dag. <small>(${inf})</small>`, key: 'vorm' + wie + inf, hint: 'Bij ik pak je de stam. Bij jij, hij en Pip komt er een t achter. Bij wij, jullie en zij pak je het hele werkwoord.', explain: `${wie} ${good}: ${k === 0 ? 'ik + stam' : k === 1 ? 'jij/hij + stam + t' : 'meer mensen + hele werkwoord'}.` });
}
function genLuister(diff) {
  const pool = shuffle(DICT).slice(0, 4), [w, e] = pool[0];
  return Object.assign(bigChoice(e, pool.slice(1).map(x => x[1]).filter(x => x !== e), diff === 'easy' ? 3 : 4), { text: 'Luister goed. Welk <b>plaatje</b> hoort bij het woord?', say: w, key: 'lui' + w, hint: `Het woord is <b>${w}</b>. Zoek het plaatje.`, explain: `Je hoorde <b>${w}</b> ${e}.` });
}
function genTypPap(diff) {
  const [p, n, e] = kies(PAPW);
  return { kind: 'typ', text: `Typ het Papiamentu woord voor <b>${n}</b>.`, typ: { answer: p, emoji: e || '🔤', loose: true, pap: true }, key: 'typp' + p, sol: { s: p }, bad: { s: p + 'x' },
    hint: `Het woord begint met een <b class="pap">${p[0]}</b> en heeft ${p.length} letters. Accenten hoef je niet te typen.`, explain: `<b class="pap">${p}</b> betekent ${n}.` };
}
function genParenPap(diff) {
  const seen = new Set(), pairs = []; for (const x of shuffle(PAPW)) { if (!seen.has(x[1]) && !seen.has(x[0])) { seen.add(x[1]); seen.add(x[0]); pairs.push([x[1], `<span class="pap">${x[0]}</span>`]); if (pairs.length === 5) break; } }
  return { kind: 'paren', text: 'Zoek de Nederlandse woorden en de Papiamentu woorden die bij elkaar horen.', paren: mkParen(pairs), key: 'prp' + pairs.map(p => p[0]).join(','), sol: { done: 5, mis: 0 }, bad: { done: 2, mis: 6 }, hint: 'Begin met het woord dat je het beste kent.', explain: pairs.map(p => `${p[0]} = ${strip(p[1])}`).join(' · ') };
}

/* ---------- meer leesboekjes, per niveau ---------- */
[
  { id: 'regen', lvl: 1, title: 'Regen op het eiland', ico: '🌧️', pages: ['Het regent op Curaçao.', 'Wela doet de ramen dicht.', 'De kat zit onder de tafel.', 'Daarna komt de zon weer.'], qs: [['Waar regent het?', 'op Curaçao', ['in het bos', 'op school']], ['Wie doet de ramen dicht?', 'Wela', ['Pip', 'de kat']], ['Waar zit de kat?', 'onder de tafel', ['op de stoel', 'in de tuin']], ['Wat komt er daarna?', 'de zon', ['de maan', 'de wind']]] },
  { id: 'markt', lvl: 2, title: 'De drijvende markt', ico: '🛶', pages: ['In Willemstad ligt een drijvende markt.', 'De boten komen uit een ander land.', 'Op de boten liggen fruit en groente.', 'Mila koopt twee mango’s en een meloen.', 'Ze betaalt en zegt: “Dank u wel!”'], qs: [['Waar ligt de drijvende markt?', 'in Willemstad', ['in het bos', 'op de maan']], ['Wat ligt er op de boten?', 'fruit en groente', ['boeken', 'schoenen']], ['Wat koopt Mila?', 'twee mango’s en een meloen', ['een fiets', 'een ijsje']], ['Wat zegt Mila?', '“Dank u wel!”', ['“Tot morgen!”', '“Goedemorgen!”']]] },
  { id: 'brug', lvl: 2, title: 'De brug die draait', ico: '🌉', pages: ['De Emmabrug ligt over het water in Willemstad.', 'De brug staat op drijvende boten.', 'Komt er een groot schip? Dan draait de brug open.', 'De mensen wachten tot het schip voorbij is.', 'Dan draait de brug weer dicht.'], qs: [['Waar ligt de Emmabrug?', 'in Willemstad', ['in Nederland', 'in het bos']], ['Waarop staat de brug?', 'op drijvende boten', ['op palen van steen', 'op wielen']], ['Wanneer draait de brug open?', 'als er een groot schip komt', ['als het regent', 'als het donker is']], ['Wat doen de mensen?', 'ze wachten', ['ze zwemmen', 'ze slapen']]] },
  { id: 'flamingo', lvl: 2, title: 'Roze vogels', ico: '🦩', pages: ['Op Curaçao wonen flamingo’s.', 'Ze staan graag in ondiep, zout water.', 'Hun veren zijn roze door hun eten.', 'Ze staan vaak op één poot.', 'Als ze schrikken, vliegen ze weg.'], qs: [['Welke vogels wonen op Curaçao?', 'flamingo’s', ['pinguïns', 'uilen']], ['Waar staan ze graag?', 'in ondiep, zout water', ['in de bomen', 'op het dak']], ['Waardoor zijn ze roze?', 'door hun eten', ['door de zon alleen', 'door verf']], ['Wat doen ze als ze schrikken?', 'ze vliegen weg', ['ze zingen', 'ze slapen']]] },
  { id: 'reis', lvl: 3, title: 'De schoolreis', ico: '🚌', pages: ['Vandaag gaat groep 6 op schoolreis.', 'Om negen uur vertrekt de bus.', 'Eerst bezoeken de kinderen een strand, waar ze schelpen zoeken.', 'Na de lunch lopen ze door een grot.', 'Om vier uur zijn ze weer op school. Iedereen is moe maar blij.'], qs: [['Hoe laat vertrekt de bus?', 'om negen uur', ['om vier uur', 'om twaalf uur']], ['Wat doen de kinderen op het strand?', 'schelpen zoeken', ['zwemmen in de zee', 'ijs eten']], ['Wat gebeurt er na de lunch?', 'ze lopen door een grot', ['ze gaan naar huis', 'ze bezoeken een markt']], ['Hoe zijn de kinderen aan het eind?', 'moe maar blij', ['boos', 'verdrietig']]] }
].forEach(b => { if (typeof BOEKJES !== 'undefined' && !BOEKJES.some(x => x.id === b.id)) BOEKJES.push(b); });
{
  const tp = TOPIC['taal/boekjes'];
  if (tp) {
    tp.grades = [3, 7];
    tp.lesson = BOEKJES.map(b => ({ t: b.title, h: 'Lees mee. Tik op een woord om het te horen.', w: 'boekje', o: { id: b.id } }));
    tp.gen = diff => { const pool = BOEKJES.filter(b => (b.lvl || 1) <= (D.grade <= 3 ? 1 : D.grade <= 5 ? 2 : 3)), b = kies(pool.length ? pool : BOEKJES), [q, good, bad] = kies(b.qs);
      return Object.assign(bigChoice(good, bad, 3), { long: true, text: `<b>${b.title}</b><br>${q}`, say: `${b.pages.join(' ')} ${q}`, key: 'boek' + b.id + q, visual: `<div class="booktext">${b.ico} ${b.pages.join(' ')}</div>`, hint: 'Lees de tekst nog een keer. Zoek het antwoord in de zin.', explain: `Het staat in de tekst: <b>${good}</b>.` }); };
  }
}

/* ---------- aanmelden ---------- */
const regT = (subj, tp) => registerTopic(subj, Object.assign({ comma: false, pace: { easy: 4, medium: 3.5, hard: 3 } }, tp));
regT('papiamentu', { id: 'woordbank', name: 'Zinnen bouwen', sub: 'met woordjes', ico: '🧱', grades: [4, 8], gen: genWoordbank, lesson: [{ t: 'Zinnen bouwen', h: 'Je krijgt een Nederlandse zin. Bouw hem in het Papiamentu met de woordjes. Pas op: er staan woordjes bij die er niet bij horen.' }] });
regT('papiamentu', { id: 'letterspap', name: 'Letters leggen', sub: 'Papiamentu woorden', ico: '🔠', grades: [2, 8], gen: d => genLetters(d, true), lesson: [{ t: 'Letters leggen', h: 'Tik de letters in de goede volgorde. Met ↶ haal je de laatste letter weg.' }] });
regT('papiamentu', { id: 'typpap', name: 'Typ het woord', sub: 'zonder accenten', ico: '⌨️', grades: [4, 8], gen: genTypPap, lesson: [{ t: 'Typ het woord', h: 'Je ziet een Nederlands woord. Typ het Papiamentu woord. Accenten (zoals ó) hoef je niet te typen.' }] });
regT('papiamentu', { id: 'woordparen', name: 'Woordparen', sub: 'Nederlands en Papiamentu', ico: '🔗', grades: [1, 8], gen: genParenPap, lesson: [{ t: 'Woordparen', h: 'Tik links een Nederlands woord en rechts het Papiamentu woord dat erbij hoort.' }] });
regT('papiamentu', { id: 'gesprekpap', name: 'Praat met Wela', sub: 'kies het goede antwoord', ico: '💬', grades: [2, 8], gen: d => genGesprek(d, true), lesson: [{ t: 'Praat met Wela', h: 'Wela zegt iets. Kies steeds het antwoord dat past: bij “Bon dia” zeg je “Bon dia”.' }] });
regT('taal', { id: 'gesprek', name: 'Gesprekjes', sub: 'kies het goede antwoord', ico: '💬', grades: [2, 7], gen: d => genGesprek(d, false), lesson: [{ t: 'Gesprekjes', h: 'Bij een vraag hoort een passend antwoord. Lees goed en kies.' }] });
regT('taal', { id: 'letters', name: 'Letters leggen', sub: 'bouw het woord', ico: '🔠', grades: [1, 5], gen: d => genLetters(d, false), lesson: [{ t: 'Letters leggen', h: 'Kijk naar het plaatje en tik de letters in de goede volgorde.' }] });
regT('taal', { id: 'spreek', name: 'Zeg het zelf', sub: 'luister en spreek', ico: '🎤', grades: [1, 6], gen: genSpreek, lesson: [{ t: 'Zeg het zelf', h: 'Luister naar het woord, zeg het hardop en luister naar jezelf. Je opname blijft op de tablet en niemand beoordeelt je.' }] });
regT('taal', { id: 'vorm', name: 'Werkwoordsvormen', sub: 'speel, speelt, spelen', ico: '🧬', grades: [4, 8], gen: genVorm, lesson: [{ t: 'Werkwoord en persoon', h: 'Bij <b>ik</b> pak je de stam: ik speel. Bij <b>jij, hij</b> komt er een t achter: hij speelt. Bij <b>wij, jullie, zij</b> pak je het hele werkwoord: wij spelen.' }] });
regT('taal', { id: 'luister', name: 'Luister en kies', sub: 'welk plaatje hoort erbij?', ico: '👂', grades: [1, 4], gen: genLuister, lesson: [{ t: 'Luister en kies', h: 'Luister naar het woord en kies het plaatje dat erbij hoort. Tik op 🔊 om het nog een keer te horen.' }] });

/* ---------- woord van de dag (kaart) ---------- */
if (typeof onMapShown === 'function') {
  const _om = onMapShown;
  onMapShown = el => {
    _om(el);
    const anchor = $('.hero-row', el); if (!anchor || $('.wotd', el)) return;
    const d = new Date(), idx = (d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate()) % PAPW.length, [p, n, e] = PAPW[idx];
    const host = $('.gcards', el) || (anchor.insertAdjacentHTML('afterend', '<div class="gcards"></div>'), $('.gcards', el));
    host.insertAdjacentHTML('afterbegin', `<div class="gcard wotd"><span class="wotd-e">${e || '📚'}</span><span><small>${tri(['Woord van de dag', 'Palabra di dia', 'Word of the day'])}</small><br><b class="pap">${p}</b> = ${n}</span>${typeof VOICE_KEYS !== 'undefined' && VOICE_KEYS.has(p) ? `<button class="btn small" id="wotdplay">🔊</button>` : ''}</div>`);
    const b = $('#wotdplay', el); if (b) b.onclick = () => voicePlay(p);
  };
}

/* ---------- wizard-rangen ---------- */
const RANKS = [['Leerling', 0], ['Spreukenleerling', 10], ['Sterrenspeurder', 30], ['Woordtovenaar', 60], ['Getallentovenaar', 100], ['Eilandontdekker', 150], ['Spreukenmeester', 220], ['Sterrenbewaarder', 300], ['Toverkok', 400], ['Wijze Uil', 520], ['Eilandheld', 660], ['Grootmeester', 820], ['Sterrenwacht', 1000], ['Sterrenmeester', 1250]];
const rankOf = n => { let i = 0; RANKS.forEach((r, k) => { if (n >= r[1]) i = k; }); return i; };
if (typeof openProgress === 'function') {
  const _op = openProgress;
  openProgress = () => {
    _op();
    const w = $('#progress .wrap'), n = D.starsTotal || 0, i = rankOf(n), nxt = RANKS[i + 1];
    if (!w) return;
    w.insertAdjacentHTML('afterbegin', `<div class="rankcard card"><div class="rk-ico">${['🌱', '📘', '🔭', '✨', '🔢', '🧭', '📜', '⭐', '🍳', '🦉', '🏝️', '🎓', '🌟', '👑'][i]}</div><div><small>${tri(['Jouw rang', 'Bo rango', 'Your rank'])}</small><b>${RANKS[i][0]}</b>${nxt ? `<div class="rk-bar"><i style="width:${Math.round((n - RANKS[i][1]) / (nxt[1] - RANKS[i][1]) * 100)}%"></i></div><small>${tri(['nog', 'ainda', 'still'])} ${nxt[1] - n} ⭐ ${tri(['tot', 'te', 'to'])} ${nxt[0]}</small>` : `<small>${tri(['Hoogste rang bereikt!', 'Rango mas haltu!', 'Highest rank reached!'])}</small>`}</div></div>`);
  };
}
MOTOREN.push('woordbank', 'letters', 'gesprek', 'spreek');
