// Movie Listings App
// Loads movie data from CSV and renders an interactive table

const MOVIES_PER_PAGE = 50;
let allMovies = [];
let filteredMovies = [];
let currentSort = { column: null, ascending: true };

// DOM Elements
const moviesBody = document.getElementById('movies-body');
const searchInput = document.getElementById('search');
const genreFilter = document.getElementById('genre-filter');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');

// Initialize the app
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        await loadMovies();
        setupEventListeners();
        renderMovies(allMovies.slice(0, MOVIES_PER_PAGE));
        populateGenreFilter();
        loadingEl.style.display = 'none';
    } catch (error) {
        showError('Failed to load movies: ' + error.message);
    }
}

// Load and parse CSV
async function loadMovies() {
    const response = await fetch('data/movies.csv');
    if (!response.ok) {
        throw new Error('Could not load movie data');
    }
    const csvText = await response.text();
    allMovies = parseCSV(csvText);
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

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Genre filter
    genreFilter.addEventListener('change', handleFilter);
    
    // Table header sorting
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => handleSort(th.dataset.sort));
    });
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    applyFilters(searchTerm, genreFilter.value);
}

// Handle genre filter
function handleFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    applyFilters(searchTerm, genreFilter.value);
}

// Apply all filters
function applyFilters(searchTerm, genre) {
    filteredMovies = allMovies.filter(movie => {
        const matchesSearch = !searchTerm || 
            movie.Title.toLowerCase().includes(searchTerm) ||
            movie.Overview.toLowerCase().includes(searchTerm);
        
        const matchesGenre = !genre || 
            movie.Genre.toLowerCase().includes(genre.toLowerCase());
        
        return matchesSearch && matchesGenre;
    });
    
    // Re-apply current sort
    if (currentSort.column) {
        sortMovies(currentSort.column, currentSort.ascending);
    }
    
    renderMovies(filteredMovies.slice(0, MOVIES_PER_PAGE));
}

// Handle sorting
function handleSort(column) {
    if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.column = column;
        currentSort.ascending = true;
    }
    
    sortMovies(column, currentSort.ascending);
    renderMovies(filteredMovies.slice(0, MOVIES_PER_PAGE));
}

// Sort movies
function sortMovies(column, ascending) {
    filteredMovies.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];
        
        // Handle numeric columns
        if (column === 'Vote_Average') {
            valueA = parseFloat(valueA) || 0;
            valueB = parseFloat(valueB) || 0;
        }
        
        // Handle date columns
        if (column === 'Release_Date') {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }
        
        if (valueA < valueB) return ascending ? -1 : 1;
        if (valueA > valueB) return ascending ? 1 : -1;
        return 0;
    });
}

// Populate genre filter dropdown
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

// Render movies to table
function renderMovies(movies) {
    if (movies.length === 0) {
        moviesBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    No movies found
                </td>
            </tr>
        `;
        return;
    }
    
    moviesBody.innerHTML = movies.map(movie => `
        <tr>
            <td>
                ${movie.Poster_Url 
                    ? `<img src="${movie.Poster_Url}" alt="${escapeHtml(movie.Title)} poster" class="poster" loading="lazy" onerror="this.outerHTML='<div class=\\'poster-placeholder\\'>No Image</div>'">`
                    : '<div class="poster-placeholder">No Image</div>'
                }
            </td>
            <td>
                <div class="movie-title">${escapeHtml(movie.Title)}</div>
                <div class="movie-overview">${escapeHtml(movie.Overview || '')}</div>
            </td>
            <td>
                ${movie.Genre 
                    ? movie.Genre.split(',').map(g => `<span class="genre-tag">${escapeHtml(g.trim())}</span>`).join('')
                    : '-'
                }
            </td>
            <td>
                <span class="rating ${getRatingClass(movie.Vote_Average)}">
                    ★ ${movie.Vote_Average || '-'}
                </span>
            </td>
            <td>${formatDate(movie.Release_Date)}</td>
        </tr>
    `).join('');
}

// Get rating class based on score
function getRatingClass(rating) {
    const score = parseFloat(rating);
    if (score >= 7) return 'rating-high';
    if (score >= 5) return 'rating-medium';
    return 'rating-low';
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
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

// Show error message
function showError(message) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.textContent = message;
}
