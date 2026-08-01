-- Add thumbnail_url column to hero table
-- This allows CMS to store a custom thumbnail image for the hero video.
ALTER TABLE hero ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;