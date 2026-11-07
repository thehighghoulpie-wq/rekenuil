/* =====================================================================
   KLERENKAST 5.0: aparte kledingstukken (shirt, broek, schoenen, handschoenen,
   sjaal en gezichtsspul), plus nieuwe hoeden, brillen, kapsels en ogen.
   Inspiratie: streetwear en techwear. Alles is zelf getekend, niets gekopieerd.
   Laadt na art.js en voor editor2.js.
   ===================================================================== */

const tn = (nl, en) => [nl, nl, en];   // Papiamentse namen staan nog niet vast: in het Papiamentu blijft de Nederlandse naam staan (needs family check)

/* ---------- bovenstukken ---------- */
const BODYP = y => `M70 158 Q100 146 130 158 L137 ${y} Q100 ${y + 8} 63 ${y}Z`;
const NECKL = (d, w = 4) => `<path d="M85 153 Q100 172 115 153" stroke="${d}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
const TOPS = {
  tee: { n: tn('T-shirt', 'T-shirt'), c: '#4FA3F0', t: '#FFFFFF', sl: 'kort', f: (c, t, d) => `<path d="${BODYP(208)}" fill="${c}"/>${NECKL(d)}<path d="M84 190 q16 6 32 0" stroke="${d}" stroke-width="2" fill="none" opacity=".35"/>` },
  hoodie: { n: tn('Hoodie', 'Hoodie'), c: '#6B5BD6', t: '#FFD36E', sl: 'lang', f: (c, t, d) => `<path d="${BODYP(210)}" fill="${c}"/><path d="M70 156 Q100 180 130 156 Q122 146 100 146 Q78 146 70 156Z" fill="${d}"/><path d="M92 166 L90 188 M108 166 L110 188" stroke="${t}" stroke-width="2.6" stroke-linecap="round"/><path d="M76 192 L124 192 L131 208 L69 208Z" fill="${d}" opacity=".55"/>` },
  crop: { n: tn('Cropped top', 'Cropped top'), c: '#FF7FB0', t: '#FFFFFF', sl: 'kort', f: (c, t, d) => `<path d="M70 158 Q100 146 130 158 L134 186 Q100 194 66 186Z" fill="${c}"/>${NECKL(d)}<path d="M72 186 Q100 194 128 186" stroke="${t}" stroke-width="3" fill="none"/>` },
  tank: { n: tn('Hemdje', 'Tank top'), c: '#FFD36E', t: '#FFFFFF', sl: 'geen', f: (c, t, d) => `<path d="M78 157 L86 148 L92 152 Q100 166 108 152 L114 148 L122 157 L134 208 Q100 216 66 208Z" fill="${c}"/><path d="M72 196 Q100 204 128 196" stroke="${t}" stroke-width="3" fill="none"/>` },
  jersey: { n: tn('Sportshirt', 'Jersey'), c: '#E8402A', t: '#FFFFFF', sl: 'kort', f: (c, t, d) => `<path d="${BODYP(208)}" fill="${c}"/><path d="M70 160 L64 206 M130 160 L136 206" stroke="${t}" stroke-width="4"/>${NECKL(t)}<text x="100" y="196" font-size="22" text-anchor="middle" font-weight="900" font-family="sans-serif" fill="${t}">9</text>` },
  bomber: { n: tn('Bomberjack', 'Bomber jacket'), c: '#3F6B4A', t: '#FF8A3D', sl: 'lang', f: (c, t, d) => `<path d="${BODYP(210)}" fill="${c}"/><path d="M64 204 Q100 214 136 204 L137 210 Q100 218 63 210Z" fill="${d}"/><path d="M100 152 L100 210" stroke="${t}" stroke-width="3"/><path d="M80 156 Q100 170 120 156 L120 148 Q100 144 80 148Z" fill="${d}"/><path d="M86 154 Q100 164 114 154" stroke="${t}" stroke-width="2.4" fill="none"/><rect x="108" y="178" width="14" height="3" rx="1.5" fill="${t}"/>` },
  puffer: { n: tn('Pufferjas', 'Puffer jacket'), c: '#2F6BDB', t: '#9CC4FF', sl: 'lang', f: (c, t, d) => `<path d="M66 158 Q100 144 134 158 L142 212 Q100 222 58 212Z" fill="${c}"/><path d="M62 172 Q100 180 138 172 M60 188 Q100 196 140 188 M59 202 Q100 210 141 202" stroke="${d}" stroke-width="2.4" fill="none"/><path d="M82 154 Q100 164 118 154 L118 146 Q100 142 82 146Z" fill="${d}"/><path d="M100 160 L100 212" stroke="${t}" stroke-width="2.4"/>` },
  techvest: { n: tn('Techvest', 'Tech vest'), c: '#4A4F5C', t: '#22252E', sl: 'lang', f: (c, t, d) => `<path d="${BODYP(208)}" fill="${c}"/><path d="M71 158 L88 150 L94 208 L64 208Z M129 158 L112 150 L106 208 L136 208Z" fill="${t}"/><path d="M68 178 L130 196 M132 178 L70 196" stroke="${shade(t, .25)}" stroke-width="3"/><rect x="95" y="186" width="10" height="8" rx="2" fill="#FFD21F"/><rect x="70" y="182" width="16" height="12" rx="2" fill="${shade(t, .18)}"/><rect x="114" y="182" width="16" height="12" rx="2" fill="${shade(t, .18)}"/><circle cx="78" cy="188" r="1.8" fill="#FFD21F"/><circle cx="122" cy="188" r="1.8" fill="#FFD21F"/>` },
  polo: { n: tn('Poloshirt', 'Polo shirt'), c: '#58C9B9', t: '#FFFFFF', sl: 'kort', f: (c, t, d) => `<path d="${BODYP(208)}" fill="${c}"/><path d="M82 150 L100 168 L90 156Z M118 150 L100 168 L110 156Z" fill="${t}" stroke="${d}" stroke-width="1.2"/><path d="M100 168 L100 186" stroke="${d}" stroke-width="2"/><circle cx="100" cy="174" r="1.8" fill="${t}"/><circle cx="100" cy="182" r="1.8" fill="${t}"/>` },
  hawaii: { n: tn('Eilandshemd', 'Island shirt'), c: '#2FA7A0', t: '#FF8FB8', sl: 'kort', f: (c, t, d) => `<path d="${BODYP(208)}" fill="${c}"/><path d="M100 160 L100 208" stroke="${d}" stroke-width="2"/><path d="M82 150 L98 170 L88 154Z M118 150 L102 170 L112 154Z" fill="${shade(c, .3)}"/>${[[80, 180], [118, 176], [88, 198], [114, 200], [100, 188]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="3" ry="5" cy="-4" fill="${i % 2 ? t : '#FFE15A'}" transform="rotate(${a})"/>`).join('')}</g>`).join('')}` },
  matroos: { n: tn('Matrozentrui', 'Sailor tee'), c: '#FFFFFF', t: '#1E3A8A', sl: 'kort', f: (c, t, d) => `<path d="${BODYP(208)}" fill="${c}"/>${[168, 178, 188, 198].map(y => `<path d="M${68 + (y - 168) * .2} ${y} Q100 ${y + 8} ${132 - (y - 168) * .2} ${y}" stroke="${t}" stroke-width="4" fill="none"/>`).join('')}<path d="M84 153 Q100 164 116 153" stroke="${t}" stroke-width="3" fill="none"/>` },
  gilet: { n: tn('Bodywarmer', 'Gilet'), c: '#FFB547', t: '#FFFFFF', sl: 'kort', slc: 't', f: (c, t, d) => `<path d="${BODYP(208)}" fill="${t}"/><path d="M72 158 L90 150 L94 208 L66 208Z M128 158 L110 150 L106 208 L134 208Z" fill="${c}"/><path d="M68 178 L93 180 M67 194 L93 196 M132 178 L107 180 M133 194 L107 196" stroke="${d}" stroke-width="2.4"/><path d="M92 152 L92 208 M108 152 L108 208" stroke="${d}" stroke-width="2"/>` },
  labjas: { n: tn('Laboratoriumjas', 'Lab coat'), c: '#FFFFFF', t: '#58C9B9', sl: 'lang', f: (c, t, d) => `<path d="M68 158 Q100 146 132 158 L142 226 Q100 236 58 226Z" fill="${c}"/><path d="M100 160 L100 230" stroke="#CFD6E4" stroke-width="2"/><path d="M84 152 L100 186 L90 156Z M116 152 L100 186 L110 156Z" fill="#EEF1F8" stroke="#CFD6E4" stroke-width="1.4"/><rect x="72" y="200" width="20" height="14" rx="2" fill="none" stroke="#CFD6E4" stroke-width="2"/><rect x="110" y="170" width="14" height="8" rx="2" fill="${t}"/><circle cx="76" cy="206" r="2" fill="${t}"/>` },
  trui: { n: tn('Gebreide trui', 'Knit jumper'), c: '#E85D5D', t: '#FFE9B8', sl: 'lang', f: (c, t, d) => `<path d="${BODYP(210)}" fill="${c}"/><path d="M80 148 Q100 140 120 148 L118 160 Q100 168 82 160Z" fill="${d}"/><path d="M64 186 ${'l5 -7 l5 7 '.repeat(7)}" stroke="${t}" stroke-width="2.4" fill="none"/><path d="M64 196 ${'l5 7 l5 -7 '.repeat(7)}" stroke="${t}" stroke-width="2.4" fill="none"/><path d="M64 208 Q100 218 136 208" stroke="${d}" stroke-width="4" fill="none"/>` }
};
/* ---------- onderstukken ---------- */
const LEGP = (c, y2, wx = 0, ty = 0) => `<rect x="${84 - wx}" y="198" width="${15.5 + wx}" height="${y2 - 198}" rx="6" fill="${c}"/><rect x="100.5" y="198" width="${15.5 + wx}" height="${y2 - 198}" rx="6" fill="${c}"/>`;
const WAIST = (c, h = 7) => `<path d="M64 198 Q100 206 136 198 L137 ${198 + h} Q100 ${207 + h} 63 ${198 + h}Z" fill="${c}"/>`;
const BOTTOMS = {
  shorts: { n: tn('Korte broek', 'Shorts'), c: '#3B82C4', f: (c, d, l) => `${LEGP(c, 216, 2)}${WAIST(d)}<path d="M100 206 L100 214" stroke="${d}" stroke-width="2"/>` },
  jeans: { n: tn('Spijkerbroek', 'Jeans'), c: '#3A5BA8', f: (c, d, l) => `${LEGP(c, 232, 1)}${WAIST(d)}<path d="M91 208 L90 230 M109 208 L110 230" stroke="${l}" stroke-width="1.6" stroke-dasharray="3 2.5" fill="none" opacity=".8"/><path d="M80 208 q6 4 12 0" stroke="${l}" stroke-width="1.6" fill="none"/>` },
  cargo: { n: tn('Cargobroek', 'Cargo pants'), c: '#6B7A4B', f: (c, d, l) => `${LEGP(c, 232, 3)}${WAIST(d)}<rect x="75" y="212" width="12" height="11" rx="2" fill="${d}"/><rect x="113" y="212" width="12" height="11" rx="2" fill="${d}"/><path d="M75 216 L87 216 M113 216 L125 216" stroke="${l}" stroke-width="1.6"/><path d="M82 226 L96 224 M118 226 L104 224" stroke="#2B2D36" stroke-width="2.6" stroke-linecap="round"/>` },
  rok: { n: tn('Rokje', 'Skirt'), c: '#E85D9E', f: (c, d, l) => `<path d="M68 198 Q100 206 132 198 L146 226 Q100 238 54 226Z" fill="${c}"/>${WAIST(d, 5)}<path d="M84 210 L74 228 M100 212 L100 232 M116 210 L126 228" stroke="${d}" stroke-width="1.8" opacity=".5"/>` },
  plooirok: { n: tn('Plooirok', 'Pleated skirt'), c: '#2A2366', f: (c, d, l) => `<path d="M68 198 Q100 206 132 198 L144 222 Q100 232 56 222Z" fill="${c}"/>${WAIST(d, 5)}${[-36, -24, -12, 0, 12, 24, 36].map(x => `<path d="M${100 + x * .5} 208 L${100 + x * 1.2} 226" stroke="${l}" stroke-width="1.4" opacity=".7"/>`).join('')}<path d="M57 218 Q100 228 143 218" stroke="#FFD36E" stroke-width="2.6" fill="none"/>` },
  joggers: { n: tn('Joggingbroek', 'Joggers'), c: '#555B6E', f: (c, d, l) => `${LEGP(c, 230, 1)}${WAIST(d, 8)}<path d="M96 206 L94 216 M104 206 L106 216" stroke="${l}" stroke-width="2" stroke-linecap="round"/><rect x="83" y="226" width="16" height="6" rx="3" fill="${d}"/><rect x="101" y="226" width="16" height="6" rx="3" fill="${d}"/><path d="M85 210 L84 224 M115 210 L116 224" stroke="#fff" stroke-width="2" opacity=".5"/>` },
  tech: { n: tn('Techbroek', 'Tech pants'), c: '#2B2D36', f: (c, d, l) => `${LEGP(c, 232, 0)}${WAIST(d)}<path d="M84 218 L99 224 M116 218 L101 224" stroke="#FFD21F" stroke-width="2.4"/><rect x="85" y="212" width="12" height="9" rx="2" fill="${l}" opacity=".7"/><rect x="103" y="212" width="12" height="9" rx="2" fill="${l}" opacity=".7"/><path d="M88 205 L88 214" stroke="#FFD21F" stroke-width="2"/><path d="M90 230 L98 230 M102 230 L110 230" stroke="#FFD21F" stroke-width="2" stroke-linecap="round"/><rect x="96" y="200" width="8" height="5" rx="1.5" fill="#FFD21F"/>` },
  legging: { n: tn('Legging', 'Leggings'), c: '#2B2147', f: (c, d, l) => `<rect x="86" y="198" width="12" height="36" rx="6" fill="${c}"/><rect x="102" y="198" width="12" height="36" rx="6" fill="${c}"/>${WAIST(d, 6)}<path d="M87 208 L87 232 M113 208 L113 232" stroke="#fff" stroke-width="2" opacity=".6"/>` },
  bermuda: { n: tn('Bermuda', 'Bermuda shorts'), c: '#C9A66B', f: (c, d, l) => `${LEGP(c, 224, 4)}${WAIST(d)}<path d="M82 222 L97 222 M103 222 L118 222" stroke="${d}" stroke-width="2.4"/><circle cx="82" cy="212" r="1.6" fill="${d}"/><circle cx="118" cy="212" r="1.6" fill="${d}"/>` },
  tuinbroek: { n: tn('Tuinbroek', 'Dungarees'), c: '#3A5BA8', f: (c, d, l) => `${LEGP(c, 232, 1)}${WAIST(d)}`, bib: (c, d, l) => `<path d="M82 178 L118 178 L122 204 L78 204Z" fill="${c}"/><path d="M84 178 L76 154 M116 178 L124 154" stroke="${c}" stroke-width="6" stroke-linecap="round"/><circle cx="84" cy="180" r="2.6" fill="#FFD21F"/><circle cx="116" cy="180" r="2.6" fill="#FFD21F"/><rect x="92" y="186" width="16" height="9" rx="2" fill="${d}"/>` }
};
/* ---------- schoenen (voet bij x = 90 of 110) ---------- */
const FOOT = (x, c, a) => `<path d="M${x - 11} 243 L${x - 11} 233 Q${x - 10} 227 ${x - 3} 228 L${x + 6} 228 Q${x + 13} 232 ${x + 12} 239 Q${x + 12} 243 ${x + 9} 243Z" fill="${c}"/><rect x="${x - 12}" y="239.5" width="25" height="4.5" rx="2" fill="${a || '#FFFFFF'}"/>`;
const SHOES = {
  sneaker: { n: tn('Sneakers', 'Sneakers'), c: '#FFFFFF', f: (x, c, d, skin) => `${FOOT(x, c)}<path d="M${x - 4} 229 L${x + 3} 233 M${x - 1} 228 L${x + 5} 231.5" stroke="${d}" stroke-width="1.4"/><path d="M${x - 11} 238 Q${x} 236 ${x + 12} 238" stroke="#E85D5D" stroke-width="2.4" fill="none"/>` },
  hoog: { n: tn('Hoge sneakers', 'High-tops'), c: '#E8402A', f: (c => (x, c2, d) => `<path d="M${x - 11} 243 L${x - 10} 218 L${x + 8} 218 L${x + 12} 232 Q${x + 13} 243 ${x + 9} 243Z" fill="${c2}"/><rect x="${x - 12}" y="239.5" width="25" height="4.5" rx="2" fill="#fff"/><circle cx="${x - 1}" cy="226" r="4.4" fill="#fff"/><path d="${starPath(x - 1, 226, 3.4)}" fill="${c2}"/><path d="M${x - 9} 220 L${x + 7} 220" stroke="#fff" stroke-width="2"/>`)() },
  laars: { n: tn('Laarsjes', 'Boots'), c: '#7A4E2D', f: (x, c, d) => `<path d="M${x - 11} 243 L${x - 10} 214 L${x + 8} 214 L${x + 8} 228 Q${x + 14} 232 ${x + 13} 240 Q${x + 12} 243 ${x + 9} 243Z" fill="${c}"/><rect x="${x - 11}" y="213" width="20" height="5" rx="2" fill="${d}"/><rect x="${x - 12}" y="239.5" width="26" height="4.5" rx="2" fill="${shade(c, -.45)}"/><path d="M${x - 5} 222 L${x + 4} 222 M${x - 5} 227 L${x + 4} 227" stroke="#FFD36E" stroke-width="1.6"/>` },
  sandaal: { n: tn('Sandalen', 'Sandals'), c: '#C99A68', f: (x, c, d, skin) => `<path d="M${x - 10} 238 Q${x} 234 ${x + 12} 238 Q${x + 13} 243 ${x + 9} 243 L${x - 10} 243Z" fill="${skin}"/><rect x="${x - 12}" y="242" width="25" height="3.4" rx="1.7" fill="${c}"/><path d="M${x - 9} 236 Q${x} 230 ${x + 10} 236 M${x - 7} 242 L${x - 7} 236 M${x + 7} 242 L${x + 7} 236" stroke="${c}" stroke-width="2.6" fill="none"/>` },
  slippers: { n: tn('Teenslippers', 'Flip-flops'), c: '#4FC8F0', f: (x, c, d, skin) => `<path d="M${x - 10} 238 Q${x} 234 ${x + 12} 238 Q${x + 13} 243 ${x + 9} 243 L${x - 10} 243Z" fill="${skin}"/><rect x="${x - 12}" y="242" width="25" height="3.4" rx="1.7" fill="${c}"/><path d="M${x + 6} 242 L${x} 233 M${x + 6} 242 L${x + 11} 236" stroke="${shade(c, -.2)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
  skate: { n: tn('Rolschaatsen', 'Roller skates'), c: '#FF8FB8', f: (x, c, d) => `<path d="M${x - 11} 238 L${x - 10} 222 L${x + 7} 222 L${x + 7} 230 Q${x + 13} 233 ${x + 12} 238Z" fill="${c}"/><rect x="${x - 12}" y="237" width="25" height="4" rx="2" fill="#fff"/><circle cx="${x - 7}" cy="244" r="3.4" fill="#FFD36E"/><circle cx="${x + 8}" cy="244" r="3.4" fill="#FFD36E"/><path d="M${x - 8} 226 L${x + 4} 226 M${x - 8} 231 L${x + 4} 231" stroke="#fff" stroke-width="1.6"/>` },
  techboot: { n: tn('Techschoenen', 'Tech boots'), c: '#2B2D36', f: (x, c, d) => `<path d="M${x - 11} 241 L${x - 10} 220 L${x + 8} 220 L${x + 9} 230 Q${x + 14} 233 ${x + 13} 239Z" fill="${c}"/><rect x="${x - 13}" y="237" width="27" height="8" rx="3" fill="#E4E7EE"/><rect x="${x - 13}" y="241" width="27" height="3" fill="#9CA3B5"/><path d="M${x - 10} 225 L${x + 8} 225 M${x - 10} 230 L${x + 8} 230" stroke="#FFD21F" stroke-width="2.2"/><rect x="${x - 3}" y="222" width="6" height="12" rx="2" fill="#FFD21F" opacity=".9"/>` },
  loafer: { n: tn('Nette schoenen', 'Loafers'), c: '#3A2A22', f: (x, c, d) => `<path d="M${x - 11} 243 L${x - 11} 235 Q${x - 8} 229 ${x - 2} 230 L${x + 4} 230 Q${x + 14} 233 ${x + 13} 240 Q${x + 12} 243 ${x + 9} 243Z" fill="${c}"/><rect x="${x - 12}" y="241" width="26" height="3" rx="1.5" fill="#1B1210"/><path d="M${x - 3} 233 L${x + 6} 233" stroke="#FFD36E" stroke-width="2"/><path d="M${x - 8} 233 Q${x - 3} 231 ${x + 2} 233" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5"/>` },
  regen: { n: tn('Regenlaarzen', 'Rain boots'), c: '#FFD21F', f: (x, c, d) => `<path d="M${x - 11} 243 L${x - 10} 212 L${x + 8} 212 L${x + 8} 228 Q${x + 14} 232 ${x + 13} 240 Q${x + 12} 243 ${x + 9} 243Z" fill="${c}"/><rect x="${x - 12}" y="239" width="26" height="5" rx="2" fill="#2B2147"/><path d="M${x - 6} 216 L${x - 6} 232" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>` }
};
/* ---------- handschoenen (over de hand) ---------- */
const GLOVES = {
  wanten: { n: tn('Wanten', 'Mittens'), c: '#E85D5D', f: (x, y, r, c) => `<g transform="rotate(${r} ${x} ${y})"><circle cx="${x}" cy="${y}" r="10.5" fill="${c}"/><ellipse cx="${x - 9}" cy="${y - 2}" rx="4" ry="6" fill="${c}"/><rect x="${x - 11}" y="${y - 14}" width="22" height="7" rx="3" fill="${shade(c, -.2)}"/><path d="M${x - 8} ${y - 11} l16 0" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 2" opacity=".7"/></g>` },
  vingerloos: { n: tn('Vingerloze handschoenen', 'Fingerless gloves'), c: '#2B2D36', f: (x, y, r, c) => `<g transform="rotate(${r} ${x} ${y})"><path d="M${x - 9} ${y + 1} Q${x} ${y + 12} ${x + 9} ${y + 1} L${x + 9} ${y - 6} L${x - 9} ${y - 6}Z" fill="${c}"/><rect x="${x - 10}" y="${y - 13}" width="20" height="7" rx="2.5" fill="${shade(c, .2)}"/><path d="M${x - 8} ${y - 3} L${x + 8} ${y - 3}" stroke="#FFD21F" stroke-width="1.8"/></g>` },
  werk: { n: tn('Werkhandschoenen', 'Work gloves'), c: '#C99A68', f: (x, y, r, c) => `<g transform="rotate(${r} ${x} ${y})"><circle cx="${x}" cy="${y}" r="9.6" fill="${c}"/><path d="M${x - 9} ${y - 7} L${x - 12} ${y - 15} L${x + 12} ${y - 15} L${x + 9} ${y - 7}Z" fill="${shade(c, -.2)}"/><path d="M${x - 5} ${y + 2} Q${x} ${y + 6} ${x + 5} ${y + 2}" stroke="${shade(c, -.4)}" stroke-width="1.6" fill="none"/><path d="M${x - 4} ${y - 4} L${x - 4} ${y + 1} M${x} ${y - 4} L${x} ${y + 1} M${x + 4} ${y - 4} L${x + 4} ${y + 1}" stroke="${shade(c, -.4)}" stroke-width="1.2"/></g>` },
  tech: { n: tn('Techhandschoenen', 'Tech gloves'), c: '#2B2D36', f: (x, y, r, c) => `<g transform="rotate(${r} ${x} ${y})"><circle cx="${x}" cy="${y}" r="9.6" fill="${c}"/><rect x="${x - 6}" y="${y - 6}" width="12" height="8" rx="2.5" fill="${shade(c, .28)}"/><rect x="${x - 10}" y="${y - 13}" width="20" height="6" rx="2" fill="#FFD21F"/><circle cx="${x}" cy="${y - 2}" r="1.8" fill="#7FF3FF"/></g>` },
  boks: { n: tn('Bokshandschoenen', 'Boxing gloves'), c: '#E8402A', f: (x, y, r, c) => `<g transform="rotate(${r} ${x} ${y})"><circle cx="${x}" cy="${y}" r="12.5" fill="${c}"/><ellipse cx="${x - 10}" cy="${y + 1}" rx="4" ry="6" fill="${c}"/><rect x="${x - 11}" y="${y - 16}" width="22" height="7" rx="3" fill="#fff"/><path d="M${x - 5} ${y - 4} Q${x} ${y} ${x + 5} ${y - 4}" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/></g>` }
};
/* ---------- sjaals, kettingen en gezichtsspul ---------- */
const NECKS = {
  sjaal: { n: tn('Sjaal', 'Scarf'), c: '#E85D5D', f: (c, d) => `<path d="M72 160 Q100 178 128 160 L130 170 Q100 188 70 170Z" fill="${c}"/><path d="M116 172 L124 206 L108 204 L106 178Z" fill="${c}"/><path d="M110 188 L122 190 M111 196 L123 198" stroke="#fff" stroke-width="2.4"/>` },
  bandana: { n: tn('Nekdoek', 'Neckerchief'), c: '#E85D5D', f: (c, d) => `<path d="M72 160 Q100 172 128 160 L100 192Z" fill="${c}"/>${[[90, 168], [110, 168], [100, 178], [100, 186]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join('')}` },
  strik: { n: tn('Vlinderstrikje', 'Bow tie'), c: '#E8402A', f: (c, d) => `<path d="M100 168 L84 158 L84 178Z M100 168 L116 158 L116 178Z" fill="${c}"/><circle cx="100" cy="168" r="5" fill="${d}"/>` },
  ketting: { n: tn('Ketting met ster', 'Star necklace'), c: '#FFD36E', f: (c, d) => `<path d="M76 158 Q100 192 124 158" stroke="${c}" stroke-width="2.4" fill="none"/><path d="${starPath(100, 184, 8)}" fill="${c}" stroke="#C99A2A" stroke-width="1"/>` },
  choker: { n: tn('Choker', 'Choker'), c: '#2B2147', f: (c, d) => `<path d="M80 158 Q100 170 120 158" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="100" cy="167" r="3.6" fill="#FFD36E"/>` },
  koptel: { n: tn('Koptelefoon om de nek', 'Headphones round the neck'), c: '#2B2D36', f: (c, d) => `<path d="M68 160 Q100 190 132 160" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="58" y="154" width="14" height="22" rx="6" fill="${c}"/><rect x="128" y="154" width="14" height="22" rx="6" fill="${c}"/><rect x="62" y="160" width="6" height="10" rx="3" fill="#FF8FB8"/><rect x="132" y="160" width="6" height="10" rx="3" fill="#FF8FB8"/>` }
};
const MASKERS = {
  tech: { n: tn('Techmasker', 'Tech mask'), f: () => `<path d="M48 118 Q100 128 152 118 Q150 150 100 160 Q50 150 48 118Z" fill="#2B2D36" stroke="#1B1D24" stroke-width="1.6"/><path d="M80 134 L120 134 M82 141 L118 141 M86 148 L114 148" stroke="#FFD21F" stroke-width="2.2" stroke-linecap="round"/><circle cx="100" cy="127" r="3" fill="#7FF3FF"/><path d="M46 112 L34 104 M154 112 L166 104" stroke="#2B2D36" stroke-width="3.4" stroke-linecap="round"/>` },
  snor: { n: tn('Katten-snorharen', 'Cat whiskers'), f: () => `<g stroke="#2B2140" stroke-width="2" stroke-linecap="round" fill="none" opacity=".85"><path d="M46 122 L72 126 M46 130 L72 130 M48 138 L72 134 M154 122 L128 126 M154 130 L128 130 M152 138 L128 134"/></g><path d="M96 118 L104 118 L100 123Z" fill="#FF8FB8"/>` },
  ster: { n: tn('Sterretje op de wang', 'Star face paint'), f: () => `<path d="${starPath(62, 126, 8)}" fill="#FFD36E" stroke="#E0A92A" stroke-width="1"/><circle cx="140" cy="118" r="2.4" fill="#FFD36E"/><circle cx="146" cy="126" r="1.8" fill="#FFD36E"/>` },
  bliksem: { n: tn('Bliksem op de wang', 'Lightning paint'), f: () => `<path d="M66 112 L56 128 L64 128 L58 142 L74 122 L66 122 L72 112Z" fill="#7FF3FF" stroke="#2B8FC9" stroke-width="1.2"/>` },
  pleister: { n: tn('Pleister op de neus', 'Plaster on nose'), f: () => `<g transform="rotate(-18 100 118)"><rect x="86" y="113" width="28" height="9" rx="3" fill="#F3C9A0" stroke="#D2A070" stroke-width="1.2"/><circle cx="96" cy="117.5" r="1" fill="#D2A070"/><circle cx="100" cy="117.5" r="1" fill="#D2A070"/><circle cx="104" cy="117.5" r="1" fill="#D2A070"/></g>` }
};
const ZOOM = { top: '36 132 128 96', bottom: '40 188 120 64', shoes: '58 210 84 40', gloves: '20 150 160 80', neck: '48 136 104 62', masker: '36 90 128 80', hat: '20 -34 160 110', bril: '36 70 128 70', hair: '-6 -30 212 230', eyeShape: '50 74 100 64' };

