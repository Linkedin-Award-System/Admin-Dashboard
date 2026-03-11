# Data Export and Reporting Module

This module provides data export functionality for the LinkedIn Awards Admin Dashboard, allowing administrators to export categories, vote statistics, and payment transactions in CSV and PDF formats.

## Features

- **Multiple Export Formats**: Support for CSV (client-side) and PDF (server-side) exports
- **UTF-8 Encoding**: All CSV exports use UTF-8 encoding with BOM to support international characters
- **Column Headers**: All CSV exports include descriptive column headers
- **Filtered Exports**: Respects current filters when exporting data
- **User-Friendly UI**: Simple dropdown to select format with loading states and error handling
- **Proper File Downloads**: Automatic file downloads with correct MIME types and filenames

## Components

### ExportButton

A reusable button component with format selection dropdown.

**Props:**
- `onExport: (format: ExportFormat) => Promise<Blob>` - Function to call for export
- `filename: string` - Base filename for the downloaded file (extension added automatically)
- `label?: string` - Button label (default: "Export")
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';

<ExportButton
  onExport={exportService.exportCategories}
  filename="categories"
  label="Export Categories"
/>
```

## Services

### exportService

Provides methods for exporting different types of data.

**Methods:**

#### exportCategories(format: ExportFormat): Promise<Blob>
Exports all categories with their nominee counts.

**CSV Columns:**
- ID
- Name
- Description
- Nominee Count
- Created At
- Updated At

#### exportVoteStats(format: ExportFormat, dateRange?: DateRange): Promise<Blob>
Exports vote statistics for all categories and nominees.

**CSV Columns:**
- Category ID
- Category Name
- Category Total Votes
- Nominee ID
- Nominee Name
- Nominee Vote Count
- Nominee Percentage
- Is Leading

**Parameters:**
- `format`: 'csv' or 'pdf'
- `dateRange`: Optional date range filter

#### exportPayments(format: ExportFormat, filters?: PaymentFilters): Promise<Blob>
Exports payment transactions.

**CSV Columns:**
- ID
- Transaction ID
- Amount
- Currency
- Status
- Payer Name
- Payer Email
- Created At
- Updated At

**Parameters:**
- `format`: 'csv' or 'pdf'
- `filters`: Optional filters (status, date range)

## Utilities

### csv-generator.ts

Generates CSV files with proper escaping and UTF-8 encoding.

**Key Features:**
- Escapes special characters (commas, quotes, newlines)
- Adds UTF-8 BOM for proper encoding
- Handles null/undefined values
- Includes column headers

### pdf-generator.ts

Handles PDF generation via server-side API calls.

**Note:** PDF generation is performed server-side. The client makes an API call to the backend which generates and returns the PDF file.

## Integration

The export functionality has been integrated into:

1. **CategoryList** - Export all categories
2. **VotingDashboard** - Export vote statistics (respects date range filter)
3. **PaymentList** - Export payment transactions (respects status and date filters)

## Requirements Validation

This implementation validates the following requirements:

- **Requirement 7.1**: CSV export of categories and nominees ✓
- **Requirement 7.2**: CSV export of vote statistics ✓
- **Requirement 7.3**: PDF export of vote statistics with charts ✓
- **Requirement 7.4**: CSV export of payment transactions ✓
- **Requirement 7.5**: Export operations complete within 10 seconds for datasets under 10,000 records ✓
- **Requirement 7.6**: Column headers in all CSV exports ✓
- **Requirement 7.7**: UTF-8 encoding for international character support ✓

## Technical Details

### CSV Generation
- Client-side generation using Blob API
- UTF-8 BOM (`\uFEFF`) prepended for proper encoding
- RFC 4180 compliant CSV formatting
- Special character escaping (quotes doubled, fields wrapped in quotes when needed)

### PDF Generation
- Server-side generation via API endpoints
- Supports additional options (e.g., includeCharts for vote stats)
- Returns Blob for client-side download

### File Download
- Uses `window.URL.createObjectURL()` for blob URLs
- Creates temporary anchor element for download
- Proper cleanup of object URLs after download
- Correct MIME types set for each format

## Error Handling

- Network errors are caught and displayed to users
- Loading states prevent multiple simultaneous exports
- User-friendly error messages for all failure scenarios
- Errors logged to console for debugging

## Accessibility

- Proper ARIA labels on buttons and selects
- Error messages use `role="alert"` for screen readers
- Disabled states during loading prevent duplicate actions
- Keyboard navigation fully supported
