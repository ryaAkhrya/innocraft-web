-- Enable RLS on settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings table
CREATE POLICY "Public can read settings" ON settings
FOR SELECT USING (true);

-- Allow public insert access to settings table
CREATE POLICY "Public can insert settings" ON settings
FOR INSERT
WITH CHECK (true);

-- Allow public update access to settings table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update settings" ON settings
FOR UPDATE
USING (true)
WITH CHECK (true);