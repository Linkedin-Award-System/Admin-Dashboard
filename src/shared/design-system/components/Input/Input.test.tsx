/**
 * Design System - Input Component Tests
 * 
 * Unit tests for the Input component
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Search, Eye } from 'lucide-react';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders basic input', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    const label = screen.getByText('Email');
    const input = screen.getByPlaceholderText('Enter email');
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<Input label="Password" error="Password is required" />);
    const error = screen.getByText('Password is required');
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass('text-red-500');
  });

  it('renders with helper text', () => {
    render(<Input label="Username" helperText="Choose a unique username" />);
    const helper = screen.getByText('Choose a unique username');
    expect(helper).toBeInTheDocument();
    expect(helper).toHaveClass('text-gray-500');
  });

  it('renders with left icon', () => {
    render(
      <Input 
        label="Search" 
        leftIcon={<Search data-testid="search-icon" />}
      />
    );
    const icon = screen.getByTestId('search-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(
      <Input 
        label="Password" 
        rightIcon={<Eye data-testid="eye-icon" />}
      />
    );
    const icon = screen.getByTestId('eye-icon');
    expect(icon).toBeInTheDocument();
  });

  it('applies error styles when error prop is provided', () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-2', 'border-red-500');
  });

  it('applies disabled styles when disabled', () => {
    render(<Input label="Email" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-gray-100', 'disabled:cursor-not-allowed');
  });

  it('has correct padding (12px)', () => {
    render(<Input placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('px-3', 'py-3'); // 12px padding
  });

  it('has correct border radius (8px)', () => {
    render(<Input placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('rounded-lg'); // 8px border radius
  });

  it('has correct font size (14px)', () => {
    render(<Input placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('text-sm'); // 14px font size
  });

  it('has 200ms transition', () => {
    render(<Input placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('transition-all', 'duration-200');
  });

  it('label has correct styling', () => {
    render(<Input label="Test Label" />);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('text-sm', 'font-medium', 'mb-2');
  });

  it('prioritizes error over helper text', () => {
    render(
      <Input 
        error="Error message" 
        helperText="Helper text" 
      />
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });
});
