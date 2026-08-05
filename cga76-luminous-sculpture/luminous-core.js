(function luminousSculptureCore(global) {
	"use strict";

	const SOURCE_SIZE = 22 ** 3;
	const SOURCE_UNRESOLVED = 5;
	const SOURCE_SEEDS = Object.freeze([
		{ x: 6, y: 6, z: 9, color: 9 }, { x: 11, y: 15, z: 13, color: 6 }, { x: 16, y: 12, z: 11, color: 2 },
		{ x: 5, y: 15, z: 11, color: 12 }, { x: 10, y: 5, z: 12, color: 12 }, { x: 15, y: 11, z: 6, color: 12 }, { x: 2, y: 20, z: 20, color: 0 },
	].map((seed) => Object.freeze(seed)));
	const SOURCE_FACTORS = Object.freeze([1.33, 1.32, 1.25, 1.18, 1.10, 1.00, 1.00, 1.00, 1.10, 0.90, 1.25, 1.32, 0.90, 9.90]);
	const SOURCE_COMPATIBILITY = Object.freeze([
		[1, 2, 3, 5, 5, 5, 7, 5, 6, 7, 7, 0, 9],
		[1, 3, 4, 0, 0, 0, 9, 0, 0, 0, 2, 4, 0],
		[1, 2, 4, 6, 2, 0, 0, 9, 0, 0, 0, 2, 0],
		[1, 1, 6, 4, 6, 2, 0, 0, 9, 0, 0, 0, 0],
		[1, 0, 2, 6, 4, 6, 2, 0, 0, 0, 9, 0, 0],
		[1, 0, 0, 1, 6, 4, 6, 2, 9, 0, 0, 0, 0],
		[1, 9, 0, 0, 2, 7, 4, 6, 2, 1, 0, 1, 0],
		[1, 0, 9, 0, 0, 2, 6, 4, 6, 4, 1, 0, 0],
		[1, 0, 0, 0, 0, 9, 2, 6, 4, 6, 2, 0, 0],
		[1, 0, 0, 7, 0, 0, 0, 2, 6, 5, 6, 2, 0],
		[1, 2, 0, 0, 9, 0, 0, 0, 2, 6, 4, 6, 0],
		[1, 6, 2, 0, 0, 0, 0, 0, 0, 2, 6, 4, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
		[1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1],
	].map((row) => Object.freeze(row)));
	const SOURCE_COUNTS = Object.freeze([2216, 775, 1091, 942, 969, 465, 308, 470, 1073, 1199, 1080, 51, 4]);
	const SOURCE_ANOMALY = Object.freeze({ description: "The article prints fourteen factor/compatibility rows but only thirteen columns and thirteen final color counts.", extraFactorColor: 13, extraRowColor: 13, missingColumn: 13, runnableColors: 13 });
	const PALETTES = Object.freeze({
		source: Object.freeze(["#f0eee4", "#78c3ff", "#3c78cf", "#42bbb2", "#64c774", "#b7d651", "#eed84b", "#f5a243", "#eb6c49", "#db4b78", "#ae55b6", "#7659c6", "#d6a5ff"]),
		supermega: Object.freeze(["#f5eee4", "#f61515", "#ff5f32", "#ff9e21", "#ffd343", "#a8d451", "#48bf84", "#23b8ba", "#4188e8", "#564bc3", "#8a3ac5", "#cb3c96", "#fb6fbe"]),
	});

	function mix32(value) {
		value = Math.imul(value ^ value >>> 16, 0x7feb352d);
		value = Math.imul(value ^ value >>> 15, 0x846ca68b);
		return (value ^ value >>> 16) >>> 0;
	}
	function textHash(text) { let value = 2166136261; for (let index = 0; index < text.length; index += 1) { value ^= text.charCodeAt(index); value = Math.imul(value, 16777619); } return value >>> 0; }
	function domainHash(seed, domain, index) { return mix32((Number(seed) >>> 0) ^ textHash(String(domain)) ^ Math.imul((Number(index) >>> 0) + 1, 0x9e3779b1)); }
	function indexOf(x, y, z, dimension) { return z * dimension * dimension + y * dimension + x; }
	function coordinates(index, dimension) { const layer = dimension * dimension; const z = Math.floor(index / layer); const rest = index - z * layer; return { x: rest % dimension, y: Math.floor(rest / dimension), z }; }
	function faceNeighbours(x, y, z, dimension) { const values = []; if (x > 0) values.push(indexOf(x - 1, y, z, dimension)); if (x + 1 < dimension) values.push(indexOf(x + 1, y, z, dimension)); if (y > 0) values.push(indexOf(x, y - 1, z, dimension)); if (y + 1 < dimension) values.push(indexOf(x, y + 1, z, dimension)); if (z > 0) values.push(indexOf(x, y, z - 1, dimension)); if (z + 1 < dimension) values.push(indexOf(x, y, z + 1, dimension)); return values; }
	function runnableCompatibility() { return SOURCE_COMPATIBILITY.slice(0, 13).map((row) => row.slice(0, 13)); }

	function projectedSeeds(config, dimension) {
		const source = Array.isArray(config.seedCells) && config.seedCells.length ? config.seedCells : SOURCE_SEEDS;
		const unique = new Map();
		for (const item of source) {
			const sourceX = Math.max(1, Math.min(22, Math.round(Number(item?.x) || 1)));
			const sourceY = Math.max(1, Math.min(22, Math.round(Number(item?.y) || 1)));
			const sourceZ = Math.max(1, Math.min(22, Math.round(Number(item?.z) || 1)));
			const color = Math.max(0, Math.min(12, Math.round(Number(item?.color) || 0)));
			const x = dimension === 22 ? sourceX - 1 : Math.round((sourceX - 1) / 21 * (dimension - 1));
			const y = dimension === 22 ? sourceY - 1 : Math.round((sourceY - 1) / 21 * (dimension - 1));
			const z = dimension === 22 ? sourceZ - 1 : Math.round((sourceZ - 1) / 21 * (dimension - 1));
			unique.set(indexOf(x, y, z, dimension), { color, x, y, z });
		}
		return [...unique.values()];
	}

	function weightedBag(neighbourColors) {
		const matrix = SOURCE_COMPATIBILITY;
		const neighbours = [...new Set(neighbourColors.filter((color) => Number.isInteger(color) && color >= 0 && color <= 12))];
		const bag = [];
		for (let candidate = 0; candidate <= 12; candidate += 1) {
			if (neighbours.some((color) => !(matrix[color][candidate] > 0))) continue;
			const copies = neighbours.length ? Math.max(...neighbours.map((color) => matrix[color][candidate])) : Math.max(1, Math.round(4 / SOURCE_FACTORS[candidate]));
			for (let copy = 0; copy < Math.min(32, copies); copy += 1) bag.push(candidate);
		}
		return bag;
	}

	function createBuilder(config) {
		const dimension = Math.max(4, Math.min(22, Math.round(Number(config.dimension) || 12)));
		const total = dimension ** 3;
		const points = Array.from({ length: total }, (_, index) => ({ ...coordinates(index, dimension), color: null, fixed: false, index, unresolved: false }));
		const seeds = projectedSeeds(config, dimension);
		const precedenceSeeds = seeds.filter((item) => item.color !== 0);
		const fixed = new Set();
		for (const seed of seeds) { const index = indexOf(seed.x, seed.y, seed.z, dimension); fixed.add(index); points[index] = { ...seed, fixed: true, index, unresolved: false }; }
		const queue = [];
		for (let index = 0; index < total; index += 1) {
			if (fixed.has(index)) continue;
			const point = points[index];
			let weight = Infinity;
			for (const seed of precedenceSeeds) weight = Math.min(weight, SOURCE_FACTORS[seed.color] * Math.hypot(point.x - seed.x, point.y - seed.y, point.z - seed.z));
			queue.push({ index, tie: domainHash(config.seed, "precedence-tie", index), weight });
		}
		queue.sort((a, b) => a.weight - b.weight || a.tie - b.tie || a.index - b.index);
		let cursor = 0;
		let completed = fixed.size;
		let status = queue.length ? "building" : "ready";
		let error = null;
		const api = {
			cancel() { if (status === "building") status = "cancelled"; },
			get completed() { return completed; },
			get status() { return status; },
			get total() { return total; },
			snapshot() { return { completed, dimension, error, points, sourceMode: config.sourceMode, status, total }; },
			step(maxItems = config.chunkSize || 192) {
				if (status !== "building") return api.snapshot();
				const limit = Math.max(0, Math.floor(Number(maxItems) || 0));
				try {
					const stop = Math.min(queue.length, cursor + limit);
					for (; cursor < stop; cursor += 1) {
						const entry = queue[cursor];
						const point = points[entry.index];
						const neighbours = faceNeighbours(point.x, point.y, point.z, dimension).map((index) => points[index].color).filter(Number.isInteger);
						const bag = weightedBag(neighbours);
						const color = bag.length ? bag[domainHash(config.seed, "candidate-choice", entry.index) % bag.length] : 0;
						points[entry.index] = { ...point, color, unresolved: bag.length === 0 };
						completed += 1;
					}
					if (cursor >= queue.length) status = "ready";
				} catch (caught) { error = caught instanceof Error ? caught.message : String(caught); status = "error"; }
				return api.snapshot();
			},
		};
		return api;
	}

	function projectPoint(point, config, dimension) {
		const center = (dimension - 1) / 2;
		const yaw = Number(config.cameraYaw || 0) * Math.PI / 180;
		const pitch = Number(config.cameraPitch || 0) * Math.PI / 180;
		const x0 = point.x - center;
		const y0 = point.y - center;
		const z0 = point.z - center;
		const x1 = x0 * Math.cos(yaw) - z0 * Math.sin(yaw);
		const z1 = x0 * Math.sin(yaw) + z0 * Math.cos(yaw);
		const y1 = y0 * Math.cos(pitch) - z1 * Math.sin(pitch);
		const depth = y0 * Math.sin(pitch) + z1 * Math.cos(pitch);
		return { ...point, depth, projectedX: x1, projectedY: y1 };
	}

	function filteredPoints(result, config) {
		if (config.sliceAxis === "all" || Number(config.sliceIndex) < 0) return result.points.filter((point) => Number.isInteger(point.color));
		const axis = ["x", "y", "z"].includes(config.sliceAxis) ? config.sliceAxis : "z";
		const plane = Math.max(0, Math.min(result.dimension - 1, Math.round(Number(config.sliceIndex) || 0)));
		return result.points.filter((point) => Number.isInteger(point.color) && point[axis] === plane);
	}

	function canonicalProjection(result, config, available = filteredPoints(result, config)) {
		if (!result || result.status !== "ready") throw new Error("Canonical projection is unavailable until the sculpture is ready.");
		return available.map((point) => projectPoint(point, config, result.dimension)).sort((a, b) => a.depth - b.depth || a.index - b.index);
	}

	function interactiveProjection(result, config, cap = 4200, available = filteredPoints(result, config)) {
		const stride = Math.max(1, Math.ceil(available.length / Math.max(1, cap)));
		const sampled = available.filter((point, index) => index % stride === 0);
		return sampled.map((point) => projectPoint(point, config, result.dimension)).sort((a, b) => a.depth - b.depth || a.index - b.index);
	}

	function paint(context, result, config, options) {
		const width = options.width;
		const height = options.height;
		const canonical = options.canonical === true;
		const palette = PALETTES[config.palette] || PALETTES.source;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.fillStyle = "#09090c";
		context.fillRect(0, 0, width, height);
		const glow = context.createRadialGradient(width * 0.5, height * 0.88, 0, width * 0.5, height * 0.88, Math.min(width, height) * 0.55);
		glow.addColorStop(0, `rgba(246,21,21,${Math.min(0.36, Number(config.lightPower) * 0.22)})`);
		glow.addColorStop(0.45, "rgba(236,159,73,.10)");
		glow.addColorStop(1, "rgba(0,0,0,0)");
		context.fillStyle = glow;
		context.fillRect(0, 0, width, height);
		const available = filteredPoints(result, config);
		const points = canonical ? canonicalProjection(result, config, available) : interactiveProjection(result, config, options.cap || 4200, available);
		const scale = Math.min(width, height) * 0.66 / Math.max(1, result.dimension) * Math.max(0.5, Number(config.zoom) || 1);
		const radius = Math.max(1.4, scale * 0.34 * Math.max(0.35, Number(config.pointScale) || 1));
		for (const point of points) {
			const perspective = 1 + point.depth / Math.max(20, result.dimension * 5);
			const x = width / 2 + point.projectedX * scale * perspective;
			const y = height / 2 + point.projectedY * scale * perspective;
			context.globalAlpha = Math.max(0.08, Math.min(0.95, Number(config.opacity) || 0.55));
			context.fillStyle = palette[point.color] || palette[0];
			context.beginPath();
			context.arc(x, y, radius * perspective, 0, Math.PI * 2);
			context.fill();
			if (point.fixed) { context.strokeStyle = "rgba(255,255,255,.88)"; context.lineWidth = Math.max(1, radius * 0.18); context.stroke(); }
		}
		context.globalAlpha = 1;
		return { rendered: points.length, total: available.length };
	}

	function stable(value) { if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`; if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`; return JSON.stringify(value); }
	function hash(value) { return textHash(stable(value)).toString(16).padStart(8, "0"); }

	global.CGA76_LUMINOUS_SCULPTURE_CORE = Object.freeze({
		PALETTES, SOURCE_ANOMALY, SOURCE_COMPATIBILITY, SOURCE_COUNTS, SOURCE_FACTORS, SOURCE_SEEDS, SOURCE_SIZE, SOURCE_UNRESOLVED,
		canonicalProjection, coordinates, createBuilder, domainHash, faceNeighbours, hash, indexOf, interactiveProjection, paint, runnableCompatibility,
	});
})(typeof window === "undefined" ? globalThis : window);
