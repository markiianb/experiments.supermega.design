(function tesseraInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const glyphs = ["column", "row", "flow", "solid", "square", "ring", "dot", "diamond", "checker", "cross", "slash", "empty"];
	const samples = ["orb", "letter", "waves", "dunes", "portal"];
	const aspects = ["source", "1:1", "4:5", "3:4", "2:3", "9:16", "5:4", "3:2", "16:9"];
	const motions = ["still", "reveal", "cycle", "drift"];
	const orders = ["sweep", "rows", "radial", "scatter"];
	const pointers = ["off", "light", "dark", "reveal"];
	const loops = [4, 6, 8, 12];

	// Base's own numbers, read off base.org (VideoShaderCanvas options on /trading,
	// 2026-09-24): vertical bars, blank spots, contrast 3.1, scale .66, gap .045 of
	// a cell, cap roundness .44, four line colours. Tier widths 1/8, 1/2, 3/4, 1
	// of a cell come back from minWeight .125 and curve .77.
	const base = {
		background: "#ffffff", colorMode: "palette", contrast: 3.1, curve: 0.77, gap: 0.045, glyph1: "empty", glyph2: "column", glyph3: "column", glyph4: "column", glyph5: "column",
		merge: true, minWeight: 0.125, palette: ["#ebba00", "#a7e66b", "#cd99fd", "#0000ff"], roundness: 0.44, scale: 0.66, tiers: 5, weighting: "ramp",
	};

	const presets = {
		base: { ...base, columns: 140 },
		// The yellow maze frame: one tone of bars, turned along the picture's edges.
		maze: { background: "#f7d358", colorMode: "palette", columns: 64, contrast: 1.6, gap: 0.2, glyph1: "flow", glyph2: "empty", merge: true, palette: ["#000000"], roundness: 0, scale: 0.66, tiers: 2, weighting: "flat" },
		// Blue bars on black: thin dark blue in the shadows, wide light blue in the light.
		signal: { background: "#000000", colorMode: "palette", columns: 44, contrast: 1.8, curve: 1, gap: 0.16, glyph1: "empty", glyph2: "column", glyph3: "column", merge: true, minWeight: 0.2, palette: ["#0000ff", "#6a9cff"], roundness: 0, scale: 0.8, tiers: 3, weighting: "ramp" },
		// The figure: checker for the body, white rungs for the light, orange staves.
		figure: { background: "#1b1d20", colorMode: "palette", columns: 72, contrast: 1.5, gap: 0.12, glyph1: "empty", glyph2: "checker", glyph3: "row", glyph4: "column", merge: true, palette: ["#c9b99a", "#f2f2f2", "#ea5a36"], roundness: 0, scale: 0.62, tiers: 4, weighting: "flat" },
		// The rooster: blue checker in the dark, light-blue diamonds, pale grey staves.
		rooster: { background: "#ffffff", colorMode: "palette", columns: 64, contrast: 1.4, gap: 0.05, glyph1: "checker", glyph2: "diamond", glyph3: "column", glyph4: "empty", merge: true, palette: ["#0000ff", "#5b8ff9", "#e4e5e7"], roundness: 0, scale: 0.9, tiers: 4, weighting: "flat" },
		// The Martens icon set, after John Provencher's own frames: rings, squares, dots.
		icons: { background: "#000000", colorMode: "palette", columns: 56, contrast: 1.3, glyph1: "empty", glyph2: "ring", glyph3: "square", glyph4: "dot", glyph5: "ring", glyph6: "square", merge: false, palette: ["#22a822", "#ff1fae", "#ff2a1a", "#e6c020", "#2436ff"], scale: 0.86, tiers: 6, weighting: "flat" },
		// Ours: red and paper on black.
		supermega: { background: "#050505", colorMode: "palette", columns: 90, contrast: 2.2, curve: 1, gap: 0.08, glyph1: "empty", glyph2: "dot", glyph3: "column", glyph4: "flow", merge: true, minWeight: 0.3, palette: ["#f61515", "#f61515", "#f3efe7"], roundness: 1, scale: 0.8, tiers: 4, weighting: "ramp" },
	};

	const defaults = {
		...presets.base,
		amount: 0.5,
		aspect: "4:5",
		brightness: 0,
		brush: 0.12,
		cellAspect: 1,
		fit: "cover",
		gamma: 1,
		glyph6: "column",
		invert: false,
		levels: "auto",
		loop: 8,
		motion: "still",
		order: "sweep",
		panX: 0,
		panY: 0,
		persist: 0.8,
		pointer: "off",
		pointerStrength: 0.6,
		sample: "orb",
		seed: 3,
		underlay: 0,
		zoom: 1,
	};

	const pct = { digits: 0, scale: 100 };
	const glyphField = (n, visibleWhen) => ({ type: "enum", kind: "select", label: `Tier ${n}`, section: "tiers", choices: glyphs, ...(n === 1 ? { hint: "The darkest tones. Tiers run dark to light." } : {}), ...(visibleWhen ? { visibleWhen } : {}) });
	const schema = {
		id: "supermega.instrument.configuration/tessera/v1",
		name: "Tessera",
		version: 1,
		// The engine fills its own ground, so Setup offers no background switch.
		canvas: { aspects: aspects.filter((a) => a !== "source"), background: null, budget: 60000, height: 2048, renderScale: 1, width: 1638 },
		timeline: { duration: 8, loop: true },
		sections: [
			{ id: "compose", open: true, title: "Compose" },
			{ id: "grid", open: true, title: "Grid" },
			{ id: "tiers", meta: { field: "tiers" }, open: true, title: "Tiers" },
			{ id: "marks", open: true, title: "Marks" },
			{ id: "colour", meta: { field: "colorMode" }, open: true, title: "Colour" },
			{ id: "tone", open: true, title: "Tone" },
			{ id: "place", open: false, title: "Placement" },
			{ id: "motion", meta: { field: "motion" }, open: false, title: "Motion" },
			{ id: "pointer", meta: { field: "pointer" }, open: false, title: "Pointer" },
			{ id: "frame", meta: { field: "aspect" }, open: false, title: "Frame" },
		],
		presets,
		actions: [
			{ capability: "randomize", hint: "Deal new glyphs, tiers and weights; your picture and colours stay", id: "tessera-randomise", key: "v", label: "Randomise", section: "compose" },
			{ capability: "reseed-renderer", field: "seed", hint: "Re-deal the scatter reveal; every authored value stays", id: "tessera-reseed", key: "r", label: "Reseed" },
		],
		fields: {
			sample: { type: "enum", label: "Sample", section: "compose", choices: samples, hint: "A built-in picture. Drop, paste or choose your own with Image in the top bar.", randomise: false },
			seed: { type: "number", kind: "seed", label: "Seed", section: "compose", minimum: 0, maximum: 9999, step: 1 },
			columns: { type: "number", label: "Columns", section: "grid", minimum: 12, maximum: 240, step: 1, workload: true, hint: "Cells across the frame. Base runs about 0.07 of the device pixels, ≈ 200 across a laptop screen." },
			cellAspect: { type: "number", label: "Cell height", section: "grid", minimum: 0.5, maximum: 2, step: 0.05, format: { digits: 2 }, unit: "×", hint: "Cell height over width; 1 is square." },
			tiers: { type: "number", label: "Tiers", section: "tiers", minimum: 2, maximum: 6, step: 1, hint: "How many tones the picture snaps to." },
			glyph1: glyphField(1),
			glyph2: glyphField(2),
			glyph3: glyphField(3, { greaterThan: 2, target: "tiers" }),
			glyph4: glyphField(4, { greaterThan: 3, target: "tiers" }),
			glyph5: glyphField(5, { greaterThan: 4, target: "tiers" }),
			glyph6: glyphField(6, { greaterThan: 5, target: "tiers" }),
			weighting: { type: "enum", label: "Weight", section: "marks", choices: ["ramp", "flat"], hint: "Ramp thickens the marks toward the light, as Base's bars do; flat keeps every tier the same." },
			scale: { type: "number", label: "Scale", section: "marks", minimum: 0.1, maximum: 1.2, step: 0.01, format: pct, unit: "%", hint: "The heaviest mark as a share of the cell." },
			minWeight: { type: "number", label: "Lightest", section: "marks", minimum: 0.02, maximum: 1, step: 0.005, format: pct, unit: "%", hint: "The first inked tier's weight before scale.", visibleWhen: { equals: "ramp", target: "weighting" } },
			curve: { type: "number", label: "Curve", section: "marks", minimum: 0.2, maximum: 3, step: 0.01, format: { digits: 2 }, visibleWhen: { equals: "ramp", target: "weighting" } },
			merge: { type: "boolean", label: "Join bars", section: "marks", hint: "Neighbouring bars of one tier run together into long strokes." },
			gap: { type: "number", label: "Gap", section: "marks", minimum: 0, maximum: 0.6, step: 0.005, format: pct, unit: "%", hint: "Where a bar ends, as a share of a cell. Base: 4.5%." },
			roundness: { type: "number", label: "Caps", section: "marks", minimum: 0, maximum: 1, step: 0.01, format: pct, unit: "%", hint: "Base: 44%." },
			colorMode: { type: "enum", label: "Colour", section: "colour", choices: ["palette", "source"], hint: "Palette colours each tier; source takes each cell's own colour from the picture." },
			palette: { type: "colorList", label: "Tier colours", section: "colour", minimumLength: 1, maximumLength: 6, hint: "From the first inked tier, dark to light; the list repeats if it runs short.", randomise: false },
			background: { type: "color", label: "Ground", section: "colour", randomise: false },
			underlay: { type: "number", label: "Underlay", section: "colour", minimum: 0, maximum: 1, step: 0.01, format: pct, unit: "%", hint: "The picture itself, faintly, under the marks." },
			levels: { type: "enum", label: "Levels", section: "tone", choices: ["auto", "equalize", "fixed"], hint: "Fixed uses the picture's tones as they are (Base's footage is graded for this). Auto stretches the picture's own range; equalise gives every tier an equal share." },
			contrast: { type: "number", label: "Contrast", section: "tone", minimum: 0.2, maximum: 5, step: 0.05, format: { digits: 2 }, unit: "×", hint: "About the middle grey. Base runs 2.5–3.1." },
			gamma: { type: "number", label: "Gamma", section: "tone", minimum: 0.3, maximum: 3, step: 0.01, format: { digits: 2 } },
			invert: { type: "boolean", label: "Invert", section: "tone" },
			brightness: { type: "number", label: "Brightness", section: "tone", minimum: -0.5, maximum: 0.5, step: 0.01, format: pct, unit: "%" },
			fit: { type: "enum", label: "Fit", section: "place", choices: ["cover", "contain"] },
			zoom: { type: "number", label: "Zoom", section: "place", minimum: 0.5, maximum: 3, step: 0.01, format: { digits: 2 }, unit: "×" },
			panX: { type: "number", label: "Pan X", section: "place", minimum: -1, maximum: 1, step: 0.01, format: pct, unit: "%" },
			panY: { type: "number", label: "Pan Y", section: "place", minimum: -1, maximum: 1, step: 0.01, format: pct, unit: "%" },
			motion: { type: "enum", label: "Motion", section: "motion", choices: motions, hint: "Reveal wipes the picture into the field, as the Base film does; cycle rolls tones through the tiers; drift breathes them." },
			order: { type: "enum", label: "Order", section: "motion", choices: orders, visibleWhen: { equals: "reveal", target: "motion" } },
			amount: { type: "number", label: "Amount", section: "motion", minimum: 0, maximum: 1, step: 0.01, format: pct, unit: "%", visibleWhen: { equals: "drift", target: "motion" } },
			loop: { type: "enum", label: "Loop", section: "motion", choices: loops, unit: " s" },
			pointer: { type: "enum", label: "Pointer", section: "pointer", choices: pointers, randomise: false, hint: "Light and dark paint tone into the picture as you move; reveal shows the field only under the pointer. Exports ignore it." },
			brush: { type: "number", label: "Brush", section: "pointer", minimum: 0.02, maximum: 0.4, step: 0.005, format: pct, unit: "%", visibleWhen: { notEquals: "off", target: "pointer" } },
			pointerStrength: { type: "number", label: "Strength", section: "pointer", minimum: 0.05, maximum: 1, step: 0.01, format: pct, unit: "%", visibleWhen: { notEquals: "off", target: "pointer" } },
			persist: { type: "number", label: "Trail", section: "pointer", minimum: 0.1, maximum: 3, step: 0.05, format: { digits: 2 }, unit: " s", visibleWhen: { notEquals: "off", target: "pointer" } },
			aspect: { type: "enum", kind: "choiceGrid", label: "Aspect", section: "frame", choices: aspects, hint: "Source matches the picture." },
		},
	};

	const number = (value, fallback, lo, hi) => {
		const n = Number(value);
		return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
	};
	const flag = (value, fallback) => {
		if (typeof value === "boolean") return value;
		if (typeof value === "number" && Number.isFinite(value)) return value >= 0.5;
		if (value === "true" || value === "on") return true;
		if (value === "false" || value === "off") return false;
		return fallback;
	};
	const colour = (value) => {
		if (typeof value !== "string") return null;
		const v = value.trim().replace(/^([0-9a-fA-F]{6})$/u, "#$1");
		return /^#[0-9a-fA-F]{6}$/u.test(v) ? v.toLowerCase() : null;
	};
	const colourList = (value, fallback, max) => {
		const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\s,]+/u) : null;
		if (!list) return [...fallback];
		const out = list.map(colour).filter(Boolean).slice(0, max);
		return out.length ? out : [...fallback];
	};

	function normalize(input) {
		input = input || {};
		const out = {};
		for (const [name, field] of Object.entries(schema.fields)) {
			const value = input[name];
			if (field.type === "number") out[name] = number(value, defaults[name], field.minimum, field.maximum);
			else if (field.type === "boolean") out[name] = flag(value, defaults[name]);
			else if (field.type === "color") out[name] = colour(value) || defaults[name];
			else if (field.type === "colorList") out[name] = colourList(value, defaults[name], field.maximumLength);
			else if (field.type === "enum") {
				const match = field.choices.find((choice) => String(choice) === String(value));
				out[name] = match === undefined ? defaults[name] : match;
			}
		}
		out.seed = Math.round(out.seed);
		out.columns = Math.round(out.columns);
		out.tiers = Math.round(out.tiers);
		return out;
	}

	const definition = Object.freeze({
		persist: true,
		actions: {
			"create-artifact": ({ options, payload }) => options.createArtifact({
				format: payload && payload.format === "svg" ? "svg" : "png",
				longEdge: payload && Number.isFinite(Number(payload.longEdge)) ? Number(payload.longEdge) : undefined,
			}),
			"hide-controls": ({ options }) => options.hideControls(),
			pause: ({ options }) => options.pause(),
			randomize: ({ apply, configuration, options }) => apply({ ...configuration, ...options.nextVariant() }, "randomize"),
			"reseed-renderer": ({ apply, configuration, options }) => apply({ ...configuration, ...options.nextSeed() }, "reseed-renderer"),
			resume: ({ options }) => options.resume(),
			"show-controls": ({ options }) => options.showControls(),
		},
		capabilities: [
			"configure", "undo", "redo", "copy-config", "reset-configuration", "reseed-renderer", "randomize",
			"pause", "resume", "show-controls", "hide-controls", "create-artifact",
		],
		defaults,
		id: "tessera",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.tessera = Object.freeze({
		create(options) {
			if (!options || typeof options.nextSeed !== "function" || typeof options.nextVariant !== "function") {
				throw new TypeError("The Tessera adapter requires nextSeed and nextVariant callbacks.");
			}
			if (typeof options.createArtifact !== "function") {
				throw new TypeError("The Tessera adapter requires a createArtifact callback.");
			}
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		glyphs: Object.freeze([...glyphs]),
		normalize,
		samples: Object.freeze([...samples]),
		schema: Object.freeze(schema),
	});
})(window);
