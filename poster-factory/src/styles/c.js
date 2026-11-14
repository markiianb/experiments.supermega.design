// C · Nomenclature — typography is the image. Rules: 40-Marketing/Visual-Experiments/NYCTA-Posters/C-RULES.md
// Every word comes from the 1970 manual, the 1972 map legend (data/F_data.json → LEG) or pp. 173–174 (data/nomenclature.json).
import { W, H, PAL, ROUTE, ROUTES, FONT, rng, esc, measure, fit, text, load } from '../core/ctx.js';

const M = 56, L = M, R = W - M, T = M, B = H - M, FW = R - L, FH = B - T, CAP = 0.714;
const HEX = Object.values(PAL);
const NAME = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [v, k]));
const lum = h => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; };
const onInk = g => (g === PAL.yellow || g === PAL.yellow109 || g === PAL.white) ? PAL.black : PAL.white;

let NOM = { numerical: [], alphabetical: [] }, LEG = {};

// ── subjects ────────────────────────────────────────────────────────────────
const STATEMENTS = {
  never:    { label: 'Never before. Never after.', lines: ['Never', 'before.', 'Never', 'after.'], accent: [2, 3] },
  point:    { label: 'Only at the point of decision.', lines: ['Only at', 'the point', 'of decision.'], accent: [] },
  abbr:     { label: 'Av, St, Blvd', lines: ['Av', 'St', 'Blvd'], accent: [] },
  kinds:    { label: 'Identification, Directional, Information', lines: ['Identification', 'Directional', 'Information'], accent: [] },
  longest:  { label: 'Van Cortland Park—Manhattan College—242 St', lines: ['Van Cortland', 'Park—', 'Manhattan', 'College—', '242 St'], accent: [] },
  bowery:   { label: 'Bowery', lines: ['Bowery'], accent: [] },
  manual:   { label: 'Massimo Vignelli, Bob Noorda', lines: ['Massimo', 'Vignelli', 'Bob', 'Noorda'], accent: [2, 3] },
  colophon: { label: 'Graphics Standards Manual', lines: ['Graphics', 'Standards', 'Manual'], accent: [] },
  updown:   { label: 'Uptown, Downtown', lines: ['Uptown', '& The Bronx', 'Downtown', '& Brooklyn'], accent: [2, 3] },
};
const REPEATS = {
  manhattan: { label: 'Manhattan', lines: ['Manhattan', 'Manhattan', 'Manhattan', 'Manhattan', 'Manhattan', 'Manhattan', 'Manhattan'], accent: [4] },
  express:   { label: 'Express, Local', lines: ['Express', 'Express', 'Local', 'Express', 'Express'], accent: [2] },
  local:     { label: 'Local, Express', lines: ['Local', 'Local', 'Local', 'Express', 'Local', 'Local'], accent: [3] },
  uptown:    { label: 'Uptown, Downtown', lines: ['Uptown', 'Uptown', 'Uptown', 'Downtown', 'Uptown', 'Uptown'], accent: [3] },
};
const VERTICALS = {
  divisions: { label: 'IRT, IND, BMT', words: ['IRT', 'IND', 'BMT'], accent: 1, weight: 700 },
  boroughs:  { label: 'The Bronx, Brooklyn, Manhattan, Queens', words: ['The Bronx', 'Brooklyn', 'Manhattan', 'Queens'], accent: 2, weight: 700 },
  updown:    { label: 'Uptown, Downtown (diagonal)', diagonal: 'updown' },
};
const OVERPRINTS = {
  '8av':  { label: 'A E — 8 Av Express', glyphs: ['A', 'E'], title: ['8 Av Express'] },
  '7av':  { label: '2 3 — 7 Av Express', glyphs: ['2', '3'], title: ['7 Av Express'] },
  lex:    { label: '4 6 — Lexington Av', glyphs: ['4', '6'], title: ['Lexington Av'] },
  '6av':  { label: 'D F — Av of Americas (6 Av) Express', glyphs: ['D', 'F'], title: ['Av of Americas', '(6 Av) Express'] },
  bronx:  { label: '1 2 3 — Uptown & The Bronx', glyphs: ['1', '2', '3'], title: ['Uptown', '& The Bronx'] },
  bway:   { label: 'N RR — Broadway', glyphs: ['N', 'R'], title: ['Broadway'] },
};
delete OVERPRINTS.bway; // RR is a double letter; a lone R is not a route
const STACKS = {
  pms:     { label: 'Colour coding (PMS)' },
  numbers: { label: 'Routes 1 to 8' },
  letters: { label: 'Routes A to N' },
  doubles: { label: 'Double letters' },
};
const SPLITS = {
  inout: { label: 'in, out', words: ['in', 'out'], weight: 500 },
  local: { label: 'Local, Express', words: ['Local', 'Express'], weight: 500 },
};
const SUFFIX = ['Parkway', 'Blvd', 'Park', 'Plaza', 'Rd', 'Sq', 'Heights', 'Hall'];
const WORDS = ['Rockaway', 'Broadway', 'Grand', 'Myrtle', 'Bedford', 'Park', 'Hall', 'Parkway', 'Blvd', 'Plaza', 'Avenue'];

