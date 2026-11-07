'use strict';
/* =====================================================================
   Herhalen (Leitner-doosjes) en de dagelijkse Toverdrank.
   - Een fout woordje of een foute tafelsom gaat in doosje 1 en komt morgen terug.
   - Weet je hem dan? Dan gaat hij een doosje verder: over 3, 7, 14 en 30 dagen.
   - Na doosje 5 ken je hem echt en verdwijnt hij uit de herhaling.
   Een onderwerp doet mee als zijn gen(diff, item) een vaste vraag kan maken
   en de vraag een q.item heeft (zie papWordQ en genTafels).
   ===================================================================== */
const SR_DAYS = [0, 1, 3, 7, 14, 30];
function srRecord(q, ok) {
  if (q.item == null || !q.topic) return;
  const k = q.topic.key + '|' + q.item, r = D.review[k];
  if (!ok) { D.review[k] = { topic: q.topic.key, item: q.item, box: 1, due: addDays(SR_DAYS[1]) }; return; }
  if (!r || r.due > today()) return;          // alleen tellen als hij aan de beurt was
  r.box++;
  if (r.box > 5) delete D.review[k]; else r.due = addDays(SR_DAYS[r.box]);
}
const srDue = () => Object.values(D.review).filter(r => r.due <= today() && TOPIC[r.topic]);

// hoe moeilijk? hangt af van hoe goed het onderwerp gaat (en straks van de groep)
function autoDiff(key) {
  const st = topicStatus(key), lv = ['easy', 'medium', 'hard'];
  let i = st === 'super' ? 2 : st === 'goed' ? 1 : 0;
  if (D.grade <= 4) i = Math.min(i, 1); else if (D.grade >= 8) i = Math.min(2, i + 1);
  return lv[i];
}

/* ---------- de Toverdrank van vandaag ---------- */
const POTION_SUBJ = { id: 'potion', color: '#9B5DE5', light: '#F1E8FF', dark: '#6A3FB5', teacher: 'nova', teacherName: 'Nova' };
const POTIONS = [['pot0', '#FFD36E'], ['pot1', '#C9D6FF'], ['pot2', '#4FC8BA'], ['pot3', '#FF6F91'], ['pot4', '#FF9EC4'], ['pot5', '#8FD3FF'], ['pot6', '#FF8A3D']];
const potionName = i => t(POTIONS[i][0]);
const streakTxt = n => n === 1 ? t('potStreak1') : t('potStreak', { n });
const nextPotion = () => POTIONS[(D.potion.total || 0) % POTIONS.length];
const weekKey = () => { const d = new Date(), j = new Date(d.getFullYear(), 0, 1); return d.getFullYear() + '-' + Math.floor(((d - j) / 864e5 + j.getDay()) / 7); };

function buildPotion(n = D.settings.dailyGoal || 10) {
  const q = [], add = (topic, item) => q.push({ topic, item, diff: autoDiff(topic) });
  shuffle(srDue()).slice(0, Math.ceil(n / 2)).forEach(r => add(r.topic, r.item));
  const all = SUBJECTS.flatMap(s => s.topics).filter(topicFits);
  const weak = all.filter(tp => topicStatus(tp.key) === 'oefenen');
  const tried = all.filter(tp => D.topics[tp.key] && D.topics[tp.key].answered);
  const pool = [...weak, ...weak, ...(tried.length >= 3 ? tried : all)];
  while (q.length < n) add(kies(pool).key);
  return shuffle(q);
}
function startPotion() {
  S.potion = true; S.queue = buildPotion(); S.topicKey = 'potion'; S.subject = 'potion';
  Object.assign(S, { mode: 'practice', diff: 'medium', count: S.queue.length });
  startQuiz();
}
// streak telt door als je gisteren brouwde; één gemiste dag per week houdt Pip warm
function potionStreakNow() {
  const P = D.potion;
  if (P.last === today() || P.last === addDays(-1)) return P.streak;
  if (P.last === addDays(-2) && P.freezeWeek !== weekKey()) return P.streak;
  return 0;
}
function potionComplete() {
  const P = D.potion;
  if (P.last === today()) return { again: true, bonus: 0 };
  let warm = false;
  if (P.last === addDays(-1)) P.streak++;
  else if (P.last === addDays(-2) && P.freezeWeek !== weekKey()) { P.streak++; P.freezeWeek = weekKey(); warm = true; }
  else P.streak = 1;
  P.last = today(); P.best = Math.max(P.best || 0, P.streak);
  const pi = (P.total || 0) % POTIONS.length; P.total = (P.total || 0) + 1;
  P.got[pi] = (P.got[pi] || 0) + 1;
  save();
  return { streak: P.streak, warm, potion: pi, bonus: 5 };   // vast: een langere reeks levert niet meer sterren op (geen druk)
}

