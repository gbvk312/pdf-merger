import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDF files into a single PDF document.
 * @param {File[]} files - An array of File objects.
 * @returns {Promise<Uint8Array>} - The merged PDF document as a Uint8Array.
 */
export async function mergePDFs(files) {
  if (files.length === 0) return null;

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
}

/**
 * Downloads a Uint8Array as a PDF file.
 * @param {Uint8Array} bytes - The bytes of the PDF file.
 * @param {string} fileName - The name of the file to be saved.
 */
export function downloadPDF(bytes, fileName = 'merged.pdf') {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
