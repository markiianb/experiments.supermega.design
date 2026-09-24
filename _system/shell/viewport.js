(function instrumentShellViewport(global) {
	"use strict";

	/* =============================================================================
	   Viewport — the artboard on a stage that pans and zooms.

	   A CSS transform on a stage wrapper, with the backing canvas sized by device
	   pixel ratio × render scale so the picture stays crisp at 400% (KTD9).

	   Mined from the kit's incubator (`editor-viewport.ts`), not from Toolcraft.

	   Viewport state is TRANSIENT. It never enters history and never enters
	   persistence: a reload restores a composition, not a zoom level, and an undo
	   steps the tool back, not the camera.

	   Keys: Space is play/pause and belongs to the transport (KTD10). Panning is
	   Alt-drag, the middle button, the wheel, or two fingers; zoom is ctrl/⌘-wheel
	   and pinch. The plan's U6 verification line says the artboard "pans under
	   Space" — that contradicts its own KTD9, and KTD9 wins, because a tool that
	   cannot play with the keyboard is worse than one that cannot pan with it.
	   ========================================================================== */

	const shell = global.SUPERMEGA_INSTRUMENT_SHELL || {};
	const MIN = 25;
	const MAX = 400;
	const STEP = 10;
	const BACKING_CAP = 16384;
	const REFIT_KEYS = new Set(["canvas.aspect", "canvas.width", "canvas.height"]);

	/**
	 * The zoom is always one of these. The floor is 25 and the step is 10, and 25
	 * is not on the ten-grid, so the stops are declared rather than computed:
	 * rounding to the nearest ten made 25% unreachable, which is the one stop a
	 * person asks for when they want to see a whole poster.
	 */
	const STOPS = (() => {
		const stops = [MIN];
		for (let zoom = Math.ceil((MIN + 1) / STEP) * STEP; zoom <= MAX; zoom += STEP) stops.push(zoom);
		return Object.freeze(stops);
	})();

	const clampZoom = (zoom) => {
		const value = Number(zoom);
		if (!Number.isFinite(value)) return 100;
		if (value <= MIN) return MIN;
		if (value >= MAX) return MAX;
		return STOPS.reduce((best, stop) => (Math.abs(stop - value) < Math.abs(best - value) ? stop : best), STOPS[0]);
	};

	const stepZoom = (zoom, direction) => {
		const index = STOPS.indexOf(clampZoom(zoom));
		return STOPS[Math.min(STOPS.length - 1, Math.max(0, index + direction))];
	};

	const zoomLabel = (zoom) => `${Math.round(Number(zoom) || 0)}%`;

	const needsRefit = (key) => REFIT_KEYS.has(String(key));

	/** The largest step that shows the whole artboard with its margin. */
	function fitViewport(artboard, stage, margin) {
		const gap = Number.isFinite(Number(margin)) ? Number(margin) : 24;
		const width = Number(artboard && artboard.width);
		const height = Number(artboard && artboard.height);
		if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
			return centreViewport({ x: 0, y: 0, zoom: 100 }, { height: 1, width: 1 }, stage);
		}
		const room = { height: Math.max(1, stage.height - gap * 2), width: Math.max(1, stage.width - gap * 2) };
		const ratio = Math.min(room.width / width, room.height / height) * 100;
		// The largest stop that still shows the whole artboard.
		const zoom = [...STOPS].reverse().find((stop) => stop <= ratio) || MIN;
		return centreViewport({ x: 0, y: 0, zoom }, artboard, stage);
	}

	/** Keep the zoom, put the artboard in the middle of the stage. */
	function centreViewport(viewport, artboard, stage) {
		const scale = clampZoom(viewport.zoom) / 100;
		return {
			x: Math.round((stage.width - artboard.width * scale) / 2),
			y: Math.round((stage.height - artboard.height * scale) / 2),
			zoom: clampZoom(viewport.zoom),
		};
	}

	/**
	 * Zoom about a point on the stage. The world point under the pointer is the
	 * invariant — zooming toward the cursor is the whole gesture, and getting the
	 * order of operations wrong here drifts a little on every notch.
	 */
	function zoomAt(viewport, nextZoom, pointer) {
		const from = clampZoom(viewport.zoom);
		const to = clampZoom(nextZoom);
		if (to === from) return { ...viewport, zoom: from };
		const scale = from / 100;
		const world = { x: (pointer.x - viewport.x) / scale, y: (pointer.y - viewport.y) / scale };
		const next = to / 100;
		return { x: pointer.x - world.x * next, y: pointer.y - world.y * next, zoom: to };
	}

	const panViewport = (viewport, delta) => ({
		x: viewport.x + delta.x,
		y: viewport.y + delta.y,
		zoom: clampZoom(viewport.zoom),
	});

	/** CSS pixels × device ratio × render scale, capped at what a browser allocates. */
	function backingSize(css, ratio, renderScale) {
		const dpr = Number.isFinite(Number(ratio)) && Number(ratio) > 0 ? Number(ratio) : 1;
		const scale = Number.isFinite(Number(renderScale)) && Number(renderScale) > 0 ? Number(renderScale) : 1;
		const width = Math.max(1, Math.round(css.width * dpr * scale));
		const height = Math.max(1, Math.round(css.height * dpr * scale));
		if (width <= BACKING_CAP && height <= BACKING_CAP) return { height, width };
		const shrink = Math.min(BACKING_CAP / width, BACKING_CAP / height);
		return { capped: true, height: Math.floor(height * shrink), width: Math.floor(width * shrink) };
	}

	/* ---------- the browser half ---------- */

	/**
	 * Mount the stage. `stage` is the element the canvas lives in; the shell
	 * wraps the canvas so the transform lands on the wrapper and the canvas keeps
	 * its own backing size.
	 *
	 * The zoom readout, fit and recentre live on the stage, not in the chrome:
	 * the chrome's end column is exactly the panel's width (320 px measured) and
	 * already holds five children at 275 px, so the plan's "chrome's end zone"
	 * has no room left once undo and redo are in it. They are kit buttons in a
	 * lab-owned container — the kit's own HUD is a read-out, `pointer-events:
	 * none`, and a button inside it cannot be clicked (the probe found that).
	 */
	function mountViewport(stage, canvas, options) {
		options = options || {};
		const doc = stage.ownerDocument;
		const view = doc.defaultView;
		const artboard = typeof options.artboard === "function" ? options.artboard : () => ({ height: 1920, width: 1280 });
		const renderScale = typeof options.renderScale === "function" ? options.renderScale : () => 1;
		const onChange = typeof options.onChange === "function" ? options.onChange : () => {};
		const listeners = [];
		const on = (target, type, handler, opts) => {
			target.addEventListener(type, handler, opts);
			listeners.push(() => target.removeEventListener(type, handler, opts));
		};

		const wrapper = doc.createElement("div");
		wrapper.className = "instrument-renderer-stage";
		wrapper.dataset.shellStage = "";
		canvas.parentNode.insertBefore(wrapper, canvas);
		wrapper.appendChild(canvas);

		const hud = doc.createElement("div");
		hud.className = "instrument-renderer-viewport";
		hud.dataset.shellHud = "";
		const button = (label, title, action) => {
			const node = doc.createElement("button");
			node.className = "instrument-action";
			node.type = "button";
			node.textContent = label;
			node.title = title;
			node.dataset.shellViewport = action;
			return node;
		};
		const out = doc.createElement("button");
		out.className = "instrument-action instrument-tabular";
		out.type = "button";
		out.title = "Click to return to 100%";
		out.dataset.shellViewport = "reset";
		hud.append(button("−", "Zoom out", "out"), out, button("+", "Zoom in", "in"), button("Fit", "Fit the artboard to the stage", "fit"), button("Centre", "Recentre at this zoom", "centre"));
		stage.appendChild(hud);

		const stageSize = () => ({ height: stage.clientHeight || 1, width: stage.clientWidth || 1 });
		let viewport = fitViewport(artboard(), stageSize(), 24);
		let commitTimer = 0;

		function paint(settled) {
			const board = artboard();
			wrapper.style.width = `${board.width}px`;
			wrapper.style.height = `${board.height}px`;
			wrapper.style.transformOrigin = "0 0";
			wrapper.style.transform = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom / 100})`;
			out.textContent = zoomLabel(viewport.zoom);
			const backing = backingSize(board, view.devicePixelRatio || 1, renderScale());
			if (canvas.width !== backing.width || canvas.height !== backing.height) {
				canvas.width = backing.width;
				canvas.height = backing.height;
				canvas.style.width = `${board.width}px`;
				canvas.style.height = `${board.height}px`;
				onChange({ backing, kind: "resize", viewport: { ...viewport } });
			}
			if (settled) {
				// One transient commit at the end of a gesture, so a page that redraws
				// on change is not asked to redraw per wheel notch.
				view.clearTimeout(commitTimer);
				commitTimer = view.setTimeout(() => onChange({ kind: "settled", viewport: { ...viewport } }), 120);
			}
		}

		const set = (next, settled) => {
			viewport = { ...next, zoom: clampZoom(next.zoom) };
			paint(settled !== false);
		};

		const fit = () => set(fitViewport(artboard(), stageSize(), 24));
		const centre = () => set(centreViewport(viewport, artboard(), stageSize()));

		on(hud, "click", (event) => {
			const target = event.target.closest("[data-shell-viewport]");
			if (!target) return;
			const middle = { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
			if (target.dataset.shellViewport === "in") set(zoomAt(viewport, stepZoom(viewport.zoom, 1), middle));
			else if (target.dataset.shellViewport === "out") set(zoomAt(viewport, stepZoom(viewport.zoom, -1), middle));
			else if (target.dataset.shellViewport === "fit") fit();
			else if (target.dataset.shellViewport === "centre") centre();
			else if (target.dataset.shellViewport === "reset") set(zoomAt(viewport, 100, middle));
		});

		const pointerIn = (event) => {
			const rect = stage.getBoundingClientRect();
			return { x: event.clientX - rect.left, y: event.clientY - rect.top };
		};

		on(stage, "wheel", (event) => {
			// ctrl/⌘ + wheel is zoom (and is what a trackpad pinch arrives as);
			// a bare wheel pans, the way a canvas app does.
			if (event.ctrlKey || event.metaKey) {
				event.preventDefault();
				set(zoomAt(viewport, stepZoom(viewport.zoom, event.deltaY < 0 ? 1 : -1), pointerIn(event)));
				return;
			}
			event.preventDefault();
			set(panViewport(viewport, { x: -event.deltaX, y: -event.deltaY }));
		}, { passive: false });

		let dragging = null;
		on(stage, "pointerdown", (event) => {
			// Alt-drag or the middle button. A plain drag belongs to the tool.
			if (!(event.altKey || event.button === 1)) return;
			event.preventDefault();
			dragging = { id: event.pointerId, ...pointerIn(event) };
			stage.setPointerCapture?.(event.pointerId);
		});
		on(stage, "pointermove", (event) => {
			if (!dragging || dragging.id !== event.pointerId) return;
			const now = pointerIn(event);
			set(panViewport(viewport, { x: now.x - dragging.x, y: now.y - dragging.y }), false);
			dragging = { id: event.pointerId, ...now };
		});
		const endDrag = (event) => {
			if (!dragging || dragging.id !== event.pointerId) return;
			dragging = null;
			paint(true);
		};
		on(stage, "pointerup", endDrag);
		on(stage, "pointercancel", endDrag);
		on(view, "resize", () => fit());

		paint(false);
		// Tell the panel the module is here, so the Setup rows that need it stop
		// being inert.
		shell.modules = shell.modules || {};
		shell.modules.viewport = true;
		if (options.controller && typeof options.controller.sync === "function") options.controller.sync();

		return Object.freeze({
			centre,
			destroy() {
				for (const off of listeners) off();
				listeners.length = 0;
				if (shell.modules) delete shell.modules.viewport;
				view.clearTimeout(commitTimer);
				hud.remove();
				if (wrapper.parentNode) {
					wrapper.parentNode.insertBefore(canvas, wrapper);
					wrapper.remove();
				}
			},
			element: wrapper,
			fit,
			get: () => ({ ...viewport }),
			/** A Setup change that alters the frame re-fits; one that alters the backing repaints. */
			refresh(key) {
				if (needsRefit(key)) fit();
				else paint(false);
			},
			set,
		});
	}

	shell.ZOOM_STOPS = STOPS;
	shell.ZOOM_MAX = MAX;
	shell.ZOOM_MIN = MIN;
	shell.ZOOM_STEP = STEP;
	shell.backingSize = backingSize;
	shell.centreViewport = centreViewport;
	shell.clampZoom = clampZoom;
	shell.fitViewport = fitViewport;
	shell.mountViewport = mountViewport;
	shell.needsRefit = needsRefit;
	shell.panViewport = panViewport;
	shell.stepZoom = stepZoom;
	shell.zoomAt = zoomAt;
	shell.zoomLabel = zoomLabel;
	global.SUPERMEGA_INSTRUMENT_SHELL = shell;
})(window);
