(function tangentPolygonPage(global) {
	"use strict";
	const $ = (id) => document.getElementById(id);
	const canvas = $("art");
	const context = canvas.getContext("2d");
	const panel = $("panel");
	const toggle = $("toggle-controls");
	const core = global.CGA76_TANGENT_CORE;
	const registry = global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76TangentPolygons;
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
	const HASH_LIMIT = 16 * 1024;
	const HASH_TYPE = "cga76-tangent-polygons";
	const HASH_VERSION = 1;
	const SOURCE_PRESET = Object.freeze({ ...registry.defaults });
	const SUPERMEGA_PRESET = Object.freeze({ ...registry.defaults, direction: "spiral", edgeCount: 4, edgeSpan: 7, guides: true, lineWidth: 2.1, offsetX: 29, offsetY: -17, parentMode: "any", phase: 0.31, polygonMax: 13, polygonMin: 7, presentation: "reverse", radiusDistribution: "alternating", radiusMax: 61, radiusMin: 18, repeatCount: 7, seed: 7615, steps: 56, turnBias: 0.64 });
	const PRESETS = Object.freeze({ source: SOURCE_PRESET, supermega: SUPERMEGA_PRESET });
	const ranges = Object.freeze({
		"range-edge-count": ["edgeCount", "value-edge-count", (value) => String(Math.round(value))],
		"range-edge-span": ["edgeSpan", "value-edge-span", (value) => String(Math.round(value))],
		"range-offset-x": ["offsetX", "value-offset-x", (value) => String(Math.round(value))],
		"range-offset-y": ["offsetY", "value-offset-y", (value) => String(Math.round(value))],
		"range-phase": ["phase", "value-phase", (value) => Number(value).toFixed(3)],
		"range-polygon-max": ["polygonMax", "value-polygon-max", (value) => String(Math.round(value))],
		"range-polygon-min": ["polygonMin", "value-polygon-min", (value) => String(Math.round(value))],
		"range-radius-max": ["radiusMax", "value-radius-max", (value) => String(Math.round(value))],
		"range-radius-min": ["radiusMin", "value-radius-min", (value) => String(Math.round(value))],
		"range-repeats": ["repeatCount", "value-repeats", (value) => String(Math.round(value))],
		"range-speed": ["drawSpeed", "value-speed", (value) => Number(value).toFixed(1)],
		"range-steps": ["steps", "value-steps", (value) => String(Math.round(value))],
		"range-turn": ["turnBias", "value-turn", (value) => Number(value).toFixed(2)],
		"range-weight": ["lineWidth", "value-weight", (value) => Number(value).toFixed(1)],
	});
	const selects = Object.freeze({ "field-direction": "direction", "field-distribution": "radiusDistribution", "field-parent": "parentMode", "field-presentation": "presentation", "field-tangency": "tangency" });
	let configuration = registry.defaults;
	let construction = core.buildChain(configuration);
	let progress = reducedMotion.matches ? 1 : 0;
	let paused = reducedMotion.matches;
	let lastFrame = 0;
	let frameRequest = 0;
	let resizeObserver = null;

	function status(message, tone = "active") { $("status-value").textContent = String(message).slice(0, 140); $("status").dataset.instrumentTone = tone; }
	function base64UrlEncode(value) { const bytes = new TextEncoder().encode(value); let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, ""); }
	function base64UrlDecode(value) { if (typeof value !== "string" || value.length > 22000) throw new Error("Configuration hash is too large."); const raw = atob(value.replace(/-/gu, "+").replace(/_/gu, "/").padEnd(Math.ceil(value.length / 4) * 4, "=")); const bytes = Uint8Array.from(raw, (character) => character.charCodeAt(0)); if (bytes.byteLength > HASH_LIMIT) throw new Error("Configuration hash exceeds 16 KB."); return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
	function plainObject(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
	function configurationCandidate(value, requireEnvelope) { if (!plainObject(value)) throw new Error("Configuration must be a JSON object."); if (requireEnvelope || "configuration" in value || "type" in value || "version" in value) { if (value.version !== HASH_VERSION || value.type !== HASH_TYPE || !plainObject(value.configuration)) throw new Error("Configuration envelope is not valid for this instrument."); return value.configuration; } return value; }
	function updateHash(value) { history.replaceState(null, "", `#config=${base64UrlEncode(JSON.stringify({ configuration: value, type: HASH_TYPE, version: HASH_VERSION }))}`); }
	function sizeCanvas() { const rectangle = canvas.getBoundingClientRect(); const ratio = Math.max(1, global.devicePixelRatio || 1); const width = Math.max(1, Math.round(rectangle.width * ratio)); const height = Math.max(1, Math.round(rectangle.height * ratio)); if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; } }
	function liveInsets() {
		const canvasRect = canvas.getBoundingClientRect(); const ratio = canvasRect.width ? canvas.width / canvasRect.width : 1; const insets = { bottom: 0, left: 0, right: 0, top: 0 };
		const chrome = document.querySelector(".instrument-renderer-chrome")?.getBoundingClientRect(); if (chrome && chrome.bottom > canvasRect.top && chrome.top < canvasRect.bottom) insets.top = Math.max(0, chrome.bottom - canvasRect.top) * ratio;
		if (!panel.classList.contains("hidden")) { const panelRect = panel.getBoundingClientRect(); if (panelRect.left > canvasRect.left && panelRect.left < canvasRect.right && panelRect.top < canvasRect.bottom) insets.right = Math.max(0, canvasRect.right - panelRect.left) * ratio; }
		for (const selector of [".instrument-renderer-hud--bottom", ".instrument-renderer-credit", ".instrument-renderer-dock"]) { const rectangle = document.querySelector(selector)?.getBoundingClientRect(); if (rectangle && rectangle.top > canvasRect.top && rectangle.top < canvasRect.bottom) insets.bottom = Math.max(insets.bottom, canvasRect.bottom - rectangle.top); }
		insets.bottom *= ratio;
		return insets;
	}
	function updateSummary() { $("canvas-summary").textContent = `${configuration.steps} circles in a deterministic ${configuration.tangency} tangent chain at seed ${configuration.seed}. Each circle emits ${configuration.edgeCount} polygon edges. ${configuration.repeatCount} translated copies. Trace ${Math.round(progress * 100)} percent complete.`; $("hud").textContent = `${configuration.tangency.toUpperCase()} · ${configuration.steps} CIRCLES · ${paused ? (progress >= 1 ? "FINAL" : "PAUSED") : "DRAWING"}`; $("value-progress").textContent = `${Math.round(progress * 100)}%`; }
	function paintLive() { if (!context) return; sizeCanvas(); core.paint(context, construction, configuration, { height: canvas.height, progress, safeInsets: liveInsets(), width: canvas.width }); updateSummary(); }
	function syncMotion() { $("pause").textContent = paused ? "Resume" : "Pause"; updateSummary(); }
	function frame(now) { frameRequest = 0; if (!lastFrame) lastFrame = now; const delta = Math.min(80, now - lastFrame); lastFrame = now; if (!paused) progress = Math.min(1, progress + delta / (24000 / configuration.drawSpeed)); if (progress >= 1) paused = true; paintLive(); syncMotion(); if (!paused) frameRequest = requestAnimationFrame(frame); }
	function schedule() { if (!paused && !frameRequest) frameRequest = requestAnimationFrame(frame); }
	function syncControls(value) {
		for (const [id, key] of Object.entries(selects)) $(id).value = value[key];
		for (const [id, [key, output, format]] of Object.entries(ranges)) { $(id).value = value[key]; $(output).textContent = format(value[key]); }
		$("field-seed").value = value.seed; $("field-guides").checked = value.guides; $("range-edge-count").max = String(value.edgeSpan); $("range-edge-span").max = String(value.polygonMin);
		const serialized = JSON.stringify(value); panel.querySelectorAll("[data-preset]").forEach((button) => button.setAttribute("aria-pressed", String(serialized === JSON.stringify(PRESETS[button.dataset.preset])))); syncMotion();
	}
	function applyConfiguration(value, action) { configuration = value; construction = core.buildChain(value); progress = reducedMotion.matches ? 1 : 0; paused = reducedMotion.matches; lastFrame = 0; syncControls(value); updateHash(value); paintLive(); schedule(); if (action && action !== "initial") status(action === "reset-configuration" ? "SOURCE DEFAULTS · TRACE RESET" : action === "randomize" ? "NEW SEED · TRACE RESET" : "CONFIGURED · TRACE RESET"); }
	function controlsVisible(visible) { const active = document.activeElement; panel.classList.toggle("hidden", !visible); panel.inert = !visible; panel.setAttribute("aria-hidden", String(!visible)); document.body.dataset.controls = visible ? "visible" : "hidden"; toggle.setAttribute("aria-pressed", String(visible)); toggle.setAttribute("aria-expanded", String(visible)); if (!visible && panel.contains(active)) toggle.focus(); requestAnimationFrame(paintLive); return { visible }; }
	function nextSeed() { const values = new Uint32Array(1); if (global.crypto && typeof global.crypto.getRandomValues === "function") global.crypto.getRandomValues(values); else values[0] = (Date.now() ^ Math.round(global.performance.now() * 1000)) >>> 0; return { seed: values[0] }; }
	function createArtifact() { const value = adapter.getConfiguration(); const output = document.createElement("canvas"); output.width = 1600; output.height = 1000; const outputContext = output.getContext("2d"); if (!outputContext) throw new Error("Canvas 2D artifact export is unavailable."); core.paint(outputContext, core.buildChain(value), value, { height: 1000, progress: 1, safeInsets: {}, width: 1600 }); const dataUrl = output.toDataURL("image/png"); if (!dataUrl.startsWith("data:image/png;base64,")) throw new Error("PNG encoding failed."); return { dataUrl, filename: `cga76-tangent-polygons-${value.presentation}-${value.seed}.png`, height: 1000, mime: "image/png", width: 1600 }; }
	const adapter = registry.create({ applyConfiguration, createArtifact, hideControls: () => controlsVisible(false), nextSeed, pause: () => { paused = true; lastFrame = 0; syncMotion(); paintLive(); return { paused: true, progress }; }, resume: () => { if (reducedMotion.matches) { paused = true; progress = 1; syncMotion(); paintLive(); return { paused: true, progress, reducedMotion: true }; } if (progress >= 1) progress = 0; paused = false; lastFrame = 0; syncMotion(); schedule(); return { paused: false, progress }; }, showControls: () => controlsVisible(true) });
	function loadSerialized(serialized, source, options) { try { if (new TextEncoder().encode(serialized).byteLength > HASH_LIMIT) throw new Error("Configuration exceeds 16 KB."); const parsed = JSON.parse(serialized); const candidate = configurationCandidate(parsed, options?.requireEnvelope === true); const before = JSON.stringify(candidate); const restored = adapter.restoreConfiguration(JSON.stringify(candidate)); $("config").value = adapter.serializeConfiguration(); status(before === JSON.stringify(restored) ? `${source} LOADED` : `${source} NORMALIZED`, before === JSON.stringify(restored) ? "active" : "attention"); return true; } catch (error) { status(error instanceof Error ? error.message : "Configuration could not be loaded.", "error"); return false; } }
	if (!context) { $("fallback").hidden = false; panel.querySelectorAll("button,input,select,textarea").forEach((control) => { control.disabled = true; }); status("CANVAS UNAVAILABLE", "error"); return; }
	const rangeContract = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installRangeContract(document); resizeObserver = new ResizeObserver(paintLive); resizeObserver.observe(canvas);
	for (const [id, key] of Object.entries(selects)) $(id).addEventListener("change", (event) => adapter.configure({ [key]: event.target.value }));
	for (const [id, [key]] of Object.entries(ranges)) $(id).addEventListener("input", (event) => adapter.configure({ [key]: Number(event.target.value) }));
	$("field-seed").addEventListener("change", (event) => adapter.configure({ seed: Number(event.target.value) })); $("field-guides").addEventListener("change", (event) => adapter.configure({ guides: event.target.checked }));
	panel.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => adapter.configure(PRESETS[button.dataset.preset])));
	$("randomize").addEventListener("click", () => adapter.execute("randomize")); $("defaults").addEventListener("click", () => adapter.execute("reset-configuration")); $("pause").addEventListener("click", () => adapter.execute(paused ? "resume" : "pause")); $("replay").addEventListener("click", () => { progress = reducedMotion.matches ? 1 : 0; paused = reducedMotion.matches; lastFrame = 0; syncMotion(); paintLive(); schedule(); status(reducedMotion.matches ? "REDUCED MOTION · CANONICAL FINAL" : "TRACE RESTARTED", reducedMotion.matches ? "attention" : "active"); });
	$("hide-controls").addEventListener("click", () => adapter.execute("hide-controls")); toggle.addEventListener("click", () => adapter.execute(panel.classList.contains("hidden") ? "show-controls" : "hide-controls")); $("load").addEventListener("click", () => loadSerialized($("config").value, "CONFIG")); $("select-text").addEventListener("click", () => { $("config").focus(); $("config").select(); });
	$("copy").addEventListener("click", async () => { const outcome = adapter.execute("copy-config"); if (!outcome.ok) return status("COPY FAILED", "error"); const serialized = outcome.value.serialized; $("config").value = serialized; try { if (!navigator.clipboard || !global.isSecureContext) throw new Error("Clipboard unavailable"); await navigator.clipboard.writeText(serialized); status("CONFIG COPIED"); } catch { $("config").focus(); $("config").select(); status("COPY DENIED · TEXT SELECTED", "attention"); } });
	$("export").addEventListener("click", () => { const outcome = adapter.execute("create-artifact"); if (!outcome.ok) return status(outcome.error.message, "error"); const anchor = document.createElement("a"); anchor.href = outcome.value.dataUrl; anchor.download = outcome.value.filename; anchor.click(); status("FINAL-FRAME PNG CREATED"); });
	reducedMotion.addEventListener?.("change", (event) => { paused = true; progress = event.matches ? 1 : progress; lastFrame = 0; syncMotion(); paintLive(); status(event.matches ? "REDUCED MOTION · CANONICAL FINAL" : "MOTION AVAILABLE · PRESS RESUME", event.matches ? "active" : "attention"); });
	let restored = false; const encoded = new URLSearchParams(location.hash.slice(1)).get("config"); if (encoded) { try { restored = loadSerialized(base64UrlDecode(encoded), "URL", { requireEnvelope: true }); } catch (error) { applyConfiguration(adapter.getConfiguration(), "initial"); status(error instanceof Error ? error.message : "Configuration URL is invalid.", "error"); } } if (!restored && !encoded) { applyConfiguration(adapter.getConfiguration(), "initial"); status(reducedMotion.matches ? "CANONICAL FINAL · REDUCED MOTION" : "READY · DRAWING"); }
	controlsVisible(document.body.dataset.controls !== "hidden");
	const instrumentState = global.SUPERMEGA_INSTRUMENT.createState(); instrumentState.appearance.grain = false; instrumentState.shell.overviewVisible = false; global.CGA76_TANGENT_MATERIALS = global.SUPERMEGA_INSTRUMENT.enhance(document.body, instrumentState);
	global.CGA76_TANGENT_ADAPTER = adapter; global.CGA76_TANGENT_RANGE_CONTRACT = rangeContract; global.CGA76_TANGENT_PAGE = Object.freeze({ getConstructionHash: () => core.constructionHash(construction), getProgress: () => progress, isPaused: () => paused, loadSerialized, paintLive });
	if (global.parent !== global) global.CGA76_TANGENT_BRIDGE = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installBridge(adapter, { strict: true });
	global.addEventListener("beforeunload", () => { if (frameRequest) cancelAnimationFrame(frameRequest); resizeObserver?.disconnect(); rangeContract.destroy(); global.CGA76_TANGENT_BRIDGE?.destroy(); }, { once: true });
})(window);
