/* SUPERMEGA Instrument 0.1.0-1ff60f2032a6 */
var SUPERMEGA_INSTRUMENT = (function() {
  "use strict";
  const INSTRUMENT_CAPABILITIES = [
    "discover",
    "filter",
    "set-filters",
    "clear-filters",
    "inspect",
    "open",
    "canonical-link",
    "configure",
    "reset-configuration",
    "clear-renderer",
    "reseed-renderer",
    "randomize",
    "pause",
    "resume",
    "show-controls",
    "hide-controls",
    "create-artifact",
    "download",
    "copy-config",
    "debug"
  ];
  const capabilitySet = new Set(INSTRUMENT_CAPABILITIES);
  const humanGatedCapabilities = /* @__PURE__ */ new Set(["download"]);
  function isInstrumentCapability(value) {
    return typeof value === "string" && capabilitySet.has(value);
  }
  function sanitizeCapabilities(values) {
    return [...new Set(values.filter(isInstrumentCapability))];
  }
  function createCapabilityEvidence(input) {
    var _a, _b, _c;
    return {
      declaredCapabilities: sanitizeCapabilities((_a = input == null ? void 0 : input.declared) != null ? _a : []),
      proofedAdapterCapabilities: sanitizeCapabilities((_b = input == null ? void 0 : input.proofed) != null ? _b : []),
      sessionVerifiedCapabilities: sanitizeCapabilities(
        (_c = input == null ? void 0 : input.sessionVerified) != null ? _c : []
      )
    };
  }
  function evaluateCapability(action, evidence, options = {}) {
    if (!isInstrumentCapability(action) || !evidence.declaredCapabilities.includes(action)) {
      return {
        ok: false,
        code: "UNSUPPORTED_ACTION",
        message: `The action ${String(action)} is not declared.`
      };
    }
    if (!evidence.proofedAdapterCapabilities.includes(action)) {
      return {
        ok: false,
        code: "UNVERIFIED_CAPABILITY",
        message: `The action ${action} has no current adapter proof.`
      };
    }
    if (options.requireSessionVerification !== false && !evidence.sessionVerifiedCapabilities.includes(action)) {
      return {
        ok: false,
        code: "UNVERIFIED_CAPABILITY",
        message: `The action ${action} was not verified by this frame session.`
      };
    }
    if (humanGatedCapabilities.has(action) && options.userGesture !== true) {
      return {
        ok: false,
        code: "PERMISSION_REQUIRED",
        message: `The action ${action} requires a current user gesture.`
      };
    }
    return { ok: true };
  }
  const INSTRUMENT_FAILURE_CODES = [
    "UNSUPPORTED_ACTION",
    "UNVERIFIED_CAPABILITY",
    "PERMISSION_REQUIRED",
    "PERMISSION_DENIED",
    "HANDSHAKE_REQUIRED",
    "VERSION_MISMATCH",
    "MALFORMED_MESSAGE",
    "TIMEOUT",
    "NAVIGATION_ABORTED",
    "DESTROYED_FRAME",
    "HANDLER_ERROR",
    "POST_MESSAGE_FAILED",
    "ACTION_FAILED",
    "UNKNOWN_RECORD",
    "TOMBSTONED_RECORD",
    "UNKNOWN_VARIANT",
    "TOMBSTONED_VARIANT",
    "INVALID_URL",
    "RAW_ONLY"
  ];
  const failureCodeSet = new Set(INSTRUMENT_FAILURE_CODES);
  function isInstrumentFailureCode(value) {
    return typeof value === "string" && failureCodeSet.has(value);
  }
  const INSTRUMENT_BRIDGE_NAMESPACE = "supermega.instrument.bridge/v1";
  const INSTRUMENT_BRIDGE_VERSION = 1;
  function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
  }
  function hasExactKeys(value, expected) {
    const actual = Object.keys(value).sort();
    return actual.length === expected.length && actual.every((key, index) => key === [...expected].sort()[index]);
  }
  function isNonEmptyString(value) {
    return typeof value === "string" && value.length > 0;
  }
  function isJsonValue(value) {
    if (value === null || typeof value === "string" || typeof value === "boolean") {
      return true;
    }
    if (typeof value === "number") return Number.isFinite(value);
    if (Array.isArray(value)) return value.every(isJsonValue);
    if (!isPlainRecord(value)) return false;
    return Object.values(value).every(isJsonValue);
  }
  function malformed(message) {
    return {
      ok: false,
      error: { code: "MALFORMED_MESSAGE", message }
    };
  }
  function parseInstrumentBridgeMessage(data) {
    if (!isPlainRecord(data)) return malformed("Bridge data must be an object.");
    if (data.namespace !== INSTRUMENT_BRIDGE_NAMESPACE) {
      return malformed("Bridge namespace does not match.");
    }
    if (data.version !== INSTRUMENT_BRIDGE_VERSION) {
      return {
        ok: false,
        error: {
          code: "VERSION_MISMATCH",
          message: "Bridge schema version does not match v1."
        }
      };
    }
    if (data.type === "READY") {
      if (!hasExactKeys(data, [
        "namespace",
        "version",
        "type",
        "sessionId",
        "capabilities"
      ]) || !isNonEmptyString(data.sessionId) || !Array.isArray(data.capabilities) || !data.capabilities.every(isInstrumentCapability) || new Set(data.capabilities).size !== data.capabilities.length) {
        return malformed("READY message shape is invalid.");
      }
      return { ok: true, message: data };
    }
    if (data.type === "REQUEST") {
      if (!hasExactKeys(data, [
        "namespace",
        "version",
        "type",
        "sessionId",
        "requestId",
        "action",
        "payload"
      ]) || !isNonEmptyString(data.sessionId) || !isNonEmptyString(data.requestId) || !isInstrumentCapability(data.action) || !isJsonValue(data.payload)) {
        return malformed("REQUEST message shape is invalid.");
      }
      return { ok: true, message: data };
    }
    if (data.type === "RESULT") {
      if (!isNonEmptyString(data.sessionId) || !isNonEmptyString(data.requestId) || typeof data.ok !== "boolean") {
        return malformed("RESULT correlation fields are invalid.");
      }
      if (data.ok === true) {
        if (!hasExactKeys(data, [
          "namespace",
          "version",
          "type",
          "sessionId",
          "requestId",
          "ok",
          "value"
        ]) || !isJsonValue(data.value)) {
          return malformed("Successful RESULT message shape is invalid.");
        }
        return { ok: true, message: data };
      }
      if (!hasExactKeys(data, [
        "namespace",
        "version",
        "type",
        "sessionId",
        "requestId",
        "ok",
        "error"
      ]) || !isPlainRecord(data.error) || !hasExactKeys(data.error, ["code", "message"]) || !isInstrumentFailureCode(data.error.code) || !isNonEmptyString(data.error.message)) {
        return malformed("Failed RESULT message shape is invalid.");
      }
      return { ok: true, message: data };
    }
    return malformed("Bridge message type is not allowlisted.");
  }
  function createInstrumentBridge(options) {
    var _a, _b, _c;
    const declaredCapabilities = sanitizeCapabilities(
      options.declaredCapabilities
    );
    const proofedCapabilities = sanitizeCapabilities(options.proofedCapabilities);
    const timeoutMs = Math.max(1, (_a = options.timeoutMs) != null ? _a : 4e3);
    const targetOrigin = (_b = options.targetOrigin) != null ? _b : "*";
    const pending = /* @__PURE__ */ new Map();
    let phase = "awaiting-handshake";
    let sessionId = null;
    let sessionVerifiedCapabilities = [];
    let handshakeError = null;
    let sequence = 0;
    const createRequestId = (_c = options.createRequestId) != null ? _c : (() => `instrument-${++sequence}`);
    function failure(requestId, action, code, message) {
      return { ok: false, requestId, action, error: { code, message } };
    }
    function finish(outcome) {
      var _a2, _b2;
      try {
        (_a2 = options.onResult) == null ? void 0 : _a2.call(options, outcome);
      } catch (error) {
        (_b2 = options.onObserverError) == null ? void 0 : _b2.call(options, error);
      }
      return outcome;
    }
    function settle(requestId, outcome) {
      const request = pending.get(requestId);
      if (!request) return false;
      pending.delete(requestId);
      clearTimeout(request.timer);
      request.resolve(finish(outcome));
      return true;
    }
    function settleAll(code, message) {
      for (const [requestId, request] of [...pending]) {
        settle(requestId, failure(requestId, request.action, code, message));
      }
    }
    function immediateFailure(requestId, action, code, message) {
      return Promise.resolve(finish(failure(requestId, action, code, message)));
    }
    return {
      receive(event) {
        if (event.source !== options.expectedSource) {
          return { accepted: false, reason: "SOURCE_MISMATCH" };
        }
        const parsed = parseInstrumentBridgeMessage(event.data);
        if (!parsed.ok) {
          const possibleRequestId = isPlainRecord(event.data) ? event.data.requestId : null;
          if (isNonEmptyString(possibleRequestId) && pending.has(possibleRequestId)) {
            const request2 = pending.get(possibleRequestId);
            if (request2) {
              settle(
                possibleRequestId,
                failure(
                  possibleRequestId,
                  request2.action,
                  parsed.error.code,
                  parsed.error.message
                )
              );
            }
          } else if (isPlainRecord(event.data) && event.data.type === "READY") {
            handshakeError = parsed.error;
          }
          return { accepted: false, reason: parsed.error.code };
        }
        if (parsed.message.type === "READY") {
          if (phase === "destroyed") {
            return { accepted: false, reason: "DESTROYED_FRAME" };
          }
          if (sessionId !== null && sessionId !== parsed.message.sessionId) {
            settleAll(
              "NAVIGATION_ABORTED",
              "The child session changed during a pending request."
            );
          }
          sessionId = parsed.message.sessionId;
          const offeredCapabilities = new Set(parsed.message.capabilities);
          sessionVerifiedCapabilities = declaredCapabilities.filter(
            (capability) => offeredCapabilities.has(capability) && proofedCapabilities.includes(capability)
          );
          handshakeError = null;
          phase = "ready";
          return { accepted: true, type: "READY" };
        }
        if (parsed.message.type !== "RESULT") {
          return { accepted: false, reason: "UNEXPECTED_MESSAGE" };
        }
        if (parsed.message.sessionId !== sessionId || !pending.has(parsed.message.requestId)) {
          return { accepted: false, reason: "UNKNOWN_REQUEST" };
        }
        const request = pending.get(parsed.message.requestId);
        if (!request) return { accepted: false, reason: "UNKNOWN_REQUEST" };
        const outcome = parsed.message.ok ? {
          ok: true,
          requestId: parsed.message.requestId,
          action: request.action,
          value: parsed.message.value
        } : {
          ok: false,
          requestId: parsed.message.requestId,
          action: request.action,
          error: parsed.message.error
        };
        settle(parsed.message.requestId, outcome);
        return { accepted: true, type: "RESULT" };
      },
      request(action, payload = null, requestOptions = {}) {
        const requestId = createRequestId();
        if (phase === "destroyed") {
          return immediateFailure(
            requestId,
            action,
            "DESTROYED_FRAME",
            "The frame bridge has been destroyed."
          );
        }
        if (handshakeError) {
          return immediateFailure(
            requestId,
            action,
            handshakeError.code,
            handshakeError.message
          );
        }
        if (phase !== "ready" || sessionId === null) {
          return immediateFailure(
            requestId,
            action,
            "HANDSHAKE_REQUIRED",
            "A verified bridge handshake is required."
          );
        }
        const capability = evaluateCapability(
          action,
          createCapabilityEvidence({
            declared: declaredCapabilities,
            proofed: proofedCapabilities,
            sessionVerified: sessionVerifiedCapabilities
          }),
          { userGesture: requestOptions.userGesture }
        );
        if (!capability.ok) {
          return immediateFailure(
            requestId,
            action,
            capability.code,
            capability.message
          );
        }
        if (!isJsonValue(payload)) {
          return immediateFailure(
            requestId,
            action,
            "MALFORMED_MESSAGE",
            "Bridge request payload must be JSON-safe."
          );
        }
        const requestSessionId = sessionId;
        return new Promise((resolve) => {
          const message = {
            namespace: INSTRUMENT_BRIDGE_NAMESPACE,
            version: INSTRUMENT_BRIDGE_VERSION,
            type: "REQUEST",
            sessionId: requestSessionId,
            requestId,
            action,
            payload
          };
          const timer = setTimeout(() => {
            settle(
              requestId,
              failure(
                requestId,
                action,
                "TIMEOUT",
                `The ${action} request timed out.`
              )
            );
          }, timeoutMs);
          pending.set(requestId, { action, resolve, timer });
          try {
            options.target.postMessage(message, targetOrigin);
          } catch (e) {
            settle(
              requestId,
              failure(
                requestId,
                action,
                "POST_MESSAGE_FAILED",
                "The bridge request could not be sent."
              )
            );
          }
        });
      },
      navigationStarted() {
        if (phase === "destroyed") return;
        settleAll(
          "NAVIGATION_ABORTED",
          "The child navigated before the request completed."
        );
        phase = "awaiting-handshake";
        sessionId = null;
        sessionVerifiedCapabilities = [];
        handshakeError = null;
      },
      destroy() {
        if (phase === "destroyed") return;
        settleAll("DESTROYED_FRAME", "The frame bridge was destroyed.");
        phase = "destroyed";
        sessionId = null;
        sessionVerifiedCapabilities = [];
        handshakeError = null;
      },
      getState() {
        return {
          phase,
          sessionId,
          sessionVerifiedCapabilities: [...sessionVerifiedCapabilities]
        };
      }
    };
  }
  const INSTRUMENT_SCOPE_ATTRIBUTES = {
    "data-system": "instrument"
  };
  function createInitialInstrumentAppearanceState() {
    return {
      polarity: "ink",
      grid: false,
      grain: true,
      density: 1,
      motion: 1
    };
  }
  function createInitialInstrumentShellState() {
    return {
      overviewVisible: true,
      inspectorVisible: true,
      activeSheet: null,
      debug: false
    };
  }
  function createInitialInstrumentCatalogState() {
    return {
      query: "",
      family: null,
      facets: {},
      order: [],
      selectedId: null
    };
  }
  function createInitialInstrumentViewerState() {
    return {
      status: "closed",
      recordId: null,
      variantId: null,
      rawHref: null,
      error: null
    };
  }
  function createInitialInstrumentAdapterState() {
    return {
      status: "idle",
      sessionId: null,
      declaredCapabilities: [],
      proofedAdapterCapabilities: [],
      sessionVerifiedCapabilities: [],
      configuration: {}
    };
  }
  function createInitialInstrumentState() {
    return {
      appearance: createInitialInstrumentAppearanceState(),
      shell: createInitialInstrumentShellState(),
      catalog: createInitialInstrumentCatalogState(),
      viewer: createInitialInstrumentViewerState(),
      adapter: createInitialInstrumentAdapterState()
    };
  }
  const INSTRUMENT_DENSITY_MIN = 0.75;
  const INSTRUMENT_DENSITY_MAX = 1.25;
  const INSTRUMENT_MOTION_MIN = 0;
  const INSTRUMENT_MOTION_MAX = 1;
  const INSTRUMENT_SHEET_MEDIA_QUERY = "(max-width: 1199px)";
  function clampFinite(value, minimum, maximum, fallback) {
    if (!Number.isFinite(value)) return fallback;
    return Math.min(maximum, Math.max(minimum, value));
  }
  function normalizeMaterialState(state) {
    return {
      polarity: state.polarity === "light" ? "light" : "ink",
      grid: state.grid,
      grain: state.grain,
      density: clampFinite(
        state.density,
        INSTRUMENT_DENSITY_MIN,
        INSTRUMENT_DENSITY_MAX,
        1
      ),
      motion: clampFinite(
        state.motion,
        INSTRUMENT_MOTION_MIN,
        INSTRUMENT_MOTION_MAX,
        1
      )
    };
  }
  function getMaterialAttributes(state) {
    const material = normalizeMaterialState(state);
    const density = material.density <= 0.875 ? "compact" : material.density >= 1.125 ? "comfortable" : "normal";
    return {
      ...INSTRUMENT_SCOPE_ATTRIBUTES,
      "data-instrument-polarity": material.polarity,
      "data-instrument-grid": material.grid ? "on" : "off",
      "data-instrument-grain": material.grain ? "on" : "off",
      "data-instrument-density": density,
      "data-instrument-motion": material.motion === 0 ? "reduced" : "system"
    };
  }
  function uniqueStrings(values) {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  }
  function normalizeFacets(facets) {
    const output = {};
    for (const [key, values] of Object.entries(facets)) {
      const normalizedKey = key.trim();
      if (normalizedKey.length === 0) continue;
      const normalizedValues = uniqueStrings(values);
      if (normalizedValues.length > 0) output[normalizedKey] = normalizedValues;
    }
    return output;
  }
  function instrumentReducer(state, action) {
    var _a, _b, _c, _d, _e;
    switch (action.type) {
      case "appearance/set":
        return {
          ...state,
          appearance: normalizeMaterialState({
            ...state.appearance,
            ...action.patch
          })
        };
      case "appearance/reset":
        return {
          ...state,
          appearance: createInitialInstrumentAppearanceState()
        };
      case "shell/set":
        return { ...state, shell: { ...state.shell, ...action.patch } };
      case "shell/reset":
        return { ...state, shell: createInitialInstrumentShellState() };
      case "catalog/set-query":
        return {
          ...state,
          catalog: { ...state.catalog, query: action.query.trim() }
        };
      case "catalog/set-family":
        return {
          ...state,
          catalog: { ...state.catalog, family: action.family }
        };
      case "catalog/set-facets":
        return {
          ...state,
          catalog: {
            ...state.catalog,
            facets: normalizeFacets(action.facets)
          }
        };
      case "catalog/set-order":
        return {
          ...state,
          catalog: { ...state.catalog, order: uniqueStrings(action.order) }
        };
      case "catalog/select":
        return {
          ...state,
          catalog: { ...state.catalog, selectedId: action.selectedId }
        };
      case "catalog/reset":
        return {
          ...state,
          catalog: {
            ...createInitialInstrumentCatalogState(),
            order: state.catalog.order
          }
        };
      case "viewer/open":
        return {
          ...state,
          viewer: {
            status: "loading",
            recordId: action.recordId,
            variantId: action.variantId,
            rawHref: action.rawHref,
            error: null
          }
        };
      case "viewer/set-status":
        return {
          ...state,
          viewer: {
            ...state.viewer,
            status: action.status,
            error: (_a = action.error) != null ? _a : null
          }
        };
      case "viewer/set-variant":
        return {
          ...state,
          viewer: { ...state.viewer, variantId: action.variantId }
        };
      case "viewer/close":
        return {
          ...state,
          viewer: createInitialInstrumentViewerState()
        };
      case "adapter/set":
        return {
          ...state,
          adapter: {
            ...state.adapter,
            ...action.patch,
            declaredCapabilities: sanitizeCapabilities(
              (_b = action.patch.declaredCapabilities) != null ? _b : state.adapter.declaredCapabilities
            ),
            proofedAdapterCapabilities: sanitizeCapabilities(
              (_c = action.patch.proofedAdapterCapabilities) != null ? _c : state.adapter.proofedAdapterCapabilities
            ),
            sessionVerifiedCapabilities: sanitizeCapabilities(
              (_d = action.patch.sessionVerifiedCapabilities) != null ? _d : state.adapter.sessionVerifiedCapabilities
            ),
            configuration: {
              ...(_e = action.patch.configuration) != null ? _e : state.adapter.configuration
            }
          }
        };
      case "adapter/reset":
        return { ...state, adapter: createInitialInstrumentAdapterState() };
      default: {
        const exhaustive = action;
        return exhaustive;
      }
    }
  }
  function enabledIds(items) {
    return items.filter((item) => !item.disabled).map((item) => item.id);
  }
  function resolveCollectionTarget({
    activeId,
    dir = "ltr",
    items,
    key,
    loop = true,
    orientation = "horizontal"
  }) {
    var _a, _b, _c, _d, _e, _f;
    const available = enabledIds(items);
    if (available.length === 0) return null;
    if (key === "Home") return (_a = available[0]) != null ? _a : null;
    if (key === "End") return (_b = available.at(-1)) != null ? _b : null;
    let delta = 0;
    if (orientation === "horizontal") {
      if (key === "ArrowRight") delta = dir === "rtl" ? -1 : 1;
      if (key === "ArrowLeft") delta = dir === "rtl" ? 1 : -1;
    } else {
      if (key === "ArrowDown") delta = 1;
      if (key === "ArrowUp") delta = -1;
    }
    if (delta === 0) return null;
    const currentIndex = activeId ? available.indexOf(activeId) : -1;
    if (currentIndex === -1) {
      return delta > 0 ? (_c = available[0]) != null ? _c : null : (_d = available.at(-1)) != null ? _d : null;
    }
    const nextIndex = currentIndex + delta;
    if (loop) {
      return (_e = available[(nextIndex + available.length) % available.length]) != null ? _e : null;
    }
    if (nextIndex < 0 || nextIndex >= available.length) return activeId != null ? activeId : null;
    return (_f = available[nextIndex]) != null ? _f : null;
  }
  function repairCollectionId({
    activeId,
    items,
    previousIds = []
  }) {
    var _a, _b;
    const available = enabledIds(items);
    if (available.length === 0) return null;
    if (activeId && available.includes(activeId)) return activeId;
    const priorIndex = activeId ? previousIds.indexOf(activeId) : -1;
    if (priorIndex === -1) return (_a = available[0]) != null ? _a : null;
    const availableSet = new Set(available);
    for (let distance = 1; distance < previousIds.length; distance += 1) {
      const forward = previousIds[priorIndex + distance];
      if (forward && availableSet.has(forward)) return forward;
      const backward = previousIds[priorIndex - distance];
      if (backward && availableSet.has(backward)) return backward;
    }
    return (_b = available[0]) != null ? _b : null;
  }
  const oppositeSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };
  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
  }
  function coordinates(side, align, anchor, surface, offset) {
    if (side === "top" || side === "bottom") {
      const left = align === "start" ? anchor.left : align === "end" ? anchor.right - surface.width : anchor.left + (anchor.width - surface.width) / 2;
      return {
        left,
        top: side === "top" ? anchor.top - surface.height - offset : anchor.bottom + offset
      };
    }
    const top = align === "start" ? anchor.top : align === "end" ? anchor.bottom - surface.height : anchor.top + (anchor.height - surface.height) / 2;
    return {
      left: side === "left" ? anchor.left - surface.width - offset : anchor.right + offset,
      top
    };
  }
  function availableMainAxisSpace(side, anchor, viewport, offset, safeInset) {
    if (side === "top") {
      return Math.max(0, anchor.top - offset - safeInset);
    }
    if (side === "bottom") {
      return Math.max(0, viewport.height - safeInset - anchor.bottom - offset);
    }
    if (side === "left") {
      return Math.max(0, anchor.left - offset - safeInset);
    }
    return Math.max(0, viewport.width - safeInset - anchor.right - offset);
  }
  function mainAxisSize(side, surface) {
    return side === "top" || side === "bottom" ? surface.height : surface.width;
  }
  function resolvePopoverPlacement({
    align = "center",
    anchor,
    offset = 8,
    placement = "bottom",
    safeInset = 8,
    surface,
    viewport
  }) {
    const viewportMaxWidth = Math.max(0, viewport.width - safeInset * 2);
    const viewportMaxHeight = Math.max(0, viewport.height - safeInset * 2);
    const opposite = oppositeSide[placement];
    const preferredSpace = availableMainAxisSpace(
      placement,
      anchor,
      viewport,
      offset,
      safeInset
    );
    const oppositeSpace = availableMainAxisSpace(
      opposite,
      anchor,
      viewport,
      offset,
      safeInset
    );
    const requestedMainAxisSize = mainAxisSize(placement, surface);
    let side = placement;
    if (requestedMainAxisSize > preferredSpace && (requestedMainAxisSize <= oppositeSpace || oppositeSpace > preferredSpace)) {
      side = opposite;
    }
    const selectedSpace = side === placement ? preferredSpace : oppositeSpace;
    const verticalSide = side === "top" || side === "bottom";
    const maxWidth = verticalSide ? viewportMaxWidth : selectedSpace;
    const maxHeight = verticalSide ? selectedSpace : viewportMaxHeight;
    const boundedSurface = {
      height: Math.min(surface.height, maxHeight),
      width: Math.min(surface.width, maxWidth)
    };
    const initial = coordinates(side, align, anchor, boundedSurface, offset);
    const left = verticalSide ? clamp(
      initial.left,
      safeInset,
      viewport.width - safeInset - boundedSurface.width
    ) : initial.left;
    const top = verticalSide ? initial.top : clamp(
      initial.top,
      safeInset,
      viewport.height - safeInset - boundedSurface.height
    );
    return {
      align,
      flipped: side !== placement,
      left,
      maxHeight,
      maxWidth,
      shifted: left !== initial.left || top !== initial.top || boundedSurface.width !== surface.width || boundedSurface.height !== surface.height,
      side,
      top
    };
  }
  const INSTRUMENT_RUNTIME_VERSION = "0.1.0";
  function applyInstrumentState(root, state) {
    var _a, _b, _c, _d;
    const sheetLayout = (_c = (_b = (_a = root.ownerDocument.defaultView) == null ? void 0 : _a.matchMedia) == null ? void 0 : _b.call(_a, INSTRUMENT_SHEET_MEDIA_QUERY).matches) != null ? _c : false;
    for (const [name, value] of Object.entries(
      getMaterialAttributes(state.appearance)
    )) {
      root.setAttribute(name, value);
    }
    const shell = root.querySelector(".instrument-shell");
    if (shell) {
      shell.dataset.instrumentOverview = state.shell.overviewVisible ? "visible" : "hidden";
      shell.dataset.instrumentInspector = state.shell.inspectorVisible ? shell.dataset.instrumentInspector === "wide" ? "wide" : "standard" : "hidden";
      shell.dataset.instrumentActiveSheet = (_d = state.shell.activeSheet) != null ? _d : "none";
    }
    const pressed = {
      ink: state.appearance.polarity === "ink",
      light: state.appearance.polarity === "light",
      grid: state.appearance.grid,
      grain: state.appearance.grain,
      overview: sheetLayout ? state.shell.activeSheet === "overview" : state.shell.overviewVisible,
      inspector: sheetLayout ? state.shell.activeSheet === "inspector" : state.shell.inspectorVisible,
      debug: state.shell.debug
    };
    for (const element of root.querySelectorAll(
      "[data-instrument-coordinate]"
    )) {
      const coordinate = element.dataset.instrumentCoordinate;
      if (coordinate && coordinate in pressed) {
        element.setAttribute("aria-pressed", String(pressed[coordinate]));
      }
    }
  }
  function actionForCoordinate(coordinate, state, sheetLayout) {
    switch (coordinate) {
      case "ink":
        return { type: "appearance/set", patch: { polarity: "ink" } };
      case "light":
        return { type: "appearance/set", patch: { polarity: "light" } };
      case "grid":
        return {
          type: "appearance/set",
          patch: { grid: !state.appearance.grid }
        };
      case "grain":
        return {
          type: "appearance/set",
          patch: { grain: !state.appearance.grain }
        };
      case "overview":
        if (sheetLayout) {
          return {
            type: "shell/set",
            patch: {
              activeSheet: state.shell.activeSheet === "overview" ? null : "overview"
            }
          };
        }
        return {
          type: "shell/set",
          patch: { overviewVisible: !state.shell.overviewVisible }
        };
      case "inspector":
        if (sheetLayout) {
          return {
            type: "shell/set",
            patch: {
              activeSheet: state.shell.activeSheet === "inspector" ? null : "inspector"
            }
          };
        }
        return {
          type: "shell/set",
          patch: { inspectorVisible: !state.shell.inspectorVisible }
        };
      case "debug":
        return { type: "shell/set", patch: { debug: !state.shell.debug } };
      default:
        return null;
    }
  }
  function syncRangeVisual(input) {
    const minimum = input.min === "" ? 0 : Number(input.min);
    const maximum = input.max === "" ? 100 : Number(input.max);
    const span = maximum - minimum;
    const percentage = span > 0 ? (Number(input.value) - minimum) / span * 100 : 0;
    input.style.setProperty(
      "--instrument-range-fill",
      `${Math.min(100, Math.max(0, percentage))}%`
    );
  }
  function percentageWithin(value, minimum, maximum) {
    const span = maximum - minimum;
    if (span <= 0) return 0;
    return Math.min(100, Math.max(0, (value - minimum) / span * 100));
  }
  function syncRangePairVisual(input) {
    if (!input.dataset.instrumentThumb) return;
    const pair = input.closest(".instrument-range-pair");
    if (!pair) return;
    const lowerInput = pair.querySelector(
      '[data-instrument-thumb="lower"]'
    );
    const upperInput = pair.querySelector(
      '[data-instrument-thumb="upper"]'
    );
    if (!lowerInput || !upperInput) return;
    const minimum = lowerInput.min === "" ? 0 : Number(lowerInput.min);
    const maximum = lowerInput.max === "" ? 100 : Number(lowerInput.max);
    let lower = Number(lowerInput.value);
    let upper = Number(upperInput.value);
    if (input === lowerInput && lower > upper) {
      lower = upper;
      lowerInput.value = String(lower);
    } else if (input === upperInput && upper < lower) {
      upper = lower;
      upperInput.value = String(upper);
    }
    pair.style.setProperty(
      "--instrument-range-fill-a",
      `${percentageWithin(lower, minimum, maximum)}%`
    );
    pair.style.setProperty(
      "--instrument-range-fill-b",
      `${percentageWithin(upper, minimum, maximum)}%`
    );
  }
  const portableFocusableSelector = "button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";
  const portableDialogFocusableSelector = [
    "button",
    "[href]",
    "input",
    "select",
    "textarea",
    "[contenteditable]:not([contenteditable='false'])",
    "[tabindex]"
  ].join(", ");
  function isPortableDialogFocusable(element) {
    if (element.tabIndex < 0) return false;
    if (element.matches(":disabled")) return false;
    if (element.closest("[hidden], [inert]")) return false;
    if (element.closest('[aria-hidden="true"]')) return false;
    if (element instanceof HTMLInputElement && element.type.toLocaleLowerCase() === "hidden") {
      return false;
    }
    return true;
  }
  function portableDialogFocusables(dialog) {
    return Array.from(
      dialog.querySelectorAll(portableDialogFocusableSelector)
    ).filter(isPortableDialogFocusable);
  }
  function dispatchPortableChange(target, name, detail) {
    target.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        detail
      })
    );
  }
  function portableItemDisabled(element) {
    return element instanceof HTMLButtonElement && element.disabled || element.getAttribute("aria-disabled") === "true" || element.hasAttribute("data-instrument-disabled");
  }
  function resolvedPortableDirection(element) {
    var _a;
    if (element.dir === "rtl") return "rtl";
    if (element.dir === "ltr") return "ltr";
    return ((_a = element.ownerDocument.defaultView) == null ? void 0 : _a.getComputedStyle(element).direction) === "rtl" ? "rtl" : "ltr";
  }
  function portableTabId(tab) {
    var _a, _b, _c;
    return (_c = (_b = (_a = tab.dataset.instrumentTabId) != null ? _a : tab.id) != null ? _b : tab.getAttribute("aria-controls")) != null ? _c : "";
  }
  function portableToolbarId(item) {
    var _a, _b;
    return (_b = (_a = item.dataset.instrumentToolbarId) != null ? _a : item.id) != null ? _b : "";
  }
  function portableOptionId(option) {
    var _a, _b;
    return (_b = (_a = option.dataset.instrumentOptionId) != null ? _a : option.id) != null ? _b : "";
  }
  function portableOptions(listbox) {
    return Array.from(
      listbox.querySelectorAll(".instrument-listbox-option")
    ).map((element) => ({
      disabled: portableItemDisabled(element),
      element,
      id: portableOptionId(element)
    }));
  }
  function normalizePortableSearch(value) {
    return value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();
  }
  function portableOptionLabel(option) {
    var _a, _b, _c;
    return ((_c = (_b = (_a = option.querySelector(".instrument-listbox-option-label")) == null ? void 0 : _a.textContent) != null ? _b : option.textContent) != null ? _c : "").trim();
  }
  function isPortableFocusable(target) {
    const element = target instanceof Element ? target : target.parentElement;
    return (element == null ? void 0 : element.closest(portableFocusableSelector)) !== null;
  }
  function enhanceInstrument(root, initialState = createInitialInstrumentState()) {
    var _a, _b, _c, _d, _e;
    let state = initialState;
    let destroyed = false;
    const sheetQuery = (_b = (_a = root.ownerDocument.defaultView) == null ? void 0 : _a.matchMedia) == null ? void 0 : _b.call(
      _a,
      INSTRUMENT_SHEET_MEDIA_QUERY
    );
    const previousTabIds = /* @__PURE__ */ new WeakMap();
    const previousToolbarIds = /* @__PURE__ */ new WeakMap();
    const toolbarFocusIds = /* @__PURE__ */ new WeakMap();
    const previousListboxIds = /* @__PURE__ */ new WeakMap();
    const previousComboboxIds = /* @__PURE__ */ new WeakMap();
    const comboboxActiveIds = /* @__PURE__ */ new WeakMap();
    const listboxTypeahead = /* @__PURE__ */ new Map();
    const openLayers = [];
    const openDialogs = [];
    const prepareDialog = (layer, dialog) => {
      dialog.tabIndex = -1;
      for (const backdrop of layer.querySelectorAll(
        ".instrument-overlay"
      )) {
        backdrop.tabIndex = -1;
      }
    };
    const resolveDialog = (trigger) => {
      const controlledId = trigger.getAttribute("aria-controls");
      const controlled = controlledId ? root.ownerDocument.getElementById(controlledId) : null;
      if (!(controlled instanceof HTMLElement) || !root.contains(controlled)) {
        return null;
      }
      const layer = controlled.classList.contains("instrument-portal") ? controlled : controlled.closest(".instrument-portal");
      const dialog = controlled.classList.contains("instrument-dialog") ? controlled : layer == null ? void 0 : layer.querySelector(
        '.instrument-dialog[role="dialog"][aria-modal="true"]'
      );
      if (!layer || !dialog || !layer.contains(dialog)) return null;
      return { dialog, layer };
    };
    const removeOpenDialog = (layer) => {
      const index = openDialogs.findIndex(
        (candidate) => candidate.layer === layer
      );
      if (index >= 0) openDialogs.splice(index, 1);
    };
    const closeDialog = (entry, restoreFocus) => {
      entry.layer.hidden = true;
      entry.trigger.setAttribute("aria-expanded", "false");
      removeOpenDialog(entry.layer);
      if (entry.trigger.isConnected) entry.trigger.focus();
    };
    const openDialog = (trigger) => {
      var _a2;
      const resolved = resolveDialog(trigger);
      if (!resolved) return;
      const { dialog, layer } = resolved;
      prepareDialog(layer, dialog);
      layer.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      removeOpenDialog(layer);
      openDialogs.push({ dialog, layer, trigger });
      const candidates = portableDialogFocusables(dialog);
      const requestedInitialFocus = dialog.querySelector(
        "[data-instrument-dialog-initial-focus]"
      );
      const initialFocus = requestedInitialFocus && isPortableDialogFocusable(requestedInitialFocus) ? requestedInitialFocus : (_a2 = candidates[0]) != null ? _a2 : dialog;
      initialFocus.focus();
    };
    const syncDialogs = () => {
      for (const dialog of root.querySelectorAll(
        '.instrument-dialog[role="dialog"][aria-modal="true"]'
      )) {
        const layer = dialog.closest(".instrument-portal");
        if (layer) prepareDialog(layer, dialog);
      }
    };
    const tabButtons = (tabs) => Array.from(
      tabs.querySelectorAll(
        '.instrument-tabs-list > .instrument-tab-wrap > button[role="tab"]'
      )
    );
    const applyTabSelection = (tabs, selectedId) => {
      const buttons = tabButtons(tabs);
      if (selectedId) tabs.dataset.instrumentSelectedId = selectedId;
      else delete tabs.dataset.instrumentSelectedId;
      for (const button of buttons) {
        const selected = portableTabId(button) === selectedId;
        button.setAttribute("aria-selected", String(selected));
        button.toggleAttribute("data-instrument-active", selected);
        const panelId = button.getAttribute("aria-controls");
        if (!panelId) continue;
        const panel = root.ownerDocument.getElementById(panelId);
        if (panel && root.contains(panel))
          panel.toggleAttribute("hidden", !selected);
      }
    };
    const syncTabs = (tabs, emitRepair) => {
      var _a2;
      const buttons = tabButtons(tabs);
      const items = buttons.map((button) => ({
        disabled: portableItemDisabled(button),
        id: portableTabId(button)
      }));
      const ids = items.map((item) => item.id);
      const selectedButton = buttons.find(
        (button) => button.getAttribute("aria-selected") === "true" && !portableItemDisabled(button)
      );
      const requestedId = (_a2 = tabs.dataset.instrumentSelectedId) != null ? _a2 : selectedButton ? portableTabId(selectedButton) : null;
      const repairedId = repairCollectionId({
        activeId: requestedId,
        items,
        previousIds: previousTabIds.get(tabs)
      });
      applyTabSelection(tabs, repairedId);
      const currentRoving = buttons.find(
        (button) => button.tabIndex === 0 && !portableItemDisabled(button)
      );
      const rovingId = currentRoving && portableTabId(currentRoving) || repairedId;
      for (const button of buttons) {
        button.tabIndex = !portableItemDisabled(button) && portableTabId(button) === rovingId ? 0 : -1;
      }
      tabs.toggleAttribute(
        "aria-disabled",
        items.every((item) => item.disabled)
      );
      previousTabIds.set(tabs, ids);
      if (emitRepair && requestedId && repairedId && requestedId !== repairedId) {
        dispatchPortableChange(tabs, "instrument:tabs-change", {
          value: repairedId
        });
      }
    };
    const selectTab = (tabs, tab, emit = true) => {
      if (portableItemDisabled(tab)) return;
      const id = portableTabId(tab);
      if (!id) return;
      applyTabSelection(tabs, id);
      for (const button of tabButtons(tabs)) {
        button.tabIndex = button === tab ? 0 : -1;
      }
      if (emit) {
        dispatchPortableChange(tabs, "instrument:tabs-change", { value: id });
      }
    };
    const toolbarButtons = (toolbar) => Array.from(
      toolbar.querySelectorAll(
        "button[data-instrument-toolbar-item]"
      )
    );
    const syncToolbar = (toolbar) => {
      var _a2;
      const buttons = toolbarButtons(toolbar);
      const items = buttons.map((button) => ({
        disabled: portableItemDisabled(button),
        id: portableToolbarId(button)
      }));
      const ids = items.map((item) => item.id);
      const currentRoving = buttons.find(
        (button) => button.tabIndex === 0 && !portableItemDisabled(button)
      );
      const requestedId = (_a2 = toolbarFocusIds.get(toolbar)) != null ? _a2 : currentRoving ? portableToolbarId(currentRoving) : null;
      const repairedId = repairCollectionId({
        activeId: requestedId,
        items,
        previousIds: previousToolbarIds.get(toolbar)
      });
      for (const button of buttons) {
        button.tabIndex = !portableItemDisabled(button) && portableToolbarId(button) === repairedId ? 0 : -1;
      }
      if (repairedId) toolbarFocusIds.set(toolbar, repairedId);
      toolbar.setAttribute(
        "aria-disabled",
        String(items.every((item) => item.disabled))
      );
      if (!items.every((item) => item.disabled)) {
        toolbar.removeAttribute("aria-disabled");
      }
      previousToolbarIds.set(toolbar, ids);
    };
    const applyListboxActive = (listbox, activeId) => {
      const options = portableOptions(listbox);
      let activeDomId = null;
      for (const option of options) {
        const active = option.id === activeId && !option.disabled && !option.element.hidden;
        option.element.toggleAttribute("data-instrument-active", active);
        if (active && option.element.id) activeDomId = option.element.id;
      }
      if (activeDomId) listbox.setAttribute("aria-activedescendant", activeDomId);
      else listbox.removeAttribute("aria-activedescendant");
    };
    const applyListboxSelection = (shell, listbox, selectedId) => {
      if (selectedId) shell.dataset.instrumentSelectedId = selectedId;
      else delete shell.dataset.instrumentSelectedId;
      for (const option of portableOptions(listbox)) {
        const selected = option.id === selectedId && !option.disabled;
        option.element.setAttribute("aria-selected", String(selected));
        option.element.toggleAttribute("data-instrument-selected", selected);
      }
    };
    const syncStandaloneListbox = (listbox, emitRepair) => {
      var _a2, _b2;
      if (listbox.classList.contains("instrument-combobox-listbox")) return;
      const shell = listbox.closest(".instrument-listbox-shell");
      if (!shell) return;
      const options = portableOptions(listbox);
      const items = options.map(({ disabled, id }) => ({ disabled, id }));
      const ids = items.map((item) => item.id);
      const selectedOption = options.find(
        (option) => option.element.getAttribute("aria-selected") === "true" && !option.disabled
      );
      const requestedSelectedId = (_b2 = (_a2 = shell.dataset.instrumentSelectedId) != null ? _a2 : selectedOption == null ? void 0 : selectedOption.id) != null ? _b2 : null;
      const repairedSelectedId = requestedSelectedId ? repairCollectionId({
        activeId: requestedSelectedId,
        items,
        previousIds: previousListboxIds.get(listbox)
      }) : null;
      applyListboxSelection(shell, listbox, repairedSelectedId);
      const activeDomId = listbox.getAttribute("aria-activedescendant");
      const activeOption = options.find(
        (option) => option.element.id === activeDomId || option.element.hasAttribute("data-instrument-active")
      );
      const repairedActiveId = repairCollectionId({
        activeId: activeOption == null ? void 0 : activeOption.id,
        items,
        previousIds: previousListboxIds.get(listbox)
      });
      applyListboxActive(listbox, repairedActiveId);
      previousListboxIds.set(listbox, ids);
      if (emitRepair && requestedSelectedId && repairedSelectedId && requestedSelectedId !== repairedSelectedId) {
        dispatchPortableChange(shell, "instrument:listbox-change", {
          value: repairedSelectedId
        });
      }
    };
    const comboboxInput = (combobox) => combobox.querySelector(
      'input.instrument-combobox-input[role="combobox"]'
    );
    const comboboxSurface = (input) => {
      var _a2, _b2, _c2;
      const explicit = Array.from(
        root.querySelectorAll("[data-instrument-combobox-for]")
      ).find((surface) => surface.dataset.instrumentComboboxFor === input.id);
      if (explicit) return explicit;
      const listboxId = (_b2 = (_a2 = input.dataset.instrumentListboxId) != null ? _a2 : input.getAttribute("aria-controls")) != null ? _b2 : "";
      const listbox = listboxId ? root.ownerDocument.getElementById(listboxId) : null;
      return (_c2 = listbox == null ? void 0 : listbox.closest(".instrument-combobox-surface")) != null ? _c2 : null;
    };
    const setComboboxActive = (combobox, listbox, activeId) => {
      comboboxActiveIds.set(combobox, activeId);
      applyListboxActive(listbox, activeId);
      const input = comboboxInput(combobox);
      const active = portableOptions(listbox).find(
        (option) => option.id === activeId && !option.disabled && !option.element.hidden
      );
      if ((input == null ? void 0 : input.getAttribute("aria-expanded")) === "true" && (active == null ? void 0 : active.element.id)) {
        input.setAttribute("aria-activedescendant", active.element.id);
      } else {
        input == null ? void 0 : input.removeAttribute("aria-activedescendant");
      }
    };
    const filterCombobox = (combobox, input, resetActive) => {
      var _a2, _b2, _c2, _d2, _e2, _f;
      const surface = comboboxSurface(input);
      const listbox = surface == null ? void 0 : surface.querySelector(
        ".instrument-combobox-listbox"
      );
      if (!surface || !listbox) return [];
      const options = portableOptions(listbox);
      const state2 = combobox.dataset.instrumentState;
      const blocked = state2 === "loading" || state2 === "error";
      const query = normalizePortableSearch(input.value.trim());
      const visible = options.filter((option) => {
        var _a3;
        const search = normalizePortableSearch(
          (_a3 = option.element.dataset.instrumentSearch) != null ? _a3 : portableOptionLabel(option.element)
        );
        const shown = !blocked && (!query || search.includes(query));
        option.element.hidden = !shown;
        return shown;
      });
      for (const group of listbox.querySelectorAll(
        ".instrument-listbox-group"
      )) {
        group.hidden = !Array.from(
          group.querySelectorAll(".instrument-listbox-option")
        ).some((option) => !option.hidden);
      }
      const available = visible.filter((option) => !option.disabled);
      const currentActiveId = (_a2 = comboboxActiveIds.get(combobox)) != null ? _a2 : null;
      const nextActiveId = resetActive || !available.some((option) => option.id === currentActiveId) ? (_c2 = (_b2 = available[0]) == null ? void 0 : _b2.id) != null ? _c2 : null : currentActiveId;
      setComboboxActive(combobox, listbox, nextActiveId);
      const status = surface.querySelector(
        ".instrument-listbox-status"
      );
      if (status) {
        if (state2 === "loading") {
          status.textContent = (_d2 = combobox.dataset.instrumentLoadingLabel) != null ? _d2 : "Loading";
        } else if (state2 === "error") {
          status.textContent = (_e2 = combobox.dataset.instrumentErrorLabel) != null ? _e2 : "Could not load options";
        } else if (visible.length === 0) {
          status.textContent = (_f = combobox.dataset.instrumentEmptyLabel) != null ? _f : "No results";
        } else {
          status.textContent = `${visible.length} result${visible.length === 1 ? "" : "s"}`;
        }
      }
      listbox.toggleAttribute("aria-busy", state2 === "loading");
      return visible;
    };
    const syncCombobox = (combobox, emitRepair) => {
      var _a2, _b2, _c2, _d2;
      const input = comboboxInput(combobox);
      if (!input) return;
      const surface = comboboxSurface(input);
      const listbox = surface == null ? void 0 : surface.querySelector(
        ".instrument-combobox-listbox"
      );
      if (!surface || !listbox) return;
      const options = portableOptions(listbox);
      const items = options.map(({ disabled, id }) => ({ disabled, id }));
      const ids = items.map((item) => item.id);
      const selectedOption = options.find(
        (option) => option.element.getAttribute("aria-selected") === "true" && !option.disabled
      );
      const requestedSelectedId = (_b2 = (_a2 = combobox.dataset.instrumentSelectedId) != null ? _a2 : selectedOption == null ? void 0 : selectedOption.id) != null ? _b2 : null;
      const repairedSelectedId = requestedSelectedId ? repairCollectionId({
        activeId: requestedSelectedId,
        items,
        previousIds: previousComboboxIds.get(combobox)
      }) : null;
      applyListboxSelection(combobox, listbox, repairedSelectedId);
      const repairedActiveId = repairCollectionId({
        activeId: comboboxActiveIds.get(combobox),
        items,
        previousIds: previousComboboxIds.get(combobox)
      });
      setComboboxActive(combobox, listbox, repairedActiveId);
      previousComboboxIds.set(combobox, ids);
      if (emitRepair && requestedSelectedId && repairedSelectedId && requestedSelectedId !== repairedSelectedId) {
        input.value = portableOptionLabel(
          (_d2 = (_c2 = options.find((option) => option.id === repairedSelectedId)) == null ? void 0 : _c2.element) != null ? _d2 : listbox
        ) || "";
        dispatchPortableChange(combobox, "instrument:combobox-change", {
          value: repairedSelectedId
        });
      }
    };
    const removeOpenLayer = (surface) => {
      const index = openLayers.findIndex((layer) => layer.surface === surface);
      if (index >= 0) openLayers.splice(index, 1);
    };
    const measureLayer = (layer) => {
      var _a2;
      if (!layer.trigger.isConnected || !layer.surface.isConnected) return;
      const view = root.ownerDocument.defaultView;
      if (!view) return;
      const anchor = layer.trigger.getBoundingClientRect();
      const surfaceRect = layer.surface.getBoundingClientRect();
      const popover = layer.kind === "popover";
      const requestedPlacement = popover ? layer.surface.dataset.instrumentPreferredPlacement : "bottom";
      const requestedAlign = popover ? layer.surface.dataset.instrumentAlign : "start";
      const placement = resolvePopoverPlacement({
        align: ["start", "center", "end"].includes(requestedAlign != null ? requestedAlign : "") ? requestedAlign : "center",
        anchor,
        offset: Number((_a2 = layer.surface.dataset.instrumentOffset) != null ? _a2 : 8),
        placement: ["top", "right", "bottom", "left"].includes(
          requestedPlacement != null ? requestedPlacement : ""
        ) ? requestedPlacement : "bottom",
        surface: {
          height: surfaceRect.height,
          width: popover ? surfaceRect.width : Math.max(anchor.width, surfaceRect.width)
        },
        viewport: { height: view.innerHeight, width: view.innerWidth }
      });
      layer.surface.style.position = "fixed";
      layer.surface.style.left = `${placement.left}px`;
      layer.surface.style.top = `${placement.top}px`;
      layer.surface.style.maxHeight = `${placement.maxHeight}px`;
      layer.surface.style.maxWidth = `${placement.maxWidth}px`;
      if (!popover) layer.surface.style.minWidth = `${anchor.width}px`;
      layer.surface.dataset.instrumentPlacement = placement.side;
      layer.surface.dataset.instrumentAlign = placement.align;
      layer.surface.toggleAttribute("data-instrument-flipped", placement.flipped);
      layer.surface.toggleAttribute("data-instrument-shifted", placement.shifted);
    };
    const closePopover = (layer, reason, emit = true, outsideTarget) => {
      var _a2;
      layer.surface.hidden = true;
      layer.trigger.setAttribute("aria-expanded", "false");
      removeOpenLayer(layer.surface);
      if (emit) {
        const popover = (_a2 = layer.trigger.closest(".instrument-popover")) != null ? _a2 : layer.trigger;
        dispatchPortableChange(popover, "instrument:popover-change", {
          open: false,
          reason
        });
      }
      if (reason === "trigger" || reason === "escape" || reason === "outside-press" && outsideTarget && layer.surface.contains(root.ownerDocument.activeElement) && !isPortableFocusable(outsideTarget)) {
        layer.trigger.focus();
      }
    };
    const selectedComboboxLabel = (combobox, listbox) => {
      const selectedId = combobox.dataset.instrumentSelectedId;
      const option = portableOptions(listbox).find(
        (candidate) => candidate.id === selectedId
      );
      return option ? portableOptionLabel(option.element) : "";
    };
    const closeCombobox = (layer, restoreDisplay) => {
      const input = layer.trigger;
      const combobox = input.closest(".instrument-combobox");
      const listbox = layer.surface.querySelector(
        ".instrument-combobox-listbox"
      );
      layer.surface.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      removeOpenLayer(layer.surface);
      if (restoreDisplay && combobox && listbox) {
        input.value = selectedComboboxLabel(combobox, listbox);
      }
    };
    const openPopover = (trigger) => {
      var _a2, _b2, _c2, _d2;
      if (trigger.disabled || trigger.getAttribute("aria-disabled") === "true") {
        return;
      }
      const surfaceId = trigger.getAttribute("aria-controls");
      const surface = surfaceId ? root.ownerDocument.getElementById(surfaceId) : null;
      if (!(surface instanceof HTMLElement) || !root.contains(surface)) return;
      const existing = openLayers.find((layer2) => layer2.surface === surface);
      if (existing) {
        closePopover(existing, "trigger");
        return;
      }
      surface.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      (_a2 = surface.dataset).instrumentLayerId || (_a2.instrumentLayerId = surface.id);
      const parentLayer = trigger.closest(
        "[data-instrument-layer-id]"
      );
      if (parentLayer) {
        surface.dataset.instrumentLayerParent = (_b2 = parentLayer.dataset.instrumentLayerId) != null ? _b2 : parentLayer.id;
      }
      const layer = { kind: "popover", surface, trigger };
      openLayers.push(layer);
      measureLayer(layer);
      if (surface.dataset.instrumentFocusStrategy !== "preserve" && !trigger.closest("[data-instrument-focus-strategy='preserve']")) {
        (_c2 = surface.querySelector(portableFocusableSelector)) == null ? void 0 : _c2.focus();
      }
      const popover = (_d2 = trigger.closest(".instrument-popover")) != null ? _d2 : trigger;
      dispatchPortableChange(popover, "instrument:popover-change", {
        open: true,
        reason: "trigger"
      });
    };
    const openCombobox = (input, resetActive) => {
      var _a2, _b2, _c2;
      if (input.disabled || input.getAttribute("aria-disabled") === "true")
        return;
      const combobox = input.closest(".instrument-combobox");
      if (!combobox) return;
      const surface = comboboxSurface(input);
      if (!surface) return;
      if (input.id) {
        (_a2 = surface.dataset).instrumentComboboxFor || (_a2.instrumentComboboxFor = input.id);
      }
      const listbox = surface.querySelector(
        ".instrument-combobox-listbox"
      );
      if (!listbox) return;
      (_b2 = input.dataset).instrumentListboxId || (_b2.instrumentListboxId = listbox.id);
      input.setAttribute("aria-controls", listbox.id);
      const status = surface.querySelector(
        ".instrument-listbox-status"
      );
      if (status == null ? void 0 : status.id) input.setAttribute("aria-describedby", status.id);
      surface.hidden = false;
      input.setAttribute("aria-expanded", "true");
      const parentLayer = input.closest(
        "[data-instrument-layer-id]"
      );
      if (parentLayer) {
        surface.dataset.instrumentLayerParent = (_c2 = parentLayer.dataset.instrumentLayerId) != null ? _c2 : parentLayer.id;
      }
      filterCombobox(combobox, input, resetActive);
      removeOpenLayer(surface);
      const layer = { kind: "combobox", surface, trigger: input };
      openLayers.push(layer);
      measureLayer(layer);
    };
    const syncWaveOne = (emitRepair) => {
      for (const tabs of root.querySelectorAll(".instrument-tabs")) {
        syncTabs(tabs, emitRepair);
      }
      for (const toolbar of root.querySelectorAll(
        ".instrument-toolbar"
      )) {
        syncToolbar(toolbar);
      }
      for (const listbox of root.querySelectorAll(
        ".instrument-listbox-shell .instrument-listbox"
      )) {
        syncStandaloneListbox(listbox, emitRepair);
      }
      for (const combobox of root.querySelectorAll(
        ".instrument-combobox"
      )) {
        syncCombobox(combobox, emitRepair);
      }
    };
    const dispatch = (action) => {
      if (destroyed) return state;
      state = instrumentReducer(state, action);
      applyInstrumentState(root, state);
      root.dispatchEvent(
        new CustomEvent("instrument:state", {
          bubbles: true,
          detail: serializeInstrumentState(state)
        })
      );
      return state;
    };
    const handleClick = (event) => {
      var _a2, _b2, _c2, _d2, _e2;
      const eventTarget = event.target;
      const dialogClose = eventTarget == null ? void 0 : eventTarget.closest(
        "[data-instrument-dialog-close]"
      );
      if (dialogClose && root.contains(dialogClose)) {
        const layer = dialogClose.closest(".instrument-portal");
        const entry = openDialogs.find((candidate) => candidate.layer === layer);
        if (entry) closeDialog(entry);
        return;
      }
      const dialogTrigger = eventTarget == null ? void 0 : eventTarget.closest(
        "[data-instrument-dialog-trigger]"
      );
      if (dialogTrigger && root.contains(dialogTrigger)) {
        if (!event.defaultPrevented && !portableItemDisabled(dialogTrigger)) {
          openDialog(dialogTrigger);
        }
        return;
      }
      const tab = eventTarget == null ? void 0 : eventTarget.closest(
        '.instrument-tabs-list button[role="tab"]'
      );
      if (tab && root.contains(tab)) {
        const tabs = tab.closest(".instrument-tabs");
        if (tabs) selectTab(tabs, tab);
        return;
      }
      const popoverTrigger = eventTarget == null ? void 0 : eventTarget.closest(
        ".instrument-popover-trigger"
      );
      if (popoverTrigger && root.contains(popoverTrigger)) {
        if (!event.defaultPrevented) openPopover(popoverTrigger);
        return;
      }
      const option = eventTarget == null ? void 0 : eventTarget.closest(
        ".instrument-listbox-option"
      );
      if (option && root.contains(option) && !portableItemDisabled(option)) {
        const listbox = option.closest(".instrument-listbox");
        if (listbox == null ? void 0 : listbox.classList.contains("instrument-combobox-listbox")) {
          const surface = listbox.closest(
            ".instrument-combobox-surface"
          );
          const inputId = surface == null ? void 0 : surface.dataset.instrumentComboboxFor;
          const input = inputId ? root.ownerDocument.getElementById(inputId) : null;
          const combobox = input instanceof HTMLInputElement ? input.closest(".instrument-combobox") : null;
          const id2 = portableOptionId(option);
          if (surface && input instanceof HTMLInputElement && combobox && id2) {
            applyListboxSelection(combobox, listbox, id2);
            setComboboxActive(combobox, listbox, id2);
            input.value = portableOptionLabel(option);
            const layer = openLayers.find(
              (candidate) => candidate.surface === surface
            );
            if (layer) closeCombobox(layer, false);
            dispatchPortableChange(combobox, "instrument:combobox-change", {
              value: id2
            });
          }
          return;
        }
        const shell = listbox == null ? void 0 : listbox.closest(".instrument-listbox-shell");
        const id = portableOptionId(option);
        if (listbox && shell && id) {
          applyListboxSelection(shell, listbox, id);
          dispatchPortableChange(shell, "instrument:listbox-change", {
            value: id
          });
        }
        return;
      }
      const comboboxClick = eventTarget == null ? void 0 : eventTarget.closest(
        'input.instrument-combobox-input[role="combobox"]'
      );
      if (comboboxClick && root.contains(comboboxClick)) {
        if (!event.defaultPrevented) openCombobox(comboboxClick, false);
        return;
      }
      const copyAction = eventTarget == null ? void 0 : eventTarget.closest(
        "[data-instrument-code-copy]"
      );
      if (copyAction && root.contains(copyAction)) {
        const value = (_a2 = copyAction.dataset.instrumentCopyValue) != null ? _a2 : "";
        const clipboard = (_c2 = (_b2 = root.ownerDocument.defaultView) == null ? void 0 : _b2.navigator.clipboard) == null ? void 0 : _c2.writeText;
        if (!clipboard) {
          copyAction.dataset.instrumentCopyState = "error";
          copyAction.textContent = "Copy failed";
          return;
        }
        clipboard.call((_d2 = root.ownerDocument.defaultView) == null ? void 0 : _d2.navigator.clipboard, value).then(() => {
          copyAction.dataset.instrumentCopyState = "copied";
          copyAction.textContent = "Copied";
        }).catch(() => {
          copyAction.dataset.instrumentCopyState = "error";
          copyAction.textContent = "Copy failed";
        });
        return;
      }
      const target = eventTarget == null ? void 0 : eventTarget.closest(
        "[data-instrument-coordinate]"
      );
      if (!target || !root.contains(target)) return;
      const coordinate = target.dataset.instrumentCoordinate;
      if (!coordinate) return;
      const shouldRestoreStationFocus = target.classList.contains(
        "instrument-sheet-close"
      );
      const action = actionForCoordinate(
        coordinate,
        state,
        (_e2 = sheetQuery == null ? void 0 : sheetQuery.matches) != null ? _e2 : false
      );
      if (!action) return;
      dispatch(action);
      if (shouldRestoreStationFocus) {
        queueMicrotask(() => {
          var _a3;
          (_a3 = root.querySelector(
            `.instrument-mode-dock [data-instrument-coordinate="${coordinate}"]`
          )) == null ? void 0 : _a3.focus();
        });
      }
    };
    const handleInput = (event) => {
      const input = event.target;
      if (input instanceof HTMLInputElement && input.classList.contains("instrument-combobox-input")) {
        const combobox = input.closest(".instrument-combobox");
        if (combobox) {
          openCombobox(input, true);
        }
        return;
      }
      if (input instanceof HTMLInputElement && input.type === "range") {
        syncRangeVisual(input);
        syncRangePairVisual(input);
      }
      if (input instanceof HTMLTextAreaElement && input.classList.contains("instrument-prompt-input")) {
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;
      }
    };
    const handleKeyDown = (event) => {
      var _a2, _b2, _c2, _d2;
      const eventTarget = event.target;
      const activeDialog = openDialogs.at(-1);
      if (activeDialog && !activeDialog.layer.hidden && !event.defaultPrevented) {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeDialog(activeDialog);
          return;
        }
        if (event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey) {
          const activeLayer = openLayers.at(-1);
          if ((activeLayer == null ? void 0 : activeLayer.kind) === "combobox" && activeLayer.trigger === root.ownerDocument.activeElement) {
            closeCombobox(activeLayer, true);
          }
          const candidates = portableDialogFocusables(activeDialog.dialog);
          const activeIndex = candidates.indexOf(
            root.ownerDocument.activeElement
          );
          const nextIndex = event.shiftKey ? activeIndex <= 0 ? candidates.length - 1 : activeIndex - 1 : activeIndex < 0 || activeIndex === candidates.length - 1 ? 0 : activeIndex + 1;
          event.preventDefault();
          ((_a2 = candidates[nextIndex]) != null ? _a2 : activeDialog.dialog).focus();
          return;
        }
      }
      const tab = eventTarget == null ? void 0 : eventTarget.closest(
        '.instrument-tabs-list button[role="tab"]'
      );
      if (tab && root.contains(tab)) {
        const tabs = tab.closest(".instrument-tabs");
        if (!tabs) return;
        if (tabs.dataset.instrumentActivation === "manual" && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          selectTab(tabs, tab);
          return;
        }
        const nextId = resolveCollectionTarget({
          activeId: portableTabId(tab),
          dir: resolvedPortableDirection(tabs),
          items: tabButtons(tabs).map((button) => ({
            disabled: portableItemDisabled(button),
            id: portableTabId(button)
          })),
          key: event.key,
          loop: tabs.dataset.instrumentLoop !== "false",
          orientation: tabs.dataset.instrumentOrientation === "vertical" ? "vertical" : "horizontal"
        });
        if (!nextId) return;
        const next = tabButtons(tabs).find(
          (button) => portableTabId(button) === nextId
        );
        if (!next) return;
        event.preventDefault();
        for (const button of tabButtons(tabs)) {
          button.tabIndex = button === next ? 0 : -1;
        }
        next.focus();
        (_b2 = next.scrollIntoView) == null ? void 0 : _b2.call(next, { block: "nearest", inline: "nearest" });
        if (tabs.dataset.instrumentActivation !== "manual") {
          selectTab(tabs, next);
        }
        return;
      }
      const toolbarItem = eventTarget == null ? void 0 : eventTarget.closest(
        "button[data-instrument-toolbar-item]"
      );
      if (toolbarItem && root.contains(toolbarItem)) {
        const toolbar = toolbarItem.closest(".instrument-toolbar");
        if (!toolbar) return;
        const buttons = toolbarButtons(toolbar);
        const nextId = resolveCollectionTarget({
          activeId: portableToolbarId(toolbarItem),
          dir: resolvedPortableDirection(toolbar),
          items: buttons.map((button) => ({
            disabled: portableItemDisabled(button),
            id: portableToolbarId(button)
          })),
          key: event.key,
          loop: toolbar.dataset.instrumentLoop !== "false",
          orientation: toolbar.dataset.instrumentOrientation === "vertical" ? "vertical" : "horizontal"
        });
        if (!nextId) return;
        const next = buttons.find(
          (button) => portableToolbarId(button) === nextId
        );
        if (!next) return;
        event.preventDefault();
        toolbarFocusIds.set(toolbar, nextId);
        for (const button of buttons) {
          button.tabIndex = button === next ? 0 : -1;
        }
        next.focus();
        return;
      }
      const comboboxInputTarget = eventTarget == null ? void 0 : eventTarget.closest(
        'input.instrument-combobox-input[role="combobox"]'
      );
      if (comboboxInputTarget && root.contains(comboboxInputTarget)) {
        const combobox = comboboxInputTarget.closest(
          ".instrument-combobox"
        );
        const surface = combobox ? comboboxSurface(comboboxInputTarget) : null;
        const listbox2 = surface == null ? void 0 : surface.querySelector(
          ".instrument-combobox-listbox"
        );
        if (!combobox || !surface || !listbox2) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          openCombobox(comboboxInputTarget, false);
          const available = portableOptions(listbox2).filter(
            (option) => !option.disabled && !option.element.hidden
          );
          const nextId = resolveCollectionTarget({
            activeId: comboboxActiveIds.get(combobox),
            items: available,
            key: event.key,
            orientation: "vertical"
          });
          setComboboxActive(combobox, listbox2, nextId);
          return;
        }
        if (event.key === "Enter" && comboboxInputTarget.getAttribute("aria-expanded") === "true") {
          const activeId = comboboxActiveIds.get(combobox);
          const active = portableOptions(listbox2).find(
            (option) => option.id === activeId && !option.disabled && !option.element.hidden
          );
          if (active) {
            event.preventDefault();
            applyListboxSelection(combobox, listbox2, active.id);
            comboboxInputTarget.value = portableOptionLabel(active.element);
            const layer = openLayers.find(
              (candidate) => candidate.surface === surface
            );
            if (layer) closeCombobox(layer, false);
            dispatchPortableChange(combobox, "instrument:combobox-change", {
              value: active.id
            });
          }
          return;
        }
        if (event.key === "Tab" && comboboxInputTarget.getAttribute("aria-expanded") === "true") {
          const layer = openLayers.find(
            (candidate) => candidate.surface === surface
          );
          if (layer) closeCombobox(layer, true);
        }
        return;
      }
      const listbox = eventTarget == null ? void 0 : eventTarget.closest(
        ".instrument-listbox-shell .instrument-listbox"
      );
      if (listbox && root.contains(listbox) && !listbox.classList.contains("instrument-combobox-listbox")) {
        const options = portableOptions(listbox);
        const activeDomId = listbox.getAttribute("aria-activedescendant");
        const active = options.find(
          (option) => option.element.id === activeDomId || option.element.hasAttribute("data-instrument-active")
        );
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          const nextId = resolveCollectionTarget({
            activeId: active == null ? void 0 : active.id,
            items: options,
            key: event.key,
            loop: ((_c2 = listbox.closest(".instrument-listbox-shell")) == null ? void 0 : _c2.dataset.instrumentLoop) !== "false",
            orientation: "vertical"
          });
          if (nextId) {
            event.preventDefault();
            applyListboxActive(listbox, nextId);
          }
          return;
        }
        if ((event.key === "Enter" || event.key === " ") && active) {
          event.preventDefault();
          const shell = listbox.closest(".instrument-listbox-shell");
          if (shell) {
            applyListboxSelection(shell, listbox, active.id);
            dispatchPortableChange(shell, "instrument:listbox-change", {
              value: active.id
            });
          }
          return;
        }
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          const state2 = (_d2 = listboxTypeahead.get(listbox)) != null ? _d2 : {
            query: "",
            timer: null
          };
          state2.query += normalizePortableSearch(event.key);
          if (state2.timer) clearTimeout(state2.timer);
          state2.timer = setTimeout(() => {
            state2.query = "";
            state2.timer = null;
          }, 500);
          listboxTypeahead.set(listbox, state2);
          const match = options.find(
            (option) => !option.disabled && normalizePortableSearch(
              portableOptionLabel(option.element)
            ).startsWith(state2.query)
          );
          if (match) {
            event.preventDefault();
            applyListboxActive(listbox, match.id);
          }
          return;
        }
      }
      const input = event.target;
      if (!(input instanceof HTMLTextAreaElement) || !input.classList.contains("instrument-prompt-input")) {
        return;
      }
      const prompt = input.closest(".instrument-prompt");
      const mode = (prompt == null ? void 0 : prompt.dataset.instrumentPromptMode) === "single" ? "single" : "multiline";
      const shouldSubmit = mode === "single" ? event.key === "Enter" && !event.shiftKey : event.key === "Enter" && (event.metaKey || event.ctrlKey);
      if (!shouldSubmit) return;
      event.preventDefault();
      input.dispatchEvent(
        new CustomEvent("instrument:prompt-submit", {
          bubbles: true,
          detail: { mode, value: input.value }
        })
      );
    };
    const handleFocusIn = (event) => {
      const eventTarget = event.target;
      const tab = eventTarget == null ? void 0 : eventTarget.closest(
        '.instrument-tabs-list button[role="tab"]'
      );
      if (tab && root.contains(tab) && !portableItemDisabled(tab)) {
        const tabs = tab.closest(".instrument-tabs");
        if (tabs) {
          for (const button of tabButtons(tabs)) {
            button.tabIndex = button === tab ? 0 : -1;
          }
        }
        return;
      }
      const toolbarItem = eventTarget == null ? void 0 : eventTarget.closest(
        "button[data-instrument-toolbar-item]"
      );
      if (toolbarItem && root.contains(toolbarItem) && !portableItemDisabled(toolbarItem)) {
        const toolbar = toolbarItem.closest(".instrument-toolbar");
        if (toolbar) {
          toolbarFocusIds.set(toolbar, portableToolbarId(toolbarItem));
          for (const button of toolbarButtons(toolbar)) {
            button.tabIndex = button === toolbarItem ? 0 : -1;
          }
        }
        return;
      }
      const input = eventTarget == null ? void 0 : eventTarget.closest(
        'input.instrument-combobox-input[role="combobox"]'
      );
      if (input && root.contains(input) && !event.defaultPrevented) {
        openCombobox(input, false);
        return;
      }
      const listbox = eventTarget == null ? void 0 : eventTarget.closest(
        ".instrument-listbox-shell .instrument-listbox"
      );
      if (listbox && root.contains(listbox) && !listbox.classList.contains("instrument-combobox-listbox") && !listbox.getAttribute("aria-activedescendant")) {
        syncStandaloneListbox(listbox, false);
      }
    };
    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    root.addEventListener("focusin", handleFocusIn);
    const padSurfaces = /* @__PURE__ */ new Map();
    const clampUnit = (n) => Math.min(1, Math.max(0, n));
    const paintPad = (surface, event) => {
      const rect = surface.getBoundingClientRect();
      const x = clampUnit((event.clientX - rect.left) / (rect.width || 1));
      const y = clampUnit((event.clientY - rect.top) / (rect.height || 1));
      const indicator = surface.querySelector(
        ".instrument-vector-pad-indicator"
      );
      indicator == null ? void 0 : indicator.style.setProperty("--instrument-pad-x", String(x));
      indicator == null ? void 0 : indicator.style.setProperty("--instrument-pad-y", String(y));
      surface.dispatchEvent(
        new CustomEvent("instrument:vector", { bubbles: true, detail: { x, y } })
      );
    };
    const handlePadPointerDown = (event) => {
      var _a2, _b2, _c2;
      const option = (_a2 = event.target) == null ? void 0 : _a2.closest(
        ".instrument-combobox-listbox .instrument-listbox-option"
      );
      if (option && root.contains(option)) {
        event.preventDefault();
        return;
      }
      const surface = (_b2 = event.target) == null ? void 0 : _b2.closest(
        ".instrument-vector-pad-surface"
      );
      if (!surface || !root.contains(surface)) return;
      if (surface.closest("[data-instrument-disabled]")) return;
      padSurfaces.set(event.pointerId, surface);
      (_c2 = surface.setPointerCapture) == null ? void 0 : _c2.call(surface, event.pointerId);
      paintPad(surface, event);
    };
    const handlePadPointerMove = (event) => {
      var _a2;
      const option = (_a2 = event.target) == null ? void 0 : _a2.closest(
        ".instrument-listbox-option"
      );
      if (option && root.contains(option) && !portableItemDisabled(option)) {
        const listbox = option.closest(".instrument-listbox");
        const id = portableOptionId(option);
        if (listbox && id) {
          if (listbox.classList.contains("instrument-combobox-listbox")) {
            const surface2 = listbox.closest(
              ".instrument-combobox-surface"
            );
            const inputId = surface2 == null ? void 0 : surface2.dataset.instrumentComboboxFor;
            const input = inputId ? root.ownerDocument.getElementById(inputId) : null;
            const combobox = input instanceof HTMLInputElement ? input.closest(".instrument-combobox") : null;
            if (combobox && comboboxActiveIds.get(combobox) !== id) {
              setComboboxActive(combobox, listbox, id);
            }
          } else {
            if (!option.hasAttribute("data-instrument-active")) {
              applyListboxActive(listbox, id);
            }
          }
        }
      }
      const surface = padSurfaces.get(event.pointerId);
      if (surface) paintPad(surface, event);
    };
    const handlePadPointerUp = (event) => {
      var _a2;
      const surface = padSurfaces.get(event.pointerId);
      if (!surface) return;
      (_a2 = surface.releasePointerCapture) == null ? void 0 : _a2.call(surface, event.pointerId);
      padSurfaces.delete(event.pointerId);
    };
    root.addEventListener("pointerdown", handlePadPointerDown);
    root.addEventListener("pointermove", handlePadPointerMove);
    root.addEventListener("pointerup", handlePadPointerUp);
    root.addEventListener("pointercancel", handlePadPointerUp);
    root.addEventListener("keydown", handleKeyDown);
    const handleDocumentPointerDown = (event) => {
      const layer = openLayers.at(-1);
      const target = event.target;
      if (!layer || !(target instanceof Node)) return;
      const targetElement = target instanceof Element ? target : target.parentElement;
      const logicalChild = layer.surface.id && (targetElement == null ? void 0 : targetElement.closest(
        `[data-instrument-layer-parent="${layer.surface.id}"]`
      ));
      if (layer.surface.contains(target) || layer.trigger.contains(target) || logicalChild) {
        return;
      }
      if (layer.kind === "popover") {
        closePopover(layer, "outside-press", true, target);
      } else {
        closeCombobox(layer, true);
      }
    };
    const handleDocumentKeyDown = (event) => {
      if (event.key !== "Escape") return;
      const layer = openLayers.at(-1);
      if (!layer) return;
      event.preventDefault();
      event.stopPropagation();
      if (layer.kind === "popover") closePopover(layer, "escape");
      else closeCombobox(layer, true);
    };
    root.ownerDocument.addEventListener(
      "pointerdown",
      handleDocumentPointerDown,
      true
    );
    root.ownerDocument.addEventListener("keydown", handleDocumentKeyDown, true);
    const handleViewportChange = () => {
      for (const layer of openLayers) measureLayer(layer);
    };
    (_c = root.ownerDocument.defaultView) == null ? void 0 : _c.addEventListener(
      "resize",
      handleViewportChange
    );
    (_d = root.ownerDocument.defaultView) == null ? void 0 : _d.addEventListener(
      "scroll",
      handleViewportChange,
      true
    );
    const waveObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver(() => {
      var _a2;
      if (destroyed) return;
      for (const layer of [...openLayers]) {
        if (!root.contains(layer.trigger) || !root.contains(layer.surface) || portableItemDisabled(layer.trigger)) {
          removeOpenLayer(layer.surface);
          if (root.contains(layer.surface) || !layer.surface.isConnected) {
            layer.surface.hidden = true;
          }
          if (root.contains(layer.trigger) || !layer.trigger.isConnected) {
            layer.trigger.setAttribute("aria-expanded", "false");
          }
          if (root.contains(layer.trigger)) {
            if (layer.kind === "popover") {
              const popover = (_a2 = layer.trigger.closest(".instrument-popover")) != null ? _a2 : layer.trigger;
              dispatchPortableChange(popover, "instrument:popover-change", {
                open: false,
                reason: "anchor-loss"
              });
            } else {
              const input = layer.trigger;
              const combobox = input.closest(
                ".instrument-combobox"
              );
              const listbox = layer.surface.querySelector(
                ".instrument-combobox-listbox"
              );
              input.removeAttribute("aria-activedescendant");
              if (combobox && listbox) {
                input.value = selectedComboboxLabel(combobox, listbox);
              }
            }
          }
        }
      }
      for (const entry of [...openDialogs]) {
        if (!root.contains(entry.trigger) || !root.contains(entry.layer) || !root.contains(entry.dialog)) {
          removeOpenDialog(entry.layer);
          if (root.contains(entry.layer) || !entry.layer.isConnected) {
            entry.layer.hidden = true;
          }
          if (root.contains(entry.trigger) || !entry.trigger.isConnected) {
            entry.trigger.setAttribute("aria-expanded", "false");
          }
        }
      }
      syncWaveOne(true);
      syncDialogs();
    });
    waveObserver == null ? void 0 : waveObserver.observe(root, { childList: true, subtree: true });
    const handleSheetQueryChange = () => applyInstrumentState(root, state);
    (_e = sheetQuery == null ? void 0 : sheetQuery.addEventListener) == null ? void 0 : _e.call(sheetQuery, "change", handleSheetQueryChange);
    for (const input of root.querySelectorAll(
      'input[type="range"]'
    )) {
      syncRangeVisual(input);
      syncRangePairVisual(input);
    }
    for (const input of root.querySelectorAll(
      ".instrument-prompt-input"
    )) {
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
    }
    syncWaveOne(false);
    syncDialogs();
    applyInstrumentState(root, state);
    return {
      getState: () => state,
      dispatch,
      destroy() {
        var _a2, _b2, _c2;
        if (destroyed) return;
        destroyed = true;
        root.removeEventListener("click", handleClick);
        root.removeEventListener("input", handleInput);
        root.removeEventListener("focusin", handleFocusIn);
        root.removeEventListener("keydown", handleKeyDown);
        root.removeEventListener("pointerdown", handlePadPointerDown);
        root.removeEventListener("pointermove", handlePadPointerMove);
        root.removeEventListener("pointerup", handlePadPointerUp);
        root.removeEventListener("pointercancel", handlePadPointerUp);
        root.ownerDocument.removeEventListener(
          "pointerdown",
          handleDocumentPointerDown,
          true
        );
        root.ownerDocument.removeEventListener(
          "keydown",
          handleDocumentKeyDown,
          true
        );
        (_a2 = root.ownerDocument.defaultView) == null ? void 0 : _a2.removeEventListener(
          "resize",
          handleViewportChange
        );
        (_b2 = root.ownerDocument.defaultView) == null ? void 0 : _b2.removeEventListener(
          "scroll",
          handleViewportChange,
          true
        );
        waveObserver == null ? void 0 : waveObserver.disconnect();
        for (const { timer } of listboxTypeahead.values()) {
          if (timer) clearTimeout(timer);
        }
        listboxTypeahead.clear();
        for (const layer of [...openLayers]) {
          if (layer.kind === "popover") {
            closePopover(layer, "anchor-loss", false);
          } else {
            closeCombobox(layer, true);
          }
        }
        for (const dialog of [...openDialogs].reverse()) {
          closeDialog(dialog);
        }
        padSurfaces.clear();
        (_c2 = sheetQuery == null ? void 0 : sheetQuery.removeEventListener) == null ? void 0 : _c2.call(sheetQuery, "change", handleSheetQueryChange);
      }
    };
  }
  function serializeInstrumentState(state) {
    return JSON.stringify(state);
  }
  function mountPortableFixture(root) {
    root.dataset.system = "instrument";
    root.innerHTML = `
		<div class="instrument-material-grid" aria-hidden="true"></div>
		<div class="instrument-material-grain" aria-hidden="true"></div>
		<div class="instrument-shell" data-instrument-overview="visible" data-instrument-inspector="wide" data-instrument-active-sheet="none">
			<header class="instrument-chrome">
				<div class="instrument-chrome-zone instrument-chrome-zone--brand"><div class="instrument-brand" aria-label="SUPERMEGA"><span class="instrument-brand-signal" aria-hidden="true"></span><span>SUPER</span><span class="instrument-brand-slash" aria-hidden="true">/</span><span>MEGA</span></div></div>
				<nav class="instrument-chrome-zone" aria-label="Instrument modes"><a href="#work">Work</a></nav>
				<div class="instrument-chrome-zone">Portable proof</div>
			</header>
			<aside class="instrument-overview" aria-label="Overview"><button class="instrument-sheet-close" type="button" data-instrument-coordinate="overview"><span>Close Overview</span><span aria-hidden="true">−</span></button><div class="instrument-help">One source. Two dialects.</div></aside>
			<main class="instrument-work" aria-label="Work">
				<section class="instrument-panel" aria-labelledby="portable-panel-title">
					<div class="instrument-panel-header"><h2 class="instrument-panel-title" id="portable-panel-title">Fixture</h2></div>
					<div class="instrument-group">
						<div class="instrument-row"><label class="instrument-row-label" for="portable-range">Range</label><div class="instrument-row-control"><input class="instrument-range" id="portable-range" type="range" min="0" max="100" value="54"></div><output class="instrument-row-value instrument-tabular" for="portable-range">54 %</output></div>
						<div class="instrument-row"><label class="instrument-row-label" for="portable-text">Text</label><div class="instrument-row-control"><input class="instrument-control instrument-text-field" id="portable-text" value="SUPERMEGA"></div><span class="instrument-row-value instrument-tabular">08</span></div>
						<div class="instrument-row"><span class="instrument-row-label">Choice</span><div class="instrument-row-control"><input class="instrument-choice" id="portable-choice-a" type="radio" name="portable-choice" checked><label for="portable-choice-a">A</label><input class="instrument-choice" id="portable-choice-b" type="radio" name="portable-choice"><label for="portable-choice-b">B</label></div><button class="instrument-swatch" type="button" aria-label="Red swatch" style="background:#f61515"></button></div>
						<div class="instrument-curves"><div class="instrument-curves-plot"><svg class="instrument-curves-svg" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100"><line class="instrument-curves-reference" x1="0" y1="100" x2="100" y2="0"></line><path class="instrument-curves-path" d="M 0 100 L 50 35 L 100 0"></path></svg><div class="instrument-curves-point" role="slider" tabindex="0" aria-label="Point 1 of 3" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0" aria-valuetext="x 0.00, y 0.00" style="--instrument-curve-x:0;--instrument-curve-y:0"></div><div class="instrument-curves-point" role="slider" tabindex="-1" aria-label="Point 2 of 3" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0.65" aria-valuetext="x 0.50, y 0.65" style="--instrument-curve-x:.5;--instrument-curve-y:.65"></div><div class="instrument-curves-point" role="slider" tabindex="-1" aria-label="Point 3 of 3" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-valuetext="x 1.00, y 1.00" style="--instrument-curve-x:1;--instrument-curve-y:1"></div></div></div>
						<div class="instrument-gradient-field"><div class="instrument-gradient-header"><select class="instrument-control instrument-gradient-type" aria-label="Wash type"><option selected>Linear</option><option>Radial</option></select><button class="instrument-action instrument-gradient-add" type="button" aria-label="Add stop">+</button></div><div class="instrument-gradient-strip" style="--instrument-gradient-preview:linear-gradient(90deg, #1e1e1e 0%, #f61515 100%)"><button class="instrument-gradient-handle" type="button" aria-label="Stop 1 handle" style="--instrument-gradient-stop:0%"></button><button class="instrument-gradient-handle" type="button" aria-label="Stop 2 handle" style="--instrument-gradient-stop:100%"></button></div></div>
						<span class="instrument-color-field"><span class="instrument-color-swatch" style="background:#f61515"><input class="instrument-color-picker" type="color" value="#f61515" aria-label="Fill picker"></span><input class="instrument-control instrument-text-field instrument-color-hex" value="#f61515" aria-label="Fill"></span>
					</div>
					<div class="instrument-panel-footer"><div class="instrument-progress" role="progressbar" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0.5" style="--instrument-progress:50%"></div><p class="instrument-status-line" aria-live="polite"></p><button class="instrument-action" type="button">Apply</button></div>
				</section>
				<fieldset class="instrument-choice-group" aria-label="Quality"><label class="instrument-choice-label"><input class="instrument-choice" type="radio" name="portable-quality" value="draft"><span>Draft</span></label><label class="instrument-choice-label"><input class="instrument-choice" type="radio" name="portable-quality" value="proof" checked><span>Proof</span></label></fieldset>
				<fieldset class="instrument-vector-pad" aria-label="Vector"><div class="instrument-vector-pad-surface" tabindex="-1"><div class="instrument-vector-pad-indicator" style="--instrument-pad-x:.4;--instrument-pad-y:.6"></div></div><div class="instrument-vector-pad-axes"><div class="instrument-vector-pad-axis"><span class="instrument-vector-pad-axis-label">X</span><div class="instrument-vector-pad-axis-value instrument-tabular" role="slider" tabindex="0" aria-label="X" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0.4">0.40</div></div><div class="instrument-vector-pad-axis"><span class="instrument-vector-pad-axis-label">Y</span><div class="instrument-vector-pad-axis-value instrument-tabular" role="slider" tabindex="0" aria-label="Y" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0.6">0.60</div></div></div></fieldset>
				<fieldset class="instrument-range-pair" aria-label="Span" style="--instrument-range-fill-a:24%;--instrument-range-fill-b:76%"><input class="instrument-range-pair-input" data-instrument-thumb="lower" type="range" min="0" max="100" value="24" name="portable-span-lower" aria-label="Span lower"><input class="instrument-range-pair-input" data-instrument-thumb="upper" type="range" min="0" max="100" value="76" name="portable-span-upper" aria-label="Span upper"></fieldset>
				<fieldset class="instrument-anchor-grid" aria-label="Anchor"><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="top-left" aria-label="Top left"><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="top-center" aria-label="Top center"><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="top-right" aria-label="Top right"><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="center-left" aria-label="Center left"><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="center" aria-label="Center" checked><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="center-right" aria-label="Center right"><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="bottom-left" aria-label="Bottom left"><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="bottom-center" aria-label="Bottom center"><input class="instrument-anchor-cell" type="radio" name="portable-anchor" value="bottom-right" aria-label="Bottom right"></fieldset>
				<fieldset class="instrument-thumb-grid" aria-label="Preset" data-instrument-columns="2"><label class="instrument-thumb-grid-cell"><input class="instrument-thumb-grid-input" type="radio" name="portable-thumb" value="ink" checked><img class="instrument-thumb-grid-image" alt="Ink preset" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23111111'/%3E%3C/svg%3E"></label><label class="instrument-thumb-grid-cell"><input class="instrument-thumb-grid-input" type="radio" name="portable-thumb" value="paper"><img class="instrument-thumb-grid-image" alt="Paper preset" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23ffffff'/%3E%3C/svg%3E"></label></fieldset>
				<label class="instrument-choice-label"><input class="instrument-switch" id="portable-switch-grid" type="checkbox" role="switch" checked><span>Grid</span></label>
				<label class="instrument-choice-label"><input class="instrument-switch" id="portable-switch-grain" type="checkbox" role="switch"><span>Grain</span></label>
				<details class="instrument-disclosure" open><summary><span class="instrument-disclosure-label">Evidence</span><span class="instrument-disclosure-meta instrument-tabular">03 proofs</span></summary><div class="instrument-disclosure-body">Three checks passed.</div></details>
				<div class="instrument-metrics"><div class="instrument-metric"><span class="instrument-metric-value instrument-tabular">03</span><span class="instrument-metric-label">Proofs</span></div></div>
				<div class="instrument-table-scroll"><table class="instrument-table" data-instrument-variant="ruled"><thead><tr><th scope="col">Engine</th></tr></thead><tbody><tr><td>Ink Lab</td></tr></tbody></table></div>
				<figure class="instrument-code" data-instrument-language="shell"><figcaption><span>shell</span><button type="button" class="instrument-code-copy" data-instrument-code-copy data-instrument-copy-value="pnpm test" data-instrument-copy-state="idle">Copy</button></figcaption><div class="instrument-code-scroll"><code class="instrument-code-lines"><span class="instrument-code-row"><span class="instrument-code-gutter instrument-tabular">01</span><span class="instrument-code-line"><span data-instrument-code-tone="plain">pnpm test</span></span></span></code></div></figure>
				<ul class="instrument-list"><li><span class="instrument-list-square" aria-hidden="true"></span><span>Keyboard</span></li></ul>
				<section class="instrument-terminal" role="log" aria-label="Proof"><header class="instrument-terminal-header">Proof</header><div class="instrument-terminal-body"><div class="instrument-terminal-line" data-instrument-tone="positive"><span>PASSED</span></div></div></section>
				<textarea class="instrument-control instrument-textarea" aria-label="Notes">Measured.</textarea>
				<figure class="instrument-json"><figcaption>JSON</figcaption><details class="instrument-json-node" open><summary><span>Object</span><span class="instrument-tabular">{1}</span></summary><div class="instrument-json-children"><div class="instrument-json-leaf"><span>proof</span><code>true</code></div></div></details></figure>
				<figure class="instrument-compare"><div class="instrument-compare-head"><span>Before</span><span>After</span></div><div class="instrument-compare-row"><del><span class="instrument-compare-gutter instrument-tabular">01</span>old</del><ins><span class="instrument-compare-gutter instrument-tabular">01</span>new</ins></div></figure>
				<figure class="instrument-graph"><svg viewBox="0 0 100 40" role="img" aria-label="Accuracy" preserveAspectRatio="none"><title>Accuracy</title><polyline points="0,40 100,0"></polyline></svg><div class="instrument-graph-legend"><span><i></i>Run</span></div></figure>
				<figure class="instrument-chart" data-instrument-chart="line"><header>Accuracy catalogue</header><div class="instrument-chart-body"><svg viewBox="0 0 100 60" role="img" aria-label="Accuracy catalogue"><title>Accuracy catalogue</title><g class="instrument-chart-grid" aria-hidden="true"><path d="M10 8H94M10 19H94M10 30H94M10 41H94M10 52H94"></path><path d="M10 8V52M31 8V52M52 8V52M73 8V52M94 8V52"></path></g><polyline class="instrument-chart-line" style="--instrument-chart-color:var(--instrument-graph-option-1)" points="10,48 94,12"></polyline></svg></div></figure>
				<div class="instrument-matrix-scroll"><table class="instrument-matrix" aria-label="Matrix"><thead><tr><th></th><th scope="col">A</th></tr></thead><tbody><tr><th scope="row">A</th><td class="instrument-tabular">1.00</td></tr></tbody></table></div>
				<figure class="instrument-ratios"><div class="instrument-ratio"><span>Context</span><meter min="0" max="100" value="72">72/100</meter><output class="instrument-tabular">72</output></div></figure>
				<figure class="instrument-stacks"><div class="instrument-stack-legend"><span><i></i>Pass</span></div><div class="instrument-stack-row"><span>Proof</span><div><i style="--instrument-stack-share:100%;--instrument-series-color:var(--instrument-graph-option-1)"></i></div></div></figure>
				<figure class="instrument-dumbbells"><div class="instrument-dumbbell"><span>Contrast</span><div class="instrument-dumbbell-track" style="--instrument-before:30%;--instrument-after:70%;--instrument-span-start:30%;--instrument-span-size:40%"><i data-instrument-point="before"></i><i data-instrument-span></i><i data-instrument-point="after"></i></div><output class="instrument-tabular">7</output></div></figure>
				<figure class="instrument-pipeline"><div class="instrument-pipeline-rail"><div class="instrument-pipeline-stage"><strong>Source</strong></div><div class="instrument-pipeline-stage"><strong>Proof</strong></div></div></figure>
				<figure class="instrument-sparklines"><div class="instrument-sparkline"><span>Loss</span><svg viewBox="0 0 100 24" aria-hidden="true"><polyline points="0,4 100,20"></polyline></svg><output class="instrument-tabular">0.2</output></div></figure>
				<figure class="instrument-transcript"><div role="log" aria-label="Transcript"><div class="instrument-transcript-line"><strong>Agent</strong><span>Passed</span><time class="instrument-tabular">00:08</time></div></div></figure>
				<div class="instrument-heatmap-scroll"><table class="instrument-heatmap" aria-label="Heatmap"><thead><tr><th></th><th scope="col">01</th></tr></thead><tbody><tr><th scope="row">Token</th><td class="instrument-tabular" style="--instrument-heat:.8">0.80</td></tr></tbody></table></div>
				<a class="instrument-navigation-tab" href="#fixture" aria-current="page">Fixture</a>
				<details class="instrument-menu"><summary>Commands</summary><div class="instrument-menu-popover"><a href="#source">Source</a></div></details>
				<div class="instrument-tabs" data-instrument-orientation="horizontal" data-instrument-portability="behavioral"><div class="instrument-tabs-list" role="tablist" aria-label="Workspace views" aria-orientation="horizontal"><span class="instrument-tab-wrap"><button class="instrument-tab" data-instrument-tab-id="canvas" type="button" role="tab" id="portable-tab-canvas" aria-controls="portable-panel-canvas" aria-selected="true" data-instrument-active tabindex="0">Canvas</button></span><span class="instrument-tab-wrap"><button class="instrument-tab" data-instrument-tab-id="prototype" type="button" role="tab" id="portable-tab-prototype" aria-controls="portable-panel-prototype" aria-selected="false" tabindex="-1">Prototype</button></span></div><div class="instrument-tab-panel" id="portable-panel-canvas" role="tabpanel" aria-labelledby="portable-tab-canvas">Canvas panel</div><div class="instrument-tab-panel" id="portable-panel-prototype" role="tabpanel" aria-labelledby="portable-tab-prototype" hidden>Prototype panel</div></div>
				<div class="instrument-toolbar" data-instrument-orientation="horizontal" data-instrument-portability="behavioral" role="toolbar" aria-label="Canvas actions" aria-orientation="horizontal"><span class="instrument-toolbar-item-wrap"><button class="instrument-toolbar-item" type="button" data-instrument-toolbar-id="portable-frame" data-instrument-toolbar-item tabindex="0">Frame</button></span><span class="instrument-toolbar-item-wrap"><button class="instrument-toolbar-item" type="button" data-instrument-toolbar-id="portable-type" data-instrument-toolbar-item tabindex="-1">Type</button></span></div>
				<span class="instrument-popover" data-instrument-portability="behavioral"><button class="instrument-popover-trigger" type="button" aria-controls="portable-popover-surface" aria-expanded="false" aria-haspopup="dialog">More actions</button></span><div class="instrument-popover-surface" id="portable-popover-surface" role="dialog" aria-label="Layer actions" data-instrument-preferred-placement="bottom" hidden><button class="instrument-action" type="button">Duplicate</button></div>
				<div class="instrument-combobox" data-instrument-portability="behavioral"><label class="instrument-combobox-label" for="portable-combobox">Find component</label><input class="instrument-combobox-input" id="portable-combobox" type="text" role="combobox" aria-autocomplete="list" aria-controls="portable-combobox-listbox" aria-describedby="portable-combobox-status" aria-expanded="false" autocomplete="off"></div><div class="instrument-combobox-surface" data-instrument-combobox-for="portable-combobox" hidden><div class="instrument-listbox instrument-combobox-listbox" id="portable-combobox-listbox" role="listbox" aria-label="Find component results"><div class="instrument-listbox-group"><div class="instrument-listbox-option" id="portable-combobox-option-layers" data-instrument-option-id="layers" role="option" aria-selected="false" tabindex="-1"><span class="instrument-listbox-option-label">Layers</span></div><div class="instrument-listbox-option" id="portable-combobox-option-frames" data-instrument-option-id="frames" role="option" aria-selected="false" tabindex="-1"><span class="instrument-listbox-option-label">Frames</span></div></div></div><div class="instrument-listbox-status" id="portable-combobox-status" role="status" aria-live="polite"></div></div>
				<div class="instrument-listbox-shell" data-instrument-portability="behavioral"><div class="instrument-listbox" role="listbox" aria-label="Layer list" tabindex="0" aria-activedescendant="portable-option-layers"><div class="instrument-listbox-group"><div class="instrument-listbox-option" id="portable-option-layers" data-instrument-option-id="layers" role="option" aria-selected="false" data-instrument-active tabindex="-1"><span class="instrument-listbox-option-label">Layers</span></div><div class="instrument-listbox-option" id="portable-option-frames" data-instrument-option-id="frames" role="option" aria-selected="false" tabindex="-1"><span class="instrument-listbox-option-label">Frames</span></div></div></div></div>
				<span class="instrument-tooltip"><span class="instrument-tooltip-trigger" aria-describedby="portable-tooltip"><button class="instrument-action" type="button">Proof</button></span><span class="instrument-tooltip-bubble" id="portable-tooltip" role="tooltip">Current proof</span></span>
				<a class="instrument-action-list-item" href="#inspect"><span class="instrument-action-list-leading" aria-hidden="true">⌁</span><span class="instrument-action-list-copy"><strong>Inspect component</strong></span><span class="instrument-action-list-trailing instrument-tabular">↗</span></a>
				<section class="instrument-application-window" aria-label="Proof press"><header><strong>Proof press</strong><span class="instrument-application-window-meta instrument-tabular">live</span></header><div class="instrument-application-window-body"><div class="instrument-loader" data-instrument-state="active" role="status" aria-live="polite"><span class="instrument-loader-frame" aria-hidden="true">⠹</span><strong>Running proof</strong><span aria-hidden="true">·</span><span class="instrument-loader-elapsed instrument-tabular">(28.9s)</span></div></div></section>
				<output class="instrument-odometer" aria-label="Proof count"><span aria-hidden="true">2</span><span aria-hidden="true">7</span><span class="instrument-visually-hidden">27</span></output>
				<figure class="instrument-equation"><figcaption>Utility</figcaption><div class="instrument-equation-expression" role="math" aria-label="Utility">U(x) = I[a ≤ μ(x) ≤ b]</div></figure>
				<figure class="instrument-preference" aria-label="Preference pair"><figcaption>Preference pair</figcaption><div class="instrument-preference-prompt"><strong>Prompt</strong><p>Which release should ship?</p></div><div class="instrument-preference-panes"><section data-instrument-choice="chosen"><header><strong>Chosen</strong><output class="instrument-tabular">reward 2.7</output></header><div>The proofed release.</div></section><section data-instrument-choice="rejected"><header><strong>Rejected</strong><output class="instrument-tabular">reward -1.4</output></header><div>The newest release.</div></section></div><output class="instrument-preference-margin instrument-tabular">Reward margin +4.10</output></figure>
				<figure class="instrument-distribution" aria-label="Command distribution"><figcaption>Command distribution</figcaption><div class="instrument-distribution-grid"><div class="instrument-distribution-category"><div class="instrument-distribution-bars" aria-hidden="true"><i data-instrument-series="primary" style="--instrument-distribution-value:100%"></i><i data-instrument-series="secondary" style="--instrument-distribution-value:90%"></i></div><strong>Find</strong><span class="instrument-tabular">0.68 / 0.61</span></div></div><div class="instrument-distribution-legend"><span>Teacher</span><span>Student</span></div></figure>
				<figure class="instrument-graph-compare" aria-label="Pass rate" data-instrument-layout="side-by-side"><figcaption>Pass rate</figcaption><div class="instrument-graph-compare-head"><span></span><strong>Before</strong><strong>After</strong></div><div class="instrument-graph-compare-row"><strong>SWE</strong><div><i style="--instrument-compare-value:77%"></i><output class="instrument-tabular">55</output></div><div data-instrument-direction="up"><i style="--instrument-compare-value:100%"></i><output class="instrument-tabular">71</output></div></div></figure>
				<figure class="instrument-rollout"><figcaption>World-model rollout</figcaption><ol class="instrument-rollout-track" aria-label="World-model rollout"><li data-instrument-fidelity="high"><header><strong>t0</strong><output class="instrument-tabular">0.98</output></header><code>ls /</code></li></ol><div class="instrument-rollout-real"><strong>Real</strong><code>ls /</code></div></figure>
				<figure class="instrument-lineage" aria-label="Task lineage"><figcaption>Task lineage</figcaption><div class="instrument-lineage-scroll"><section aria-label="Generation 0"><header>Gen 0</header><div><article data-instrument-tone="neutral"><strong>Source</strong><code>seed</code></article></div></section></div></figure>
				<article class="instrument-document" aria-label="Measured interface"><header class="instrument-document-heading"><p class="instrument-document-eyebrow">Research / 01</p><h1>Measured interface</h1></header><div class="instrument-document-body"><p>Run <code class="instrument-inline-code" data-instrument-tone="neutral">pnpm test</code>.</p></div></article>
				<div class="instrument-identity"><span class="instrument-identity-avatar">S</span><span class="instrument-identity-copy"><strong>SUPERMEGA</strong><span>@supermega</span></span></div>
				<article class="instrument-post-item"><a href="#paper"><span class="instrument-post-item-copy"><strong>Portable tools</strong></span><span class="instrument-post-item-meta instrument-tabular">Today</span></a></article>
				<article class="instrument-history-item"><div><strong>Control cohort</strong><p>Two instruments</p></div><span class="instrument-history-status instrument-tabular">Ready</span></article>
				<ul class="instrument-attachments" aria-label="Attachments"><li><span class="instrument-attachment-mark" aria-hidden="true">↳</span><strong>contract.md</strong><span class="instrument-attachment-meta instrument-tabular">4 KB</span></li></ul>
				<figure class="instrument-media-block" aria-label="System map"><div class="instrument-media-block-stage"><span>Diagram</span></div><figcaption><span>One source.</span></figcaption></figure>
				<section class="instrument-auth-panel" aria-label="Verify identity"><header><h2>Verify identity</h2></header><div class="instrument-auth-panel-body"><button class="instrument-action" type="button">Continue</button></div></section>
				<section class="instrument-empty-state" role="status"><span class="instrument-empty-state-code">00</span><h2>No results</h2></section>
				<div class="instrument-file-drop"><label class="instrument-file-drop-zone"><input class="instrument-file-drop-input" type="file" aria-label="Sources"><span class="instrument-file-drop-cue" aria-hidden="true">Drop files or browse</span></label></div>
				<div class="instrument-prompt" data-instrument-prompt-mode="single"><label class="instrument-prompt-label" for="portable-prompt">Command</label><div class="instrument-prompt-row"><textarea class="instrument-prompt-input" id="portable-prompt" rows="1">Run proof</textarea></div></div>
				<section class="instrument-settings-column" role="region" aria-label="Environment"><header><h2>Environment</h2></header><div class="instrument-settings-column-body">Settings</div></section>
				<div class="instrument-horizontal-rail" data-instrument-columns="horizontal" role="region" aria-label="Columns"><div class="instrument-horizontal-column"><section>One</section></div></div>
				<div class="instrument-status" role="status" data-instrument-tone="active"><span class="instrument-status-mark" aria-hidden="true"></span><span>Runtime</span><span class="instrument-status-value instrument-tabular">Ready</span></div>
				<div class="instrument-notice" data-instrument-tone="attention">Human download remains a separate gesture.</div>
				<div class="instrument-toast" role="status">Artifact ready.</div>
				<button class="instrument-action" id="portable-help-trigger" type="button" data-instrument-open-help data-instrument-dialog-trigger aria-controls="portable-help-layer" aria-expanded="false" aria-haspopup="dialog">Open help</button>
				<div class="instrument-credit">Instrument System / portable</div>
			</main>
			<aside class="instrument-inspector" aria-label="Inspector"><button class="instrument-sheet-close" type="button" data-instrument-coordinate="inspector"><span>Close Inspector</span><span aria-hidden="true">−</span></button><div class="instrument-panel-header">Inspector</div><div class="instrument-help">Native controls and truthful state.</div></aside>
			<div class="instrument-mode-dock" role="toolbar" aria-label="Material and view controls">
				<button class="instrument-action" type="button" data-instrument-coordinate="ink" aria-pressed="true">Ink</button>
				<button class="instrument-action" type="button" data-instrument-coordinate="light" aria-pressed="false">Light</button>
				<button class="instrument-action" type="button" data-instrument-coordinate="grid" aria-pressed="false">Grid</button>
				<button class="instrument-action" type="button" data-instrument-coordinate="grain" aria-pressed="true">Grain</button>
				<button class="instrument-action" type="button" data-instrument-coordinate="overview" aria-pressed="true">Overview</button>
				<button class="instrument-action" type="button" data-instrument-coordinate="inspector" aria-pressed="true">Inspector</button>
			</div>
		</div>
		<div class="instrument-portal" id="portable-help-layer" data-system="instrument" data-instrument-dialog-layer data-instrument-fixture-dialog hidden>
			<button class="instrument-overlay" type="button" aria-label="Close dialog" data-instrument-dialog-close tabindex="-1"></button>
			<div class="instrument-dialog" role="dialog" aria-modal="true" aria-labelledby="portable-help-title" tabindex="-1">
				<h2 id="portable-help-title">Portable help</h2><p>Focus returns to the action that opened this surface.</p><button class="instrument-action" type="button" data-instrument-dialog-initial-focus data-instrument-dialog-close data-instrument-close-help>Close help</button>
			</div>
		</div>`;
    return enhanceInstrument(root);
  }
  const SUPERMEGA_INSTRUMENT2 = Object.freeze({
    version: INSTRUMENT_RUNTIME_VERSION,
    bridge: Object.freeze({
      create: createInstrumentBridge,
      namespace: INSTRUMENT_BRIDGE_NAMESPACE,
      parseMessage: parseInstrumentBridgeMessage,
      version: INSTRUMENT_BRIDGE_VERSION
    }),
    createState: createInitialInstrumentState,
    reduce: instrumentReducer,
    applyState: applyInstrumentState,
    enhance: enhanceInstrument,
    mountFixture: mountPortableFixture,
    serializeState: serializeInstrumentState
  });
  if (typeof window !== "undefined") {
    window.SUPERMEGA_INSTRUMENT = SUPERMEGA_INSTRUMENT2;
  }
  return SUPERMEGA_INSTRUMENT2;
})();
