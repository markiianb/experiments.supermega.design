(function tesseraInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	// Each style is fixed to its reference (tessera-core.js STYLES); a person
	// picks one and tunes detail, contrast and balance. Nothing else.
	const styles = ["yellow", "blue", "figure", "rooster", "base"];
	const frames = ["source", "1:1", "4:5", "9:16", "16:9"];

	const defaults = { aspect: "source", balance: 0, contrast: 1.5, detail: 1, style: "yellow" };

	const schema = {
		id: "supermega.instrument.configuration/tessera/v2",
		name: "Tessera",
		version: 2,
		canvas: { aspects: frames.filter((f) => f !== "source"), background: null, height: 2048, renderScale: 1, width: 1638 },
		sections: [
			{ id: "look", open: true, title: "Look" },
			{ id: "frame", open: false, title: "Frame" },
		],
		actions: [
			{ capability: "randomize", hint: "Try another style", id: "tessera-randomise", key: "v", label: "Randomise", section: "look" },
		],
		fields: {
			style: { type: "enum", kind: "choiceGrid", label: "Style", section: "look", choices: styles, hint: "Each style is one of the Base frames: its marks, cell shape and colours." },
			detail: { type: "number", label: "Detail", section: "look", minimum: 0.4, maximum: 2.5, step: 0.05, format: { digits: 2 }, unit: "×", hint: "Smaller cells show more of the picture; bigger cells more pattern." },
			contrast: { type: "number", label: "Contrast", section: "look", minimum: 0.5, maximum: 4, step: 0.05, format: { digits: 2 }, unit: "×" },
			balance: { type: "number", label: "Balance", section: "look", minimum: -0.5, maximum: 0.5, step: 0.01, format: { digits: 0, scale: 100 }, unit: "%", hint: "Push the picture lighter or darker." },
			aspect: { type: "enum", kind: "choiceGrid", label: "Frame", section: "frame", choices: frames, hint: "Source keeps the picture's own shape." },
		},
	};

	const number = (value, fallback, lo, hi) => {
		const n = Number(value);
		return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
	};
	const choice = (value, list, fallback) => (list.includes(value) ? value : fallback);

	function normalize(input) {
		input = input || {};
		return {
			aspect: choice(input.aspect, frames, defaults.aspect),
			balance: number(input.balance, defaults.balance, -0.5, 0.5),
			contrast: number(input.contrast, defaults.contrast, 0.5, 4),
			detail: number(input.detail, defaults.detail, 0.4, 2.5),
			style: choice(input.style, styles, defaults.style),
		};
	}

	const definition = Object.freeze({
		persist: true,
		actions: {
			"create-artifact": ({ options, payload }) => options.createArtifact({
				format: "png",
				longEdge: payload && Number.isFinite(Number(payload.longEdge)) ? Number(payload.longEdge) : undefined,
			}),
			"hide-controls": ({ options }) => options.hideControls(),
			randomize: ({ apply, configuration, options }) => apply({ ...configuration, ...options.nextVariant() }, "randomize"),
			"show-controls": ({ options }) => options.showControls(),
		},
		capabilities: ["configure", "undo", "redo", "copy-config", "reset-configuration", "randomize", "show-controls", "hide-controls", "create-artifact"],
		defaults,
		id: "tessera",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.tessera = Object.freeze({
		create(options) {
			if (!options || typeof options.nextVariant !== "function") throw new TypeError("The Tessera adapter requires a nextVariant callback.");
			if (typeof options.createArtifact !== "function") throw new TypeError("The Tessera adapter requires a createArtifact callback.");
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		frames: Object.freeze([...frames]),
		normalize,
		schema: Object.freeze(schema),
		styles: Object.freeze([...styles]),
	});
})(window);
