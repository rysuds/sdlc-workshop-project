// ============================================
// NOTFLIX - Netflix Clone App
// ============================================

const MOVIES_PER_ROW = 20;
const TOP_MOVIES_COUNT = 10;

let allMovies = [];
let filteredMovies = [];
let genreMap = {};
let currentSort = { column: null, ascending: true };

// DOM Elements
const navbar = document.getElementById('navbar');
const hero = document.getElementById('hero');
const heroBackdrop = document.getElementById('hero-backdrop');
const heroContent = document.getElementById('hero-content');
const mainContent = document.getElementById('main-content');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const searchBtn = document.getElementById('search-btn');
const searchBox = document.getElementById('search-box');
const searchInput = document.getElementById('search');
const searchClose = document.getElementById('search-close');
const searchOverlay = document.getElementById('search-results-overlay');
const searchGrid = document.getElementById('search-results-grid');
const genreFilter = document.getElementById('genre-filter');
const modalOverlay = document.getElementById('modal-overlay');
const modal = document.getElementById('modal');
const modalHero = document.getElementById('modal-hero');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        await loadMovies();
        setupEventListeners();
        renderHero();
        buildGenreRows();
        populateGenreFilter();

        loadingEl.classList.add('hidden');
        hero.classList.add('loaded');
        mainContent.classList.add('loaded');
    } catch (error) {
        showError('Failed to load movies: ' + error.message);
    }
}

// ============================================
// DATA LOADING
// ============================================
async function loadMovies() {
    const response = await fetch('data/movies.csv');
    if (!response.ok) {
        throw new Error('Could not load movie data');
    }
    const csvText = await response.text();
    allMovies = parseCSV(csvText);
    // Filter out movies without posters for better visuals
    allMovies = allMovies.filter(m => m.Poster_Url && m.Title);
    // Sort by popularity descending as default
    allMovies.sort((a, b) => (parseFloat(b.Popularity) || 0) - (parseFloat(a.Popularity) || 0));
    filteredMovies = [...allMovies];
}

// Parse CSV to array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = parseCSVLine(lines[0]);
    
    const movies = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const movie = {};
            headers.forEach((header, index) => {
                movie[header] = values[index];
            });
            movies.push(movie);
        }
    }
    return movies;
}

// Parse a single CSV line (handles quoted fields with commas)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// ============================================
// HERO BILLBOARD
// ============================================
function renderHero() {
    // Pick a top-rated popular movie for the hero
    const topMovies = allMovies
        .filter(m => parseFloat(m.Vote_Average) >= 7 && parseInt(m.Vote_Count) > 100)
        .slice(0, 20);
    
    const featured = topMovies[Math.floor(Math.random() * topMovies.length)] || allMovies[0];
    if (!featured) return;

    // Use poster as backdrop (we don't have backdrop URLs, so we'll style it nicely)
    heroBackdrop.style.backgroundImage = `url(${featured.Poster_Url})`;

    const rating = parseFloat(featured.Vote_Average) || 0;
    const matchPercent = Math.round(rating * 10);
    const year = featured.Release_Date ? new Date(featured.Release_Date).getFullYear() : '';
    const genres = featured.Genre ? featured.Genre.split(',').map(g => g.trim()) : [];

    heroContent.innerHTML = `
        <div class="hero-tag">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 22V2l18 10L3 22z"/></svg>
            N O T F L I X
        </div>
        <h1 class="hero-title">${escapeHtml(featured.Title)}</h1>
        <div class="hero-meta">
            <span class="hero-rating">${matchPercent}% Match</span>
            <span class="hero-year">${year}</span>
            <div class="hero-genres">
                ${genres.slice(0, 3).map(g => `<span class="hero-genre-tag">${escapeHtml(g)}</span>`).join('')}
            </div>
        </div>
        <p class="hero-overview">${escapeHtml(featured.Overview || '')}</p>
        <div class="hero-buttons">
            <button class="btn btn-play" onclick="openModal(${allMovies.indexOf(featured)})">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8V4z"/></svg>
                Play
            </button>
            <button class="btn btn-info" onclick="openModal(${allMovies.indexOf(featured)})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                More Info
            </button>
        </div>
    `;
}

