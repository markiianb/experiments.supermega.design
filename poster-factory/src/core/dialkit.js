// DialKit controls in plain JS, for dialkit.css (a port of joshpuckett/dialkit v2.0.1 theme.css, MIT).
// Behaviour follows DialKit's interaction law and motion constants:
//   slider   click snaps on a spring (300 / 25 / 0.8), drag writes after 3 px, rubber band after a 32 px dead zone (max 8 px),
//            handle 0.5 pressed / 0.9 dragging / 0.1 over text, hash marks while active, arrows / Shift / Page / Home / End, Enter or value-click to type
//   toggle   a labelled row with an Off / On segmented control (DialKit 2.0 has no switch)
//   select   full-width row, dropdown portaled to body, arrows / Home / End / type-ahead (700 ms) / Escape / Tab
//   text     autosizing row, up to five lines
//   swatches DialKit's colour row with its popover, holding a fixed palette instead of a free picker
// Every builder returns { el, set(value), layout?() }.

const CHEV = '<path d="M6 9.5L12 15.5L18 9.5"/>';
const svg = (cls, inner, sw = 2.5) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const decimalsFor = step => { const s = String(step); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };

function spring(from, to, k, c, m, onUpdate) { // Motion-style stiffness / damping / mass integrator
  if (reduced()) { onUpdate(to); return () => { }; }
  let x = from, v = 0, last = performance.now(), raf = 0, dead = false;
  const tick = now => { if (dead) return; const dt = Math.min(0.032, (now - last) / 1000); last = now; const a = (-k * (x - to) - c * v) / m; v += a * dt; x += v * dt; if (Math.abs(x - to) < 0.02 && Math.abs(v) < 0.5) { onUpdate(to); return; } onUpdate(x); raf = requestAnimationFrame(tick); };
  raf = requestAnimationFrame(tick); return () => { dead = true; cancelAnimationFrame(raf); };
}

// ------------------------------------------------------------------ popovers (one open at a time)
let openPop = null;
export function closePopovers() { if (openPop) openPop.close(); }
function popover(node, anchor, { onClose, match = true }) {
  closePopovers(); document.body.appendChild(node);
  const place = () => {
    const r = anchor.getBoundingClientRect(); if (match) node.style.width = r.width + 'px';
    node.style.position = 'fixed'; node.style.maxHeight = ''; const h = node.offsetHeight, w = node.offsetWidth, vh = innerHeight, vw = innerWidth;
    const below = vh - r.bottom - 12, above = r.top - 12; const up = h > below && above > below;
    node.style.maxHeight = Math.max(120, up ? above : below) + 'px';
    node.style.left = Math.max(8, Math.min(vw - w - 8, r.left)) + 'px';
    node.style.top = (up ? Math.max(8, r.top - 4 - Math.min(h, above)) : r.bottom + 4) + 'px';
    node.style.transformOrigin = up ? 'bottom' : 'top';
  };
  place(); if (!reduced()) node.style.animation = 'dialkit-color-enter .16s ease-out';
  const down = e => { if (!node.contains(e.target) && !anchor.contains(e.target)) api.close(); };
  const gone = () => api.close();
  const api = { close() { if (openPop !== api) return; openPop = null; node.remove(); document.removeEventListener('pointerdown', down, true); removeEventListener('resize', gone); document.removeEventListener('scroll', scroll, true); onClose && onClose(); } };
  const scroll = e => { if (!node.contains(e.target)) api.close(); };
  document.addEventListener('pointerdown', down, true); addEventListener('resize', gone); document.addEventListener('scroll', scroll, true);
  openPop = api; return api;
}

