/* =============================================================================
   Tessera — engine.

   An image becomes a grid of cells; each cell's tone snaps to one of a few
   TIERS; every tier is drawn as one glyph in one colour at one weight. Bars
   that sit next to each other along their own axis in the same tier join into
   one long bar with a gap and a rounded cap where the run ends — that joining
   is what turns a posterised image into the woven field of the Base brand
   (Mouthwash Studio, with an image tool by John Provencher, after Karel
   Martens). The rest of the glyph alphabet — squares, rings, dots, diamonds,
   checkers — is the Martens icon set.

   One scene, three outputs: the canvas on screen, the PNG, and the SVG are
   all drawn from `buildScene`, so what you see is what you print.

   Nothing here is Base's code. Its public shader was read for its numbers
   (tier edges, bar weights, gap, cap roundness, contrast); see NOTES.md.
   ========================================================================== */
(function tesseraEngine(global) {
	"use strict";

	const GLYPHS = ["empty", "column", "row", "flow", "solid", "square", "ring", "dot", "diamond", "checker", "cross", "slash"];
	const BAR_GLYPHS = new Set(["column", "row", "flow"]);
	const MAX_TIERS = 6;
	const ASPECTS = { "1:1": [1, 1], "4:5": [4, 5], "3:4": [3, 4], "2:3": [2, 3], "9:16": [9, 16], "5:4": [5, 4], "3:2": [3, 2], "16:9": [16, 9] };

	const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
	const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
	const fract = (x) => x - Math.floor(x);
	function hexToRgb(hex) {
		const h = String(hex || "#000000").replace("#", "");
		return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
	}
	const lumOf = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
	// A seeded hash per cell: stable across frames, re-dealt by the seed.
	function hash2(x, y, seed) {
		let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041)) | 0;
		h = Math.imul(h ^ (h >>> 13), 1274126177);
		return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
	}

	/* ---------- the grid ---------- */
	/** Columns are authored; rows follow from the frame and the cell's aspect. */
	function gridFor(config, width, height) {
		const cols = Math.max(1, Math.round(config.columns));
		const cw = width / cols;
		const ch = cw * config.cellAspect;
		const rows = Math.max(1, Math.ceil(height / ch - 1e-6));
		return { ch, cols, cw, rows };
	}

	/** Where the source sits in the frame: cover or contain, then zoom and pan. In frame pixels. */
	function placeSource(config, width, height, srcW, srcH) {
		const s = config.fit === "contain" ? Math.min(width / srcW, height / srcH) : Math.max(width / srcW, height / srcH);
		const k = s * config.zoom;
		const w = srcW * k;
		const h = srcH * k;
		// Pan runs from −1 to 1 across whatever slack (or overhang) the placement leaves.
		const x = (width - w) / 2 + config.panX * Math.abs(width - w) / 2;
		const y = (height - h) / 2 + config.panY * Math.abs(height - h) / 2;
		return { h, w, x, y };
	}

	/* ---------- tone ---------- */
	/** Brightness, then contrast about the middle (Base's form), then gamma and invert. */
	function toneOf(lum, config) {
		let v = lum + config.brightness;
		v = clamp((v - 0.5) * config.contrast + 0.5, 0, 1);
		v = Math.pow(v, config.gamma);
		return config.invert ? 1 - v : v;
	}

	/** Tier edges are even: tier = ⌊tone · N⌋. Base's five-tier blank mode is exactly this at N = 5. */
	function tierOf(tone, tiers) {
		return Math.min(tiers - 1, Math.floor(clamp(tone, 0, 1) * tiers));
	}

	/**
	 * Weight of a tier, as a share of the cell. The first inked tier is
	 * `minWeight`; the last is 1; between, a power curve. Base's bars are
	 * half-thickness 1/16, 1/4, 3/8, 1/2 of a cell — widths 0.125, 0.5, 0.75, 1 —
	 * which this reproduces within 0.02 at minWeight 0.125, curve 0.77.
	 */
	function weightOf(tier, tiers, firstInk, config) {
		if (config.weighting === "flat") return config.scale;
		const span = Math.max(1, tiers - 1 - firstInk);
		const t = clamp((tier - firstInk) / span, 0, 1);
		return (config.minWeight + (1 - config.minWeight) * Math.pow(t, config.curve)) * config.scale;
	}

	function glyphsOf(config) {
		const out = [];
		for (let i = 0; i < config.tiers; i += 1) out.push(config[`glyph${i + 1}`] || "empty");
		return out;
	}

	/**
	 * Levels: the picture's own range, measured once per grid. Fixed leaves the
	 * tones alone (Base, whose footage is graded for its tier edges); auto
	 * stretches the 2nd–98th percentile to 0..1; equalise replaces each tone
	 * with its rank, so every tier covers the same share of the picture.
	 */
	function levelsOf(grid) {
		if (grid.levels) return grid.levels;
		const { cells } = grid;
		const n = cells.length / 4;
		const lums = [];
		for (let i = 0; i < n; i += 1) if (cells[i * 4 + 3] >= 0.5) lums.push(lumOf(cells[i * 4], cells[i * 4 + 1], cells[i * 4 + 2]));
		const sorted = Float32Array.from(lums).sort();
		const at = (q) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(q * (sorted.length - 1)))] : 0);
		grid.levels = { hi: at(0.98), lo: at(0.02), sorted };
		return grid.levels;
	}
	function levelled(lum, mode, levels) {
		if (mode === "auto") return levels.hi - levels.lo > 1e-3 ? (lum - levels.lo) / (levels.hi - levels.lo) : lum;
		if (mode === "equalize") {
			const a = levels.sorted;
			if (!a.length) return lum;
			let lo = 0, hi = a.length;
			while (lo < hi) { const mid = (lo + hi) >> 1; if (a[mid] < lum) lo = mid + 1; else hi = mid; }
			// Mid-rank of the run of equal tones, so a flat area does not all land at its bottom edge.
			let top = lo;
			while (top < a.length && a[top] === lum) top += 1;
			return ((lo + top) / 2) / Math.max(1, a.length);
		}
		return lum;
	}

	/* ---------- motion ---------- */
	/** The reveal order of a cell, 0..1: sweep by column, rows, radial from the centre, or seeded scatter. */
	function revealOrder(mode, cx, cy, cols, rows, seed) {
		if (mode === "rows") return (cy + 0.5) / rows;
		if (mode === "radial") return Math.hypot((cx + 0.5) / cols - 0.5, (cy + 0.5) / rows - 0.5) / Math.SQRT1_2;
		if (mode === "scatter") return hash2(cx, cy, seed + 7);
		return (cx + 0.5) / cols;
	}

	/**
	 * Reveal 0..1 across a loop: the loop starts and ends on the field, eases
	 * back to the picture at the half and wipes in again — so a frame taken at
	 * time 0 is the treatment, and no stretch of the loop stands still.
	 */
	function revealAt(phase) {
		const x = Math.abs(2 * fract(phase) - 1);
		return x * x * (3 - 2 * x);
	}

	/* ---------- the scene ---------- */
	/**
	 * grid: { cols, rows, cw, ch, cells: Float32Array(cols·rows·4) of r,g,b,a in 0..1 }.
	 * trail: [{x, y, w}] in frame fractions, or null. phase: 0..1 of the loop.
	 * Returns shapes in frame pixels; `paint` and `toSVG` draw the same list.
	 */
	function buildScene(config, grid, phase, trail, frame) {
		const { cols, rows, cw, ch, cells } = grid;
		const tiers = clamp(Math.round(config.tiers), 2, MAX_TIERS);
		const glyphs = glyphsOf({ ...config, tiers });
		const firstInk = Math.max(0, glyphs.findIndex((g) => g !== "empty"));
		const palette = config.palette.map(hexToRgb);
		const motion = config.motion;
		const drift = motion === "drift" ? 0.18 * config.amount * Math.sin(2 * Math.PI * phase) : 0;
		const cycle = motion === "cycle" ? phase : 0;
		const reveal = motion === "reveal" ? revealAt(phase) : 1;
		const n = cols * rows;
		const tierOfCell = new Int8Array(n).fill(-1);
		const orient = new Int8Array(n); // 0 vertical, 1 horizontal
		const visible = new Uint8Array(n);
		const tone = new Float32Array(n);
		const levels = config.levels === "fixed" ? null : levelsOf(grid);

		// 1. tone per cell, with the drift, the cycle and the pointer's paint
		for (let cy = 0; cy < rows; cy += 1) {
			for (let cx = 0; cx < cols; cx += 1) {
				const i = cy * cols + cx;
				const a = cells[i * 4 + 3];
				if (a < 0.5) continue;
				const raw = lumOf(cells[i * 4], cells[i * 4 + 1], cells[i * 4 + 2]);
				let v = toneOf(levels ? levelled(raw, config.levels, levels) : raw, config) + drift;
				if (trail && trail.length && config.pointer !== "off") {
					const fx = (cx + 0.5) / cols;
					const fy = ((cy + 0.5) * ch) / (rows * ch);
					let push = 0;
					for (const p of trail) {
						const d = Math.hypot((fx - p.x) * frame.aspect, fy - p.y);
						push += p.w * (1 - smoothstep(0, config.brush, d));
					}
					push = Math.min(1, push) * config.pointerStrength;
					if (config.pointer === "light") v += push;
					else if (config.pointer === "dark") v -= push;
				}
				// Cycle wraps every tone, at every phase, so phase 0 and phase 1 are the same frame.
				if (motion === "cycle") v = fract(clamp(v, 0, 0.99999) + cycle);
				tone[i] = clamp(v, 0, 1);
				tierOfCell[i] = tierOf(tone[i], tiers);
				let shown = reveal >= 1 ? 1 : reveal <= 0 ? 0 : (revealOrder(config.order, cx, cy, cols, rows, config.seed) < reveal ? 1 : 0);
				if (config.pointer === "reveal" && trail && trail.length) {
					const fx = (cx + 0.5) / cols;
					const fy = (cy + 0.5) / rows;
					let near = 0;
					for (const p of trail) near = Math.max(near, p.w * (1 - smoothstep(config.brush * 0.6, config.brush, Math.hypot((fx - p.x) * frame.aspect, fy - p.y))));
					shown = near > 0.5 ? 1 : 0;
				}
				visible[i] = shown;
			}
		}

		// 2. orientation: fixed per glyph, or — for flow bars — along the picture's structure.
		// The structure tensor (gx², gy², gx·gy, smoothed over a few cells) carries an edge's
		// direction into the flat area beside it; where there is still no direction, a seeded
		// patchwork of blocks decides, which is what makes the maze.
		const usesFlow = glyphs.includes("flow");
		let flowDir = null;
		if (usesFlow) {
			const L = new Float32Array(n);
			for (let i = 0; i < n; i += 1) L[i] = cells[i * 4 + 3] < 0.5 ? 0 : lumOf(cells[i * 4], cells[i * 4 + 1], cells[i * 4 + 2]);
			const at = (x, y) => L[clamp(y, 0, rows - 1) * cols + clamp(x, 0, cols - 1)];
			const xx = new Float32Array(n), yy = new Float32Array(n), xy = new Float32Array(n);
			for (let cy = 0; cy < rows; cy += 1) for (let cx = 0; cx < cols; cx += 1) {
				const gx = at(cx + 1, cy - 1) + 2 * at(cx + 1, cy) + at(cx + 1, cy + 1) - at(cx - 1, cy - 1) - 2 * at(cx - 1, cy) - at(cx - 1, cy + 1);
				const gy = at(cx - 1, cy + 1) + 2 * at(cx, cy + 1) + at(cx + 1, cy + 1) - at(cx - 1, cy - 1) - 2 * at(cx, cy - 1) - at(cx + 1, cy - 1);
				const i = cy * cols + cx;
				xx[i] = gx * gx; yy[i] = gy * gy; xy[i] = gx * gy;
			}
			const blur = (src) => {
				const r = 3, tmp = new Float32Array(n), out = new Float32Array(n);
				for (let cy = 0; cy < rows; cy += 1) for (let cx = 0; cx < cols; cx += 1) {
					let sum = 0; for (let k = -r; k <= r; k += 1) sum += src[cy * cols + clamp(cx + k, 0, cols - 1)];
					tmp[cy * cols + cx] = sum / (2 * r + 1);
				}
				for (let cy = 0; cy < rows; cy += 1) for (let cx = 0; cx < cols; cx += 1) {
					let sum = 0; for (let k = -r; k <= r; k += 1) sum += tmp[clamp(cy + k, 0, rows - 1) * cols + cx];
					out[cy * cols + cx] = sum / (2 * r + 1);
				}
				return out;
			};
			const bxx = blur(xx), byy = blur(yy), bxy = blur(xy);
			flowDir = new Int8Array(n);
			const patch = 6;
			for (let cy = 0; cy < rows; cy += 1) for (let cx = 0; cx < cols; cx += 1) {
				const i = cy * cols + cx;
				const strength = bxx[i] + byy[i];
				// Energy mostly in x means edges run vertically: bars go down them (0). Mostly in y: across (1).
				if (strength > 0.004 && Math.abs(bxx[i] - byy[i]) > 0.25 * strength) flowDir[i] = byy[i] > bxx[i] ? 1 : 0;
				else flowDir[i] = hash2(Math.floor(cx / patch), Math.floor(cy / patch), config.seed) < 0.5 ? 0 : 1;
			}
		}
		for (let i = 0; i < n; i += 1) {
			const t = tierOfCell[i];
			if (t < 0) continue;
			const g = glyphs[t];
			if (g === "row") orient[i] = 1;
			else if (g === "flow") orient[i] = flowDir[i];
		}

		const shapes = [];
		const colourOf = (t, i) => {
			if (config.colorMode === "source") return [cells[i * 4], cells[i * 4 + 1], cells[i * 4 + 2]];
			return palette[(t - firstInk + palette.length * 8) % palette.length] || [1, 1, 1];
		};
		const cellX = (cx) => cx * cw;
		const cellY = (cy) => cy * ch;
		const done = new Uint8Array(n);
		const gap = config.gap;

		// 3. bars: runs along their own axis, joined while the tier, the axis and the reveal agree
		for (let cy = 0; cy < rows; cy += 1) {
			for (let cx = 0; cx < cols; cx += 1) {
				const i = cy * cols + cx;
				const t = tierOfCell[i];
				if (t < 0 || done[i] || !visible[i]) continue;
				const g = glyphs[t];
				if (!BAR_GLYPHS.has(g)) continue;
				const o = orient[i];
				let len = 1;
				if (config.merge) {
					while (true) {
						const nx = o ? cx + len : cx;
						const ny = o ? cy : cy + len;
						if (nx >= cols || ny >= rows) break;
						const j = ny * cols + nx;
						if (done[j] || tierOfCell[j] !== t || orient[j] !== o || !visible[j] || glyphs[tierOfCell[j]] !== g) break;
						len += 1;
					}
				}
				for (let k = 0; k < len; k += 1) done[o ? i + k : i + k * cols] = 1;
				const w = weightOf(t, tiers, firstInk, config);
				if (w <= 0) continue;
				const colour = colourOf(t, i);
				if (o === 0) {
					const bw = w * cw;
					const y0 = cellY(cy) + (gap * ch) / 2;
					const y1 = cellY(cy + len) - (gap * ch) / 2;
					shapes.push({ colour, kind: "bar", r: config.roundness * bw / 2, x: cellX(cx) + (cw - bw) / 2, y: y0, w: bw, h: Math.max(0, y1 - y0) });
				} else {
					const bh = w * ch;
					const x0 = cellX(cx) + (gap * cw) / 2;
					const x1 = cellX(cx + len) - (gap * cw) / 2;
					shapes.push({ colour, kind: "bar", r: config.roundness * bh / 2, x: x0, y: cellY(cy) + (ch - bh) / 2, w: Math.max(0, x1 - x0), h: bh });
				}
			}
		}

		// 4. every other glyph, one per cell
		const m = Math.min(cw, ch);
		for (let cy = 0; cy < rows; cy += 1) {
			for (let cx = 0; cx < cols; cx += 1) {
				const i = cy * cols + cx;
				const t = tierOfCell[i];
				if (t < 0 || done[i] || !visible[i]) continue;
				const g = glyphs[t];
				if (g === "empty" || BAR_GLYPHS.has(g)) continue;
				const w = weightOf(t, tiers, firstInk, config);
				const colour = colourOf(t, i);
				const x = cellX(cx) + cw / 2;
				const y = cellY(cy) + ch / 2;
				const s = w * m;
				if (g === "solid") shapes.push({ colour, kind: "rect", x: cellX(cx), y: cellY(cy), w: cw + 0.02, h: ch + 0.02 });
				else if (g === "square") shapes.push({ colour, kind: "rect", x: x - s / 2, y: y - s / 2, w: s, h: s });
				else if (g === "checker") { if ((cx + cy) % 2 === 0) shapes.push({ colour, kind: "rect", x: x - (w * cw) / 2, y: y - (w * ch) / 2, w: w * cw, h: w * ch }); }
				else if (g === "ring") shapes.push({ colour, kind: "ring", x: x - s / 2, y: y - s / 2, w: s, h: s, line: Math.max(0.6, s * config.line) });
				else if (g === "dot") shapes.push({ colour, kind: "dot", x, y, r: s / 2 });
				else if (g === "diamond") shapes.push({ colour, kind: "diamond", x, y, r: s / 2 });
				else if (g === "cross") shapes.push({ colour, kind: "cross", x, y, r: s / 2, line: Math.max(0.6, s * config.line) });
				else if (g === "slash") shapes.push({ colour, kind: "slash", x, y, r: s / 2, line: Math.max(0.6, s * config.line), flip: (cx + cy) % 2 === 1 && config.alternate });
			}
		}

		// Hidden cells show the photo: the page paints it under the scene through these holes.
		let hidden = 0;
		for (let i = 0; i < n; i += 1) if (!visible[i] && tierOfCell[i] >= 0) hidden += 1;
		return { cols, rows, cw, ch, shapes, hidden, visible, tier: tierOfCell, tone };
	}

	/* ---------- drawing ---------- */
	const css = (c) => `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;

	function paintShapes(ctx, shapes) {
		let last = "";
		for (const s of shapes) {
			const fill = css(s.colour);
			if (fill !== last) { ctx.fillStyle = fill; ctx.strokeStyle = fill; last = fill; }
			if (s.kind === "rect") ctx.fillRect(s.x, s.y, s.w, s.h);
			else if (s.kind === "bar") {
				const r = Math.min(s.r, s.w / 2, s.h / 2);
				if (r > 0.25) { ctx.beginPath(); ctx.roundRect(s.x, s.y, s.w, s.h, r); ctx.fill(); }
				else ctx.fillRect(s.x, s.y, s.w, s.h);
			} else if (s.kind === "ring") {
				ctx.lineWidth = s.line;
				ctx.strokeRect(s.x + s.line / 2, s.y + s.line / 2, Math.max(0, s.w - s.line), Math.max(0, s.h - s.line));
			} else if (s.kind === "dot") {
				ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
			} else if (s.kind === "diamond") {
				ctx.beginPath(); ctx.moveTo(s.x, s.y - s.r); ctx.lineTo(s.x + s.r, s.y); ctx.lineTo(s.x, s.y + s.r); ctx.lineTo(s.x - s.r, s.y); ctx.closePath(); ctx.fill();
			} else if (s.kind === "cross") {
				ctx.fillRect(s.x - s.r, s.y - s.line / 2, s.r * 2, s.line);
				ctx.fillRect(s.x - s.line / 2, s.y - s.r, s.line, s.r * 2);
			} else if (s.kind === "slash") {
				ctx.lineWidth = s.line; ctx.lineCap = "butt";
				ctx.beginPath();
				if (s.flip) { ctx.moveTo(s.x - s.r, s.y - s.r); ctx.lineTo(s.x + s.r, s.y + s.r); } else { ctx.moveTo(s.x - s.r, s.y + s.r); ctx.lineTo(s.x + s.r, s.y - s.r); }
				ctx.stroke();
			}
		}
	}

	const f2 = (v) => Number(v.toFixed(2));
	function shapeToSVG(s) {
		const fill = css(s.colour);
		if (s.kind === "rect") return `<rect x="${f2(s.x)}" y="${f2(s.y)}" width="${f2(s.w)}" height="${f2(s.h)}" fill="${fill}"/>`;
		if (s.kind === "bar") { const r = Math.min(s.r, s.w / 2, s.h / 2); return `<rect x="${f2(s.x)}" y="${f2(s.y)}" width="${f2(s.w)}" height="${f2(s.h)}"${r > 0.25 ? ` rx="${f2(r)}"` : ""} fill="${fill}"/>`; }
		if (s.kind === "ring") return `<rect x="${f2(s.x + s.line / 2)}" y="${f2(s.y + s.line / 2)}" width="${f2(Math.max(0, s.w - s.line))}" height="${f2(Math.max(0, s.h - s.line))}" fill="none" stroke="${fill}" stroke-width="${f2(s.line)}"/>`;
		if (s.kind === "dot") return `<circle cx="${f2(s.x)}" cy="${f2(s.y)}" r="${f2(s.r)}" fill="${fill}"/>`;
		if (s.kind === "diamond") return `<path d="M${f2(s.x)} ${f2(s.y - s.r)}L${f2(s.x + s.r)} ${f2(s.y)}L${f2(s.x)} ${f2(s.y + s.r)}L${f2(s.x - s.r)} ${f2(s.y)}Z" fill="${fill}"/>`;
		if (s.kind === "cross") return `<path d="M${f2(s.x - s.r)} ${f2(s.y)}H${f2(s.x + s.r)}M${f2(s.x)} ${f2(s.y - s.r)}V${f2(s.y + s.r)}" stroke="${fill}" stroke-width="${f2(s.line)}"/>`;
		if (s.kind === "slash") return s.flip
			? `<path d="M${f2(s.x - s.r)} ${f2(s.y - s.r)}L${f2(s.x + s.r)} ${f2(s.y + s.r)}" stroke="${fill}" stroke-width="${f2(s.line)}"/>`
			: `<path d="M${f2(s.x - s.r)} ${f2(s.y + s.r)}L${f2(s.x + s.r)} ${f2(s.y - s.r)}" stroke="${fill}" stroke-width="${f2(s.line)}"/>`;
		return "";
	}

	function toSVG(scene, config, width, height) {
		const body = scene.shapes.map(shapeToSVG).join("\n");
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f2(width)} ${f2(height)}" width="${f2(width)}" height="${f2(height)}">\n<rect width="100%" height="100%" fill="${config.background}"/>\n${body}\n</svg>\n`;
	}

	/* ---------- sources: our own procedural samples ---------- */
	const SAMPLES = ["orb", "letter", "waves", "dunes", "portal"];
	function drawSample(name, size) {
		const c = global.document.createElement("canvas");
		c.width = size; c.height = size;
		const g = c.getContext("2d");
		const S = size;
		if (name === "orb") {
			g.fillStyle = "#0b0b0b"; g.fillRect(0, 0, S, S);
			const floor = g.createRadialGradient(S * 0.55, S * 0.86, 0, S * 0.55, S * 0.86, S * 0.4);
			floor.addColorStop(0, "#000"); floor.addColorStop(1, "rgba(0,0,0,0)");
			const body = g.createRadialGradient(S * 0.38, S * 0.36, S * 0.02, S * 0.5, S * 0.5, S * 0.34);
			body.addColorStop(0, "#ffffff"); body.addColorStop(0.35, "#b9b9b9"); body.addColorStop(0.8, "#3c3c3c"); body.addColorStop(1, "#141414");
			g.fillStyle = "#6d6d6d"; g.fillRect(0, S * 0.78, S, S * 0.22);
			g.fillStyle = floor; g.fillRect(0, S * 0.6, S, S * 0.4);
			g.beginPath(); g.arc(S * 0.5, S * 0.5, S * 0.32, 0, Math.PI * 2); g.fillStyle = body; g.fill();
		} else if (name === "letter") {
			const bg = g.createLinearGradient(0, 0, S, S);
			bg.addColorStop(0, "#f2f2f2"); bg.addColorStop(1, "#5a5a5a");
			g.fillStyle = bg; g.fillRect(0, 0, S, S);
			const ink = g.createLinearGradient(0, S * 0.1, 0, S * 0.9);
			ink.addColorStop(0, "#050505"); ink.addColorStop(1, "#8c8c8c");
			g.fillStyle = ink;
			g.font = `900 ${Math.round(S * 0.95)}px "Helvetica Neue", Arial, sans-serif`;
			g.textAlign = "center"; g.textBaseline = "middle";
			g.fillText("S", S * 0.5, S * 0.53);
		} else if (name === "waves") {
			const img = g.createImageData(S, S);
			for (let y = 0; y < S; y += 1) for (let x = 0; x < S; x += 1) {
				const u = x / S - 0.5, v = y / S - 0.5;
				const a = Math.sin(Math.hypot(u + 0.2, v + 0.1) * 38) + Math.sin(Math.hypot(u - 0.25, v - 0.15) * 31);
				const k = Math.round((a * 0.25 + 0.5) * 255);
				const o = (y * S + x) * 4;
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
				for (let x = 0; x <= S; x += 4) g.lineTo(x, base + Math.sin(x / S * (3 + k) + k * 1.7) * S * 0.05);
				g.lineTo(S, S); g.closePath();
				const shade = Math.round(150 - k * 26);
				g.fillStyle = `rgb(${shade},${shade},${shade})`; g.fill();
			}
		} else {
			for (let k = 14; k >= 0; k -= 1) {
				const t = k / 14;
				const shade = Math.round(255 * Math.pow(1 - t, 1.4));
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
		return c.toDataURL("image/jpeg", 0.88);
	}

	/* ---------- analysis: the source, sampled once per cell ---------- */
	function analyse(source, config, width, height) {
		const grid = gridFor(config, width, height);
		const c = global.document.createElement("canvas");
		c.width = grid.cols; c.height = grid.rows;
		const g = c.getContext("2d", { willReadFrequently: true });
		g.imageSmoothingEnabled = true;
		g.imageSmoothingQuality = "high";
		g.clearRect(0, 0, grid.cols, grid.rows);
		const sw = source.naturalWidth || source.videoWidth || source.width;
		const sh = source.naturalHeight || source.videoHeight || source.height;
		const p = placeSource(config, width, height, sw, sh);
		// Frame pixels → grid cells: x / cw, y / ch.
		const sx = 1 / grid.cw, sy = 1 / grid.ch;
		// Downscale in halving steps first so a large photo averages instead of aliasing.
		let src = source, w = sw, h = sh;
		const targetW = p.w * sx, targetH = p.h * sy;
		while (w / 2 > targetW * 1.5 && h / 2 > targetH * 1.5) {
			const half = global.document.createElement("canvas");
			half.width = Math.max(1, Math.round(w / 2)); half.height = Math.max(1, Math.round(h / 2));
			const hg = half.getContext("2d"); hg.imageSmoothingQuality = "high";
			hg.drawImage(src, 0, 0, half.width, half.height);
			src = half; w = half.width; h = half.height;
		}
		g.drawImage(src, p.x * sx, p.y * sy, targetW, targetH);
		const data = g.getImageData(0, 0, grid.cols, grid.rows).data;
		const cells = new Float32Array(grid.cols * grid.rows * 4);
		for (let i = 0; i < cells.length; i += 1) cells[i] = data[i] / 255;
		return { ...grid, cells, placement: p };
	}

	/* ---------- the engine ---------- */
	function artifactSizeFor(config, longEdge, sourceAspect) {
		const ratio = config.aspect === "source" ? (sourceAspect || 1) : (() => { const [a, b] = ASPECTS[config.aspect] || [4, 5]; return a / b; })();
		const edge = Math.max(64, Math.round(longEdge || 2048));
		return ratio >= 1 ? { width: edge, height: Math.round(edge / ratio) } : { width: Math.round(edge * ratio), height: edge };
	}

	function createEngine(canvas, options) {
		options = options || {};
		const ctx = canvas.getContext("2d");
		let config = null;
		let source = null;
		let sourceKey = "";
		let clock = 0;
		let raf = 0;
		let lastNow = 0;
		let lastScene = null;
		let grid = null;
		let gridKey = "";
		const trail = [];
		let pointer = null;

		const sourceAspect = () => (source ? (source.naturalWidth || source.width) / (source.naturalHeight || source.height) : 1);
		const phaseAt = (t) => (config ? fract(t / config.loop) : 0);
		function ensureGrid(width, height) {
			const key = `${sourceKey}|${width}x${height}|${config.columns}|${config.cellAspect}|${config.fit}|${config.zoom}|${config.panX}|${config.panY}`;
			if (key !== gridKey || !grid) { grid = source ? analyse(source, config, width, height) : null; gridKey = key; }
			return grid;
		}
		function drawTo(target, width, height, time, withPointer) {
			const g = target.getContext ? target.getContext("2d") : target;
			g.save();
			g.setTransform(1, 0, 0, 1, 0, 0);
			g.fillStyle = config.background;
			g.fillRect(0, 0, width, height);
			if (!source) { g.restore(); return null; }
			const gr = withPointer ? ensureGrid(width, height) : analyse(source, config, width, height);
			const scene = buildScene(config, gr, phaseAt(time), withPointer ? trail : null, { aspect: width / height });
			const p = gr.placement;
			// The photo under the field: faint as an underlay, full where the reveal has not reached yet.
			if (config.underlay > 0 || scene.hidden) {
				if (scene.hidden) {
					g.save();
					g.beginPath();
					for (let cy = 0; cy < gr.rows; cy += 1) for (let cx = 0; cx < gr.cols; cx += 1) {
						const i = cy * gr.cols + cx;
						if (!scene.visible[i] && scene.tier[i] >= 0) g.rect(cx * gr.cw, cy * gr.ch, gr.cw + 0.5, gr.ch + 0.5);
					}
					g.clip();
					g.drawImage(source, p.x, p.y, p.w, p.h);
					g.restore();
				}
				if (config.underlay > 0) { g.globalAlpha = config.underlay; g.drawImage(source, p.x, p.y, p.w, p.h); g.globalAlpha = 1; }
			}
			paintShapes(g, scene.shapes);
			g.restore();
			return scene;
		}
		function render() {
			if (!config) return;
			lastScene = drawTo(canvas, canvas.width, canvas.height, clock, true);
			if (options.onFrame) options.onFrame();
		}
		function step(now) {
			const dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0;
			lastNow = now;
			let moved = false;
			if (pointer && config && config.pointer !== "off") {
				trail.unshift({ x: pointer.x, y: pointer.y, w: 1 });
				moved = true;
			}
			// The trail fades over `persist` seconds; old points drop off.
			const decay = config ? Math.exp(-dt / Math.max(0.05, config.persist)) : 0;
			for (const p of trail) p.w *= decay;
			while (trail.length && (trail.length > 48 || trail[trail.length - 1].w < 0.02)) { trail.pop(); moved = true; }
			return moved || trail.length > 0;
		}
		function loop(now) {
			raf = global.requestAnimationFrame(loop);
			if (step(now) || (config && config.motion !== "still")) render();
		}
		return {
			artifactSize(longEdge) { return artifactSizeFor(config, longEdge, sourceAspect()); },
			getState: () => ({ hasSource: !!source, shapes: lastScene ? lastScene.shapes.length : 0, cols: lastScene ? lastScene.cols : 0, rows: lastScene ? lastScene.rows : 0, trail: trail.length }),
			renderTo(target, width, height, time) { return drawTo(target, width, height, Number.isFinite(time) ? time : clock, false); },
			renderSVG(width, height, time) {
				if (!source) return "";
				const gr = analyse(source, config, width, height);
				const scene = buildScene(config, gr, phaseAt(Number.isFinite(time) ? time : clock), null, { aspect: width / height });
				return toSVG(scene, config, width, height);
			},
			// The bridge's create-artifact: drawn fresh at the requested size, never read off the screen.
			exportPNG(longEdge, time) {
				const size = artifactSizeFor(config, longEdge, sourceAspect());
				const out = global.document.createElement("canvas");
				out.width = size.width; out.height = size.height;
				this.renderTo(out, size.width, size.height, time);
				return { dataUrl: out.toDataURL("image/png"), height: size.height, width: size.width };
			},
			exportSVG(longEdge, time) {
				const size = artifactSizeFor(config, longEdge, sourceAspect());
				const svg = this.renderSVG(size.width, size.height, time);
				return { dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, height: size.height, svg, width: size.width };
			},
			resizeTo(width, height) {
				if (canvas.width !== width) canvas.width = width;
				if (canvas.height !== height) canvas.height = height;
				render();
			},
			setClock(time) { clock = Number(time) || 0; if (config && config.motion !== "still") render(); },
			setConfig(next) { config = next; render(); },
			setSource(image, key) { source = image; sourceKey = key || String(Math.random()); gridKey = ""; render(); },
			/** Canvas fractions 0..1, y down, or null when the pointer leaves. */
			setPointer(fx, fy) { pointer = fx === null || fx === undefined ? null : { x: fx, y: fy }; },
			sourceAspect,
			start() { if (!raf) raf = global.requestAnimationFrame(loop); },
		};
	}

	global.SUPERMEGA_TESSERA = Object.freeze({
		ASPECTS, GLYPHS, MAX_TIERS, SAMPLES,
		artifactSizeFor, buildScene, keepable, levelled, levelsOf, createEngine, drawSample, gridFor, hash2, hexToRgb, lumOf, paintShapes, placeSource, revealAt, revealOrder, tierOf, toneOf, toSVG, weightOf,
	});
})(typeof window !== "undefined" ? window : globalThis);