// ============================================
// GENRE ROWS
// ============================================
function buildGenreRows() {
    // Build genre map
    genreMap = {};
    allMovies.forEach(movie => {
        if (movie.Genre) {
            movie.Genre.split(',').forEach(g => {
                const genre = g.trim();
                if (!genreMap[genre]) genreMap[genre] = [];
                genreMap[genre].push(movie);
            });
        }
    });

    // Create curated rows
    const rows = [];

    // Trending Now (top by popularity)
    rows.push({ title: 'Trending Now', movies: allMovies.slice(0, MOVIES_PER_ROW) });

    // Top Rated
    const topRated = [...allMovies]
        .filter(m => parseInt(m.Vote_Count) > 50)
        .sort((a, b) => parseFloat(b.Vote_Average) - parseFloat(a.Vote_Average))
        .slice(0, MOVIES_PER_ROW);
    rows.push({ title: 'Top Rated', movies: topRated });

    // Recently Released
    const recent = [...allMovies]
        .sort((a, b) => new Date(b.Release_Date) - new Date(a.Release_Date))
        .slice(0, MOVIES_PER_ROW);
    rows.push({ title: 'New Releases', movies: recent });

    // Genre rows (only genres with enough movies)
    const sortedGenres = Object.entries(genreMap)
        .filter(([_, movies]) => movies.length >= 10)
        .sort((a, b) => b[1].length - a[1].length);

    sortedGenres.slice(0, 8).forEach(([genre, movies]) => {
        rows.push({ title: genre, movies: movies.slice(0, MOVIES_PER_ROW) });
    });

    // Hidden Gems
    const hiddenGems = [...allMovies]
        .filter(m => parseFloat(m.Vote_Average) >= 7 && parseInt(m.Vote_Count) < 100)
        .slice(0, MOVIES_PER_ROW);
    if (hiddenGems.length > 5) {
        rows.push({ title: 'Hidden Gems', movies: hiddenGems });
    }

    // Render all rows
    mainContent.innerHTML = rows.map((row, i) => renderRow(row.title, row.movies, i)).join('');
    
    // Setup slider arrows
    setupSliderArrows();
}

function renderRow(title, movies, index) {
    const cardsHTML = movies.map((movie, i) => renderCard(movie, allMovies.indexOf(movie))).join('');

    return `
        <div class="movie-row" style="animation-delay: ${index * 0.08}s">
            <div class="row-header">
                <h2 class="row-title">${escapeHtml(title)}</h2>
                <span class="row-explore">Explore All <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg></span>
            </div>
            <div class="row-slider-wrapper">
                <button class="slider-arrow slider-arrow-left" aria-label="Scroll left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div class="row-slider">
                    ${cardsHTML}
                </div>
                <button class="slider-arrow slider-arrow-right" aria-label="Scroll right">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
            </div>
        </div>
    `;
}

function renderCard(movie, globalIndex) {
    const rating = parseFloat(movie.Vote_Average) || 0;
    const matchPercent = Math.round(rating * 10);
    const year = movie.Release_Date ? new Date(movie.Release_Date).getFullYear() : '';
    const genres = movie.Genre ? movie.Genre.split(',').map(g => g.trim()).slice(0, 3) : [];

    return `
        <div class="movie-card" onclick="openModal(${globalIndex})">
            <div class="card-poster">
                ${movie.Poster_Url
                    ? `<img src="${movie.Poster_Url}" alt="${escapeHtml(movie.Title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'card-poster-placeholder\\'>No Image</div>'">`
                    : '<div class="card-poster-placeholder">No Image</div>'
                }
            </div>
            <div class="card-info">
                <div class="card-buttons">
                    <button class="card-btn play-btn" aria-label="Play" onclick="event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8V4z"/></svg>
                    </button>
                    <button class="card-btn" aria-label="Add to list" onclick="event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <button class="card-btn" aria-label="Like" onclick="event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zm-9 11H3V10h2v10z"/></svg>
                    </button>
                    <span class="card-btn-spacer"></span>
                    <button class="card-btn" aria-label="More info" onclick="openModal(${globalIndex}); event.stopPropagation()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                </div>
                <div class="card-meta">
                    <span class="card-match">${matchPercent}% Match</span>
                    <span class="card-year">${year}</span>
                    <span class="card-rating-badge">★ ${movie.Vote_Average || '-'}</span>
                </div>
                <div class="card-genres">
                    ${genres.map(g => `<span class="card-genre-tag">${escapeHtml(g)}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// SLIDER ARROWS
// ============================================
function setupSliderArrows() {
    document.querySelectorAll('.row-slider-wrapper').forEach(wrapper => {
        const slider = wrapper.querySelector('.row-slider');
        const leftArrow = wrapper.querySelector('.slider-arrow-left');
        const rightArrow = wrapper.querySelector('.slider-arrow-right');

        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                slider.scrollBy({ left: -(slider.clientWidth * 0.8), behavior: 'smooth' });
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                slider.scrollBy({ left: slider.clientWidth * 0.8, behavior: 'smooth' });
            });
        }
    });
}

