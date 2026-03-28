---
description: How to validate the PDF merging functionality
---

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the browser using the `open_browser_url` tool to the local development URL (usually `http://localhost:5173`).
3. Prepare two or more sample PDF files. If they don't exist, you can generate them using a script or find them in the system.
4. Drag and drop the PDF files into the designated area in the browser.
5. Verify that the files appear in the list with their correct names and sizes.
6. Test reordering the files using the up/down arrows.
7. Click the "Merge PDFs" button.
8. Verify that the "Processing..." state appears.
9. Verify that a download is triggered (you can check the browser's download history or simulate the download in the browser agent).
10. Check the console for any errors using the `browser_subagent`.
