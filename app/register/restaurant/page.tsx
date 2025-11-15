'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputCard, { TextInput, Select, TextArea } from '../../components/InputCard';

export default function RestaurantRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    restaurant_name: '',
    address: '',
    contact_phone: '',
    storage_method: '',
    cleanliness_level: '',
    pickup_windows: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_type: 'restaurant',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          throw new Error(data.message || 'Registration failed');
        }
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard/restaurant');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container-custom max-w-2xl">
        <div className="card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Register as a Restaurant
            </h1>
            <p className="text-gray-600 mt-2">
              Join ShellCycle to turn your shell waste into valuable resources
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputCard label="Contact Name" required error={errors.name}>
              <TextInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </InputCard>

            <InputCard label="Email" required error={errors.email}>
              <TextInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@restaurant.com"
                required
              />
            </InputCard>

            <InputCard label="Password" required error={errors.password}>
              <TextInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
              />
            </InputCard>

            <InputCard label="Restaurant Name" required error={errors.restaurant_name}>
              <TextInput
                type="text"
                name="restaurant_name"
                value={formData.restaurant_name}
                onChange={handleChange}
                placeholder="The Ocean Catch"
                required
              />
            </InputCard>

            <InputCard label="Address" required error={errors.address}>
              <TextInput
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Harbor St, Boston, MA 02110"
                required
              />
            </InputCard>

            <InputCard label="Contact Phone" error={errors.contact_phone}>
              <TextInput
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </InputCard>

            <InputCard label="Storage Method" required error={errors.storage_method}>
              <Select
                name="storage_method"
                value={formData.storage_method}
                onChange={handleChange}
                options={[
                  { value: 'frozen', label: 'Frozen' },
                  { value: 'refrigerated', label: 'Refrigerated' },
                  { value: 'room_temp', label: 'Room Temperature' },
                ]}
                required
              />
            </InputCard>

            <InputCard label="Cleanliness Level" required error={errors.cleanliness_level}>
              <Select
                name="cleanliness_level"
                value={formData.cleanliness_level}
                onChange={handleChange}
                options={[
                  { value: 'clean', label: 'Clean (pre-rinsed)' },
                  { value: 'sauce_covered', label: 'Sauce Covered' },
                  { value: 'raw_only', label: 'Raw Only (no sauce)' },
                ]}
                required
              />
            </InputCard>

            <InputCard
              label="Pickup Windows"
              error={errors.pickup_windows}
            >
              <TextArea
                name="pickup_windows"
                value={formData.pickup_windows}
                onChange={handleChange}
                placeholder="e.g., Monday-Friday 4pm-8pm"
              />
              <p className="text-sm text-gray-500 mt-1">
                When is the best time for shell pickup?
              </p>
            </InputCard>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering...' : 'Register Restaurant'}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-ocean-600 hover:text-ocean-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
