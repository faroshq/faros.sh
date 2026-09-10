/* An in-browser database simulation. No provider or external service is called. */
(() => {
  const root = document.querySelector('.developer-page .workbench');
  const buttons = [...(root?.querySelectorAll('[data-demo-create]') || [])];
  if (!buttons.length) return;
  const find = selector => root.querySelector(selector);
  const resetButton = find('[data-demo-reset]');
  const status = find('[data-demo-status]');
  let timer;
  let state = 'empty';

  function render(next) {
    state = next;
    root.dataset.demoState = next;
    find('[data-demo-empty]').hidden = next !== 'empty';
    find('[data-demo-instance]').hidden = next === 'empty';
    find('[data-demo-connection]').hidden = next !== 'ready';
    find('[data-demo-count]').textContent = next === 'empty' ? '0 databases' : '1 database';
    find('[data-demo-phase]').textContent = next === 'ready' ? 'Ready' : 'Creating…';
    buttons.forEach(button => {
      button.disabled = next === 'creating';
      button.textContent = next === 'creating' ? 'Creating database…'
        : next === 'ready' ? `Replay with ${button.dataset.demoCreate}`
        : button.dataset.demoLabel;
    });
    resetButton.hidden = next === 'empty';
  }

  buttons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (state === 'creating') return;
      clearTimeout(timer);
      render('creating');
      status.textContent = `${button.dataset.demoCreate} requested app-dev. Your provider is creating the database.`;
      timer = setTimeout(() => {
        render('ready');
        status.textContent = 'app-dev is ready. Switch tabs to see another way to create this same database.';
      }, 1100);
    });
  });
  resetButton.addEventListener('click', () => {
    clearTimeout(timer);
    render('empty');
    status.textContent = 'Demo reset. Create app-dev again using any interface.';
    root.querySelector('[data-visual-panel]:not([hidden]) [data-demo-create]')?.focus();
  });
})();
