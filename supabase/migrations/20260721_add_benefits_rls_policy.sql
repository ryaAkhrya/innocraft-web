-- Enable RLS on benefits table
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;

-- Allow public read access to benefits table
CREATE POLICY "Public can read benefits" ON benefits
FOR SELECT USING (true);

-- Allow public insert access to benefits table
CREATE POLICY "Public can insert benefits" ON benefits
FOR INSERT
WITH CHECK (true);

-- Allow public update access to benefits table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update benefits" ON benefits
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public delete access to benefits table
CREATE POLICY "Public can delete benefits" ON benefits
FOR DELETE
USING (true);