import './style.css';
import { getSavedUser } from './shared/storage.js';
import { setupThemeToggle } from './shared/theme.js';

const user = getSavedUser();

if (!user) {
  window.location.href = '/src/pages/login.html';
}

const usernameElement = document.querySelector('[data-role="username"]');

setupThemeToggle(document.querySelector('[data-action="toggle-theme"]'));

if (!usernameElement) {
  throw new Error('Home page is missing the username element');
}

usernameElement.textContent = user?.name?.trim() || 'there';
