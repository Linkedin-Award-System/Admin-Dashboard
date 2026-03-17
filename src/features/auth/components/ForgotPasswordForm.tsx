import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth-service';
import { Button } from '@/shared/components/ui/button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (sent) {
    return (
      <div className="w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>
        <h2 className="text-2xl text-gray-900 mb-2" style={{ fontWeight: 500 }}>Check your email</h2>
        <p className="text-gray-600 mb-6">
          If an account exists for that email, we've sent a password reset link.
        </p>
        <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700" style={{ fontWeight: 500 }}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl text-gray-900" style={{ fontWeight: 500 }}>Forgot password?</h2>
        <p className="text-gray-600 mt-2">Enter your email and we'll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 500 }}>
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3" role="alert">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full text-white py-3 rounded-lg transition-colors shadow-sm"
          style={{ backgroundColor: '#085299', fontWeight: 500 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700" style={{ fontWeight: 500 }}>
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
