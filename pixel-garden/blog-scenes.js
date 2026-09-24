/* ============================================================
   PIXEL GARDEN LAB — blog header scenes (studies 11 + 12)
   Four 1200×630 headers for the sample client Kestrel Labs.
   Requires pixel-core.js + sprites.js. Classic script: exposes
   mountScenes, renderFull, and the scene defs as globals.
   ============================================================ */
"use strict";

const W = 1200, H = 630;
const GRID = PG.GRID, PX = PG.PX, snap = PG.snap;
const CLIENT = "KESTREL";

/* punctuation the titles need — added here, core font file untouched */
Object.assign(PG.FONT, {
  ",": ["..", "..", "..", ".X", "X."],
  "/": ["...X", "..X.", ".XX.", ".X..", "X..."],
  ":": [".", "X", ".", "X", "."],
});

/* ---------- helpers ---------- */
/* dpr-free offscreen — exports must be exactly 1200×630 device px */
function flat(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  x.imageSmoothingEnabled = false;
  if (draw) draw(x, w, h);
  return c;
}
function drawCells(ctx, cells) {
  for (const c of cells) { ctx.fillStyle = c.color; ctx.fillRect(c.x, c.y, c.size, c.size); }
}
/* rectangle as grow-able cells, bottom-to-top. solid = touching cells */
function rectCells(x0, y0, x1, y1, color, solid) {
  const out = [];
  const size = solid ? GRID : PX;
  for (let y = snap(y1 - GRID); y >= snap(y0); y -= GRID)
    for (let x = snap(x0); x < x1; x += GRID) out.push({ x, y, color, size });
  return out;
}
/* stepped pixel path through points, one cell per grid step, no repeats */
function pathCells(points, color, size = PX) {
  const out = [], seen = new Set();
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i], [x1, y1] = points[i + 1];
    const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / GRID);
    for (let s = 0; s <= steps; s++) {
      const f = steps ? s / steps : 0;
      const x = snap(x0 + (x1 - x0) * f), y = snap(y0 + (y1 - y0) * f);
      const k = x + "," + y;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ x, y, color, size });
    }
  }
  return out;
}
function glow(ctx, cx, cy, rx, ry, color, maxA) {
  if (maxA <= 0.01) return;
  ctx.fillStyle = color;
  for (let y = snap(cy - ry); y <= cy + ry; y += GRID) {
    for (let x = snap(cx - rx); x <= cx + rx; x += GRID) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      const d = dx * dx + dy * dy;
      if (d > 1) continue;
      ctx.globalAlpha = maxA * Math.pow(1 - d, 1.6);
      ctx.fillRect(x, y, PX, PX);
    }
  }
  ctx.globalAlpha = 1;
}
function hexLerp(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (p, s) => (p >> s) & 255;
  const mix = (s) => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return "#" + ((1 << 24) | (mix(16) << 16) | (mix(8) << 8) | mix(0)).toString(16).slice(1);
}
function wilt(sprite) {
  return PG.recolor(sprite, (c) => {
    const v = parseInt(c.slice(1), 16);
    const lum = ((v >> 16 & 255) + (v >> 8 & 255) + (v & 255)) / 3;
    const g = Math.round(112 + lum * 0.32);
    return `rgb(${g},${g - 12},${g - 28})`;
  });
}

/* ---------- title block: kicker + wrapped title, left or right aligned ---------- */
function wrap(text, scale, maxW) {
  const words = text.toUpperCase().split(/\s+/);
  const lines = [];
  let cur = "";
  for (const wd of words) {
    const test = cur ? cur + " " + wd : wd;
    if (!cur || PG.textWidth(test, scale) - GRID * scale <= maxW) cur = test;
    else { lines.push(cur); cur = wd; }
  }
  if (cur) lines.push(cur);
  return lines;
}
function titleBlock({ kicker, title, x, align = "left", maxW, color, kickerColor, top = 80 }) {
  const S = 2.5, KS = 1.75;
  const place = (line, scale) => {
    const w = PG.textWidth(line, scale) - GRID * scale;   // drop trailing tracking
    return align === "right" ? snap(x - w) : x;
  };
  const cells = [];
  const k = (CLIENT + " / " + kicker).toUpperCase();
  cells.push(...PG.textCells(k, place(k, KS), top, { scale: KS, color: kickerColor }));
  const lines = title.includes("|") ? title.toUpperCase().split("|") : wrap(title, S, maxW);
  lines.forEach((ln, i) =>
    cells.push(...PG.textCells(ln, place(ln, S), top + 84 + i * 68, { scale: S, color })));
  return cells;
}

