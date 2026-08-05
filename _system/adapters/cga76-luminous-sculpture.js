(function luminousSculptureAdapter(global) {
	"use strict";
	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const sourceSeeds = [{ x: 6, y: 6, z: 9, color: 9 }, { x: 11, y: 15, z: 13, color: 6 }, { x: 16, y: 12, z: 11, color: 2 }, { x: 5, y: 15, z: 11, color: 12 }, { x: 10, y: 5, z: 12, color: 12 }, { x: 15, y: 11, z: 6, color: 12 }, { x: 2, y: 20, z: 20, color: 0 }];
	const palettes = ["source", "supermega"];
	const sliceAxes = ["all", "x", "y", "z"];
	const sourceModes = ["browser-safe", "source-22"];
	const defaults = { buildSpeed: 8, cameraPitch: -18, cameraYaw: 28, chunkSize: 192, dimension: 12, lightPower: 1.1, opacity: 0.56, palette: "source", pointScale: 0.82, seed: 1976, seedCells: sourceSeeds.map((seed) => ({ ...seed })), sliceAxis: "all", sliceIndex: -1, sourceMode: "browser-safe", zoom: 1 };
	const schema = { id: "supermega.instrument.configuration/cga76-luminous-sculpture/v1", version: 1, fields: {
		buildSpeed: { type: "number", label: "Build speed", group: "motion", minimum: 1, maximum: 24, step: 1 }, cameraPitch: { type: "number", label: "Pitch", group: "camera", minimum: -75, maximum: 75, step: 1 }, cameraYaw: { type: "number", label: "Yaw", group: "camera", minimum: -180, maximum: 180, step: 1 },
		chunkSize: { type: "integer", label: "Chunk size", group: "build", minimum: 32, maximum: 1024, step: 1 }, dimension: { type: "integer", label: "Cube dimension", group: "build", minimum: 6, maximum: 22, step: 1 }, lightPower: { type: "number", label: "Bottom light", group: "look", minimum: 0, maximum: 2, step: 0.05 },
		opacity: { type: "number", label: "Element opacity", group: "look", minimum: 0.08, maximum: 0.95, step: 0.01 }, palette: { type: "enum", label: "Palette", group: "look", choices: palettes }, pointScale: { type: "number", label: "Marble scale", group: "look", minimum: 0.35, maximum: 1.6, step: 0.01 },
		seed: { type: "integer", label: "Choice seed", group: "seed", minimum: 0, maximum: 4294967295, step: 1 }, seedCells: { type: "array", label: "Fixed colored points", group: "seed", maximumLength: 24 }, sliceAxis: { type: "enum", label: "Slice axis", group: "slice", choices: sliceAxes }, sliceIndex: { type: "integer", label: "Slice plane", group: "slice", minimum: -1, maximum: 21, step: 1 }, sourceMode: { type: "enum", label: "Construction size", group: "build", choices: sourceModes }, zoom: { type: "number", label: "Zoom", group: "camera", minimum: 0.5, maximum: 1.8, step: 0.01 },
	}, defaults };
	// null and "" must NOT read as 0. The adapter core JSON-clones every patch,
	// so NaN and Infinity arrive as null; coercing that to 0 would silently slam a
	// control to its floor instead of ignoring bad input.
	const usableNumber = (value) => value !== null && value !== undefined && value !== "";

	function number(value, fallback, minimum, maximum) { const parsed = usableNumber(value) ? Number(value) : Number.NaN; return Math.min(maximum, Math.max(minimum, Number.isFinite(parsed) ? parsed : fallback)); }
	function enumeration(value, values, fallback) { return values.includes(value) ? value : fallback; }
	function normalize(input) {
		input = input && typeof input === "object" && !Array.isArray(input) ? input : {};
		const sourceMode = enumeration(input.sourceMode, sourceModes, defaults.sourceMode);
		const dimension = sourceMode === "source-22" ? 22 : Math.round(number(input.dimension, defaults.dimension, 6, 22));
		const seedInput = Array.isArray(input.seedCells) ? input.seedCells : defaults.seedCells;
		const unique = new Map();
		for (const item of seedInput.slice(0, 24)) { const x = Math.round(number(item?.x, 1, 1, 22)); const y = Math.round(number(item?.y, 1, 1, 22)); const z = Math.round(number(item?.z, 1, 1, 22)); const color = Math.round(number(item?.color, 0, 0, 12)); unique.set(`${x},${y},${z}`, { color, x, y, z }); }
		if (unique.size === 0) for (const seed of sourceSeeds) unique.set(`${seed.x},${seed.y},${seed.z}`, { ...seed });
		return { buildSpeed: number(input.buildSpeed, defaults.buildSpeed, 1, 24), cameraPitch: number(input.cameraPitch, defaults.cameraPitch, -75, 75), cameraYaw: number(input.cameraYaw, defaults.cameraYaw, -180, 180), chunkSize: Math.round(number(input.chunkSize, defaults.chunkSize, 32, 1024)), dimension, lightPower: number(input.lightPower, defaults.lightPower, 0, 2), opacity: number(input.opacity, defaults.opacity, 0.08, 0.95), palette: enumeration(input.palette, palettes, defaults.palette), pointScale: number(input.pointScale, defaults.pointScale, 0.35, 1.6), seed: Math.round(number(input.seed, defaults.seed, 0, 4294967295)), seedCells: [...unique.values()], sliceAxis: enumeration(input.sliceAxis, sliceAxes, defaults.sliceAxis), sliceIndex: Math.round(number(input.sliceIndex, defaults.sliceIndex, -1, dimension - 1)), sourceMode, zoom: number(input.zoom, defaults.zoom, 0.5, 1.8) };
	}
	const definition = { actions: { "create-artifact": ({ options }) => options.createArtifact(), "hide-controls": ({ options }) => options.hideControls(), pause: ({ options }) => options.pause(), randomize: ({ apply, configuration, options }) => apply({ ...configuration, ...options.nextSeed() }, "randomize"), resume: ({ options }) => options.resume(), "show-controls": ({ options }) => options.showControls() }, capabilities: ["configure", "copy-config", "reset-configuration", "randomize", "pause", "resume", "show-controls", "hide-controls", "create-artifact"], defaults, id: "cga76-luminous-sculpture", normalize, schema };
	global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76LuminousSculpture = Object.freeze({
		create(options) { const required = ["applyConfiguration", "createArtifact", "hideControls", "nextSeed", "pause", "resume", "showControls"]; if (!options || required.some((name) => typeof options[name] !== "function")) throw new TypeError(`Luminous Sculpture adapter requires page callbacks: ${required.join(", ")}.`); return core.createAdapter(definition, options); },
		defaults: Object.freeze(normalize(defaults)), palettes: Object.freeze([...palettes]), schema: Object.freeze(schema), sliceAxes: Object.freeze([...sliceAxes]), sourceModes: Object.freeze([...sourceModes]), sourceSeeds: Object.freeze(sourceSeeds.map((seed) => Object.freeze({ ...seed }))),
	});
})(window);
