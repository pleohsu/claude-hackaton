-- ShellCycle Database Schema
-- PostgreSQL schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
-- Stores authentication and basic user information
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  user_type TEXT CHECK (user_type IN ('restaurant', 'lab')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RESTAURANTS TABLE
-- Stores restaurant-specific information
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  restaurant_name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  storage_method TEXT CHECK (storage_method IN ('frozen', 'refrigerated', 'room_temp')),
  cleanliness_level TEXT CHECK (cleanliness_level IN ('clean', 'sauce_covered', 'raw_only')),
  pickup_windows JSONB,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- LABS TABLE
-- Stores research lab-specific information
CREATE TABLE labs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  dept TEXT,
  lab_name TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  extraction_frequency TEXT CHECK (extraction_frequency IN ('weekly', 'biweekly', 'monthly')),
  max_pickup_radius_km DOUBLE PRECISION,
  application TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- SUPPLY STREAMS TABLE
-- Tracks shell supply from restaurants
CREATE TABLE supply_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  shell_type TEXT CHECK (shell_type IN ('shrimp', 'crab', 'lobster', 'prawn', 'crayfish', 'squid_pen')) NOT NULL,
  weekly_quantity_kg DOUBLE PRECISION NOT NULL CHECK (weekly_quantity_kg > 0),
  storage_method TEXT CHECK (storage_method IN ('frozen', 'refrigerated', 'room_temp')),
  cleanliness_level TEXT CHECK (cleanliness_level IN ('clean', 'sauce_covered', 'raw_only')),
  pickup_window TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DEMAND STREAMS TABLE
-- Tracks shell demand from labs
CREATE TABLE demand_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id UUID REFERENCES labs(id) ON DELETE CASCADE,
  shell_type_needed TEXT CHECK (shell_type_needed IN ('shrimp', 'crab', 'lobster', 'prawn', 'crayfish', 'squid_pen')) NOT NULL,
  weekly_quantity_needed_kg DOUBLE PRECISION NOT NULL CHECK (weekly_quantity_needed_kg > 0),
  extraction_frequency TEXT CHECK (extraction_frequency IN ('weekly', 'biweekly', 'monthly')),
  max_pickup_radius_km DOUBLE PRECISION,
  application TEXT,
  priority_level TEXT CHECK (priority_level IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('active', 'paused', 'fulfilled', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MATCHES TABLE
-- Stores matched supply-demand pairs
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supply_id UUID REFERENCES supply_streams(id) ON DELETE CASCADE,
  demand_id UUID REFERENCES demand_streams(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  lab_id UUID REFERENCES labs(id) ON DELETE CASCADE,
  shell_type TEXT NOT NULL,
  matched_quantity_kg DOUBLE PRECISION NOT NULL,
  distance_km DOUBLE PRECISION,
  status TEXT CHECK (status IN ('pending', 'active', 'completed', 'rejected', 'cancelled')) DEFAULT 'pending',
  next_pickup_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PICKUP HISTORY TABLE
-- Tracks completed pickups
CREATE TABLE pickup_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  pickup_date DATE NOT NULL,
  actual_quantity_kg DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX idx_labs_user_id ON labs(user_id);
CREATE INDEX idx_supply_streams_restaurant_id ON supply_streams(restaurant_id);
CREATE INDEX idx_supply_streams_shell_type ON supply_streams(shell_type);
CREATE INDEX idx_supply_streams_status ON supply_streams(status);
CREATE INDEX idx_demand_streams_lab_id ON demand_streams(lab_id);
CREATE INDEX idx_demand_streams_shell_type ON demand_streams(shell_type_needed);
CREATE INDEX idx_demand_streams_status ON demand_streams(status);
CREATE INDEX idx_matches_supply_id ON matches(supply_id);
CREATE INDEX idx_matches_demand_id ON matches(demand_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_restaurant_id ON matches(restaurant_id);
CREATE INDEX idx_matches_lab_id ON matches(lab_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labs_updated_at BEFORE UPDATE ON labs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supply_streams_updated_at BEFORE UPDATE ON supply_streams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demand_streams_updated_at BEFORE UPDATE ON demand_streams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
