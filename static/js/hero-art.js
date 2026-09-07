/* Start only the resolved theme during parsing; warm its companion afterward. */
(() => {
  const hero = document.currentScript.closest('.cl-hero-art');
  const images = [...hero.querySelectorAll('picture[data-art-theme] > img')];
  const selected = () => images.find(img => img.parentElement.dataset.artTheme === document.documentElement.dataset.studyTheme);
  function load(img, priority) {
    if (!img.dataset.src) return;
    img.fetchPriority = priority;
    img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.srcset;
    delete img.dataset.src;
  }
  function activate() {
    const active = selected();
    images.forEach(img => { img.fetchPriority = img === active ? 'high' : 'low'; });
    load(active, 'high');
  }
  const initial = selected();
  let warmed = false;
  function warmCompanion() {
    if (warmed) return;
    warmed = true;
    images.forEach(img => load(img, 'low'));
  }
  initial.addEventListener('load', warmCompanion, { once: true });
  initial.addEventListener('error', warmCompanion, { once: true });
  window.addEventListener('faros:theme-change', activate);
  activate();
})();
