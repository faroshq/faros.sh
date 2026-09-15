/* Shared, pre-paint theme state for marketing and documentation. */
(() => {
  const root = document.documentElement;
  const key = 'railgrid-theme';
  const valid = value => ['light', 'dark', 'system'].includes(value);
  const read = name => { try { return localStorage.getItem(name); } catch { return null; } };
  const system = matchMedia('(prefers-color-scheme: dark)');
  // Prefer the current key, then migrate the former shared or page-specific choice.
  let preference = [read(key), read('faros-theme'), read('faros-connected-theme'), read('faros-docs-theme')].find(valid) || 'dark';
  function render() {
    const resolved = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.themePreference = preference;
    root.dataset.studyTheme = resolved;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
    window.dispatchEvent(new CustomEvent('railgrid:theme-change'));
  }
  function set(next) {
    if (!valid(next)) return;
    preference = next;
    try { localStorage.setItem(key, preference); } catch {}
    render();
  }
  window.RailgridTheme = { set, resolve: next => next === 'system' ? (system.matches ? 'dark' : 'light') : next };
  set(preference);
  system.addEventListener('change', () => { if (preference === 'system') render(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : 'dark';
    render();
  });
})();
