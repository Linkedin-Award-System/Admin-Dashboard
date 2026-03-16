/**
 * Design System - PageHeader Component Tests
 * 
 * Unit tests for PageHeader pattern component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  describe('Basic Rendering', () => {
    it('renders title correctly', () => {
      render(<PageHeader title="Test Page" />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Test Page');
    });

    it('applies correct title styling', () => {
      render(<PageHeader title="Test Page" />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('text-2xl'); // 24px
      expect(title).toHaveClass('font-semibold'); // semibold weight
      expect(title).toHaveClass('text-gray-900'); // #111827
    });

    it('applies 32px bottom margin to container', () => {
      const { container } = render(<PageHeader title="Test Page" />);
      
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('mb-8'); // 32px (8 * 4 = 32px in Tailwind)
    });
  });

  describe('Subtitle', () => {
    it('renders subtitle when provided', () => {
      render(
        <PageHeader 
          title="Test Page" 
          subtitle="This is a test subtitle"
        />
      );
      
      expect(screen.getByText('This is a test subtitle')).toBeInTheDocument();
    });

    it('applies correct subtitle styling', () => {
      render(
        <PageHeader 
          title="Test Page" 
          subtitle="Test subtitle"
        />
      );
      
      const subtitle = screen.getByText('Test subtitle');
      expect(subtitle).toHaveClass('text-sm'); // 14px
      expect(subtitle).toHaveClass('text-gray-500'); // #6b7280
      expect(subtitle).toHaveClass('mt-2'); // 8px top margin
    });

    it('does not render subtitle when not provided', () => {
      const { container } = render(<PageHeader title="Test Page" />);
      
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(0);
    });
  });

  describe('Actions', () => {
    it('renders actions when provided', () => {
      render(
        <PageHeader 
          title="Test Page" 
          actions={<button>Create</button>}
        />
      );
      
      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    it('does not render actions container when not provided', () => {
      const { container } = render(<PageHeader title="Test Page" />);
      
      const actionsContainer = container.querySelector('.flex-shrink-0');
      expect(actionsContainer).not.toBeInTheDocument();
    });

    it('renders multiple actions', () => {
      render(
        <PageHeader 
          title="Test Page" 
          actions={
            <div>
              <button>Export</button>
              <button>Create</button>
            </div>
          }
        />
      );
      
      expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });
  });

  describe('Breadcrumbs', () => {
    it('renders breadcrumbs when provided', () => {
      render(
        <PageHeader 
          title="Test Page"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            { label: 'Edit' }
          ]}
        />
      );
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('renders breadcrumb links with href', () => {
      render(
        <PageHeader 
          title="Test Page"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Current' }
          ]}
        />
      );
      
      const homeLink = screen.getByText('Home');
      expect(homeLink.tagName).toBe('A');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders breadcrumb without href as plain text', () => {
      render(
        <PageHeader 
          title="Test Page"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Current' }
          ]}
        />
      );
      
      const currentCrumb = screen.getByText('Current');
      expect(currentCrumb.tagName).toBe('SPAN');
      expect(currentCrumb).not.toHaveAttribute('href');
    });

    it('does not render breadcrumbs when not provided', () => {
      const { container } = render(<PageHeader title="Test Page" />);
      
      const nav = container.querySelector('nav');
      expect(nav).not.toBeInTheDocument();
    });

    it('does not render breadcrumbs when empty array', () => {
      const { container } = render(
        <PageHeader title="Test Page" breadcrumbs={[]} />
      );
      
      const nav = container.querySelector('nav');
      expect(nav).not.toBeInTheDocument();
    });

    it('renders breadcrumb separators', () => {
      const { container } = render(
        <PageHeader 
          title="Test Page"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            { label: 'Edit' }
          ]}
        />
      );
      
      const separators = container.querySelectorAll('.mx-2');
      expect(separators).toHaveLength(2); // 3 items = 2 separators
    });
  });

  describe('Responsive Layout', () => {
    it('applies responsive flex classes for mobile/desktop layout', () => {
      const { container } = render(
        <PageHeader 
          title="Test Page" 
          actions={<button>Create</button>}
        />
      );
      
      const headerContent = container.querySelector('.flex');
      expect(headerContent).toHaveClass('flex-col'); // Stack on mobile
      expect(headerContent).toHaveClass('sm:flex-row'); // Row on desktop
      expect(headerContent).toHaveClass('sm:items-start');
      expect(headerContent).toHaveClass('sm:justify-between');
    });
  });

  describe('Custom Props', () => {
    it('accepts and applies custom className', () => {
      const { container } = render(
        <PageHeader 
          title="Test Page" 
          className="custom-class"
        />
      );
      
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('custom-class');
      expect(header).toHaveClass('mb-8'); // Still has default classes
    });

    it('forwards additional HTML attributes', () => {
      const { container } = render(
        <PageHeader 
          title="Test Page" 
          data-testid="page-header"
          aria-label="Page header"
        />
      );
      
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveAttribute('data-testid', 'page-header');
      expect(header).toHaveAttribute('aria-label', 'Page header');
    });
  });

  describe('Complete Example', () => {
    it('renders all elements together correctly', () => {
      render(
        <PageHeader 
          title="Nominees"
          subtitle="Manage award nominees"
          actions={
            <div>
              <button>Export</button>
              <button>Add Nominee</button>
            </div>
          }
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Nominees' }
          ]}
        />
      );
      
      // Title
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nominees');
      
      // Subtitle
      expect(screen.getByText('Manage award nominees')).toBeInTheDocument();
      
      // Actions
      expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Nominee' })).toBeInTheDocument();
      
      // Breadcrumbs
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getAllByText('Nominees')).toHaveLength(2); // Once in breadcrumb, once in title
    });
  });
});