/* ============================================================
   scene framework
   layer = { cells, delay, dur, bake, steady, title, glows:[...] }
   bake: stamped into the live bg once grown.  title: left out of
   the art-only export.  under/over: animated extras per frame;
   still: the frozen pose of those extras for the png.
   ============================================================ */
const scenes = {};

function makeScene(id, def, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const base = flat(W, H, def.bg);
  const bg = flat(W, H, (c) => c.drawImage(base, 0, 0));
  const scene = { ...def, id, canvas, ctx, base, bg, bgCtx: bg.getContext("2d"),
                  started: false, visible: false };
  scenes[id] = scene;
  return scene;
}

function startScene(scene, t) {
  scene.started = true;
  scene.t0 = t + 200;
  for (const L of scene.layers) {
    L.grower = new PG.Grower(L.cells, {
      bornAt: scene.t0 + L.delay, duration: L.dur ?? 700,
      flicker: !L.bake && !L.steady && !L.title,
    });
    L.baked = false;
  }
}

function frameScene(scene, t) {
  const { ctx } = scene;
  ctx.drawImage(scene.bg, 0, 0);
  if (scene.under) scene.under(ctx, t - scene.t0);
  for (const L of scene.layers) {
    if (L.baked) continue;
    const p = PG.easeOutQuad(L.grower.progress(t));
    if (L.glows) for (const g of L.glows) glow(ctx, g.cx, g.cy, g.rx, g.ry, g.color, g.maxA * p);
    const done = L.grower.draw(ctx, t);
    if (done && L.bake) { drawCells(scene.bgCtx, L.cells); L.baked = true; }
  }
  if (scene.over) scene.over(ctx, t - scene.t0);
}

function renderFull(scene, withTitle) {
  return flat(W, H, (c) => {
    c.drawImage(scene.base, 0, 0);
    if (scene.under) scene.under(c, 0, true);
    for (const L of scene.layers) {
      if (L.title && !withTitle) continue;
      if (L.glows) for (const g of L.glows) glow(c, g.cx, g.cy, g.rx, g.ry, g.color, g.maxA);
      drawCells(c, L.cells);
    }
    if (scene.still) scene.still(c);
  });
}

/* ============================================================
   01 RETRIEVAL — the roots behind every answer
   ============================================================ */
