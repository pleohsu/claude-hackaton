/**
 * Mock data for seeding the ShellCycle database
 * Includes realistic restaurants and labs in the Boston area
 */

import { ShellType } from './validators';

export interface MockUser {
  name: string;
  email: string;
  password: string; // Plain text, will be hashed when inserted
  user_type: 'restaurant' | 'lab';
}

export interface MockRestaurant {
  email: string; // Links to user
  restaurant_name: string;
  address: string;
  contact_phone: string;
  storage_method: 'frozen' | 'refrigerated' | 'room_temp';
  cleanliness_level: 'clean' | 'sauce_covered' | 'raw_only';
  pickup_windows: string;
}

export interface MockLab {
  email: string; // Links to user
  institution_name: string;
  dept: string;
  lab_name: string;
  address: string;
  contact_phone: string;
  extraction_frequency: 'weekly' | 'biweekly' | 'monthly';
  max_pickup_radius_km: number;
  application: string;
}

export interface MockSupplyStream {
  restaurant_email: string; // Links to restaurant
  shell_type: ShellType;
  weekly_quantity_kg: number;
  storage_method: 'frozen' | 'refrigerated' | 'room_temp';
  cleanliness_level: 'clean' | 'sauce_covered' | 'raw_only';
  pickup_window: string;
  notes: string;
}

export interface MockDemandStream {
  lab_email: string; // Links to lab
  shell_type_needed: ShellType;
  weekly_quantity_needed_kg: number;
  extraction_frequency: 'weekly' | 'biweekly' | 'monthly';
  max_pickup_radius_km: number;
  application: string;
  priority_level: 'low' | 'medium' | 'high';
}

// Mock Users (Restaurants)
export const mockRestaurantUsers: MockUser[] = [
  {
    name: 'Legal Sea Foods',
    email: 'manager@legalseafoods.com',
    password: 'password123',
    user_type: 'restaurant',
  },
  {
    name: 'Neptune Oyster',
    email: 'chef@neptuneoyster.com',
    password: 'password123',
    user_type: 'restaurant',
  },
  {
    name: 'Island Creek Oyster Bar',
    email: 'operations@islandcreek.com',
    password: 'password123',
    user_type: 'restaurant',
  },
  {
    name: 'The Barking Crab',
    email: 'manager@barkingcrab.com',
    password: 'password123',
    user_type: 'restaurant',
  },
  {
    name: 'Atlantic Fish Company',
    email: 'admin@atlanticfishco.com',
    password: 'password123',
    user_type: 'restaurant',
  },
  {
    name: 'Row 34',
    email: 'kitchen@row34.com',
    password: 'password123',
    user_type: 'restaurant',
  },
  {
    name: 'Summer Shack',
    email: 'contact@summershack.com',
    password: 'password123',
    user_type: 'restaurant',
  },
  {
    name: 'Boston Lobster Feast',
    email: 'info@bostonlobsterfeast.com',
    password: 'password123',
    user_type: 'restaurant',
  },
];

// Mock Users (Labs)
export const mockLabUsers: MockUser[] = [
  {
    name: 'Dr. Sarah Chen',
    email: 's.chen@mit.edu',
    password: 'password123',
    user_type: 'lab',
  },
  {
    name: 'Dr. Michael Rodriguez',
    email: 'm.rodriguez@harvard.edu',
    password: 'password123',
    user_type: 'lab',
  },
  {
    name: 'Dr. Emily Patel',
    email: 'e.patel@northeastern.edu',
    password: 'password123',
    user_type: 'lab',
  },
  {
    name: 'Dr. James Wilson',
    email: 'j.wilson@bu.edu',
    password: 'password123',
    user_type: 'lab',
  },
  {
    name: 'Dr. Lisa Anderson',
    email: 'l.anderson@tufts.edu',
    password: 'password123',
    user_type: 'lab',
  },
];

