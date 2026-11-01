'use strict';
/* =====================================================================
   Tekeningen: eigen chibi-tovenaarsleerling, huisdieren, Pip en de leraren.
   Alles is zelf getekend in SVG (geen bestaande figuren).
   ===================================================================== */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}

/* ---------- keuzes voor het personage ---------- */
const SKINS = ['#FFE3CF', '#F6CDA8', '#E2A97E', '#C68A5E', '#9C6644', '#74462C', '#5A3420', '#FFF0E6', '#D9A877', '#3F2417'];
const SKIN_ORDER = [7, 0, 1, 2, 8, 3, 4, 5, 6, 9];   // van licht naar donker (nieuwe kleuren staan achteraan in SKINS)
const HAIRCOLORS = ['#2B1D1A', '#5A3825', '#9A5B2E', '#E8B455', '#E9604F', '#F48FC0', '#7E8CF4', '#58C9B9', '#B18CF0', '#F2F2F7'];
const EYECOLORS = ['#5B3A29', '#2F6FD6', '#2E9E6A', '#8B5CF6', '#E0567A', '#D4952B'];
const HAIRSTYLES = [
  { id: 'staarten', name: 'Twee staarten' }, { id: 'lang', name: 'Lang' }, { id: 'puffs', name: 'Puffs' },
  { id: 'vlechten', name: 'Vlechten' }, { id: 'knot', name: 'Knotje' }, { id: 'krullen', name: 'Krullen' },
  { id: 'kort', name: 'Bobje' }, { id: 'stekel', name: 'Kort & stoer' },
  { id: 'afro', name: 'Afro' }, { id: 'afropuf', name: 'Hoge puf' }, { id: 'cornrows', name: 'Cornrows' }, { id: 'boxbraids', name: 'Box braids' },
  { id: 'locs', name: 'Locs' }, { id: 'zijstaart', name: 'Zijstaart' }, { id: 'spacebuns', name: 'Space buns' }, { id: 'pixie', name: 'Pixie' }
];
const EYESHAPES = ['rond', 'sprank', 'slaperig', 'kat'];
const BROWS = ['zacht', 'recht', 'boog', 'dik'];
const GLASSES = ['geen', 'rond', 'ster', 'hart'];
const EARRINGS = ['geen', 'knopje', 'ring', 'ster'];
const CLIPS = ['geen', 'strikjes', 'sterren', 'bloem', 'haarband', 'hoofddoek'];
const ROBECOLS = ['#8B6CF0', '#4D6BDB', '#14A3C7', '#4FC8A4', '#FFB547', '#E85D5D', '#FF8FB8', '#2A2366'];
const TEKENS = [['ster', '⭐'], ['maan', '🌙'], ['zee', '🌊'], ['zon', '☀️']];

/* ---------- winkel: kleding, hoeden, toverstokken, huisdieren ---------- */
const ITEMS = {
  outfit: [
    { id: 'paars', name: 'Leerlingenmantel', price: 0, c: '#8B6CF0', t: '#FFD36E', e: 'ster' },
    { id: 'roze', name: 'Hartjesjurk', price: 25, c: '#FF8FB8', t: '#FFFFFF', e: 'hart' },
    { id: 'blauw', name: 'Maanmantel', price: 30, c: '#4D6BDB', t: '#C9D6FF', e: 'maan' },
    { id: 'mint', name: 'Blaadjescape', price: 35, c: '#4FC8A4', t: '#E9FFF6', e: 'blad' },
    { id: 'zon', name: 'Zonnestraal', price: 40, c: '#FFB547', t: '#FFF3C4', e: 'zon' },
    { id: 'curacao', name: 'Eilandmantel', price: 60, c: '#1E4FB8', t: '#FFD200', e: 'vlag' },
    { id: 'feest', name: 'Feestjurk', price: 75, c: '#E85D9E', t: '#FFE15A', e: 'confetti' },
    { id: 'regenboog', name: 'Regenboogmantel', price: 100, c: 'url(#rb)', t: '#FFFFFF', e: 'ster' },
    { id: 'nacht', name: 'Sterrennacht', price: 150, c: '#2A2366', t: '#FFD36E', e: 'sterren' },
    { id: 'karnaval', name: 'Karnavalsjurk', price: null, piece: 2, c: '#E8402A', t: '#FFD21F', e: 'pailletten' }
  ],
  hat: [
    { id: 'geen', name: 'Geen hoed', price: 0 },
    { id: 'puntmuts', name: 'Tovermuts', price: 0 },
    { id: 'strik', name: 'Grote strik', price: 15 },
    { id: 'bloem', name: 'Hibiscusbloem', price: 20 },
    { id: 'kattenoren', name: 'Kattenoortjes', price: 35 },
    { id: 'zonnehoed', name: 'Strohoed', price: 40 },
    { id: 'heks', name: 'Krulhoed', price: 55 },
    { id: 'kroon', name: 'Sterrenkroon', price: 90 },
    { id: 'karnaval', name: 'Verentooi', price: null, piece: 1 }
  ],
  wand: [
    { id: 'ster', name: 'Sterrenstaf', price: 0 },
    { id: 'hart', name: 'Hartjesstaf', price: 20 },
    { id: 'maan', name: 'Maanstaf', price: 30 },
    { id: 'schelp', name: 'Schelpstaf', price: 40 },
    { id: 'kristal', name: 'Kristalstaf', price: 60 },
    { id: 'regenboog', name: 'Regenboogstaf', price: 90 },
    { id: 'karnaval', name: 'Verenstaf', price: null, piece: 3 }
  ],
  pet: [
    { id: 'geen', name: 'Nog geen huisdier', price: 0 },
    { id: 'kat', name: 'Sterrenkat Miepie', price: 40 },
    { id: 'flamingo', name: 'Flamingo Flip', price: 50 },
    { id: 'leguaan', name: 'Leguaan Luna', price: 50 },
    { id: 'uil', name: 'Uiltje Hoepla', price: 60 },
    { id: 'wolk', name: 'Wolkje Pluis', price: 70 },
    { id: 'schildpad', name: 'Schildpad Turbo', price: 80 },
    { id: 'eenhoorn', name: 'Eenhoorn Glitter', price: 120 },
    { id: 'draak', name: 'Babydraak Vonk', price: 150 }
  ]
};
const ITEM = {}; for (const k in ITEMS) for (const it of ITEMS[k]) ITEM[k + ':' + it.id] = it;

const DEFAULT_LOOK = { skin: 3, hair: 'staarten', hairColor: 0, eyes: 0, outfit: 'paars', hat: 'puntmuts', wand: 'ster', pet: 'geen',
  tips: -1, eyeShape: 'rond', lashes: false, brows: 'zacht', sproet: false, blush: 1, bril: 'geen', oorbel: 'geen', clip: 'geen', robeColor: 0, teken: 'ster', bg: 'geen', glitter: 'staf' };
// Toverspiegel 3.0: achtergrond achter de spiegel, kleur van de glitters, poses en gezichtjes om te proberen
const MIRROR_BGS = [['geen', '🪞'], ['sterren', '✨'], ['strand', '🏖️'], ['haven', '🏘️'], ['regenboog', '🌈'], ['nacht', '🌙']];
const GLITTERS = [['staf', '🪄'], ['goud', '⭐'], ['roze', '💖'], ['blauw', '💙'], ['regenboog', '🌈']];
const POSES = [['zwaai', '👋'], ['spring', '🦘'], ['draai', '🌀'], ['pose', '⭐']];
const FACES = [['blij', '😊'], ['lach', '😄'], ['wow', '🤩'], ['knipoog', '😉']];
// "Verras me!": een willekeurig maar mooi personage
function randomLook(L) {
  return Object.assign({}, L, { skin: rnd(0, SKINS.length - 1), hair: kies(HAIRSTYLES).id, hairColor: rnd(0, HAIRCOLORS.length - 1), eyes: rnd(0, EYECOLORS.length - 1),
    tips: Math.random() < .25 ? rnd(0, HAIRCOLORS.length - 1) : -1, eyeShape: kies(EYESHAPES), lashes: Math.random() < .5, brows: kies(BROWS), sproet: Math.random() < .3,
    blush: rnd(0, 2), bril: Math.random() < .25 ? kies(GLASSES.slice(1)) : 'geen', oorbel: kies(EARRINGS), clip: Math.random() < .5 ? kies(CLIPS.slice(1)) : 'geen',
    robeColor: rnd(0, ROBECOLS.length - 1), teken: kies(TEKENS)[0] });
}

