export async function checkHealth(hostname, port) {
  const response = await fetchWithTimeout(`${buildBaseUrl(hostname, port)}/health`, {}, 5000);
  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload.message || 'Health check request failed.');
  }

  return payload;
}

export async function signup(hostname, port, body) {
  const response = await fetchWithTimeout(
    `${buildBaseUrl(hostname, port)}/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    8000,
  );

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload.message || 'Signup request failed.');
  }

  return payload;
}

export async function login(hostname, port, body) {
  const response = await fetchWithTimeout(
    `${buildBaseUrl(hostname, port)}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    8000,
  );

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload.message || 'Login request failed.');
  }

  if (!payload.token) {
    throw new Error('Login response did not include a token.');
  }

  return payload;
}

export async function searchYoutube(hostname, port, ytTitle) {
  const response = await fetchWithTimeout(
    `${buildBaseUrl(hostname, port)}/youtube/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ytTitle }),
    },
    8000,
  );

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload.message || 'Search request failed.');
  }

  return payload;
}

export async function downloadSong(hostname, port, videoId) {
  const response = await fetchWithTimeout(
    `${buildBaseUrl(hostname, port)}/songs/download`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId }),
    },
    15000,
  );

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload.message || 'Song download failed.');
  }

  return payload;
}

export async function listSongs(hostname, port) {
  const response = await fetchWithTimeout(`${buildBaseUrl(hostname, port)}/songs/listsongs`, {}, 8000);
  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload.message || 'Songs list request failed.');
  }

  return payload;
}

export function buildBaseUrl(hostname, port) {
  return `http://${hostname}:${port}/api`;
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${Math.ceil(timeoutMs / 1000)} seconds.`);
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function readJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Server returned an invalid JSON response.');
  }
}
