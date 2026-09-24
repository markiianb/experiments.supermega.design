(function instrumentShellTimeline(global) {
	"use strict";

	/* =============================================================================
	   Transport — one clock, one loop, one number the engine reads.

	       t = (now − start) mod duration

	   Scrubbing sets `start`. `loopProgress()` is `t / duration`. An engine asks
	   for that and draws; it does not own a clock, and it does not poll
	   `matchMedia` (KTD10).

	   Reduced motion starts the transport PAUSED. It does not disable it: an
	   explicit play, a scrub or a recording still runs the loop, because a still
	   that cannot be played is not an accessible animation tool — it is a broken
	   one.

	   Time is transient, like the viewport. It never enters history and never
	   enters persistence.
	   ========================================================================== */

	const shell = global.SUPERMEGA_INSTRUMENT_SHELL || {};
	const MIN_DURATION = 1;
	const MAX_DURATION = 60;
	const SCRUB_STEP = 0.25;
	const DEFAULT_FPS = 30;

	const settleDuration = (value, fallback) => {
		const seconds = Number(value);
		if (!Number.isFinite(seconds)) return fallback;
		return Math.min(MAX_DURATION, Math.max(MIN_DURATION, seconds));
	};

	function createTransport(options) {
		options = options || {};
		const now = typeof options.now === "function"
			? options.now
			: () => (global.performance ? global.performance.now() : Date.now());
		const fps = Number(options.fps) > 0 ? Number(options.fps) : DEFAULT_FPS;
		const subscribers = new Set();

		let duration = settleDuration(options.duration, 10);
		let looping = options.loop !== false;
		let playing = false;
		let offset = 0;
		let startedAt = 0;

		const fold = (seconds) => {
			if (!looping) return Math.min(duration, Math.max(0, seconds));
			const wrapped = seconds % duration;
			return wrapped < 0 ? wrapped + duration : wrapped;
		};

		function raw() {
			return playing ? offset + (now() - startedAt) / 1000 : offset;
		}

		function time() {
			const seconds = raw();
			if (!looping && seconds >= duration) {
				// Stopping is the honest end of a clock that does not come round.
				offset = duration;
				playing = false;
				return duration;
			}
			return fold(seconds);
		}

		const announce = () => {
			const seconds = time();
			for (const subscriber of subscribers) subscriber(seconds, { duration, playing });
		};

		function play() {
			if (playing) return;
			offset = time();
			startedAt = now();
			playing = true;
			announce();
		}

		function pause() {
			if (!playing) return;
			offset = time();
			playing = false;
			announce();
		}

		function seek(seconds) {
			offset = fold(Number(seconds) || 0);
			startedAt = now();
			announce();
		}

		function step(frames) {
			pause();
			seek(offset + (Number(frames) || 0) / fps);
		}

		/**
		 * A longer loop must not make the clock jump: the moment stays, the
		 * fraction changes. A shorter one folds the moment back inside it.
		 */
		function setDuration(seconds) {
			const next = settleDuration(seconds, duration);
			if (next === duration) return;
			const at = time();
			duration = next;
			offset = fold(at);
			startedAt = now();
			announce();
		}

		if (options.reducedMotion !== true && options.autoplay === true) play();

		return Object.freeze({
			duration: () => duration,
			fps: () => fps,
			loop: (value) => {
				if (value === undefined) return looping;
				looping = value !== false;
				announce();
				return looping;
			},
			loopProgress: () => (duration > 0 ? time() / duration : 0),
			pause,
			play,
			playing: () => playing,
			seek,
			setDuration,
			step,
			subscribe(handler) {
				subscribers.add(handler);
				return () => subscribers.delete(handler);
			},
			time,
			toggle: () => (playing ? pause() : play()),
		});
	}

	/**
	 * Wire the transport to the generated Transport rows and to the page's own
	 * frame loop. The page reads `transport.loopProgress()`; it does not keep a
	 * clock and it does not poll `matchMedia`.
	 */
	function installTimeline(controller, options) {
		options = options || {};
		const doc = controller.element.ownerDocument;
		const view = doc.defaultView;
		const state = controller.shellState;
		const reduced = options.reducedMotion !== undefined
			? options.reducedMotion === true
			: Boolean(view.matchMedia && view.matchMedia("(prefers-reduced-motion: reduce)").matches)
				|| doc.body.dataset.instrumentMotion === "reduced";

		const transport = createTransport({
			// A tool that declares a timeline is an animated tool: it runs on
			// arrival, which is what reduced motion then overrides. Without the
			// autoplay the preference had nothing to act on — the clock was already
			// paused for everyone, and the option was inert.
			autoplay: options.autoplay !== false,
			duration: Number(state.get("timeline.duration")) || options.duration || 10,
			fps: options.fps,
			loop: state.get("timeline.loop") !== false,
			reducedMotion: reduced,
		});

		const hooks = shell.hooks || (shell.hooks = {});
		hooks["timeline.toggle"] = () => {
			transport.toggle();
			return { playing: transport.playing() };
		};
		hooks["timeline.stepBack"] = () => transport.step(-1);
		hooks["timeline.stepForward"] = () => transport.step(1);

		// The scrub row and the clock are the same value seen twice; writing one
		// must not fight the other, so a change that came FROM the transport is
		// not written back into it.
		let syncing = false;
		const offState = state.subscribe((key, value) => {
			if (syncing) return;
			if (key === "timeline.time") transport.seek(value);
			else if (key === "timeline.duration") transport.setDuration(value);
			else if (key === "timeline.loop") transport.loop(value);
		});

		// The scrub bar is bounded by the loop, so a longer loop must widen it.
		let scrubMax = transport.duration();
		const widenScrub = () => {
			if (transport.duration() === scrubMax) return;
			scrubMax = transport.duration();
			if (typeof controller.setRowBounds === "function") controller.setRowBounds("timeline.time", { maximum: scrubMax });
		};

		const offTransport = transport.subscribe((seconds) => {
			widenScrub();
			syncing = true;
			try {
				state.set("timeline.time", Number(seconds.toFixed(3)));
			} finally {
				syncing = false;
			}
			const play = controller.element.querySelector('[data-shell-action="shell-play"]');
			if (play) play.textContent = transport.playing() ? "Pause" : "Play";
		});

		let frame = 0;
		const tick = () => {
			if (transport.playing()) {
				syncing = true;
				try {
					state.set("timeline.time", Number(transport.time().toFixed(3)));
				} finally {
					syncing = false;
				}
				if (typeof options.onFrame === "function") options.onFrame(transport);
			}
			frame = view.requestAnimationFrame(tick);
		};
		frame = view.requestAnimationFrame(tick);

		// Space is the transport's, and only when nothing else has the keyboard.
		const onKey = (event) => {
			if (event.key !== " " || event.metaKey || event.ctrlKey || event.altKey) return;
			const target = event.target;
			if (target instanceof view.HTMLElement && (target.matches("input, select, textarea, button, summary") || target.isContentEditable)) return;
			event.preventDefault();
			transport.toggle();
		};
		doc.addEventListener("keydown", onKey);

		controller.sync();
		return Object.freeze({
			destroy() {
				view.cancelAnimationFrame(frame);
				doc.removeEventListener("keydown", onKey);
				offState();
				offTransport();
				delete hooks["timeline.toggle"];
				delete hooks["timeline.stepBack"];
				delete hooks["timeline.stepForward"];
			},
			reducedMotion: reduced,
			transport,
		});
	}

	shell.DEFAULT_FPS = DEFAULT_FPS;
	shell.MAX_DURATION = MAX_DURATION;
	shell.MIN_DURATION = MIN_DURATION;
	shell.SCRUB_STEP = SCRUB_STEP;
	shell.createTransport = createTransport;
	shell.installTimeline = installTimeline;
	global.SUPERMEGA_INSTRUMENT_SHELL = shell;
})(window);
