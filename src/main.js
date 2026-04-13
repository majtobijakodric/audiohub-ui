import './style.css';
import { checkHealth } from './shared/api.js';
import {
  getSavedConnection,
  saveConnection,
} from './shared/storage.js';
import { setupThemeToggle } from './shared/theme.js';

const connectForm = document.querySelector('[data-form="connect"]');
const hostnameInput = document.querySelector('#hostname');
const portInput = document.querySelector('#port');
const statusElement = document.querySelector('#connection-status');
const submitButton = connectForm?.querySelector('button[type="submit"]');

setupThemeToggle(document.querySelector('[data-action="toggle-theme"]'));

const savedConnection = getSavedConnection();
if (hostnameInput) {
  hostnameInput.value = savedConnection.hostname;
}

if (portInput) {
  portInput.value = savedConnection.port;
}

if (!connectForm || !hostnameInput || !portInput || !statusElement || !submitButton) {
  throw new Error('Connect page is missing required elements');
}

connectForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const hostname = hostnameInput.value.trim();
  const port = portInput.value.trim();
  const validationMessage = validateConnection(hostname, port);

  if (validationMessage) {
    setStatus(validationMessage);
    return;
  }

  saveConnection(hostname, port);
  setPending(true);
  setStatus('Checking AudioHub server...');

  try {
    const health = await checkHealth(hostname, port);

    if (!health.ok) {
      setStatus('Server responded, but AudioHub health check failed.');
      return;
    }

    setStatus('Server is reachable. Opening login page...');
    window.location.href = '/src/pages/login.html';
  } catch (error) {
    setStatus(getErrorMessage(error, 'Could not reach AudioHub at that hostname and port.'));
  } finally {
    setPending(false);
  }
});

function validateConnection(hostname, port) {
  if (!hostname) {
    return 'Hostname or IP is required.';
  }

  if (!port) {
    return 'Port is required.';
  }

  if (!/^\d+$/.test(port)) {
    return 'Port must contain only numbers.';
  }

  const portNumber = Number(port);
  if (portNumber < 1 || portNumber > 65535) {
    return 'Port must be between 1 and 65535.';
  }

  return '';
}

function setPending(isPending) {
  submitButton.disabled = isPending;
  submitButton.textContent = isPending ? 'Checking...' : 'Connect';
}

function setStatus(message) {
  statusElement.textContent = message;
}

function getErrorMessage(error, fallback) {
  if (error instanceof TypeError) {
    return fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
