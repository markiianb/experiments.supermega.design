/* =============================================================================
   scatter-core — the placement choreography, rebuilt from the reference source.

   This is the half of the NYT "Gen X Is A Mess" draw-on that genuinely WAS an
   algorithm. Their letters are hand-drawn artwork with nothing to recover; the
   code around them is a scatter system, and these are its rules, re-implemented
   from reading the public bundle (teardown in NOTES.md § Observe):

     pool          N interchangeable options, one picked at random per attempt
     neighbour     an option already used in this section, or in either
       de-dup      adjacent section, is refused — so the same tag never turns
                   up twice near itself
     cap           placement stops once the page holds `cap` tags
     no-go         nominated regions are never drawn over (theirs protected a
                   photograph of the Challenger explosion — an editorial
                   judgement, expressed in code)
     side bias     wide viewports aim right of centre; narrow ones push to the
                   edges
     size          a fraction of viewport width times a random factor

   One attempt per tick, and a refused attempt draws nothing — that is faithful,
   and it is why the page fills in gradually rather than all at once.

   Everything here is pure: no DOM, no timers, no randomness of its own. The
   caller supplies the RNG, which is what makes a scatter reproducible from a
   seed and testable in node.
   ========================================================================== */
(function scatterCore(global) {
	"use strict";

	function mulberry(seed) {
		let a = seed >>> 0;
		return function random() {
			a = (a + 0x6d2b79f5) >>> 0;
			let t = a;
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const total = (placed) => placed.reduce((sum, section) => sum + section.length, 0);

	/**
	 * Would this option be a repeat near where it is about to land?
	 *
	 * `spread` is the reference's rule generalized: it compared the target
	 * section and its immediate neighbours, which is spread = 1. Clamping at the
	 * ends rather than wrapping matters — the first and last sections have one
	 * neighbour, and wrapping would let the top of the page suppress the bottom.
	 */
	function accepts(placed, index, option, spread) {
		if (index < 0 || index >= placed.length) return false;
		const from = Math.max(0, index - spread);
		const to = Math.min(placed.length - 1, index + spread);
		for (let i = from; i <= to; i++) {
			if (placed[i].indexOf(option) >= 0) return false;
		}
		return true;
	}

	/**
	 * Horizontal placement, as a fraction of viewport width.
	 *
	 * Wide: start at the middle and wander up to a quarter-width either way, so
	 * tags cluster right of the text column without ever being pinned to it.
	 * Narrow: there is no margin to hide in, so throw most tags off the left or
	 * right edge and let them bleed — a centred tag on a phone would sit on top
	 * of the words.
	 */
	function side(width, random, bias) {
		const wide = width >= 1050;
		if (wide) {
			const drift = random() * 0.25 * (random() < 0.5 ? -1 : 1);
			return 0.5 + drift * (0.4 + bias * 1.6);
		}
		const roll = random();
		if (roll < 0.55) return -0.08 + random() * 0.14;
		if (roll < 0.75) return 0.25 + random() * 0.3;
		return 0.85 + random() * 0.16;
	}

	// A fraction of viewport width, so a tag reads the same on any screen.
	function size(width, random, minimum, maximum) {
		const wide = width >= 1050;
		const span = wide ? 0.5 : 0.62;
		return span * (minimum + random() * Math.max(0, maximum - minimum));
	}

	/**
	 * One placement attempt. Returns null when nothing should be drawn — which
	 * is a normal, frequent outcome, not a failure.
	 */
	function attempt(state) {
		const {
			bias = 0.5,
			blocked = false,
			cap = 250,
			index,
			placed,
			poolSize,
			random,
			sizeMax = 1.5,
			sizeMin = 0.5,
			spread = 1,
			width = 1440,
		} = state;

		if (blocked) return null;
		if (!poolSize || poolSize < 1) return null;
		if (index === undefined || index < 0 || index >= placed.length) return null;
		if (total(placed) >= cap) return null;

		const option = Math.floor(random() * poolSize) % poolSize;
		if (!accepts(placed, index, option, spread)) return null;

		return {
			index,
			left: side(width, random, bias),
			option,
			scale: size(width, random, sizeMin, sizeMax),
		};
	}

	// Records the placement. Kept separate from `attempt` so a caller can decide
	// not to commit — and so the decision stays a pure function of its inputs.
	function commit(placed, placement) {
		placed[placement.index].push(placement.option);
		return placed;
	}

	const emptyLedger = (sections) => Array.from({ length: Math.max(0, sections) }, () => []);

	global.SUPERMEGA_SCATTER = Object.freeze({
		accepts,
		attempt,
		commit,
		emptyLedger,
		mulberry,
		side,
		size,
		total,
	});
})(typeof window === "undefined" ? globalThis : window);
