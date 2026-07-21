-- Enable RLS on contact table
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Allow public read access to contact table
CREATE POLICY "Public can read contact" ON contact
FOR SELECT USING (true);

-- Allow public insert access to contact table
CREATE POLICY "Public can insert contact" ON contact
FOR INSERT
WITH CHECK (true);

-- Allow public update access to contact table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update contact" ON contact
FOR UPDATE
USING (true)
WITH CHECK (true);