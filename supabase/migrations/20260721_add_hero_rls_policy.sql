-- Enable RLS on hero table
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;

-- Allow public read access to hero table
CREATE POLICY "Public can read hero" ON hero
FOR SELECT USING (true);

-- Allow public update access to hero table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update hero" ON hero
FOR UPDATE
USING (true)
WITH CHECK (true);