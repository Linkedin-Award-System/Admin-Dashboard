/**
 * Skeleton Component Examples
 * 
 * Demonstrates various use cases and configurations of the Skeleton component
 */

import { Skeleton } from './Skeleton';

/**
 * Example: Basic Skeleton Variants
 */
export function BasicSkeletonExample() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold mb-4">Basic Skeleton Variants</h3>
      
      {/* Text skeleton */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Text Variant</p>
        <Skeleton variant="text" width="200px" />
      </div>
      
      {/* Circular skeleton */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Circular Variant (Avatar)</p>
        <Skeleton variant="circular" width="48px" height="48px" />
      </div>
      
      {/* Rectangular skeleton */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Rectangular Variant (Card)</p>
        <Skeleton variant="rectangular" width="100%" height="200px" />
      </div>
    </div>
  );
}

/**
 * Example: Animation Types
 */
export function AnimationTypesExample() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold mb-4">Animation Types</h3>
      
      {/* Wave animation */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Wave Animation (Shimmer)</p>
        <Skeleton animation="wave" width="100%" height="100px" />
      </div>
      
      {/* Pulse animation */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Pulse Animation</p>
        <Skeleton animation="pulse" width="100%" height="100px" />
      </div>
    </div>
  );
}

/**
 * Example: Loading Metric Card
 */
export function MetricCardSkeletonExample() {
  return (
    <div className="p-8 border rounded-lg space-y-8">
      <div className="flex items-start justify-between">
        {/* Icon skeleton */}
        <Skeleton variant="circular" width="56px" height="56px" />
        
        {/* Trend indicator skeleton */}
        <Skeleton variant="rectangular" width="80px" height="28px" />
      </div>
      
      <div className="space-y-4">
        {/* Value skeleton */}
        <Skeleton variant="rectangular" width="75%" height="48px" />
        
        {/* Title skeleton */}
        <Skeleton variant="text" width="50%" />
      </div>
    </div>
  );
}

/**
 * Example: Loading Table Rows
 */
export function TableSkeletonExample() {
  return (
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
          {[1, 2, 3, 4].map((i) => (
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
  );
}

/**
 * Example: Loading Card List
 */
export function CardListSkeletonExample() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold mb-4">Loading Card List</h3>
      
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 border rounded-lg space-y-3">
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
  );
}

/**
 * Example: Loading Avatar with Text
 */
export function AvatarWithTextSkeletonExample() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Loading Avatar with Text</h3>
      
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="space-y-2">
          <Skeleton variant="text" width="120px" />
          <Skeleton variant="text" width="80px" />
        </div>
      </div>
    </div>
  );
}

/**
 * Example: Loading Chart
 */
export function ChartSkeletonExample() {
  return (
    <div className="p-6 border rounded-lg">
      <Skeleton variant="text" width="150px" className="mb-4" />
      <Skeleton variant="rectangular" width="100%" height="300px" />
    </div>
  );
}

/**
 * Example: Loading Form
 */
export function FormSkeletonExample() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold mb-4">Loading Form</h3>
      
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width="100px" />
          <Skeleton variant="rectangular" width="100%" height="40px" />
        </div>
      ))}
      
      <div className="flex gap-3 pt-4">
        <Skeleton variant="rectangular" width="120px" height="40px" />
        <Skeleton variant="rectangular" width="120px" height="40px" />
      </div>
    </div>
  );
}

/**
 * Example: Loading Dashboard
 */
export function DashboardSkeletonExample() {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold mb-4">Loading Dashboard</h3>
      
      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 border rounded-lg space-y-4">
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
      
      {/* Chart */}
      <div className="p-6 border rounded-lg">
        <Skeleton variant="text" width="150px" className="mb-4" />
        <Skeleton variant="rectangular" width="100%" height="300px" />
      </div>
    </div>
  );
}

/**
 * Example: Custom Dimensions
 */
export function CustomDimensionsExample() {
  return (
    <div className="space-y-4 p-6">
      <h3 className="text-lg font-semibold mb-4">Custom Dimensions</h3>
      
      {/* Using string values */}
      <div>
        <p className="text-sm text-gray-500 mb-2">String Values (300px x 150px)</p>
        <Skeleton width="300px" height="150px" />
      </div>
      
      {/* Using numeric values */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Numeric Values (400 x 200)</p>
        <Skeleton width={400} height={200} />
      </div>
      
      {/* Using percentage */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Percentage (100% x 250px)</p>
        <Skeleton width="100%" height="250px" />
      </div>
    </div>
  );
}
