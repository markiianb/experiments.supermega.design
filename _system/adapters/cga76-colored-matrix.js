(function coloredMatrixAdapter(global) {
	"use strict";
	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const compatibility = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 2, 2, 0, 0, 2, 0, 0, 2], [1, 2, 2, 2, 0, 0, 2, 0, 0],
		[1, 0, 2, 2, 2, 0, 0, 2, 0], [1, 0, 0, 2, 2, 2, 0, 0, 2], [1, 2, 0, 0, 2, 2, 2, 0, 0],
		[1, 0, 2, 0, 0, 0, 2, 2, 2], [1, 0, 0, 2, 0, 0, 0, 2, 2], [1, 2, 0, 0, 2, 0, 0, 0, 2],
	];
	const metrics = ["chebyshev", "euclidean", "manhattan"];
	const neighbourModes = ["four", "eight"];
	const moduleShapes = ["circles", "rectangles"];
	const palettes = ["source", "supermega"];
	const defaults = {
		buildSpeed: 7, colorBias: [1, 1, 1, 1, 1, 1, 1, 1, 1], columns: 10,
		compatibility: compatibility.map((row) => [...row]), distanceMetric: "chebyshev", moduleShape: "circles",
		neighborMode: "four", palette: "source", precedenceFactors: [1, 1, 1, 1, 1, 1, 1, 1, 1],
		rows: 10, seed: 1976, seedCells: [{ color: 5, x: 3, y: 2 }],
	};
	const schema = { id: "supermega.instrument.configuration/cga76-colored-matrix/v1", version: 1, fields: {
		buildSpeed: { type: "number", label: "Growth speed", group: "motion", minimum: 1, maximum: 24, step: 1 },
		colorBias: { type: "array", label: "Color bias", group: "compatibility", maximumLength: 9 },
		columns: { type: "integer", label: "Columns", group: "field", minimum: 6, maximum: 30, step: 1 },
		compatibility: { type: "array", label: "Compatibility matrix", group: "compatibility", maximumLength: 9 },
		distanceMetric: { type: "enum", label: "Distance", group: "precedence", choices: metrics },
		moduleShape: { type: "enum", label: "Element", group: "look", choices: moduleShapes },
		neighborMode: { type: "enum", label: "Neighbours", group: "compatibility", choices: neighbourModes },
		palette: { type: "enum", label: "Palette", group: "look", choices: palettes },
		precedenceFactors: { type: "array", label: "Precedence factors", group: "precedence", maximumLength: 9 },
		rows: { type: "integer", label: "Rows", group: "field", minimum: 6, maximum: 30, step: 1 },
		seed: { type: "integer", label: "Choice seed", group: "seed", minimum: 0, maximum: 4294967295, step: 1 },
		seedCells: { type: "array", label: "Fixed colored cells", group: "seed", maximumLength: 24 },
	}, defaults };
	// null and "" must NOT read as 0. The adapter core JSON-clones every patch,
	// so NaN and Infinity arrive as null; coercing that to 0 would silently slam a
	// control to its floor instead of ignoring bad input.
	const usableNumber = (value) => value !== null && value !== undefined && value !== "";

	function number(value, fallback, minimum, maximum) { const parsed = usableNumber(value) ? Number(value) : Number.NaN; return Math.min(maximum, Math.max(minimum, Number.isFinite(parsed) ? parsed : fallback)); }
	function enumeration(value, values, fallback) { return values.includes(value) ? value : fallback; }
	function vector(value, fallback, minimum, maximum) { const source = Array.isArray(value) ? value : fallback; return Array.from({ length: 9 }, (_, index) => number(source[index], fallback[index], minimum, maximum)); }
	function normalize(input) {
		input = input && typeof input === "object" && !Array.isArray(input) ? input : {};
		const columns = Math.round(number(input.columns, defaults.columns, 6, 30));
		const rows = Math.round(number(input.rows, defaults.rows, 6, 30));
		const matrixInput = Array.isArray(input.compatibility) ? input.compatibility : defaults.compatibility;
		const normalizedCompatibility = Array.from({ length: 9 }, (_, row) => Array.from({ length: 9 }, (_, column) => Math.round(number(matrixInput[row]?.[column], defaults.compatibility[row][column], 0, 12))));
		const unique = new Map();
		const seedInput = Array.isArray(input.seedCells) ? input.seedCells : defaults.seedCells;
		for (const item of seedInput.slice(0, 24)) { const x = Math.round(Number(item?.x)); const y = Math.round(Number(item?.y)); const color = Math.round(Number(item?.color)); if (x >= 0 && x < columns && y >= 0 && y < rows && color >= 0 && color <= 8) unique.set(y * columns + x, { color, x, y }); }
		if (unique.size === 0) unique.set(Math.floor(rows / 2) * columns + Math.floor(columns / 2), { color: 5, x: Math.floor(columns / 2), y: Math.floor(rows / 2) });
		return {
			buildSpeed: number(input.buildSpeed, defaults.buildSpeed, 1, 24), colorBias: vector(input.colorBias, defaults.colorBias, 0, 8), columns,
			compatibility: normalizedCompatibility, distanceMetric: enumeration(input.distanceMetric, metrics, defaults.distanceMetric), moduleShape: enumeration(input.moduleShape, moduleShapes, defaults.moduleShape),
			neighborMode: enumeration(input.neighborMode, neighbourModes, defaults.neighborMode), palette: enumeration(input.palette, palettes, defaults.palette), precedenceFactors: vector(input.precedenceFactors, defaults.precedenceFactors, 0.05, 9.9),
			rows, seed: Math.round(number(input.seed, defaults.seed, 0, 4294967295)), seedCells: [...unique.values()].sort((a, b) => a.y - b.y || a.x - b.x),
		};
	}
	const definition = { actions: {
		"create-artifact": ({ options }) => options.createArtifact(), "hide-controls": ({ options }) => options.hideControls(), pause: ({ options }) => options.pause(),
		randomize: ({ apply, configuration, options }) => apply({ ...configuration, ...options.nextSeed() }, "randomize"), resume: ({ options }) => options.resume(), "show-controls": ({ options }) => options.showControls(),
	}, capabilities: ["configure", "copy-config", "reset-configuration", "randomize", "pause", "resume", "show-controls", "hide-controls", "create-artifact"], defaults, id: "cga76-colored-matrix", normalize, schema };
	global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76ColoredMatrix = Object.freeze({
		create(options) { const required = ["applyConfiguration", "createArtifact", "hideControls", "nextSeed", "pause", "resume", "showControls"]; if (!options || required.some((name) => typeof options[name] !== "function")) throw new TypeError(`Colored Matrix adapter requires page callbacks: ${required.join(", ")}.`); return core.createAdapter(definition, options); },
		defaults: Object.freeze(normalize(defaults)), metrics: Object.freeze([...metrics]), moduleShapes: Object.freeze([...moduleShapes]), neighbourModes: Object.freeze([...neighbourModes]), palettes: Object.freeze([...palettes]), schema: Object.freeze(schema), sourceCompatibility: Object.freeze(compatibility.map((row) => Object.freeze([...row]))),
	});
})(window);