// Mock Restaurants
export const mockRestaurants: MockRestaurant[] = [
  {
    email: 'manager@legalseafoods.com',
    restaurant_name: 'Legal Sea Foods - Seaport',
    address: '270 Northern Ave, Boston, MA 02210',
    contact_phone: '(617) 477-2900',
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_windows: 'Mon-Fri 10am-2pm',
  },
  {
    email: 'chef@neptuneoyster.com',
    restaurant_name: 'Neptune Oyster',
    address: '63 Salem St, Boston, MA 02113',
    contact_phone: '(617) 742-3474',
    storage_method: 'refrigerated',
    cleanliness_level: 'clean',
    pickup_windows: 'Tue-Thu 3pm-5pm',
  },
  {
    email: 'operations@islandcreek.com',
    restaurant_name: 'Island Creek Oyster Bar',
    address: '500 Commonwealth Ave, Boston, MA 02215',
    contact_phone: '(617) 532-5300',
    storage_method: 'frozen',
    cleanliness_level: 'raw_only',
    pickup_windows: 'Mon-Fri 9am-11am',
  },
  {
    email: 'manager@barkingcrab.com',
    restaurant_name: 'The Barking Crab',
    address: '88 Sleeper St, Boston, MA 02210',
    contact_phone: '(617) 426-2722',
    storage_method: 'refrigerated',
    cleanliness_level: 'sauce_covered',
    pickup_windows: 'Daily 2pm-4pm',
  },
  {
    email: 'admin@atlanticfishco.com',
    restaurant_name: 'Atlantic Fish Company',
    address: '761 Boylston St, Boston, MA 02116',
    contact_phone: '(617) 267-4000',
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_windows: 'Mon-Sat 11am-1pm',
  },
  {
    email: 'kitchen@row34.com',
    restaurant_name: 'Row 34',
    address: '383 Congress St, Boston, MA 02210',
    contact_phone: '(617) 553-5900',
    storage_method: 'refrigerated',
    cleanliness_level: 'clean',
    pickup_windows: 'Tue-Fri 10am-12pm',
  },
  {
    email: 'contact@summershack.com',
    restaurant_name: 'Summer Shack',
    address: '50 Dalton St, Boston, MA 02115',
    contact_phone: '(617) 867-9955',
    storage_method: 'frozen',
    cleanliness_level: 'sauce_covered',
    pickup_windows: 'Mon-Sun 8am-10am',
  },
  {
    email: 'info@bostonlobsterfeast.com',
    restaurant_name: 'Boston Lobster Feast',
    address: '196 Boston Ave, Medford, MA 02155',
    contact_phone: '(781) 396-1111',
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_windows: 'Mon-Fri 12pm-3pm',
  },
];

// Mock Labs
export const mockLabs: MockLab[] = [
  {
    email: 's.chen@mit.edu',
    institution_name: 'Massachusetts Institute of Technology',
    dept: 'Department of Materials Science',
    lab_name: 'Biomaterials Research Lab',
    address: '77 Massachusetts Ave, Cambridge, MA 02139',
    contact_phone: '(617) 253-1000',
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 15,
    application:
      'Chitosan extraction for biodegradable medical implants and wound healing applications',
  },
  {
    email: 'm.rodriguez@harvard.edu',
    institution_name: 'Harvard University',
    dept: 'School of Engineering and Applied Sciences',
    lab_name: 'Sustainable Polymers Lab',
    address: '29 Oxford St, Cambridge, MA 02138',
    contact_phone: '(617) 495-1000',
    extraction_frequency: 'biweekly',
    max_pickup_radius_km: 20,
    application:
      'Development of eco-friendly packaging materials from crustacean shell waste',
  },
  {
    email: 'e.patel@northeastern.edu',
    institution_name: 'Northeastern University',
    dept: 'Department of Chemical Engineering',
    lab_name: 'Green Chemistry Lab',
    address: '360 Huntington Ave, Boston, MA 02115',
    contact_phone: '(617) 373-2000',
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 10,
    application:
      'Water purification filters using chitosan-based bioadsorbents for heavy metal removal',
  },
  {
    email: 'j.wilson@bu.edu',
    institution_name: 'Boston University',
    dept: 'Department of Biomedical Engineering',
    lab_name: 'Tissue Engineering Research',
    address: '44 Cummington Mall, Boston, MA 02215',
    contact_phone: '(617) 353-2000',
    extraction_frequency: 'monthly',
    max_pickup_radius_km: 25,
    application:
      'Chitosan scaffolds for cartilage regeneration and orthopedic tissue engineering',
  },
  {
    email: 'l.anderson@tufts.edu',
    institution_name: 'Tufts University',
    dept: 'Department of Civil and Environmental Engineering',
    lab_name: 'Environmental Biotechnology Lab',
    address: '200 College Ave, Medford, MA 02155',
    contact_phone: '(617) 627-3000',
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 12,
    application:
      'Biofilm development using chitosan for wastewater treatment and bioremediation',
  },
];

