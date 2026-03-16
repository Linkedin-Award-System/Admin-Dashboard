/**
 * Badge Component Visual Test
 * 
 * This file can be used to visually test the Badge component
 * Import and render this component in your app to see all Badge variants
 */

import { Badge } from './Badge';

export function BadgeVisualTest() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Badge Component Visual Test</h1>
        
        {/* All Variants - Medium Size */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">All Variants (Medium Size)</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>
        </section>

        {/* All Variants - Small Size */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">All Variants (Small Size)</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="success" size="sm">Success</Badge>
            <Badge variant="warning" size="sm">Warning</Badge>
            <Badge variant="error" size="sm">Error</Badge>
            <Badge variant="info" size="sm">Info</Badge>
            <Badge variant="neutral" size="sm">Neutral</Badge>
          </div>
        </section>

        {/* Status Examples */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Common Status Labels</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-600">Payment:</span>
              <Badge variant="success" size="sm">Paid</Badge>
              <Badge variant="warning" size="sm">Pending</Badge>
              <Badge variant="error" size="sm">Failed</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-600">User:</span>
              <Badge variant="success" size="sm">Active</Badge>
              <Badge variant="neutral" size="sm">Inactive</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-600">Vote:</span>
              <Badge variant="info" size="sm">Voted</Badge>
              <Badge variant="neutral" size="sm">Not Voted</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-600">Approval:</span>
              <Badge variant="success" size="sm">Approved</Badge>
              <Badge variant="warning" size="sm">Under Review</Badge>
              <Badge variant="error" size="sm">Rejected</Badge>
            </div>
          </div>
        </section>

        {/* Table Example */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">In Table Context</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-gray-600 uppercase">ID</th>
                  <th className="text-left p-3 text-xs font-medium text-gray-600 uppercase">Name</th>
                  <th className="text-left p-3 text-xs font-medium text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="p-3 text-sm">001</td>
                  <td className="p-3 text-sm">John Doe</td>
                  <td className="p-3">
                    <Badge variant="success" size="sm">Active</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 text-sm">002</td>
                  <td className="p-3 text-sm">Jane Smith</td>
                  <td className="p-3">
                    <Badge variant="warning" size="sm">Pending</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 text-sm">003</td>
                  <td className="p-3 text-sm">Bob Johnson</td>
                  <td className="p-3">
                    <Badge variant="neutral" size="sm">Inactive</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 text-sm">004</td>
                  <td className="p-3 text-sm">Alice Williams</td>
                  <td className="p-3">
                    <Badge variant="info" size="sm">New</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Card Example */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">In Card Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">Project Alpha</h3>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Currently in development phase
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">Project Beta</h3>
                <Badge variant="warning" size="sm">Pending</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Awaiting approval
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">Project Gamma</h3>
                <Badge variant="neutral" size="sm">Inactive</Badge>
              </div>
              <p className="text-sm text-gray-600">
                On hold
              </p>
            </div>
          </div>
        </section>

        {/* Color Reference */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Color Reference</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <Badge variant="success" size="sm">Success</Badge>
              <span className="text-gray-600">#10b981 (Green)</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="warning" size="sm">Warning</Badge>
              <span className="text-gray-600">#f59e0b (Yellow)</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="error" size="sm">Error</Badge>
              <span className="text-gray-600">#ef4444 (Red)</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">Info</Badge>
              <span className="text-gray-600">#0a66c2 (LinkedIn Blue)</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="neutral" size="sm">Neutral</Badge>
              <span className="text-gray-600">#6b7280 (Gray)</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BadgeVisualTest;