const oneDash = s => (s.match(/—/g) || []).length === 1;
function suffixFirsts(word) { return NOM.alphabetical.filter(s => !s.includes('—') && s.endsWith(' ' + word)).map(s => s.slice(0, -word.length - 1)).filter((v, i, a) => a.indexOf(v) === i); }
function wordNames(word) {
  const re = new RegExp('(^|[ —])' + word + '($|[ —])');
  const all = [...NOM.alphabetical, ...NOM.numerical].filter(s => re.test(s) && s.length <= 30).filter((v, i, a) => a.indexOf(v) === i);
  if (word === 'Avenue') return NOM.alphabetical.filter(s => /^Avenue [A-Z]$/.test(s));
  const plain = all.filter(s => !s.includes('—') && s.length <= 20); return plain.length >= 4 ? plain : all.filter(s => s.length <= 22);
}
function listSubjects() {
  const o = { first: { label: 'Numerical, the first fifteen' }, pairs: { label: 'Avenue and Street' }, legend: { label: 'Route legend 1972' }, compounds: { label: 'Numbered names with a dash' } };
  for (const w of WORDS) if (wordNames(w).length >= 3) o['w:' + w] = { label: w };
  return o;
}
function columnSubjects() { const o = {}; for (const w of SUFFIX) if (suffixFirsts(w).length >= 4) o[w] = { label: w }; return o; }
const NUMCOLS = { beach: { label: 'Beach' }, numbered: { label: 'Numbered names' } };
const INDEXES = { alphabetical: { label: 'Alabama Av to Zerega Av' }, numerical: { label: '1 Avenue to 242 Street' } };
const AXES = { dash: { label: 'The dash' }, Broadway: { label: 'Broadway' }, Parkway: { label: 'Parkway' } };
const routeSubjects = () => Object.fromEntries(ROUTES.filter(d => LEG[d]).map(d => [d, { label: d + ' — ' + LEG[d][0] }]));

const KINDS = {
  route:     { label: 'Route letter', subjects: routeSubjects, title: true },
  statement: { label: 'Statement', subjects: () => Object.fromEntries(Object.entries(STATEMENTS).filter(([k]) => k !== 'updown')) },
  repeat:    { label: 'Repetition', subjects: () => REPEATS },
  list:      { label: 'List, margin to margin', subjects: listSubjects, pick: true },
  columns:   { label: 'Two-column list', subjects: columnSubjects, pick: true },
  stack:     { label: 'Colour stack', subjects: () => STACKS, fixedColour: true },
  vertical:  { label: 'Rotated words', subjects: () => VERTICALS },
  overprint: { label: 'Numerals, overprinted', subjects: () => OVERPRINTS, title: true, fixedColour: true },
  numcol:    { label: 'Numeral column', subjects: () => NUMCOLS, title: true, pick: true },
  index:     { label: 'First and last, with index', subjects: () => INDEXES },
  axis:      { label: 'Names on an axis', subjects: () => AXES, pick: true },
  split:     { label: 'Two words, split ground', subjects: () => SPLITS },
};

