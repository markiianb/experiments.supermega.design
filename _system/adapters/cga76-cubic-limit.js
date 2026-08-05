(function cga76CubicLimitInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const falloffs = ["linear", "quadratic", "soft"];
	const projections = ["orthographic", "perspective", "isometric"];
	const operations = ["selected", "complement", "union", "xor"];
	const polarities = ["ink-on-paper", "paper-on-ink", "supermega"];
	const defaults = {
		centerX: 0.5,
		centerY: 0.5,
		columns: 11,
		falloff: "quadratic",
		glyphScale: 0.74,
		maxEdges: 11,
		minEdges: 2,
		noise: 0.12,
		polarity: "ink-on-paper",
		projection: "orthographic",
		rotationX: 18,
		rotationY: 42,
		rotationZ: -12,
		rows: 7,
		seed: 1974,
		stroke: 1.4,
		subsetOperation: "selected",
	};
	const schema = {
		id: "supermega.instrument.configuration/cga76-cubic-limit/v1",
		version: 1,
		fields: {
			centerX: { type: "number", label: "Center X", group: "field", minimum: 0, maximum: 1, step: 0.01 },
			centerY: { type: "number", label: "Center Y", group: "field", minimum: 0, maximum: 1, step: 0.01 },
			columns: { type: "integer", label: "Columns", group: "grid", minimum: 6, maximum: 20, step: 1 },
			falloff: { type: "enum", label: "Falloff", group: "field", choices: falloffs },
			glyphScale: { type: "number", label: "Glyph scale", group: "look", minimum: 0.35, maximum: 0.92, step: 0.01 },
			maxEdges: { type: "integer", label: "Maximum edges", group: "population", minimum: 1, maximum: 12, step: 1 },
			minEdges: { type: "integer", label: "Minimum edges", group: "population", minimum: 0, maximum: 12, step: 1 },
			noise: { type: "number", label: "Statistical noise", group: "population", minimum: 0, maximum: 1, step: 0.01 },
			polarity: { type: "enum", label: "Polarity", group: "look", choices: polarities },
			projection: { type: "enum", label: "Projection", group: "cube", choices: projections },
			rotationX: { type: "number", label: "X sweep", group: "cube", minimum: -180, maximum: 180, step: 1 },
			rotationY: { type: "number", label: "Y sweep", group: "cube", minimum: -180, maximum: 180, step: 1 },
			rotationZ: { type: "number", label: "Z sweep", group: "cube", minimum: -180, maximum: 180, step: 1 },
			rows: { type: "integer", label: "Rows", group: "grid", minimum: 4, maximum: 12, step: 1 },
			seed: { type: "integer", label: "Seed", group: "seed", minimum: 0, maximum: 4294967295, step: 1 },
			stroke: { type: "number", label: "Stroke", group: "look", minimum: 0.5, maximum: 4, step: 0.1 },
			subsetOperation: { type: "enum", label: "Subset operation", group: "population", choices: operations },
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
		const minEdges = Math.round(number(input.minEdges, defaults.minEdges, 0, 12));
		const maxEdges = Math.max(minEdges, Math.round(number(input.maxEdges, defaults.maxEdges, 1, 12)));
		return {
			centerX: number(input.centerX, defaults.centerX, 0, 1),
			centerY: number(input.centerY, defaults.centerY, 0, 1),
			columns: Math.round(number(input.columns, defaults.columns, 6, 20)),
			falloff: enumeration(input.falloff, falloffs, defaults.falloff),
			glyphScale: number(input.glyphScale, defaults.glyphScale, 0.35, 0.92),
			maxEdges,
			minEdges,
			noise: number(input.noise, defaults.noise, 0, 1),
			polarity: enumeration(input.polarity, polarities, defaults.polarity),
			projection: enumeration(input.projection, projections, defaults.projection),
			rotationX: number(input.rotationX, defaults.rotationX, -180, 180),
			rotationY: number(input.rotationY, defaults.rotationY, -180, 180),
			rotationZ: number(input.rotationZ, defaults.rotationZ, -180, 180),
			rows: Math.round(number(input.rows, defaults.rows, 4, 12)),
			seed: Math.round(number(input.seed, defaults.seed, 0, 4294967295)),
			stroke: number(input.stroke, defaults.stroke, 0.5, 4),
			subsetOperation: enumeration(input.subsetOperation, operations, defaults.subsetOperation),
		};
	}

	const definition = Object.freeze({
		actions: {
			"create-artifact": ({ options }) => options.createArtifact(),
			"hide-controls": ({ options }) => options.hideControls(),
			pause: ({ options }) => options.pause(),
			randomize: ({ apply, configuration, options }) => apply({ ...configuration, ...options.nextSeed() }, "randomize"),
			resume: ({ options }) => options.resume(),
			"show-controls": ({ options }) => options.showControls(),
		},
		capabilities: ["configure", "copy-config", "reset-configuration", "randomize", "pause", "resume", "show-controls", "hide-controls", "create-artifact"],
		defaults,
		id: "cga76-cubic-limit",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76CubicLimit = Object.freeze({
		create(options) {
			const required = ["applyConfiguration", "createArtifact", "hideControls", "nextSeed", "pause", "resume", "showControls"];
			if (!options || required.some((name) => typeof options[name] !== "function")) throw new TypeError(`Cubic Limit adapter requires page callbacks: ${required.join(", ")}.`);
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		falloffs: Object.freeze([...falloffs]),
		operations: Object.freeze([...operations]),
		polarities: Object.freeze([...polarities]),
		projections: Object.freeze([...projections]),
		schema: Object.freeze(schema),
	});
})(window);
