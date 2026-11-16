// Poster Factory — app shell. Generate → pick a style → tune → download.
// Shell: the Artifact tool's layout (header, Library head + chips, tiles, item-detail overlay). Controls: DialKit (dialkit.js).
import { W, H, rng, esc, PAL, MAP72, setFormat } from './ctx.js';
import * as DK from './dialkit.js';
import * as ST from './street.js';

const STYLE_IDS = ["a","b","c","i","k"];
const KEY = 'pf.posters.v1';
const $ = (sel, el = document) => el.querySelector(sel);
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const ic = (d, sw = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  plus: ic('<path d="M5 12h14"/><path d="M12 5v14"/>'),
  back: ic('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),
  down: ic('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'),
  shuffle: ic('<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>'),
  copy: ic('<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'),
  trash: ic('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>'),
  regen: ic('<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/>'),
  check: ic('<path d="M20 6 9 17l-5-5"/>', 2.6),
  street: ic('<rect x="5" y="3" width="14" height="13" rx="1"/><path d="M9 21v-5"/><path d="M15 21v-5"/><path d="M3 21h18"/>'),
  prev: ic('<path d="m15 18-6-6 6-6"/>'), next: ic('<path d="m9 18 6-6-6-6"/>'),
  sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'),
  logo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5H22M9.5 15H18.5" fill="none" stroke="#ff671f" stroke-width="4"/><path d="M4.5 21V5h5a5 5 0 0 1 0 10h-5" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
};
const FORMATS = [{ value: 'png2', label: 'PNG 1920 × 2400' }, { value: 'png4', label: 'PNG 3840 × 4800' }, { value: 'svg', label: 'SVG' }];
const NAMES = { [PAL.yellow]: 'PMS 130', [PAL.orange]: 'PMS 165', [PAL.red]: 'PMS 185', [PAL.magenta]: 'PMS 239', [PAL.green]: 'PMS 354', [PAL.blue312]: 'PMS 312', [PAL.blue300]: 'PMS 300', [PAL.black]: 'Black', [PAL.grey]: 'Grey', [PAL.warmRed]: 'Warm Red', [PAL.yellow109]: 'PMS 109', [PAL.white]: 'White', [MAP72.land]: 'Paper' };
const colourName = c => NAMES[String(c).toLowerCase()] || String(c).toUpperCase();

const S = { styles: {}, order: [], style: 'all', posters: [], count: 8, format: 'png2', open: null, picked: new Set(), scenes: [], view: 'grid', wall: { scene: null, pattern: 'different', light: 1, creases: 1, offset: 0, focus: null } };
const getK = (o, k) => k.split('.').reduce((a, p) => a == null ? a : a[p], o);
const setK = (o, k, v) => { const ps = k.split('.'); const c = structuredClone(o); let a = c; for (let i = 0; i < ps.length - 1; i++) a = a[ps[i]] ??= {}; a[ps[ps.length - 1]] = v; return c; };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S.posters.slice(0, 160))); } catch { /* storage is a convenience */ } };
const uid = () => Math.random().toString(36).slice(2, 9);
let seedCounter = (Date.now() % 1e6) * 37;

