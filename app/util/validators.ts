import { z } from 'zod';

// Shell types - only crustaceans
export const shellTypes = [
  'shrimp',
  'crab',
  'lobster',
  'prawn',
  'crayfish',
  'squid_pen',
] as const;

export type ShellType = typeof shellTypes[number];

// Restaurant registration validation
export const restaurantRegistrationSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  restaurant_name: z.string().min(2, 'Restaurant name is required'),
  address: z.string().min(5, 'Valid address is required'),
  contact_phone: z.string().optional(),
  storage_method: z.enum(['frozen', 'refrigerated', 'room_temp']),
  cleanliness_level: z.enum(['clean', 'sauce_covered', 'raw_only']),
  pickup_windows: z.record(z.string()).optional(),
});

// Lab registration validation
export const labRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  institution_name: z.string().min(2, 'Institution name is required'),
  dept: z.string().optional(),
  lab_name: z.string().optional(),
  address: z.string().min(5, 'Valid address is required'),
  contact_phone: z.string().optional(),
  extraction_frequency: z.enum(['weekly', 'biweekly', 'monthly']),
  max_pickup_radius_km: z.number().min(1).max(100),
  application: z.string().min(10, 'Please describe your application'),
});

// Supply stream validation
export const supplyStreamSchema = z.object({
  restaurant_id: z.string().uuid(),
  shell_type: z.enum(shellTypes),
  weekly_quantity_kg: z.number().min(0.1, 'Quantity must be at least 0.1 kg'),
  storage_method: z.enum(['frozen', 'refrigerated', 'room_temp']),
  cleanliness_level: z.enum(['clean', 'sauce_covered', 'raw_only']),
  pickup_window: z.string().optional(),
  notes: z.string().optional(),
});

// Demand stream validation
export const demandStreamSchema = z.object({
  lab_id: z.string().uuid(),
  shell_type_needed: z.enum(shellTypes),
  weekly_quantity_needed_kg: z.number().min(0.1, 'Quantity must be at least 0.1 kg'),
  extraction_frequency: z.enum(['weekly', 'biweekly', 'monthly']),
  max_pickup_radius_km: z.number().min(1).max(100),
  application: z.string().min(10, 'Please describe your application'),
  priority_level: z.enum(['low', 'medium', 'high']).optional().default('medium'),
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Type exports
export type RestaurantRegistration = z.infer<typeof restaurantRegistrationSchema>;
export type LabRegistration = z.infer<typeof labRegistrationSchema>;
export type SupplyStreamInput = z.infer<typeof supplyStreamSchema>;
export type DemandStreamInput = z.infer<typeof demandStreamSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
