/**
 * PDF Generation Utility
 * Generates PDF files from tabular data using jsPDF
 */

import { jsPDF } from 'jspdf';

/**
 * Generates a PDF blob from tabular data
 */
export function generatePDF<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T & string; label: string }[],
  title: string
): Blob {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const usableWidth = pageWidth - margin * 2;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, 40);

  // Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 56);

  const colWidth = usableWidth / headers.length;
  const rowHeight = 20;
  const headerY = 75;

  // Header background
  doc.setFillColor(30, 64, 175); // blue-800
  doc.rect(margin, headerY, usableWidth, rowHeight, 'F');

  // Header text
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  headers.forEach((h, i) => {
    doc.text(h.label, margin + i * colWidth + 4, headerY + 13, { maxWidth: colWidth - 8 });
  });

  // Data rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  let y = headerY + rowHeight;

  data.forEach((row, rowIndex) => {
    // Alternate row background
    if (rowIndex % 2 === 0) {
      doc.setFillColor(243, 244, 246); // gray-100
      doc.rect(margin, y, usableWidth, rowHeight, 'F');
    }

    doc.setTextColor(30, 30, 30);
    headers.forEach((h, i) => {
      const val = row[h.key];
      const text = val === null || val === undefined ? '' : String(val);
      doc.text(text, margin + i * colWidth + 4, y + 13, { maxWidth: colWidth - 8 });
    });

    y += rowHeight;

    // Add new page if needed
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  });

  // Border around table
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, headerY, usableWidth, y - headerY);

  return doc.output('blob');
}
