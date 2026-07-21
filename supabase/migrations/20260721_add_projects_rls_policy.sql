-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects table
CREATE POLICY "Public can read projects" ON projects
FOR SELECT USING (true);

-- Allow public insert access to projects table
CREATE POLICY "Public can insert projects" ON projects
FOR INSERT
WITH CHECK (true);

-- Allow public update access to projects table
-- No Supabase Auth in Studio CMS yet, so allow all updates
CREATE POLICY "Public can update projects" ON projects
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public delete access to projects table
CREATE POLICY "Public can delete projects" ON projects
FOR DELETE
USING (true);