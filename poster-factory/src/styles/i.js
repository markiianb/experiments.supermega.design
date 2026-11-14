// I · Tokens — ring tokens along the 1972 routes, station grids, rings, discs, shuttles, ink networks.
// Rules: 40-Marketing/Visual-Experiments/NYCTA-Posters/I-RULES.md. Figma kit: kits/kitI2.js.
import { W, H, PAL, ROUTE, ROUTES, measure, text, load, loadText } from '../core/ctx.js';

const LIGHT = '#E8E6E1', DARK = '#1C1C1C', PINK = '#F4A6C8';
const FR = [1, 0.7, 0.44, 0.2];                       // ring proportions (rule 8)
const INKOF = { orange: 'orange', red: 'red', lblue: 'blue312', magenta: 'magenta', grey: 'black', yellow: 'yellow', orangeT: 'orange', greenT: 'green', blue: 'blue300', green: 'green', greyL: 'black' };
const INKS = [
  ['yellow', 'PMS 130', ['6', 'N']], ['orange', 'PMS 165', ['1', '7', 'D', 'EE']], ['red', 'PMS 185', ['2', 'HH', 'QB']],
  ['magenta', 'PMS 239', ['4', 'AA', 'F']], ['green', 'PMS 354', ['CC', 'GG', 'RR', 'SS']], ['blue312', 'PMS 312', ['3', '8', 'E', 'M']],
  ['blue300', 'PMS 300', ['A', 'KK']], ['black', 'Black', ['5', 'B', 'LL', 'QJ']],
];
const INKNAME = { yellow: 'yellow', orange: 'orange', red: 'red', magenta: 'magenta', green: 'green', blue312: 'blue', blue300: 'blue', black: '' };
const PARTNER = { blue300: 'blue312', magenta: 'orange', black: 'grey', green: 'yellow', orange: 'red', blue312: 'blue300', red: 'magenta', yellow: 'green' };
const TRAILS = ['1', '2', '3', '4', '5', '6', '7', '8', 'A', 'AA', 'B', 'CC', 'D', 'E', 'EE', 'F', 'GG', 'KK', 'LL', 'M', 'N', 'QB', 'QJ', 'RR', 'SSfr'];
const GRIDS = { '7': 3, '8': 2, LL: 4, M: 3 };         // station lists we hold in full, and their columns
const KINDS = [
  ['trail', 'Route trail'], ['stations', 'Station grid'], ['express', 'Express stops'], ['rings', 'Rings'], ['discs', 'Discs'],
  ['pairs', 'Shuttle pairs'], ['network', 'Ink network'], ['stripes', 'Shuttle stripes'], ['screens', 'Screens'],
];
const VARIANTS = {
  rings: [['all', '26 routes'], ['inks', 'Eight inks'], ['numbers', 'Routes 1 to 8'], ['letters', '18 lettered routes']],
  discs: [['grid', 'Grid on squares'], ['rows', 'Rows by ink'], ['inks', 'Eight inks, labelled']],
  pairs: [['one', 'Times Square–Grand Central'], ['three', 'Three shuttles']],
  network: [['all', 'All 33 lines']].concat(INKS.map(i => [i[0], i[1] + (INKNAME[i[0]] ? ' ' + INKNAME[i[0]] : '')])),
};

let RT = null, FD = null; const DISC = {};
const inkOfRoute = k => PAL[INKOF[RT[k].ink]];
const discKey = k => (k === 'SSfr' ? 'SS' : k);

