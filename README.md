# PDF Merger

A simple, fast, and reliable web application for merging PDF files.

## Features

- **Merge Multiple PDFs**: Combine any number of PDF files into a single document entirely in your browser.
- **Drag & Drop**: Easily add files by dragging them into the application window.
- **Privacy First**: All processing happens locally on your machine. No data is sent to a server.
- **Reordering**: Drag and drop or use buttons to reorder files before merging.
- **Modern UI**: Clean, glassmorphism-inspired interface with responsive design.
- **Fast Processing**: Leverages `pdf-lib` for high-performance PDF manipulation.

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Getting Started

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Run

Open the URL provided in the terminal (usually `http://localhost:5173`) to use the application.

## Usage

1. Launch the application.
2. Drag and drop your PDF files into the main window or click "Add Files".
3. Reorder the files by dragging them up or down in the list.
4. Click the "Merge PDFs" button.
5. Choose a location to save your new merged PDF.

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Build

To build the project for production, run:

```bash
npm run build
```

The production assets will be generated in the `dist/` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.