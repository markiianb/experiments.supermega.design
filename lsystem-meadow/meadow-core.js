/*
 * meadow-core.js — L-system meadow engine.
 * Study of Kitasenju Design, "Algorithms from A to Z: L — L-system"
 * (github.com/kitasenjudesign/algorithms-from-a-to-z, src/mojis/12_l/).
 * Species rule tables, angles, decay and stroke formulas carried verbatim;
 * Canvas2D port, seeded PRNG, mask text and growth reveal are ours.
 * Classic script: attaches MeadowEngine to the root object. No dependencies.
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

  const DEG = Math.PI / 180;

  // The seven reference species. Each takes the tree's rng and returns
  // { axiom, rules, angleInc, iterations, baseStepLength } — constants
  // exactly as in LSystemTree.createSystem().
  const SPECIES = {
    symmetric: (rng) => ({
      axiom: 'X', rules: { X: 'F[+X][-X]FX', F: 'FF' },
      angleInc: 25 * DEG, iterations: 5,
      baseStepLength: Math.max(40, rng() * 120),
    }),
    broadleaf: (rng) => ({
      axiom: 'X', rules: { X: 'F[-X][+X][X]', F: 'FF' },
      angleInc: 22 * DEG, iterations: 4 + Math.floor(rng() * 2),
      baseStepLength: Math.max(30, rng() * 100),
    }),
    wind: (rng) => ({
      axiom: 'X', rules: { X: 'F[+X]F[-X]FX', F: 'FF' },
      angleInc: 20 * DEG, iterations: 4,
      baseStepLength: 50 + rng() * 80,
    }),
    weeping: (rng) => ({
      axiom: 'X', rules: { X: 'FF-[-X]+[+X]', F: 'FF' },
      angleInc: 18 * DEG, iterations: 4,
      baseStepLength: 40 + rng() * 60,
    }),
    pine: (rng) => ({
      axiom: 'X', rules: { X: 'FFX', F: 'F[+F][-F]F' },
      angleInc: 30 * DEG, iterations: 5,
      baseStepLength: 30 + rng() * 60,
    }),
    dead: (rng) => ({
      axiom: 'X',
      rules: {
        X: function () {
          const r = rng();
          if (r < 0.6) return 'F[+X]F[-X]FX';
          if (r < 0.9) return 'F[-X]FX';
          return 'F';
        },
        F: 'FF',
      },
      angleInc: (10 + rng() * 25) * DEG,
      iterations: 3 + Math.floor(rng() * 3),
      baseStepLength: 50 + rng() * 100,
    }),
    bamboo: (rng) => ({
      axiom: 'A', rules: { A: 'FFA', F: 'F[+F]F' },
      angleInc: 10 * DEG, iterations: 4,
      baseStepLength: 60 + rng() * 80,
    }),
  };

  const SPECIES_NAMES = Object.keys(SPECIES);
  const LEN_RATIO = 0.35;

  function expand(axiom, rules, iterations) {
    let sentence = axiom;
    for (let i = 0; i < iterations; i++) {
      let next = '';
      for (const ch of sentence) {
        const rule = rules[ch];
        if (rule === undefined) next += ch;
        else next += (typeof rule === 'function') ? rule() : rule;
      }
      sentence = next;
    }
    return sentence;
  }

  // mods (all optional, deterministic): angleScale multiplies the species
  // angle, iterDelta shifts iteration count (clamped 1..7), decay overrides
  // the 0.6+rng()*0.15 draw. The rng draw still happens when decay is
  // overridden so species params stay stable when toggling the override.
  function makeTree(rng, x, y, speciesPool, mods) {
    const m = mods || {};
    const pool = (speciesPool && speciesPool.length) ? speciesPool : SPECIES_NAMES;
    const type = pool[Math.floor(rng() * pool.length)];
    const spec = SPECIES[type](rng);
    const iterations = Math.max(1, Math.min(7, spec.iterations + (m.iterDelta || 0)));
    const angleInc = spec.angleInc * (m.angleScale || 1);
    const baseStepLength = spec.baseStepLength * LEN_RATIO;
    const rolledDecay = 0.6 + rng() * 0.15;
    const lengthDecay = (m.decay == null) ? rolledDecay : m.decay;
    const sentence = expand(spec.axiom, spec.rules, iterations);
    return {
      type, x, y, sentence,
      angleInc,
      iterations,
      baseStepLength,
      lengthDecay,
      stepLength: baseStepLength * Math.pow(lengthDecay, iterations),
      segments: (sentence.match(/[FG]/g) || []).length,
    };
  }

  // config: { treeCount, species (array|null), maskPoints ([{x,y} normalized]), mods }
  function buildForest(seed, config, width, height) {
    const rng = mulberry32(seed);
    const points = config.maskPoints;
    const trees = [];
    for (let i = 0; i < config.treeCount; i++) {
      const p = points[Math.floor(rng() * points.length)];
      trees.push(makeTree(rng, p.x * width, p.y * height, config.species, config.mods));
    }
    return trees;
  }

  // Turtle draw, 1:1 with the reference: transform stack, len stack,
  // strokeWeight = clamp(len/18, 0.5, 6), weeping/wind per-step curvature.
  // prefixCap limits how many F/G segments are drawn (growth reveal); pass
  // Infinity for the full plant.
  function drawTree(ctx, tree, sway, prefixCap) {
    const cap = (prefixCap === undefined) ? Infinity : prefixCap;
    ctx.save();
    ctx.translate(tree.x, tree.y);
    ctx.rotate(sway);
    const lenStack = [];
    let len = tree.stepLength;
    let drawn = 0;
    for (const ch of tree.sentence) {
      if (ch === 'F' || ch === 'G') {
        if (drawn < cap) {
          ctx.lineWidth = Math.max(0.5, Math.min(6, len / 18));
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -len);
          ctx.stroke();
          drawn++;
        }
        ctx.translate(0, -len);
        if (tree.type === 'weeping') ctx.rotate(-0.5 * DEG);
        if (tree.type === 'wind') ctx.rotate(0.2 * DEG);
      } else if (ch === 'f') {
        ctx.translate(0, -len);
      } else if (ch === '+') {
        ctx.rotate(tree.angleInc);
      } else if (ch === '-') {
        ctx.rotate(-tree.angleInc);
      } else if (ch === '[') {
        ctx.save();
        lenStack.push(len);
        len = len * tree.lengthDecay;
      } else if (ch === ']') {
        ctx.restore();
        const last = lenStack.pop();
        if (last !== undefined) len = last;
      }
    }
    ctx.restore();
  }

  // Browser-only: rasterize text on a small offscreen canvas and return the
  // bright pixels as normalized planting points (the reference samples a 90x90
  // glyph render of "L" at r>128).
  function sampleMask(text, opts) {
    const o = opts || {};
    const w = o.width || 90;
    const h = o.height || 90;
    const c = root.document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#000';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    let size = Math.floor(h * 0.92);
    const family = o.font || 'bold %spx "Helvetica Neue", Helvetica, Arial, sans-serif';
    g.font = family.replace('%s', size);
    const tw = g.measureText(text).width;
    if (tw > w * 0.94) {
      size = Math.floor(size * (w * 0.94) / tw);
      g.font = family.replace('%s', size);
    }
    g.fillText(text, w / 2, h / 2);
    const data = g.getImageData(0, 0, w, h).data;
    const points = [];
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (data[(j * w + i) * 4] > 128) points.push({ x: i / w, y: j / h });
      }
    }
    return points;
  }

  // Animation runner. config:
  //   seed, treeCount, species, maskText, maskFont, ink, background,
  //   swayAmp (rad), swaySpeed (rad/frame), fps, growth (bool),
  //   growthSpeed (segments/frame)
  const DEFAULTS = {
    seed: 1968,
    treeCount: 100,
    species: null,
    maskText: 'L',
    maskFont: null,
    ink: 'rgb(220,220,220)',
    background: '#000000',
    swayAmp: 0.2,
    swaySpeed: 0.02,
    fps: 20,
    growth: false,
    growthSpeed: 6,
    // view transform (presentation only — never touches the seeded geometry)
    viewX: 0,
    viewY: 0,
    zoom: 1,
  };

  function run(canvas, userConfig) {
    const config = Object.assign({}, DEFAULTS, userConfig || {});
    const ctx = canvas.getContext('2d');
    let trees = [];
    let frame = 0;
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
      const points = sampleMask(config.maskText, { font: config.maskFont });
      trees = points.length
        ? buildForest(config.seed, {
            treeCount: config.treeCount,
            species: config.species,
            maskPoints: points,
            mods: config.mods,
          }, width, height)
        : [];
      frame = 0;
    }

    function paint() {
      ctx.fillStyle = config.background;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = config.ink;
      const sway = Math.sin(frame * config.swaySpeed) * config.swayAmp;
      const cap = config.growth ? Math.floor(frame * config.growthSpeed) : Infinity;
      const zoom = config.zoom || 1;
      ctx.save();
      ctx.translate(width / 2 + (config.viewX || 0), height / 2 + (config.viewY || 0));
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);
      for (const t of trees) drawTree(ctx, t, sway, cap);
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
    }

    rebuild();
    rafId = root.requestAnimationFrame(loop);

    const handle = {
      get frame() { return frame; },
      get trees() { return trees; },
      get config() { return config; },
      pause() { paused = true; },
      play() { paused = false; },
      get paused() { return paused; },
      setConfig(partial, opts) {
        const softKeys = ['ink', 'background', 'swayAmp', 'swaySpeed', 'fps', 'growth', 'growthSpeed', 'viewX', 'viewY', 'zoom'];
        // Rebuild only when a structural key actually changes value — callers
        // (like the instrument panel) pass the full config on every tweak.
        const needsRebuild = Object.keys(partial).some((k) =>
          softKeys.indexOf(k) === -1 &&
          JSON.stringify(partial[k]) !== JSON.stringify(config[k]));
        Object.assign(config, partial);
        if (needsRebuild || (opts && opts.rebuild)) rebuild();
        if (paused) paint();
      },
      reseed(seed) {
        config.seed = (seed === undefined)
          ? Math.floor(Math.random() * 0xFFFFFFFF)
          : seed;
        rebuild();
        if (paused) paint();
        return config.seed;
      },
      resize() { rebuild(); if (paused) paint(); },
      paintOnce() { paint(); },
      destroy() { root.cancelAnimationFrame(rafId); },
    };
    return handle;
  }

  root.MeadowEngine = {
    mulberry32, SPECIES, SPECIES_NAMES, expand, makeTree, buildForest,
    drawTree, sampleMask, run, DEFAULTS, LEN_RATIO,
  };
})(typeof window !== 'undefined' ? window : globalThis);