// ---------- trail maths (ported from kitI2) ----------
const D8 = Array.from({ length: 8 }, (_, a) => [Math.cos(a * Math.PI / 4), Math.sin(a * Math.PI / 4)]);
function dp(v, tol) {
  if (v.length < 3) return v; const a = v[0], b = v[v.length - 1]; let mi = 0, md = 0; const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  for (let i = 1; i < v.length - 1; i++) { const d = Math.abs((b[0] - a[0]) * (a[1] - v[i][1]) - (a[0] - v[i][0]) * (b[1] - a[1])) / L; if (d > md) { md = d; mi = i; } }
  if (md <= tol) return [a, b]; return dp(v.slice(0, mi + 1), tol).slice(0, -1).concat(dp(v.slice(mi), tol));
}
function snap(v0, u) {
  const v = dp(v0, u * 0.45); let S = [0, 0]; let dirs = [];
  for (let i = 1; i < v.length; i++) {
    const dx = (v[i][0] - v[0][0]) / u - S[0], dy = (v[i][1] - v[0][1]) / u - S[1];
    let a = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)); a = ((a % 8) + 8) % 8; const n = Math.round(dx * D8[a][0] + dy * D8[a][1]);
    if (n < 1) continue; if (dirs.length && ((dirs[dirs.length - 1] + 4) % 8) === a) continue;
    for (let k = 0; k < n; k++) { dirs.push(a); S = [S[0] + D8[a][0], S[1] + D8[a][1]]; }
  }
  for (let pass = 0; pass < 3; pass++) for (let i = 1; i < dirs.length - 1; i++) if (dirs[i] !== dirs[i - 1] && dirs[i - 1] === dirs[i + 1]) dirs[i] = dirs[i - 1];
  const runs = []; for (const a of dirs) { if (runs.length && runs[runs.length - 1][0] === a) runs[runs.length - 1][1]++; else runs.push([a, 1]); }
  dirs = []; runs.forEach((r, i) => { const n = (i > 0 && i < runs.length - 1) ? Math.max(2, r[1]) : r[1]; for (let k = 0; k < n; k++) dirs.push(r[0]); });
  const pts = [[0, 0]]; for (const a of dirs) { const p = pts[pts.length - 1]; pts.push([p[0] + D8[a][0], p[1] + D8[a][1]]); }
  return { pts, dirs };
}
function clash(pts) { let c = 0; for (let i = 0; i < pts.length; i++) for (let j = i + 2; j < pts.length; j++) if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 0.995) c++; return c; }
const _cross = {};
function crossings(key) { // where the drawn line crosses a route of another ink (rule 10)
  if (_cross[key]) return _cross[key];
  const v = RT[key].v, ink = INKOF[RT[key].ink]; const seg = []; let L = 0;
  for (let i = 1; i < v.length; i++) { const l = Math.hypot(v[i][0] - v[i - 1][0], v[i][1] - v[i - 1][1]); seg.push([L, l]); L += l; }
  const out = [];
  for (const [k, r] of Object.entries(RT)) {
    const oi = INKOF[r.ink]; if (k === key || oi === ink) continue;
    for (let i = 1; i < v.length; i++) for (let j = 1; j < r.v.length; j++) {
      const a = v[i - 1], b = v[i], c = r.v[j - 1], d = r.v[j]; const rx = b[0] - a[0], ry = b[1] - a[1], sx = d[0] - c[0], sy = d[1] - c[1];
      const den = rx * sy - ry * sx; if (Math.abs(den) < 0.3 * Math.hypot(rx, ry) * Math.hypot(sx, sy)) continue;
      const t = ((c[0] - a[0]) * sy - (c[1] - a[1]) * sx) / den, w = ((c[0] - a[0]) * ry - (c[1] - a[1]) * rx) / den;
      if (t < 0 || t > 1 || w < 0 || w > 1) continue; out.push({ t: (seg[i - 1][0] + t * seg[i - 1][1]) / L, ink: oi });
    }
  }
  return (_cross[key] = out.sort((a, b) => a.t - b.t));
}
function shape(key, u) { // snapped trail in pitch units, terminals pushed out 0.4 so every gap is equal (rule 14)
  const sn = snap(RT[key].v, u); const N = sn.pts.length; if (N < 3) return null;
  const pts = sn.pts.map(p => p.slice()); const e0 = D8[sn.dirs[0]], e1 = D8[sn.dirs[N - 2]];
  pts[0] = [pts[0][0] - e0[0] * 0.4, pts[0][1] - e0[1] * 0.4]; pts[N - 1] = [pts[N - 1][0] + e1[0] * 0.4, pts[N - 1][1] + e1[1] * 0.4];
  const rad = pts.map((p, i) => (i === 0 || i === N - 1) ? 0.8 : 0.4);
  const x0 = Math.min(...pts.map((p, i) => p[0] - rad[i])), x1 = Math.max(...pts.map((p, i) => p[0] + rad[i]));
  const y0 = Math.min(...pts.map((p, i) => p[1] - rad[i])), y1 = Math.max(...pts.map((p, i) => p[1] + rad[i]));
  return { pts, rad, dirs: sn.dirs, N, w: x1 - x0, h: y1 - y0, mx: (x0 + x1) / 2, my: (y0 + y1) / 2, clash: clash(sn.pts) };
}
const _best = {};
function bestShape(key, pitch, fw, fh) { // the finest scale that fits the field at this pitch with no clash (rule 18)
  const id = key + '|' + pitch + '|' + fw + '|' + fh; if (id in _best) return _best[id];
  let best = null;
  for (let u = 60; u <= 1800; u += 10) { const s = shape(key, u); if (!s || s.clash || s.N > 16 || s.w * pitch > fw + 0.01 || s.h * pitch > fh + 0.01) continue; if (!best || s.N > best.N) best = s; }
  return (_best[id] = best);
}

