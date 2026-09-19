/**
 * Client-Side SSR-Safe Document Parser & PII Sanitizer
 */

export function sanitizePII(text: string): string {
  if (!text) return '';

  // Mask Social Security Numbers / National IDs (e.g. 123-45-6789)
  let sanitized = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[NATIONAL_ID_MASKED]');

  // Mask Phone numbers
  sanitized = sanitized.replace(
    /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,
    '[PHONE_MASKED]'
  );

  // Mask sensitive residential addresses patterns (e.g. "123 Main St, Apt 4B")
  sanitized = sanitized.replace(
    /\b\d{1,5}\s+[A-Za-z0-9\s.,]{3,30}(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|St|Way)\b/gi,
    '[ADDRESS_MASKED]'
  );

  return sanitized;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction is only supported in browser environment');
  }

  // Dynamically import pdfjs-dist on client side
  const pdfjsLib = await import('pdfjs-dist');

  // Configure worker source to use unpkg CDN matching the installed version
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += `--- Page ${pageNum} ---\n` + pageStrings + '\n\n';
  }

  return sanitizePII(fullText);
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  if (fileExt === 'pdf') {
    return extractTextFromPdf(file);
  } else {
    // Treat as plain text (.txt, .md, etc.)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = (reader.result as string) || '';
        resolve(sanitizePII(raw));
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }
}
