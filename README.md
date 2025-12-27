# Epub Reader Pro

A comprehensive web-based solution for reading and converting EPUB files, built with modern web technologies.

## Features

### 📚 EPUB Reader
- **Progressive Web App (PWA)** support for offline reading
- Interactive and responsive interface optimized for all devices
- File upload support for reading your own EPUB files
- Keyboard navigation (Arrow keys for page navigation)
- Built with **EPUB.js** for accurate rendering
- Smooth page transitions and continuous scroll mode

### 📄 EPUB to PDF Converter
- Convert EPUB files to PDF format
- Real-time progress tracking
- Comprehensive error handling
- Automatic download of converted files
- Built with **EPUB.js** and **jsPDF**

## 🚀 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (recommended for testing)

### Option 1: Using Live Server (Recommended)

1. **Install Live Server** (VS Code Extension):
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

2. **Run the Project**:
   ```bash
   # Clone the repository
   git clone https://github.com/geekeie/Epub-Reader-Pro.git
   cd Epub-Reader-Pro
   ```

3. **For EPUB Reader**:
   - Open the `epub-reader` folder in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - The reader will open in your default browser at `http://127.0.0.1:5500/epub-reader/`

4. **For EPUB to PDF Converter**:
   - Open the `epub-to-pdf` folder in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - The converter will open at `http://127.0.0.1:5500/epub-to-pdf/`

### Option 2: Using Python HTTP Server

```bash
# Navigate to the project directory
cd Epub-Reader-Pro

# For Python 3.x
python -m http.server 8000

# For Python 2.x
python -m SimpleHTTPServer 8000
```

Then open:
- EPUB Reader: `http://localhost:8000/epub-reader/`
- EPUB to PDF: `http://localhost:8000/epub-to-pdf/`

### Option 3: Using Node.js http-server

```bash
# Install http-server globally
npm install -g http-server

# Navigate to project directory
cd Epub-Reader-Pro

# Start the server
http-server -p 8000
```

Then access the tools at the URLs mentioned above.

## 📖 Usage Instructions

### EPUB Reader

1. **Upload an EPUB File**:
   - Click the "Upload EPUB" button
   - Select an EPUB file from your device
   - The book will load automatically

2. **Navigation**:
   - Use the "Previous" and "Next" buttons
   - Or use keyboard arrow keys (← →) for navigation

3. **Offline Reading**:
   - The app works offline after the first visit
   - Your last opened book is cached for offline access

### EPUB to PDF Converter

1. **Select EPUB File**:
   - Click "Select EPUB File" button
   - Choose an EPUB file from your device

2. **Convert**:
   - Click "Convert to PDF" button
   - Wait for the conversion process to complete
   - The PDF will automatically download when ready

3. **Progress Tracking**:
   - A progress bar shows the conversion status
   - Estimated time is displayed during conversion

## 🔧 Troubleshooting

### Blank Screen Issues

If you encounter a blank screen, try these solutions:

1. **Check Console for Errors**:
   - Press F12 to open Developer Tools
   - Check the Console tab for error messages

2. **Verify Local Server**:
   - Make sure you're running the app through a web server
   - Opening `index.html` directly may cause CORS issues
   - Use Live Server, Python HTTP server, or similar

3. **Check Internet Connection**:
   - The app requires internet for first load (CDN libraries)
   - After first load, offline mode is available

4. **Clear Browser Cache**:
   - Clear cache and reload the page
   - In Chrome: Ctrl+Shift+R (Cmd+Shift+R on Mac)

5. **Update Service Worker**:
   - Open Developer Tools (F12)
   - Go to Application > Service Workers
   - Click "Unregister" if present
   - Reload the page

6. **Verify File Upload**:
   - Ensure you're uploading a valid EPUB file
   - Check that the file is not corrupted
   - Try a different EPUB file

### Common Errors and Solutions

| Error | Solution |
|-------|----------|
| "EPUB.js library not loaded" | Check internet connection and refresh |
| "Failed to read file" | Ensure file is a valid EPUB format |
| "No content found in EPUB" | Try a different EPUB file |
| Service Worker errors | Clear cache and unregister service worker |

## 🌐 WordPress Integration

To embed these tools in WordPress:

### Using iframe:

```html
<!-- For EPUB Reader -->
<iframe 
    src="https://your-domain.com/epub-reader/index.html" 
    width="100%" 
    height="600px" 
    frameborder="0"
    style="border: none;">
</iframe>

<!-- For EPUB to PDF Converter -->
<iframe 
    src="https://your-domain.com/epub-to-pdf/index.html" 
    width="100%" 
    height="500px" 
    frameborder="0"
    style="border: none;">
</iframe>
```

### Steps:
1. Upload the project files to your WordPress hosting
2. Use the HTML block in WordPress editor
3. Paste the iframe code above
4. Replace `your-domain.com` with your actual domain
5. Adjust width and height as needed

## 🛠️ Technology Stack

- **EPUB.js** (v0.3.93) - EPUB rendering engine
- **jsPDF** (v2.5.1) - PDF generation library
- **pdf-lib** (v1.17.1) - PDF manipulation
- **Service Workers** - PWA and offline functionality
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **CSS3** - Responsive design and animations

## 📁 Project Structure

```
Epub-Reader-Pro/
├── epub-reader/
│   ├── index.html      # EPUB reader interface
│   ├── app.js          # Reader application logic
│   ├── styles.css      # Reader styles
│   ├── sw.js           # Service worker for PWA
│   └── manifest.json   # PWA manifest
├── epub-to-pdf/
│   ├── index.html      # Converter interface
│   ├── converter.js    # Conversion logic
│   └── styles.css      # Converter styles
└── README.md           # This file
```

## 🔒 Privacy & Security

- All processing happens locally in your browser
- No files are uploaded to external servers
- No user data is collected or stored
- Service worker caches only essential resources

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper comments
4. **Follow ES6+ standards** for JavaScript
5. **Test thoroughly** on multiple browsers
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Style Guidelines

- Use ES6+ features (arrow functions, const/let, async/await)
- Add JSDoc comments for all functions
- Follow consistent naming conventions
- Keep functions small and focused
- Handle errors gracefully with try-catch blocks

## 📝 License

This project is open source and available for use and modification.

## 🐛 Known Issues

- Large EPUB files (>50MB) may take longer to process
- Some EPUB files with complex formatting may not render perfectly
- PDF conversion preserves text but may lose some styling

## 📮 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Open an issue on GitHub with details

## 🎯 Future Enhancements

- [ ] Support for more ebook formats
- [ ] Customizable reader themes
- [ ] Bookmark and annotation features
- [ ] Cloud storage integration
- [ ] Enhanced PDF formatting options
- [ ] Multi-language support

---

**Made with ❤️ for the reading community**