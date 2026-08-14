---
type: note
status: active
owner: markiian
created: 2026-08-14
updated: 2026-08-14
tags: []
summary: Product dossier for Chroma Atlas, a clean-room SUPERMEGA colour and gradient instrument with perceptual interpolation, image palette extraction, ordered dithering, honest colour-space projection, local collections, and multi-format export.
---

# Chroma Atlas

- **Prompt (verbatim):** “Now reengineer this as a part of our supermega design tools - from first principles. All tools - for us”
- **Date:** 2026-08-14
- **Route:** `/chroma-atlas/`

## Blind-Spot Pass

- **Value model:** one versioned configuration owns the active workspace, gradient construction, renderer-specific values, spatial view, and export envelope. Imported pixels and locally saved collections remain page-owned because they are not portable configuration.
- **Product kind:** a deterministic Canvas 2D visual artifact plus CSS, SVG, and JSON text artifacts.
- **Canvas size or text artifact language/file name:** preview fits the work station; export defaults to 1,600 × 1,000 and supports 64–4,096 px per side. Uncompressed TIFF has an additional eight-megapixel cap because its render and encoded bytes coexist in browser memory. Text outputs use `.css`, `.svg`, and `.json`.
- **Source upload needed:** optional. Gradient, Colour, Space, and Library start without a source; Image validates a local static PNG, JPEG, or WebP’s signature, structure, MIME type, and dimensions before decode, caps it at 20 MB and 20 megapixels, and never uploads it.
- **Renderer workload:** sampled perceptual ramps, low-resolution air fields, nested-square animation, ordered threshold screens, deterministic OKLab clustering, and Canvas 2D spatial projection.
- **Export:** PNG, JPEG, baseline uncompressed RGB TIFF, sampled-stop SVG, CSS with fallback, and versioned JSON.
- **Control ranges:** bounded by the adapter schema; stop endpoints stay fixed at zero and one, with two interior positions kept monotonic.
- **Delivery profile:** user-facing Portable classic plus a real typed bridge for configuration, named collection loading, state copy, reset, randomization, time control, station visibility, and artifact creation. Image intake and the device-local library remain deliberate human-local features; image-derived bridge export needs single-use in-frame consent.

## Assumptions Register

| Assumption | Default chosen | How to override |
|---|---|---|
| “All tools” means capability parity, not copied branding or data | One tool covers gradients, colour inspection, image extraction, curated collections, favourites, dithering, animated stacks, blurred fields, spatial inspection, and every promised export family | Add a new workspace only when it has a distinct primary loop |
| The reference’s “Munsell 3D” claim is not a reliable technical spec | Plot samples from the authored ramp on explicit Cartesian OKLab L/a/b axes; keep interpolation and projection labels separate | Introduce a separately sourced and tested Munsell conversion module |
| Historical Japanese colour values are content, not a rendering primitive | Ship six original SUPERMEGA collections and a user library; copy no Nuevo palette or dataset | Add an isolated, attributed, license-compatible dataset after editorial review |
| Browser-only portability matters | Plain HTML, CSS, and classic JavaScript; no dependencies or server | Promote to hand-composed React only if document history, remote persistence, or richer agent operations become product requirements |
| Exports should describe the same authored state | One renderer/configuration feeds preview, raster, SVG, CSS, JSON, and TIFF | Add a per-format setting only when the format genuinely requires it |

## Decision Trail

| Need | Chosen control / technique | Alternatives rejected (why) |
|---|---|---|
| Switch major work contexts | `InstrumentTabs` for Gradient, Colour, Image, Space, and Library | A single long inspector hides that these are peer workflows |
| Choose one of seven render treatments | `InstrumentSelect` | Seven segments are too many for a visible short set |
| Author two to four colours | Fixed-slot `InstrumentGradientField` + `InstrumentColorField` rows | A route-local draggable stop editor duplicates a public component and creates a missing-control decision |
| Supply an image | `InstrumentFileDrop` markup with local decode, validation, and remove | A filename field cannot own pixels or failure states |
| Inspect a ramp in perceptual space | Canvas 2D projection of the current ramp on OKLab axes, with drag plus yaw/pitch ranges | A full gamut viewer is a separate product; “Munsell” would overclaim the math |
| Preserve favourites | Device-local `localStorage` snapshots with backup/restore; session memory when an embedded sandbox denies storage | Remote accounts and sync are outside a static lab tool |
| Obtain results | One create-artifact boundary, followed by a visible download gesture | A bridge action that secretly clicks an anchor violates the artifact contract |
| Interpolate colours | sRGB, linear-sRGB, OKLab, and OKLCH in the owned renderer | Letting the browser interpolate would make exports disagree by browser and format |
| Dither | Six deterministic ordered screens, including recursive Bayer 2/4/8 | Random noise changes between runs and loses document-anchored reproducibility |
| Extract palettes | Bounded deterministic k-means in OKLab over browser-decoded pixels | Server processing would leak local images and break `file://` |

## Deviations

- No Nuevo code, bundle, palette, copy, asset, API, or authentication mechanism is used.
- “Traditional” becomes **Studio collections**: an original SUPERMEGA preset set plus user-saved work. The rendering capability survives; unlicensed or ambiguous historical data does not ship.
- “Munsell 3D” becomes **Space**: the current ramp sampled in the chosen interpolation space and plotted on honest OKLab L/a/b axes. It is neither a full gamut model nor a Munsell conversion.
- TIFF v1 is baseline, uncompressed, eight-bit RGB. It deliberately does not claim ICC preservation, 16-bit channels, or BigTIFF.
- SVG preserves linear, radial, and mono ramps through sampled sRGB stops. Canvas-only treatments and non-gradient workspaces embed the authoritative PNG render inside the SVG envelope because SVG 2 has no native conic gradient or ordered-dither primitive.

## Explainer

- **From prompt to assumptions:** the screenshot and public product pages supplied the feature inventory. No proprietary bundle or authenticated implementation was obtained. The rebuild treats public behavior as the brief and rejects copied implementation, marketing names, and ambiguous datasets.
- **Schema mapping:** Workspace owns the five primary loops. Gradient owns style, interpolation, stops, geometry, treatment-specific parameters, and motion. Image owns local intake and extraction count. Space owns view angles and point size. Output owns dimensions, format, and JPEG quality. The page-owned library stores the same normalized configuration envelope.
- **Renderer approach:** a pure classic-script engine performs colour conversion, ramp sampling, rendering, extraction, spatial projection, and serialization. Canvas 2D is the portable fallback and the export authority. Every stochastic result comes from the serialized seed.
- **Proof evidence:** engine arithmetic and encoders have focused Node tests; the adapter proves schema normalization, partial updates, capability accuracy, round-trip serialization, and action routing. The lab checker, full lab suite, consumer checker, HTTP browser review, responsive/material states, and screenshot review are the release gates. Any undriven visual interaction remains stated in `NOTES.md`.
- **Command boundary:** `window.CHROMA_ATLAS_ADAPTER` is an executable configuration/state surface, and the iframe bridge exposes the canonical capability subset, including named Studio collections and artifact overrides. Visible downloads are not bridge commands. File selection, clipboard permission, and device-local collection management require in-frame user actions. A local-image artifact also requires fresh one-shot consent inside the frame.
