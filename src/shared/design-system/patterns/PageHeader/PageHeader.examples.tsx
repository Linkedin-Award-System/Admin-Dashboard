/**
 * Design System - PageHeader Component Examples
 * 
 * Usage examples for the PageHeader pattern component
 */

import { PageHeader } from './PageHeader';
import { Button } from '../../components/Button';
import { Plus, Download, Save } from 'lucide-react';

/**
 * Example 1: Basic page header with title only
 */
export function BasicPageHeader() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader title="Dashboard" />
      <div className="text-sm text-gray-500">
        Page content goes here...
      </div>
    </div>
  );
}

/**
 * Example 2: Page header with subtitle
 */
export function PageHeaderWithSubtitle() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's an overview of your awards program."
      />
      <div className="text-sm text-gray-500">
        Page content goes here...
      </div>
    </div>
  );
}

/**
 * Example 3: Page header with single action button
 */
export function PageHeaderWithAction() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Categories" 
        subtitle="Manage award categories"
        actions={
          <Button icon={<Plus className="h-4 w-4" />}>
            Create Category
          </Button>
        }
      />
      <div className="text-sm text-gray-500">
        Page content goes here...
      </div>
    </div>
  );
}

/**
 * Example 4: Page header with multiple action buttons
 */
export function PageHeaderWithMultipleActions() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Nominees"
        subtitle="Manage award nominees"
        actions={
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              icon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
            <Button icon={<Plus className="h-4 w-4" />}>
              Add Nominee
            </Button>
          </div>
        }
      />
      <div className="text-sm text-gray-500">
        Page content goes here...
      </div>
    </div>
  );
}

/**
 * Example 5: Page header with breadcrumbs
 */
export function PageHeaderWithBreadcrumbs() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Edit Category"
        subtitle="Update category details"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: 'Edit' }
        ]}
        actions={
          <Button icon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        }
      />
      <div className="text-sm text-gray-500">
        Page content goes here...
      </div>
    </div>
  );
}

/**
 * Example 6: Complete page header with all features
 */
export function CompletePageHeader() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Nominees"
        subtitle="Manage award nominees and their submissions"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Nominees' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              icon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
            <Button icon={<Plus className="h-4 w-4" />}>
              Add Nominee
            </Button>
          </div>
        }
      />
      <div className="text-sm text-gray-500">
        Page content goes here...
      </div>
    </div>
  );
}

/**
 * Example 7: Dashboard page header
 */
export function DashboardPageHeader() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's an overview of your awards program."
      />
      <div className="text-sm text-gray-500">
        Metrics and charts would go here...
      </div>
    </div>
  );
}

/**
 * Example 8: Voting page header
 */
export function VotingPageHeader() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Voting Analytics" 
        subtitle="Track voting activity and trends"
        actions={
          <Button 
            variant="secondary" 
            icon={<Download className="h-4 w-4" />}
          >
            Export Report
          </Button>
        }
      />
      <div className="text-sm text-gray-500">
        Voting data and charts would go here...
      </div>
    </div>
  );
}

/**
 * Example 9: Payments page header
 */
export function PaymentsPageHeader() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Payments" 
        subtitle="View payment transactions and revenue"
        actions={
          <Button 
            variant="secondary" 
            icon={<Download className="h-4 w-4" />}
          >
            Export Transactions
          </Button>
        }
      />
      <div className="text-sm text-gray-500">
        Payment data would go here...
      </div>
    </div>
  );
}

/**
 * Example 10: Content page header
 */
export function ContentPageHeader() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Content Management" 
        subtitle="Edit website content and images"
        actions={
          <Button icon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        }
      />
      <div className="text-sm text-gray-500">
        Content editor would go here...
      </div>
    </div>
  );
}

/**
 * Example 11: Responsive behavior demonstration
 */
export function ResponsivePageHeader() {
  return (
    <div className="p-8 bg-gray-50">
      <div className="mb-4 text-sm text-gray-600">
        Resize your browser to see responsive behavior:
        <ul className="list-disc ml-6 mt-2">
          <li>Desktop (≥ 640px): Actions aligned to right</li>
          <li>Mobile (&lt; 640px): Actions stack below title</li>
        </ul>
      </div>
      <PageHeader 
        title="Responsive Example"
        subtitle="This header adapts to different screen sizes"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button>Save</Button>
          </div>
        }
      />
      <div className="text-sm text-gray-500">
        Page content goes here...
      </div>
    </div>
  );
}

/**
 * Example 12: Custom styling
 */
export function CustomStyledPageHeader() {
  return (
    <div className="p-8 bg-gray-50">
      <PageHeader 
        title="Custom Styled Header"
        subtitle="With additional custom classes"
        className="border-b-2 border-primary-500 pb-4"
        actions={<Button>Action</Button>}
      />
      <div className="text-sm text-gray-500">
        Page content goes here...
      </div>
    </div>
  );
}

/**
 * All examples in one component for Storybook or documentation
 */
export function AllPageHeaderExamples() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-semibold mb-4">1. Basic Page Header</h2>
        <BasicPageHeader />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">2. With Subtitle</h2>
        <PageHeaderWithSubtitle />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">3. With Single Action</h2>
        <PageHeaderWithAction />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">4. With Multiple Actions</h2>
        <PageHeaderWithMultipleActions />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">5. With Breadcrumbs</h2>
        <PageHeaderWithBreadcrumbs />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">6. Complete Example</h2>
        <CompletePageHeader />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">7. Dashboard Page</h2>
        <DashboardPageHeader />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">8. Voting Page</h2>
        <VotingPageHeader />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">9. Payments Page</h2>
        <PaymentsPageHeader />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">10. Content Page</h2>
        <ContentPageHeader />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">11. Responsive Behavior</h2>
        <ResponsivePageHeader />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">12. Custom Styling</h2>
        <CustomStyledPageHeader />
      </div>
    </div>
  );
}
