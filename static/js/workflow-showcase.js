(() => {
  const showcase = document.querySelector('.cl-workflows');
  if (!showcase) return;
  const tablist = showcase.querySelector('.cl-workflow-tabs');
  const tabs = [...tablist.querySelectorAll('a')];
  const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
  // Without JavaScript these are ordinary anchor links to three visible sections.
  function select(index) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  }
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].tabIndex = 0;
    tab.addEventListener('click', event => {
      event.preventDefault();
      select(i);
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else if (event.key === ' ') next = i;
      else return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
  const initial = panels.findIndex(panel => `#${panel.id}` === location.hash);
  select(initial < 0 ? 0 : initial);
  showcase.classList.add('cl-workflows-ready');
})();
