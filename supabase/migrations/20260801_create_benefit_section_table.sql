-- Create benefit_section table for section-level data (badge, title, subtitle)
-- This is a single-row table (like hero) that stores the Benefit section header content.
CREATE TABLE benefit_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge TEXT,
  title TEXT,
  subtitle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for updated_at
CREATE TRIGGER update_benefit_section_updated_at BEFORE UPDATE ON benefit_section
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS on benefit_section table
ALTER TABLE benefit_section ENABLE ROW LEVEL SECURITY;

-- Allow public read access to benefit_section table
CREATE POLICY "Public can read benefit_section" ON benefit_section
  FOR SELECT USING (true);

-- Allow public insert access to benefit_section table
CREATE POLICY "Public can insert benefit_section" ON benefit_section
  FOR INSERT
  WITH CHECK (true);

-- Allow public update access to benefit_section table
CREATE POLICY "Public can update benefit_section" ON benefit_section
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete access to benefit_section table
CREATE POLICY "Public can delete benefit_section" ON benefit_section
  FOR DELETE
  USING (true);