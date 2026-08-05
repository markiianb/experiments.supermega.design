(function tangentPolygonCore(global) {
	"use strict";

	const TAU = Math.PI * 2;

	function stable(value) {
		if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
		if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
		return JSON.stringify(value);
	}

	function hashText(value) {
		const text = stable(value);
		let hash = 2166136261;
		for (let index = 0; index < text.length; index += 1) {
			hash ^= text.charCodeAt(index);
			hash = Math.imul(hash, 16777619);
		}
		return (hash >>> 0).toString(16).padStart(8, "0");
	}

	function seededRandom(seed) {
		let state = Number(seed) >>> 0;
		return function random() {
			state = (state + 0x6d2b79f5) >>> 0;
			let value = state;
			value = Math.imul(value ^ (value >>> 15), value | 1);
			value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
			return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
		};
	}

	function sampleRadius(config, random, index) {
		let unit = random();
		if (config.radiusDistribution === "small") unit *= unit;
		if (config.radiusDistribution === "alternating") unit = index % 2 === 0 ? 0.18 + unit * 0.24 : 0.62 + unit * 0.38;
		return config.radiusMin + (config.radiusMax - config.radiusMin) * unit;
	}

	function polygonVertices(circle) {
		return Array.from({ length: circle.sides }, (_, index) => {
			const angle = circle.polygonPhase + index * TAU / circle.sides;
			return { x: circle.x + Math.cos(angle) * circle.radius, y: circle.y + Math.sin(angle) * circle.radius };
		});
	}

	function edgeIndices(sides, start, count, span) {
		const safeSpan = Math.max(1, Math.min(sides, Math.round(span)));
		const safeCount = Math.max(1, Math.min(safeSpan, Math.round(count)));
		if (safeCount === 1) return [((start % sides) + sides) % sides];
		return Array.from({ length: safeCount }, (_, index) => {
			const offset = Math.floor(index * (safeSpan - 1) / (safeCount - 1));
			return ((start + offset) % sides + sides) % sides;
		});
	}

	function travelAngle(config, previous, random, index) {
		if (!previous) return random() * TAU;
		if (config.direction === "scatter") return random() * TAU;
		if (config.direction === "spiral") return previous.travelAngle + TAU * (0.12 + config.turnBias * 0.08 + (random() - 0.5) * 0.035);
		return previous.travelAngle + TAU * (config.turnBias * 0.045 + (random() - 0.5) * 0.08 + (index % 7 === 0 ? 0.04 : 0));
	}

	function buildChain(config) {
		const random = seededRandom(config.seed);
		const circles = [];
		const baseSegments = [];
		for (let index = 0; index < config.steps; index += 1) {
			const radius = sampleRadius(config, random, index);
			const parentIndex = index === 0 ? -1 : config.parentMode === "any" ? Math.floor(random() * index) : index - 1;
			const parent = parentIndex >= 0 ? circles[parentIndex] : null;
			const previous = index > 0 ? circles[index - 1] : null;
			const angle = travelAngle(config, previous, random, index);
			const tangentDistance = parent ? (config.tangency === "internal" ? Math.abs(parent.radius - radius) : parent.radius + radius) : 0;
			const sides = Math.max(config.polygonMin, Math.min(config.polygonMax, Math.floor(config.polygonMin + random() * (config.polygonMax - config.polygonMin + 1))));
			const circle = {
				index,
				parentIndex,
				polygonPhase: (config.phase + index * 0.0125 + (random() - 0.5) * 0.04) * TAU,
				radius,
				sides,
				travelAngle: angle,
				x: parent ? parent.x + Math.cos(angle) * tangentDistance : 0,
				y: parent ? parent.y + Math.sin(angle) * tangentDistance : 0,
			};
			circle.vertices = polygonVertices(circle);
			circle.edgeIndices = edgeIndices(sides, Math.floor(random() * sides), config.edgeCount, config.edgeSpan);
			circle.segments = circle.edgeIndices.map((edgeIndex) => ({
				a: circle.vertices[edgeIndex],
				b: circle.vertices[(edgeIndex + 1) % sides],
				circleIndex: index,
				edgeIndex,
			}));
			circles.push(circle);
			baseSegments.push(...circle.segments);
		}
		const repeatVectors = Array.from({ length: config.repeatCount }, (_, index) => ({ x: index * config.offsetX, y: index * config.offsetY }));
		const segments = repeatVectors.flatMap((vector, repeatIndex) => baseSegments.map((segment) => ({
			a: { x: segment.a.x + vector.x, y: segment.a.y + vector.y },
			b: { x: segment.b.x + vector.x, y: segment.b.y + vector.y },
			circleIndex: segment.circleIndex,
			edgeIndex: segment.edgeIndex,
			repeatIndex,
		})));
		return { baseSegments, circles, repeatVectors, segments };
	}

	function constructionProjection(construction) {
		return {
			circles: construction.circles.map((circle) => ({
				edgeIndices: circle.edgeIndices,
				parentIndex: circle.parentIndex,
				polygonPhase: circle.polygonPhase,
				radius: circle.radius,
				sides: circle.sides,
				travelAngle: circle.travelAngle,
				x: circle.x,
				y: circle.y,
			})),
			repeatVectors: construction.repeatVectors,
		};
	}

	function constructionHash(construction) {
		return hashText(constructionProjection(construction));
	}

	function fitTransform(construction, width, height, safeInsets) {
		const insets = { bottom: 0, left: 0, right: 0, top: 0, ...(safeInsets || {}) };
		const points = [];
		for (const circle of construction.circles) for (const vector of construction.repeatVectors) {
			points.push({ x: circle.x + vector.x - circle.radius, y: circle.y + vector.y - circle.radius });
			points.push({ x: circle.x + vector.x + circle.radius, y: circle.y + vector.y + circle.radius });
		}
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
		context.fillStyle = crt ? "#08090b" : "#eee9de";
		context.fillRect(0, 0, width, height);
		const transform = fitTransform(construction, width, height, options.safeInsets);
		context.setTransform(transform.scale, 0, 0, transform.scale, transform.x, transform.y);
		context.lineCap = "round";
		context.lineJoin = "round";
		if (config.guides) {
			context.save();
			context.strokeStyle = crt ? "rgba(104,211,255,.22)" : "rgba(27,42,48,.2)";
			context.lineWidth = Math.max(0.45, config.lineWidth * 0.5) / transform.scale * width / 1600;
			context.setLineDash([5 / transform.scale, 7 / transform.scale]);
			for (const vector of construction.repeatVectors) for (const circle of construction.circles) {
				context.beginPath();
				context.arc(circle.x + vector.x, circle.y + vector.y, circle.radius, 0, TAU);
				context.stroke();
			}
			context.restore();
		}
		context.strokeStyle = crt ? "#f3f7ef" : "#111216";
		context.lineWidth = Math.max(0.6, config.lineWidth * width / 1600) / transform.scale;
		context.shadowColor = crt ? "rgba(177,244,255,.72)" : "transparent";
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

	global.CGA76_TANGENT_CORE = Object.freeze({ buildChain, constructionHash, edgeIndices, paint, polygonVertices, seededRandom });
})(typeof window === "undefined" ? globalThis : window);