// ---------- drawing ----------
const c = (x, y, r, fill) => `<circle cx="${+x.toFixed(2)}" cy="${+y.toFixed(2)}" r="${+r.toFixed(2)}" fill="${fill}"/>`;
const tok = (x, y, d, cols) => cols.map((col, i) => (col ? c(x, y, d / 2 * FR[i], col) : '')).join('');
function disc(cx, cy, d, route, letters = '#ffffff') {
  const k = d / 39300; // traced master: 3930-unit box, path in 0.1 units, y up
  return c(cx, cy, d / 2, ROUTE[route]) + `<path transform="translate(${(cx - d / 2).toFixed(2)} ${(cy + d / 2).toFixed(2)}) scale(${k} ${-k})" fill="${letters}" d="${DISC[route]}"/>`;
}
const head = ink => text(48, 53, 'New York City Transit Authority', { size: 14, weight: 400, fill: ink }) + text(330, 53, 'Subway map 1972', { size: 14, weight: 400, fill: ink });
function caption(route, rows, ink, flags) { // disc 176 on the margin, three lines centred on it (rules 5–6)
  const y0 = 1048 + 15 - (rows.length - 1) * 47 / 2; let s = disc(136, 1048, 176, route);
  rows.forEach((t, i) => { s += text(256, y0 + i * 47, t, { size: 42, weight: 300, fill: ink }); if (256 + measure(t, { size: 42, weight: 300 }).w > W - 40) flags.push({ level: 'warn', text: `Caption line “${t}” runs past the right margin.` }); });
  if (rows.length > 3) flags.push({ level: 'fail', text: 'Caption has more than three lines.' });
  return s;
}
const title = (t, ink) => text(48, 1129, t, { size: 40, weight: 300, fill: ink });

function checkTokens(items, flags, { centre = true, gap = null } = {}) { // rules 14, 15, 17, 21
  let over = 0; for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) if (Math.hypot(items[i].x - items[j].x, items[i].y - items[j].y) < items[i].r + items[j].r - 0.05) over++;
  if (over) flags.push({ level: 'fail', text: `${over} token pair${over > 1 ? 's' : ''} overlap.` });
  const x0 = Math.min(...items.map(t => t.x - t.r)), x1 = Math.max(...items.map(t => t.x + t.r)), y0 = Math.min(...items.map(t => t.y - t.r)), y1 = Math.max(...items.map(t => t.y + t.r));
  if (centre && Math.abs((x0 + x1) / 2 - 480) > 1) flags.push({ level: 'fail', text: 'The figure is off the centre axis.' });
  if (x0 < 48 - 0.5 || x1 > W - 48 + 0.5 || y0 < 72) flags.push({ level: 'fail', text: 'Tokens run into the margins.' });
  if (gap !== null) for (let i = 1; i < items.length; i++) { const g = Math.hypot(items[i].x - items[i - 1].x, items[i].y - items[i - 1].y) - items[i].r - items[i - 1].r; if (Math.abs(g - gap) > 0.5) { flags.push({ level: 'fail', text: 'Gaps between tokens are not equal.' }); break; } }
  return { x0, x1, y0, y1 };
}

