/**
 * converter.js - EPUB to PDF Converter
 * Converts EPUB files to PDF format using EPUB.js and jsPDF
 * Implements proper error handling and progress tracking
 */

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const convertButton = document.getElementById('convertButton');
const fileNameEl = document.getElementById('fileName');
const progressEl = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const errorEl = document.getElementById('error');
const successEl = document.getElementById('success');

// Global variables
let selectedFile = null;
let epubBook = null;

/**
 * Show error message
 * @param {string} message - Error message to display
 */
const showError = (message) => {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    successEl.style.display = 'none';
    progressEl.style.display = 'none';
    console.error(message);
};

/**
 * Show success message
 * @param {string} message - Success message to display
 */
const showSuccess = (message) => {
    successEl.textContent = message;
    successEl.style.display = 'block';
    errorEl.style.display = 'none';
    progressEl.style.display = 'none';
};

/**
 * Hide all messages
 */
const hideMessages = () => {
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
};

/**
 * Update progress bar
 * @param {number} percent - Progress percentage (0-100)
 * @param {string} text - Progress text to display
 */
const updateProgress = (percent, text) => {
    progressBar.style.width = `${percent}%`;
    progressText.textContent = text;
};

/**
 * Show progress indicator
 */
const showProgress = () => {
    progressEl.style.display = 'block';
    hideMessages();
};

/**
 * Hide progress indicator
 */
const hideProgress = () => {
    progressEl.style.display = 'none';
};

/**
 * Handle file selection
 */
const handleFileSelect = () => {
    const file = fileInput.files[0];
    
    if (!file) {
        return;
    }

    if (!file.name.endsWith('.epub')) {
        showError('Please select a valid EPUB file.');
        return;
    }

    selectedFile = file;
    fileNameEl.textContent = `Selected: ${file.name}`;
    convertButton.disabled = false;
    hideMessages();
};

/**
 * Extract text content from EPUB
 * @param {ArrayBuffer} epubData - EPUB file data
 * @returns {Promise<Array>} Array of chapter texts
 */
const extractEpubContent = async (epubData) => {
    try {
        // Initialize EPUB book
        epubBook = ePub(epubData);
        await epubBook.ready;

        // Get spine items (chapters)
        const spine = epubBook.spine;
        const chapters = [];

        updateProgress(10, 'Reading EPUB structure...');

        // Extract text from each chapter
        for (let i = 0; i < spine.length; i++) {
            const item = spine.get(i);
            const doc = await item.load(epubBook.load.bind(epubBook));
            
            // Extract text content
            const textContent = doc.textContent || '';
            chapters.push({
                text: textContent.trim(),
                href: item.href
            });

            const progress = 10 + (i / spine.length) * 40;
            updateProgress(progress, `Reading chapter ${i + 1} of ${spine.length}...`);
        }

        return chapters;
    } catch (error) {
        throw new Error(`Failed to parse EPUB: ${error.message}`);
    }
};

/**
 * Convert EPUB content to PDF
 * @param {Array} chapters - Array of chapter objects with text content
 * @param {string} fileName - Original file name for output
 */
const convertToPdf = async (chapters, fileName) => {
    try {
        updateProgress(50, 'Creating PDF document...');

        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined') {
            throw new Error('jsPDF library not loaded. Please check your internet connection.');
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const lineHeight = 7;
        const maxWidth = pageWidth - (margin * 2);

        let yPosition = margin;

        updateProgress(60, 'Adding content to PDF...');

        // Add content to PDF
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            
            if (!chapter.text) {
                continue;
            }

            // Split text into lines that fit the page width
            const lines = pdf.splitTextToSize(chapter.text, maxWidth);

            for (const line of lines) {
                // Add new page if needed
                if (yPosition > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }

                pdf.text(line, margin, yPosition);
                yPosition += lineHeight;
            }

            // Add some space between chapters
            yPosition += lineHeight;

            const progress = 60 + (i / chapters.length) * 30;
            updateProgress(progress, `Processing chapter ${i + 1} of ${chapters.length}...`);
        }

        updateProgress(90, 'Finalizing PDF...');

        // Generate PDF blob
        const pdfBlob = pdf.output('blob');

        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName.replace('.epub', '.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        updateProgress(100, 'Conversion complete!');

        setTimeout(() => {
            hideProgress();
            showSuccess(`Successfully converted "${fileName}" to PDF. The file has been downloaded.`);
        }, 1000);

    } catch (error) {
        throw new Error(`Failed to create PDF: ${error.message}`);
    }
};

/**
 * Main conversion function
 */
const convertEpubToPdf = async () => {
    if (!selectedFile) {
        showError('Please select an EPUB file first.');
        return;
    }

    try {
        showProgress();
        updateProgress(0, 'Starting conversion...');
        convertButton.disabled = true;

        // Read file as ArrayBuffer
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const epubData = event.target.result;
                
                // Extract content from EPUB
                const chapters = await extractEpubContent(epubData);

                if (chapters.length === 0) {
                    throw new Error('No content found in EPUB file.');
                }

                // Convert to PDF
                await convertToPdf(chapters, selectedFile.name);

                // Reset for next conversion
                convertButton.disabled = false;

            } catch (error) {
                showError(error.message);
                convertButton.disabled = false;
            }
        };

        reader.onerror = () => {
            showError('Failed to read the file. Please try again.');
            convertButton.disabled = false;
        };

        reader.readAsArrayBuffer(selectedFile);

    } catch (error) {
        showError(`Conversion failed: ${error.message}`);
        convertButton.disabled = false;
    }
};

// Event listeners
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileSelect);

convertButton.addEventListener('click', convertEpubToPdf);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('EPUB to PDF Converter initialized');
    
    // Check if required libraries are loaded
    if (typeof ePub === 'undefined') {
        showError('Required libraries not loaded. Please check your internet connection and refresh the page.');
    }
});