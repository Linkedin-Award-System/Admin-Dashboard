/**
 * DataTable Component Tests
 * 
 * Tests for the DataTable pattern component
 * Validates styling, behavior, and requirements
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type DataTableColumn } from './DataTable';

describe('DataTable', () => {
  // Sample data for testing
  const sampleColumns: DataTableColumn[] = [
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  const sampleData = [
    { name: 'John Doe', email: 'john@example.com', amount: 1000, status: 'active' },
    { name: 'Jane Smith', email: 'jane@example.com', amount: 2000, status: 'pending' },
    { name: 'Bob Johnson', email: 'bob@example.com', amount: 1500, status: 'completed' },
  ];

  describe('Basic Rendering', () => {
    it('renders table with columns and data', () => {
      render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      // Check headers are rendered
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      
      // Check data is rendered
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('1500')).toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
      render(<DataTable columns={sampleColumns} data={[]} />);
      
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders custom empty message', () => {
      const customMessage = 'No records found';
      render(
        <DataTable 
          columns={sampleColumns} 
          data={[]} 
          emptyMessage={customMessage}
        />
      );
      
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('displays skeleton rows when loading', () => {
      const { container } = render(
        <DataTable columns={sampleColumns} data={[]} loading={true} />
      );
      
      // Check for skeleton elements
      const skeletons = container.querySelectorAll('[aria-busy="true"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('does not display data when loading', () => {
      render(
        <DataTable columns={sampleColumns} data={sampleData} loading={true} />
      );
      
      // Data should not be visible
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('displays data when not loading', () => {
      render(
        <DataTable columns={sampleColumns} data={sampleData} loading={false} />
      );
      
      // Data should be visible
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Column Alignment', () => {
    it('applies left alignment to text columns', () => {
      render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).toHaveClass('text-left');
    });

    it('applies right alignment to numeric columns', () => {
      render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const amountHeader = screen.getByText('Amount').closest('th');
      expect(amountHeader).toHaveClass('text-right');
    });

    it('applies center alignment when specified', () => {
      render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const statusHeader = screen.getByText('Status').closest('th');
      expect(statusHeader).toHaveClass('text-center');
    });
  });

  describe('Custom Rendering', () => {
    it('uses custom render function when provided', () => {
      const columns: DataTableColumn[] = [
        { 
          key: 'amount', 
          label: 'Amount', 
          align: 'right',
          render: (value) => `$${value.toFixed(2)}`
        },
      ];
      
      const data = [{ amount: 1000 }];
      
      render(<DataTable columns={columns} data={data} />);
      
      expect(screen.getByText('$1000.00')).toBeInTheDocument();
    });

    it('passes row data to custom render function', () => {
      const renderFn = vi.fn((value) => value);
      const columns: DataTableColumn[] = [
        { key: 'name', label: 'Name', render: renderFn },
      ];
      
      render(<DataTable columns={columns} data={sampleData} />);
      
      expect(renderFn).toHaveBeenCalledWith('John Doe', sampleData[0]);
    });
  });

  describe('Row Click Handler', () => {
    it('calls onRowClick when row is clicked', async () => {
      const user = userEvent.setup();
      const handleRowClick = vi.fn();
      
      render(
        <DataTable 
          columns={sampleColumns} 
          data={sampleData}
          onRowClick={handleRowClick}
        />
      );
      
      const firstRow = screen.getByText('John Doe').closest('tr');
      if (firstRow) {
        await user.click(firstRow);
        expect(handleRowClick).toHaveBeenCalledWith(sampleData[0]);
      }
    });

    it('applies cursor-pointer class when onRowClick is provided', () => {
      render(
        <DataTable 
          columns={sampleColumns} 
          data={sampleData}
          onRowClick={() => {}}
        />
      );
      
      const firstRow = screen.getByText('John Doe').closest('tr');
      expect(firstRow).toHaveClass('cursor-pointer');
    });

    it('does not apply cursor-pointer class when onRowClick is not provided', () => {
      render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const firstRow = screen.getByText('John Doe').closest('tr');
      expect(firstRow).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Styling Requirements', () => {
    it('applies uppercase styling to headers (Requirement 7.1)', () => {
      render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const header = screen.getByText('Name').closest('th');
      expect(header).toHaveClass('uppercase');
      expect(header).toHaveClass('text-xs');
      expect(header).toHaveClass('font-medium');
    });

    it('applies correct padding to cells (Requirement 7.4)', () => {
      render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const cell = screen.getByText('John Doe').closest('td');
      expect(cell).toHaveClass('px-3'); // 12px horizontal padding
      expect(cell).toHaveClass('py-3'); // 12px vertical padding
    });

    it('applies border styling (Requirement 7.5)', () => {
      const { container } = render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const rows = container.querySelectorAll('tbody tr');
      rows.forEach(row => {
        expect(row).toHaveClass('border-b');
        expect(row).toHaveClass('border-gray-200');
      });
    });

    it('applies hover effect to rows (Requirement 7.2)', () => {
      render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const firstRow = screen.getByText('John Doe').closest('tr');
      expect(firstRow).toHaveClass('hover:bg-gray-50');
      expect(firstRow).toHaveClass('transition-colors');
    });

    it('applies zebra striping to alternate rows (Requirement 7.6)', () => {
      const { container } = render(<DataTable columns={sampleColumns} data={sampleData} />);
      
      const rows = container.querySelectorAll('tbody tr');
      
      // First row (index 0) should not have background
      expect(rows[0]).not.toHaveClass('bg-gray-50');
      
      // Second row (index 1) should have background
      expect(rows[1]).toHaveClass('bg-gray-50');
      
      // Third row (index 2) should not have background
      expect(rows[2]).not.toHaveClass('bg-gray-50');
    });
  });

  describe('Accessibility', () => {
    it('renders semantic table structure', () => {
      const { container } = render(
        <DataTable columns={sampleColumns} data={sampleData} />
      );
      
      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.querySelector('thead')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
      expect(container.querySelector('th')).toBeInTheDocument();
      expect(container.querySelector('td')).toBeInTheDocument();
    });

    it('applies aria-busy to skeleton elements', () => {
      const { container } = render(
        <DataTable columns={sampleColumns} data={[]} loading={true} />
      );
      
      const skeletons = container.querySelectorAll('[aria-busy="true"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Behavior', () => {
    it('applies overflow-x-auto for horizontal scrolling', () => {
      const { container } = render(
        <DataTable columns={sampleColumns} data={sampleData} />
      );
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('overflow-x-auto');
    });

    it('applies full width to table', () => {
      const { container } = render(
        <DataTable columns={sampleColumns} data={sampleData} />
      );
      
      const table = container.querySelector('table');
      expect(table).toHaveClass('w-full');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty columns array', () => {
      render(<DataTable columns={[]} data={sampleData} />);
      
      // Should render without crashing
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('handles missing data keys gracefully', () => {
      const columns: DataTableColumn[] = [
        { key: 'nonexistent', label: 'Missing' },
      ];
      
      render(<DataTable columns={columns} data={sampleData} />);
      
      // Should render without crashing
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('handles null and undefined values', () => {
      const data = [
        { name: null, email: undefined, amount: 0 },
      ];
      
      render(<DataTable columns={sampleColumns} data={data} />);
      
      // Should render without crashing
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});