const TOP_IDS = ['geen', ...Object.keys(TOPS)], BOTTOM_IDS = ['geen', ...Object.keys(BOTTOMS)], SHOE_IDS = ['geen', ...Object.keys(SHOES)],
  GLOVE_IDS = ['geen', ...Object.keys(GLOVES)], NECK_IDS = ['geen', ...Object.keys(NECKS)], MASK_IDS = ['geen', ...Object.keys(MASKERS)];
COLKEYS.push('bottom', 'shoes', 'gloves');
Object.assign(DEFAULT_LOOK, { top: 'geen', bottom: 'geen', shoes: 'geen', gloves: 'geen', neck: 'geen', masker: 'geen' });

/* ---------- tekenen ---------- */
const isSep = L => (L.top && L.top !== 'geen') || (L.bottom && L.bottom !== 'geen');
const topOf = L => TOPS[L.top && L.top !== 'geen' ? L.top : 'tee'], botOf = L => BOTTOMS[L.bottom && L.bottom !== 'geen' ? L.bottom : 'jeans'];
const _robeCol = robeCol;
robeCol = L => isSep(L) ? colOf(L, 'robe', topOf(L).c) : _robeCol(L);
function legsSVG(L, skin, skinD) {
  const sh = L.shoes && L.shoes !== 'geen' ? SHOES[L.shoes] : null;
  if (!isSep(L)) {
    const legs = L.body === 'jongen' ? `<rect x="84" y="200" width="15" height="37" rx="6" fill="#3B3F6B"/><rect x="101" y="200" width="15" height="37" rx="6" fill="#3B3F6B"/>` : `<rect x="86" y="214" width="11" height="22" rx="5" fill="${skinD}"/><rect x="103" y="214" width="11" height="22" rx="5" fill="${skinD}"/><rect x="85" y="223" width="13" height="13" rx="4" fill="#FFF6EE" ${ol('#2B2147', 1.2, .35)}/><rect x="102" y="223" width="13" height="13" rx="4" fill="#FFF6EE" ${ol('#2B2147', 1.2, .35)}/>`;
    const boots = sh ? shoeBoth(L, sh, skin) : `<path d="M79 230 Q79 240 81 243 L101 243 Q103 236 100 230Z" fill="#4A39AE" ${ol('#2B2147', 1.4, .55)}/><rect x="80" y="228" width="20" height="5" rx="2.5" fill="#FFD36E" stroke="#C99A2A" stroke-width="1"/><path d="${starPath(90, 238, 3.6)}" fill="#FFD36E"/><path d="M99 230 Q99 240 101 243 L121 243 Q123 236 120 230Z" fill="#4A39AE" ${ol('#2B2147', 1.4, .55)}/><rect x="100" y="228" width="20" height="5" rx="2.5" fill="#FFD36E" stroke="#C99A2A" stroke-width="1"/><path d="${starPath(110, 238, 3.6)}" fill="#FFD36E"/>`;
    return legs + boots;
  }
  const b = botOf(L), bc = colOf(L, 'bottom', b.c);
  return `<g ${ol('#2B2147', 1.3, .5)}><rect x="86" y="196" width="12" height="42" rx="5" fill="${skinD}"/><rect x="102" y="196" width="12" height="42" rx="5" fill="${skinD}"/>${b.f(bc, shade(bc, -.22), shade(bc, .38))}${shoeBoth(L, sh || SHOES.sneaker, skin)}</g>`;
}
function shoeBoth(L, sh, skin) {
  const c = colOf(L, 'shoes', sh.c), d = shade(c, -.28);
  return `<g ${ol('#2B2147', 1.3, .5)}>${sh.f(90, c, d, skin)}${sh.f(110, c, d, skin)}</g>`;
}
function bodySVG(L) {
  if (!isSep(L)) return robeSVG(L);
  const T = topOf(L), c = colOf(L, 'robe', T.c), t = colOf(L, 'trim', T.t), d = shade(c, -.22), b = botOf(L), bc = colOf(L, 'bottom', b.c);
  const skin = shade(colOf(L, 'skin', SKINS[L.skin] || SKINS[3]), (L.tint || 0) * .05);
  return `<path d="${BODYP(206)}" fill="${skin}"/>${T.f(c, t, d, skin)}${b.bib ? b.bib(bc, shade(bc, -.22), shade(bc, .38)) : ''}`;
}
function armsSVG(L, skin, wandHand) {
  const sep = isSep(L), T = sep ? topOf(L) : null, c = robeCol(L), cuff = sep ? shade(c, -.2) : '#FFF6EE';
  const slc = sep && T.slc === 't' ? colOf(L, 'trim', T.t) : c;
  const arm = (cx, cy, rx, ry, rot, cx2, cy2) => {
    if (!sep || T.sl === 'lang') return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${slc}" transform="rotate(${rot} ${cx} ${cy})"/>`;
    const upper = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${skin}" transform="rotate(${rot} ${cx} ${cy})"/>`;
    return T.sl === 'kort' ? upper + `<ellipse cx="${cx2}" cy="${cy2}" rx="${rx + 1}" ry="9" fill="${slc}" transform="rotate(${rot} ${cx2} ${cy2})"/>` : upper;
  };
  const showCuff = !sep || T.sl === 'lang';
  const g = L.gloves && L.gloves !== 'geen' ? GLOVES[L.gloves] : null, gc = g ? colOf(L, 'gloves', g.c) : '';
  const hand = (x, y, r) => `<circle cx="${x}" cy="${y}" r="8" fill="${skin}"/>${g ? `<g ${ol('#2B2147', 1.2, .5)}>${g.f(x, y, r, gc)}</g>` : ''}`;
  return `${arm(62, 186, 9, 20, 18, 66, 172)}${showCuff && !g ? `<ellipse cx="58" cy="198" rx="10" ry="5.4" fill="${cuff}" transform="rotate(18 58 198)"/>` : ''}${hand(56, 205, 18)}
    ${arm(140, 180, 9, 19, -30, 134, 168)}${wandHand}${showCuff && !g ? `<ellipse cx="144" cy="190" rx="10" ry="5.4" fill="${cuff}" transform="rotate(-30 144 190)"/>` : ''}${hand(146, 197, -30)}`;
}
function neckSVG(L) {
  const n = L.neck && L.neck !== 'geen' ? NECKS[L.neck] : null; if (!n) return '';
  const c = colOf(L, 'extra', n.c);
  return `<g ${ol('#2B2147', 1.3, .5)}>${n.f(c, shade(c, -.25))}</g>`;
}
function maskSVG(L) { const m = L.masker && L.masker !== 'geen' ? MASKERS[L.masker] : null; return m ? m.f() : ''; }

