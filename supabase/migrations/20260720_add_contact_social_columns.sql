-- Add instagram, facebook, and tiktok columns to contact table
ALTER TABLE contact 
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS tiktok TEXT;