const R_GROUND = 340;
const ROOTS = (() => {
  const layers = [];
  const FX = 900;                                   // flower stem x

  // title
  layers.push({ title: true, delay: 900, dur: 900,
    cells: titleBlock({ kicker: "retrieval", title: "The Roots Behind Every Answer",
      x: 64, maxW: 680, color: "#1c1a17", kickerColor: "#b81f2e" }) });

  // documents in the soil: [x, y, rank]  rank 0 = not retrieved
  const DOCS = [
    [96, 392, 0], [236, 392, 0], [404, 392, 0], [604, 392, 0], [1044, 392, 2],
    [160, 466, 0], [330, 466, 0], [500, 466, 0], [700, 466, 0], [880, 466, 1], [1100, 466, 0],
    [420, 540, 0], [620, 540, 3], [800, 540, 0], [980, 540, 0],
  ];
  const r = PG.rng("roots-docs");
  const docCells = [], litCells = [], glows = [];
  for (const [x, y, rank] of DOCS) {
    const lit = rank > 0;
    const paper = lit ? "#fbf8ef" : "#7c604a";
    const ink = lit ? "#5a4632" : "#65493a";
    const out = lit ? litCells : docCells;
    if (lit) out.push(...rectCells(x - 4, y - 4, x + 44, y + 52, "#f5b81e", true));
    out.push(...rectCells(x, y, x + 40, y + 48, paper, true));
    for (let ly = y + 8; ly <= y + 36; ly += 8) {
      const len = 4 + Math.floor(r() * 3);
      for (let i = 0; i < len; i++) out.push({ x: x + 8 + i * GRID, y: ly, color: ink, size: PX });
    }
    if (lit) {
      out.push(...PG.textCells(String(rank), x - 20, y + 20, { scale: 1, color: "#b81f2e" }));
      glows.push({ cx: x + 20, cy: y + 24, rx: 60, ry: 60, color: "#ffd94a", maxA: 0.28 });
    }
  }
  layers.push({ cells: docCells, delay: 0, dur: 900, bake: true });

  // roots grow downward from the stem; lit ones reach the retrieved docs
  const jig = PG.rng("roots-wander");
  const wander = (pts) => pts.map(([x, y], i) =>
    i === 0 || i === pts.length - 1 ? [x, y] : [x + (jig() - 0.5) * 16, y + (jig() - 0.5) * 8]);
  const LIT_PATHS = [
    wander([[FX, 372], [FX + 4, 400], [FX - 4, 430], [FX + 20, 462]]),            // rank 1
    wander([[FX, 372], [FX + 60, 380], [FX + 120, 382], [1064, 388]]),           // rank 2
    wander([[FX, 372], [FX - 50, 400], [FX - 90, 440], [790, 500], [760, 524], [640, 536]]), // rank 3
  ];
  const DIM_PATHS = [
    wander([[FX, 380], [FX - 70, 384], [FX - 150, 392], [700, 400]]),
    wander([[FX, 390], [FX + 60, 420], [FX + 110, 440], [1060, 470]]),
    wander([[FX, 400], [FX + 40, 460], [FX + 60, 500], [975, 534]]),
    wander([[FX - 60, 396], [FX - 110, 420], [760, 440]]),
  ];
  const tap = [...rectCells(FX - 4, R_GROUND, FX + 4, 376, "#e8b867", false)].reverse();
  layers.push({ cells: [...tap, ...DIM_PATHS.flatMap((p) => pathCells(p, "#8a6a4c"))],
    delay: 700, dur: 900, bake: true });
  const litRootCells = LIT_PATHS.map((p) => pathCells(p, "#f0c27a"));
  layers.push({ cells: litRootCells.flat(), delay: 1300, dur: 900, bake: true });
  layers.push({ cells: litCells, delay: 1900, dur: 700, bake: true, glows });

  // the answer: one big sunflower, two small neighbours
  layers.push({ cells: PG.spriteCells(PG.FLOWERS.sunflower, 4, FX, R_GROUND), delay: 2200, dur: 1000 });
  layers.push({ cells: [
      ...PG.spriteCells(PG.FLOWERS.daisy, 2, 772, R_GROUND),
      ...PG.spriteCells(PG.SAPLING, 2.5, 1060, R_GROUND),
    ], delay: 2500, dur: 700 });

  // index label
  layers.push({ steady: true, delay: 2600, dur: 600,
    cells: PG.textCells("2.1M CHUNKS / TOP 3", 64, 616, { scale: 1, color: "#c9a27e" }) });

  // nutrients: bright pixels travel up the lit roots, doc → flower
  const pulsePaths = litRootCells.map((cells) => cells.slice().reverse());
  function pulses(ctx, t) {
    if (t < 3000 || PG.reducedMotion) return;
    pulsePaths.forEach((cells, i) => {
      const n = cells.length;
      const head = Math.floor((((t - 3000) / 1600 + i * 0.37) % 1) * n);
      for (let k = 0; k < 4; k++) {
        const c = cells[head - k];
        if (!c) continue;
        ctx.globalAlpha = 1 - k * 0.24;
        ctx.fillStyle = "#fff7d6";
        ctx.fillRect(c.x, c.y, PX, PX);
      }
    });
    ctx.globalAlpha = 1;
  }

  return {
    layers,
    over: pulses,
    bg: (c) => {
      c.imageSmoothingEnabled = true;
      c.drawImage(PG.halftone(W, R_GROUND, {
        bg: "#f6ead6", dot: "#ecc89d",
        blobs: [{ cx: 0.62, cy: 0.35, rx: 0.28, ry: 0.5, s: 0.9 },
                { cx: 0.12, cy: 0.9, rx: 0.2, ry: 0.4, s: 0.5 }],
      }), 0, 0, W, R_GROUND);
      c.imageSmoothingEnabled = false;
      const bands = [[R_GROUND, 352, "#2f7d4f"], [352, 440, "#6b4a33"],
                     [440, 540, "#5c3f2b"], [540, H, "#4a3222"]];
      for (const [y0, y1, col] of bands) { c.fillStyle = col; c.fillRect(0, y0, W, y1 - y0); }
      const s = PG.rng("roots-soil");
      for (let y = 352; y < H; y += GRID)
        for (let x = 0; x < W; x += GRID) {
          const v = s();
          if (v < 0.06) { c.fillStyle = "#3e2a1c"; c.fillRect(x, y, PX, PX); }
          else if (v < 0.075) { c.fillStyle = "#86644a"; c.fillRect(x, y, PX, PX); }
        }
      c.fillStyle = "#3d9a62";
      for (let x = 0; x < W; x += GRID * 2)
        if (s() < 0.45) c.fillRect(x, R_GROUND - GRID, PX, PX);
    },
  };
})();

/* ============================================================
   02 EVALS — 12,000 questions before a model ships
   ============================================================ */
