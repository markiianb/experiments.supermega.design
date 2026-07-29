(function pixelGardenInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const defaults = {
		grow: 700,
		trail: true,
	};
	const schema = {
		id: "supermega.instrument.configuration/pixel-garden/v1",
		version: 1,
		fields: {
			grow: { type: "integer", label: "Grow time", group: "motion", minimum: 200, maximum: 2000, step: 50 },
			trail: { type: "boolean", label: "Seed trail", group: "motion" },
		},
		defaults,
	};

	function number(value, fallback, min, max) {
		const parsed = Number(value);
		return Math.min(max, Math.max(min, Number.isFinite(parsed) ? parsed : fallback));
	}

	function normalize(input) {
		return {
			grow: Math.round(number(input.grow, defaults.grow, 200, 2000)),
			trail: typeof input.trail === "boolean" ? input.trail : defaults.trail,
		};
	}

	const definition = Object.freeze({
		actions: {
			pause: ({ options }) => options.pause(),
			"reseed-renderer": ({ options }) => options.reseedRenderer(),
			resume: ({ options }) => options.resume(),
		},
		capabilities: [
			"configure",
			"copy-config",
			"reset-configuration",
			"reseed-renderer",
			"pause",
			"resume",
		],
		defaults,
		id: "pixel-garden",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.pixelGarden = Object.freeze({
		create(options) {
			if (!options || typeof options.reseedRenderer !== "function") {
				throw new TypeError("The Pixel Garden adapter requires a reseedRenderer callback.");
			}
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		schema: Object.freeze(schema),
	});
})(window);
