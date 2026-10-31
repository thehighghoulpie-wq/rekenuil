'use strict';
/* =====================================================================
   Toverschool Sterrenlicht – kleine hulpjes die alle bestanden gebruiken
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const kies = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => a / gcd(a, b) * b;

const BOX = '<span class="box">?</span>';
const frac = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;
const fracP = p => frac(p[0], p[1]);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const strip = s => String(s).replace(/<[^>]*>/g, '');
const pad2 = n => String(n).padStart(2, '0');
const tstr = (h, m) => `${h}:${pad2(m)}`;
const norm = t => ((t % 1440) + 1440) % 1440;
const tstrM = t => { t = norm(t); return tstr(Math.floor(t / 60), t % 60); };
const plural = (n, een, meer) => n === 1 ? een : meer;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// Nederlandse getalnotatie: komma voor decimalen, punt bij 10.000 en meer
function fmt(n) {
  const r = Math.round(n * 1000) / 1000;
  let s = Math.abs(r).toString();
  if (s.includes('e')) s = Math.abs(r).toFixed(3);
  let [i, d] = s.split('.');
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (r < 0 ? '−' : '') + i + (d ? ',' + d : '');
}
// grote getallen altijd met punt (ook 1.000 t/m 9.999), voor het onderwerp grote getallen
function fmtBig(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
const euro = c => '€ ' + (c / 100).toFixed(2).replace('.', ',');
const NAMES = ['Noor', 'Daan', 'Emma', 'Sem', 'Lotte', 'Milan', 'Sara', 'Bram', 'Yara', 'Ayoub', 'Fenna', 'Luuk', 'Mila', 'Finn', 'Zoë', 'Levi', 'Isa', 'Jesse', 'Djaimy', 'Shanaya', 'Jurensley', 'Kaylee'];

// keuzevraag maken: goed antwoord + foute opties, gehusseld
function mkChoice(correct, wrongs, n = 3) {
  const ws = [...new Set(wrongs.filter(w => w != null && w !== '' && w !== correct))];
  const opts = shuffle([correct, ...shuffle(ws).slice(0, n - 1)]);
  return { kind: 'choice', choices: opts, answer: opts.indexOf(correct) };
}

/* =====================================================================
   Register: hier melden vakken, onderwerpen en lessen zich aan.
   Nieuw onderwerp toevoegen? Zie README.md.
   ===================================================================== */
const SUBJECTS = [];
const SUBJECT = {};
const TOPIC = {};          // sleutel: 'vak/onderwerp'
function registerSubject(s) {
  s.topics = s.topics || [];
  SUBJECTS.push(s); SUBJECT[s.id] = s;
  return s;
}
function registerTopic(subjectId, t) {
  const s = SUBJECT[subjectId];
  t.subject = subjectId;
  t.key = subjectId + '/' + t.id;
  t.pace = t.pace || { easy: 6, medium: 5, hard: 4 };
  if (t.comma == null) t.comma = true;
  s.topics.push(t); TOPIC[t.key] = t;
  return t;
}
// lesstappen: { t: titel, h: uitleg (html), v: plaatje (html), w: 'widget-naam', o: opties }
const WIDGETS = {};
function registerWidget(name, fn) { WIDGETS[name] = fn; }
