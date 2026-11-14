// A · Junctions 1972 — one junction of the 1972 map, redrawn on an 80 px lattice.
// Rules: 40-Marketing/Visual-Experiments/NYCTA-Posters/A-RULES.md
import { W, H, MAP72, rng, measure, text, grain, load } from '../core/ctx.js';
import { makeGeo } from './a-geo.js';

const LW = 80, DOT = 48, MAR = 80, CLEAR = 40, LEAD = 0.96, TRACK = -0.02, SIZES = [128, 88, 72];
let G = null, J = [];
const ink = n => MAP72[n.split('/')[1]] || MAP72.frame;

// ---- name block metrics (ink box of the stacked lines)
function nameBox(titleLines, size) {
  const ms = titleLines.map(s => measure(s, { size, weight: 500, tracking: TRACK }));
  const left = Math.max(...ms.map(m => m.left));
  const w = Math.max(...ms.map(m => m.left + m.right));
  const h = ms[0].ascent + (titleLines.length - 1) * LEAD * size + ms[ms.length - 1].descent;
  return { w, h, left, ascent: ms[0].ascent };
}

// ---- occupancy of lines and dots on a 20 px grid, and the best free spot for the name
function occupancy(g) {
  const CS = 20, GW = W / CS, GH = H / CS, o = new Uint8Array(GW * GH);
  const mark = (x, y, r) => { for (let gx = Math.max(0, Math.floor((x - r) / CS)); gx <= Math.min(GW - 1, Math.floor((x + r) / CS)); gx++) for (let gy = Math.max(0, Math.floor((y - r) / CS)); gy <= Math.min(GH - 1, Math.floor((y + r) / CS)); gy++) { const ex = Math.max(gx * CS - x, x - (gx + 1) * CS, 0), ey = Math.max(gy * CS - y, y - (gy + 1) * CS, 0); if (ex * ex + ey * ey < r * r) o[gy * GW + gx] = 1; } };
  for (const l of g.lines) { const P = l.poly; for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1]; if (Math.max(a[0], b[0]) < -100 || Math.min(a[0], b[0]) > W + 100 || Math.max(a[1], b[1]) < -100 || Math.min(a[1], b[1]) > H + 100) continue; const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 10)); for (let q = 0; q <= n; q++) { const x = a[0] + (b[0] - a[0]) * q / n, y = a[1] + (b[1] - a[1]) * q / n; if (x > -80 && x < W + 80 && y > -80 && y < H + 80) mark(x, y, LW / 2 + CLEAR); } } }
  for (const d of g.dots) mark(d[0], d[1], DOT / 2 + CLEAR);
  return o;
}
function place(o, box, where = 'auto') {
  const CS = 20, GW = W / CS;
  const free = (x, y, w, h) => { for (let gy = Math.floor(y / CS); gy < Math.ceil((y + h) / CS); gy++) for (let gx = Math.floor(x / CS); gx < Math.ceil((x + w) / CS); gx++) if (o[gy * GW + gx]) return false; return true; };
  const xs = [MAR, Math.floor((W - MAR - box.w) / 20) * 20]; for (let x = MAR + 80; x + box.w <= W - MAR; x += 80) xs.push(x);
  let best = null;
  for (let y = MAR; y + box.h <= H - MAR; y += 20) for (let xi = 0; xi < xs.length; xi++) {
    const x = xs[xi]; if (x < MAR || !free(x, y, box.w, box.h)) continue;
    const top = y - MAR, bot = H - MAR - (y + box.h); const edge = where === 'top' ? top : where === 'bottom' ? bot : Math.min(top, bot);
    const sc = -edge * 1.2 - (xi === 0 ? 0 : xi === 1 ? 150 : 400); if (!best || sc > best.sc) best = { x, y, sc };
  }
  return best;
}
const visible = l => { for (let z = 0; z < l.poly.length - 1; z++) { const A = l.poly[z], B = l.poly[z + 1]; if (Math.max(A[0], B[0]) > -LW && Math.min(A[0], B[0]) < W + LW && Math.max(A[1], B[1]) > -LW && Math.min(A[1], B[1]) < H + LW) return true; } return false; };

// ---- window planner: slide the window to keep the junction rich and leave room for the name
function plan(j, r, spread = 0.35) {
  const cands = [];
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
    const dx = a * spread / 2 * W / G.k, dy = b * spread / 2 * H / G.k;
    const g = G.compute(j.cx + dx, j.cy + dy), o = occupancy(g);
    for (const size of SIZES) {
      const pl = place(o, nameBox(j.title, size)); if (!pl) continue;
      const nvis = g.lines.filter(visible).length;
      const sc = G.rich(g) * 10 + size * 4 - Math.max(0, nvis - 9) * 15 - g.flags.filter(x => x === 'tight').length * 150 - g.flags.filter(x => x.indexOf('overlap') === 0).length * 140 - Math.hypot(dx, dy) * G.k * 0.15 + pl.sc * 0.02 - g.orphans * 30;
      cands.push({ sc, cx: g.cx, cy: g.cy, size }); break;
    }
  }
  if (!cands.length) return null;
  cands.sort((x, y) => y.sc - x.sc);
  return cands[Math.min(cands.length - 1, r ? r.int(0, 2) : 0)];
}

