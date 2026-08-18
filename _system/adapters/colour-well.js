(function colourWellInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const shapes = ["rect", "circle", "hexagon", "triangle", "diamond"];
	const nestings = ["inset", "scale"];
	const blends = ["rgb", "hsl", "hsl-long"];
	const directions = ["inward", "outward"];
	const aspects = ["1:1", "4:5", "3:4", "2:3", "9:16", "3:2", "16:9"];
	const defaults = {
		aspect: "4:5",
		blend: "hsl",
		clip: false,
		colorA: "#263d8d",
		colorB: "#cbddf1",
		colorMid: "#608dc8",
		direction: "inward",
		driftX: -0.38,
		driftY: 0.31,
		exportSize: 2048,
		flow: 0,
		gamma: 1,
		grain: 0,
		inner: 0.11,
		jitter: 0,
		margin: 0,
		midOn: false,
		nesting: "inset",
		pace: 1.15,
		page: "#060608",
		round: 0,
		seed: 7,
		shadow: 0,
		shadowAngle: 115,
		shape: "rect",
		sheen: 0,
		sheenAngle: 115,
		steps: 7,
		stretch: 1,
		twist: 0,
	};
	const schema = {
		id: "supermega.instrument.configuration/colour-well/v1",
		version: 1,
		fields: {
			aspect: { type: "enum", label: "Aspect", group: "frame", choices: aspects },
			blend: { type: "enum", label: "Blend", group: "colour", choices: blends },
			clip: { type: "boolean", label: "Contain", group: "shape" },
			colorA: { type: "color", label: "Outer", group: "colour" },
			colorB: { type: "color", label: "Inner", group: "colour" },
			colorMid: { type: "color", label: "Mid", group: "colour" },
			direction: { type: "enum", label: "Direction", group: "colour", choices: directions },
			driftX: { type: "number", label: "Drift X", group: "placement", minimum: -1, maximum: 1, step: 0.01 },
			driftY: { type: "number", label: "Drift Y", group: "placement", minimum: -1, maximum: 1, step: 0.01 },
			exportSize: { type: "integer", label: "Export px", group: "frame", minimum: 512, maximum: 4096, step: 128 },
			flow: { type: "number", label: "Flow", group: "motion", minimum: 0, maximum: 3, step: 0.05 },
			gamma: { type: "number", label: "Curve", group: "colour", minimum: 0.3, maximum: 3, step: 0.05 },
			grain: { type: "number", label: "Grain", group: "light", minimum: 0, maximum: 1, step: 0.01 },
			inner: { type: "number", label: "Inner", group: "shape", minimum: 0.05, maximum: 0.6, step: 0.01 },
			jitter: { type: "number", label: "Jitter", group: "placement", minimum: 0, maximum: 1, step: 0.01 },
			margin: { type: "number", label: "Margin", group: "frame", minimum: 0, maximum: 0.25, step: 0.005 },
			midOn: { type: "boolean", label: "Mid stop", group: "colour" },
			nesting: { type: "enum", label: "Nesting", group: "shape", choices: nestings },
			pace: { type: "number", label: "Spacing", group: "shape", minimum: 0.35, maximum: 2.8, step: 0.05 },
			page: { type: "color", label: "Page", group: "frame" },
			round: { type: "number", label: "Round", group: "shape", minimum: 0, maximum: 1, step: 0.01 },
			seed: { type: "integer", label: "Seed", group: "seed", minimum: 0, maximum: 4294967295, step: 1 },
			shadow: { type: "number", label: "Shadow", group: "light", minimum: 0, maximum: 1, step: 0.01 },
			shadowAngle: { type: "number", label: "Shadow angle", group: "light", minimum: 0, maximum: 360, step: 1 },
			shape: { type: "enum", label: "Shape", group: "shape", choices: shapes },
			sheen: { type: "number", label: "Sheen", group: "light", minimum: 0, maximum: 1, step: 0.01 },
			sheenAngle: { type: "number", label: "Sheen angle", group: "light", minimum: 0, maximum: 360, step: 1 },
			steps: { type: "integer", label: "Steps", group: "shape", minimum: 3, maximum: 16, step: 1 },
			stretch: { type: "number", label: "Stretch", group: "shape", minimum: 0.5, maximum: 2, step: 0.01 },
			twist: { type: "number", label: "Twist", group: "shape", minimum: -45, maximum: 45, step: 0.5 },
		},
		defaults,
	};

	// null and "" must NOT read as 0. The adapter core JSON-clones every patch,
	// so NaN and Infinity arrive as null; coercing that to 0 would silently slam a
	// control to its floor instead of ignoring bad input.
	const usableNumber = (value) => value !== null && value !== undefined && value !== "";

	function number(value, fallback, min, max) {
		const parsed = usableNumber(value) ? Number(value) : Number.NaN;
		return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : fallback));
	}

	function color(value, fallback) {
		return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback;
	}

	function normalize(input) {
		return {
			aspect: aspects.includes(input.aspect) ? input.aspect : defaults.aspect,
			blend: blends.includes(input.blend) ? input.blend : defaults.blend,
			clip: typeof input.clip === "boolean" ? input.clip : defaults.clip,
			colorA: color(input.colorA, defaults.colorA),
			colorB: color(input.colorB, defaults.colorB),
			colorMid: color(input.colorMid, defaults.colorMid),
			direction: directions.includes(input.direction) ? input.direction : defaults.direction,
			driftX: number(input.driftX, defaults.driftX, -1, 1),
			driftY: number(input.driftY, defaults.driftY, -1, 1),
			exportSize: Math.round(number(input.exportSize, defaults.exportSize, 512, 4096)),
			flow: number(input.flow, defaults.flow, 0, 3),
			gamma: number(input.gamma, defaults.gamma, 0.3, 3),
			grain: number(input.grain, defaults.grain, 0, 1),
			inner: number(input.inner, defaults.inner, 0.05, 0.6),
			jitter: number(input.jitter, defaults.jitter, 0, 1),
			margin: number(input.margin, defaults.margin, 0, 0.25),
			midOn: typeof input.midOn === "boolean" ? input.midOn : defaults.midOn,
			nesting: nestings.includes(input.nesting) ? input.nesting : defaults.nesting,
			pace: number(input.pace, defaults.pace, 0.35, 2.8),
			page: color(input.page, defaults.page),
			round: number(input.round, defaults.round, 0, 1),
			seed: Math.round(number(input.seed, defaults.seed, 0, 4294967295)),
			shadow: number(input.shadow, defaults.shadow, 0, 1),
			shadowAngle: number(input.shadowAngle, defaults.shadowAngle, 0, 360),
			shape: shapes.includes(input.shape) ? input.shape : defaults.shape,
			sheen: number(input.sheen, defaults.sheen, 0, 1),
			sheenAngle: number(input.sheenAngle, defaults.sheenAngle, 0, 360),
			steps: Math.round(number(input.steps, defaults.steps, 3, 16)),
			stretch: number(input.stretch, defaults.stretch, 0.5, 2),
			twist: number(input.twist, defaults.twist, -45, 45),
		};
	}

	const definition = Object.freeze({
		actions: {
			"create-artifact": ({ options }) => options.createArtifact(),
			"hide-controls": ({ options }) => options.hideControls(),
			pause: ({ options }) => options.pause(),
			randomize: ({ apply, configuration, options, payload }) => {
				const scope = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
				const patch = options.nextRandom(scope);
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
		id: "colour-well",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.colourWell = Object.freeze({
		create(options) {
			if (!options || typeof options.nextRandom !== "function") {
				throw new TypeError("The Colour Well adapter requires a nextRandom callback.");
			}
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		schema: Object.freeze(schema),
	});
})(window);
