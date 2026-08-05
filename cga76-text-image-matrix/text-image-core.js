(function textImageMatrixCore(global) {
	"use strict";

	const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
	const MAX_IMAGE_PIXELS = 20_000_000;
	const MIME_TYPES = Object.freeze(["image/png", "image/jpeg", "image/webp"]);
	const BITMAP_GLYPHS = Object.freeze({
		"!": "04/04/04/04/04/00/04", "\"": "0a/0a/00/00/00/00/00", "'": "04/04/00/00/00/00/00", "(": "02/04/08/08/08/04/02", ")": "08/04/02/02/02/04/08", ",": "00/00/00/00/00/04/08", "-": "00/00/00/1f/00/00/00", ".": "00/00/00/00/00/00/04", "/": "01/02/04/08/10/00/00", ":": "00/04/00/00/04/00/00", ";": "00/04/00/00/04/04/08", "?": "0e/11/01/02/04/00/04", "_": "00/00/00/00/00/00/1f",
		"0": "0e/11/13/15/19/11/0e", "1": "04/0c/04/04/04/04/0e", "2": "0e/11/01/02/04/08/1f", "3": "1e/01/01/0e/01/01/1e", "4": "02/06/0a/12/1f/02/02", "5": "1f/10/10/1e/01/01/1e", "6": "0e/10/10/1e/11/11/0e", "7": "1f/01/02/04/08/08/08", "8": "0e/11/11/0e/11/11/0e", "9": "0e/11/11/0f/01/01/0e",
		A: "0e/11/11/1f/11/11/11", B: "1e/11/11/1e/11/11/1e", C: "0e/11/10/10/10/11/0e", D: "1e/11/11/11/11/11/1e", E: "1f/10/10/1e/10/10/1f", F: "1f/10/10/1e/10/10/10", G: "0e/11/10/17/11/11/0f", H: "11/11/11/1f/11/11/11", I: "0e/04/04/04/04/04/0e", J: "07/02/02/02/02/12/0c", K: "11/12/14/18/14/12/11", L: "10/10/10/10/10/10/1f", M: "11/1b/15/15/11/11/11", N: "11/19/15/13/11/11/11", O: "0e/11/11/11/11/11/0e", P: "1e/11/11/1e/10/10/10", Q: "0e/11/11/11/15/12/0d", R: "1e/11/11/1e/14/12/11", S: "0f/10/10/0e/01/01/1e", T: "1f/04/04/04/04/04/04", U: "11/11/11/11/11/11/0e", V: "11/11/11/11/11/0a/04", W: "11/11/11/15/15/15/0a", X: "11/11/0a/04/0a/11/11", Y: "11/11/0a/04/04/04/04", Z: "1f/01/02/04/08/10/1f",
	});

	function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }
	function stableStringify(value) { if (Array.isArray(value) || ArrayBuffer.isView(value)) return `[${Array.from(value, stableStringify).join(",")}]`; if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`; return JSON.stringify(value); }
	function geometryHash(value) { const source = stableStringify(value); let hash = 2166136261; for (let index = 0; index < source.length; index += 1) { hash ^= source.charCodeAt(index); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(16).padStart(8, "0"); }

	function fixedColumnLayout(value, columns, rows) {
		const width = Math.max(1, Math.min(160, Math.round(Number(columns) || 1))); const height = Math.max(1, Math.min(120, Math.round(Number(rows) || 1)));
		const clean = String(value || "").replace(/\s+/gu, " ").trim() || "TEXT"; const words = clean.split(" "); let wordIndex = 0; let remainder = ""; const lines = [];
		while (lines.length < height) {
			let line = "";
			while (line.length < width) {
				let word = remainder || words[wordIndex % words.length];
				if (!remainder) wordIndex += 1;
				if (word.length > width) {
					if (line) { wordIndex -= 1; break; }
					line = word.slice(0, width); remainder = word.slice(width); break;
				}
				remainder = "";
				if (!line) { line = word; continue; }
				if (line.length + 1 + word.length <= width) { line += ` ${word}`; continue; }
				wordIndex -= 1; break;
			}
			lines.push(line.padEnd(width, " ").slice(0, width));
		}
		return { cells: lines.join("").split(""), columns: width, lines, rows: height };
	}

	function toneAlpha(luminance, configuration) {
		const contrast = Math.max(0.01, Number(configuration.contrast) || 1); const threshold = clamp(Number(configuration.threshold) || 0, 0, 1); const gamma = Math.max(0.01, Number(configuration.gamma) || 1);
		let value = clamp((clamp(Number(luminance) || 0, 0, 1) - threshold) * contrast + 0.5, 0, 1); value = value ** (1 / gamma); if (configuration.invert) value = 1 - value; return value;
	}

	function proceduralLuminance(u, v, mode) {
		const x = clamp(Number(u) || 0, 0, 1); const y = clamp(Number(v) || 0, 0, 1);
		if (mode === "waves") return clamp(0.5 + Math.sin(x * 18 + Math.sin(y * 7) * 3) * 0.28 + Math.cos(y * 13) * 0.18, 0, 1);
		if (mode === "fold") { const ridge = Math.abs(Math.sin((x + y * 0.36) * Math.PI * 5)); const aperture = Math.max(0, 1 - Math.hypot(x - 0.54, (y - 0.48) * 0.8) * 1.5); return clamp(aperture * 0.72 + ridge * 0.28, 0, 1); }
		const outer = Math.max(0, 1 - Math.hypot((x - 0.5) * 1.12, y - 0.48) * 1.55); const left = Math.max(0, 1 - Math.hypot((x - 0.34) * 1.7, (y - 0.43) * 1.3) * 2.6); const right = Math.max(0, 1 - Math.hypot((x - 0.67) * 1.7, (y - 0.43) * 1.3) * 2.6); const lower = Math.max(0, 1 - Math.hypot(x - 0.5, (y - 0.67) * 1.45) * 3.2); return clamp(outer * 0.82 - left * 0.45 - right * 0.45 + lower * 0.26 + Math.sin((x + y) * 22) * 0.04, 0, 1);
	}

	function bitmapRows(character) {
		const upper = Array.from(String(character).toUpperCase())[0] || "?"; const encoded = BITMAP_GLYPHS[upper]; if (encoded) return encoded.split("/").map((row) => Number.parseInt(row, 16));
		const code = String(character).codePointAt(0) || 63; return [31, 17, 17 | ((code >>> 0) & 14), 17 | ((code >>> 3) & 14), 17 | ((code >>> 6) & 14), 17, 31];
	}

	function drawBitmapGlyph(ctx, character, centerX, centerY, cellWidth, cellHeight, scale, color, alpha) {
		const rows = bitmapRows(character); const unit = Math.max(0.6, Math.min(cellWidth / 6, cellHeight / 8) * scale); const width = unit * 5; const height = unit * 7; const left = Math.round(centerX - width / 2); const top = Math.round(centerY - height / 2); const dot = Math.max(1, Math.round(unit * 0.82));
		ctx.fillStyle = `rgba(${color},${Number(alpha.toFixed(4))})`;
		for (let row = 0; row < 7; row += 1) for (let column = 0; column < 5; column += 1) if (rows[row] & (1 << (4 - column))) ctx.fillRect(Math.round(left + column * unit), Math.round(top + row * unit), dot, dot);
	}

	function contentRectangle(width, height, insets) {
		const bounded = (value, maximum) => Math.max(0, Math.min(maximum, Number(value) || 0));
		const left = bounded(insets?.left, width * 0.45); const right = bounded(insets?.right, width * 0.45); const top = bounded(insets?.top, height * 0.45); const bottom = bounded(insets?.bottom, height * 0.45);
		return { bottom: height - bottom, height: Math.max(1, height - top - bottom), left, right: width - right, top, width: Math.max(1, width - left - right) };
	}

	function displayWindow(layout, content, configuration, detail) {
		if (!detail) return { columnCount: layout.columns, columnStart: 0, rowCount: layout.rows, rowStart: 0 };
		const columnCount = Math.min(layout.columns, Math.max(16, Math.floor(Math.max(1, content.width - 20) / 9)));
		const rowCount = Math.min(layout.rows, Math.max(12, Math.floor(Math.max(1, content.height - 12) / 9)));
		const columnStart = Math.round((layout.columns - columnCount) * clamp(configuration.cropX, 0, 1));
		const rowStart = Math.round((layout.rows - rowCount) * clamp(configuration.cropY, 0, 1));
		return { columnCount, columnStart, rowCount, rowStart };
	}

	function crc32(bytes) { let crc = 0xffffffff; for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; }
	function ascii(bytes, offset, length) { let value = ""; for (let index = 0; index < length; index += 1) value += String.fromCharCode(bytes[offset + index]); return value; }
	function dimensions(width, height, mime) { if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new Error("Image dimensions are corrupt."); const pixels = width * height; if (!Number.isSafeInteger(pixels) || pixels > MAX_IMAGE_PIXELS) throw new Error("Images may not exceed 20 megapixels."); return { height, mime, pixels, width }; }

	function inspectPng(bytes) {
		const signature = [137, 80, 78, 71, 13, 10, 26, 10]; if (bytes.length < 33 || signature.some((value, index) => bytes[index] !== value)) return null;
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); let offset = 8; let width = 0; let height = 0; let ihdr = false; let idat = false; let ended = false;
		while (offset + 12 <= bytes.length) {
			const length = view.getUint32(offset); if (length > bytes.length - offset - 12) throw new Error("PNG chunk bounds are corrupt."); const type = ascii(bytes, offset + 4, 4); const dataEnd = offset + 8 + length; const expected = view.getUint32(dataEnd); const actual = crc32(bytes.subarray(offset + 4, dataEnd)); if (expected !== actual) throw new Error("PNG CRC is corrupt.");
			if (!ihdr && type !== "IHDR") throw new Error("PNG must begin with IHDR.");
			if (type === "IHDR") { if (ihdr || length !== 13) throw new Error("PNG IHDR is corrupt."); width = view.getUint32(offset + 8); height = view.getUint32(offset + 12); if (bytes[offset + 18] !== 0 || bytes[offset + 19] !== 0) throw new Error("PNG compression or filtering is unsupported."); ihdr = true; }
			if (type === "acTL" || type === "fcTL" || type === "fdAT") throw new Error("Animated PNG input is not accepted.");
			if (type === "IDAT") idat = true;
			if (type === "IEND") { if (length !== 0) throw new Error("PNG IEND is corrupt."); ended = true; offset = dataEnd + 4; break; }
			offset = dataEnd + 4;
		}
		if (!ihdr || !idat || !ended || offset !== bytes.length) throw new Error("PNG structure is incomplete or corrupt."); return dimensions(width, height, "image/png");
	}

	function inspectJpeg(bytes) {
		if (bytes.length < 12 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null; if (bytes.at(-2) !== 0xff || bytes.at(-1) !== 0xd9) throw new Error("JPEG end marker is missing or corrupt.");
		let offset = 2; let width = 0; let height = 0; const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); const frames = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
		while (offset + 3 < bytes.length - 2) {
			if (bytes[offset] !== 0xff) { offset += 1; continue; } while (bytes[offset] === 0xff) offset += 1; const marker = bytes[offset++]; if (marker === 0xd9 || marker === 0xda) break; if (marker >= 0xd0 && marker <= 0xd7) continue; if (offset + 2 > bytes.length) throw new Error("JPEG segment is corrupt."); const length = view.getUint16(offset); if (length < 2 || offset + length > bytes.length) throw new Error("JPEG segment bounds are corrupt."); if (frames.has(marker)) { if (length < 7) throw new Error("JPEG frame is corrupt."); height = view.getUint16(offset + 3); width = view.getUint16(offset + 5); } offset += length;
		}
		if (!width || !height) throw new Error("JPEG dimensions are missing or corrupt."); return dimensions(width, height, "image/jpeg");
	}

	function inspectWebp(bytes) {
		if (bytes.length < 30 || ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") return null; const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); if (view.getUint32(4, true) + 8 !== bytes.length) throw new Error("WebP RIFF bounds are corrupt."); let offset = 12; let width = 0; let height = 0; let found = false;
		while (offset + 8 <= bytes.length) { const type = ascii(bytes, offset, 4); const length = view.getUint32(offset + 4, true); const data = offset + 8; if (data + length > bytes.length) throw new Error("WebP chunk bounds are corrupt."); if (type === "ANIM" || type === "ANMF") throw new Error("Animated WebP input is not accepted."); if (type === "VP8X") { if (length !== 10) throw new Error("WebP VP8X is corrupt."); if (bytes[data] & 2) throw new Error("Animated WebP input is not accepted."); width = 1 + bytes[data + 4] + bytes[data + 5] * 256 + bytes[data + 6] * 65536; height = 1 + bytes[data + 7] + bytes[data + 8] * 256 + bytes[data + 9] * 65536; found = true; } else if (type === "VP8 " && length >= 10 && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a) { width = view.getUint16(data + 6, true) & 0x3fff; height = view.getUint16(data + 8, true) & 0x3fff; found = true; } else if (type === "VP8L" && length >= 5 && bytes[data] === 0x2f) { const bits = view.getUint32(data + 1, true); width = (bits & 0x3fff) + 1; height = ((bits >>> 14) & 0x3fff) + 1; found = true; } offset = data + length + (length % 2); }
		if (!found || offset !== bytes.length) throw new Error("WebP dimensions are missing or corrupt."); return dimensions(width, height, "image/webp");
	}

	function inspectStaticImage(input, declaredType) {
		const bytes = input instanceof Uint8Array ? input : new Uint8Array(input); const type = declaredType === "image/jpg" ? "image/jpeg" : declaredType; if (!MIME_TYPES.includes(type)) throw new Error("Choose a static PNG, JPEG, or WebP image."); const metadata = inspectPng(bytes) || inspectJpeg(bytes) || inspectWebp(bytes); if (!metadata) throw new Error("Image magic bytes are not PNG, JPEG, or WebP."); if (metadata.mime !== type) throw new Error("Image content does not match its declared type."); return metadata;
	}

	function createImageResourceManager(dependencies) {
		if (!dependencies || typeof dependencies.createObjectURL !== "function" || typeof dependencies.revokeObjectURL !== "function" || typeof dependencies.decode !== "function") throw new TypeError("Image resource manager dependencies are incomplete.");
		let generation = 0; let current = null; let destroyed = false;
		function close(entry) { try { entry?.resource?.close?.(); } catch { /* resource cleanup is best effort */ } }
		async function load(file) {
			const token = ++generation; if (destroyed) return { error: "Image loader is closed.", ok: false }; if (!file || typeof file.arrayBuffer !== "function") return { error: "Choose a local image file.", ok: false }; if (!Number.isFinite(file.size) || file.size < 1 || file.size > MAX_IMAGE_BYTES) return { error: "Images may not exceed 20 MB.", ok: false }; const declaredType = file.type === "image/jpg" ? "image/jpeg" : file.type; if (!MIME_TYPES.includes(declaredType)) return { error: "Choose a static PNG, JPEG, or WebP image.", ok: false };
			let url = null; let resource = null; let committed = false;
			try {
				const buffer = await file.arrayBuffer(); if (token !== generation) return { ok: false, stale: true }; if (buffer.byteLength !== file.size) throw new Error("Image bytes are incomplete."); const metadata = inspectStaticImage(new Uint8Array(buffer), declaredType); url = dependencies.createObjectURL(file); resource = await dependencies.decode(file, url, metadata); if (token !== generation || destroyed) { close({ resource }); return { ok: false, stale: true }; } if (!resource || resource.width !== metadata.width || resource.height !== metadata.height || typeof resource.close !== "function") throw new Error("Decoded image dimensions do not match its validated header."); const previous = current; current = { metadata, resource }; committed = true; close(previous); return { metadata, ok: true };
			} catch (error) { if (resource && !committed) close({ resource }); return { error: error instanceof Error ? error.message : "Image could not be decoded.", ok: false }; }
			finally { if (url !== null) dependencies.revokeObjectURL(url); }
		}
		function clear() { generation += 1; const previous = current; current = null; close(previous); return { artworkLoaded: false, discardedArtwork: Boolean(previous) }; }
		return Object.freeze({ clear, destroy() { if (destroyed) return; destroyed = true; clear(); }, getCurrent: () => current, load });
	}

	function sampleLuminance(source, u, v, configuration) {
		const zoom = Math.max(1, Number(configuration.cropZoom) || 1); const centerX = clamp(Number(configuration.cropX) || 0.5, 0, 1); const centerY = clamp(Number(configuration.cropY) || 0.5, 0, 1); const x = clamp(centerX + (u - 0.5) / zoom, 0, 1); const y = clamp(centerY + (v - 0.5) / zoom, 0, 1);
		if (!source || !source.data || !source.width || !source.height) return proceduralLuminance(x, y, configuration.procedural); const px = Math.min(source.width - 1, Math.max(0, Math.round(x * (source.width - 1)))); const py = Math.min(source.height - 1, Math.max(0, Math.round(y * (source.height - 1)))); return source.data[py * source.width + px] ?? 0;
	}

	function paint(ctx, configuration, source, options) {
		const width = options.width; const height = options.height; const layout = fixedColumnLayout(configuration.text, configuration.columns, configuration.rows); const colors = configuration.palette === "supermega" ? { ground: "#09090b", glyphs: ["246,21,21", "241,234,223", "108,54,255"] } : configuration.palette === "amber" ? { ground: "#130f08", glyphs: ["255,175,43", "255,224,159", "255,247,218"] } : { ground: "#070708", glyphs: ["239,236,225", "239,236,225", "255,255,255"] };
		if (typeof ctx.reset === "function") ctx.reset(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.filter = "none"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.beginPath(); ctx.clearRect(0, 0, width, height); ctx.fillStyle = colors.ground; ctx.fillRect(0, 0, width, height);
		const content = contentRectangle(width, height, options.insets); const marginX = Math.round(content.width * (options.detail ? 0.025 : 0.045)); const marginY = Math.round(content.height * (options.detail ? 0.025 : 0.045)); const visible = displayWindow(layout, { height: content.height - marginY * 2, width: content.width - marginX * 2 }, configuration, options.detail === true); const cellWidth = (content.width - marginX * 2) / visible.columnCount; const cellHeight = (content.height - marginY * 2) / visible.rowCount; const glyphScale = options.detail ? Math.max(0.95, configuration.glyphScale) : configuration.glyphScale;
		for (let localRow = 0; localRow < visible.rowCount; localRow += 1) for (let localColumn = 0; localColumn < visible.columnCount; localColumn += 1) { const row = visible.rowStart + localRow; const column = visible.columnStart + localColumn; const character = layout.cells[row * layout.columns + column]; if (character === " ") continue; const luminance = sampleLuminance(source, (column + 0.5) / layout.columns, (row + 0.5) / layout.rows, configuration); const tone = toneAlpha(luminance, configuration); if (tone < 0.025) continue; const color = colors.glyphs[Math.min(2, Math.floor(tone * 3))]; drawBitmapGlyph(ctx, character, Math.round(content.left + marginX + (localColumn + 0.5) * cellWidth), Math.round(content.top + marginY + (localRow + 0.5) * cellHeight), cellWidth, cellHeight, glyphScale, color, 0.1 + tone * 0.9); }
		return { detail: options.detail === true, hash: geometryHash({ configuration, layout, source: source ? [source.width, source.height, source.hash ?? geometryHash(source.data)] : null }), sourceKind: source ? "local" : "procedural", visible };
	}

	global.CGA76_TEXT_IMAGE_CORE = Object.freeze({ MAX_IMAGE_BYTES, MAX_IMAGE_PIXELS, MIME_TYPES, bitmapRows, contentRectangle, createImageResourceManager, displayWindow, fixedColumnLayout, geometryHash, inspectStaticImage, paint, proceduralLuminance, sampleLuminance, toneAlpha });
})(typeof window === "undefined" ? globalThis : window);
