(function () {
  'use strict';
  if (location.hostname !== 'experiments.supermega.design' || navigator.webdriver || self !== top) return;
  try {
    if (/[?&]staff=1\b/.test(location.search)) localStorage.setItem('smd-staff', '1');
    if (localStorage.getItem('smd-staff') === '1') return;
  } catch (e) {}
  var page = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  var nav = (performance.getEntriesByType('navigation')[0] || {}).type, src = new URLSearchParams(location.search).get('utm_source') || '';
  if (!src && nav !== 'reload' && nav !== 'back_forward' && document.referrer) { try { if (new URL(document.referrer).hostname !== location.hostname) src = document.referrer; } catch (e) {} }
  var body = { e: 'view', p: page, m: matchMedia('(max-width:640px)').matches ? 1 : 0 };
  if (src) body.src = src;
  try { fetch('https://supermega.design/api/e', { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'content-type': 'text/plain' }, body: JSON.stringify(body) }).catch(function () {}); } catch (e) {}
})();