// Posters are SVG strings built from saved settings, so they are parsed strictly and stripped before they touch the page:
// no scripts, no foreign content, no event handlers, and links only to our own assets, fragments or inline images.
const BAD = new Set(['script', 'foreignObject', 'iframe', 'object', 'embed', 'audio', 'video', 'a', 'use', 'animate', 'set', 'animateTransform', 'animateMotion', 'style', 'link', 'meta']);
const parser = new DOMParser(), serial = new XMLSerializer();
function clean(svg) {
  const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`, 'image/svg+xml'); const root = doc.documentElement;
  if (!root || root.localName !== 'svg' || doc.getElementsByTagName('parsererror').length) return null;
  for (const el of [...root.getElementsByTagName('*')]) {
    if (BAD.has(el.localName) || el.namespaceURI !== 'http://www.w3.org/2000/svg') { el.remove(); continue; }
    for (const at of [...el.attributes]) { const n = at.name.toLowerCase(), v = at.value.trim();
      if (n.startsWith('on')) el.removeAttribute(at.name);
      else if ((n === 'href' || n === 'xlink:href') && !/^(#|assets\/|data:image\/(png|jpeg|webp|svg\+xml)[;,])/i.test(v)) el.removeAttribute(at.name);
      else if (/url\(\s*['"]?(?!#)/i.test(v) || /javascript:/i.test(v)) el.removeAttribute(at.name); }
  }
  return [...root.childNodes].map(n => serial.serializeToString(n)).join('');
}
function draw(p) { // → { svg, flags } ; never throws
  const mod = S.styles[p.style]; if (!mod) return { svg: '', flags: [{ level: 'fail', text: 'Style not loaded' }] };
  try { const out = mod.render(p.params, 'u' + p.id); const svg = clean(out.svg); if (svg === null) return { svg: `<rect width="${W}" height="${H}" fill="#f0f0f0"/>`, flags: [{ level: 'fail', text: 'This poster holds markup that is not allowed. Regenerate it.' }] }; return { svg, flags: out.flags || [] }; }
  catch (e) { console.error(e); return { svg: `<rect width="${W}" height="${H}" fill="#f0f0f0"/>`, flags: [{ level: 'fail', text: 'Could not draw: ' + e.message }] }; }
}
const svgTag = (inner, attrs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ${attrs}>${inner}</svg>`;
const worst = fl => fl.some(f => f.level === 'fail') ? 'fail' : fl.length ? 'warn' : 'ok';
const visible = () => S.posters.filter(p => S.style === 'all' || p.style === S.style);

function make(styleId) { const mod = S.styles[styleId]; const seed = ++seedCounter; return { id: uid(), style: styleId, seed, params: mod.random(rng(seed)) }; }
function generate() {
  const ids = S.style === 'all' ? S.order : [S.style]; const fresh = [];
  for (let i = 0; i < S.count; i++) { try { fresh.push(make(ids[i % ids.length])); } catch (e) { console.error(e); toast('One poster could not be generated'); } }
  S.posters = fresh.concat(S.posters); save(); renderMain(fresh.map(p => p.id));
}

// ---------------------------------------------------------------- page: header, head, chips, tiles
function renderShell() {
  $('#app').innerHTML = `<header class="hdr"><div class="hdr-left"><span class="logo">${I.logo}</span><span class="pf-name">Poster Factory</span></div><div></div>
    <div class="hdr-right"><button class="btn btn-sm btn-ghost" data-act="clear">Clear all</button><button class="btn btn-sm btn-primary btn-rounded" data-act="gen">${I.plus}Generate</button><button class="btn btn-sm btn-ghost btn-icon btn-rounded" data-act="theme" aria-label="Switch light and dark">${I.sun}</button></div></header><main class="pf-main"></main>`;
  $('.hdr').onclick = e => {
    const a = e.target.closest('[data-act]')?.dataset.act; if (!a) return;
    if (a === 'gen') generate();
    if (a === 'theme') { const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('pf.theme', r.dataset.theme); } catch { } }
    if (a === 'clear') { if (!S.posters.length) return; const keep = S.posters; S.posters = []; save(); renderMain(); toast('Cleared', 'Undo', () => { S.posters = keep; save(); renderMain(); }); }
  };
}
function renderMain(freshIds = []) {
  const main = $('.pf-main'); const mod = S.styles[S.style]; const list = visible(); const n = id => S.posters.filter(p => id === 'all' || p.style === id).length;
  const styles = new Set(S.posters.map(p => p.style)).size;
  main.innerHTML = `<div class="pf-head"><div class="pf-heading"><h1 class="pf-title">${mod ? esc(mod.name) : 'Posters'}</h1>
      <p class="pf-count">${mod ? esc(mod.blurb) : `${S.posters.length} poster${S.posters.length === 1 ? '' : 's'} in ${styles} style${styles === 1 ? '' : 's'}, built from the 1970 subway sign system`}</p></div>
    <div class="pf-controls">${S.scenes.length ? `<div class="seg" role="group" aria-label="View" data-seg="view"><span class="seg-thumb"></span><button class="seg-item" data-view="grid" aria-pressed="${S.view === 'grid'}">Posters</button><button class="seg-item" data-view="wall" aria-pressed="${S.view === 'wall'}">On the wall</button></div>` : ''}<span class="pf-word">Per set</span><div class="seg" role="group" aria-label="Posters per set" data-seg="count"><span class="seg-thumb"></span>${[4, 8, 16].map(c => `<button class="seg-item" data-count="${c}" aria-pressed="${S.count === c}">${c}</button>`).join('')}</div></div></div>
    <div class="lens-row"><span class="lens-word">Style</span><button class="lens-chip" data-style="all" aria-pressed="${S.style === 'all'}">All<span class="n">${n('all') || ''}</span></button>${S.order.map(id => `<button class="lens-chip" data-style="${id}" aria-pressed="${S.style === id}">${esc(S.styles[id].name)}<span class="n">${n(id) || ''}</span></button>`).join('')}</div>
    ${list.length && S.view === 'wall' && S.scenes.length ? '<div class="pf-wall" id="pf-wall"></div>' : list.length ? '<div class="pf-grid"></div>' : `<div class="empty"><span>No posters${mod ? ' in this style' : ''} yet.</span><button class="btn btn-md btn-secondary btn-rounded" data-act="gen">Generate ${S.count}</button></div>`}
    <footer class="pf-credit">A study of the 1970 New York City Transit Authority Graphics Standards Manual by Unimark (Massimo Vignelli, Bob Noorda) and of the 1972 subway map. Controls after DialKit by Josh Puckett. Made by <a href="https://supermega.design">Supermega Design</a>.</footer>`;
  requestAnimationFrame(() => main.querySelectorAll('.pf-head .seg').forEach(seg => { const thumb = $('.seg-thumb', seg), on = $('[aria-pressed="true"]', seg); if (on) { thumb.style.width = on.offsetWidth + 'px'; thumb.style.translate = (on.offsetLeft - 4) + 'px 0'; } }));
  if ($('#pf-wall', main)) renderWall();
  const grid = $('.pf-grid', main);
  if (grid) {
    let k = 0;
    for (const p of list) {
      const out = draw(p); const w = worst(out.flags); const isNew = freshIds.includes(p.id); const name = S.styles[p.style]?.name || p.style;
      grid.appendChild(h(`<div class="pf-tile${isNew ? ' is-new' : ''}" role="button" tabindex="0" data-id="${p.id}" data-picked="${S.picked.has(p.id)}" style="--i:${isNew ? Math.min(k++, 15) : 0}" aria-label="${esc(name)} poster. Open to tune.">
        <span class="pf-thumb">${svgTag(out.svg)}</span>
        <span class="pf-caption"><span>${esc(name)}</span>${w === 'ok' ? '' : `<span class="pf-dot ${w}" title="${esc(out.flags.map(f => f.text).join(' · '))}"></span>`}</span>
        <button class="pf-pick" data-tool="pick" role="checkbox" aria-checked="${S.picked.has(p.id)}" aria-label="Pick for the wall">${I.check}</button><span class="pf-tools"><button class="pf-tool" data-tool="dl" aria-label="Download" ${w === 'fail' ? 'disabled' : ''}>${I.down}</button><button class="pf-tool" data-tool="rm" aria-label="Remove">${I.trash}</button></span></div>`));
    }
  }
  main.onclick = e => {
    const c = e.target.closest('[data-count]'); if (c) { S.count = +c.dataset.count; return renderMain(); }
    const v = e.target.closest('[data-view]'); if (v) { S.view = v.dataset.view; S.wall.focus = null; return renderMain(); }
    if (e.target.closest('.pf-wall')) return;
    const chip = e.target.closest('[data-style]'); if (chip) { S.style = chip.dataset.style; S.wall.focus = null; return renderMain(); }
    if (e.target.closest('[data-act="gen"]')) return generate();
    const tool = e.target.closest('[data-tool]'); const tile = e.target.closest('.pf-tile'); if (!tile) return; const p = S.posters.find(x => x.id === tile.dataset.id);
    if (tool) { e.stopPropagation(); if (tool.dataset.tool === 'pick') { S.picked.has(p.id) ? S.picked.delete(p.id) : S.picked.add(p.id); tool.setAttribute('aria-checked', S.picked.has(p.id)); tile.classList.toggle('is-picked', S.picked.has(p.id)); renderTray(); } else if (tool.dataset.tool === 'dl') download(p, S.format); else { S.picked.delete(p.id); const at = S.posters.indexOf(p); S.posters.splice(at, 1); save(); renderMain(); toast('Removed', 'Undo', () => { S.posters.splice(at, 0, p); save(); renderMain(); }); } return; }
    openDetail(p.id);
  };
  renderTray();
  main.onkeydown = e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('pf-tile')) { e.preventDefault(); openDetail(e.target.dataset.id); } };
}