/* ---------- ogen en gezichtjes (gedeeld) ---------- */
function animeEye(x, y, col, s = 1, mood = 'blij', o = {}) {
  if (mood === 'lach') return `<path d="M${x - 10 * s} ${y + 2 * s} Q${x} ${y - 10 * s} ${x + 10 * s} ${y + 2 * s}" stroke="#2B2140" stroke-width="${3.6 * s}" fill="none" stroke-linecap="round"/>`;
  if (mood === 'oeps') return `<path d="M${x - 8 * s} ${y - 7 * s} L${x + 6 * s} ${y} L${x - 8 * s} ${y + 7 * s}" stroke="#2B2140" stroke-width="${3.4 * s}" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="${x > 100 ? `rotate(180 ${x} ${y})` : ''}"/>`;
  const big = mood === 'wow' ? 1.12 : 1, sh = o.shape || 'rond', k = sh === 'slaperig' ? .78 : 1, side = x > 100 ? 1 : -1;
  const lid = sh === 'slaperig' ? `<path d="M${x - 12 * s} ${y - 5 * s} Q${x} ${y - 12 * s} ${x + 12 * s} ${y - 5 * s}" stroke="#2B2140" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 12 * s} ${y - 8 * s} Q${x} ${y - 20 * s} ${x + 12 * s} ${y - 8 * s}" stroke="#2B2140" stroke-width="${3.4 * s}" fill="none" stroke-linecap="round"/>`;
  const flick = sh === 'kat' ? `<path d="M${x + side * 10 * s} ${y - 10 * s} L${x + side * 17 * s} ${y - 15 * s}" stroke="#2B2140" stroke-width="${3 * s}" stroke-linecap="round"/>` : '';
  const lash = o.lashes ? `<path d="M${x + side * 9 * s} ${y - 13 * s} l${side * 5 * s} ${-5 * s} M${x + side * 4 * s} ${y - 16 * s} l${side * 3 * s} ${-6 * s}" stroke="#2B2140" stroke-width="${2.2 * s}" stroke-linecap="round"/>` : '';
  const extra = sh === 'sprank' ? `<path d="M${x - 4 * s} ${y + 1 * s} l${1.2 * s} ${2.8 * s} l${2.8 * s} ${1.2 * s} l${-2.8 * s} ${1.2 * s} l${-1.2 * s} ${2.8 * s} l${-1.2 * s} ${-2.8 * s} l${-2.8 * s} ${-1.2 * s} l${2.8 * s} ${-1.2 * s}Z" fill="#fff"/>` : '';
  return `<g><ellipse cx="${x}" cy="${y}" rx="${11 * s * big}" ry="${14 * s * big * k}" fill="#fff"/>
    <ellipse cx="${x}" cy="${y + 1 * s}" rx="${9 * s * big}" ry="${12.5 * s * big * k}" fill="${col}"/>
    <ellipse cx="${x}" cy="${y + 4 * s}" rx="${6 * s}" ry="${7 * s * k}" fill="${shade(col, -.45)}"/>
    <ellipse cx="${x}" cy="${y + 8 * s * k}" rx="${6 * s}" ry="${3 * s}" fill="${shade(col, .35)}" opacity=".7"/>
    <circle cx="${x + 3.5 * s}" cy="${y - 5 * s * k}" r="${3.8 * s}" fill="#fff"/><circle cx="${x - 3.5 * s}" cy="${y + 5 * s * k}" r="${1.8 * s}" fill="#fff"/>${extra}
    ${lid}${flick}${lash}</g>`;
}
function mouth(x, y, mood, s = 1) {
  if (mood === 'wow') return `<ellipse cx="${x}" cy="${y + 2 * s}" rx="${5 * s}" ry="${6 * s}" fill="#7A2E3A"/>`;
  if (mood === 'oeps') return `<path d="M${x - 7 * s} ${y + 3 * s} q${3.5 * s} ${-4 * s} ${7 * s} 0 q${3.5 * s} ${4 * s} ${7 * s} 0" stroke="#7A2E3A" stroke-width="${2.6 * s}" fill="none" stroke-linecap="round"/>`;
  if (mood === 'lach') return `<path d="M${x - 9 * s} ${y} Q${x} ${y + 13 * s} ${x + 9 * s} ${y} Z" fill="#7A2E3A"/><path d="M${x - 5 * s} ${y + 6 * s} Q${x} ${y + 10 * s} ${x + 5 * s} ${y + 6 * s}" fill="#FF8FA3"/>`;
  return `<path d="M${x - 7 * s} ${y} Q${x} ${y + 8 * s} ${x + 7 * s} ${y}" stroke="#7A2E3A" stroke-width="${2.8 * s}" fill="none" stroke-linecap="round"/>`;
}
const blush = (x1, x2, y, s = 1, op = .38) => op ? `<ellipse cx="${x1}" cy="${y}" rx="${9 * s}" ry="${5 * s}" fill="#FF7FA8" opacity="${op}"/><ellipse cx="${x2}" cy="${y}" rx="${9 * s}" ry="${5 * s}" fill="#FF7FA8" opacity="${op}"/>` : '';
const sparkle = (x, y, r, col = '#FFE27A') => `<path d="M${x} ${y - r} Q${x + r * .18} ${y - r * .18} ${x + r} ${y} Q${x + r * .18} ${y + r * .18} ${x} ${y + r} Q${x - r * .18} ${y + r * .18} ${x - r} ${y} Q${x - r * .18} ${y - r * .18} ${x} ${y - r}Z" fill="${col}"/>`;
const starPath = (cx, cy, R, r = R * .45) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; d += (i ? 'L' : 'M') + (cx + q * Math.cos(a)).toFixed(1) + ' ' + (cy + q * Math.sin(a)).toFixed(1); } return d + 'Z'; };
const heartPath = (x, y, s) => `M${x} ${y + 4 * s} C${x - 9 * s} ${y - 3 * s} ${x - 5 * s} ${y - 10 * s} ${x} ${y - 5 * s} C${x + 5 * s} ${y - 10 * s} ${x + 9 * s} ${y - 3 * s} ${x} ${y + 4 * s}Z`;

