(function sykoraMatrixAdapter(global) {
	"use strict";
	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const rules = ["color-and-shape", "color-only", "shape-only", "contrast-and-break"];
	const directions = ["plus", "minus", "alternating"];
	const modes = ["strict", "permissive"];
	const palettes = ["black-white", "two-grey"];
	const defaults = { buildSpeed: 7, colorWeight: 1, columns: 10, direction: "alternating", gridAngle: 0, initialCells: [{ direction: "+", index: 0, tile: 1 }, { direction: "-", index: 10, tile: 4 }], intensityCoefficient: 1, mode: "strict", palette: "black-white", repertoire: 8, rulePriority: [...rules], rows: 8, shapeWeight: 1 };
	const schema = { id: "supermega.instrument.configuration/cga76-sykora-matrix/v1", version: 1, fields: {
		buildSpeed: { type: "number", label: "Build speed", group: "motion", minimum: 1, maximum: 12, step: 0.5 }, colorWeight: { type: "number", label: "Color weight", group: "rules", minimum: 0, maximum: 2, step: 0.05 }, columns: { type: "integer", label: "Columns", group: "grid", minimum: 6, maximum: 18, step: 1 }, direction: { type: "enum", label: "Direction", group: "intensity", choices: directions }, gridAngle: { type: "number", label: "Grid angle", group: "look", minimum: -45, maximum: 45, step: 1 }, initialCells: { type: "array", label: "Initial cells", group: "editor", maximumLength: 64 }, intensityCoefficient: { type: "number", label: "Coefficient", group: "intensity", minimum: 0.5, maximum: 2, step: 0.05 }, mode: { type: "enum", label: "Solve mode", group: "solver", choices: modes }, palette: { type: "enum", label: "Palette", group: "look", choices: palettes }, repertoire: { type: "integer", label: "Repertoire", group: "modules", minimum: 4, maximum: 8, step: 1 }, rulePriority: { type: "array", label: "Rule priority", group: "rules", maximumLength: 4 }, rows: { type: "integer", label: "Rows", group: "grid", minimum: 5, maximum: 14, step: 1 }, shapeWeight: { type: "number", label: "Shape weight", group: "rules", minimum: 0, maximum: 2, step: 0.05 },
	}, defaults };
	// null and "" must NOT read as 0. The adapter core JSON-clones every patch,
	// so NaN and Infinity arrive as null; coercing that to 0 would silently slam a
	// control to its floor instead of ignoring bad input.
	const usableNumber = (value) => value !== null && value !== undefined && value !== "";

	function number(value, fallback, min, max) { const parsed = usableNumber(value) ? Number(value) : Number.NaN; return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : fallback)); }
	function enumeration(value, list, fallback) { return list.includes(value) ? value : fallback; }
	function normalize(input) {
		input = input && typeof input === "object" && !Array.isArray(input) ? input : {};
		const rows = Math.round(number(input.rows, defaults.rows, 5, 14)); const columns = Math.round(number(input.columns, defaults.columns, 6, 18)); const repertoire = Math.round(number(input.repertoire, defaults.repertoire, 4, 8));
		const priority = []; if (Array.isArray(input.rulePriority)) for (const rule of input.rulePriority) if (rules.includes(rule) && !priority.includes(rule)) priority.push(rule); for (const rule of rules) if (!priority.includes(rule)) priority.push(rule);
		const cells = new Map(); if (Array.isArray(input.initialCells)) for (const item of input.initialCells.slice(0, 64)) { const index = Number(item?.index); const tile = Number(item?.tile); if (Number.isInteger(index) && index >= 0 && index < rows * columns && Number.isInteger(tile) && tile >= 1 && tile <= repertoire) cells.set(index, { direction: item?.direction === "-" ? "-" : "+", index, tile }); }
		return { buildSpeed: number(input.buildSpeed, defaults.buildSpeed, 1, 12), colorWeight: number(input.colorWeight, defaults.colorWeight, 0, 2), columns, direction: enumeration(input.direction, directions, defaults.direction), gridAngle: number(input.gridAngle, defaults.gridAngle, -45, 45), initialCells: [...cells.values()].sort((a, b) => a.index - b.index), intensityCoefficient: number(input.intensityCoefficient, defaults.intensityCoefficient, 0.5, 2), mode: enumeration(input.mode, modes, defaults.mode), palette: enumeration(input.palette, palettes, defaults.palette), repertoire, rulePriority: priority, rows, shapeWeight: number(input.shapeWeight, defaults.shapeWeight, 0, 2) };
	}
	const definition = { actions: { "create-artifact": ({ options }) => options.createArtifact(), "hide-controls": ({ options }) => options.hideControls(), pause: ({ options }) => options.pause(), resume: ({ options }) => options.resume(), "show-controls": ({ options }) => options.showControls() }, capabilities: ["configure", "copy-config", "reset-configuration", "pause", "resume", "show-controls", "hide-controls", "create-artifact"], defaults, id: "cga76-sykora-matrix", normalize, schema };
	global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76SykoraMatrix = Object.freeze({ create(options) { const required = ["applyConfiguration", "createArtifact", "hideControls", "pause", "resume", "showControls"]; if (!options || required.some((name) => typeof options[name] !== "function")) throw new TypeError(`Sykora Matrix adapter requires page callbacks: ${required.join(", ")}.`); return core.createAdapter(definition, options); }, defaults: Object.freeze(normalize(defaults)), rules: Object.freeze([...rules]), schema: Object.freeze(schema) });
})(window);