// ------------------------------------------------------------------ slider
export function slider({ label, min, max, step = 1, value, onChange }) {
  const dec = decimalsFor(step), span = max - min, steps = Math.round(span / step);
  const marks = steps <= 10 ? Array.from({ length: Math.max(0, steps - 1) }, (_, i) => (i + 1) / steps * 100) : Array.from({ length: 9 }, (_, i) => (i + 1) * 10);
  const wrap = el(`<div class="dialkit-slider-wrapper"><div class="dialkit-slider" role="slider" tabindex="0" aria-label="${esc(label)}" aria-valuemin="${min}" aria-valuemax="${max}">
    <div class="dialkit-slider-hashmarks">${marks.map(p => `<div class="dialkit-slider-hashmark" style="left:${p}%"></div>`).join('')}</div>
    <div class="dialkit-slider-fill"></div><div class="dialkit-slider-handle" style="opacity:0;transform:translateY(-50%) scaleX(.25)"></div>
    <span class="dialkit-slider-label">${esc(label)}</span><span class="dialkit-slider-value"></span></div></div>`);
  const track = wrap.firstElementChild, fill = track.querySelector('.dialkit-slider-fill'), handle = track.querySelector('.dialkit-slider-handle'), lab = track.querySelector('.dialkit-slider-label'), out = track.querySelector('.dialkit-slider-value');
  const round = v => { const n = min + Math.round((Math.max(min, Math.min(max, v)) - min) / step) * step; return +Math.max(min, Math.min(max, n)).toFixed(Math.max(dec, 6)); };
  const pctOf = v => span ? (v - min) / span * 100 : 0;
  let val = round(value ?? min), pct = pctOf(val), active = false, dragging = false, downX = 0, stop = null, editing = null, hoverT = 0;
  const dodge = () => { // fade the handle where it would sit on the label or the value (8 px buffer)
    const tw = track.clientWidth; if (!tw) return false; const x = pct / 100 * tw; const l = lab.offsetLeft + lab.offsetWidth + 8, r = out.offsetLeft - 8; return x < l || x > r;
  };
  const paintHandle = () => { const over = dodge(); handle.style.opacity = active ? (over ? 0.1 : dragging ? 0.9 : 0.5) : 0; handle.style.transform = `translateY(-50%) scaleX(${active ? 1 : 0.25}) scaleY(${active && over ? 0.75 : 1})`; };
  const paint = p => { pct = p; fill.style.width = p + '%'; handle.style.left = `calc(${p}% - 1.5px)`; if (active) paintHandle(); };
  const show = () => { out.textContent = val.toFixed(dec); track.setAttribute('aria-valuenow', val); };
  const write = v => { const n = round(v); if (n === val) return false; val = n; show(); onChange && onChange(val); return true; };
  const fromX = x => { const r = track.getBoundingClientRect(); return min + Math.max(0, Math.min(1, (x - r.left) / r.width)) * span; };
  const setActive = on => { active = on; track.classList.toggle('dialkit-slider-active', on); handle.style.transition = 'opacity .15s, transform .25s cubic-bezier(.3,1.2,.4,1)'; paintHandle(); };
  const rubber = x => { const r = wrap.getBoundingClientRect(); const past = x < r.left ? r.left - x : x > r.right ? x - r.right : 0, sign = x < r.left ? -1 : 1; const s = sign * 8 * Math.sqrt(Math.min(Math.max(0, past - 32) / 200, 1)); track.style.transition = 'none'; track.style.width = `calc(100% + ${Math.abs(s)}px)`; track.style.transform = `translateX(${s < 0 ? s : 0}px)`; };
  const release = () => { track.style.transition = reduced() ? 'none' : 'width .35s cubic-bezier(.2,1.3,.4,1), transform .35s cubic-bezier(.2,1.3,.4,1)'; track.style.width = '100%'; track.style.transform = 'none'; };
  const edit = () => {
    if (editing) return; const inp = el(`<input class="dialkit-slider-input" inputmode="decimal" aria-label="${esc(label)}">`); inp.value = val.toFixed(dec); inp.style.width = Math.max(3, inp.value.length + 1) + 'ch';
    out.style.visibility = 'hidden'; track.appendChild(inp); editing = inp; inp.focus(); inp.select();
    const done = commit => { if (!editing) return; editing = null; if (commit) { const n = parseFloat(inp.value); if (!Number.isNaN(n)) { write(n); paint(pctOf(val)); } } inp.remove(); out.style.visibility = ''; out.classList.remove('dialkit-slider-value-editable'); };
    inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { done(true); track.focus(); } else if (e.key === 'Escape') { done(false); track.focus(); } });
    inp.addEventListener('blur', () => done(true)); inp.addEventListener('pointerdown', e => e.stopPropagation());
  };
  out.addEventListener('pointerenter', () => { hoverT = setTimeout(() => out.classList.add('dialkit-slider-value-editable'), 350); });
  out.addEventListener('pointerleave', () => { clearTimeout(hoverT); out.classList.remove('dialkit-slider-value-editable'); });
  track.addEventListener('pointerdown', e => {
    if (e.button !== 0 || editing) return; if (e.target === out && out.classList.contains('dialkit-slider-value-editable')) { e.preventDefault(); edit(); return; }
    e.preventDefault(); track.focus({ preventScroll: true }); track.setPointerCapture(e.pointerId); if (stop) stop(); downX = e.clientX; dragging = false; setActive(true);
  });
  track.addEventListener('pointermove', e => { if (!active) return; if (!dragging && Math.abs(e.clientX - downX) > 3) { dragging = true; paintHandle(); } if (dragging) { write(fromX(e.clientX)); paint(pctOf(val)); rubber(e.clientX); } });
  const up = e => {
    if (!active) return;
    if (!dragging && e.type === 'pointerup') { const raw = fromX(e.clientX); const snapped = steps <= 10 ? raw : min + Math.round((raw - min) / span * 10) / 10 * span; const from = pct; write(snapped); stop = spring(from, pctOf(val), 300, 25, 0.8, paint); }
    release(); dragging = false; setActive(false);
  };
  track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up); track.addEventListener('lostpointercapture', e => { if (active) up(e); });
  track.addEventListener('keydown', e => {
    let n = null; const big = step * 10;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') n = val + (e.shiftKey ? big : step); else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') n = val - (e.shiftKey ? big : step);
    else if (e.key === 'PageUp') n = val + big; else if (e.key === 'PageDown') n = val - big; else if (e.key === 'Home') n = min; else if (e.key === 'End') n = max; else if (e.key === 'Enter') { e.preventDefault(); edit(); return; }
    if (n !== null) { e.preventDefault(); if (stop) stop(); write(n); paint(pctOf(val)); }
  });
  show(); paint(pct);
  return { el: wrap, set(v) { if (active || editing) return; const n = round(v); if (n === val) return; val = n; show(); if (stop) stop(); paint(pctOf(val)); } };
}

