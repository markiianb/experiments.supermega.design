(function ordinalFifteenPage(global) {
	"use strict";

	const $ = (id) => document.getElementById(id);
	const canvas = $("ordinal-canvas");
	const panel = $("ordinal-panel");
	const toggle = $("toggle-controls");
	const core = global.CGA76_ORDINAL_CORE;
	const registry = global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76OrdinalFifteen;
	const context = canvas.getContext("2d");
	const motionQuery = global.matchMedia("(prefers-reduced-motion: reduce)");
	const HASH_LIMIT_BYTES = 16 * 1024;
	const HASH_TYPE = "cga76-ordinal-fifteen";
	const HASH_VERSION = 1;
	const SOURCE_PRESET = Object.freeze({ ...registry.defaults });
	const SUPERMEGA_PRESET = Object.freeze({
		...registry.defaults,
		curveAmplitude: 0.42,
		family: "latin-cross",
		hatchAngle: -48,
		hatchSpacing: 6,
		interpolationSteps: 11,
		lineWeight: 2.4,
		mapping: "reverse",
		mazeDensity: 10,
		negativeSpace: "ghost",
		palette: "supermega",
		pathContinuity: 0.64,
		polarity: "split",
		seed: 1976,
		turnBias: -0.55,
	});
	const PRESETS = Object.freeze({ source: SOURCE_PRESET, supermega: SUPERMEGA_PRESET });
	const rangeBindings = Object.freeze({
		"range-build-speed": ["buildSpeed", "value-build-speed", (value) => Number(value).toFixed(1)],
		"range-continuity": ["pathContinuity", "value-continuity", (value) => Number(value).toFixed(2)],
		"range-curve-amplitude": ["curveAmplitude", "value-curve-amplitude", (value) => Number(value).toFixed(2)],
		"range-hatch-angle": ["hatchAngle", "value-hatch-angle", (value) => `${Math.round(value)}°`],
		"range-hatch-spacing": ["hatchSpacing", "value-hatch-spacing", (value) => String(Math.round(value))],
		"range-interpolations": ["interpolationSteps", "value-interpolations", (value) => String(Math.round(value))],
		"range-line-weight": ["lineWeight", "value-line-weight", (value) => Number(value).toFixed(1)],
		"range-maze-density": ["mazeDensity", "value-maze-density", (value) => String(Math.round(value))],
		"range-turn-bias": ["turnBias", "value-turn-bias", (value) => Number(value).toFixed(2)],
	});
	const selectBindings = Object.freeze({
		"field-family": "family",
		"field-mapping": "mapping",
		"field-negative": "negativeSpace",
		"field-palette": "palette",
		"field-polarity": "polarity",
	});

	let configuration = registry.defaults;
	let field = core.generate(configuration);
	let progress = motionQuery.matches ? 1 : 0;
	let paused = motionQuery.matches;
	let frameHandle = 0;
	let lastFrameTime = 0;
	let resizeObserver = null;

	function setStatus(message, tone) {
		$("ordinal-status-value").textContent = String(message).slice(0, 120);
		$("ordinal-status").dataset.instrumentTone = tone || "active";
	}

	function updateSummary() {
		const visible = Math.round(progress * 25);
		$("ordinal-canvas-summary").textContent = `Five-by-five ${configuration.family} field. Four generated motif families, ${configuration.negativeSpace} fifth state, ${visible} of 25 cells shown, seed ${configuration.seed}.`;
		$("ordinal-hud-status").textContent = `${configuration.palette === "source" ? "SOURCE STUDY" : "SUPERMEGA"} · SEED ${configuration.seed} · ${paused ? "PAUSED" : progress >= 1 ? "FINAL" : "BUILDING"}`;
	}

	function setCanvasSize() {
		const rectangle = canvas.getBoundingClientRect();
		const ratio = Math.max(1, global.devicePixelRatio || 1);
		const width = Math.max(1, Math.round(rectangle.width * ratio));
		const height = Math.max(1, Math.round(rectangle.height * ratio));
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
		}
	}

	function paintLive() {
		if (!context) return;
		setCanvasSize();
		core.paint(context, field, configuration, {
			height: canvas.height,
			progress,
			width: canvas.width,
		});
		updateSummary();
	}

	function scheduleFrame() {
		if (!frameHandle) frameHandle = global.requestAnimationFrame(animate);
	}

	function animate(now) {
		frameHandle = 0;
		if (!lastFrameTime) lastFrameTime = now;
		const delta = Math.min(100, now - lastFrameTime);
		lastFrameTime = now;
		if (!paused && progress < 1) {
			const duration = 900 + (12 - configuration.buildSpeed) * 260;
			progress = Math.min(1, progress + delta / duration);
		}
		paintLive();
		if (!paused && progress < 1) scheduleFrame();
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

	function isPlainObject(value) {
		return Boolean(value) && typeof value === "object" && !Array.isArray(value);
	}

	function configurationFromEnvelope(envelope, requireEnvelope) {
		if (!isPlainObject(envelope)) throw new Error("Configuration must be a JSON object.");
		if ("configuration" in envelope || "version" in envelope || "type" in envelope) {
			if (envelope.version !== HASH_VERSION) throw new Error("Configuration URL version is not supported.");
			if (envelope.type !== HASH_TYPE) throw new Error("Configuration URL belongs to another instrument.");
			if (!isPlainObject(envelope.configuration)) throw new Error("Configuration URL has no object state.");
			return envelope.configuration;
		}
		if (requireEnvelope) throw new Error("Configuration URL requires a versioned envelope.");
		return envelope;
	}

	function updateHash(value) {
		const envelope = JSON.stringify({ configuration: value, type: HASH_TYPE, version: HASH_VERSION });
		global.history.replaceState(null, "", `#config=${encodeBase64Url(envelope)}`);
	}

	function syncControls(value) {
		for (const [id, key] of Object.entries(selectBindings)) $(id).value = value[key];
		for (const [id, [key, outputId, format]] of Object.entries(rangeBindings)) {
			$(id).value = value[key];
			$(outputId).textContent = format(value[key]);
		}
		if (document.activeElement !== $("field-seed")) $("field-seed").value = value.seed;
		$("pause-resume").textContent = paused ? "Resume" : "Pause";
		panel.querySelectorAll("[data-preset]").forEach((button) => {
			const preset = PRESETS[button.dataset.preset];
			const active = Object.keys(preset).every((key) => value[key] === preset[key]);
			button.setAttribute("aria-pressed", String(active));
		});
	}

	function applyConfiguration(value, action) {
		configuration = value;
		field = core.generate(configuration);
		progress = motionQuery.matches ? 1 : 0;
		if (motionQuery.matches) paused = true;
		lastFrameTime = 0;
		syncControls(configuration);
		updateHash(configuration);
		paintLive();
		if (!paused && progress < 1) scheduleFrame();
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
		const output = document.createElement("canvas");
		output.width = 1600;
		output.height = 1000;
		const outputContext = output.getContext("2d");
		if (!outputContext) throw new Error("Canvas 2D artifact export is unavailable.");
		const canonical = adapter.getConfiguration();
		core.paint(outputContext, core.generate(canonical), canonical, { height: 1000, progress: 1, width: 1600 });
		const dataUrl = output.toDataURL("image/png");
		if (!dataUrl.startsWith("data:image/png;base64,")) throw new Error("The browser could not encode a PNG artifact.");
		return {
			dataUrl,
			filename: `cga76-ordinal-fifteen-${canonical.palette}-${canonical.seed}.png`,
			height: 1000,
			mime: "image/png",
			width: 1600,
		};
	}

	const adapter = registry.create({
		applyConfiguration,
		createArtifact,
		hideControls: () => setControlsVisible(false),
		nextSeed,
		pause: () => {
			paused = true;
			lastFrameTime = 0;
			syncControls(configuration);
			updateSummary();
			return { paused: true, progress };
		},
		resume: () => {
			if (motionQuery.matches) {
				progress = 1;
				paused = true;
				paintLive();
				setStatus("REDUCED MOTION · FINAL STILL", "attention");
				return { paused: true, progress, reducedMotion: true };
			}
			if (progress >= 1) progress = 0;
			paused = false;
			lastFrameTime = 0;
			syncControls(configuration);
			scheduleFrame();
			return { paused: false, progress };
		},
		showControls: () => setControlsVisible(true),
	});

	function loadSerialized(serialized, source, options) {
		try {
			const bytes = new TextEncoder().encode(serialized);
			if (bytes.byteLength > HASH_LIMIT_BYTES) throw new Error("Configuration exceeds 16 KB.");
			const parsed = JSON.parse(serialized);
			const candidate = configurationFromEnvelope(parsed, options?.requireEnvelope === true);
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
		$("ordinal-fallback").hidden = false;
		panel.querySelectorAll("button, input, select, textarea").forEach((control) => { control.disabled = true; });
		setStatus("CANVAS UNAVAILABLE", "error");
		return;
	}

	const rangeContract = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installRangeContract(document);
	resizeObserver = new ResizeObserver(() => paintLive());
	resizeObserver.observe(canvas);
	setControlsVisible(document.body.dataset.controls !== "hidden");

	for (const [id, key] of Object.entries(selectBindings)) {
		$(id).addEventListener("change", (event) => adapter.configure({ [key]: event.target.value }));
	}
	for (const [id, [key]] of Object.entries(rangeBindings)) {
		$(id).addEventListener("input", (event) => adapter.configure({ [key]: Number(event.target.value) }));
	}
	$("field-seed").addEventListener("change", (event) => adapter.configure({ seed: Number(event.target.value) }));
	panel.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => adapter.configure(PRESETS[button.dataset.preset])));
	$("randomize").addEventListener("click", () => adapter.execute("randomize"));
	$("reset-configuration").addEventListener("click", () => adapter.execute("reset-configuration"));
	$("pause-resume").addEventListener("click", () => adapter.execute(paused ? "resume" : "pause"));
	$("replay").addEventListener("click", () => {
		if (motionQuery.matches) {
			progress = 1;
			paused = true;
			paintLive();
			setStatus("REDUCED MOTION · FINAL STILL", "attention");
			return;
		}
		progress = 0;
		paused = false;
		lastFrameTime = 0;
		syncControls(configuration);
		scheduleFrame();
		setStatus("REPLAY", "active");
	});
	$("hide-controls").addEventListener("click", () => adapter.execute("hide-controls"));
	$("toggle-controls").addEventListener("click", () => adapter.execute(panel.classList.contains("hidden") ? "show-controls" : "hide-controls"));
	$("load-configuration").addEventListener("click", () => loadSerialized($("configuration-input").value, "CONFIG"));
	$("select-configuration").addEventListener("click", () => {
		$("configuration-input").focus();
		$("configuration-input").select();
	});
	$("copy-configuration").addEventListener("click", async () => {
		const result = adapter.execute("copy-config");
		if (!result.ok) return setStatus("COPY FAILED", "error");
		const serialized = result.value.serialized;
		$("configuration-input").value = serialized;
		try {
			if (!navigator.clipboard || !global.isSecureContext) throw new Error("Clipboard unavailable");
			await navigator.clipboard.writeText(serialized);
			setStatus("CONFIG COPIED", "active");
		} catch {
			$("configuration-input").focus();
			$("configuration-input").select();
			setStatus("COPY DENIED · TEXT SELECTED", "attention");
		}
	});
	$("export-artifact").addEventListener("click", () => {
		const result = adapter.execute("create-artifact");
		if (!result.ok) return setStatus(result.error.message, "error");
		const anchor = document.createElement("a");
		anchor.href = result.value.dataUrl;
		anchor.download = result.value.filename;
		anchor.click();
		setStatus("PNG CREATED", "active");
	});

	document.addEventListener("keydown", (event) => {
		const editable = event.target instanceof HTMLElement && (event.target.matches("input, textarea, select") || event.target.isContentEditable);
		if (editable) return;
		if (event.key === " ") {
			event.preventDefault();
			adapter.execute(paused ? "resume" : "pause");
		}
		if (event.key === "h" || event.key === "H") adapter.execute(panel.classList.contains("hidden") ? "show-controls" : "hide-controls");
	});

	function onMotionChange(event) {
		if (event.matches) {
			progress = 1;
			paused = true;
			lastFrameTime = 0;
			paintLive();
			setStatus("REDUCED MOTION · FINAL STILL", "active");
		} else {
			paused = true;
			syncControls(configuration);
			setStatus("MOTION AVAILABLE · PRESS RESUME", "attention");
		}
	}
	if (typeof motionQuery.addEventListener === "function") motionQuery.addEventListener("change", onMotionChange);
	else motionQuery.addListener(onMotionChange);

	let restoredFromHash = false;
	const hashParameters = new URLSearchParams(global.location.hash.slice(1));
	const encoded = hashParameters.get("config");
	if (encoded) {
		try {
			restoredFromHash = loadSerialized(decodeBase64Url(encoded), "URL", { requireEnvelope: true });
		} catch (error) {
			applyConfiguration(adapter.getConfiguration(), "initial");
			setStatus(error instanceof Error ? error.message : "Configuration URL is invalid.", "error");
		}
	}
	if (!restoredFromHash && !encoded) {
		applyConfiguration(adapter.getConfiguration(), "initial");
		setStatus(motionQuery.matches ? "FINAL STILL" : "READY", "active");
	}

	const instrumentState = global.SUPERMEGA_INSTRUMENT.createState();
	instrumentState.appearance.grain = false;
	instrumentState.shell.overviewVisible = false;
	global.CGA76_ORDINAL_MATERIALS = global.SUPERMEGA_INSTRUMENT.enhance(document.body, instrumentState);
	global.CGA76_ORDINAL_ADAPTER = adapter;
	global.CGA76_ORDINAL_RANGE_CONTRACT = rangeContract;
	global.CGA76_ORDINAL_PAGE = Object.freeze({
		getProgress: () => progress,
		isPaused: () => paused,
		loadSerialized,
		paintLive,
	});
	if (global.parent !== global) {
		global.CGA76_ORDINAL_BRIDGE = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installBridge(adapter, { strict: true });
	}

	global.addEventListener("beforeunload", () => {
		if (frameHandle) global.cancelAnimationFrame(frameHandle);
		if (resizeObserver) resizeObserver.disconnect();
		rangeContract.destroy();
		global.CGA76_ORDINAL_BRIDGE?.destroy();
	}, { once: true });
})(window);
