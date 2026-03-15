-- ============================================================
-- Full schema for OpusKeys (self-hosted PostgreSQL)
-- Replaces Supabase tables + adds NextAuth tables
-- ============================================================

-- ── NextAuth.js required tables ─────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text,
  email         text        UNIQUE,
  "emailVerified" timestamptz,
  image         text,
  role          text        NOT NULL DEFAULT 'user',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id                  uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"            uuid    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                text    NOT NULL,
  provider            text    NOT NULL,
  "providerAccountId" text    NOT NULL,
  refresh_token       text,
  access_token        text,
  expires_at          integer,
  token_type          text,
  scope               text,
  id_token            text,
  session_state       text,
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" text       NOT NULL UNIQUE,
  "userId"      uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires       timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_token (
  identifier  text        NOT NULL,
  token       text        NOT NULL UNIQUE,
  expires     timestamptz NOT NULL,
  UNIQUE(identifier, token)
);

-- ── Application tables ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title                   text        NOT NULL,
  price                   numeric(10,2) NOT NULL CHECK (price >= 0),
  description             text        NOT NULL,
  category                text        NOT NULL,
  affiliate_fee           numeric(5,2) NOT NULL CHECK (affiliate_fee >= 0 AND affiliate_fee <= 100),
  item_type               text        NOT NULL CHECK (item_type IN ('Key', 'In-Game item', 'Account', 'Subscription')),
  content                 text        NOT NULL,
  additional_info         text,
  activation_instructions text,
  languages               text[]      NOT NULL DEFAULT '{}',
  image_url               text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category  ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_item_type ON products (item_type);
CREATE INDEX IF NOT EXISTS idx_products_created   ON products (created_at DESC);

CREATE TABLE IF NOT EXISTS site_content (
  key         text        PRIMARY KEY,
  value       jsonb       NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Triggers ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_site_content_updated_at ON site_content;
CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── Seed owner user ─────────────────────────────────────────
INSERT INTO users (email, role, "emailVerified")
VALUES ('business@opuskeys.com', 'owner', now())
ON CONFLICT (email) DO UPDATE SET role = 'owner';

-- ── Seed site content ───────────────────────────────────────
INSERT INTO site_content (key, value) VALUES
(
  'featured_banners',
  '[{"background_image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=500&fit=crop", "background_alt": "Dead Island 2", "logo_image": "/img/dead-island-2-logo.png", "logo_alt": "Dead Island 2 Logo", "title": "Dead Island 2", "platforms": ["PC", "XBOX", "PS5"], "platforms_label": "Available on:", "description": "Explore iconic, gore-drenched Los Angeles and evolve to become the ultimate Zombie Slayer.", "cta_text": "Take It Now!", "cta_href": "#", "price_label": "Starting at", "price_value": "USD 69.99+"}]'::jsonb
),
(
  'discounted_games',
  '{"section_title": "Discounted Games", "games": [{"thumbnail": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=80&h=80&fit=crop", "name": "A Plague Tale: Requiem", "rating": 4, "price": "$37.50 – $59.99", "href": "#"}, {"thumbnail": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=80&h=80&fit=crop", "name": "Assassins Creed Mirage", "rating": 5, "price": "$49.99", "href": "#"}, {"thumbnail": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=80&h=80&fit=crop", "name": "Asterigos: Curse of the Stars", "rating": 3, "price": "$24.25 – $39.99", "href": "#"}, {"thumbnail": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=80&h=80&fit=crop", "name": "Borderlands 3", "rating": 5, "price": "$59.99 – $69.99", "href": "#"}, {"thumbnail": "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=80&h=80&fit=crop", "name": "Call of Duty: Modern Warfare", "rating": 4, "price": "$69.99 – $99.99", "href": "#"}]}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