// ---------------------------------------------------------------- detail overlay with the DialKit panel
function openDetail(id) {
  closeDetail(true);
  const list = visible(); let p = S.posters.find(x => x.id === id); if (!p) return;
  const mod = S.styles[p.style]; const at = list.indexOf(p);
  const lo = Math.max(0, Math.min(at - 12, list.length - 25)), rail = list.slice(lo, lo + 25);
  const ov = h(`<div class="idetail" role="dialog" aria-modal="true" aria-label="${esc(mod.name)} poster">
    <div class="idetail-top"><button class="btn btn-sm btn-ghost btn-icon btn-rounded" data-act="back" aria-label="Back to posters">${I.back}</button><span class="idetail-count">${at + 1} / ${list.length}</span></div>
    <div class="idetail-body"><div class="idetail-stage"><div class="idetail-frame" id="pf-out"></div>
        <button class="btn btn-sm btn-secondary btn-icon btn-rounded idetail-nav is-prev" data-act="prev" aria-label="Previous poster" ${at <= 0 ? 'disabled' : ''}>${I.prev}</button>
        <button class="btn btn-sm btn-secondary btn-icon btn-rounded idetail-nav is-next" data-act="next" aria-label="Next poster" ${at >= list.length - 1 ? 'disabled' : ''}>${I.next}</button></div>
      <aside class="idetail-side"><div class="dialkit-root pf-panel" data-mode="inline"><div class="dialkit-folder dialkit-folder-root" data-open="true">
        <div class="dialkit-folder-header dialkit-panel-header"><div class="dialkit-folder-header-top"><div class="dialkit-folder-title-row"><span class="dialkit-folder-title dialkit-folder-title-root">${esc(mod.name)}</span></div></div>
          <div class="dialkit-panel-toolbar"><button type="button" class="dialkit-toolbar-copy dialkit-toolbar-primary pf-regen" data-act="shuffle" title="Regenerate (R)"><span class="pf-regen-icon">${I.regen}</span>Regenerate</button>
            <button type="button" class="dialkit-toolbar-add" data-act="dup" aria-label="Duplicate" title="Duplicate">${I.copy}</button></div>
          <div class="dialkit-panel-toolbar"><div class="dialkit-preset-manager"><button type="button" class="dialkit-preset-trigger" data-open="false" aria-label="Download format"><span class="dialkit-preset-label"></span>${DK.icons.chevron('dialkit-select-chevron')}</button></div>
            <button type="button" class="dialkit-toolbar-copy" data-act="dl" title="Download">${I.down}Download</button></div>${S.scenes.length ? `<div class="dialkit-panel-toolbar"><button type="button" class="dialkit-toolbar-copy pf-wide" data-act="street">${I.street}See it on the wall</button></div>` : ''}</div>
        <div class="dialkit-folder-content"><div class="dialkit-folder-inner" id="pf-ctls"></div></div></div></div></aside></div>
    <div class="idetail-rail">${rail.map(q => `<button class="idetail-thumb" data-go="${q.id}" aria-current="${q.id === p.id}" aria-label="Open poster">${svgTag(draw(q).svg)}</button>`).join('')}</div></div>`);
  document.body.appendChild(ov); S.open = { id: p.id, ov };
  const fmtBtn = $('.dialkit-preset-trigger', ov), fmtLabel = $('.dialkit-preset-label', ov); const showFmt = () => { fmtLabel.textContent = FORMATS.find(f => f.value === S.format).label; }; showFmt();
  DK.optionMenu(fmtBtn, { label: 'Download format', options: FORMATS, value: S.format, onPick: v => { S.format = v; showFmt(); } });

  let sig = '', ctl = {}, rulesBox = null; const folds = new Map();
  const paint = () => {
    const out = draw(p); $('#pf-out', ov).innerHTML = svgTag(out.svg);
    const th = $('.idetail-thumb[aria-current="true"]', ov); if (th) th.innerHTML = svgTag(out.svg);
    if (rulesBox) rulesBox.innerHTML = out.flags.length ? out.flags.map(f => `<div class="pf-rule"><span class="pf-dot ${f.level}"></span><span>${esc(f.text)}</span></div>`).join('') : `<div class="pf-rule"><span class="pf-dot ok"></span><span>All rules pass</span></div>`;
    const fails = out.flags.some(f => f.level === 'fail'); const dl = $('[data-act="dl"]', ov); dl.disabled = fails; dl.title = fails ? 'A rule fails. Fix it to download.' : 'Download';
  };
  const change = (c, v) => { let np = setK(p.params, c.key, v); if (c.replan && mod.replan) np = mod.replan(np); p.params = np; save(); build(); paint(); };
  const build = () => {
    const defs = mod.controls(p.params); const s2 = JSON.stringify(defs);
    if (s2 === sig) { for (const c of defs) ctl[c.key]?.set(getK(p.params, c.key)); return; }
    sig = s2; ctl = {}; DK.closePopovers(); const box = $('#pf-ctls', ov); box.innerHTML = ''; box.appendChild(h(`<p class="idetail-sub">${esc(mod.blurb)}</p>`));
    let target = box; const made = new Map(), all = [];
    for (const c of defs) {
      if (c.group) { if (!made.has(c.group)) { const f = DK.folder({ title: c.group, open: folds.get(c.group) ?? true }); new MutationObserver(() => folds.set(c.group, f.el.dataset.open === 'true')).observe(f.el, { attributes: true, attributeFilter: ['data-open'] }); made.set(c.group, f); box.appendChild(f.el); } target = made.get(c.group).inner; }
      const v = getK(p.params, c.key); const opts = (c.options || []).map(o => typeof o === 'object' ? o : { value: o, label: String(o) }); let k;
      if (c.type === 'range') k = DK.slider({ label: c.label, min: c.min, max: c.max, step: c.step ?? 1, value: v, onChange: n => change(c, n) });
      else if (c.type === 'toggle') k = DK.toggle({ label: c.label, value: v !== false && !!v, onChange: b => change(c, b) });
      else if (c.type === 'select') { const short = opts.length <= 3 && opts.reduce((t, o) => t + String(o.label).length, 0) <= 16; const pick = val => { const o = opts.find(o => String(o.value) === String(val)); change(c, o ? o.value : val); }; k = short ? DK.segmented({ label: c.label, options: opts, value: v, onChange: pick }) : DK.select({ label: c.label, options: opts, value: v, onChange: pick }); }
      else if (c.type === 'color') k = DK.swatches({ label: c.label, options: c.options || [], value: v, name: colourName, onChange: n => change(c, n) });
      else k = DK.text({ label: c.label, value: v, placeholder: c.hint || '', onChange: t => change(c, t) });
      ctl[c.key] = k; all.push(k); target.appendChild(k.el);
    }
    const rf = DK.folder({ title: 'Rules', open: folds.get('Rules') ?? true }); new MutationObserver(() => folds.set('Rules', rf.el.dataset.open === 'true')).observe(rf.el, { attributes: true, attributeFilter: ['data-open'] });
    rulesBox = rf.inner; box.appendChild(rf.el); requestAnimationFrame(() => all.forEach(k => k.layout && k.layout()));
  };
  build(); paint();
  const go = d => { const q = list[at + d]; if (q) openDetail(q.id); };
  ov.onclick = e => {
    const t = e.target.closest('[data-go]'); if (t) return openDetail(t.dataset.go);
    const a = e.target.closest('[data-act]')?.dataset.act; if (!a) return;
    if (a === 'back') closeDetail(); else if (a === 'prev') go(-1); else if (a === 'next') go(1);
    else if (a === 'dl') download(p, S.format);
    else if (a === 'street') { closeDetail(true); S.view = 'wall'; S.wall.focus = [p.id]; renderMain(); window.scrollTo(0, 0); }
    else if (a === 'shuffle') { const seed = ++seedCounter; const ri = $('.pf-regen-icon', ov); ri.classList.remove('spin'); void ri.offsetWidth; ri.classList.add('spin'); try { p.seed = seed; p.params = mod.random(rng(seed)); save(); build(); paint(); } catch (err) { console.error(err); toast('Could not shuffle'); } }
    else if (a === 'dup') { const q = { id: uid(), style: p.style, seed: p.seed, params: structuredClone(p.params) }; S.posters.splice(S.posters.indexOf(p) + 1, 0, q); save(); openDetail(q.id); toast('Duplicated'); }
  };
  S.open.go = go;
}
// ---------------------------------------------------------------- the wall: posters pasted on a street hoarding
function renderTray() {
  for (const id of [...S.picked]) if (!S.posters.some(p => p.id === id)) S.picked.delete(id);
  let t = $('#pf-tray'); if (!S.scenes.length || !S.picked.size || S.view === 'wall') { t?.remove(); return; }
  if (!t) { t = h('<div class="pf-tray" id="pf-tray" role="region" aria-label="Picked posters"></div>'); document.body.appendChild(t);
    t.onclick = e => { const a = e.target.closest('[data-act]')?.dataset.act; if (a === 'street') { S.view = 'wall'; S.wall.focus = null; renderMain(); window.scrollTo(0, 0); } if (a === 'none') { S.picked.clear(); renderMain(); } }; }
  t.innerHTML = '<span class="pf-tray-n">' + S.picked.size + ' picked</span><button class="btn btn-sm btn-ghost btn-rounded" data-act="none">Clear</button><button class="btn btn-sm btn-primary btn-rounded" data-act="street">' + I.street + 'See on the wall</button>';
}
const bitmaps = new Map(); // poster id → { sig, canvas } (the 2:3 street layout)
async function streetBitmap(p) {
  const sig = JSON.stringify(p.params); const hit = bitmaps.get(p.id); if (hit && hit.sig === sig) return hit.canvas;
  let tag; setFormat('street'); try { tag = svgTag(draw(p).svg, 'width="' + W + '" height="' + H + '"'); } finally { setFormat('poster'); }
  const canvas = await ST.rasterise(await inlineImages(tag), 1.5, 960, 1440); bitmaps.set(p.id, { sig, canvas }); return canvas;
}
function wallPool() { // which posters go up, in order
  if (S.wall.focus) { const f = S.wall.focus.map(id => S.posters.find(p => p.id === id)).filter(Boolean); if (f.length) return { list: f, from: 'focus' }; S.wall.focus = null; }
  const vis = visible(); const picked = vis.filter(p => S.picked.has(p.id)); if (picked.length) return { list: picked, from: 'picked' };
  return { list: vis, from: 'all' };
}
let wallToken = 0, wallCanvas = null, wallSheets = [];
function renderWall() {
  const box = $('#pf-wall'); if (!box) return; const wl = S.wall; const scene = S.scenes.find(s => s.id === wl.scene) || S.scenes[0]; wl.scene = scene.id;
  const pool = wallPool(); const plan = ST.arrange(scene, wl.pattern); const n = pool.list.length;
  const used = Math.min(plan.need, n);
  const note = pool.from === 'focus' ? 'One poster, pasted across the wall. <button class="lib-link" data-wall="all">Use all posters</button>'
    : (pool.from === 'picked' ? 'Your ' + n + ' picked poster' + (n === 1 ? '' : 's') : 'The ' + (S.style === 'all' ? '' : esc(S.styles[S.style].name) + ' ') + 'posters below') + ', ' + used + ' on the wall' + (n < plan.need ? '. This pattern takes ' + plan.need + ': generate more, or they repeat.' : '.') + ' Click a poster on the wall to tune it.';
  box.innerHTML = '<div class="pf-wall-stage" id="pf-wall-stage" data-busy="true" style="aspect-ratio:' + scene.w + ' / ' + scene.h + '"></div>' +
    '<div class="pf-wall-bar"><div class="pf-wall-walls" role="group" aria-label="Wall">' + S.scenes.map(s => '<button class="pf-wall-thumb" data-wall-scene="' + s.id + '" aria-pressed="' + (s.id === scene.id) + '" title="' + esc(s.name) + '" aria-label="' + esc(s.name) + '"><img src="' + esc(s.file) + '" alt=""></button>').join('') + '</div>' +
    '<div class="pf-wall-tools"><button class="btn btn-sm btn-secondary btn-rounded" data-wall="shuffle"' + (n < 2 ? ' disabled' : '') + '>' + I.shuffle + 'Shuffle</button><button class="btn btn-sm btn-primary btn-rounded" data-wall="dl">' + I.down + 'Download</button></div></div>' +
    '<div class="lens-row pf-wall-patterns"><span class="lens-word">Pattern</span>' + ST.PATTERNS.map(p => '<button class="lens-chip" data-pattern="' + p.id + '" aria-pressed="' + (p.id === wl.pattern) + '">' + esc(p.label) + '</button>').join('') + '</div>' +
    '<p class="pf-wall-note">' + note + '</p>' +
    '<p class="pf-wall-note pf-wall-credit">Wall photo from <a href="' + esc(scene.source) + '" target="_blank" rel="noopener">' + esc(scene.credit) + '</a>, via Visual Journal. Their posters are pasted over with ours; the photograph is theirs.</p>';
  box.onclick = async e => {
    const sc = e.target.closest('[data-wall-scene]'); if (sc) { wl.scene = sc.dataset.wallScene; return renderWall(); }
    const pt = e.target.closest('[data-pattern]'); if (pt) { wl.pattern = pt.dataset.pattern; return renderWall(); }
    const a = e.target.closest('[data-wall]')?.dataset.wall;
    if (a === 'all') { wl.focus = null; return renderWall(); }
    if (a === 'shuffle') { wl.offset = (wl.offset + Math.max(1, Math.min(plan.need, n - 1))) % Math.max(1, n); return renderWall(); }
    if (a === 'dl' && wallCanvas) { const name = 'wall-' + scene.id + '-' + wallCanvas.width + 'x' + wallCanvas.height + '.png'; wallCanvas.toBlob(b => { const u = URL.createObjectURL(b); const l = document.createElement('a'); l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); toast('Saved ' + name); }, 'image/png'); return; }
    const stage = e.target.closest('#pf-wall-stage'); if (stage && wallCanvas) { const r = stage.getBoundingClientRect(); const k = ST.sheetAt(scene, (e.clientX - r.left) / r.width * scene.w, (e.clientY - r.top) / r.height * scene.h); if (k >= 0 && wallSheets[k]) openDetail(wallSheets[k]); }
  };
  const my = ++wallToken; const stage = $('#pf-wall-stage', box);
  if (!n) { stage.dataset.busy = 'false'; return; }
  (async () => {
    try {
      const ids = plan.at.map(k => pool.list[(k + wl.offset) % n].id); const uniq = [...new Set(ids)]; const maps = new Map();
      for (const id of uniq) { maps.set(id, await streetBitmap(S.posters.find(p => p.id === id))); if (my !== wallToken) return; }
      const c = await ST.compose(scene, ids.map(id => maps.get(id)), { scale: 2, light: wl.light, creases: wl.creases, seed: 1 + wl.offset }); if (my !== wallToken) return;
      wallCanvas = c; wallSheets = ids; stage.replaceChildren(c); stage.dataset.busy = 'false';
    } catch (err) { console.error(err); if (my === wallToken) { stage.dataset.busy = 'false'; toast('Could not paste the posters'); } }
  })();
}

