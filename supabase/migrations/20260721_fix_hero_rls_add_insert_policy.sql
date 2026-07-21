-- Add missing INSERT policy to hero table
-- Existing SELECT and UPDATE policies are kept unchanged

CREATE POLICY "Public can insert hero" ON hero
FOR INSERT
WITH CHECK (true);