// ── drawing with an ink ledger ──────────────────────────────────────────────
function sheet(ground) {
  const out = [`<rect width="${W}" height="${H}" fill="${ground}"/>`], boxes = [], fills = new Set([ground]), sizes = new Set();
  const adv = (s, o) => { const m = measure(s, o); return m.w + (o.tracking || 0) * o.size; };
  // one line; x,y = baseline origin. meta: {hang, free, role}
  function put(x, y, str, o, meta = {}) {
    const m = measure(str, o); let l, r;
    if (o.anchor === 'end') { const a = adv(str, o); l = x - a - m.left; r = x - a + m.right; }
    else if (o.anchor === 'middle') { const a = adv(str, o); l = x - a / 2 - m.left; r = x - a / 2 + m.right; }
    else { l = x - m.left; r = x + m.right; }
    boxes.push({ str, l, r, t: y - m.ascent, b: y + m.descent, base: y, size: o.size, capTop: y - o.size * CAP, ...meta });
    fills.add(o.fill); if (!meta.nosize) sizes.add(Math.round(o.size));
    out.push(text(x, y, str, o)); return m;
  }
  // a line made of coloured runs, ink-left on x
  function runs(x, y, parts, o, meta = {}) {
    const whole = parts.map(p => p.t).join(''); const m = measure(whole, o); let cx = x + m.left;
    boxes.push({ str: whole, l: x, r: x + m.left + m.right, t: y - m.ascent, b: y + m.descent, base: y, size: o.size, capTop: y - o.size * CAP, ...meta });
    sizes.add(Math.round(o.size));
    let pos = 0; for (const p of parts) { const lead = p.t.length - p.t.trimStart().length, t = p.t.trim(); if (t) { fills.add(p.fill); out.push(text(cx + (pos + lead ? adv(whole.slice(0, pos + lead), o) : 0), y, t, { ...o, fill: p.fill })); } pos += p.t.length; }
    return m;
  }
  const inkL = (x, str, o) => x + measure(str, o).left;          // origin so that the ink starts on x
  return { out, boxes, fills, sizes, put, runs, inkL, adv, raw: s => out.push(s), box: b => boxes.push(b) };
}
const hasDesc = s => /[gjpqyQ,;]/.test(s);
function title(S, linesArr, fill) { const o = { size: 64, weight: 500, tracking: -0.015, fill }; linesArr.forEach((s, i) => S.put(S.inkL(L, s, o), T + 64 * CAP + i * 72, s, o, { role: 'title' })); }
function splitTitle(s) { if (measure(s, { size: 64, weight: 500, tracking: -0.015 }).w <= FW) return [s]; const sp = [...s].map((c, i) => c === ' ' ? i : -1).filter(i => i > 0); const mid = s.length / 2; const k = sp.reduce((a, b) => Math.abs(b - mid) < Math.abs(a - mid) ? b : a, sp[0]); return [s.slice(0, k), s.slice(k + 1)]; }

// A block of lines: fitted to 848 where it can be, then spanned margin to margin or set on the bottom margin.
function block(S, arr, { weight = 500, tracking = -0.04, fills, maxSize = 1e4, top = T }) {
  const o100 = { weight, tracking };
  const widest = arr.reduce((a, b) => (measure(b, { size: 100, ...o100 }).w > measure(a, { size: 100, ...o100 }).w ? b : a));
  let s = Math.min(fit(widest, FW, o100), maxSize); const n = arr.length; const span = B - top;
  const desc = arr.slice(0, -1).some(hasDesc); const minP = desc ? 0.98 : 0.84;
  let mode = 'span', pitch = 0;
  if (n === 1) mode = 'bottom';
  else { pitch = (span - CAP * s) / (n - 1); if (pitch < minP * s) { s = span / (minP * (n - 1) + CAP); pitch = minP * s; } else if (pitch > 1.45 * s && n <= 3) mode = 'bottom'; }
  const o = { size: s, weight, tracking };
  if (mode === 'bottom') { pitch = 1.04 * s; const last = measure(arr[n - 1], o); const y0 = B - last.descent - (n - 1) * pitch; arr.forEach((t, i) => S.put(S.inkL(L, t, o), y0 + i * pitch, t, { ...o, fill: fills[i] })); }
  else arr.forEach((t, i) => S.put(S.inkL(L, t, o), top + CAP * s + i * pitch, t, { ...o, fill: fills[i] }, { hang: i === n - 1 }));
  return s;
}
function subset(arr, n, pick) { if (arr.length <= n) return arr; const r = rng(pick * 7919 + 13); const idx = r.shuffle(arr.map((_, i) => i)).slice(0, n).sort((a, b) => a - b); return idx.map(i => arr[i]); }

