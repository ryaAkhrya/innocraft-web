-- Add modal columns to recruitment table for full CMS-driven detail modal
ALTER TABLE recruitment ADD COLUMN IF NOT EXISTS job_description TEXT;
ALTER TABLE recruitment ADD COLUMN IF NOT EXISTS benefits TEXT[];
ALTER TABLE recruitment ADD COLUMN IF NOT EXISTS work_location TEXT;

-- Backfill existing rows: use description as fallback for job_description
UPDATE recruitment
SET job_description = description
WHERE job_description IS NULL;

-- Backfill existing rows: use location as fallback for work_location
UPDATE recruitment
SET work_location = location
WHERE work_location IS NULL;

-- Backfill existing rows: initialize benefits as empty array if null
UPDATE recruitment
SET benefits = '{}'
WHERE benefits IS NULL;