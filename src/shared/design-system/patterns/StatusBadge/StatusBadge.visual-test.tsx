/**
 * Design System - StatusBadge Visual Test
 * 
 * Visual test page for StatusBadge component
 * Run the dev server and navigate to this component to see all variants
 */

import * as React from 'react';
import { StatusBadge, getStatusVariant } from './StatusBadge';

export function StatusBadgeVisualTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            StatusBadge Visual Test
          </h1>
          <p className="text-gray-600">
            Visual testing for StatusBadge pattern component with all variants and use cases
          </p>
        </div>

        {/* Common Status Values */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Common Status Values
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="active" />
              <span className="text-xs text-gray-500">active → success</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="pending" />
              <span className="text-xs text-gray-500">pending → warning</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="completed" />
              <span className="text-xs text-gray-500">completed → success</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="failed" />
              <span className="text-xs text-gray-500">failed → error</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="inactive" />
              <span className="text-xs text-gray-500">inactive → neutral</span>
            </div>
          </div>
        </section>

        {/* Size Comparison */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Size Variants
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="active" size="sm" />
              <span className="text-xs text-gray-500">Small (sm)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="active" size="md" />
              <span className="text-xs text-gray-500">Medium (md) - default</span>
            </div>
          </div>
        </section>

        {/* Custom Status Values */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Custom Status Values (Auto-formatted)
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="in-progress" />
              <span className="text-xs text-gray-500">in-progress</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="not_started" />
              <span className="text-xs text-gray-500">not_started</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="on hold" />
              <span className="text-xs text-gray-500">on hold</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="archived" />
              <span className="text-xs text-gray-500">archived</span>
            </div>
          </div>
        </section>

        {/* Custom Labels */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Custom Labels
          </h2>
          <div className="flex flex-wrap gap-4">
            <StatusBadge status="active">Currently Active</StatusBadge>
            <StatusBadge status="pending">Awaiting Approval</StatusBadge>
            <StatusBadge status="failed">Error Occurred</StatusBadge>
            <StatusBadge status="completed">Successfully Completed</StatusBadge>
          </div>
        </section>

        {/* Variant Override */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Explicit Variant Override
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="processing" variant="info" />
              <span className="text-xs text-gray-500">custom + info variant</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="verified" variant="success" />
              <span className="text-xs text-gray-500">custom + success variant</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="attention" variant="warning" />
              <span className="text-xs text-gray-500">custom + warning variant</span>
            </div>
          </div>
        </section>

        {/* Table Context */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            In Table Context
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Project Alpha
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Development
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status="active" size="sm" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Project Beta
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Design
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status="pending" size="sm" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Project Gamma
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Marketing
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status="completed" size="sm" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Project Delta
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Research
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status="failed" size="sm" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Project Epsilon
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Operations
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status="inactive" size="sm" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Card Context */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            In Card Context
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Nominee #1</h3>
                <StatusBadge status="active" size="sm" />
              </div>
              <p className="text-sm text-gray-600 mb-2">John Doe</p>
              <p className="text-xs text-gray-500">Category: Best Innovation</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Nominee #2</h3>
                <StatusBadge status="pending" size="sm" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Jane Smith</p>
              <p className="text-xs text-gray-500">Category: Best Design</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Nominee #3</h3>
                <StatusBadge status="inactive" size="sm" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Bob Johnson</p>
              <p className="text-xs text-gray-500">Category: Best Marketing</p>
            </div>
          </div>
        </section>

        {/* Case Insensitivity */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Case Insensitivity
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="ACTIVE" />
              <span className="text-xs text-gray-500">ACTIVE</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="Pending" />
              <span className="text-xs text-gray-500">Pending</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StatusBadge status="CoMpLeTeD" />
              <span className="text-xs text-gray-500">CoMpLeTeD</span>
            </div>
          </div>
        </section>

        {/* Utility Function Demo */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            getStatusVariant() Utility Function
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-4">
              <code className="text-gray-600">getStatusVariant('active')</code>
              <span className="text-gray-400">→</span>
              <code className="text-green-600">{getStatusVariant('active')}</code>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-gray-600">getStatusVariant('pending')</code>
              <span className="text-gray-400">→</span>
              <code className="text-yellow-600">{getStatusVariant('pending')}</code>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-gray-600">getStatusVariant('completed')</code>
              <span className="text-gray-400">→</span>
              <code className="text-green-600">{getStatusVariant('completed')}</code>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-gray-600">getStatusVariant('failed')</code>
              <span className="text-gray-400">→</span>
              <code className="text-red-600">{getStatusVariant('failed')}</code>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-gray-600">getStatusVariant('inactive')</code>
              <span className="text-gray-400">→</span>
              <code className="text-gray-600">{getStatusVariant('inactive')}</code>
            </div>
            <div className="flex items-center gap-4">
              <code className="text-gray-600">getStatusVariant('custom')</code>
              <span className="text-gray-400">→</span>
              <code className="text-gray-600">{getStatusVariant('custom')}</code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StatusBadgeVisualTest;
