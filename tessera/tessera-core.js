/* =============================================================================
   Tessera — a shader over your picture.

   One WebGL2 fragment pass. The frame is a grid; every cell reads the
   picture's average colour under it (a mip level the size of the cell), turns
   that into a tone, snaps the tone to one of 2–6 TIERS, and draws the tier's
   mark — a LINEAR mark (column, row, or a joined bar that picks its own axis
   from its neighbours) or a CUBIC one (square, checker, diamond, dot, ring,
   solid). Bars look at the cells before and after them: same tier → the bar
   runs straight through the cell edge; different → it stops short by halfW a
   gap with a rounded cap. That joining is what turns a posterised picture into
   the woven field of the Base treatment (Mouthwash Studio, image tool by John
   Provencher, after Karel Martens).

   Nothing here is Base's code; its public shader was read for its numbers.
   ========================================================================== */
(function tesseraEngine(global) {
	"use strict";

	// Order matters: it is the glyph id the shader switches on.
	const GLYPHS = ["empty", "column", "row", "connect", "square", "checker", "diamond", "dot", "ring", "solid"];
	const MAX_TIERS = 6;
	const MAX_TRAIL = 16;
	const ORDERS = ["sweep", "rows", "radial", "scatter"];
	const ASPECTS = { "1:1": [1, 1], "4:5": [4, 5], "3:4": [3, 4], "2:3": [2, 3], "9:16": [9, 16], "5:4": [5, 4], "3:2": [3, 2], "16:9": [16, 9] };

	const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
	const fract = (x) => x - Math.floor(x);
	function hexToRgb(hex) {
		const h = String(hex || "#000000").replace("#", "");
		return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
	}

	/**
	 * The five looks, each fixed to its reference as measured (NOTES.md):
	 * cell shape, which mark each tone draws, weights, gaps, colours. The
	 * person picks one and tunes only detail, contrast and balance.
	 */
	const COMMON = { smooth: 1, amount: 0, brightness: 0, brush: 0.12, colorMode: "palette", fit: "cover", gamma: 1, invert: false, levels: "auto", loop: 6, merge: true, motion: "still", order: "sweep", panX: 0, panY: 0, persist: 0.8, pointer: "off", pointerStrength: 0, underlay: 0, zoom: 1, minWeight: 0.125, curve: 1 };
	const STYLES = {
		// Black columns, rows and joined bars on yellow; 24 px square cells at 0.66, ≈4 px run gaps.
		yellow: { ...COMMON, background: "#f7d358", palette: ["#000000"], tiers: 4, glyphs: ["column", "row", "connect", "empty"], weighting: "flat", scale: 0.66, gap: 0.17, roundness: 0, cellAspect: 1, columns: 54 },
		// Base's bars on black: thin dark blue, wide light blue, cells 1.75× taller than wide.
		// Measured on the frame: exactly two widths — dark blue ≈ 0.25, light blue ≈ 0.68 of a 29 px column.
		blue: { ...COMMON, background: "#000000", palette: ["#0000ff", "#6a9cff"], tiers: 3, glyphs: ["empty", "column", "column"], weights: [0, 0.25, 0.68], weighting: "flat", scale: 1, gap: 0.045, roundness: 0, cellAspect: 1.75, columns: 45, toneShift: 0.12 },
		// Beige checker (the body mass), white rows, orange columns on near-black; every tone of the subject is inked — only what is not the subject is empty.
		figure: { ...COMMON, background: "#1b1d20", palette: ["#c9b99a", "#ea5a36", "#f2f2f2"], tiers: 3, glyphs: ["checker", "column", "row"], weights: [0.85, 0.35, 0.4], weighting: "flat", scale: 1, gap: 0.12, roundness: 0, cellAspect: 1, columns: 110,
			// A photo has a background; its lightest tone drops out to the ground so only the subject carries marks.
			onPhoto: { tiers: 4, glyphs: ["checker", "column", "row", "empty"], weights: [0.85, 0.35, 0.4, 0] } },
		// Blue checker, light-blue diamonds, pale grey columns on white.
		// Measured on the frame: checker squares ≈ half a cell, diamonds touch at their corners, grey columns ≈ 0.8.
		rooster: { ...COMMON, background: "#ffffff", palette: ["#0000ff", "#5b8ff9", "#e4e5e7"], tiers: 4, glyphs: ["checker", "diamond", "column", "empty"], weights: [0.55, 1, 0.8, 0], weighting: "flat", scale: 1, gap: 0.05, roundness: 0, cellAspect: 1, columns: 72 },
		// base.org's live settings: five tiers, darkest blank, widths 1/8·1/2·3/4·1 × 0.66, round caps.
		base: { ...COMMON, background: "#ffffff", palette: ["#ebba00", "#a7e66b", "#cd99fd", "#0000ff"], tiers: 5, glyphs: ["empty", "column", "column", "column", "column"], weighting: "ramp", curve: 0.77, scale: 0.66, gap: 0.045, roundness: 0.44, cellAspect: 1, columns: 90 },
	};

	/** The four controls a person has → everything the shader needs. */
	function resolve(simple, picture) {
		const base = STYLES[simple.style] || STYLES.yellow;
		const style = picture && !picture.cutout && base.onPhoto ? { ...base, ...base.onPhoto } : base;
		const out = { ...style, aspect: simple.aspect || "source" };
		// A cut-out (transparent background) sits in the frame with room around it,
		// as the Base frames do; a photo fills the frame.
		if (picture && picture.cutout) { out.fit = "contain"; out.zoom = 0.82; }
		style.glyphs.forEach((g, i) => { out[`glyph${i + 1}`] = g; });
		out.columns = Math.max(8, Math.round(style.columns * simple.detail));
		out.contrast = simple.contrast;
		out.brightness = simple.balance + (style.toneShift || 0);
		return out;
	}

	/* ---------- pure maths the tests pin (the shader mirrors these) ---------- */
	/** Levels, contrast about the middle, gamma, invert, then a brightness trim. */
	function toneOf(lum, config, levels) {
		let v = lum;
		if (levels && config.levels === "auto") v = levels.hi - levels.lo > 1e-3 ? (v - levels.lo) / (levels.hi - levels.lo) : v;
		if (levels && config.levels === "equalize") v = levels.cdf[Math.min(255, Math.max(0, Math.round(v * 255)))];
		v = clamp((v - 0.5) * config.contrast + 0.5, 0, 1);
		v = Math.pow(v, config.gamma);
		if (config.invert) v = 1 - v;
		return clamp(v + config.brightness, 0, 1);
	}
	const tierOf = (tone, tiers) => Math.min(tiers - 1, Math.floor(clamp(tone, 0, 1) * tiers));

	/**
	 * Weight of a tier as a share of the cell. Ramp: the first inked tier gets
	 * `minWeight`, the last 1, a power curve between, all × scale — Base's bars
	 * (1/8, 1/2, 3/4, 1 of a cell) come back at minWeight 0.125, curve 0.77.
	 * Flat: every tier is `scale`.
	 */
	function weightOf(tier, tiers, firstInk, config) {
		if (config.weighting === "flat") return config.scale;
		const span = Math.max(1, tiers - 1 - firstInk);
		const t = clamp((tier - firstInk) / span, 0, 1);
		return (config.minWeight + (1 - config.minWeight) * Math.pow(t, config.curve)) * config.scale;
	}

	/** The loop starts and ends on the field and eases back to the picture at the halfW. */
	function revealAt(phase) {
		const x = Math.abs(2 * fract(phase) - 1);
		return x * x * (3 - 2 * x);
	}

	/** Levels measured once per picture placement: 2nd/98th percentile and a 256-step CDF. */
	function measureLevels(data) {
		const hist = new Float64Array(256);
		let n = 0;
		for (let i = 0; i < data.length; i += 4) {
			if (data[i + 3] < 128) continue;
			const l = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) | 0;
			hist[l] += 1; n += 1;
		}
		const cdf = new Float32Array(256);
		let acc = 0, lo = 0, hi = 1, loSet = false, hiSet = false;
		for (let i = 0; i < 256; i += 1) {
			// Mid-rank of the bin, so a flat area lands in the middle of its span.
			cdf[i] = n ? (acc + hist[i] / 2) / n : i / 255;
			acc += hist[i];
			if (!loSet && acc >= 0.02 * n) { lo = i / 255; loSet = true; }
			if (!hiSet && acc >= 0.98 * n) { hi = i / 255; hiSet = true; }
		}
		return { cdf, hi, lo };
	}

	/** Where the picture sits in the frame: cover or contain, then zoom and pan. In frame pixels. */
	function placeSource(config, width, height, srcW, srcH) {
		const s = config.fit === "contain" ? Math.min(width / srcW, height / srcH) : Math.max(width / srcW, height / srcH);
		const k = s * config.zoom;
		const w = srcW * k, h = srcH * k;
		return { h, w, x: (width - w) / 2 + (config.panX * Math.abs(width - w)) / 2, y: (height - h) / 2 + (config.panY * Math.abs(height - h)) / 2 };
	}

	/* ---------- the shader ---------- */
	const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

	const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform sampler2D uImage;
uniform sampler2D uCdf;        // 256×1 equalise table
uniform vec2 uRes;             // frame px
uniform vec4 uPlace;           // picture rect in frame px: x, y, w, h
uniform vec2 uImageSize;       // picture px
uniform vec2 uCell;            // cell px (w, h)
uniform int uLevels;           // 0 fixed, 1 auto, 2 equalize
uniform vec2 uLoHi;
uniform float uContrast, uGamma, uBrightness;
uniform int uInvert;
uniform int uTiers;
uniform int uGlyph[${MAX_TIERS}];
uniform float uWeight[${MAX_TIERS}];
uniform vec3 uTierColor[${MAX_TIERS}];
uniform int uJoin;
uniform float uGap;            // share of a cell
uniform float uCaps;           // share of the halfW-width
uniform float uLine;           // ring stroke share
uniform vec3 uGround;
uniform float uImageColor;     // 0 palette … 1 the picture's own colour
uniform float uUnderlay;
uniform int uMotion;           // 0 still, 1 reveal, 2 cycle, 3 drift
uniform float uPhase, uAmount;
uniform int uOrder;
uniform float uSeed;
uniform int uTrailCount;
uniform vec3 uTrail[${MAX_TRAIL}];  // x, y (frame fractions), weight
uniform int uPointer;          // 0 off, 1 light, 2 dark, 3 reveal
uniform float uBrush, uStrength;
uniform float uSmooth;          // extra mip levels: tone read over a wider footprint, so regions hold together

float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }

// The picture under a cell, averaged: the mip level whose texel is about one cell.
vec4 cellSample(vec2 cell){
  vec2 centre = (cell + 0.5) * uCell;
  vec2 uv = (centre - uPlace.xy) / uPlace.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
  float texelsPerCell = max(uCell.x / uPlace.z * uImageSize.x, uCell.y / uPlace.w * uImageSize.y);
  vec4 c = textureLod(uImage, uv, max(0.0, log2(texelsPerCell) + uSmooth));
  return c.a > 0.0 ? vec4(c.rgb / c.a, c.a) : vec4(0.0);
}

float pointerPush(vec2 cell){
  if (uPointer == 0 || uPointer == 3 || uTrailCount == 0) return 0.0;
  vec2 f = (cell + 0.5) * uCell / uRes;
  float push = 0.0;
  for (int i = 0; i < ${MAX_TRAIL}; i++) {
    if (i >= uTrailCount) break;
    vec2 d = (f - uTrail[i].xy) * vec2(uRes.x / uRes.y, 1.0);
    push += uTrail[i].z * (1.0 - smoothstep(0.0, uBrush, length(d)));
  }
  push = min(push, 1.0) * uStrength;
  return uPointer == 1 ? push : -push;
}

// Tone → tier; −1 where the picture is not.
int tierAt(vec2 cell){
  vec4 c = cellSample(cell);
  if (c.a < 0.8) return -1;   // a cut-out's soft fringe is not the subject
  float v = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  if (uLevels == 1) v = uLoHi.y - uLoHi.x > 1e-3 ? (v - uLoHi.x) / (uLoHi.y - uLoHi.x) : v;
  else if (uLevels == 2) v = texture(uCdf, vec2(clamp(v, 0.0, 1.0) * (255.0 / 256.0) + 0.5 / 256.0, 0.5)).r;
  v = clamp((v - 0.5) * uContrast + 0.5, 0.0, 1.0);
  v = pow(v, uGamma);
  if (uInvert == 1) v = 1.0 - v;
  v = clamp(v + uBrightness, 0.0, 1.0);
  v += pointerPush(cell);
  if (uMotion == 3) v += 0.18 * uAmount * sin(6.2831853 * uPhase);
  if (uMotion == 2) v = fract(clamp(v, 0.0, 0.99999) + uPhase);
  v = clamp(v, 0.0, 1.0);
  return min(uTiers - 1, int(floor(v * float(uTiers))));
}

