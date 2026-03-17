/**
 * Design System - Card Component Examples
 * 
 * Visual examples demonstrating different Card variants and use cases
 */

import { Users, TrendingUp, DollarSign, Award } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './Card';
import { Button } from '../Button';

/**
 * Basic Card Examples
 */
export function BasicCardExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Basic Card Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Default Card */}
        <Card>
          <h3 className="text-lg font-medium mb-2">Default Card</h3>
          <p className="text-sm text-gray-500">
            Standard card with border and default padding (20px)
          </p>
        </Card>

        {/* Elevated Card */}
        <Card variant="elevated">
          <h3 className="text-lg font-medium mb-2">Elevated Card</h3>
          <p className="text-sm text-gray-500">
            Card with shadow elevation for visual depth
          </p>
        </Card>

        {/* Outlined Card */}
        <Card variant="outlined">
          <h3 className="text-lg font-medium mb-2">Outlined Card</h3>
          <p className="text-sm text-gray-500">
            Card with emphasized 2px border
          </p>
        </Card>
      </div>
    </div>
  );
}

/**
 * Padding Options Examples
 */
export function PaddingExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Padding Options</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding="none">
          <div className="bg-blue-100 p-4">
            <h3 className="text-lg font-medium">No Padding</h3>
            <p className="text-sm text-gray-600">
              Useful for full-width images or custom layouts
            </p>
          </div>
        </Card>

        <Card padding="sm">
          <h3 className="text-lg font-medium mb-2">Small Padding (12px)</h3>
          <p className="text-sm text-gray-500">Compact card layout</p>
        </Card>

        <Card padding="md">
          <h3 className="text-lg font-medium mb-2">Medium Padding (20px)</h3>
          <p className="text-sm text-gray-500">Default padding size</p>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-medium mb-2">Large Padding (32px)</h3>
          <p className="text-sm text-gray-500">Spacious card layout</p>
        </Card>
      </div>
    </div>
  );
}

/**
 * Hoverable Card Examples
 */
export function HoverableExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Hoverable Cards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hoverable onClick={() => alert('Card 1 clicked')}>
          <h3 className="text-lg font-medium mb-2">Clickable Card 1</h3>
          <p className="text-sm text-gray-500">
            Hover to see shadow increase effect
          </p>
        </Card>

        <Card variant="elevated" hoverable onClick={() => alert('Card 2 clicked')}>
          <h3 className="text-lg font-medium mb-2">Clickable Card 2</h3>
          <p className="text-sm text-gray-500">
            Elevated variant with hover effect
          </p>
        </Card>

        <Card variant="outlined" hoverable onClick={() => alert('Card 3 clicked')}>
          <h3 className="text-lg font-medium mb-2">Clickable Card 3</h3>
          <p className="text-sm text-gray-500">
            Outlined variant with hover effect
          </p>
        </Card>
      </div>
    </div>
  );
}

/**
 * Metric Card Examples
 */
export function MetricCardExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Metric Card Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="elevated" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">
                Total Users
              </p>
              <p className="text-3xl font-semibold text-gray-900">1,234</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </Card>

        <Card variant="elevated" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">
                Revenue
              </p>
              <p className="text-3xl font-semibold text-gray-900">ETB 45.2K</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">8%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </Card>

        <Card variant="elevated" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">
                Nominees
              </p>
              <p className="text-3xl font-semibold text-gray-900">89</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">5%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </Card>

        <Card variant="elevated" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">
                Categories
              </p>
              <p className="text-3xl font-semibold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * Composite Structure Examples
 */
export function CompositeStructureExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Composite Structure Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Article Title</CardTitle>
            <CardDescription>Published on January 1, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This is an example of a card with a complete structure including
              header, title, description, content, and footer sections.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="sm">Read More</Button>
          </CardFooter>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Active since 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">user@example.com</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Role:</span>
                <span className="font-medium">Administrator</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="primary" size="sm">Edit</Button>
            <Button variant="secondary" size="sm">View</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

/**
 * Image Card Examples
 */
export function ImageCardExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold">Image Card Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="none" hoverable>
          <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg" />
          <div className="p-5">
            <h3 className="text-lg font-medium mb-2">Image Card 1</h3>
            <p className="text-sm text-gray-500">
              Card with no padding for full-width image
            </p>
          </div>
        </Card>

        <Card padding="none" hoverable>
          <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-t-lg" />
          <div className="p-5">
            <h3 className="text-lg font-medium mb-2">Image Card 2</h3>
            <p className="text-sm text-gray-500">
              Hover to see the shadow effect
            </p>
          </div>
        </Card>

        <Card padding="none" hoverable>
          <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-lg" />
          <div className="p-5">
            <h3 className="text-lg font-medium mb-2">Image Card 3</h3>
            <p className="text-sm text-gray-500">
              Perfect for galleries and portfolios
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * All Examples Combined
 */
export function AllCardExamples() {
  return (
    <div className="space-y-12 bg-gray-50 min-h-screen">
      <BasicCardExamples />
      <PaddingExamples />
      <HoverableExamples />
      <MetricCardExamples />
      <CompositeStructureExamples />
      <ImageCardExamples />
    </div>
  );
}
