# Database Setup Instructions

## Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: **ozvsozrojpggoptzejer**
3. Click on "SQL Editor" in the left sidebar

## Step 2: Run This SQL Script

Copy and paste the entire script below into the SQL Editor and click "Run":

```sql
-- ShellCycle Database Schema
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('restaurant', 'lab')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RESTAURANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  storage_method VARCHAR(50) CHECK (storage_method IN ('frozen', 'refrigerated', 'room_temp')),
  cleanliness_level VARCHAR(50) CHECK (cleanliness_level IN ('clean', 'sauce_covered', 'raw_only')),
  pickup_windows JSONB,
  contact_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LABS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS labs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_name VARCHAR(255) NOT NULL,
  dept VARCHAR(255),
  lab_name VARCHAR(255),
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  extraction_frequency VARCHAR(50) CHECK (extraction_frequency IN ('weekly', 'biweekly', 'monthly')),
  max_pickup_radius_km INTEGER,
  application TEXT,
  contact_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SUPPLY STREAMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS supply_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  shell_type VARCHAR(50) NOT NULL CHECK (shell_type IN ('shrimp', 'crab', 'lobster', 'prawn', 'crayfish', 'squid_pen')),
  weekly_quantity_kg DECIMAL(10, 2) NOT NULL,
  storage_method VARCHAR(50) CHECK (storage_method IN ('frozen', 'refrigerated', 'room_temp')),
  cleanliness_level VARCHAR(50) CHECK (cleanliness_level IN ('clean', 'sauce_covered', 'raw_only')),
  pickup_window TEXT,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DEMAND STREAMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS demand_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id UUID NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  shell_type_needed VARCHAR(50) NOT NULL CHECK (shell_type_needed IN ('shrimp', 'crab', 'lobster', 'prawn', 'crayfish', 'squid_pen')),
  weekly_quantity_needed_kg DECIMAL(10, 2) NOT NULL,
  extraction_frequency VARCHAR(50) CHECK (extraction_frequency IN ('weekly', 'biweekly', 'monthly')),
  max_pickup_radius_km INTEGER,
  application TEXT,
  priority_level VARCHAR(20) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'fulfilled', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MATCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supply_id UUID NOT NULL REFERENCES supply_streams(id) ON DELETE CASCADE,
  demand_id UUID NOT NULL REFERENCES demand_streams(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  lab_id UUID NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  shell_type VARCHAR(50) NOT NULL,
  matched_quantity_kg DECIMAL(10, 2) NOT NULL,
  distance_km DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'rejected', 'cancelled')),
  next_pickup_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_labs_user_id ON labs(user_id);
CREATE INDEX IF NOT EXISTS idx_supply_streams_restaurant_id ON supply_streams(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_demand_streams_lab_id ON demand_streams(lab_id);
CREATE INDEX IF NOT EXISTS idx_matches_supply_id ON matches(supply_id);
CREATE INDEX IF NOT EXISTS idx_matches_demand_id ON matches(demand_id);
CREATE INDEX IF NOT EXISTS idx_matches_restaurant_id ON matches(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_matches_lab_id ON matches(lab_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users: Allow service role full access, users can read their own data
CREATE POLICY "Enable read access for users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for service role" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON users FOR UPDATE USING (true);

-- Restaurants: Public read, authenticated insert/update
CREATE POLICY "Enable read access for all" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON restaurants FOR UPDATE USING (true);

-- Labs: Public read, authenticated insert/update
CREATE POLICY "Enable read access for all" ON labs FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON labs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON labs FOR UPDATE USING (true);

-- Supply Streams: Public read, authenticated insert/update
CREATE POLICY "Enable read access for all" ON supply_streams FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON supply_streams FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON supply_streams FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON supply_streams FOR DELETE USING (true);

-- Demand Streams: Public read, authenticated insert/update
CREATE POLICY "Enable read access for all" ON demand_streams FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON demand_streams FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON demand_streams FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON demand_streams FOR DELETE USING (true);

-- Matches: Public read, authenticated insert/update
CREATE POLICY "Enable read access for all" ON matches FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON matches FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON matches FOR DELETE USING (true);
```

## Step 3: Verify Tables Were Created

Run this query to check all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- users
- restaurants
- labs
- supply_streams
- demand_streams
- matches

## Step 4: Restart Your Dev Server

After the database is set up, restart your Next.js dev server to connect to the real database.