function closeDetail(silent) { if (!S.open) return; DK.closePopovers(); S.open.ov.remove(); S.open = null; if (!silent) renderMain(); }

// ---------------------------------------------------------------- export
async function inlineImages(svg) { // <image href="assets/…"> → data URLs so the file stands alone
  const urls = [...new Set([...svg.matchAll(/href="((?!data:)[^"]+)"/g)].map(m => m[1]))];
  for (const u of urls) { try { const b = await (await fetch(u)).blob(); const d = await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); }); svg = svg.split(`href="${u}"`).join(`href="${d}"`); } catch (e) { console.warn('image not inlined', u); } }
  return svg;
}
async function download(p, format) {
  const out = draw(p); if (out.flags.some(f => f.level === 'fail')) return toast('A rule fails. Fix it to download.');
  const kind = format === 'svg' ? 'svg' : 'png', scale = format === 'png4' ? 4 : 2;
  const name = `${(S.styles[p.style].name || p.style).toLowerCase().replace(/\W+/g, '-')}-${p.id}`;
  try {
    const svg = await inlineImages(svgTag(out.svg, `width="${W}" height="${H}"`));
    let blob = new Blob([svg], { type: 'image/svg+xml' }); let file = name + '.svg';
    if (kind === 'png') {
      const url = URL.createObjectURL(blob); const img = new Image(); img.decoding = 'sync'; await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('render failed')); img.src = url; });
      const cv = document.createElement('canvas'); cv.width = W * scale; cv.height = H * scale; cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
      blob = await new Promise(r => cv.toBlob(r, 'image/png')); file = `${name}-${W * scale}x${H * scale}.png`;
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Saved ' + file);
  } catch (e) { console.error(e); toast('Download failed: ' + e.message); }
}

