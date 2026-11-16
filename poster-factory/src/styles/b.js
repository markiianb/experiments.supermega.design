// B · Point of Decision — sign plates of the 1970 manual at poster scale.
// Rules: 40-Marketing/Visual-Experiments/NYCTA-Posters/B-RULES.md. Figma kit: kits/kitB2.js, kits/kitB2h.js.
import { W, H, PAL, ROUTE, ROUTES, measure, fit, text, loadText } from '../core/ctx.js';

const GAP = 6, PAD = 20, LEAD = 0.95, CAP = 0.714;
const BLACKS = ['5', 'B', 'LL', 'QJ'];
const DIRS = { U: 0, R: 90, D: 180, L: 270, BR: 45, BL: -45 };
const DIR_NAMES = { U: 'Straight ahead', D: 'Down', L: 'Left', R: 'Right', BL: 'Bear left', BR: 'Bear right' };
// p.55: the arrow sits in an 11 in circle inside the 1 ft module; tip on the circle, 90° head, 2.2 in shaft and arms.
const ARROW = 'M60 5L104 49L88.44 64.56L71 47.11L71 115L49 115L49 47.11L31.56 64.56L16 49Z';

// Every message is a sign in the manual (04 Signs page of the Figma rebuild, with its page number).
const S = {
  uptown: { t: 'Uptown\n& The Bronx', routes: '1 2 3', arrow: 'U' },              // p.2
  downtown: { t: 'Downtown\n& Brooklyn', routes: 'N QB RR', arrow: 'D' },          // p.2, p.62
  queens: { t: 'Queens', routes: '7' },                                             // p.2
  manhattan: { t: 'Manhattan', routes: 'D', arrow: 'L' },                           // p.171
  brooklyn: { t: 'Brooklyn', routes: 'LL' },                                        // p.171
  to8: { t: 'To 8 Avenue', routes: 'LL', arrow: 'R' },                              // p.171
  to57: { t: 'To 57 St–7 Av', routes: 'N QB' },                                     // p.172
  coney: { t: 'To Coney Island\nvia Sea Beach', routes: 'N' },                      // p.172
  grand: { t: 'Grand Central', routes: '4 5 6 7' },                                 // p.63, p.82
  times: { t: 'Times Square—42 St', routes: '' },                                   // p.174
  fifth: { t: 'Fifth Av Station', routes: 'E F' },                                  // pp.82–83
  fifty: { t: '50 St Station\nDowntown', routes: 'AA CC E' },                       // pp.82–83
  euclid: { t: '179 Street\nEuclid Avenue', routes: 'E' },                          // p.76
  exit: { t: 'Exit', cat: 'exit', routes: '', arrow: 'R' },                         // p.64
  transfer: { t: 'Transfer', cat: 'transfer', routes: '1 2 3', arrow: 'U' },        // p.64, p.172
  subway: { t: 'Subway', cat: 'street', routes: '', arrow: 'D' },                   // p.82
  exitonly: { t: 'Exit\nonly', cat: 'street', routes: '' },                         // p.86
  clerk: { t: 'Clerk not\nrequired to\naccept bills\nover 5\ndollars', cat: 'mandatory', routes: '' },                       // pp.79–80
  lean: { t: 'Do not lean\nover the edge\nof platform\nenter upon\nor cross\ntracks', cat: 'mandatory', routes: '' },        // pp.79–80
  persons: { t: 'All persons are\nforbidden to enter\nor cross tracks', cat: 'mandatory', routes: '' },                      // p.78
  power: { t: 'Power room\npersonnel only', routes: '' },                           // p.78
};
const SETS = {
  numbers: { label: 'The eight numbers', routes: '1 2 3 4 5 6 7 8' },
  doubles: { label: 'The nine doubles', routes: 'AA CC EE GG HH KK LL RR SS' },
  green: { label: 'PMS 354 green', routes: 'CC GG RR SS' },
  black: { label: 'The black routes', routes: 'B LL QJ 5' },
  all: { label: 'All 26 discs', routes: ROUTES.join(' ') },
};
const KINDS = {
  'sign-arrow': { label: 'Sign and giant arrow', signs: ['uptown', 'downtown', 'transfer', 'exit', 'subway', 'to8', 'manhattan'] },
  'sign-discs': { label: 'Sign and discs', signs: ['queens', 'brooklyn', 'coney', 'euclid', 'grand', 'fifth', 'fifty', 'to57', 'uptown', 'downtown', 'manhattan'] },
  discs: { label: 'Disc wall', signs: Object.keys(SETS) },
  word: { label: 'One plate, one message', signs: ['exit', 'transfer', 'subway', 'exitonly', 'clerk', 'lean'] },
  arrows: { label: 'Arrow plates', signs: ['six', 'pair', 'stairs', 'streets'] },
  halves: { label: 'Two halves', signs: ['exit-transfer', 'up-down', 'never', 'in-out'] },
  scales: { label: 'One sign at four scales', signs: ['times', 'grand', 'leanshort', 'transfer'] },
  repeat: { label: 'Repeated plates', signs: ['exitonly', 'no'] },
  column: { label: 'Column sign', signs: ['42', '81', '125'] },
  info: { label: 'Train information', signs: ['rush', 'parttime', 'manhattan', 'to57'] },
  construct: { label: 'Construction of the arrow', signs: ['circle', 'grid'] },
  tree: { label: 'Information tree', signs: ['tree'] },
};
const SIGN_LABEL = {
  six: 'The six directions', pair: 'Left · Right', stairs: 'Exit · two stairways', streets: 'Exit · Rector St / Trinity Place',
  'exit-transfer': 'Exit · Transfer', 'up-down': 'Uptown · Downtown', never: 'Never before. Never after.', 'in-out': 'in · out',
  leanshort: 'Do not lean over the edge', no: 'No littering · No smoking · No spitting',
  '42': '42 Street', '81': '81 · Museum of Natural History', '125': '125 · Track 3',
  rush: 'Rush-hour service · QB', parttime: 'For 23 St & 14 St · Mon-Fri', circle: 'The arrow in its circle', grid: 'The arrow on its grid', tree: 'Subway · Uptown · Downtown',
};
const MODES = { manual: '1970 Manual', built: 'As Built', yellow: 'Yellow flood', red: 'Red flood', grey: 'Street grey' };
const COLUMN = { '42': ['42', 'Street'], '81': ['81', 'Museum\nof Natural\nHistory'], '125': ['125', 'Track 3'] };

