import './style.css';
import { downloadSong, searchYoutube } from './shared/api.js';
import { getSavedConnection, getSavedUser } from './shared/storage.js';
import { setupThemeToggle } from './shared/theme.js';

const user = getSavedUser();
const connection = getSavedConnection();

if (!user) {
  window.location.href = '/src/pages/login.html';
}

if (!connection.hostname || !connection.port) {
  window.location.href = '/index.html';
}

const searchForm = document.querySelector('[data-form="search"]');
const searchInput = document.querySelector('#search-query');
const statusElement = document.querySelector('#search-status');
const resultsElement = document.querySelector('[data-role="results"]');
const submitButton = searchForm?.querySelector('button[type="submit"]');
let activeDownloadVideoId = '';
let searchTimeoutId = 0;
let latestSearchRequestId = 0;
const maxSongDurationSeconds = 3600; // in seconds

setupThemeToggle(document.querySelector('[data-action="toggle-theme"]'));

if (!searchForm || !searchInput || !statusElement || !resultsElement || !submitButton) {
  throw new Error('Home page is missing required search elements');
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  window.clearTimeout(searchTimeoutId);
  await runSearch(searchInput.value.trim(), false);
});

searchInput.addEventListener('input', () => {
  window.clearTimeout(searchTimeoutId);

  const query = searchInput.value.trim();
  if (!query) {
    clearResults();
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
    clearResults();
    setStatus('Enter a song title or artist.');
    return;
  }

  setPending(true);
  clearResults();
  setStatus('Searching...');

  try {
    const result = await searchYoutube(connection.hostname, connection.port, query);

    if (requestId !== latestSearchRequestId) {
      return;
    }

    const searchResults = Array.isArray(result.results) ? result.results : [];
    const visibleResults = isPreview ? searchResults.slice(0, 3) : searchResults;

    if (visibleResults.length === 0) {
      setStatus('No songs found.');
      return;
    }

    renderResults(visibleResults);

    if (isPreview && searchResults.length > visibleResults.length) {
      setStatus();
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

function renderResults(results) {
  const fragment = document.createDocumentFragment();

  for (const result of results) {
    const item = document.createElement('article');
    item.className = 'grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 bg-surface px-4 py-4 text-left transition duration-150 hover:bg-surface-container-highest';
    item.tabIndex = 0;
    item.role = 'button';
    item.style.cursor = 'pointer';

    const thumbnail = document.createElement('img');
    thumbnail.className = 'h-[4.5rem] w-[4.5rem] rounded-md object-cover bg-surface-container-highest';
    thumbnail.src = result.thumbnail || '';
    thumbnail.alt = '';
    thumbnail.loading = 'lazy';
    thumbnail.decoding = 'async';

    const content = document.createElement('div');
    content.className = 'grid gap-1';

    const title = document.createElement('h2');
    title.className = 'm-0 text-base leading-[1.3] font-semibold text-on-surface';
    title.textContent = result.title || 'Untitled';

    const meta = document.createElement('p');
    meta.className = 'm-0 text-sm leading-[1.45] text-on-surface-muted';
    const author = result.author || 'Unknown artist';
    const duration = result.duration?.timestamp || 'Unknown length';
    meta.textContent = `${author}  ${duration}`;

    content.append(title, meta);
    item.append(thumbnail, content);
    item.addEventListener('click', () => {
      void handleDownload(result);
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        void handleDownload(result);
      }
    });
    fragment.append(item);
  }

  resultsElement.replaceChildren(fragment);
}

function clearResults() {
  resultsElement.replaceChildren();
}

function setPending(isPending) {
  submitButton.disabled = isPending;
  submitButton.textContent = isPending ? 'Searching...' : 'Search';
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
    const response = await downloadSong(connection.hostname, connection.port, {
      videoId,
      title: result.title || 'Untitled',
      author: result.author || 'Unknown artist',
      durationSeconds: result.duration?.seconds || 0,
      durationTimestamp: result.duration?.timestamp || '0:00',
      thumbnail: result.thumbnail || null,
    });

    setStatus(response.message || 'Song downloaded successfully.');
  } catch (error) {
    setStatus(getErrorMessage(error, 'Song download failed.'));
  } finally {
    activeDownloadVideoId = '';
  }
}