// Mock Supply Streams
export const mockSupplyStreams: MockSupplyStream[] = [
  // Legal Sea Foods
  {
    restaurant_email: 'manager@legalseafoods.com',
    shell_type: 'lobster',
    weekly_quantity_kg: 45,
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_window: 'Mon-Fri 10am-2pm',
    notes: 'Large volume available year-round',
  },
  {
    restaurant_email: 'manager@legalseafoods.com',
    shell_type: 'shrimp',
    weekly_quantity_kg: 30,
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_window: 'Mon-Fri 10am-2pm',
    notes: 'Pre-rinsed and ready for extraction',
  },
  // Neptune Oyster
  {
    restaurant_email: 'chef@neptuneoyster.com',
    shell_type: 'lobster',
    weekly_quantity_kg: 25,
    storage_method: 'refrigerated',
    cleanliness_level: 'clean',
    pickup_window: 'Tue-Thu 3pm-5pm',
    notes: 'Fresh shells from daily service',
  },
  {
    restaurant_email: 'chef@neptuneoyster.com',
    shell_type: 'crab',
    weekly_quantity_kg: 15,
    storage_method: 'refrigerated',
    cleanliness_level: 'clean',
    pickup_window: 'Tue-Thu 3pm-5pm',
    notes: 'Dungeness and king crab mix',
  },
  // Island Creek Oyster Bar
  {
    restaurant_email: 'operations@islandcreek.com',
    shell_type: 'lobster',
    weekly_quantity_kg: 35,
    storage_method: 'frozen',
    cleanliness_level: 'raw_only',
    pickup_window: 'Mon-Fri 9am-11am',
    notes: 'No sauce, perfect for lab use',
  },
  {
    restaurant_email: 'operations@islandcreek.com',
    shell_type: 'shrimp',
    weekly_quantity_kg: 20,
    storage_method: 'frozen',
    cleanliness_level: 'raw_only',
    pickup_window: 'Mon-Fri 9am-11am',
    notes: 'Raw shells only',
  },
  // The Barking Crab
  {
    restaurant_email: 'manager@barkingcrab.com',
    shell_type: 'crab',
    weekly_quantity_kg: 40,
    storage_method: 'refrigerated',
    cleanliness_level: 'sauce_covered',
    pickup_window: 'Daily 2pm-4pm',
    notes: 'May have butter/seasoning residue',
  },
  {
    restaurant_email: 'manager@barkingcrab.com',
    shell_type: 'lobster',
    weekly_quantity_kg: 28,
    storage_method: 'refrigerated',
    cleanliness_level: 'sauce_covered',
    pickup_window: 'Daily 2pm-4pm',
    notes: 'From our famous lobster rolls',
  },
  // Atlantic Fish Company
  {
    restaurant_email: 'admin@atlanticfishco.com',
    shell_type: 'shrimp',
    weekly_quantity_kg: 38,
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_window: 'Mon-Sat 11am-1pm',
    notes: 'High volume, consistent supply',
  },
  {
    restaurant_email: 'admin@atlanticfishco.com',
    shell_type: 'prawn',
    weekly_quantity_kg: 22,
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_window: 'Mon-Sat 11am-1pm',
    notes: 'Large prawns, excellent quality',
  },
  // Row 34
  {
    restaurant_email: 'kitchen@row34.com',
    shell_type: 'lobster',
    weekly_quantity_kg: 32,
    storage_method: 'refrigerated',
    cleanliness_level: 'clean',
    pickup_window: 'Tue-Fri 10am-12pm',
    notes: 'Sustainably sourced shells',
  },
  {
    restaurant_email: 'kitchen@row34.com',
    shell_type: 'crayfish',
    weekly_quantity_kg: 12,
    storage_method: 'refrigerated',
    cleanliness_level: 'clean',
    pickup_window: 'Tue-Fri 10am-12pm',
    notes: 'Seasonal availability',
  },
  // Summer Shack
  {
    restaurant_email: 'contact@summershack.com',
    shell_type: 'lobster',
    weekly_quantity_kg: 50,
    storage_method: 'frozen',
    cleanliness_level: 'sauce_covered',
    pickup_window: 'Mon-Sun 8am-10am',
    notes: 'Very large volume available',
  },
  {
    restaurant_email: 'contact@summershack.com',
    shell_type: 'crab',
    weekly_quantity_kg: 25,
    storage_method: 'frozen',
    cleanliness_level: 'sauce_covered',
    pickup_window: 'Mon-Sun 8am-10am',
    notes: 'From steamed crab offerings',
  },
  // Boston Lobster Feast
  {
    restaurant_email: 'info@bostonlobsterfeast.com',
    shell_type: 'lobster',
    weekly_quantity_kg: 60,
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_window: 'Mon-Fri 12pm-3pm',
    notes: 'Buffet generates large volume',
  },
  {
    restaurant_email: 'info@bostonlobsterfeast.com',
    shell_type: 'shrimp',
    weekly_quantity_kg: 35,
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_window: 'Mon-Fri 12pm-3pm',
    notes: 'Clean shells from buffet prep',
  },
  {
    restaurant_email: 'info@bostonlobsterfeast.com',
    shell_type: 'crab',
    weekly_quantity_kg: 30,
    storage_method: 'frozen',
    cleanliness_level: 'clean',
    pickup_window: 'Mon-Fri 12pm-3pm',
    notes: 'Mixed crab varieties',
  },
];

