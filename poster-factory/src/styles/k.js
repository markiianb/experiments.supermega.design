// K · Centre — one idea of the 1970 manual as one symmetric figure.
// Rules: 40-Marketing/Visual-Experiments/NYCTA-Posters/K-RULES.md. Figma kit: kits/kitK2.js.
import { W, H, PAL, text, measure } from '../core/ctx.js';

const CX = 480, CY = 720, Z0 = 120, Z1 = 840, T0 = 360, T1 = 1080; // the 720 px figure zone
const INKS8 = ['yellow', 'orange', 'red', 'magenta', 'green', 'blue312', 'blue300', 'black'];
const X3 = [240, 480, 720];

// ---- primitives (kept as data so the rules can be measured) ----
const R = (x, y, w, h, f, rx = 0) => ({ t: 'r', x, y, w, h, f, rx });
const E = (cx, cy, r, f) => ({ t: 'c', cx, cy, r, f });
const Ring = (cx, cy, r, sw, s) => ({ t: 'c', cx, cy, r, s, sw });
const P = (pts, f) => ({ t: 'p', pts, f });
const PS = (pts, s, sw) => ({ t: 'p', pts, s, sw });
const D = (d, bb, f) => ({ t: 'd', d, bb, f });
const DS = (d, bb, s, sw) => ({ t: 'd', d, bb, s, sw });

function arrowPts(cx, cy, r, ang) { // the p. 55 arrow, tip up at ang = 0
  const t = r * 0.4, L = r * 0.757, s = Math.SQRT1_2;
  const b = [[0, -r], [L, -r + L], [L - t * s, -r + L + t * s], [t / 2, -r + t * Math.SQRT2 + t / 2], [t / 2, r], [-t / 2, r], [-t / 2, -r + t * Math.SQRT2 + t / 2], [-(L - t * s), -r + L + t * s], [-L, -r + L]];
  const a = ang * Math.PI / 180, co = Math.cos(a), si = Math.sin(a);
  return b.map(p => [cx + p[0] * co - p[1] * si, cy + p[0] * si + p[1] * co]);
}
const A = (cx, cy, r, ang, f) => P(arrowPts(cx, cy, r, ang), f);
const dome = (cx, cy, r, f) => D(`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}Z`, [cx - r, cy - r, cx + r, cy], f);

