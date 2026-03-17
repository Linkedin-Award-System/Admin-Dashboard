/**
 * DataTable Visual Tests
 * 
 * Visual regression tests for the DataTable component
 * Run these tests manually to verify visual appearance
 */

import * as React from 'react';
import { DataTable, type DataTableColumn } from './DataTable';
import { StatusBadge } from '../StatusBadge';

// Sample data for visual testing
interface TestData {
  id: number;
  name: string;
  email: string;
  amount: number;
  status: string;
}

const sampleData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', amount: 1000, status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', amount: 2000, status: 'pending' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', amount: 1500, status: 'completed' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', amount: 3000, status: 'active' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', amount: 2500, status: 'failed' },
];

/**
 * Visual Test 1: Basic Table
 * Verifies basic table rendering with all styling
 */
export function VisualTest1_BasicTable() {
  const columns: DataTableColumn<TestData>[] = [
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Visual Test 1: Basic Table</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable columns={columns} data={sampleData} />
      </div>
    </div>
  );
}

/**
 * Visual Test 2: Table with Custom Rendering
 * Verifies custom render functions and StatusBadge integration
 */
export function VisualTest2_CustomRendering() {
  const columns: DataTableColumn<TestData>[] = [
    { 
      key: 'id', 
      label: 'ID',
      align: 'left',
      render: (value) => <span className="font-mono text-xs">#{value}</span>
    },
    { key: 'name', label: 'Name', align: 'left' },
    { 
      key: 'amount', 
      label: 'Amount', 
      align: 'right',
      render: (value) => (
        <span className="font-semibold text-green-600">
          ETB {value.toLocaleString()}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      align: 'center',
      render: (value) => <StatusBadge status={value} size="sm" />
    },
  ];

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Visual Test 2: Custom Rendering</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable columns={columns} data={sampleData} />
      </div>
    </div>
  );
}

/**
 * Visual Test 3: Loading State
 * Verifies skeleton loading appearance
 */
export function VisualTest3_LoadingState() {
  const columns: DataTableColumn<TestData>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Visual Test 3: Loading State</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable columns={columns} data={[]} loading={true} />
      </div>
    </div>
  );
}

/**
 * Visual Test 4: Empty State
 * Verifies empty state appearance
 */
export function VisualTest4_EmptyState() {
  const columns: DataTableColumn<TestData>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Visual Test 4: Empty State</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable 
          columns={columns} 
          data={[]} 
          emptyMessage="No records found. Add a record to get started."
        />
      </div>
    </div>
  );
}

/**
 * Visual Test 5: Interactive Table (Hover States)
 * Verifies hover effects and clickable rows
 */
export function VisualTest5_InteractiveTable() {
  const [clickedRow, setClickedRow] = React.useState<TestData | null>(null);

  const columns: DataTableColumn<TestData>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'amount', 
      label: 'Amount', 
      align: 'right',
      render: (value) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      label: 'Status',
      align: 'center',
      render: (value) => <StatusBadge status={value} size="sm" />
    },
  ];

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Visual Test 5: Interactive Table (Click a Row)</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable 
          columns={columns} 
          data={sampleData}
          onRowClick={(row) => setClickedRow(row)}
        />
        {clickedRow && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Clicked Row:</p>
            <p className="text-sm text-blue-700">
              {clickedRow.name} - {clickedRow.email} - ETB {clickedRow.amount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Visual Test 6: Zebra Striping
 * Verifies alternate row background colors
 */
export function VisualTest6_ZebraStriping() {
  const columns: DataTableColumn<TestData>[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ];

  const manyRows = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    amount: (i + 1) * 1000,
    status: i % 2 === 0 ? 'active' : 'pending',
  }));

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Visual Test 6: Zebra Striping</h2>
      <p className="text-sm text-gray-600 mb-4">
        Verifies alternate row backgrounds for better readability
      </p>
      <div className="bg-white rounded-lg shadow p-6">
        <DataTable columns={columns} data={manyRows} />
      </div>
    </div>
  );
}

/**
 * Visual Test 7: Responsive Table
 * Verifies horizontal scrolling on narrow containers
 */
export function VisualTest7_ResponsiveTable() {
  const columns: DataTableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'department', label: 'Department' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
  ];

  const wideData = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      department: 'Engineering',
      location: 'New York, NY',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      department: 'Marketing',
      location: 'San Francisco, CA',
      status: 'active'
    },
  ];

  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Visual Test 7: Responsive Table</h2>
      <p className="text-sm text-gray-600 mb-4">
        Table with many columns - should scroll horizontally on narrow screens
      </p>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <DataTable columns={columns} data={wideData} />
      </div>
    </div>
  );
}

/**
 * All Visual Tests Component
 * Displays all visual tests in a single view
 */
export function AllDataTableVisualTests() {
  return (
    <div className="space-y-8">
      <div className="p-8 bg-white border-b">
        <h1 className="text-3xl font-bold mb-2">DataTable Visual Tests</h1>
        <p className="text-gray-600">
          Visual regression tests for the DataTable component. 
          Verify styling, hover states, and responsive behavior.
        </p>
      </div>

      <VisualTest1_BasicTable />
      <VisualTest2_CustomRendering />
      <VisualTest3_LoadingState />
      <VisualTest4_EmptyState />
      <VisualTest5_InteractiveTable />
      <VisualTest6_ZebraStriping />
      <VisualTest7_ResponsiveTable />
    </div>
  );
}
