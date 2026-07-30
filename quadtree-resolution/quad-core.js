/*
 * quad-core.js — quadtree "resolution" engine.
 * Study of Kitasenju Design's "resolution" post — Q: QuadTree from
 * "Algorithms from A to Z" (github.com/kitasenjudesign/algorithms-from-a-to-z,
 * src/mojis/17_q/). The splitter rule (including its corner-pixel deviation
 * quirk) and the maxDepth timeline are carried verbatim; the extruded
 * colored-block rendering is a measured reconstruction from the video (the
 * published Q source draws white stroke rects/ellipses). Seeded PRNG, mask
 * text, palettes and the instrument are ours.
 * Classic script: attaches QuadEngine to the root object. No dependencies.
 */
(function (root) {
  'use strict';

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const BUFFER = 128; // the reference's QuadTreeThree.WIDTH/HEIGHT

  function gray(img, x, y) {
    const i = ((x | 0) + (y | 0) * img.width) * 4;
    return (img.data[i] + img.data[i + 1] + img.data[i + 2]) / 3;
  }

  function regionMean(img, x, y, w, h) {
    let sum = 0, n = 0;
    for (let j = y; j < y + h; j++) {
      for (let i = x; i < x + w; i++) { sum += gray(img, i, j); n++; }
    }
    return n ? sum / n : 0;
  }

  // The reference's getHensa sums |mean - getPixel(xx,yy)| — the CORNER pixel,
  // not (i,j) — so "deviation" is literally |mean - corner|. mode 'faithful'
  // reproduces that; mode 'true' is the mean absolute deviation it meant.
  function deviation(img, x, y, w, h, mode) {
    const m = regionMean(img, x, y, w, h);
    if (mode !== 'true') return Math.abs(m - gray(img, x, y));
    let sum = 0, n = 0;
    for (let j = y; j < y + h; j++) {
      for (let i = x; i < x + w; i++) { sum += Math.abs(m - gray(img, i, j)); n++; }
    }
    return n ? sum / n : 0;
  }

  // opts: { maxDepth (may be fractional — the reference tweens it), threshold,
  // mode ('faithful'|'true'), minSize }
  function split(img, opts) {
    const leaves = [];
    const minSize = opts.minSize || 0;
    function recurse(x, y, w, h, depth) {
      const dev = deviation(img, x, y, w, h, opts.mode);
      if (dev < opts.threshold || depth >= opts.maxDepth || w / 2 < 1 || h / 2 < 1) {
        if (w > minSize) leaves.push({ x, y, w, h, depth, mean: regionMean(img, x, y, w, h) });
        return;
      }
      recurse(x, y, w / 2, h / 2, depth + 1);
      recurse(x + w / 2, y, w / 2, h / 2, depth + 1);
      recurse(x, y + h / 2, w / 2, h / 2, depth + 1);
      recurse(x + w / 2, y + h / 2, w / 2, h / 2, depth + 1);
    }
    recurse(0, 0, img.width, img.height, 0);
    return leaves;
  }

  // The reference loop (QuadTreeP5.loopAnim, GSAP):
  //   t=0: maxDepth 0 · t=1..3: linear 0->N · hold · t=8.5..9.5: linear N->0 ·
  //   loop at t=10.5.
  function timelineDepth(t, opts) {
    const N = (opts && opts.maxN) || 7;
    const u = ((t % 10.5) + 10.5) % 10.5;
    if (u < 1) return 0;
    if (u < 3) return N * (u - 1) / 2;
    if (u < 8.5) return N;
    if (u < 9.5) return N * (1 - (u - 8.5));
    return 0;
  }

  // Stable per-cell color: pure function of (x, y, w, seed, palette). Coarse
  // cells go pastel, deep small cells go saturated — measured from the video.
  function leafColor(leaf, seed, palette) {
    const key = (Math.imul(leaf.x | 0, 73856093) ^ Math.imul(leaf.y | 0, 19349663)
      ^ Math.imul(leaf.w | 0, 83492791) ^ (seed | 0)) >>> 0;
    const rng = mulberry32(key);
    const coarse = leaf.w >= BUFFER / 4;
    const h = Math.floor(rng() * 360);
    const s = coarse ? 55 + rng() * 25 : 70 + rng() * 25;
    const l = coarse ? 62 + rng() * 18 : 45 + rng() * 25;
    switch (palette) {
      case 'red': {
        const rh = 355 + rng() * 14 - 7;
        return `hsl(${rh.toFixed(1)}, ${(70 + rng() * 25).toFixed(1)}%, ${(coarse ? 55 + rng() * 20 : 40 + rng() * 25).toFixed(1)}%)`;
      }
      case 'mono': {
        const g = coarse ? 78 + rng() * 14 : 30 + rng() * 55;
        return `hsl(0, 0%, ${g.toFixed(1)}%)`;
      }
      case 'paper': {
        return `hsl(${h}, ${(20 + rng() * 20).toFixed(1)}%, ${(coarse ? 82 + rng() * 10 : 60 + rng() * 22).toFixed(1)}%)`;
      }
      default: // spectrum — the video's look
        return `hsl(${h}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
    }
  }

  function shade(hsl, dl) {
    // hsl(...) string -> same hue/sat with lightness shifted by dl (clamped)
    const m = /^hsl\(([\d.]+), ([\d.]+)%, ([\d.]+)%\)$/.exec(hsl);
    if (!m) return hsl;
    const l = Math.max(0, Math.min(100, parseFloat(m[3]) + dl));
    return `hsl(${m[1]}, ${m[2]}%, ${l}%)`;
  }

  // Painter order: cell boxes extend back up-right, and a neighbor's front
  // face occludes the bevels of the cell below-left of it — so draw lower-left
  // cells FIRST and up-right cells last. Ascending (x - y), ties: lower first.
  function paintOrder(leaves) {
    return [...leaves].sort((a, b) => (a.x - a.y) - (b.x - b.y) || b.y - a.y);
  }

  const KX = 0.85, KY = 0.55; // up-right extrusion direction

  // Draw the slab: a pale back board first (the video's grey-blue backdrop),
  // then each leaf as a box — front face flat at base position, top and right
  // faces extending back by the extrusion vector. Interior bevels get covered
  // by up-right neighbours' front faces; bevels stay visible along the slab's
  // top/right edges and wherever fine cells step against coarse ones — which
  // is exactly the video's reading.
  function drawBlocks(ctx, leaves, layout, seed, palette, extrude, perDepth, boardColor) {
    const side = BUFFER * layout.scale;
    const bx = extrude * 1.7 * KX, by = -extrude * 1.7 * KY;
    // back board
    ctx.fillStyle = boardColor || '#ccd0dd';
    ctx.beginPath();
    ctx.moveTo(layout.x0, layout.y0);
    ctx.lineTo(layout.x0 + bx, layout.y0 + by);
    ctx.lineTo(layout.x0 + side + bx, layout.y0 + by);
    ctx.lineTo(layout.x0 + side + bx, layout.y0 + side + by);
    ctx.lineTo(layout.x0 + side, layout.y0 + side);
    ctx.lineTo(layout.x0 + side, layout.y0);
    ctx.closePath();
    ctx.fill();
    for (const leaf of paintOrder(leaves)) {
      const sx = layout.x0 + leaf.x * layout.scale;
      const sy = layout.y0 + leaf.y * layout.scale;
      const sw = leaf.w * layout.scale;
      const sh = leaf.h * layout.scale;
      const e = extrude + (perDepth || 0) * leaf.depth;
      const ox = e * KX, oy = -e * KY;
      const color = leafColor(leaf, seed, palette);
      // top face (lightened)
      ctx.fillStyle = shade(color, +14);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + ox, sy + oy);
      ctx.lineTo(sx + sw + ox, sy + oy);
      ctx.lineTo(sx + sw, sy);
      ctx.closePath();
      ctx.fill();
      // right face (darkened)
      ctx.fillStyle = shade(color, -12);
      ctx.beginPath();
      ctx.moveTo(sx + sw, sy);
      ctx.lineTo(sx + sw + ox, sy + oy);
      ctx.lineTo(sx + sw + ox, sy + sh + oy);
      ctx.lineTo(sx + sw, sy + sh);
      ctx.closePath();
      ctx.fill();
      // front face flat at base
      ctx.fillStyle = color;
      ctx.fillRect(sx, sy, sw, sh);
    }
  }

  // Their skin: white stroke rect + ellipse per leaf on black (QuadTreeSplitter).
  function drawWireframe(ctx, leaves, layout, ink) {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    for (const leaf of leaves) {
      const sx = layout.x0 + leaf.x * layout.scale;
      const sy = layout.y0 + leaf.y * layout.scale;
      const sw = leaf.w * layout.scale;
      const sh = leaf.h * layout.scale;
      ctx.strokeRect(sx, sy, sw, sh);
      ctx.beginPath();
      ctx.ellipse(sx + sw / 2, sy + sh / 2, sw / 2, sh / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Browser-only: rasterize text white-on-black at BUFFER resolution.
  function renderMask(text, opts) {
    const o = opts || {};
    const size = o.size || BUFFER;
    const c = root.document.createElement('canvas');
    c.width = size; c.height = size;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#000';
    g.fillRect(0, 0, size, size);
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    let px = Math.floor(size * 0.86);
    const family = 'bold %spx "Helvetica Neue", Helvetica, Arial, sans-serif';
    g.font = family.replace('%s', px);
    const tw = g.measureText(text).width;
    if (tw > size * 0.9) {
      px = Math.floor(px * (size * 0.9) / tw);
      g.font = family.replace('%s', px);
    }
    g.fillText(text, size / 2, size / 2);
    return g.getImageData(0, 0, size, size);
  }

  const DEFAULTS = {
    seed: 17,
    text: 'A',
    threshold: 0.03, // verbatim hensaTh — compared against 0..255 deviations, so
                     // any non-uniform region splits; the instrument exposes 0..64
    mode: 'faithful',
    maxN: 7,
    timeline: true,
    manualDepth: 7,
    speed: 1,
    fps: 12,
    skin: 'blocks',
    palette: 'spectrum',
    extrude: 26,
    perDepth: 0,
    ground: '#e9e9ec',
    ink: '#ffffff',
    viewX: 0,
    viewY: 0,
    zoom: 1,
  };

  function run(canvas, userConfig) {
    const config = Object.assign({}, DEFAULTS, userConfig || {});
    const ctx = canvas.getContext('2d');
    let mask = null;
    let frame = 0;
    let simT = 0; // accumulated timeline seconds — speed changes alter the rate
                  // from the current phase instead of rescaling all past time
    let paused = false;
    let rafId = 0;
    let lastTick = 0;
    let width = 0, height = 0;

    function rebuild() {
      const dpr = root.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mask = renderMask(config.text);
    }

    function paint() {
      ctx.fillStyle = config.skin === 'wireframe' ? '#000000' : config.ground;
      ctx.fillRect(0, 0, width, height);
      const maxDepth = config.timeline ? timelineDepth(simT, { maxN: config.maxN })
        : Math.min(config.manualDepth, config.maxN);
      const leaves = split(mask, {
        maxDepth, threshold: config.threshold, mode: config.mode,
      });
      const side = Math.min(width, height) * 0.68;
      const layout = {
        x0: (width - side) / 2,
        y0: (height - side) / 2,
        scale: side / mask.width,
      };
      ctx.save();
      ctx.translate(width / 2 + (config.viewX || 0), height / 2 + (config.viewY || 0));
      ctx.scale(config.zoom || 1, config.zoom || 1);
      ctx.translate(-width / 2, -height / 2);
      if (config.skin === 'wireframe') drawWireframe(ctx, leaves, layout, config.ink);
      else drawBlocks(ctx, leaves, layout, config.seed, config.palette, config.extrude, config.perDepth, config.board);
      ctx.restore();
    }

    function loop(now) {
      rafId = root.requestAnimationFrame(loop);
      if (paused) return;
      const interval = 1000 / config.fps;
      if (now - lastTick < interval) return;
      lastTick = now - ((now - lastTick) % interval);
      paint();
      frame++;
      simT += config.speed / config.fps;
    }

    rebuild();
    rafId = root.requestAnimationFrame(loop);

    return {
      get frame() { return frame; },
      get config() { return config; },
      get paused() { return paused; },
      pause() { paused = true; },
      play() { paused = false; },
      setConfig(partial, opts) {
        const softKeys = ['threshold', 'mode', 'maxN', 'timeline', 'manualDepth', 'speed',
          'fps', 'skin', 'palette', 'extrude', 'perDepth', 'ground', 'board', 'ink', 'seed',
          'viewX', 'viewY', 'zoom'];
        const needsRebuild = Object.keys(partial).some((k) =>
          softKeys.indexOf(k) === -1 &&
          JSON.stringify(partial[k]) !== JSON.stringify(config[k]));
        Object.assign(config, partial);
        if (needsRebuild || (opts && opts.rebuild)) rebuild();
        if (paused) paint();
      },
      reseed(seed) {
        config.seed = (seed === undefined) ? Math.floor(Math.random() * 0xFFFFFFFF) : seed;
        if (paused) paint();
        return config.seed;
      },
      resize() { rebuild(); if (paused) paint(); },
      paintOnce() { paint(); },
      destroy() { root.cancelAnimationFrame(rafId); },
    };
  }

  root.QuadEngine = {
    mulberry32, BUFFER, gray, regionMean, deviation, split, timelineDepth,
    leafColor, shade, paintOrder, drawBlocks, drawWireframe, renderMask, run, DEFAULTS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