const POT = {
  rows: ["AAAAA", ".BBB.", ".BBB."],
  stemCol: 2,
  pal: { A: "#d0744a", B: "#b35a36" },
};
const EVALS = (() => {
  const layers = [];
  layers.push({ title: true, delay: 900, dur: 900,
    cells: titleBlock({ kicker: "evals", title: "12,000 Questions|Before a Model|Ships",
      x: 64, maxW: 760, color: "#1c1a17", kickerColor: "#2f7d4f" }) });

  // hanging scoreboard
  layers.push({ bake: true, delay: 0, dur: 700, cells: [
    ...pathCells([[884, 0], [884, 52]], "#8a8a8a"),
    ...pathCells([[1124, 0], [1124, 52]], "#8a8a8a"),
    ...rectCells(844, 52, 1168, 212, "#6b4226", true),
    ...rectCells(852, 60, 1160, 204, "#17201b", true),
  ] });
  layers.push({ steady: true, delay: 500, dur: 900,
    glows: [{ cx: 1006, cy: 136, rx: 160, ry: 80, color: "#5af567", maxA: 0.06 }],
    cells: [
      ...PG.textCells("EVAL RUN 09-14", 868, 100, { scale: 1, color: "#7f9a88" }),
      ...PG.textCells("PASS 11,412", 868, 148, { scale: 1.5, color: "#5af567" }),
      ...PG.textCells("FAIL 588", 868, 188, { scale: 1.5, color: "#ff5a5f" }),
    ] });

  // shelves: planks + brackets
  const SHELVES = [
    { y: 400, label: "REASONING 4,000", labelColor: "#f6ead6" },
    { y: 508, label: "CODE 4,000", labelColor: "#f6ead6" },
    { y: 606, label: "SAFETY 4,000", labelColor: "#5a4632" },
  ];
  const planks = [];
  for (const s of SHELVES.slice(0, 2)) {
    planks.push(...rectCells(48, s.y, 1152, s.y + 24, "#8a5a32", true));
    planks.push(...rectCells(48, s.y, 1152, s.y + 4, "#a06a3c", true));
    for (const bx of [56, 1136]) planks.push(...rectCells(bx, s.y + 24, bx + 8, s.y + 40, "#6b4226", true));
  }
  layers.push({ cells: planks, delay: 150, dur: 800, bake: true });

  // pots: one row per shelf; a few fail
  const FAILS = { 0: [5], 1: [11, 12], 2: [3] };
  const names = Object.keys(PG.FLOWERS);
  const N = 18;
  SHELVES.forEach((s, row) => {
    const r = PG.rng("evals-row-" + row);
    const cells = [];
    for (let i = 0; i < N; i++) {
      const x = snap(96 + i * (1008 / (N - 1)));
      const fail = FAILS[row].includes(i);
      cells.push(...PG.spriteCells(POT, 2, x, s.y));
      cells.push({ x: x, y: s.y - 12, color: fail ? "#e23b47" : "#5af567", size: PX });
      let sp = r() < 0.18 ? PG.SAPLING : PG.FLOWERS[names[Math.floor(r() * names.length)]];
      const scale = sp === PG.SAPLING ? 1.5 : 0.95 + r() * 0.25;
      if (fail) sp = wilt(PG.FLOWERS[names[Math.floor(r() * names.length)]]);
      cells.push(...PG.spriteCells(sp, fail ? 1 : scale, x, s.y - 24));
    }
    layers.push({ cells, delay: 450 + row * 260, dur: 1100 });
    layers.push({ steady: true, delay: 1300 + row * 120, dur: 500,
      cells: PG.textCells(s.label, 64, s.y + 22, { scale: 1, color: s.labelColor }) });
  });

  // grader sweep: a soft light band crossing the shelves
  function sweep(ctx, t) {
    if (t < 2600 || PG.reducedMotion) return;
    const x0 = snap((((t - 2600) / 6000) % 1) * (W + 240) - 120);
    ctx.fillStyle = "#ffffff";
    for (let x = x0; x < x0 + 48; x += GRID) {
      const a = 0.16 * Math.sin(((x - x0) / 48) * Math.PI);
      ctx.globalAlpha = a;
      for (let y = 300; y < 606; y += GRID) ctx.fillRect(x, y, PX, PX);
    }
    ctx.globalAlpha = 1;
  }

  return {
    layers,
    over: sweep,
    bg: (c) => {
      c.imageSmoothingEnabled = true;
      c.drawImage(PG.halftone(W, H, {
        bg: "#eaf0e4", dot: "#cfdec8",
        blobs: [{ cx: 0.3, cy: 0.2, rx: 0.3, ry: 0.35, s: 0.8 },
                { cx: 0.75, cy: 0.62, rx: 0.3, ry: 0.3, s: 0.6 }],
      }), 0, 0, W, H);
      c.imageSmoothingEnabled = false;
      // greenhouse mullions + a roof beam
      c.fillStyle = "#d3e0cc";
      for (let x = 24; x < W; x += 192)
        for (let y = 0; y < 606; y += GRID) c.fillRect(x, y, PX, PX);
      for (let x = 0; x < W; x += GRID) c.fillRect(x, 296, PX, PX);
      c.fillStyle = "#c9a883";
      c.fillRect(0, 606, W, H - 606);
      const s = PG.rng("evals-floor");
      c.fillStyle = "#b39170";
      for (let y = 606; y < H; y += GRID)
        for (let x = 0; x < W; x += GRID) if (s() < 0.12) c.fillRect(x, y, PX, PX);
    },
  };
})();

