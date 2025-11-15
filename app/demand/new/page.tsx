'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShellTypeSelector from '../../components/ShellTypeSelector';
import InputCard, { TextInput, Select, TextArea } from '../../components/InputCard';
import { ShellType } from '../../util/validators';
import { getLabId } from '../../util/session';

export default function NewDemand() {
  const router = useRouter();
  const [selectedShellTypes, setSelectedShellTypes] = useState<ShellType[]>([]);
  const [formData, setFormData] = useState({
    weekly_quantity_needed_kg: '',
    extraction_frequency: '',
    max_pickup_radius_km: '10',
    application: '',
    priority_level: 'medium',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [labId, setLabId] = useState<string | null>(null);

  useEffect(() => {
    const id = getLabId();
    if (!id) {
      // Redirect to registration if not logged in as lab
      router.push('/register/lab');
    } else {
      setLabId(id);
    }
  }, [router]);

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

    // Validation
    const newErrors: Record<string, string> = {};
    if (selectedShellTypes.length === 0) {
      newErrors.shell_type_needed = 'Please select at least one shell type';
    }
    if (
      !formData.weekly_quantity_needed_kg ||
      parseFloat(formData.weekly_quantity_needed_kg) <= 0
    ) {
      newErrors.weekly_quantity_needed_kg = 'Please enter a valid quantity';
    }
    if (!formData.extraction_frequency) {
      newErrors.extraction_frequency = 'Please select extraction frequency';
    }
    if (formData.application.length < 10) {
      newErrors.application = 'Please describe your application (min 10 characters)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Create demand stream for each selected shell type
      const promises = selectedShellTypes.map((shellType) =>
        fetch('/api/demand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab_id: labId,
            shell_type_needed: shellType,
            weekly_quantity_needed_kg: parseFloat(formData.weekly_quantity_needed_kg),
            extraction_frequency: formData.extraction_frequency,
            max_pickup_radius_km: parseFloat(formData.max_pickup_radius_km),
            application: formData.application,
            priority_level: formData.priority_level,
          }),
        })
      );

      const responses = await Promise.all(promises);
      const allSuccessful = responses.every((r) => r.ok);

      if (!allSuccessful) {
        throw new Error('Failed to create some demand streams');
      }

      // Success - redirect to dashboard
      router.push('/dashboard/lab');
    } catch (error) {
      console.error('Error creating demand stream:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <div className="card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Add Demand Request
            </h1>
            <p className="text-gray-600 mt-2">
              Tell us about the shells you need for your research
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <ShellTypeSelector
                selectedTypes={selectedShellTypes}
                onChange={setSelectedShellTypes}
                mode="single"
              />
              {errors.shell_type_needed && (
                <p className="text-sm text-red-600">{errors.shell_type_needed}</p>
              )}
            </div>

            <InputCard
              label="Weekly Quantity Needed (kg)"
              required
              error={errors.weekly_quantity_needed_kg}
            >
              <TextInput
                type="number"
                name="weekly_quantity_needed_kg"
                value={formData.weekly_quantity_needed_kg}
                onChange={handleChange}
                placeholder="15.0"
                min="0.1"
                step="0.1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                How many kilograms do you need per week?
              </p>
            </InputCard>

            <InputCard
              label="Extraction Frequency"
              required
              error={errors.extraction_frequency}
            >
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
              <p className="text-sm text-gray-500 mt-1">
                How often do you perform extractions?
              </p>
            </InputCard>

            <InputCard
              label="Maximum Pickup Radius (km)"
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
              label="Priority Level"
              error={errors.priority_level}
            >
              <Select
                name="priority_level"
                value={formData.priority_level}
                onChange={handleChange}
                options={[
                  { value: 'low', label: 'Low - Flexible timeline' },
                  { value: 'medium', label: 'Medium - Regular need' },
                  { value: 'high', label: 'High - Urgent research' },
                ]}
              />
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

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 btn btn-secondary py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Demand Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
