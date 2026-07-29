(function instrumentAdapterCore(global) {
	"use strict";

	const NAMESPACE = "supermega.instrument.bridge/v1";
	const VERSION = 1;
	const registry = global.SUPERMEGA_INSTRUMENT_ADAPTERS || {};

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
		const appearance = message.appearance;
		if (!isPlainObject(appearance)) return;
		const body = global.document?.body;
		if (!body?.matches('[data-system="instrument"]')) return;
		body.dataset.instrumentPolarity = appearance.polarity === "light" ? "light" : "ink";
		body.dataset.instrumentGrid = appearance.grid ? "on" : "off";
		body.dataset.instrumentGrain = appearance.grain ? "on" : "off";
	}

	global.addEventListener?.("message", applyAppearanceMessage);

	function modifierMultiplier(event) {
		if (event.shiftKey) return 0.1;
		if (event.altKey) return 10;
		return 1;
	}

	function declaredRangeStep(input) {
		return Number(input.dataset?.instrumentStep || input.step) || 1;
	}

	function quantizeRangeValue(input, value, multiplier) {
		const step = declaredRangeStep(input) * multiplier;
		const minimum = input.min === "" ? -Infinity : Number(input.min);
		const maximum = input.max === "" ? Infinity : Number(input.max);
		const base = Number.isFinite(minimum) ? minimum : 0;
		const quantized = base + Math.round((value - base) / step) * step;
		return Math.min(maximum, Math.max(minimum, Number(quantized.toFixed(10))));
	}

	function adjustRangeValue(input, direction, event) {
		const current = Number(input.value);
		const step = declaredRangeStep(input);
		const minimum = input.min === "" ? -Infinity : Number(input.min);
		const maximum = input.max === "" ? Infinity : Number(input.max);
		const next = current + direction * step * modifierMultiplier(event);
		return Math.min(maximum, Math.max(minimum, Number(next.toFixed(10))));
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

		function snapshot() {
			return clone(configuration);
		}

		function apply(next, action) {
			const candidate = definition.normalize(next);
			const value = clone(candidate);
			options.applyConfiguration(value, action);
			configuration = candidate;
			notify(definition.id, action, value);
			return clone(value);
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

		return Object.freeze({
			capabilities,
			configure,
			execute,
			getConfiguration: snapshot,
			getSchema() {
				return clone(schema);
			},
			id: definition.id,
			resetConfiguration,
			restoreConfiguration(serialized) {
				return configure(JSON.parse(serialized));
			},
			serializeConfiguration() {
				return JSON.stringify(configuration);
			},
		});
	}

	function installBridge(adapter) {
		const target = global.parent;
		const sessionId = global.crypto && typeof global.crypto.randomUUID === "function"
			? global.crypto.randomUUID()
			: `${adapter.id}-${Date.now().toString(36)}`;
		let destroyed = false;

		function post(message) {
			target.postMessage(message, "*");
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
			if (destroyed || event.source !== target) return;
			const message = event.data;
			if (!exactKeys(message, ["namespace", "version", "type", "sessionId", "requestId", "action", "payload"])) return;
			if (message.namespace !== NAMESPACE || message.version !== VERSION || message.type !== "REQUEST") return;
			if (message.sessionId !== sessionId || typeof message.requestId !== "string" || !message.requestId) return;
			if (typeof message.action !== "string" || !isJsonValue(message.payload)) return;
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

		global.addEventListener("message", onMessage);
		postReady();
		if (global.document && global.document.readyState !== "complete") {
			global.addEventListener("load", postReady, { once: true });
		}

		return Object.freeze({
			destroy() {
				if (destroyed) return;
				destroyed = true;
				global.removeEventListener("message", onMessage);
				global.removeEventListener("load", postReady);
			},
			sessionId,
		});
	}

	registry.core = Object.freeze({ adjustRangeValue, createAdapter, installBridge, installRangeContract, modifierMultiplier, prepareRange, quantizeRangeValue });
	global.SUPERMEGA_INSTRUMENT_ADAPTERS = registry;
})(window);
