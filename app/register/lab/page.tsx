'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputCard, { TextInput, Select, TextArea } from '../../components/InputCard';

export default function LabRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution_name: '',
    dept: '',
    lab_name: '',
    address: '',
    contact_phone: '',
    extraction_frequency: '',
    max_pickup_radius_km: '10',
    application: '',
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
          user_type: 'lab',
          max_pickup_radius_km: parseFloat(formData.max_pickup_radius_km),
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
      router.push('/dashboard/lab');
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
              Register as a Research Lab
            </h1>
            <p className="text-gray-600 mt-2">
              Join ShellCycle to access sustainable shell sources for your research
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
                placeholder="Dr. Jane Smith"
                required
              />
            </InputCard>

            <InputCard label="Email" required error={errors.email}>
              <TextInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane.smith@university.edu"
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

            <InputCard label="Institution Name" required error={errors.institution_name}>
              <TextInput
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="Massachusetts Institute of Technology"
                required
              />
            </InputCard>

            <InputCard label="Department" error={errors.dept}>
              <TextInput
                type="text"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                placeholder="Department of Materials Science"
              />
            </InputCard>

            <InputCard label="Lab Name" error={errors.lab_name}>
              <TextInput
                type="text"
                name="lab_name"
                value={formData.lab_name}
                onChange={handleChange}
                placeholder="Biomaterials Research Lab"
              />
            </InputCard>

            <InputCard label="Address" required error={errors.address}>
              <TextInput
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="77 Massachusetts Ave, Cambridge, MA 02139"
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

            <InputCard label="Extraction Frequency" required error={errors.extraction_frequency}>
              <Select
                name="extraction_frequency"
                value={formData.extraction_frequency}
                onChange={handleChange}
                options={[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'biweekly', label: 'Biweekly (every 2 weeks)' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
                required
              />
            </InputCard>

            <InputCard
              label="Max Pickup Radius (km)"
              required
              error={errors.max_pickup_radius_km}
            >
              <TextInput
                type="number"
                name="max_pickup_radius_km"
                value={formData.max_pickup_radius_km}
                onChange={handleChange}
                min="1"
                max="100"
                step="1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                How far are you willing to travel for pickup? (1-100 km)
              </p>
            </InputCard>

            <InputCard
              label="Research Application"
              required
              error={errors.application}
            >
              <TextArea
                name="application"
                value={formData.application}
                onChange={handleChange}
                placeholder="Describe how you'll use the shells (e.g., chitosan extraction for biodegradable medical implants)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 10 characters
              </p>
            </InputCard>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering...' : 'Register Lab'}
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
