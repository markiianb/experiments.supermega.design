/* =============================================================================
   bubble-core — bubble lettering as geometry, not as a font.

   The whole form comes from one operation: take an ordinary letterform, push
   its outline outward by a constant distance, and draw the result. Everything
   people read as "graffiti bubble letters" falls out of that single move —
   the swollen convex stems, the counters collapsed to almond slits, the little
   tick marks where a crossbar was swallowed whole. None of it is drawn; it is
   what a dilated letter looks like.

   Pipeline, per letter:
     raster  — draw the glyph into a tile, read its alpha as a binary mask
     sdf     — exact Euclidean distance transform (Felzenszwalb–Huttenlocher),
               signed: negative inside the glyph, positive outside
     contour — marching squares at iso = inflate, sub-pixel interpolated
     shape   — link segments into closed loops, resample, smooth, wobble

   Dilating the SDF rather than the bitmap is what makes this exact: the iso
   line at distance r IS the true offset curve, so `inflate` is a real distance
   in em units, not a blur threshold that drifts with letter size.

   No dependencies. Classic script. Runs from file://.
   ========================================================================== */
(function bubbleCore(global) {
	"use strict";

	/* ---------------------------------------------------------------------
	   1. Raster — glyph to binary mask
	   ------------------------------------------------------------------ */

	// Everything is computed in a tile whose coordinates are relative to the
	// glyph's own baseline origin, so letters compose with ordinary typographic
	// advances afterwards. Dilation deliberately bleeds outside the advance —
	// that overflow is exactly why bubble letters crowd and overlap.
	const TILE_FONT = 200; // px; the resolution the contour is solved at

	function rasterize(char, fontStack, pad, weight) {
		const size = TILE_FONT;
		const canvas = document.createElement("canvas");
		const measure = canvas.getContext("2d", { willReadFrequently: true });
		measure.font = `${weight} ${size}px ${fontStack}`;
		const metrics = measure.measureText(char);
		const advance = metrics.width;
		// Fall back to generous constants when a browser withholds the exact
		// bounding box; over-sizing the tile only costs a little compute.
		const left = Number.isFinite(metrics.actualBoundingBoxLeft) ? metrics.actualBoundingBoxLeft : size;
		const right = Number.isFinite(metrics.actualBoundingBoxRight) ? metrics.actualBoundingBoxRight : advance + size;
		const ascent = Number.isFinite(metrics.actualBoundingBoxAscent) ? metrics.actualBoundingBoxAscent : size;
		const descent = Number.isFinite(metrics.actualBoundingBoxDescent) ? metrics.actualBoundingBoxDescent : size * 0.3;

		const originX = Math.ceil(left + pad);
		const originY = Math.ceil(ascent + pad);
		const width = Math.max(4, Math.ceil(left + right + pad * 2));
		const height = Math.max(4, Math.ceil(ascent + descent + pad * 2));

		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		ctx.font = `${weight} ${size}px ${fontStack}`;
		ctx.textAlign = "left";
		ctx.textBaseline = "alphabetic";
		ctx.fillStyle = "#000";
		ctx.fillText(char, originX, originY);

		const pixels = ctx.getImageData(0, 0, width, height).data;
		const mask = new Uint8Array(width * height);
		for (let i = 0, p = 3; i < mask.length; i++, p += 4) mask[i] = pixels[p] > 127 ? 1 : 0;

		let ink = 0;
		for (let i = 0; i < mask.length; i++) ink += mask[i];

		return { advance, height, ink, mask, originX, originY, size, width };
	}

	/* ---------------------------------------------------------------------
	   2. Signed distance field — exact, O(n)
	   ------------------------------------------------------------------ */

	const INF = 1e20;

	// Felzenszwalb & Huttenlocher's lower-envelope-of-parabolas transform.
	// Exact squared Euclidean distance in one pass per axis.
	function edt1d(f, d, v, z, n) {
		let k = 0;
		v[0] = 0;
		z[0] = -INF;
		z[1] = INF;
		for (let q = 1; q < n; q++) {
			let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
			while (s <= z[k]) {
				k--;
				s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
			}
			k++;
			v[k] = q;
			z[k] = s;
			z[k + 1] = INF;
		}
		k = 0;
		for (let q = 0; q < n; q++) {
			while (z[k + 1] < q) k++;
			const dx = q - v[k];
			d[q] = dx * dx + f[v[k]];
		}
	}

	function edt2d(grid, width, height) {
		const span = Math.max(width, height);
		const f = new Float64Array(span);
		const d = new Float64Array(span);
		const v = new Int32Array(span);
		const z = new Float64Array(span + 1);

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) f[y] = grid[y * width + x];
			edt1d(f, d, v, z, height);
			for (let y = 0; y < height; y++) grid[y * width + x] = d[y];
		}
		for (let y = 0; y < height; y++) {
			const row = y * width;
			for (let x = 0; x < width; x++) f[x] = grid[row + x];
			edt1d(f, d, v, z, width);
			for (let x = 0; x < width; x++) grid[row + x] = d[x];
		}
		return grid;
	}

	// Negative inside the glyph, positive outside, in tile pixels.
	function signedDistance(mask, width, height) {
		const outside = new Float64Array(width * height);
		const inside = new Float64Array(width * height);
		for (let i = 0; i < mask.length; i++) {
			outside[i] = mask[i] ? 0 : INF;
			inside[i] = mask[i] ? INF : 0;
		}
		edt2d(outside, width, height);
		edt2d(inside, width, height);
		const sdf = new Float64Array(width * height);
		for (let i = 0; i < sdf.length; i++) sdf[i] = Math.sqrt(outside[i]) - Math.sqrt(inside[i]);
		return sdf;
	}

	/* ---------------------------------------------------------------------
	   3. Marching squares — the offset curve at iso = inflate
	   ------------------------------------------------------------------ */

	// Segments are emitted with the interior on the left, so outer loops and
	// counters come out with opposite winding and an even-odd fill gets the
	// holes right for free.
	const CASES = [
		[], [[3, 2]], [[2, 1]], [[3, 1]],
		[[1, 0]], [[3, 0], [1, 2]], [[2, 0]], [[3, 0]],
		[[0, 3]], [[0, 2]], [[0, 1], [2, 3]], [[0, 1]],
		[[1, 3]], [[1, 2]], [[2, 3]], [],
	];

	function contour(sdf, width, height, iso) {
		const segments = [];
		const lerp = (a, b) => {
			const span = b - a;
			if (Math.abs(span) < 1e-12) return 0.5;
			return Math.min(1, Math.max(0, (iso - a) / span));
		};

		for (let y = 0; y < height - 1; y++) {
			for (let x = 0; x < width - 1; x++) {
				const tl = sdf[y * width + x];
				const tr = sdf[y * width + x + 1];
				const br = sdf[(y + 1) * width + x + 1];
				const bl = sdf[(y + 1) * width + x];

				let index = 0;
				if (tl <= iso) index |= 8;
				if (tr <= iso) index |= 4;
				if (br <= iso) index |= 2;
				if (bl <= iso) index |= 1;
				if (index === 0 || index === 15) continue;

				// Edge crossing points: 0 top, 1 right, 2 bottom, 3 left.
				const edges = [
					[x + lerp(tl, tr), y],
					[x + 1, y + lerp(tr, br)],
					[x + lerp(bl, br), y + 1],
					[x, y + lerp(tl, bl)],
				];

				let table = CASES[index];
				// Saddles: the average of the four corners decides which way the
				// two branches connect. Guessing here produces crossed contours.
				if (index === 5 || index === 10) {
					const centre = (tl + tr + br + bl) / 4;
					const joined = centre <= iso;
					if (index === 5) table = joined ? [[3, 2], [1, 0]] : [[3, 0], [1, 2]];
					else table = joined ? [[0, 1], [2, 3]] : [[0, 3], [2, 1]];
				}
				for (const [from, to] of table) segments.push([edges[from], edges[to]]);
			}
		}
		return segments;
	}

	// Endpoints are exact copies across neighbouring cells, so a rounded key
	// joins them without a tolerance search.
	function linkLoops(segments) {
		const key = (point) => `${point[0].toFixed(4)},${point[1].toFixed(4)}`;
		const outgoing = new Map();
		for (const segment of segments) {
			const start = key(segment[0]);
			if (!outgoing.has(start)) outgoing.set(start, []);
			outgoing.get(start).push(segment);
		}

		const loops = [];
		const used = new Set();
		for (const segment of segments) {
			if (used.has(segment)) continue;
			const loop = [segment[0]];
			let current = segment;
			// A closed contour cannot be longer than the segment list itself;
			// the bound stops a malformed field from spinning forever.
			for (let guard = 0; guard <= segments.length; guard++) {
				used.add(current);
				loop.push(current[1]);
				const next = (outgoing.get(key(current[1])) || []).find((candidate) => !used.has(candidate));
				if (!next) break;
				current = next;
			}
			if (loop.length > 6) loops.push(loop);
		}
		return loops;
	}

	/* ---------------------------------------------------------------------
	   4. Shape — resample, smooth, wobble
	   ------------------------------------------------------------------ */

	function area(loop) {
		let sum = 0;
		for (let i = 0; i < loop.length; i++) {
			const a = loop[i];
			const b = loop[(i + 1) % loop.length];
			sum += a[0] * b[1] - b[0] * a[1];
		}
		return Math.abs(sum) / 2;
	}

	// 1 for a circle, ~0.3–0.6 for the almond a half-closed counter makes, and
	// near 0 for a sliver whose two sides have met. The reference's counters
	// measure 0.31–0.65 wide-over-tall; nothing that thin survives as a mark,
	// it just reads as a stray hook. See NOTES.md § Capture.
	function circularity(loop) {
		const p = perimeter(loop);
		if (p <= 0) return 0;
		return (4 * Math.PI * area(loop)) / (p * p);
	}

	function perimeter(loop) {
		let total = 0;
		for (let i = 0; i < loop.length; i++) {
			const a = loop[i];
			const b = loop[(i + 1) % loop.length];
			total += Math.hypot(b[0] - a[0], b[1] - a[1]);
		}
		return total;
	}

	// Uniform arc-length resampling. Wobble is a function of distance travelled
	// along the outline, so the points have to be evenly spaced or the hand
	// shake bunches up wherever marching squares happened to emit densely.
	function resample(loop, spacing) {
		const total = perimeter(loop);
		if (total <= 0) return loop;
		const count = Math.max(12, Math.round(total / spacing));
		const step = total / count;
		const out = [loop[0]];
		let edge = 0;      // index of the edge the cursor is on
		let along = 0;     // distance already travelled ALONG that edge

		for (let k = 1; k < count; k++) {
			let remaining = step;
			// `along` is measured from the edge's start, so the distance left on
			// this edge is (edgeLength - along). Subtracting it from a cursor-to-
			// next measurement instead would count the travelled part twice and
			// bunch the output points.
			for (let guard = 0; guard <= loop.length * 2; guard++) {
				const from = loop[edge % loop.length];
				const to = loop[(edge + 1) % loop.length];
				const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
				const left = length - along;
				if (left >= remaining) {
					along += remaining;
					const t = length > 0 ? along / length : 0;
					out.push([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
					break;
				}
				remaining -= left;
				edge++;
				along = 0;
			}
		}
		return out;
	}

	function smooth(loop, passes) {
		let points = loop;
		for (let pass = 0; pass < passes; pass++) {
			const next = new Array(points.length);
			for (let i = 0; i < points.length; i++) {
				const previous = points[(i - 1 + points.length) % points.length];
				const current = points[i];
				const following = points[(i + 1) % points.length];
				next[i] = [
					(previous[0] + current[0] * 2 + following[0]) / 4,
					(previous[1] + current[1] * 2 + following[1]) / 4,
				];
			}
			points = next;
		}
		return points;
	}

	// Why a dilated letter still is not a bubble letter.
	//
	// Offsetting preserves straightness: push a straight stem out by a constant
	// distance and you get a straight stem, so pure dilation returns the source
	// face with rounded corners. The reference's sides genuinely bow outward,
	// which no offset produces. What does produce it is the thing the form is
	// named after — a balloon. Two forces, run to equilibrium on the outline:
	//
	//   tension   each point pulled toward the average of its neighbours, which
	//             relaxes the curve toward a circle
	//   pressure  each point pushed along its outward normal, which resists the
	//             shrinking that tension alone would cause
	//
	// Marching squares emits every loop with the material on the left, so one
	// normal formula pushes outer loops outward and counters inward — the hole
	// tightens while the body swells, which is precisely how the counters end
	// up as almond slits.
	// Run to equilibrium and every loop converges on a circle — tension is a
	// smoothing flow, and given enough steps it forgets the letter. Each point is
	// therefore tethered to where dilation put it and may drift only `maxDrift`.
	// That single clamp is what separates "swollen R" from "oval": the bow in the
	// stems is a small displacement, and letter identity lives in the rest.
	function plump(loop, strength, steps, maxDrift) {
		if (strength <= 0 || steps <= 0) return loop;
		const count = loop.length;
		if (count < 8) return loop;
		const scale = perimeter(loop) / count; // step size in the loop's own units
		const tension = 0.3;
		const pressure = strength * 0.22 * scale;
		const drift = Math.max(0.001, strength * maxDrift);
		const origin = loop;
		let points = loop;

		for (let step = 0; step < steps; step++) {
			const next = new Array(count);
			for (let i = 0; i < count; i++) {
				const previous = points[(i - 1 + count) % count];
				const current = points[i];
				const following = points[(i + 1) % count];
				const laplacianX = (previous[0] + following[0]) / 2 - current[0];
				const laplacianY = (previous[1] + following[1]) / 2 - current[1];
				const tx = following[0] - previous[0];
				const ty = following[1] - previous[1];
				const length = Math.hypot(tx, ty) || 1;
				let x = current[0] + tension * laplacianX + pressure * (ty / length);
				let y = current[1] + tension * laplacianY + pressure * (-tx / length);

				const dx = x - origin[i][0];
				const dy = y - origin[i][1];
				const moved = Math.hypot(dx, dy);
				if (moved > drift) {
					x = origin[i][0] + (dx / moved) * drift;
					y = origin[i][1] + (dy / moved) * drift;
				}
				next[i] = [x, y];
			}
			points = next;
		}
		return points;
	}

	// Harmonics of the loop length, so the displacement closes seamlessly where
	// the outline meets itself. An open noise function leaves a visible seam.
	function wobble(loop, amount, random) {
		if (amount <= 0) return loop;
		const harmonics = [1, 2, 3, 5, 8].map((k) => ({ amplitude: amount / k, k, phase: random() * Math.PI * 2 }));
		const count = loop.length;
		return loop.map((point, i) => {
			const previous = loop[(i - 1 + count) % count];
			const following = loop[(i + 1) % count];
			const tx = following[0] - previous[0];
			const ty = following[1] - previous[1];
			const length = Math.hypot(tx, ty) || 1;
			const nx = ty / length;
			const ny = -tx / length;
			const s = i / count;
			let offset = 0;
			for (const harmonic of harmonics) offset += harmonic.amplitude * Math.sin(harmonic.k * s * Math.PI * 2 + harmonic.phase);
			return [point[0] + nx * offset, point[1] + ny * offset];
		});
	}

	/* ---------------------------------------------------------------------
	   5. Public — one letter, then a whole phrase
	   ------------------------------------------------------------------ */

	function mulberry(seed) {
		let a = seed >>> 0;
		return function random() {
			a = (a + 0x6d2b79f5) >>> 0;
			let t = a;
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const cache = new Map();

	/**
	 * One dilated letter, in em units relative to its own baseline origin.
	 *
	 * The two parameters that make the form are `weight` and `inflate`, and they
	 * only work against each other. Bubble letters are drawn by writing the word
	 * thin and then tracing a fat outline around it, so the source has to stay a
	 * near-skeleton: dilate a face that is already heavy and the counters close,
	 * the strokes merge, and every letter collapses into the same blob. Light
	 * source plus generous inflate keeps the letter's topology — which is what
	 * you actually read — while swelling the stems.
	 *
	 * `inflate` is a fraction of the em, so the look holds at any rendered size.
	 */
	function letter(char, options) {
		const fontStack = options.fontStack;
		const inflate = options.inflate;
		const weight = options.weight;
		const inflatePx = inflate * TILE_FONT;
		const cacheKey = `${char}|${fontStack}|${weight}|${inflate.toFixed(4)}|${options.plump}|${options.plumpSteps}|${options.detail}`;
		if (cache.has(cacheKey)) return cache.get(cacheKey);

		const pad = Math.ceil(inflatePx) + 8;
		const raster = rasterize(char, fontStack, pad, weight);
		let result;

		if (raster.ink === 0) {
			// A space (or a glyph the font has no outline for) carries an advance
			// and no shape. It must still occupy the layout.
			result = { advance: raster.advance / TILE_FONT, blank: true, loops: [] };
		} else {
			const sdf = signedDistance(raster.mask, raster.width, raster.height);
			const loops = linkLoops(contour(sdf, raster.width, raster.height, inflatePx));
			const spacing = Math.max(1.2, 10 - options.detail * 2);
			const relaxed = loops
				// The drift bound is tied to the dilation: a letter may bow by a
				// fraction of the distance the outline was already pushed out.
				.map((loop) => plump(smooth(resample(loop, spacing), 2), options.plump, options.plumpSteps, inflatePx * 0.6))
				.filter((loop) => loop.length >= 12);

			// The body is whichever loop encloses the most — never dropped. The
			// rest are counters, and a counter the dilation has squeezed past
			// closing survives as a sliver that draws as a stray hook rather than
			// as a mark. Those go.
			const ranked = relaxed
				.map((loop) => ({ loop, size: area(loop) }))
				.sort((a, b) => b.size - a.size);
			const shaped = ranked
				.filter((entry, index) => index === 0 || circularity(entry.loop) >= 0.12)
				.map(({ loop }) =>
					// Baseline origin to the tile's top-left, then scaled to em units.
					loop.map(([x, y]) => [(x - raster.originX) / TILE_FONT, (y - raster.originY) / TILE_FONT]));
			result = { advance: raster.advance / TILE_FONT, blank: false, loops: shaped };
		}

		cache.set(cacheKey, result);
		return result;
	}

	/**
	 * Lay a phrase out as bubble letters.
	 *
	 * Letters are placed on ordinary advances pulled tight by `tracking`, which
	 * is normally negative: the dilation has already swollen each letter past
	 * its own advance, so nothing short of overlap reads as bubble lettering.
	 * Each letter keeps its own closed loops rather than merging with its
	 * neighbours — that is what lets a later letter be painted over an earlier
	 * one and occlude it, which is how the reference reads.
	 */
	function phrase(text, options) {
		const settings = {
			detail: 3,
			fontStack: '"Helvetica Neue", "Inter", system-ui, Arial, sans-serif',
			inflate: 0.13,
			jitter: 0.03,
			lean: 0.04,
			lineHeight: 0.92,
			plump: 0.6,
			plumpSteps: 18,
			seed: 1,
			tracking: -0.18,
			weight: 300,
			wobble: 0.006,
			...options,
		};

		const random = mulberry(settings.seed);
		const lines = String(text).toUpperCase().split("\n");
		const placed = [];
		let index = 0;

		lines.forEach((line, lineNumber) => {
			let pen = 0;
			const row = [];
			for (const char of line) {
				const shape = letter(char, settings);
				if (!shape.blank) {
					const shaken = shape.loops.map((loop) => wobble(loop, settings.wobble, random));
					row.push({
						char,
						index: index++,
						// Per-letter shake. Bubble lettering is drawn by hand and
						// sits on no baseline worth the name; a perfectly level
						// row reads as a font, not as graffiti.
						lean: (random() * 2 - 1) * settings.lean,
						loops: shaken,
						rise: (random() * 2 - 1) * settings.jitter,
						x: pen,
						y: lineNumber * settings.lineHeight,
					});
				}
				pen += shape.advance + settings.tracking;
			}
			placed.push(row);
		});

		const letters = placed.flat();
		// Arc length per letter, so a partial trace advances at an even hand
		// speed instead of racing through small letters and crawling over big
		// ones. Computed here because every consumer of a phrase needs it.
		for (const item of letters) {
			item.lengths = item.loops.map((loop) => perimeter(loop));
			item.length = item.lengths.reduce((sum, n) => sum + n, 0);
			// The letter's own centre, so a pop scales it about itself instead of
			// flinging it away from the baseline origin.
			let minX = Infinity;
			let minY = Infinity;
			let maxX = -Infinity;
			let maxY = -Infinity;
			for (const loop of item.loops) {
				for (const point of loop) {
					if (point[0] < minX) minX = point[0];
					if (point[0] > maxX) maxX = point[0];
					if (point[1] < minY) minY = point[1];
					if (point[1] > maxY) maxY = point[1];
				}
			}
			item.cx = Number.isFinite(minX) ? (minX + maxX) / 2 : 0;
			item.cy = Number.isFinite(minY) ? (minY + maxY) / 2 : 0;
		}
		const bounds = measureBounds(letters);
		return { bounds, letters, lines: placed, settings };
	}

	/* ---------------------------------------------------------------------
	   6. Drawing — the hand, shared by every consumer
	   ------------------------------------------------------------------ */

	// A letter part-way through being traced is an OPEN path; only a finished
	// one closes and gets filled. That is the whole occlusion rule: the fill is
	// what hides the letter underneath, so it may not land early.
	function letterPath(item, fraction) {
		const path = new Path2D();
		if (fraction >= 1) {
			for (const loop of item.loops) {
				path.moveTo(loop[0][0], loop[0][1]);
				for (let i = 1; i < loop.length; i++) path.lineTo(loop[i][0], loop[i][1]);
				path.closePath();
			}
			return path;
		}
		// Spend the fraction across the loops in order, so the body is drawn
		// before its counters — the order a hand would take.
		let budget = item.length * fraction;
		for (let l = 0; l < item.loops.length; l++) {
			const loop = item.loops[l];
			if (budget <= 0) break;
			const span = item.lengths[l];
			const share = Math.min(1, budget / (span || 1));
			const count = Math.max(2, Math.round(loop.length * share));
			path.moveTo(loop[0][0], loop[0][1]);
			for (let i = 1; i < count; i++) path.lineTo(loop[i][0], loop[i][1]);
			if (share >= 1) path.closePath();
			budget -= span;
		}
		return path;
	}

	/**
	 * Paint a built phrase into a context already transformed into em space.
	 *
	 * Deliberately style-agnostic: it knows about fill, stroke and width, and
	 * nothing about what a "shadow" or a "sticker" is. Layered styles are two or
	 * three calls with different arguments, which keeps every style the caller
	 * can imagine expressible without touching the engine.
	 *
	 * `progress` runs 0→1 across the phrase and each letter takes one unit, so
	 * `letterFx(index, fraction)` — returning any of {rotate, scale, x, y} — can
	 * animate letters independently while they arrive. A scale is applied about
	 * the letter's own centre so it swells in place rather than sliding.
	 */
	function drawPhrase(ctx, built, options) {
		// `whole` switches the meaning of progress from "how much of this letter
		// is drawn" to "has this letter arrived": the outline is complete and
		// filled from the first frame, and the raw fraction is handed to
		// letterFx to drive size instead. That is the difference between a
		// letter being traced by a pen and a bubble being inflated.
		const { fill = null, letterFx = null, lineWidth = 0.014, progress = 1, stroke = null, whole = false } = options;
		if (!built || !built.letters.length) return;
		ctx.lineWidth = lineWidth;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		const drawn = progress * built.letters.length;

		built.letters.forEach((item, index) => {
			const fraction = Math.max(0, Math.min(1, drawn - index));
			if (fraction <= 0) return;
			ctx.save();
			ctx.translate(item.x, item.y + item.rise);
			if (letterFx) {
				const fx = letterFx(index, fraction) || {};
				if (fx.x || fx.y) ctx.translate(fx.x || 0, fx.y || 0);
				if (fx.rotate) {
					ctx.translate(item.cx, item.cy);
					ctx.rotate(fx.rotate);
					ctx.translate(-item.cx, -item.cy);
				}
				if (fx.scale && fx.scale !== 1) {
					ctx.translate(item.cx, item.cy);
					ctx.scale(fx.scale, fx.scale);
					ctx.translate(-item.cx, -item.cy);
				}
			}
			ctx.rotate(item.lean);
			const shown = whole ? 1 : fraction;
			const path = letterPath(item, shown);
			// A part-drawn letter is an open line, not a shape, so it is never
			// filled — the fill is what occludes the letter underneath, and it
			// may only land once the outline closes.
			if (fill && shown >= 1) {
				ctx.fillStyle = fill;
				ctx.fill(path, "evenodd");
			}
			if (stroke) {
				ctx.strokeStyle = stroke;
				ctx.stroke(path);
			}
			ctx.restore();
		});
	}

	// Bounds are taken from the transformed outlines, not the advances, because
	// the dilated shape is what the eye sees and what has to fit the frame.
	function measureBounds(letters) {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const item of letters) {
			for (const loop of item.loops) {
				for (const point of loop) {
					const [x, y] = transformPoint(point, item);
					if (x < minX) minX = x;
					if (x > maxX) maxX = x;
					if (y < minY) minY = y;
					if (y > maxY) maxY = y;
				}
			}
		}
		if (!Number.isFinite(minX)) return { height: 0, maxX: 0, maxY: 0, minX: 0, minY: 0, width: 0 };
		return { height: maxY - minY, maxX, maxY, minX, minY, width: maxX - minX };
	}

	function transformPoint(point, item) {
		const cos = Math.cos(item.lean);
		const sin = Math.sin(item.lean);
		const x = point[0];
		const y = point[1];
		return [item.x + x * cos - y * sin, item.y + item.rise + x * sin + y * cos];
	}

	global.SUPERMEGA_BUBBLE = Object.freeze({
		TILE_FONT,
		clearCache: () => cache.clear(),
		drawPhrase,
		letter,
		letterPath,
		measureBounds,
		phrase,
		transformPoint,
		// Exported for the engine test, which asserts the reference's numbers.
		internals: Object.freeze({ contour, edt2d, linkLoops, resample, signedDistance, wobble }),
	});
})(typeof window === "undefined" ? globalThis : window);