// ------------------------------------------------------------------ segmented (and the toggle built from it)
function segCore(options, value, onChange, label) {
  const seg = el(`<div class="dialkit-segmented" role="radiogroup" aria-label="${esc(label)}"><div class="dialkit-segmented-pill"></div>${options.map(o => `<button type="button" role="radio" class="dialkit-segmented-button" data-value="${esc(o.value)}">${esc(o.label)}</button>`).join('')}</div>`);
  const pill = seg.firstElementChild, btns = [...seg.querySelectorAll('button')]; let val = String(value), first = true;
  const render = () => {
    const act = btns.find(b => b.dataset.value === val) || btns[0];
    btns.forEach(b => { const on = b === act; b.dataset.active = String(on); b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    if (!act.offsetWidth) return; pill.style.transition = first || reduced() ? 'none' : 'left .2s cubic-bezier(.25,1,.5,1), width .2s cubic-bezier(.25,1,.5,1)'; pill.style.left = act.offsetLeft + 'px'; pill.style.width = act.offsetWidth + 'px'; first = false;
  };
  const pick = (i, focus) => { const b = btns[(i + btns.length) % btns.length]; if (b.dataset.value !== val) { val = b.dataset.value; render(); onChange(options[btns.indexOf(b)].value); } if (focus) b.focus(); };
  btns.forEach((b, i) => b.addEventListener('click', () => pick(i)));
  seg.addEventListener('keydown', e => { const i = btns.findIndex(b => b.dataset.value === val); if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick(i + 1, true); } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(i - 1, true); } else if (e.key === 'Home') { e.preventDefault(); pick(0, true); } else if (e.key === 'End') { e.preventDefault(); pick(btns.length - 1, true); } });
  new ResizeObserver(() => { first = true; render(); }).observe(seg);
  return { seg, render, set(v) { if (String(v) === val) return; val = String(v); render(); } };
}
export function segmented({ label, options, value, onChange }) {
  const row = el(`<div class="dialkit-labeled-control"><span class="dialkit-labeled-control-label">${esc(label)}</span></div>`);
  const c = segCore(options, value, onChange, label); row.appendChild(c.seg); return { el: row, set: c.set, layout: c.render };
}
export function toggle({ label, value, onChange }) {
  const row = el(`<div class="dialkit-labeled-control"><span class="dialkit-labeled-control-label">${esc(label)}</span></div>`);
  const c = segCore([{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }], value ? 'on' : 'off', v => onChange(v === 'on'), label); row.appendChild(c.seg);
  return { el: row, set: v => c.set(v ? 'on' : 'off'), layout: c.render };
}