// ---- the library: K01–K50 ----
// c = [ground, a, b, c] hex; n = count where the figure has one. ink = default palette keys [ground, a, b, c].
const FIG = {
  arrow: { no: 1, title: 'the arrow', fact: 'p. 55: the arrow, drawn in an 11″ circle on the 1′ module.', ink: ['white', 'red', 'blue312'],
    draw: c => [R(120, 360, 720, 720, c[1]), A(480, 720, 330, 0, c[2])] },
  disc: { no: 2, title: 'the disc', fact: 'pp. 11–37: route discs, white letters on the colour code.', ink: ['magenta', 'white', 'blue312'],
    draw: c => [E(480, 720, 360, c[1]), E(480, 900, 180, c[2])] },
  band: { no: 3, title: 'the band', fact: 'p. 61: the 1⅝″ black band along the top of every plate.', ink: ['yellow', 'black', 'red'], n: [7, 3, 9, 1, 'Bands'],
    draw: (c, n) => { const h = 52, d = 150, step = (720 - h - d) / (n - 1), o = []; for (let i = 0; i < n; i++) { const y = 360 + i * step; o.push(P([[0, y], [480, y + d], [960, y], [960, y + h], [480, y + d + h], [0, y + h]], i === (n >> 1) ? c[2] : c[1])); } return o; } },
  module: { no: 4, title: 'the module', fact: 'p. 61: plates are 1′ high, in widths of 1, 2, 4 and 8 feet.', ink: ['green', 'white', 'black'],
    draw: c => { const m = 90, o = []; [1, 2, 4, 8].forEach((k, row) => { const y = 405 + row * 180, x0 = 480 - k * m / 2; for (let i = 0; i < k; i++) { o.push(R(x0 + i * m + 3, y, m - 6, m, c[1]), R(x0 + i * m + 3, y, m - 6, 12, c[2])); } }); return o; } },
  decision: { no: 5, title: 'the decision', fact: 'p. 1: information only at the point of decision. Never before. Never after.', ink: ['black', 'orange'],
    draw: c => { const top = [480, 420], mid = [480, 720], bs = [[180, 1020], [480, 1020], [780, 1020]]; return [DS(`M480 420L480 720` + bs.map(b => `M480 720L${b[0]} ${b[1]}`).join(''), [180, 420, 780, 1020], c[1], 40), ...[top, mid, ...bs].map(p => E(p[0], p[1], 60, c[1]))]; } },
  routes: { no: 6, title: 'the routes', fact: 'pp. 11–37: 26 routes in eight inks; bar width = routes per ink.', ink: ['white'], code: true,
    draw: () => [2, 4, 3, 3, 4, 4, 2, 4].map((k, i) => R(480 - k * 90, 360 + i * 90, k * 180, 90, PAL[INKS8[i]])) },
  exit: { no: 7, title: 'the exit', fact: 'p. 64: Exit, white on PMS Warm Red, a 2′ plate.', ink: ['black', 'white', 'warmRed'],
    draw: c => [R(120, 360, 720, 720, c[1]), R(300, 630, 360, 180, c[2])] },
  transfer: { no: 8, title: 'the transfer', fact: 'p. 64: Transfer, black on PMS 109 yellow.', ink: ['yellow109'], code: true,
    draw: () => [E(300, 540, 180, PAL.magenta), E(660, 540, 180, PAL.blue312), E(300, 900, 180, PAL.orange), E(660, 900, 180, PAL.green), PS([[372, 612], [588, 612], [588, 828], [372, 828]], PAL.black, 24)] },
  direction: { no: 9, title: 'the direction', fact: 'p. 55: bear left and bear right, two of the six arrow directions.', ink: ['orange', 'white'],
    draw: c => [A(290, 720, 241, -45, c[1]), A(670, 720, 241, 45, c[1])] },
  letters: { no: 10, title: 'the letters', fact: 'p. 5: the cap height of X is the unit of the type.', ink: ['grey', 'green'],
    draw: c => { const m = measure('X', { size: 1008, weight: 500 }); const x = 480 - (m.right - m.left) / 2; return [{ t: 'x', svg: text(x, 1080, 'X', { size: 1008, weight: 500, fill: c[1] }), bb: [x - m.left, 1080 - m.ascent, x + m.right, 1080 + m.descent] }]; } },
  colours: { no: 11, title: 'the colours', fact: 'pp. 11–37: the eight-colour code, assigned per route.', ink: ['white'], code: true,
    draw: () => INKS8.map((k, i) => { const a = (-90 + 22.5 + 45 * i) * Math.PI / 180; return E(480 + 260 * Math.cos(a), 720 + 260 * Math.sin(a), 98, PAL[k]); }) },
  express: { no: 12, title: 'the express', fact: '1972 map: 18 stops on the 7 Av local, six on the express.', ink: ['white', 'orange', 'red'],
    draw: c => [R(120, 480, 720, 220, c[1], 110), R(120, 740, 720, 220, c[2], 110), ...Array.from({ length: 18 }, (_, i) => E(230 + i * 500 / 17, 590, 11, c[0])), ...Array.from({ length: 6 }, (_, i) => E(230 + i * 100, 850, 30, c[0]))] },
  shuttle: { no: 13, title: 'the shuttle', fact: '1972 map: three shuttles, one ink, there and back.', ink: ['green', 'white'],
    draw: c => [D('M120 480A110 110 0 0 1 120 700L730 700A110 110 0 0 0 730 480Z', [120, 480, 840, 700], c[1]), D('M840 740A110 110 0 0 0 840 960L230 960A110 110 0 0 1 230 740Z', [120, 740, 840, 960], c[1])] },
  map: { no: 14, title: 'the map', fact: '1972 map: route lines run side by side and touch.', ink: ['blue300', 'red', 'yellow', 'green'],
    draw: c => [0, 1, 2].map(i => { const r = 320 - 80 * i; return DS(`M${480 - r} 1080L${480 - r} 720A${r} ${r} 0 0 1 ${480 + r} 720L${480 + r} 1080`, [480 - r - 40, 720 - r - 40, 480 + r + 40, 1080], c[i + 1], 80); }) },
  mounting: { no: 15, title: 'the mounting', fact: 'pp. 70–71: hanging signs at 6′10″, column signs at 5′4″ (to scale).', ink: ['orange', 'black', 'white'],
    draw: c => [R(435, 360, 90, 708, c[1]), R(120, 1068, 720, 12, c[1]), R(300, 360, 360, 93, c[2]), R(300, 360, 360, 12, c[1]), R(435, 498, 90, 90, c[2])] },
  spacing: { no: 16, title: 'the spacing', fact: 'p. 10: one unit = 1/36 of the cap height; two units each side.', ink: ['white', 'black', 'red'],
    draw: c => Array.from({ length: 36 }, (_, i) => R(124 + 20 * i, 360, 12, 720, i < 2 || i > 33 ? c[2] : c[1])) },
  order: { no: 17, title: 'the order', fact: 'p. 171: arrow first, then the words, then the discs.', ink: ['orange', 'black', 'white', 'blue300'],
    draw: c => [R(0, 480, 960, 480, c[1]), A(240, 720, 110, -90, c[2]), R(390, 696, 180, 48, c[2]), E(720, 720, 110, c[3])] },
  railing: { no: 18, title: 'the railing', fact: 'pp. 82–86: street railing panels, with the band.', ink: ['grey', 'white', 'black'],
    draw: c => [R(120, 480, 720, 480, c[1]), R(120, 480, 720, 65, c[2]), ...Array.from({ length: 6 }, (_, i) => E(180 + 120 * i, 752, 45, c[2]))] },
  kinds: { no: 19, title: 'three kinds', fact: 'p. 5: three type sizes — one line, two lines, six lines.', ink: ['green', 'white', 'black'],
    draw: c => { const o = []; [[360, [100], 0], [620, [47, 47], 30], [880, [15, 15, 15, 15, 15, 15], 12]].forEach(p => { o.push(R(120, p[0], 720, 200, c[1])); const tot = p[1].reduce((a, b) => a + b, 0) + p[2] * (p[1].length - 1); let y = p[0] + 100 - tot / 2; p[1].forEach(h => { o.push(R(180, y, 600, h, c[2])); y += h + p[2]; }); }); return o; } },
  reductions: { no: 20, title: 'the reductions', fact: 'p. 5: cap heights 9″, 4¼″, 1⅜″ — squares to the same ratio.', ink: ['yellow', 'black', 'white', 'orange'],
    draw: c => [R(120, 360, 720, 720, c[1]), R(310, 550, 340, 340, c[2]), R(425, 665, 110, 110, c[3])] },
  directions: { no: 21, title: 'the directions', fact: 'p. 55: six directions — left, right, ahead, down, bear left, bear right.', ink: ['blue312', 'white', 'black'],
    draw: c => [...[-90, -45, 0, 45, 90, 180].map(a => { const r = a * Math.PI / 180; return A(480 + 250 * Math.sin(r), 720 - 250 * Math.cos(r), 100, a, c[1]); }), E(480, 720, 50, c[2])] },
  blank: { no: 22, title: 'the blank', fact: 'p. 59: a blank 1′ module separates two changes of direction.', ink: ['red', 'white', 'black'],
    draw: c => [R(120, 480, 720, 480, c[1]), R(120, 480, 720, 65, c[2]), A(240, 752, 150, -90, c[2]), A(720, 752, 150, 90, c[2])] },
  column: { no: 23, title: 'the column', fact: 'Column signs: 1′ × 1′, no band, bottom at 5′4″.', ink: ['yellow', 'black', 'white'],
    draw: c => [R(300, 360, 360, 720, c[1]), R(360, 420, 240, 240, c[2])] },
  turnstile: { no: 24, title: 'the turnstile', fact: 'pp. 77–80: turnstile decals, in and out.', ink: ['magenta', 'white', 'black'],
    draw: c => { const o = [], cc = [480, 780]; [0, 120, 240].forEach(a => { const r = a * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r), px = Math.cos(r) * 45, py = Math.sin(r) * 45, L = 330; o.push(P([[cc[0] - px, cc[1] - py], [cc[0] - px + dx * L, cc[1] - py + dy * L], [cc[0] + px + dx * L, cc[1] + py + dy * L], [cc[0] + px, cc[1] + py]], c[1])); }); o.push(E(cc[0], cc[1], 110, c[2])); return o; } },
  telephone: { no: 25, title: 'the telephone', fact: 'pp. 77–80: the TA telephone symbol.', ink: ['blue300', 'white'],
    draw: c => [Ring(480, 720, 300, 60, c[1]), R(300, 540, 360, 90, c[1]), R(435, 630, 90, 290, c[1])] },
  wordspace: { no: 26, title: 'the word space', fact: 'p. 9: a word space is half the cap height.', ink: ['white', 'black', 'red'],
    draw: c => [R(120, 480, 288, 480, c[1]), R(552, 480, 288, 480, c[1]), R(408, 480, 144, 480, c[2])] },
  screen: { no: 27, title: 'the screen', fact: '1972 map: eight routes print as halftone screens.', ink: ['warmRed', 'white'], n: [12, 6, 14, 1, 'Density'],
    draw: (c, n) => { const p = 360 / n, o = []; for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) { const x = (i + j) * p, y = (i - j) * p; if (Math.hypot(x, y) <= 345) o.push(E(480 + x, 720 + y, p * 0.53, c[1])); } return o; } },
  grid: { no: 28, title: 'the grid', fact: '1972 map: the grid, A–J by 1–10.', ink: ['green', 'white'],
    draw: c => { const o = []; for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) o.push(R(120 + 74 * i, 360 + 74 * j, 54, 54, c[1])); return o; } },
  angles: { no: 29, title: 'the angles', fact: '1972 map: every line runs at 0, 45 or 90 degrees.', ink: ['black', 'orange', 'yellow', 'red'],
    draw: c => [0, 1, 2].map(i => { const ap = 335 - 50 * i, cr = ap / Math.cos(Math.PI / 8); return PS(Array.from({ length: 8 }, (_, k) => { const a = (22.5 + 45 * k) * Math.PI / 180; return [480 + cr * Math.cos(a), 720 + cr * Math.sin(a)]; }), c[i + 1], 50); }) },
  station: { no: 30, title: 'the station', fact: '1972 map: a stop is a dot on the line; a transfer lines the dots up.', ink: ['white', 'red', 'yellow', 'green'],
    draw: c => [...[0, 1, 2].map(i => R(0, 360 + 240 * i, 960, 240, c[i + 1])), ...[0, 1, 2].map(i => E(480, 480 + 240 * i, 72, c[0]))] },
  point: { no: 31, title: 'the point', fact: 'p. 1: the point of decision.', ink: ['yellow109', 'black'],
    draw: c => [0, 90, 180, 270].map(a => { const r = a * Math.PI / 180; return A(480 + 230 * Math.sin(r), 720 - 230 * Math.cos(r), 130, a + 180, c[1]); }) },
  code: { no: 32, title: 'the code', fact: 'pp. 11–37: discs carry the colour code.', ink: ['black', 'red', 'blue312'], n: [3, 2, 4, 1, 'Discs per row'],
    draw: (c, n) => { const p = 720 / n, o = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o.push(E(120 + p * (i + 0.5), 360 + p * (j + 0.5), p * 0.458, (i + j) % 2 === 0 ? c[1] : c[2])); return o; } },
  stairs: { no: 33, title: 'the stairs', fact: 'p. 61: everything is built from the 1′ module.', ink: ['orange', 'black'], n: [6, 3, 9, 1, 'Steps'],
    draw: (c, n) => { const s = 720 / n; return Array.from({ length: n }, (_, i) => R(480 - s * (i + 1) / 2, 360 + s * i, s * (i + 1), s, c[1])); } },
  corner: { no: 34, title: 'the corner', fact: '1972 map: lines turn through rounded corners.', ink: ['white', 'orange', 'red'],
    draw: c => [D('M120 360L480 360A360 360 0 0 1 120 720Z', [120, 360, 480, 720], c[1]), D('M840 360L840 720A360 360 0 0 1 480 360Z', [480, 360, 840, 720], c[1]), D('M120 1080L120 720A360 360 0 0 1 480 1080Z', [120, 720, 480, 1080], c[2]), D('M840 1080L480 1080A360 360 0 0 1 840 720Z', [480, 720, 840, 1080], c[2])] },
  plates: { no: 35, title: 'the plates', fact: 'p. 59: plates butt into one continuous sign.', ink: ['green', 'white', 'black'], n: [6, 3, 8, 1, 'Plates'],
    draw: (c, n) => { const h = 720 / n, o = []; for (let i = 0; i < n; i++) { o.push(R(120, 360 + h * i, 720, h, c[1]), R(120, 360 + h * i, 720, h * 0.135, c[2])); } return o; } },
  double: { no: 36, title: 'the double', fact: '1970 routes with double letters: AA, CC, EE, GG, HH, KK, LL, RR, SS.', ink: ['yellow', 'magenta', 'blue312', 'black'],
    draw: c => [E(390, 720, 270, c[1]), E(570, 720, 270, c[2]), D('M480 465.44A270 270 0 0 0 480 974.56A270 270 0 0 0 480 465.44Z', [300, 465.44, 660, 974.56], c[3])] },
  inout: { no: 37, title: 'the in and out', fact: 'pp. 77–80: “in” and “out” at the turnstiles.', ink: ['grey', 'black', 'white'],
    draw: c => [D('M450 390A330 330 0 0 0 450 1050Z', [120, 390, 450, 1050], c[1]), D('M510 390A330 330 0 0 1 510 1050Z', [510, 390, 840, 1050], c[2])] },
  crossing: { no: 38, title: 'the crossing', fact: '1972 map: two lines cross at a transfer stop.', ink: ['black', 'yellow', 'blue312'],
    draw: c => [R(120, 600, 720, 240, c[1]), R(360, 360, 240, 720, c[2]), E(480, 720, 70, c[0])] },
  tunnel: { no: 39, title: 'the tunnel', fact: 'pp. 11–37: the disc, repeated.', ink: ['orange', 'black'], n: [5, 3, 8, 1, 'Rings'],
    draw: (c, n) => { const p = 360 / n; return Array.from({ length: n }, (_, i) => Ring(480, 720, 360 - p / 4 - i * p, p / 2, c[1])); } },
  twoways: { no: 40, title: 'the two ways', fact: 'p. 171: Uptown and Downtown, one arrow each.', ink: ['red', 'black', 'white'],
    draw: c => [R(120, 360, 360, 720, c[1]), R(480, 360, 360, 720, c[2]), A(300, 720, 200, 0, c[2]), A(660, 720, 200, 180, c[1])] },
  foot: { no: 41, title: 'the foot', fact: 'p. 61: the module is one foot.', ink: ['blue300', 'white'], n: [5, 3, 9, 2, 'Modules per side'],
    draw: (c, n) => { const s = 720 / n, o = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2 === 0) o.push(R(120 + s * i, 360 + s * j, s, s, c[1])); return o; } },
  inks: { no: 42, title: 'the inks', fact: 'pp. 11–37: eight inks — PMS 130, 165, 185, 239, 354, 312, 300 and black.', ink: ['white'], code: true,
    draw: () => INKS8.map((k, i) => R(120 + 90 * i, 360, 90, 720, PAL[k])) },
  route: { no: 43, title: 'the route', fact: 'p. 64: a disc on its 1′ plate, under the band.', ink: ['yellow', 'white', 'black', 'blue312'],
    draw: c => [R(120, 360, 720, 720, c[1]), R(120, 360, 720, 97, c[2]), E(480, 768, 250, c[3])] },
  halfdiscs: { no: 44, title: 'the half discs', fact: 'pp. 38–44: half discs on street railings.', ink: ['blue312', 'white'], n: [3, 2, 4, 1, 'Per row'],
    draw: (c, n) => { const p = 720 / n, o = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o.push(dome(120 + p * (i + 0.5), 360 + p * j + p * 0.75, p / 2, c[1])); return o; } },
  uptown: { no: 45, title: 'the uptown', fact: 'p. 55: straight ahead.', ink: ['green', 'white'], n: [3, 2, 4, 1, 'Per row'],
    draw: (c, n) => { const p = 720 / n, o = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o.push(A(120 + p * (i + 0.5), 360 + p * (j + 0.5), p * 0.458, 0, c[1])); return o; } },
  entrance: { no: 46, title: 'the entrance', fact: 'p. 82: the street sign — band, arrow down.', ink: ['grey', 'white', 'black'],
    draw: c => [R(120, 360, 720, 720, c[1]), R(120, 360, 720, 97, c[2]), A(480, 768, 290, 180, c[2])] },
  numbers: { no: 47, title: 'the numbers', fact: 'Routes 1 to 8 in their 1970 inks.', ink: ['white'], code: true,
    draw: () => [[240, 480], [480, 480], [720, 480], [360, 720], [600, 720], [240, 960], [480, 960], [720, 960]].map((p, i) => E(p[0], p[1], 105, PAL[['orange', 'red', 'blue312', 'magenta', 'black', 'yellow', 'orange', 'blue312'][i]])) },
  tracks: { no: 48, title: 'the tracks', fact: '1972 map: local and express tracks side by side (schematic).', ink: ['black', 'orange', 'red', 'white'],
    draw: c => { const o = [R(120, 360, 160, 720, c[1], 80), R(400, 360, 160, 720, c[2], 80), R(680, 360, 160, 720, c[1], 80)]; for (let i = 0; i < 9; i++) o.push(E(200, 440 + 70 * i, 22, c[3]), E(760, 440 + 70 * i, 22, c[3])); [440, 720, 1000].forEach(y => o.push(E(480, y, 40, c[3]))); return o; } },
  junction: { no: 49, title: 'the junction', fact: '1972 map: two lines at 45 degrees and a stop.', ink: ['yellow', 'green', 'blue300', 'black'],
    draw: c => { const d = 120; return [P([[120, 360], [120 + d, 360], [840, 1080 - d], [840, 1080], [840 - d, 1080], [120, 360 + d]], c[1]), P([[840, 360], [840, 360 + d], [120 + d, 1080], [120, 1080], [120, 1080 - d], [840 - d, 360]], c[2]), E(480, 720, 80, c[3])]; } },
  parts: { no: 50, title: 'the parts', fact: 'The arrow, the disc, the module.', ink: ['magenta', 'black', 'white'],
    draw: c => X3.flatMap(x => [A(x, 480, 100, 0, c[1]), E(x, 720, 100, c[2]), R(x - 100, 860, 200, 200, c[1])]) },
};
const KEYS = Object.keys(FIG);

