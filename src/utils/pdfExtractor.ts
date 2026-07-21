/**
 * Utility to extract text from PDF files entirely on the client-side.
 * It dynamically loads pdf.js from a CDN to keep Next.js bundles light and avoid SSR/Worker issues.
 */
export async function extractTextFromPDF(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Check if PDF.js is already loaded, otherwise load it
    if (typeof window === 'undefined') {
      reject(new Error('Cannot extract PDF text on the server-side.'));
      return;
    }

    const CDN_VERSION = '2.16.105';
    const SCRIPT_ID = 'pdfjs-lib-cdn';

    const startParsing = async () => {
      try {
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          reject(new Error('PDF.js library was not loaded successfully.'));
          return;
        }

        // Configure the worker Src
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${CDN_VERSION}/pdf.worker.min.js`;

        // Read the file as ArrayBuffer
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            if (!arrayBuffer) {
              reject(new Error('Failed to read file buffer.'));
              return;
            }

            // Load the PDF document
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const totalPages = pdf.numPages;
            
            let extractedText = '';

            for (let i = 1; i <= totalPages; i++) {
              if (onProgress) {
                onProgress(Math.round(((i - 1) / totalPages) * 100));
              }

              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
              
              extractedText += pageText + '\n\n';
            }

            if (onProgress) {
              onProgress(100);
            }

            resolve(extractedText.trim());
          } catch (err) {
            reject(err);
          }
        };

        reader.onerror = () => reject(new Error('Failed to read PDF file.'));
        reader.readAsArrayBuffer(file);
      } catch (err) {
        reject(err);
      }
    };

    // If already loaded, parse directly
    if ((window as any).pdfjsLib) {
      startParsing();
      return;
    }

    // Otherwise, load script dynamically
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${CDN_VERSION}/pdf.min.js`;
    script.async = true;
    script.onload = () => {
      // Small timeout to ensure script initializes
      setTimeout(startParsing, 100);
    };
    script.onerror = () => {
      reject(new Error('Failed to load PDF parsing engine from CDN. Check your internet connection.'));
    };

    document.head.appendChild(script);
  });
}
