(function randomSquaresCore(global) {
	"use strict";

	const LAYER_COUNT = 3;
	const MAX_LAYER_SLOTS = 192;
	const DRAWS_PER_SLOT = 3;
	const DEFAULTS = Object.freeze({
		drawOrder: "period",
		layer1Concentration: 0.18, layer1Count: 52, layer1MaxSize: 190, layer1MinSize: 30, layer1SizeStep: 20, layer1Stroke: 2, layer1Visible: true,
		layer2Concentration: 0.36, layer2Count: 44, layer2MaxSize: 150, layer2MinSize: 20, layer2SizeStep: 20, layer2Stroke: 2, layer2Visible: true,
		layer3Concentration: 0.58, layer3Count: 36, layer3MaxSize: 110, layer3MinSize: 20, layer3SizeStep: 15, layer3Stroke: 2.5, layer3Visible: true,
		margin: 0.06, palette: "period", seed: 1967,
	});

	function mulberry32(seed) {
		let state = seed >>> 0;
		return function random() { state = (state + 0x6D2B79F5) >>> 0; let value = state; value = Math.imul(value ^ (value >>> 15), value | 1); value ^= value + Math.imul(value ^ (value >>> 7), value | 61); return ((value ^ (value >>> 14)) >>> 0) / 4294967296; };
	}

	function randomTape(seed) {
		const random = mulberry32(seed); return Array.from({ length: LAYER_COUNT * MAX_LAYER_SLOTS * DRAWS_PER_SLOT }, () => random());
	}

	function discreteSizes(minimum, maximum, step) {
		const min = Number(minimum); const max = Math.max(min, Number(maximum)); const stride = Math.max(1, Number(step)); const values = [];
		for (let value = min; value <= max + 1e-9; value += stride) values.push(Number(value.toFixed(6)));
		if (values.at(-1) !== max && max > min) values.push(max);
		return values;
	}

	function concentrationMap(value, concentration) {
		const centered = value * 2 - 1; const exponent = 1 + Math.max(0, Math.min(1, concentration)) * 3; return 0.5 + Math.sign(centered) * (Math.abs(centered) ** exponent) * 0.5;
	}

	function layerConfiguration(configuration, index) {
		const prefix = `layer${index + 1}`;
		return { concentration: configuration[`${prefix}Concentration`], count: configuration[`${prefix}Count`], maximumSize: configuration[`${prefix}MaxSize`], minimumSize: configuration[`${prefix}MinSize`], sizeStep: configuration[`${prefix}SizeStep`], stroke: configuration[`${prefix}Stroke`], visible: configuration[`${prefix}Visible`] };
	}

	function generateLayers(configuration) {
		const config = { ...DEFAULTS, ...configuration }; const tape = randomTape(config.seed); const layers = [];
		for (let layer = 0; layer < LAYER_COUNT; layer += 1) {
			const settings = layerConfiguration(config, layer); const sizes = discreteSizes(settings.minimumSize, settings.maximumSize, settings.sizeStep); const squares = [];
			for (let slot = 0; slot < MAX_LAYER_SLOTS; slot += 1) {
				const offset = (layer * MAX_LAYER_SLOTS + slot) * DRAWS_PER_SLOT; const size = sizes[Math.min(sizes.length - 1, Math.floor(tape[offset] * sizes.length))]; const normalizedSize = size / 1000; const span = Math.max(0, 1 - config.margin * 2 - normalizedSize); const x = config.margin + concentrationMap(tape[offset + 1], settings.concentration) * span; const y = config.margin + concentrationMap(tape[offset + 2], settings.concentration) * span;
				if (slot < settings.count) squares.push({ filled: false, height: size, layer, radius: 0, size, slot, stroke: settings.stroke, width: size, x, y });
			}
			layers.push({ ...settings, index: layer, squares });
		}
		return { drawCount: tape.length, layers };
	}

	function orderedSquares(field, configuration) {
		const visible = field.layers.map((layer) => layer.visible ? layer.squares : []);
		if (configuration.drawOrder === "reverse") return [...visible[2], ...visible[1], ...visible[0]];
		if (configuration.drawOrder === "interleaved") { const output = []; const maximum = Math.max(...visible.map((layer) => layer.length)); for (let slot = 0; slot < maximum; slot += 1) for (let layer = 0; layer < visible.length; layer += 1) if (visible[layer][slot]) output.push(visible[layer][slot]); return output; }
		return [...visible[0], ...visible[1], ...visible[2]];
	}

	function visibleSquares(squares, progress) { return squares.slice(0, Math.floor(Math.max(0, Math.min(1, Number(progress) || 0)) * squares.length + 1e-9)); }

	function rectanglesOverlap(a, b) {
		const as = a.size / 1000; const bs = b.size / 1000; return a.x < b.x + bs && a.x + as > b.x && a.y < b.y + bs && a.y + as > b.y;
	}

	function stableStringify(value) { if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`; if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`; return JSON.stringify(value); }
	function geometryHash(value) { const source = stableStringify(value); let hash = 2166136261; for (let index = 0; index < source.length; index += 1) { hash ^= source.charCodeAt(index); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(16).padStart(8, "0"); }

	function colors(palette) {
		if (palette === "mono") return { ground: "#eee9df", layerNames: ["ink", "ink", "ink"], layers: ["#171719", "#171719", "#171719"] };
		if (palette === "supermega") return { ground: "#09090b", layerNames: ["signal red", "paper", "violet"], layers: ["#f61515", "#f1eadf", "#6c36ff"] };
		return { ground: "#eee9df", layerNames: ["red", "blue", "black"], layers: ["#d6342f", "#2c5e91", "#171719"] };
	}

	function contentRectangle(width, height, insets) {
		const clamp = (value, maximum) => Math.max(0, Math.min(maximum, Number(value) || 0)); const left = clamp(insets?.left, width * 0.45); const right = clamp(insets?.right, width * 0.45); const top = clamp(insets?.top, height * 0.45); const bottom = clamp(insets?.bottom, height * 0.45);
		return { height: Math.max(1, height - top - bottom), width: Math.max(1, width - left - right), x: left, y: top };
	}

	function paint(ctx, field, configuration, options) {
		const width = options.width; const height = options.height; const progress = options.progress ?? 1; const palette = colors(configuration.palette); const ordered = orderedSquares(field, configuration); const visible = visibleSquares(ordered, progress); const content = contentRectangle(width, height, options.insets); const scale = Math.min(content.width, content.height) / 1000;
		ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.filter = "none"; ctx.shadowColor = "transparent"; ctx.beginPath(); ctx.clearRect(0, 0, width, height); ctx.fillStyle = palette.ground; ctx.fillRect(0, 0, width, height);
		for (const square of visible) {
			const size = Math.max(1, Math.round(square.size * scale)); const x = Math.round(content.x + square.x * content.width); const y = Math.round(content.y + square.y * content.height); const stroke = Math.max(1, Math.min(Math.floor(size / 2), Math.round(square.stroke * Math.max(1, content.width / 1600))));
			ctx.fillStyle = palette.layers[square.layer]; ctx.fillRect(x, y, size, stroke); ctx.fillRect(x, y + size - stroke, size, stroke); ctx.fillRect(x, y + stroke, stroke, Math.max(0, size - stroke * 2)); ctx.fillRect(x + size - stroke, y + stroke, stroke, Math.max(0, size - stroke * 2));
		}
		return { drawCount: field.drawCount, hash: geometryHash(ordered), progress, total: ordered.length, visible: visible.length };
	}

	global.CGA76_RANDOM_SQUARES_CORE = Object.freeze({ DEFAULTS, DRAWS_PER_SLOT, LAYER_COUNT, MAX_LAYER_SLOTS, colors, contentRectangle, discreteSizes, generateLayers, geometryHash, orderedSquares, paint, randomTape, rectanglesOverlap, visibleSquares });
})(typeof window === "undefined" ? globalThis : window);
