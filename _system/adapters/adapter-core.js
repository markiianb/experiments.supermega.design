(function instrumentAdapterCore(global) {
	"use strict";

	const NAMESPACE = "supermega.instrument.bridge/v1";
	const VERSION = 1;
	const registry = global.SUPERMEGA_INSTRUMENT_ADAPTERS || {};
	let strictAppearanceOrigin = "";

	function isPlainObject(value) {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		const prototype = Object.getPrototypeOf(value);
		return prototype === null || Object.prototype.toString.call(value) === "[object Object]";
	}

	function isJsonValue(value) {
		if (value === null || typeof value === "string" || typeof value === "boolean") return true;
		if (typeof value === "number") return Number.isFinite(value);
		if (Array.isArray(value)) return value.every(isJsonValue);
		return isPlainObject(value) && Object.values(value).every(isJsonValue);
	}

	function clone(value) {
		return JSON.parse(JSON.stringify(value));
	}

	function freeze(value) {
		if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
		Object.freeze(value);
		Object.values(value).forEach(freeze);
		return value;
	}

	function exactKeys(value, keys) {
		if (!isPlainObject(value)) return false;
		const actual = Object.keys(value).sort();
		const expected = [...keys].sort();
		return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
	}

	function notify(id, action, configuration) {
		if (!global.document || typeof global.document.dispatchEvent !== "function") return;
		global.document.dispatchEvent(new global.CustomEvent("instrument:adapter-state", {
			detail: { action, configuration: clone(configuration), id },
		}));
	}

	function applyAppearanceMessage(event) {
		const message = event.data;
		if (event.source !== global.parent || !message || message.namespace !== NAMESPACE || message.version !== VERSION || message.type !== "APPEARANCE") return;
		if (strictAppearanceOrigin !== null && (!strictAppearanceOrigin || event.origin !== strictAppearanceOrigin)) return;
		const appearance = message.appearance;
		if (!isPlainObject(appearance)) return;
		const body = global.document?.body;
		if (!body?.matches('[data-system="instrument"]')) return;
		body.dataset.instrumentPolarity = appearance.polarity === "light" ? "light" : "ink";
		body.dataset.instrumentGrid = appearance.grid ? "on" : "off";
		body.dataset.instrumentGrain = appearance.grain ? "on" : "off";
	}

	global.addEventListener?.("message", applyAppearanceMessage);

	// Alt is tested first, because the Modifier Contract says Alt wins when both
	// are held. The kit fixed exactly this inversion in commit 24f6ec9 and the fix
	// could not cross the repository boundary — the adapter cannot import the
	// kit's TypeScript, so the rule is restated here and asserted by
	// adapter-core.test.mjs.
	function modifierMultiplier(event) {
		if (event.altKey) return 10;
		if (event.shiftKey) return 0.1;
		return 1;
	}

	function declaredRangeStep(input) {
		return Number(input.dataset?.instrumentStep || input.step) || 1;
	}

	// A circular axis, declared by the host. A bearing has no ends: stepping past
	// one re-enters from the other, so 359 plus a degree is 0 rather than 360.
	function rangeWraps(input) {
		return input.dataset?.instrumentWrap === "true";
	}

	function settleRangeValue(input, value) {
		const minimum = input.min === "" ? -Infinity : Number(input.min);
		const maximum = input.max === "" ? Infinity : Number(input.max);
		if (rangeWraps(input) && Number.isFinite(minimum) && Number.isFinite(maximum)) {
			const span = maximum - minimum;
			if (span > 0) {
				const folded = (((value - minimum) % span) + span) % span;
				return Number((minimum + folded).toFixed(10));
			}
		}
		return Math.min(maximum, Math.max(minimum, Number(value.toFixed(10))));
	}

	function quantizeRangeValue(input, value, multiplier) {
		const step = declaredRangeStep(input) * multiplier;
		const minimum = input.min === "" ? -Infinity : Number(input.min);
		const base = Number.isFinite(minimum) ? minimum : 0;
		const quantized = base + Math.round((value - base) / step) * step;
		return settleRangeValue(input, quantized);
	}

	function adjustRangeValue(input, direction, event) {
		const current = Number(input.value);
		const step = declaredRangeStep(input);
		return settleRangeValue(input, current + direction * step * modifierMultiplier(event));
	}

	// Home and End are the only keys that reach a known absolute value in one
	// press. On a circular axis End names the last representable point rather
	// than the maximum: emitting the maximum would duplicate Home and hand back a
	// reading (360 degrees) the control can never hold again after one more step.
	function boundRangeValue(input, edge) {
		const minimum = input.min === "" ? -Infinity : Number(input.min);
		const maximum = input.max === "" ? Infinity : Number(input.max);
		if (edge === "min") return Number.isFinite(minimum) ? minimum : Number(input.value);
		if (!Number.isFinite(maximum)) return Number(input.value);
		if (!rangeWraps(input)) return maximum;
		return settleRangeValue(input, maximum - declaredRangeStep(input));
	}

	function syncRangeVisual(input) {
		const minimum = input.min === "" ? 0 : Number(input.min);
		const maximum = input.max === "" ? 100 : Number(input.max);
		const value = Number(input.value);
		const span = maximum - minimum;
		const percentage = span > 0 ? ((value - minimum) / span) * 100 : 0;
		input.style.setProperty("--instrument-range-fill", `${Math.min(100, Math.max(0, percentage))}%`);
	}

	// Prepare a single range for the modifier contract: stash its declared step,
	// hand native quantization over to the contract (step="any"), and draw its
	// initial fill. Ranges created after installRangeContract runs (e.g. a color
	// stop added at runtime) call this so the document-delegated handlers, which
	// already resolve dynamic ranges, can quantize and reset them correctly.
	function prepareRange(input) {
		input.dataset.instrumentStep = input.step || "1";
		input.step = "any";
		syncRangeVisual(input);
	}

	function installRangeContract(root) {
		// Pair every readonly value cell with the range in its own row, then make
		// it typeable. Runs before the delegated listeners below are attached.
		try {
			installValueEntry(root, (cell) => {
				const row = cell.closest ? cell.closest(".instrument-row") : null;
				return row && row.querySelector ? row.querySelector('input.instrument-range, input[type="range"]') : null;
			});
		} catch (error) {
			/* a page without rows, or a non-DOM host: typed entry is additive */
		}
		const starts = new WeakMap();
		const pointerModifiers = new WeakMap();
		const internalInputs = new WeakSet();
		const owner = root.ownerDocument || root;
		const ranges = [...root.querySelectorAll('input[type="range"]')];
		for (const input of ranges) {
			prepareRange(input);
		}

		function syncAllRangeVisuals() {
			for (const input of ranges) syncRangeVisual(input);
		}

		function rangeFromResetSurface(target) {
			if (!(target instanceof global.Element)) return null;
			if (target.matches('input[type="range"]')) return target;
			const id = target.getAttribute("for") || target.dataset.resetFor;
			if (!id) return null;
			const input = owner.getElementById(id);
			return input?.matches('input[type="range"]') ? input : null;
		}

		function commit(input, value) {
			input.value = String(value);
			internalInputs.add(input);
			input.dispatchEvent(new global.Event("input", { bubbles: true }));
			internalInputs.delete(input);
		}

		function reset(input) {
			commit(input, Number(input.defaultValue));
		}

		function remember(event) {
			const input = rangeFromResetSurface(event.target);
			if (input && !starts.has(input)) starts.set(input, Number(input.value));
			if (input && event.type === "pointerdown") {
				pointerModifiers.set(input, { altKey: event.altKey, shiftKey: event.shiftKey });
			}
		}

		function onPointerMove(event) {
			const input = rangeFromResetSurface(event.target);
			if (input && pointerModifiers.has(input)) {
				pointerModifiers.set(input, { altKey: event.altKey, shiftKey: event.shiftKey });
			}
		}

		function onPointerEnd(event) {
			const input = rangeFromResetSurface(event.target);
			if (!input) return;
			pointerModifiers.delete(input);
			starts.delete(input);
		}

		function onInput(event) {
			const input = rangeFromResetSurface(event.target);
			if (!input) return;
			syncRangeVisual(input);
			if (internalInputs.has(input)) return;
			const modifiers = pointerModifiers.get(input) || { altKey: false, shiftKey: false };
			input.value = String(quantizeRangeValue(input, Number(input.value), modifierMultiplier(modifiers)));
			syncRangeVisual(input);
		}

		function onKeyDown(event) {
			const input = rangeFromResetSurface(event.target);
			if (!input) return;
			if (event.key === "Escape" && starts.has(input)) {
				event.preventDefault();
				commit(input, starts.get(input));
				return;
			}
			if (event.key === "Home" || event.key === "End") {
				event.preventDefault();
				commit(input, boundRangeValue(input, event.key === "Home" ? "min" : "max"));
				return;
			}
			const directions = { ArrowDown: -1, ArrowLeft: -1, ArrowRight: 1, ArrowUp: 1 };
			const direction = directions[event.key];
			if (!direction) return;
			event.preventDefault();
			const next = adjustRangeValue(input, direction, event);
			commit(input, next);
		}

		function onReset(event) {
			if (event.type === "click" && !event.altKey) return;
			const input = rangeFromResetSurface(event.target);
			if (!input || (event.type === "dblclick" && input === event.target)) return;
			event.preventDefault();
			reset(input);
		}

		function forget(event) {
			const input = rangeFromResetSurface(event.target);
			if (input) starts.delete(input);
		}

		root.addEventListener("focusin", remember);
		root.addEventListener("pointerdown", remember);
		root.addEventListener("pointermove", onPointerMove);
		root.addEventListener("pointerup", onPointerEnd);
		root.addEventListener("pointercancel", onPointerEnd);
		root.addEventListener("input", onInput, true);
		root.addEventListener("instrument:adapter-state", syncAllRangeVisuals);
		root.addEventListener("keydown", onKeyDown);
		root.addEventListener("dblclick", onReset);
		root.addEventListener("click", onReset);
		root.addEventListener("focusout", forget);

		return Object.freeze({
			destroy() {
				root.removeEventListener("focusin", remember);
				root.removeEventListener("pointerdown", remember);
				root.removeEventListener("pointermove", onPointerMove);
				root.removeEventListener("pointerup", onPointerEnd);
				root.removeEventListener("pointercancel", onPointerEnd);
				root.removeEventListener("input", onInput, true);
				root.removeEventListener("instrument:adapter-state", syncAllRangeVisuals);
				root.removeEventListener("keydown", onKeyDown);
				root.removeEventListener("dblclick", onReset);
				root.removeEventListener("click", onReset);
				root.removeEventListener("focusout", forget);
				for (const input of ranges) {
					input.step = input.dataset.instrumentStep || "1";
					delete input.dataset.instrumentStep;
					input.style.removeProperty("--instrument-range-fill");
				}
			},
		});
	}

	// --- Typed value entry -------------------------------------------------
	// Every range row already renders a value cell and marks it readonly, so
	// nobody can dial an exact 0.076 by dragging. Upgrading the cell in place
	// gives typed entry to every page that loads this file, without markup
	// changes. A page opts out with data-instrument-entry="off" on the cell.
	function rowValueCellFor(input) {
		const row = input.closest ? input.closest(".instrument-row") : null;
		if (!row || !row.querySelector) return null;
		const cell = row.querySelector("input.instrument-mini-input");
		if (!cell || cell === input) return null;
		if (cell.dataset && cell.dataset.instrumentEntry === "off") return null;
		return cell;
	}

	function unitOf(cell) {
		return (cell.dataset && cell.dataset.instrumentUnit) || "";
	}

	// A read-out may be scaled: a 0–1 field reads as a percentage, so the cell
	// says 65 where the range says 0.65. Typing is the same conversion backwards.
	// Without this the typed number is read as a raw value and silently clamps to
	// the maximum, which is what a share-of-width field does at "80".
	function scaleOf(cell) {
		const declared = Number(cell.dataset && cell.dataset.instrumentScale);
		return Number.isFinite(declared) && declared !== 0 ? declared : 1;
	}

	function displayValue(input, cell) {
		const scale = scaleOf(cell);
		if (scale === 1) return String(input.value);
		const digits = Number(cell.dataset && cell.dataset.instrumentDigits);
		const scaled = Number(input.value) * scale;
		return Number.isFinite(digits) ? scaled.toFixed(digits) : String(scaled);
	}

	function parseTypedValue(raw, input, cell) {
		let text = String(raw == null ? "" : raw).trim();
		const unit = unitOf(cell);
		if (unit && text.toLowerCase().endsWith(unit.toLowerCase())) text = text.slice(0, -unit.length).trim();
		text = text.replace(/[%°×xX\s]+$/u, "").replace(",", ".").trim();
		if (!text) return null;
		const parsed = Number(text);
		if (!Number.isFinite(parsed)) return null;
		// quantize takes a multiplier; typed entry is a plain step, and settle
		// clamps or wraps by the axis the host declared.
		return quantizeRangeValue(input, parsed / scaleOf(cell), 1);
	}

	// Silence is the failure mode here: a value that snaps back or quietly
	// becomes the maximum teaches nothing. The cell says what happened, and
	// emits an event the shell's status line can carry.
	function flagValueCell(cell, state, message) {
		try {
			cell.dataset.instrumentInvalid = state === "invalid" ? "true" : "false";
			cell.title = message;
			cell.dispatchEvent(new global.CustomEvent("instrument:value-rejected", {
				bubbles: true,
				detail: { message, state },
			}));
			global.setTimeout(() => {
				delete cell.dataset.instrumentInvalid;
			}, 1200);
		} catch (error) {
			/* a non-DOM host: the parse result already stands on its own */
		}
	}

	function boundsMessage(input, cell, next) {
		const unit = unitOf(cell);
		const scale = scaleOf(cell);
		const say = (bound) => `${Number((bound * scale).toFixed(6))}${unit}`;
		const maximum = input.max === "" ? null : Number(input.max);
		const minimum = input.min === "" ? null : Number(input.min);
		if (maximum !== null && next >= maximum) return `Maximum ${say(maximum)}`;
		if (minimum !== null && next <= minimum) return `Minimum ${say(minimum)}`;
		return "";
	}

	function commitTypedValue(input, cell) {
		const typed = String(cell.value == null ? "" : cell.value).trim();
		const next = parseTypedValue(cell.value, input, cell);
		if (next === null) {
			cell.value = displayValue(input, cell);
			if (typed) flagValueCell(cell, "invalid", "Enter a number");
			return false;
		}
		const bounds = boundsMessage(input, cell, next);
		// Only say "clamped" when the typed number was actually outside. The typed
		// number is in read-out units, so it comes back through the same scale.
		const typedRaw = Number(typed.replace(",", ".").replace(/[^0-9.+-]/gu, "")) / scaleOf(cell);
		if (bounds && typedRaw !== next) {
			flagValueCell(cell, "clamped", bounds);
		}
		if (String(next) !== String(input.value)) {
			input.value = String(next);
			syncRangeVisual(input);
			input.dispatchEvent(new global.Event("input", { bubbles: true }));
			input.dispatchEvent(new global.Event("change", { bubbles: true }));
		} else {
			cell.value = displayValue(input, cell);
		}
		return true;
	}

	function installValueEntry(root, rangeOf) {
		const scope = root || global.document;
		if (!scope || !scope.querySelectorAll) return;
		scope.querySelectorAll("input.instrument-mini-input[readonly]").forEach((cell) => {
			const input = rangeOf(cell);
			if (!input) return;
			cell.removeAttribute("readonly");
			cell.removeAttribute("tabindex");
			cell.dataset.instrumentEntry = "on";
			cell.setAttribute("inputmode", "decimal");
			cell.addEventListener("keydown", (event) => {
				if (event.key === "Enter") {
					event.preventDefault();
					commitTypedValue(input, cell);
					cell.blur();
				} else if (event.key === "Escape") {
					event.preventDefault();
					cell.value = displayValue(input, cell);
					cell.blur();
				}
			});
			cell.addEventListener("blur", () => {
				commitTypedValue(input, cell);
			});
		});
	}

	function createAdapter(definition, options) {
		if (!definition || !options || typeof options.applyConfiguration !== "function") {
			throw new TypeError("Instrument adapters require an applyConfiguration callback.");
		}
		if (!isPlainObject(definition.schema) || !isJsonValue(definition.schema)) {
			throw new TypeError("Instrument adapters require a JSON-safe configuration schema.");
		}
		const capabilities = freeze([...new Set(definition.capabilities)]);
		const schema = freeze(clone(definition.schema));
		const defaults = freeze(definition.normalize({
			...clone(definition.defaults),
			...(options.defaultConfiguration || {}),
		}));
		let configuration = definition.normalize({
			...clone(defaults),
			...(options.initialConfiguration || {}),
		});
		let pendingRestore = null;

		function snapshot() {
			return clone(configuration);
		}

		// History is a patch stack beside the adapter. It is never serialised, and
		// viewport or playback time never enter it: those are transient view state.
		const COALESCE_MS = 800;
		const HISTORY_LIMIT = 60;
		const undoStack = [];
		const redoStack = [];
		let lastEntryAt = 0;
		let restoring = false;

		function changedKeys(before, after) {
			const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
			return [...keys].filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key])).sort();
		}

		function record(before, after) {
			const keys = changedKeys(before, after);
			if (!keys.length) return;
			const now = Date.now();
			const top = undoStack[undoStack.length - 1];
			// A drag is one gesture: the same keys again inside the window extend
			// the open entry rather than stacking a step per pointer event.
			if (top && now - lastEntryAt < COALESCE_MS && String(top.keys) === String(keys)) {
				top.after = clone(after);
				lastEntryAt = now;
				return;
			}
			undoStack.push({ after: clone(after), before: clone(before), keys });
			if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
			redoStack.length = 0;
			lastEntryAt = now;
		}

		// Persistence is opt-in. A page that has not asked for it boots to its
		// authored defaults, so an unmigrated page embedded in the gallery can
		// never show a previous visitor's composition.
		const persistKey = definition.persist === true
			? `${definition.id}:state:v${definition.schema && definition.schema.version ? definition.schema.version : 1}`
			: null;
		let persistTimer = null;

		function storage() {
			try {
				return global.localStorage || null;
			} catch (error) {
				return null;
			}
		}

		function searchParam(name) {
			try {
				const search = global.location && global.location.search;
				return search ? new global.URLSearchParams(search).get(name) : null;
			} catch (error) {
				return null;
			}
		}

		function savePersisted() {
			if (!persistKey) return;
			const store = storage();
			if (!store) return;
			if (persistTimer) global.clearTimeout(persistTimer);
			persistTimer = global.setTimeout(() => {
				try {
					store.setItem(persistKey, JSON.stringify(configuration));
				} catch (error) {
					/* quota or private mode: persistence is a convenience, never a dependency */
				}
			}, 120);
		}

		function clearPersisted() {
			if (!persistKey) return;
			const store = storage();
			if (!store) return;
			try {
				store.removeItem(persistKey);
			} catch (error) {
				/* ignore */
			}
		}

		// A link that names a field or a preset is somebody handing over a
		// composition. It must win over whatever this browser saved last time,
		// or opening a colleague's link shows your own work instead of theirs.
		function locationCarriesState() {
			try {
				const search = global.location && global.location.search;
				if (!search) return false;
				const params = new global.URLSearchParams(search);
				const fields = (definition.schema && definition.schema.fields) || {};
				if (params.has("preset")) return true;
				for (const key of Object.keys(fields)) {
					if (params.has(key)) return true;
				}
				return false;
			} catch (error) {
				return false;
			}
		}

		function readPersisted() {
			if (!persistKey) return null;
			// `reset-state`, not `fresh`: `?fresh=<timestamp>` is the lab's
			// cache-buster and rides on every probe and preview load.
			if (searchParam("reset-state")) return null;
			if (locationCarriesState()) return null;
			const store = storage();
			if (!store) return null;
			try {
				const raw = store.getItem(persistKey);
				if (!raw) return null;
				const saved = JSON.parse(raw);
				return isPlainObject(saved) ? saved : null;
			} catch (error) {
				return null;
			}
		}

		function apply(next, action) {
			const candidate = definition.normalize(next);
			const value = clone(candidate);
			const before = clone(configuration);
			options.applyConfiguration(value, action);
			configuration = candidate;
			if (!restoring) record(before, clone(candidate));
			if (action === "reset-configuration") clearPersisted();
			else savePersisted();
			notify(definition.id, action, value);
			return clone(value);
		}

		function travel(from, to, action) {
			const entry = from.pop();
			if (!entry) return null;
			to.push(entry);
			restoring = true;
			try {
				return apply({ ...snapshot(), ...clone(action === "undo" ? entry.before : entry.after) }, action);
			} finally {
				restoring = false;
			}
		}

		function undo() {
			return travel(undoStack, redoStack, "undo");
		}

		function redo() {
			return travel(redoStack, undoStack, "redo");
		}

		function historyState() {
			return { canRedo: redoStack.length > 0, canUndo: undoStack.length > 0, historyDepth: undoStack.length };
		}

		function configure(patch) {
			if (!isPlainObject(patch)) throw new TypeError("Configuration patches must be plain objects.");
			return apply({ ...snapshot(), ...clone(patch) }, "configure");
		}

		function resetConfiguration() {
			const value = apply(clone(defaults), "reset-configuration");
			if (typeof definition.afterReset === "function") {
				definition.afterReset({ configuration: snapshot(), options });
			}
			return value;
		}

		function execute(action, payload) {
			if (!capabilities.includes(action)) {
				return {
				action,
				error: { code: "UNSUPPORTED_ACTION", message: `The action ${String(action)} is not declared.` },
				ok: false,
			};
			}
			try {
				if (action === "copy-config") {
					return {
						action,
						ok: true,
						value: {
							configuration: snapshot(),
							schema: clone(schema),
							serialized: JSON.stringify(configuration),
						},
					};
				}
				if (action === "configure") {
					return { action, ok: true, value: configure(payload || {}) };
				}
				if (action === "reset-configuration") {
					return { action, ok: true, value: resetConfiguration() };
				}
				if (action === "undo" || action === "redo") {
					// The response carries availability, so a consumer never needs a
					// second capability to learn whether the next step exists.
					const value = action === "undo" ? undo() : redo();
					return { action, ok: true, value: { configuration: value === null ? snapshot() : value, ...historyState() } };
				}
				const handler = definition.actions[action];
				if (typeof handler !== "function") {
					return {
						action,
						error: { code: "UNSUPPORTED_ACTION", message: `No handler is registered for ${action}.` },
						ok: false,
					};
				}
				const value = handler({
					apply,
					configuration: snapshot(),
					options,
					payload,
				});
				if (!isJsonValue(value === undefined ? null : value)) {
					throw new TypeError(`The ${action} result is not JSON-safe.`);
				}
				return { action, ok: true, value: value === undefined ? null : clone(value) };
			} catch (error) {
				return {
					action,
					error: { code: "HANDLER_ERROR", message: error instanceof Error ? error.message : `The ${action} handler failed.` },
					ok: false,
				};
			}
		}

		pendingRestore = readPersisted();
		if (pendingRestore) {
			restoring = true;
			try {
				configuration = definition.normalize({ ...snapshot(), ...pendingRestore });
			} finally {
				restoring = false;
			}
		}

		return Object.freeze({
			canRedo() {
				return redoStack.length > 0;
			},
			canUndo() {
				return undoStack.length > 0;
			},
			capabilities,
			configure,
			execute,
			historyDepth() {
				return undoStack.length;
			},
			getConfiguration: snapshot,
			getSchema() {
				return clone(schema);
			},
			id: definition.id,
			redo,
			resetConfiguration,
			restoreConfiguration(serialized) {
				return configure(JSON.parse(serialized));
			},
			serializeConfiguration() {
				return JSON.stringify(configuration);
			},
			undo,
		});
	}

	function installBridge(adapter, options) {
		options = options || {};
		const target = global.parent;
		const strict = options.strict === true;
		let trustedOrigin = "*";
		if (strict) {
			try {
				const protocol = global.location && global.location.protocol;
				const pageOrigin = global.location && global.location.origin;
				const referrer = global.document && global.document.referrer;
				const referrerOrigin = referrer ? new URL(referrer).origin : "";
				trustedOrigin = (protocol === "http:" || protocol === "https:") && referrerOrigin === pageOrigin
					? referrerOrigin
					: "";
			} catch {
				trustedOrigin = "";
			}
		}
		const authorized = !strict || Boolean(trustedOrigin);
		strictAppearanceOrigin = strict ? (authorized ? trustedOrigin : "") : null;
		const sessionId = authorized && global.crypto && typeof global.crypto.randomUUID === "function"
			? global.crypto.randomUUID()
			: authorized ? `${adapter.id}-${Date.now().toString(36)}` : null;
		let destroyed = false;
		let lastArtifactAt = -Infinity;
		const artifactIntervalMs = Number.isFinite(options.artifactIntervalMs)
			? Math.max(0, options.artifactIntervalMs)
			: 750;
		const now = typeof options.now === "function" ? options.now : Date.now;

		function post(message) {
			if (!authorized) return;
			target.postMessage(message, trustedOrigin);
		}

		function result(request, outcome) {
			const base = {
				namespace: NAMESPACE,
				requestId: request.requestId,
				sessionId,
				type: "RESULT",
				version: VERSION,
			};
			post(outcome.ok
				? { ...base, ok: true, value: outcome.value }
				: { ...base, error: outcome.error, ok: false });
		}

		function onMessage(event) {
			if (destroyed || !authorized || event.source !== target) return;
			if (strict && event.origin !== trustedOrigin) return;
			const message = event.data;
			if (!exactKeys(message, ["namespace", "version", "type", "sessionId", "requestId", "action", "payload"])) return;
			if (message.namespace !== NAMESPACE || message.version !== VERSION || message.type !== "REQUEST") return;
			if (message.sessionId !== sessionId || typeof message.requestId !== "string" || !message.requestId) return;
			if (typeof message.action !== "string" || !isJsonValue(message.payload)) return;
			const artifactRequestedAt = message.action === "create-artifact" ? now() : null;
			if (artifactRequestedAt !== null) {
				if (artifactRequestedAt - lastArtifactAt < artifactIntervalMs) {
					result(message, {
						action: message.action,
						error: { code: "ACTION_FAILED", message: "Artifact requests are arriving too quickly." },
						ok: false,
					});
					return;
				}
			}
			if (typeof options.authorizeRequest === "function" && options.authorizeRequest({
				action: message.action,
				payload: clone(message.payload),
				origin: event.origin,
			}) !== true) {
				result(message, {
					action: message.action,
						error: { code: "PERMISSION_REQUIRED", message: "The embedded request requires an in-frame action." },
					ok: false,
				});
				return;
			}
			if (artifactRequestedAt !== null) lastArtifactAt = artifactRequestedAt;
			result(message, adapter.execute(message.action, message.payload));
		}

		function postReady() {
			post({
				capabilities: [...adapter.capabilities],
				namespace: NAMESPACE,
				sessionId,
				type: "READY",
				version: VERSION,
			});
		}

		if (authorized) {
			global.addEventListener("message", onMessage);
			postReady();
			if (global.document && global.document.readyState !== "complete") {
				global.addEventListener("load", postReady, { once: true });
			}
		}

		return Object.freeze({
			authorized,
			destroy() {
				if (destroyed) return;
				destroyed = true;
				if (authorized) {
					global.removeEventListener("message", onMessage);
					global.removeEventListener("load", postReady);
				}
			},
			sessionId,
		});
	}

	registry.core = Object.freeze({ adjustRangeValue, boundRangeValue, boundsMessage, commitTypedValue, createAdapter, displayValue, installBridge, installRangeContract, installValueEntry, modifierMultiplier, parseTypedValue, prepareRange, quantizeRangeValue, settleRangeValue });
	global.SUPERMEGA_INSTRUMENT_ADAPTERS = registry;
})(window);
