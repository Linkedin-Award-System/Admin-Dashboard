/**
 * CSV Generation Utility
 * Generates CSV files with UTF-8 encoding and proper column headers
 */

/**
 * Escapes a CSV field value to handle special characters
 */
function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);
  
  // If the value contains comma, quote, or newline, wrap it in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape quotes by doubling them
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Converts an array of objects to CSV format with UTF-8 encoding
 */
export function generateCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: { key: keyof T & string; label: string }[]
): Blob {
  if (data.length === 0) {
    // Return empty CSV with just headers
    const headerRow = headers.map(h => escapeCSVField(h.label)).join(',');
    return new Blob(['\uFEFF' + headerRow], { type: 'text/csv;charset=utf-8;' });
  }

  // Create header row
  const headerRow = headers.map(h => escapeCSVField(h.label)).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(h => escapeCSVField(row[h.key])).join(',');
  });
  
  // Combine header and data rows
  const csvContent = [headerRow, ...dataRows].join('\n');
  
  // Add UTF-8 BOM (Byte Order Mark) for proper encoding
  return new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
}