// ============================================
// MODAL
// ============================================
function openModal(movieIndex) {
    const movie = allMovies[movieIndex];
    if (!movie) return;

    const rating = parseFloat(movie.Vote_Average) || 0;
    const matchPercent = Math.round(rating * 10);
    const year = movie.Release_Date ? new Date(movie.Release_Date).getFullYear() : '';
    const genres = movie.Genre ? movie.Genre.split(',').map(g => g.trim()) : [];
    const popularity = Math.round(parseFloat(movie.Popularity) || 0);

    // Modal hero
    modalHero.innerHTML = `
        <img class="modal-hero-img" src="${movie.Poster_Url}" alt="${escapeHtml(movie.Title)}" onerror="this.style.display='none'">
        <div class="modal-hero-gradient"></div>
        <h2 class="modal-hero-title">${escapeHtml(movie.Title)}</h2>
    `;

    // Modal body
    modalBody.innerHTML = `
        <div class="modal-meta-row">
            <div class="modal-meta-left">
                <div style="margin-bottom: 0.75rem;">
                    <span class="modal-match">${matchPercent}% Match</span>
                    <span class="modal-year">${year}</span>
                    <span class="modal-rating-badge">★ ${movie.Vote_Average || 'N/A'}</span>
                </div>
                <p class="modal-overview">${escapeHtml(movie.Overview || 'No overview available.')}</p>
            </div>
            <div class="modal-meta-right">
                <p class="modal-info-label">Genres:</p>
                <p class="modal-info-value">${genres.map(g => `<span class="modal-genre-tag">${escapeHtml(g)}</span>`).join(', ')}</p>
                
                <p class="modal-info-label">Language:</p>
                <p class="modal-info-value">${getLanguageName(movie.Original_Language)}</p>
                
                <p class="modal-info-label">Popularity:</p>
                <p class="modal-info-value">${popularity.toLocaleString()}</p>
                
                <p class="modal-info-label">Votes:</p>
                <p class="modal-info-value">${parseInt(movie.Vote_Count || 0).toLocaleString()}</p>

                <p class="modal-info-label">Release Date:</p>
                <p class="modal-info-value">${formatDate(movie.Release_Date)}</p>
            </div>
        </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// SEARCH
// ============================================
function toggleSearch() {
    const isActive = searchBox.classList.contains('active');
    
    if (isActive) {
        closeSearch();
    } else {
        searchBox.classList.add('active');
        searchBtn.style.display = 'none';
        searchInput.focus();
    }
}

function closeSearch() {
    searchBox.classList.remove('active');
    searchBtn.style.display = 'flex';
    searchInput.value = '';
    searchOverlay.classList.remove('active');
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreFilter.value;

    if (!searchTerm && !selectedGenre) {
        searchOverlay.classList.remove('active');
        hero.classList.add('loaded');
        mainContent.classList.add('loaded');
        return;
    }

    let results = allMovies.filter(movie => {
        const matchesSearch = !searchTerm ||
            movie.Title.toLowerCase().includes(searchTerm) ||
            (movie.Overview && movie.Overview.toLowerCase().includes(searchTerm));

        const matchesGenre = !selectedGenre ||
            (movie.Genre && movie.Genre.toLowerCase().includes(selectedGenre.toLowerCase()));

        return matchesSearch && matchesGenre;
    });

    // Show search overlay, hide hero and rows
    searchOverlay.classList.add('active');

    if (results.length === 0) {
        searchGrid.innerHTML = `
            <div class="search-empty">
                <p>No results found for "${escapeHtml(searchTerm || selectedGenre)}"</p>
            </div>
        `;
        return;
    }

    searchGrid.innerHTML = results.slice(0, 60).map((movie, i) => {
        const globalIndex = allMovies.indexOf(movie);
        return `
            <div class="search-card" onclick="openModal(${globalIndex})">
                ${movie.Poster_Url
                    ? `<img src="${movie.Poster_Url}" alt="${escapeHtml(movie.Title)}" loading="lazy" onerror="this.style.display='none'">`
                    : ''
                }
                <div class="search-card-title">${escapeHtml(movie.Title)}</div>
            </div>
        `;
    }).join('');
}

function handleGenreFilter() {
    handleSearch();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', toggleSearch);
    searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Genre filter
    genreFilter.addEventListener('change', handleGenreFilter);

    // Modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) {
                closeModal();
            } else if (searchBox.classList.contains('active')) {
                closeSearch();
            }
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ============================================
// GENRE FILTER DROPDOWN
// ============================================
function populateGenreFilter() {
    const genres = new Set();
    allMovies.forEach(movie => {
        if (movie.Genre) {
            movie.Genre.split(',').forEach(genre => {
                genres.add(genre.trim());
            });
        }
    });

    const sortedGenres = Array.from(genres).sort();
    sortedGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

// ============================================
// UTILITIES
// ============================================

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get language name from code
function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'hi': 'Hindi',
        'ar': 'Arabic',
        'sv': 'Swedish',
        'da': 'Danish',
        'no': 'Norwegian',
        'fi': 'Finnish',
        'nl': 'Dutch',
        'pl': 'Polish',
        'tr': 'Turkish',
        'th': 'Thai',
        'id': 'Indonesian',
        'cn': 'Chinese',
        'te': 'Telugu',
        'ta': 'Tamil',
        'ml': 'Malayalam',
    };
    return languages[code] || (code ? code.toUpperCase() : 'Unknown');
}

// Show error message
function showError(message) {
    loadingEl.classList.add('hidden');
    errorEl.style.display = 'block';
    errorEl.textContent = message;
}
