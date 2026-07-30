(function lsystemMeadowInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const palettes = ["faithful", "red", "paper", "red-paper"];
	const speciesKeys = ["symmetric", "broadleaf", "wind", "weeping", "pine", "dead", "bamboo"];
	const defaults = {
		angle: 1,
		bamboo: true,
		broadleaf: true,
		dead: true,
		decay: 0.45,
		grow: false,
		growSpeed: 6,
		iterations: 0,
		palette: "faithful",
		pine: true,
		plants: 100,
		seed: 1968,
		sway: 0.2,
		symmetric: true,
		tempo: 0.02,
		text: "L",
		weeping: true,
		wind: true,
	};
	const schema = {
		id: "supermega.instrument.configuration/lsystem-meadow/v1",
		version: 1,
		fields: {
			angle: { type: "number", label: "Angle ×", group: "rules", minimum: 0.4, maximum: 2, step: 0.05 },
			bamboo: { type: "boolean", label: "Bamboo", group: "species" },
			broadleaf: { type: "boolean", label: "Broadleaf", group: "species" },
			dead: { type: "boolean", label: "Dead", group: "species" },
			decay: { type: "number", label: "Decay", group: "rules", minimum: 0.45, maximum: 0.9, step: 0.01 },
			grow: { type: "boolean", label: "Grow in", group: "motion" },
			growSpeed: { type: "integer", label: "Grow speed", group: "motion", minimum: 1, maximum: 40, step: 1 },
			iterations: { type: "integer", label: "Iterations ±", group: "rules", minimum: -2, maximum: 2, step: 1 },
			palette: { type: "enum", label: "Colour", group: "look", choices: palettes },
			pine: { type: "boolean", label: "Pine", group: "species" },
			plants: { type: "integer", label: "Plants", group: "mask", minimum: 10, maximum: 400, step: 5 },
			seed: { type: "integer", label: "Seed", group: "seed", minimum: 0, maximum: 4294967295, step: 1 },
			sway: { type: "number", label: "Sway", group: "motion", minimum: 0, maximum: 0.6, step: 0.01 },
			symmetric: { type: "boolean", label: "Symmetric", group: "species" },
			tempo: { type: "number", label: "Tempo", group: "motion", minimum: 0, maximum: 0.1, step: 0.002 },
			text: { type: "string", label: "Text", group: "mask", maximumLength: 24 },
			weeping: { type: "boolean", label: "Weeping", group: "species" },
			wind: { type: "boolean", label: "Wind", group: "species" },
		},
		defaults,
	};

	function number(value, fallback, min, max) {
		const parsed = Number(value);
		return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : fallback));
	}

	function boolean(value, fallback) {
		return typeof value === "boolean" ? value : fallback;
	}

	function normalize(input) {
		const text = typeof input.text === "string" && input.text.trim() ? input.text.slice(0, 24) : defaults.text;
		const next = {
			angle: number(input.angle, defaults.angle, 0.4, 2),
			decay: number(input.decay, defaults.decay, 0.45, 0.9),
			grow: boolean(input.grow, defaults.grow),
			growSpeed: Math.round(number(input.growSpeed, defaults.growSpeed, 1, 40)),
			iterations: Math.round(number(input.iterations, defaults.iterations, -2, 2)),
			palette: palettes.includes(input.palette) ? input.palette : defaults.palette,
			plants: Math.round(number(input.plants, defaults.plants, 10, 400)),
			seed: Math.round(number(input.seed, defaults.seed, 0, 4294967295)),
			sway: number(input.sway, defaults.sway, 0, 0.6),
			tempo: number(input.tempo, defaults.tempo, 0, 0.1),
			text,
		};
		for (const key of speciesKeys) next[key] = boolean(input[key], defaults[key]);
		// An empty species selection means "all species" — heal the config so the
		// panel and the render never disagree.
		if (speciesKeys.every((key) => !next[key])) for (const key of speciesKeys) next[key] = true;
		return next;
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
		id: "lsystem-meadow",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.lsystemMeadow = Object.freeze({
		create(options) {
			if (!options || typeof options.nextSeed !== "function") {
				throw new TypeError("The L-System Meadow adapter requires a nextSeed callback.");
			}
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		schema: Object.freeze(schema),
		speciesKeys: Object.freeze([...speciesKeys]),
	});
})(window);