const DISC = {};
function theme(mode, cat) {
  const flood = { yellow: [PAL.yellow109, PAL.black], red: [PAL.warmRed, PAL.white], grey: [PAL.grey, PAL.white] }[mode];
  if (flood) return { ground: flood[0], ink: flood[1], rule: null, letters: mode === 'yellow' ? PAL.yellow109 : PAL.white };
  const t = mode === 'built' ? { ground: PAL.black, ink: PAL.white, rule: PAL.white, letters: PAL.white } : { ground: PAL.white, ink: PAL.black, rule: null, letters: PAL.white };
  if (cat === 'exit') return { ...t, ground: PAL.warmRed, ink: PAL.white };
  if (cat === 'transfer') return { ...t, ground: PAL.yellow109, ink: PAL.black, rule: null };
  if (cat === 'street') return { ...t, ground: PAL.grey, ink: PAL.white, rule: null };
  if (cat === 'mandatory') return { ...t, ink: PAL.red };
  return t;
}
// Stack plates designed for the 1200 px poster onto the current height: same order, 6 px gaps, heights scaled to fill H.
const stack = hs => { const k = (H - GAP * (hs.length - 1)) / hs.reduce((a, b) => a + b, 0); let y = 0; return hs.map(h => { const r = { y, h: h * k }; y += h * k + GAP; return r; }); };
const KH = () => H / 1200;
const inner = (p, want) => Math.min(want, p.w - 20, p.h - p.band - 10);
const parseRoutes = s => String(s || '').trim().split(/[\s,·]+/).filter(Boolean).map(x => x.toUpperCase());
const sizeOf = (ls, w, hAvail, max) => { let s = Math.min(...ls.map(l => fit(l, w))); const k = (ls.length - 1) * LEAD + 0.92; if (s * k > hAvail) s = hAvail / k; return max ? Math.min(s, max) : s; };

