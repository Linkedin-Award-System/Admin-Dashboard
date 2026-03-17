/**
 * DataTable Component Examples
 * 
 * Usage examples for the DataTable pattern component
 */

import * as React from 'react';
import { DataTable, type DataTableColumn } from './DataTable';
import { StatusBadge } from '../StatusBadge';

// Sample data types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
}

interface Nominee {
  id: number;
  name: string;
  category: string;
  votes: number;
  status: string;
}

// Sample data
const sampleUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'pending' },
];

const sampleTransactions: Transaction[] = [
  { id: 'TXN001', date: '2024-01-15', description: 'Payment received', amount: 1000, status: 'completed' },
  { id: 'TXN002', date: '2024-01-16', description: 'Refund processed', amount: -250, status: 'completed' },
  { id: 'TXN003', date: '2024-01-17', description: 'Payment pending', amount: 500, status: 'pending' },
  { id: 'TXN004', date: '2024-01-18', description: 'Payment failed', amount: 750, status: 'failed' },
];

const sampleNominees: Nominee[] = [
  { id: 1, name: 'Sarah Connor', category: 'Best Design', votes: 1250, status: 'active' },
  { id: 2, name: 'John Connor', category: 'Best Innovation', votes: 980, status: 'active' },
  { id: 3, name: 'Kyle Reese', category: 'Best Campaign', votes: 1450, status: 'active' },
];

/**
 * Example 1: Basic Table
 * Simple table with text columns
 */
export function BasicTableExample() {
  const columns: DataTableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Table</h3>
      <DataTable columns={columns} data={sampleUsers} />
    </div>
  );
}

/**
 * Example 2: Table with Custom Alignment
 * Demonstrates left, center, and right alignment
 */
export function AlignmentExample() {
  const columns: DataTableColumn<Transaction>[] = [
    { key: 'id', label: 'Transaction ID', align: 'left' },
    { key: 'date', label: 'Date', align: 'center' },
    { key: 'description', label: 'Description', align: 'left' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Table with Custom Alignment</h3>
      <DataTable columns={columns} data={sampleTransactions} />
    </div>
  );
}

/**
 * Example 3: Table with Custom Rendering
 * Uses custom render functions for formatting
 */
export function CustomRenderingExample() {
  const columns: DataTableColumn<Transaction>[] = [
    { 
      key: 'id', 
      label: 'Transaction ID',
      render: (value) => <span className="font-mono text-xs">{value}</span>
    },
    { 
      key: 'date', 
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'description', 
      label: 'Description' 
    },
    { 
      key: 'amount', 
      label: 'Amount', 
      align: 'right',
      render: (value) => (
        <span className={value < 0 ? 'text-red-600' : 'text-green-600'}>
          ETB {Math.abs(value).toFixed(2)}
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Table with Custom Rendering</h3>
      <DataTable columns={columns} data={sampleTransactions} />
    </div>
  );
}

/**
 * Example 4: Loading State
 * Shows skeleton loading state
 */
export function LoadingStateExample() {
  const columns: DataTableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Loading State</h3>
      <DataTable columns={columns} data={[]} loading={true} />
    </div>
  );
}

/**
 * Example 5: Empty State
 * Shows empty state with custom message
 */
export function EmptyStateExample() {
  const columns: DataTableColumn<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Empty State</h3>
      <DataTable 
        columns={columns} 
        data={[]} 
        emptyMessage="No users found. Add a user to get started."
      />
    </div>
  );
}

/**
 * Example 6: Interactive Table with Row Click
 * Demonstrates row click handler
 */
export function InteractiveTableExample() {
  const [selectedNominee, setSelectedNominee] = React.useState<Nominee | null>(null);

  const columns: DataTableColumn<Nominee>[] = [
    { key: 'name', label: 'Nominee Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'votes', 
      label: 'Votes', 
      align: 'right',
      render: (value) => value.toLocaleString()
    },
    { 
      key: 'status', 
      label: 'Status',
      align: 'center',
      render: (value) => <StatusBadge status={value} size="sm" />
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Interactive Table (Click a Row)</h3>
      <DataTable 
        columns={columns} 
        data={sampleNominees}
        onRowClick={(nominee) => setSelectedNominee(nominee)}
      />
      {selectedNominee && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium">Selected Nominee:</p>
          <p className="text-sm">{selectedNominee.name} - {selectedNominee.category}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 7: Responsive Table
 * Table with many columns that scrolls horizontally on small screens
 */
export function ResponsiveTableExample() {
  const columns: DataTableColumn[] = [
    { key: 'id', label: 'ID', align: 'left' },
    { key: 'name', label: 'Name', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    { key: 'role', label: 'Role', align: 'left' },
    { key: 'department', label: 'Department', align: 'left' },
    { key: 'location', label: 'Location', align: 'left' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  const data = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'Admin', 
      department: 'Engineering',
      location: 'New York',
      status: 'active' 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'Editor', 
      department: 'Marketing',
      location: 'San Francisco',
      status: 'active' 
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Responsive Table (Scrolls Horizontally)</h3>
      <p className="text-sm text-gray-600">
        This table has many columns and will scroll horizontally on small screens.
      </p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

/**
 * All Examples Component
 * Displays all examples in a single view
 */
export function AllDataTableExamples() {
  return (
    <div className="space-y-12 p-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">DataTable Component Examples</h2>
        <p className="text-gray-600 mb-8">
          Professional table component with columns, data, loading states, and interactive features.
        </p>
      </div>

      <BasicTableExample />
      <AlignmentExample />
      <CustomRenderingExample />
      <LoadingStateExample />
      <EmptyStateExample />
      <InteractiveTableExample />
      <ResponsiveTableExample />
    </div>
  );
}