/* ============================================================
   03 TRAINING — reading a loss curve from the summit down
   ============================================================ */
const P0 = 64, P1 = 1136, HORIZON = 488;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const stepT = (x) => clamp01((x - P0) / (P1 - P0));
function lossY(x) {
  const t = stepT(x);
  let y = HORIZON - 318 * Math.exp(-t * 6);
  y -= 30 * Math.exp(-(((t - 0.40) / 0.012) ** 2));
  y -= 14 * Math.exp(-(((t - 0.63) / 0.010) ** 2));
  y += ((PG.fnv("loss-" + snap(x)) % 3) - 1) * 2;
  return snap(y);
}
function valY(x) {
  const t = stepT(x);
  return snap(HORIZON - 20 - 300 * Math.exp(-t * 5.4) - (t > 0.72 ? 80 * (t - 0.72) : 0));
}
const HIKER = [
  { rows: [".A.", "BBB", ".B.", "C.C"], stemCol: 1, pal: { A: "#f3d2b0", B: "#e23b47", C: "#e8e2d0" } },
  { rows: [".A.", "BBB", ".B.", ".C."], stemCol: 1, pal: { A: "#f3d2b0", B: "#e23b47", C: "#e8e2d0" } },
];
const LOSS = (() => {
  const layers = [];
  layers.push({ title: true, delay: 1200, dur: 900,
    cells: titleBlock({ kicker: "training", title: "Reading a Loss Curve From the Summit Down",
      x: 1136, align: "right", maxW: 720, color: "#fbf3e2", kickerColor: "#f5b81e" }) });

  // terrain = training loss, drawn column by column: the run happens left to right
  const terrain = [];
  const sp = PG.rng("loss-speckle");
  for (let x = 0; x < W; x += GRID) {
    const y0 = lossY(x);
    terrain.push({ x, y: y0, color: "#ff9f6b", size: GRID });
    terrain.push({ x, y: y0 + GRID, color: "#b8586a", size: GRID });
    for (let y = y0 + GRID * 2; y < H; y += GRID) {
      const col = y > 560 ? "#241a33" : y > y0 + 24 ? "#2e2242" : "#3d2c52";
      terrain.push({ x, y, color: sp() < 0.07 ? "#1c1428" : col, size: GRID });
    }
  }
  layers.push({ cells: terrain, delay: 0, dur: 1400, bake: true });

  // validation loss, dotted
  const val = [];
  for (let x = P0 + 64; x <= P1; x += 12) val.push({ x: snap(x), y: valY(x), color: "#fbe3b5", size: PX });
  val.push(...PG.textCells("VAL", 1024, valY(1040) - 12, { scale: 1, color: "#fbe3b5" }));
  layers.push({ cells: val, delay: 1000, dur: 900, bake: true });

  // step axis
  const axis = [];
  ["0", "10K", "20K", "30K", "40K"].forEach((lab, i) => {
    const x = snap(P0 + i * (P1 - P0) / 4);
    axis.push({ x, y: 584, color: "#9d8cb8", size: PX }, { x, y: 588, color: "#9d8cb8", size: PX });
    const w = PG.textWidth(lab, 1) - GRID;
    const lx = i === 0 ? x : i === 4 ? x - w : snap(x - w / 2);
    axis.push(...PG.textCells(lab, lx, 616, { scale: 1, color: "#9d8cb8" }));
  });
  layers.push({ cells: axis, delay: 1500, dur: 500, steady: true });

  // flags: the spike and the checkpoint we keep
  function flag(stepFrac, cloth, label) {
    const x = snap(P0 + stepFrac * (P1 - P0));
    const base = lossY(x);
    const top = base - 48;
    const cells = [...pathCells([[x, base - GRID], [x, top]], "#e8e2d0")];
    cells.push(...rectCells(x + 4, top, x + 28, top + 16, cloth, true));
    const w = PG.textWidth(label, 1) - GRID;
    cells.push(...PG.textCells(label, snap(x - w / 2 + 8), top - 12, { scale: 1, color: "#fbe3b5" }));
    return cells;
  }
  layers.push({ cells: flag(0.40, "#e23b47", "SPIKE 16K"), delay: 1700, dur: 600 });
  layers.push({ cells: flag(0.725, "#f5b81e", "BEST 29K"), delay: 1900, dur: 600 });

  // flowers on the long flat
  const fr = PG.rng("loss-flowers");
  const names = Object.keys(PG.FLOWERS);
  const flowers = [];
  for (const fx of [1112, 1148, 1180]) {
    flowers.push(...PG.spriteCells(PG.FLOWERS[names[Math.floor(fr() * names.length)]],
      1.2 + fr() * 0.4, fx, lossY(fx) + GRID));
  }
  layers.push({ cells: flowers, delay: 2100, dur: 900 });

  // hiker walks the run, step 0 → 40K
  function hikerAt(ctx, x, frame) {
    drawCells(ctx, PG.spriteCells(HIKER[frame], 2.5, snap(x), lossY(x) + GRID));
  }
  return {
    layers,
    over: (ctx, t) => {
      if (t < 2400) return;
      if (PG.reducedMotion) { hikerAt(ctx, 300, 0); return; }
      const x = 40 + (((t - 2400) / 26000) % 1) * 1120;
      hikerAt(ctx, x, Math.floor(t / 220) % 2);
    },
    still: (ctx) => hikerAt(ctx, 300, 0),
    bg: (c) => {
      const stops = ["#1f1a3a", "#342853", "#5e3b6b", "#a8506a", "#e27a5c", "#f7b56e"];
      for (let y = 0; y < H; y += 16) {
        const f = Math.min(1, y / HORIZON) * (stops.length - 1);
        const i = Math.min(stops.length - 2, Math.floor(f));
        c.fillStyle = hexLerp(stops[i], stops[i + 1], f - i);
        c.fillRect(0, y, W, 16);
      }
      c.imageSmoothingEnabled = true;
      c.drawImage(PG.halftone(W, H, {
        dot: "#ffc98a", maxR: 1.6,
        blobs: [{ cx: 0.83, cy: 0.74, rx: 0.3, ry: 0.22, s: 0.9 }],
      }), 0, 0, W, H);
      c.imageSmoothingEnabled = false;
      const st = PG.rng("loss-stars");
      for (let i = 0; i < 46; i++) {
        const x = snap(110 + st() * 320), y = snap(24 + st() * 250);
        c.fillStyle = st() < 0.3 ? "#fffdf6" : "#9f8fc4";
        c.fillRect(x, y, PX, PX);
      }
      PG.fillEllipse(c, 1000, 484, 84, 84, (dx, dy, d) => (d < 0.45 ? "#ffe07a" : "#ffb23e"));
    },
  };
})();