function potionSVG(level = 0, col = '#FFD36E', cls = '') {
  const lv = Math.max(0, Math.min(1, level)), top = 112 - lv * 62;
  const id = 'pc' + Math.random().toString(36).slice(2, 7);
  return `<svg class="potion ${cls}" viewBox="0 0 100 130" role="img" aria-label="Toverdrank">
    <defs><clipPath id="${id}"><path d="M38 34 L38 50 C18 58 12 76 14 92 C16 112 32 122 50 122 C68 122 84 112 86 92 C88 76 82 58 62 50 L62 34Z"/></clipPath></defs>
    <path d="M38 34 L38 50 C18 58 12 76 14 92 C16 112 32 122 50 122 C68 122 84 112 86 92 C88 76 82 58 62 50 L62 34Z" fill="#fff" fill-opacity=".55" stroke="#6A3FB5" stroke-width="3.5"/>
    <g clip-path="url(#${id})"><rect class="pot-liquid" x="0" y="${top}" width="100" height="130" fill="${col}"/>
      <path class="pot-wave" d="M0 ${top} Q12 ${top - 5} 25 ${top} T50 ${top} T75 ${top} T100 ${top} V${top + 8} H0Z" fill="${shade(col, .35)}"/>
      ${lv > .05 ? `<circle class="bub b1" cx="40" cy="108" r="3" fill="#fff" opacity=".7"/><circle class="bub b2" cx="58" cy="112" r="2.4" fill="#fff" opacity=".7"/><circle class="bub b3" cx="50" cy="104" r="2" fill="#fff" opacity=".7"/>` : ''}</g>
    <rect x="33" y="22" width="34" height="14" rx="5" fill="#B9845A"/><rect x="36" y="14" width="28" height="10" rx="4" fill="#9A6A44"/>
    <path d="M28 80 Q26 68 34 62" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".6"/>
    ${lv >= 1 ? sparkle(82, 26, 8, '#FFE27A') + sparkle(18, 44, 6, '#fff') : ''}</svg>`;
}
function potionCard() {
  const P = D.potion, done = P.last === today(), due = srDue().length, streak = potionStreakNow();
  return `<div class="potcard card ${done ? 'done' : ''}"><div class="pc-bottle">${potionSVG(done ? 1 : .3, done ? POTIONS[((P.total || 1) - 1) % POTIONS.length][1] : nextPotion()[1])}</div>
    <div class="pc-txt"><b>${t('potTitle')}</b><span>${done ? t('potDone') : t('potSub', { n: D.settings.dailyGoal })}</span>
      <span class="pc-pills">${streak ? `<span class="pill fire">🔥 ${streakTxt(streak)}</span>` : ''}${due ? `<span class="pill">🔁 ${t('potDue', { n: due })}</span>` : ''}</span></div>
    <button class="btn ${done ? 'ghost' : 'primary'}" id="potgo">${done ? t('potAgain') : t('potGo')}</button></div>`;
}
