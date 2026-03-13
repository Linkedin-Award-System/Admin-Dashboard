/**
 * Design System - Card Visual Test Page
 * 
 * Visual testing page for the Card component
 * Run the dev server and navigate to this component to see all variants
 */

import { AllCardExamples } from './Card.examples';

/**
 * Visual test page component
 * 
 * This component can be imported and rendered in a test page
 * to visually verify all Card variants and use cases
 */
export function CardVisualTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Card Component Visual Test
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive visual examples of the Card component
          </p>
        </div>
        
        <AllCardExamples />
      </div>
    </div>
  );
}

export default CardVisualTest;