int glyphOf(int t){ return t < 0 ? 0 : uGlyph[t]; }

float aa(float d){ return clamp(0.5 - d, 0.0, 1.0); } // d in px, negative inside

// A bar along one axis. p: px from the cell's corner; size: cell px; halfW: halfW-width px;
// joinA/joinB: the run continues through the start/end edge.
float bar(vec2 p, vec2 size, float halfW, bool vertical, bool joinA, bool joinB){
  float across = vertical ? p.x - size.x * 0.5 : p.y - size.y * 0.5;
  float along = vertical ? p.y : p.x;
  float len = vertical ? size.y : size.x;
  float g = uGap * len * 0.5;
  float a0 = joinA ? -2.0 * len : g;
  float a1 = joinB ? 3.0 * len : len - g;
  float r = clamp(uCaps, 0.0, 1.0) * halfW;
  float mid = 0.5 * (a0 + a1), hl = 0.5 * (a1 - a0);
  vec2 q = abs(vec2(across, along - mid)) - vec2(halfW, hl) + r;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  return aa(d);
}

float cubic(int g, vec2 p, vec2 size, float w, vec2 cell){
  vec2 c = p - size * 0.5;
  float m = min(size.x, size.y);
  if (g == 9) return 1.0;                                                        // solid
  if (g == 4) { vec2 q = abs(c) - vec2(w * m * 0.5); return aa(max(q.x, q.y)); } // square
  if (g == 5) {                                                                  // checker
    if (mod(cell.x + cell.y, 2.0) > 0.5) return 0.0;
    vec2 q = abs(c) - w * size * 0.5; return aa(max(q.x, q.y));
  }
  if (g == 6) return aa((abs(c.x) + abs(c.y) - w * m * 0.5) * 0.7071);           // diamond
  if (g == 7) return aa(length(c) - w * m * 0.5);                                // dot
  if (g == 8) {                                                                  // ring
    float s = w * m * 0.5, t = max(1.0, s * 2.0 * uLine);
    vec2 q = abs(c) - vec2(s); float outer = max(q.x, q.y);
    vec2 qi = abs(c) - vec2(s - t); float inner = max(qi.x, qi.y);
    return aa(outer) * (1.0 - aa(inner));
  }
  return 0.0;
}

