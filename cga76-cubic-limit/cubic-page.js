(function cubicLimitPage(global) {
	"use strict";

	const $ = (id) => document.getElementById(id);
	const canvas = $("cubic-canvas");
	const panel = $("cubic-panel");
	const toggle = $("toggle-controls");
	const core = global.CGA76_CUBIC_LIMIT_CORE;
	const registry = global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76CubicLimit;
	const context = canvas.getContext("2d");
	const motionQuery = global.matchMedia("(prefers-reduced-motion: reduce)");
	const HASH_LIMIT_BYTES = 16 * 1024;
	const HASH_TYPE = "cga76-cubic-limit";
	const HASH_VERSION = 1;
	const SOURCE_PRESET = Object.freeze({ ...registry.defaults });
	const SUPERMEGA_PRESET = Object.freeze({ ...registry.defaults, centerX: 0.34, centerY: 0.64, columns: 13, falloff: "soft", glyphScale: 0.88, maxEdges: 12, minEdges: 0, noise: 0.54, polarity: "supermega", projection: "isometric", rotationX: -86, rotationY: 118, rotationZ: 64, rows: 9, seed: 7603, stroke: 2.5, subsetOperation: "xor" });
	const PRESETS = Object.freeze({ source: SOURCE_PRESET, supermega: SUPERMEGA_PRESET });
	const rangeBindings = Object.freeze({
		"range-center-x": ["centerX", "value-center-x", (value) => Number(value).toFixed(2)], "range-center-y": ["centerY", "value-center-y", (value) => Number(value).toFixed(2)],
		"range-columns": ["columns", "value-columns", (value) => String(Math.round(value))], "range-glyph-scale": ["glyphScale", "value-glyph-scale", (value) => Number(value).toFixed(2)],
		"range-max-edges": ["maxEdges", "value-max-edges", (value) => String(Math.round(value))], "range-min-edges": ["minEdges", "value-min-edges", (value) => String(Math.round(value))],
		"range-noise": ["noise", "value-noise", (value) => Number(value).toFixed(2)], "range-rotation-x": ["rotationX", "value-rotation-x", (value) => `${Math.round(value)}°`],
		"range-rotation-y": ["rotationY", "value-rotation-y", (value) => `${Math.round(value)}°`], "range-rotation-z": ["rotationZ", "value-rotation-z", (value) => `${Math.round(value)}°`],
		"range-rows": ["rows", "value-rows", (value) => String(Math.round(value))], "range-stroke": ["stroke", "value-stroke", (value) => Number(value).toFixed(1)],
	});
	const selectBindings = Object.freeze({ "field-falloff": "falloff", "field-operation": "subsetOperation", "field-polarity": "polarity", "field-projection": "projection" });

	let configuration = registry.defaults;
	let phase = 0;
	let paused = motionQuery.matches;
	let frameHandle = 0;
	let lastFrameTime = 0;
	let resizeObserver = null;

	function setStatus(message, tone) { $("cubic-status-value").textContent = String(message).slice(0, 120); $("cubic-status").dataset.instrumentTone = tone || "active"; }
	function updateSummary(field) {
		const total = field.glyphs.reduce((sum, glyph) => sum + glyph.edgeIndices.length, 0);
		$("cubic-canvas-summary").textContent = `${configuration.rows} by ${configuration.columns} cube-edge field, ${configuration.subsetOperation} operation, ${total} visible edges, phase ${phase.toFixed(3)}, seed ${configuration.seed}.`;
		$("cubic-hud-status").textContent = `${configuration.subsetOperation.toUpperCase()} SUBSETS · PHASE ${phase.toFixed(3)} · ${paused ? "PAUSED" : "PLAYING"}`;
	}
	function setCanvasSize() { const rectangle = canvas.getBoundingClientRect(); const ratio = Math.max(1, global.devicePixelRatio || 1); const width = Math.max(1, Math.round(rectangle.width * ratio)); const height = Math.max(1, Math.round(rectangle.height * ratio)); if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; } }
	function paintLive() { if (!context) return; setCanvasSize(); const field = core.generateField(configuration, phase); core.paint(context, field, configuration, { height: canvas.height, width: canvas.width }); updateSummary(field); }
	function scheduleFrame() { if (!frameHandle) frameHandle = global.requestAnimationFrame(animate); }
	function animate(now) { frameHandle = 0; if (!lastFrameTime) lastFrameTime = now; const delta = Math.min(100, now - lastFrameTime); lastFrameTime = now; if (!paused) phase = (phase + delta / 32000) % 100; paintLive(); if (!paused) scheduleFrame(); }

	function encodeBase64Url(value) { const bytes = new TextEncoder().encode(value); let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, ""); }
	function decodeBase64Url(value) { if (typeof value !== "string" || value.length > Math.ceil(HASH_LIMIT_BYTES * 4 / 3) + 8) throw new Error("Configuration hash is too large."); const padded = value.replace(/-/gu, "+").replace(/_/gu, "/").padEnd(Math.ceil(value.length / 4) * 4, "="); const binary = atob(padded); const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0)); if (bytes.byteLength > HASH_LIMIT_BYTES) throw new Error("Configuration hash exceeds 16 KB."); return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
	function isPlainObject(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
	function configurationFromEnvelope(envelope) { if (!isPlainObject(envelope)) throw new Error("Configuration must be a JSON object."); if ("configuration" in envelope || "version" in envelope || "type" in envelope) { if (envelope.version !== HASH_VERSION) throw new Error("Configuration URL version is not supported."); if (envelope.type !== HASH_TYPE) throw new Error("Configuration URL belongs to another instrument."); if (!isPlainObject(envelope.configuration)) throw new Error("Configuration URL has no object state."); return envelope.configuration; } return envelope; }
	function updateHash(value) { const envelope = JSON.stringify({ configuration: value, type: HASH_TYPE, version: HASH_VERSION }); global.history.replaceState(null, "", `#config=${encodeBase64Url(envelope)}`); }
	function syncControls(value) { for (const [id, key] of Object.entries(selectBindings)) $(id).value = value[key]; for (const [id, [key, outputId, format]] of Object.entries(rangeBindings)) { $(id).value = value[key]; $(outputId).textContent = format(value[key]); } if (document.activeElement !== $("field-seed")) $("field-seed").value = value.seed; $("pause-resume").textContent = paused ? "Resume" : "Pause"; const serialized = JSON.stringify(value); panel.querySelectorAll("[data-preset]").forEach((button) => button.setAttribute("aria-pressed", String(serialized === JSON.stringify(PRESETS[button.dataset.preset])))); }
	function applyConfiguration(value, action) { configuration = value; phase = 0; lastFrameTime = 0; if (motionQuery.matches) paused = true; syncControls(configuration); updateHash(configuration); paintLive(); if (!paused) scheduleFrame(); if (action && action !== "initial") setStatus(action === "reset-configuration" ? "DEFAULTS · PHASE ZERO" : "CONFIGURED · PHASE ZERO", "active"); }
	function setControlsVisible(visible) { const active = document.activeElement; panel.classList.toggle("hidden", !visible); panel.inert = !visible; panel.setAttribute("aria-hidden", String(!visible)); document.body.dataset.controls = visible ? "visible" : "hidden"; toggle.setAttribute("aria-pressed", String(visible)); toggle.setAttribute("aria-expanded", String(visible)); if (!visible && panel.contains(active)) toggle.focus(); paintLive(); return { visible }; }
	function nextSeed() { const values = new Uint32Array(1); if (global.crypto && typeof global.crypto.getRandomValues === "function") global.crypto.getRandomValues(values); else values[0] = (Date.now() ^ Math.round(global.performance.now() * 1000)) >>> 0; return { seed: values[0] }; }
	function createArtifact() { const output = document.createElement("canvas"); output.width = 1600; output.height = 1000; const outputContext = output.getContext("2d"); if (!outputContext) throw new Error("Canvas 2D artifact export is unavailable."); const canonical = adapter.getConfiguration(); core.paint(outputContext, core.generateField(canonical, 0), canonical, { height: 1000, width: 1600 }); const dataUrl = output.toDataURL("image/png"); if (!dataUrl.startsWith("data:image/png;base64,")) throw new Error("The browser could not encode a PNG artifact."); return { dataUrl, filename: `cga76-cubic-limit-${canonical.subsetOperation}-${canonical.seed}.png`, height: 1000, mime: "image/png", width: 1600 }; }

	const adapter = registry.create({
		applyConfiguration, createArtifact, hideControls: () => setControlsVisible(false), nextSeed,
		pause: () => { paused = true; lastFrameTime = 0; syncControls(configuration); paintLive(); return { paused: true, phase }; },
		resume: () => { if (motionQuery.matches) { paused = true; phase = 0; lastFrameTime = 0; syncControls(configuration); paintLive(); return { paused: true, phase: 0, reducedMotion: true }; } paused = false; lastFrameTime = 0; syncControls(configuration); scheduleFrame(); return { paused: false, phase }; },
		showControls: () => setControlsVisible(true),
	});

	function loadSerialized(serialized, source) {
		try {
			if (new TextEncoder().encode(serialized).byteLength > HASH_LIMIT_BYTES) throw new Error("Configuration exceeds 16 KB.");
			const parsed = JSON.parse(serialized); const candidate = configurationFromEnvelope(parsed); const candidateKeys = Object.keys(candidate); const restored = adapter.restoreConfiguration(JSON.stringify(candidate));
			const wasNormalized = candidateKeys.some((key) => !(key in restored)) || JSON.stringify(candidate) !== JSON.stringify(restored);
			$("configuration-input").value = adapter.serializeConfiguration(); setStatus(wasNormalized ? `${source} NORMALIZED` : `${source} LOADED`, wasNormalized ? "attention" : "active"); return true;
		} catch (error) { setStatus(error instanceof Error ? error.message : "Configuration could not be loaded.", "error"); return false; }
	}

	if (!context) { $("cubic-fallback").hidden = false; panel.querySelectorAll("button, input, select, textarea").forEach((control) => { control.disabled = true; }); setStatus("CANVAS UNAVAILABLE", "error"); return; }
	const rangeContract = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installRangeContract(document); resizeObserver = new ResizeObserver(() => paintLive()); resizeObserver.observe(canvas); setControlsVisible(document.body.dataset.controls !== "hidden");
	for (const [id, key] of Object.entries(selectBindings)) $(id).addEventListener("change", (event) => adapter.configure({ [key]: event.target.value }));
	for (const [id, [key]] of Object.entries(rangeBindings)) $(id).addEventListener("input", (event) => adapter.configure({ [key]: Number(event.target.value) }));
	$("field-seed").addEventListener("change", (event) => adapter.configure({ seed: Number(event.target.value) })); panel.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => adapter.configure(PRESETS[button.dataset.preset])));
	$("randomize").addEventListener("click", () => adapter.execute("randomize")); $("reset-configuration").addEventListener("click", () => adapter.execute("reset-configuration")); $("pause-resume").addEventListener("click", () => adapter.execute(paused ? "resume" : "pause"));
	$("canonical-phase").addEventListener("click", () => { phase = 0; lastFrameTime = 0; paintLive(); setStatus("CANONICAL PHASE ZERO", "active"); });
	$("hide-controls").addEventListener("click", () => adapter.execute("hide-controls")); $("toggle-controls").addEventListener("click", () => adapter.execute(panel.classList.contains("hidden") ? "show-controls" : "hide-controls"));
	$("load-configuration").addEventListener("click", () => loadSerialized($("configuration-input").value, "CONFIG")); $("select-configuration").addEventListener("click", () => { $("configuration-input").focus(); $("configuration-input").select(); });
	$("copy-configuration").addEventListener("click", async () => { const result = adapter.execute("copy-config"); if (!result.ok) return setStatus("COPY FAILED", "error"); const serialized = result.value.serialized; $("configuration-input").value = serialized; try { if (!navigator.clipboard || !global.isSecureContext) throw new Error("Clipboard unavailable"); await navigator.clipboard.writeText(serialized); setStatus("CONFIG COPIED", "active"); } catch { $("configuration-input").focus(); $("configuration-input").select(); setStatus("COPY DENIED · TEXT SELECTED", "attention"); } });
	$("export-artifact").addEventListener("click", () => { const result = adapter.execute("create-artifact"); if (!result.ok) return setStatus(result.error.message, "error"); const anchor = document.createElement("a"); anchor.href = result.value.dataUrl; anchor.download = result.value.filename; anchor.click(); setStatus("PNG CREATED", "active"); });
	document.addEventListener("keydown", (event) => { const interactive = event.target instanceof HTMLElement && (event.target.matches("a, button, input, select, summary, textarea") || event.target.isContentEditable); if (interactive) return; if (event.key === " ") { event.preventDefault(); adapter.execute(paused ? "resume" : "pause"); } if (event.key === "h" || event.key === "H") adapter.execute(panel.classList.contains("hidden") ? "show-controls" : "hide-controls"); });
	function onMotionChange(event) { if (event.matches) { paused = true; phase = 0; lastFrameTime = 0; paintLive(); syncControls(configuration); setStatus("REDUCED MOTION · PHASE ZERO", "active"); } else { paused = true; syncControls(configuration); setStatus("MOTION AVAILABLE · PRESS RESUME", "attention"); } }
	if (typeof motionQuery.addEventListener === "function") motionQuery.addEventListener("change", onMotionChange); else motionQuery.addListener(onMotionChange);

	let restoredFromHash = false; const encoded = new URLSearchParams(global.location.hash.slice(1)).get("config");
	if (encoded) { try { const decoded = decodeBase64Url(encoded); const envelope = JSON.parse(decoded); if (!isPlainObject(envelope) || envelope.version !== HASH_VERSION || envelope.type !== HASH_TYPE || !isPlainObject(envelope.configuration)) throw new Error("Configuration URL requires a valid versioned envelope."); restoredFromHash = loadSerialized(decoded, "URL"); } catch (error) { applyConfiguration(adapter.getConfiguration(), "initial"); setStatus(error instanceof Error ? error.message : "Configuration URL is invalid.", "error"); } }
	if (!restoredFromHash && !encoded) { applyConfiguration(adapter.getConfiguration(), "initial"); setStatus(motionQuery.matches ? "PHASE ZERO · REDUCED MOTION" : "READY", "active"); }
	if (!paused) scheduleFrame();

	const instrumentState = global.SUPERMEGA_INSTRUMENT.createState(); instrumentState.appearance.grain = false; instrumentState.shell.overviewVisible = false;
	global.CGA76_CUBIC_MATERIALS = global.SUPERMEGA_INSTRUMENT.enhance(document.body, instrumentState); global.CGA76_CUBIC_ADAPTER = adapter; global.CGA76_CUBIC_RANGE_CONTRACT = rangeContract;
	global.CGA76_CUBIC_PAGE = Object.freeze({ getPhase: () => phase, isPaused: () => paused, loadSerialized, paintLive });
	if (global.parent !== global) global.CGA76_CUBIC_BRIDGE = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installBridge(adapter, { strict: true });
	global.addEventListener("beforeunload", () => { if (frameHandle) global.cancelAnimationFrame(frameHandle); if (resizeObserver) resizeObserver.disconnect(); rangeContract.destroy(); global.CGA76_CUBIC_BRIDGE?.destroy(); }, { once: true });
})(window);
