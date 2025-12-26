// app.js
// Initialize the EPUB.js library and configure the viewer logic
const book = ePub("path/to/book.epub");
const rendition = book.renderTo("viewer", {
    width: "100%",
    height: "100%"
});

rendition.display();