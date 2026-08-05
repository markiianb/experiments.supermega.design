(function ordinalFifteenCore(global) {
	"use strict";

	const FAMILY_COEFFICIENTS = Object.freeze({
		"latin-counter": [1, 3, 2],
		"latin-cross": [2, 1, 1],
		"latin-diagonal": [1, 2, 0],
	});
	const MOTIF_MAPS = Object.freeze({
		ordinal: ["maze-path", "maze-ribbon", "curve-interpolation", "curve-hatch", "negative-space"],
		paired: ["maze-ribbon", "maze-path", "curve-hatch", "curve-interpolation", "negative-space"],
		reverse: ["curve-hatch", "curve-interpolation", "maze-ribbon", "maze-path", "negative-space"],
	});
	const DEFAULTS = Object.freeze({
		curveAmplitude: 0.28,
		family: "latin-diagonal",
		hatchAngle: 32,
		hatchSpacing: 10,
		interpolationSteps: 7,
		lineWeight: 1.6,
		mapping: "ordinal",
		mazeDensity: 7,
		negativeSpace: "open",
		palette: "source",
		pathContinuity: 0.82,
		polarity: "ink-on-paper",
		seed: 1972,
		turnBias: 0.2,
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

	function mixSeed(seed, row, column, ordinal) {
		let value = (seed ^ Math.imul(row + 1, 0x9E3779B1) ^ Math.imul(column + 1, 0x85EBCA77) ^ Math.imul(ordinal, 0xC2B2AE3D)) >>> 0;
		value ^= value >>> 16;
		value = Math.imul(value, 0x7FEB352D) >>> 0;
		value ^= value >>> 15;
		return value >>> 0;
	}

	function magicSquare(family) {
		const coefficients = FAMILY_COEFFICIENTS[family] || FAMILY_COEFFICIENTS[DEFAULTS.family];
		return Array.from({ length: 5 }, (_, row) => Array.from({ length: 5 }, (_, column) =>
			((coefficients[0] * row + coefficients[1] * column + coefficients[2]) % 5) + 1));
	}

	function chooseWeighted(random, choices) {
		const total = choices.reduce((sum, choice) => sum + choice.weight, 0);
		let cursor = random() * total;
		for (const choice of choices) {
			cursor -= choice.weight;
			if (cursor <= 0) return choice;
		}
		return choices[choices.length - 1];
	}

	function mazePath(configuration, random, variant) {
		const density = configuration.mazeDensity;
		const visited = new Set();
		let x = Math.floor(random() * density);
		let y = Math.floor(random() * density);
		let direction = Math.floor(random() * 4);
		const points = [[(x + 0.5) / density, (y + 0.5) / density]];
		visited.add(`${x}:${y}`);
		const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
		const target = Math.max(4, Math.round(density * density * configuration.pathContinuity * (variant ? 0.68 : 0.52)));
		while (points.length < target) {
			const candidates = [];
			for (let nextDirection = 0; nextDirection < 4; nextDirection += 1) {
				const nx = x + directions[nextDirection][0];
				const ny = y + directions[nextDirection][1];
				if (nx < 0 || nx >= density || ny < 0 || ny >= density || visited.has(`${nx}:${ny}`)) continue;
				const straight = nextDirection === direction;
				const clockwise = nextDirection === ((direction + 1) % 4);
				let weight = straight ? 1.3 + configuration.pathContinuity * 3 : 1;
				if (!straight) weight *= clockwise ? 1 + Math.max(0, configuration.turnBias) : 1 + Math.max(0, -configuration.turnBias);
				if (variant && !straight) weight *= 1.7;
				candidates.push({ direction: nextDirection, nx, ny, weight });
			}
			if (!candidates.length) break;
			const selected = chooseWeighted(random, candidates);
			x = selected.nx;
			y = selected.ny;
			direction = selected.direction;
			visited.add(`${x}:${y}`);
			points.push([(x + 0.5) / density, (y + 0.5) / density]);
		}
		if (points.length < 2) points.push([Math.min(0.95, points[0][0] + 1 / density), points[0][1]]);
		return points;
	}

	function mazeGeometry(configuration, random, variant) {
		const primary = mazePath(configuration, random, variant);
		if (!variant) {
			const ticks = primary.slice(1, -1).filter((_, index) => index % 2 === 0).map((point, index) => ({
				kind: "segment",
				points: [[point[0] - 0.018, point[1] + (index % 2 ? -0.04 : 0.04)], [point[0] + 0.018, point[1] + (index % 2 ? 0.04 : -0.04)]],
				role: "secondary",
			}));
			return [{ kind: "polyline", points: primary, role: "primary" }, ...ticks];
		}
		const offset = 0.032;
		const ribbonA = primary.map((point, index) => [point[0] + (index % 2 ? offset : -offset), point[1]]);
		const ribbonB = primary.map((point, index) => [point[0] + (index % 2 ? -offset : offset), point[1]]);
		return [
			{ kind: "polyline", points: ribbonA, role: "primary" },
			{ kind: "polyline", points: ribbonB, role: "primary" },
			{ kind: "segment", points: [ribbonA[0], ribbonB[0]], role: "secondary" },
			{ kind: "segment", points: [ribbonA.at(-1), ribbonB.at(-1)], role: "secondary" },
		];
	}

	function cubicPoint(points, t) {
		const mt = 1 - t;
		const a = mt * mt * mt;
		const b = 3 * mt * mt * t;
		const c = 3 * mt * t * t;
		const d = t * t * t;
		return [
			a * points[0][0] + b * points[1][0] + c * points[2][0] + d * points[3][0],
			a * points[0][1] + b * points[1][1] + c * points[2][1] + d * points[3][1],
		];
	}

	function curvePair(configuration, random, variant) {
		const amplitude = configuration.curveAmplitude;
		const jitter = () => (random() - 0.5) * 0.1;
		if (!variant) {
			return [
				[[0.08, 0.25 + jitter()], [0.3, 0.25 - amplitude], [0.72, 0.25 + amplitude], [0.92, 0.28 + jitter()]],
				[[0.08, 0.72 + jitter()], [0.34, 0.72 + amplitude], [0.68, 0.72 - amplitude], [0.92, 0.7 + jitter()]],
			];
		}
		return [
			[[0.25 + jitter(), 0.08], [0.25 - amplitude, 0.3], [0.25 + amplitude, 0.72], [0.28 + jitter(), 0.92]],
			[[0.72 + jitter(), 0.08], [0.72 + amplitude, 0.34], [0.72 - amplitude, 0.68], [0.7 + jitter(), 0.92]],
		];
	}

	function sampledCurve(points, samples) {
		return Array.from({ length: samples + 1 }, (_, index) => cubicPoint(points, index / samples));
	}

	function curveGeometry(configuration, random, variant) {
		const pair = curvePair(configuration, random, variant);
		const samples = 20;
		const first = sampledCurve(pair[0], samples);
		const second = sampledCurve(pair[1], samples);
		if (!variant) {
			return Array.from({ length: configuration.interpolationSteps }, (_, line) => {
				const amount = line / Math.max(1, configuration.interpolationSteps - 1);
				return {
					kind: "polyline",
					points: first.map((point, index) => [
						point[0] + (second[index][0] - point[0]) * amount,
						point[1] + (second[index][1] - point[1]) * amount,
					]),
					role: line === 0 || line === configuration.interpolationSteps - 1 ? "primary" : "secondary",
				};
			});
		}
		const radians = configuration.hatchAngle * Math.PI / 180;
		const count = Math.max(3, Math.round(120 / configuration.hatchSpacing));
		const geometry = [
			{ kind: "polyline", points: first, role: "primary" },
			{ kind: "polyline", points: second, role: "primary" },
		];
		for (let index = 0; index <= count; index += 1) {
			const t = index / count;
			const a = cubicPoint(pair[0], t);
			const b = cubicPoint(pair[1], t);
			const dx = Math.cos(radians) * 0.035;
			const dy = Math.sin(radians) * 0.035;
			geometry.push({ kind: "segment", points: [[a[0] - dx, a[1] - dy], [b[0] + dx, b[1] + dy]], role: "secondary" });
		}
		return geometry;
	}

	function negativeGeometry(rule) {
		if (rule === "frame") return [{ kind: "rect", points: [[0.14, 0.14], [0.86, 0.86]], role: "secondary" }];
		if (rule === "ghost") return [
			{ kind: "segment", points: [[0.18, 0.18], [0.82, 0.82]], role: "ghost" },
			{ kind: "segment", points: [[0.82, 0.18], [0.18, 0.82]], role: "ghost" },
		];
		return [];
	}

	function generate(configuration) {
		const config = { ...DEFAULTS, ...configuration };
		const square = magicSquare(config.family);
		const mapping = MOTIF_MAPS[config.mapping] || MOTIF_MAPS.ordinal;
		const cells = [];
		for (let row = 0; row < 5; row += 1) {
			for (let column = 0; column < 5; column += 1) {
				const ordinal = square[row][column];
				const motif = mapping[ordinal - 1];
				const random = mulberry32(mixSeed(config.seed, row, column, ordinal));
				let geometry;
				if (motif === "maze-path") geometry = mazeGeometry(config, random, false);
				else if (motif === "maze-ribbon") geometry = mazeGeometry(config, random, true);
				else if (motif === "curve-interpolation") geometry = curveGeometry(config, random, false);
				else if (motif === "curve-hatch") geometry = curveGeometry(config, random, true);
				else geometry = negativeGeometry(config.negativeSpace);
				cells.push({ column, geometry, motif, negativeRule: motif === "negative-space" ? config.negativeSpace : null, ordinal, row });
			}
		}
		return { cells, configuration: config, square };
	}

	function stableStringify(value) {
		if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
		if (value && typeof value === "object") {
			return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
		}
		return JSON.stringify(value);
	}

	function geometryHash(value) {
		const source = stableStringify(value);
		let hash = 2166136261;
		for (let index = 0; index < source.length; index += 1) {
			hash ^= source.charCodeAt(index);
			hash = Math.imul(hash, 16777619);
		}
		return (hash >>> 0).toString(16).padStart(8, "0");
	}

	function colors(configuration, row, column) {
		const supermega = configuration.palette === "supermega";
		let ground = supermega ? "#0b0b0d" : "#eeeae0";
		let ink = supermega ? "#f61515" : "#111113";
		let secondary = supermega ? "#f5eee6" : "#62615c";
		let inverted = configuration.polarity === "paper-on-ink";
		if (configuration.polarity === "split") inverted = (row + column) % 2 === 1;
		if (inverted) [ground, ink] = [ink, ground];
		return { ground, ink, secondary };
	}

	function traceGeometry(ctx, command, x, y, size) {
		const points = command.points;
		if (command.kind === "rect") {
			const first = points[0];
			const second = points[1];
			ctx.rect(x + first[0] * size, y + first[1] * size, (second[0] - first[0]) * size, (second[1] - first[1]) * size);
			return;
		}
		if (!points.length) return;
		ctx.moveTo(x + points[0][0] * size, y + points[0][1] * size);
		for (let index = 1; index < points.length; index += 1) {
			ctx.lineTo(x + points[index][0] * size, y + points[index][1] * size);
		}
	}

	function paint(ctx, field, configuration, options) {
		const width = options.width;
		const height = options.height;
		const progress = Math.max(0, Math.min(1, options.progress ?? 1));
		const base = colors(configuration, 0, 0);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = base.ground;
		ctx.fillRect(0, 0, width, height);
		const board = Math.min(width * 0.72, height * 0.86);
		const gap = board * 0.014;
		const cellSize = (board - gap * 4) / 5;
		const originX = (width - board) / 2;
		const originY = (height - board) / 2;
		const visible = progress * field.cells.length;
		for (let index = 0; index < field.cells.length; index += 1) {
			const cellProgress = Math.max(0, Math.min(1, visible - index));
			if (cellProgress <= 0) continue;
			const cell = field.cells[index];
			const x = originX + cell.column * (cellSize + gap);
			const y = originY + cell.row * (cellSize + gap);
			const palette = colors(configuration, cell.row, cell.column);
			ctx.fillStyle = palette.ground;
			ctx.fillRect(x, y, cellSize, cellSize);
			ctx.save();
			ctx.beginPath();
			ctx.rect(x, y, cellSize, cellSize);
			ctx.clip();
			const commandCount = Math.max(1, Math.ceil(cell.geometry.length * cellProgress));
			for (let commandIndex = 0; commandIndex < Math.min(commandCount, cell.geometry.length); commandIndex += 1) {
				const command = cell.geometry[commandIndex];
				ctx.beginPath();
				traceGeometry(ctx, command, x, y, cellSize);
				ctx.strokeStyle = command.role === "primary" ? palette.ink : palette.secondary;
				ctx.globalAlpha = command.role === "ghost" ? 0.24 : 1;
				ctx.lineWidth = configuration.lineWeight * (command.role === "primary" ? 1.45 : 0.75) * Math.max(1, width / 1600);
				ctx.lineCap = "square";
				ctx.lineJoin = "miter";
				ctx.stroke();
			}
			ctx.restore();
		}
		ctx.globalAlpha = 1;
		return { board, cellsVisible: Math.min(field.cells.length, Math.ceil(visible)), hash: geometryHash(field), progress };
	}

	global.CGA76_ORDINAL_CORE = Object.freeze({
		DEFAULTS,
		FAMILY_COEFFICIENTS,
		MOTIF_MAPS,
		generate,
		geometryHash,
		magicSquare,
		paint,
	});
})(typeof window === "undefined" ? globalThis : window);