// ── constructions ───────────────────────────────────────────────────────────
const DRAW = {
  route(S, p) {
    const d = p.subject, leg = LEG[d]; const o = { weight: 700, tracking: d.length > 1 ? -0.05 : 0 };
    let s = fit(d, FW, o); if (d.length === 1) s = Math.min(s, 860 / CAP);
    S.put(S.inkL(L, d, { size: s, ...o }), B, d, { size: s, ...o, fill: p.ink }, { hang: true, round: true });
    if (p.title && leg) title(S, splitTitle(leg[0]), p.ground === PAL.white ? PAL.black : (lum(p.ground) < 0.2 ? PAL.white : p.ink));
  },
  statement(S, p) { const st = STATEMENTS[p.subject]; block(S, st.lines, { fills: st.lines.map((_, i) => st.accent.includes(i) ? p.accent : p.ink) }); },
  repeat(S, p) { const st = REPEATS[p.subject]; block(S, st.lines, { fills: st.lines.map((_, i) => st.accent.includes(i) ? p.accent : p.ink) }); },
  list(S, p) {
    const k = p.subject; let rows; // rows: arrays of {t, fill}
    const plain = (t, f) => [{ t, fill: f || p.ink }];
    if (k === 'legend') {
      const ds = ROUTES.filter(d => LEG[d]); const s = FH / (1.229 * (ds.length - 1) + CAP); const o = { size: s, tracking: -0.015 }; const pitch = (FH - CAP * s) / (ds.length - 1);
      ds.forEach((d, i) => { const y = T + CAP * s + i * pitch; S.put(S.inkL(L, d, { ...o, weight: 700 }), y, d, { ...o, weight: 700, fill: p.accent }, { hang: true }); S.put(S.inkL(L + 4.9 * s, LEG[d][0], { ...o, weight: 500 }), y, LEG[d][0], { ...o, weight: 500, fill: p.ink }, { hang: true }); });
      return;
    }
    if (k === 'first') rows = NOM.numerical.slice(0, 15).map(t => plain(t, t.includes('—') ? p.accent : p.ink));
    else if (k === 'pairs') { const nums = NOM.numerical.filter(t => / Avenue$/.test(t) && NOM.numerical.includes(t.replace('Avenue', 'Street'))).map(t => t.split(' ')[0]); rows = subset(nums, 5, p.pick).flatMap(n => [plain(n + ' Avenue'), plain(n + ' Street', p.accent)]); }
    else if (k === 'compounds') rows = subset(NOM.numerical.filter(t => oneDash(t) && t.length <= 22), 12, p.pick).map(t => { const [a, b] = t.split('—'); return [{ t: a, fill: p.ink }, { t: '—', fill: p.accent }, { t: b, fill: p.ink }]; });
    else { const w = k.slice(2); rows = subset(wordNames(w), 12, p.pick).map(t => { const i = t.indexOf(w); return [{ t: t.slice(0, i), fill: p.accent }, { t: w, fill: p.ink }, { t: t.slice(i + w.length), fill: p.accent }]; }); }
    const n = rows.length, o100 = { weight: 500, tracking: -0.03 }; const strs = rows.map(r => r.map(x => x.t).join(''));
    const wmax = Math.max(...strs.map(t => { const m = measure(t, { size: 100, ...o100 }); return m.left + m.right; }));
    let s = 100 * FW / wmax; let pitch, y0;
    if (n <= 5) { pitch = 1.04 * s; y0 = B - measure(strs[n - 1], { size: s, ...o100 }).descent - (n - 1) * pitch; }
    else { s = Math.min(s, FH / (1.12 * (n - 1) + CAP)); pitch = (FH - CAP * s) / (n - 1); y0 = T + CAP * s; }
    const o = { size: s, ...o100 }; rows.forEach((r, i) => S.runs(L, y0 + i * pitch, r, o, { hang: n > 5 && i === n - 1 }));
  },
  columns(S, p) {
    const w = p.subject, firsts = subset(suffixFirsts(w), 10, p.pick), n = firsts.length, o100 = { weight: 500, tracking: -0.03 };
    const fw = Math.max(...firsts.map(t => { const m = measure(t, { size: 100, ...o100 }); return m.left + m.right; })), mw = measure(w, { size: 100, ...o100 }), ww = mw.left + mw.right, gap = 26;
    let s = Math.min(100 * FW / (fw + gap + ww), FH / (1.12 * (n - 1) + CAP)); const o = { size: s, ...o100 }; const tight = n <= 5, pitch = tight ? 1.12 * s : (FH - CAP * s) / (n - 1), y0 = tight ? B - 0.22 * s - (n - 1) * pitch : T + CAP * s;
    const total = (fw + gap + ww) * s / 100, x0 = L + (FW - total) / 2, xa = x0 + fw * s / 100;
    firsts.forEach((t, i) => { const y = y0 + i * pitch; const m = measure(t, o); const a = m.w + o.tracking * s; S.put(xa - m.right + a, y, t, { ...o, fill: p.ink, anchor: 'end' }, { hang: true }); S.put(S.inkL(xa + gap * s / 100, w, o), y, w, { ...o, fill: p.accent }, { hang: true }); });
  },
  stack(S, p) {
    const k = p.subject; let rows; const pms = [['PMS 130 Yellow', PAL.yellow], ['PMS 165 Orange', PAL.orange], ['PMS 185 Red', PAL.red], ['PMS 239 Magenta', PAL.magenta], ['PMS 354 Green', PAL.green], ['PMS 312 Blue', PAL.blue312], ['PMS 300 Blue', PAL.blue300], ['Black', PAL.black]];
    if (k === 'pms') rows = [...pms.map(([n, c]) => [n, ROUTES.filter(d => ROUTE[d] === c).sort((a, b) => (/\d/.test(a) ? 0 : 1) - (/\d/.test(b) ? 0 : 1)).join('  '), c, 500]), ['Grey', 'Street-level signs', PAL.grey, 500], ['Warm Red', 'Exit', PAL.warmRed, 500], ['PMS 109 Yellow', 'Transfer', PAL.yellow109, 500]];
    else { const ds = k === 'numbers' ? ['1', '2', '3', '4', '5', '6', '7', '8'] : k === 'letters' ? ['A', 'B', 'D', 'E', 'F', 'M', 'N'] : ['AA', 'CC', 'EE', 'GG', 'KK', 'LL', 'RR']; rows = ds.map(d => [d, LEG[d][0], ROUTE[d], 700]); }
    const bh = H / rows.length, s = k === 'numbers' ? 64 : 58, o = { size: s, tracking: -0.015 };
    rows.forEach(([a, b, c, wt], i) => { S.raw(`<rect x="0" y="${(i * bh).toFixed(2)}" width="${W}" height="${(bh + 0.5).toFixed(2)}" fill="${c}"/>`); S.fills.add(c); const ink = onInk(c), y = i * bh + bh / 2 + CAP * s / 2;
      S.put(S.inkL(L, a, { ...o, weight: wt }), y, a, { ...o, weight: wt, fill: ink }, { band: true }); const m = measure(b, { ...o, weight: 500 }); S.put(R - m.right, y, b, { ...o, weight: 500, fill: ink }, { band: true }); });
  },
  vertical(S, p) {
    const v = VERTICALS[p.subject];
    if (v.diagonal) { const st = STATEMENTS[v.diagonal], o100 = { weight: 500, tracking: -0.03 }, n = st.lines.length; const wmax = Math.max(...st.lines.map(t => { const m = measure(t, { size: 100, ...o100 }); return m.left + m.right; }));
      const s = 100 * FW * Math.SQRT2 / (wmax + 100 * (CAP + 0.95 * (n - 1))), o = { size: s, ...o100 }, wb = wmax * s / 100, hb = s * (CAP + 0.95 * (n - 1)); const g = [];
      st.lines.forEach((t, i) => { const f = st.accent.includes(i) ? p.accent : p.ink; S.fills.add(f); g.push(text(480 - wb / 2 + measure(t, o).left, 600 - hb / 2 + CAP * s + i * 0.95 * s, t, { ...o, fill: f })); });
      S.sizes.add(Math.round(s)); const side = (wb + hb) / Math.SQRT2; S.raw(`<g transform="rotate(-45 480 600)">${g.join('')}</g>`); S.box({ str: 'diagonal block', l: 480 - side / 2, r: 480 + side / 2, t: 600 - side / 2, b: 600 + side / 2, size: s, capTop: 600 - side / 2, base: 600 + side / 2 }); return; }
    const n = v.words.length, o100 = { weight: v.weight, tracking: -0.04 }; const longest = Math.max(...v.words.map(t => { const m = measure(t, { size: 100, ...o100 }); return m.left + m.right; }));
    const s = Math.min(100 * FH / longest, (FW / (n + (n - 1) * 0.12)) / CAP), o = { size: s, ...o100 }, cap = CAP * s;
    v.words.forEach((t, i) => { const f = i === v.accent ? p.accent : p.ink; const m = measure(t, o); const x = L + i * (FW - cap) / (n - 1) + cap, y = B - m.left; S.fills.add(f); S.sizes.add(Math.round(s));
      S.raw(text(x, y, t, { ...o, fill: f, rotate: -90 })); S.box({ str: t, l: x - cap, r: x, t: B - (m.left + m.right), b: B, base: B, size: s, capTop: B - (m.left + m.right), sideHang: hasDesc(t) }); });
  },
  overprint(S, p) {
    const v = OVERPRINTS[p.subject], o100 = { weight: 700, tracking: 0 }, ms = v.glyphs.map(g => measure(g, { size: 100, ...o100 })), ws = ms.map(m => m.left + m.right), sum = ws.reduce((a, b) => a + b, 0), ov = 0.14 * sum / ws.length;
    const s = 100 * FW / (sum - ov * (ws.length - 1)), o = { size: s, ...o100 }; let x = L; const g = [];
    v.glyphs.forEach((d, i) => { const m = measure(d, o), f = ROUTE[d]; S.fills.add(f); g.push(text(x + m.left, B, d, { ...o, fill: f })); S.box({ str: d, l: x, r: x + m.left + m.right, t: B - m.ascent, b: B + m.descent, base: B, size: s, capTop: B - CAP * s, hang: true, round: true }); x += (ws[i] - ov) * s / 100; });
    S.sizes.add(Math.round(s)); S.raw(`<g style="mix-blend-mode:multiply">${g.map(t => `<g style="mix-blend-mode:multiply">${t}</g>`).join('')}</g>`);
    if (p.title) title(S, v.title, PAL.black);
  },
  numcol(S, p) {
    let rows; if (p.subject === 'beach') rows = NOM.alphabetical.filter(t => /^Beach \d/.test(t)).map(t => { const m = t.match(/^Beach (\d+) (.*)$/); return [m[1], m[2]]; });
    else rows = subset(NOM.numerical.filter(t => oneDash(t) && / St—/.test(t) && t.length <= 24), 8, p.pick).map(t => { const i = t.indexOf(' '); return [t.slice(0, i), t.slice(i + 1)]; });
    const on = { size: 140, weight: 700, tracking: -0.04 }, om = { size: 64, weight: 500, tracking: -0.015 }, pitch = 120, n = rows.length;
    const nw = Math.max(...rows.map(r => { const m = measure(r[0], on); return m.left + m.right; })), rw = Math.max(...rows.map(r => { const m = measure(r[1], om); return m.left + m.right; })), gap = 22;
    const total = nw + gap + rw, x0 = L + (FW - total) / 2, xa = x0 + nw, hgt = CAP * 140 + (n - 1) * pitch, top = p.title && p.subject === 'beach' ? Math.max(T + 110, (H - hgt) / 2) : (H - hgt) / 2;
    rows.forEach((r, i) => { const y = top + CAP * 140 + i * pitch; const m = measure(r[0], on), a = m.w + on.tracking * 140; S.put(xa - m.right + a, y, r[0], { ...on, fill: p.ink, anchor: 'end' }, { round: true }); S.put(S.inkL(xa + gap, r[1], om), y, r[1], { ...om, fill: p.accent }, { hang: true }); });
    if (p.title && p.subject === 'beach') title(S, ['Beach'], p.ink);
  },
  index(S, p) {
    const all = p.subject === 'numerical' ? NOM.numerical.map(t => t.replace(/ \(see.*\)$/, '')) : NOM.alphabetical.filter((v, i, a) => a.indexOf(v) === i), first = all[0], last = all[all.length - 1], mid = all.slice(1, -1);
    const o = { size: 132, weight: 500, tracking: -0.035 }; S.put(S.inkL(L, first, o), T + CAP * 132, first, { ...o, fill: p.ink });
    const ml = measure(last, o); S.put(S.inkL(L, last, o), B - ml.descent, last, { ...o, fill: p.accent });
    const top = T + CAP * 132, bot = B - ml.descent - CAP * 132, room = bot - top, target = room - 184; let s = 22, rowsOut = [];
    for (let it = 0; it < 6; it++) { const oi = { size: s, weight: 400, tracking: 0 }, sp = measure(',  ', oi).w; rowsOut = []; let cur = '', cw = 0;
      for (let i = 0; i < mid.length; i++) { const piece = mid[i] + (i < mid.length - 1 ? ',' : ''), pw = measure(piece, oi).w; if (cur && cw + sp + pw > FW) { rowsOut.push(cur); cur = piece; cw = pw; } else { cur = cur ? cur + '  ' + piece : piece; cw = cur === piece ? pw : cw + sp + pw; } }
      if (cur) rowsOut.push(cur); const hgt = rowsOut.length * s * 1.28; if (Math.abs(hgt - target) < 12) break; s = Math.max(12, s * Math.sqrt(target / hgt)); }
    const oi = { size: s, weight: 400, tracking: 0, fill: p.ink }, lh = s * 1.28, hgt = (rowsOut.length - 1) * lh + CAP * s, y0 = top + (room - hgt) / 2 + CAP * s;
    rowsOut.forEach((t, i) => S.put(L, y0 + i * lh, t, oi, { hang: true, index: true }));
  },
  axis(S, p) {
    const k = p.subject; let rows; // [left, mid, right]
    if (k === 'dash') { const pool = [...NOM.alphabetical, ...NOM.numerical].filter(t => oneDash(t)).map(t => t.split('—')).filter(([a, b]) => a.length <= 15 && b.length <= 16); rows = subset(pool, 13, p.pick).map(([a, b]) => [a + ' ', '—', ' ' + b]); }
    else { const pool = [...NOM.alphabetical, ...NOM.numerical].filter(t => new RegExp('(^|[ —])' + k + '($|[ —])').test(t) && t.length <= 24).filter((v, i, a) => a.indexOf(v) === i); rows = subset(pool, 13, p.pick).map(t => { const i = t.indexOf(k); return [t.slice(0, i), k, t.slice(i + k.length)]; }); }
    const GAP = 0.3; rows = rows.map(([a, m, b]) => [a.trim(), m, b.trim(), /\s$/.test(a) ? GAP : 0.04, /^\s/.test(b) ? GAP : 0.04]);
    const o100 = { weight: 500, tracking: -0.015 }, wd = (t, g) => t ? measure(t, { size: 100, ...o100 }).w + g * 100 + 2 : 0;
    const lw = Math.max(...rows.map(r => wd(r[0], r[3]))), mw = measure(rows[0][1], { size: 100, ...o100 }).w, rw = Math.max(...rows.map(r => wd(r[2], r[4])));
    const half = Math.max(lw, rw) + mw / 2, n = rows.length, pitchK = 1.44; const s = Math.min(100 * (FW / 2) / half, 64, FH / (pitchK * (n - 1) + CAP)), o = { size: s, ...o100 }, pitch = pitchK * s, hgt = CAP * s + (n - 1) * pitch, y0 = (H - hgt) / 2 + CAP * s, xm = 480 - mw * s / 200;
    rows.forEach((r, i) => { const y = y0 + i * pitch; S.put(xm, y, r[1], { ...o, fill: p.accent }, { hang: true }); if (r[0]) S.put(xm - r[3] * s, y, r[0], { ...o, fill: p.ink, anchor: 'end' }, { hang: true }); if (r[2]) S.put(xm + S.adv(r[1], o) + r[4] * s, y, r[2], { ...o, fill: p.ink }, { hang: true }); });
  },
  split(S, p) {
    const v = SPLITS[p.subject], o100 = { weight: v.weight, tracking: -0.04 }; S.raw(`<rect x="0" y="${H / 2}" width="${W}" height="${H / 2}" fill="${p.ink}"/>`);
    const wider = v.words.reduce((a, b) => measure(b, { size: 100, ...o100 }).w > measure(a, { size: 100, ...o100 }).w ? b : a); const s = Math.min(fit(wider, FW, o100), 560), o = { size: s, ...o100 };
    const d = Math.max(...v.words.map(t => measure(t, o).descent)), yb = B - d;
    S.put(S.inkL(L, v.words[1], o), yb, v.words[1], { ...o, fill: p.ground }, {}); S.put(S.inkL(L, v.words[0], o), yb - H / 2, v.words[0], { ...o, fill: p.ink }, { half: true });
  },
};