// ------------------------------------------------------------------ select
export function select({ label, options, value, onChange }) {
  const row = el(`<div class="dialkit-select-row"><button type="button" class="dialkit-select-trigger" aria-haspopup="listbox" aria-expanded="false" data-open="false"><span class="dialkit-select-label">${esc(label)}</span><span class="dialkit-select-right"><span class="dialkit-select-value"></span>${svg('dialkit-select-chevron', CHEV)}</span></button></div>`);
  const trig = row.firstElementChild, out = trig.querySelector('.dialkit-select-value'), chev = trig.querySelector('svg'); chev.style.transition = 'transform .2s cubic-bezier(.2,1.3,.4,1)';
  let val = value, pop = null; const find = v => options.find(o => String(o.value) === String(v));
  const show = () => { const o = find(val); out.textContent = o ? o.label : ''; }; show();
  const open = () => {
    if (pop) return;
    const menu = el(`<div class="dialkit-select-dropdown" role="listbox" aria-label="${esc(label)}">${options.map(o => `<button type="button" class="dialkit-select-option" role="option" data-selected="${String(o.value) === String(val)}" aria-selected="${String(o.value) === String(val)}">${esc(o.label)}</button>`).join('')}</div>`);
    const opts = [...menu.children]; let buf = '', bufT = 0;
    const choose = i => { val = options[i].value; show(); pop.close(); trig.focus(); onChange(val); };
    opts.forEach((o, i) => o.addEventListener('click', () => choose(i)));
    menu.addEventListener('keydown', e => {
      const i = opts.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); opts[Math.min(opts.length - 1, i + 1)].focus(); } else if (e.key === 'ArrowUp') { e.preventDefault(); opts[Math.max(0, i - 1)].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); opts[0].focus(); } else if (e.key === 'End') { e.preventDefault(); opts[opts.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); pop.close(); trig.focus(); } else if (e.key === 'Tab') { pop.close(); }
      else if (e.key.length === 1 && e.key !== ' ') { buf += e.key.toLowerCase(); clearTimeout(bufT); bufT = setTimeout(() => buf = '', 700); const j = options.findIndex(o => String(o.label).toLowerCase().startsWith(buf)); if (j >= 0) opts[j].focus(); }
    });
    trig.dataset.open = 'true'; trig.setAttribute('aria-expanded', 'true'); chev.style.transform = 'rotate(180deg)';
    pop = popover(menu, trig, { onClose() { pop = null; trig.dataset.open = 'false'; trig.setAttribute('aria-expanded', 'false'); chev.style.transform = ''; } });
    const sel = opts.find(o => o.dataset.selected === 'true') || opts[0]; sel.focus({ preventScroll: true }); sel.scrollIntoView({ block: 'nearest' });
  };
  trig.addEventListener('click', () => pop ? pop.close() : open());
  trig.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); } });
  return { el: row, set(v) { if (String(v) === String(val)) return; val = v; show(); } };
}

