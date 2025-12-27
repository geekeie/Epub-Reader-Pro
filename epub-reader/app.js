/**
 * app.js - EPUB Reader Pro
 * Main application logic for rendering and navigating EPUB files
 * Uses EPUB.js library for rendering
 */

// Global variables
let book = null;
let rendition = null;

// DOM elements
const viewer = document.getElementById('viewer');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
const showError = (message) => {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    loadingEl.style.display = 'none';
    console.error(message);
};

/**
 * Hide error message
 */
const hideError = () => {
    errorEl.style.display = 'none';
};

/**
 * Show loading indicator
 */
const showLoading = () => {
    loadingEl.style.display = 'block';
    hideError();
};

/**
 * Hide loading indicator
 */
const hideLoading = () => {
    loadingEl.style.display = 'none';
};

/**
 * Initialize EPUB book with proper error handling
 * @param {string|ArrayBuffer} bookPath - Path to EPUB file or ArrayBuffer
 */
const initBook = async (bookPath) => {
    try {
        showLoading();
        
        // Check if EPUB.js is loaded
        if (typeof ePub === 'undefined') {
            throw new Error('EPUB.js library not loaded. Please check your internet connection.');
        }

        // Initialize the book
        book = ePub(bookPath);
        
        // Clear existing rendition if any
        if (rendition) {
            rendition.destroy();
        }

        // Create rendition with responsive settings
        rendition = book.renderTo(viewer, {
            width: '100%',
            height: '100%',
            spread: 'none', // Disable spread for better mobile experience
            manager: 'continuous', // Continuous scroll mode
            flow: 'scrolled' // Scrolled layout
        });

        // Display the book
        await rendition.display();
        
        hideLoading();
        console.log('EPUB loaded successfully');

        // Register service worker for PWA functionality
        registerServiceWorker();

    } catch (error) {
        showError(`Failed to load EPUB: ${error.message}`);
    }
};

/**
 * Load sample EPUB file or show upload prompt
 * This function is called when no file is provided by the user
 */
const loadSampleBook = () => {
    // Show welcome message prompting user to upload a file
    console.log('No EPUB file provided. Please upload an EPUB file to begin reading.');
    showError('Welcome! Please upload an EPUB file to start reading.');
};

/**
 * Handle file upload
 * @param {Event} event - File input change event
 */
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }

    if (!file.name.endsWith('.epub')) {
        showError('Please select a valid EPUB file.');
        return;
    }

    hideError();

    // Read the file as ArrayBuffer
    const reader = new FileReader();
    
    reader.onload = (e) => {
        initBook(e.target.result);
    };

    reader.onerror = () => {
        showError('Failed to read the file. Please try again.');
    };

    reader.readAsArrayBuffer(file);
};

/**
 * Navigate to previous page
 */
const goToPrevious = () => {
    if (rendition) {
        rendition.prev();
    }
};

/**
 * Navigate to next page
 */
const goToNext = () => {
    if (rendition) {
        rendition.next();
    }
};

/**
 * Register service worker for PWA functionality
 */
const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }
};

// Event listeners
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileUpload);
prevBtn.addEventListener('click', goToPrevious);
nextBtn.addEventListener('click', goToNext);

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        goToPrevious();
    } else if (event.key === 'ArrowRight') {
        goToNext();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Show welcome message to upload file
    loadSampleBook();
});