// ---------------------------------------------------------------- toast
function toast(msg, action, fn) {
  const t = h(`<div class="toast" role="status" style="display:flex;align-items:center;gap:8px"><span class="toast-title">${esc(msg)}</span>${action ? `<button class="btn btn-xs btn-tertiary toast-action">${esc(action)}</button>` : ''}</div>`);
  $('#toasts').appendChild(t); const kill = () => t.remove(); if (action) $('button', t).onclick = () => { fn(); kill(); }; setTimeout(kill, action ? 6000 : 2600);
}

// ---------------------------------------------------------------- boot
async function boot() {
  try { const th = localStorage.getItem('pf.theme'); if (th) document.documentElement.dataset.theme = th; } catch { }
  renderShell();
  const mods = await Promise.all(STYLE_IDS.map(async id => { try { const m = (await import(`../styles/${id}.js`)).default; if (m.init) await m.init(); return m; } catch (e) { console.warn(`style ${id} not available:`, e.message); return null; } }));
  mods.forEach(m => { if (m) { S.styles[m.id] = m; S.order.push(m.id); } });
  try { S.posters = (JSON.parse(localStorage.getItem(KEY)) || []).filter(p => S.styles[p.style]); } catch { S.posters = []; }
  const q = new URLSearchParams(location.search); if (q.get('style') && S.styles[q.get('style')]) S.style = q.get('style');
  try { S.scenes = await ST.loadScenes(); } catch { S.scenes = []; } // the street photos are not part of every build
  renderMain();
  if (!S.posters.length && S.order.length) generate();
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return; const inCtl = e.target.closest('.dialkit-root, .dialkit-select-dropdown, .dialkit-image-popover, input, textarea, select');
    if (S.open) { if (e.key === 'Escape') { if (DK.isPopoverOpen()) DK.closePopovers(); else if (!e.target.closest('input, textarea')) closeDetail(); } else if (!inCtl && e.key === 'ArrowLeft') S.open.go(-1); else if (!inCtl && e.key === 'ArrowRight') S.open.go(1); else if (!e.target.closest('input, textarea') && e.key === 'r') $('[data-act="shuffle"]', S.open.ov).click(); }
    else if (!inCtl && e.key === 'g') generate();
  });
}
boot();
