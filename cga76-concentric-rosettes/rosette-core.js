(function concentricRosetteCore(global) {
	"use strict";

	const TAU = Math.PI * 2;

	function stable(value) {
		if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
		if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
		return JSON.stringify(value);
	}

	function geometryHash(value) {
		const text = stable(value);
		let hash = 2166136261;
		for (let index = 0; index < text.length; index += 1) {
			hash ^= text.charCodeAt(index);
			hash = Math.imul(hash, 16777619);
		}
		return (hash >>> 0).toString(16).padStart(8, "0");
	}

	function radiusSequence(config) {
		if (config.ringCount === 1) return [config.innerRadius];
		return Array.from({ length: config.ringCount }, (_, index) => {
			const unit = index / (config.ringCount - 1);
			if (config.spacing === "geometric") return config.innerRadius * Math.pow(config.outerRadius / config.innerRadius, unit);
			const t = config.spacing === "eased" ? unit * unit * (3 - 2 * unit) : unit;
			return config.innerRadius + (config.outerRadius - config.innerRadius) * t;
		});
	}

	function dropoutValue(centerIndex, ringIndex, edgeIndex) {
		let value = Math.imul(centerIndex + 1, 0x9e3779b1) ^ Math.imul(ringIndex + 11, 0x85ebca6b) ^ Math.imul(edgeIndex + 29, 0xc2b2ae35);
		value ^= value >>> 16;
		value = Math.imul(value, 0x7feb352d);
		value ^= value >>> 15;
		return (value >>> 0) / 4294967296;
	}

	function centerSequence(config) {
		if (config.centerCount === 1) return [{ x: 0, y: 0 }];
		const radius = config.outerRadius * config.centerSpread;
		return Array.from({ length: config.centerCount }, (_, index) => {
			const angle = -Math.PI / 2 + index * TAU / config.centerCount;
			return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
		});
	}

	function buildRosettes(config) {
		const radii = radiusSequence(config);
		const centers = centerSequence(config);
		const rosettes = centers.map((center, centerIndex) => ({
			center,
			centerIndex,
			rings: radii.map((radius, ringIndex) => {
				const unit = config.ringCount === 1 ? 0 : ringIndex / (config.ringCount - 1);
				const sides = Math.round(config.polygonMin + (config.polygonMax - config.polygonMin) * unit);
				const phase = (config.phase + ringIndex * config.phaseDrift + centerIndex * 0.071) * TAU;
				const vertices = Array.from({ length: sides }, (_, vertexIndex) => {
					const angle = phase + vertexIndex * TAU / sides;
					return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
				});
				const requestedEdgeIndices = Array.from({ length: Math.min(config.segmentSpan, sides) }, (_, offset) => ((config.segmentStart + offset) % sides + sides) % sides);
				const segments = requestedEdgeIndices.filter((edgeIndex) => dropoutValue(centerIndex, ringIndex, edgeIndex) >= config.dropout).map((edgeIndex) => ({
					a: vertices[edgeIndex],
					b: vertices[(edgeIndex + 1) % sides],
					edgeIndex,
				}));
				return { center, phase, radius, requestedEdgeIndices, ringIndex, segments, sides, vertices };
			}),
		}));
		const segments = rosettes.flatMap((rosette) => rosette.rings.flatMap((ring) => ring.segments.map((segment) => ({ ...segment, centerIndex: rosette.centerIndex, ringIndex: ring.ringIndex }))));
		return { radii, rosettes, segments };
	}

	function fitTransform(construction, width, height, safeInsets) {
		const insets = { bottom: 0, left: 0, right: 0, top: 0, ...(safeInsets || {}) };
		const points = construction.rosettes.flatMap((rosette) => rosette.rings.flatMap((ring) => ring.vertices));
		let minX = Math.min(...points.map((point) => point.x));
		let maxX = Math.max(...points.map((point) => point.x));
		let minY = Math.min(...points.map((point) => point.y));
		let maxY = Math.max(...points.map((point) => point.y));
		if (!Number.isFinite(minX)) [minX, maxX, minY, maxY] = [-1, 1, -1, 1];
		const availableWidth = Math.max(1, width - insets.left - insets.right);
		const availableHeight = Math.max(1, height - insets.top - insets.bottom);
		const padding = Math.min(availableWidth, availableHeight) * 0.08;
		const scale = Math.min((availableWidth - padding * 2) / Math.max(1, maxX - minX), (availableHeight - padding * 2) / Math.max(1, maxY - minY));
		return {
			scale,
			x: insets.left + availableWidth / 2 - (minX + maxX) * scale / 2,
			y: insets.top + availableHeight / 2 - (minY + maxY) * scale / 2,
		};
	}

	function paint(context, construction, config, options) {
		const width = options.width;
		const height = options.height;
		const progress = Math.max(0, Math.min(1, options.progress ?? 1));
		const crt = config.presentation === "crt";
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.fillStyle = crt ? "#07090a" : "#f0ebe0";
		context.fillRect(0, 0, width, height);
		const transform = fitTransform(construction, width, height, options.safeInsets);
		context.setTransform(transform.scale, 0, 0, transform.scale, transform.x, transform.y);
		context.lineCap = "round";
		context.lineJoin = "round";
		context.strokeStyle = crt ? "#f6f8ef" : "#151519";
		context.lineWidth = Math.max(0.55, config.lineWidth * width / 1600) / transform.scale;
		context.shadowColor = crt ? "rgba(173,243,255,.72)" : "transparent";
		context.shadowBlur = crt ? 4 / transform.scale : 0;
		const visible = Math.ceil(construction.segments.length * progress);
		context.beginPath();
		for (let index = 0; index < visible; index += 1) {
			const segment = construction.segments[index];
			context.moveTo(segment.a.x, segment.a.y);
			context.lineTo(segment.b.x, segment.b.y);
		}
		context.stroke();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.shadowBlur = 0;
		return { progress, transform, visibleSegments: visible };
	}

	global.CGA76_ROSETTE_CORE = Object.freeze({ buildRosettes, centerSequence, dropoutValue, geometryHash, paint, radiusSequence });
})(typeof window === "undefined" ? globalThis : window);