// Mock Demand Streams
export const mockDemandStreams: MockDemandStream[] = [
  // MIT - Dr. Chen
  {
    lab_email: 's.chen@mit.edu',
    shell_type_needed: 'shrimp',
    weekly_quantity_needed_kg: 25,
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 15,
    application:
      'Chitosan extraction for biodegradable medical implants and wound healing applications',
    priority_level: 'high',
  },
  {
    lab_email: 's.chen@mit.edu',
    shell_type_needed: 'crab',
    weekly_quantity_needed_kg: 18,
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 15,
    application: 'Testing different chitosan compositions for medical device coatings',
    priority_level: 'medium',
  },
  // Harvard - Dr. Rodriguez
  {
    lab_email: 'm.rodriguez@harvard.edu',
    shell_type_needed: 'lobster',
    weekly_quantity_needed_kg: 30,
    extraction_frequency: 'biweekly',
    max_pickup_radius_km: 20,
    application:
      'Development of eco-friendly packaging materials from crustacean shell waste',
    priority_level: 'medium',
  },
  {
    lab_email: 'm.rodriguez@harvard.edu',
    shell_type_needed: 'prawn',
    weekly_quantity_needed_kg: 15,
    extraction_frequency: 'biweekly',
    max_pickup_radius_km: 20,
    application: 'Comparative analysis of chitosan yield from different crustacean species',
    priority_level: 'low',
  },
  // Northeastern - Dr. Patel
  {
    lab_email: 'e.patel@northeastern.edu',
    shell_type_needed: 'shrimp',
    weekly_quantity_needed_kg: 35,
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 10,
    application:
      'Water purification filters using chitosan-based bioadsorbents for heavy metal removal',
    priority_level: 'high',
  },
  {
    lab_email: 'e.patel@northeastern.edu',
    shell_type_needed: 'crab',
    weekly_quantity_needed_kg: 20,
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 10,
    application: 'Testing crab-derived chitosan for industrial wastewater treatment',
    priority_level: 'high',
  },
  // Boston University - Dr. Wilson
  {
    lab_email: 'j.wilson@bu.edu',
    shell_type_needed: 'lobster',
    weekly_quantity_needed_kg: 22,
    extraction_frequency: 'monthly',
    max_pickup_radius_km: 25,
    application:
      'Chitosan scaffolds for cartilage regeneration and orthopedic tissue engineering',
    priority_level: 'medium',
  },
  {
    lab_email: 'j.wilson@bu.edu',
    shell_type_needed: 'crayfish',
    weekly_quantity_needed_kg: 10,
    extraction_frequency: 'monthly',
    max_pickup_radius_km: 25,
    application: 'Novel chitosan formulations for bone regeneration research',
    priority_level: 'low',
  },
  // Tufts - Dr. Anderson
  {
    lab_email: 'l.anderson@tufts.edu',
    shell_type_needed: 'shrimp',
    weekly_quantity_needed_kg: 28,
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 12,
    application:
      'Biofilm development using chitosan for wastewater treatment and bioremediation',
    priority_level: 'high',
  },
  {
    lab_email: 'l.anderson@tufts.edu',
    shell_type_needed: 'lobster',
    weekly_quantity_needed_kg: 16,
    extraction_frequency: 'weekly',
    max_pickup_radius_km: 12,
    application: 'Environmental remediation using lobster shell-derived materials',
    priority_level: 'medium',
  },
];