function draw(p, uid) {
  const flags = [];
  const step = 17; // one lattice step in map units (80 px)
  const g = G.compute(p.cx + (p.dx || 0) * step, p.cy + (p.dy || 0) * step);
  const order = g.lines.filter(visible).sort((a, b) => G.RT.indexOf(a.r) - G.RT.indexOf(b.r));
  let s = `<rect width="${W}" height="${H}" fill="${MAP72.land}"/>`;
  const hole = (cx, cy, rr) => `M${cx - rr} ${cy}a${rr} ${rr} 0 1 0 ${2 * rr} 0a${rr} ${rr} 0 1 0 ${-2 * rr} 0Z`;
  const tile = (id, rr) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="20" height="20"><path fill="${MAP72.land}" fill-rule="evenodd" d="M0 0H20V20H0Z${hole(0, 0, rr)}${hole(20, 0, rr)}${hole(0, 20, rr)}${hole(20, 20, rr)}${hole(10, 10, rr)}"/></pattern>`;
  s += `<defs>${tile(uid + 'ht', 6)}${tile(uid + 'htl', 4.75)}</defs>`;
  for (const l of order) {
    s += `<path d="${l.d}" fill="none" stroke="${ink(l.r.ink)}" stroke-width="${LW}"/>`;
    if (l.r.scr && p.screens !== false) s += `<path d="${l.d}" fill="none" stroke="url(#${uid}${l.r.light ? 'htl' : 'ht'})" stroke-width="${LW}"/>`;
  }
  const dots = g.dots.filter(d => d[0] >= DOT / 2 + 12 && d[0] <= W - DOT / 2 - 12 && d[1] >= DOT / 2 + 12 && d[1] <= H - DOT / 2 - 12);
  for (const d of dots) s += `<circle cx="${d[0]}" cy="${d[1]}" r="${DOT / 2}" fill="${MAP72.frame}"/>`;

  // name
  const title = (p.title || []).filter(Boolean); let named = null;
  if (title.length) {
    const o = occupancy(g); const want = p.size === 'auto' || !p.size ? SIZES : [+p.size, ...SIZES.filter(z => z < +p.size)];
    for (const size of want) { const box = nameBox(title, size); const pl = place(o, box, p.where || 'auto'); if (pl) { named = { size, box, pl }; break; } }
    if (!named) flags.push({ level: 'fail', text: 'The name does not fit on clear paper' });
    else if (p.size !== 'auto' && p.size && named.size !== +p.size) flags.push({ level: 'warn', text: `Name set at ${named.size} px, ${p.size} does not fit` });
  }
  // route letters: one per route, on a horizontal or vertical run
  if (p.labels !== false) {
    const T = q => [(q[0] - g.cx) * G.k + W / 2, (q[1] - g.cy) * G.k + H / 2];
    const tb = named ? { x0: named.pl.x - 40, y0: named.pl.y - 40, x1: named.pl.x + named.box.w + 40, y1: named.pl.y + named.box.h + 40 } : null;
    const seen = new Set(), placed = []; const DIR = [[1, 0], null, [0, 1], null];
    for (let oi = 0; oi < order.length; oi++) {
      const l = order[oi]; if (seen.has(l.r.des) || l.r.light) continue; let best = null;
      for (const it of l.items) {
        if (it.c !== 0 && it.c !== 2) continue;
        const lane = T(it.c === 0 ? [0, it.s] : [-it.s, 0]);
        for (let g2 = 120; g2 <= (it.c === 0 ? W : H) - 120; g2 += 80) {
          const q = it.c === 0 ? [g2, lane[1]] : [lane[0], g2]; if (q[0] < 100 || q[0] > W - 100 || q[1] < 100 || q[1] > H - 100) continue;
          const dv = it.c === 0 ? [70, 0] : [0, 70]; if (!G.onL(l, q) || !G.onL(l, [q[0] + dv[0], q[1] + dv[1]]) || !G.onL(l, [q[0] - dv[0], q[1] - dv[1]])) continue;
          if (tb && q[0] > tb.x0 && q[0] < tb.x1 && q[1] > tb.y0 && q[1] < tb.y1) continue;
          let md = 1e9; for (const d of dots) md = Math.min(md, Math.hypot(d[0] - q[0], d[1] - q[1])); if (md < 110) continue;
          if (placed.some(u => Math.hypot(u.q[0] - q[0], u.q[1] - q[1]) < 70)) continue;
          let cov = false; for (let u = oi + 1; u < order.length; u++) { if (order[u].r.ink === l.r.ink && order[u].r.des === l.r.des) continue; if (G.dL(order[u], q) < LW / 2 + 36) { cov = true; break; } } if (cov) continue;
          const al = placed.some(u => u.c === it.c && Math.abs(it.c === 0 ? u.q[0] - q[0] : u.q[1] - q[1]) < 1) ? 400 : 0;
          const sc2 = Math.min(md, 300) + Math.min(q[0], W - q[0], q[1], H - q[1]) * 0.3 + al; if (!best || sc2 > best.sc2) best = { sc2, q, c: it.c };
        }
      }
      if (!best) continue; seen.add(l.r.des); placed.push(best);
      const cap = 40 * 0.714;
      s += best.c === 0 ? text(best.q[0], best.q[1] + cap / 2, l.r.des, { size: 40, weight: 700, fill: MAP72.frame, tracking: TRACK, anchor: 'middle' })
        : text(best.q[0] + cap / 2, best.q[1], l.r.des, { size: 40, weight: 700, fill: MAP72.frame, tracking: TRACK, anchor: 'middle', rotate: -90 });
    }
  }
  if (named) { const { size, box, pl } = named; title.forEach((ln, i) => { s += text(pl.x + box.left, pl.y + box.ascent + i * LEAD * size, ln, { size, weight: 500, fill: MAP72.frame, tracking: TRACK }); }); }
  if ((p.grain ?? 0.5) > 0) s += grain(uid + 'gr', p.grain ?? 0.5);

  const tight = g.flags.filter(x => x === 'tight').length, over = [...new Set(g.flags.filter(x => x.indexOf('overlap') === 0))];
  if (tight) flags.push({ level: 'warn', text: `${tight} tight corner${tight > 1 ? 's' : ''}: curves cannot nest here` });
  for (const o of over) flags.push({ level: 'warn', text: `Two routes share one lane (${o.slice(8)})` });
  if (g.orphans) flags.push({ level: 'warn', text: `${g.orphans} stop${g.orphans > 1 ? 's' : ''} left out: no line under ${g.orphans > 1 ? 'them' : 'it'}` });
  if (!order.length) flags.push({ level: 'fail', text: 'No line in the frame' });
  return { svg: s, flags };
}

export default {
  id: 'a',
  name: 'Junctions',
  blurb: 'One junction of the 1972 subway map, blown up and redrawn on a single lattice.',
  async init() { const [geo, jn] = await Promise.all([load('A2_mapgeo'), load('junctions')]); G = makeGeo(geo); J = jn; },
  controls() {
    return [
      { key: 'junction', label: 'Junction', type: 'select', options: J.map((j, i) => ({ value: i, label: j.title.join(' ') })), replan: true },
      { key: 'titleText', label: 'Name', type: 'text', hint: 'Use / for a new line' },
      { key: 'size', label: 'Name size', type: 'select', options: [{ value: 'auto', label: 'Auto' }, { value: 128, label: '128' }, { value: 88, label: '88' }, { value: 72, label: '72' }] },
      { key: 'where', label: 'Name position', type: 'select', options: [{ value: 'auto', label: 'Auto' }, { value: 'top', label: 'Top' }, { value: 'bottom', label: 'Bottom' }] },
      { key: 'dx', label: 'Move left / right', type: 'range', min: -8, max: 8, step: 1, group: 'Window' },
      { key: 'dy', label: 'Move up / down', type: 'range', min: -10, max: 10, step: 1 },
      { key: 'labels', label: 'Route letters', type: 'toggle', group: 'Print' },
      { key: 'screens', label: 'Halftone screens', type: 'toggle' },
      { key: 'grain', label: 'Paper grain', type: 'range', min: 0, max: 1, step: 0.05 },
    ];
  },
  // called by the app when a control marked `replan` changes
  replan(p) { const j = J[+p.junction]; const pl = plan(j, null) || { cx: j.cx, cy: j.cy }; return { ...p, title: j.title, titleText: j.title.join(' / '), cx: pl.cx, cy: pl.cy, dx: 0, dy: 0 }; },
  random(r) {
    for (let t = 0; t < 12; t++) {
      const ji = r.int(0, J.length - 1), j = J[ji]; const pl = plan(j, r); if (!pl) continue;
      const p = { junction: ji, title: j.title, titleText: j.title.join(' / '), cx: pl.cx, cy: pl.cy, dx: 0, dy: 0, size: 'auto', where: 'auto', labels: true, screens: true, grain: 0.5 };
      if (!draw(p, 'x').flags.some(f => f.level === 'fail')) return p;
    }
    const j = J[0]; return { junction: 0, title: j.title, titleText: j.title.join(' / '), cx: j.cx, cy: j.cy, dx: 0, dy: 0, size: 'auto', where: 'auto', labels: true, screens: true, grain: 0.5 };
  },
  render(p, uid) { const q = { ...p }; if (typeof p.titleText === 'string') q.title = p.titleText.split('/').map(x => x.trim()).filter(Boolean); return draw(q, uid); },
};
