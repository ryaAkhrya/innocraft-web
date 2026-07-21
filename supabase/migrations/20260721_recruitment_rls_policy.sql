-- Enable RLS on recruitment table
ALTER TABLE recruitment ENABLE ROW LEVEL SECURITY;

-- Allow public read access to recruitment table
CREATE POLICY "Public can read recruitment" ON recruitment
FOR SELECT USING (true);

-- Allow public insert access to recruitment table
CREATE POLICY "Public can insert recruitment" ON recruitment
FOR INSERT
WITH CHECK (true);

-- Allow public update access to recruitment table
CREATE POLICY "Public can update recruitment" ON recruitment
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public delete access to recruitment table
CREATE POLICY "Public can delete recruitment" ON recruitment
FOR DELETE
USING (true);