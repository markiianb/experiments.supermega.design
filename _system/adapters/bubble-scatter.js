(function bubbleWriterInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const styles = ["outline", "solid", "shadow", "halo", "sticker"];
	const faces = ["grotesk", "tanker", "serif", "mono"];
	const entrances = ["inflate", "pop", "drop", "rise", "swing"];
	const exits = ["deflate", "burst", "drop", "shrink"];
	const loops = ["once", "cycle", "hold"];
	const aspects = ["16:9", "1:1", "4:5", "9:16"];
	const aligns = ["cascade", "left", "centre", "right"];

	const defaults = {
		align: "cascade",
		angle: 90,
		aspect: "16:9",
		cascade: 0.5,
		dotSize: 0.5,
		dots: 0.5,
		entrance: "inflate",
		erase: 14,
		exit: "deflate",
		face: "grotesk",
		gradient: false,
		hold: 1.4,
		ink: "#101014",
		ink2: "#F61515",
		inflate: 0.07,
		jiggle: 0.3,
		lineStagger: 0.25,
		loop: "cycle",
		margin: 0.06,
		overlap: 0.78,
		paper: "#FBFAF7",
		plump: 0.9,
		pop: 0.6,
		seed: 7,
		sizeVary: 0.45,
		speed: 1,
		stroke: 0.014,
		style: "outline",
		text: "MAKE\nSOMETHING\nGREAT",
		tilt: 0.3,
		tracking: -0.05,
		weight: 300,
		wobble: 0.005,
		write: 7,
	};

	const schema = {
		id: "supermega.instrument.configuration/bubble-scatter/v1",
		version: 1,
		fields: {
			align: { type: "enum", label: "Align", group: "layout", choices: aligns },
			angle: { type: "number", label: "Gradient angle", group: "ink", minimum: 0, maximum: 360, step: 1 },
			aspect: { type: "enum", label: "Frame", group: "layout", choices: aspects },
			cascade: { type: "number", label: "Cascade", group: "layout", minimum: 0, maximum: 1, step: 0.01 },
			dotSize: { type: "number", label: "Dot size", group: "motion", minimum: 0, maximum: 1, step: 0.01 },
			dots: { type: "number", label: "Dots", group: "motion", minimum: 0, maximum: 1, step: 0.01 },
			entrance: { type: "enum", label: "Entrance", group: "motion", choices: entrances },
			erase: { type: "number", label: "Exit rate", group: "motion", minimum: 1, maximum: 30, step: 0.5 },
			exit: { type: "enum", label: "Exit", group: "motion", choices: exits },
			face: { type: "enum", label: "Face", group: "type", choices: faces },
			gradient: { type: "boolean", label: "Gradient", group: "ink" },
			hold: { type: "number", label: "Hold", group: "motion", minimum: 0, maximum: 5, step: 0.1 },
			ink: { type: "color", label: "Ink", group: "ink" },
			ink2: { type: "color", label: "Ink two", group: "ink" },
			inflate: { type: "number", label: "Inflate", group: "type", minimum: 0.02, maximum: 0.16, step: 0.005 },
			jiggle: { type: "number", label: "Jiggle", group: "motion", minimum: 0, maximum: 1, step: 0.01 },
			lineStagger: { type: "number", label: "Line lead", group: "motion", minimum: 0, maximum: 1, step: 0.01 },
			loop: { type: "enum", label: "Loop", group: "motion", choices: loops },
			margin: { type: "number", label: "Margin", group: "layout", minimum: 0, maximum: 0.25, step: 0.005 },
			overlap: { type: "number", label: "Overlap", group: "layout", minimum: 0.45, maximum: 1.15, step: 0.01 },
			paper: { type: "color", label: "Paper", group: "ink" },
			plump: { type: "number", label: "Plump", group: "type", minimum: 0, maximum: 1, step: 0.01 },
			pop: { type: "number", label: "Pop", group: "motion", minimum: 0, maximum: 1, step: 0.01 },
			seed: { type: "integer", label: "Seed", group: "layout", minimum: 1, maximum: 9999, step: 1 },
			sizeVary: { type: "number", label: "Size vary", group: "layout", minimum: 0, maximum: 1, step: 0.01 },
			speed: { type: "number", label: "Speed", group: "motion", minimum: 0, maximum: 3, step: 0.05 },
			stroke: { type: "number", label: "Outline", group: "type", minimum: 0.002, maximum: 0.05, step: 0.001 },
			style: { type: "enum", label: "Style", group: "ink", choices: styles },
			text: { type: "string", label: "Phrase", group: "phrase", maxLength: 200 },
			tilt: { type: "number", label: "Tilt", group: "layout", minimum: 0, maximum: 1, step: 0.01 },
			tracking: { type: "number", label: "Tracking", group: "type", minimum: -0.3, maximum: 0.1, step: 0.005 },
			weight: { type: "integer", label: "Weight", group: "type", minimum: 100, maximum: 700, step: 25 },
			wobble: { type: "number", label: "Wobble", group: "type", minimum: 0, maximum: 0.02, step: 0.0005 },
			write: { type: "number", label: "Write rate", group: "motion", minimum: 1, maximum: 20, step: 0.5 },
		},
		defaults,
	};

	// null and "" must NOT read as 0. The adapter core JSON-clones every patch,
	// so NaN and Infinity arrive as null; coercing that to 0 would silently slam
	// a control to its floor instead of ignoring bad input.
	const usableNumber = (value) => value !== null && value !== undefined && value !== "";

	function number(value, fallback, min, max) {
		const parsed = usableNumber(value) ? Number(value) : Number.NaN;
		return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : fallback));
	}

	const pick = (value, list, fallback) => (list.includes(value) ? value : fallback);

	// The phrase is the product. An empty box is a legitimate transient state
	// while someone retypes it, so it stays empty rather than snapping back.
	function phrase(value) {
		if (typeof value !== "string") return defaults.text;
		return value.slice(0, 200);
	}

	// A colour arrives from a native picker, from a hex field somebody typed
	// into, or from a serialized configuration. Shorthand is expanded, and
	// anything unreadable keeps the default rather than painting the work
	// invisible while the user is still mid-keystroke.
	function colour(value, fallback) {
		if (typeof value !== "string") return fallback;
		const text = value.trim().toLowerCase();
		const short = /^#?([0-9a-f]{3})$/u.exec(text);
		if (short) {
			const [r, g, b] = short[1].split("");
			return `#${r}${r}${g}${g}${b}${b}`;
		}
		const long = /^#?([0-9a-f]{6})$/u.exec(text);
		return long ? `#${long[1]}` : fallback;
	}

	function normalize(input) {
		return {
			align: pick(input.align, aligns, defaults.align),
			angle: number(input.angle, defaults.angle, 0, 360),
			aspect: pick(input.aspect, aspects, defaults.aspect),
			cascade: number(input.cascade, defaults.cascade, 0, 1),
			dotSize: number(input.dotSize, defaults.dotSize, 0, 1),
			dots: number(input.dots, defaults.dots, 0, 1),
			entrance: pick(input.entrance, entrances, defaults.entrance),
			erase: number(input.erase, defaults.erase, 1, 30),
			exit: pick(input.exit, exits, defaults.exit),
			face: pick(input.face, faces, defaults.face),
			gradient: input.gradient === undefined || input.gradient === null ? defaults.gradient : Boolean(input.gradient),
			hold: number(input.hold, defaults.hold, 0, 5),
			ink: colour(input.ink, defaults.ink),
			ink2: colour(input.ink2, defaults.ink2),
			inflate: number(input.inflate, defaults.inflate, 0.02, 0.16),
			jiggle: number(input.jiggle, defaults.jiggle, 0, 1),
			lineStagger: number(input.lineStagger, defaults.lineStagger, 0, 1),
			loop: pick(input.loop, loops, defaults.loop),
			margin: number(input.margin, defaults.margin, 0, 0.25),
			overlap: number(input.overlap, defaults.overlap, 0.45, 1.15),
			paper: colour(input.paper, defaults.paper),
			plump: number(input.plump, defaults.plump, 0, 1),
			pop: number(input.pop, defaults.pop, 0, 1),
			seed: Math.round(number(input.seed, defaults.seed, 1, 9999)),
			sizeVary: number(input.sizeVary, defaults.sizeVary, 0, 1),
			speed: number(input.speed, defaults.speed, 0, 3),
			stroke: number(input.stroke, defaults.stroke, 0.002, 0.05),
			style: pick(input.style, styles, defaults.style),
			text: phrase(input.text),
			tilt: number(input.tilt, defaults.tilt, 0, 1),
			tracking: number(input.tracking, defaults.tracking, -0.3, 0.1),
			weight: Math.round(number(input.weight, defaults.weight, 100, 700)),
			wobble: number(input.wobble, defaults.wobble, 0, 0.02),
			write: number(input.write, defaults.write, 1, 20),
		};
	}

	const definition = Object.freeze({
		actions: {
			"clear-renderer": ({ options }) => options.clearTags(),
			"create-artifact": ({ options }) => options.createArtifact(),
			"hide-controls": ({ options }) => options.hideControls(),
			pause: ({ options }) => options.pause(),
			randomize: ({ apply, configuration, options }) => {
				const patch = options.nextVariant();
				return apply({ ...configuration, ...patch }, "randomize");
			},
			// Reseeding lays the composition again from a new hand, leaving every
			// authored value — type, colour, timing — exactly where it was.
			"reseed-renderer": ({ apply, configuration, options }) => {
				options.clearTags();
				return apply({ ...configuration, seed: 1 + Math.floor(Math.random() * 9999) }, "reseed-renderer");
			},
			resume: ({ options }) => options.resume(),
			"show-controls": ({ options }) => options.showControls(),
		},
		capabilities: [
			"configure",
			"copy-config",
			"reset-configuration",
			"clear-renderer",
			"reseed-renderer",
			"randomize",
			"pause",
			"resume",
			"show-controls",
			"hide-controls",
			"create-artifact",
		],
		defaults,
		id: "bubble-scatter",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.bubbleScatter = Object.freeze({
		create(options) {
			if (!options || typeof options.nextVariant !== "function") {
				throw new TypeError("The Bubble Writer adapter requires a nextVariant callback.");
			}
			if (typeof options.clearTags !== "function") {
				throw new TypeError("The Bubble Writer adapter requires a clearTags callback.");
			}
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		schema: Object.freeze(schema),
	});
})(window);
