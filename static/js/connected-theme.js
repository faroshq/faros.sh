(() => {
  const root = document.documentElement;
  const themePicker = document.querySelector('.cl-theme-picker');
  if (!themePicker || !window.FarosTheme) return;
  const themeButton = themePicker.querySelector('.cl-theme-toggle');
  const themeChoices = [...themePicker.querySelectorAll('[data-theme-choice]')];
  const motionButton = document.querySelector('.cl-motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let paused = read('faros-connected-motion') === 'off';
  function labelTheme() {
    const current = root.dataset.themePreference;
    themeButton.setAttribute('aria-label', `Choose theme, ${current} selected`);
    themeButton.title = `Theme: ${current[0].toUpperCase() + current.slice(1)}`;
    themeChoices.forEach(choice => choice.setAttribute('aria-pressed', String(choice.dataset.themeChoice === current)));
  }
  function closeThemePicker(restoreFocus = false) {
    themePicker.open = false;
    if (restoreFocus) themeButton.focus();
  }
  function motionState() {
    const active = !paused && !reduced.matches;
    if (!active && hero) hero.classList.remove('cl-arriving');
    root.dataset.motion = active ? 'on' : 'off';
    root.classList.toggle('cl-motion-suspended', document.hidden);
    if (!motionButton) return;
    motionButton.textContent = reduced.matches ? 'Reduced motion' : active ? 'Motion on' : 'Motion off';
    motionButton.setAttribute('aria-pressed', String(active));
    motionButton.disabled = reduced.matches;
    motionButton.title = reduced.matches ? 'Following your device’s reduced-motion preference' : 'Toggle circuit animation';
  }
  const hero = document.querySelector('.cl-hero-art');
  function alignCircuit() {
    if (!hero) return;
    const img = hero.querySelector(`[data-art-theme="${root.dataset.studyTheme}"] img`);
    const svg = hero.querySelector('.cl-circuit');
    const scale = Math.max(hero.clientWidth / 1536, hero.clientHeight / 1024);
    const position = getComputedStyle(img).objectPosition.split(' ').map(parseFloat);
    Object.assign(svg.style, {
      width: `${1536 * scale}px`, height: `${1024 * scale}px`,
      left: `${(hero.clientWidth - 1536 * scale) * position[0] / 100}px`,
      top: `${(hero.clientHeight - 1024 * scale) * position[1] / 100}px`
    });
  }
  function applyTheme(next) {
    closeThemePicker(true);
    if (next === root.dataset.themePreference) return;
    // Palette changes must not wait for artwork, including lazy offscreen images.
    // The existing CSS transition fades whichever images are ready.
    window.FarosTheme.set(next);
    labelTheme();
    alignCircuit();
  }
  themeChoices.forEach(choice => choice.addEventListener('click', () => applyTheme(choice.dataset.themeChoice)));
  themePicker.addEventListener('keydown', event => {
    if (event.key === 'Escape' && themePicker.open) {
      event.preventDefault();
      closeThemePicker(true);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      themePicker.open = true;
      const current = themeChoices.indexOf(document.activeElement);
      const next = event.key === 'ArrowDown' ? (current + 1) % themeChoices.length : (current < 0 ? themeChoices.length - 1 : (current + themeChoices.length - 1) % themeChoices.length);
      themeChoices[next].focus();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!themePicker.contains(event.target)) closeThemePicker();
  });
  themePicker.addEventListener('focusout', event => {
    if (!themePicker.contains(event.relatedTarget)) closeThemePicker();
  });
  motionButton?.addEventListener('click', () => {
    paused = !paused;
    save('faros-connected-motion', paused ? 'off' : 'on');
    motionState();
  });
  window.addEventListener('faros:theme-change', () => { labelTheme(); alignCircuit(); });
  labelTheme(); motionState();
  themePicker.hidden = false; if (motionButton) motionButton.hidden = false;
  reduced.addEventListener('change', motionState);
  document.addEventListener('visibilitychange', motionState);
  if (!hero) return;
  // Observe the detail artwork itself: on phones it can leave view before its section does.
  const sections = [hero.closest('section'), document.querySelector('.cl-detail-art')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('cl-motion-visible', entry.isIntersecting));
    }, { threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
  // Without visibility observation, keep the scene static rather than run unseen loops.
  if ('ResizeObserver' in window) new ResizeObserver(alignCircuit).observe(hero);
  window.addEventListener('resize', alignCircuit, { passive: true });
  alignCircuit();
  // Welcome once after the actual hero is ready. Theme changes and motion toggles
  // never replay the entrance; offscreen arrivals remain quiet.
  const arrivalImage = hero.querySelector(`[data-art-theme="${root.dataset.studyTheme}"] img`);
  arrivalImage.decode().then(() => {
    const bounds = hero.getBoundingClientRect();
    if (root.dataset.motion === 'on' && !document.hidden && bounds.top < innerHeight && bounds.bottom > 0) {
      hero.classList.add('cl-arriving');
    }
  }).catch(() => {});
  hero.addEventListener('animationend', event => {
    if (event.animationName === 'cl-arrival') hero.classList.remove('cl-arriving');
  });
})();
