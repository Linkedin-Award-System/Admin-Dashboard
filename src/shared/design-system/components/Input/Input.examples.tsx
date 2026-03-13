/**
 * Design System - Input Component Examples
 * 
 * Visual examples demonstrating all Input component features
 * This file can be used for visual testing and documentation
 */

import { Search, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Input } from './Input';

export function InputExamples() {
  return (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Input Component Examples</h1>
        <p className="text-gray-600">
          Comprehensive examples of the Input component with all features
        </p>
      </div>

      {/* Basic Input */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Basic Input</h2>
        <Input 
          label="Email" 
          type="email" 
          placeholder="Enter your email" 
        />
      </section>

      {/* Input with Error */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Input with Error</h2>
        <Input 
          label="Password" 
          type="password" 
          error="Password must be at least 8 characters" 
        />
      </section>

      {/* Input with Helper Text */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Input with Helper Text</h2>
        <Input 
          label="Username" 
          placeholder="Choose a username"
          helperText="Must be 3-20 characters long" 
        />
      </section>

      {/* Input with Left Icon */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Input with Left Icon</h2>
        <Input 
          label="Search" 
          leftIcon={<Search className="h-4 w-4" />}
          placeholder="Search..." 
        />
        <Input 
          label="Email" 
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="your@email.com" 
        />
      </section>

      {/* Input with Right Icon */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Input with Right Icon</h2>
        <Input 
          label="Password" 
          type="password"
          rightIcon={<Eye className="h-4 w-4" />}
          placeholder="Enter password"
        />
      </section>

      {/* Disabled Input */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Disabled Input</h2>
        <Input 
          label="Email" 
          value="user@example.com"
          disabled 
        />
      </section>

      {/* Form Example */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Complete Form Example</h2>
        <div className="space-y-4 p-6 border border-gray-200 rounded-lg">
          <Input 
            label="Full Name" 
            leftIcon={<User className="h-4 w-4" />}
            placeholder="John Doe"
          />
          <Input 
            label="Email Address" 
            type="email"
            leftIcon={<Mail className="h-4 w-4" />}
            placeholder="john@example.com"
            helperText="We'll never share your email"
          />
          <Input 
            label="Password" 
            type="password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={<EyeOff className="h-4 w-4" />}
            placeholder="Enter password"
            helperText="Must be at least 8 characters"
          />
        </div>
      </section>

      {/* States Comparison */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">All States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Default State" 
            placeholder="Default input"
          />
          <Input 
            label="With Value" 
            value="Some text"
          />
          <Input 
            label="Error State" 
            error="This field is required"
          />
          <Input 
            label="Disabled State" 
            value="Disabled"
            disabled
          />
        </div>
      </section>
    </div>
  );
}
