-- Create short_urls table
CREATE TABLE short_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  custom_slug VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP,
  is_permanent BOOLEAN DEFAULT false,
  click_count INT DEFAULT 0
);

-- Create url_clicks table
CREATE TABLE url_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_url_id UUID NOT NULL REFERENCES short_urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP DEFAULT now(),
  referrer TEXT,
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX idx_short_urls_short_code ON short_urls(short_code);
CREATE INDEX idx_short_urls_user_id ON short_urls(user_id);
CREATE INDEX idx_short_urls_created_at ON short_urls(created_at DESC);
CREATE INDEX idx_url_clicks_short_url_id ON url_clicks(short_url_id);
CREATE INDEX idx_url_clicks_clicked_at ON url_clicks(clicked_at DESC);

-- Enable Row Level Security
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for short_urls
CREATE POLICY "Users can view their own short URLs"
  ON short_urls
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own short URLs"
  ON short_urls
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own short URLs"
  ON short_urls
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own short URLs"
  ON short_urls
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for url_clicks
-- Anyone can view clicks (they're just statistics, not sensitive data)
CREATE POLICY "Anyone can view clicks"
  ON url_clicks
  FOR SELECT
  USING (true);

-- Only system can insert clicks
CREATE POLICY "System can insert clicks"
  ON url_clicks
  FOR INSERT
  WITH CHECK (true);
