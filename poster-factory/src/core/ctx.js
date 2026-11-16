// Shared context for every style module. See CONTRACT.md.
// Two formats. W and H are live bindings: the app calls setFormat() before render(), and every style reads W and H at render time.
//   poster  960 x 1200 (4:5)  the tool's own posters
//   street  960 x 1440 (2:3)  the shape of a street poster frame (bus shelter, wall frame); used by "See it on the street"
export const FORMATS = { poster: { w: 960, h: 1200 }, street: { w: 960, h: 1440 } };
export let W = 960, H = 1200, FORMAT = 'poster';
export function setFormat(id) { const f = FORMATS[id] || FORMATS.poster; W = f.w; H = f.h; FORMAT = FORMATS[id] ? id : 'poster'; }

export const PAL = { // 1970 Palette (Figma variables, file 0vb3k2RHQWz8FzH17fOMoA)
  yellow: '#f2a900', orange: '#ff671f', red: '#e4002b', magenta: '#e33485', green: '#00b140',
  blue312: '#00a9ce', blue300: '#005eb8', black: '#231f20', grey: '#948b89', warmRed: '#f9423a',
  yellow109: '#ffd100', white: '#ffffff',
};
export const ROUTE = { // Routes 1970: route → ink
  '1': PAL.orange, '2': PAL.red, '3': PAL.blue312, '4': PAL.magenta, '5': PAL.black, '6': PAL.yellow, '7': PAL.orange, '8': PAL.blue312,
  A: PAL.blue300, AA: PAL.magenta, B: PAL.black, CC: PAL.green, D: PAL.orange, E: PAL.blue312, EE: PAL.orange, F: PAL.magenta,
  GG: PAL.green, HH: PAL.red, KK: PAL.blue300, LL: PAL.black, M: PAL.blue312, N: PAL.yellow, QB: PAL.red, QJ: PAL.black, RR: PAL.green, SS: PAL.green,
};
export const ROUTES = ['A','AA','B','CC','D','E','EE','F','GG','HH','KK','LL','M','N','QB','QJ','RR','SS','1','2','3','4','5','6','7','8']; // manual order: letters, then numbers
export const MAP72 = { // Map 1972 printed inks, sampled
  land: '#f4f1df', water: '#e1d9bd', park: '#a29b8e', frame: '#231f20',
  orange: '#dc7751', red: '#bd393f', magenta: '#a73177', yellow: '#e3bd4f', blue: '#4469b3', lblue: '#83b9cc', green: '#559966',
};
export const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export function rng(seed) { // mulberry32
  let a = (seed >>> 0) || 1;
  const f = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));
  f.pick = arr => arr[Math.floor(f() * arr.length)];
  f.shuffle = arr => { const a2 = arr.slice(); for (let i = a2.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [a2[i], a2[j]] = [a2[j], a2[i]]; } return a2; };
  f.chance = p => f() < p;
  return f;
}

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let _cv = null;
// Measure one line of Helvetica Neue. tracking is in em (−0.02 = −2 %). Returns ink metrics in px.
export function measure(str, { size = 100, weight = 500, tracking = 0 } = {}) {
  if (!_cv) _cv = document.createElement('canvas').getContext('2d');
  _cv.font = `${weight} ${size}px ${FONT}`;
  _cv.letterSpacing = (tracking * size) + 'px';
  const m = _cv.measureText(str);
  return { w: m.width - tracking * size, left: m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight, ascent: m.actualBoundingBoxAscent, descent: m.actualBoundingBoxDescent, cap: size * 0.714, x: size * 0.523 };
}
// Largest font size at which str is exactly `width` px wide (ink).
export function fit(str, width, { weight = 500, tracking = 0 } = {}) {
  const m = measure(str, { size: 100, weight, tracking }); return 100 * width / (m.left + m.right);
}
// One line of text. (x, y) is the baseline origin. opts: size, weight, fill, tracking (em), anchor, rotate (deg, about x,y), opacity
export function text(x, y, str, { size = 100, weight = 500, fill = PAL.black, tracking = 0, anchor = 'start', rotate = 0, opacity = 1 } = {}) {
  const tr = rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : '';
  const op = opacity < 1 ? ` opacity="${opacity}"` : '';
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" letter-spacing="${(tracking * size).toFixed(3)}" text-anchor="${anchor}" fill="${fill}"${tr}${op}>${esc(str)}</text>`;
}
// Lines of text stacked on a line height (leading as a multiple of size). y is the first baseline.
export function lines(x, y, arr, opts = {}) { const lh = (opts.leading || 0.96) * (opts.size || 100); return arr.map((s, i) => text(x, y + i * lh, s, opts)).join(''); }

// Paper grain as an SVG filter layer (multiply). id must be unique per poster.
export function grain(id, opacity = 0.5) {
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 -1.4 1.05"/></filter>` +
    `<filter id="${id}b" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.47  0 0 0 0 0.4  0 0 0 0.5 -0.12"/></filter>` +
    `<g style="mix-blend-mode:multiply" opacity="${opacity}"><rect width="${W}" height="${H}" filter="url(#${id}b)"/><rect width="${W}" height="${H}" filter="url(#${id})" opacity="0.5"/></g>`;
}

const _data = {};
export async function load(name) { if (!_data[name]) _data[name] = fetch(new URL(`../../data/${name}.json`, import.meta.url)).then(r => r.json()); return _data[name]; }
const _txt = {};
export async function loadText(url) { if (!_txt[url]) _txt[url] = fetch(new URL("../../" + url, import.meta.url)).then(r => r.text()); return _txt[url]; }
