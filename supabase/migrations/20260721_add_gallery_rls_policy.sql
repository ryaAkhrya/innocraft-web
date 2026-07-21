-- Enable RLS on gallery table
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gallery table
CREATE POLICY "Public can read gallery" ON gallery
FOR SELECT USING (true);

-- Allow public update access to gallery table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update gallery" ON gallery
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public insert access to gallery table
CREATE POLICY "Public can insert gallery" ON gallery
FOR INSERT
WITH CHECK (true);

-- Allow public delete access to gallery table
CREATE POLICY "Public can delete gallery" ON gallery
FOR DELETE
USING (true);