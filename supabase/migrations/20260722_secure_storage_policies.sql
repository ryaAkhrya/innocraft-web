-- Secure storage buckets: Restrict write access to authenticated users only
-- Keep public read access for website assets

-- Drop existing public INSERT/UPDATE/DELETE policies for all CMS buckets
DROP POLICY IF EXISTS "Public can insert hero assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can update hero assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete hero assets" ON storage.objects;

DROP POLICY IF EXISTS "Public can insert about assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can update about assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete about assets" ON storage.objects;

DROP POLICY IF EXISTS "Public can insert gallery assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can update gallery assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete gallery assets" ON storage.objects;

DROP POLICY IF EXISTS "Public can insert mentors assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can update mentors assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete mentors assets" ON storage.objects;

DROP POLICY IF EXISTS "Public can insert projects assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can update projects assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete projects assets" ON storage.objects;

DROP POLICY IF EXISTS "Public can insert sections assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can update sections assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete sections assets" ON storage.objects;


-- hero bucket policies (keep public read, restrict writes)
CREATE POLICY "Authenticated can insert hero assets" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update hero assets" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'hero' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'hero' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete hero assets" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'hero' AND auth.role() = 'authenticated');


-- about bucket policies
CREATE POLICY "Authenticated can insert about assets" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'about' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update about assets" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'about' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'about' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete about assets" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'about' AND auth.role() = 'authenticated');


-- gallery bucket policies
CREATE POLICY "Authenticated can insert gallery assets" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update gallery assets" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete gallery assets" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');


-- mentors bucket policies
CREATE POLICY "Authenticated can insert mentors assets" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mentors' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update mentors assets" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'mentors' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'mentors' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete mentors assets" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'mentors' AND auth.role() = 'authenticated');


-- projects bucket policies
CREATE POLICY "Authenticated can insert projects assets" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update projects assets" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'projects' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete projects assets" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'projects' AND auth.role() = 'authenticated');


-- sections bucket policies
CREATE POLICY "Authenticated can insert sections assets" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sections' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update sections assets" ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'sections' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'sections' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete sections assets" ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'sections' AND auth.role() = 'authenticated');