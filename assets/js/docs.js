import { searchDocs } from './docs-search.mjs';
import { setupSearchDialog } from './docs-search-dialog.mjs';
setupSearchDialog();


// Top-layer popovers keep section links above the horizontally scrolling navbar.
document.querySelectorAll('.docs-nav-trigger').forEach(trigger => {
  const dropdown = document.getElementById(trigger.getAttribute('popovertarget'));
  if (typeof dropdown.showPopover !== 'function') return;
  trigger.hidden = false;
  trigger.parentElement.querySelector('.docs-nav-fallback').hidden = true;
  const position = () => {
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    dropdown.style.width = `${width}px`;
    dropdown.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - width - 16))}px`;
    dropdown.style.top = `${rect.bottom + 8}px`;
    dropdown.style.maxHeight = `${Math.max(80, window.innerHeight - rect.bottom - 24)}px`;
  };
  dropdown.addEventListener('beforetoggle', event => {
    if (event.newState === 'open') position();
  });
  dropdown.addEventListener('toggle', () => {
    trigger.setAttribute('aria-expanded', String(dropdown.matches(':popover-open')));
  });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!dropdown.matches(':popover-open')) dropdown.showPopover();
      dropdown.querySelector('a').focus();
    }
  });
  dropdown.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      dropdown.hidePopover();
      trigger.focus();
    }
  });
  window.addEventListener('resize', () => { if (dropdown.matches(':popover-open')) position(); });
  trigger.closest('.docs-primary').addEventListener('scroll', () => { if (dropdown.matches(':popover-open')) dropdown.hidePopover(); }, { passive: true });
});

// Native disclosure controls remain usable when JavaScript is unavailable.
const mobile = window.matchMedia('(max-width: 900px)');
function sizeNavigation() {
  document.querySelectorAll('.docs-navigation, .docs-toc').forEach(details => { details.open = !mobile.matches; });
}
sizeNavigation();
mobile.addEventListener('change', sizeNavigation);
document.querySelectorAll('.docs-navigation, .docs-toc').forEach(details => {
  details.addEventListener('keydown', event => {
    if (event.key === 'Escape' && details.open && (mobile.matches || !details.classList.contains('docs-navigation'))) {
      event.stopPropagation(); details.open = false; details.querySelector('summary').focus();
    }
  });
});

// The native popover keeps the chooser above the sidebar without moving its links.
// Unsupported browsers and no-JS readers retain the capability directory link.
const capabilityPicker = document.querySelector('#docs-capability-picker');
const capabilityTrigger = document.querySelector('.docs-capability-trigger');
if (capabilityPicker && capabilityTrigger && typeof capabilityPicker.showPopover === 'function') {
  capabilityTrigger.hidden = false;
  document.querySelector('.docs-capability-fallback').hidden = true;
  capabilityTrigger.setAttribute('aria-expanded', 'false');
  function positionPicker() {
    const anchor = capabilityTrigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const height = viewport?.height || window.innerHeight;
    const width = viewport?.width || window.innerWidth;
    const top = Math.max(16, Math.min(anchor.bottom + 8, height - 320));
    capabilityPicker.style.top = `${top}px`;
    capabilityPicker.style.left = `${Math.max(16, Math.min(anchor.left, width - Math.min(420, width - 32) - 16))}px`;
    capabilityPicker.style.maxHeight = `${height - top - 16}px`;
  }
  capabilityPicker.addEventListener('beforetoggle', event => {
    if (event.newState === 'open') positionPicker();
  });
  capabilityPicker.addEventListener('toggle', () => {
    capabilityTrigger.setAttribute('aria-expanded', String(capabilityPicker.matches(':popover-open')));
    positionPicker();
  });
  window.addEventListener('resize', positionPicker);
  window.addEventListener('scroll', positionPicker, { passive: true });
}

const search = document.querySelector('#docs-search');
if (search) {
  const form = document.querySelector('#docs-search-form');
  const query = document.querySelector('#docs-query');
  const scope = document.querySelector('#docs-scope');
  const status = document.querySelector('#docs-search-status');
  const results = document.querySelector('#docs-search-results');
  const params = new URLSearchParams(location.search);
  query.value = params.get('q') || '';
  scope.value = [...scope.options].some(option => option.value === params.get('provider')) ? params.get('provider') : '';
  let indexPromise;
  let request = 0;
  async function render(updateURL = true) {
    const serial = ++request;
    const text = query.value.trim();
    const provider = scope.value;
    if (updateURL) {
      const url = new URL(location.href); url.search = '';
      if (text) url.searchParams.set('q', text);
      if (provider) url.searchParams.set('provider', provider);
      history.replaceState(null, '', url);
    }
    results.replaceChildren();
    if (!text) { status.textContent = 'Enter a topic to search all documentation, or choose a provider.'; return; }
    status.textContent = 'Searching documentation…';
    try {
      indexPromise ||= fetch(search.dataset.index).then(response => {
        if (!response.ok) throw new Error('Index unavailable');
        return response.json();
      }).then(pages => {
        if (!Array.isArray(pages)) throw new Error('Invalid index');
        return pages;
      }).catch(error => { indexPromise = null; throw error; });
      const pages = await indexPromise;
      if (serial !== request) return;
      const matches = searchDocs(pages, text, provider);
      status.textContent = matches.length ? `${matches.length} result${matches.length === 1 ? '' : 's'}${provider ? ` in ${scope.selectedOptions[0].text}` : ' across all documentation'}.` : 'No results. Try fewer words or choose All documentation.';
      for (const page of matches.slice(0, 50)) {
        const item = document.createElement('li');
        const meta = document.createElement('p'); meta.className = 'docs-search-meta'; meta.textContent = `${page.providerTitle} · ${page.type}`;
        const link = document.createElement('a'); link.href = page.url; link.textContent = page.title;
        const summary = document.createElement('p'); summary.textContent = page.description;
        item.append(meta, link, summary); results.append(item);
      }
      if (matches.length > 50) status.textContent += ' Showing the first 50; add words to narrow your search.';
    } catch {
      if (serial === request) status.textContent = 'Search could not load. Submit again to retry, or browse the documentation navigation.';
    }
  }
  form.addEventListener('submit', event => { event.preventDefault(); render(); });
  scope.addEventListener('change', () => render());
  if (query.value.trim()) render(false);
}

// Progressive enhancement: without JavaScript all setup instructions remain visible.
const connect = document.querySelector('.docs-connect');
if (connect) {
  const tablist = connect.querySelector('[role="tablist"]');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const feedback = connect.querySelector('.docs-connect-status');
  const copyButton = connect.querySelector('[data-copy-connect]');
  connect.querySelector('.docs-connect-toolbar').hidden = false;
  let copyRequest = 0;
  tablist.hidden = false;
  connect.querySelectorAll('.docs-connect-fallback-title').forEach(title => { title.hidden = true; });
  function activate(tab, focus = false) {
    copyRequest++;
    feedback.textContent = '';
    copyButton.dataset.copyConnect = `${tab.getAttribute('aria-controls')}-text`;
    const copyLabel = tab.id === 'connect-tab-prompt' ? 'Copy prompt' : 'Copy commands';
    copyButton.setAttribute('aria-label', copyLabel);
    copyButton.title = copyLabel;
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      panel.hidden = !selected;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', item.id);
      panel.tabIndex = 0;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
    });
  });
  activate(tabs[0]);
  connect.querySelectorAll('[data-copy-connect]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const serial = ++copyRequest;
      const text = document.getElementById(button.dataset.copyConnect).textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        if (serial === copyRequest) feedback.textContent = 'Copied to clipboard.';
      } catch {
        if (serial === copyRequest) feedback.textContent = 'Copy unavailable. Select the text above and copy it manually.';
      }
    });
  });
}

const pageRail = document.querySelector('.docs-page-rail');
if (pageRail) {
  const disclosure = pageRail.querySelector('details');
  const narrowReading = window.matchMedia('(max-width: 1150px)');
  const sizeRail = () => { disclosure.open = !narrowReading.matches; };
  sizeRail();
  narrowReading.addEventListener('change', sizeRail);
  disclosure.addEventListener('keydown', event => {
    if (event.key === 'Escape' && narrowReading.matches && disclosure.open) {
      event.stopPropagation(); disclosure.open = false; disclosure.querySelector('summary').focus();
    }
  });
  const status = pageRail.querySelector('.docs-page-copy-status');
  const markdownFallback = pageRail.querySelector('[data-markdown-fallback]');
  markdownFallback.hidden = true;
  let markdownPromise;
  let operation = 0;
  pageRail.querySelectorAll('[data-page-copy]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const serial = ++operation;
      status.textContent = 'Preparing page…';
      try {
        markdownPromise ||= fetch(pageRail.dataset.markdownUrl).then(response => {
          if (!response.ok) throw new Error('Markdown unavailable');
          return response.text();
        }).catch(error => { markdownPromise = null; throw error; });
        const markdown = await markdownPromise;
        const text = markdown;
        if (serial !== operation) return;
        await navigator.clipboard.writeText(text);
        if (serial === operation) status.textContent = 'Markdown copied.';
      } catch {
        if (serial === operation) {
          status.textContent = 'Copy unavailable. Use the Markdown link to copy manually.';
          markdownFallback.hidden = false;
        }
      }
    });
  });
  // Reflect the section nearest the reading position, without moving keyboard focus.
  const tocLinks = [...pageRail.querySelectorAll('.docs-rail-toc a[href^="#"]')];
  const sections = tocLinks.map(link => ({ link, heading: document.getElementById(decodeURIComponent(link.hash.slice(1))) })).filter(item => item.heading);
  let scheduled = false;
  function updateSection() {
    scheduled = false;
    let current = sections[0];
    for (const item of sections) { if (item.heading.getBoundingClientRect().top <= 170) current = item; }
    for (const item of sections) {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateSection); }
  }, { passive: true });
  updateSection();
}

document.querySelectorAll('.docs-code-block').forEach(block => {
  const source = block.querySelector('.docs-code-source').value;
  const pre = block.querySelector('pre');
  const status = block.querySelector('.docs-code-status');
  const wrap = block.querySelector('[data-code-wrap]');
  const copy = block.querySelector('[data-code-copy]');
  block.querySelector('.docs-code-actions').hidden = false;
  pre.setAttribute('aria-label', `${block.dataset.codeLanguage} code example`);
  block.querySelectorAll('.line').forEach((line, index) => {
    const number = document.createElement('span');
    number.className = 'docs-code-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = index + 1;
    line.prepend(number);
  });
  wrap.addEventListener('click', () => {
    const wrapped = block.classList.toggle('docs-code-wrapped');
    wrap.setAttribute('aria-pressed', String(wrapped));
    wrap.setAttribute('aria-label', wrapped ? 'Turn off line wrapping' : 'Wrap long lines');
    wrap.title = wrapped ? 'Turn off line wrapping' : 'Wrap long lines';
  });
  let resetCopy;
  copy.addEventListener('click', async () => {
    clearTimeout(resetCopy);
    try {
      await navigator.clipboard.writeText(source);
      status.textContent = 'Copied to clipboard.';
      copy.dataset.copied = 'true';
      copy.setAttribute('aria-label', 'Code copied');
      resetCopy = setTimeout(() => {
        status.textContent = '';
        delete copy.dataset.copied;
        copy.setAttribute('aria-label', 'Copy code');
      }, 2500);
    } catch {
      status.textContent = 'Copy unavailable. Select the code and copy it manually.';
      pre.focus();
    }
  });
});

const themeControl = document.querySelector('.docs-theme-control');
if (themeControl) {
  const trigger = themeControl.querySelector('summary');
  const choices = [...themeControl.querySelectorAll('[data-theme-choice]')];
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let preference = document.documentElement.dataset.docsTheme || 'system';
  function applyTheme() {
    const dark = preference === 'dark' || (preference === 'system' && systemTheme.matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    document.documentElement.dataset.docsTheme = preference;
    trigger.setAttribute('aria-label', `Documentation theme: ${preference[0].toUpperCase() + preference.slice(1)}`);
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice.dataset.themeChoice === preference)));
    themeControl.querySelectorAll('[data-theme-icon]').forEach(icon => { icon.hidden = icon.dataset.themeIcon !== preference; });
  }
  themeControl.hidden = false;
  applyTheme();
  choices.forEach((choice, index) => {
    choice.addEventListener('click', () => {
      preference = choice.dataset.themeChoice;
      try { localStorage.setItem('faros-docs-theme', preference); } catch {}
      applyTheme();
      themeControl.open = false;
      trigger.focus();
    });
    choice.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown') next = (index + 1) % choices.length;
      if (event.key === 'ArrowUp') next = (index + choices.length - 1) % choices.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = choices.length - 1;
      if (next !== undefined) { event.preventDefault(); choices[next].focus(); }
    });
  });
  themeControl.addEventListener('keydown', event => {
    if (event.key === 'Escape') { themeControl.open = false; trigger.focus(); }
    if (event.target === trigger && event.key === 'ArrowDown') {
      event.preventDefault(); themeControl.open = true; choices.find(choice => choice.dataset.themeChoice === preference).focus();
    }
  });
  document.addEventListener('click', event => { if (!themeControl.contains(event.target)) themeControl.open = false; });
  document.addEventListener('focusin', event => { if (!themeControl.contains(event.target)) themeControl.open = false; });
  systemTheme.addEventListener('change', applyTheme);
  window.addEventListener('storage', event => {
    if (event.key !== 'faros-docs-theme' && event.key !== null) return;
    preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : 'system';
    applyTheme();
  });
}