/* ---------- nieuwe hoeden (winkel) ---------- */
const HATS2 = {
  cap: ['Pet', 'Cap', 15, `<path d="M44 62 C42 22 72 8 100 8 C128 8 158 22 156 62 Q100 50 44 62Z" fill="#2F6BDB"/><path d="M46 58 Q100 40 154 58 Q152 72 100 68 Q48 72 46 58Z" fill="#1E4FB8"/><circle cx="100" cy="10" r="4" fill="#1E4FB8"/><path d="M100 22 L106 34 L94 34Z" fill="#fff"/>`],
  beanie: ['Muts', 'Beanie', 15, `<path d="M42 62 C40 20 70 10 100 10 C130 10 160 20 158 62Z" fill="#E85D5D"/><rect x="40" y="44" width="120" height="20" rx="8" fill="#C94848"/>${[54, 66, 78, 90, 102, 114, 126, 138, 150].map(x => `<path d="M${x} 46 L${x} 62" stroke="#E85D5D" stroke-width="2" opacity=".7"/>`).join('')}<circle cx="100" cy="6" r="11" fill="#fff"/>`],
  bucket: ['Vissershoed', 'Bucket hat', 20, `<ellipse cx="100" cy="50" rx="74" ry="14" fill="#E9BF5C"/><path d="M58 50 Q60 8 100 8 Q140 8 142 50Z" fill="#F1CF7A"/><path d="M58 40 Q100 30 142 40 L142 48 Q100 38 58 48Z" fill="#2FA7A0"/>`],
  bandana: ['Bandana', 'Bandana', 10, `<path d="M40 54 Q100 28 160 54 L158 66 Q100 46 42 66Z" fill="#E85D5D"/>${[60, 78, 96, 114, 132, 148].map((x, i) => `<circle cx="${x}" cy="${52 - (i % 3) * 2}" r="2.2" fill="#fff"/>`).join('')}<path d="M150 56 L170 50 L164 66 L174 72 L152 68Z" fill="#C94848"/>`],
  koptel: ['Koptelefoon', 'Headphones', 25, `<path d="M36 100 C30 20 170 20 164 100" stroke="#2B2D36" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="22" y="86" width="22" height="34" rx="10" fill="#2B2D36"/><rect x="156" y="86" width="22" height="34" rx="10" fill="#2B2D36"/><rect x="28" y="94" width="8" height="18" rx="4" fill="#FF8FB8"/><rect x="164" y="94" width="8" height="18" rx="4" fill="#FF8FB8"/>`],
  klep: ['Zonneklep', 'Visor', 10, `<path d="M44 52 Q100 36 156 52 L156 62 Q100 48 44 62Z" fill="#FFFFFF"/><path d="M50 60 Q100 74 150 60 Q100 90 50 60Z" fill="#7FE3F0" opacity=".85"/>`],
  kap: ['Capuchon', 'Hood', 30, `<path d="M26 128 C16 44 60 8 100 8 C140 8 184 44 174 128 L152 112 C160 62 132 32 100 32 C68 32 40 62 48 112Z" fill="#6B5BD6"/><path d="M48 112 C40 62 68 32 100 32 C132 32 160 62 152 112 C156 70 130 40 100 40 C70 40 44 70 48 112Z" fill="#4A3FA8"/><path d="M62 112 L60 140 M138 112 L140 140" stroke="#FFD36E" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="142" r="3.4" fill="#FFD36E"/><circle cx="140" cy="142" r="3.4" fill="#FFD36E"/>`],
  cowboy: ['Cowboyhoed', 'Cowboy hat', 40, `<path d="M16 54 Q38 66 60 52 L140 52 Q162 66 184 54 Q170 34 150 42 L146 36 Q100 28 54 36 L50 42 Q30 34 16 54Z" fill="#B8864A"/><path d="M58 50 Q56 14 76 10 Q88 20 100 14 Q112 20 124 10 Q144 14 142 50Z" fill="#C99A68"/><path d="M58 44 Q100 54 142 44 L142 38 Q100 48 58 38Z" fill="#7A4E2D"/><path d="${starPath(100, 41, 5)}" fill="#FFD36E"/>`],
  platpet: ['Platte pet', 'Flat cap', 20, `<path d="M42 62 C40 28 80 14 120 16 C148 18 162 36 160 62 Q100 50 42 62Z" fill="#8A7A66"/><path d="M42 62 Q100 50 160 62 L164 68 Q100 76 38 68Z" fill="#6E604F"/><circle cx="110" cy="17" r="3.4" fill="#6E604F"/>`],
  helm: ['Fietshelm', 'Bike helmet', 25, `<path d="M42 62 C38 20 76 6 100 6 C124 6 162 20 158 62 Q100 50 42 62Z" fill="#FFD21F"/><path d="M70 14 L66 54 M100 8 L100 52 M130 14 L134 54" stroke="#2B2147" stroke-width="3.2" opacity=".5" stroke-linecap="round"/><path d="M52 56 L46 94 M148 56 L154 94" stroke="#2B2147" stroke-width="3" stroke-linecap="round"/>`],
  krans: ['Bloemenkrans', 'Flower crown', 30, `<path d="M38 66 Q100 22 162 66" stroke="#4FB35A" stroke-width="6" fill="none" stroke-linecap="round"/>${[[50, 56, '#FF8FB8'], [68, 40, '#FFE15A'], [90, 32, '#fff'], [112, 32, '#FF8FB8'], [134, 40, '#FFE15A'], [152, 56, '#fff']].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="4.4" ry="7" cy="-6" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#FFB547"/></g>`).join('')}`],
  hoofdband: ['Zweetband', 'Headband', 8, `<path d="M42 60 Q100 36 158 60 L158 72 Q100 50 42 72Z" fill="#FF5E8E"/><path d="M42 66 Q100 44 158 66" stroke="#fff" stroke-width="3" fill="none"/>`]
};
Object.keys(HATS2).forEach(id => ITEMS.hat.push({ id, name: HATS2[id][0], price: HATS2[id][2] }));
ITEMS.hat.forEach(it => { ITEM['hat:' + it.id] = it; });
{ const _hat = hatSVG; hatSVG = (id, robe) => HATS2[id] ? `<g>${HATS2[id][3]}</g>` : _hat(id, robe); }

/* ---------- nieuwe brillen ---------- */
GLASSES.push('zon', 'vierkant', 'pilot', 'kat', 'tech', 'drie', 'monocle', 'sport');
{
  const _gl = glassesSVG, br = '<path d="M92 104 Q100 98 108 104" stroke="#2B2D36" stroke-width="3" fill="none"/>';
  const two = (shape, fill, stroke, w = 3.4) => `<g fill="${fill}" stroke="${stroke}" stroke-width="${w}">${shape(76)}${shape(124)}</g>${br}`;
  glassesSVG = id => {
    switch (id) {
      case 'zon': return two(x => `<rect x="${x - 19}" y="92" width="38" height="26" rx="12"/>`, '#1B1D2B', '#2B2D36') + `<path d="M62 98 L72 98 M110 98 L120 98" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`;
      case 'vierkant': return two(x => `<rect x="${x - 18}" y="92" width="36" height="26" rx="4"/>`, '#fff3', '#2B2D36');
      case 'pilot': return two(x => `<path d="M${x - 19} 94 L${x + 19} 94 L${x + 14} 118 Q${x} 122 ${x - 12} 114Z"/>`, '#FFD36E44', '#C99A2A');
      case 'kat': return two(x => `<path d="M${x - 18} 108 Q${x - 14} 96 ${x} 98 Q${x + 12} 96 ${x + 22} 90 Q${x + 18} 118 ${x} 118 Q${x - 14} 118 ${x - 18} 108Z" transform="${x > 100 ? '' : `translate(${2 * x} 0) scale(-1 1)`}"/>`, '#FF8FB866', '#E85D9E');
      case 'tech': return `<path d="M44 96 Q100 88 156 96 L152 118 Q100 126 48 118Z" fill="#7FF3FF" fill-opacity=".5" stroke="#2B2D36" stroke-width="3.4"/><path d="M58 100 L78 100 M70 108 L84 108" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/><path d="M44 104 L34 108 M156 104 L166 108" stroke="#2B2D36" stroke-width="3.4" stroke-linecap="round"/>`;
      case 'drie': return `<g stroke="#2B2D36" stroke-width="3.4"><rect x="58" y="93" width="36" height="26" rx="5" fill="#FF3B3B" fill-opacity=".55"/><rect x="106" y="93" width="36" height="26" rx="5" fill="#3BD0FF" fill-opacity=".55"/></g>${br}`;
      case 'monocle': return `<circle cx="124" cy="106" r="19" fill="#fff" fill-opacity=".2" stroke="#C99A2A" stroke-width="3.4"/><path d="M140 118 Q150 150 138 170" stroke="#C99A2A" stroke-width="2" fill="none"/>`;
      case 'sport': return `<path d="M44 96 Q100 90 156 96 Q158 116 140 118 Q124 118 112 106 Q100 100 88 106 Q76 118 60 118 Q42 116 44 96Z" fill="#2B2D36" fill-opacity=".85" stroke="#FF8A3D" stroke-width="3.4"/><path d="M60 100 L80 100" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>`;
    }
    return _gl(id);
  };
}

/* ---------- nieuwe kapsels ---------- */
HAIRSTYLES.push(
  { id: 'mohawk', name: 'Hanenkam' }, { id: 'undercut', name: 'Undercut' }, { id: 'mullet', name: 'Mullet' }, { id: 'wolf', name: 'Wolfcut' },
  { id: 'shaggy', name: 'Warrig' }, { id: 'fade', name: 'Fade' }, { id: 'kommetje', name: 'Kommetje' }, { id: 'hoogstaart', name: 'Hoge staart' },
  { id: 'dreads', name: 'Dreads' }, { id: 'golfkort', name: 'Korte golven' }, { id: 'krulstaart', name: 'Krullenstaart' }, { id: 'vlechtknot', name: 'Vlechtknot' },
  { id: 'scheefpony', name: 'Scheve pony' }, { id: 'gordijn', name: 'Gordijn' });
BOY_HAIR.push('mohawk', 'undercut', 'fade', 'kommetje', 'shaggy', 'dreads', 'golfkort');
{
  const _hb = hairBack, _hf = hairFront;
  const sideSweep = (H, d) => `<path d="M36 96 C34 124 38 150 46 164 C52 140 52 120 50 100Z" fill="${H}"/><path d="M164 96 C166 124 162 150 154 164 C148 140 148 120 150 100Z" fill="${H}"/>`;
  const strand = (H, x, len, w) => `<rect x="${x - w / 2}" y="80" width="${w}" height="${len}" rx="${w / 2}" fill="${H}"/>`;
  hairBack = (style, H) => {
    const Hd = hairTone(H, -.18), Hl = hairTone(H, .2);
    switch (style) {
      case 'mohawk': case 'undercut': case 'fade': return _hb('buzz', H);
      case 'mullet': return _hb('kort', H) + `<path d="M44 100 C34 150 42 202 72 220 L128 220 C158 202 166 150 156 100Z" fill="${Hd}"/>`;
      case 'wolf': return `<path d="M32 90 C28 38 66 18 100 18 C134 18 172 38 168 90 C176 140 178 190 168 214 L156 200 L148 222 L132 206 L120 228 L100 208 L80 228 L68 206 L52 222 L44 200 L32 214 C22 190 24 140 32 90Z" fill="${Hd}"/>`;
      case 'shaggy': return _hb('kort', H);
      case 'kommetje': return `<path d="M32 92 C30 40 66 20 100 20 C134 20 170 40 168 92 C170 110 166 128 160 134 L40 134 C34 128 30 110 32 92Z" fill="${Hd}"/>`;
      case 'hoogstaart': return _hb('kort', H) + `<path d="M84 22 C60 -14 120 -40 156 -4 C176 18 170 60 160 96 C156 60 150 36 128 22Z" fill="${H}"/><path d="M104 -2 Q140 -8 158 20" stroke="${Hl}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>`;
      case 'dreads': return `<path d="M34 92 C30 44 66 22 100 22 C134 22 170 44 166 92 L166 130 L34 130Z" fill="${Hd}"/>` + [34, 46, 58, 142, 154, 166].map((x, i) => strand(i % 2 ? H : Hd, x, 120 + (i * 17) % 50, 11)).join('') + [34, 58, 154].map(x => `<circle cx="${x}" cy="226" r="4" fill="#FFD36E"/>`).join('');
      case 'golfkort': return _hb('bob', H) + [[44, 130], [140, 128]].map(([x, y]) => `<path d="M${x} ${y} q8 6 16 0 t16 0" stroke="${Hl}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>`).join('');
      case 'krulstaart': return _hb('kort', H) + [[160, 60, 20], [176, 90, 20], [170, 124, 18], [156, 150, 16], [178, 156, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${H}"/>`).join('');
      case 'vlechtknot': return _hb('kort', H) + `<circle cx="100" cy="14" r="26" fill="${H}"/>` + [-14, -4, 6, 16].map(x => `<path d="M${100 + x - 10} ${4} q10 8 0 18" stroke="${Hd}" stroke-width="3" fill="none"/>`).join('');
      case 'scheefpony': return _hb('lang', H);
      case 'gordijn': return _hb('bob', H);
    }
    return _hb(style, H);
  };
  hairFront = (style, H) => {
    const Hl = hairTone(H, .22), Hd = hairTone(H, -.3);
    const cap = `M36 98 C32 50 62 26 100 26 C138 26 168 50 164 98 C158 86 152 78 146 72`;
    switch (style) {
      case 'mohawk': return _hf('buzz', H) + `<path d="M84 74 C78 36 82 -6 100 -20 C118 -6 122 36 116 74 Q100 58 84 74Z" fill="${H}"/><path d="M92 50 Q100 20 100 -4" stroke="${Hl}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`;
      case 'undercut': return _hf('buzz', H) + `<path d="M44 96 C34 48 66 20 104 20 C142 20 166 46 160 82 C152 62 122 52 96 58 C72 62 54 76 44 96Z" fill="${H}"/><path d="M70 36 Q100 24 134 34" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`;
      case 'mullet': return _hf('pixie', H);
      case 'wolf': return _hf('lang', H) + `<path d="M40 100 L36 128 L48 116Z M160 100 L164 128 L152 116Z M72 70 L66 90 L82 80Z M128 70 L134 90 L118 80Z" fill="${H}"/>`;
      case 'shaggy': return `<path d="${cap} L140 92 L132 74 L122 94 L110 70 L98 92 L86 70 L76 92 L64 76 L56 96 L46 84Z" fill="${H}"/><path d="M36 98 L28 116 L44 108Z M164 98 L172 116 L156 108Z" fill="${H}"/><path d="M70 42 Q100 30 130 42" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
      case 'fade': return _hf('buzz', H) + `<path d="M50 72 L54 34 Q100 22 146 34 L150 72 Q100 58 50 72Z" fill="${H}"/><path d="M66 40 Q100 32 134 40" stroke="${Hl}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>`;
      case 'kommetje': return `<path d="M36 98 C32 50 62 26 100 26 C138 26 168 50 164 98 L158 74 L42 74Z" fill="${H}"/><path d="M60 38 Q100 28 140 38" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
      case 'hoogstaart': return _hf('pixie', H) + `<circle cx="100" cy="30" r="6" fill="#FF6FA8"/>`;
      case 'dreads': return _hf('kort', H) + [40, 52, 148, 160].map((x, i) => strand(H, x, 92 + (i * 23) % 40, 11)).join('');
      case 'golfkort': return _hf('bob', H);
      case 'krulstaart': return _hf('krulkop', H);
      case 'vlechtknot': return _hf('pixie', H);
      case 'scheefpony': return `<path d="M36 98 C32 50 62 26 100 26 C138 26 168 50 164 98 C160 80 150 70 140 70 C120 98 90 108 60 100 C50 98 42 98 36 98Z" fill="${H}"/><path d="M70 40 Q100 30 140 46" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/><path d="M60 98 Q96 100 132 76" stroke="${Hd}" stroke-width="2" fill="none" opacity=".5"/>` + sideSweep(H);
      case 'gordijn': return `<path d="M100 28 C60 24 34 52 36 100 C34 130 40 150 46 164 C56 140 54 110 62 86 C74 64 90 50 100 44Z M100 28 C140 24 166 52 164 100 C166 130 160 150 154 164 C144 140 146 110 138 86 C126 64 110 50 100 44Z" fill="${H}"/><path d="M52 60 Q70 40 94 34 M148 60 Q130 40 106 34" stroke="${Hl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
    }
    return _hf(style, H);
  };
}