/* ============================================================
   04 AGENTS — 41 steps to fix one bug
   ============================================================ */
const ROBOT_TOP = [
  "....C....",
  "....A....",
  ".AAAAAAA.",
  ".ADDADDA.",
  ".AAAAAAA.",
  "...BBB...",
  ".EEEEEEE.",
  "AEEEFEEEA",
  "AEEEEEEEA",
  ".EEEEEEE.",
];
const ROBOT_PAL = { A: "#d9dee3", B: "#9aa7b4", C: "#e23b47", D: "#1c1a17",
                    E: "#5a6673", F: "#f5b81e", G: "#384048" };
const ROBOT = [
  { rows: [...ROBOT_TOP, "..G...G..", "..G...G.."], stemCol: 4, pal: ROBOT_PAL },
  { rows: [...ROBOT_TOP, "...G.G...", "..G...G.."], stemCol: 4, pal: ROBOT_PAL },
];
const A_TRAIL = 548;
const AGENT = (() => {
  const layers = [];
  layers.push({ title: true, delay: 900, dur: 800,
    cells: titleBlock({ kicker: "agents", title: "41 Steps to Fix One Bug",
      x: 64, maxW: 720, color: "#1c1a17", kickerColor: "#2d5fb8" }) });

  const POSTS = [
    { label: "GREP", step: "3",  bg: "#2d5fb8", fg: "#fbf8ef" },
    { label: "READ", step: "9",  bg: "#2d5fb8", fg: "#fbf8ef" },
    { label: "EDIT", step: "14", bg: "#f0a51c", fg: "#1c1a17" },
    { label: "TEST", step: "22", bg: "#384048", fg: "#fbf8ef" },
    { label: "FAIL", step: "23", bg: "#e23b47", fg: "#fbf8ef" },
    { label: "EDIT", step: "31", bg: "#f0a51c", fg: "#1c1a17" },
    { label: "TEST", step: "38", bg: "#384048", fg: "#fbf8ef" },
    { label: "PASS", step: "41", bg: "#2f7d4f", fg: "#fbf8ef" },
  ];
  POSTS.forEach((p, i) => { p.x = snap(128 + i * 134); });

  POSTS.forEach((p, i) => {
    const tw = PG.textWidth(p.label, 1) - GRID;
    const bw = snap(tw + 24);
    const bx = snap(p.x - bw / 2);
    p.box = { x0: bx, x1: bx + bw, y0: 440, y1: 472 };
    const cells = [
      ...rectCells(p.x - 4, 472, p.x + 4, A_TRAIL + 4, "#6b4226", true),
      ...rectCells(bx, 440, bx + bw, 472, p.bg, true),
      ...PG.textCells(p.label, snap(p.x - tw / 2), 466, { scale: 1, color: p.fg }),
    ];
    const sw = PG.textWidth(p.step, 1) - GRID;
    cells.push(...PG.textCells(p.step, snap(p.x - sw / 2), 428, { scale: 1, color: "#1c1a17" }));
    layers.push({ cells, delay: 300 + i * 140, dur: 520, steady: true });
  });

  // the wrong turn: a dashed red loop from FAIL back to the first EDIT
  const from = POSTS[4].x, to = POSTS[2].x;
  const cx = (from + to) / 2, rx = (from - to) / 2, ry = 64;
  const arc = [];
  let k = 0;
  for (let a = 0; a <= Math.PI; a += Math.PI / 90) {
    if ((k++ % 6) < 3) arc.push({ x: snap(cx + rx * Math.cos(a)), y: snap(404 - ry * Math.sin(a)), color: "#e23b47", size: PX });
  }
  const seen = new Set();
  const arcCells = arc.filter((c) => { const s = c.x + "," + c.y; if (seen.has(s)) return false; seen.add(s); return true; });
  for (const [dx, dy] of [[-8, -8], [8, -8], [-4, -4], [4, -4], [0, 0]])
    arcCells.push({ x: snap(to + dx), y: 404 + dy, color: "#e23b47", size: PX });
  const rw = PG.textWidth("RETRY", 1) - GRID;
  arcCells.push(...PG.textCells("RETRY", snap(cx - rw / 2), 404 - ry - 12, { scale: 1, color: "#e23b47" }));
  layers.push({ cells: arcCells, delay: 1600, dur: 700 });

  // robot walks the trail, pausing at each signpost
  const WALK = 110, PAUSE = 650, START = 40, END = 1150;
  const legs = [];
  let tAcc = 0, xPrev = START;
  for (const p of POSTS) {
    const d = (p.x - xPrev) / WALK * 1000;
    legs.push({ t0: tAcc, t1: tAcc + d, x0: xPrev, x1: p.x });
    tAcc += d;
    legs.push({ t0: tAcc, t1: tAcc + PAUSE, x0: p.x, x1: p.x });
    tAcc += PAUSE;
    xPrev = p.x;
  }
  legs.push({ t0: tAcc, t1: tAcc + (END - xPrev) / WALK * 1000, x0: xPrev, x1: END });
  tAcc = legs[legs.length - 1].t1 + 900;
  function robotX(tl) {
    for (const l of legs)
      if (tl <= l.t1) return { x: l.x0 + (l.x1 - l.x0) * clamp01((tl - l.t0) / (l.t1 - l.t0)), moving: l.x1 !== l.x0 };
    return { x: END, moving: false };
  }
  function drawRobot(ctx, x, frame) {
    drawCells(ctx, PG.spriteCells(ROBOT[frame], 1.5, snap(x), A_TRAIL));
  }
  function outline(ctx, b) {
    ctx.fillStyle = "#fffdf6";
    for (let x = b.x0 - 8; x <= b.x1 + 4; x += GRID) { ctx.fillRect(x, b.y0 - 8, PX, PX); ctx.fillRect(x, b.y1 + 4, PX, PX); }
    for (let y = b.y0 - 8; y <= b.y1 + 4; y += GRID) { ctx.fillRect(b.x0 - 8, y, PX, PX); ctx.fillRect(b.x1 + 4, y, PX, PX); }
  }

  const clouds = PG.makeClouds(W, 520, [
    { baseX: 0.76, y: 0.14, rx: 0.08, ry: 0.07, speed: 5, alpha: 0.9 },
    { baseX: 0.78, y: 0.44, rx: 0.1, ry: 0.07, speed: 3.5, alpha: 0.85 },
    { baseX: 0.14, y: 0.66, rx: 0.07, ry: 0.06, speed: 6, alpha: 0.8 },
  ]);

  return {
    layers,
    under: (ctx, t, still) => PG.drawClouds(ctx, clouds, W, still || PG.reducedMotion ? 0 : Math.max(0, t), ["#ffffff", "#e6f2fa"]),
    over: (ctx, t) => {
      if (t < 2300) return;
      if (PG.reducedMotion) { drawRobot(ctx, END - 20, 0); return; }
      const tl = (t - 2300) % tAcc;
      const { x, moving } = robotX(tl);
      for (const p of POSTS) if (x >= p.x - 2) outline(ctx, p.box);
      drawRobot(ctx, x, moving ? Math.floor(t / 180) % 2 : 0);
    },
    still: (ctx) => drawRobot(ctx, END - 20, 0),
    bg: (c) => {
      c.fillStyle = "#a9d6ef";
      c.fillRect(0, 0, W, H);
      c.imageSmoothingEnabled = true;
      c.drawImage(PG.halftone(W, H, {
        dot: "#c3e3f5",
        blobs: [{ cx: 0.88, cy: 0.18, rx: 0.2, ry: 0.3, s: 0.9 },
                { cx: 0.35, cy: 0.75, rx: 0.35, ry: 0.25, s: 0.5 }],
      }), 0, 0, W, H);
      c.imageSmoothingEnabled = false;
      // sun + rays
      const sx = 1072, sy = 100, R = 40;
      PG.fillEllipse(c, sx, sy, R, R, (dx, dy, d) => (d < 0.45 ? "#ffd94a" : "#ffb23e"));
      c.fillStyle = "#ffb23e";
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        for (let j = 0; j < 3; j++) {
          const rr = R + 10 + j * GRID;
          c.fillRect(snap(sx + Math.cos(a) * rr), snap(sy + Math.sin(a) * rr), PX, PX);
        }
      }
      // far hills, solid cells so they don't read as plaid over the sky
      for (const [hx, hy, hrx, hry, col] of [[230, 560, 420, 120, "#9fd08a"], [880, 574, 520, 150, "#8cc47a"]]) {
        c.fillStyle = col;
        for (let y = snap(hy - hry); y < hy; y += GRID)
          for (let x = snap(hx - hrx); x <= hx + hrx; x += GRID) {
            const dx = (x - hx) / hrx, dy = (y - hy) / hry;
            if (dx * dx + dy * dy <= 1) c.fillRect(x, y, GRID, GRID);
          }
      }
      c.fillStyle = "#a2cd87";
      c.fillRect(0, 520, W, 40);
      c.fillStyle = "#2f7d4f";
      c.fillRect(0, 560, W, H - 560);
      const s = PG.rng("agent-ground");
      for (let y = 520; y < H; y += GRID)
        for (let x = 0; x < W; x += GRID) {
          if (s() > 0.1) continue;
          c.fillStyle = y < 560 ? "#8bb96e" : "#266a42";
          c.fillRect(x, y, PX, PX);
        }
      // trail
      c.fillStyle = "#efe0b4";
      for (let x = 0; x < W; x += GRID * 2) { c.fillRect(x, A_TRAIL - 4, PX, PX); c.fillRect(x + GRID, A_TRAIL, PX, PX); }
      c.fillStyle = "#3d9a62";
      for (let x = 0; x < W; x += GRID * 2) if (s() < 0.4) c.fillRect(x, 556, PX, PX);
    },
  };
})();

/* ---------- mount ----------
   defs: [[id, sceneDef, canvas]]. canvases painted while the document is
   still parsing can lose their backing store in chromium, so call this
   after load. each scene starts growing when it scrolls into view. */
const SCENE_DEFS = { roots: ROOTS, evals: EVALS, loss: LOSS, agent: AGENT };
function mountScenes(pairs) {
  const list = pairs.map(([id, canvas]) => makeScene(id, SCENE_DEFS[id], canvas));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) list.find((sc) => sc.canvas === e.target).visible = e.isIntersecting;
  }, { threshold: 0.15 });
  for (const s of list) { s.ctx.drawImage(s.bg, 0, 0); io.observe(s.canvas); }
  (function loop(t) {
    for (const s of list) {
      if (!s.visible) continue;
      if (!s.started) startScene(s, t);
      frameScene(s, t);
    }
    requestAnimationFrame(loop);
  })(performance.now());
  return list;
}

