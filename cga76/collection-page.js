(function cga76CollectionPage(global) {
	"use strict";

	const cards = [...document.querySelectorAll(".pg-card[data-status]")];
	const buttons = [...document.querySelectorAll("[data-filter]")];
	const status = document.getElementById("filter-status");
	const embedded = document.body.dataset.instrumentEmbed === "true";
	const initialHash = new URLSearchParams(location.hash.replace(/^#/, "")).get("filter");
	const counts = Object.freeze(cards.reduce((result, card) => {
		result[card.dataset.status] += 1;
		return result;
	}, { all: cards.length, available: 0, upcoming: 0 }));
	const glyphs = Object.freeze({
		" ": ["00000", "00000", "00000", "00000", "00000"],
		"1": ["00100", "01100", "00100", "00100", "01110"],
		"6": ["01110", "10000", "11110", "10001", "01110"],
		"7": ["11111", "00010", "00100", "01000", "01000"],
		"9": ["01110", "10001", "01111", "00001", "01110"],
		A: ["01110", "10001", "11111", "10001", "10001"],
		B: ["11110", "10001", "11110", "10001", "11110"],
		C: ["01111", "10000", "10000", "10000", "01111"],
		G: ["01111", "10000", "10111", "10001", "01110"],
		L: ["10000", "10000", "10000", "10000", "11111"],
	});

	if (embedded) {
		for (const link of document.querySelectorAll("[data-tool-link]")) {
			const url = new URL(link.href, location.href);
			url.searchParams.set("instrument-embed", "1");
			link.href = url.href;
		}
	}

	function render(configuration, action) {
		const filter = configuration.filter;
		for (const card of cards) card.hidden = filter !== "all" && card.dataset.status !== filter;
		for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
		const messages = {
			all: "Showing all sixteen instruments",
			available: "Showing all sixteen available instruments",
			upcoming: "No upcoming instruments in this first-half collection",
		};
		if (status) {
			status.textContent = messages[filter];
			status.dataset.count = String(counts[filter]);
		}
		if (action !== "initial") history.replaceState(null, "", filter === "all" ? `${location.pathname}${location.search}` : `#filter=${filter}`);
	}

	function drawMasthead() {
		const canvas = document.getElementById("masthead");
		const text = "CGA 1976 LAB";
		const unit = 4;
		const baseWidth = ((text.length * 6) - 1) * unit;
		const availableWidth = Math.min(1080, global.innerWidth) - 48;
		const scale = Math.max(0.9, Math.min(2.5, availableWidth / baseWidth));
		const width = Math.round(baseWidth * scale);
		const height = Math.round(5 * unit * scale);
		const dpr = global.devicePixelRatio || 1;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		const context = canvas.getContext("2d");
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		context.imageSmoothingEnabled = false;
		context.clearRect(0, 0, width, height);
		context.fillStyle = "#101418";
		for (const [characterIndex, character] of [...text].entries()) {
			const glyph = glyphs[character];
			for (let row = 0; row < 5; row += 1) {
				for (let column = 0; column < 5; column += 1) {
					if (glyph[row][column] !== "1") continue;
					context.fillRect(
						Math.round((characterIndex * 6 + column) * unit * scale),
						Math.round(row * unit * scale),
						Math.ceil(unit * scale),
						Math.ceil(unit * scale),
					);
				}
			}
		}
	}

	const adapter = global.SUPERMEGA_INSTRUMENT_ADAPTERS.cga76Collection.create({
		applyConfiguration: render,
		initialConfiguration: { filter: initialHash },
	});
	render(adapter.getConfiguration(), "initial");
	drawMasthead();
	let resizeTimer = null;
	global.addEventListener("resize", () => {
		global.clearTimeout(resizeTimer);
		resizeTimer = global.setTimeout(drawMasthead, 100);
	});

	for (const button of buttons) {
		button.addEventListener("click", () => adapter.configure({ filter: button.dataset.filter }));
	}

	global.CGA76_COLLECTION_ADAPTER = adapter;
	global.CGA76_COLLECTION_PAGE = Object.freeze({
		counts,
		getVisibleCount: () => cards.filter((card) => !card.hidden).length,
		redrawMasthead: drawMasthead,
	});
	if (global.parent !== global) {
		global.CGA76_COLLECTION_BRIDGE = global.SUPERMEGA_INSTRUMENT_ADAPTERS.core.installBridge(adapter, { strict: true });
	}
})(window);
