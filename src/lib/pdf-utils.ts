
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Sets the PDF.js worker source. This is a critical step to ensure the library can process PDFs in the browser.
// It points to a reliable CDN to fetch the legacy worker script, matching the imported library version.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;

/**
 * Extracts all text content from a given PDF file's binary data.
 * This function uses the pdfjs-dist library to parse the PDF and extract text from each page.
 * @param {Uint8Array | ArrayBuffer} pdfBytes - The binary data of the PDF file.
 * @returns {Promise<string>} A promise that resolves to the full text content of the PDF.
 */
export async function extractTextFromPdf(pdfBytes: Uint8Array | ArrayBuffer): Promise<string> {
  try {
    // Load the PDF document from the binary data.
    const loadingTask = pdfjsLib.getDocument({ 
      data: pdfBytes,
      verbosity: 0 // Reduce console noise from the library.
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    // Iterate through each page of the PDF.
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract the string content from each text item on the page and join them.
      const pageText = textContent.items
        .filter(item => 'str' in item) // Ensure the item is a text item.
        .map(item => (item as any).str)
        .join(' ');
      
      fullText += pageText + '\n\n'; // Add page text to the full text, with newlines for separation.
    }
    
    // Return the trimmed full text.
    return fullText.trim();
    
  } catch (error: any) {
    console.error('Text extraction error:', error);
    // Throw a more user-friendly error to be caught by the calling function.
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}
