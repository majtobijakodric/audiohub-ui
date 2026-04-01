import { createElement, Moon, Sun } from 'lucide';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

const root = app;

type Screen = 'connect' | 'login';
type Theme = 'light' | 'dark';

type AppState = {
  screen: Screen;
  hostname: string;
  port: string;
  theme: Theme;
};

const themeStorageKey = 'audiohub-ui-theme';

const state: AppState = {
  screen: 'connect',
  hostname: '',
  port: '8080',
  theme: getInitialTheme(),
};

applyTheme(state.theme);

function getServerAddress() {
  const hostname = state.hostname.trim() || '127.0.0.1';
  const port = state.port.trim() || '8080';
  return `${hostname}:${port}`;
}

function renderThemeToggle() {
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  const label = nextTheme === 'dark' ? 'Switch to dark mode' : 'Switch to light mode';

  return `
    <button
      class="absolute top-6 right-6 grid h-11 w-11 place-items-center border border-black/10 bg-surface-container-low text-on-surface transition duration-150 hover:bg-surface-container-highest focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed sm:top-8 sm:right-8"
      type="button"
      data-action="toggle-theme"
      aria-label="${label}"
      title="${label}"
    >
      <span data-theme-icon aria-hidden="true"></span>
    </button>
  `;
}

function renderConnectScreen() {
  return `
    <main
      class="relative grid min-h-svh place-items-center px-6 py-12 sm:px-8"
      aria-labelledby="server-connect-title"
    >
      ${renderThemeToggle()}
      <section
        class="grid w-full max-w-[28rem] gap-8 bg-surface-container-low p-6 outline outline-1 -outline-offset-1 outline-ghost sm:gap-12 sm:p-12"
      >
        <header class="grid gap-3">
          <p class="m-0 text-[0.75rem] leading-none font-medium uppercase tracking-[0.08em] text-on-surface-muted">
            Connect to
          </p>
          <h1
            id="server-connect-title"
            class="m-0 text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.02em] text-balance"
          >
            AudioHub
          </h1>
        </header>

        <form class="grid gap-6" data-form="connect" novalidate>
          <div class="grid gap-[0.4rem]">
            <label
              class="text-[0.75rem] leading-none font-medium uppercase tracking-[0.05em] text-on-surface-muted"
              for="hostname"
            >
              Hostname or IP
            </label>
            <input
              class="w-full border-0 border-b-2 border-surface-container-highest bg-transparent px-0 pb-3 text-base text-on-surface outline-none transition-colors duration-150 placeholder:text-on-surface-muted/70 focus:border-primary"
              id="hostname"
              name="hostname"
              type="text"
              inputmode="url"
              autocomplete="off"
              spellcheck="false"
              placeholder="192.168.1.20"
              value="${escapeAttribute(state.hostname)}"
            />
          </div>

          <div class="grid gap-[0.4rem]">
            <label
              class="text-[0.75rem] leading-none font-medium uppercase tracking-[0.05em] text-on-surface-muted"
              for="port"
            >
              Port
            </label>
            <input
              class="w-full border-0 border-b-2 border-surface-container-highest bg-transparent px-0 pb-3 text-base text-on-surface outline-none transition-colors duration-150 placeholder:text-on-surface-muted/70 focus:border-primary"
              id="port"
              name="port"
              type="text"
              inputmode="numeric"
              value="${escapeAttribute(state.port)}"
              aria-describedby="connection-status"
            />
          </div>

          <button
            class="min-h-12 w-full cursor-pointer border-0 bg-linear-to-b from-primary to-primary-container px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-surface-container-highest transition duration-150 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed"
            type="submit"
          >
            Connect
          </button>
          <p class="m-0 text-sm leading-[1.45] text-on-surface-muted" id="connection-status">
            Not connected
          </p>
        </form>
      </section>
    </main>
  `;
}

function renderLoginScreen() {
  return `
    <main
      class="relative grid min-h-svh place-items-center px-6 py-12 sm:px-8"
      aria-labelledby="login-title"
    >
      ${renderThemeToggle()}
      <section
        class="grid w-full max-w-[32rem] gap-8 bg-surface-container-low p-6 outline outline-1 -outline-offset-1 outline-ghost sm:gap-12 sm:p-12"
      >
        <header>
          <div class="flex items-baseline gap-4 sm:gap-2">
            <h1
              id="login-title"
              class="m-0 text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.02em] text-balance"
            >
              AudioHub
            </h1>
            <p class="m-0 text-[0.75rem] leading-none font-medium tracking-[0.05em] text-on-surface-muted">
              ${escapeHtml(getServerAddress())}
            </p>
          </div>
        </header>

        <form class="grid gap-6" data-form="login" novalidate>
          <div class="grid gap-[0.4rem]">
            <label
              class="text-[0.75rem] leading-none font-medium uppercase tracking-[0.05em] text-on-surface-muted"
              for="email"
            >
              Email
            </label>
            <input
              class="w-full border-0 border-b-2 border-surface-container-highest bg-transparent px-0 pb-3 text-base text-on-surface outline-none transition-colors duration-150 placeholder:text-on-surface-muted/70 focus:border-primary"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
            />
          </div>

          <div class="grid gap-[0.4rem]">
            <label
              class="text-[0.75rem] leading-none font-medium uppercase tracking-[0.05em] text-on-surface-muted"
              for="password"
            >
              Password
            </label>
            <input
              class="w-full border-0 border-b-2 border-surface-container-highest bg-transparent px-0 pb-3 text-base text-on-surface outline-none transition-colors duration-150 placeholder:text-on-surface-muted/70 focus:border-primary"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              aria-describedby="login-status"
            />
          </div>

          <button
            class="min-h-12 w-full cursor-pointer border-0 bg-linear-to-b from-primary to-primary-container px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-surface-container-highest transition duration-150 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed"
            type="submit"
          >
            Login
          </button>
          <p class="m-0 text-sm leading-[1.45] text-on-surface-muted" id="login-status">
            Incorrect email or password
          </p>
        </form>
      </section>
    </main>
  `;
}

function render() {
  root.innerHTML =
    state.screen === 'connect' ? renderConnectScreen() : renderLoginScreen();

  const connectForm = root.querySelector<HTMLFormElement>('[data-form="connect"]');
  const loginForm = root.querySelector<HTMLFormElement>('[data-form="login"]');
  const themeButton = root.querySelector<HTMLButtonElement>('[data-action="toggle-theme"]');
  const themeIcon = root.querySelector<HTMLElement>('[data-theme-icon]');

  renderThemeIcon(themeIcon);

  connectForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(connectForm);
    state.hostname = String(formData.get('hostname') ?? '');
    state.port = String(formData.get('port') ?? '8080');
    state.screen = 'login';
    render();
  });

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  themeButton?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    persistTheme(state.theme);
    applyTheme(state.theme);
    render();
  });
}

function escapeAttribute(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(themeStorageKey);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function persistTheme(theme: Theme) {
  localStorage.setItem(themeStorageKey, theme);
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function renderThemeIcon(container: HTMLElement | null) {
  if (!container) {
    return;
  }

  container.replaceChildren(
    createElement(state.theme === 'dark' ? Sun : Moon, {
      width: 18,
      height: 18,
      strokeWidth: 2,
    }),
  );
}

render();