// ---- drawing ------------------------------------------------------------------------------------
function Draw() {
  const out = [], flags = [], rowsW = [];
  const fail = t => { if (!flags.some(f => f.text === t)) flags.push({ level: 'fail', text: t }); };
  const warn = t => { if (!flags.some(f => f.text === t)) flags.push({ level: 'warn', text: t }); };
  // A plate: nested svg so that anything larger than the plate is cut by its edge.
  function plate(x, y, w, h, th, o = {}) {
    const s = o.s || 4, band = o.noBand ? 0 : 16.25 * s; let g = `<rect width="${w}" height="${h}" fill="${th.ground}"/>`;
    if (band) { g += `<rect width="${w}" height="${band}" fill="${PAL.black}"/>`; if (th.rule) g += `<rect y="${12.75 * s}" width="${w}" height="${1.25 * s}" fill="${th.rule}"/>`; }
    const p = { x, y, w, h, band, th, g, s };
    p.end = () => out.push(`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${p.g}</svg>`);
    return p;
  }
  // Text block, flush left on the 20 px margin. align: 'centre' | 'bottom' | number (cap top y).
  function words(p, str, o = {}) {
    const ls = str.split('\n'), pad = o.pad ?? PAD * Math.min(1, p.s / 4), top = o.top ?? p.band, bot = o.bot ?? p.h;
    const size = o.size || sizeOf(ls, (o.w ?? p.w) - 2 * pad, bot - top - 2 * pad, o.max);
    const block = (ls.length - 1) * LEAD * size + CAP * size;
    let y0 = o.align === 'bottom' ? bot - (o.margin ?? 55) - block : typeof o.align === 'number' ? o.align : top + (bot - top - block) / 2;
    ls.forEach((l, i) => { const m = measure(l, { size }); const base = y0 + CAP * size + i * LEAD * size; const x = (o.x ?? 0) + pad - m.left;
      p.g += text(x, base, l, { size, fill: o.ink || p.th.ink });
      if (!o.crop && (x + m.right > p.w - 2 || base + m.descent > p.h + 1 || base - m.ascent < p.band - 1)) fail(`"${l}" runs outside its plate`); });
    return { size, top: y0, bottom: y0 + block };
  }
  function disc(p, route, cx, cy, d, o = {}) {
    const dd = DISC[route]; if (!dd) { fail(`${route} is not a 1970 route`); return; }
    if (p.th.ground === PAL.black && BLACKS.includes(route)) fail(`Disc ${route} is black on a black plate`);
    if (p.th.ground === PAL.yellow109 && ROUTE[route] === PAL.yellow) fail(`Disc ${route} is yellow on a yellow plate`);
    if (p.th.ground === PAL.warmRed && [PAL.red, PAL.orange].includes(ROUTE[route])) fail(`Disc ${route} has no contrast on the red plate`);
    if (!o.crop && (cx - d / 2 < -1 || cx + d / 2 > p.w + 1 || cy - d / 2 < p.band - 1 || cy + d / 2 > p.h + 1)) fail(`Disc ${route} is cut by its plate`);
    const k = d / dd.n;
    p.g += `<circle cx="${cx}" cy="${cy}" r="${d / 2}" fill="${ROUTE[route]}"/><g transform="translate(${cx - d / 2} ${cy - d / 2}) scale(${k})"><g transform="translate(0 ${dd.n}) scale(0.1 -0.1)" fill="${p.th.letters}">${dd.paths}</g></g>`;
  }
  // The arrow in its module: (x, y) is the module's top-left corner, m its side.
  function arrow(p, dir, x, y, m, o = {}) {
    if (!o.crop && (x < -1 || y < p.band - 1 || x + m > p.w + 1 || y + m > p.h + 1)) fail('An arrow is cut by its plate');
    if (o.crop && Math.abs(x + m / 2 - p.w / 2) > 1 && !o.offAxis) fail('A cropped arrow must sit on the plate axis');
    p.g += `<path transform="translate(${x} ${y}) scale(${m / 120}) rotate(${DIRS[dir]} 60 60)" d="${ARROW}" fill="${o.ink || p.th.ink}"/>`;
  }
  // A row of equal plates across the poster. Returns the plates.
  function row(y, h, n, thOf, o = {}) {
    const w = (W - GAP * (n - 1)) / n; rowsW.push(n * w + GAP * (n - 1));
    return Array.from({ length: n }, (_, i) => plate(i * (w + GAP), y, w, h, typeof thOf === 'function' ? thOf(i) : thOf, { s: o.s || (w >= 300 ? 4 : w / 120), noBand: o.noBand }));
  }
  const full = (y, h, th, o) => { rowsW.push(W); return plate(0, y, W, h, th, o); };
  function centred(p, kind, item, size, o = {}) {
    const cy = p.band + (p.h - p.band) / 2;
    if (kind === 'disc') disc(p, item, p.w / 2, cy, size, o); else arrow(p, item, (p.w - size) / 2, cy - size / 2, size, o);
  }
  return { out, flags, rowsW, fail, warn, plate, words, disc, arrow, row, full, centred };
}

function checkRoutes(d, routes) {
  const idx = routes.map(r => ROUTES.indexOf(r));
  if (idx.some(i => i < 0)) return; // reported by disc()
  if (idx.some((v, i) => i && v < idx[i - 1])) d.fail('Discs go in alphabetical order, then numbers in numerical order');
  if (new Set(routes).size !== routes.length) d.fail('A route appears twice');
}
// Grid of discs, last short row centred (blank plates keep the row whole).
function discGrid(d, y, h, routes, th, scale) {
  const n = routes.length; const cols = n === 1 ? 1 : n <= 4 ? (n === 3 ? 3 : 2) : n <= 9 ? 3 : n <= 16 ? 4 : 5; const rows = Math.ceil(n / cols);
  const rh = (h - GAP * (rows - 1)) / rows; let k = 0;
  for (let j = 0; j < rows; j++) { const left = n - k, ps = d.row(y + j * (rh + GAP), rh, cols, th); let slots = [...Array(cols).keys()];
    if (left < cols) { const off = (cols - left) / 2; slots = Number.isInteger(off) ? slots.slice(off, off + left) : [...slots.slice(0, left / 2), ...slots.slice(cols - left / 2)]; }
    ps.forEach((p, i) => { if (slots.includes(i) && k < n) { const size = Math.min(p.w, p.h - p.band) * (n === 1 ? 0.87 : 0.8) * (n === 1 ? scale : Math.min(scale, 1.15));
        if (n === 1 && size > p.h - p.band - 20) d.disc(p, routes[k], p.w / 2, p.band + 85 * size / 900 + size / 2, size, { crop: true }); else d.centred(p, 'disc', routes[k], size); k++; } p.end(); }); }
}

