import './style.css';
import { downloadSong, listSongs, searchYoutube } from './shared/api.js';
import { getSavedConnection, getSavedUser } from './shared/storage.js';
import { appUrl } from './shared/routes.js';
import { setupThemeToggle } from './shared/theme.js';

const user = getSavedUser();
const connection = getSavedConnection();

if (!user) {
  window.location.href = appUrl('src/pages/login.html');
}

if (!connection.hostname || !connection.port) {
  window.location.href = appUrl('index.html');
}

const searchForm = document.querySelector('[data-form="search"]');
const searchInput = document.querySelector('#search-query');
const statusElement = document.querySelector('#search-status');
const searchResultsElement = document.querySelector('[data-role="search-results"]');
const libraryElement = document.querySelector('[data-role="library"]');
let activeDownloadVideoId = '';
let searchTimeoutId = 0;
let latestSearchRequestId = 0;
const maxSongDurationSeconds = 3600; // in seconds

setupThemeToggle(document.querySelector('[data-action="toggle-theme"]'));

if (!searchForm || !searchInput || !statusElement || !searchResultsElement || !libraryElement) {
  throw new Error('Home page is missing required search elements');
}

void loadLibrarySongs();

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  window.clearTimeout(searchTimeoutId);
  await runSearch(searchInput.value.trim(), false);
});

searchInput.addEventListener('input', () => {
  window.clearTimeout(searchTimeoutId);

  const query = searchInput.value.trim();
  if (!query) {
    clearSearchResults();
    setStatus('Enter a song title or artist.');
    return;
  }

  searchTimeoutId = window.setTimeout(() => {
    void runSearch(query, true);
  }, 350);
});

async function runSearch(query, isPreview) {
  const requestId = ++latestSearchRequestId;

  if (!query) {
    clearSearchResults();
    setStatus('Enter a song title or artist.');
    return;
  }

  setPending(true);
  clearSearchResults();
  setStatus('Searching...');

  try {
    const result = await searchYoutube(connection.hostname, connection.port, query);

    if (requestId !== latestSearchRequestId) {
      return;
    }

    const searchResults = Array.isArray(result.results) ? result.results : [];
    const visibleResults = isPreview ? searchResults.slice(0, 3) : searchResults;

    if (visibleResults.length === 0) {
      clearSearchResults();
      setStatus('No songs found.');
      return;
    }

    renderSearchResults(visibleResults);

    if (isPreview && searchResults.length > visibleResults.length) {
      setStatus('');
      return;
    }

    setStatus(`Found ${visibleResults.length} result${visibleResults.length === 1 ? '' : 's'}.`);
  } catch (error) {
    if (requestId !== latestSearchRequestId) {
      return;
    }

    setStatus(getErrorMessage(error, 'Search failed.'));
  } finally {
    if (requestId === latestSearchRequestId) {
      setPending(false);
    }
  }
}

async function loadLibrarySongs() {
  try {
    const payload = await listSongs(connection.hostname, connection.port);
    const songs = Array.isArray(payload.songs) ? payload.songs : [];

    renderLibrarySongs(songs);
  } catch (error) {
    renderLibraryError(getErrorMessage(error, 'Could not load songs.'));
  }
}

function renderSearchResults(results) {
  const fragment = document.createDocumentFragment();

  for (const result of results) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'grid w-full gap-1 bg-surface px-4 py-4 text-left transition duration-150 hover:bg-surface-container-highest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

    const title = document.createElement('h2');
    title.className = 'm-0 text-base leading-[1.3] font-semibold text-on-surface';
    title.textContent = result.title || 'Untitled';

    item.append(title);
    item.addEventListener('click', () => {
      void handleDownload(result);
    });
    fragment.append(item);
  }

  searchResultsElement.replaceChildren(fragment);
  searchResultsElement.hidden = results.length === 0;
}

function renderLibrarySongs(songs) {
  if (songs.length === 0) {
    libraryElement.replaceChildren(createEmptyState('No downloaded songs yet.'));
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const song of songs) {
    const item = document.createElement('article');
    item.className = 'grid gap-1 bg-surface px-4 py-4';

    const title = document.createElement('h2');
    title.className = 'm-0 text-base leading-[1.3] font-semibold text-on-surface';
    title.textContent = song.title || 'Untitled';

    const meta = document.createElement('p');
    meta.className = 'm-0 text-sm leading-[1.45] text-on-surface-muted';
    const duration = formatDuration(song.durationSeconds);
    const downloadedAt = formatDownloadedAt(song.downloadedAt);
    meta.textContent = [duration, downloadedAt].filter(Boolean).join(' · ');

    item.append(title, meta);
    fragment.append(item);
  }

  libraryElement.replaceChildren(fragment);
}

function renderLibraryError(message) {
  libraryElement.replaceChildren(createEmptyState(message));
}

function clearSearchResults() {
  searchResultsElement.replaceChildren();
  searchResultsElement.hidden = true;
}

function setPending(isPending) {
  searchInput.disabled = isPending;
  searchInput.setAttribute('aria-busy', String(isPending));
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

async function handleDownload(result) {

  if (result.duration.seconds > maxSongDurationSeconds) {
    setStatus("Song cant be longer than 1 hour");
    return;
  }

  const videoId = result.videoId || '';
  if (!videoId) {
    setStatus('This search result is missing a video ID.');
    return;
  }

  if (activeDownloadVideoId === videoId) {
    return;
  }


  activeDownloadVideoId = videoId;
  setStatus(`Downloading ${result.title || 'song'}...`);

  try {
    const response = await downloadSong(connection.hostname, connection.port, videoId);

    setStatus(response.message || 'Song downloaded successfully.');
    void loadLibrarySongs();
  } catch (error) {
    setStatus(getErrorMessage(error, 'Song download failed.'));
  } finally {
    activeDownloadVideoId = '';
  }
}

function createEmptyState(message) {
  const state = document.createElement('p');
  state.className = 'm-0 bg-surface px-4 py-4 text-sm leading-[1.45] text-on-surface-muted';
  state.textContent = message;
  return state;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '';
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatDownloadedAt(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
