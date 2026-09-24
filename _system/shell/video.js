(function instrumentShellVideo(global) {
	"use strict";

	/* =============================================================================
	   Video — exactly one loop, recorded from the same renderer export uses.

	   `canvas.captureStream(30)` plus `MediaRecorder`, which is proven on
	   nineteen lab pages. mediabunny would give frame-accurate encoding and
	   faster-than-real-time writing, but it needs a vendor folder and a build,
	   and the lab has neither (Key Decisions; deferred).

	   One loop means one loop: the recorder starts at time zero and stops when
	   the clock comes back round, so the file joins to itself.
	   ========================================================================== */

	const shell = global.SUPERMEGA_INSTRUMENT_SHELL || {};
	const FPS = 30;

	// mp4 first where the browser writes it: it is the one a person can drop
	// into anything. WebM is the fallback everything else encodes.
	const CODECS = {
		mp4: ["video/mp4;codecs=avc1.42E01E", "video/mp4;codecs=avc1", "video/mp4"],
		webm: ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"],
	};

	function pickCodec(format, isSupported) {
		const supported = typeof isSupported === "function"
			? isSupported
			: (mime) => typeof global.MediaRecorder !== "undefined" && global.MediaRecorder.isTypeSupported(mime);
		const list = CODECS[String(format).toLowerCase()] || CODECS.webm;
		return list.find((mime) => supported(mime)) || null;
	}

	/** How long one loop takes on the wall clock at the current speed. */
	function recordingSeconds({ duration, speed }) {
		const seconds = Number(duration) > 0 ? Number(duration) : 1;
		const rate = Number(speed);
		return Number.isFinite(rate) && rate > 0 ? seconds / rate : seconds;
	}

	function expectedFrames({ duration, fps }) {
		return Math.round((Number(duration) || 0) * (Number(fps) || FPS));
	}

	/**
	 * Record one loop. Resolves with a Blob, or rejects with a typed error.
	 *
	 * A `configure` during the take discards it: half the file would show one
	 * composition and half another, and a loop that does not join is not a loop.
	 */
	function recordLoop({ canvas, document: doc, format, onTick, seconds, start }) {
		const error = (code, detail) => (shell.exportError ? shell.exportError(code, detail) : { code, message: code });
		return new Promise((resolve, reject) => {
			if (typeof global.MediaRecorder === "undefined") {
				reject(error("video-unsupported"));
				return;
			}
			const mime = pickCodec(format);
			if (!mime) {
				reject(error("video-unsupported"));
				return;
			}
			let recorder;
			try {
				recorder = new global.MediaRecorder(canvas.captureStream(FPS), { mimeType: mime, videoBitsPerSecond: 16e6 });
			} catch (failure) {
				reject(error("video-unsupported"));
				return;
			}
			const parts = [];
			let cancelled = false;
			recorder.ondataavailable = (event) => {
				if (event.data && event.data.size) parts.push(event.data);
			};
			recorder.onstop = () => {
				if (cancelled) {
					reject(error("recording-interrupted"));
					return;
				}
				const blob = new global.Blob(parts, { type: mime.split(";")[0] });
				resolve({ blob, extension: mime.startsWith("video/mp4") ? "mp4" : "webm", mime, seconds });
			};
			if (typeof start === "function") start();
			recorder.start(100);
			const began = (global.performance || Date).now();
			const owner = doc || global.document;
			const tick = () => {
				const left = Math.max(0, seconds - ((global.performance || Date).now() - began) / 1000);
				if (typeof onTick === "function") onTick(left);
				if (left > 0 && recorder.state === "recording") owner.defaultView.requestAnimationFrame(tick);
				else if (recorder.state === "recording") recorder.stop();
			};
			tick();
			// The take is abandoned, not saved, when the tool changes under it.
			shell.__cancelRecording = () => {
				cancelled = true;
				if (recorder.state === "recording") recorder.stop();
			};
		});
	}

	/**
	 * Wire the record hook. The page supplies the same `renderFrame` export uses
	 * plus its bounds, so the recording is the artifact at video size — never a
	 * capture of whatever the window happens to be showing.
	 */
	function installVideo(controller, adapter, page) {
		const hooks = shell.hooks || (shell.hooks = {});
		const state = controller.shellState;
		let recording = false;

		hooks["video.record"] = async () => {
			if (recording) {
				if (shell.__cancelRecording) shell.__cancelRecording();
				return { cancelled: true };
			}
			const doc = controller.element.ownerDocument;
			const bounds = page.bounds();
			// 1920 is the practical ceiling for real-time capture; past it the
			// recorder drops frames and the loop stops closing.
			const size = shell.exportSize(bounds, Math.min(1920, Number(state.get("export.resolution")) || 1920));
			const target = doc.createElement("canvas");
			target.width = size.width;
			target.height = size.height;
			const context = target.getContext("2d");
			const paper = state.get("canvas.backgroundColor") || (page.paper && page.paper());
			const background = state.get("canvas.background") !== false;
			const seconds = recordingSeconds({
				duration: Number(state.get("timeline.duration")) || (page.duration && page.duration()) || 10,
				speed: page.speed ? page.speed() : 1,
			});
			let raf = 0;
			const paint = () => {
				if (background && paper) {
					context.fillStyle = paper;
					context.fillRect(0, 0, size.width, size.height);
				} else {
					context.clearRect(0, 0, size.width, size.height);
				}
				page.renderFrame(context, size.width, size.height, typeof page.time === "function" ? page.time() : 0);
				raf = doc.defaultView.requestAnimationFrame(paint);
			};
			recording = true;
			controller.status("Recording one loop…", "active");
			const stopPainting = () => doc.defaultView.cancelAnimationFrame(raf);
			try {
				const result = await recordLoop({
					canvas: target,
					document: doc,
					format: state.get("video.format") || "mp4",
					onTick: (left) => controller.status(`Recording ${left.toFixed(1)} s…`, "active"),
					seconds,
					start: paint,
				});
				stopPainting();
				shell.download(result.blob, `${shell.exportFilename({ configuration: adapter.getConfiguration(), format: result.extension, id: adapter.id, size })}`, doc);
				controller.status(`Saved ${(result.blob.size / 1e6).toFixed(1)} MB`, "neutral");
				return result;
			} catch (failure) {
				stopPainting();
				controller.status(failure.message || "The recording failed.", "alert");
				return { error: failure };
			} finally {
				recording = false;
				delete shell.__cancelRecording;
				controller.sync();
			}
		};

		controller.sync();
		return {
			destroy() {
				delete hooks["video.record"];
			},
			isRecording: () => recording,
		};
	}

	shell.VIDEO_CODECS = Object.freeze(JSON.parse(JSON.stringify(CODECS)));
	shell.VIDEO_FPS = FPS;
	shell.expectedFrames = expectedFrames;
	shell.installVideo = installVideo;
	shell.pickCodec = pickCodec;
	shell.recordLoop = recordLoop;
	shell.recordingSeconds = recordingSeconds;
	global.SUPERMEGA_INSTRUMENT_SHELL = shell;
})(window);