// ---- drawing and measuring ----
const f2 = v => Math.round(v * 100) / 100;
function svgOf(p) {
  const paint = p.s ? `fill="none" stroke="${p.s}" stroke-width="${f2(p.sw)}" stroke-linejoin="miter" stroke-miterlimit="10"` : `fill="${p.f}"`;
  if (p.t === 'r') return `<rect x="${f2(p.x)}" y="${f2(p.y)}" width="${f2(p.w)}" height="${f2(p.h)}"${p.rx ? ` rx="${p.rx}"` : ''} ${paint}/>`;
  if (p.t === 'c') return `<circle cx="${f2(p.cx)}" cy="${f2(p.cy)}" r="${f2(p.r)}" ${paint}/>`;
  if (p.t === 'p') return `<polygon points="${p.pts.map(q => f2(q[0]) + ',' + f2(q[1])).join(' ')}" ${paint}/>`;
  if (p.t === 'd') return `<path d="${p.d}" ${paint}/>`;
  return p.svg;
}
function bbOf(p) {
  const e = p.s ? p.sw / 2 : 0;
  if (p.t === 'r') return [p.x, p.y, p.x + p.w, p.y + p.h];
  if (p.t === 'c') return [p.cx - p.r - e, p.cy - p.r - e, p.cx + p.r + e, p.cy + p.r + e];
  if (p.t === 'p') { const xs = p.pts.map(q => q[0]), ys = p.pts.map(q => q[1]); return [Math.min(...xs) - e, Math.min(...ys) - e, Math.max(...xs) + e, Math.max(...ys) + e]; }
  return p.bb;
}
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lum = h => { const [r, g, b] = hex(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const dist = (a, b) => { const p = hex(a), q = hex(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
const SW = Object.values(PAL);
const slots = fig => fig.ink.length - 1; // figure colours beyond the ground
const nOf = (fig, params) => fig.n ? Math.max(fig.n[1], Math.min(fig.n[2], Math.round(params.n ?? fig.n[0]))) : 0;
const cols = (fig, params) => [params.ground, params.ink1, params.ink2, params.ink3].slice(0, fig.ink.length);

function build(params) {
  const fig = FIG[params.figure] || FIG.arrow, c = cols(fig, params), prims = fig.draw(c, nOf(fig, params)), flags = [];
  let l = 1e9, t = 1e9, r = -1e9, b = -1e9;
  prims.forEach(p => { const q = bbOf(p); l = Math.min(l, q[0]); t = Math.min(t, q[1]); r = Math.max(r, q[2]); b = Math.max(b, q[3]); });
  if (Math.abs((l + r) / 2 - CX) > 1) flags.push({ level: 'fail', text: `Figure is off the centre axis by ${f2((l + r) / 2 - CX)} px.` });
  const bleed = l <= 0.5 && r >= W - 0.5, inside = l >= Z0 - 1 && r <= Z1 + 1;
  if (!bleed && !inside) flags.push({ level: 'fail', text: 'Figure leaves the 720 px zone on one side without bleeding off both.' });
  if (t < T0 - 1 || b > T1 + 1) flags.push({ level: 'fail', text: 'Figure leaves the zone at the top or bottom.' });
  if (b - t < 480) flags.push({ level: 'warn', text: 'Figure is a low strip: under 480 px tall.' });
  if (!fig.code) {
    const used = [...new Set(c)];
    if (used.length < 2) flags.push({ level: 'fail', text: 'Figure and ground are the same colour.' });
    if (used.length > 4) flags.push({ level: 'fail', text: 'More than four colours.' });
    if (c[1] === c[0]) flags.push({ level: 'fail', text: 'The main figure colour equals the ground.' });
    if (c[1] !== c[0] && contrast(c[0], c[1]) < 1.5) flags.push({ level: 'warn', text: 'The figure is hard to see on this ground.' });
    for (let i = 1; i < c.length; i++) for (let j = 0; j < i; j++) if (c[i] !== c[j] && dist(c[i], c[j]) < 60) flags.push({ level: 'warn', text: 'Two colours are too close to tell apart.' });
    if (c.slice(1).some(x => !SW.includes(x)) || !SW.includes(c[0])) flags.push({ level: 'fail', text: 'A colour is outside the 1970 palette.' });
  }
  let title = '';
  if (params.title !== false) {
    const ink = contrast(params.ground, PAL.black) >= contrast(params.ground, PAL.white) ? PAL.black : PAL.white;
    if (contrast(params.ground, ink) < 3) flags.push({ level: 'warn', text: 'Title contrast on this ground is under 3 : 1.' });
    const o = { size: 112, weight: 500, tracking: -0.04 }, m = measure(fig.title, o);
    title = text(f2(CX - (m.right - m.left) / 2), 124, fig.title, { ...o, fill: ink });
  }
  return { svg: `<rect width="${W}" height="${H}" fill="${params.ground}"/>` + prims.map(svgOf).join('') + title, flags };
}

function defaults(key) {
  const fig = FIG[key], k = fig.ink;
  return { figure: key, ground: PAL[k[0]], ink1: PAL[k[1] || 'black'], ink2: PAL[k[2] || 'white'], ink3: PAL[k[3] || 'red'], n: fig.n ? fig.n[0] : 0, title: true };
}

export default {
  id: 'k',
  name: 'Centre',
  blurb: 'One idea of the manual as one symmetric figure.',
  figures: FIG,
  controls(params) {
    const fig = FIG[params.figure] || FIG.arrow, out = [
      { key: 'figure', label: 'Figure', type: 'select', options: KEYS.map(k => ({ value: k, label: `K${String(FIG[k].no).padStart(2, '0')} · ${FIG[k].title}` })) },
    ];
    if (fig.n) out.push({ key: 'n', label: fig.n[4], type: 'range', min: fig.n[1], max: fig.n[2], step: fig.n[3] });
    out.push({ key: 'title', label: 'Title', type: 'toggle' });
    out.push({ key: 'ground', label: 'Ground', type: 'color', options: SW, group: 'Colour' });
    if (!fig.code) for (let i = 1; i <= slots(fig); i++) out.push({ key: 'ink' + i, label: ['Figure', 'Second', 'Third'][i - 1], type: 'color', options: SW, group: 'Colour' });
    return out;
  },
  random(r) {
    for (let tries = 0; tries < 40; tries++) {
      const key = r.pick(KEYS), fig = FIG[key], p = defaults(key);
      if (fig.n && r.chance(0.5)) p.n = fig.n[1] + fig.n[3] * r.int(0, Math.floor((fig.n[2] - fig.n[1]) / fig.n[3]));
      if (r.chance(0.6)) { // a new colourway inside the rules
        const pool = r.shuffle(SW), pick = [];
        for (const c of pool) { if (pick.every(q => dist(q, c) >= 110) && (!pick.length || contrast(pick[0], c) >= 1.9)) pick.push(c); if (pick.length === 4) break; }
        if (pick.length === 4) {
          if (!fig.code) [p.ground, p.ink1, p.ink2, p.ink3] = pick; // code figures keep their inks and ground
        }
      }
      const out = build(p);
      if (!out.flags.length) return p;
    }
    return defaults('arrow');
  },
  render(params) { return build(params); },
};
