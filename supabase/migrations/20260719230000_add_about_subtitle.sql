-- Add subtitle column to about table
ALTER TABLE about ADD COLUMN IF NOT EXISTS subtitle TEXT;