-- Add tiktok column to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS tiktok TEXT;