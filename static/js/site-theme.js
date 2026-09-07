/* Shared, pre-paint theme state for marketing and documentation. */
(() => {
  const root = document.documentElement;
  const key = 'faros-theme';
  const valid = value => ['light', 'dark', 'system'].includes(value);
  const read = name => { try { return localStorage.getItem(name); } catch { return null; } };
  const system = matchMedia('(prefers-color-scheme: dark)');
  // A shared choice wins; otherwise preserve the selected marketing theme, then docs.
  let preference = [read(key), read('faros-connected-theme'), read('faros-docs-theme')].find(valid) || 'dark';
  function render() {
    const resolved = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.themePreference = preference;
    root.dataset.studyTheme = resolved;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
    window.dispatchEvent(new CustomEvent('faros:theme-change'));
  }
  function set(next) {
    if (!valid(next)) return;
    preference = next;
    try { localStorage.setItem(key, preference); } catch {}
    render();
  }
  window.FarosTheme = { set, resolve: next => next === 'system' ? (system.matches ? 'dark' : 'light') : next };
  set(preference);
  system.addEventListener('change', () => { if (preference === 'system') render(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : 'dark';
    render();
  });
})();
