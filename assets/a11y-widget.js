(function () {
  var STORAGE_KEY = 'a11y-settings';
  var TOGGLES = [
    { id: 'large-text', label: 'הגדלת טקסט', icon: '🔎', class: 'a11y-large-text' },
    { id: 'contrast', label: 'ניגודיות גבוהה', icon: '◐', class: 'a11y-contrast' },
    { id: 'underline-links', label: 'הדגשת קישורים', icon: '🔗', class: 'a11y-underline-links' },
    { id: 'no-motion', label: 'עצירת אנימציות', icon: '⏸', class: 'a11y-no-motion' },
    { id: 'line-height', label: 'ריווח שורות', icon: '☰', class: 'a11y-line-height' },
    { id: 'letter-spacing', label: 'ריווח אותיות', icon: '↔', class: 'a11y-letter-spacing' },
    { id: 'big-cursor', label: 'סמן גדול', icon: '➤', class: 'a11y-big-cursor' },
    { id: 'readable-font', label: 'גופן קריא', icon: 'Aa', class: 'a11y-readable-font' }
  ];

  var CURSOR_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l14 8-6 2-2 6z' fill='%23000' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E";

  var style = document.createElement('style');
  style.textContent = [
    '.a11y-btn{position:fixed;z-index:9999;bottom:26px;right:26px;width:56px;height:56px;border-radius:50%;background:#0D3B5E;border:2px solid #1ABC9C;color:#fff;display:grid;place-items:center;font-size:26px;cursor:pointer;box-shadow:0 10px 26px rgba(0,0,0,.4)}',
    '.a11y-btn:hover{transform:scale(1.06)}',
    '.a11y-panel{position:fixed;z-index:9999;bottom:92px;right:26px;width:280px;max-width:calc(100vw - 40px);background:#0D3B5E;border:1px solid rgba(26,188,156,.3);border-radius:16px;padding:16px;box-shadow:0 20px 50px rgba(0,0,0,.5);display:none;font-family:Arial,Heebo,sans-serif;direction:rtl}',
    '.a11y-panel.open{display:block}',
    '@media(max-width:680px){.a11y-btn{bottom:96px;left:26px;right:auto}.a11y-panel{bottom:162px;left:26px;right:auto}}',
    '.a11y-panel h2{color:#fff;font-size:15px;font-weight:800;margin-bottom:12px}',
    '.a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.a11y-toggle{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:10px;color:#fff;padding:10px 6px;font-size:12px;cursor:pointer;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px}',
    '.a11y-toggle span.icon{font-size:17px}',
    '.a11y-toggle[aria-pressed="true"]{background:#1ABC9C;color:#0D3B5E;border-color:#1ABC9C;font-weight:800}',
    '.a11y-reset{width:100%;margin-top:10px;background:none;border:1px solid rgba(255,255,255,.25);color:rgba(255,255,255,.7);border-radius:10px;padding:8px;font-size:12px;cursor:pointer}',
    '.a11y-reset:hover{color:#fff;border-color:#fff}',
    '.a11y-large-text{zoom:1.25}',
    '.a11y-contrast, .a11y-contrast body{background:#000 !important}',
    '.a11y-contrast *:not(img):not(svg):not(image){background-color:#000 !important;color:#fff !important;border-color:#fff !important}',
    '.a11y-contrast a{color:#ffe600 !important}',
    '.a11y-underline-links a{text-decoration:underline !important;text-decoration-thickness:2px !important;text-underline-offset:3px !important}',
    '.a11y-no-motion *, .a11y-no-motion *::before, .a11y-no-motion *::after{animation:none !important;transition:none !important}',
    '.a11y-line-height, .a11y-line-height p, .a11y-line-height li{line-height:2.1 !important}',
    '.a11y-letter-spacing, .a11y-letter-spacing p, .a11y-letter-spacing li{letter-spacing:.04em !important;word-spacing:.15em !important}',
    '.a11y-big-cursor, .a11y-big-cursor *{cursor:url("' + CURSOR_SVG + '") 4 4, auto !important}',
    '.a11y-readable-font, .a11y-readable-font *{font-family:Arial,Helvetica,sans-serif !important}'
  ].join('\n');
  document.head.appendChild(style);

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function applyState(state) {
    TOGGLES.forEach(function (t) {
      document.documentElement.classList.toggle(t.class, !!state[t.id]);
    });
  }

  var state = loadState();
  applyState(state);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.createElement('button');
    btn.className = 'a11y-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'אפשרויות נגישות');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '♿';

    var panel = document.createElement('div');
    panel.className = 'a11y-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'תפריט נגישות');

    var heading = document.createElement('h2');
    heading.textContent = 'אפשרויות נגישות';
    panel.appendChild(heading);

    var grid = document.createElement('div');
    grid.className = 'a11y-grid';

    TOGGLES.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'a11y-toggle';
      b.setAttribute('aria-pressed', state[t.id] ? 'true' : 'false');
      b.innerHTML = '<span class="icon">' + t.icon + '</span>' + t.label;
      b.addEventListener('click', function () {
        state[t.id] = !state[t.id];
        applyState(state);
        saveState(state);
        b.setAttribute('aria-pressed', state[t.id] ? 'true' : 'false');
      });
      grid.appendChild(b);
    });
    panel.appendChild(grid);

    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'a11y-reset';
    reset.textContent = 'איפוס הגדרות';
    reset.addEventListener('click', function () {
      state = {};
      applyState(state);
      saveState(state);
      grid.querySelectorAll('.a11y-toggle').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    });
    panel.appendChild(reset);

    btn.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.body.appendChild(panel);
    document.body.appendChild(btn);
  });
})();
