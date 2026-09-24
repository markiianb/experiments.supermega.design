(function instrumentShellState(global) {
	"use strict";

	/* =============================================================================
	   State — presets, the seed policy, randomise, and the URL.

	   All of it is schema data. A preset is a patch under a name; a theme is a
	   preset that only names colours, which is why nothing here needs a separate
	   `theme` concept. A shareable link is the difference from the defaults, by
	   field name, so it reads as what it is.

	   Every route lands through `adapter.configure`, so the adapter's `normalize`
	   stays the only validation in the system.
	   ========================================================================== */

	const shell = global.SUPERMEGA_INSTRUMENT_SHELL || {};
	const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value)
		&& (Object.getPrototypeOf(value) === null || Object.prototype.toString.call(value) === "[object Object]");
	const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
	const same = (a, b) => JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);
	const optionsOf = (field) => (Array.isArray(field.options)
		? field.options.map((option) => (option && typeof option === "object" && "value" in option ? option.value : option))
		: Array.isArray(field.choices) ? field.choices : null);

	/**
	 * Which preset the configuration currently IS. A preset presses only while
	 * every key it names matches; keys it does not name are not its business, so
	 * a preset that sets three values stays pressed while a fourth is dialled.
	 *
	 * The comparison is after normalisation, because a patch is authored in a
	 * person's terms (rows: 30.4) and the adapter decides what that means (30).
	 */
	function activePreset(presets, configuration, normalize) {
		if (!presets || !configuration) return null;
		const settle = typeof normalize === "function" ? normalize : (patch) => ({ ...configuration, ...patch });
		for (const name of Object.keys(presets)) {
			const patch = presets[name];
			const settled = settle({ ...configuration, ...clone(patch) });
			if (Object.keys(patch).every((key) => same(settled[key], configuration[key]))) return name;
		}
		return null;
	}

	function randomValue(field, random) {
		const options = optionsOf(field);
		if (options && options.length) return clone(options[Math.min(options.length - 1, Math.floor(random() * options.length))]);
		if (field.type === "boolean") return random() < 0.5;
		if (field.type === "color") {
			const channel = () => Math.floor(random() * 256).toString(16).padStart(2, "0");
			return `#${channel()}${channel()}${channel()}`;
		}
		if (field.type === "number" || field.type === "integer") {
			const minimum = Number.isFinite(Number(field.minimum)) ? Number(field.minimum) : 0;
			const maximum = Number.isFinite(Number(field.maximum)) ? Number(field.maximum) : 1;
			const step = Number.isFinite(Number(field.step)) && Number(field.step) > 0 ? Number(field.step) : null;
			const raw = minimum + random() * (maximum - minimum);
			if (!step) return Number(raw.toFixed(6));
			const stepped = minimum + Math.round((raw - minimum) / step) * step;
			return Number(Math.min(maximum, Math.max(minimum, stepped)).toFixed(6));
		}
		return undefined;
	}

	/**
	 * Roll every field by its own bounds and options. The seed stays where it is
	 * unless asked for: composing a new piece and re-dealing the noise are two
	 * different gestures, and a tool that conflates them cannot keep a look while
	 * changing its grain.
	 */
	function randomise(schema, options) {
		options = options || {};
		const random = typeof options.random === "function" ? options.random : Math.random;
		const patch = {};
		for (const [key, field] of Object.entries(schema.fields || {})) {
			if (shell.isSeedField(key, field) && options.seed !== true) continue;
			if (field.randomise === false) continue;
			const value = randomValue(field, random);
			if (value !== undefined) patch[key] = value;
		}
		// A tool that declares themes has already decided which colours go
		// together. Rolling one of those beats three random hex values, which is
		// why every hand-written randomise in the lab picked from a palette.
		const themes = isPlainObject(schema.theme) ? Object.keys(schema.theme) : [];
		if (themes.length) Object.assign(patch, clone(schema.theme[themes[Math.min(themes.length - 1, Math.floor(random() * themes.length))]]));
		return patch;
	}

	function seedFieldOf(schema) {
		const entries = Object.entries(schema.fields || {});
		const found = entries.find(([key, field]) => shell.isSeedField(key, field));
		return found || null;
	}

	/** Re-deal the seed the noise reads; every authored value stays. */
	function nextSeed(schema, options) {
		options = options || {};
		const random = typeof options.random === "function" ? options.random : Math.random;
		const found = seedFieldOf(schema);
		if (!found) return null;
		const [key, field] = found;
		const minimum = Number.isFinite(Number(field.minimum)) ? Number(field.minimum) : 0;
		const maximum = Number.isFinite(Number(field.maximum)) ? Number(field.maximum) : 9999;
		return { [key]: Math.round(minimum + random() * (maximum - minimum)) };
	}

	function coerce(raw, field) {
		const options = optionsOf(field);
		if (options) {
			const match = options.find((candidate) => String(candidate) === raw);
			return match === undefined ? raw : clone(match);
		}
		if (field.type === "boolean") return raw !== "false" && raw !== "0" && raw !== "off";
		if (field.type === "number" || field.type === "integer") {
			const number = Number(raw);
			return Number.isFinite(number) ? number : undefined;
		}
		return raw;
	}

	/**
	 * Read only what the schema declares, plus `preset` and `theme`. Everything
	 * else in the query string belongs to somebody else: `fresh` is the lab's
	 * cache-buster, `reset-state` is the persistence bypass, `instrument-embed`
	 * is the gallery's, and utm parameters are the internet's.
	 */
	function readState(search, schema) {
		const text = typeof search === "string" ? search : (search && search.search) || "";
		if (!text || text === "?") return {};
		const params = new global.URLSearchParams(text.startsWith("?") ? text.slice(1) : text);
		const patch = {};
		for (const group of ["presets", "theme"]) {
			const name = params.get(group === "presets" ? "preset" : "theme");
			const set = schema[group];
			if (name && set && set[name]) Object.assign(patch, clone(set[name]));
		}
		for (const [key, field] of Object.entries(schema.fields || {})) {
			if (!params.has(key)) continue;
			const value = coerce(params.get(key), field);
			if (value !== undefined) patch[key] = value;
		}
		return patch;
	}

	/**
	 * The difference from the defaults, by name. When the configuration is
	 * exactly a preset, the link says the preset instead of spelling it out: it
	 * is shorter, it survives a defaults change, and it reads as what was meant.
	 */
	function writeState(configuration, schema, defaults, normalize) {
		const params = new global.URLSearchParams();
		const keys = Object.keys(schema.fields || {});
		// A link to the defaults carries nothing at all — not even the name of the
		// preset the defaults happen to be.
		if (keys.every((key) => same(configuration[key], (defaults || {})[key]))) return "";
		// Through the adapter's normalize, exactly as the pressed state is decided.
		// Without it a preset authored in a person's terms (rows: 30.4) could never
		// be named in a link, and the URL spelled out every field instead.
		const preset = activePreset(schema.presets, configuration, normalize);
		const earns = preset && Object.keys(schema.presets[preset]).some((key) => !same(configuration[key], (defaults || {})[key]));
		const covered = earns ? Object.keys(schema.presets[preset]) : [];
		if (earns) params.set("preset", preset);
		for (const key of Object.keys(schema.fields || {})) {
			if (covered.includes(key)) continue;
			const value = configuration[key];
			if (same(value, (defaults || {})[key])) continue;
			params.set(key, typeof value === "object" ? JSON.stringify(value) : String(value));
		}
		return params.toString();
	}

	function shareLink(configuration, schema, defaults, href, normalize) {
		const url = new global.URL(href || (global.location && global.location.href) || "http://localhost/");
		url.search = "";
		url.hash = "";
		const query = writeState(configuration, schema, defaults, normalize);
		return query ? `${url.toString()}?${query}` : url.toString();
	}

	/**
	 * Wire the shell's built-in state actions to an adapter. The panel plans the
	 * buttons; this is what makes them live, so a page that loads panel.js alone
	 * shows them disabled rather than pretending.
	 */
	function installState(controller, adapter, options) {
		options = options || {};
		const schema = options.schema || adapter.getSchema();
		const defaults = typeof options.defaults === "function" ? options.defaults : () => options.defaults || {};
		const hooks = shell.hooks || (shell.hooks = {});
		const random = options.random;

		hooks["state.reseed"] = () => {
			const patch = nextSeed(schema, { random });
			return patch ? adapter.configure(patch) : null;
		};
		hooks["state.randomise"] = () => adapter.configure(randomise(schema, { random }));
		hooks["state.copyLink"] = async () => {
			const href = shareLink(adapter.getConfiguration(), schema, defaults(), global.location && global.location.href, options.normalize);
			try {
				await global.navigator.clipboard.writeText(href);
				return { copied: true, href };
			} catch (error) {
				return { copied: false, href };
			}
		};

		const sync = () => {
			const configuration = adapter.getConfiguration();
			shell.applyVisibility(controller.element, shell.resolveVisibility(controller.tree, configuration, controller.shellState.snapshot()));
			controller.pressPresets({
				presets: activePreset(schema.presets, configuration, options.normalize),
				theme: activePreset(schema.theme, configuration, options.normalize),
			});
		};

		const off = controller.onSync(sync);
		sync();

		// A link the sender composed must win over anything this browser saved,
		// which adapter-core already arranged by skipping its restore when the
		// location names a field or a preset. This is the other half: read it.
		if (options.boot !== false) {
			const patch = readState(global.location && global.location.search, schema);
			if (Object.keys(patch).length) adapter.configure(patch);
		}
		return { destroy: off, sync };
	}

	shell.activePreset = activePreset;
	shell.installState = installState;
	shell.nextSeed = nextSeed;
	shell.randomise = randomise;
	shell.readState = readState;
	shell.shareLink = shareLink;
	shell.writeState = writeState;
	global.SUPERMEGA_INSTRUMENT_SHELL = shell;
})(window);
