(function instrumentShellTool(global) {
	"use strict";

	/* =============================================================================
	   mountTool — one call, a whole tool.

	   Before this, a page wired the shell in six steps and had to know the order:
	   mountPanel, installState, installExport, installVideo, mountViewport,
	   installTimeline, plus a shellState subscriber to carry Setup changes to the
	   stage, plus the rule that an engine must never call its own `resize()` once
	   a viewport owns the canvas.

	   Two of the first three pages skipped the stage entirely and the fourth tool
	   built on the shell skipped it too — so its composition ran off all four
	   edges of the window with no frame and no way to zoom out. When every
	   consumer gets the same thing wrong, the API is wrong, not the consumers.

	   So: the artboard is not opt-in. A schema that declares `canvas` gets a
	   framed stage that fits, pans and zooms, and the page does not wire it.
	   ========================================================================== */

	const shell = global.SUPERMEGA_INSTRUMENT_SHELL || {};

	/**
	 * @param {object} options
	 *   adapter    the tool's adapter (required)
	 *   panel      the element the control panel mounts into (required)
	 *   stage      the element the artboard lives in; omit for a tool with no canvas
	 *   canvas     the <canvas> the engine draws on
	 *   page       { renderFrame, bounds, renderVector?, paper?, speed?, resize? }
	 *   defaults   the authored defaults, for section reset and shareable links
	 *   normalize  the adapter's normalize, for preset pressing and links
	 *   onFrame    called each animation frame with the transport
	 */
	function mountTool(options) {
		const adapter = options.adapter;
		const schema = options.schema || adapter.getSchema();
		const page = options.page || {};
		const tree = shell.planPanel(schema);

		const controller = shell.mountPanel(options.panel, tree, adapter, {
			defaults: options.defaults,
			onControls: () => {
				if (typeof options.onControls === "function") options.onControls();
				if (mounted.viewport) global.requestAnimationFrame(() => mounted.viewport.fit());
			},
		});

		const mounted = { controller, tree };

		if (shell.installState) {
			mounted.state = shell.installState(controller, adapter, {
				defaults: options.defaults,
				normalize: options.normalize,
				schema,
			});
		}
		if (shell.installExport && typeof page.renderFrame === "function") {
			mounted.exporter = shell.installExport(controller, adapter, page);
			if (shell.installVideo) mounted.video = shell.installVideo(controller, adapter, page);
		}

		// The artboard. A tool that declares a canvas gets one; it does not ask.
		if (shell.mountViewport && options.stage && options.canvas && schema.canvas) {
			// A tool with aspects has no Width/Height rows: its page turns the
			// aspect into a size, so the page's bounds win over the seeded values.
			const shaped = (Array.isArray(schema.canvas.aspects) && schema.canvas.aspects.length > 0) || Boolean(schema.fields && schema.fields.aspect);
			const artboard = typeof page.bounds === "function" && shaped
				? () => page.bounds()
				: typeof page.bounds === "function"
				? () => {
					const declared = {
						height: Number(controller.shellState.get("canvas.height")) || 0,
						width: Number(controller.shellState.get("canvas.width")) || 0,
					};
					if (declared.width > 0 && declared.height > 0) return declared;
					return page.bounds();
				}
				: () => ({
					height: Number(controller.shellState.get("canvas.height")) || 1080,
					width: Number(controller.shellState.get("canvas.width")) || 1080,
				});

			mounted.viewport = shell.mountViewport(options.stage, options.canvas, {
				artboard,
				controller,
				// The viewport owns the backing store. An engine that measures its
				// own canvas is measuring a box a transform has already scaled, so
				// it is TOLD the size instead.
				onChange: ({ backing, kind }) => {
					if (kind !== "resize" || !backing) return;
					const board = artboard();
					if (typeof page.resize === "function") page.resize(backing.width, backing.height, board.width, board.height);
					if (typeof options.onResize === "function") options.onResize(backing, board);
				},
				renderScale: () => Number(controller.shellState.get("canvas.renderScale")) || 1,
			});
			mounted.artboard = artboard;
		}

		if (shell.installTimeline && schema.timeline) {
			mounted.timeline = shell.installTimeline(controller, {
				duration: Number(schema.timeline.duration) || 10,
				onFrame: options.onFrame,
			});
		}

		// A Setup change reaches the stage. Without this the Width, Height and
		// Scale rows are decoration — which is exactly what they were.
		controller.shellState.subscribe((key) => {
			if (mounted.viewport && key.startsWith("canvas.")) mounted.viewport.refresh(key);
		});

		controller.sync();
		shell.tool = mounted;
		return mounted;
	}

	shell.mountTool = mountTool;
	global.SUPERMEGA_INSTRUMENT_SHELL = shell;
})(window);