const K = {};
K.trail = (p, bg, ink, flags) => {
  const key = TRAILS.includes(p.route) ? p.route : '1', main = inkOfRoute(key), cap = p.caption;
  const fw = 768, fh = cap ? 748 : 920, cx = 480, cy = cap ? 508 : 604;
  const s = bestShape(key, p.pitch, fw, fh);
  if (!s) { flags.push({ level: 'fail', text: 'This route does not fit the field at this pitch. Lower the pitch.' }); return head(ink); }
  const N = s.N, cr = {}; let last = -9;
  for (const x of crossings(key)) { if (bg === DARK && x.ink === 'black') continue; const i = Math.round(x.t * (N - 1)); if (i > 1 && i < N - 2 && i - last >= 3) { cr[i] = PAL[x.ink]; last = i; } }
  const items = s.pts.map((q, i) => ({ x: cx + (q[0] - s.mx) * p.pitch, y: cy + (q[1] - s.my) * p.pitch, r: s.rad[i] * p.pitch }));
  let g = '';
  items.forEach((t, i) => {
    const end = i === 0 || i === N - 1, corner = !end && s.dirs[i - 1] !== s.dirs[i];
    g += cr[i] ? tok(t.x, t.y, t.r * 2, [cr[i], main, bg]) : corner ? tok(t.x, t.y, t.r * 2, [main]) : tok(t.x, t.y, t.r * 2, [main, bg, main]);
  });
  checkTokens(items, flags, { gap: 0.2 * p.pitch });
  for (let i = 1; i < N; i++) { const a = Math.atan2(items[i].y - items[i - 1].y, items[i].x - items[i - 1].x) / (Math.PI / 4); if (Math.abs(a - Math.round(a)) > 0.01) { flags.push({ level: 'fail', text: 'A segment is off the 0/45/90° angles.' }); break; } }
  if (N < 7) flags.push({ level: 'warn', text: `Only ${N} tokens. Lower the pitch for a fuller trail.` });
  if (cap) { const lg = key === 'SSfr' ? ['Shuttle', FD.R.SSF[0][0], FD.R.SSF[FD.R.SSF.length - 1][0]] : [FD.LEG[key][0], FD.LEG[key][2], FD.LEG[key][3]]; g += caption(discKey(key), lg, ink, flags); }
  return g + head(ink);
};
K.stations = (p, bg, ink, flags) => {
  const key = GRIDS[p.route] ? p.route : 'LL', main = ROUTE[key], st = FD.R[key], n = st.length, cols = GRIDS[key], rows = Math.ceil(n / cols);
  const pitch = p.pitch * 1.25, d = pitch * 0.8, cy = p.caption ? 508 : 604, x0 = 480 - (cols - 1) * pitch / 2, y0 = cy - (rows - 1) * pitch / 2;
  const items = []; let g = '';
  for (let i = 0; i < n; i++) { const x = x0 + (i % cols) * pitch, y = y0 + Math.floor(i / cols) * pitch; items.push({ x, y, r: d / 2 }); g += (i === 0 || i === n - 1) ? tok(x, y, d, [main]) : tok(x, y, d, [main, bg, main]); }
  const bb = checkTokens(items, flags);
  if (bb.y1 > (p.caption ? 944 : 1136)) flags.push({ level: 'fail', text: 'The grid runs into the caption. Lower the pitch.' });
  if (n % cols) flags.push({ level: 'fail', text: 'The last row is not full.' });
  if (p.caption) g += caption(key, [FD.LEG[key][0], n + ' stations'], ink, flags);
  return g + head(ink);
};
K.express = (p, bg, ink, flags) => {
  const X = FD.X['7Av'], n = X.st.length, cols = 6, rows = Math.ceil(n / cols), pitch = p.pitch * 1.25, d = pitch * 0.8, cy = p.caption ? 508 : 604;
  const x0 = 480 - (cols - 1) * pitch / 2, y0 = cy - (rows - 1) * pitch / 2; const items = []; let g = '';
  for (let i = 0; i < n; i++) { const x = x0 + (i % cols) * pitch, y = y0 + Math.floor(i / cols) * pitch; items.push({ x, y, r: d / 2 }); g += X.exp.includes(i) ? tok(x, y, d, [PAL.red, PAL.orange, bg]) : tok(x, y, d, [PAL.orange, bg, PAL.orange]); }
  checkTokens(items, flags);
  if (p.caption) g += caption('1', ['Broadway Local', X.st[0][0] + '–' + X.st[n - 1][0], X.exp.length + ' express stops'], ink, flags);
  return g + head(ink);
};
K.rings = (p, bg, ink, flags) => {
  const v = p.variant, set = v === 'inks' ? INKS.map(i => PAL[i[0]]) : (v === 'numbers' ? ROUTES.slice(18) : v === 'letters' ? ROUTES.slice(0, 18) : ROUTES).map(r => ROUTE[r]);
  const n = set.length, R0 = 432, step = R0 / (n === 26 ? 27 : n + 0.5), cy = p.caption ? 574 : 600; let g = '';
  set.forEach((col, i) => { const rad = R0 - i * step; g += c(480, cy, rad, col) + c(480, cy, rad - step * 0.62, bg); });
  const label = (VARIANTS.rings.find(o => o[0] === v) || VARIANTS.rings[0])[1];
  return g + head(ink) + (p.caption ? title(label, ink) : '');
};
K.discs = (p, bg, ink, flags) => {
  let g = ''; const items = [];
  if (p.variant === 'rows') {
    const cs = 120, d = 100, y0 = 600 - 4 * cs;
    INKS.forEach((row, j) => { const rs = row[2], x0 = 480 - rs.length * cs / 2; rs.forEach((r, i) => { const x = x0 + i * cs + cs / 2, y = y0 + j * cs + cs / 2; items.push({ x, y, r: d / 2 }); g += disc(x, y, d, r); }); });
  } else if (p.variant === 'inks') {
    INKS.forEach((row, i) => { const cx = 136 + (i % 2) * 456, cy = 253 + Math.floor(i / 2) * 240, col = PAL[row[0]]; items.push({ x: cx, y: cy, r: 88 }); g += tok(cx, cy, 176, [col, bg, col, bg]);
      g += text(cx + 112, cy - 12, row[1] + (INKNAME[row[0]] ? ' ' + INKNAME[row[0]] : ''), { size: 20, weight: 500, fill: ink }) + text(cx + 112, cy + 23, row[2].join(', '), { size: 30, weight: 300, fill: ink }); });
  } else {
    const cs = 144, y0 = 204, cell = (r, x, y) => { const k = Object.keys(PAL).find(n => PAL[n] === ROUTE[r]); g += `<rect x="${x}" y="${y}" width="${cs}" height="${cs}" fill="${PAL[PARTNER[k]]}"/>`; items.push({ x: x + cs / 2, y: y + cs / 2, r: cs * 0.43 }); return disc(x + cs / 2, y + cs / 2, cs * 0.86, r); };
    let top = ''; for (let i = 0; i < 18; i++) top += cell(ROUTES[i], 48 + (i % 6) * cs, y0 + Math.floor(i / 6) * cs);
    for (let i = 0; i < 8; i++) top += cell(ROUTES[18 + i], 192 + (i % 4) * cs, y0 + 3 * cs + 72 + Math.floor(i / 4) * cs);
    g += top;
  }
  checkTokens(items, flags, { centre: p.variant !== 'inks' });
  return g + head(ink);
};
K.pairs = (p, bg, ink, flags) => {
  const three = p.variant === 'three', d = three ? 220 : 352, gap = d / 8, cy = p.caption ? 508 : 604, items = []; let g = '';
  for (const r of (three ? [-1, 0, 1] : [0])) for (const s of [-1, 1]) { const x = 480 + s * (d + gap) / 2, y = cy + r * (d + gap); items.push({ x, y, r: d / 2 }); g += tok(x, y, d, [PAL.green, bg, PAL.green]); }
  checkTokens(items, flags);
  if (p.caption) g += caption('SS', three ? ['Shuttles', 'Times Square–Grand Central', 'Franklin Av · Culver'] : ['Shuttle', 'Times Square', 'Grand Central'], ink, flags);
  return g + head(ink);
};
K.network = (p, bg, ink, flags) => {
  const one = INKS.find(i => i[0] === p.variant), keys = Object.keys(RT).filter(k => !one || INKOF[RT[k].ink] === one[0]);
  const all = [].concat(...keys.map(k => RT[k].v)), xs = all.map(q => q[0]), ys = all.map(q => q[1]);
  const bx = one ? [104, 148, 752, 852] : [60, 137, 840, 880], sp = one ? 26 : 17, ro = one ? 8 : 5.2, ri = one ? 2.8 : 1.8, sw = one ? 3.6 : 2.4;
  const X0 = Math.min(...xs), X1 = Math.max(...xs), Y0 = Math.min(...ys), Y1 = Math.max(...ys), k = Math.min(bx[2] / (X1 - X0), bx[3] / (Y1 - Y0));
  const ox = bx[0] + (bx[2] - (X1 - X0) * k) / 2, oy = bx[1] + (bx[3] - (Y1 - Y0) * k) / 2 + (p.caption ? 0 : 24); let g = '';
  for (const key of keys) {
    const pts = RT[key].v.map(q => [ox + (q[0] - X0) * k, oy + (q[1] - Y0) * k]), col = PAL[INKOF[RT[key].ink]]; const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    const n = Math.max(2, Math.round(L / sp) + 1); let o = `<g fill="none" stroke="${col}" stroke-width="${sw}">`, inn = `<g fill="${col}">`;
    for (let s = 0; s < n; s++) { let t = s * L / (n - 1), i = 0; while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++; } const f = seg[i] ? Math.min(1, t / seg[i]) : 0; const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
      o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${ro}"/>`; inn += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${ri}"/>`; }
    g += o + '</g>' + inn + '</g>';
  }
  if (one && bg === DARK && one[0] === 'black') flags.push({ level: 'fail', text: 'Black routes need the light ground.' });
  const label = one ? one[1] + ' · ' + one[2].filter(r => r !== 'HH').join(', ') : '33 lines and branches';
  return g + head(ink) + (p.caption ? title(label, ink) : '');
};
K.stripes = (p, bg, ink, flags, uid) => {
  const per = 36, cx = 480, cy = p.caption ? 508 : 604, rad = 333, top = cy - 387; let a = '', b = '';
  for (let k = 0; k < 22; k++) a += `<rect x="0" y="${top + k * per}" width="${W}" height="18" fill="${PAL.green}"/>`;
  for (let k = 0; k < 21; k++) b += `<rect x="${cx - rad}" y="${top + 18 + k * per}" width="${rad * 2}" height="18" fill="${PAL.green}"/>`;
  const g = a + c(cx, cy, rad, bg) + `<clipPath id="${uid}c"><circle cx="${cx}" cy="${cy}" r="${rad}"/></clipPath><g clip-path="url(#${uid}c)">${b}</g>`;
  return g + head(ink) + (p.caption ? caption('SS', ['Shuttles', 'Times Square–Grand Central', 'Franklin Av · Culver'], ink, flags) : '');
};
K.screens = (p, bg, ink, flags) => {
  const cx = 480, cy = p.caption ? 574 : 600, RR = 400, sp = 46; let g = '';
  for (const [col, ang] of [[PAL.magenta, 15], [PAL.blue312, 75], [PAL.yellow, 0]]) {
    const a = ang * Math.PI / 180, co = Math.cos(a), si = Math.sin(a); let s = `<g fill="${col}" style="mix-blend-mode:multiply">`;
    for (let u = -22; u <= 22; u++) for (let v = -22; v <= 22; v++) { const x = cx + (u * co - v * si) * sp, y = cy + (u * si + v * co) * sp, t = 1 - (y - (cy - RR)) / (2 * RR), r = sp * 0.5 * Math.sqrt(Math.max(0, Math.min(1, 0.08 + t * 0.9))); if (r < 3 || Math.hypot(x - cx, y - cy) + r > RR) continue; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>`; }
    g += s + '</g>';
  }
  if (bg !== LIGHT) flags.push({ level: 'fail', text: 'Screens overprint on the light ground only.' });
  return g + head(ink) + (p.caption ? title('Screens', ink) : '');
};