/* ---------- haar ---------- */
const hairTone = (H, a) => H.startsWith('url') ? H : shade(H, a);   // haarkleur mag ook een verloop zijn (gekleurde puntjes)
function hairBack(style, H) {
  const Hd = hairTone(H, -.18);
  const shortBack = `<path d="M32 92 C30 40 66 20 100 20 C134 20 170 40 168 92 C170 122 166 142 156 152 L44 152 C34 142 30 122 32 92Z" fill="${Hd}"/>`;
  switch (style) {
    case 'lang': return `<path d="M32 90 C28 38 66 18 100 18 C134 18 172 38 168 90 C174 140 176 196 162 222 C140 232 60 232 38 222 C24 196 26 140 32 90Z" fill="${Hd}"/>`;
    case 'staarten': return shortBack + `<path d="M44 66 C8 74 -2 150 18 214 C26 186 30 160 40 140 C44 172 40 196 50 214 C56 170 58 120 58 96Z" fill="${H}"/><path d="M156 66 C192 74 202 150 182 214 C174 186 170 160 160 140 C156 172 160 196 150 214 C144 170 142 120 142 96Z" fill="${H}"/>`;
    case 'knot': return shortBack + `<circle cx="100" cy="20" r="26" fill="${H}"/><path d="M84 12 Q100 2 116 12" stroke="${Hd}" stroke-width="3" fill="none"/>`;
    case 'puffs': return `<circle cx="42" cy="42" r="32" fill="${H}"/><circle cx="158" cy="42" r="32" fill="${H}"/>` +
      [[26, 30], [40, 20], [56, 30], [30, 52], [52, 54], [144, 30], [160, 20], [174, 30], [148, 54], [170, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${Hd}" opacity=".35"/>`).join('') +
      `<path d="M34 96 C30 44 66 24 100 24 C134 24 170 44 166 96 C166 118 160 132 154 140 L46 140 C40 132 34 118 34 96Z" fill="${Hd}"/>`;
    case 'vlechten': return shortBack;
    case 'krullen': return [[40, 70, 30], [30, 112, 28], [40, 152, 26], [160, 70, 30], [170, 112, 28], [160, 152, 26], [64, 34, 30], [100, 24, 32], [136, 34, 30], [56, 176, 22], [144, 176, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${Hd}"/>`).join('');
    case 'kort': return shortBack;
    case 'stekel': case 'pixie': return `<path d="M36 92 C34 46 66 26 100 26 C134 26 166 46 164 92 C164 108 160 116 154 122 L46 122 C40 116 36 108 36 92Z" fill="${Hd}"/>`;
    case 'afro': return `<circle cx="100" cy="84" r="84" fill="${Hd}"/>` + [[40, 50], [70, 22], [130, 22], [160, 50], [24, 100], [176, 100], [36, 146], [164, 146]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="${H}" opacity=".35"/>`).join('');
    case 'afropuf': return `<circle cx="100" cy="4" r="40" fill="${H}"/>` + [[78, -10], [100, -24], [122, -10], [86, 16], [114, 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${Hd}" opacity=".35"/>`).join('') +
      `<path d="M36 94 C34 50 64 30 100 30 C136 30 166 50 164 94 C164 112 160 124 154 130 L46 130 C40 124 36 112 36 94Z" fill="${Hd}"/>`;
    case 'cornrows': return `<path d="M36 94 C34 50 64 30 100 30 C136 30 166 50 164 94 C164 112 160 124 154 130 L46 130 C40 124 36 112 36 94Z" fill="${Hd}"/>`;
    case 'boxbraids': case 'locs': {
      const w = style === 'locs' ? 11 : 7, end = style === 'locs' ? 206 : 226;
      let b = `<path d="M34 92 C30 44 66 22 100 22 C134 22 170 44 166 92 L166 130 L34 130Z" fill="${Hd}"/>`;
      for (let x = 30, i = 0; x <= 170; x += style === 'locs' ? 14 : 10, i++) if (x < 62 || x > 138) b += `<rect x="${x - w / 2}" y="80" width="${w}" height="${end - 80 - Math.abs(x - 100) * .2}" rx="${w / 2}" fill="${i % 2 ? H : Hd}"/>`;
      return b;
    }
    case 'zijstaart': return shortBack + `<path d="M150 70 C196 84 198 160 176 214 C170 180 164 150 152 130Z" fill="${H}"/>`;
    case 'spacebuns': return shortBack + `<circle cx="52" cy="30" r="25" fill="${H}"/><circle cx="148" cy="30" r="25" fill="${H}"/><path d="M38 24 Q52 12 66 24 M134 24 Q148 12 162 24" stroke="${Hd}" stroke-width="3" fill="none"/>`;
  }
  return shortBack;
}
function hairFront(style, H) {
  const Hl = hairTone(H, .22);
  const bangs = `<path d="M36 98 C32 50 62 26 100 26 C138 26 168 50 164 98 C158 86 152 78 146 72 C142 84 134 88 128 90 C126 78 120 70 114 66 C108 80 98 86 86 88 C90 78 90 72 88 66 C80 76 70 82 58 84 C60 78 60 74 60 72 C50 80 42 88 36 98Z" fill="${H}"/>` +
    `<path d="M70 40 Q90 32 108 36" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`;
  const locks = `<path d="M36 96 C34 124 38 146 46 160 C50 138 50 120 50 102Z" fill="${H}"/><path d="M164 96 C166 124 162 146 154 160 C150 138 150 120 150 102Z" fill="${H}"/>`;
  switch (style) {
    case 'puffs': return `<path d="M36 94 C34 50 64 30 100 30 C136 30 166 50 164 94 C152 70 130 58 100 58 C70 58 48 70 36 94Z" fill="${H}"/><path d="M70 44 Q90 38 108 41" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
    case 'staarten': return bangs + locks + `<circle cx="46" cy="70" r="7" fill="#FF6FA8"/><circle cx="154" cy="70" r="7" fill="#FF6FA8"/>`;
    case 'vlechten': {
      let s = bangs;
      for (const side of [-1, 1]) {
        const bx = 100 + side * 58;
        for (let i = 0; i < 6; i++) s += `<ellipse cx="${bx - side * i * .8}" cy="${136 + i * 16}" rx="10" ry="11" fill="${i % 2 ? hairTone(H, -.08) : H}"/>`;
        s += `<circle cx="${bx - side * 5}" cy="${232}" r="5" fill="#FFB547"/><path d="M${bx - side * 5} 236 l-6 10 M${bx - side * 5} 236 l6 10" stroke="${H}" stroke-width="5" stroke-linecap="round"/>`;
      }
      return s;
    }
    case 'knot': return bangs + `<circle cx="100" cy="0" r="0"/>` + `<path d="M84 4 Q100 -4 116 4" stroke="#FF6FA8" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    case 'krullen': return bangs + [[44, 84], [58, 70], [142, 70], [156, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${H}"/>`).join('');
    case 'lang': return bangs + locks;
    case 'stekel': return `<path d="M36 96 C30 52 60 24 100 24 C140 24 170 52 164 96 L156 80 L150 92 L142 70 L132 86 L122 64 L110 82 L100 60 L90 82 L78 64 L68 86 L58 70 L50 92 L44 80Z" fill="${H}"/>`;
    case 'afro': return `<path d="M34 96 C28 44 62 22 100 22 C138 22 172 44 166 96 C160 84 156 80 150 78 C146 70 136 66 128 70 C120 62 110 62 100 66 C90 62 80 62 72 70 C64 66 54 70 50 78 C44 80 40 84 34 96Z" fill="${H}"/>`;
    case 'afropuf': case 'cornrows': {
      let f = `<path d="M36 94 C34 50 64 30 100 30 C136 30 166 50 164 94 C152 72 130 62 100 62 C70 62 48 72 36 94Z" fill="${H}"/>`;
      if (style === 'cornrows') for (const x of [60, 80, 100, 120, 140]) f += `<path d="M${x} 66 Q${100 + (x - 100) * .55} 44 ${100 + (x - 100) * .35} 28" stroke="${hairTone(H, -.25)}" stroke-width="3" fill="none" stroke-dasharray="5 3"/>`;
      return f + `<path d="M70 44 Q90 38 108 41" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
    }
    case 'boxbraids': case 'locs': {
      const w = style === 'locs' ? 11 : 7;
      let f = `<path d="M36 96 C32 50 62 26 100 26 C138 26 168 50 164 96 C156 76 136 62 104 60 L100 40 L96 60 C64 62 44 76 36 96Z" fill="${H}"/>`;
      [42, 52, 148, 158].forEach((x, i) => { f += `<rect x="${x - w / 2}" y="84" width="${w}" height="${style === 'locs' ? 96 : 110}" rx="${w / 2}" fill="${i % 2 ? hairTone(H, -.1) : H}"/>`; });
      return f;
    }
    case 'zijstaart': return bangs + `<circle cx="156" cy="74" r="8" fill="#FF6FA8"/>`;
    case 'spacebuns': return bangs + locks;
    case 'pixie': return `<path d="M36 100 C30 52 62 24 102 24 C140 24 170 50 164 98 C160 84 152 74 140 68 C120 76 90 80 54 74 C46 80 40 90 36 100Z" fill="${H}"/><path d="M76 40 Q100 30 124 38" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }
  return bangs + locks;
}

/* ---------- hoeden ---------- */
function hatSVG(id, robe) {
  switch (id) {
    case 'puntmuts': return `<g><path d="M60 48 L100 -26 Q106 -32 112 -26 L140 48Z" fill="#5B47C9"/><ellipse cx="100" cy="48" rx="56" ry="11" fill="#4A39AE"/>
      <path d="${starPath(104, 14, 9)}" fill="#FFD36E"/><circle cx="90" cy="34" r="3" fill="#FFD36E"/><circle cx="120" cy="30" r="2.4" fill="#FFD36E"/><path d="M66 44 Q100 34 134 44" stroke="#FFD36E" stroke-width="5" fill="none"/></g>`;
    case 'heks': return `<g><path d="M58 48 Q84 10 96 -14 Q104 -30 124 -26 Q140 -22 136 -10 Q128 -18 118 -14 Q112 4 142 48Z" fill="#3C2A6E"/><ellipse cx="100" cy="48" rx="62" ry="12" fill="#2E2058"/>
      <path d="M68 42 Q100 32 136 42 L136 32 Q100 22 70 32Z" fill="#FF8FB8"/><path d="${starPath(100, 32, 6)}" fill="#FFD36E"/></g>`;
    case 'kroon': return `<g><path d="M58 40 L66 8 L82 26 L100 -2 L118 26 L134 8 L142 40 Q100 30 58 40Z" fill="#FFD36E" stroke="#E0A92A" stroke-width="2"/>
      <circle cx="100" cy="14" r="5" fill="#FF6FA8"/><circle cx="76" cy="28" r="4" fill="#58C9B9"/><circle cx="124" cy="28" r="4" fill="#7E8CF4"/>${sparkle(150, 4, 7, '#fff')}</g>`;
    case 'strik': return `<g transform="translate(132 34) rotate(18)"><path d="M0 0 L-30 -16 Q-36 0 -30 16Z M0 0 L30 -16 Q36 0 30 16Z" fill="#FF6FA8"/><circle r="8" fill="#FF8FB8"/><path d="M-22 -8 L-26 0 M22 -8 L26 0" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></g>`;
    case 'bloem': return `<g transform="translate(150 64)">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="10" ry="16" cy="-12" fill="#FF4F6E" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="#FFD36E"/><path d="M0 0 L10 -14" stroke="#FFD36E" stroke-width="2.5"/></g>`;
    case 'kattenoren': return `<g><path d="M42 54 L44 6 L84 34Z" fill="#2B2140"/><path d="M50 44 L52 18 L74 34Z" fill="#FF9EC4"/><path d="M158 54 L156 6 L116 34Z" fill="#2B2140"/><path d="M150 44 L148 18 L126 34Z" fill="#FF9EC4"/></g>`;
    case 'karnaval': return `<g>${[['#E8402A', -50], ['#FFB547', -30], ['#FFD21F', -10], ['#4FC8A4', 10], ['#4D6BDB', 30], ['#B18CF0', 50]].map(([c, a]) => `<ellipse cx="100" cy="6" rx="9" ry="30" fill="${c}" transform="rotate(${a} 100 46)"/>`).join('')}
      <path d="M48 50 Q100 30 152 50 L152 58 Q100 40 48 58Z" fill="#FFD21F"/>${[64, 82, 100, 118, 136].map((x, i) => `<circle cx="${x}" cy="${48 - (i === 2 ? 4 : 1)}" r="3.6" fill="${['#E8402A', '#4D6BDB', '#fff', '#4D6BDB', '#E8402A'][i]}"/>`).join('')}</g>`;
    case 'zonnehoed': return `<g><ellipse cx="100" cy="44" rx="84" ry="18" fill="#F1CF7A"/><path d="M58 44 Q60 4 100 2 Q140 4 142 44Z" fill="#E9BF5C"/><path d="M58 38 Q100 28 142 38 L142 44 Q100 34 58 44Z" fill="#FF6FA8"/>
      <path d="M30 44 Q100 58 170 44" stroke="#D9AE4A" stroke-width="2" fill="none"/><g transform="translate(130 32)">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="5" ry="8" cy="-6" fill="#FF4F6E" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#FFD36E"/></g></g>`;
  }
  return '';
}

/* ---------- toverstokken ---------- */
function wandTip(id, x, y) {
  switch (id) {
    case 'hart': return `<path d="${heartPath(x, y, 1.5)}" fill="#FF5E8E"/>`;
    case 'maan': return `<path d="M${x + 4} ${y - 12} A12 12 0 1 0 ${x + 4} ${y + 12} A9 9 0 1 1 ${x + 4} ${y - 12}Z" fill="#FFE27A"/>`;
    case 'schelp': return `<path d="M${x} ${y + 8} L${x - 12} ${y - 4} Q${x} ${y - 18} ${x + 12} ${y - 4}Z" fill="#FFB8A8"/><path d="M${x} ${y + 8} L${x - 6} ${y - 10} M${x} ${y + 8} L${x} ${y - 12} M${x} ${y + 8} L${x + 6} ${y - 10}" stroke="#E98A78" stroke-width="1.6"/>`;
    case 'kristal': return `<path d="M${x} ${y - 16} L${x + 9} ${y - 2} L${x} ${y + 10} L${x - 9} ${y - 2}Z" fill="#7FE3F0"/><path d="M${x} ${y - 16} L${x + 3} ${y - 2} L${x} ${y + 10}" fill="#C8F6FF"/>`;
    case 'karnaval': return `<path d="M${x} ${y + 10} Q${x - 14} ${y - 6} ${x + 2} ${y - 24} Q${x + 12} ${y - 6} ${x} ${y + 10}Z" fill="#E8402A"/><path d="M${x} ${y + 10} Q${x - 6} ${y - 6} ${x + 2} ${y - 20}" stroke="#FFD21F" stroke-width="2" fill="none"/>`;
    case 'regenboog': return `<g>${['#FF5E5E', '#FFB547', '#FFE15A', '#6FD38A', '#6DB8F7', '#B18CF0'].map((c, i) => `<path d="M${x - 16 + i * 2} ${y + 4} A${16 - i * 2} ${16 - i * 2} 0 0 1 ${x + 16 - i * 2} ${y + 4}" stroke="${c}" stroke-width="2.4" fill="none"/>`).join('')}</g>`;
  }
  return `<path d="${starPath(x, y, 13)}" fill="#FFD36E" stroke="#F2B53A" stroke-width="1.5"/>`;
}

/* ---------- mantel ---------- */
// de leerlingenmantel krijgt de kleur en het teken dat je zelf kiest
const robeCol = L => L.outfit === 'paars' ? ROBECOLS[L.robeColor || 0] : (ITEM['outfit:' + L.outfit] || ITEMS.outfit[0]).c;
function robeSVG(L) {
  const it = ITEM['outfit:' + L.outfit] || ITEMS.outfit[0];
  const c = robeCol(L), t = it.t;
  let emb = '';
  const e = L.outfit === 'paars' ? ({ ster: 'ster', maan: 'maan', zon: 'zon', zee: 'golf' })[L.teken] || 'ster' : it.e;
  switch (e) {
    case 'golf': emb = `<path d="M86 194 q4 -6 8 0 t8 0 t8 0 M86 201 q4 -6 8 0 t8 0 t8 0" stroke="${t}" stroke-width="3" fill="none" stroke-linecap="round"/>`; break;
    case 'ster': emb = `<path d="${starPath(100, 192, 9)}" fill="${t}"/>`; break;
    case 'hart': emb = `<path d="${heartPath(100, 192, 1.4)}" fill="${t}"/>`; break;
    case 'maan': emb = `<path d="M104 182 A10 10 0 1 0 104 202 A7.5 7.5 0 1 1 104 182Z" fill="${t}"/>`; break;
    case 'blad': emb = `<path d="M92 200 Q92 184 110 182 Q110 198 92 200Z" fill="${t}"/>`; break;
    case 'zon': emb = `<circle cx="100" cy="192" r="7" fill="${t}"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="100" y1="181" x2="100" y2="177" stroke="${t}" stroke-width="2.5" transform="rotate(${a} 100 192)"/>`).join(''); break;
    case 'vlag': emb = `<rect x="60" y="206" width="80" height="7" fill="${t}"/><path d="${starPath(86, 186, 5)}" fill="#fff"/><path d="${starPath(100, 178, 6.5)}" fill="#fff"/>`; break;
    case 'confetti': emb = [[80, 180, '#FFE15A'], [112, 186, '#7FE3F0'], [94, 204, '#FFE15A'], [120, 210, '#fff'], [76, 214, '#7FE3F0']].map(([x, y, cc]) => `<rect x="${x}" y="${y}" width="5" height="5" fill="${cc}" transform="rotate(30 ${x} ${y})"/>`).join(''); break;
    case 'pailletten': emb = [[78, 178, '#FFD21F'], [96, 184, '#4FC8A4'], [116, 178, '#fff'], [84, 198, '#4D6BDB'], [108, 200, '#FFD21F'], [124, 214, '#4FC8A4'], [72, 212, '#fff'], [98, 216, '#B18CF0']].map(([x, y, cc]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${cc}"/>`).join(''); break;
    case 'sterren': emb = [[84, 182, 4], [112, 178, 5], [100, 200, 6], [76, 210, 3.5], [124, 206, 4]].map(([x, y, r]) => `<path d="${starPath(x, y, r)}" fill="${t}"/>`).join(''); break;
  }
  return `<path d="M70 158 Q100 146 130 158 L148 228 Q100 240 52 228Z" fill="${c}"/>
    <path d="M53 222 Q100 234 147 222 L148 228 Q100 240 52 228Z" fill="${t}" opacity=".9"/>
    <path d="M86 152 L100 170 L114 152Z" fill="${t}"/>${emb}`;
}

/* ---------- wenkbrauwen, bril, oorbellen, haarspeldjes ---------- */
function browSVG(id, c) {
  const one = x => {
    if (id === 'recht') return `<path d="M${x - 10} 84 L${x + 10} 83" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`;
    if (id === 'boog') return `<path d="M${x - 11} 86 Q${x} 74 ${x + 11} 84" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return `<path d="M${x - 10} 86 Q${x} 79 ${x + 10} 85" stroke="${c}" stroke-width="${id === 'dik' ? 5.5 : 3}" fill="none" stroke-linecap="round"/>`;
  };
  return `<g opacity=".92">${one(76)}${one(124)}</g>`;
}
function glassesSVG(id) {
  if (!id || id === 'geen') return '';
  const fr = '#3A2E5C', bridge = `<path d="M92 104 Q100 98 108 104" stroke="${fr}" stroke-width="3" fill="none"/>`;
  if (id === 'ster') return `<g fill="#fff" fill-opacity=".25" stroke="#F2B53A" stroke-width="3.5"><path d="${starPath(76, 106, 20, 11)}"/><path d="${starPath(124, 106, 20, 11)}"/></g>${bridge}`;
  if (id === 'hart') return `<g fill="#FF8FB8" fill-opacity=".25" stroke="#E85D9E" stroke-width="3.5"><path d="${heartPath(76, 108, 2.6)}"/><path d="${heartPath(124, 108, 2.6)}"/></g>${bridge}`;
  return `<g fill="#fff" fill-opacity=".2" stroke="${fr}" stroke-width="3.5"><circle cx="76" cy="106" r="17"/><circle cx="124" cy="106" r="17"/></g>${bridge}`;
}
function earSVG(id) {
  if (!id || id === 'geen') return '';
  const one = x => id === 'ring' ? `<circle cx="${x}" cy="118" r="5" fill="none" stroke="#F2B53A" stroke-width="2.4"/>`
    : id === 'ster' ? `<path d="${starPath(x, 118, 5.5)}" fill="#FFD36E"/>` : `<circle cx="${x}" cy="115" r="3.2" fill="#7FE3F0"/>`;
  return one(34) + one(166);
}
function clipSVG(id) {
  switch (id) {
    case 'strikjes': return [54, 146].map(x => `<g transform="translate(${x} 62)"><path d="M0 0 L-11 -7 Q-13 0 -11 7Z M0 0 L11 -7 Q13 0 11 7Z" fill="#FF6FA8"/><circle r="3.5" fill="#FF8FB8"/></g>`).join('');
    case 'sterren': return `<path d="${starPath(58, 64, 8)}" fill="#FFD36E"/><path d="${starPath(70, 52, 5)}" fill="#FFD36E"/>`;
    case 'bloem': return `<g transform="translate(150 66)">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="7" ry="11" cy="-8" fill="#FF4F6E" transform="rotate(${a})"/>`).join('')}<circle r="4" fill="#FFD36E"/></g>`;
    case 'haarband': return `<path d="M38 74 Q100 22 162 74" stroke="#58C9B9" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="148" cy="58" r="6" fill="#FFD36E"/>`;
    case 'hoofddoek': return `<path d="M34 86 C30 34 66 14 100 14 C134 14 170 34 166 86 C150 66 128 56 100 56 C72 56 50 66 34 86Z" fill="#E85D5D"/>
      <path d="M50 64 Q100 30 150 64" stroke="#FFD36E" stroke-width="4" fill="none" stroke-dasharray="2 7" stroke-linecap="round"/>
      <path d="M88 14 C76 -10 100 -14 100 6 C100 -14 124 -10 112 14Z" fill="#C94848"/>`;
  }
  return '';
}

/* ---------- het hele personage ---------- */
// look: zie DEFAULT_LOOK; mood: blij | lach | wow | oeps
let avatarN = 0;
function avatarSVG(look = DEFAULT_LOOK, mood = 'blij', cls = '') {
  const gid = 'rb' + (++avatarN);
  return avatarSVG0(look, mood, cls).replace(/id="(rb|tp)"/g, `id="$1${gid}"`).replace(/url\(#(rb|tp)\)/g, `url(#$1${gid})`);
}
function avatarSVG0(look, mood, cls) {
  const L = Object.assign({}, DEFAULT_LOOK, look), wink = mood === 'knipoog';
  if (wink) mood = 'blij';
  const skin = SKINS[L.skin] || SKINS[3], skinD = shade(skin, -.12);
  const H = HAIRCOLORS[L.hairColor] || HAIRCOLORS[0], eye = EYECOLORS[L.eyes] || EYECOLORS[0], tip = L.tips >= 0 ? HAIRCOLORS[L.tips] : '';
  const wandHand = mood === 'oeps' ? '' : `<g class="wand"><line x1="146" y1="196" x2="172" y2="150" stroke="#7A4E2D" stroke-width="5" stroke-linecap="round"/>${wandTip(L.wand, 174, 146)}</g>`;
  return `<svg class="avatar ${cls}" viewBox="0 -34 200 284" role="img" aria-label="Jouw tovenaarsleerling">
    <defs><linearGradient id="rb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF7A9C"/><stop offset=".33" stop-color="#FFC75A"/><stop offset=".66" stop-color="#6FD3B0"/><stop offset="1" stop-color="#7E8CF4"/></linearGradient>
      ${tip ? `<linearGradient id="tp" gradientUnits="userSpaceOnUse" x1="0" y1="90" x2="0" y2="230"><stop offset="0" stop-color="${tip}" stop-opacity="0"/><stop offset="1" stop-color="${tip}"/></linearGradient>` : ''}</defs>
    <ellipse cx="100" cy="242" rx="56" ry="7" fill="#000" opacity=".1"/>
    <g class="hair hair-b">${hairBack(L.hair, H)}${tip ? hairBack(L.hair, 'url(#tp)') : ''}</g>
    <rect x="86" y="214" width="11" height="22" rx="5" fill="${skinD}"/><rect x="103" y="214" width="11" height="22" rx="5" fill="${skinD}"/>
    <ellipse cx="90" cy="238" rx="10" ry="6" fill="#5B47C9"/><ellipse cx="110" cy="238" rx="10" ry="6" fill="#5B47C9"/>
    ${robeSVG(L)}
    <ellipse cx="62" cy="186" rx="9" ry="20" fill="${robeCol(L)}" transform="rotate(18 62 186)"/>
    <circle cx="56" cy="204" r="8" fill="${skin}"/>
    <ellipse cx="140" cy="180" rx="9" ry="19" fill="${robeCol(L)}" transform="rotate(-30 140 180)"/>
    ${wandHand}<circle cx="146" cy="196" r="8" fill="${skin}"/>
    <rect x="92" y="140" width="16" height="16" rx="6" fill="${skinD}"/>
    <circle cx="36" cy="104" r="10" fill="${skin}"/><circle cx="164" cy="104" r="10" fill="${skin}"/>${earSVG(L.oorbel)}
    <ellipse cx="100" cy="94" rx="64" ry="60" fill="${skin}"/>
    ${blush(64, 136, 122, 1, [0, .38, .62][L.blush == null ? 1 : L.blush])}
    ${L.sproet ? [[58, 116], [66, 120], [62, 124], [134, 116], [142, 120], [138, 124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${shade(skin, -.35)}"/>`).join('') : ''}
    <g class="eyes">${animeEye(76, 106, eye, 1, mood, { shape: L.eyeShape, lashes: L.lashes })}${animeEye(124, 106, eye, 1, wink ? 'lach' : mood, { shape: L.eyeShape, lashes: L.lashes })}</g>
    ${mouth(100, 126, mood)}
    ${mood === 'oeps' ? `<path d="M156 66 q6 10 0 14 q-6 -4 0 -14Z" fill="#7FD3F7"/>` : ''}
    <g class="hair hair-f">${hairFront(L.hair, H)}</g>
    ${browSVG(L.brows, shade(H, -.2))}${glassesSVG(L.bril)}${clipSVG(L.clip)}
    ${hatSVG(L.hat)}
  </svg>`;
}

/* ---------- huisdieren (viewBox 100×100) ---------- */
function petSVG(id, cls = '') {
  const E = (x, y, c = '#2B2140', s = .55) => animeEye(x, y, c, s);
  let b = '';
  switch (id) {
    case 'kat': b = `<path d="M24 40 L26 12 L44 28Z M76 40 L74 12 L56 28Z" fill="#9D7CF2"/><path d="M28 34 L29 18 L40 28Z M72 34 L71 18 L60 28Z" fill="#FFB3D1"/>
      <path d="M78 78 Q98 70 92 50" stroke="#9D7CF2" stroke-width="8" fill="none" stroke-linecap="round"/>
      <ellipse cx="50" cy="76" rx="26" ry="18" fill="#9D7CF2"/><ellipse cx="50" cy="44" rx="28" ry="24" fill="#AE90F5"/>
      <path d="${starPath(50, 28, 6)}" fill="#FFD36E"/>${E(39, 46)}${E(61, 46)}<path d="M47 56 q3 3 6 0" stroke="#2B2140" stroke-width="2" fill="none"/>${blush(32, 68, 54, .55)}`; break;
    case 'flamingo': b = `<line x1="48" y1="70" x2="46" y2="96" stroke="#F06C9B" stroke-width="3"/><line x1="56" y1="70" x2="62" y2="84" stroke="#F06C9B" stroke-width="3"/>
      <ellipse cx="54" cy="64" rx="22" ry="14" fill="#FF8FB8"/><path d="M44 58 Q30 40 40 26" stroke="#FF8FB8" stroke-width="9" fill="none" stroke-linecap="round"/>
      <circle cx="44" cy="22" r="14" fill="#FF9EC4"/><path d="M54 22 Q66 24 64 34 L58 30Z" fill="#2B2140"/><path d="M54 22 Q62 22 62 28 L56 27Z" fill="#fff"/>${E(42, 20)}${blush(34, 50, 28, .45)}`; break;
    case 'leguaan': b = `<path d="M70 76 Q96 80 96 60" stroke="#6FC46A" stroke-width="7" fill="none" stroke-linecap="round"/>
      <ellipse cx="52" cy="72" rx="28" ry="15" fill="#6FC46A"/><path d="M30 60 l5 -8 l5 8 l5 -8 l5 8 l5 -8 l5 8" fill="#4FA14C"/>
      <ellipse cx="36" cy="50" rx="24" ry="18" fill="#7FD37A"/><ellipse cx="34" cy="64" rx="7" ry="5" fill="#FF9EC4"/>${E(28, 46)}${E(46, 46)}${blush(20, 52, 56, .45)}
      <rect x="34" y="82" width="6" height="10" rx="3" fill="#4FA14C"/><rect x="62" y="82" width="6" height="10" rx="3" fill="#4FA14C"/>`; break;
    case 'uil': b = `<path d="M26 30 L32 12 L44 24Z M74 30 L68 12 L56 24Z" fill="#B88A5A"/><ellipse cx="50" cy="56" rx="30" ry="34" fill="#C99A68"/><ellipse cx="50" cy="68" rx="18" ry="18" fill="#F3E2C8"/>
      <circle cx="38" cy="44" r="12" fill="#fff"/><circle cx="62" cy="44" r="12" fill="#fff"/>${E(38, 45, '#5B3A29', .6)}${E(62, 45, '#5B3A29', .6)}<path d="M46 54 L54 54 L50 61Z" fill="#FFB547"/>`; break;
    case 'wolk': b = `<g fill="#fff" stroke="#D6E4FF" stroke-width="2"><circle cx="30" cy="58" r="18"/><circle cx="52" cy="46" r="24"/><circle cx="74" cy="58" r="18"/><rect x="28" y="56" width="48" height="20" rx="10"/></g>
      ${E(42, 56, '#5B7CF0')}${E(62, 56, '#5B7CF0')}<path d="M48 66 q4 4 8 0" stroke="#2B2140" stroke-width="2" fill="none"/>${blush(34, 70, 64, .5)}
      <path d="M36 84 l-3 8 M52 86 l-3 8 M68 84 l-3 8" stroke="#7FB8FF" stroke-width="3" stroke-linecap="round"/>`; break;
    case 'schildpad': b = `<ellipse cx="22" cy="66" rx="12" ry="10" fill="#8FD18A"/>${E(19, 63, '#2B2140', .45)}<path d="M18 70 q3 2 6 0" stroke="#2B2140" stroke-width="1.6" fill="none"/>
      <ellipse cx="34" cy="82" rx="7" ry="5" fill="#8FD18A"/><ellipse cx="72" cy="82" rx="7" ry="5" fill="#8FD18A"/>
      <path d="M30 76 Q32 40 58 40 Q86 40 86 76Z" fill="#3FA77B"/><path d="M44 50 L58 46 L72 50 L74 64 L58 70 L42 64Z" fill="#5CC496" stroke="#2E8A62" stroke-width="2"/><path d="M30 76 L86 76" stroke="#2E8A62" stroke-width="3"/>`; break;
    case 'eenhoorn': b = `<path d="M46 20 L52 -2 L58 20Z" fill="#FFD36E"/><path d="M28 32 Q22 14 36 18 Z" fill="#fff"/>
      <ellipse cx="54" cy="74" rx="26" ry="17" fill="#fff" stroke="#EADFFF" stroke-width="2"/><ellipse cx="50" cy="42" rx="26" ry="23" fill="#fff" stroke="#EADFFF" stroke-width="2"/>
      <path d="M68 24 Q90 30 82 54 Q78 40 70 38 Q76 50 72 62 Q66 46 62 40Z" fill="#FF8FB8"/><path d="M74 30 Q88 38 84 50" stroke="#7E8CF4" stroke-width="4" fill="none"/>
      ${E(40, 44)}${E(58, 44)}${blush(32, 64, 54, .5)}<path d="M46 56 q3 3 6 0" stroke="#2B2140" stroke-width="2" fill="none"/>`; break;
    case 'draak': b = `<path d="M74 70 Q96 70 92 50 L86 56" stroke="#FF8A5C" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M24 52 Q8 40 14 26 Q24 38 32 42Z M76 52 Q92 40 86 26 Q76 38 68 42Z" fill="#FFC27A"/>
      <ellipse cx="50" cy="74" rx="24" ry="17" fill="#FF8A5C"/><ellipse cx="50" cy="78" rx="13" ry="10" fill="#FFE0B0"/>
      <ellipse cx="50" cy="44" rx="26" ry="23" fill="#FF9C6E"/><path d="M38 24 L36 12 L44 22Z M62 24 L64 12 L56 22Z" fill="#FFD36E"/>
      ${E(40, 46)}${E(60, 46)}<path d="M46 57 q4 3 8 0" stroke="#2B2140" stroke-width="2" fill="none"/>${blush(32, 68, 55, .5)}`; break;
    default: return `<svg class="pet ${cls}" viewBox="0 0 100 100" aria-hidden="true"><text x="50" y="62" text-anchor="middle" font-size="34" opacity=".3">?</text></svg>`;
  }
  return `<svg class="pet ${cls}" viewBox="0 -4 100 104" role="img" aria-label="Huisdier"><ellipse cx="50" cy="96" rx="30" ry="4" fill="#000" opacity=".1"/>${b}</svg>`;
}

/* ---------- Pip, het sterrendraakje (de gids) ----------
   Stemmingen: blij, lach (juichen), oeps (nadenken, nooit verdrietig) en slaap.
   Vleugels, staart en ogen hebben eigen klassen, zodat ze kunnen bewegen. */
const PIP_STAR = 'M0 -11 L3 -3 L11 0 L3 3 L0 11 L-3 3 L-11 0 L-3 -3Z';
function pipSVG(mood = 'blij', cls = '') {
  const M = mood, has = (...a) => a.includes(M);
  const closed = has('lach', 'trots', 'dans'), look = has('oeps', 'zweet');
  const eyes = closed ? `<path d="M66 112 Q78 94 90 112 M110 112 Q122 94 134 112" fill="none" stroke="#2B2147" stroke-width="5" stroke-linecap="round"/>`
    : M === 'slaap' ? `<path d="M66 114 Q78 124 90 114 M110 114 Q122 124 134 114" fill="none" stroke="#2B2147" stroke-width="5" stroke-linecap="round"/>`
    : M === 'wow' ? `<g fill="#FFD86B" stroke="#2B2147" stroke-width="2">${[78, 122].map(x => `<path transform="translate(${x} 110) scale(1.3)" d="${PIP_STAR}"/>`).join('')}</g>`
    : M === 'hart' ? `<g fill="#FF5E8E">${[78, 122].map(x => `<path d="${heartPath(x, 104, 1.5)}"/>`).join('')}</g>`
    : M === 'cool' ? `<g><path d="M60 100 h36 q0 18 -18 18 q-18 0 -18 -18Z M104 100 h36 q0 18 -18 18 q-18 0 -18 -18Z" fill="#2B2147"/><path d="M96 103 h8" stroke="#2B2147" stroke-width="4"/><path d="M66 105 h9 M110 105 h9" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>`
    : `<g class="pip-eyes"><ellipse cx="78" cy="110" rx="11" ry="13" fill="#2B2147"/><ellipse cx="122" cy="110" rx="11" ry="13" fill="#2B2147"/>
       <circle cx="${look ? 74 : 82}" cy="${look ? 104 : 105}" r="4.6" fill="#fff"/><circle cx="${look ? 118 : 126}" cy="${look ? 104 : 105}" r="4.6" fill="#fff"/>${look ? '' : '<circle cx="75" cy="115" r="2" fill="#fff"/><circle cx="119" cy="115" r="2" fill="#fff"/>'}</g>`;
  const smile = `<path d="M82 126 Q100 156 118 126Z" fill="#5B1F3A"/><path d="M90 143 Q100 135 110 143 Q100 152 90 143Z" fill="#FF6F91"/>`;
  const mouthP = has('lach', 'trots', 'dans', 'hart', 'zwaai') ? smile
    : M === 'wow' ? `<ellipse cx="100" cy="136" rx="9" ry="11" fill="#5B1F3A"/><ellipse cx="100" cy="141" rx="5" ry="4" fill="#FF6F91"/>`
    : M === 'cool' ? `<path d="M88 132 Q102 142 114 128" fill="none" stroke="#2B2147" stroke-width="4" stroke-linecap="round"/>`
    : M === 'oeps' ? `<path d="M92 132 Q100 128 110 134" fill="none" stroke="#2B2147" stroke-width="4" stroke-linecap="round"/>`
    : M === 'zweet' ? `<path d="M86 134 q4 -5 8 0 t8 0 t8 0" fill="none" stroke="#2B2147" stroke-width="4" stroke-linecap="round"/>`
    : M === 'slaap' ? `<ellipse cx="100" cy="132" rx="6" ry="5" fill="#5B3FC0"/>`
    : `<path d="M90 130 Q100 140 110 130" fill="none" stroke="#2B2147" stroke-width="4" stroke-linecap="round"/>`;
  const armL = `<ellipse cx="42" cy="140" rx="9" ry="13" fill="#7A55EE" transform="rotate(22 42 140)"/>`;
  const arms = has('lach', 'wow', 'dans') ? `<ellipse cx="28" cy="82" rx="10" ry="15" fill="#7A55EE" transform="rotate(-28 28 82)"/><ellipse cx="172" cy="82" rx="10" ry="15" fill="#7A55EE" transform="rotate(28 172 82)"/>`
    : M === 'zwaai' ? `${armL}<g class="pip-wave"><ellipse cx="170" cy="80" rx="10" ry="15" fill="#7A55EE" transform="rotate(32 170 80)"/></g>`
    : look ? `${armL}<ellipse cx="146" cy="128" rx="9" ry="13" fill="#7A55EE" transform="rotate(-60 146 128)"/>`
    : `${armL}<ellipse cx="158" cy="140" rx="9" ry="13" fill="#7A55EE" transform="rotate(-22 158 140)"/>`;
  const stars = `<g fill="#FFD86B">${[[22, 30, 1], [180, 34, 1], [100, 12, .7], [8, 110, .6], [192, 112, .6]].map(([x, y, s]) => `<path transform="translate(${x} ${y}) scale(${s})" d="${PIP_STAR}"/>`).join('')}</g>`;
  const extra = has('lach', 'trots') ? stars
    : M === 'dans' ? `<g fill="#FFD86B"><circle cx="24" cy="56" r="6"/><rect x="28" y="28" width="3.4" height="28"/><circle cx="174" cy="44" r="6"/><rect x="178" y="16" width="3.4" height="28"/></g>`
    : M === 'hart' ? `<g fill="#FF8FB8">${[[26, 50, 1], [176, 40, 1.2], [160, 14, .8]].map(([x, y, s]) => `<path d="${heartPath(x, y, s)}"/>`).join('')}</g>`
    : M === 'wow' ? `<g fill="#FFD86B">${[[26, 40, .7], [176, 36, .8]].map(([x, y, s]) => `<path transform="translate(${x} ${y}) scale(${s})" d="${PIP_STAR}"/>`).join('')}</g>`
    : M === 'cool' ? `<path transform="translate(140 94) scale(.6)" d="${PIP_STAR}" fill="#fff"/>`
    : M === 'zweet' ? `<path d="M152 64 q7 11 0 16 q-7 -5 0 -16Z" fill="#7FD3F7"/>`
    : M === 'oeps' ? `<path d="M66 92 Q78 84 90 92 M110 88 Q122 78 134 90" fill="none" stroke="#5B3FC0" stroke-width="4" stroke-linecap="round"/><g fill="#fff" stroke="#CDBBFF" stroke-width="2"><circle cx="150" cy="58" r="5"/><circle cx="163" cy="42" r="7"/><circle cx="180" cy="22" r="10"/></g>`
    : M === 'slaap' ? `<g fill="none" stroke="#FFD86B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M142 46 h20 l-20 22 h20"/><path d="M170 18 h13 l-13 15 h13"/></g>` : '';
  return `<svg class="pip mood-${mood} ${cls}" viewBox="0 0 200 200" role="img" aria-label="Pip het draakje">
    <ellipse cx="100" cy="188" rx="54" ry="8" fill="#000" opacity=".12"/>
    <path class="pip-wl" d="M46 98 Q8 70 16 36 Q46 50 64 84Z" fill="#B79CFF"/><path class="pip-wr" d="M154 98 Q192 70 184 36 Q154 50 136 84Z" fill="#B79CFF"/>
    <g class="pip-tail"><path d="M150 160 Q194 164 186 124 Q176 146 148 142Z" fill="#7A55EE"/><path d="M186 124 L198 112 L200 130Z" fill="#FFD86B"/></g>
    <ellipse cx="72" cy="178" rx="18" ry="10" fill="#7A55EE"/><ellipse cx="128" cy="178" rx="18" ry="10" fill="#7A55EE"/>
    <ellipse cx="100" cy="118" rx="60" ry="62" fill="#8E6BFF"/><ellipse cx="100" cy="146" rx="36" ry="30" fill="#E9DEFF"/>
    <path d="M80 140 h40 M82 152 h36" stroke="#CDBBFF" stroke-width="3" stroke-linecap="round"/>
    <path d="M62 72 L56 32 L84 58Z M138 72 L144 32 L116 58Z" fill="#FFD86B"/><path d="M90 58 L100 40 L110 58Z" fill="#FFB800"/>
    <ellipse cx="72" cy="88" rx="14" ry="8" fill="#fff" opacity=".28" transform="rotate(-30 72 88)"/>
    ${eyes}<ellipse cx="58" cy="128" rx="9" ry="6" fill="#FF9EC0" opacity=".8"/><ellipse cx="142" cy="128" rx="9" ry="6" fill="#FF9EC0" opacity=".8"/>
    ${closed || M === 'slaap' ? '' : '<circle cx="95" cy="123" r="1.6" fill="#5B3FC0"/><circle cx="105" cy="123" r="1.6" fill="#5B3FC0"/>'}<g class="pip-mouth">${mouthP}</g>${arms}${extra}
  </svg>`;
}
// alle stemmingen van Pip (afwisseling bij goede antwoorden)
const PIP_MOODS = ['blij', 'lach', 'oeps', 'slaap', 'wow', 'hart', 'cool', 'zwaai', 'trots', 'dans', 'zweet'];

/* ---------- de leraren ---------- */
function teacherSVG(id, cls = '') {
  if (id === 'uil') return `<svg class="teacher ${cls}" viewBox="0 0 120 130" role="img" aria-label="Professor Uilenbal">
    <ellipse cx="60" cy="124" rx="30" ry="4" fill="#000" opacity=".08"/>
    <ellipse cx="60" cy="76" rx="40" ry="44" fill="#7C5CD6"/><path d="M22 80 Q14 96 30 108 Q28 92 34 82Z M98 80 Q106 96 90 108 Q92 92 86 82Z" fill="#6A4BC4"/>
    <ellipse cx="60" cy="94" rx="24" ry="22" fill="#EDE6FF"/>
    <circle cx="44" cy="64" r="16" fill="#fff"/><circle cx="76" cy="64" r="16" fill="#fff"/>
    ${animeEye(44, 66, '#2E3A59', .72)}${animeEye(76, 66, '#2E3A59', .72)}
    <circle cx="44" cy="64" r="17" fill="none" stroke="#FFD36E" stroke-width="3"/><circle cx="76" cy="64" r="17" fill="none" stroke="#FFD36E" stroke-width="3"/><line x1="61" y1="64" x2="59" y2="64" stroke="#FFD36E" stroke-width="3"/>
    <polygon points="54,80 66,80 60,90" fill="#FFB547"/>
    <path d="M30 40 L62 -2 Q66 -6 70 -2 L92 40Z" fill="#3C2A6E"/><ellipse cx="60" cy="40" rx="38" ry="8" fill="#2E2058"/><path d="${starPath(66, 18, 6)}" fill="#FFD36E"/>
    <ellipse cx="50" cy="119" rx="7" ry="3.5" fill="#FFB547"/><ellipse cx="70" cy="119" rx="7" ry="3.5" fill="#FFB547"/></svg>`;
  if (id === 'inkie') return `<svg class="teacher ${cls}" viewBox="0 0 120 130" role="img" aria-label="Juf Inkie">
    <ellipse cx="60" cy="124" rx="34" ry="4" fill="#000" opacity=".08"/>
    ${[20, 36, 52, 68, 84, 100].map((x, i) => `<path d="M${x} 86 Q${x + (i % 2 ? 8 : -8)} 104 ${x + (i % 2 ? -4 : 4)} 120" stroke="#FF7FA8" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
    <ellipse cx="60" cy="60" rx="44" ry="40" fill="#FF8FB8"/><ellipse cx="44" cy="34" rx="10" ry="6" fill="#FFB3D1" opacity=".8"/>
    ${animeEye(44, 64, '#2B6FD6', .8)}${animeEye(76, 64, '#2B6FD6', .8)}
    <rect x="30" y="52" width="28" height="22" rx="8" fill="none" stroke="#5B47C9" stroke-width="3"/><rect x="62" y="52" width="28" height="22" rx="8" fill="none" stroke="#5B47C9" stroke-width="3"/><line x1="58" y1="60" x2="62" y2="60" stroke="#5B47C9" stroke-width="3"/>
    ${blush(30, 90, 80, .7)}${mouth(60, 84, 'blij', .8)}
    <path d="M100 98 L116 70" stroke="#5B47C9" stroke-width="6" stroke-linecap="round"/><path d="M114 72 L118 62 L120 72Z" fill="#2B2140"/>
    <path d="M86 26 Q96 10 110 16" stroke="#FFD36E" stroke-width="4" fill="none" stroke-linecap="round"/>${sparkle(110, 14, 6)}</svg>`;
  // Shon Yuana, de leguaan met strohoed
  return `<svg class="teacher ${cls}" viewBox="0 0 120 130" role="img" aria-label="Shon Yuana">
    <ellipse cx="60" cy="124" rx="34" ry="4" fill="#000" opacity=".08"/>
    <path d="M86 108 Q118 112 112 84" stroke="#5FBF5A" stroke-width="10" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="98" rx="30" ry="22" fill="#6FCB68"/><ellipse cx="60" cy="102" rx="18" ry="14" fill="#C9F0B8"/>
    <path d="M34 60 l6 -10 l6 10 l6 -10 l6 10 l6 -10 l6 10 l6 -10 l6 10" fill="#3F9F45"/>
    <ellipse cx="60" cy="66" rx="40" ry="30" fill="#7FD877"/><ellipse cx="60" cy="88" rx="12" ry="7" fill="#FF9EC4"/>
    ${animeEye(44, 66, '#7A4E2D', .74)}${animeEye(76, 66, '#7A4E2D', .74)}
    ${blush(30, 90, 80, .6)}${mouth(60, 80, 'lach', .7)}
    <ellipse cx="60" cy="40" rx="50" ry="10" fill="#F1CF7A"/><path d="M34 40 Q36 12 60 10 Q84 12 86 40Z" fill="#E9BF5C"/><path d="M34 34 Q60 26 86 34 L86 40 Q60 32 34 40Z" fill="#1E4FB8"/>
    <g transform="translate(78 30)">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="4" ry="7" cy="-5" fill="#FF4F6E" transform="rotate(${a})"/>`).join('')}<circle r="2.6" fill="#FFD36E"/></g>
    <ellipse cx="44" cy="120" rx="8" ry="4" fill="#5FBF5A"/><ellipse cx="76" cy="120" rx="8" ry="4" fill="#5FBF5A"/></svg>`;
}

/* ---------- plaatjes voor de schoolkaart ---------- */
function placeArt(id) {
  const A = {
    toren: `<rect x="34" y="34" width="32" height="54" rx="4" fill="#8B6CF0"/><path d="M28 36 L50 6 L72 36Z" fill="#5B47C9"/><rect x="44" y="64" width="12" height="24" rx="6" fill="#3C2A6E"/><circle cx="50" cy="48" r="7" fill="#FFE27A"/><text x="50" y="52" font-size="9" text-anchor="middle" fill="#5B47C9" font-weight="900">7</text>`,
    bieb: `<rect x="18" y="40" width="64" height="48" rx="6" fill="#FF8FB8"/><path d="M12 42 L50 16 L88 42Z" fill="#E85D9E"/>${[26, 38, 50, 62].map((x, i) => `<rect x="${x}" y="54" width="8" height="24" rx="2" fill="${['#FFE27A', '#7FE3F0', '#fff', '#B18CF0'][i]}"/>`).join('')}`,
    strand: `<rect x="0" y="66" width="100" height="26" fill="#FFE2A8"/><path d="M0 66 Q25 58 50 66 T100 66 V56 H0Z" fill="#5BC8F0"/><circle cx="78" cy="26" r="12" fill="#FFD36E"/><path d="M28 70 Q30 40 26 26" stroke="#9A6B3E" stroke-width="5" fill="none"/><path d="M26 26 Q10 22 6 32 M26 26 Q40 16 48 24 M26 26 Q22 12 12 12 M26 26 Q42 30 44 40" stroke="#4FB35A" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    kast: `<rect x="24" y="16" width="52" height="72" rx="6" fill="#C99A68"/><line x1="50" y1="20" x2="50" y2="84" stroke="#9A6B3E" stroke-width="3"/><circle cx="45" cy="52" r="3" fill="#FFD36E"/><circle cx="55" cy="52" r="3" fill="#FFD36E"/><path d="M60 10 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2Z" fill="#FFE27A"/>`,
    speel: `<rect x="16" y="34" width="68" height="52" rx="10" fill="#4FC8BA"/><circle cx="36" cy="60" r="10" fill="#fff"/><path d="M32 60 h8 M36 56 v8" stroke="#4FC8BA" stroke-width="3"/><circle cx="62" cy="54" r="5" fill="#FF8FB8"/><circle cx="70" cy="64" r="5" fill="#FFD36E"/><path d="${starPath(50, 22, 10)}" fill="#FFD36E"/>`,
    weide: `<rect x="0" y="62" width="100" height="30" rx="8" fill="#8BD88A"/><path d="M10 62 L10 44 L30 44 L30 62 M18 44 L20 34 L22 44" stroke="#9A6B3E" stroke-width="3" fill="none"/><circle cx="66" cy="54" r="12" fill="#9D7CF2"/><circle cx="62" cy="52" r="2" fill="#2B2140"/><circle cx="70" cy="52" r="2" fill="#2B2140"/><path d="M58 44 L60 36 L64 43Z M74 44 L72 36 L68 43Z" fill="#9D7CF2"/>`,
    zolder: `<path d="M10 80 L50 20 L90 80Z" fill="#FFB547"/><circle cx="50" cy="58" r="12" fill="#fff"/><path d="M44 56 q2 -3 4 0 M52 56 q2 -3 4 0 M44 62 q6 6 12 0" stroke="#2B2140" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    sterren: `<rect x="34" y="40" width="32" height="48" rx="4" fill="#3C2A6E"/><path d="M26 42 A24 24 0 0 1 74 42Z" fill="#5B47C9"/><rect x="52" y="24" width="26" height="8" rx="4" fill="#B18CF0" transform="rotate(-25 52 24)"/>${[[16, 16], [86, 14], [80, 36], [12, 44]].map(([x, y]) => `<path d="${starPath(x, y, 5)}" fill="#FFE27A"/>`).join('')}`,
    tuin: `<rect x="0" y="64" width="100" height="28" fill="#6FCB68"/>${[[20, 54, '#FF4F6E'], [44, 48, '#FFD36E'], [68, 54, '#FF8FB8'], [86, 50, '#B18CF0']].map(([x, y, c]) => `<line x1="${x}" y1="${y}" x2="${x}" y2="70" stroke="#3F9F45" stroke-width="3"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="2.6" fill="#FFF3C4"/>`).join('')}<path d="M40 20 a10 10 0 0 1 20 0 a10 10 0 0 1 -20 0" fill="#FFE27A" opacity=".6"/>`,
    feest: `<path d="M10 20 Q50 40 90 20" stroke="#B18CF0" stroke-width="2" fill="none"/>${[18, 34, 50, 66, 82].map((x, i) => `<path d="M${x - 6} ${24 + (i === 2 ? 6 : i % 2 ? 4 : 1)} l6 12 l6 -12Z" fill="${['#FF8FB8', '#FFD36E', '#7FE3F0', '#8BD88A', '#FF8A5C'][i]}"/>`).join('')}<circle cx="50" cy="66" r="18" fill="#FFD36E"/><path d="M40 62 q2 -3 4 0 M56 62 q2 -3 4 0 M42 70 q8 8 16 0" stroke="#2B2140" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
  };
  return `<svg viewBox="0 0 100 92" aria-hidden="true">${A[id] || ''}</svg>`;
}
const STARICO = (on = true) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path class="${on ? 's-on' : 's-off'}" d="M12 2.4l2.95 6 6.6.95-4.78 4.65 1.13 6.57L12 17.47l-5.9 3.1 1.13-6.57L2.45 9.35l6.6-.95z"/></svg>`;
