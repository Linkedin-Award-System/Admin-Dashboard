/**
 * Design System - Card Component Tests
 * 
 * Unit tests for the Card component
 * Tests basic rendering, variants, padding options, and hoverable state
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './Card';

describe('Card', () => {
  describe('Basic Rendering', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('should forward ref to div element', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Card ref={ref}>Card</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('should render default variant by default', () => {
      const { container } = render(<Card>Default</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border', 'border-gray-200');
    });

    it('should render elevated variant', () => {
      const { container } = render(<Card variant="elevated">Elevated</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-md');
    });

    it('should render outlined variant', () => {
      const { container } = render(<Card variant="outlined">Outlined</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border-2', 'border-gray-300');
    });
  });

  describe('Padding Options', () => {
    it('should render medium padding by default', () => {
      const { container } = render(<Card>Medium</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-5'); // 20px
    });

    it('should render no padding', () => {
      const { container } = render(<Card padding="none">None</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-0');
    });

    it('should render small padding', () => {
      const { container } = render(<Card padding="sm">Small</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-3'); // 12px
    });

    it('should render large padding', () => {
      const { container } = render(<Card padding="lg">Large</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-8'); // 32px
    });
  });

  describe('Hoverable State', () => {
    it('should not be hoverable by default', () => {
      const { container } = render(<Card>Normal</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('cursor-pointer');
      expect(card).not.toHaveClass('hover:shadow-lg');
    });

    it('should apply hoverable classes when hoverable is true', () => {
      const { container } = render(<Card hoverable>Hoverable</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('cursor-pointer', 'hover:shadow-lg');
    });
  });

  describe('Styling', () => {
    it('should have base styling classes', () => {
      const { container } = render(<Card>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-lg', 'bg-white', 'transition-shadow', 'duration-300');
    });

    it('should have 8px border radius', () => {
      const { container } = render(<Card>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-lg');
    });

    it('should have 300ms transition duration', () => {
      const { container } = render(<Card>Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('duration-300');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };

      const { container } = render(<Card onClick={handleClick}>Click me</Card>);
      const card = container.firstChild as HTMLElement;
      await user.click(card);

      expect(clicked).toBe(true);
    });

    it('should support all standard div props', () => {
      const { container } = render(
        <Card data-testid="test-card" aria-label="Test card">
          Card
        </Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('data-testid', 'test-card');
      expect(card).toHaveAttribute('aria-label', 'Test card');
    });
  });

  describe('Sub-components', () => {
    describe('CardHeader', () => {
      it('should render CardHeader', () => {
        render(
          <Card>
            <CardHeader>Header content</CardHeader>
          </Card>
        );
        expect(screen.getByText('Header content')).toBeInTheDocument();
      });

      it('should apply flex column layout', () => {
        const { container } = render(<CardHeader>Header</CardHeader>);
        const header = container.firstChild as HTMLElement;
        expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5');
      });
    });

    describe('CardTitle', () => {
      it('should render CardTitle', () => {
        render(
          <Card>
            <CardTitle>Title</CardTitle>
          </Card>
        );
        expect(screen.getByText('Title')).toBeInTheDocument();
      });

      it('should apply title styling', () => {
        const { container } = render(<CardTitle>Title</CardTitle>);
        const title = container.firstChild as HTMLElement;
        expect(title).toHaveClass('text-lg', 'font-medium', 'leading-none', 'tracking-tight');
      });
    });

    describe('CardDescription', () => {
      it('should render CardDescription', () => {
        render(
          <Card>
            <CardDescription>Description</CardDescription>
          </Card>
        );
        expect(screen.getByText('Description')).toBeInTheDocument();
      });

      it('should apply description styling', () => {
        const { container } = render(<CardDescription>Description</CardDescription>);
        const description = container.firstChild as HTMLElement;
        expect(description).toHaveClass('text-sm', 'text-gray-500');
      });
    });

    describe('CardContent', () => {
      it('should render CardContent', () => {
        render(
          <Card>
            <CardContent>Content</CardContent>
          </Card>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      it('should apply content styling', () => {
        const { container } = render(<CardContent>Content</CardContent>);
        const content = container.firstChild as HTMLElement;
        expect(content).toHaveClass('pt-0');
      });
    });

    describe('CardFooter', () => {
      it('should render CardFooter', () => {
        render(
          <Card>
            <CardFooter>Footer</CardFooter>
          </Card>
        );
        expect(screen.getByText('Footer')).toBeInTheDocument();
      });

      it('should apply footer styling', () => {
        const { container } = render(<CardFooter>Footer</CardFooter>);
        const footer = container.firstChild as HTMLElement;
        expect(footer).toHaveClass('flex', 'items-center', 'pt-0');
      });
    });
  });

  describe('Composite Structure', () => {
    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    });

    it('should work with elevated variant and hoverable', () => {
      const { container } = render(
        <Card variant="elevated" hoverable>
          <CardHeader>
            <CardTitle>Elevated Hoverable Card</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-md', 'cursor-pointer', 'hover:shadow-lg');
    });
  });
});