function blackOnDark(p) { // rule 4
  if (p.ground !== 'dark') return false;
  if (p.kind === 'trail') return inkOfRoute(TRAILS.includes(p.route) ? p.route : '1') === PAL.black;
  if (p.kind === 'stations') return ROUTE[GRIDS[p.route] ? p.route : 'LL'] === PAL.black;
  if (p.kind === 'rings') return true; // every ring set holds a black route
  if (p.kind === 'discs') return p.variant !== 'grid';
  return false;
}

export default {
  id: 'i',
  name: 'Tokens',
  blurb: 'Routes, stations, and inks of the 1972 map drawn as ring tokens.',
  async init() {
    RT = await load('R4_routes'); FD = await load('F_data');
    await Promise.all(ROUTES.map(async r => { const s = await loadText(`assets/discs/disc-${r}.svg`); DISC[r] = [...s.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map(m => m[1].replace(/\s+/g, ' ')).join(' '); }));
  },
  controls(p) {
    const out = [{ key: 'kind', label: 'Construction', type: 'select', options: KINDS.map(([value, label]) => ({ value, label })) }];
    if (p.kind === 'trail') out.push({ key: 'route', label: 'Route', type: 'select', options: TRAILS.map(r => ({ value: r, label: r === 'SSfr' ? 'SS · Franklin Av shuttle' : r + ' · ' + FD.LEG[r][0] })) });
    if (p.kind === 'stations') out.push({ key: 'route', label: 'Route', type: 'select', options: Object.keys(GRIDS).map(r => ({ value: r, label: r + ' · ' + FD.R[r].length + ' stations' })) });
    if (VARIANTS[p.kind]) out.push({ key: 'variant', label: p.kind === 'network' ? 'Ink' : 'Set', type: 'select', options: VARIANTS[p.kind].map(([value, label]) => ({ value, label })) });
    const grounds = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]; if (p.kind === 'network') grounds.push({ value: 'pink', label: 'Pink' });
    out.push({ key: 'ground', label: 'Ground', type: 'select', options: grounds, group: 'Colour' });
    if (['trail', 'stations', 'express'].includes(p.kind)) out.push({ key: 'pitch', label: 'Token pitch', type: 'range', min: 64, max: 112, step: 4, group: 'Tokens' });
    if (!(p.kind === 'discs')) out.push({ key: 'caption', label: p.kind === 'rings' || p.kind === 'network' || p.kind === 'screens' ? 'Title' : 'Disc and caption', type: 'toggle', group: 'Type' });
    return out;
  },
  random(r) {
    const bag = ['trail', 'trail', 'trail', 'trail', 'trail', 'trail', 'trail', 'trail', 'trail', 'trail', 'pairs', 'rings', 'discs', 'stations', 'stations', 'express', 'rings', 'rings', 'discs', 'discs', 'pairs', 'network', 'network', 'network', 'stripes', 'screens'];
    r(); r(); // neighbouring seeds start close together
    for (let tries = 0; tries < 40; tries++) {
      const kind = r.pick(bag), p = { kind, route: '1', variant: 'all', ground: r.chance(0.5) ? 'dark' : 'light', pitch: 88, caption: true };
      if (kind === 'trail') p.route = r.pick(TRAILS);
      if (kind === 'stations') p.route = r.pick(Object.keys(GRIDS));
      if (VARIANTS[kind]) p.variant = r.pick(VARIANTS[kind])[0];
      if (kind === 'network') p.ground = p.variant === 'all' ? 'pink' : 'light';
      if (kind === 'screens') p.ground = 'light';
      if (kind === 'stripes' || kind === 'express' || kind === 'pairs') p.ground = 'dark';
      if (kind === 'discs') p.ground = p.variant === 'grid' ? 'dark' : 'light';
      if (blackOnDark(p)) p.ground = 'light';
      if (!this.render(p, 'x').flags.some(f => f.level === 'fail')) return p;
    }
    return { kind: 'trail', route: '1', variant: 'all', ground: 'light', pitch: 88, caption: true };
  },
  render(p, uid) {
    const flags = [], bg = p.ground === 'dark' ? DARK : (p.ground === 'pink' && p.kind === 'network') ? PINK : LIGHT, ink = bg === DARK ? '#ffffff' : PAL.black;
    if (blackOnDark(p)) flags.push({ level: 'fail', text: 'Black routes need the light ground.' });
    const body = (K[p.kind] || K.trail)(p, bg, ink, flags, uid);
    return { svg: `<rect width="${W}" height="${H}" fill="${bg}"/>` + body, flags };
  },
};
