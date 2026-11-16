// The wall: posters pasted straight onto a street hoarding.
// A wall (data/street.json) is a 1400 x 949 photo of a paste-up with a grid of 2:3 sheets (row-major; sheets cut by the photo's
// edge are included, so no old artwork shows), the colour of white paper in that light, the colour of black, and a light map
// read from the bare wall. Each poster is drawn in the 2:3 street format (960 x 1440), so it fills its sheet.
// To read as paper and not as a screen: sheets are pasted by hand (each a touch twisted and shifted, overlapping its neighbours,
// with a thin edge shadow); the print is toned to the photo (paper white, lifted black, the wall's light, a little less saturation);
// the paper is wrinkled and grained (a lit noise surface, a different one per sheet); and the print stays sharp.
import { W, H } from './ctx.js';

const imgCache = new Map();
export function loadImage(src) { if (!imgCache.has(src)) imgCache.set(src, new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Could not load ' + src)); i.src = src; })); return imgCache.get(src); }
export async function loadScenes() { const r = await fetch(new URL('../../data/street.json', import.meta.url)); if (!r.ok) throw new Error('no walls'); return r.json(); }
const asset = f => new URL('../../' + f, import.meta.url).href;

// SVG markup (already complete and self-contained) → bitmap
export async function rasterise(svg, scale = 1, w = W, h = H) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try { const img = new Image(); img.decoding = 'sync'; await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('poster did not render')); img.src = url; });
    const c = document.createElement('canvas'); c.width = w * scale; c.height = h * scale; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c; }
  finally { URL.revokeObjectURL(url); }
}

// ---- how posters repeat across the wall. Each pattern maps a sheet (column c, row r) to a poster index.
export const PATTERNS = [
  { id: 'different', label: 'All different', at: (c, r, cols) => r * cols + c },
  { id: 'pairs', label: 'Pairs', at: (c, r, cols) => r * Math.ceil(cols / 2) + Math.floor(c / 2) },
  { id: 'threes', label: 'Threes', at: (c, r, cols) => r * Math.ceil(cols / 3) + Math.floor(c / 3) },
  { id: 'halves', label: 'Halves', at: (c, r, cols) => (c < cols / 2 ? 0 : 1) },
  { id: 'columns', label: 'Columns', at: c => c },
  { id: 'checker', label: 'Two, alternating', at: (c, r) => (c + r) % 2 },
  { id: 'one', label: 'One poster', at: () => 0 },
];
// → poster index per sheet, and how many different posters the pattern asks for
export function arrange(scene, patternId) {
  const p = PATTERNS.find(x => x.id === patternId) || PATTERNS[0]; const cols = scene.cols;
  const at = scene.slots.map((_, i) => p.at(i % cols, Math.floor(i / cols), cols));
  return { at, need: Math.max(...at) + 1 };
}

