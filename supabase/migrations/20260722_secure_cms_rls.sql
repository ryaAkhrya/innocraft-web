-- Secure CMS tables: Restrict write access to authenticated users only
-- Keep public read access for website content

-- hero table policies
-- Drop existing public update/insert policies
DROP POLICY IF EXISTS "Public can update hero" ON hero;
DROP POLICY IF EXISTS "Public can insert hero" ON hero;

-- Create authenticated-only write policies
CREATE POLICY "Authenticated can insert hero" ON hero
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update hero" ON hero
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete hero" ON hero
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- about table policies
DROP POLICY IF EXISTS "Public can insert about" ON about;
DROP POLICY IF EXISTS "Public can update about" ON about;

CREATE POLICY "Authenticated can insert about" ON about
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update about" ON about
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete about" ON about
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- contact table policies
DROP POLICY IF EXISTS "Public can insert contact" ON contact;
DROP POLICY IF EXISTS "Public can update contact" ON contact;
DROP POLICY IF EXISTS "Public can delete contact" ON contact;

CREATE POLICY "Authenticated can insert contact" ON contact
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update contact" ON contact
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete contact" ON contact
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- settings table policies
DROP POLICY IF EXISTS "Public can update settings" ON settings;
DROP POLICY IF EXISTS "Public can insert settings" ON settings;

CREATE POLICY "Authenticated can insert settings" ON settings
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update settings" ON settings
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete settings" ON settings
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- benefits table policies
DROP POLICY IF EXISTS "Public can insert benefits" ON benefits;
DROP POLICY IF EXISTS "Public can update benefits" ON benefits;
DROP POLICY IF EXISTS "Public can delete benefits" ON benefits;

CREATE POLICY "Authenticated can insert benefits" ON benefits
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update benefits" ON benefits
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete benefits" ON benefits
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- projects table policies
DROP POLICY IF EXISTS "Public can insert projects" ON projects;
DROP POLICY IF EXISTS "Public can update projects" ON projects;
DROP POLICY IF EXISTS "Public can delete projects" ON projects;

CREATE POLICY "Authenticated can insert projects" ON projects
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update projects" ON projects
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete projects" ON projects
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- gallery table policies
DROP POLICY IF EXISTS "Public can insert gallery" ON gallery;
DROP POLICY IF EXISTS "Public can update gallery" ON gallery;
DROP POLICY IF EXISTS "Public can delete gallery" ON gallery;

CREATE POLICY "Authenticated can insert gallery" ON gallery
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update gallery" ON gallery
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete gallery" ON gallery
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- mentors table policies
DROP POLICY IF EXISTS "Public can insert mentors" ON mentors;
DROP POLICY IF EXISTS "Public can update mentors" ON mentors;
DROP POLICY IF EXISTS "Public can delete mentors" ON mentors;

CREATE POLICY "Authenticated can insert mentors" ON mentors
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update mentors" ON mentors
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete mentors" ON mentors
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- recruitment table policies
DROP POLICY IF EXISTS "Public can insert recruitment" ON recruitment;
DROP POLICY IF EXISTS "Public can update recruitment" ON recruitment;
DROP POLICY IF EXISTS "Public can delete recruitment" ON recruitment;

CREATE POLICY "Authenticated can insert recruitment" ON recruitment
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update recruitment" ON recruitment
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete recruitment" ON recruitment
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');


-- addon_development table policies
DROP POLICY IF EXISTS "Public can insert addon_development" ON addon_development;
DROP POLICY IF EXISTS "Public can update addon_development" ON addon_development;
DROP POLICY IF EXISTS "Public can delete addon_development" ON addon_development;

CREATE POLICY "Authenticated can insert addon_development" ON addon_development
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update addon_development" ON addon_development
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete addon_development" ON addon_development
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');