// ------------------------------------------------------------------ text
export function text({ label, value, placeholder = '', onChange }) {
  const LINE = 18, MAX = 5;
  const row = el(`<div class="dialkit-text-control" data-autosized><span class="dialkit-text-label">${esc(label)}</span><textarea class="dialkit-text-input" rows="1" aria-label="${esc(label)}" placeholder="${esc(placeholder)}" spellcheck="false" autocomplete="off"></textarea></div>`);
  const ta = row.querySelector('textarea'); ta.value = value ?? '';
  const fit = () => { if (!ta.offsetWidth) return; ta.style.height = LINE + 'px'; const n = Math.min(MAX, Math.max(1, Math.round(ta.scrollHeight / LINE))); ta.style.height = n * LINE + 'px'; ta.style.overflowY = ta.scrollHeight > MAX * LINE ? 'auto' : 'hidden'; row.style.height = (n * LINE + 18) + 'px'; };
  ta.addEventListener('input', () => { fit(); onChange(ta.value); }); ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ta.blur(); } });
  new ResizeObserver(fit).observe(row);
  return { el: row, set(v) { if (document.activeElement === ta || ta.value === (v ?? '')) return; ta.value = v ?? ''; fit(); }, layout: fit };
}

// ------------------------------------------------------------------ swatches: DialKit's colour row, a fixed palette in its popover
export function swatches({ label, options, value, name = h => String(h).toUpperCase(), onChange }) {
  const row = el(`<div class="dialkit-color-control" data-open="false"><span class="dialkit-color-label">${esc(label)}</span><span class="dialkit-color-inputs"><output class="dialkit-color-value"></output><button type="button" class="dialkit-color-swatch" aria-haspopup="dialog" aria-label="${esc(label)}: choose a colour"></button></span></div>`);
  const out = row.querySelector('output'), sw = row.querySelector('button'); let val = value, pop = null;
  const show = () => { out.textContent = name(val); sw.style.setProperty('--dial-color', val); }; show();
  const open = () => {
    if (pop) return;
    const box = el(`<div class="dialkit-image-popover" role="dialog" aria-label="${esc(label)}"><div class="dialkit-image-heading"><span class="dialkit-image-title">${esc(label)}</span></div><div class="dialkit-image-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">${options.map(o => `<button type="button" class="dialkit-image-option" aria-pressed="${String(o).toLowerCase() === String(val).toLowerCase()}" title="${esc(name(o))}" aria-label="${esc(name(o))}"><span class="dialkit-image-frame dialkit-image-option-preview" style="background:${esc(o)};aspect-ratio:1;box-shadow:inset 0 0 0 1px var(--dial-border)"></span></button>`).join('')}</div></div>`);
    const opts = [...box.querySelectorAll('.dialkit-image-option')];
    opts.forEach((b, i) => b.addEventListener('click', () => { val = options[i]; show(); opts.forEach(x => x.setAttribute('aria-pressed', x === b)); onChange(val); }));
    box.addEventListener('keydown', e => {
      const i = opts.indexOf(document.activeElement); let j = null;
      if (e.key === 'ArrowRight') j = i + 1; else if (e.key === 'ArrowLeft') j = i - 1; else if (e.key === 'ArrowDown') j = i + 4; else if (e.key === 'ArrowUp') j = i - 4; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = opts.length - 1;
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); pop.close(); sw.focus(); }
      if (j !== null) { e.preventDefault(); opts[Math.max(0, Math.min(opts.length - 1, j))].focus(); }
    });
    row.dataset.open = 'true'; pop = popover(box, row, { onClose() { pop = null; row.dataset.open = 'false'; } });
    (opts.find(o => o.getAttribute('aria-pressed') === 'true') || opts[0]).focus({ preventScroll: true });
  };
  row.style.cursor = 'pointer'; row.addEventListener('click', () => pop ? pop.close() : open());
  return { el: row, set(v) { if (String(v).toLowerCase() === String(val).toLowerCase()) return; val = v; show(); } };
}

