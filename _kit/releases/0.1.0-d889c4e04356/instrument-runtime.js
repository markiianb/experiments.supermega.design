/* SUPERMEGA Instrument 0.1.0-d889c4e04356 */
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
  function enhanceInstrument(root, initialState = createInitialInstrumentState()) {
    var _a, _b, _c;
    let state = initialState;
    let destroyed = false;
    const sheetQuery = (_b = (_a = root.ownerDocument.defaultView) == null ? void 0 : _a.matchMedia) == null ? void 0 : _b.call(
      _a,
      INSTRUMENT_SHEET_MEDIA_QUERY
    );
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
      var _a2, _b2, _c2, _d, _e;
      const eventTarget = event.target;
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
        clipboard.call((_d = root.ownerDocument.defaultView) == null ? void 0 : _d.navigator.clipboard, value).then(() => {
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
        (_e = sheetQuery == null ? void 0 : sheetQuery.matches) != null ? _e : false
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
      if (input instanceof HTMLInputElement && input.type === "range") {
        syncRangeVisual(input);
      }
      if (input instanceof HTMLTextAreaElement && input.classList.contains("instrument-prompt-input")) {
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;
      }
    };
    const handleKeyDown = (event) => {
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
    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    root.addEventListener("keydown", handleKeyDown);
    const handleSheetQueryChange = () => applyInstrumentState(root, state);
    (_c = sheetQuery == null ? void 0 : sheetQuery.addEventListener) == null ? void 0 : _c.call(sheetQuery, "change", handleSheetQueryChange);
    for (const input of root.querySelectorAll(
      'input[type="range"]'
    )) {
      syncRangeVisual(input);
    }
    for (const input of root.querySelectorAll(
      ".instrument-prompt-input"
    )) {
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
    }
    applyInstrumentState(root, state);
    return {
      getState: () => state,
      dispatch,
      destroy() {
        var _a2;
        if (destroyed) return;
        destroyed = true;
        root.removeEventListener("click", handleClick);
        root.removeEventListener("input", handleInput);
        root.removeEventListener("keydown", handleKeyDown);
        (_a2 = sheetQuery == null ? void 0 : sheetQuery.removeEventListener) == null ? void 0 : _a2.call(sheetQuery, "change", handleSheetQueryChange);
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
					</div>
				</section>
				<fieldset class="instrument-choice-group" aria-label="Quality"><label class="instrument-choice-label"><input class="instrument-choice" type="radio" name="portable-quality" value="draft"><span>Draft</span></label><label class="instrument-choice-label"><input class="instrument-choice" type="radio" name="portable-quality" value="proof" checked><span>Proof</span></label></fieldset>
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
				<div class="instrument-prompt" data-instrument-prompt-mode="single"><label class="instrument-prompt-label" for="portable-prompt">Command</label><div class="instrument-prompt-row"><textarea class="instrument-prompt-input" id="portable-prompt" rows="1">Run proof</textarea></div></div>
				<section class="instrument-settings-column" role="region" aria-label="Environment"><header><h2>Environment</h2></header><div class="instrument-settings-column-body">Settings</div></section>
				<div class="instrument-horizontal-rail" data-instrument-columns="horizontal" role="region" aria-label="Columns"><div class="instrument-horizontal-column"><section>One</section></div></div>
				<div class="instrument-status" role="status" data-instrument-tone="active"><span class="instrument-status-mark" aria-hidden="true"></span><span>Runtime</span><span class="instrument-status-value instrument-tabular">Ready</span></div>
				<div class="instrument-notice" data-instrument-tone="attention">Human download remains a separate gesture.</div>
				<div class="instrument-toast" role="status">Artifact ready.</div>
				<button class="instrument-action" type="button" data-instrument-open-help>Open help</button>
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
		<div class="instrument-portal" data-system="instrument" data-instrument-fixture-dialog hidden>
			<div class="instrument-overlay" aria-hidden="true"></div>
			<div class="instrument-dialog" role="dialog" aria-modal="true" aria-labelledby="portable-help-title">
				<h2 id="portable-help-title">Portable help</h2><p>Focus returns to the action that opened this surface.</p><button class="instrument-action" type="button" data-instrument-close-help>Close help</button>
			</div>
		</div>`;
    const open = root.querySelector(
      "[data-instrument-open-help]"
    );
    const portal = root.querySelector(
      "[data-instrument-fixture-dialog]"
    );
    const close = root.querySelector(
      "[data-instrument-close-help]"
    );
    const showHelp = () => {
      if (!portal) return;
      portal.hidden = false;
      close == null ? void 0 : close.focus();
    };
    const hideHelp = () => {
      if (!portal) return;
      portal.hidden = true;
      open == null ? void 0 : open.focus();
    };
    const handleEscape = (event) => {
      if (event.key === "Escape" && portal && !portal.hidden) hideHelp();
    };
    open == null ? void 0 : open.addEventListener("click", showHelp);
    close == null ? void 0 : close.addEventListener("click", hideHelp);
    root.addEventListener("keydown", handleEscape);
    const controller = enhanceInstrument(root);
    const originalDestroy = controller.destroy;
    controller.destroy = () => {
      open == null ? void 0 : open.removeEventListener("click", showHelp);
      close == null ? void 0 : close.removeEventListener("click", hideHelp);
      root.removeEventListener("keydown", handleEscape);
      originalDestroy();
    };
    return controller;
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
