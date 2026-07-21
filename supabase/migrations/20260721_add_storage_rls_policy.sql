-- Enable RLS on storage.objects
-- Create policies for CMS asset management buckets

-- Allow public read access to CMS buckets
CREATE POLICY "Public can read hero assets" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'hero');

CREATE POLICY "Public can read about assets" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'about');

CREATE POLICY "Public can read gallery assets" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'gallery');

CREATE POLICY "Public can read mentors assets" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'mentors');

CREATE POLICY "Public can read projects assets" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'projects');

CREATE POLICY "Public can read sections assets" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'sections');

-- Allow public INSERT access for CMS uploads
CREATE POLICY "Public can insert hero assets" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'hero');

CREATE POLICY "Public can insert about assets" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'about');

CREATE POLICY "Public can insert gallery assets" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Public can insert mentors assets" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'mentors');

CREATE POLICY "Public can insert projects assets" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'projects');

CREATE POLICY "Public can insert sections assets" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'sections');

-- Allow public UPDATE access for CMS asset management
CREATE POLICY "Public can update hero assets" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'hero')
WITH CHECK (bucket_id = 'hero');

CREATE POLICY "Public can update about assets" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'about')
WITH CHECK (bucket_id = 'about');

CREATE POLICY "Public can update gallery assets" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Public can update mentors assets" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'mentors')
WITH CHECK (bucket_id = 'mentors');

CREATE POLICY "Public can update projects assets" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'projects')
WITH CHECK (bucket_id = 'projects');

CREATE POLICY "Public can update sections assets" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'sections')
WITH CHECK (bucket_id = 'sections');

-- Allow public DELETE access for CMS asset management
CREATE POLICY "Public can delete hero assets" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'hero');

CREATE POLICY "Public can delete about assets" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'about');

CREATE POLICY "Public can delete gallery assets" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'gallery');

CREATE POLICY "Public can delete mentors assets" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'mentors');

CREATE POLICY "Public can delete projects assets" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'projects');

CREATE POLICY "Public can delete sections assets" ON storage.objects
FOR DELETE TO public
USING (bucket_id = 'sections');