const rectOf = q => ({ x: q[0][0], y: q[0][1], w: q[1][0] - q[0][0], h: q[3][1] - q[0][1] });
const path = (ctx, q) => { ctx.beginPath(); q.forEach((p, k) => k ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); };
const scaleHex = (hex, k) => '#' + [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('');

// bitmaps: one canvas per sheet (row-major). opts.light: 0.6–1.2 on the paper white; opts.creases: 0–1.5 wrinkle strength.
const paperCache = new Map();
async function paper(scene, scale, seed) { // wrinkled paper as a grey map (0.5 = flat), one noise surface per sheet
  const key = scene.id + scale + seed; if (paperCache.has(key)) return paperCache.get(key);
  const w = scene.w * scale, h = scene.h * scale; let defs = '', rects = '';
  scene.slots.forEach((q, i) => { const r = rectOf(q.map(([x, y]) => [x * scale, y * scale])); const fx = 0.006 / scale, fy = 0.011 / scale;
    defs += '<filter id="p' + i + '" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="' + fx.toFixed(5) + ' ' + fy.toFixed(5) + '" numOctaves="4" seed="' + (seed * 31 + i * 7 + 3) + '" result="n"/>' +
      '<feDiffuseLighting in="n" surfaceScale="' + (3 * scale).toFixed(2) + '" lighting-color="#fff" result="l"><feDistantLight azimuth="' + (215 + (i % 3) * 12) + '" elevation="50"/></feDiffuseLighting>' +
      '<feColorMatrix in="l" type="matrix" values="1.1 0 0 0 -0.5  1.1 0 0 0 -0.5  1.1 0 0 0 -0.5  0 0 0 0 1"/></filter>';
    rects += '<rect x="' + (r.x - 6) + '" y="' + (r.y - 6) + '" width="' + (r.w + 12) + '" height="' + (r.h + 12) + '" filter="url(#p' + i + ')"/>'; });
  const grain = '<filter id="g" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="' + (0.9 / scale).toFixed(3) + '" numOctaves="1" seed="' + seed + '"/><feColorMatrix type="matrix" values="0 0 0 0.16 0.42  0 0 0 0.16 0.42  0 0 0 0.16 0.42  0 0 0 0 1"/></filter>';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><defs>' + defs + grain + '</defs><rect width="100%" height="100%" fill="#808080"/>' + rects + '<rect width="100%" height="100%" filter="url(#g)" style="mix-blend-mode:overlay" opacity=".55"/></svg>';
  const p = rasterise(svg, 1, w, h); paperCache.set(key, p); return p;
}
function rand(seed) { let a = seed >>> 0 || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export async function compose(scene, bitmaps, { scale = 2, light = 1, creases = 1, seed = 1 } = {}) {
  const [photo, lmap, pap] = await Promise.all([loadImage(asset(scene.file)), scene.lightmap ? loadImage(asset(scene.lightmap)) : null, creases > 0 ? paper(scene, scale, seed) : null]);
  const out = document.createElement('canvas'); out.width = scene.w * scale; out.height = scene.h * scale; const ctx = out.getContext('2d'); ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(photo, 0, 0, out.width, out.height);
  // 1 · paste: left to right, top to bottom; each sheet a touch larger than its cell, twisted and shifted, so neighbours overlap
  const lay = document.createElement('canvas'); lay.width = out.width; lay.height = out.height; const lx = lay.getContext('2d'); lx.imageSmoothingQuality = 'high';
  const r = rand(seed * 977 + scene.slots.length); const quads = scene.slots.map(s => s.map(([x, y]) => [x * scale, y * scale])); const placed = [];
  quads.forEach((q, i) => {
    const b = bitmaps[i]; const rc = rectOf(q); const grow = 1.6 * scale; const rot = (r() - 0.5) * 0.7 * Math.PI / 180, dx = (r() - 0.5) * 1.6 * scale, dy = (r() - 0.5) * 1.6 * scale;
    placed.push({ cx: rc.x + rc.w / 2 + dx, cy: rc.y + rc.h / 2 + dy, w: rc.w + grow * 2, h: rc.h + grow * 2, rot });
    if (!b) return; const p = placed[i];
    lx.save(); lx.translate(p.cx, p.cy); lx.rotate(p.rot);
    lx.shadowColor = 'rgba(0,0,0,.30)'; lx.shadowBlur = 2.2 * scale; lx.shadowOffsetY = 0.5 * scale; lx.fillStyle = '#fff'; lx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); // the sheet's own edge shadow
    lx.shadowColor = 'transparent'; lx.drawImage(b, -p.w / 2, -p.h / 2, p.w, p.h); lx.restore();
  });
  // 2 · tone and paper, only where there is paper
  const area = c => { c.beginPath(); for (const p of placed) { const co = Math.cos(p.rot), si = Math.sin(p.rot); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([u, v], k) => { const x = p.cx + (u * p.w / 2) * co - (v * p.h / 2) * si, y = p.cy + (u * p.w / 2) * si + (v * p.h / 2) * co; k ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath(); } };
  lx.globalCompositeOperation = 'source-atop';
  lx.globalCompositeOperation = 'saturation'; lx.fillStyle = 'hsl(0 0% 50% / .10)'; area(lx); lx.fill(); // a little less saturated than a screen
  lx.globalCompositeOperation = 'multiply'; lx.fillStyle = scaleHex(scene.light, light); area(lx); lx.fill();
  if (lmap) { lx.save(); area(lx); lx.clip(); lx.drawImage(lmap, 0, 0, out.width, out.height); lx.restore(); }
  lx.globalCompositeOperation = 'screen'; lx.fillStyle = scene.lift; area(lx); lx.fill();
  if (pap) { const pc = await pap; lx.save(); area(lx); lx.clip(); lx.globalCompositeOperation = 'soft-light'; lx.globalAlpha = Math.min(1, creases); lx.drawImage(pc, 0, 0); if (creases > 1) { lx.globalAlpha = creases - 1; lx.drawImage(pc, 0, 0); } lx.restore(); }
  // 3 · onto the wall
  ctx.drawImage(lay, 0, 0); // sharp: the print is never softened to match the photo
  return out;
}
// which sheet is under a point given in photo pixels
export const sheetAt = (scene, x, y) => scene.slots.findIndex(q => { const r = rectOf(q); return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; });
