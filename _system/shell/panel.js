(function instrumentShellPanel(global) {
	"use strict";

	/* =============================================================================
	   The lab shell — panel.

	   Two halves, deliberately split (KTD2):

	     planPanel(schema)              pure. Schema in, a plain tree out. No DOM,
	                                    no adapter, no page. Unit-tested in node:vm.
	     mountPanel(container, tree, a) DOM. Emits the kit's own instrument-* markup
	                                    for each tree row and binds it both ways
	                                    through adapter.configure. Proven in a
	                                    browser, never inferred from a unit test.

	   The schema is the only input. There is no second spec object to divide
	   authorship against: everything the panel shows, a schema field already knows
	   or can declare.

	   What the page still owns: its head, its brand trail, its canvas, its engine,
	   and the container this mounts into. What the shell owns: the panel.
	   ========================================================================== */

	const shell = global.SUPERMEGA_INSTRUMENT_SHELL || {};

	/** The kit generator's control vocabulary plus the five schema v2 adds. */
	const CONTROL_KINDS = [
		"range", "rangePair", "toggle", "switch", "select", "segments", "text",
		"color", "gradient", "vector", "file",
		"angle", "seed", "light", "choiceGrid", "swatch", "colorList", "opaque",
	];

	/** A value the panel reports but does not edit. */
	const OPAQUE_KINDS = new Set(["opaque"]);

	/** Kinds that need the row's whole width, with the label stacked above. */
	const STACKED_KINDS = new Set(["segments", "choiceGrid", "vector", "light", "rangePair", "colorList"]);

	/** Kinds the planner accepts but the mounter cannot build yet. */
	const UNMOUNTED_KINDS = new Set(["gradient", "file"]);
	/** Shell keys the transport writes once a frame; they sync only their own row. */
	const FRAME_KEYS = new Set(["timeline.time"]);

	const BUILT_IN_KEYS = [
		{ key: "h", label: "controls" },
		{ key: "z", label: "undo" },
	];

	/**
	 * What counts as a seed. No adapter in the lab authors `kind:` on any field
	 * and sixty of them carry a field literally named `seed`, so a rule that only
	 * fires on the explicit kind serves none of them. One definition, exported,
	 * so the planner, the mounter and `state.js` cannot drift apart about it.
	 */
	function isSeedField(key, field) {
		return Boolean(field) && (field.kind === "seed" || (!field.kind && key === "seed"));
	}

	function isPlainObject(value) {
		// Objects arriving from another realm (the test vm, an iframe) do not share
		// this realm's Object.prototype, so the tag is the only reliable check.
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		const prototype = Object.getPrototypeOf(value);
		return prototype === null || Object.prototype.toString.call(value) === "[object Object]";
	}

	function clone(value) {
		return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
	}

	function titleCase(text) {
		return String(text)
			.split(/[\s_-]+/u)
			.filter(Boolean)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	/** How many decimals a declared step implies. `0.0005` reads as four. */
	function decimalsOfStep(step) {
		const value = Number(step);
		if (!Number.isFinite(value) || value <= 0) return null;
		const text = String(value);
		if (text.includes("e-")) {
			const [mantissa, exponent] = text.split("e-");
			const fraction = mantissa.split(".")[1];
			return Math.min(10, Number(exponent) + (fraction ? fraction.length : 0));
		}
		const dot = text.indexOf(".");
		return dot === -1 ? 0 : text.length - dot - 1;
	}

	function idFor(key) {
		return `shell-${String(key).replace(/[^A-Za-z0-9]+/gu, "-").replace(/^-|-$/gu, "")}`;
	}

	function optionLabel(value, field) {
		if (typeof value === "number") return `${value}${field.unit || ""}`;
		if (typeof value === "boolean") return value ? "On" : "Off";
		return titleCase(String(value));
	}

	function optionsOf(field) {
		const source = Array.isArray(field.options) ? field.options : Array.isArray(field.choices) ? field.choices : null;
		if (!source) return null;
		return source.map((entry) => (isPlainObject(entry) && "value" in entry
			? { label: String(entry.label ?? optionLabel(entry.value, field)), value: clone(entry.value) }
			: { label: optionLabel(entry, field), value: clone(entry) }));
	}

	/**
	 * A one-of-N choice is a counting decision, not a taste one: four or fewer
	 * read as segments, five to eight as a grid, more than eight as a select.
	 * (engine-contract.md § Schema v2.) A schema that disagrees says so with an
	 * explicit `kind`.
	 */
	function resolveKind(key, field) {
		if (isSeedField(key, field)) return "seed";
		if (field.kind) {
			if (!CONTROL_KINDS.includes(field.kind)) {
				throw new TypeError(`The field "${key}" declares kind "${field.kind}", which the Instrument control vocabulary does not name.`);
			}
			return field.kind;
		}
		const options = optionsOf(field);
		if (options) {
			if (!options.length) throw new TypeError(`The field "${key}" declares an empty option list, so there is nothing to choose from.`);
			if (options.length <= 4) return "segments";
			return options.length <= 8 ? "choiceGrid" : "select";
		}
		switch (field.type) {
			case "integer":
			case "number":
				return "range";
			case "boolean":
				return "switch";
			case "color":
				return "color";
			case "colorList":
				// A list of colours is not a new component: it is the kit's own
				// colour field, repeated, with an add and a remove. The kit has the
				// field; what was missing was the repeater.
				return "colorList";
			case "string":
			case "text":
				return "text";
			case "enum":
				// An enum promises a choice and this one delivers none. That is a
				// schema defect, not an opaque value, and it should be said out loud.
				throw new TypeError(`The field "${key}" has type "enum" and no options, so there is nothing to choose from.`);
			default:
				// A cell grid, a key list, a palette: a value the tool holds and the
				// person edits somewhere other than the panel. It becomes a row that
				// says so. Throwing cost the whole panel over one field, which kept
				// six otherwise ordinary tools from ever mounting a generated one.
				return "opaque";
		}
	}

	/** A read-out a person can read: the value, scaled, to its decimals, with its unit. */
	function formatFieldValue(value, field) {
		field = field || {};
		if (typeof value === "boolean") return value ? "ON" : "OFF";
		if (Array.isArray(value)) return value.map((entry) => formatFieldValue(entry, field)).join(" · ");
		if (isPlainObject(value)) return Object.values(value).map((entry) => formatFieldValue(entry, field)).join(" · ");
		const format = field.format || {};
		const number = Number(value);
		if (!Number.isFinite(number)) return `${value == null ? "" : value}`;
		const scale = Number.isFinite(Number(format.scale)) ? Number(format.scale) : 1;
		const digits = Number.isFinite(Number(format.digits))
			? Number(format.digits)
			: decimalsOfStep(field.step) ?? 2;
		return `${(number * scale).toFixed(Math.max(0, Math.min(10, digits)))}${field.unit || ""}`;
	}

	function planField(key, field, owner) {
		const kind = resolveKind(key, field);
		const options = optionsOf(field);
		const digits = Number.isFinite(Number((field.format || {}).digits))
			? Number(field.format.digits)
			: decimalsOfStep(field.step) ?? 2;
		const scale = Number.isFinite(Number((field.format || {}).scale)) ? Number(field.format.scale) : 1;
		return {
			actions: [],
			columns: kind === "choiceGrid" && options ? (Number(field.columns) || (options.length <= 6 ? 3 : 4)) : null,
			defaultValue: "defaultValue" in field ? clone(field.defaultValue) : undefined,
			format: { digits, scale },
			hint: field.hint || null,
			ids: { control: idFor(key), value: `${idFor(key)}-value` },
			length: kind === "colorList"
				? { maximum: Number(field.maximumLength) || 16, minimum: Number(field.minimumLength) || 1 }
				: null,
			key,
			kind,
			label: field.label || titleCase(key),
			/** A module this row is inert without; the control mounts disabled. */
			needs: field.needs || null,
			maximum: Number.isFinite(Number(field.maximum)) ? Number(field.maximum) : null,
			minimum: Number.isFinite(Number(field.minimum)) ? Number(field.minimum) : null,
			options,
			owner: owner || "adapter",
			row: "field",
			stacked: STACKED_KINDS.has(kind),
			step: Number.isFinite(Number(field.step)) ? Number(field.step) : null,
			type: field.type || null,
			unit: field.unit || "",
			visibleWhen: field.visibleWhen ? clone(field.visibleWhen) : null,
			workload: field.workload === true,
			wrap: field.wrap === true,
		};
	}

	function makeSection(id, title, extra) {
		return {
			id,
			meta: (extra && extra.meta) || null,
			open: !extra || extra.open !== false,
			origin: (extra && extra.origin) || "product",
			rows: [],
			title,
		};
	}

	/* ---------- the runtime's own sections -----------------------------------
	   Setup and Export are the shell's, not the tool's: they describe the
	   artboard every tool has and the artifact every tool makes. A tool declares
	   `canvas` and gets both; it never writes their rows. Their behaviour arrives
	   with the viewport and export modules — until those are loaded the rows mount
	   disabled and say why, rather than lying about what they do. */

	function planSetupSection(canvas, fields) {
		const section = makeSection("shell-setup", "Setup", { origin: "setup" });
		// A tool that owns an `aspect` field keeps it. Setup offering a second one
		// gives the panel two controls for one thing, and only one of them works.
		if (Array.isArray(canvas.aspects) && canvas.aspects.length && !fields.aspect) {
			section.rows.push(planField("canvas.aspect", {
				choices: canvas.aspects,
				defaultValue: canvas.aspects[0],
				label: "Aspect",
				type: "enum",
			}, "shell"));
		}
		// The artboard's size and resolution mean something only once a viewport
		// owns the stage. Without one they mount disabled and say which module
		// they are waiting for, the same way an export action does.
		// A tool that offers aspects already names the artboard's shape, and
		// its size is the long edge the tool declares. Width and Height there
		// only fight the aspect (or do nothing), so they are not offered; the
		// values still seed shell state for the pages that read them.
		const width = Number(canvas.width) || 1280;
		const height = Number(canvas.height) || 1920;
		if ((Array.isArray(canvas.aspects) && canvas.aspects.length) || (fields && fields.aspect)) {
			section.seeds = { "canvas.height": height, "canvas.width": width };
		} else {
			section.rows.push(planField("canvas.width", {
				defaultValue: width, label: "Width", maximum: 8192, minimum: 64, needs: "viewport", step: 1, type: "number", unit: " px",
			}, "shell"));
			section.rows.push(planField("canvas.height", {
				defaultValue: height, label: "Height", maximum: 8192, minimum: 64, needs: "viewport", step: 1, type: "number", unit: " px",
			}, "shell"));
		}
		section.rows.push(planField("canvas.renderScale", {
			defaultValue: Number(canvas.renderScale) || 1, format: { digits: 2 }, label: "Scale", maximum: 3, minimum: 0.25, needs: "viewport", step: 0.25, type: "number", unit: "×",
		}, "shell"));
		// `background: null` means the tool paints its own ground — dash-loom's
		// paper and page are its fields, not the shell's — so Setup does not offer
		// a switch that would fight it.
		if (canvas.background !== null) {
			section.rows.push(planField("canvas.background", {
				defaultValue: canvas.background !== false, label: "Background", type: "boolean",
			}, "shell"));
			section.rows.push(planField("canvas.backgroundColor", {
				defaultValue: typeof canvas.background === "string" ? canvas.background : "#000000",
				label: "Colour",
				type: "color",
				visibleWhen: { equals: true, target: "canvas.background" },
			}, "shell"));
		}
		return section;
	}

	function planExportSection(schema) {
		const section = makeSection("shell-export", "Export", { origin: "export" });
		section.rows.push(planField("export.format", {
			defaultValue: "png",
			label: "Format",
			options: [{ label: "PNG", value: "png" }, { label: "JPG", value: "jpg" }, { label: "SVG", value: "svg" }],
			type: "enum",
		}, "shell"));
		section.rows.push(planField("export.resolution", {
			choices: [2048, 4096, 8192], defaultValue: 4096, label: "Resolution", type: "enum", unit: " px",
		}, "shell"));
		const items = [
			{ hook: "export.image", id: "shell-export-image", label: "Export", variant: "glass" },
			{ hook: "export.copyImage", id: "shell-copy-image", label: "Copy image" },
			{ hook: "export.copySetup", id: "shell-copy-setup", label: "Copy setup" },
		];
		if (isPlainObject(schema.timeline)) items.push({ hook: "video.record", id: "shell-record", label: "Record video" });
		section.rows.push({ id: "shell-export-actions", items, row: "actions" });
		return section;
	}

	function planTimelineSection(timeline) {
		const duration = Number(timeline.duration) || 10;
		const section = makeSection("shell-timeline", "Transport", { origin: "timeline" });
		section.rows.push(planField("timeline.time", {
			defaultValue: 0, format: { digits: 2 }, label: "Time", maximum: duration, minimum: 0, step: 0.25, type: "number", unit: " s",
		}, "shell"));
		section.rows.push(planField("timeline.duration", {
			defaultValue: duration, label: "Duration", maximum: 60, minimum: 1, step: 1, type: "number", unit: " s",
		}, "shell"));
		section.rows.push(planField("timeline.loop", {
			defaultValue: timeline.loop !== false, label: "Loop", type: "boolean",
		}, "shell"));
		section.rows.push({
			id: "shell-transport-actions",
			items: [
				{ hook: "timeline.toggle", id: "shell-play", label: "Play" },
				{ hook: "timeline.stepBack", id: "shell-step-back", label: "−1 frame" },
				{ hook: "timeline.stepForward", id: "shell-step-forward", label: "+1 frame" },
			],
			row: "actions",
		});
		return section;
	}

	/* ---------- planPanel ---------------------------------------------------- */

	function planPanel(schema) {
		if (!isPlainObject(schema) || !isPlainObject(schema.fields)) {
			throw new TypeError("planPanel needs a schema object with a fields map.");
		}
		const fieldKeys = Object.keys(schema.fields);
		if (!fieldKeys.length) {
			throw new TypeError(`The ${schema.id || "unnamed"} schema declares no field, so there is no panel to plan.`);
		}

		const title = schema.name || schema.title || schema.id || "Controls";
		const declared = Array.isArray(schema.sections) && schema.sections.length ? schema.sections : null;
		const order = [];
		const byId = new Map();
		const add = (section) => {
			byId.set(section.id, section);
			order.push(section);
			return section;
		};

		if (declared) {
			for (const section of declared) {
				if (!section || !section.id) throw new TypeError(`The ${title} schema declares a section with no id.`);
				if (byId.has(section.id)) throw new TypeError(`The ${title} schema declares the section "${section.id}" twice.`);
				add(makeSection(section.id, section.title || titleCase(section.id), {
					meta: section.meta === undefined ? null : clone(section.meta),
					open: section.open,
				}));
			}
		}

		const fields = {};
		for (const key of fieldKeys) {
			const field = schema.fields[key];
			if (!isPlainObject(field)) throw new TypeError(`The field "${key}" is not an object.`);
			const home = field.section || field.group || null;
			let section;
			if (!home) {
				// Five of the lab's 97 adapters carry no group at all; they become one
				// implicit section named after the tool, rather than nothing.
				if (declared) throw new TypeError(`The field "${key}" names no section, and the ${title} schema declares its own sections.`);
				section = byId.get("shell-fields") || add(makeSection("shell-fields", title));
			} else if (byId.has(home)) {
				section = byId.get(home);
			} else if (declared) {
				throw new TypeError(`The field "${key}" names the section "${home}", which the ${title} schema does not declare.`);
			} else {
				section = add(makeSection(home, titleCase(home)));
			}
			const row = planField(key, field);
			fields[key] = row;
			section.rows.push(row);
		}

		const productSections = [...order];
		if (!productSections.length) throw new TypeError(`The ${title} schema planned no section.`);

		if (isPlainObject(schema.presets) && Object.keys(schema.presets).length) {
			productSections[0].rows.unshift({
				id: "shell-presets",
				items: Object.keys(schema.presets).map((name) => ({
					label: titleCase(name),
					name,
					patch: clone(schema.presets[name]),
				})),
				row: "presets",
			});
		}

		if (isPlainObject(schema.theme) && Object.keys(schema.theme).length) {
			productSections[productSections.length - 1].rows.push({
				id: "shell-theme",
				items: Object.keys(schema.theme).map((name) => ({
					label: titleCase(name),
					name,
					patch: clone(schema.theme[name]),
					swatch: Object.values(schema.theme[name])[0],
				})),
				row: "swatches",
			});
		}

		/* keys and actions */
		const legend = [];
		const keyConflicts = [];
		const takeKey = (key, label, actionId) => {
			const token = String(key).toLowerCase();
			if (legend.some((entry) => entry.key === token)) {
				if (actionId) keyConflicts.push({ actionId, key: token });
				return false;
			}
			legend.push({ key: token, label });
			return true;
		};
		for (const built of BUILT_IN_KEYS) takeKey(built.key, built.label);
		if (isPlainObject(schema.timeline)) takeKey("space", "play");

		// A tool that declares its own Randomise or Reseed keeps it; the shell's
		// built-ins exist to fill the gap, never to shadow the tool's own verb.
		const declaredActions = Array.isArray(schema.actions) ? schema.actions : [];
		const claims = (capability, hook) => declaredActions.some((action) => action
			&& (action.capability === capability || action.hook === hook));

		const seedKey = Object.keys(fields).find((key) => isSeedField(key, schema.fields[key]));
		if (seedKey && !claims("reseed-renderer", "state.reseed")) {
			fields[seedKey].actions.push({ field: seedKey, hook: "state.reseed", id: "shell-reseed", key: "r", label: "Reseed" });
			takeKey("r", "reseed");
		}
		if (schema.randomise !== false && !claims("randomize", "state.randomise")) {
			takeKey("v", "randomise");
		}

		const looseActions = new Map();
		for (const action of declaredActions) {
			if (!isPlainObject(action) || !action.id) throw new TypeError(`The ${title} schema declares an action with no id.`);
			const planned = {
				capability: action.capability || null,
				hook: action.hook || null,
				id: action.id,
				key: action.key ? String(action.key).toLowerCase() : null,
				label: action.label || titleCase(action.id),
				payload: action.payload === undefined ? null : clone(action.payload),
				title: action.hint || null,
			};
			if (planned.key && !takeKey(planned.key, String(planned.label).toLowerCase(), planned.id)) planned.key = null;
			if (action.field) {
				if (!fields[action.field]) throw new TypeError(`The action "${action.id}" names the field "${action.field}", which the ${title} schema does not declare.`);
				fields[action.field].actions.push(planned);
				continue;
			}
			const home = action.section || productSections[productSections.length - 1].id;
			if (!byId.has(home)) throw new TypeError(`The action "${action.id}" names the section "${home}", which the ${title} schema does not declare.`);
			if (!looseActions.has(home)) looseActions.set(home, []);
			looseActions.get(home).push(planned);
		}
		for (const [home, items] of looseActions) {
			byId.get(home).rows.push({ id: `shell-actions-${home}`, items, row: "actions" });
		}

		/* the runtime's own sections wrap the tool's */
		const sections = [...productSections];
		if (isPlainObject(schema.timeline)) sections.push(planTimelineSection(schema.timeline));
		if (isPlainObject(schema.canvas)) {
			sections.unshift(planSetupSection(schema.canvas, schema.fields));
			sections.push(planExportSection(schema));
		}
		const builtIn = [];
		if (schema.randomise !== false && !claims("randomize", "state.randomise")) {
			productSections[0].rows.push({
				id: "shell-compose-actions",
				items: [{ hook: "state.randomise", id: "shell-randomise", key: "v", label: "Randomise", title: "Roll every control by its own bounds; the seed stays" }],
				row: "actions",
			});
		}
		if (schema.shareable !== false) {
			builtIn.push({ hook: "state.copyLink", id: "shell-copy-link", key: null, label: "Copy link", title: "A link that opens this tool in this exact state" });
		}
		if (builtIn.length) {
			sections[sections.length - 1].rows.push({ id: "shell-link-actions", items: builtIn, row: "actions" });
		}
		if (legend.length) {
			sections[sections.length - 1].rows.push({ entries: legend, id: "shell-legend", row: "legend" });
		}

		/* every condition must name something the panel actually holds */
		const rowsByKey = {};
		for (const section of sections) {
			for (const row of section.rows) {
				if (row.row === "field") rowsByKey[row.key] = row;
			}
		}
		for (const section of sections) {
			for (const row of section.rows) {
				if (row.row !== "field" || !row.visibleWhen) continue;
				const target = row.visibleWhen.target;
				if (!target || !rowsByKey[target]) {
					throw new TypeError(`The row "${row.key}" is shown only when "${target}" holds a value, and the ${title} schema declares no such field.`);
				}
			}
			if (section.meta && isPlainObject(section.meta) && section.meta.field && !rowsByKey[section.meta.field]) {
				throw new TypeError(`The section "${section.id}" reads its meta from "${section.meta.field}", which the ${title} schema does not declare.`);
			}
		}

		return {
			canvas: isPlainObject(schema.canvas) ? clone(schema.canvas) : null,
			fields,
			id: schema.id || null,
			/** Fields the panel reports but does not edit. */
			opaque: Object.keys(fields).filter((key) => OPAQUE_KINDS.has(fields[key].kind)),
			keyConflicts,
			legend,
			rowsByKey,
			sections,
			title,
			version: Number(schema.version) || 1,
		};
	}

	/* ---------- mountPanel ---------------------------------------------------
	   Everything below needs a document. It is proven in the browser through
	   `_system/shell/proof.html` and the page probes, never by a unit test. */

	function mountPanel(container, tree, adapter, options) {
		options = options || {};
		const doc = options.document || (container && container.ownerDocument) || global.document;
		if (!container || !doc) throw new TypeError("mountPanel needs a container in a document.");
		if (!tree || !Array.isArray(tree.sections)) throw new TypeError("mountPanel needs a tree from planPanel.");
		if (!adapter || typeof adapter.configure !== "function") throw new TypeError("mountPanel needs an adapter.");

		const core = (global.SUPERMEGA_INSTRUMENT_ADAPTERS || {}).core || null;
		const hooks = shell.hooks || (shell.hooks = {});
		const shellState = options.shellState || createShellState(tree);
		const listeners = [];
		const controls = new Map();
		let syncing = false;

		const el = (tag, attributes, children) => {
			const node = doc.createElement(tag);
			for (const [name, value] of Object.entries(attributes || {})) {
				if (value === null || value === undefined || value === false) continue;
				if (name === "text") node.textContent = String(value);
				else if (name === "html") node.innerHTML = String(value);
				else if (name === "class") node.className = value;
				else node.setAttribute(name, value === true ? "" : String(value));
			}
			for (const child of children || []) if (child) node.appendChild(child);
			return node;
		};
		const on = (target, type, handler, capture) => {
			target.addEventListener(type, handler, capture);
			listeners.push(() => target.removeEventListener(type, handler, capture));
		};

		const readValue = (row) => (row.owner === "shell" ? shellState.get(row.key) : adapter.getConfiguration()[row.key]);
		const writeValue = (row, value) => {
			if (row.owner === "shell") shellState.set(row.key, value);
			else adapter.configure({ [row.key]: value });
		};

		/* ---------- rows ---------- */

		function labelFor(row, forId) {
			return el(forId ? "label" : "span", { class: "instrument-row-label", for: forId, text: row.label });
		}

		function valueCell(row) {
			// A readonly mini-input beside a range is what adapter-core upgrades into
			// a typed entry; a bare tabular number cannot be typed into. The cell
			// carries its own scale and decimals, because it reads in display units
			// (65%) while the range holds the schema's (0.65).
			const unit = String(row.unit || "").trim();
			return el("span", { class: "instrument-row-value instrument-mini-field", "data-instrument-align": "right" }, [
				el("input", {
					class: "instrument-mini-input instrument-tabular",
					"data-instrument-digits": row.format.digits,
					"data-instrument-scale": row.format.scale === 1 ? null : row.format.scale,
					"data-instrument-unit": row.unit || null,
					id: row.ids.value,
					readonly: true,
					tabindex: "-1",
					value: formatNumber(row, readValue(row)),
				}),
				unit ? el("span", { class: "instrument-mini-suffix", text: unit }) : null,
			]);
		}

		function formatNumber(row, value) {
			const number = Number(value);
			if (!Number.isFinite(number)) return "";
			return (number * row.format.scale).toFixed(row.format.digits);
		}

		function rangeInput(row, extra) {
			return el("input", Object.assign({
				class: "instrument-range",
				"data-instrument-wrap": row.wrap ? "true" : null,
				id: row.ids.control,
				max: row.maximum === null ? null : row.maximum,
				min: row.minimum === null ? null : row.minimum,
				step: row.step === null ? "any" : row.step,
				title: row.hint,
				type: "range",
				value: Number(readValue(row)) || 0,
			}, extra || {}));
		}

		function actionButton(item) {
			const disabled = item.hook && !hooks[item.hook];
			const button = el("button", {
				class: "instrument-action",
				"data-shell-action": item.id,
				disabled: disabled || null,
				title: disabled ? `${item.label} arrives with the ${String(item.hook).split(".")[0]} module.` : item.title || null,
				type: "button",
			}, [doc.createTextNode(item.label)]);
			return button;
		}

		function choiceButtons(row) {
			return row.options.map((option, index) => el("button", {
				"aria-pressed": "false",
				class: "instrument-action",
				"data-shell-index": index,
				"data-shell-target": row.key,
				title: option.hint || null,
				type: "button",
			}, [doc.createTextNode(option.label)]));
		}

		function buildControl(row) {
			switch (row.kind) {
				case "range":
					return [el("div", { class: "instrument-row-control" }, [rangeInput(row)]), valueCell(row)];
				case "seed":
					return [
						el("div", { class: "instrument-row-control" }, [rangeInput(row)]),
						valueCell(row),
					];
				case "angle": {
					const input = rangeInput(row, { class: "instrument-range instrument-angle-input", "data-instrument-wrap": "true" });
					return [el("div", { class: "instrument-row-control" }, [
						el("div", { class: "instrument-angle", "data-instrument-face": "dial", "data-instrument-wrap": "true" }, [
							el("div", { class: "instrument-angle-dial" }, [el("div", { class: "instrument-angle-dial-indicator" })]),
							el("div", { class: "instrument-angle-row" }, [
								el("output", { class: "instrument-angle-value instrument-tabular", for: row.ids.control, id: row.ids.value }),
								input,
							]),
						]),
					])];
				}
				case "switch":
					return [
						el("div", { class: "instrument-row-control" }, [el("input", {
							class: "instrument-switch", id: row.ids.control, role: "switch", title: row.hint, type: "checkbox",
						})]),
						el("span", { class: "instrument-row-value instrument-tabular", id: row.ids.value }),
					];
				case "toggle":
					return [
						el("div", { class: "instrument-row-control" }, [el("input", {
							class: "instrument-choice instrument-renderer-checkbox", id: row.ids.control, title: row.hint, type: "checkbox",
						})]),
						el("span", { class: "instrument-row-value instrument-tabular", id: row.ids.value }),
					];
				case "select":
					return [
						el("div", { class: "instrument-row-control" }, [
							el("span", { class: "instrument-mini-select" }, [
								el("select", { "aria-label": row.label, class: "instrument-mini-select-input", id: row.ids.control, title: row.hint },
									row.options.map((option, index) => el("option", { text: option.label, value: index }))),
								el("span", { "aria-hidden": "true", class: "instrument-mini-select-caret", text: "⌄" }),
							]),
						]),
						el("span", {}),
					];
				case "color":
					return [
						el("div", { class: "instrument-row-control" }, [
							el("span", { class: "instrument-color-field" }, [
								el("span", { class: "instrument-color-swatch" }, [
									el("input", { "aria-label": `${row.label} picker`, class: "instrument-color-picker", id: row.ids.control, type: "color" }),
								]),
								el("input", {
									"aria-label": `${row.label} hex`, autocomplete: "off", class: "instrument-control instrument-text-field instrument-color-hex",
									id: row.ids.value, spellcheck: "false",
								}),
							]),
						]),
						el("span", {}),
					];
				case "text":
					return [
						el("div", { class: "instrument-row-control" }, [
							el("input", { class: "instrument-control instrument-text-field", id: row.ids.control, title: row.hint, type: "text" }),
						]),
						el("span", {}),
					];
				case "colorList":
					return [el("div", { class: "instrument-renderer-color-list", "data-shell-list": row.key })];
				case "opaque":
					return [
						el("div", { class: "instrument-row-control" }, [
							el("input", {
								class: "instrument-control instrument-text-field",
								disabled: true,
								id: row.ids.control,
								title: row.hint || `${row.label} is part of the composition but is not edited in the panel.`,
								type: "text",
							}),
						]),
						el("span", { class: "instrument-row-value instrument-tabular", id: row.ids.value }),
					];
				case "segments":
					return [el("fieldset", { "aria-label": row.label, class: "instrument-renderer-choice", "data-shell-choice": row.key }, choiceButtons(row))];
				case "choiceGrid":
					return [el("fieldset", {
						"aria-label": row.label,
						class: "instrument-renderer-choice-grid",
						"data-shell-choice": row.key,
						style: `--instrument-choice-columns:${row.columns || 3}`,
					}, choiceButtons(row))];
				case "swatch":
					return [el("div", { "aria-label": row.label, class: "instrument-renderer-swatches", "data-shell-choice": row.key },
						row.options.map((option, index) => el("button", {
							"aria-label": option.label,
							"aria-pressed": "false",
							class: "instrument-swatch instrument-renderer-swatch",
							"data-shell-index": index,
							"data-shell-target": row.key,
							style: `background:${option.value}`,
							type: "button",
						})))];
				case "rangePair": {
					const [lower, upper] = Array.isArray(readValue(row)) ? readValue(row) : [row.minimum, row.maximum];
					return [el("fieldset", { "aria-label": row.label, class: "instrument-range-pair", "data-shell-pair": row.key }, [
						el("input", {
							"aria-label": `${row.label} lower`, class: "instrument-range-pair-input", "data-instrument-thumb": "lower",
							id: row.ids.control, max: row.maximum, min: row.minimum, step: row.step || "any", type: "range", value: lower,
						}),
						el("input", {
							"aria-label": `${row.label} upper`, class: "instrument-range-pair-input", "data-instrument-thumb": "upper",
							id: `${row.ids.control}-upper`, max: row.maximum, min: row.minimum, step: row.step || "any", type: "range", value: upper,
						}),
					])];
				}
				case "vector": {
					const axis = (name, label) => el("div", { class: "instrument-vector-pad-axis" }, [
						el("span", { class: "instrument-vector-pad-axis-label", text: label }),
						el("div", {
							"aria-label": label, "aria-valuemax": row.maximum === null ? 1 : row.maximum, "aria-valuemin": row.minimum === null ? 0 : row.minimum,
							"aria-valuenow": "0", class: "instrument-vector-pad-axis-value instrument-tabular", "data-instrument-step": row.step || 0.01,
							"data-shell-axis": name, role: "slider", tabindex: "0", text: "0",
						}),
					]);
					return [el("fieldset", { "aria-label": row.label, class: "instrument-vector-pad", "data-shell-pad": row.key }, [
						el("div", { class: "instrument-vector-pad-surface", id: row.ids.control, tabindex: "-1" }, [
							el("div", { class: "instrument-vector-pad-indicator" }),
						]),
						el("div", { class: "instrument-vector-pad-axes" }, [axis("x", "X"), axis("y", "Y")]),
					])];
				}
				case "light": {
					const axis = (name, label, max, wrap) => el("div", { class: "instrument-light-pad-axis" }, [
						el("span", { class: "instrument-light-pad-axis-label", text: label }),
						el("div", {
							"aria-label": label, "aria-valuemax": max, "aria-valuemin": 0, "aria-valuenow": "0",
							class: "instrument-light-pad-axis-value instrument-tabular", "data-instrument-step": "1",
							"data-instrument-wrap": wrap ? "true" : null, "data-shell-axis": name, role: "slider", tabindex: "0", text: "0",
						}, [el("span", { "aria-hidden": "true", class: "instrument-light-pad-axis-unit", text: "°" })]),
					]);
					return [el("fieldset", { "aria-label": row.label, class: "instrument-light-pad", "data-shell-pad": row.key }, [
						el("div", {
							"data-instrument-azimuth": "135", "data-instrument-elevation-max": "90", "data-instrument-elevation-min": "0",
							class: "instrument-light-pad-surface", id: row.ids.control, tabindex: "-1",
						}, [
							el("div", { "aria-hidden": "true", class: "instrument-light-pad-sphere" }),
							el("div", { class: "instrument-light-pad-indicator" }),
						]),
						el("output", { class: "instrument-light-pad-reading", id: row.ids.value }),
						el("div", { class: "instrument-light-pad-axes" }, [axis("azimuth", "Azimuth", 360, true), axis("elevation", "Elevation", 90, false)]),
					])];
				}
				default:
					throw new TypeError(`The field "${row.key}" declares kind "${row.kind}", which the shell plans but does not mount yet.`);
			}
		}

		function buildFieldRow(row) {
			if (UNMOUNTED_KINDS.has(row.kind)) {
				throw new TypeError(`The field "${row.key}" declares kind "${row.kind}", which the shell plans but does not mount yet.`);
			}
			const parts = buildControl(row);
			const actions = row.actions.length
				? el("div", { class: "instrument-renderer-actions" }, row.actions.map(actionButton))
				: null;
			if (row.stacked) {
				return el("div", { class: "instrument-renderer-stack", "data-shell-row": row.key }, [
					el("span", { class: "instrument-row-label", text: row.label, title: row.hint }),
					...parts,
					actions,
				]);
			}
			const node = el("div", { class: "instrument-row", "data-shell-row": row.key }, [
				labelFor(row, row.ids.control),
				...parts,
			]);
			return actions
				? el("div", { class: "instrument-renderer-stack", "data-shell-row": row.key }, [node, actions])
				: node;
		}

		function buildRow(row) {
			if (row.row === "field") {
				controls.set(row.key, row);
				return buildFieldRow(row);
			}
			if (row.row === "actions") {
				return el("div", { class: "instrument-renderer-stack" }, [
					el("div", { class: "instrument-renderer-actions" }, row.items.map((item) => (item.variant === "glass"
						? el("span", { class: "instrument-action-glass-wrap" }, [
							el("button", { class: "instrument-action-glass", "data-shell-action": item.id, type: "button" }, [
								el("span", { class: "instrument-action-glass-content", text: item.label }),
							]),
							el("span", { "aria-hidden": "true", class: "instrument-action-glass-shadow" }),
						])
						: actionButton(item)))),
				]);
			}
			if (row.row === "swatches") {
				return el("div", { class: "instrument-row" }, [
					el("span", { class: "instrument-row-label", text: "Theme" }),
					el("div", { class: "instrument-row-control instrument-renderer-swatches", "data-shell-themes": "" },
						row.items.map((item, index) => el("button", {
							"aria-label": item.label, "aria-pressed": "false", class: "instrument-swatch instrument-renderer-swatch",
							"data-shell-theme": index, style: `background:${item.swatch}`, type: "button",
						}))),
					el("span", {}),
				]);
			}
			if (row.row === "presets") {
				return el("div", { class: "instrument-renderer-stack" }, [
					el("span", { class: "instrument-row-label", text: "Preset" }),
					el("div", { class: "instrument-renderer-choice-grid", "data-shell-presets": "", style: "--instrument-choice-columns:3" },
						row.items.map((item, index) => el("button", {
							"aria-pressed": "false", class: "instrument-action", "data-shell-preset": index, type: "button", text: item.label,
						}))),
				]);
			}
			if (row.row === "legend") {
				return el("span", {
					class: "instrument-help",
					text: row.entries.map((entry) => `${entry.key === "space" ? "space" : entry.key.toUpperCase()} ${entry.label}`).join(" · "),
				});
			}
			return null;
		}

		/* ---------- the panel ---------- */

		const titleId = `${idFor(tree.id || "shell")}-title`;
		const sectionNodes = tree.sections.map((section) => {
			const body = el("div", { class: "instrument-disclosure-body" }, [
				el("div", { class: "instrument-group" }, section.rows.map(buildRow)),
			]);
			return el("details", {
				class: "instrument-disclosure",
				"data-instrument-variant": "section",
				"data-shell-section": section.id,
				open: section.open || null,
			}, [
				el("summary", {}, [
					el("span", { class: "instrument-disclosure-label", text: section.title }),
					el("span", { class: "instrument-disclosure-meta", "data-shell-meta": section.id }),
					el("button", {
						"aria-label": `Reset ${section.title}`,
						class: "instrument-action instrument-renderer-section-reset",
						"data-shell-reset": section.id,
						title: `Restore ${section.title} to its defaults`,
						type: "button",
					}, [doc.createTextNode("↺")]),
				]),
				body,
			]);
		});

		const statusStrip = el("div", {
			class: "instrument-status", "data-instrument-tone": "active", "data-shell-status": "", role: "status",
		}, [
			el("span", { "aria-hidden": "true", class: "instrument-status-mark" }),
			el("span", { text: tree.title }),
			el("span", { class: "instrument-status-value instrument-tabular", "data-shell-status-value": "", text: "READY" }),
		]);

		const panel = el("section", { "aria-labelledby": titleId, class: "instrument-panel" }, [
			el("header", { class: "instrument-panel-header" }, [
				el("h2", { class: "instrument-panel-title", id: titleId, text: tree.title }),
			]),
			...sectionNodes,
			statusStrip,
		]);
		container.textContent = "";
		container.dataset.shellPanel = "generated";
		container.appendChild(panel);

		/* ---------- chrome: undo and redo ---------- */
		const chrome = options.chrome === null
			? null
			: options.chrome || doc.querySelector(".instrument-renderer-chrome-zone--end");
		let undoButton = null;
		let redoButton = null;
		if (chrome && typeof adapter.undo === "function") {
			undoButton = el("button", {
				"aria-label": "Undo", class: "instrument-action instrument-renderer-chrome-action",
				"data-shell-action": "shell-undo", title: "Step back (⌘Z)", type: "button",
			}, [doc.createTextNode("↺")]);
			redoButton = el("button", {
				"aria-label": "Redo", class: "instrument-action instrument-renderer-chrome-action",
				"data-shell-action": "shell-redo", title: "Step forward (⇧⌘Z)", type: "button",
			}, [doc.createTextNode("↻")]);
			chrome.insertBefore(redoButton, chrome.firstChild);
			chrome.insertBefore(undoButton, redoButton);
			on(undoButton, "click", () => adapter.undo());
			on(redoButton, "click", () => adapter.redo());
		}

		/**
		 * Showing and hiding the panel is the shell's: every page had the same
		 * eight lines, the same `h` key and the same `data-controls` attribute.
		 * A page marks its chrome button `data-shell-action="shell-controls"`, or
		 * passes one, and stops owning the behaviour.
		 */
		const controlsButton = options.controlsButton === null
			? null
			: options.controlsButton || doc.querySelector('[data-shell-action="shell-controls"]') || doc.getElementById("toggle");

		function setControls(visible) {
			const shown = visible === undefined ? container.classList.contains("hidden") : Boolean(visible);
			container.classList.toggle("hidden", !shown);
			doc.body.dataset.controls = shown ? "visible" : "hidden";
			if (controlsButton) controlsButton.setAttribute("aria-pressed", String(shown));
			if (typeof options.onControls === "function") options.onControls(shown);
			return { visible: shown };
		}
		if (controlsButton) on(controlsButton, "click", () => setControls());

		/* ---------- binding: the panel writes only through configure ---------- */

		const rowFor = (node) => {
			const holder = node.closest("[data-shell-row]");
			return holder ? controls.get(holder.dataset.shellRow) : null;
		};

		on(panel, "input", (event) => {
			if (syncing) return;
			const target = event.target;
			const row = rowFor(target);
			if (!row) return;
			// Only the row's own control writes. A range row also holds a value cell,
			// and adapter-core owns that one: reading its keystrokes here wrote the
			// read-out's number (80%) into the schema's units and clamped it to the
			// maximum. The cell reaches the adapter through the range, as it should.
			const isControl = target.id === row.ids.control;
			if (isControl && (row.kind === "range" || row.kind === "seed" || row.kind === "angle")) writeValue(row, Number(target.value));
			else if (row.kind === "rangePair" && target.classList.contains("instrument-range-pair-input")) writeValue(row, readPair(row));
			else if (row.kind === "color" && target.classList.contains("instrument-color-picker")) writeValue(row, target.value);
			else if (row.kind === "colorList" && target.classList.contains("instrument-color-picker")) {
				const index = Number(String(target.id).replace(`${row.ids.control}-`, ""));
				const list = [...(readValue(row) || [])];
				list[index] = target.value;
				writeValue(row, list);
			}
			else if (row.kind === "text" && isControl) writeValue(row, target.value);
		});

		on(panel, "change", (event) => {
			if (syncing) return;
			const target = event.target;
			const row = rowFor(target);
			if (!row) return;
			if ((row.kind === "switch" || row.kind === "toggle") && target.id === row.ids.control) writeValue(row, Boolean(target.checked));
			else if (row.kind === "select" && target.id === row.ids.control) writeValue(row, clone(row.options[Number(target.value)].value));
			else if (row.kind === "colorList" && target.classList.contains("instrument-color-hex")) {
				const raw = String(target.value).trim().replace(/^([0-9a-fA-F]{6})$/u, "#$1");
				const index = Number(String(target.id).replace(`${row.ids.control}-`, "").replace("-hex", ""));
				if (/^#[0-9a-fA-F]{6}$/u.test(raw)) {
					const list = [...(readValue(row) || [])];
					list[index] = raw.toLowerCase();
					writeValue(row, list);
				} else sync();
			}
			else if (row.kind === "color" && target.classList.contains("instrument-color-hex")) {
				const raw = String(target.value).trim().replace(/^([0-9a-fA-F]{6})$/u, "#$1");
				if (/^#[0-9a-fA-F]{6}$/u.test(raw)) writeValue(row, raw.toLowerCase());
				else sync();
			}
		});

		on(panel, "click", (event) => {
			const target = event.target.closest("button");
			if (!target) return;
			if (target.dataset.shellIndex !== undefined) {
				const row = controls.get(target.dataset.shellTarget);
				if (row) writeValue(row, clone(row.options[Number(target.dataset.shellIndex)].value));
				return;
			}
			if (target.dataset.shellPreset !== undefined) {
				const preset = findRow("presets").items[Number(target.dataset.shellPreset)];
				adapter.configure(clone(preset.patch));
				return;
			}
			if (target.dataset.shellTheme !== undefined) {
				const theme = findRow("swatches").items[Number(target.dataset.shellTheme)];
				adapter.configure(clone(theme.patch));
				return;
			}
			if (target.dataset.shellColourRemove !== undefined || target.dataset.shellColourAdd !== undefined) {
				const row = rowFor(target);
				if (!row) return;
				const list = [...(readValue(row) || [])];
				if (target.dataset.shellColourAdd !== undefined) {
					if (list.length >= row.length.maximum) return;
					list.push(list[list.length - 1] || "#f61515");
				} else {
					if (list.length <= row.length.minimum) return;
					list.splice(Number(target.dataset.shellColourRemove), 1);
				}
				writeValue(row, list);
				return;
			}
			if (target.dataset.shellReset !== undefined) {
				// A button inside a summary would otherwise toggle the disclosure.
				event.preventDefault();
				event.stopPropagation();
				resetSection(target.dataset.shellReset);
				return;
			}
			if (target.dataset.shellAction !== undefined) runAction(target.dataset.shellAction);
		});

		/* pads speak through the kit runtime, in real units, not pixels */
		on(panel, "instrument:vector", (event) => {
			const row = rowFor(event.target);
			if (!row || syncing) return;
			const current = readValue(row);
			writeValue(row, Array.isArray(current) ? [event.detail.x, event.detail.y] : { x: event.detail.x, y: event.detail.y });
		});
		on(panel, "instrument:light", (event) => {
			const row = rowFor(event.target);
			if (!row || syncing) return;
			writeValue(row, { azimuth: event.detail.azimuth, elevation: event.detail.elevation });
		});

		function readPair(row) {
			const lower = Number(doc.getElementById(row.ids.control).value);
			const upper = Number(doc.getElementById(`${row.ids.control}-upper`).value);
			return lower <= upper ? [lower, upper] : [upper, lower];
		}

		function findRow(kind) {
			for (const section of tree.sections) {
				const found = section.rows.find((row) => row.row === kind);
				if (found) return found;
			}
			return null;
		}

		function allActions() {
			const out = new Map();
			for (const section of tree.sections) {
				for (const row of section.rows) {
					if (row.row === "actions") for (const item of row.items) out.set(item.id, item);
					if (row.row === "field") for (const item of row.actions) out.set(item.id, item);
				}
			}
			return out;
		}
		const actionsById = allActions();

		function runAction(id) {
			if (id === "shell-undo") return adapter.undo && adapter.undo();
			if (id === "shell-redo") return adapter.redo && adapter.redo();
			if (id === "shell-controls") return setControls();
			const action = actionsById.get(id);
			if (!action) return null;
			if (action.hook && hooks[action.hook]) return hooks[action.hook]({ action, adapter, shellState, tree });
			if (action.capability && typeof adapter.execute === "function") return adapter.execute(action.capability, action.payload || {});
			return null;
		}

		/** A section reset restores that section's targets, hidden rows included. */
		function resetSection(id) {
			const section = tree.sections.find((entry) => entry.id === id);
			if (!section) return;
			const defaults = typeof options.defaults === "function" ? options.defaults() : options.defaults || null;
			const patch = {};
			for (const row of section.rows) {
				if (row.row !== "field") continue;
				if (row.owner === "shell") {
					if (row.defaultValue !== undefined) shellState.set(row.key, clone(row.defaultValue));
					continue;
				}
				if (defaults && row.key in defaults) patch[row.key] = clone(defaults[row.key]);
			}
			if (Object.keys(patch).length) adapter.configure(patch);
			sync();
		}

		/* ---------- syncing: one listener, every row ---------- */

		function syncRow(row) {
			const value = readValue(row);
			const control = doc.getElementById(row.ids.control);
			const readout = doc.getElementById(row.ids.value);
			switch (row.kind) {
				case "angle":
				case "range":
				case "seed":
					if (control) control.value = String(Number(value));
					if (readout) {
						// Never while it is being typed into. A running transport syncs
						// every row sixty times a second, and this line stomped the
						// half-typed number out of the cell under the cursor.
						if (readout.tagName !== "INPUT") readout.textContent = formatFieldValue(value, row);
						else if (doc.activeElement !== readout) readout.value = formatNumber(row, value);
					}
					break;
				case "rangePair": {
					const pair = Array.isArray(value) ? value : [row.minimum, row.maximum];
					if (control) control.value = String(pair[0]);
					const upper = doc.getElementById(`${row.ids.control}-upper`);
					if (upper) upper.value = String(pair[1]);
					break;
				}
				case "switch":
				case "toggle":
					if (control) control.checked = Boolean(value);
					if (readout) readout.textContent = value ? "ON" : "OFF";
					break;
				case "select": {
					const index = row.options.findIndex((option) => JSON.stringify(option.value) === JSON.stringify(value));
					if (control && index >= 0) control.value = String(index);
					break;
				}
				case "color":
					if (control) {
						control.value = String(value);
						if (control.parentElement) control.parentElement.style.background = String(value);
					}
					if (readout && doc.activeElement !== readout) readout.value = String(value);
					break;
				case "text":
					if (control && doc.activeElement !== control) control.value = value == null ? "" : String(value);
					break;
				case "colorList": {
					const host = panel.querySelector(`[data-shell-list="${cssEscape(row.key)}"]`);
					if (!host) break;
					const colours = Array.isArray(value) ? value : [];
					// Rebuild only when the length changes; otherwise a re-render on
					// every sync would take the focus out of the field being typed in.
					if (host.childElementCount !== colours.length + 1) {
						host.textContent = "";
						colours.forEach((colour, index) => {
							const last = index === colours.length - 1;
							host.appendChild(el("div", { class: "instrument-row", "data-shell-colour": index }, [
								el("label", { class: "instrument-row-label", for: `${row.ids.control}-${index}-hex`, text: row.lastLabel && last ? row.lastLabel : `${row.label} ${index + 1}` }),
								el("div", { class: "instrument-row-control" }, [
									el("span", { class: "instrument-color-field" }, [
										el("span", { class: "instrument-color-swatch" }, [
											el("input", { "aria-label": `Colour ${index + 1}`, class: "instrument-color-picker", id: `${row.ids.control}-${index}`, type: "color", value: colour }),
										]),
										el("input", {
											"aria-label": `Colour ${index + 1} hex`, autocomplete: "off",
											class: "instrument-control instrument-text-field instrument-color-hex",
											id: `${row.ids.control}-${index}-hex`, spellcheck: "false", value: colour,
										}),
									]),
								]),
								el("button", {
									"aria-label": `Remove colour ${index + 1}`, class: "instrument-action",
									"data-shell-colour-remove": index,
									disabled: colours.length <= row.length.minimum || null,
									title: "Remove this colour", type: "button",
								}, [doc.createTextNode("×")]),
							]));
						});
						host.appendChild(el("button", {
							class: "instrument-action", "data-shell-colour-add": "",
							disabled: colours.length >= row.length.maximum || null,
							title: `Add a colour (up to ${row.length.maximum})`, type: "button",
						}, [doc.createTextNode("Add colour")]));
					} else {
						colours.forEach((colour, index) => {
							const picker = doc.getElementById(`${row.ids.control}-${index}`);
							const hex = doc.getElementById(`${row.ids.control}-${index}-hex`);
							if (picker) {
								picker.value = colour;
								if (picker.parentElement) picker.parentElement.style.background = colour;
							}
							if (hex && doc.activeElement !== hex) hex.value = colour;
						});
					}
					break;
				}
				case "opaque": {
					const count = Array.isArray(value) ? value.length : isPlainObject(value) ? Object.keys(value).length : null;
					if (control) control.value = count === null ? String(value == null ? "" : value) : `${count} item${count === 1 ? "" : "s"}`;
					if (readout) readout.textContent = count === null ? "" : String(count);
					break;
				}
				case "choiceGrid":
				case "segments":
				case "swatch": {
					const holder = panel.querySelector(`[data-shell-choice="${cssEscape(row.key)}"]`);
					if (!holder) break;
					const serialized = JSON.stringify(value);
					holder.querySelectorAll("button[data-shell-index]").forEach((button) => {
						const option = row.options[Number(button.dataset.shellIndex)];
						button.setAttribute("aria-pressed", String(JSON.stringify(option.value) === serialized));
					});
					break;
				}
				case "vector":
				case "light": {
					const pad = panel.querySelector(`[data-shell-pad="${cssEscape(row.key)}"]`);
					if (!pad) break;
					const readings = row.kind === "vector"
						? [numberAt(value, "x", 0), numberAt(value, "y", 1)]
						: [numberAt(value, "azimuth", 0), numberAt(value, "elevation", 1)];
					pad.querySelectorAll("[data-shell-axis]").forEach((axis, index) => {
						axis.setAttribute("aria-valuenow", String(readings[index]));
						const unit = axis.querySelector(".instrument-light-pad-axis-unit, .instrument-vector-pad-axis-unit");
						axis.textContent = String(readings[index]);
						if (unit) axis.appendChild(unit);
					});
					break;
				}
				default:
					break;
			}
		}

		function numberAt(value, name, index) {
			if (Array.isArray(value)) return Number(value[index]) || 0;
			if (isPlainObject(value)) return Number(value[name]) || 0;
			return 0;
		}

		function cssEscape(value) {
			return String(value).replace(/["\\]/gu, "\\$&");
		}

		function syncPresets() {
			const configuration = adapter.getConfiguration();
			const presets = findRow("presets");
			if (presets) {
				panel.querySelectorAll("[data-shell-preset]").forEach((button) => {
					const patch = presets.items[Number(button.dataset.shellPreset)].patch;
					button.setAttribute("aria-pressed", String(Object.keys(patch).every((key) => JSON.stringify(configuration[key]) === JSON.stringify(patch[key]))));
				});
			}
			const themes = findRow("swatches");
			if (themes) {
				panel.querySelectorAll("[data-shell-theme]").forEach((button) => {
					const patch = themes.items[Number(button.dataset.shellTheme)].patch;
					button.setAttribute("aria-pressed", String(Object.keys(patch).every((key) => JSON.stringify(configuration[key]) === JSON.stringify(patch[key]))));
				});
			}
		}

		function syncMeta() {
			const configuration = adapter.getConfiguration();
			for (const section of tree.sections) {
				const node = panel.querySelector(`[data-shell-meta="${cssEscape(section.id)}"]`);
				if (!node) continue;
				if (!section.meta) node.textContent = "";
				else if (typeof section.meta === "string") node.textContent = section.meta;
				else if (section.meta.field) {
					const row = tree.rowsByKey[section.meta.field];
					node.textContent = formatFieldValue(configuration[section.meta.field], row || {});
				}
			}
		}

		/**
		 * A module that registers a hook after the mount must light its buttons.
		 * Deciding this once at mount left Randomise and Reseed greyed out while
		 * their keyboard shortcuts worked, which is the worst of both.
		 */
		/** A row waiting for a module it does not have is disabled and says so. */
		function syncNeeds() {
			for (const row of controls.values()) {
				if (!row.needs) continue;
				const missing = !shell.modules || !shell.modules[row.needs];
				for (const id of [row.ids.control, `${row.ids.control}-upper`]) {
					const node = doc.getElementById(id);
					if (!node) continue;
					node.disabled = missing;
					node.title = missing ? `${row.label} arrives with the ${row.needs} module.` : row.hint || "";
				}
			}
		}

		function syncActions() {
			panel.querySelectorAll("[data-shell-action]").forEach((button) => {
				const action = actionsById.get(button.dataset.shellAction);
				if (!action || !action.hook) return;
				const missing = !hooks[action.hook];
				button.disabled = missing;
				button.title = missing
					? `${action.label} arrives with the ${String(action.hook).split(".")[0]} module.`
					: action.title || "";
			});
		}

		/**
		 * Narrow a row's options after the mount. A format the page cannot write
		 * should not be on the menu: offering it is a button that reports an error
		 * instead of doing the thing it is named after.
		 */
		function setRowOptions(key, values) {
			const row = tree.rowsByKey[key];
			if (!row || !row.options) return null;
			const kept = row.options.filter((option) => values.some((value) => JSON.stringify(value) === JSON.stringify(option.value)));
			if (!kept.length || kept.length === row.options.length) return row.options;
			row.options = kept;
			row.kind = kept.length <= 4 ? "segments" : kept.length <= 8 ? "choiceGrid" : "select";
			const holder = panel.querySelector(`[data-shell-choice="${cssEscape(key)}"]`);
			if (holder) {
				holder.querySelectorAll("button[data-shell-index]").forEach((button) => {
					const index = Number(button.dataset.shellIndex);
					const option = row.options[index];
					if (!option) button.remove();
					else button.textContent = option.label;
				});
			}
			const select = doc.getElementById(row.ids.control);
			if (select && select.tagName === "SELECT") {
				[...select.options].forEach((option, index) => {
					if (!row.options[index]) option.remove();
				});
			}
			if (!kept.some((option) => JSON.stringify(option.value) === JSON.stringify(readValue(row)))) writeValue(row, clone(kept[0].value));
			sync();
			return row.options;
		}

		/**
		 * Move a row's bounds after the mount. A range's `max` is written once when
		 * the panel is built, so a row whose limit is another value — the scrub
		 * bar, bounded by the duration — would keep the limit it was born with and
		 * refuse to reach the end of a longer loop.
		 */
		function setRowBounds(key, bounds) {
			const row = tree.rowsByKey[key];
			if (!row) return null;
			if (bounds.minimum !== undefined) row.minimum = Number(bounds.minimum);
			if (bounds.maximum !== undefined) row.maximum = Number(bounds.maximum);
			const control = doc.getElementById(row.ids.control);
			if (control) {
				if (row.minimum !== null) control.min = String(row.minimum);
				if (row.maximum !== null) control.max = String(row.maximum);
			}
			syncRow(row);
			return { maximum: row.maximum, minimum: row.minimum };
		}

		/**
		 * Report how much the tool is drawing, and say so when it is past what
		 * the schema declared it could carry. dash-loom ran at 6.8 fps with 26,000
		 * dashes and nothing on the page mentioned it.
		 */
		function reportLoad(count) {
			const budget = Number((tree.canvas || {}).budget) || null;
			const strip = panel.querySelector("[data-shell-status]");
			if (!strip) return null;
			const over = budget !== null && Number(count) > budget;
			writeStatus(strip, over ? "alert" : "active", panel.querySelector("[data-shell-status-value]"), over
				? `${Number(count).toLocaleString()} — past ${budget.toLocaleString()}`
				: Number(count).toLocaleString());
			return { budget, count: Number(count), over };
		}

		/** Say something in the panel's own status line, in the kit's tones. */
		function status(text, tone) {
			const strip = panel.querySelector("[data-shell-status]");
			const value = panel.querySelector("[data-shell-status-value]");
			if (!strip || !value) return null;
			writeStatus(strip, tone || "neutral", value, text || "READY");
			return { text: value.textContent, tone: strip.dataset.instrumentTone };
		}

		/* Pages report status from their frame loop. Assigning the same text
		   still replaces the text node and the same attribute still queues a
		   mutation record, so an unchanged line must not touch the DOM at all. */
		function writeStatus(strip, tone, value, text) {
			if (strip.dataset.instrumentTone !== tone) strip.dataset.instrumentTone = tone;
			if (value && value.textContent !== text) value.textContent = text;
		}

		function syncHistory() {
			if (undoButton) undoButton.disabled = typeof adapter.canUndo === "function" ? !adapter.canUndo() : false;
			if (redoButton) redoButton.disabled = typeof adapter.canRedo === "function" ? !adapter.canRedo() : false;
		}

		// Modules (state, viewport, timeline) subscribe rather than wrap, so a page
		// that loads one of them does not have to chain callbacks by hand.
		const syncHandlers = new Set();
		if (typeof options.onSync === "function") syncHandlers.add(options.onSync);

		function sync() {
			syncing = true;
			try {
				for (const row of controls.values()) syncRow(row);
				syncPresets();
				syncMeta();
				syncActions();
				syncNeeds();
				syncHistory();
			} finally {
				syncing = false;
			}
			for (const handler of syncHandlers) handler({ adapter, shellState, tree });
		}

		/**
		 * Press a preset by name. `state.js` decides which one that is, because it
		 * settles a patch through the adapter's normalize first; the fallback below
		 * compares the raw patch, which is right often enough to keep a page that
		 * loads panel.js alone from looking broken.
		 */
		function pressPresets(names) {
			const press = (selector, list, name) => panel.querySelectorAll(selector).forEach((button) => {
				const index = Number(button.dataset.shellPreset ?? button.dataset.shellTheme);
				button.setAttribute("aria-pressed", String(Boolean(list) && list.items[index].name === name));
			});
			press("[data-shell-preset]", findRow("presets"), names.presets);
			press("[data-shell-theme]", findRow("swatches"), names.theme);
		}

		on(doc, "instrument:adapter-state", sync);
		/* The clock is written into shell state on EVERY frame, so a full sync
		   there rewrote every row, every preset's aria-pressed, every action's
		   title and — through the state module's handler — every row's
		   visibility, sixty to a hundred and twenty times a second: about eighty
		   DOM mutations a frame that each extension observer and the
		   accessibility tree then had to chew through. Time changes nothing but
		   its own row, so it syncs its own row. */
		listeners.push(shellState.subscribe((key) => {
			if (FRAME_KEYS.has(key)) {
				const row = controls.get(key);
				if (!row) return;
				syncing = true;
				try { syncRow(row); } finally { syncing = false; }
				return;
			}
			sync();
		}));

		/* ---------- keyboard ---------- */

		const isEditable = (node) => node instanceof global.HTMLElement
			&& (node.matches("input, select, textarea") || node.isContentEditable);

		on(doc, "keydown", (event) => {
			const editable = isEditable(event.target);
			// ⌘Z inside a value cell is the browser's text undo, not the tool's.
			if ((event.metaKey || event.ctrlKey) && !event.altKey && String(event.key).toLowerCase() === "z" && !editable) {
				event.preventDefault();
				if (event.shiftKey) adapter.redo && adapter.redo();
				else adapter.undo && adapter.undo();
				return;
			}
			if ((event.ctrlKey && !event.metaKey) && String(event.key).toLowerCase() === "y" && !editable) {
				event.preventDefault();
				adapter.redo && adapter.redo();
				return;
			}
			if (event.metaKey || event.ctrlKey || event.altKey || editable) return;
			// Space on a focused button is that button's activation, never a shortcut.
			if (event.key === " " && event.target instanceof global.HTMLElement && event.target.closest("button, summary")) return;
			const token = event.key === " " ? "space" : String(event.key).toLowerCase();
			const entry = tree.legend.find((candidate) => candidate.key === token);
			if (!entry) return;
			if (token === "z") {
				event.preventDefault();
				adapter.undo && adapter.undo();
				return;
			}
			if (token === "h") {
				event.preventDefault();
				setControls();
				return;
			}
			for (const action of actionsById.values()) {
				if (action.key === token) {
					event.preventDefault();
					runAction(action.id);
					return;
				}
			}
			if (typeof options.onShortcut === "function") options.onShortcut(token, event);
		});

		/* ---------- ready ---------- */

		let rangeContract = null;
		if (core && options.rangeContract !== false) rangeContract = core.installRangeContract(panel);

		const controller = Object.freeze({
			controls,
			/** The authored defaults, for a link that carries only the difference. */
			defaults: () => (typeof options.defaults === "function" ? options.defaults() : options.defaults || null),
			destroy() {
				for (const off of listeners) off();
				listeners.length = 0;
				if (rangeContract) rangeContract.destroy();
				if (undoButton) undoButton.remove();
				if (redoButton) redoButton.remove();
				container.textContent = "";
				delete container.dataset.shellPanel;
				if (doc.body) delete doc.body.dataset.shellReady;
				shell.ready = false;
				if (shell.controller === controller) {
					delete shell.adapter;
					delete shell.controller;
				}
			},
			element: panel,
			onSync(handler) {
				syncHandlers.add(handler);
				return () => syncHandlers.delete(handler);
			},
			pressPresets,
			reportLoad,
			setControls,
			setRowBounds,
			setRowOptions,
			shellState,
			status,
			sync,
			tree,
		});

		sync();
		if (doc.body) doc.body.dataset.shellReady = "true";
		shell.ready = true;
		// One canonical handle, for the same reason there is one readiness signal:
		// a shared probe cannot know that this page calls its adapter
		// DASH_LOOM_ADAPTER and the next one calls it something else.
		shell.adapter = adapter;
		shell.controller = controller;
		return controller;
	}

	/**
	 * Canvas, export and transport values are the shell's, not the tool's. They
	 * never enter the adapter, so they never enter history or persistence either
	 * (KTD4): a reload restores a composition, not a zoom level.
	 */
	function createShellState(tree) {
		const values = {};
		for (const section of tree.sections) {
			if (section.seeds) Object.assign(values, clone(section.seeds));
			for (const row of section.rows) {
				if (row.row === "field" && row.owner === "shell") values[row.key] = clone(row.defaultValue);
			}
		}
		const subscribers = new Set();
		return {
			get(key) {
				return values[key];
			},
			set(key, value) {
				if (JSON.stringify(values[key]) === JSON.stringify(value)) return;
				values[key] = value;
				for (const subscriber of subscribers) subscriber(key, value);
			},
			snapshot() {
				return clone(values);
			},
			subscribe(handler) {
				subscribers.add(handler);
				return () => subscribers.delete(handler);
			},
		};
	}

	shell.CONTROL_KINDS = Object.freeze([...CONTROL_KINDS]);
	shell.createShellState = createShellState;
	shell.formatFieldValue = formatFieldValue;
	shell.isSeedField = isSeedField;
	shell.hooks = shell.hooks || {};
	shell.mountPanel = mountPanel;
	shell.planPanel = planPanel;
	shell.resolveKind = resolveKind;
	shell.version = 1;
	global.SUPERMEGA_INSTRUMENT_SHELL = shell;
})(window);
