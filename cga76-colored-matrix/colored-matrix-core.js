(function coloredMatrixCore(global) {
	"use strict";

	const SOURCE_PRECEDENCE_10X10 = Object.freeze([
		[3, 2, 2, 2, 2, 2, 3, 4, 5, 6],
		[3, 2, 1, 1, 1, 2, 3, 4, 5, 6],
		[3, 2, 1, 0, 1, 2, 3, 4, 5, 6],
		[3, 2, 1, 1, 1, 2, 3, 4, 5, 6],
		[3, 2, 2, 2, 2, 2, 3, 4, 5, 6],
		[3, 3, 3, 3, 3, 3, 3, 4, 5, 6],
		[4, 4, 4, 4, 4, 4, 4, 4, 5, 6],
		[5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
		[6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
		[7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	].map((row) => Object.freeze(row)));

	const SOURCE_COMPATIBILITY = Object.freeze([
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 2, 2, 0, 0, 2, 0, 0, 2],
		[1, 2, 2, 2, 0, 0, 2, 0, 0],
		[1, 0, 2, 2, 2, 0, 0, 2, 0],
		[1, 0, 0, 2, 2, 2, 0, 0, 2],
		[1, 2, 0, 0, 2, 2, 2, 0, 0],
		[1, 0, 2, 0, 0, 0, 2, 2, 2],
		[1, 0, 0, 2, 0, 0, 0, 2, 2],
		[1, 2, 0, 0, 2, 0, 0, 0, 2],
	].map((row) => Object.freeze(row)));

	const PALETTES = Object.freeze({
		source: Object.freeze(["#f0eadc", "#1769aa", "#20824c", "#f3ca37", "#d64a33", "#6d43a5", "#ee8132", "#2eaab5", "#d83f87"]),
		supermega: Object.freeze(["#efede6", "#111113", "#f61515", "#ff8b1f", "#3759e7", "#68c257", "#ffc900", "#7d43de", "#e64291"]),
	});

	function mix32(value) {
		value = Math.imul(value ^ value >>> 16, 0x7feb352d);
		value = Math.imul(value ^ value >>> 15, 0x846ca68b);
		return (value ^ value >>> 16) >>> 0;
	}

	function textHash(text) {
		let value = 2166136261;
		for (let index = 0; index < text.length; index += 1) {
			value ^= text.charCodeAt(index);
			value = Math.imul(value, 16777619);
		}
		return value >>> 0;
	}

	function domainHash(seed, domain, index) {
		return mix32((Number(seed) >>> 0) ^ textHash(String(domain)) ^ Math.imul((Number(index) >>> 0) + 1, 0x9e3779b1));
	}

	function sourcePrecedenceOracle() {
		return SOURCE_PRECEDENCE_10X10.map((row) => [...row]);
	}

	function candidateBag(compatibility, neighbourColors, colorBias) {
		const matrix = Array.isArray(compatibility) ? compatibility : [];
		const colors = matrix.reduce((maximum, row) => Math.max(maximum, Array.isArray(row) ? row.length : 0), 0);
		const neighbours = [...new Set((Array.isArray(neighbourColors) ? neighbourColors : []).filter((color) => Number.isInteger(color) && Array.isArray(matrix[color])))];
		const bag = [];
		for (let color = 0; color < colors; color += 1) {
			if (neighbours.some((neighbour) => !(Number(matrix[neighbour][color]) > 0))) continue;
			const printedWeight = neighbours.length ? Math.max(...neighbours.map((neighbour) => Math.round(Number(matrix[neighbour][color]) || 0))) : 1;
			const bias = Array.isArray(colorBias) ? Math.max(0, Math.round(Number(colorBias[color]) || 0)) : 1;
			const copies = Math.min(64, printedWeight * bias);
			for (let copy = 0; copy < copies; copy += 1) bag.push(color);
		}
		return bag;
	}

	function chooseCandidate(bag, randomNumber) {
		if (!Array.isArray(bag) || bag.length === 0) return null;
		return bag[(Number(randomNumber) >>> 0) % bag.length];
	}

	function distance(dx, dy, metric) {
		if (metric === "manhattan") return Math.abs(dx) + Math.abs(dy);
		if (metric === "chebyshev") return Math.max(Math.abs(dx), Math.abs(dy));
		return Math.hypot(dx, dy);
	}

	function neighboursFor(index, columns, rows, mode) {
		const x = index % columns;
		const y = Math.floor(index / columns);
		const offsets = mode === "eight"
			? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
			: [[0, -1], [-1, 0], [1, 0], [0, 1]];
		const found = [];
		for (const [ox, oy] of offsets) {
			const nx = x + ox;
			const ny = y + oy;
			if (nx >= 0 && nx < columns && ny >= 0 && ny < rows) found.push(ny * columns + nx);
		}
		return found;
	}

	function normalizedSeeds(config) {
		const columns = Math.max(1, Math.round(Number(config.columns) || 1));
		const rows = Math.max(1, Math.round(Number(config.rows) || 1));
		const colors = Math.max(1, config.compatibility?.[0]?.length || 1);
		const unique = new Map();
		for (const item of Array.isArray(config.seedCells) ? config.seedCells : []) {
			const x = Math.round(Number(item?.x));
			const y = Math.round(Number(item?.y));
			const color = Math.round(Number(item?.color));
			if (x >= 0 && x < columns && y >= 0 && y < rows && color >= 0 && color < colors) unique.set(y * columns + x, { color, x, y });
		}
		if (unique.size === 0) unique.set(Math.floor(rows / 2) * columns + Math.floor(columns / 2), { color: Math.min(5, colors - 1), x: Math.floor(columns / 2), y: Math.floor(rows / 2) });
		return [...unique.values()];
	}

	function precedenceOrder(config, seeds) {
		const columns = config.columns;
		const rows = config.rows;
		const fixed = new Set(seeds.map((seed) => seed.y * columns + seed.x));
		const origins = seeds.filter((seed) => seed.color !== 0);
		const usableOrigins = origins.length ? origins : seeds;
		const entries = [];
		for (let index = 0; index < rows * columns; index += 1) {
			if (fixed.has(index)) continue;
			const x = index % columns;
			const y = Math.floor(index / columns);
			let weight = Infinity;
			for (const seed of usableOrigins) {
				const factor = Math.max(0.0001, Number(config.precedenceFactors?.[seed.color]) || 1);
				weight = Math.min(weight, factor * distance(x - seed.x, y - seed.y, config.distanceMetric));
			}
			entries.push({ index, tie: domainHash(config.seed, "precedence-tie", index), weight });
		}
		entries.sort((a, b) => a.weight - b.weight || a.tie - b.tie || a.index - b.index);
		return entries;
	}

	function precedenceField(config) {
		const columns = Math.max(1, Math.round(Number(config.columns) || 1));
		const rows = Math.max(1, Math.round(Number(config.rows) || 1));
		const seeds = normalizedSeeds({ ...config, columns, rows });
		const origins = seeds.filter((seed) => seed.color !== 0);
		const usableOrigins = origins.length ? origins : seeds;
		return Array.from({ length: rows }, (_, y) => Array.from({ length: columns }, (_, x) => {
			let weight = Infinity;
			for (const seed of usableOrigins) {
				const factor = Math.max(0.0001, Number(config.precedenceFactors?.[seed.color]) || 1);
				weight = Math.min(weight, factor * distance(x - seed.x, y - seed.y, config.distanceMetric));
			}
			return weight;
		}));
	}

	function solve(config, options = {}) {
		const columns = Math.max(1, Math.round(Number(config.columns) || 1));
		const rows = Math.max(1, Math.round(Number(config.rows) || 1));
		const normalized = { ...config, columns, rows };
		const seeds = normalizedSeeds(normalized);
		const cells = Array.from({ length: rows * columns }, (_, index) => ({ color: null, fixed: false, index, unresolved: false }));
		for (const seed of seeds) cells[seed.y * columns + seed.x] = { color: seed.color, fixed: true, index: seed.y * columns + seed.x, unresolved: false };
		const order = precedenceOrder(normalized, seeds);
		const decisions = [];
		for (let step = 0; step < order.length; step += 1) {
			const entry = order[step];
			const neighbours = neighboursFor(entry.index, columns, rows, normalized.neighborMode)
				.map((index) => cells[index].color)
				.filter((color) => Number.isInteger(color));
			const bag = candidateBag(normalized.compatibility, neighbours, normalized.colorBias);
			const randomNumber = domainHash(normalized.seed, "candidate-choice", entry.index);
			const selected = chooseCandidate(bag, randomNumber);
			const unresolved = selected === null;
			const color = unresolved ? (options.finalize === false ? null : 0) : selected;
			cells[entry.index] = { color, fixed: false, index: entry.index, unresolved };
			decisions.push({ candidates: [...bag], color, index: entry.index, neighbours: [...neighbours], precedence: entry.weight, randomNumber, step, unresolved });
		}
		return { cells, columns, configuration: { ...normalized, seedCells: seeds.map((seed) => ({ ...seed })) }, decisions, order: order.map((entry) => entry.index), rows, stats: { fixed: seeds.length, unresolved: cells.filter((cell) => cell.unresolved).length } };
	}

	function createReplay(config) {
		const result = solve(config);
		let visibleDecisions = 0;
		return Object.freeze({
			reset() { visibleDecisions = 0; return this.snapshot(); },
			snapshot() { return { cells: result.cells.map((cell) => ({ ...cell })), done: visibleDecisions >= result.decisions.length, result, visibleDecisions }; },
			step(count = 1) { visibleDecisions = Math.min(result.decisions.length, visibleDecisions + Math.max(0, Math.floor(Number(count) || 0))); return this.snapshot(); },
		});
	}

	function stable(value) {
		if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
		if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
		return JSON.stringify(value);
	}

	function hash(value) {
		return textHash(stable(value)).toString(16).padStart(8, "0");
	}

	function paint(context, result, config, options) {
		const width = options.width;
		const height = options.height;
		const progress = Math.max(0, Math.min(1, Number(options.progress ?? 1)));
		const palette = PALETTES[config.palette] || PALETTES.source;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.fillStyle = config.palette === "supermega" ? "#dcd9d1" : "#ddd3c2";
		context.fillRect(0, 0, width, height);
		const margin = Math.min(width, height) * 0.075;
		const cell = Math.min((width - margin * 2) / result.columns, (height - margin * 2) / result.rows);
		const boardWidth = cell * result.columns;
		const boardHeight = cell * result.rows;
		const left = (width - boardWidth) / 2;
		const top = (height - boardHeight) / 2;
		const decisionVisible = Math.ceil(result.decisions.length * progress);
		const visible = new Set(result.decisions.slice(0, decisionVisible).map((decision) => decision.index));
		for (const cellValue of result.cells) {
			if (!cellValue.fixed && !visible.has(cellValue.index)) continue;
			const x = left + cellValue.index % result.columns * cell;
			const y = top + Math.floor(cellValue.index / result.columns) * cell;
			context.fillStyle = palette[cellValue.color ?? 0] || palette[0];
			context.strokeStyle = "rgba(18,18,20,.28)";
			context.lineWidth = Math.max(1, cell * 0.018);
			context.beginPath();
			if (config.moduleShape === "rectangles") context.rect(x + cell * 0.07, y + cell * 0.07, cell * 0.86, cell * 0.86);
			else context.arc(x + cell / 2, y + cell / 2, cell * 0.405, 0, Math.PI * 2);
			context.fill();
			context.stroke();
			if (cellValue.fixed) {
				context.strokeStyle = "#f61515";
				context.lineWidth = Math.max(2, cell * 0.045);
				context.strokeRect(x + cell * 0.03, y + cell * 0.03, cell * 0.94, cell * 0.94);
			}
			if (cellValue.unresolved) {
				context.strokeStyle = "#f61515";
				context.beginPath();
				context.moveTo(x + cell * 0.25, y + cell * 0.25);
				context.lineTo(x + cell * 0.75, y + cell * 0.75);
				context.stroke();
			}
		}
		return { cell, visible: decisionVisible + result.stats.fixed };
	}

	global.CGA76_COLORED_MATRIX_CORE = Object.freeze({
		PALETTES, SOURCE_COMPATIBILITY, SOURCE_PRECEDENCE_10X10, candidateBag, chooseCandidate,
		createReplay, domainHash, hash, neighboursFor, paint, precedenceField, precedenceOrder, solve, sourcePrecedenceOracle,
	});
})(typeof window === "undefined" ? globalThis : window);
