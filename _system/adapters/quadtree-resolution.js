(function quadtreeResolutionInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const modes = ["faithful", "true"];
	const skins = ["blocks", "wireframe"];
	const palettes = ["spectrum", "paper", "red", "mono"];
	const defaults = {
		extrude: 26,
		manualDepth: 7,
		maxN: 7,
		mode: "faithful",
		palette: "spectrum",
		perDepth: 0,
		seed: 17,
		skin: "blocks",
		speed: 1,
		text: "A",
		threshold: 0.03,
		timeline: true,
		viewX: 0,
		viewY: 0,
		zoom: 1,
	};
	const schema = {
		id: "supermega.instrument.configuration/quadtree-resolution/v1",
		version: 1,
		fields: {
			extrude: { type: "number", label: "Extrude", group: "blocks", minimum: 0, maximum: 60, step: 1 },
			manualDepth: { type: "number", label: "Depth", group: "resolution", minimum: 0, maximum: 7, step: 0.1 },
			maxN: { type: "integer", label: "Max depth", group: "resolution", minimum: 1, maximum: 7, step: 1 },
			mode: { type: "enum", label: "Deviation", group: "splitter", choices: modes },
			palette: { type: "enum", label: "Colour", group: "look", choices: palettes },
			perDepth: { type: "number", label: "Depth lift", group: "blocks", minimum: 0, maximum: 6, step: 0.5 },
			seed: { type: "integer", label: "Seed", group: "seed", minimum: 0, maximum: 4294967295, step: 1 },
			skin: { type: "enum", label: "Skin", group: "look", choices: skins },
			speed: { type: "number", label: "Speed", group: "resolution", minimum: 0.25, maximum: 3, step: 0.05 },
			text: { type: "string", label: "Text", group: "mask", maximumLength: 12 },
			threshold: { type: "number", label: "Threshold", group: "splitter", minimum: 0, maximum: 64, step: 0.01 },
			timeline: { type: "boolean", label: "Timeline", group: "resolution" },
			viewX: { type: "number", label: "Pan X", group: "view", minimum: -4000, maximum: 4000, step: 1 },
			viewY: { type: "number", label: "Pan Y", group: "view", minimum: -4000, maximum: 4000, step: 1 },
			zoom: { type: "number", label: "Zoom", group: "view", minimum: 0.25, maximum: 4, step: 0.05 },
		},
		defaults,
	};

	function number(value, fallback, min, max) {
		const parsed = Number(value);
		return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : fallback));
	}

	function normalize(input) {
		return {
			extrude: number(input.extrude, defaults.extrude, 0, 60),
			manualDepth: number(input.manualDepth, defaults.manualDepth, 0, 7),
			maxN: Math.round(number(input.maxN, defaults.maxN, 1, 7)),
			mode: modes.includes(input.mode) ? input.mode : defaults.mode,
			palette: palettes.includes(input.palette) ? input.palette : defaults.palette,
			perDepth: number(input.perDepth, defaults.perDepth, 0, 6),
			seed: Math.round(number(input.seed, defaults.seed, 0, 4294967295)),
			skin: skins.includes(input.skin) ? input.skin : defaults.skin,
			speed: number(input.speed, defaults.speed, 0.25, 3),
			text: (typeof input.text === "string" && input.text.trim()) ? input.text.slice(0, 12) : defaults.text,
			threshold: number(input.threshold, defaults.threshold, 0, 64),
			timeline: typeof input.timeline === "boolean" ? input.timeline : defaults.timeline,
			viewX: Math.round(number(input.viewX, defaults.viewX, -4000, 4000)),
			viewY: Math.round(number(input.viewY, defaults.viewY, -4000, 4000)),
			zoom: number(input.zoom, defaults.zoom, 0.25, 4),
		};
	}

	const definition = Object.freeze({
		actions: {
			"create-artifact": ({ options }) => options.createArtifact(),
			"hide-controls": ({ options }) => options.hideControls(),
			pause: ({ options }) => options.pause(),
			randomize: ({ apply, configuration, options }) => {
				const patch = options.nextSeed();
				return apply({ ...configuration, ...patch }, "randomize");
			},
			resume: ({ options }) => options.resume(),
			"show-controls": ({ options }) => options.showControls(),
		},
		capabilities: [
			"configure",
			"copy-config",
			"reset-configuration",
			"randomize",
			"pause",
			"resume",
			"show-controls",
			"hide-controls",
			"create-artifact",
		],
		defaults,
		id: "quadtree-resolution",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.quadtreeResolution = Object.freeze({
		create(options) {
			if (!options || typeof options.nextSeed !== "function") {
				throw new TypeError("The Quadtree Resolution adapter requires a nextSeed callback.");
			}
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		schema: Object.freeze(schema),
	});
})(window);
