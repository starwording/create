const storageKey = 'theme-preference';
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const icon = toggle?.querySelector('.theme-toggle__icon');
const text = toggle?.querySelector('.theme-toggle__text');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(isDark));
  }
  if (icon) {
    icon.textContent = isDark ? '🌙' : '☀';
  }
  if (text) {
    text.textContent = isDark ? 'Dark' : 'Light';
  }
};

const getPreferredTheme = () => {
  const stored = localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
  localStorage.setItem(storageKey, theme);
  applyTheme(theme);
};

applyTheme(getPreferredTheme());

if (toggle) {
  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (localStorage.getItem(storageKey)) {
    return;
  }
  applyTheme(event.matches ? 'dark' : 'light');
});
