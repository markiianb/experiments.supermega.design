(function cga76CollectionInstrumentAdapter(global) {
	"use strict";

	const core = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core;
	const filters = Object.freeze(["all", "available", "upcoming"]);
	const defaults = { filter: "all" };
	const schema = {
		id: "supermega.instrument.configuration/cga76-collection/v1",
		version: 1,
		fields: {
			filter: { type: "enum", label: "Availability", group: "collection", choices: filters },
		},
		defaults,
	};

	function normalize(input) {
		return { filter: filters.includes(input.filter) ? input.filter : defaults.filter };
	}

	const definition = Object.freeze({
		actions: {},
		capabilities: ["configure", "copy-config", "reset-configuration"],
		defaults,
		id: "cga76-collection",
		normalize,
		schema,
	});

	global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76Collection = Object.freeze({
		create(options) {
			return core.createAdapter(definition, options);
		},
		defaults: Object.freeze(normalize(defaults)),
		filters,
		schema: Object.freeze(schema),
	});
})(window);