// ── rules (C-RULES.md) ──────────────────────────────────────────────────────
function check(S, p) {
  const flags = [], bad = (level, t) => flags.push({ level, text: t });
  for (const f of S.fills) if (!HEX.includes(f)) bad('fail', `Colour ${f} is not in the 1970 palette.`);
  if (p.kind !== 'stack' && p.kind !== 'overprint') { if (p.ink === p.ground) bad('fail', 'Ink and ground are the same colour.'); else if (Math.abs(lum(p.ink) - lum(p.ground)) < 0.16) bad('warn', 'Ink and ground are close in value.');
    if (S.fills.has(p.accent) && p.accent !== p.ink && Math.abs(lum(p.accent) - lum(p.ground)) < 0.12) bad('warn', 'The second ink is close to the ground in value.'); }
  const sizes = [...S.sizes]; if (p.kind !== 'index' && Math.max(...sizes) < 44) bad('warn', `The largest type is ${Math.max(...sizes)} px; under 44 px the poster reads as a table.`);
  if (sizes.length > 2) bad('fail', `${sizes.length} type sizes (${sizes.join(', ')} px); the rule is two at most.`);
  for (const b of S.boxes) {
    const tol = 2 + b.size * 0.03, q = `“${String(b.str).slice(0, 18)}”`;
    for (const [edge, cut, len] of [['left', -b.l, b.r - b.l], ['right', b.r - W, b.r - b.l], ['top', -b.t, b.b - b.t], ['bottom', b.b - H, b.b - b.t]]) if (cut > 1 && cut / len < 1 / 3) bad('fail', `${q} is cut by the ${edge} edge by less than a third.`);
    if (b.band) { if (b.l < L - tol || b.r > R + tol) bad('fail', `${q} is outside the 56 px side margins.`); continue; }
    if (b.l < L - tol) bad('fail', `${q} starts ${Math.round(L - b.l)} px inside the left margin.`);
    if (b.r > R + tol && !b.sideHang) bad('fail', `${q} runs ${Math.round(b.r - R)} px into the right margin.`);
    if (b.capTop < T - tol && !b.half) bad('fail', `${q} is above the top margin.`);
    const bottom = b.hang ? b.base : b.b; if (bottom > B + tol) bad('fail', `${q} is below the bottom margin.`);
  }
  return flags;
}

