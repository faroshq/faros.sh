(() => {
  if (!document.body.classList.contains('cl-material-motion')) return;
  const ns = 'http://www.w3.org/2000/svg';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function element(tag, attributes) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    return node;
  }
  const fragment = id => `${location.pathname}#${id}`;
  const hero = document.querySelector('.cl-hero-art');
  const circuit = hero?.querySelector('.cl-circuit');
  if (circuit) {
    // Coordinates trace the existing glass intersections in the 1536 x 1024 masters.
    // No resting outline is added: only a passing reflection makes these edges visible.
    const paths = [
      ['M1052 530 992 506V626L909 603V224L721 277', '0s'],
      ['M1052 530 1117 520V601L1082 608V280', '2.1s'],
      ['M992 626 909 603 721 568 776 557V429L608 468V589', '4.2s']
    ];
    const defs = element('defs', {});
    const bloom = element('filter', { id: 'cp-edge-bloom', x: '-8%', y: '-8%', width: '116%', height: '116%', 'color-interpolation-filters': 'sRGB' });
    bloom.append(element('feGaussianBlur', { stdDeviation: '2.4' }));
    defs.append(bloom);
    circuit.append(defs);
    const field = element('g', { class: 'cp-material-field', 'aria-hidden': 'true' });
    paths.forEach(([d, delay]) => {
      const route = element('g', { class: 'cp-material-route', style: `--cp-delay:${delay}` });
      route.append(element('path', { d, class: 'cp-reflection cp-reflection-bloom', pathLength: '1000', filter: `url(${fragment('cp-edge-bloom')})` }));
      route.append(element('path', { d, class: 'cp-reflection cp-reflection-edge', pathLength: '1000' }));
      field.append(route);
    });
    circuit.append(field);
    // Reuse the loaded, selected responsive resource; do not compete with hero-art.js.
    const emission = document.createElement('div');
    emission.className = 'cp-emission';
    emission.setAttribute('aria-hidden', 'true');
    const light = document.createElement('img');
    light.alt = '';
    light.width = 1536;
    light.height = 1024;
    light.fetchPriority = 'low';
    emission.append(light);
    hero.append(emission);
    let source = '';
    function syncImage() {
      const selected = hero.querySelector(`[data-art-theme="${root.dataset.studyTheme}"] img`);
      if (!selected?.complete || !selected.naturalWidth || !selected.currentSrc) {
        emission.hidden = true;
        return;
      }
      if (source !== selected.currentSrc) {
        source = selected.currentSrc;
        light.src = source;
      }
      emission.hidden = !light.complete || !light.naturalWidth || light.currentSrc !== source;
    }
    light.addEventListener('load', syncImage);
    light.addEventListener('error', () => { emission.hidden = true; });
    hero.querySelectorAll('.cl-picture img').forEach(img => img.addEventListener('load', syncImage));
    window.addEventListener('faros:theme-change', syncImage);
    syncImage();
  }

  // A single, short transmission connects the chosen tab to its existing video slot.
  const showcase = document.querySelector('.cl-workflow-inner');
  const tabs = document.querySelector('.cl-workflow-tabs');
  if (!showcase || !tabs) return;
  const connector = element('svg', { class: 'cp-workflow-connection', 'aria-hidden': 'true' });
  const path = element('path', { class: 'cp-transfer', pathLength: '1000' });
  connector.append(path);
  showcase.append(connector);
  let frame = 0;
  let visible = false;
  let selectedId = '';
  let pendingEntry = false;
  let transfer = null;
  const canAnimate = () => visible && root.dataset.motion === 'on' && !reduced.matches && !document.hidden;
  function draw() {
    frame = 0;
    const selected = tabs.querySelector('[aria-selected=true]');
    const slot = showcase.querySelector('.cl-workflow-panel:not([hidden]) .cl-video-slot');
    if (!selected || !slot) return;
    const box = showcase.getBoundingClientRect();
    const a = selected.getBoundingClientRect();
    const b = slot.getBoundingClientRect();
    const y = a.bottom - box.top;
    const height = b.top - a.bottom;
    if (height <= 0) return;
    connector.setAttribute('viewBox', `0 0 ${box.width} ${height}`);
    connector.style.top = `${y}px`;
    connector.style.height = `${height}px`;
    const from = a.left + a.width / 2 - box.left;
    const to = b.left + b.width / 2 - box.left;
    const middle = height / 2;
    path.setAttribute('d', `M${from} 0V${middle - 3}Q${from} ${middle} ${from + Math.sign(to - from) * 3} ${middle}H${to - Math.sign(to - from) * 3}Q${to} ${middle} ${to} ${middle + 3}V${height}`);
    const changed = selectedId !== selected.id;
    selectedId = selected.id;
    if ((changed || pendingEntry) && canAnimate()) transmit();
    pendingEntry = false;
  }
  function cancelTransfer() {
    transfer?.cancel();
    transfer = null;
  }
  function transmit() {
    cancelTransfer();
    if (typeof path.animate !== 'function') return;
    transfer = path.animate([
      { strokeDashoffset: '180', opacity: 0 },
      { strokeDashoffset: '0', opacity: .65, offset: .12 },
      { strokeDashoffset: '-820', opacity: .65, offset: .78 },
      { strokeDashoffset: '-1000', opacity: 0 }
    ], { duration: 1800, easing: 'cubic-bezier(.22,.61,.36,1)' });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function stopIfInactive() {
    if (!canAnimate()) cancelTransfer();
  }
  new MutationObserver(schedule).observe(tabs, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
  new MutationObserver(stopIfInactive).observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  reduced.addEventListener('change', stopIfInactive);
  document.addEventListener('visibilitychange', stopIfInactive);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(showcase);
  window.addEventListener('resize', schedule, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const entering = entries[0].isIntersecting;
      if (entering && !visible) { visible = true; pendingEntry = true; schedule(); }
      else { visible = entering; stopIfInactive(); }
    }, { threshold: .15 }).observe(showcase);
  }
  schedule();
})();
