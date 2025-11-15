'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InputCard, { TextInput } from '../components/InputCard';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || 'Login failed' });
        }
        return;
      }

      // Success - redirect to appropriate dashboard based on user type
      if (data.user.userType === 'restaurant') {
        router.push('/dashboard/restaurant');
      } else if (data.user.userType === 'lab') {
        router.push('/dashboard/lab');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container-custom max-w-md">
        <div className="card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
            <p className="text-gray-600 mt-2">
              Sign in to your ShellCycle account
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p className="font-medium">Restaurant:</p>
              <p className="ml-4">Email: manager@legalseafoods.com</p>
              <p className="ml-4">Password: password123</p>
              <p className="font-medium mt-2">Lab:</p>
              <p className="ml-4">Email: s.chen@mit.edu</p>
              <p className="ml-4">Password: password123</p>
            </div>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputCard title="Account Information">
              <TextInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email?.[0]}
              />

              <TextInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password?.[0]}
              />
            </InputCard>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center space-y-2">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/register/restaurant"
                  className="text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  Sign up as a Restaurant
                </Link>
                {' or '}
                <Link
                  href="/register/lab"
                  className="text-ocean-600 hover:text-ocean-700 font-medium"
                >
                  Sign up as a Lab
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
