-- ShellCycle Seed Data
-- Sample data for development and testing

-- Note: Password for all test users is 'password123' (hashed with bcrypt)
-- Hash: $2a$10$rKJ3qXqZQzQxZ5Z5Z5Z5ZeZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZ

-- Insert test users
INSERT INTO users (name, email, password_hash, user_type) VALUES
  ('The Ocean Catch', 'ocean.catch@example.com', '$2a$10$rKJ3qXqZQzQxZ5Z5Z5Z5ZeZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZ', 'restaurant'),
  ('Shrimp Harbor', 'shrimp.harbor@example.com', '$2a$10$rKJ3qXqZQzQxZ5Z5Z5Z5ZeZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZ', 'restaurant'),
  ('Lobster Palace', 'lobster.palace@example.com', '$2a$10$rKJ3qXqZQzQxZ5Z5Z5Z5ZeZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZ', 'restaurant'),
  ('MIT Biomaterials Lab', 'mit.bio@example.com', '$2a$10$rKJ3qXqZQzQxZ5Z5Z5Z5ZeZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZ', 'lab'),
  ('Stanford Marine Research', 'stanford.marine@example.com', '$2a$10$rKJ3qXqZQzQxZ5Z5Z5Z5ZeZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZ', 'lab');

-- Insert test restaurants
INSERT INTO restaurants (user_id, restaurant_name, address, latitude, longitude, storage_method, cleanliness_level, pickup_windows, contact_phone) VALUES
  (
    (SELECT id FROM users WHERE email = 'ocean.catch@example.com'),
    'The Ocean Catch',
    '123 Harbor St, Boston, MA 02110',
    42.3601,
    -71.0589,
    'frozen',
    'sauce_covered',
    '{"monday": "4pm-8pm", "tuesday": "4pm-8pm", "wednesday": "4pm-8pm", "thursday": "4pm-8pm", "friday": "4pm-8pm"}',
    '(617) 555-0101'
  ),
  (
    (SELECT id FROM users WHERE email = 'shrimp.harbor@example.com'),
    'Shrimp Harbor',
    '456 Wharf Ave, Cambridge, MA 02139',
    42.3736,
    -71.1097,
    'refrigerated',
    'clean',
    '{"tuesday": "3pm-7pm", "thursday": "3pm-7pm", "saturday": "12pm-4pm"}',
    '(617) 555-0102'
  ),
  (
    (SELECT id FROM users WHERE email = 'lobster.palace@example.com'),
    'Lobster Palace',
    '789 Seafood Blvd, Palo Alto, CA 94301',
    37.4419,
    -122.1430,
    'frozen',
    'raw_only',
    '{"monday": "5pm-9pm", "wednesday": "5pm-9pm", "friday": "5pm-9pm"}',
    '(650) 555-0103'
  );

-- Insert test labs
INSERT INTO labs (user_id, institution_name, dept, lab_name, address, latitude, longitude, extraction_frequency, max_pickup_radius_km, application, contact_phone) VALUES
  (
    (SELECT id FROM users WHERE email = 'mit.bio@example.com'),
    'Massachusetts Institute of Technology',
    'Department of Materials Science',
    'Biomaterials Lab',
    '77 Massachusetts Ave, Cambridge, MA 02139',
    42.3601,
    -71.0942,
    'weekly',
    10.0,
    'Developing biodegradable medical implants from chitosan',
    '(617) 555-0201'
  ),
  (
    (SELECT id FROM users WHERE email = 'stanford.marine@example.com'),
    'Stanford University',
    'School of Engineering',
    'Marine Biomaterials Research',
    '450 Serra Mall, Stanford, CA 94305',
    37.4275,
    -122.1697,
    'biweekly',
    25.0,
    'Sustainable packaging materials from marine waste',
    '(650) 555-0202'
  );

-- Insert test supply streams
INSERT INTO supply_streams (restaurant_id, shell_type, weekly_quantity_kg, storage_method, cleanliness_level, pickup_window, notes, status) VALUES
  (
    (SELECT id FROM restaurants WHERE restaurant_name = 'The Ocean Catch'),
    'shrimp',
    15.5,
    'frozen',
    'sauce_covered',
    'Mon-Fri 4pm-8pm',
    'Shells from cocktail shrimp service',
    'active'
  ),
  (
    (SELECT id FROM restaurants WHERE restaurant_name = 'The Ocean Catch'),
    'crab',
    8.2,
    'frozen',
    'clean',
    'Mon-Fri 4pm-8pm',
    'Mostly blue crab shells',
    'active'
  ),
  (
    (SELECT id FROM restaurants WHERE restaurant_name = 'Shrimp Harbor'),
    'shrimp',
    22.0,
    'refrigerated',
    'clean',
    'Tue/Thu/Sat',
    'Pre-rinsed shells, stored separately',
    'active'
  ),
  (
    (SELECT id FROM restaurants WHERE restaurant_name = 'Lobster Palace'),
    'lobster',
    12.5,
    'frozen',
    'raw_only',
    'Mon/Wed/Fri evenings',
    'Whole shells from live lobster service',
    'active'
  );

-- Insert test demand streams
INSERT INTO demand_streams (lab_id, shell_type_needed, weekly_quantity_needed_kg, extraction_frequency, max_pickup_radius_km, application, priority_level, status) VALUES
  (
    (SELECT id FROM labs WHERE lab_name = 'Biomaterials Lab'),
    'shrimp',
    20.0,
    'weekly',
    10.0,
    'Chitosan extraction for medical device coatings',
    'high',
    'active'
  ),
  (
    (SELECT id FROM labs WHERE lab_name = 'Biomaterials Lab'),
    'crab',
    15.0,
    'weekly',
    10.0,
    'Comparing chitosan quality across species',
    'medium',
    'active'
  ),
  (
    (SELECT id FROM labs WHERE lab_name = 'Marine Biomaterials Research'),
    'lobster',
    10.0,
    'biweekly',
    25.0,
    'Developing eco-friendly food packaging',
    'medium',
    'active'
  );

-- Note: Matches would be created by the matching algorithm
-- This is just sample data showing the structure
INSERT INTO matches (supply_id, demand_id, restaurant_id, lab_id, shell_type, matched_quantity_kg, distance_km, status) VALUES
  (
    (SELECT id FROM supply_streams WHERE shell_type = 'shrimp' AND restaurant_id = (SELECT id FROM restaurants WHERE restaurant_name = 'Shrimp Harbor')),
    (SELECT id FROM demand_streams WHERE shell_type_needed = 'shrimp' AND lab_id = (SELECT id FROM labs WHERE lab_name = 'Biomaterials Lab')),
    (SELECT id FROM restaurants WHERE restaurant_name = 'Shrimp Harbor'),
    (SELECT id FROM labs WHERE lab_name = 'Biomaterials Lab'),
    'shrimp',
    20.0,
    3.2,
    'active'
  );
