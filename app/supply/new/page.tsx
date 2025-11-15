'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShellTypeSelector from '../../components/ShellTypeSelector';
import InputCard, { TextInput, Select, TextArea } from '../../components/InputCard';
import { ShellType } from '../../util/validators';
import { getRestaurantId } from '../../util/session';

export default function NewSupply() {
  const router = useRouter();
  const [selectedShellTypes, setSelectedShellTypes] = useState<ShellType[]>([]);
  const [formData, setFormData] = useState({
    weekly_quantity_kg: '',
    storage_method: '',
    cleanliness_level: '',
    pickup_window: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const id = getRestaurantId();
    if (!id) {
      // Redirect to registration if not logged in as restaurant
      router.push('/register/restaurant');
    } else {
      setRestaurantId(id);
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
      newErrors.shell_type = 'Please select at least one shell type';
    }
    if (!formData.weekly_quantity_kg || parseFloat(formData.weekly_quantity_kg) <= 0) {
      newErrors.weekly_quantity_kg = 'Please enter a valid quantity';
    }
    if (!formData.storage_method) {
      newErrors.storage_method = 'Please select a storage method';
    }
    if (!formData.cleanliness_level) {
      newErrors.cleanliness_level = 'Please select a cleanliness level';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Create supply stream for each selected shell type
      const promises = selectedShellTypes.map((shellType) =>
        fetch('/api/supply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            shell_type: shellType,
            weekly_quantity_kg: parseFloat(formData.weekly_quantity_kg),
            storage_method: formData.storage_method,
            cleanliness_level: formData.cleanliness_level,
            pickup_window: formData.pickup_window || null,
            notes: formData.notes || null,
          }),
        })
      );

      const responses = await Promise.all(promises);
      const allSuccessful = responses.every((r) => r.ok);

      if (!allSuccessful) {
        throw new Error('Failed to create some supply streams');
      }

      // Success - redirect to dashboard
      router.push('/dashboard/restaurant');
    } catch (error) {
      console.error('Error creating supply stream:', error);
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
              Add Supply Listing
            </h1>
            <p className="text-gray-600 mt-2">
              Tell us about the shells you have available
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
              {errors.shell_type && (
                <p className="text-sm text-red-600">{errors.shell_type}</p>
              )}
            </div>

            <InputCard
              label="Weekly Quantity (kg)"
              required
              error={errors.weekly_quantity_kg}
            >
              <TextInput
                type="number"
                name="weekly_quantity_kg"
                value={formData.weekly_quantity_kg}
                onChange={handleChange}
                placeholder="10.5"
                min="0.1"
                step="0.1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Average kilograms per week
              </p>
            </InputCard>

            <InputCard
              label="Storage Method"
              required
              error={errors.storage_method}
            >
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

            <InputCard
              label="Cleanliness Level"
              required
              error={errors.cleanliness_level}
            >
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
              label="Pickup Window"
              error={errors.pickup_window}
            >
              <TextInput
                type="text"
                name="pickup_window"
                value={formData.pickup_window}
                onChange={handleChange}
                placeholder="Mon-Fri 4pm-8pm"
              />
              <p className="text-sm text-gray-500 mt-1">
                When can shells be picked up?
              </p>
            </InputCard>

            <InputCard label="Notes" error={errors.notes}>
              <TextArea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information about your shell supply..."
              />
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
                {isLoading ? 'Creating...' : 'Create Supply Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
