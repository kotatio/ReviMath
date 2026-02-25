import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import Tesseract from 'tesseract.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export type ExtractionProgress = {
  stage: 'text' | 'ocr';
  page: number;
  totalPages: number;
};

export async function extractTextFromPDF(
  file: File,
  onProgress?: (p: ExtractionProgress) => void
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const pages: string[] = [];

  // First pass: try native text extraction
  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({ stage: 'text', page: i, totalPages });
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(text);
  }

  const nativeText = pages.join('\n\n').trim();

  // If enough text was extracted natively, return it
  if (nativeText.length >= 50) {
    return nativeText;
  }

  // Second pass: OCR on rendered pages (scanned PDF)
  const ocrPages: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({ stage: 'ocr', page: i, totalPages });
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    await page.render({ canvasContext: ctx, viewport, canvas } as Parameters<typeof page.render>[0]).promise;

    const result = await Tesseract.recognize(canvas, 'fra');
    ocrPages.push(result.data.text);

    canvas.remove();
  }

  return ocrPages.join('\n\n').trim();
}
