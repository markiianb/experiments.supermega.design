(function chromaAtlasInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const modes = ["gradient", "colour", "image", "space", "library"];
	const styles = ["linear", "radial", "angular", "air", "cube", "mono", "dither"];
	const interpolations = ["srgb", "linear-srgb", "oklab", "oklch"];
	const palettes = ["signal", "studio", "ultraviolet", "paper", "night", "field", "custom"];
	const ditherPatterns = ["bayer-2", "bayer-4", "bayer-8", "cluster", "line", "diagonal"];
	const exportFormats = ["png", "jpeg", "tiff", "svg", "css", "json"];
	const collections = Object.freeze({
		field: Object.freeze(["#0A0A0A", "#BFF07A", "#37E6FF", "#FBFAF7"]),
		night: Object.freeze(["#0A0A0A", "#6C36FF", "#5092C7", "#37E6FF"]),
		paper: Object.freeze(["#FBFAF7", "#FFC04E", "#F61515", "#0A0A0A"]),
		signal: Object.freeze(["#111114", "#F61515", "#FF7A1A", "#FFD63D"]),
		studio: Object.freeze(["#6C36FF", "#37E6FF", "#BFF07A", "#FBFAF7"]),
		ultraviolet: Object.freeze(["#0A0A0A", "#6C36FF", "#37E6FF", "#FBFAF7"]),
	});

	const defaults = {
		mode: "gradient",
		style: "linear",
		interpolation: "oklab",
		palette: "signal",
		stopCount: 4,
		color1: "#111114",
		color2: "#F61515",
		color3: "#FF7A1A",
		color4: "#FFD63D",
		position1: 0,
		position2: 0.34,
		position3: 0.68,
		position4: 1,
		angle: 135,
		focusX: 0.5,
		focusY: 0.5,
		softness: 0.32,
		airScale: 1,
		cubeLayers: 9,
		cubeGap: 0.08,
		speed: 0.35,
		ditherPattern: "bayer-8",
		ditherScale: 6,
		monoRange: 0.78,
		imageColorCount: 6,
		spaceYaw: -30,
		spacePitch: 20,
		pointSize: 4,
		background: "#F2F0EA",
		exportFormat: "png",
		exportWidth: 1600,
		exportHeight: 1000,
		jpegQuality: 0.92,
		seed: 11,
	};

	const schema = {
		id: "supermega.instrument.configuration/chroma-atlas/v1",
		version: 1,
		fields: {
			mode: { type: "enum", label: "View", group: "workspace", choices: modes },
			style: { type: "enum", label: "Style", group: "gradient", choices: styles },
			interpolation: { type: "enum", label: "Interpolation", group: "gradient", choices: interpolations },
			palette: { type: "enum", label: "Palette", group: "colour", choices: palettes },
			stopCount: { type: "integer", label: "Stops", group: "colour", minimum: 2, maximum: 4, step: 1 },
			color1: { type: "color", label: "Stop 1", group: "colour" },
			color2: { type: "color", label: "Stop 2", group: "colour" },
			color3: { type: "color", label: "Stop 3", group: "colour" },
			color4: { type: "color", label: "Stop 4", group: "colour" },
			position1: { type: "number", label: "Position 1", group: "colour", minimum: 0, maximum: 1, step: 0.01 },
			position2: { type: "number", label: "Position 2", group: "colour", minimum: 0, maximum: 1, step: 0.01 },
			position3: { type: "number", label: "Position 3", group: "colour", minimum: 0, maximum: 1, step: 0.01 },
			position4: { type: "number", label: "Position 4", group: "colour", minimum: 0, maximum: 1, step: 0.01 },
			angle: { type: "number", label: "Angle", group: "gradient", minimum: 0, maximum: 360, step: 1 },
			focusX: { type: "number", label: "Focus X", group: "gradient", minimum: 0, maximum: 1, step: 0.01 },
			focusY: { type: "number", label: "Focus Y", group: "gradient", minimum: 0, maximum: 1, step: 0.01 },
			softness: { type: "number", label: "Softness", group: "gradient", minimum: 0, maximum: 1, step: 0.01 },
			airScale: { type: "number", label: "Air scale", group: "gradient", minimum: 0.5, maximum: 2, step: 0.05 },
			cubeLayers: { type: "integer", label: "Layers", group: "cube", minimum: 3, maximum: 20, step: 1 },
			cubeGap: { type: "number", label: "Gap", group: "cube", minimum: 0, maximum: 0.2, step: 0.01 },
			speed: { type: "number", label: "Speed", group: "cube", minimum: 0, maximum: 2, step: 0.05 },
			ditherPattern: { type: "enum", label: "Screen", group: "dither", choices: ditherPatterns },
			ditherScale: { type: "integer", label: "Scale", group: "dither", minimum: 1, maximum: 24, step: 1 },
			monoRange: { type: "number", label: "Range", group: "mono", minimum: 0.1, maximum: 1, step: 0.01 },
			imageColorCount: { type: "integer", label: "Colours", group: "image", minimum: 2, maximum: 12, step: 1 },
			spaceYaw: { type: "number", label: "Yaw", group: "space", minimum: -180, maximum: 180, step: 1 },
			spacePitch: { type: "number", label: "Pitch", group: "space", minimum: -80, maximum: 80, step: 1 },
			pointSize: { type: "number", label: "Point size", group: "space", minimum: 2, maximum: 10, step: 0.5 },
			background: { type: "color", label: "Background", group: "output" },
			exportFormat: { type: "enum", label: "Format", group: "output", choices: exportFormats },
			exportWidth: { type: "integer", label: "Width", group: "output", minimum: 64, maximum: 4096, step: 1 },
			exportHeight: { type: "integer", label: "Height", group: "output", minimum: 64, maximum: 4096, step: 1 },
			jpegQuality: { type: "number", label: "JPEG quality", group: "output", minimum: 0.1, maximum: 1, step: 0.01 },
			seed: { type: "integer", label: "Seed", group: "variation", minimum: 0, maximum: 999999, step: 1 },
		},
		defaults,
	};

	const usableNumber = (value) => value !== null && value !== undefined && value !== "";

	function number(value, fallback, minimum, maximum) {
		const parsed = usableNumber(value) ? Number(value) : Number.NaN;
		return Math.min(maximum, Math.max(minimum, Number.isFinite(parsed) ? parsed : fallback));
	}

	function choice(value, choices, fallback) {
		return choices.includes(value) ? value : fallback;
	}

	function colour(value, fallback) {
		if (typeof value !== "string") return fallback;
		let candidate = value.trim().toUpperCase();
		if (/^#[0-9A-F]{3}$/u.test(candidate)) {
			candidate = `#${candidate.slice(1).split("").map((part) => part + part).join("")}`;
		}
		return /^#[0-9A-F]{6}$/u.test(candidate) ? candidate : fallback;
	}

	function collectionPatch(name) {
		const selected = collections[name];
		if (!selected) throw new RangeError(`Unknown Chroma Atlas collection: ${String(name)}`);
		return {
			palette: name,
			color1: selected[0],
			color2: selected[1],
			color3: selected[2],
			color4: selected[3],
			position1: 0,
			position2: 0.34,
			position3: 0.68,
			position4: 1,
		};
	}

	function expandCollectionPatch(input) {
		if (!input || typeof input !== "object" || Array.isArray(input)) return input;
		const name = input.palette;
		const hasExplicitColours = ["color1", "color2", "color3", "color4"].some((key) => Object.prototype.hasOwnProperty.call(input, key));
		return collections[name] && !hasExplicitColours ? { ...collectionPatch(name), ...input } : input;
	}

	function normalize(input) {
		input = input && typeof input === "object" && !Array.isArray(input) ? input : {};
		const stopCount = Math.round(number(input.stopCount, defaults.stopCount, 2, 4));
		const position3 = number(input.position3, defaults.position3, 0.02, 0.99);
		const position2 = number(input.position2, defaults.position2, 0.01, stopCount === 4 ? position3 - 0.01 : 0.98);
		return {
			mode: choice(input.mode, modes, defaults.mode),
			style: choice(input.style, styles, defaults.style),
			interpolation: choice(input.interpolation, interpolations, defaults.interpolation),
			palette: choice(input.palette, palettes, defaults.palette),
			stopCount,
			color1: colour(input.color1, defaults.color1),
			color2: colour(input.color2, defaults.color2),
			color3: colour(input.color3, defaults.color3),
			color4: colour(input.color4, defaults.color4),
			position1: 0,
			position2,
			position3,
			position4: 1,
			angle: number(input.angle, defaults.angle, 0, 360),
			focusX: number(input.focusX, defaults.focusX, 0, 1),
			focusY: number(input.focusY, defaults.focusY, 0, 1),
			softness: number(input.softness, defaults.softness, 0, 1),
			airScale: number(input.airScale, defaults.airScale, 0.5, 2),
			cubeLayers: Math.round(number(input.cubeLayers, defaults.cubeLayers, 3, 20)),
			cubeGap: number(input.cubeGap, defaults.cubeGap, 0, 0.2),
			speed: number(input.speed, defaults.speed, 0, 2),
			ditherPattern: choice(input.ditherPattern, ditherPatterns, defaults.ditherPattern),
			ditherScale: Math.round(number(input.ditherScale, defaults.ditherScale, 1, 24)),
			monoRange: number(input.monoRange, defaults.monoRange, 0.1, 1),
			imageColorCount: Math.round(number(input.imageColorCount, defaults.imageColorCount, 2, 12)),
			spaceYaw: number(input.spaceYaw, defaults.spaceYaw, -180, 180),
			spacePitch: number(input.spacePitch, defaults.spacePitch, -80, 80),
			pointSize: number(input.pointSize, defaults.pointSize, 2, 10),
			background: colour(input.background, defaults.background),
			exportFormat: choice(input.exportFormat, exportFormats, defaults.exportFormat),
			exportWidth: Math.round(number(input.exportWidth, defaults.exportWidth, 64, 4096)),
			exportHeight: Math.round(number(input.exportHeight, defaults.exportHeight, 64, 4096)),
			jpegQuality: number(input.jpegQuality, defaults.jpegQuality, 0.1, 1),
			seed: Math.round(number(input.seed, defaults.seed, 0, 999999)),
		};
	}

	const definition = Object.freeze({
		actions: {
			"create-artifact": ({ options, payload }) => options.createArtifact(payload || {}),
			"hide-controls": ({ options }) => options.hideControls(),
			pause: ({ options }) => options.pause(),
			randomize: ({ apply, configuration, options }) => {
				const patch = options.nextVariant(configuration);
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
		id: "chroma-atlas",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.chromaAtlas = Object.freeze({
		collection(name) {
			return collectionPatch(name);
		},
		collections,
		create(options) {
			if (!options || typeof options.nextVariant !== "function") {
				throw new TypeError("The Chroma Atlas adapter requires a nextVariant callback.");
			}
			const base = core.createAdapter(definition, options);
			const configure = (patch) => base.configure(expandCollectionPatch(patch));
			return Object.freeze({
				...base,
				configure,
				execute(action, payload) {
					if (action !== "configure") return base.execute(action, payload);
					try { return { action, ok: true, value: configure(payload || {}) }; }
					catch (error) { return { action, error: { code: "HANDLER_ERROR", message: error instanceof Error ? error.message : "The configure action failed." }, ok: false }; }
				},
				restoreConfiguration(serialized) {
					return configure(JSON.parse(serialized));
				},
			});
		},
		defaults: Object.freeze(normalize(defaults)),
		ditherPatterns: Object.freeze([...ditherPatterns]),
		exportFormats: Object.freeze([...exportFormats]),
		interpolations: Object.freeze([...interpolations]),
		modes: Object.freeze([...modes]),
		normalize,
		palettes: Object.freeze([...palettes]),
		schema: Object.freeze(schema),
		styles: Object.freeze([...styles]),
	});
})(window);
