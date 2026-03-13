/**
 * Design System - StatusBadge Examples
 * 
 * Usage examples for StatusBadge pattern component
 */

import * as React from 'react';
import { StatusBadge } from './StatusBadge';

export function StatusBadgeExamples() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Common Status Values</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="active" />
          <StatusBadge status="pending" />
          <StatusBadge status="completed" />
          <StatusBadge status="failed" />
          <StatusBadge status="inactive" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Size Variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status="active" size="sm" />
          <StatusBadge status="active" size="md" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Status Values</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="in-progress" />
          <StatusBadge status="not_started" />
          <StatusBadge status="on hold" />
          <StatusBadge status="archived" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Labels</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="active">Currently Active</StatusBadge>
          <StatusBadge status="pending">Awaiting Approval</StatusBadge>
          <StatusBadge status="failed">Error Occurred</StatusBadge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Explicit Variant Override</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="processing" variant="info" />
          <StatusBadge status="verified" variant="success" />
          <StatusBadge status="attention" variant="warning" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">In Table Context</h2>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm">Project Alpha</td>
              <td className="px-4 py-3">
                <StatusBadge status="active" size="sm" />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Project Beta</td>
              <td className="px-4 py-3">
                <StatusBadge status="pending" size="sm" />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Project Gamma</td>
              <td className="px-4 py-3">
                <StatusBadge status="completed" size="sm" />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Project Delta</td>
              <td className="px-4 py-3">
                <StatusBadge status="failed" size="sm" />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm">Project Epsilon</td>
              <td className="px-4 py-3">
                <StatusBadge status="inactive" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">In Card Context</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Nominee #1</h3>
              <StatusBadge status="active" size="sm" />
            </div>
            <p className="text-sm text-gray-600">John Doe</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Nominee #2</h3>
              <StatusBadge status="pending" size="sm" />
            </div>
            <p className="text-sm text-gray-600">Jane Smith</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Nominee #3</h3>
              <StatusBadge status="inactive" size="sm" />
            </div>
            <p className="text-sm text-gray-600">Bob Johnson</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Case Insensitivity</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="ACTIVE" />
          <StatusBadge status="Pending" />
          <StatusBadge status="CoMpLeTeD" />
        </div>
      </section>
    </div>
  );
}

export default StatusBadgeExamples;