// ------------------------------------------------------------------ folder and action button
export function folder({ title, open = true, children = [] }) {
  const f = el(`<div class="dialkit-folder" data-open="${open}"><div class="dialkit-folder-header"><div class="dialkit-folder-header-top" role="button" tabindex="0" aria-expanded="${open}"><div class="dialkit-folder-title-row"><span class="dialkit-folder-title">${esc(title)}</span></div>${svg('dialkit-folder-icon', CHEV)}</div></div><div class="dialkit-folder-content"><div class="dialkit-folder-inner"></div></div></div>`);
  const head = f.querySelector('.dialkit-folder-header-top'), icon = f.querySelector('.dialkit-folder-icon'), content = f.querySelector('.dialkit-folder-content'), inner = f.querySelector('.dialkit-folder-inner');
  children.forEach(c => inner.appendChild(c)); icon.style.transition = 'transform .35s cubic-bezier(.2,1.3,.4,1)';
  const apply = (on, instant) => {
    f.dataset.open = String(on); head.setAttribute('aria-expanded', on); icon.style.transform = on ? 'rotate(180deg)' : 'none';
    if (instant || reduced()) { content.style.transition = 'none'; content.style.height = on ? 'auto' : '0px'; content.style.overflow = on ? '' : 'hidden'; return; }
    const h = inner.offsetHeight; content.style.overflow = 'hidden'; content.style.transition = 'height .35s cubic-bezier(.2,1.1,.4,1)';
    if (on) { content.style.height = '0px'; requestAnimationFrame(() => { content.style.height = h + 'px'; }); content.addEventListener('transitionend', function te() { if (f.dataset.open === 'true') { content.style.height = 'auto'; content.style.overflow = ''; } content.removeEventListener('transitionend', te); }); }
    else { content.style.height = h + 'px'; requestAnimationFrame(() => { content.style.height = '0px'; }); }
  };
  head.addEventListener('click', () => apply(f.dataset.open !== 'true'));
  head.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apply(f.dataset.open !== 'true'); } });
  apply(open, true);
  return { el: f, inner };
}
export function button({ label, onClick }) { const b = el(`<button type="button" class="dialkit-button">${esc(label)}</button>`); b.addEventListener('click', onClick); return { el: b }; }
export const icons = { chevron: cls => svg(cls, CHEV) };

// ------------------------------------------------------------------ option menu on any trigger (the panel's format picker)
export function optionMenu(trigger, { label, options, value, onPick }) {
  let pop = null, val = value; const chev = trigger.querySelector('svg'); if (chev) chev.style.transition = 'transform .2s cubic-bezier(.2,1.3,.4,1)';
  const open = () => {
    const menu = el(`<div class="dialkit-select-dropdown" role="listbox" aria-label="${esc(label)}">${options.map(o => `<button type="button" class="dialkit-select-option" role="option" data-selected="${o.value === val}" aria-selected="${o.value === val}">${esc(o.label)}</button>`).join('')}</div>`);
    const opts = [...menu.children];
    opts.forEach((o, i) => o.addEventListener('click', () => { val = options[i].value; pop.close(); trigger.focus(); onPick(val); }));
    menu.addEventListener('keydown', e => { const i = opts.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); opts[Math.min(opts.length - 1, i + 1)].focus(); } else if (e.key === 'ArrowUp') { e.preventDefault(); opts[Math.max(0, i - 1)].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); pop.close(); trigger.focus(); } else if (e.key === 'Tab') pop.close(); });
    trigger.dataset.open = 'true'; trigger.setAttribute('aria-expanded', 'true'); if (chev) chev.style.transform = 'rotate(180deg)';
    pop = popover(menu, trigger, { onClose() { pop = null; trigger.dataset.open = 'false'; trigger.setAttribute('aria-expanded', 'false'); if (chev) chev.style.transform = ''; } });
    (opts.find(o => o.dataset.selected === 'true') || opts[0]).focus({ preventScroll: true });
  };
  trigger.setAttribute('aria-haspopup', 'listbox'); trigger.setAttribute('aria-expanded', 'false');
  trigger.addEventListener('click', () => pop ? pop.close() : open());
  trigger.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!pop) open(); } });
  return { set(v) { val = v; } };
}
export const isPopoverOpen = () => !!openPop;
