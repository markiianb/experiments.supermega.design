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
  logo: '<svg viewBox="0 0 66 30" fill="currentColor" role="img" aria-label="Poster Factory"><path d="M7.64502 3.41162C8.37549 4.19189 8.74072 5.3374 8.74072 6.84814C8.74072 8.44189 8.38102 9.65658 7.66162 10.4922C6.94775 11.3278 6.02637 11.7456 4.89746 11.7456C4.17806 11.7456 3.5804 11.5658 3.10449 11.2061C2.8444 11.0068 2.58984 10.7163 2.34082 10.3345V15.0493H0V2.44043H2.26611V3.77686C2.52067 3.38395 2.79183 3.07406 3.07959 2.84717C3.60531 2.4432 4.23063 2.24121 4.95557 2.24121C6.01253 2.24121 6.90902 2.63135 7.64502 3.41162ZM6.30029 6.96436C6.30029 6.26709 6.13981 5.65006 5.81885 5.11328C5.50342 4.5765 4.98877 4.30811 4.2749 4.30811C3.41716 4.30811 2.8278 4.71484 2.50684 5.52832C2.34082 5.95996 2.25781 6.50781 2.25781 7.17188C2.25781 8.22331 2.53727 8.96208 3.09619 9.38818C3.42822 9.63721 3.82113 9.76172 4.2749 9.76172C4.93343 9.76172 5.43424 9.50716 5.77734 8.99805C6.12598 8.48893 6.30029 7.81104 6.30029 6.96436Z"/><path d="M18.0044 3.58594C18.7681 4.54329 19.1499 5.67497 19.1499 6.98096C19.1499 8.30908 18.7681 9.44629 18.0044 10.3926C17.2407 11.3333 16.0814 11.8037 14.5264 11.8037C12.9714 11.8037 11.812 11.3333 11.0483 10.3926C10.2847 9.44629 9.90283 8.30908 9.90283 6.98096C9.90283 5.67497 10.2847 4.54329 11.0483 3.58594C11.812 2.62858 12.9714 2.1499 14.5264 2.1499C16.0814 2.1499 17.2407 2.62858 18.0044 3.58594ZM14.5181 4.15039C13.8263 4.15039 13.2923 4.39665 12.916 4.88916C12.5452 5.37614 12.3599 6.0734 12.3599 6.98096C12.3599 7.88851 12.5452 8.58854 12.916 9.08105C13.2923 9.57357 13.8263 9.81982 14.5181 9.81982C15.2098 9.81982 15.741 9.57357 16.1118 9.08105C16.4826 8.58854 16.668 7.88851 16.668 6.98096C16.668 6.0734 16.4826 5.37614 16.1118 4.88916C15.741 4.39665 15.2098 4.15039 14.5181 4.15039Z"/><path d="M27.0854 2.85547C27.7938 3.30924 28.2005 4.08952 28.3057 5.19629H25.9399C25.9067 4.89193 25.821 4.6512 25.6826 4.47412C25.4225 4.15316 24.9798 3.99268 24.3545 3.99268C23.8398 3.99268 23.4718 4.07292 23.2505 4.2334C23.0347 4.39388 22.9268 4.58203 22.9268 4.79785C22.9268 5.06901 23.043 5.26546 23.2754 5.38721C23.5078 5.51449 24.3296 5.73307 25.7407 6.04297C26.6815 6.26432 27.387 6.59912 27.8574 7.04736C28.3223 7.50114 28.5547 8.06836 28.5547 8.74902C28.5547 9.64551 28.2199 10.3787 27.5503 10.9487C26.8862 11.5132 25.8569 11.7954 24.4624 11.7954C23.0402 11.7954 21.9888 11.4966 21.3081 10.8989C20.633 10.2957 20.2954 9.5293 20.2954 8.59961H22.6943C22.7441 9.02018 22.8521 9.31901 23.0181 9.49609C23.3114 9.81152 23.8537 9.96924 24.645 9.96924C25.1099 9.96924 25.4779 9.90007 25.749 9.76172C26.0257 9.62337 26.1641 9.41585 26.1641 9.13916C26.1641 8.87354 26.0534 8.67155 25.832 8.5332C25.6107 8.39486 24.7889 8.1569 23.3667 7.81934C22.3429 7.56478 21.6208 7.24658 21.2002 6.86475C20.7796 6.48844 20.5693 5.94613 20.5693 5.23779C20.5693 4.40218 20.8958 3.68555 21.5488 3.08789C22.2074 2.4847 23.1315 2.18311 24.3213 2.18311C25.4502 2.18311 26.3716 2.40723 27.0854 2.85547Z"/><path d="M34.4565 9.80322V11.5713L33.3359 11.6128C32.2181 11.6515 31.4544 11.4578 31.0449 11.0317C30.7793 10.7606 30.6465 10.3428 30.6465 9.77832V4.2085H29.3848V2.52344H30.6465V0H32.9873V2.52344H34.4565V4.2085H32.9873V8.98975C32.9873 9.36051 33.0343 9.59294 33.1284 9.68701C33.2225 9.77555 33.5103 9.81982 33.9917 9.81982C34.0636 9.81982 34.1383 9.81982 34.2158 9.81982C34.2988 9.81429 34.3791 9.80876 34.4565 9.80322Z"/><path d="M43.7202 8.83203C43.6593 9.36882 43.3799 9.9139 42.8818 10.4673C42.1071 11.3472 41.0225 11.7871 39.6279 11.7871C38.4769 11.7871 37.4614 11.4163 36.5815 10.6748C35.7017 9.93327 35.2617 8.72689 35.2617 7.05566C35.2617 5.48958 35.6574 4.28874 36.4487 3.45312C37.2456 2.61751 38.2777 2.19971 39.5449 2.19971C40.2975 2.19971 40.9754 2.34082 41.5786 2.62305C42.1818 2.90527 42.6799 3.35075 43.0728 3.95947C43.4269 4.49626 43.6566 5.11881 43.7617 5.82715C43.8226 6.24219 43.8475 6.83984 43.8364 7.62012H37.644C37.6772 8.52767 37.9622 9.16406 38.499 9.5293C38.8255 9.75618 39.2184 9.86963 39.6777 9.86963C40.1647 9.86963 40.5604 9.73128 40.8647 9.45459C41.0308 9.30518 41.1774 9.09766 41.3047 8.83203H43.7202ZM41.3794 6.05957C41.3407 5.43424 41.1497 4.9611 40.8066 4.64014C40.4691 4.31364 40.0485 4.15039 39.5449 4.15039C38.9971 4.15039 38.571 4.32194 38.2666 4.66504C37.9678 5.00814 37.7796 5.47298 37.7021 6.05957H41.3794Z"/><path d="M49.9873 4.62354C49.0355 4.62354 48.3963 4.93343 48.0698 5.55322C47.8872 5.90186 47.7959 6.43864 47.7959 7.16357V11.4883H45.4136V2.44043H47.6714V4.01758C48.0366 3.41439 48.3548 3.00212 48.626 2.78076C49.0687 2.40999 49.6442 2.22461 50.3525 2.22461C50.3968 2.22461 50.4328 2.22738 50.4604 2.23291C50.4937 2.23291 50.5628 2.23568 50.668 2.24121V4.66504C50.5186 4.64844 50.3857 4.63737 50.2695 4.63184C50.1533 4.6263 50.0592 4.62354 49.9873 4.62354Z"/><path d="M14.3081 13.1782V15.104C14.1753 15.0874 13.9512 15.0763 13.6357 15.0708C13.3258 15.0597 13.11 15.1289 12.9883 15.2783C12.8721 15.4222 12.814 15.5827 12.814 15.7598V16.5234H14.3662V18.1919H12.814V25.4883H10.4565V18.1919H9.13672V16.5234H10.4316V15.9424C10.4316 14.974 10.5949 14.3071 10.9214 13.9419C11.2645 13.3996 12.0918 13.1284 13.4033 13.1284C13.5527 13.1284 13.6883 13.134 13.8101 13.145C13.9318 13.1506 14.0978 13.1616 14.3081 13.1782Z"/><path d="M16.0679 17.4199C16.6932 16.623 17.7668 16.2246 19.2886 16.2246C20.2791 16.2246 21.159 16.4211 21.9282 16.814C22.6974 17.2069 23.082 17.9484 23.082 19.0386V23.189C23.082 23.4767 23.0876 23.8254 23.0986 24.2349C23.1152 24.5448 23.1623 24.755 23.2397 24.8657C23.3172 24.9764 23.4334 25.0677 23.5884 25.1396V25.4883H21.0151C20.9432 25.3057 20.8934 25.1341 20.8657 24.9736C20.8381 24.8132 20.8159 24.6305 20.7993 24.4258C20.4728 24.7799 20.0965 25.0815 19.6704 25.3306C19.1613 25.6239 18.5858 25.7705 17.9438 25.7705C17.1248 25.7705 16.4469 25.5381 15.9102 25.0732C15.3789 24.6029 15.1133 23.9388 15.1133 23.0811C15.1133 21.9688 15.5422 21.1636 16.3999 20.6655C16.8703 20.3944 17.562 20.2007 18.4751 20.0845L19.2803 19.9849C19.7174 19.9295 20.0301 19.8604 20.2183 19.7773C20.5558 19.6335 20.7246 19.4093 20.7246 19.105C20.7246 18.7342 20.5946 18.4797 20.3345 18.3413C20.0799 18.1974 19.7036 18.1255 19.2056 18.1255C18.6466 18.1255 18.251 18.2638 18.0186 18.5405C17.8525 18.7453 17.7419 19.022 17.6865 19.3706H15.4038C15.4536 18.5793 15.675 17.929 16.0679 17.4199ZM17.8276 23.7783C18.049 23.9609 18.3202 24.0522 18.6411 24.0522C19.1502 24.0522 19.6178 23.9028 20.0439 23.604C20.4756 23.3052 20.6997 22.7601 20.7163 21.9688V21.0889C20.5669 21.1829 20.4147 21.2604 20.2598 21.3213C20.1104 21.3766 19.9028 21.4292 19.6372 21.479L19.106 21.5786C18.6079 21.6672 18.251 21.7751 18.0352 21.9023C17.6699 22.1182 17.4873 22.453 17.4873 22.9067C17.4873 23.3107 17.6007 23.6012 17.8276 23.7783Z"/><path d="M33.0181 19.686H30.5942C30.55 19.3485 30.4365 19.0441 30.2539 18.7729C29.9883 18.4077 29.576 18.2251 29.0171 18.2251C28.2202 18.2251 27.6751 18.6208 27.3818 19.4121C27.2269 19.8327 27.1494 20.3916 27.1494 21.0889C27.1494 21.7529 27.2269 22.2869 27.3818 22.6909C27.6641 23.4435 28.1953 23.8198 28.9756 23.8198C29.529 23.8198 29.9219 23.6704 30.1543 23.3716C30.3867 23.0728 30.5278 22.6854 30.5776 22.2095H32.9932C32.9378 22.9289 32.6777 23.6095 32.2129 24.2515C31.4714 25.2863 30.3729 25.8037 28.9175 25.8037C27.4621 25.8037 26.3913 25.3721 25.7051 24.5088C25.0189 23.6455 24.6758 22.5249 24.6758 21.147C24.6758 19.592 25.0548 18.3828 25.813 17.5195C26.5711 16.6562 27.617 16.2246 28.9507 16.2246C30.0851 16.2246 31.012 16.4792 31.7314 16.9883C32.4564 17.4974 32.8853 18.3966 33.0181 19.686Z"/><path d="M38.7954 23.8032V25.5713L37.6748 25.6128C36.557 25.6515 35.7933 25.4578 35.3838 25.0317C35.1182 24.7606 34.9854 24.3428 34.9854 23.7783V18.2085H33.7236V16.5234H34.9854V14H37.3262V16.5234H38.7954V18.2085H37.3262V22.9897C37.3262 23.3605 37.3732 23.5929 37.4673 23.687C37.5614 23.7756 37.8491 23.8198 38.3306 23.8198C38.4025 23.8198 38.4772 23.8198 38.5547 23.8198C38.6377 23.8143 38.7179 23.8088 38.7954 23.8032Z"/><path d="M47.8599 17.5859C48.6235 18.5433 49.0054 19.675 49.0054 20.981C49.0054 22.3091 48.6235 23.4463 47.8599 24.3926C47.0962 25.3333 45.9368 25.8037 44.3818 25.8037C42.8268 25.8037 41.6675 25.3333 40.9038 24.3926C40.1401 23.4463 39.7583 22.3091 39.7583 20.981C39.7583 19.675 40.1401 18.5433 40.9038 17.5859C41.6675 16.6286 42.8268 16.1499 44.3818 16.1499C45.9368 16.1499 47.0962 16.6286 47.8599 17.5859ZM44.3735 18.1504C43.6818 18.1504 43.1478 18.3966 42.7715 18.8892C42.4007 19.3761 42.2153 20.0734 42.2153 20.981C42.2153 21.8885 42.4007 22.5885 42.7715 23.0811C43.1478 23.5736 43.6818 23.8198 44.3735 23.8198C45.0653 23.8198 45.5965 23.5736 45.9673 23.0811C46.3381 22.5885 46.5234 21.8885 46.5234 20.981C46.5234 20.0734 46.3381 19.3761 45.9673 18.8892C45.5965 18.3966 45.0653 18.1504 44.3735 18.1504Z"/><path d="M55.2559 18.6235C54.304 18.6235 53.6649 18.9334 53.3384 19.5532C53.1558 19.9019 53.0645 20.4386 53.0645 21.1636V25.4883H50.6821V16.4404H52.9399V18.0176C53.3052 17.4144 53.6234 17.0021 53.8945 16.7808C54.3372 16.41 54.9128 16.2246 55.6211 16.2246C55.6654 16.2246 55.7013 16.2274 55.729 16.2329C55.7622 16.2329 55.8314 16.2357 55.9365 16.2412V18.665C55.7871 18.6484 55.6543 18.6374 55.5381 18.6318C55.4219 18.6263 55.3278 18.6235 55.2559 18.6235Z"/><path d="M61.0083 23.1143L62.876 16.4404H65.3911L62.2866 25.3389C61.689 27.0544 61.2158 28.1169 60.8672 28.5264C60.5186 28.9414 59.8213 29.1489 58.7754 29.1489C58.5651 29.1489 58.3963 29.1462 58.269 29.1406C58.1418 29.1406 57.9508 29.1323 57.6963 29.1157V27.2231L57.9951 27.2397C58.2275 27.2508 58.4489 27.2425 58.6592 27.2148C58.8695 27.1872 59.0466 27.1235 59.1904 27.0239C59.3288 26.9298 59.4561 26.7334 59.5723 26.4346C59.694 26.1357 59.7438 25.9531 59.7217 25.8867L56.4014 16.4404H59.0327L61.0083 23.1143Z"/></svg>',
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
  $('#app').innerHTML = `<header class="hdr"><div class="hdr-left"><span class="logo pf-logo">${I.logo}</span></div><div></div>
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
