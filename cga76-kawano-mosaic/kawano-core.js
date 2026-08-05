(function kawanoMosaicCore(global) {
	"use strict";

	const DEFAULTS = Object.freeze({
		columns: 40, contextOrder: "two", horizontalInfluence: 0.56, rounding: 0.38, rows: 40,
		scanOrder: "row-major", seed: 1970, smoothing: 0.12, stateCount: 5, temperature: 0.92,
		verticalInfluence: 0.44, viewMode: "linked",
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

	function table(rows, columns) {
		return Array.from({ length: rows }, () => Array(columns).fill(0));
	}

	function context2(first, second, states) {
		return first * states + second;
	}

	function context4(a, b, c, d, states) {
		return ((a * states + b) * states + c) * states + d;
	}

	function sanitizeTrainingGrid(training) {
		const stateCount = Math.max(2, Math.min(8, Math.round(Number(training?.stateCount) || 5)));
		const width = Math.max(2, Math.min(40, Math.round(Number(training?.width) || 2)));
		const height = Math.max(2, Math.min(40, Math.round(Number(training?.height) || 2)));
		const source = Array.isArray(training?.cells) ? training.cells : [];
		const cells = Array.from({ length: width * height }, (_, index) => {
			const parsed = Number(source[index]);
			return Number.isFinite(parsed) ? Math.max(0, Math.min(stateCount - 1, Math.round(parsed))) : 0;
		});
		return { cells, height, stateCount, width };
	}

	function fitTransitions(training) {
		const grid = sanitizeTrainingGrid(training);
		const states = grid.stateCount;
		const model = {
			global: Array(states).fill(0),
			h1: table(states, states),
			h2: table(states * states, states),
			quad: table(states ** 4, states),
			sampleCount: grid.cells.length,
			stateCount: states,
			training: grid,
			v1: table(states, states),
			v2: table(states * states, states),
		};
		for (let row = 0; row < grid.height; row += 1) {
			for (let column = 0; column < grid.width; column += 1) {
				const index = row * grid.width + column;
				const next = grid.cells[index];
				model.global[next] += 1;
				if (column >= 1) model.h1[grid.cells[index - 1]][next] += 1;
				if (column >= 2) model.h2[context2(grid.cells[index - 2], grid.cells[index - 1], states)][next] += 1;
				if (row >= 1) model.v1[grid.cells[index - grid.width]][next] += 1;
				if (row >= 2) model.v2[context2(grid.cells[index - grid.width * 2], grid.cells[index - grid.width], states)][next] += 1;
				if (row >= 2 && column >= 2) {
					const key = context4(grid.cells[index - 2], grid.cells[index - 1], grid.cells[index - grid.width * 2], grid.cells[index - grid.width], states);
					model.quad[key][next] += 1;
				}
			}
		}
		return model;
	}

	function normalizedCounts(counts, smoothing) {
		const alpha = Math.max(0.000001, Number(smoothing) || 0.000001);
		const total = counts.reduce((sum, value) => sum + value, 0) + alpha * counts.length;
		return counts.map((value) => (value + alpha) / total);
	}

	function smoothedRow(counts, prior, smoothing) {
		const total = counts.reduce((sum, value) => sum + value, 0);
		if (!total) return { probabilities: [...prior], seen: false };
		const alpha = Math.max(0.000001, Number(smoothing) || 0.000001);
		return { probabilities: counts.map((value, index) => (value + alpha * prior[index]) / (total + alpha)), seen: true };
	}

	function combineAxes(horizontal, vertical, horizontalWeight, verticalWeight, prior) {
		if (!horizontal && !vertical) return [...prior];
		if (!horizontal) return [...vertical];
		if (!vertical) return [...horizontal];
		let h = Math.max(0, Number(horizontalWeight) || 0);
		let v = Math.max(0, Number(verticalWeight) || 0);
		if (h + v <= 0) [h, v] = [0.5, 0.5];
		const total = h + v;
		return horizontal.map((value, index) => (value * h + vertical[index] * v) / total);
	}

	function temperatureScale(probabilities, temperature) {
		const exponent = 1 / Math.max(0.05, Number(temperature) || 1);
		const scaled = probabilities.map((value) => Math.max(1e-12, value) ** exponent);
		const total = scaled.reduce((sum, value) => sum + value, 0);
		return scaled.map((value) => value / total);
	}

	function resolveDistribution(model, neighbors, configuration) {
		const states = model.stateCount;
		const prior = normalizedCounts(model.global, configuration.smoothing);
		let horizontal = null;
		let vertical = null;
		let axisLevel = "global";
		if (configuration.contextOrder === "two" && neighbors.left2 >= 0 && neighbors.left >= 0) {
			const row = smoothedRow(model.h2[context2(neighbors.left2, neighbors.left, states)], prior, configuration.smoothing);
			if (row.seen) { horizontal = row.probabilities; axisLevel = "axis-two"; }
		}
		if (!horizontal && neighbors.left >= 0) {
			const row = smoothedRow(model.h1[neighbors.left], prior, configuration.smoothing);
			if (row.seen) { horizontal = row.probabilities; axisLevel = "axis-one"; }
		}
		if (configuration.contextOrder === "two" && neighbors.above2 >= 0 && neighbors.above >= 0) {
			const row = smoothedRow(model.v2[context2(neighbors.above2, neighbors.above, states)], prior, configuration.smoothing);
			if (row.seen) { vertical = row.probabilities; axisLevel = axisLevel === "axis-two" ? "axis-two" : "axis-two"; }
		}
		if (!vertical && neighbors.above >= 0) {
			const row = smoothedRow(model.v1[neighbors.above], prior, configuration.smoothing);
			if (row.seen) { vertical = row.probabilities; if (axisLevel === "global") axisLevel = "axis-one"; }
		}
		const axes = combineAxes(horizontal, vertical, configuration.horizontalInfluence, configuration.verticalInfluence, prior);
		let probabilities = axes;
		let fallbackLevel = horizontal || vertical ? axisLevel : "global";
		if (configuration.contextOrder === "two" && neighbors.left2 >= 0 && neighbors.left >= 0 && neighbors.above2 >= 0 && neighbors.above >= 0) {
			const key = context4(neighbors.left2, neighbors.left, neighbors.above2, neighbors.above, states);
			const row = smoothedRow(model.quad[key], axes, configuration.smoothing);
			if (row.seen) { probabilities = row.probabilities; fallbackLevel = "quad"; }
		}
		return { fallbackLevel, probabilities: temperatureScale(probabilities, configuration.temperature) };
	}

	function generationOrder(rows, columns, scanOrder) {
		const order = [];
		if (scanOrder === "column-major") {
			for (let column = 0; column < columns; column += 1) for (let row = 0; row < rows; row += 1) order.push(row * columns + column);
		} else {
			for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) order.push(row * columns + column);
		}
		return order;
	}

	function sampleCategorical(random, probabilities) {
		let cursor = random();
		for (let state = 0; state < probabilities.length; state += 1) {
			cursor -= probabilities[state];
			if (cursor <= 0) return state;
		}
		return probabilities.length - 1;
	}

	function generateMosaic(model, configuration) {
		const config = { ...DEFAULTS, ...configuration };
		const rows = Math.max(1, Math.round(config.rows));
		const columns = Math.max(1, Math.round(config.columns));
		const order = generationOrder(rows, columns, config.scanOrder);
		const cells = Array(rows * columns).fill(-1);
		const fallbackCounts = { "axis-one": 0, "axis-two": 0, global: 0, quad: 0 };
		const random = mulberry32(config.seed);
		let drawCount = 0;
		for (const index of order) {
			const row = Math.floor(index / columns);
			const column = index % columns;
			const at = (r, c) => r >= 0 && c >= 0 && r < rows && c < columns && cells[r * columns + c] >= 0 ? cells[r * columns + c] : -1;
			const resolved = resolveDistribution(model, { above: at(row - 1, column), above2: at(row - 2, column), left: at(row, column - 1), left2: at(row, column - 2) }, config);
			cells[index] = sampleCategorical(random, resolved.probabilities);
			drawCount += 1;
			fallbackCounts[resolved.fallbackLevel] += 1;
		}
		return { cells, columns, drawCount, fallbackCounts, modelHash: geometryHash(model), order, rows };
	}

	function visibleCells(result, progress) {
		const count = Math.floor(Math.max(0, Math.min(1, Number(progress) || 0)) * result.order.length + 1e-9);
		const cells = Array(result.cells.length).fill(null);
		for (let index = 0; index < count; index += 1) cells[result.order[index]] = result.cells[result.order[index]];
		return cells;
	}

	function buildTransformMasks(grid, rounding) {
		const amount = Math.max(0, Math.min(1, Number(rounding) || 0));
		return grid.cells.map((state, index) => {
			const row = Math.floor(index / grid.columns); const column = index % grid.columns;
			const same = (r, c) => r >= 0 && c >= 0 && r < grid.rows && c < grid.columns && grid.cells[r * grid.columns + c] === state;
			return { column, joins: { bottom: same(row + 1, column), left: same(row, column - 1), right: same(row, column + 1), top: same(row - 1, column) }, rounding: amount, row, state };
		});
	}

	function stableStringify(value) {
		if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
		if (value && typeof value === "object") return `{${Object.keys(value).filter((key) => key !== "training").sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
		return JSON.stringify(value);
	}

	function geometryHash(value) {
		const source = stableStringify(value); let hash = 2166136261;
		for (let index = 0; index < source.length; index += 1) { hash ^= source.charCodeAt(index); hash = Math.imul(hash, 16777619); }
		return (hash >>> 0).toString(16).padStart(8, "0");
	}

	function palette(name) {
		if (name === "supermega") return { ground: "#09090b", states: ["#f61515", "#f1eadf", "#5d1fef", "#ff8a00", "#0d6b53"] };
		if (name === "cool") return { ground: "#e8e8e2", states: ["#13242b", "#2e6d78", "#80a5a1", "#d8b45a", "#963f3d"] };
		return { ground: "#ded9cc", states: ["#1b1a18", "#ba3d2f", "#d2a839", "#426c78", "#ebe6d8"] };
	}

	function contentRectangle(width, height, insets) {
		const clamp = (value, maximum) => Math.max(0, Math.min(maximum, Number(value) || 0)); const left = clamp(insets?.left, width * 0.45); const right = clamp(insets?.right, width * 0.45); const top = clamp(insets?.top, height * 0.45); const bottom = clamp(insets?.bottom, height * 0.45);
		return { height: Math.max(1, height - top - bottom), width: Math.max(1, width - left - right), x: left, y: top };
	}

	function layoutPanels(width, height, insets) {
		const content = contentRectangle(width, height, insets); const margin = Math.max(6, Math.min(content.width, content.height) * 0.055); const gap = Math.max(4, margin * 0.5); const compact = content.width < 620 || content.width < content.height * 1.4; const labelScale = Math.max(1, Math.min(2, Math.round(content.width / 800))); const labelHeight = labelScale * 7; const panels = [];
		if (compact) {
			const innerX = content.x + margin; const innerY = content.y + margin; const innerWidth = Math.max(1, content.width - margin * 2); const innerHeight = Math.max(1, content.height - margin * 2); const rowHeight = Math.max(1, (innerHeight - gap) / 2); const labelBand = Math.max(labelHeight + 4, Math.min(18, rowHeight * 0.24)); const lowerY = innerY + rowHeight + gap; const halfWidth = Math.max(1, (innerWidth - gap) / 2);
			panels.push({ label: "TRAINING", labelX: innerX, labelY: innerY, rectangle: { height: Math.max(1, rowHeight - labelBand), width: innerWidth, x: innerX, y: innerY + labelBand } });
			panels.push({ label: "GENERATED", labelX: innerX, labelY: lowerY, rectangle: { height: Math.max(1, rowHeight - labelBand), width: halfWidth, x: innerX, y: lowerY + labelBand } });
			panels.push({ label: "TRANSFORMED", labelX: innerX + halfWidth + gap, labelY: lowerY, rectangle: { height: Math.max(1, rowHeight - labelBand), width: halfWidth, x: innerX + halfWidth + gap, y: lowerY + labelBand } });
			return { compact: true, content, labelScale, panels };
		}
		const panelWidth = Math.max(1, (content.width - margin * 2 - gap * 2) / 3); const panel = { height: Math.max(1, content.height - margin * 2.5), width: panelWidth, y: content.y + margin * 1.5 };
		for (let index = 0; index < 3; index += 1) { const x = content.x + margin + index * (panelWidth + gap); panels.push({ label: ["TRAINING", "GENERATED", "TRANSFORMED"][index], labelX: x, labelY: content.y + margin * 0.68, rectangle: { ...panel, x } }); }
		return { compact: false, content, labelScale, panels };
	}

	function roundedTile(ctx, x, y, width, height, radius, joins) {
		const left = Math.round(x); const top = Math.round(y); const tileWidth = Math.max(1, Math.round(width)); const tileHeight = Math.max(1, Math.round(height)); const maximumRadius = Math.floor(Math.min(tileWidth, tileHeight) / 2); const roundedRadius = Math.max(0, Math.min(maximumRadius, Math.round(radius)));
		const cornerRadius = {
			bottomLeft: joins?.bottom || joins?.left ? 0 : roundedRadius,
			bottomRight: joins?.bottom || joins?.right ? 0 : roundedRadius,
			topLeft: joins?.top || joins?.left ? 0 : roundedRadius,
			topRight: joins?.top || joins?.right ? 0 : roundedRadius,
		};
		const inset = (row, value, fromTop) => {
			if (!value) return 0;
			const offset = fromTop ? value - row - 0.5 : row - (tileHeight - value) + 0.5;
			return Math.max(0, Math.ceil(value - Math.sqrt(Math.max(0, value * value - offset * offset))));
		};
		ctx.beginPath();
		for (let row = 0; row < tileHeight; row += 1) {
			const isTop = row < roundedRadius; const isBottom = row >= tileHeight - roundedRadius; const leftRadius = isTop ? cornerRadius.topLeft : isBottom ? cornerRadius.bottomLeft : 0; const rightRadius = isTop ? cornerRadius.topRight : isBottom ? cornerRadius.bottomRight : 0; const leftInset = inset(row, leftRadius, isTop); const rightInset = inset(row, rightRadius, isTop);
			ctx.rect(left + leftInset, top + row, Math.max(1, tileWidth - leftInset - rightInset), 1);
		}
	}

	function gridMetrics(grid, rectangle, transformed) {
		const gap = transformed ? 0 : Math.max(1, Math.round(Math.min(rectangle.width / grid.columns, rectangle.height / grid.rows) * 0.06));
		const cell = Math.max(1, Math.floor(Math.min((rectangle.width - gap * (grid.columns - 1)) / grid.columns, (rectangle.height - gap * (grid.rows - 1)) / grid.rows))); const width = cell * grid.columns + gap * (grid.columns - 1); const height = cell * grid.rows + gap * (grid.rows - 1);
		return { cell, gap, height, ox: Math.round(rectangle.x + (rectangle.width - width) / 2), oy: Math.round(rectangle.y + (rectangle.height - height) / 2), width };
	}

	function drawGrid(ctx, grid, cells, configuration, rectangle, transformed) {
		const colors = palette(configuration.palette);
		const metrics = gridMetrics(grid, rectangle, transformed); const cell = metrics.cell; const gap = metrics.gap; const ox = metrics.ox; const oy = metrics.oy;
		const masks = transformed ? buildTransformMasks({ cells: grid.cells, columns: grid.columns, rows: grid.rows }, configuration.rounding) : null;
		for (let index = 0; index < cells.length; index += 1) {
			if (cells[index] === null || cells[index] < 0) continue;
			const row = Math.floor(index / grid.columns); const column = index % grid.columns;
			const x = ox + column * (cell + gap); const y = oy + row * (cell + gap);
			ctx.fillStyle = colors.states[cells[index] % colors.states.length];
			if (transformed) { const mask = masks[index]; roundedTile(ctx, x, y, cell, cell, cell * 0.42 * configuration.rounding, mask.joins); ctx.fill(); }
			else ctx.fillRect(x, y, cell, cell);
		}
	}

	const LABEL_GLYPHS = Object.freeze({
		" ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
		A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
		D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
		E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
		F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
		G: ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
		I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
		L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
		M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
		N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
		O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
		R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
		S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
		T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
	});

	function drawLabel(ctx, text, x, y, color, scale) {
		ctx.fillStyle = color; let cursor = Math.round(x); const originY = Math.round(y);
		for (const character of text) {
			const glyph = LABEL_GLYPHS[character] || LABEL_GLYPHS[" "];
			for (let row = 0; row < glyph.length; row += 1) for (let column = 0; column < 5; column += 1) if (glyph[row][column] === "1") ctx.fillRect(cursor + column * scale, originY + row * scale, scale, scale);
			cursor += scale * 6;
		}
	}

	function paint(ctx, result, training, configuration, options) {
		const width = options.width; const height = options.height; const progress = options.progress ?? 1; const colors = palette(configuration.palette);
		ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.filter = "none"; ctx.shadowColor = "transparent"; ctx.beginPath(); ctx.clearRect(0, 0, width, height); ctx.fillStyle = colors.ground; ctx.fillRect(0, 0, width, height);
		const visible = visibleCells(result, progress); const content = contentRectangle(width, height, options.insets);
		if (configuration.viewMode === "linked") {
			const layout = layoutPanels(width, height, options.insets);
			const panels = [
				{ cells: training.cells, grid: { cells: training.cells, columns: training.width, rows: training.height }, label: "TRAINING", transformed: false },
				{ cells: visible, grid: result, label: "GENERATED", transformed: false },
				{ cells: visible, grid: result, label: "TRANSFORMED", transformed: true },
			];
			for (let index = 0; index < panels.length; index += 1) { const placement = layout.panels[index]; drawLabel(ctx, panels[index].label, placement.labelX, placement.labelY, configuration.palette === "supermega" ? "#f1eadf" : "#1b1a18", layout.labelScale); drawGrid(ctx, panels[index].grid, panels[index].cells, configuration, placement.rectangle, panels[index].transformed); }
		} else { const margin = Math.max(6, Math.min(content.width, content.height) * 0.055); drawGrid(ctx, result, visible, configuration, { height: Math.max(1, content.height - margin * 2), width: Math.max(1, content.width - margin * 2), x: content.x + margin, y: content.y + margin }, configuration.viewMode === "transformed"); }
		return { fallbackCounts: result.fallbackCounts, hash: geometryHash(result.cells), progress, visible: visible.filter((value) => value !== null).length };
	}

	global.CGA76_KAWANO_CORE = Object.freeze({ DEFAULTS, buildTransformMasks, contentRectangle, fitTransitions, generateMosaic, generationOrder, geometryHash, gridMetrics, layoutPanels, paint, resolveDistribution, sampleCategorical, sanitizeTrainingGrid, visibleCells });
})(typeof window === "undefined" ? globalThis : window);
