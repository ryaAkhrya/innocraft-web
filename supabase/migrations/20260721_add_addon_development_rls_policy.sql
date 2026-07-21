-- Enable RLS on addon_development table
ALTER TABLE addon_development ENABLE ROW LEVEL SECURITY;

-- Allow public read access to addon_development table
CREATE POLICY "Public can read addon_development" ON addon_development
FOR SELECT USING (true);

-- Allow public insert access to addon_development table
CREATE POLICY "Public can insert addon_development" ON addon_development
FOR INSERT
WITH CHECK (true);

-- Allow public update access to addon_development table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update addon_development" ON addon_development
FOR UPDATE
USING (true)
WITH CHECK (true);