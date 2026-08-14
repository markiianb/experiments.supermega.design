/**
 * chroma-atlas-core.js — portable colour engine for Chroma Atlas.
 *
 * Clean-room SUPERMEGA implementation. It has no imports, no network access,
 * and no DOM work at load time, so the same classic script works from file://
 * and inside a Node `vm` context.
 *
 * Public surface (all documented here so consumers do not inspect internals):
 * - colour math: parseHex, formatHex, sRGB/linear RGB/OKLab/OKLCH conversion,
 *   interpolateColor, normaliseStops, sampleRamp;
 * - sources: createSeededRng, generatePalette, extractPalette,
 *   inspectStaticImage;
 * - proof: DITHER_SCREENS, getDitherScreen, contrastRatio;
 * - renderers: renderPreview, renderColour, renderSpace;
 * - artifacts: toSVG, encodeTIFF, serializeCSS, serializeJSON,
 *   serializePreset.
 */
(function chromaAtlasEngine(global) {
	"use strict";

	const VERSION = 1;
	const TAU = Math.PI * 2;
	const EPSILON = 1e-12;
	const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
	const MAX_IMAGE_PIXELS = 20_000_000;
	const IMAGE_MIME_TYPES = Object.freeze(["image/png", "image/jpeg", "image/webp"]);

	/** Original SUPERMEGA working palette. No study/source palette is present. */
	const BRAND = Object.freeze({
		signalRed: "#F61515",
		ink: "#0A0A0A",
		paper: "#FBFAF7",
		ultraviolet: "#6C36FF",
		cyan: "#37E6FF",
		acid: "#BFF07A",
		amber: "#FFC04E",
		ember: "#FF7A1E",
		sky: "#5092C7",
	});

	const BRAND_ORDER = Object.freeze([
		BRAND.signalRed,
		BRAND.ink,
		BRAND.paper,
		BRAND.ultraviolet,
		BRAND.cyan,
		BRAND.acid,
		BRAND.amber,
		BRAND.ember,
		BRAND.sky,
	]);

	const STYLES = Object.freeze(["linear", "radial", "angular", "air", "cube", "mono", "dither"]);
	const SPACES = Object.freeze(["srgb", "linear-srgb", "oklab", "oklch"]);

	const DEFAULT_CONFIG = Object.freeze({
		style: "linear",
		space: "oklab",
		color1: BRAND.signalRed,
		color2: BRAND.ultraviolet,
		color3: BRAND.cyan,
		color4: BRAND.paper,
		position1: 0,
		position2: 0.34,
		position3: 0.68,
		position4: 1,
		stopCount: 4,
		angle: 18,
		centerX: 0.5,
		centerY: 0.5,
		radius: 0.86,
		softness: 0.32,
		airScale: 1,
		seed: 240814,
		speed: 0,
		ditherPattern: "bayer-4",
		ditherScale: 4,
		ditherLevels: 4,
		cubeScale: 1,
		cubeLayers: 9,
		cubeGap: 0.08,
		monoRange: 0.78,
		imageColorCount: 6,
		yaw: -28,
		pitch: 22,
		zoom: 1,
		pointSize: 4,
		background: BRAND.paper,
		mode: "gradient",
		palette: "custom",
		exportFormat: "png",
		exportWidth: 1600,
		exportHeight: 1000,
		jpegQuality: 0.92,
	});

	function clamp(value, minimum, maximum) {
		return Math.min(maximum, Math.max(minimum, value));
	}

	function clamp01(value) {
		return clamp(value, 0, 1);
	}

	function finiteNumber(value, fallback) {
		const number = typeof value === "number" ? value : Number(value);
		return Number.isFinite(number) ? number : fallback;
	}

	function modulo(value, divisor) {
		return ((value % divisor) + divisor) % divisor;
	}

	function ascii(bytes, offset, length) {
		let value = "";
		for (let index = 0; index < length; index += 1) value += String.fromCharCode(bytes[offset + index]);
		return value;
	}

	function crc32(bytes) {
		let crc = 0xffffffff;
		for (const byte of bytes) {
			crc ^= byte;
			for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
		}
		return (crc ^ 0xffffffff) >>> 0;
	}

	function checkedImageDimensions(width, height, mime) {
		if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
			throw new Error("Image dimensions are corrupt.");
		}
		const pixels = width * height;
		if (!Number.isSafeInteger(pixels) || pixels > MAX_IMAGE_PIXELS) {
			throw new RangeError("Images may not exceed 20 megapixels.");
		}
		return { width, height, pixels, mime };
	}

	function inspectPng(bytes) {
		const signature = [137, 80, 78, 71, 13, 10, 26, 10];
		if (bytes.length < 33 || signature.some((value, index) => bytes[index] !== value)) return null;
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		let offset = 8;
		let width = 0;
		let height = 0;
		let hasHeader = false;
		let hasPixels = false;
		let ended = false;
		while (offset + 12 <= bytes.length) {
			const length = view.getUint32(offset);
			if (length > bytes.length - offset - 12) throw new Error("PNG chunk bounds are corrupt.");
			const type = ascii(bytes, offset + 4, 4);
			const dataEnd = offset + 8 + length;
			if (view.getUint32(dataEnd) !== crc32(bytes.subarray(offset + 4, dataEnd))) throw new Error("PNG CRC is corrupt.");
			if (!hasHeader && type !== "IHDR") throw new Error("PNG must begin with IHDR.");
			if (type === "IHDR") {
				if (hasHeader || length !== 13) throw new Error("PNG IHDR is corrupt.");
				width = view.getUint32(offset + 8);
				height = view.getUint32(offset + 12);
				if (bytes[offset + 18] !== 0 || bytes[offset + 19] !== 0) throw new Error("PNG compression or filtering is unsupported.");
				hasHeader = true;
			}
			if (type === "acTL" || type === "fcTL" || type === "fdAT") throw new Error("Animated PNG input is not accepted.");
			if (type === "IDAT") hasPixels = true;
			if (type === "IEND") {
				if (length !== 0) throw new Error("PNG IEND is corrupt.");
				ended = true;
				offset = dataEnd + 4;
				break;
			}
			offset = dataEnd + 4;
		}
		if (!hasHeader || !hasPixels || !ended || offset !== bytes.length) throw new Error("PNG structure is incomplete or corrupt.");
		return checkedImageDimensions(width, height, "image/png");
	}

	function inspectJpeg(bytes) {
		if (bytes.length < 12 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
		if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) throw new Error("JPEG end marker is missing or corrupt.");
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
		let offset = 2;
		let width = 0;
		let height = 0;
		while (offset + 3 < bytes.length - 2) {
			if (bytes[offset] !== 0xff) { offset += 1; continue; }
			while (bytes[offset] === 0xff) offset += 1;
			const marker = bytes[offset++];
			if (marker === 0xd9 || marker === 0xda) break;
			if (marker >= 0xd0 && marker <= 0xd7) continue;
			if (offset + 2 > bytes.length) throw new Error("JPEG segment is corrupt.");
			const length = view.getUint16(offset);
			if (length < 2 || offset + length > bytes.length) throw new Error("JPEG segment bounds are corrupt.");
			if (frameMarkers.has(marker)) {
				if (length < 7) throw new Error("JPEG frame is corrupt.");
				height = view.getUint16(offset + 3);
				width = view.getUint16(offset + 5);
			}
			offset += length;
		}
		if (!width || !height) throw new Error("JPEG dimensions are missing or corrupt.");
		return checkedImageDimensions(width, height, "image/jpeg");
	}

	function inspectWebp(bytes) {
		if (bytes.length < 30 || ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") return null;
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		if (view.getUint32(4, true) + 8 !== bytes.length) throw new Error("WebP RIFF bounds are corrupt.");
		let offset = 12;
		let width = 0;
		let height = 0;
		let found = false;
		while (offset + 8 <= bytes.length) {
			const type = ascii(bytes, offset, 4);
			const length = view.getUint32(offset + 4, true);
			const data = offset + 8;
			if (data + length > bytes.length) throw new Error("WebP chunk bounds are corrupt.");
			if (type === "ANIM" || type === "ANMF") throw new Error("Animated WebP input is not accepted.");
			if (type === "VP8X") {
				if (length !== 10) throw new Error("WebP VP8X is corrupt.");
				if (bytes[data] & 2) throw new Error("Animated WebP input is not accepted.");
				width = 1 + bytes[data + 4] + bytes[data + 5] * 256 + bytes[data + 6] * 65536;
				height = 1 + bytes[data + 7] + bytes[data + 8] * 256 + bytes[data + 9] * 65536;
				found = true;
			} else if (type === "VP8 " && length >= 10 && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a) {
				width = view.getUint16(data + 6, true) & 0x3fff;
				height = view.getUint16(data + 8, true) & 0x3fff;
				found = true;
			} else if (type === "VP8L" && length >= 5 && bytes[data] === 0x2f) {
				const bits = view.getUint32(data + 1, true);
				width = (bits & 0x3fff) + 1;
				height = ((bits >>> 14) & 0x3fff) + 1;
				found = true;
			}
			offset = data + length + (length % 2);
		}
		if (!found || offset !== bytes.length) throw new Error("WebP dimensions are missing or corrupt.");
		return checkedImageDimensions(width, height, "image/webp");
	}

	function inspectStaticImage(input, declaredType) {
		const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
		const type = declaredType === "image/jpg" ? "image/jpeg" : declaredType;
		if (!IMAGE_MIME_TYPES.includes(type)) throw new Error("Choose a static PNG, JPEG, or WebP image.");
		const metadata = inspectPng(bytes) || inspectJpeg(bytes) || inspectWebp(bytes);
		if (!metadata) throw new Error("Image magic bytes are not PNG, JPEG, or WebP.");
		if (metadata.mime !== type) throw new Error("Image content does not match its declared type.");
		return metadata;
	}

	function normalizedSpace(value) {
		const candidate = String(value || "").toLowerCase().replace(/[-_ ]/g, "");
		if (candidate === "rgb" || candidate === "srgb") return "srgb";
		if (candidate === "linearrgb" || candidate === "linearsrgb") return "linear-srgb";
		if (candidate === "lab" || candidate === "oklab") return "oklab";
		if (candidate === "lch" || candidate === "oklch") return "oklch";
		return DEFAULT_CONFIG.space;
	}

	function parseHex(value) {
		if (typeof value !== "string") throw new TypeError("A hex colour must be a string.");
		let source = value.trim();
		if (source[0] === "#") source = source.slice(1);
		if (source.length === 3 || source.length === 4) {
			source = source.split("").map((character) => character + character).join("");
		}
		if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(source)) {
			throw new TypeError(`Invalid hex colour: ${value}`);
		}
		const result = [
			parseInt(source.slice(0, 2), 16) / 255,
			parseInt(source.slice(2, 4), 16) / 255,
			parseInt(source.slice(4, 6), 16) / 255,
		];
		if (source.length === 8) result.push(parseInt(source.slice(6, 8), 16) / 255);
		return result;
	}

	function readRgb(value) {
		if (typeof value === "string") return parseHex(value);
		let source;
		if (Array.isArray(value) || ArrayBuffer.isView(value)) {
			source = Array.from(value);
		} else if (value && typeof value === "object") {
			source = [value.r, value.g, value.b];
			if (value.a !== undefined) source.push(value.a);
		} else {
			throw new TypeError("A colour must be a hex string, RGB array, or RGB object.");
		}
		if (source.length < 3 || source.slice(0, 3).some((channel) => !Number.isFinite(Number(channel)))) {
			throw new TypeError("RGB colours need three finite channels.");
		}
		const channels = source.map(Number);
		const byteScale = Math.max(Math.abs(channels[0]), Math.abs(channels[1]), Math.abs(channels[2])) > 1.5;
		if (byteScale) {
			channels[0] /= 255;
			channels[1] /= 255;
			channels[2] /= 255;
			if (channels.length > 3 && Math.abs(channels[3]) > 1) channels[3] /= 255;
		}
		return channels;
	}

	function formatHex(value, includeAlpha) {
		const rgb = readRgb(value);
		const withAlpha = includeAlpha === true || (includeAlpha !== false && rgb.length > 3 && rgb[3] < 1 - EPSILON);
		const channels = rgb.slice(0, withAlpha ? 4 : 3);
		while (channels.length < 4 && withAlpha) channels.push(1);
		return `#${channels.map((channel) => Math.round(clamp01(channel) * 255)
			.toString(16).padStart(2, "0").toUpperCase()).join("")}`;
	}

	function srgbChannelToLinear(channel) {
		const value = Number(channel);
		return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
	}

	function linearChannelToSrgb(channel) {
		const value = Number(channel);
		return value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
	}

	function srgbToLinear(value) {
		if (typeof value === "number") return srgbChannelToLinear(value);
		const rgb = readRgb(value);
		const result = rgb.slice(0, 3).map(srgbChannelToLinear);
		if (rgb.length > 3) result.push(rgb[3]);
		return result;
	}

	function linearToSrgb(value) {
		if (typeof value === "number") return linearChannelToSrgb(value);
		if (!value || value.length < 3) throw new TypeError("Linear RGB needs three channels.");
		const result = [
			linearChannelToSrgb(Number(value[0])),
			linearChannelToSrgb(Number(value[1])),
			linearChannelToSrgb(Number(value[2])),
		];
		if (value.length > 3) result.push(Number(value[3]));
		return result;
	}

	function linearRgbToOklab(value) {
		if (!value || value.length < 3) throw new TypeError("Linear RGB needs three channels.");
		const r = Number(value[0]);
		const g = Number(value[1]);
		const b = Number(value[2]);
		const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
		const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
		const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
		return [
			0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
			1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
			0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
		];
	}

	function oklabToLinearRgb(value) {
		if (!value || value.length < 3) throw new TypeError("OKLab needs L, a, and b.");
		const L = Number(value[0]);
		const a = Number(value[1]);
		const b = Number(value[2]);
		const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
		const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
		const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
		return [
			4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
			-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
			-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
		];
	}

	function srgbToOklab(value) {
		return linearRgbToOklab(srgbToLinear(value));
	}

	function oklabToSrgb(value, shouldClamp) {
		const rgb = linearToSrgb(oklabToLinearRgb(value));
		return shouldClamp === false ? rgb : rgb.map(clamp01);
	}

	function oklabToOklch(value) {
		if (!value || value.length < 3) throw new TypeError("OKLab needs L, a, and b.");
		const L = Number(value[0]);
		const a = Number(value[1]);
		const b = Number(value[2]);
		const C = Math.sqrt(a * a + b * b);
		const h = C < EPSILON ? 0 : modulo(Math.atan2(b, a) * 180 / Math.PI, 360);
		return [L, C, h];
	}

	function oklchToOklab(value) {
		if (!value || value.length < 3) throw new TypeError("OKLCH needs L, C, and h.");
		const radians = Number(value[2]) * Math.PI / 180;
		return [Number(value[0]), Number(value[1]) * Math.cos(radians), Number(value[1]) * Math.sin(radians)];
	}

	function mixChannel(a, b, amount) {
		return a + (b - a) * amount;
	}

	function interpolateSrgb(a, b, amount) {
		const left = readRgb(a);
		const right = readRgb(b);
		const t = clamp01(finiteNumber(amount, 0));
		return [
			mixChannel(left[0], right[0], t),
			mixChannel(left[1], right[1], t),
			mixChannel(left[2], right[2], t),
			mixChannel(left.length > 3 ? left[3] : 1, right.length > 3 ? right[3] : 1, t),
		];
	}

	function interpolateLinearSrgb(a, b, amount) {
		const leftRgb = readRgb(a);
		const rightRgb = readRgb(b);
		const left = srgbToLinear(leftRgb);
		const right = srgbToLinear(rightRgb);
		const t = clamp01(finiteNumber(amount, 0));
		const rgb = linearToSrgb([
			mixChannel(left[0], right[0], t),
			mixChannel(left[1], right[1], t),
			mixChannel(left[2], right[2], t),
		]);
		rgb.push(mixChannel(leftRgb.length > 3 ? leftRgb[3] : 1, rightRgb.length > 3 ? rightRgb[3] : 1, t));
		return rgb;
	}

	function interpolateOklab(a, b, amount) {
		const leftRgb = readRgb(a);
		const rightRgb = readRgb(b);
		const left = srgbToOklab(leftRgb);
		const right = srgbToOklab(rightRgb);
		const t = clamp01(finiteNumber(amount, 0));
		const rgb = oklabToSrgb([
			mixChannel(left[0], right[0], t),
			mixChannel(left[1], right[1], t),
			mixChannel(left[2], right[2], t),
		]);
		rgb.push(mixChannel(leftRgb.length > 3 ? leftRgb[3] : 1, rightRgb.length > 3 ? rightRgb[3] : 1, t));
		return rgb;
	}

	function interpolateOklch(a, b, amount) {
		const leftRgb = readRgb(a);
		const rightRgb = readRgb(b);
		const left = oklabToOklch(srgbToOklab(leftRgb));
		const right = oklabToOklch(srgbToOklab(rightRgb));
		if (left[1] < 1e-7) left[2] = right[2];
		if (right[1] < 1e-7) right[2] = left[2];
		const t = clamp01(finiteNumber(amount, 0));
		const hueDelta = modulo(right[2] - left[2] + 180, 360) - 180;
		const rgb = oklabToSrgb(oklchToOklab([
			mixChannel(left[0], right[0], t),
			mixChannel(left[1], right[1], t),
			left[2] + hueDelta * t,
		]));
		rgb.push(mixChannel(leftRgb.length > 3 ? leftRgb[3] : 1, rightRgb.length > 3 ? rightRgb[3] : 1, t));
		return rgb;
	}

	function interpolateRgb(a, b, amount, space) {
		const mode = normalizedSpace(space);
		if (mode === "srgb") return interpolateSrgb(a, b, amount);
		if (mode === "linear-srgb") return interpolateLinearSrgb(a, b, amount);
		if (mode === "oklch") return interpolateOklch(a, b, amount);
		return interpolateOklab(a, b, amount);
	}

	function interpolateColor(a, b, amount, space) {
		const result = interpolateRgb(a, b, amount, space);
		return typeof a === "string" || typeof b === "string" ? formatHex(result) : result;
	}

	function normalizedPosition(value, fallback) {
		if (typeof value === "string" && value.trim().endsWith("%")) {
			return clamp01(finiteNumber(value.trim().slice(0, -1), fallback * 100) / 100);
		}
		let number = finiteNumber(value, fallback);
		if (number > 1 && number <= 100) number /= 100;
		return clamp01(number);
	}

	function normalizedHex(value, fallback) {
		try {
			return formatHex(parseHex(value));
		} catch (_error) {
			return fallback;
		}
	}

	function primaryOrAlias(source, primary, alias) {
		return source[alias] !== undefined ? source[alias] : source[primary];
	}

	function canonicalSlots(stopCount) {
		if (stopCount === 2) return [1, 4];
		if (stopCount === 3) return [1, 2, 4];
		return [1, 2, 3, 4];
	}

	/**
	 * Normalise ramp stops. Fixed slot semantics are intentional: two stops use
	 * slots 1+4; three use 1+2+4; four use all slots. Hidden slots survive a
	 * stop-count change in the owning configuration.
	 */
	function normaliseStops(input) {
		if (Array.isArray(input)) {
			if (input.length === 0) return normaliseStops(DEFAULT_CONFIG);
			return input.map((stop, index) => {
				const color = stop && (stop.color || stop.c || stop.value) || BRAND_ORDER[index % BRAND_ORDER.length];
				const rawPosition = stop && (stop.position !== undefined ? stop.position
					: stop.pos !== undefined ? stop.pos : stop.t !== undefined ? stop.t : stop.offset);
				const fallback = input.length === 1 ? 0 : index / (input.length - 1);
				return { color: normalizedHex(color, BRAND_ORDER[index % BRAND_ORDER.length]), position: normalizedPosition(rawPosition, fallback), slot: index + 1 };
			}).sort((a, b) => a.position - b.position || a.slot - b.slot);
		}
		const config = input && typeof input === "object" ? input : DEFAULT_CONFIG;
		const count = clamp(Math.round(finiteNumber(config.stopCount, DEFAULT_CONFIG.stopCount)), 2, 4);
		return canonicalSlots(count).map((slot) => ({
			color: normalizedHex(config[`color${slot}`], DEFAULT_CONFIG[`color${slot}`]),
			position: normalizedPosition(config[`position${slot}`], DEFAULT_CONFIG[`position${slot}`]),
			slot,
		})).sort((a, b) => a.position - b.position || a.slot - b.slot);
	}

	function normalizeConfig(input) {
		const source = input && typeof input === "object" ? input : {};
		const styleCandidate = String(source.style || source.type || DEFAULT_CONFIG.style).toLowerCase();
		const style = STYLES.includes(styleCandidate) ? styleCandidate : DEFAULT_CONFIG.style;
		const patternCandidate = String(source.ditherPattern || source.pattern || DEFAULT_CONFIG.ditherPattern).toLowerCase();
		const centerXInput = primaryOrAlias(source, "centerX", "focusX");
		const centerYInput = primaryOrAlias(source, "centerY", "focusY");
		const yawInput = primaryOrAlias(source, "yaw", "spaceYaw");
		const pitchInput = primaryOrAlias(source, "pitch", "spacePitch");
		const speedInput = primaryOrAlias(source, "cubeSpeed", "speed");
		const config = {
			style,
			space: normalizedSpace(source.interpolation || source.space || source.colorSpace),
			interpolation: normalizedSpace(source.interpolation || source.space || source.colorSpace),
			color1: normalizedHex(source.color1, DEFAULT_CONFIG.color1),
			color2: normalizedHex(source.color2, DEFAULT_CONFIG.color2),
			color3: normalizedHex(source.color3, DEFAULT_CONFIG.color3),
			color4: normalizedHex(source.color4, DEFAULT_CONFIG.color4),
			position1: normalizedPosition(source.position1, DEFAULT_CONFIG.position1),
			position2: normalizedPosition(source.position2, DEFAULT_CONFIG.position2),
			position3: normalizedPosition(source.position3, DEFAULT_CONFIG.position3),
			position4: normalizedPosition(source.position4, DEFAULT_CONFIG.position4),
			stopCount: clamp(Math.round(finiteNumber(source.stopCount, DEFAULT_CONFIG.stopCount)), 2, 4),
			angle: modulo(finiteNumber(source.angle, DEFAULT_CONFIG.angle), 360),
			centerX: clamp01(finiteNumber(centerXInput, DEFAULT_CONFIG.centerX)),
			centerY: clamp01(finiteNumber(centerYInput, DEFAULT_CONFIG.centerY)),
			focusX: clamp01(finiteNumber(centerXInput, DEFAULT_CONFIG.centerX)),
			focusY: clamp01(finiteNumber(centerYInput, DEFAULT_CONFIG.centerY)),
			radius: clamp(finiteNumber(source.radius, DEFAULT_CONFIG.radius), 0.05, 2),
			softness: clamp01(finiteNumber(source.softness, DEFAULT_CONFIG.softness)),
			airScale: clamp(finiteNumber(source.airScale, DEFAULT_CONFIG.airScale), 0.5, 2),
			seed: hashSeed(source.seed === undefined ? DEFAULT_CONFIG.seed : source.seed),
			speed: clamp(finiteNumber(speedInput, DEFAULT_CONFIG.speed), -4, 4),
			cubeSpeed: clamp(finiteNumber(speedInput, DEFAULT_CONFIG.speed), -4, 4),
			ditherPattern: DITHER_SCREENS[patternCandidate] ? patternCandidate : DEFAULT_CONFIG.ditherPattern,
			ditherScale: clamp(Math.round(finiteNumber(source.ditherScale, DEFAULT_CONFIG.ditherScale)), 1, 32),
			ditherLevels: clamp(Math.round(finiteNumber(source.ditherLevels || source.levels, DEFAULT_CONFIG.ditherLevels)), 2, 12),
			cubeScale: clamp(finiteNumber(source.cubeScale, DEFAULT_CONFIG.cubeScale), 0.35, 3),
			cubeLayers: clamp(Math.round(finiteNumber(source.cubeLayers, DEFAULT_CONFIG.cubeLayers)), 3, 20),
			cubeGap: clamp(finiteNumber(source.cubeGap, DEFAULT_CONFIG.cubeGap), 0, 0.2),
			monoRange: clamp(finiteNumber(source.monoRange, DEFAULT_CONFIG.monoRange), 0.1, 1),
			imageColorCount: clamp(Math.round(finiteNumber(source.imageColorCount, DEFAULT_CONFIG.imageColorCount)), 2, 12),
			yaw: modulo(finiteNumber(yawInput, DEFAULT_CONFIG.yaw) + 180, 360) - 180,
			pitch: clamp(finiteNumber(pitchInput, DEFAULT_CONFIG.pitch), -89, 89),
			spaceYaw: modulo(finiteNumber(yawInput, DEFAULT_CONFIG.yaw) + 180, 360) - 180,
			spacePitch: clamp(finiteNumber(pitchInput, DEFAULT_CONFIG.pitch), -89, 89),
			zoom: clamp(finiteNumber(source.zoom, DEFAULT_CONFIG.zoom), 0.25, 4),
			pointSize: clamp(finiteNumber(source.pointSize, DEFAULT_CONFIG.pointSize), 2, 10),
			background: normalizedHex(source.background, DEFAULT_CONFIG.background),
			mode: typeof source.mode === "string" ? source.mode : DEFAULT_CONFIG.mode,
			palette: typeof source.palette === "string" ? source.palette : DEFAULT_CONFIG.palette,
			exportFormat: typeof source.exportFormat === "string" ? source.exportFormat : DEFAULT_CONFIG.exportFormat,
			exportWidth: clamp(Math.round(finiteNumber(source.exportWidth, DEFAULT_CONFIG.exportWidth)), 64, 4096),
			exportHeight: clamp(Math.round(finiteNumber(source.exportHeight, DEFAULT_CONFIG.exportHeight)), 64, 4096),
			jpegQuality: clamp(finiteNumber(source.jpegQuality, DEFAULT_CONFIG.jpegQuality), 0.1, 1),
		};
		return config;
	}

	function preparedStops(input) {
		const stops = normaliseStops(input);
		return stops.map((stop) => {
			const rgb = parseHex(stop.color);
			return {
				color: stop.color,
				position: stop.position,
				slot: stop.slot,
				rgb,
				lab: srgbToOklab(rgb),
				lch: oklabToOklch(srgbToOklab(rgb)),
			};
		});
	}

	function samplePrepared(stops, amount, space) {
		const t = clamp01(finiteNumber(amount, 0));
		if (t <= stops[0].position) return stops[0].rgb.slice();
		if (t >= stops[stops.length - 1].position) return stops[stops.length - 1].rgb.slice();
		for (let index = 0; index < stops.length - 1; index++) {
			const left = stops[index];
			const right = stops[index + 1];
			if (t <= right.position) {
				const span = right.position - left.position;
				const local = span <= EPSILON ? 1 : (t - left.position) / span;
				return interpolateRgb(left.rgb, right.rgb, local, space);
			}
		}
		return stops[stops.length - 1].rgb.slice();
	}

	function sampleRampRgb(input, amount, space) {
		const mode = space || (input && !Array.isArray(input) && (input.space || input.interpolation || input.colorSpace));
		return samplePrepared(preparedStops(input), amount, mode);
	}

	function sampleRamp(input, amount, space) {
		return formatHex(sampleRampRgb(input, amount, space));
	}

	function hashSeed(seed) {
		if (typeof seed === "number" && Number.isFinite(seed)) return seed >>> 0;
		const source = String(seed === undefined ? 0 : seed);
		let hash = 2166136261;
		for (let index = 0; index < source.length; index++) {
			hash ^= source.charCodeAt(index);
			hash = Math.imul(hash, 16777619);
		}
		return hash >>> 0;
	}

	function createSeededRng(seed) {
		let state = hashSeed(seed);
		return function nextRandom() {
			state |= 0;
			state = state + 0x6D2B79F5 | 0;
			let value = Math.imul(state ^ state >>> 15, 1 | state);
			value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
			return ((value ^ value >>> 14) >>> 0) / 4294967296;
		};
	}

	/** A seeded selection from SUPERMEGA-owned constants; never source/study data. */
	function generatePalette(seed, count) {
		let requested = count;
		if (count && typeof count === "object") requested = count.count;
		const length = clamp(Math.round(finiteNumber(requested, 4)), 2, 12);
		const random = createSeededRng(seed);
		const colors = BRAND_ORDER.slice();
		for (let index = colors.length - 1; index > 0; index--) {
			const other = Math.floor(random() * (index + 1));
			const held = colors[index];
			colors[index] = colors[other];
			colors[other] = held;
		}
		const result = [];
		for (let index = 0; index < length; index++) result.push(colors[index % colors.length]);
		return result;
	}

	function squaredDistance(a, b) {
		const d0 = a[0] - b[0];
		const d1 = a[1] - b[1];
		const d2 = a[2] - b[2];
		return d0 * d0 + d1 * d1 + d2 * d2;
	}

	function sourcePixels(source) {
		const data = source && source.data ? source.data : source;
		if (!data || typeof data.length !== "number") throw new TypeError("Palette extraction needs RGBA pixel data or ImageData.");
		if (data.length % 4 !== 0) throw new RangeError("RGBA pixel data length must be divisible by four.");
		return data;
	}

	/**
	 * Deterministic bounded k-means in OKLab. Sampling, farthest-point seeding,
	 * iteration count, empty-cluster recovery, and output order are all stable.
	 */
	function extractPalette(source, count, options) {
		let settings = options || {};
		let requested = count;
		if (count && typeof count === "object") {
			settings = count;
			requested = settings.count;
		}
		const wanted = clamp(Math.round(finiteNumber(requested, 4)), 1, 12);
		const maxSamples = clamp(Math.round(finiteNumber(settings.maxSamples, 4096)), 32, 16384);
		const iterations = clamp(Math.round(finiteNumber(settings.iterations, 12)), 1, 32);
		const alphaFloor = clamp(Math.round(finiteNumber(settings.alphaFloor, 16)), 0, 255);
		const rgba = sourcePixels(source);
		const pixelCount = rgba.length / 4;
		const sampleCount = Math.min(pixelCount, maxSamples);
		const samples = [];
		for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
			const pixelIndex = Math.min(pixelCount - 1, Math.floor((sampleIndex + 0.5) * pixelCount / sampleCount));
			const offset = pixelIndex * 4;
			if (rgba[offset + 3] < alphaFloor) continue;
			const rgb = [rgba[offset] / 255, rgba[offset + 1] / 255, rgba[offset + 2] / 255];
			samples.push({ lab: srgbToOklab(rgb), weight: rgba[offset + 3] / 255 });
		}
		if (samples.length === 0) {
			throw new RangeError("Palette extraction needs at least one visible pixel.");
		}

		const clustersWanted = Math.min(wanted, samples.length);
		const mean = [0, 0, 0];
		let totalWeight = 0;
		for (const sample of samples) {
			totalWeight += sample.weight;
			mean[0] += sample.lab[0] * sample.weight;
			mean[1] += sample.lab[1] * sample.weight;
			mean[2] += sample.lab[2] * sample.weight;
		}
		mean[0] /= totalWeight;
		mean[1] /= totalWeight;
		mean[2] /= totalWeight;

		const centroids = [];
		let firstIndex = 0;
		let firstDistance = -1;
		for (let index = 0; index < samples.length; index++) {
			const distance = squaredDistance(samples[index].lab, mean);
			if (distance > firstDistance) {
				firstDistance = distance;
				firstIndex = index;
			}
		}
		centroids.push(samples[firstIndex].lab.slice());
		while (centroids.length < clustersWanted) {
			let farthestIndex = 0;
			let farthestDistance = -1;
			for (let index = 0; index < samples.length; index++) {
				let nearest = Infinity;
				for (const centroid of centroids) nearest = Math.min(nearest, squaredDistance(samples[index].lab, centroid));
				if (nearest > farthestDistance) {
					farthestDistance = nearest;
					farthestIndex = index;
				}
			}
			if (farthestDistance <= EPSILON) break;
			centroids.push(samples[farthestIndex].lab.slice());
		}

		const assignments = new Uint8Array(samples.length);
		let weights = new Array(centroids.length).fill(0);
		for (let iteration = 0; iteration < iterations; iteration++) {
			const sums = centroids.map(() => [0, 0, 0]);
			weights = new Array(centroids.length).fill(0);
			for (let index = 0; index < samples.length; index++) {
				let nearestIndex = 0;
				let nearestDistance = Infinity;
				for (let cluster = 0; cluster < centroids.length; cluster++) {
					const distance = squaredDistance(samples[index].lab, centroids[cluster]);
					if (distance < nearestDistance) {
						nearestDistance = distance;
						nearestIndex = cluster;
					}
				}
				assignments[index] = nearestIndex;
				const weight = samples[index].weight;
				weights[nearestIndex] += weight;
				sums[nearestIndex][0] += samples[index].lab[0] * weight;
				sums[nearestIndex][1] += samples[index].lab[1] * weight;
				sums[nearestIndex][2] += samples[index].lab[2] * weight;
			}
			let movement = 0;
			for (let cluster = 0; cluster < centroids.length; cluster++) {
				if (weights[cluster] <= EPSILON) continue;
				const next = [
					sums[cluster][0] / weights[cluster],
					sums[cluster][1] / weights[cluster],
					sums[cluster][2] / weights[cluster],
				];
				movement += squaredDistance(next, centroids[cluster]);
				centroids[cluster] = next;
			}
			if (movement < 1e-12) break;
		}

		const records = centroids.map((lab, index) => ({ lab, weight: weights[index], index }))
			.filter((record) => record.weight > EPSILON);
		records.sort((a, b) => a.lab[0] - b.lab[0] || a.lab[1] - b.lab[1] || a.lab[2] - b.lab[2] || a.index - b.index);
		const merged = [];
		const byHex = new Map();
		for (const record of records) {
			const hex = formatHex(oklabToSrgb(record.lab));
			const existing = byHex.get(hex);
			if (existing) existing.weight += record.weight;
			else {
				const next = { ...record, hex };
				byHex.set(hex, next);
				merged.push(next);
			}
		}
		const assignedWeight = merged.reduce((sum, record) => sum + record.weight, 0) || 1;
		return merged.map((record) => {
			const hex = record.hex;
			const share = record.weight / assignedWeight;
			return { color: hex, hex, population: Math.round(share * pixelCount), share };
		});
	}

	function bayerRanks(size) {
		let matrix = [[0, 2], [3, 1]];
		while (matrix.length < size) {
			const oldSize = matrix.length;
			const next = Array.from({ length: oldSize * 2 }, () => new Array(oldSize * 2));
			for (let y = 0; y < oldSize; y++) {
				for (let x = 0; x < oldSize; x++) {
					const value = matrix[y][x] * 4;
					next[y][x] = value;
					next[y][x + oldSize] = value + 2;
					next[y + oldSize][x] = value + 3;
					next[y + oldSize][x + oldSize] = value + 1;
				}
			}
			matrix = next;
		}
		return matrix;
	}

	function rankedScreen(size, score) {
		const cells = [];
		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) cells.push({ x, y, score: score(x, y, size), order: y * size + x });
		}
		cells.sort((a, b) => a.score - b.score || a.order - b.order);
		const matrix = Array.from({ length: size }, () => new Array(size));
		cells.forEach((cell, rank) => { matrix[cell.y][cell.x] = rank; });
		return matrix;
	}

	function makeScreen(id, name, ranks) {
		const size = ranks.length;
		const frozenRanks = Object.freeze(ranks.map((row) => Object.freeze(row.slice())));
		const values = Object.freeze(ranks.map((row) => Object.freeze(row.map((rank) => (rank + 0.5) / (size * size)))));
		return Object.freeze({ id, name, size, ranks: frozenRanks, values });
	}

	const clusterRanks = rankedScreen(8, (x, y, size) => {
		const centers = [[1.5, 1.5], [5.5, 1.5], [1.5, 5.5], [5.5, 5.5]];
		let distance = Infinity;
		for (const center of centers) distance = Math.min(distance, Math.pow(x - center[0], 2) + Math.pow(y - center[1], 2));
		return distance + modulo(x + y * 3, size) * 0.002;
	});
	const lineRanks = rankedScreen(8, (x, y, size) => modulo(y + (x % 2) * 0.375, size) + x * 0.002);
	const diagonalRanks = rankedScreen(8, (x, y, size) => modulo(x + y, size) + modulo(x - y, size) * 0.08);

	/** Six genuinely distinct, fully ranked ordered threshold screens. */
	const DITHER_SCREENS = Object.freeze({
		"bayer-2": makeScreen("bayer-2", "Bayer 2×2", bayerRanks(2)),
		"bayer-4": makeScreen("bayer-4", "Bayer 4×4", bayerRanks(4)),
		"bayer-8": makeScreen("bayer-8", "Bayer 8×8", bayerRanks(8)),
		cluster: makeScreen("cluster", "Clustered dot 8×8", clusterRanks),
		line: makeScreen("line", "Line 8×8", lineRanks),
		diagonal: makeScreen("diagonal", "Diagonal 8×8", diagonalRanks),
	});

	const DITHER_PATTERNS = Object.freeze(Object.keys(DITHER_SCREENS));

	function getDitherScreen(id) {
		return DITHER_SCREENS[id] || DITHER_SCREENS[DEFAULT_CONFIG.ditherPattern];
	}

	function getDitherThreshold(id, x, y) {
		const screen = getDitherScreen(id);
		return screen.values[modulo(Math.floor(y), screen.size)][modulo(Math.floor(x), screen.size)];
	}

	function relativeLuminance(color) {
		const linear = srgbToLinear(readRgb(color));
		return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
	}

	function contrastRatio(a, b) {
		const first = relativeLuminance(a);
		const second = relativeLuminance(b);
		return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
	}

	function renderDimensions(width, height) {
		const w = Math.max(1, Math.floor(finiteNumber(width, 1)));
		const h = Math.max(1, Math.floor(finiteNumber(height, 1)));
		return [w, h];
	}

	function resetContext(ctx) {
		if (!ctx || typeof ctx.fillRect !== "function") throw new TypeError("A Canvas 2D context is required.");
		if (typeof ctx.setTransform === "function") ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.globalAlpha = 1;
	}

	function rampLut(config, count, monochrome) {
		const stops = preparedStops(config);
		const length = count || 1024;
		const data = new Uint8Array(length * 3);
		for (let index = 0; index < length; index++) {
			let rgb = samplePrepared(stops, index / (length - 1), config.space);
			if (monochrome) {
				const sourceLightness = srgbToOklab(rgb)[0];
				const lightness = clamp01(0.5 + (sourceLightness - 0.5) * config.monoRange);
				rgb = oklabToSrgb([lightness, 0, 0]);
			}
			data[index * 3] = Math.round(clamp01(rgb[0]) * 255);
			data[index * 3 + 1] = Math.round(clamp01(rgb[1]) * 255);
			data[index * 3 + 2] = Math.round(clamp01(rgb[2]) * 255);
		}
		return data;
	}

	function lutColor(lut, amount) {
		const index = Math.round(clamp01(amount) * (lut.length / 3 - 1)) * 3;
		return [lut[index], lut[index + 1], lut[index + 2]];
	}

	function putRgba(ctx, width, height, rgba) {
		let imageData;
		if (typeof ctx.createImageData === "function") {
			imageData = ctx.createImageData(width, height);
			imageData.data.set(rgba);
		} else if (typeof global.ImageData === "function") {
			imageData = new global.ImageData(rgba, width, height);
		} else {
			imageData = { data: rgba, width, height };
		}
		if (typeof ctx.putImageData !== "function") throw new TypeError("Canvas context cannot receive image data.");
		ctx.putImageData(imageData, 0, 0);
	}

	function fieldAmount(style, x, y, config, time, airData) {
		const nx = x;
		const ny = y;
		const radians = config.angle * Math.PI / 180;
		if (style === "radial") {
			const dx = nx - config.centerX;
			const dy = ny - config.centerY;
			const farthestX = Math.max(config.centerX, 1 - config.centerX);
			const farthestY = Math.max(config.centerY, 1 - config.centerY);
			return Math.sqrt(dx * dx + dy * dy) / (Math.sqrt(farthestX * farthestX + farthestY * farthestY) * config.radius);
		}
		if (style === "angular") {
			return modulo(Math.atan2(ny - config.centerY, nx - config.centerX) / TAU + config.angle / 360, 1);
		}
		if (style === "air") {
			const phase = time * config.speed * 0.08;
			const scale = config.airScale;
			const dx1 = (nx - airData[0]) / scale;
			const dy1 = (ny - airData[1]) / scale;
			const dx2 = (nx - airData[2]) / scale;
			const dy2 = (ny - airData[3]) / scale;
			const wave = Math.sin(((nx * 1.7 + ny * 0.55) / scale + phase) * TAU) * 0.18;
			const orbit = Math.cos((Math.sqrt(dx1 * dx1 + dy1 * dy1) * 2.5 - phase) * TAU) * 0.2;
			const cross = Math.sin((Math.atan2(dy2, dx2) / TAU + Math.sqrt(dx2 * dx2 + dy2 * dy2) * 1.4 + phase * 0.7) * TAU) * 0.14;
			const contrast = 1.45 - config.softness * 1.05;
			return 0.5 + (wave + orbit + cross) * contrast;
		}
		const dx = Math.cos(radians);
		const dy = Math.sin(radians);
		return 0.5 + ((nx - 0.5) * dx + (ny - 0.5) * dy) / Math.max(EPSILON, Math.abs(dx) + Math.abs(dy));
	}

	function renderPixelStyle(ctx, width, height, config, time) {
		const rgba = new Uint8ClampedArray(width * height * 4);
		const monochrome = config.style === "mono";
		const lut = rampLut(config, 1024, monochrome);
		const random = createSeededRng(config.seed);
		const airData = [0.2 + random() * 0.6, 0.2 + random() * 0.6, 0.2 + random() * 0.6, 0.2 + random() * 0.6];
		const screen = getDitherScreen(config.ditherPattern);
		const ditherLow = lutColor(lut, 0);
		const ditherHigh = lutColor(lut, 1);
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let amount = fieldAmount(config.style === "dither" ? "linear" : config.style, (x + 0.5) / width, (y + 0.5) / height, config, time, airData);
				let rgb;
				if (config.style === "dither") {
					const sx = Math.floor(x / config.ditherScale) % screen.size;
					const sy = Math.floor(y / config.ditherScale) % screen.size;
					rgb = clamp01(amount) >= screen.values[sy][sx] ? ditherHigh : ditherLow;
				} else {
					rgb = lutColor(lut, amount);
				}
				const offset = (y * width + x) * 4;
				rgba[offset] = rgb[0];
				rgba[offset + 1] = rgb[1];
				rgba[offset + 2] = rgb[2];
				rgba[offset + 3] = 255;
			}
		}
		putRgba(ctx, width, height, rgba);
		return { data: rgba, height, style: config.style, width };
	}

	function polygon(ctx, points, fill) {
		ctx.beginPath();
		ctx.moveTo(points[0][0], points[0][1]);
		for (let index = 1; index < points.length; index++) ctx.lineTo(points[index][0], points[index][1]);
		ctx.closePath();
		ctx.fillStyle = fill;
		ctx.fill();
	}

	function squarePoints(cx, cy, size, radians) {
		const radius = size / Math.SQRT2;
		const points = [];
		for (let corner = 0; corner < 4; corner++) {
			const angle = radians + Math.PI / 4 + corner * Math.PI / 2;
			points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
		}
		return points;
	}

	/** Animated nested-square gradient; `cube` names the visual preset, not 3D. */
	function renderCube(ctx, width, height, config, time) {
		ctx.fillStyle = config.background;
		ctx.fillRect(0, 0, width, height);
		const layers = config.cubeLayers;
		const cx = config.centerX * width;
		const cy = config.centerY * height;
		const outerSize = Math.hypot(width, height) * 1.55 * config.cubeScale;
		const ratio = clamp(Math.pow(0.055, 1 / Math.max(1, layers - 1)) - config.cubeGap * 0.28, 0.48, 0.91);
		const phase = finiteNumber(time, 0) * config.cubeSpeed * 0.22 + config.angle * Math.PI / 180;
		for (let layer = 0; layer < layers; layer++) {
			const amount = layer / Math.max(1, layers - 1);
			const size = outerSize * Math.pow(ratio, layer);
			const rotation = phase + layer * (0.045 + config.cubeGap * 0.45);
			polygon(ctx, squarePoints(cx, cy, size, rotation), sampleRamp(config, amount, config.space));
		}
		return { cubeGap: config.cubeGap, height, layers, phase, ratio, style: "cube", width };
	}

	function renderPreview(ctx, width, height, input, time) {
		const dimensions = renderDimensions(width, height);
		const config = normalizeConfig(input);
		const clock = finiteNumber(time, 0);
		resetContext(ctx);
		if (config.style === "cube" && typeof ctx.beginPath === "function") return renderCube(ctx, dimensions[0], dimensions[1], config, clock);
		return renderPixelStyle(ctx, dimensions[0], dimensions[1], config, clock);
	}

	/** A selected-colour inspection plate on the configured contrast ground. */
	function renderColour(ctx, width, height, input) {
		const [w, h] = renderDimensions(width, height);
		const config = normalizeConfig(input);
		const stops = normaliseStops(config);
		resetContext(ctx);
		ctx.fillStyle = config.background;
		ctx.fillRect(0, 0, w, h);
		const margin = Math.max(12, Math.floor(Math.min(w, h) * 0.075));
		const stripHeight = Math.max(18, Math.floor(h * 0.12));
		const plateBottom = Math.max(margin + 1, h - stripHeight - margin * 1.5);
		ctx.fillStyle = config.color1;
		ctx.fillRect(margin, margin, Math.max(1, w - margin * 2), Math.max(1, plateBottom - margin));
		const stopWidth = w / stops.length;
		stops.forEach((stop, index) => {
			ctx.fillStyle = stop.color;
			ctx.fillRect(Math.floor(index * stopWidth), h - stripHeight, Math.ceil(stopWidth), stripHeight);
		});
		return {
			height: h,
			space: config.space,
			stops: stops.map((stop) => ({ ...stop, contrastOnInk: contrastRatio(stop.color, BRAND.ink), contrastOnPaper: contrastRatio(stop.color, BRAND.paper) })),
			width: w,
		};
	}

	function rotatePoint(point, yawDegrees, pitchDegrees) {
		const yaw = yawDegrees * Math.PI / 180;
		const pitch = pitchDegrees * Math.PI / 180;
		const cy = Math.cos(yaw);
		const sy = Math.sin(yaw);
		const cp = Math.cos(pitch);
		const sp = Math.sin(pitch);
		const x1 = point[0] * cy - point[1] * sy;
		const y1 = point[0] * sy + point[1] * cy;
		return [x1, y1 * cp - point[2] * sp, y1 * sp + point[2] * cp];
	}

	function viewSettings(input, view) {
		const config = normalizeConfig(input);
		const source = typeof view === "string" ? { space: view } : view && typeof view === "object" ? view : {};
		return {
			space: normalizedSpace(source.space || source.mode || config.space),
			yaw: modulo(finiteNumber(source.yaw, config.yaw) + 180, 360) - 180,
			pitch: clamp(finiteNumber(source.pitch, config.pitch), -89, 89),
			zoom: clamp(finiteNumber(source.zoom, config.zoom), 0.25, 4),
		};
	}

	/**
	 * Honest Canvas 2D projection of sampled OKLab points. Returned screen-space
	 * points and yaw/pitch values can be used directly for pointer-orbit wiring.
	 */
	function renderSpace(ctx, width, height, input, view) {
		const [w, h] = renderDimensions(width, height);
		const config = normalizeConfig(input);
		const camera = viewSettings(config, view);
		resetContext(ctx);
		ctx.fillStyle = config.background || BRAND.ink;
		ctx.fillRect(0, 0, w, h);
		const scale = Math.min(w, h) * 0.84 * camera.zoom;
		const project = (lab) => {
			const rotated = rotatePoint([lab[1], lab[2], (lab[0] - 0.5) * 0.72], camera.yaw, camera.pitch);
			return { x: w / 2 + rotated[0] * scale, y: h / 2 - rotated[1] * scale, depth: rotated[2] };
		};
		const axes = [
			{ from: [0, 0, -0.36], to: [0, 0, 0.36], color: BRAND.paper },
			{ from: [-0.32, 0, 0], to: [0.32, 0, 0], color: BRAND.signalRed },
			{ from: [0, -0.32, 0], to: [0, 0.32, 0], color: BRAND.cyan },
		];
		if (typeof ctx.beginPath === "function") {
			ctx.lineWidth = 1;
			for (const axis of axes) {
				const a = rotatePoint(axis.from, camera.yaw, camera.pitch);
				const b = rotatePoint(axis.to, camera.yaw, camera.pitch);
				ctx.beginPath();
				ctx.moveTo(w / 2 + a[0] * scale, h / 2 - a[1] * scale);
				ctx.lineTo(w / 2 + b[0] * scale, h / 2 - b[1] * scale);
				ctx.strokeStyle = axis.color;
				ctx.globalAlpha = 0.35;
				ctx.stroke();
			}
		}
		const points = [];
		const sampleCount = 96;
		for (let index = 0; index < sampleCount; index++) {
			const amount = index / (sampleCount - 1);
			const color = sampleRamp(config, amount, camera.space);
			const lab = srgbToOklab(color);
			const screen = project(lab);
			points.push({ ...screen, amount, color, lab, lch: oklabToOklch(lab) });
		}
		points.sort((a, b) => a.depth - b.depth);
		if (typeof ctx.beginPath === "function") {
			for (const point of points) {
				ctx.beginPath();
				ctx.arc(point.x, point.y, config.pointSize, 0, TAU);
				ctx.fillStyle = point.color;
				ctx.globalAlpha = 0.94;
				ctx.fill();
			}
		}
		ctx.globalAlpha = 1;
		return { axes: ["L", "a", "b"], height: h, pitch: camera.pitch, pointSize: config.pointSize, points, space: camera.space, width: w, yaw: camera.yaw, zoom: camera.zoom };
	}

	function escapeXml(value) {
		return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	}

	function sampledSvgStops(config, monochrome, count) {
		const total = count || 25;
		const monoLut = monochrome ? rampLut(config, total, true) : null;
		let output = "";
		for (let index = 0; index < total; index++) {
			const amount = index / (total - 1);
			const color = monoLut ? formatHex(lutColor(monoLut, amount)) : sampleRamp(config, amount, config.space);
			output += `<stop offset="${(amount * 100).toFixed(3)}%" stop-color="${escapeXml(color)}"/>`;
		}
		return output;
	}

	function svgCubeBody(width, height, config, time) {
		const layers = config.cubeLayers;
		const cx = config.centerX * width;
		const cy = config.centerY * height;
		const outerSize = Math.hypot(width, height) * 1.55 * config.cubeScale;
		const ratio = clamp(Math.pow(0.055, 1 / Math.max(1, layers - 1)) - config.cubeGap * 0.28, 0.48, 0.91);
		const phase = finiteNumber(time, 0) * config.cubeSpeed * 0.22 + config.angle * Math.PI / 180;
		let body = `<rect width="${width}" height="${height}" fill="${config.background}"/>`;
		for (let layer = 0; layer < layers; layer++) {
			const amount = layer / Math.max(1, layers - 1);
			const points = squarePoints(cx, cy, outerSize * Math.pow(ratio, layer), phase + layer * (0.045 + config.cubeGap * 0.45));
			body += `<polygon points="${points.map((point) => `${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(" ")}" fill="${sampleRamp(config, amount, config.space)}"/>`;
		}
		return body;
	}

	function toSVG(first, second, third, fourth) {
		let width;
		let height;
		let input;
		let time;
		if (typeof first === "number") {
			width = first;
			height = second;
			input = third;
			time = fourth;
		} else {
			input = first;
			width = second;
			height = third;
			time = fourth;
		}
		const dimensions = renderDimensions(width, height);
		const w = dimensions[0];
		const h = dimensions[1];
		const config = normalizeConfig(input);
		const header = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Chroma Atlas ${escapeXml(config.style)} gradient">`;
		let defs = "";
		let body = "";

		if (config.style === "cube") {
			body = svgCubeBody(w, h, config, time);
		} else if (config.style === "angular") {
			const cx = config.centerX * w;
			const cy = config.centerY * h;
			const radius = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.02;
			const slices = 120;
			for (let index = 0; index < slices; index++) {
				const a0 = (index / slices - config.angle / 360) * TAU;
				const a1 = ((index + 1.015) / slices - config.angle / 360) * TAU;
				const x0 = cx + Math.cos(a0) * radius;
				const y0 = cy + Math.sin(a0) * radius;
				const x1 = cx + Math.cos(a1) * radius;
				const y1 = cy + Math.sin(a1) * radius;
				body += `<path d="M${cx.toFixed(2)} ${cy.toFixed(2)}L${x0.toFixed(2)} ${y0.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}Z" fill="${sampleRamp(config, (index + 0.5) / slices, config.space)}"/>`;
			}
		} else if (config.style === "air") {
			const random = createSeededRng(config.seed);
			const clock = finiteNumber(time, 0) * config.speed * 0.08;
			const colors = [sampleRamp(config, 0.2), sampleRamp(config, 0.52), sampleRamp(config, 0.84)];
			body = `<rect width="${w}" height="${h}" fill="${sampleRamp(config, 0.42)}"/>`;
			for (let index = 0; index < 3; index++) {
				const cx = modulo(random() + clock * (index + 1) * 0.06, 1);
				const cy = modulo(random() - clock * (index + 1) * 0.04, 1);
				defs += `<radialGradient id="air${index}"><stop offset="0" stop-color="${colors[index]}" stop-opacity="${(0.72 + (1 - config.softness) * 0.24).toFixed(3)}"/><stop offset="${(config.softness * 55).toFixed(2)}%" stop-color="${colors[index]}" stop-opacity="0.42"/><stop offset="1" stop-color="${colors[index]}" stop-opacity="0"/></radialGradient>`;
				body += `<ellipse cx="${(cx * w).toFixed(2)}" cy="${(cy * h).toFixed(2)}" rx="${(w * 0.62 * config.airScale).toFixed(2)}" ry="${(h * 0.62 * config.airScale).toFixed(2)}" fill="url(#air${index})"/>`;
			}
		} else if (config.style === "dither") {
			const screen = getDitherScreen(config.ditherPattern);
			const cell = config.ditherScale;
			const low = sampleRamp(config, 0, config.space);
			const high = sampleRamp(config, 1, config.space);
			defs = `<pattern id="screen" width="${screen.size * cell}" height="${screen.size * cell}" patternUnits="userSpaceOnUse">`;
			for (let y = 0; y < screen.size; y++) {
				for (let x = 0; x < screen.size; x++) {
					defs += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${screen.values[y][x] <= 0.5 ? high : low}"/>`;
				}
			}
			defs += "</pattern>";
			body = `<rect width="${w}" height="${h}" fill="url(#screen)"/>`;
		} else if (config.style === "radial") {
			defs = `<radialGradient id="ramp" cx="${(config.centerX * 100).toFixed(3)}%" cy="${(config.centerY * 100).toFixed(3)}%" r="${(radialExtent(config) * 100).toFixed(3)}%">${sampledSvgStops(config, false)}</radialGradient>`;
			body = `<rect width="${w}" height="${h}" fill="url(#ramp)"/>`;
		} else {
			const radians = config.angle * Math.PI / 180;
			const cosine = Math.cos(radians);
			const sine = Math.sin(radians);
			const extent = (Math.abs(cosine) + Math.abs(sine)) * 50;
			const dx = cosine * extent;
			const dy = sine * extent;
			defs = `<linearGradient id="ramp" x1="${(50 - dx).toFixed(3)}%" y1="${(50 - dy).toFixed(3)}%" x2="${(50 + dx).toFixed(3)}%" y2="${(50 + dy).toFixed(3)}%">${sampledSvgStops(config, config.style === "mono")}</linearGradient>`;
			body = `<rect width="${w}" height="${h}" fill="url(#ramp)"/>`;
		}
		return `${header}${defs ? `<defs>${defs}</defs>` : ""}${body}</svg>`;
	}

	function encodeTIFF(width, height, source) {
		const [w, h] = renderDimensions(width, height);
		const data = source && source.data ? source.data : source;
		if (!data || typeof data.length !== "number") throw new TypeError("TIFF encoding needs RGB or RGBA pixels.");
		const pixelCount = w * h;
		const channels = data.length === pixelCount * 4 ? 4 : data.length === pixelCount * 3 ? 3 : 0;
		if (!channels) throw new RangeError("Pixel data size does not match TIFF dimensions.");
		const entryCount = 10;
		const ifdOffset = 8;
		const ifdSize = 2 + entryCount * 12 + 4;
		const bitsOffset = ifdOffset + ifdSize;
		const pixelOffset = bitsOffset + 6;
		const byteCount = pixelCount * 3;
		const output = new Uint8Array(pixelOffset + byteCount);
		const view = new DataView(output.buffer);
		output[0] = 0x49;
		output[1] = 0x49;
		view.setUint16(2, 42, true);
		view.setUint32(4, ifdOffset, true);
		view.setUint16(ifdOffset, entryCount, true);
		let entryOffset = ifdOffset + 2;
		function entry(tag, type, count, value) {
			view.setUint16(entryOffset, tag, true);
			view.setUint16(entryOffset + 2, type, true);
			view.setUint32(entryOffset + 4, count, true);
			if (type === 3 && count === 1) {
				view.setUint16(entryOffset + 8, value, true);
				view.setUint16(entryOffset + 10, 0, true);
			} else {
				view.setUint32(entryOffset + 8, value, true);
			}
			entryOffset += 12;
		}
		entry(256, 4, 1, w);
		entry(257, 4, 1, h);
		entry(258, 3, 3, bitsOffset);
		entry(259, 3, 1, 1);
		entry(262, 3, 1, 2);
		entry(273, 4, 1, pixelOffset);
		entry(277, 3, 1, 3);
		entry(278, 4, 1, h);
		entry(279, 4, 1, byteCount);
		entry(284, 3, 1, 1);
		view.setUint32(entryOffset, 0, true);
		view.setUint16(bitsOffset, 8, true);
		view.setUint16(bitsOffset + 2, 8, true);
		view.setUint16(bitsOffset + 4, 8, true);
		let target = pixelOffset;
		for (let pixel = 0; pixel < pixelCount; pixel++) {
			const offset = pixel * channels;
			output[target++] = data[offset];
			output[target++] = data[offset + 1];
			output[target++] = data[offset + 2];
		}
		return output;
	}

	function cssStopList(config, monochrome) {
		const count = config.space === "srgb" && !monochrome ? 9 : 25;
		const lut = monochrome ? rampLut(config, count, true) : null;
		const stops = [];
		for (let index = 0; index < count; index++) {
			const amount = index / (count - 1);
			const color = lut ? formatHex(lutColor(lut, amount)) : sampleRamp(config, amount, config.space);
			stops.push(`${color} ${(amount * 100).toFixed(3)}%`);
		}
		return stops.join(", ");
	}

	function cssAuthoredStopList(config) {
		return normaliseStops(config)
			.map((stop) => `${stop.color} ${(stop.position * 100).toFixed(3)}%`)
			.join(", ");
	}

	function cssInterpolationSpace(space) {
		if (space === "linear-srgb") return "srgb-linear";
		if (space === "oklab" || space === "oklch") return space;
		return "";
	}

	function cssConicFrom(angle) {
		return modulo(90 - angle, 360);
	}

	function radialExtent(config) {
		const farthestX = Math.max(config.centerX, 1 - config.centerX);
		const farthestY = Math.max(config.centerY, 1 - config.centerY);
		return Math.sqrt(farthestX * farthestX + farthestY * farthestY) * config.radius;
	}

	function cssRadialGeometry(config) {
		const extent = (radialExtent(config) * 100).toFixed(3);
		return `ellipse ${extent}% ${extent}% at ${(config.centerX * 100).toFixed(3)}% ${(config.centerY * 100).toFixed(3)}%`;
	}

	function serializeCSS(input) {
		const config = normalizeConfig(input);
		const stops = cssStopList(config, config.style === "mono");
		let background;
		let modernBackground = "";
		if (config.style === "radial") {
			background = `radial-gradient(${cssRadialGeometry(config)}, ${stops})`;
		} else if (config.style === "angular") {
			background = `conic-gradient(from ${cssConicFrom(config.angle).toFixed(3)}deg at ${(config.centerX * 100).toFixed(3)}% ${(config.centerY * 100).toFixed(3)}%, ${stops})`;
		} else if (config.style === "air") {
			background = `radial-gradient(circle at 22% 28%, ${sampleRamp(config, 0.18)} 0%, transparent 62%), radial-gradient(circle at 78% 34%, ${sampleRamp(config, 0.82)} 0%, transparent 58%), linear-gradient(${(config.angle + 90).toFixed(3)}deg, ${stops})`;
		} else if (config.style === "dither") {
			background = `repeating-conic-gradient(${sampleRamp(config, 0)} 0 25%, ${sampleRamp(config, 1)} 0 50%) 0 0 / ${config.ditherScale * 2}px ${config.ditherScale * 2}px`;
		} else {
			background = `linear-gradient(${(config.angle + 90).toFixed(3)}deg, ${stops})`;
		}
		const interpolation = cssInterpolationSpace(config.space);
		if (interpolation && ["linear", "radial", "angular"].includes(config.style)) {
			const authoredStops = cssAuthoredStopList(config);
			if (config.style === "radial") {
				modernBackground = `radial-gradient(${cssRadialGeometry(config)} in ${interpolation}, ${authoredStops})`;
			} else if (config.style === "angular") {
				modernBackground = `conic-gradient(from ${cssConicFrom(config.angle).toFixed(3)}deg at ${(config.centerX * 100).toFixed(3)}% ${(config.centerY * 100).toFixed(3)}% in ${interpolation}, ${authoredStops})`;
			} else {
				modernBackground = `linear-gradient(${(config.angle + 90).toFixed(3)}deg in ${interpolation}, ${authoredStops})`;
			}
		}
		const approximationNotes = {
			radial: "radial uses sampled colour stops; browser rasterization may differ from the canvas-authoritative render",
			air: "air is a static CSS approximation; seed, scale, softness, and motion remain canvas-only",
			cube: "cube is a linear-ramp approximation; layers, gap, focus, and motion remain canvas-only",
			dither: "dither is a checker approximation; the selected screen and angle remain canvas-only",
		};
		const approximation = approximationNotes[config.style] ? `/* ${approximationNotes[config.style]}. */\n` : "";
		return `${approximation}.chroma-atlas {\n  --chroma-atlas-space: ${config.space};\n  background: ${background};${modernBackground ? `\n  background: ${modernBackground};` : ""}\n}`;
	}

	function canonicalConfig(input) {
		const config = normalizeConfig(input);
		return {
			mode: config.mode,
			style: config.style,
			interpolation: config.space,
			palette: config.palette,
			color1: config.color1,
			color2: config.color2,
			color3: config.color3,
			color4: config.color4,
			position1: config.position1,
			position2: config.position2,
			position3: config.position3,
			position4: config.position4,
			stopCount: config.stopCount,
			angle: config.angle,
			focusX: config.centerX,
			focusY: config.centerY,
			softness: config.softness,
			airScale: config.airScale,
			cubeLayers: config.cubeLayers,
			cubeGap: config.cubeGap,
			seed: config.seed,
			speed: config.speed,
			ditherPattern: config.ditherPattern,
			ditherScale: config.ditherScale,
			monoRange: config.monoRange,
			imageColorCount: config.imageColorCount,
			spaceYaw: config.yaw,
			spacePitch: config.pitch,
			pointSize: config.pointSize,
			background: config.background,
			exportFormat: config.exportFormat,
			exportWidth: config.exportWidth,
			exportHeight: config.exportHeight,
			jpegQuality: config.jpegQuality,
		};
	}

	function serializeJSON(input) {
		return JSON.stringify(canonicalConfig(input), null, 2);
	}

	function serializePreset(input) {
		return JSON.stringify({
			type: "supermega.chroma-atlas.preset",
			version: VERSION,
			configuration: canonicalConfig(input),
		}, null, 2);
	}

	global.ChromaAtlasEngine = Object.freeze({
		VERSION,
		MAX_IMAGE_BYTES,
		MAX_IMAGE_PIXELS,
		IMAGE_MIME_TYPES,
		BRAND,
		BRAND_ORDER,
		DEFAULT_CONFIG,
		DITHER_PATTERNS,
		DITHER_SCREENS,
		SPACES,
		STYLES,
		canonicalConfig,
		contrastRatio,
		createSeededRng,
		encodeTIFF,
		encodeTiff: encodeTIFF,
		extractPalette,
		formatHex,
		generatePalette,
		getDitherScreen,
		getDitherThreshold,
		hashSeed,
		inspectStaticImage,
		hexToSrgb: parseHex,
		interpolateColor,
		interpolateLinearSrgb,
		interpolateOklab,
		interpolateOklch,
		interpolateSrgb,
		linearChannelToSrgb,
		linearRgbToOklab,
		linearToSrgb,
		normaliseConfig: normalizeConfig,
		normaliseStops,
		normalizeConfig,
		normalizeStops: normaliseStops,
		oklabToLinearRgb,
		oklabToOklch,
		oklabToSrgb,
		oklchToOklab,
		parseHex,
		relativeLuminance,
		renderColour,
		renderPreview,
		renderSpace,
		sampleRamp,
		sampleRampRgb,
		serializeCSS,
		serializeJSON,
		serializePreset,
		srgbChannelToLinear,
		srgbToHex: formatHex,
		srgbToLinear,
		srgbToOklab,
		toSVG,
	});
})(typeof window === "undefined" ? globalThis : window);
