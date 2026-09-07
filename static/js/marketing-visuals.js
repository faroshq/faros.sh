/* Progressive enhancement: every example is readable before JavaScript loads. */
document.querySelectorAll('[data-visual-tabs]').forEach(root => {
  const buttons = [...root.querySelectorAll('[data-visual-choice]')];
  const panels = [...root.querySelectorAll('[data-visual-panel]')];
  if (!buttons.length || buttons.length !== panels.length) return;
  const controls = buttons[0].parentElement;
  controls.setAttribute('role', 'tablist');
  if (root.classList.contains('mv-platform')) controls.setAttribute('aria-orientation', 'vertical');
  let timer;
  function select(button, animate = false) {
    const key = button.dataset.visualChoice;
    root.dataset.active = key;
    buttons.forEach(item => {
      const selected = item === button;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.visualPanel !== key; });
    root.classList.remove('mv-activated');
    clearTimeout(timer);
    if (animate) {
      requestAnimationFrame(() => root.classList.add('mv-activated'));
      timer = setTimeout(() => root.classList.remove('mv-activated'), 1300);
    }
  }
  buttons.forEach((button, index) => {
    button.setAttribute('role', 'tab');
    if (!button.id) button.id = `${button.getAttribute('aria-controls')}-tab`;
    const panel = panels.find(item => item.id === button.getAttribute('aria-controls'));
    if (panel) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', button.id);
      panel.tabIndex = 0;
    }
    button.addEventListener('click', () => select(button, true));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault(); buttons[next].focus(); select(buttons[next], true);
    });
  });
  select(buttons[0]); controls.hidden = false;
});
