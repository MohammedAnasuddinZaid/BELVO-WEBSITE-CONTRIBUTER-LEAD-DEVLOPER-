-- Run this in your Supabase SQL Editor to set up the database

-- 1. Departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#7B2FBE',
  light_color TEXT NOT NULL DEFAULT '#9D4EDD',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  team_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index for faster queries
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members(sort_order);

-- 4. Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public read team_members" ON team_members FOR SELECT USING (true);

-- Allow service role full access (for the backend API)
CREATE POLICY "Allow service role all departments" ON departments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role all team_members" ON team_members FOR ALL USING (auth.role() = 'service_role');


-- ============================================================
-- OPTIONAL: Seed data (departments that match HARDCODED_TEAMS)
-- ============================================================
INSERT INTO departments (id, name, color, light_color, sort_order) VALUES
  ('web', 'Web Development', '#7B2FBE', '#9D4EDD', 1),
  ('app', 'App Development', '#7B2FBE', '#9D4EDD', 2),
  ('cyber', 'Cyber Security', '#7B2FBE', '#9D4EDD', 3),
  ('software', 'Software Development', '#7B2FBE', '#9D4EDD', 4),
  ('analytics', 'Business & Data Analytics', '#7B2FBE', '#9D4EDD', 5),
  ('graphic', 'Graphic Designing', '#7B2FBE', '#9D4EDD', 6),
  ('social', 'Social Media Management', '#7B2FBE', '#9D4EDD', 7),
  ('content', 'Content Writer', '#7B2FBE', '#9D4EDD', 8),
  ('admin', 'Administration', '#007BFF', '#0056b3', 9)
ON CONFLICT (id) DO NOTHING;
