(function barbadilloModulesPage(global) {
	"use strict";

	const $ = (id) => document.getElementById(id);
	const canvas = $("barbadillo-canvas");
	const panel = $("barbadillo-panel");
	const toggle = $("toggle-controls");
	const core = global.CGA76_BARBADILLO_CORE;
	const registry = global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76BarbadilloModules;
	const context = canvas.getContext("2d");
	const HASH_LIMIT_BYTES = 16 * 1024;
	const HASH_TYPE = "cga76-barbadillo-modules";
	const HASH_VERSION = 1;
	const SOURCE_PRESET = Object.freeze({ ...registry.defaults });
	const SUPERMEGA_PRESET = Object.freeze({
		...registry.defaults,
		candidateCount: 4,
		columns: 10,
		continuityWeight: 0.96,
		curveRadius: 0.88,
		innerVoid: 0.34,
		macroModuleBias: 0.78,
		outputMode: "clean-print",
		polarityRatio: 0.28,
		repertoireSize: 3,
		rows: 7,
		seed: 7602,
		symmetry: "rotational",
	});
	const PRESETS = Object.freeze({ source: SOURCE_PRESET, supermega: SUPERMEGA_PRESET });
	const rangeBindings = Object.freeze({
		"range-candidates": ["candidateCount", "value-candidates", (value) => String(Math.round(value))],
		"range-columns": ["columns", "value-columns", (value) => String(Math.round(value))],
		"range-continuity": ["continuityWeight", "value-continuity", (value) => Number(value).toFixed(2)],
		"range-macro": ["macroModuleBias", "value-macro", (value) => Number(value).toFixed(2)],
		"range-polarity": ["polarityRatio", "value-polarity", (value) => Number(value).toFixed(2)],
		"range-radius": ["curveRadius", "value-radius", (value) => Number(value).toFixed(2)],
		"range-repertoire": ["repertoireSize", "value-repertoire", (value) => String(Math.round(value))],
		"range-rows": ["rows", "value-rows", (value) => String(Math.round(value))],
		"range-void": ["innerVoid", "value-void", (value) => Number(value).toFixed(2)],
	});
	const selectBindings = Object.freeze({ "field-output": "outputMode", "field-rotations": "rotations", "field-symmetry": "symmetry" });

	let configuration = registry.defaults;
	let candidates = core.generateCandidates(configuration);
	let lastLayout = null;
	let resizeObserver = null;

	function setStatus(message, tone) {
		$("barbadillo-status-value").textContent = String(message).slice(0, 120);
		$("barbadillo-status").dataset.instrumentTone = tone || "active";
	}

	function isSupermega(value) {
		return value.outputMode === "clean-print" && (value.symmetry !== "none" || value.macroModuleBias >= 0.65);
	}

	function updateSummary() {
		const vocabulary = configuration.repertoireSize === 1 ? "one base module" : `${configuration.repertoireSize} base modules`;
		$("barbadillo-canvas-summary").textContent = `${configuration.candidateCount} deterministic candidates using ${vocabulary}, ${configuration.rows} rows, ${configuration.columns} columns, ${configuration.outputMode}, seed ${configuration.seed}.`;
		$("barbadillo-hud-status").textContent = `${configuration.outputMode === "asterisk-study" ? "ASTERISK STUDY" : isSupermega(configuration) ? "SUPERMEGA CLEAN PRINT" : "CLEAN PRINT"} · ${configuration.candidateCount} CANDIDATES · SEED ${configuration.seed}`;
	}

	function setCanvasSize() {
		const rectangle = canvas.getBoundingClientRect();
		const ratio = Math.max(1, global.devicePixelRatio || 1);
		const width = Math.max(1, Math.round(rectangle.width * ratio));
		const height = Math.max(1, Math.round(rectangle.height * ratio));
		if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
	}

	function liveInsets() {
		const rectangle = canvas.getBoundingClientRect();
		if (!rectangle.width || !rectangle.height) return { bottom: 0, left: 0, right: 0, top: 0 };
		const visible = (element) => element && getComputedStyle(element).display !== "none" && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
		let top = 0;
		let bottom = 0;
		for (const selector of [".instrument-renderer-hud--top"]) {
			const element = document.querySelector(selector);
			if (!visible(element)) continue;
			const overlay = element.getBoundingClientRect();
			if (overlay.bottom > rectangle.top && overlay.top < rectangle.bottom) top = Math.max(top, overlay.bottom - rectangle.top + 10);
		}
		for (const selector of ["#barbadillo-hud-status", ".instrument-renderer-credit", ".instrument-renderer-dock"]) {
			const element = document.querySelector(selector);
			if (!visible(element)) continue;
			const overlay = element.getBoundingClientRect();
			if (overlay.bottom > rectangle.top && overlay.top < rectangle.bottom) bottom = Math.max(bottom, rectangle.bottom - overlay.top + 10);
		}
		return {
			bottom: Math.round(bottom * canvas.height / rectangle.height),
			left: 0,
			right: 0,
			top: Math.round(top * canvas.height / rectangle.height),
		};
	}

	function paintLive() {
		if (!context) return;
		setCanvasSize();
		lastLayout = core.paint(context, candidates, configuration, { height: canvas.height, insets: liveInsets(), supermega: isSupermega(configuration), width: canvas.width }).layout;
		updateSummary();
	}

	function encodeBase64Url(value) {
		const bytes = new TextEncoder().encode(value);
		let binary = "";
		for (const byte of bytes) binary += String.fromCharCode(byte);
		return btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, "");
	}

	function decodeBase64Url(value) {
		if (typeof value !== "string" || value.length > Math.ceil(HASH_LIMIT_BYTES * 4 / 3) + 8) throw new Error("Configuration hash is too large.");
		const padded = value.replace(/-/gu, "+").replace(/_/gu, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
		const binary = atob(padded);
		const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
		if (bytes.byteLength > HASH_LIMIT_BYTES) throw new Error("Configuration hash exceeds 16 KB.");
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	}

	function isPlainObject(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }

	function configurationFromEnvelope(envelope) {
		if (!isPlainObject(envelope)) throw new Error("Configuration must be a JSON object.");
		if ("configuration" in envelope || "version" in envelope || "type" in envelope) {
			if (envelope.version !== HASH_VERSION) throw new Error("Configuration URL version is not supported.");
			if (envelope.type !== HASH_TYPE) throw new Error("Configuration URL belongs to another instrument.");
			if (!isPlainObject(envelope.configuration)) throw new Error("Configuration URL has no object state.");
			return envelope.configuration;
		}
		return envelope;
	}

	function updateHash(value) {
		const envelope = JSON.stringify({ configuration: value, type: HASH_TYPE, version: HASH_VERSION });
		global.history.replaceState(null, "", `#config=${encodeBase64Url(envelope)}`);
	}

	function syncControls(value) {
		for (const [id, key] of Object.entries(selectBindings)) $(id).value = value[key];
		for (const [id, [key, outputId, format]] of Object.entries(rangeBindings)) { $(id).value = value[key]; $(outputId).textContent = format(value[key]); }
		if (document.activeElement !== $("field-seed")) $("field-seed").value = value.seed;
		const serialized = JSON.stringify(value);
		panel.querySelectorAll("[data-preset]").forEach((button) => button.setAttribute("aria-pressed", String(serialized === JSON.stringify(PRESETS[button.dataset.preset]))));
	}

	function applyConfiguration(value, action) {
		configuration = value;
		candidates = core.generateCandidates(configuration);
		syncControls(configuration);
		updateHash(configuration);
		paintLive();
		if (action && action !== "initial") setStatus(action === "reset-configuration" ? "DEFAULTS" : "CONFIGURED", "active");
	}

	function setControlsVisible(visible) {
		const active = document.activeElement;
		panel.classList.toggle("hidden", !visible);
		panel.inert = !visible;
		panel.setAttribute("aria-hidden", String(!visible));
		document.body.dataset.controls = visible ? "visible" : "hidden";
		toggle.setAttribute("aria-pressed", String(visible));
		toggle.setAttribute("aria-expanded", String(visible));
		if (!visible && panel.contains(active)) toggle.focus();
		paintLive();
		return { visible };
	}

	function nextSeed() {
		const values = new Uint32Array(1);
		if (global.crypto && typeof global.crypto.getRandomValues === "function") global.crypto.getRandomValues(values);
		else values[0] = (Date.now() ^ Math.round(global.performance.now() * 1000)) >>> 0;
		return { seed: values[0] };
	}

	function createArtifact() {
		const output = document.createElement("canvas"); output.width = 1600; output.height = 1000;
		const outputContext = output.getContext("2d");
		if (!outputContext) throw new Error("Canvas 2D artifact export is unavailable.");
		const canonical = adapter.getConfiguration();
		core.paint(outputContext, core.generateCandidates(canonical), canonical, { height: 1000, supermega: isSupermega(canonical), width: 1600 });
		const dataUrl = output.toDataURL("image/png");
		if (!dataUrl.startsWith("data:image/png;base64,")) throw new Error("The browser could not encode a PNG artifact.");
		return { dataUrl, filename: `cga76-barbadillo-modules-${canonical.outputMode}-${canonical.seed}.png`, height: 1000, mime: "image/png", width: 1600 };
	}

	const adapter = registry.create({ applyConfiguration, createArtifact, hideControls: () => setControlsVisible(false), nextSeed, showControls: () => setControlsVisible(true) });

	function loadSerialized(serialized, source) {
		try {
			if (new TextEncoder().encode(serialized).byteLength > HASH_LIMIT_BYTES) throw new Error("Configuration exceeds 16 KB.");
			const parsed = JSON.parse(serialized);
			const candidate = configurationFromEnvelope(parsed);
			const candidateKeys = Object.keys(candidate);
			const restored = adapter.restoreConfiguration(JSON.stringify(candidate));
			const wasNormalized = candidateKeys.some((key) => !(key in restored)) || JSON.stringify(candidate) !== JSON.stringify(restored);
			$("configuration-input").value = adapter.serializeConfiguration();
			setStatus(wasNormalized ? `${source} NORMALIZED` : `${source} LOADED`, wasNormalized ? "attention" : "active");
			return true;
		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Configuration could not be loaded.", "error");
			return false;
		}
	}

	if (!context) {
		$("barbadillo-fallback").hidden = false;
		panel.querySelectorAll("button, input, select, textarea").forEach((control) => { control.disabled = true; });
		setStatus("CANVAS UNAVAILABLE", "error");
		return;
	}

	const rangeContract = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installRangeContract(document);
	resizeObserver = new ResizeObserver(() => paintLive()); resizeObserver.observe(canvas);
	setControlsVisible(document.body.dataset.controls !== "hidden");
	for (const [id, key] of Object.entries(selectBindings)) $(id).addEventListener("change", (event) => adapter.configure({ [key]: event.target.value }));
	for (const [id, [key]] of Object.entries(rangeBindings)) $(id).addEventListener("input", (event) => adapter.configure({ [key]: Number(event.target.value) }));
	$("field-seed").addEventListener("change", (event) => adapter.configure({ seed: Number(event.target.value) }));
	panel.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => adapter.configure(PRESETS[button.dataset.preset])));
	$("randomize").addEventListener("click", () => adapter.execute("randomize"));
	$("reset-configuration").addEventListener("click", () => adapter.execute("reset-configuration"));
	$("hide-controls").addEventListener("click", () => adapter.execute("hide-controls"));
	$("toggle-controls").addEventListener("click", () => adapter.execute(panel.classList.contains("hidden") ? "show-controls" : "hide-controls"));
	$("load-configuration").addEventListener("click", () => loadSerialized($("configuration-input").value, "CONFIG"));
	$("select-configuration").addEventListener("click", () => { $("configuration-input").focus(); $("configuration-input").select(); });
	$("copy-configuration").addEventListener("click", async () => {
		const result = adapter.execute("copy-config"); if (!result.ok) return setStatus("COPY FAILED", "error");
		const serialized = result.value.serialized; $("configuration-input").value = serialized;
		try { if (!navigator.clipboard || !global.isSecureContext) throw new Error("Clipboard unavailable"); await navigator.clipboard.writeText(serialized); setStatus("CONFIG COPIED", "active"); }
		catch { $("configuration-input").focus(); $("configuration-input").select(); setStatus("COPY DENIED · TEXT SELECTED", "attention"); }
	});
	$("export-artifact").addEventListener("click", () => { const result = adapter.execute("create-artifact"); if (!result.ok) return setStatus(result.error.message, "error"); const anchor = document.createElement("a"); anchor.href = result.value.dataUrl; anchor.download = result.value.filename; anchor.click(); setStatus("PNG CREATED", "active"); });
	document.addEventListener("keydown", (event) => { const editable = event.target instanceof HTMLElement && (event.target.matches("input, textarea, select") || event.target.isContentEditable); if (!editable && (event.key === "h" || event.key === "H")) adapter.execute(panel.classList.contains("hidden") ? "show-controls" : "hide-controls"); });

	let restoredFromHash = false;
	const encoded = new URLSearchParams(global.location.hash.slice(1)).get("config");
	if (encoded) {
		try {
			const decoded = decodeBase64Url(encoded);
			const envelope = JSON.parse(decoded);
			if (!isPlainObject(envelope) || envelope.version !== HASH_VERSION || envelope.type !== HASH_TYPE || !isPlainObject(envelope.configuration)) throw new Error("Configuration URL requires a valid versioned envelope.");
			restoredFromHash = loadSerialized(decoded, "URL");
		}
		catch (error) { applyConfiguration(adapter.getConfiguration(), "initial"); setStatus(error instanceof Error ? error.message : "Configuration URL is invalid.", "error"); }
	}
	if (!restoredFromHash && !encoded) { applyConfiguration(adapter.getConfiguration(), "initial"); setStatus("READY", "active"); }

	const instrumentState = global.SUPERMEGA_INSTRUMENT.createState(); instrumentState.appearance.grain = false; instrumentState.shell.overviewVisible = false;
	global.CGA76_BARBADILLO_MATERIALS = global.SUPERMEGA_INSTRUMENT.enhance(document.body, instrumentState);
	global.CGA76_BARBADILLO_ADAPTER = adapter;
	global.CGA76_BARBADILLO_RANGE_CONTRACT = rangeContract;
	global.CGA76_BARBADILLO_PAGE = Object.freeze({
		getLayout: () => lastLayout ? { ...lastLayout, cards: lastLayout.cards.map((card) => ({ ...card })), content: { ...lastLayout.content } } : null,
		getLiveInsets: () => ({ ...liveInsets() }),
		loadSerialized,
		paintLive,
	});
	if (global.parent !== global) global.CGA76_BARBADILLO_BRIDGE = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installBridge(adapter, { strict: true });
	global.addEventListener("beforeunload", () => { if (resizeObserver) resizeObserver.disconnect(); rangeContract.destroy(); global.CGA76_BARBADILLO_BRIDGE?.destroy(); }, { once: true });
})(window);
