/**
 * Skeleton Component Visual Tests
 * 
 * Visual test cases for manual verification of the Skeleton component
 * Open this file in Storybook or a test page to visually verify the component
 */

import { Skeleton } from './Skeleton';

/**
 * Visual Test: All Variants
 */
export function VisualTestAllVariants() {
  return (
    <div className="p-8 space-y-8 bg-white">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Skeleton Component - All Variants</h2>
        
        {/* Text Variant */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Text Variant</h3>
          <div className="space-y-2">
            <Skeleton variant="text" width="300px" />
            <Skeleton variant="text" width="250px" />
            <Skeleton variant="text" width="200px" />
          </div>
        </div>
        
        {/* Circular Variant */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Circular Variant</h3>
          <div className="flex gap-4">
            <Skeleton variant="circular" width="40px" height="40px" />
            <Skeleton variant="circular" width="56px" height="56px" />
            <Skeleton variant="circular" width="80px" height="80px" />
          </div>
        </div>
        
        {/* Rectangular Variant */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Rectangular Variant</h3>
          <div className="space-y-4">
            <Skeleton variant="rectangular" width="100%" height="100px" />
            <Skeleton variant="rectangular" width="80%" height="150px" />
            <Skeleton variant="rectangular" width="60%" height="200px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Visual Test: Animation Types
 */
export function VisualTestAnimations() {
  return (
    <div className="p-8 space-y-8 bg-white">
      <h2 className="text-2xl font-semibold mb-6">Animation Types</h2>
      
      {/* Wave Animation */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Wave Animation (Shimmer)</h3>
        <Skeleton animation="wave" width="100%" height="100px" />
      </div>
      
      {/* Pulse Animation */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Pulse Animation</h3>
        <Skeleton animation="pulse" width="100%" height="100px" />
      </div>
    </div>
  );
}

/**
 * Visual Test: Loading Metric Card
 */
export function VisualTestMetricCard() {
  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6">Loading Metric Card</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 border rounded-lg space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton variant="circular" width="48px" height="48px" />
              <Skeleton variant="rectangular" width="60px" height="24px" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="rectangular" width="70%" height="36px" />
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Visual Test: Loading Table
 */
export function VisualTestTable() {
  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-semibold mb-6">Loading Table</h2>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="150px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="180px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="rectangular" width="80px" height="24px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="120px" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Visual Test: Loading Card List
 */
export function VisualTestCardList() {
  return (
    <div className="p-8 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6">Loading Card List</h2>
      
      <div className="space-y-4 max-w-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 border rounded-lg space-y-3">
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width="40px" height="40px" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
            <Skeleton variant="rectangular" width="100%" height="100px" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Visual Test: Loading Dashboard
 */
export function VisualTestDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Loading Dashboard</h2>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 border rounded-lg space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton variant="circular" width="48px" height="48px" />
              <Skeleton variant="rectangular" width="60px" height="24px" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="rectangular" width="70%" height="36px" />
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-lg">
          <Skeleton variant="text" width="150px" className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height="300px" />
        </div>
        <div className="bg-white p-6 border rounded-lg">
          <Skeleton variant="text" width="150px" className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height="300px" />
        </div>
      </div>
    </div>
  );
}

/**
 * Visual Test: All Examples Combined
 */
export function VisualTestShowcase() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-12 text-center">Skeleton Component Showcase</h1>
        
        <div className="space-y-16">
          <VisualTestAllVariants />
          <VisualTestAnimations />
          <VisualTestMetricCard />
          <VisualTestTable />
          <VisualTestCardList />
        </div>
      </div>
    </div>
  );
}

export default VisualTestShowcase;
