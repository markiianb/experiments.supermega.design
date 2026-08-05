(function barbadilloModulesCore(global) {
	"use strict";

	const MODULES = Object.freeze([
		Object.freeze({ boundary: Object.freeze([0, 1, 0, 1]), geometry: Object.freeze({ kind: "straight-band" }), name: "Span" }),
		Object.freeze({ boundary: Object.freeze([1, 1, 0, 0]), geometry: Object.freeze({ kind: "quarter-transition" }), name: "Turn" }),
		Object.freeze({ boundary: Object.freeze([1, 0, 1, 0]), geometry: Object.freeze({ kind: "voided-stem" }), name: "Stem" }),
		Object.freeze({ boundary: Object.freeze([1, 1, 1, 0]), geometry: Object.freeze({ kind: "rounded-branch" }), name: "Branch" }),
	]);
	const DEFAULTS = Object.freeze({
		candidateCount: 6, columns: 8, continuityWeight: 0.82, curveRadius: 0.68, innerVoid: 0.22,
		macroModuleBias: 0.32, outputMode: "asterisk-study", polarityRatio: 0.5, repertoireSize: 4,
		rotations: "quarter-turns", rows: 6, seed: 1973, symmetry: "none",
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

	function mixSeed(seed, index) {
		let value = (seed ^ Math.imul(index + 1, 0x9E3779B1)) >>> 0;
		value ^= value >>> 16;
		value = Math.imul(value, 0x7FEB352D) >>> 0;
		value ^= value >>> 15;
		return value >>> 0;
	}

	function rotateSignature(signature, quarterTurns) {
		let rotated = [...signature];
		for (let turn = 0; turn < ((quarterTurns % 4) + 4) % 4; turn += 1) rotated = [rotated[3], rotated[0], rotated[1], rotated[2]];
		return rotated;
	}

	function reflectSignature(signature, axis) {
		if (axis === "horizontal") return [signature[0], signature[3], signature[2], signature[1]];
		if (axis === "vertical") return [signature[2], signature[1], signature[0], signature[3]];
		return [...signature];
	}

	function moduleVariant(baseModule, rotation, inverted, configuration) {
		const module = MODULES[baseModule] || MODULES[0];
		const foreground = inverted ? "#f2eee4" : "#111113";
		const background = inverted ? "#111113" : "#f2eee4";
		return {
			background,
			baseModule: MODULES.indexOf(module),
			boundary: rotateSignature(module.boundary, rotation),
			foreground,
			geometry: { ...module.geometry, curveRadius: configuration.curveRadius, innerVoid: configuration.innerVoid },
			inverted: Boolean(inverted),
			name: module.name,
			reflectX: false,
			reflectY: false,
			rotation: ((rotation % 4) + 4) % 4,
		};
	}

	function mirroredVariant(source, symmetry, configuration) {
		if (symmetry === "rotational") return moduleVariant(source.baseModule, source.rotation + 2, source.inverted, configuration);
		const variant = moduleVariant(source.baseModule, source.rotation, source.inverted, configuration);
		if (symmetry === "horizontal") {
			variant.boundary = reflectSignature(source.boundary, "horizontal");
			variant.reflectX = true;
		}
		if (symmetry === "vertical") {
			variant.boundary = reflectSignature(source.boundary, "vertical");
			variant.reflectY = true;
		}
		return variant;
	}

	function scoreCandidate(candidate, configuration) {
		let continuations = 0;
		let broken = 0;
		let macro = 0;
		for (let row = 0; row < candidate.rows; row += 1) {
			for (let column = 0; column < candidate.columns; column += 1) {
				const cell = candidate.cells[row * candidate.columns + column];
				if (column + 1 < candidate.columns) {
					const right = candidate.cells[row * candidate.columns + column + 1];
					if (cell.boundary[1] && right.boundary[3]) continuations += 1;
					else if (cell.boundary[1] !== right.boundary[3]) broken += 1;
					if (cell.baseModule === right.baseModule && cell.rotation === right.rotation) macro += 1;
				}
				if (row + 1 < candidate.rows) {
					const below = candidate.cells[(row + 1) * candidate.columns + column];
					if (cell.boundary[2] && below.boundary[0]) continuations += 1;
					else if (cell.boundary[2] !== below.boundary[0]) broken += 1;
					if (cell.baseModule === below.baseModule && cell.rotation === below.rotation) macro += 1;
				}
			}
		}
		const total = continuations * (1 + configuration.continuityWeight * 3) - broken * configuration.continuityWeight + macro * configuration.macroModuleBias;
		return { broken, continuity: continuations, macro, total: Number(total.toFixed(4)) };
	}

	function rotationOptions(mode) {
		if (mode === "none") return [0];
		if (mode === "half-turns") return [0, 2];
		return [0, 1, 2, 3];
	}

	function reflectedIndex(index, rows, columns, symmetry) {
		const row = Math.floor(index / columns);
		const column = index % columns;
		if (symmetry === "horizontal" && column >= Math.ceil(columns / 2)) return row * columns + (columns - 1 - column);
		if (symmetry === "vertical" && row >= Math.ceil(rows / 2)) return (rows - 1 - row) * columns + column;
		if (symmetry === "rotational" && index >= Math.ceil(rows * columns / 2)) return (rows - 1 - row) * columns + (columns - 1 - column);
		return -1;
	}

	function generateCandidate(configuration, candidateIndex) {
		const random = mulberry32(mixSeed(configuration.seed, candidateIndex));
		const cells = [];
		const turns = rotationOptions(configuration.rotations);
		for (let index = 0; index < configuration.rows * configuration.columns; index += 1) {
			const reflected = reflectedIndex(index, configuration.rows, configuration.columns, configuration.symmetry);
			if (reflected >= 0 && cells[reflected]) {
				const source = cells[reflected];
				cells.push(mirroredVariant(source, configuration.symmetry, configuration));
				continue;
			}
			const row = Math.floor(index / configuration.columns);
			const column = index % configuration.columns;
			let best = null;
			for (let baseModule = 0; baseModule < configuration.repertoireSize; baseModule += 1) {
				for (const rotation of turns) {
					const inverted = random() < configuration.polarityRatio;
					const variant = moduleVariant(baseModule, rotation, inverted, configuration);
					let local = random() * 0.65;
					const left = column ? cells[index - 1] : null;
					const above = row ? cells[index - configuration.columns] : null;
					if (left) {
						if (left.boundary[1] && variant.boundary[3]) local += configuration.continuityWeight * 4;
						else if (left.boundary[1] !== variant.boundary[3]) local -= configuration.continuityWeight * 1.2;
						if (left.baseModule === baseModule && left.rotation === rotation) local += configuration.macroModuleBias * 2;
					}
					if (above) {
						if (above.boundary[2] && variant.boundary[0]) local += configuration.continuityWeight * 4;
						else if (above.boundary[2] !== variant.boundary[0]) local -= configuration.continuityWeight * 1.2;
						if (above.baseModule === baseModule && above.rotation === rotation) local += configuration.macroModuleBias * 2;
					}
					if (!best || local > best.local) best = { local, variant };
				}
			}
			cells.push(best.variant);
		}
		const candidate = { cells, columns: configuration.columns, index: candidateIndex, rows: configuration.rows };
		candidate.score = scoreCandidate(candidate, configuration);
		return candidate;
	}

	function generateCandidates(configuration) {
		const config = { ...DEFAULTS, ...configuration };
		return Array.from({ length: config.candidateCount }, (_, index) => generateCandidate(config, index));
	}

	function rotateRaster(raster, turns) {
		let output = raster.map((row) => [...row]);
		for (let turn = 0; turn < turns; turn += 1) output = output[0].map((_, column) => output.map((row) => row[column]).reverse());
		return output;
	}

	function moduleRaster(cell) {
		const rasters = [
			[".....", ".....", "*****", ".....", "....."],
			["..***", "..*..", "..*..", ".....", "....."],
			["..*..", "..*..", "..*..", "..*..", "..*.."],
			["..*..", "..*..", "*****", "..*..", "..*.."],
		];
		let raster = rotateRaster(rasters[cell.baseModule].map((row) => [...row]), cell.rotation);
		if (cell.reflectX) raster = raster.map((row) => [...row].reverse());
		if (cell.reflectY) raster = [...raster].reverse();
		if (cell.inverted) raster = raster.map((row) => row.map((value) => value === "*" ? " " : "*"));
		return raster;
	}

	function asteriskGrid(candidate) {
		const lines = Array.from({ length: candidate.rows * 5 }, () => "");
		for (let row = 0; row < candidate.rows; row += 1) {
			for (let column = 0; column < candidate.columns; column += 1) {
				const raster = moduleRaster(candidate.cells[row * candidate.columns + column]);
				for (let line = 0; line < 5; line += 1) lines[row * 5 + line] += raster[line].join("");
			}
		}
		return lines.join("\n");
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

	function wallColumnCount(width, candidateCount) {
		if (width < 600) return Math.max(1, Math.min(2, candidateCount));
		return Math.max(1, Math.ceil(Math.sqrt(candidateCount * 1.5)));
	}

	function contentRectangle(width, height, insets) {
		const bounded = (value, maximum) => Math.max(0, Math.min(maximum, Number(value) || 0));
		const left = bounded(insets?.left, width * 0.45);
		const right = bounded(insets?.right, width * 0.45);
		const top = bounded(insets?.top, height * 0.45);
		const bottom = bounded(insets?.bottom, height * 0.45);
		return {
			bottom: height - bottom,
			height: Math.max(1, height - top - bottom),
			left,
			right: width - right,
			top,
			width: Math.max(1, width - left - right),
		};
	}

	function layoutWall(width, height, candidateCount, insets) {
		const content = contentRectangle(width, height, insets);
		const columns = wallColumnCount(content.width, candidateCount);
		const rows = Math.ceil(candidateCount / columns);
		const minimum = Math.min(content.width, content.height);
		const marginX = Math.min(Math.max(18, minimum * 0.035), Math.max(1, content.width / (columns + 1) / 2));
		const marginY = Math.min(Math.max(24, minimum * 0.08), Math.max(1, content.height / (rows + 1) / 2));
		const cardWidth = Math.max(1, (content.width - marginX * (columns + 1)) / columns);
		const cardHeight = Math.max(1, (content.height - marginY * (rows + 1)) / rows);
		const cards = Array.from({ length: candidateCount }, (_, index) => {
			const left = content.left + marginX + (index % columns) * (cardWidth + marginX);
			const top = content.top + marginY + Math.floor(index / columns) * (cardHeight + marginY);
			return { bottom: top + cardHeight, height: cardHeight, index, left, right: left + cardWidth, top, width: cardWidth };
		});
		return { cardHeight, cards, cardWidth, columns, content, marginX, marginY, rows };
	}

	function drawModule(ctx, cell, x, y, size, configuration, supermega) {
		const positive = supermega ? "#f61515" : cell.foreground;
		const negative = supermega ? (cell.inverted ? "#f2eee4" : "#101012") : cell.background;
		ctx.fillStyle = negative;
		ctx.fillRect(x, y, size, size);
		ctx.save();
		ctx.translate(x + size / 2, y + size / 2);
		ctx.scale(cell.reflectX ? -1 : 1, cell.reflectY ? -1 : 1);
		ctx.rotate(cell.rotation * Math.PI / 2);
		ctx.translate(-size / 2, -size / 2);
		ctx.fillStyle = positive;
		const band = size * (0.18 + configuration.curveRadius * 0.18);
		if (cell.baseModule === 0) ctx.fillRect(0, size / 2 - band / 2, size, band);
		if (cell.baseModule === 1) {
			ctx.beginPath();
			ctx.arc(size, 0, size * 0.7, Math.PI / 2, Math.PI);
			ctx.lineWidth = band;
			ctx.strokeStyle = positive;
			ctx.stroke();
		}
		if (cell.baseModule === 2) {
			ctx.fillRect(size / 2 - band / 2, 0, band, size);
			ctx.beginPath(); ctx.arc(size / 2, size / 2, size * configuration.innerVoid, 0, Math.PI * 2); ctx.fillStyle = negative; ctx.fill();
		}
		if (cell.baseModule === 3) {
			ctx.fillRect(size / 2 - band / 2, 0, band, size);
			ctx.fillRect(size / 2, size / 2 - band / 2, size / 2, band);
			ctx.beginPath(); ctx.arc(size / 2, size / 2, size * configuration.innerVoid * 0.72, 0, Math.PI * 2); ctx.fillStyle = negative; ctx.fill();
		}
		ctx.restore();
	}

	function paint(ctx, candidates, configuration, options) {
		const width = options.width;
		const height = options.height;
		const supermega = options.supermega === true;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = supermega ? "#08080a" : "#e7e1d5";
		ctx.fillRect(0, 0, width, height);
		const layout = layoutWall(width, height, candidates.length, options.insets);
		for (let index = 0; index < candidates.length; index += 1) {
			const candidate = candidates[index];
			const card = layout.cards[index];
			const cardX = card.left;
			const cardY = card.top;
			const cardWidth = card.width;
			const cardHeight = card.height;
			ctx.fillStyle = supermega ? "#121216" : "#f4f0e7";
			ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
			const labelHeight = Math.min(24, cardHeight * 0.1);
			if (configuration.outputMode === "asterisk-study") {
				const lines = asteriskGrid(candidate).split("\n");
				const fontSize = Math.max(3, Math.min((cardWidth * 0.92) / (configuration.columns * 3.05), (cardHeight - labelHeight) / (configuration.rows * 5.2)));
				ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
				ctx.fillStyle = supermega ? "#f61515" : "#1a1918";
				ctx.textBaseline = "top";
				for (let line = 0; line < lines.length; line += 1) ctx.fillText(lines[line], cardX + cardWidth * 0.04, cardY + labelHeight + line * fontSize, cardWidth * 0.92);
			} else {
				const cellSize = Math.min(cardWidth * 0.9 / configuration.columns, (cardHeight - labelHeight) * 0.9 / configuration.rows);
				const originX = cardX + (cardWidth - cellSize * configuration.columns) / 2;
				const originY = cardY + labelHeight + ((cardHeight - labelHeight) - cellSize * configuration.rows) / 2;
				for (let row = 0; row < configuration.rows; row += 1) for (let column = 0; column < configuration.columns; column += 1) drawModule(ctx, candidate.cells[row * configuration.columns + column], originX + column * cellSize, originY + row * cellSize, cellSize + 0.25, configuration, supermega);
			}
			ctx.font = `${Math.max(8, labelHeight * 0.42)}px ui-monospace, monospace`;
			ctx.fillStyle = supermega ? "#f2eee4" : "#55514b";
			ctx.textBaseline = "middle";
			ctx.fillText(`C${String(index + 1).padStart(2, "0")} / ${candidate.score.total.toFixed(1)}`, cardX + 8, cardY + labelHeight / 2);
		}
		return { candidateCount: candidates.length, hash: geometryHash(candidates), layout, outputMode: configuration.outputMode };
	}

	global.CGA76_BARBADILLO_CORE = Object.freeze({ DEFAULTS, MODULES, asteriskGrid, contentRectangle, generateCandidates, geometryHash, layoutWall, mirroredVariant, moduleVariant, paint, reflectSignature, rotateSignature, scoreCandidate, wallColumnCount });
})(typeof window === "undefined" ? globalThis : window);
