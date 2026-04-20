import './style.css';
import { signup } from './shared/api.js';
import { getSavedConnection, saveEmail } from './shared/storage.js';
import { appUrl } from './shared/routes.js';
import { setupThemeToggle } from './shared/theme.js';

const connection = getSavedConnection();
if (!connection.hostname || !connection.port) {
  window.location.href = appUrl('index.html');
}

const signupForm = document.querySelector('[data-form="signup"]');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#signup-email');
const passwordInput = document.querySelector('#signup-password');
const statusElement = document.querySelector('#signup-status');
const submitButton = signupForm?.querySelector('button[type="submit"]');

setupThemeToggle(document.querySelector('[data-action="toggle-theme"]'));

if (!signupForm || !nameInput || !emailInput || !passwordInput || !statusElement || !submitButton) {
  throw new Error('Signup page is missing required elements');
}

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!name) {
    setStatus('Name is required.');
    return;
  }

  if (!email) {
    setStatus('Email is required.');
    return;
  }

  if (!password) {
    setStatus('Password is required.');
    return;
  }

  setPending(true);
  setStatus('Creating account...');

  try {
    await signup(connection.hostname, connection.port, { name, email, password });
    saveEmail(email);
    setStatus('Account created. Redirecting to login...');
    window.setTimeout(() => {
      window.location.href = appUrl('src/pages/login.html');
    }, 500);
  } catch (error) {
    setStatus(getErrorMessage(error, 'Signup failed.'));
  } finally {
    setPending(false);
  }
});

function setPending(isPending) {
  submitButton.disabled = isPending;
  submitButton.textContent = isPending ? 'Creating account...' : 'Create account';
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