/* ---------- nieuwe ogen ---------- */
EYESHAPES.push('glans', 'vermoeid', 'strak', 'cyber', 'spiraal', 'spleet', 'maan', 'vlam', 'regenboog', 'hartpupil');
EYECOLORS.push('#58C9B9', '#E8402A', '#2B2147', '#F2F2F7', '#FF8FB8', '#FFD36E');
HAIRCOLORS.push('#37E3B0', '#FF3EA5', '#3EC1FF', '#FFE23E');
{
  const _eye = animeEye, EYE2 = new Set(['glans', 'vermoeid', 'strak', 'cyber', 'spiraal', 'spleet', 'maan', 'vlam', 'regenboog', 'hartpupil']), SPECIAL = ['lach', 'sterogen', 'hartogen', 'slaap', 'oeps'];
  animeEye = (x, y, col, s = 1, mood = 'blij', o = {}) => {
    if (!EYE2.has(o.shape) || SPECIAL.includes(mood)) return _eye(x, y, col, s, mood, o);
    const base = _eye(x, y, col, s, mood, Object.assign({}, o, { shape: o.shape === 'strak' ? 'slaperig' : 'rond' })), side = x > 100 ? 1 : -1, iy = y + 3 * s, K = '#1E1630';
    let ov = '';
    switch (o.shape) {
      case 'glans': ov = `<circle cx="${x - 5 * s}" cy="${y - 2 * s}" r="${2.6 * s}" fill="#fff"/>${sparkle(x + 5 * s, y + 6 * s, 3.6 * s, '#fff')}${sparkle(x - 6 * s, y + 8 * s, 2.2 * s, '#fff')}`; break;
      case 'vermoeid': ov = `<path d="M${x - 11 * s} ${y - 3 * s} Q${x} ${y - 9 * s} ${x + 11 * s} ${y - 3 * s}" stroke="#2B2140" stroke-width="${4.2 * s}" fill="none" stroke-linecap="round"/><path d="M${x - 9 * s} ${y + 16 * s} q${9 * s} ${5 * s} ${18 * s} 0" stroke="#7A4E8A" stroke-width="${1.8 * s}" fill="none" opacity=".45" stroke-linecap="round"/>`; break;
      case 'strak': ov = `<path d="M${x - 13 * s} ${y - 6 * s} L${x + 13 * s} ${y - 10 * s * side * -1 - 2 * s}" stroke="#2B2140" stroke-width="${4.4 * s}" stroke-linecap="round"/><path d="M${x + side * 12 * s} ${y - 8 * s} L${x + side * 20 * s} ${y - 14 * s}" stroke="#2B2140" stroke-width="${3 * s}" stroke-linecap="round"/>`; break;
      case 'cyber': ov = `<circle cx="${x}" cy="${iy}" r="${7 * s}" fill="none" stroke="#7FF3FF" stroke-width="${1.6 * s}"/><path d="M${x - 9 * s} ${iy} L${x - 4 * s} ${iy} M${x + 4 * s} ${iy} L${x + 9 * s} ${iy} M${x} ${iy - 9 * s} L${x} ${iy - 4 * s}" stroke="#7FF3FF" stroke-width="${1.4 * s}" stroke-linecap="round"/><circle cx="${x}" cy="${iy}" r="${2 * s}" fill="#7FF3FF"/>`; break;
      case 'spiraal': ov = `<path d="M${x} ${iy} m${-1 * s} 0 a${2 * s} ${2 * s} 0 1 1 ${3 * s} 0 a${4 * s} ${4 * s} 0 1 1 ${-6 * s} 0 a${6 * s} ${6 * s} 0 1 1 ${9 * s} 0" stroke="#fff" stroke-width="${1.5 * s}" fill="none" stroke-linecap="round" opacity=".9"/>`; break;
      case 'spleet': ov = `<ellipse cx="${x}" cy="${iy}" rx="${5.4 * s}" ry="${7.2 * s}" fill="${col}"/><ellipse cx="${x}" cy="${iy}" rx="${1.7 * s}" ry="${7 * s}" fill="${K}"/><circle cx="${x + 4 * s}" cy="${y - 4 * s}" r="${2.4 * s}" fill="#fff"/>`; break;
      case 'maan': ov = `<path d="M${x + 4 * s} ${iy - 6 * s} A${6.4 * s} ${6.4 * s} 0 1 0 ${x + 4 * s} ${iy + 6 * s} A${4.6 * s} ${4.6 * s} 0 1 1 ${x + 4 * s} ${iy - 6 * s}Z" fill="#FFF3B0" opacity=".92"/>`; break;
      case 'vlam': ov = `<ellipse cx="${x}" cy="${iy}" rx="${5.4 * s}" ry="${7.2 * s}" fill="${col}"/><path d="${starPath(x, iy, 6.4 * s, 2.4 * s)}" fill="${K}"/><circle cx="${x + 4 * s}" cy="${y - 4 * s}" r="${2.2 * s}" fill="#fff"/>`; break;
      case 'regenboog': ov = ['#FF5E5E', '#FFD36E', '#6FD38A', '#6DB8F7'].map((c, i) => `<circle cx="${x}" cy="${iy}" r="${(8 - i * 1.5) * s}" fill="none" stroke="${c}" stroke-width="${1.3 * s}" opacity=".75"/>`).join('') + `<circle cx="${x}" cy="${iy}" r="${2.6 * s}" fill="${K}"/><circle cx="${x + 3 * s}" cy="${y - 3 * s}" r="${1.8 * s}" fill="#fff"/>`; break;
      case 'hartpupil': ov = `<path d="${heartPath(x, iy + 1 * s, 1.1 * s)}" fill="#FF3E7F"/><circle cx="${x + 4 * s}" cy="${y - 4 * s}" r="${2 * s}" fill="#fff"/>`; break;
    }
    return base.replace(/<\/g>$/, ov + '</g>');
  };
}

