import { createElement, Moon, Sun } from 'lucide';
import { getSavedTheme, saveTheme } from './storage.js';

export function setupThemeToggle(button) {
  const theme = getInitialTheme();
  applyTheme(theme);
  renderThemeIcon(button, theme);

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
    renderThemeIcon(button, nextTheme);
  });
}

function getInitialTheme() {
  const savedTheme = getSavedTheme();

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function renderThemeIcon(button, theme) {
  const iconContainer = button?.querySelector('[data-theme-icon]');
  if (!iconContainer) {
    return;
  }

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const label = nextTheme === 'dark' ? 'Switch to dark mode' : 'Switch to light mode';
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);

  iconContainer.replaceChildren(
    createElement(theme === 'dark' ? Sun : Moon, {
      width: 18,
      height: 18,
      strokeWidth: 2,
    }),
  );
}
