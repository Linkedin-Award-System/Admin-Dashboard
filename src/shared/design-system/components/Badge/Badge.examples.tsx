/**
 * Design System - Badge Component Examples
 * 
 * Visual examples demonstrating Badge component usage
 * These examples can be used in Storybook or documentation
 */

import { Badge } from './Badge';

/**
 * Basic Badge Examples
 */
export function BasicBadgeExamples() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Basic Badges</h2>
      
      <div className="flex gap-3 items-center">
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="error">Failed</Badge>
        <Badge variant="info">New</Badge>
        <Badge variant="neutral">Inactive</Badge>
      </div>
    </div>
  );
}

/**
 * Badge Size Examples
 */
export function BadgeSizeExamples() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Badge Sizes</h2>
      
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <span className="w-20 text-sm text-gray-600">Small:</span>
          <Badge variant="success" size="sm">Active</Badge>
          <Badge variant="warning" size="sm">Pending</Badge>
          <Badge variant="error" size="sm">Failed</Badge>
        </div>
        
        <div className="flex gap-3 items-center">
          <span className="w-20 text-sm text-gray-600">Medium:</span>
          <Badge variant="success" size="md">Active</Badge>
          <Badge variant="warning" size="md">Pending</Badge>
          <Badge variant="error" size="md">Failed</Badge>
        </div>
      </div>
    </div>
  );
}

/**
 * Status Indicator Examples
 */
export function StatusIndicatorExamples() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Status Indicators</h2>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-32 text-sm">Payment Status:</span>
          <Badge variant="success">Paid</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="error">Failed</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="w-32 text-sm">User Status:</span>
          <Badge variant="success">Active</Badge>
          <Badge variant="neutral">Inactive</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="w-32 text-sm">Vote Status:</span>
          <Badge variant="info">Voted</Badge>
          <Badge variant="neutral">Not Voted</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="w-32 text-sm">Approval Status:</span>
          <Badge variant="success">Approved</Badge>
          <Badge variant="warning">Under Review</Badge>
          <Badge variant="error">Rejected</Badge>
        </div>
      </div>
    </div>
  );
}

/**
 * Table Usage Example
 */
export function TableBadgeExample() {
  const data = [
    { id: 1, name: 'John Doe', status: 'active' },
    { id: 2, name: 'Jane Smith', status: 'pending' },
    { id: 3, name: 'Bob Johnson', status: 'inactive' },
    { id: 4, name: 'Alice Williams', status: 'active' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Badges in Tables</h2>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 text-sm font-medium text-gray-600">ID</th>
            <th className="text-left p-3 text-sm font-medium text-gray-600">Name</th>
            <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="p-3 text-sm">{row.id}</td>
              <td className="p-3 text-sm">{row.name}</td>
              <td className="p-3">
                <Badge variant={getStatusVariant(row.status)} size="sm">
                  {row.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Card Usage Example
 */
export function CardBadgeExample() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Badges in Cards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Project Alpha</h3>
            <Badge variant="success" size="sm">Active</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Currently in development phase
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Project Beta</h3>
            <Badge variant="warning" size="sm">Pending</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Awaiting approval
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Project Gamma</h3>
            <Badge variant="neutral" size="sm">Inactive</Badge>
          </div>
          <p className="text-sm text-gray-600">
            On hold
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * All Examples Combined
 */
export function AllBadgeExamples() {
  return (
    <div className="space-y-8">
      <BasicBadgeExamples />
      <BadgeSizeExamples />
      <StatusIndicatorExamples />
      <TableBadgeExample />
      <CardBadgeExample />
    </div>
  );
}