const BUILD = {
  'sign-arrow'(d, P, sg, th) {
    const routes = parseRoutes(P.routes), dir = P.arrow, n = routes.length; checkRoutes(d, routes);
    const hWord = 396, hDisc = n ? (n <= 3 ? 240 : (W - GAP * (n - 1)) / n) : 0, hBig = H - hWord - GAP - (n ? hDisc + GAP : 0);
    const parts = [['word', hWord], ...(n ? [['discs', hDisc]] : []), ['big', hBig]]; if (P.flip) parts.reverse();
    let y = 0;
    for (const [kind, h] of parts) {
      if (kind === 'word') { const p = d.full(y, h, th); d.words(p, sg.t, { max: sg.t.includes('\n') ? 0 : 300 }); p.end(); }
      else if (kind === 'discs' && n === 1) { d.rowsW.push(h + GAP + W - h - GAP); const p = d.plate(0, y, h, h, th, { s: h / 120 }); d.centred(p, 'disc', routes[0], (h - p.band) * 0.86); p.end(); d.plate(h + GAP, y, W - h - GAP, h, th, { s: h / 120 }).end(); }
      else if (kind === 'discs') d.row(y, h, n, th).forEach((p, i) => { d.centred(p, 'disc', routes[i], Math.min(p.w, p.h - p.band) * 0.82); p.end(); });
      else { const p = d.full(y, h, th), avail = h - p.band, m = Math.min(W * P.scale, Math.max(avail / 0.62, 0));
        if (dir === 'U' || dir === 'D') { const whole = m * 110 / 120 <= avail - 20;
          const ay = whole ? p.band + (avail - m) / 2 : dir === 'U' ? p.band + 10 - m * 5 / 120 : h - 10 - m * 115 / 120;
          d.arrow(p, dir, (W - m) / 2, ay, m, { crop: !whole }); }
        else { const mm = Math.min(m, avail - 20, W); d.centred(p, 'arrow', dir, mm); }
        p.end(); }
      y += h + GAP;
    }
  },
  'sign-discs'(d, P, sg, th) {
    const routes = parseRoutes(P.routes); checkRoutes(d, routes); if (!routes.length) d.fail('This sign needs at least one route');
    const hWord = routes.length > 4 ? 294 : routes.length === 3 ? 597 : 396, a = () => { const p = d.full(P.flip ? H - hWord : 0, hWord, th); d.words(p, sg.t); p.end(); };
    a(); discGrid(d, P.flip ? 0 : hWord + GAP, H - hWord - GAP, routes, th, P.scale);
  },
  discs(d, P, sg, th) { const routes = parseRoutes(P.routes); checkRoutes(d, routes); if (!routes.length) d.fail('No routes'); discGrid(d, 0, H, routes, th, P.scale); },
  word(d, P, sg, th) {
    const p = d.full(0, H, th), hasArrow = P.arrow !== 'none' && sg.arrow;
    if (hasArrow) { const w = d.words(p, sg.t, P.flip ? { align: 'bottom', margin: 60, max: 460 } : { align: p.band + 70, max: 460 });
      const top = P.flip ? p.band : w.bottom, bot = P.flip ? w.top : H, m = Math.min(620 * P.scale * KH(), bot - top - 60, W - 80);
      d.arrow(p, P.arrow, (W - m) / 2, top + (bot - top - m) / 2, m); }
    else { const w = d.words(p, sg.t, { pad: 30 }); if ((w.bottom - w.top) / (H - p.band) < 0.4) d.fail('The message leaves a large empty field'); }
    p.end();
  },
  arrows(d, P, sg, th) {
    const ex = theme(P.mode, 'exit');
    if (P.sign === 'six') { const o = ['L', 'R', 'U', 'D', 'BL', 'BR']; stack([396, 396, 396]).forEach(({ y, h }, j) => d.row(y, h, 2, th).forEach((p, i) => { d.centred(p, 'arrow', o[j * 2 + i], inner(p, 340 * KH() * Math.min(P.scale, 1.1))); p.end(); })); }
    else if (P.sign === 'pair') { const st = stack([597, 597]); ['L', 'R'].forEach((a, j) => { const p = d.full(st[j].y, st[j].h, th); d.centred(p, 'arrow', P.flip ? (a === 'L' ? 'R' : 'L') : a, inner(p, Math.min(540 * P.scale, 520) * KH())); p.end(); }); }
    else if (P.sign === 'stairs') { const st = stack([597, 597]); const p = d.full(st[0].y, st[0].h, ex); d.words(p, 'Exit', { align: 'bottom', margin: 60, max: 420 * KH() }); p.end(); d.row(st[1].y, st[1].h, 2, ex).forEach((q, i) => { d.centred(q, 'arrow', ['BL', 'BR'][i], inner(q, 400 * KH() * Math.min(P.scale, 1.1))); q.end(); }); }
    else { const st = stack([360, 480, 348]), k = KH(); const p = d.full(st[0].y, st[0].h, ex); d.words(p, 'Exit', { max: 305 * k, w: 600 }); const am = 270 * k; d.arrow(p, 'L', W - 20 - am, p.band + (p.h - p.band - am) / 2, am, {}); p.end();
      const q = d.full(st[1].y, st[1].h, th); d.words(q, 'Rector St\nTrinity Place'); q.end(); d.row(st[2].y, st[2].h, 2, th).forEach((r, i) => { d.centred(r, 'arrow', ['BL', 'BR'][i], inner(r, 250 * k)); r.end(); }); }
  },
  halves(d, P, sg, th) {
    const st = stack([597, 597]); const half = (j, str, t, o = {}) => { const p = d.full(st[j].y, st[j].h, t, o.plate); if (o.arrow) { const w = d.words(p, str, { align: 'bottom', margin: 55, max: o.max }); const m = Math.min(250 * KH(), w.top - p.band - 30); d.arrow(p, o.arrow, 22, p.band + (w.top - p.band - m) / 2, m); } else d.words(p, str, o.words); p.end(); };
    if (P.sign === 'exit-transfer') { const s = fit('Transfer', 920); half(0, 'Exit', theme(P.mode, 'exit'), { arrow: 'L', max: s }); half(1, 'Transfer', theme(P.mode, 'transfer'), { arrow: 'U', max: s }); }
    else if (P.sign === 'up-down') { half(0, S.uptown.t, th, { arrow: 'U', max: 140 }); half(1, S.downtown.t, th, { arrow: 'D', max: 140 }); }
    else if (P.sign === 'never') { const flood = P.mode === 'yellow' || P.mode === 'red'; const s = sizeOf(['before.'], 920, 9999);
      half(0, 'Never\nbefore.', flood ? theme('yellow') : th, { words: { size: Math.min(s, 300) } }); half(1, 'Never\nafter.', flood ? { ground: PAL.red, ink: PAL.white, letters: PAL.white } : th, { words: { size: Math.min(s, 300) } }); }
    else { const z = Math.min(560 * KH(), fit('out', 880)); half(0, 'in', { ground: PAL.grey, ink: PAL.black }, { plate: { noBand: true }, words: { size: z, align: 'bottom', margin: 60 } }); half(1, 'out', { ground: PAL.black, ink: PAL.white }, { plate: { noBand: true }, words: { size: z, align: 'bottom', margin: 60 } }); }
  },
  scales(d, P, sg, th) {
    let y = 0; const k = KH();
    for (const s0 of [4, 3, 2, 1]) { const s = s0 * k, m = 120 * s;
      if (P.sign === 'leanshort') { d.rowsW.push(W); const p = d.plate(0, y, Math.min(240 * s, W), m, theme(P.mode, 'mandatory'), { s }); d.words(p, 'Do not lean\nover the edge', { size: Math.min(35.75 * s, fit('over the edge', p.w - 2 * PAD * Math.min(1, s / 4)) * 0.999) }); p.end(); }
      else if (P.sign === 'transfer') { d.rowsW.push(W); const routes = parseRoutes(P.routes).slice(0, 3); checkRoutes(d, routes);
        const a = d.plate(0, y, m, m, th, { s }); d.centred(a, 'arrow', P.arrow === 'none' ? 'U' : P.arrow, 0.8 * m); a.end();
        const t = d.plate(m, y, 4 * m, m, theme(P.mode, 'transfer'), { s }); d.words(t, 'Transfer', { size: 101.54 * s, crop: true }); t.end();
        routes.forEach((r, k) => { const x = (5 + k) * m; if (x < W) { const q = d.plate(x, y, m, m, th, { s }); d.centred(q, 'disc', r, 100 * s * 0.83); q.end(); } }); }
      else { const p = d.full(y, m, th, { s }); d.words(p, sg.t, { size: 101.54 * s, crop: true }); p.end(); }
      y += m; }
  },
  repeat(d, P, sg, th) {
    if (P.sign === 'no') { const st = stack([396, 396, 396]); ['No littering', 'No smoking', 'No spitting'].forEach((l, j) => { const p = d.full(st[j].y, st[j].h, theme(P.mode, 'mandatory')); d.words(p, l, { size: fit('No smoking', 900) }); p.end(); }); }
    else { const n = P.count, h = (H - GAP * (n - 1)) / n; for (let j = 0; j < n; j++) { const p = d.full(j * (h + GAP), h, th.ground === PAL.grey ? th : theme(P.mode), { s: h / 120 * 0.9 }); d.words(p, 'Exit only', { max: h * 0.72 }); p.end(); } }
  },
  column(d, P, sg, th) {
    const [num, name] = COLUMN[P.sign], p = d.full(0, H, th, { noBand: true }), ls = name.split('\n');
    const ns = Math.min(fit(num, 860), 840); const m = measure(num, { size: ns }); const ny = 70 + (H - 1200) / 2; p.g += text(50 - m.left, ny + CAP * ns, num, { size: ns, fill: th.ink });
    const size = (ls.length > 1 ? 132 : 190) * KH(); d.words(p, name, { size, align: 'bottom', margin: 70, pad: 50 });
    if (ny + CAP * ns > H - 70 - ((ls.length - 1) * LEAD + CAP) * size - 40) d.fail('The number runs into the name');
    p.end();
  },
  info(d, P, sg, th) {
    const st = stack([597, 597]), k = KH();
    if (P.sign === 'rush') { const p = d.full(st[0].y, st[0].h, th); d.centred(p, 'disc', 'QB', inner(p, 460 * k * Math.min(P.scale, 1.1))); p.end(); const q = d.full(st[1].y, st[1].h, th); d.words(q, 'Rush-hour service\nMon–Fri:\nQB to Coney Island\nvia Brighton\n4:55 pm to 5:30 pm', { pad: 30 }); q.end(); }
    else if (P.sign === 'parttime') { const p = d.full(st[0].y, st[0].h, th); d.words(p, 'For 23 St & 14 St\nMon-Fri\n6:50 am to 10:05 am\n3:30 pm to 6:55 pm\nTake any train to 34 St\nChange for', { pad: 30 }); p.end(); const q = d.full(st[1].y, st[1].h, th); d.words(q, 'Mon-Fri\n7am to 8:10 pm'); q.end(); }
    else if (P.sign === 'manhattan') { const ps = d.row(st[0].y, st[0].h, 2, th); d.centred(ps[0], 'arrow', 'L', inner(ps[0], 420 * k)); d.centred(ps[1], 'disc', 'D', inner(ps[1], 400 * k)); ps.forEach(p => p.end()); const q = d.full(st[1].y, st[1].h, th); d.words(q, 'Manhattan'); q.end(); }
    else { const s3 = stack([300, 477, 411]); const p = d.full(s3[0].y, s3[0].h, th); d.words(p, 'Uptown', { max: 215 * k }); p.end(); d.row(s3[1].y, s3[1].h, 2, th).forEach((q, i) => { d.centred(q, 'disc', ['N', 'QB'][i], inner(q, 370 * k)); q.end(); }); const r = d.full(s3[2].y, s3[2].h, th); d.words(r, 'To 57 St–7 Av'); r.end(); }
  },
  construct(d, P, sg, th) {
    if (P.sign === 'circle') { d.rowsW.push(W); const ph = H - 240, oy = (ph - W) / 2; const p = d.plate(0, 120, W, ph, th, { noBand: true }); p.g += `<circle cx="480" cy="${oy + 480}" r="440" fill="none" stroke="${th.ink}" stroke-width="3"/>`; d.arrow(p, P.arrow === 'none' ? 'U' : P.arrow, 0, oy, W); p.end(); }
    else { const p = d.full(0, H, th, { noBand: true }); for (let x = 60; x < W; x += 60) p.g += `<rect x="${x - 0.5}" width="1" height="${H}" fill="${th.ink}" opacity="0.25"/>`; for (let y = 60; y < H; y += 60) p.g += `<rect y="${y - 0.5}" width="${W}" height="1" fill="${th.ink}" opacity="0.25"/>`;
      const m = 1800 * P.scale; d.arrow(p, 'BR', W - m * 0.865, -m * 0.135 + 30, m, { crop: true, offAxis: true }); p.end(); }
  },
  tree(d, P, sg, th) {
    const flood = P.mode === 'yellow', st = stack([300, 240, 155, 487]), k = KH(); const top = d.full(st[0].y, st[0].h, flood ? { ground: PAL.red, ink: PAL.black } : theme(P.mode, 'street'));
    const sq = top.h - 41; top.g += `<rect y="41" width="${sq}" height="${sq}" fill="${th.ground}"/>`; top.g += `<path transform="translate(0 41) scale(${sq / 120}) rotate(180 60 60)" d="${ARROW}" fill="${th.ink}"/>`;
    d.words(top, 'Subway', { x: sq + 1, w: W - sq - 1, top: 41, max: 176 * k }); top.end();
    d.row(st[1].y, st[1].h, 2, th).forEach((p, i) => { d.words(p, [S.uptown.t, S.downtown.t][i], { pad: 10, max: 78 * k }); p.end(); });
    d.row(st[2].y, st[2].h, 6, th).forEach((p, i) => { d.centred(p, 'disc', ['1', '2', '3'][i % 3], Math.min(129 * k, p.w - 20, p.h - p.band - 4)); p.end(); });
    d.row(st[3].y, st[3].h, 2, th).forEach((p, i) => { const m = inner(p, 400 * k); d.arrow(p, ['U', 'D'][i], (p.w - m) / 2, p.band + (p.h - p.band - m) / 2, m); p.end(); });
  },
};

