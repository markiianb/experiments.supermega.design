(function instrumentShellApplicability(global) {
	"use strict";

	/* =============================================================================
	   Applicability — which rows apply right now.

	   One condition per row, the kit's five predicates (`equals`, `notEquals`,
	   `oneOf`, `greaterThan`, `lessThan`), evaluated against the live
	   configuration. Composition is deliberately absent: `visibleWhen` is the
	   kit's `ToolCondition`, and a page that needs `all`/`any` extends the kit
	   type first, per docs/solutions/conventions/adding-an-instrument-system-
	   control.md.

	   A hidden row keeps its value. Hiding is a statement about what applies, not
	   an instruction to forget: unhiding must show the picture the person left.
	   ========================================================================== */

	const shell = global.SUPERMEGA_INSTRUMENT_SHELL || {};
	const same = (a, b) => JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);

	function evaluate(condition, configuration) {
		if (!condition || typeof condition !== "object" || !condition.target) return true;
		const value = (configuration || {})[condition.target];
		// Unset clauses are ignored, so a target with no clause constrains nothing.
		if ("equals" in condition && !same(value, condition.equals)) return false;
		if ("notEquals" in condition && same(value, condition.notEquals)) return false;
		if ("oneOf" in condition) {
			const list = Array.isArray(condition.oneOf) ? condition.oneOf : [];
			if (!list.some((candidate) => same(value, candidate))) return false;
		}
		// A comparison against something that is not a number is false, not a
		// NaN that silently reads as "shown".
		if ("greaterThan" in condition && !(Number(value) > Number(condition.greaterThan))) return false;
		if ("lessThan" in condition && !(Number(value) < Number(condition.lessThan))) return false;
		return true;
	}

	/**
	 * @returns {{rows: Record<string, boolean>, sections: Record<string, boolean>}}
	 *   A section is hidden only when it has rows and every one of them is hidden;
	 *   a section of actions and legends alone is never hidden by this.
	 */
	function resolveVisibility(tree, configuration, shellState) {
		const state = { ...(configuration || {}), ...(shellState || {}) };
		const rows = {};
		const sections = {};
		for (const section of tree.sections) {
			let fields = 0;
			let shown = 0;
			for (const row of section.rows) {
				if (row.row !== "field") continue;
				fields += 1;
				const visible = evaluate(row.visibleWhen, state);
				rows[row.key] = visible;
				if (visible) shown += 1;
			}
			sections[section.id] = fields === 0 || shown > 0;
		}
		return { rows, sections };
	}

	/**
	 * Toggle the DOM. Both the attribute and a class, never inline display:
	 * `.instrument-group` is (0,2,0) and `[hidden]` is (0,1,0) in the user-agent
	 * sheet, so the attribute alone has lost this fight before (see
	 * docs/solutions/conventions/instrument-group-hidden-loses-to-class-specificity.md).
	 */
	function applyVisibility(root, visible) {
		if (!root || !root.querySelectorAll) return visible;
		const mark = (node, shown) => {
			if (!node) return;
			node.hidden = !shown;
			node.classList.toggle("instrument-row--inapplicable", !shown);
		};
		for (const [key, shown] of Object.entries(visible.rows)) {
			root.querySelectorAll(`[data-shell-row="${String(key).replace(/["\\]/gu, "\\$&")}"]`).forEach((node) => mark(node, shown));
		}
		for (const [id, shown] of Object.entries(visible.sections)) {
			mark(root.querySelector(`[data-shell-section="${String(id).replace(/["\\]/gu, "\\$&")}"]`), shown);
		}
		return visible;
	}

	shell.applyVisibility = applyVisibility;
	shell.evaluate = evaluate;
	shell.resolveVisibility = resolveVisibility;
	global.SUPERMEGA_INSTRUMENT_SHELL = shell;
})(window);
