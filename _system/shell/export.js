(function instrumentShellExport(global) {
	"use strict";

	/* =============================================================================
	   Export — one module for every shell page.

	   The page hands over a `renderFrame(ctx, width, height, time)` and a bounds
	   provider. The shell allocates the offscreen canvas, fills the background
	   only when the schema says to, calls the renderer, encodes, and reports.

	   It never touches the live canvas. Reading pixels off the thing on screen
	   ties the artifact to the window size and to whatever the viewport was doing
	   when the button was pressed (KTD7).

	   Every failure is a typed error rendered in the kit's status line. Not a
	   thrown exception, and never a silent no-op: an export that does nothing is
	   indistinguishable from a slow one.
	   ========================================================================== */

	const shell = global.SUPERMEGA_INSTRUMENT_SHELL || {};
	const CAP = 8192;
	const LONG_EDGES = [2048, 4096, 8192];

	const MESSAGES = {
		"bounds-invalid": () => "The tool reported an artboard with no size.",
		"encode-failed": (detail) => `The browser could not encode ${(detail && detail.format) || "the image"}.`,
		"export-failed": () => "The export did not finish.",
		"no-renderer": () => "This page has not handed the shell a frame renderer.",
		"no-vector": () => "This tool has no vector renderer, so it cannot write an SVG.",
		"recording-interrupted": () => "A control moved while recording, so the take was discarded.",
		"size-cap": (detail) => `The long edge is capped at ${(detail && detail.cap) || CAP} px.`,
		"size-invalid": () => "That is not a size.",
		"video-unsupported": () => "This browser encodes neither MP4 nor WebM here.",
	};

	function exportError(code, detail) {
		const known = MESSAGES[code] ? code : "export-failed";
		return { code: known, detail: detail || null, message: MESSAGES[known](detail) };
	}

	/**
	 * Pixels from an aspect and a long edge. The short edge rounds, but never to
	 * zero: a 1:400 strip is still one pixel wide.
	 */
	function exportSize(bounds, longEdge) {
		const width = Number(bounds && bounds.width);
		const height = Number(bounds && bounds.height);
		if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
			return { error: "bounds-invalid", height: 0, width: 0 };
		}
		const asked = Number(longEdge);
		if (!Number.isFinite(asked) || asked <= 0) return { error: "size-invalid", height: 0, width: 0 };
		const edge = Math.min(CAP, asked);
		const error = asked > CAP ? "size-cap" : undefined;
		const landscape = width >= height;
		const out = landscape
			? { height: Math.max(1, Math.round((edge * height) / width)), width: edge }
			: { height: edge, width: Math.max(1, Math.round((edge * width) / height)) };
		return error ? { ...out, error } : out;
	}

	/**
	 * Transparent unless the schema's background is on — and JPG cannot hold
	 * alpha, so it fills with the paper colour and says so rather than handing
	 * back a black rectangle nobody asked for.
	 */
	function exportBackground({ background, format, paper }) {
		const opaque = String(format).toLowerCase() === "jpg" || String(format).toLowerCase() === "jpeg";
		if (background) return { fill: paper || "#ffffff", transparent: false };
		if (!opaque) return { fill: null, transparent: true };
		return { fill: paper || "#ffffff", notice: "jpg-opaque", transparent: false };
	}

	const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");

	function exportFilename({ configuration, format, id, size }) {
		const parts = [slug(id)];
		for (const key of ["shape", "logic", "figure", "mode", "preset"]) {
			if (configuration && configuration[key] !== undefined && typeof configuration[key] !== "object") parts.push(slug(configuration[key]));
		}
		parts.push(`${size.width}x${size.height}`);
		return `${parts.filter(Boolean).join("-")}.${String(format).toLowerCase()}`;
	}

	function setupText({ configuration, id, title }) {
		return [
			`Update the ${title || id} configuration with these values:`,
			"",
			"```json",
			JSON.stringify(configuration, null, 2),
			"```",
			"",
			`Apply these values as the new defaults in the ${id} adapter.`,
		].join("\n");
	}

	/* ---------- the browser half ---------- */

	function offscreen(doc, width, height) {
		const canvas = doc.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		return canvas;
	}

	/**
	 * Render once into a canvas the shell owns.
	 * @returns {{canvas, size, notice, error}}
	 */
	function renderOffscreen({ background, bounds, document: doc, format, longEdge, paper, renderFrame, time }) {
		if (typeof renderFrame !== "function") return { error: exportError("no-renderer") };
		const size = exportSize(bounds, longEdge);
		if (size.error === "bounds-invalid" || size.error === "size-invalid") return { error: exportError(size.error) };
		const canvas = offscreen(doc || global.document, size.width, size.height);
		const context = canvas.getContext("2d");
		const paint = exportBackground({ background, format, paper });
		if (paint.fill) {
			context.fillStyle = paint.fill;
			context.fillRect(0, 0, size.width, size.height);
		}
		renderFrame(context, size.width, size.height, Number(time) || 0);
		return {
			canvas,
			error: size.error === "size-cap" ? exportError("size-cap", { cap: CAP }) : null,
			notice: paint.notice || null,
			size,
		};
	}

	/**
	 * An ImageData a test can read pixels from — in a browser context, offscreen,
	 * with no visible window. Not in bare `node --test`: the lab has no canvas in
	 * Node, no package.json and no polyfill, and this renders through one. U13's
	 * measured-fidelity assertion therefore belongs in the browser proof, beside
	 * the export it shares a path with, and `<id>/test.mjs` keeps asserting the
	 * geometry it can reach.
	 */
	function measureRender(options) {
		const rendered = renderOffscreen(options);
		if (!rendered.canvas) return rendered;
		return {
			...rendered,
			imageData: rendered.canvas.getContext("2d").getImageData(0, 0, rendered.size.width, rendered.size.height),
		};
	}

	async function toBlob(canvas, format) {
		const type = format === "jpg" || format === "jpeg" ? "image/jpeg" : "image/png";
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, type === "image/jpeg" ? 0.92 : undefined));
		if (!blob) throw exportError("encode-failed", { format });
		return blob;
	}

	async function exportImage(options) {
		const rendered = renderOffscreen(options);
		if (!rendered.canvas) return rendered;
		try {
			const blob = await toBlob(rendered.canvas, options.format);
			return { blob, error: rendered.error, notice: rendered.notice, size: rendered.size };
		} catch (error) {
			return { error: error && error.code ? error : exportError("encode-failed", { format: options.format }) };
		}
	}

	function exportSVG({ bounds, longEdge, renderVector }) {
		if (typeof renderVector !== "function") return { error: exportError("no-vector") };
		const size = exportSize(bounds, longEdge);
		if (size.error === "bounds-invalid" || size.error === "size-invalid") return { error: exportError(size.error) };
		const svg = renderVector(size.width, size.height);
		if (typeof svg !== "string" || !svg.trim()) return { error: exportError("encode-failed", { format: "svg" }) };
		return {
			blob: new global.Blob([svg], { type: "image/svg+xml" }),
			error: size.error === "size-cap" ? exportError("size-cap", { cap: CAP }) : null,
			size,
			svg,
		};
	}

	function download(blob, filename, doc) {
		const owner = doc || global.document;
		const url = global.URL.createObjectURL(blob);
		const anchor = owner.createElement("a");
		anchor.href = url;
		anchor.download = filename;
		anchor.click();
		global.setTimeout(() => global.URL.revokeObjectURL(url), 4000);
		return { filename };
	}

	async function copyImage(options) {
		if (typeof global.ClipboardItem === "undefined" || !global.navigator.clipboard || !global.navigator.clipboard.write) {
			return { error: exportError("export-failed") };
		}
		// Safari needs the promise created inside the gesture; Chrome accepts either.
		const blobPromise = exportImage({ ...options, format: "png" }).then((result) => {
			if (!result.blob) throw result.error || exportError("encode-failed", { format: "png" });
			return result.blob;
		});
		try {
			await global.navigator.clipboard.write([new global.ClipboardItem({ "image/png": blobPromise })]);
			return { copied: true };
		} catch (error) {
			return { error: exportError("export-failed") };
		}
	}

	/**
	 * Wire the export hooks to a page's renderer. `page` supplies renderFrame,
	 * bounds, and optionally renderVector and time.
	 */
	function installExport(controller, adapter, page) {
		const hooks = shell.hooks || (shell.hooks = {});
		const state = controller.shellState;
		const NOTICES = { "jpg-opaque": "JPG has no alpha, so the paper colour was filled in." };
		const say = (result) => {
			if (result.error) controller.status(result.error.message, "alert");
			else if (result.notice) controller.status(NOTICES[result.notice] || null, "neutral");
			else controller.status(result.copied ? "Copied" : "Saved", "neutral");
			return result;
		};

		const common = () => ({
			background: state.get("canvas.background") !== false,
			bounds: page.bounds(),
			document: controller.element.ownerDocument,
			format: state.get("export.format") || "png",
			longEdge: Number(state.get("export.resolution")) || 4096,
			paper: state.get("canvas.backgroundColor") || page.paper && page.paper(),
			renderFrame: page.renderFrame,
			time: typeof page.time === "function" ? page.time() : 0,
		});

		hooks["export.image"] = async () => {
			const options = common();
			if (options.format === "svg") {
				const result = exportSVG({ bounds: options.bounds, longEdge: options.longEdge, renderVector: page.renderVector });
				if (result.blob) download(result.blob, exportFilename({ configuration: adapter.getConfiguration(), format: "svg", id: adapter.id, size: result.size }), options.document);
				return say(result);
			}
			const result = await exportImage(options);
			if (result.blob) download(result.blob, exportFilename({ configuration: adapter.getConfiguration(), format: options.format, id: adapter.id, size: result.size }), options.document);
			return say(result);
		};

		hooks["export.copyImage"] = async () => say(await copyImage(common()));

		hooks["export.copySetup"] = async () => {
			const text = setupText({ configuration: adapter.getConfiguration(), id: adapter.id, title: controller.tree.title });
			try {
				await global.navigator.clipboard.writeText(text);
				return say({ copied: true });
			} catch (error) {
				return say({ error: exportError("export-failed") });
			}
		};

		// A tool with no vector renderer does not offer SVG. The alternative is a
		// menu item whose only behaviour is to report that it cannot do the thing
		// it is named after.
		if (typeof page.renderVector !== "function" && typeof controller.setRowOptions === "function") {
			const row = controller.tree.rowsByKey["export.format"];
			if (row && row.options) {
				controller.setRowOptions("export.format", row.options.map((option) => option.value).filter((value) => value !== "svg"));
			}
		}

		controller.sync();
		return {
			destroy() {
				delete hooks["export.image"];
				delete hooks["export.copyImage"];
				delete hooks["export.copySetup"];
			},
		};
	}

	shell.EXPORT_CAP = CAP;
	shell.EXPORT_LONG_EDGES = Object.freeze([...LONG_EDGES]);
	shell.copyImage = copyImage;
	shell.download = download;
	shell.exportBackground = exportBackground;
	shell.exportError = exportError;
	shell.exportFilename = exportFilename;
	shell.exportImage = exportImage;
	shell.exportSVG = exportSVG;
	shell.exportSize = exportSize;
	shell.installExport = installExport;
	shell.measureRender = measureRender;
	shell.renderOffscreen = renderOffscreen;
	shell.setupText = setupText;
	global.SUPERMEGA_INSTRUMENT_SHELL = shell;
})(window);