void main(){
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);   // y down, like the frame
  vec2 cell = floor(px / uCell);
  vec2 p = px - cell * uCell;
  vec2 puv = (px - uPlace.xy) / uPlace.zw;
  bool onPicture = puv.x >= 0.0 && puv.y >= 0.0 && puv.x <= 1.0 && puv.y <= 1.0;
  vec4 photoP = texture(uImage, clamp(puv, 0.0, 1.0));
  vec3 photo = mix(uGround, photoP.a > 0.0 ? photoP.rgb / photoP.a : uGround, photoP.a);
  vec3 ground = mix(uGround, photo, onPicture ? uUnderlay : 0.0);

  int t = tierAt(cell);
  int g = glyphOf(t);

  // Reveal: cells the wipe has not reached show the picture itself.
  float shown = 1.0;
  if (uMotion == 1) {
    vec2 n = (cell + 0.5) * uCell / uRes;
    float order = uOrder == 0 ? n.x : uOrder == 1 ? n.y : uOrder == 2 ? length(n - 0.5) / 0.7071 : hash(cell + uSeed * 0.013);
    float x = abs(2.0 * fract(uPhase) - 1.0);
    float r = x * x * (3.0 - 2.0 * x);
    shown = (r >= 1.0 || order < r) ? 1.0 : 0.0;
  }
  if (uPointer == 3) {
    vec2 f = (cell + 0.5) * uCell / uRes; float near = 0.0;
    for (int i = 0; i < ${MAX_TRAIL}; i++) {
      if (i >= uTrailCount) break;
      vec2 d = (f - uTrail[i].xy) * vec2(uRes.x / uRes.y, 1.0);
      near = max(near, uTrail[i].z * (1.0 - smoothstep(uBrush * 0.6, uBrush, length(d))));
    }
    shown = near > 0.5 ? 1.0 : 0.0;
  }
  if (shown < 0.5 && onPicture) { outColor = vec4(photo, 1.0); return; }

  float ink = 0.0;
  if (g == 1 || g == 2 || g == 3) {
    int up = tierAt(cell + vec2(0.0, -1.0)), down = tierAt(cell + vec2(0.0, 1.0));
    int left = tierAt(cell + vec2(-1.0, 0.0)), right = tierAt(cell + vec2(1.0, 0.0));
    bool vertical = g == 1;
    bool alone = false;
    if (g == 3) {
      // Joined bar: runs down if a neighbour above or below shares its tier,
      // across if one beside it does, and is a square when it stands alone.
      bool v = up == t || down == t;
      bool h = left == t || right == t;
      vertical = v;
      alone = !v && !h;
    }
    if (alone) {
      ink = cubic(4, p, uCell, uWeight[t], cell);
    } else {
      bool a = uJoin == 1 && (vertical ? up == t : left == t);
      bool b = uJoin == 1 && (vertical ? down == t : right == t);
      float halfW = uWeight[t] * (vertical ? uCell.x : uCell.y) * 0.5;
      ink = bar(p, uCell, halfW, vertical, a, b);
    }
  } else if (g > 3) {
    ink = cubic(g, p, uCell, uWeight[t], cell);
  }
  vec3 color = t >= 0 ? mix(uTierColor[t], cellSample(cell).rgb, uImageColor) : uGround;
  outColor = vec4(mix(ground, color, ink), 1.0);
}`;

	function createRenderer(canvas) {
		const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, preserveDrawingBuffer: true, premultipliedAlpha: false });
		if (!gl) return null;
		const compile = (type, src) => {
			const s = gl.createShader(type);
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
			return s;
		};
		const prog = gl.createProgram();
		gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
		gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
		gl.bindAttribLocation(prog, 0, "aPos");
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
		const loc = {};
		const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
		for (let i = 0; i < count; i += 1) {
			const info = gl.getActiveUniform(prog, i);
			loc[info.name.replace(/\[0\]$/, "")] = gl.getUniformLocation(prog, info.name);
		}
		const vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		const image = gl.createTexture();
		const cdf = gl.createTexture();
		let imageKey = null, cdfKey = null;

		function upload(source, key) {
			if (key === imageKey) return;
			gl.bindTexture(gl.TEXTURE_2D, image);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
			// Premultiplied, so the mip average of a cell half on a cut-out and half off
			// is the subject's colour at half coverage — not mixed with whatever colour
			// the transparent pixels happen to carry (a light rim otherwise).
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			imageKey = key;
		}
		function uploadCdf(levels, key) {
			if (key === cdfKey) return;
			const bytes = new Uint8Array(256 * 4);
			for (let i = 0; i < 256; i += 1) bytes[i * 4] = Math.round(levels.cdf[i] * 255);
			gl.bindTexture(gl.TEXTURE_2D, cdf);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			cdfKey = key;
		}

		function draw(config, frame) {
			const W = canvas.width, H = canvas.height;
			const { source, sourceKey, levels, levelsKey, phase, trail } = frame;
			upload(source, sourceKey);
			uploadCdf(levels, levelsKey);
			const sw = source.naturalWidth || source.width, sh = source.naturalHeight || source.height;
			const place = placeSource(config, W, H, sw, sh);
			const cw = W / Math.max(1, Math.round(config.columns));
			const tiers = clamp(Math.round(config.tiers), 2, MAX_TIERS);
			const names = [];
			for (let i = 0; i < MAX_TIERS; i += 1) names.push(i < tiers ? config[`glyph${i + 1}`] || "empty" : "empty");
			const firstInk = Math.max(0, names.findIndex((n) => n !== "empty"));
			const palette = config.palette.map(hexToRgb);
			const glyphs = [], weights = [], colours = [];
			for (let i = 0; i < MAX_TIERS; i += 1) {
				glyphs.push(Math.max(0, GLYPHS.indexOf(names[i])));
				weights.push(config.weights && config.weights[i] !== undefined ? config.weights[i] * config.scale : weightOf(i, tiers, firstInk, config));
				colours.push(...(palette[(((i - firstInk) % palette.length) + palette.length) % palette.length] || [1, 1, 1]));
			}
			const trailFlat = new Float32Array(MAX_TRAIL * 3);
			const n = Math.min(MAX_TRAIL, trail ? trail.length : 0);
			for (let i = 0; i < n; i += 1) trailFlat.set([trail[i].x, trail[i].y, trail[i].w], i * 3);

			gl.viewport(0, 0, W, H);
			gl.useProgram(prog);
			gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, image); gl.uniform1i(loc.uImage, 0);
			gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, cdf); gl.uniform1i(loc.uCdf, 1);
			gl.uniform2f(loc.uRes, W, H);
			gl.uniform4f(loc.uPlace, place.x, place.y, place.w, place.h);
			gl.uniform2f(loc.uImageSize, sw, sh);
			gl.uniform2f(loc.uCell, cw, cw * config.cellAspect);
			gl.uniform1i(loc.uLevels, ["fixed", "auto", "equalize"].indexOf(config.levels));
			gl.uniform2f(loc.uLoHi, levels.lo, levels.hi);
			gl.uniform1f(loc.uContrast, config.contrast);
			gl.uniform1f(loc.uGamma, config.gamma);
			gl.uniform1f(loc.uBrightness, config.brightness);
			gl.uniform1i(loc.uInvert, config.invert ? 1 : 0);
			gl.uniform1i(loc.uTiers, tiers);
			gl.uniform1iv(loc.uGlyph, glyphs);
			gl.uniform1fv(loc.uWeight, weights);
			gl.uniform3fv(loc.uTierColor, colours);
			gl.uniform1i(loc.uJoin, config.merge ? 1 : 0);
			gl.uniform1f(loc.uGap, config.gap);
			gl.uniform1f(loc.uCaps, config.roundness);
			gl.uniform1f(loc.uLine, 0.18);
			gl.uniform3fv(loc.uGround, hexToRgb(config.background));
			gl.uniform1f(loc.uImageColor, config.colorMode === "source" ? 1 : 0);
			gl.uniform1f(loc.uUnderlay, config.underlay);
			gl.uniform1i(loc.uMotion, ["still", "reveal", "cycle", "drift"].indexOf(config.motion));
			gl.uniform1f(loc.uPhase, phase);
			gl.uniform1f(loc.uAmount, config.amount);
			gl.uniform1i(loc.uOrder, ORDERS.indexOf(config.order));
			gl.uniform1f(loc.uSeed, 7);
			gl.uniform1i(loc.uTrailCount, n);
			gl.uniform3fv(loc.uTrail, trailFlat);
			gl.uniform1i(loc.uPointer, ["off", "light", "dark", "reveal"].indexOf(config.pointer));
			gl.uniform1f(loc.uBrush, config.brush);
			gl.uniform1f(loc.uStrength, config.pointerStrength);
			gl.uniform1f(loc.uSmooth, config.smooth || 0);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			return { cols: Math.round(config.columns), rows: Math.ceil(H / (cw * config.cellAspect)) };
		}
		return { canvas, draw, maxSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 8192 };
	}

	/* ---------- sources: procedural samples, all ours ---------- */
	const SAMPLES = ["orb", "letter", "waves", "dunes", "portal"];
	function drawSample(name, size) {
		const c = global.document.createElement("canvas");
		c.width = size; c.height = size;
		const g = c.getContext("2d");
		const S = size;
		if (name === "orb") {
			g.fillStyle = "#e9e6df"; g.fillRect(0, 0, S, S);
			const shadow = g.createRadialGradient(S * 0.56, S * 0.86, 0, S * 0.56, S * 0.86, S * 0.36);
			shadow.addColorStop(0, "rgba(0,0,0,.55)"); shadow.addColorStop(1, "rgba(0,0,0,0)");
			g.fillStyle = shadow; g.fillRect(0, S * 0.6, S, S * 0.4);
			const body = g.createRadialGradient(S * 0.38, S * 0.34, S * 0.02, S * 0.5, S * 0.5, S * 0.36);
			body.addColorStop(0, "#ffffff"); body.addColorStop(0.3, "#9a9a9a"); body.addColorStop(0.8, "#262626"); body.addColorStop(1, "#050505");
			g.beginPath(); g.arc(S * 0.5, S * 0.48, S * 0.33, 0, Math.PI * 2); g.fillStyle = body; g.fill();
		} else if (name === "letter") {
			g.fillStyle = "#f2f0ea"; g.fillRect(0, 0, S, S);
			const ink = g.createLinearGradient(0, S * 0.1, 0, S * 0.9);
			ink.addColorStop(0, "#050505"); ink.addColorStop(1, "#7a7a7a");
			g.fillStyle = ink;
			g.font = `900 ${Math.round(S * 0.95)}px "Helvetica Neue", Arial, sans-serif`;
			g.textAlign = "center"; g.textBaseline = "middle";
			g.fillText("S", S * 0.5, S * 0.53);
		} else if (name === "waves") {
			const img = g.createImageData(S, S);
			for (let y = 0; y < S; y += 1) for (let x = 0; x < S; x += 1) {
				const u = x / S - 0.5, v = y / S - 0.5;
				const a = Math.sin(Math.hypot(u + 0.2, v + 0.1) * 38) + Math.sin(Math.hypot(u - 0.25, v - 0.15) * 31);
				const k = Math.round((a * 0.25 + 0.5) * 255), o = (y * S + x) * 4;
				img.data[o] = img.data[o + 1] = img.data[o + 2] = k; img.data[o + 3] = 255;
			}
			g.putImageData(img, 0, 0);
		} else if (name === "dunes") {
			const sky = g.createLinearGradient(0, 0, 0, S);
			sky.addColorStop(0, "#ffffff"); sky.addColorStop(0.5, "#cfcfcf"); sky.addColorStop(1, "#9a9a9a");
			g.fillStyle = sky; g.fillRect(0, 0, S, S);
			g.beginPath(); g.arc(S * 0.7, S * 0.3, S * 0.09, 0, Math.PI * 2); g.fillStyle = "#fff"; g.fill();
			for (let k = 0; k < 6; k += 1) {
				const base = S * (0.45 + k * 0.1);
				g.beginPath(); g.moveTo(0, S);
				for (let x = 0; x <= S; x += 4) g.lineTo(x, base + Math.sin((x / S) * (3 + k) + k * 1.7) * S * 0.05);
				g.lineTo(S, S); g.closePath();
				const shade = Math.round(150 - k * 26);
				g.fillStyle = `rgb(${shade},${shade},${shade})`; g.fill();
			}
		} else {
			for (let k = 14; k >= 0; k -= 1) {
				const t = k / 14, shade = Math.round(255 * Math.pow(1 - t, 1.4));
				g.fillStyle = `rgb(${shade},${shade},${shade})`;
				const w = S * (0.16 + 0.84 * t), h = S * (0.24 + 0.76 * t);
				g.fillRect((S - w) / 2, (S - h) / 2 + S * 0.08 * (1 - t), w, h);
			}
		}
		return c;
	}

	/** A picture made small enough to keep in this browser: a JPEG data URL, long edge ≤ max. */
	function keepable(img, max) {
		const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
		const k = Math.min(1, max / Math.max(w, h));
		const c = global.document.createElement("canvas");
		c.width = Math.round(w * k); c.height = Math.round(h * k);
		c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
		return c.toDataURL("image/jpeg", 0.9);
	}

	/**
	 * Every picture goes through a 2D canvas before it reaches the GPU. Drawing
	 * applies the camera's EXIF rotation (a texture upload does not — a phone
	 * portrait arrives sideways and stretched) and caps the size the shader has
	 * to mipmap. Long edge ≤ 4096.
	 */
	function upright(image) {
		const w = image.naturalWidth || image.videoWidth || image.width;
		const h = image.naturalHeight || image.videoHeight || image.height;
		const k = Math.min(1, 4096 / Math.max(w, h));
		const c = global.document.createElement("canvas");
		c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
		const g = c.getContext("2d");
		g.imageSmoothingQuality = "high";
		g.drawImage(image, 0, 0, c.width, c.height);
		return c;
	}

	/* ---------- the engine ---------- */
	function artifactSizeFor(config, longEdge, sourceAspect) {
		const ratio = config.aspect === "source" ? sourceAspect || 1 : (() => { const [a, b] = ASPECTS[config.aspect] || [4, 5]; return a / b; })();
		const edge = Math.max(64, Math.round(longEdge || 2048));
		return ratio >= 1 ? { width: edge, height: Math.round(edge / ratio) } : { width: Math.round(edge * ratio), height: edge };
	}

	function createEngine(canvas, options) {
		options = options || {};
		const live = createRenderer(canvas);
		let offscreen = null;
		let config = null;
		let source = null, sourceKey = "", levels = null, levelsKey = "";
		let clock = 0, raf = 0, lastNow = 0, lastInfo = { cols: 0, rows: 0 };
		const trail = [];
		let pointer = null;

		const sourceAspect = () => (source ? (source.naturalWidth || source.width) / (source.naturalHeight || source.height) : 1);
		const phaseAt = (t) => (config ? fract(t / config.loop) : 0);
		// Levels are measured on the picture as placed, once per placement.
		function ensureLevels(width, height) {
			const key = `${sourceKey}|${config.fit}|${config.zoom}|${config.panX}|${config.panY}|${(width / height).toFixed(3)}`;
			if (key === levelsKey && levels) return;
			const S = 256, c = global.document.createElement("canvas");
			c.width = S; c.height = Math.max(1, Math.round((S * height) / width));
			const g = c.getContext("2d", { willReadFrequently: true });
			const sw = source.naturalWidth || source.width, sh = source.naturalHeight || source.height;
			const p = placeSource(config, c.width, c.height, sw, sh);
			g.drawImage(source, p.x, p.y, p.w, p.h);
			levels = measureLevels(g.getImageData(0, 0, c.width, c.height).data);
			levelsKey = key;
		}
		function frameFor(time, withPointer, width, height) {
			ensureLevels(width, height);
			return { levels, levelsKey, phase: phaseAt(time), source, sourceKey, trail: withPointer && config.pointer !== "off" ? trail : null };
		}
		function render() {
			if (!live || !config || !source) return;
			lastInfo = live.draw(config, frameFor(clock, true, canvas.width, canvas.height));
			if (options.onFrame) options.onFrame();
		}
		function step(now) {
			const dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0;
			lastNow = now;
			let moved = false;
			if (pointer && config && config.pointer !== "off") { trail.unshift({ w: 1, x: pointer.x, y: pointer.y }); moved = true; }
			const decay = config ? Math.exp(-dt / Math.max(0.05, config.persist)) : 0;
			for (const p of trail) p.w *= decay;
			while (trail.length && (trail.length > MAX_TRAIL || trail[trail.length - 1].w < 0.02)) { trail.pop(); moved = true; }
			return moved || trail.length > 0;
		}
		function loop(now) {
			raf = global.requestAnimationFrame(loop);
			if (step(now) || (config && config.motion !== "still")) render();
		}
		return {
			available: !!live,
			artifactSize(longEdge) { return artifactSizeFor(config, longEdge, sourceAspect()); },
			getState: () => ({ cols: lastInfo.cols, hasSource: !!source, rows: lastInfo.rows, trail: trail.length }),
			renderTo(target, width, height, time) {
				if (!config || !source) return;
				if (!offscreen) {
					offscreen = createRenderer(global.document.createElement("canvas"));
					if (!offscreen) throw new Error("WebGL2 is not available for export");
				}
				const s = Math.min(1, (offscreen.maxSize || 8192) / Math.max(width, height));
				offscreen.canvas.width = Math.round(width * s);
				offscreen.canvas.height = Math.round(height * s);
				offscreen.draw(config, frameFor(Number.isFinite(time) ? time : clock, false, offscreen.canvas.width, offscreen.canvas.height));
				const ctx = target.getContext ? target.getContext("2d") : target;
				ctx.drawImage(offscreen.canvas, 0, 0, width, height);
			},
			// The bridge's create-artifact: drawn fresh at the requested size, never read off the screen.
			exportPNG(longEdge, time) {
				const size = artifactSizeFor(config, longEdge, sourceAspect());
				const out = global.document.createElement("canvas");
				out.width = size.width; out.height = size.height;
				this.renderTo(out, size.width, size.height, time);
				return { dataUrl: out.toDataURL("image/png"), height: size.height, width: size.width };
			},
			resizeTo(width, height) {
				if (canvas.width !== width) canvas.width = width;
				if (canvas.height !== height) canvas.height = height;
				render();
			},
			setClock(time) { clock = Number(time) || 0; if (config && config.motion !== "still") render(); },
			setConfig(next) { config = next; render(); },
			setSource(image, key) { source = upright(image); sourceKey = key || String(Math.random()); levelsKey = ""; render(); },
			/** Canvas fractions 0..1, y down, or null when the pointer leaves. */
			setPointer(fx, fy) { pointer = fx === null || fx === undefined ? null : { x: fx, y: fy }; },
			sourceAspect,
			start() { if (!raf) raf = global.requestAnimationFrame(loop); },
		};
	}

	global.SUPERMEGA_TESSERA = Object.freeze({
		ASPECTS, GLYPHS, MAX_TIERS, ORDERS, SAMPLES, STYLES,
		artifactSizeFor, createEngine, drawSample, resolve, hexToRgb, keepable, measureLevels, placeSource, revealAt, tierOf, toneOf, weightOf,
	});
})(typeof window !== "undefined" ? window : globalThis);