function normal(p) { // keep a hand-tuned recipe valid
  const q = { ...p }; if (!KINDS[q.kind]) q.kind = 'route'; const subs = KINDS[q.kind].subjects(); if (!subs[q.subject]) q.subject = Object.keys(subs)[0];
  if (q.kind === 'overprint') q.ground = PAL.white; q.pick = q.pick || 1; return q;
}
const COMBOS = [['white', 'black', 'red'], ['black', 'white', 'yellow109'], ['blue300', 'white', 'yellow109'], ['yellow109', 'black', 'red'], ['green', 'white', 'black'], ['magenta', 'white', 'black'], ['orange', 'white', 'black'], ['warmRed', 'white', 'black'], ['grey', 'white', 'black'], ['blue312', 'white', 'black'], ['red', 'white', 'yellow109'], ['yellow', 'black', 'white'], ['white', 'black', 'blue300'], ['black', 'white', 'orange']];
const WEIGHT = { route: 3.2, statement: 2.4, repeat: 1, list: 3.2, columns: 1.6, stack: 1.4, vertical: 1.4, overprint: 1.2, numcol: 1.3, index: 0.5, axis: 1.5, split: 0.7 };

export default {
  id: 'c',
  name: 'Nomenclature',
  blurb: 'Typography is the image: route letters, station names, and the manual’s own sentences.',
  async init() { NOM = await load('nomenclature'); LEG = (await load('F_data')).LEG; },
  controls(params) {
    const p = normal(params), K = KINDS[p.kind], subs = K.subjects(); const sw = HEX;
    const c = [
      { key: 'kind', label: 'Construction', type: 'select', options: Object.entries(KINDS).map(([value, v]) => ({ value, label: v.label })) },
      { key: 'subject', label: p.kind === 'route' ? 'Route' : p.kind === 'statement' || p.kind === 'repeat' ? 'Statement' : 'Words', type: 'select', options: Object.entries(subs).map(([value, v]) => ({ value, label: v.label })) },
    ];
    if (K.pick) c.push({ key: 'pick', label: 'Selection', type: 'range', min: 1, max: 40, step: 1 });
    if (K.title) c.push({ key: 'title', label: 'Title', type: 'toggle' });
    if (!K.fixedColour) { c.push({ key: 'ground', label: 'Ground', type: 'color', options: sw, group: 'Colour' }, { key: 'ink', label: 'Ink', type: 'color', options: sw, group: 'Colour' }); if (p.kind !== 'route' && p.kind !== 'split') c.push({ key: 'accent', label: 'Second ink', type: 'color', options: sw, group: 'Colour' }); }
    return c;
  },
  random(r) {
    const kinds = Object.keys(KINDS), tot = kinds.reduce((a, k) => a + WEIGHT[k], 0); let p;
    for (let tries = 0; tries < 24; tries++) {
      let x = r() * tot, kind = kinds[0]; for (const k of kinds) { x -= WEIGHT[k]; if (x <= 0) { kind = k; break; } }
      const subject = r.pick(Object.keys(KINDS[kind].subjects())); const [g, i, a] = r.pick(COMBOS).map(n => PAL[n]);
      p = { kind, subject, pick: r.int(1, 40), title: true, ground: g, ink: i, accent: a };
      if (kind === 'route') { const c = ROUTE[subject]; if (c === PAL.black) { p.ground = r.chance(0.5) ? PAL.black : PAL.grey; p.ink = p.ground === PAL.black ? PAL.white : PAL.black; } else if (r.chance(0.6)) { p.ground = c; p.ink = onInk(c); } else { p.ground = r.chance(0.75) ? PAL.white : PAL.black; p.ink = c; } p.accent = p.ink; p.title = r.chance(0.85); }
      if (kind === 'overprint' || kind === 'stack') { p.ground = PAL.white; p.ink = PAL.black; p.accent = PAL.black; }
      if (kind === 'split') { const bw = r.chance(0.6); p.ground = bw ? PAL.white : PAL.yellow109; p.ink = PAL.black; p.accent = p.ink; }
      const fl = this.render(p, 't').flags; if (!fl.length || (tries > 16 && !fl.some(f => f.level === 'fail'))) return p;
    }
    return p;
  },
  render(params) {
    const p = normal(params), S = sheet(p.ground);
    DRAW[p.kind](S, p);
    return { svg: S.out.join(''), flags: check(S, p) };
  },
};