function render(P) {
  const d = Draw(), sg = S[P.sign] || {}, th = theme(P.mode, sg.cat);
  if (!KINDS[P.kind] || !KINDS[P.kind].signs.includes(P.sign)) return { svg: `<rect width="${W}" height="${H}" fill="${PAL.black}"/>`, flags: [{ level: 'fail', text: 'This sign does not exist in this construction' }] };
  BUILD[P.kind](d, P, sg, th);
  if (d.rowsW.some(w => Math.abs(w - W) > 0.5)) d.fail('A row of plates does not add up to 960 px');
  if (sg.cat === 'mandatory' && P.mode !== 'manual') d.warn('Mandatory red is specified on white');
  return { svg: `<rect width="${W}" height="${H}" fill="${PAL.black}"/>` + d.out.join(''), flags: d.flags };
}

const usesRoutes = P => ['sign-arrow', 'sign-discs', 'discs'].includes(P.kind) || (P.kind === 'scales' && P.sign === 'transfer');
const usesArrow = P => P.kind === 'sign-arrow' || (P.kind === 'word' && S[P.sign]?.arrow) || (P.kind === 'construct' && P.sign === 'circle') || (P.kind === 'scales' && P.sign === 'transfer');
const usesScale = P => ['sign-arrow', 'sign-discs', 'discs', 'arrows'].includes(P.kind) || (P.kind === 'word' && S[P.sign]?.arrow) || (P.kind === 'construct' && P.sign === 'grid') || (P.kind === 'info' && P.sign === 'rush');
const usesFlip = P => ['sign-arrow', 'sign-discs'].includes(P.kind) || (P.kind === 'word' && S[P.sign]?.arrow) || (P.kind === 'arrows' && P.sign === 'pair');
const label = k => SIGN_LABEL[k] || SETS[k]?.label || (S[k] ? S[k].t.replace(/\n/g, ' ') : k);

