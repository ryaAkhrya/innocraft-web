-- Create addon_development table (single-row, like hero/about)
CREATE TABLE IF NOT EXISTS addon_development (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for updated_at
CREATE TRIGGER update_addon_development_updated_at BEFORE UPDATE ON addon_development
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Seed initial empty row so CMS can update it
INSERT INTO addon_development (title, description, video_url, thumbnail_url)
VALUES ('', '', '', '')
ON CONFLICT DO NOTHING;