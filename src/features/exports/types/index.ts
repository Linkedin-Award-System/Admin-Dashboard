export type ExportFormat = 'csv' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  includeCharts?: boolean; // For PDF only
}