function defaults(kind, sign, r) {
  const sg = S[sign] || {}, P = { kind, sign, routes: SETS[sign]?.routes ?? sg.routes ?? '', arrow: sg.arrow || 'none', mode: 'manual', scale: 1, flip: false, count: 8 };
  if (!r) return P;
  const pick = (...m) => r.pick(m);
  if (kind === 'sign-arrow') {
    if (sign === 'transfer') { P.routes = pick('1 2 3', 'A AA CC E', ''); P.mode = pick('manual', 'yellow', 'yellow'); }
    else if (sign === 'exit') { P.arrow = pick('U', 'R', 'L'); P.mode = pick('built', 'red', 'manual'); }
    else if (sign === 'subway') P.mode = pick('grey', 'yellow', 'manual');
    else { P.mode = pick('manual', 'built', 'yellow'); if (sign === 'downtown') P.routes = pick('N QB RR', '1 2 3'); if (r.chance(0.25)) P.routes = ''; }
    P.scale = ['U', 'D'].includes(P.arrow) ? pick(0.72, 1, 1, 1.15) : 0.8; P.flip = P.arrow === 'D' ? r.chance(0.6) : r.chance(0.15);
  } else if (kind === 'sign-discs') {
    P.mode = pick('manual', 'built', 'yellow'); if (sign === 'uptown') P.routes = pick('2', '1 2 3'); if (sign === 'downtown') P.routes = pick('N', 'QB', 'N QB RR');
    P.scale = parseRoutes(P.routes).length === 1 ? pick(1, 1, 1.4) : 1; P.flip = r.chance(0.3);
  } else if (kind === 'discs') { P.mode = pick('manual', 'manual', 'yellow'); if (sign === 'green') P.mode = pick('manual', 'built'); }
  else if (kind === 'word') { if (sign === 'exit') { P.arrow = pick('R', 'L', 'U'); P.mode = pick('manual', 'built'); } else if (sign === 'transfer') { P.arrow = pick('BL', 'U', 'BR'); P.flip = r.chance(0.6); } else if (sign === 'subway') { P.mode = pick('grey', 'grey', 'yellow'); P.flip = true; }  }
  else if (kind === 'arrows') { P.mode = sign === 'six' ? pick('manual', 'built', 'yellow') : sign === 'pair' ? pick('built', 'manual', 'yellow') : sign === 'stairs' ? pick('built', 'manual') : 'built'; P.flip = r.chance(0.3); }
  else if (kind === 'halves') P.mode = sign === 'never' ? pick('yellow', 'manual', 'built') : sign === 'up-down' ? pick('built', 'manual', 'yellow') : 'manual';
  else if (kind === 'scales') { P.mode = sign === 'times' || sign === 'grand' ? pick('built', 'manual', 'yellow') : 'manual'; if (sign === 'transfer') P.routes = pick('1 2 3', 'A AA CC'); }
  else if (kind === 'repeat') { P.count = pick(6, 8, 8, 10); P.mode = sign === 'no' ? 'manual' : pick('manual', 'grey', 'built'); }
  else if (kind === 'column') P.mode = pick('manual', 'built');
  else if (kind === 'info') P.mode = pick('built', 'built', 'manual', 'yellow');
  else if (kind === 'construct') { P.mode = pick('manual', 'manual', 'yellow', 'built'); if (sign === 'circle') P.arrow = pick('U', 'U', 'R', 'BR', 'D'); }
  else if (kind === 'tree') P.mode = pick('yellow', 'manual', 'built');
  return P;
}

