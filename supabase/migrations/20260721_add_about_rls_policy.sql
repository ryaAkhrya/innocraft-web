-- Enable RLS on about table
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Allow public read access to about table
CREATE POLICY "Public can read about" ON about
FOR SELECT USING (true);

-- Allow public insert access to about table
-- No Supabase Auth in Studio CMS yet, so allow all inserts
CREATE POLICY "Public can insert about" ON about
FOR INSERT
WITH CHECK (true);

-- Allow public update access to about table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update about" ON about
FOR UPDATE
USING (true)
WITH CHECK (true);