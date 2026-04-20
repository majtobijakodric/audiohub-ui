import './style.css';
import { login } from './shared/api.js';
import {
  getSavedConnection,
  getSavedEmail,
  saveAuthSession,
  saveEmail,
} from './shared/storage.js';
import { appUrl } from './shared/routes.js';
import { setupThemeToggle } from './shared/theme.js';

const connection = getSavedConnection();
if (!connection.hostname || !connection.port) {
  window.location.href = appUrl('index.html');
}

const loginForm = document.querySelector('[data-form="login"]');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const statusElement = document.querySelector('#login-status');
const submitButton = loginForm?.querySelector('button[type="submit"]');

setupThemeToggle(document.querySelector('[data-action="toggle-theme"]'));

if (!loginForm || !emailInput || !passwordInput || !statusElement || !submitButton) {
  throw new Error('Login page is missing required elements');
}

emailInput.value = getSavedEmail();

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {
    setStatus('Email is required.');
    return;
  }

  if (!password) {
    setStatus('Password is required.');
    return;
  }

  saveEmail(email);
  setPending(true);
  setStatus('Logging in...');

  try {
    const result = await login(connection.hostname, connection.port, { email, password });
    saveAuthSession(result.user, result.token);
    passwordInput.value = '';
    window.location.href = appUrl('src/pages/home.html');
  } catch (error) {
    setStatus(getErrorMessage(error, 'Login failed.'));
  } finally {
    setPending(false);
  }
});

function setPending(isPending) {
  submitButton.disabled = isPending;
  submitButton.textContent = isPending ? 'Logging in...' : 'Login';
}

function setStatus(message) {
  statusElement.textContent = message;
}

function getErrorMessage(error, fallback) {
  if (error instanceof TypeError) {
    return 'Could not reach the AudioHub server. Check the saved hostname and port.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
