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

  // Seeded per-cell elevation: base thickness + a random pop toward the
  // viewer, gently biased so deeper (finer) cells bristle a little more —
  // the reference's boxes pop forward at random heights.
  function leafElevation(leaf, seed, extrude, pop, perDepth, maxN) {
    const key = (Math.imul(leaf.x | 0, 40503) ^ Math.imul(leaf.y | 0, 88651)
      ^ Math.imul(leaf.w | 0, 63689) ^ ((seed | 0) + 0x9E37)) >>> 0;
    const rng = mulberry32(key);
    const depthBias = 0.55 + 0.45 * Math.min(1, leaf.depth / (maxN || 7));
    return extrude + rng() * (pop || 0) * depthBias + (perDepth || 0) * leaf.depth;
  }

  // Orthographic camera: yaw around the vertical axis, then pitch around the
  // horizontal. World units are buffer pixels; z points toward the viewer.
  // Returns [screenX, screenY, depth] — larger depth = closer to the camera.
  function makeCamera(yawDeg, pitchDeg, layout) {
    // positive yaw = camera to the right (right faces visible);
    // positive pitch = camera above (top faces visible)
    const yaw = (yawDeg || 0) * Math.PI / 180;
    const pitch = -(pitchDeg || 0) * Math.PI / 180;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const half = BUFFER / 2;
    const cxs = layout.x0 + half * layout.scale;
    const cys = layout.y0 + half * layout.scale;
    const rotate = (dx, dy, dz) => {
      const x1 = dx * cy - dz * sy;
      const z1 = dx * sy + dz * cy;
      const y1 = dy * cp - z1 * sp;
      const z2 = dy * sp + z1 * cp;
      return [x1, y1, z2];
    };
    const project = (px, py, pz) => {
      const [x1, y1, z2] = rotate(px - half, py - half, pz);
      return [cxs + x1 * layout.scale, cys + y1 * layout.scale, z2];
    };
    // a face is visible when its outward normal rotates toward the viewer
    project.faceVisible = (nx, ny, nz) => rotate(nx, ny, nz)[2] > 1e-9;
    return project;
  }

  // Draw one axis-aligned box (in buffer space, z from z0 back plane to z1
  // front) through the camera: project 8 corners, draw each face whose
  // projected winding faces the camera. Corner order per face is CCW seen
  // from outside, so a negative signed area means "visible".
  function drawBox(ctx, project, x, y, w, h, z0, z1, faceColors) {
    const c = [
      project(x, y, z1), project(x + w, y, z1), project(x + w, y + h, z1), project(x, y + h, z1),
      project(x, y, z0), project(x + w, y, z0), project(x + w, y + h, z0), project(x, y + h, z0),
    ];
    // [corner indices, outward normal, name] — visibility from the normal,
    // never from projected winding (winding flips are how faces vanish).
    const faces = [
      [[0, 1, 2, 3], [0, 0, 1], 'front'],
      [[5, 4, 7, 6], [0, 0, -1], 'back'],
      [[4, 5, 1, 0], [0, -1, 0], 'top'],
      [[3, 2, 6, 7], [0, 1, 0], 'bottom'],
      [[4, 0, 3, 7], [-1, 0, 0], 'left'],
      [[1, 5, 6, 2], [1, 0, 0], 'right'],
    ];
    for (const [idx, n, name] of faces) {
      if (!project.faceVisible(n[0], n[1], n[2])) continue;
      const color = faceColors[name];
      if (!color) continue;
      const p0 = c[idx[0]], p1 = c[idx[1]], p2 = c[idx[2]], p3 = c[idx[3]];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.lineTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Painter order: boxes sorted by projected depth of their center, far first.
  function paintOrder(leaves, project, elevation) {
    const elev = elevation || (() => 0);
    return [...leaves].map((leaf) => {
      const e = elev(leaf);
      const center = project(leaf.x + leaf.w / 2, leaf.y + leaf.h / 2, e / 2);
      return { leaf, depth: center[2] };
    }).sort((a, b) => a.depth - b.depth).map((entry) => entry.leaf);
  }

  // Draw the scene: the pale back board (a thin box behind the base plane),
  // then every leaf as a 3D pillar popping toward the viewer.
  function drawBlocks(ctx, leaves, layout, seed, palette, extrude, perDepth, boardColor, pop, maxN, yaw, pitch) {
    const project = makeCamera(yaw, pitch, layout);
    const board = boardColor || '#ccd0dd';
    drawBox(ctx, project, 0, 0, BUFFER, BUFFER, -14, 0, {
      front: board, top: shade(boardShade(board), +8), bottom: shade(boardShade(board), -8),
      left: shade(boardShade(board), +4), right: shade(boardShade(board), -6), back: board,
    });
    const elev = (leaf) => leafElevation(leaf, seed, extrude, pop, perDepth, maxN) * 0.22;
    for (const leaf of paintOrder(leaves, project, elev)) {
      const color = leafColor(leaf, seed, palette);
      drawBox(ctx, project, leaf.x, leaf.y, leaf.w, leaf.h, 0, Math.max(0.6, elev(leaf)), {
        front: color,
        top: shade(color, +14),
        bottom: shade(color, -18),
        left: shade(color, +7),
        right: shade(color, -12),
        back: null,
      });
    }
  }

  // boards arrive as hex — convert to an hsl() string once so shade() works
  function boardShade(hex) {
    const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return hex;
    const r = parseInt(m[1], 16) / 255, g = parseInt(m[2], 16) / 255, bl = parseInt(m[3], 16) / 255;
    const max = Math.max(r, g, bl), min = Math.min(r, g, bl);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - bl) / d + (g < bl ? 6 : 0)) / 6;
      else if (max === g) h = ((bl - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return `hsl(${(h * 360).toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%)`;
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
    extrude: 8,
    pop: 40,
    perDepth: 0,
    yaw: 20,
    pitch: 12,
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
      else drawBlocks(ctx, leaves, layout, config.seed, config.palette, config.extrude,
        config.perDepth, config.board, config.pop, config.maxN, config.yaw, config.pitch);
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
          'fps', 'skin', 'palette', 'extrude', 'pop', 'perDepth', 'yaw', 'pitch',
          'ground', 'board', 'ink', 'seed', 'viewX', 'viewY', 'zoom'];
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
    leafColor, leafElevation, shade, makeCamera, drawBox, paintOrder,
    drawBlocks, drawWireframe, renderMask, run, DEFAULTS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
