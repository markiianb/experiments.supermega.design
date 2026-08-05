(function cubicLimitCore(global) {
	"use strict";

	const VERTICES = Object.freeze([
		Object.freeze([-1, -1, -1]), Object.freeze([1, -1, -1]), Object.freeze([1, 1, -1]), Object.freeze([-1, 1, -1]),
		Object.freeze([-1, -1, 1]), Object.freeze([1, -1, 1]), Object.freeze([1, 1, 1]), Object.freeze([-1, 1, 1]),
	]);
	const EDGES = Object.freeze([
		Object.freeze([0, 1]), Object.freeze([1, 2]), Object.freeze([2, 3]), Object.freeze([3, 0]),
		Object.freeze([4, 5]), Object.freeze([5, 6]), Object.freeze([6, 7]), Object.freeze([7, 4]),
		Object.freeze([0, 4]), Object.freeze([1, 5]), Object.freeze([2, 6]), Object.freeze([3, 7]),
	]);
	const DEFAULTS = Object.freeze({
		centerX: 0.5, centerY: 0.5, columns: 11, falloff: "quadratic", glyphScale: 0.74, maxEdges: 11,
		minEdges: 2, noise: 0.12, polarity: "ink-on-paper", projection: "orthographic", rotationX: 18,
		rotationY: 42, rotationZ: -12, rows: 7, seed: 1974, stroke: 1.4, subsetOperation: "selected",
	});

	function mulberry32(seed) {
		let state = seed >>> 0;
		return function random() {
			state = (state + 0x6D2B79F5) >>> 0;
			let value = state;
			value = Math.imul(value ^ (value >>> 15), value | 1);
			value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
			return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
		};
	}

	function mixSeed(seed, row, column, salt) {
		let value = (seed ^ Math.imul(row + 1, 0x9E3779B1) ^ Math.imul(column + 1, 0x85EBCA77) ^ Math.imul(salt + 1, 0xC2B2AE3D)) >>> 0;
		value ^= value >>> 16; value = Math.imul(value, 0x7FEB352D) >>> 0; value ^= value >>> 15;
		return value >>> 0;
	}

	function rotateVertex(vertex, x, y, z) {
		let [px, py, pz] = vertex;
		let cosine = Math.cos(x); let sine = Math.sin(x);
		[py, pz] = [py * cosine - pz * sine, py * sine + pz * cosine];
		cosine = Math.cos(y); sine = Math.sin(y);
		[px, pz] = [px * cosine + pz * sine, -px * sine + pz * cosine];
		cosine = Math.cos(z); sine = Math.sin(z);
		[px, py] = [px * cosine - py * sine, px * sine + py * cosine];
		return [px, py, pz];
	}

	function projectVertex(vertex, projection) {
		const [x, y, z] = vertex;
		if (projection === "perspective") {
			const factor = 2.8 / Math.max(1.2, 3.8 - z);
			return [x * factor, y * factor];
		}
		if (projection === "isometric") return [(x - z) * 0.72, (x + z) * 0.36 - y * 0.72];
		return [x, y];
	}

	function complementEdges(selected) {
		const set = new Set(selected);
		return Array.from({ length: 12 }, (_, index) => index).filter((index) => !set.has(index));
	}

	function rankedEdges(seed, row, column, salt) {
		const random = mulberry32(mixSeed(seed, row, column, salt));
		return Array.from({ length: 12 }, (_, index) => ({ index, order: random() })).sort((a, b) => a.order - b.order || a.index - b.index).map((entry) => entry.index);
	}

	function edgeTarget(configuration, radialDistance, random) {
		const normalized = Math.min(1, radialDistance);
		const shaped = configuration.falloff === "linear" ? normalized : configuration.falloff === "soft" ? Math.sqrt(normalized) : normalized * normalized;
		const noise = (random() - 0.5) * configuration.noise * 4;
		return Math.max(configuration.minEdges, Math.min(configuration.maxEdges, Math.round(configuration.maxEdges - shaped * (configuration.maxEdges - configuration.minEdges) + noise)));
	}

	function applyOperation(primary, secondary, operation) {
		if (operation === "complement") return complementEdges(primary);
		const first = new Set(primary);
		const second = new Set(secondary);
		if (operation === "union") return Array.from(new Set([...primary, ...secondary])).sort((a, b) => a - b);
		if (operation === "xor") return Array.from({ length: 12 }, (_, index) => index).filter((index) => first.has(index) !== second.has(index));
		return [...primary].sort((a, b) => a - b);
	}

	function generateField(configuration, phase) {
		const config = { ...DEFAULTS, ...configuration };
		const glyphs = [];
		const phaseAngle = (Number.isFinite(phase) ? phase : 0) * Math.PI * 2;
		for (let row = 0; row < config.rows; row += 1) {
			for (let column = 0; column < config.columns; column += 1) {
				const u = config.columns === 1 ? 0.5 : column / (config.columns - 1);
				const v = config.rows === 1 ? 0.5 : row / (config.rows - 1);
				const dx = u - config.centerX;
				const dy = v - config.centerY;
				const maxDistance = Math.max(0.001, Math.hypot(Math.max(config.centerX, 1 - config.centerX), Math.max(config.centerY, 1 - config.centerY)));
				const radialDistance = Math.hypot(dx, dy) / maxDistance;
				const random = mulberry32(mixSeed(config.seed, row, column, 0));
				const targetEdgeCount = edgeTarget(config, radialDistance, random);
				const primary = rankedEdges(config.seed, row, column, 1).slice(0, targetEdgeCount);
				const secondaryCount = Math.max(1, Math.min(12, Math.round(targetEdgeCount * 0.62)));
				const secondary = rankedEdges(config.seed, row, column, 2).slice(0, secondaryCount);
				const edgeIndices = applyOperation(primary, secondary, config.subsetOperation);
				const degrees = Math.PI / 180;
				const xAngle = (v - 0.5) * config.rotationX * degrees + phaseAngle * 0.11;
				const yAngle = (u - 0.5) * config.rotationY * degrees + phaseAngle * 0.17;
				const zAngle = (u + v - 1) * config.rotationZ * degrees + phaseAngle * 0.07;
				const projected = VERTICES.map((vertex) => projectVertex(rotateVertex(vertex, xAngle, yAngle, zAngle), config.projection));
				glyphs.push({ column, edgeIndices, projected, radialDistance, row, targetEdgeCount });
			}
		}
		return { configuration: config, glyphs, phase: Number.isFinite(phase) ? phase : 0 };
	}

	function stableStringify(value) {
		if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
		if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
		return JSON.stringify(value);
	}

	function geometryHash(value) {
		const source = stableStringify(value);
		let hash = 2166136261;
		for (let index = 0; index < source.length; index += 1) { hash ^= source.charCodeAt(index); hash = Math.imul(hash, 16777619); }
		return (hash >>> 0).toString(16).padStart(8, "0");
	}

	function palette(configuration) {
		if (configuration.polarity === "paper-on-ink") return { ground: "#101012", ink: "#eeeae0", accent: "#b7b1a8" };
		if (configuration.polarity === "supermega") return { ground: "#09090b", ink: "#f61515", accent: "#f2eee4" };
		return { ground: "#eeeae0", ink: "#111113", accent: "#68645e" };
	}

	function paint(ctx, field, configuration, options) {
		const width = options.width;
		const height = options.height;
		const colors = palette(configuration);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = colors.ground;
		ctx.fillRect(0, 0, width, height);
		const boardWidth = width * 0.88;
		const boardHeight = height * 0.82;
		const stepX = boardWidth / configuration.columns;
		const stepY = boardHeight / configuration.rows;
		const scale = Math.min(stepX, stepY) * configuration.glyphScale * 0.46;
		const originX = (width - boardWidth) / 2 + stepX / 2;
		const originY = (height - boardHeight) / 2 + stepY / 2;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = configuration.stroke * Math.max(1, width / 1600);
		for (const glyph of field.glyphs) {
			const cx = originX + glyph.column * stepX;
			const cy = originY + glyph.row * stepY;
			for (const edgeIndex of glyph.edgeIndices) {
				const edge = EDGES[edgeIndex];
				const a = glyph.projected[edge[0]];
				const b = glyph.projected[edge[1]];
				ctx.beginPath();
				ctx.moveTo(cx + a[0] * scale, cy + a[1] * scale);
				ctx.lineTo(cx + b[0] * scale, cy + b[1] * scale);
				ctx.strokeStyle = configuration.subsetOperation === "complement" || (configuration.polarity === "supermega" && configuration.subsetOperation === "xor" && edgeIndex % 3 === 0) ? colors.accent : colors.ink;
				ctx.stroke();
			}
		}
		return { edgeTotal: field.glyphs.reduce((sum, glyph) => sum + glyph.edgeIndices.length, 0), hash: geometryHash(field), phase: field.phase };
	}

	global.CGA76_CUBIC_LIMIT_CORE = Object.freeze({ DEFAULTS, EDGES, VERTICES, applyOperation, complementEdges, generateField, geometryHash, paint, projectVertex, rotateVertex });
})(typeof window === "undefined" ? globalThis : window);