/* ---------- namen voor het paneel, en de dobbelsteen ---------- */
const PARTNAME = { top: TOPS, bottom: BOTTOMS, shoes: SHOES, gloves: GLOVES, neck: NECKS, masker: MASKERS };
const NAME2 = { geen: ['Geen', 'Nada', 'None'], mohawk: ['Hanenkam', 'Hanenkam', 'Mohawk'], undercut: ['Undercut', 'Undercut', 'Undercut'], mullet: ['Mullet', 'Mullet', 'Mullet'], wolf: ['Wolfcut', 'Wolfcut', 'Wolf cut'], shaggy: ['Warrig', 'Warrig', 'Shaggy'], fade: ['Fade', 'Fade', 'Fade'], kommetje: ['Kommetje', 'Kommetje', 'Bowl cut'], hoogstaart: ['Hoge staart', 'Hoge staart', 'High ponytail'], dreads: ['Dreads', 'Dreads', 'Dreads'], golfkort: ['Korte golven', 'Korte golven', 'Short waves'], krulstaart: ['Krullenstaart', 'Krullenstaart', 'Curly tail'], vlechtknot: ['Vlechtknot', 'Vlechtknot', 'Braided bun'], scheefpony: ['Scheve pony', 'Scheve pony', 'Side fringe'], gordijn: ['Gordijn', 'Gordijn', 'Curtains'],
  glans: ['Glinster', 'Glinster', 'Glimmer'], vermoeid: ['Vermoeid', 'Vermoeid', 'Tired'], strak: ['Strak', 'Strak', 'Sharp'], cyber: ['Cyber', 'Cyber', 'Cyber'], spiraal: ['Spiraal', 'Spiraal', 'Spiral'], spleet: ['Spleet', 'Spleet', 'Slit'], maan: ['Maan', 'Maan', 'Moon'], vlam: ['Sterpupil', 'Sterpupil', 'Star pupil'], regenboog: ['Regenboog', 'Regenboog', 'Rainbow'], hartpupil: ['Hartpupil', 'Hartpupil', 'Heart pupil'],
  zon: ['Zonnebril', 'Zonnebril', 'Sunglasses'], vierkant: ['Vierkant', 'Vierkant', 'Square'], pilot: ['Piloot', 'Piloot', 'Aviator'], kat: ['Kattenoog', 'Kattenoog', 'Cat-eye'], tech: ['Techvisor', 'Techvisor', 'Tech visor'], drie: ['3D-bril', '3D-bril', '3D glasses'], monocle: ['Monocle', 'Monocle', 'Monocle'], sport: ['Sportbril', 'Sportbril', 'Sport shades'] };
function partName(key, v) {
  const P = PARTNAME[key]; if (P && P[v]) return tri(P[v].n);
  if (NAME2[v]) return tri(NAME2[v]); return null;
}
{
  const _rl = randomLook;
  randomLook = L => {
    const r = _rl(L), pick = (ids, p) => Math.random() < p ? kies(ids.slice(1)) : 'geen';
    if (Math.random() < .45) { r.top = pick(TOP_IDS, 1); r.bottom = pick(BOTTOM_IDS, 1); r.shoes = pick(SHOE_IDS, .8); }
    else { r.top = 'geen'; r.bottom = 'geen'; r.shoes = 'geen'; }
    r.gloves = pick(GLOVE_IDS, .2); r.neck = pick(NECK_IDS, .25); r.masker = pick(MASK_IDS, .15);
    if (Math.random() < .5) { r.hair = kies(HAIRSTYLES).id; r.eyeShape = kies(EYESHAPES); }
    return r;
  };
}
