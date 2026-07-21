-- Enable RLS on mentors table
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to mentors table
CREATE POLICY "Public can read mentors" ON mentors
FOR SELECT USING (true);

-- Allow public update access to mentors table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update mentors" ON mentors
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public insert access to mentors table
CREATE POLICY "Public can insert mentors" ON mentors
FOR INSERT
WITH CHECK (true);

-- Allow public delete access to mentors table
CREATE POLICY "Public can delete mentors" ON mentors
FOR DELETE
USING (true);