-- ============================================================
-- Site Content key-value table for DamnModz
-- Stores JSON blobs for homepage sections (featured banners, deals, etc.)
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create the site_content table
CREATE TABLE IF NOT EXISTS site_content (
  key         text        PRIMARY KEY,
  value       jsonb       NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Auto-update updated_at on row change
CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 3. Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 4. Public read access
CREATE POLICY "Site content is viewable by everyone"
  ON site_content FOR SELECT
  USING (true);

-- 5. Only authenticated owners can modify (enforced in server actions)
CREATE POLICY "Site content is editable by authenticated users"
  ON site_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 6. Seed initial data from the static content.json
INSERT INTO site_content (key, value) VALUES
(
  'featured_banners',
  '[
    {
      "background_image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=500&fit=crop",
      "background_alt": "Dead Island 2",
      "logo_image": "/img/dead-island-2-logo.png",
      "logo_alt": "Dead Island 2 Logo",
      "title": "Dead Island 2",
      "platforms": ["PC", "XBOX", "PS5"],
      "platforms_label": "Available on:",
      "description": "Explore iconic, gore-drenched Los Angeles and evolve to become the ultimate Zombie Slayer.",
      "cta_text": "Take It Now!",
      "cta_href": "#",
      "price_label": "Starting at",
      "price_value": "USD 69.99+"
    }
  ]'::jsonb
),
(
  'discounted_games',
  '{
    "section_title": "Discounted Games",
    "games": [
      {
        "thumbnail": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=80&h=80&fit=crop",
        "name": "A Plague Tale: Requiem",
        "rating": 4,
        "price": "$37.50 – $59.99",
        "href": "#"
      },
      {
        "thumbnail": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=80&h=80&fit=crop",
        "name": "Assassins Creed Mirage",
        "rating": 5,
        "price": "$49.99",
        "href": "#"
      },
      {
        "thumbnail": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=80&h=80&fit=crop",
        "name": "Asterigos: Curse of the Stars",
        "rating": 3,
        "price": "$24.25 – $39.99",
        "href": "#"
      },
      {
        "thumbnail": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=80&h=80&fit=crop",
        "name": "Borderlands 3",
        "rating": 5,
        "price": "$59.99 – $69.99",
        "href": "#"
      },
      {
        "thumbnail": "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=80&h=80&fit=crop",
        "name": "Call of Duty: Modern Warfare",
        "rating": 4,
        "price": "$69.99 – $99.99",
        "href": "#"
      }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
