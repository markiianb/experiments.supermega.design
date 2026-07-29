/* ============================================================
   PIXEL GARDEN LAB — core engine
   SUPERMEGA Design, 2026. Plain canvas 2D, no dependencies.

   Everything snaps to a 4px grid drawing 3×3px squares — the
   1px gap is the look. Decoded from config.floguo.com, rebuilt
   and extended. Load before sprites.js and any experiment.
   ============================================================ */
(function () {
  "use strict";

  const GRID = 4;   // logical grid step
  const PX = 3;     // drawn square (1px gap = dot matrix)

  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const snap = (v) => GRID * Math.round(v / GRID);

  /* ---------- deterministic randomness ---------- */
  function fnv(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x1000193);
    }
    return h >>> 0;
  }
  function rng(seed) {
    let n = (typeof seed === "string" ? fnv(seed) : seed) >>> 0;
    return () => (n = (Math.imul(1664525, n) + 0x3c6ef35f) >>> 0) / 0x100000000;
  }

  /* ---------- easing ---------- */
  const easeExpoIn = (n) => (n <= 0 ? 0 : n >= 1 ? 1 : Math.pow(2, 12 * n - 12));
  const easeOutQuad = (n) => 1 - (1 - n) * (1 - n);

  /* ---------- canvas plumbing ---------- */
  // size a canvas to its CSS box at devicePixelRatio, return drawing context
  function fitCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h, dpr };
  }

  // pre-render a static layer once; draw(ctx, w, h)
  function offscreen(w, h, draw) {
    const dpr = window.devicePixelRatio || 1;
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w * dpr));
    c.height = Math.max(1, Math.round(h * dpr));
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, w, h);
    return c;
  }

  /* ---------- halftone sky ----------
     Dots on a lattice; radius follows a sum of gaussian blobs.
     blobs: [{cx,cy,rx,ry,s}] in 0..1 relative coords.         */
  function halftone(w, h, opts) {
    const {
      bg, dot, blobs,
      spacing = 8, maxR = 1.8, threshold = 0.12,
    } = opts;
    return offscreen(w, h, (c) => {
      if (bg) { c.fillStyle = bg; c.fillRect(0, 0, w, h); }
      c.fillStyle = dot;
      for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = spacing / 2; y < h; y += spacing) {
          let f = 0;
          for (const b of blobs) {
            const dx = (x / w - b.cx) / b.rx;
            const dy = (y / h - b.cy) / b.ry;
            f += b.s * Math.exp(-(2.5 * (dx * dx + dy * dy)));
          }
          if (f < threshold) continue;
          c.beginPath();
          c.arc(x, y, Math.min(maxR, maxR * f), 0, Math.PI * 2);
          c.fill();
        }
      }
    });
  }

  /* ---------- sprites ----------
     sprite = { rows: ["..ABA..", ...], stemCol, pal: {A:"#..."} }
     Returns draw cells ordered bottom-to-top (stem grows first). */
  function spriteCells(sprite, scale, gx, gy) {
    const cell = GRID * scale;
    const size = Math.max(2, Math.round(PX * scale));
    const rows = sprite.rows;
    const perRow = rows.map(() => []);
    for (let r = 0; r < rows.length; r++) {
      for (let cIdx = 0; cIdx < rows[r].length; cIdx++) {
        const ch = rows[r][cIdx];
        if (ch === "." || ch === " ") continue;
        const color = sprite.pal[ch];
        if (!color) continue;
        perRow[r].push({
          x: gx + (cIdx - sprite.stemCol) * cell,
          y: gy - (rows.length - r) * cell,
          color, size,
        });
      }
    }
    const out = [];
    for (let r = rows.length - 1; r >= 0; r--) out.push(...perRow[r]);
    return out;
  }

  // remap a sprite's palette (e.g. wilt a flower to greys)
  function recolor(sprite, mapper) {
    const pal = {};
    for (const k in sprite.pal) pal[k] = mapper(sprite.pal[k], k);
    return { ...sprite, pal };
  }

  /* ---------- pixel text (FONT defined in sprites.js) ----------
     Cells ordered letter-by-letter, bottom-up inside each letter,
     so a Grower "builds" the text. scale multiplies the grid.    */
  function textCells(text, gx, gy, opts = {}) {
    const { scale = 1, color = "#1c1a17", tracking = 1 } = opts;
    const FONT = PG.FONT;
    const cell = GRID * scale;
    const size = Math.max(2, Math.round(PX * scale));
    const out = [];
    let cx = gx;
    for (const ch of text.toUpperCase()) {
      if (ch === " ") { cx += cell * 3; continue; }
      const glyph = FONT[ch];
      if (!glyph) { cx += cell * 4; continue; }
      const wCols = Math.max(...glyph.map((r) => r.length));
      for (let r = glyph.length - 1; r >= 0; r--) {
        for (let c = 0; c < glyph[r].length; c++) {
          if (glyph[r][c] !== "X") continue;
          out.push({
            x: cx + c * cell,
            y: gy + (r - glyph.length) * cell,
            color, size,
          });
        }
      }
      cx += (wCols + tracking) * cell;
    }
    return out;
  }
  function textWidth(text, scale = 1, tracking = 1) {
    const FONT = PG.FONT;
    const cell = GRID * scale;
    let w = 0;
    for (const ch of text.toUpperCase()) {
      if (ch === " ") { w += cell * 3; continue; }
      const glyph = FONT[ch];
      w += glyph
        ? (Math.max(...glyph.map((r) => r.length)) + tracking) * cell
        : cell * 4;
    }
    return w;
  }

  /* ---------- Grower ----------
     Reveals cells in order with expo-in ease, alpha shimmer on
     the growth front, sparkle flicker once complete.            */
  class Grower {
    constructor(cells, opts = {}) {
      this.cells = cells;
      this.bornAt = opts.bornAt ?? performance.now();
      this.duration = opts.duration ?? 1000;
      this.flicker = opts.flicker ?? true;
      this.flickerFrame = 0;
      this.flickerTick = 0;
      this.hidden = new Set();
    }
    progress(t) {
      if (reducedMotion) return 1;
      return Math.min(1, Math.max(0, (t - this.bornAt) / this.duration));
    }
    get doneAt() { return this.bornAt + this.duration; }
    draw(ctx, t) {
      const eased = easeExpoIn(this.progress(t));
      const visible = Math.floor(eased * this.cells.length);
      if (visible <= 0) return false;

      if (!reducedMotion && this.flicker && eased >= 1 &&
          t - this.flickerTick > 100) {
        this.flickerTick = t;
        this.flickerFrame++;
        this.hidden.clear();
        const base = 7919 * this.flickerFrame;
        for (let k = 0; k < 3; k++) {
          this.hidden.add(Math.abs((base * (k + 1) * 0x9e3779b1) >>> 0) % visible);
        }
      }

      for (let i = 0; i < visible; i++) {
        if (this.hidden.has(i)) continue;
        const cell = this.cells[i];
        const fromFront = visible - 1 - i;
        ctx.globalAlpha =
          eased < 1 && fromFront < 12 ? Math.pow((fromFront + 1) / 13, 0.4) : 1;
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x, cell.y, cell.size, cell.size);
      }
      ctx.globalAlpha = 1;
      return eased >= 1;
    }
  }

  /* ---------- Ungrower — reverse Grower for wilting/decay ---------- */
  class Ungrower {
    constructor(cells, opts = {}) {
      this.cells = cells;
      this.bornAt = opts.bornAt ?? performance.now();
      this.duration = opts.duration ?? 700;
    }
    draw(ctx, t) {
      const n = reducedMotion ? 1 :
        Math.min(1, Math.max(0, (t - this.bornAt) / this.duration));
      const visible = Math.floor((1 - easeOutQuad(n)) * this.cells.length);
      for (let i = 0; i < visible; i++) {
        const cell = this.cells[i];
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x, cell.y, cell.size, cell.size);
      }
      return n >= 1;
    }
  }

  /* ---------- drifting pixel clouds ---------- */
  function makeClouds(w, skyH, defs) {
    const lobes = (rx, ry) => [
      { ox: 0,          oy: 0,          rx: rx * 0.65, ry: ry        },
      { ox: rx * 0.52,  oy: -ry * 0.35, rx: rx * 0.55, ry: ry * 0.8  },
      { ox: -rx * 0.5,  oy: -ry * 0.25, rx: rx * 0.48, ry: ry * 0.75 },
      { ox: rx * 0.88,  oy: ry * 0.12,  rx: rx * 0.34, ry: ry * 0.6  },
      { ox: -rx * 0.82, oy: ry * 0.1,   rx: rx * 0.3,  ry: ry * 0.55 },
    ];
    return defs.map((d) => ({
      ...d,
      y: d.y * skyH,
      lobes: lobes(d.rx * w, d.ry * skyH),
    }));
  }
  function drawClouds(ctx, clouds, w, t, colors) {
    const [hi, lo] = colors ?? ["#ffffff", "#f0e6d2"];
    const span = w + 400;
    for (const cl of clouds) {
      const drift = ((cl.speed * t) / 1000) % span;
      const cx = (((cl.baseX * w - drift) % span) + span) % span;
      for (const loBlob of cl.lobes) {
        const lx = cx + loBlob.ox, ly = cl.y + loBlob.oy;
        const x0 = snap(lx - loBlob.rx), y0 = snap(ly - loBlob.ry);
        for (let y = y0; y <= ly + loBlob.ry; y += GRID) {
          for (let x = x0; x <= lx + loBlob.rx; x += GRID) {
            const dx = (x - lx) / loBlob.rx, dy = (y - ly) / loBlob.ry;
            const d = dx * dx + dy * dy;
            if (d > 1) continue;
            ctx.globalAlpha = cl.alpha * (1 - 0.55 * d);
            ctx.fillStyle = dy < -0.3 ? hi : lo;
            ctx.fillRect(x, y, PX, PX);
          }
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- pixel ellipse fill (sun, moon, hills) ----------
     colorFn(dx, dy, d2) returns a color or null to skip.       */
  function fillEllipse(ctx, cx, cy, rx, ry, colorFn) {
    for (let y = snap(cy - ry); y <= cy + ry; y += GRID) {
      for (let x = snap(cx - rx); x <= cx + rx; x += GRID) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry;
        const d = dx * dx + dy * dy;
        if (d > 1) continue;
        const col = colorFn(dx, dy, d);
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(x, y, PX, PX);
      }
    }
  }

  // flat pixel-grid rectangle fill
  function fillGrid(ctx, x0, y0, x1, y1, color) {
    ctx.fillStyle = color;
    for (let y = snap(y0); y < y1; y += GRID) {
      for (let x = snap(x0); x < x1; x += GRID) ctx.fillRect(x, y, PX, PX);
    }
  }

  // pixel line, 3×3 squares along the segment
  function pixelLine(ctx, x0, y0, x1, y1, color) {
    ctx.fillStyle = color;
    const dx = x1 - x0, dy = y1 - y0;
    const steps = Math.ceil(Math.hypot(dx, dy) / GRID);
    for (let i = 0; i <= steps; i++) {
      const f = steps ? i / steps : 0;
      ctx.fillRect(snap(x0 + dx * f), snap(y0 + dy * f), PX, PX);
    }
  }

  /* ---------- proximity easter egg ---------- */
  class Egg {
    constructor(rx, ry, r, draw) {
      this.rx = rx; this.ry = ry; this.r = r;
      this.drawFn = draw; this.alpha = 0;
    }
    draw(ctx, w, h, mouse) {
      const ex = this.rx * w, ey = this.ry * h;
      const near = Math.hypot(mouse.x - ex, mouse.y - ey) < this.r ? 1 : 0;
      this.alpha += (near - this.alpha) * 0.07;
      if (this.alpha > 0.01) {
        ctx.globalAlpha = this.alpha;
        this.drawFn(ctx, snap(ex), snap(ey));
        ctx.globalAlpha = 1;
      }
    }
  }

  /* ---------- pixel cursor trail ----------
     attachTrail(canvas, opts) — canvas should be fixed, inset 0,
     pointer-events none. Returns a detach function.             */
  function attachTrail(canvas, opts = {}) {
    if (!window.matchMedia("(pointer: fine)").matches || reducedMotion) {
      canvas.style.display = "none";
      return () => {};
    }
    const STEP = opts.step ?? 6;
    const SIZE = opts.size ?? 5;
    const MAX = opts.max ?? 40;
    const PALETTE = opts.palette ?? PG.TRAIL_PALETTE;
    const HEAD = opts.head ?? "#1c1a17";
    const onPlant = opts.onPlant ?? null;   // (x, y, color) per dropped pixel

    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const q = (v) => STEP * Math.floor(v / STEP);

    const head = { x: -100, y: -100 };
    let trail = [], lastCell = { x: -1, y: -1 }, colorIdx = 0;
    let lastMove = Infinity, collapseStart = 0, collapseFrom = 0, keep = Infinity;
    let raf = 0;

    const onMove = (e) => {
      head.x = e.clientX; head.y = e.clientY;
      lastMove = performance.now();
      collapseStart = 0; keep = Infinity;
      const cx = q(e.clientX), cy = q(e.clientY);
      if (cx !== lastCell.x || cy !== lastCell.y) {
        lastCell = { x: cx, y: cy };
        trail.push({ x: cx, y: cy, color: PALETTE[colorIdx % PALETTE.length] });
        colorIdx++;
        if (trail.length > MAX) {
          const dropped = trail.shift();
          if (onPlant) onPlant(dropped.x, dropped.y, dropped.color);
        }
      }
    };
    const onResize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
    };

    function loop(t) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      if (t - lastMove > 80 && trail.length > 0) {
        if (collapseStart === 0) { collapseStart = t; collapseFrom = trail.length; }
        const e = Math.min(1, (t - collapseStart) / 500);
        keep = Math.min(keep, Math.floor((1 - e * e) * collapseFrom));
        while (trail.length > keep) {
          const dropped = trail.shift();
          if (onPlant) onPlant(dropped.x, dropped.y, dropped.color);
        }
      }
      const n = trail.length;
      for (let i = 0; i < n; i++) {
        ctx.globalAlpha = 0.25 + 0.65 * (n <= 1 ? 1 : i / (n - 1));
        ctx.fillStyle = trail[i].color;
        ctx.fillRect(q(trail[i].x), q(trail[i].y), SIZE, SIZE);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = HEAD;
      ctx.fillRect(q(head.x), q(head.y), SIZE, SIZE);
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }

  /* ---------- export ---------- */
  window.PG = {
    GRID, PX, snap, fnv, rng,
    reducedMotion,
    easeExpoIn, easeOutQuad,
    fitCanvas, offscreen, halftone,
    spriteCells, recolor, textCells, textWidth,
    Grower, Ungrower,
    makeClouds, drawClouds,
    fillEllipse, fillGrid, pixelLine,
    Egg, attachTrail,
    // lab palette — brand colors TBD; these are the lab placeholders
    COLORS: {
      paper: "#faf4e8",
      ink: "#1c1a17",
      red: "#e23b47",
      redDeep: "#b81f2e",
      gold: "#f5b81e",
      amber: "#f0a51c",
      green: "#2f7d4f",
      greenLight: "#3d9a62",
      stem: "#2e6b34",
      leaf: "#3d8a42",
      skyWarm: "#f6ead6",
      skyDot: "#ecc89d",
    },
    TRAIL_PALETTE: [
      "#f5b81e", "#e23b47", "#6c4ab0", "#2d5fb8",
      "#f0a51c", "#ea6db4", "#3d9a62", "#ffd94a",
      "#c33d8d", "#4f83e0", "#2f7d4f", "#b81f2e",
    ],
  };
})();
