import { searchDocs } from './docs-search.mjs';

export function setupSearchDialog() {
  const dialog = document.querySelector('#docs-search-dialog');
  const trigger = document.querySelector('.docs-search-trigger');
  if (!dialog || !trigger || typeof dialog.showModal !== 'function') return;
  const query = dialog.querySelector('input');
  const results = dialog.querySelector('.docs-modal-results');
  const status = dialog.querySelector('.docs-modal-status');
  const suggestions = dialog.querySelector('.docs-search-suggestions');
  const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  trigger.querySelector('kbd').textContent = shortcut;
  trigger.setAttribute('aria-keyshortcuts', shortcut === '⌘ K' ? 'Meta+K' : 'Control+K');
  trigger.hidden = false;
  document.querySelector('.docs-header-search').hidden = true;
  let opener;
  let indexPromise;
  let request = 0;
  let timer;
  const open = () => {
    if (dialog.open) { query.focus(); return; }
    opener = document.activeElement;
    dialog.showModal();
    query.focus();
    render();
  };
  trigger.addEventListener('click', open);
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k' && !event.isComposing) {
      event.preventDefault();
      open();
    }
  });
  dialog.querySelector('.docs-search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
    }
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    ++request;
    clearTimeout(timer);
    if (opener?.isConnected) opener.focus();
  });
  async function render() {
    const serial = ++request;
    const text = query.value.trim();
    results.replaceChildren();
    suggestions.hidden = Boolean(text);
    if (!text) { status.textContent = 'Enter a topic to search documentation.'; return; }
    status.textContent = 'Searching documentation…';
    try {
      indexPromise ||= fetch('/docs/index.json').then(response => {
        if (!response.ok) throw new Error('Index unavailable');
        return response.json();
      }).then(pages => {
        if (!Array.isArray(pages)) throw new Error('Invalid index');
        return pages;
      }).catch(error => { indexPromise = null; throw error; });
      const matches = searchDocs(await indexPromise, text, '');
      if (serial !== request || !dialog.open) return;
      status.textContent = matches.length ? `${matches.length} results. Showing up to 20.` : 'No results. Try fewer or different words.';
      for (const page of matches.slice(0, 20)) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = page.url;
        const title = document.createElement('strong'); title.textContent = page.title;
        const description = document.createElement('span'); description.textContent = page.description;
        link.append(title, description); item.append(link); results.append(item);
      }
    } catch {
      if (serial === request && dialog.open) status.textContent = 'Search could not load. Press Enter to retry.';
    }
  }
  query.addEventListener('input', () => {
    ++request;
    clearTimeout(timer);
    timer = setTimeout(render, 150);
  });
  dialog.querySelector('form').addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); render(); });
}
