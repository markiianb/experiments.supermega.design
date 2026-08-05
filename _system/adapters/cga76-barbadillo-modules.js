(function cga76BarbadilloModulesInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const rotations = ["none", "half-turns", "quarter-turns"];
	const symmetries = ["none", "horizontal", "vertical", "rotational"];
	const outputModes = ["clean-print", "asterisk-study"];
	const defaults = {
		candidateCount: 6,
		columns: 8,
		continuityWeight: 0.82,
		curveRadius: 0.68,
		innerVoid: 0.22,
		macroModuleBias: 0.32,
		outputMode: "asterisk-study",
		polarityRatio: 0.5,
		repertoireSize: 4,
		rotations: "quarter-turns",
		rows: 6,
		seed: 1973,
		symmetry: "none",
	};
	const schema = {
		id: "supermega.instrument.configuration/cga76-barbadillo-modules/v1",
		version: 1,
		fields: {
			candidateCount: { type: "integer", label: "Candidates", group: "wall", minimum: 1, maximum: 12, step: 1 },
			columns: { type: "integer", label: "Columns", group: "grid", minimum: 4, maximum: 16, step: 1 },
			continuityWeight: { type: "number", label: "Continuity", group: "grammar", minimum: 0, maximum: 1, step: 0.01 },
			curveRadius: { type: "number", label: "Curve radius", group: "module", minimum: 0.2, maximum: 0.9, step: 0.01 },
			innerVoid: { type: "number", label: "Inner void", group: "module", minimum: 0.08, maximum: 0.42, step: 0.01 },
			macroModuleBias: { type: "number", label: "Macro-module bias", group: "grammar", minimum: 0, maximum: 1, step: 0.01 },
			outputMode: { type: "enum", label: "Output", group: "look", choices: outputModes },
			polarityRatio: { type: "number", label: "Negative ratio", group: "look", minimum: 0, maximum: 1, step: 0.01 },
			repertoireSize: { type: "integer", label: "Repertoire", group: "grammar", minimum: 1, maximum: 4, step: 1 },
			rotations: { type: "enum", label: "Rotations", group: "grammar", choices: rotations },
			rows: { type: "integer", label: "Rows", group: "grid", minimum: 3, maximum: 12, step: 1 },
			seed: { type: "integer", label: "Seed", group: "seed", minimum: 0, maximum: 4294967295, step: 1 },
			symmetry: { type: "enum", label: "Symmetry", group: "grammar", choices: symmetries },
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
			candidateCount: Math.round(number(input.candidateCount, defaults.candidateCount, 1, 12)),
			columns: Math.round(number(input.columns, defaults.columns, 4, 16)),
			continuityWeight: number(input.continuityWeight, defaults.continuityWeight, 0, 1),
			curveRadius: number(input.curveRadius, defaults.curveRadius, 0.2, 0.9),
			innerVoid: number(input.innerVoid, defaults.innerVoid, 0.08, 0.42),
			macroModuleBias: number(input.macroModuleBias, defaults.macroModuleBias, 0, 1),
			outputMode: enumeration(input.outputMode, outputModes, defaults.outputMode),
			polarityRatio: number(input.polarityRatio, defaults.polarityRatio, 0, 1),
			repertoireSize: Math.round(number(input.repertoireSize, defaults.repertoireSize, 1, 4)),
			rotations: enumeration(input.rotations, rotations, defaults.rotations),
			rows: Math.round(number(input.rows, defaults.rows, 3, 12)),
			seed: Math.round(number(input.seed, defaults.seed, 0, 4294967295)),
			symmetry: enumeration(input.symmetry, symmetries, defaults.symmetry),
		};
	}

	const definition = Object.freeze({
		actions: {
			"create-artifact": ({ options }) => options.createArtifact(),
			"hide-controls": ({ options }) => options.hideControls(),
			randomize: ({ apply, configuration, options }) => apply({ ...configuration, ...options.nextSeed() }, "randomize"),
			"show-controls": ({ options }) => options.showControls(),
		},
		capabilities: ["configure", "copy-config", "reset-configuration", "randomize", "show-controls", "hide-controls", "create-artifact"],
		defaults,
		id: "cga76-barbadillo-modules",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76BarbadilloModules = Object.freeze({
		create(options) {
			const required = ["applyConfiguration", "createArtifact", "hideControls", "nextSeed", "showControls"];
			if (!options || required.some((name) => typeof options[name] !== "function")) throw new TypeError(`Barbadillo Modules adapter requires page callbacks: ${required.join(", ")}.`);
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		outputModes: Object.freeze([...outputModes]),
		rotations: Object.freeze([...rotations]),
		schema: Object.freeze(schema),
		symmetries: Object.freeze([...symmetries]),
	});
})(window);
