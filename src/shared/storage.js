const HOSTNAME_KEY = 'audiohub-hostname';
const PORT_KEY = 'audiohub-port';
const THEME_KEY = 'audiohub-theme';
const TOKEN_KEY = 'audiohub-token';
const USER_KEY = 'audiohub-user';
const EMAIL_KEY = 'audiohub-last-email';

export function getSavedConnection() {
  return {
    hostname: localStorage.getItem(HOSTNAME_KEY) ?? '',
    port: localStorage.getItem(PORT_KEY) ?? '8080',
  };
}

export function saveConnection(hostname, port) {
  localStorage.setItem(HOSTNAME_KEY, hostname);
  localStorage.setItem(PORT_KEY, port);
}

export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY);
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function saveAuthSession(user, token) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(sanitizeUser(user)));
}

export function getSavedUser() {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser);
    if (!user || typeof user !== 'object') {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function saveEmail(email) {
  localStorage.setItem(EMAIL_KEY, email);
}

export function getSavedEmail() {
  return localStorage.getItem(EMAIL_KEY) ?? '';
}

function sanitizeUser(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }

  return {
    id: user.id ?? null,
    name: user.name ?? '',
    email: user.email ?? '',
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
  };
}
