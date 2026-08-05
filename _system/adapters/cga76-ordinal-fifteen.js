(function cga76OrdinalFifteenInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const families = ["latin-diagonal", "latin-cross", "latin-counter"];
	const mappings = ["ordinal", "paired", "reverse"];
	const negativeSpaces = ["open", "frame", "ghost"];
	const palettes = ["source", "supermega"];
	const polarities = ["ink-on-paper", "paper-on-ink", "split"];
	const defaults = {
		buildSpeed: 6,
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
	};
	const schema = {
		id: "supermega.instrument.configuration/cga76-ordinal-fifteen/v1",
		version: 1,
		fields: {
			buildSpeed: { type: "number", label: "Build speed", group: "playback", minimum: 1, maximum: 12, step: 0.5 },
			curveAmplitude: { type: "number", label: "Curve amplitude", group: "curves", minimum: 0.05, maximum: 0.45, step: 0.01 },
			family: { type: "enum", label: "Magic family", group: "placement", choices: families },
			hatchAngle: { type: "number", label: "Hatch angle", group: "curves", minimum: -80, maximum: 80, step: 1 },
			hatchSpacing: { type: "number", label: "Hatch spacing", group: "curves", minimum: 3, maximum: 24, step: 1 },
			interpolationSteps: { type: "integer", label: "Interpolations", group: "curves", minimum: 3, maximum: 14, step: 1 },
			lineWeight: { type: "number", label: "Line weight", group: "look", minimum: 0.6, maximum: 4, step: 0.1 },
			mapping: { type: "enum", label: "Unit mapping", group: "placement", choices: mappings },
			mazeDensity: { type: "integer", label: "Maze density", group: "mazes", minimum: 4, maximum: 12, step: 1 },
			negativeSpace: { type: "enum", label: "Fifth state", group: "placement", choices: negativeSpaces },
			palette: { type: "enum", label: "Palette", group: "look", choices: palettes },
			pathContinuity: { type: "number", label: "Continuity", group: "mazes", minimum: 0.2, maximum: 1, step: 0.01 },
			polarity: { type: "enum", label: "Polarity", group: "look", choices: polarities },
			seed: { type: "integer", label: "Seed", group: "seed", minimum: 0, maximum: 4294967295, step: 1 },
			turnBias: { type: "number", label: "Turn bias", group: "mazes", minimum: -1, maximum: 1, step: 0.05 },
		},
		defaults,
	};

	// null and "" must NOT read as 0. The adapter core JSON-clones every patch,
	// so NaN and Infinity arrive as null; coercing that to 0 would silently slam a
	// control to its floor instead of ignoring bad input.
	const usableNumber = (value) => value !== null && value !== undefined && value !== "";

	function number(value, fallback, minimum, maximum) {
		const parsed = usableNumber(value) ? Number(value) : Number.NaN;
		return Math.min(maximum, Math.max(minimum, Number.isFinite(parsed) ? parsed : fallback));
	}

	function enumeration(value, values, fallback) {
		return values.includes(value) ? value : fallback;
	}

	function normalize(input) {
		input = input && typeof input === "object" && !Array.isArray(input) ? input : {};
		return {
			buildSpeed: number(input.buildSpeed, defaults.buildSpeed, 1, 12),
			curveAmplitude: number(input.curveAmplitude, defaults.curveAmplitude, 0.05, 0.45),
			family: enumeration(input.family, families, defaults.family),
			hatchAngle: number(input.hatchAngle, defaults.hatchAngle, -80, 80),
			hatchSpacing: number(input.hatchSpacing, defaults.hatchSpacing, 3, 24),
			interpolationSteps: Math.round(number(input.interpolationSteps, defaults.interpolationSteps, 3, 14)),
			lineWeight: number(input.lineWeight, defaults.lineWeight, 0.6, 4),
			mapping: enumeration(input.mapping, mappings, defaults.mapping),
			mazeDensity: Math.round(number(input.mazeDensity, defaults.mazeDensity, 4, 12)),
			negativeSpace: enumeration(input.negativeSpace, negativeSpaces, defaults.negativeSpace),
			palette: enumeration(input.palette, palettes, defaults.palette),
			pathContinuity: number(input.pathContinuity, defaults.pathContinuity, 0.2, 1),
			polarity: enumeration(input.polarity, polarities, defaults.polarity),
			seed: Math.round(number(input.seed, defaults.seed, 0, 4294967295)),
			turnBias: number(input.turnBias, defaults.turnBias, -1, 1),
		};
	}

	const definition = Object.freeze({
		actions: {
			"create-artifact": ({ options }) => options.createArtifact(),
			"hide-controls": ({ options }) => options.hideControls(),
			pause: ({ options }) => options.pause(),
			randomize: ({ apply, configuration, options }) => apply(
				{ ...configuration, ...options.nextSeed() },
				"randomize",
			),
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
		id: "cga76-ordinal-fifteen",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76OrdinalFifteen = Object.freeze({
		create(options) {
			const required = ["applyConfiguration", "createArtifact", "hideControls", "nextSeed", "pause", "resume", "showControls"];
			if (!options || required.some((name) => typeof options[name] !== "function")) {
				throw new TypeError(`Ordinal Fifteen adapter requires page callbacks: ${required.join(", ")}.`);
			}
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		families: Object.freeze([...families]),
		mappings: Object.freeze([...mappings]),
		negativeSpaces: Object.freeze([...negativeSpaces]),
		palettes: Object.freeze([...palettes]),
		polarities: Object.freeze([...polarities]),
		schema: Object.freeze(schema),
	});
})(window);