export default {
  id: 'b',
  name: 'Point of Decision',
  blurb: 'One sign from the 1970 manual, built from its plates at poster scale.',
  async init() {
    await Promise.all(ROUTES.map(async r => { const t = await loadText(`assets/discs/disc-${r}.svg`); const n = +(/viewBox="0 0 ([\d.]+)/.exec(t) || [0, 3918])[1];
      DISC[r] = { n, paths: (t.match(/<path[\s\S]*?\/>/g) || []).join('') }; }));
  },
  controls(P) {
    const c = [
      { key: 'kind', label: 'Construction', type: 'select', options: Object.entries(KINDS).map(([value, k]) => ({ value, label: k.label })), group: 'Sign' },
      { key: 'sign', label: P.kind === 'discs' ? 'Set' : 'Message', type: 'select', options: (KINDS[P.kind]?.signs || []).map(value => ({ value, label: label(value) })) },
    ];
    if (usesRoutes(P)) c.push({ key: 'routes', label: 'Routes', type: 'text' });
    if (usesArrow(P)) c.push({ key: 'arrow', label: 'Arrow', type: 'select', options: Object.entries(DIR_NAMES).map(([value, l]) => ({ value, label: l })) });
    if (P.kind === 'repeat' && P.sign !== 'no') c.push({ key: 'count', label: 'Plates', type: 'range', min: 4, max: 12, step: 1 });
    if (usesScale(P)) c.push({ key: 'scale', label: 'Scale', type: 'range', min: 0.6, max: 1.5, step: 0.05, group: 'Composition' });
    if (usesFlip(P)) c.push({ key: 'flip', label: 'Flip order', type: 'toggle' });
    c.push({ key: 'mode', label: 'Mode', type: 'select', options: Object.entries(MODES).map(([value, l]) => ({ value, label: l })), group: 'Colour' });
    return c;
  },
  random(r) {
    const weights = { 'sign-arrow': 5, 'sign-discs': 4, discs: 2, word: 3, arrows: 3, halves: 2, scales: 1, repeat: 1, column: 1, info: 2, construct: 1, tree: 1 };
    const bag = Object.entries(weights).flatMap(([k, n]) => Array(n).fill(k)); let P;
    for (let i = 0; i < 40; i++) { const kind = r.pick(bag); const pool = kind === 'word' ? ['exit', 'exit', 'exit', 'transfer', 'transfer', 'transfer', 'subway', 'subway', 'subway', 'exitonly', 'exitonly', 'clerk', 'lean'] : KINDS[kind].signs; P = defaults(kind, r.pick(pool), r); if (!render(P).flags.some(f => f.level === 'fail')) return P; }
    return defaults('sign-arrow', 'uptown');
  },
  render(P, uid) { const kind = P.kind, sign = KINDS[kind]?.signs.includes(P.sign) ? P.sign : KINDS[kind]?.signs[0]; return render({ ...defaults(kind, sign), ...P, sign }); },
};
