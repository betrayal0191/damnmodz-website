-- ============================================================
-- Products table for DamnModz
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS products (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title                   text        NOT NULL,
  price                   numeric(10,2) NOT NULL CHECK (price >= 0),
  description             text        NOT NULL,          -- HTML from TipTap editor
  category                text        NOT NULL,
  affiliate_fee           numeric(5,2) NOT NULL CHECK (affiliate_fee >= 0 AND affiliate_fee <= 100),
  item_type               text        NOT NULL CHECK (item_type IN ('Key', 'In-Game item', 'Account', 'Subscription')),
  content                 text        NOT NULL,          -- Content of the item
  additional_info         text,                          -- Optional
  activation_instructions text,                          -- Optional
  languages               text[]      NOT NULL DEFAULT '{}',
  image_url               text,                          -- Public URL from Supabase Storage
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_category  ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_item_type ON products (item_type);
CREATE INDEX IF NOT EXISTS idx_products_created   ON products (created_at DESC);

-- 3. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 5. Public read access
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- 6. Owner-only insert (check app_metadata.role = 'owner')
CREATE POLICY "Only owners can insert products"
  ON products FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' IN ('business@opuskeys.com')
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
  );

-- 7. Owner-only update
CREATE POLICY "Only owners can update products"
  ON products FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN ('business@opuskeys.com')
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
  );

-- 8. Owner-only delete
CREATE POLICY "Only owners can delete products"
  ON products FOR DELETE
  USING (
    auth.jwt() ->> 'email' IN ('business@opuskeys.com')
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
  );

-- ============================================================
-- Supabase Storage bucket for product images
-- Run these separately if the bucket doesn't exist yet:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
--
-- CREATE POLICY "Anyone can view product images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');
--
-- CREATE POLICY "Only owners can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'product-images'
--     AND (
--       auth.jwt() ->> 'email' IN ('business@opuskeys.com')
--       OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
--     )
--   );
--
-- CREATE POLICY "Only owners can delete product images"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'product-images'
--     AND (
--       auth.jwt() ->> 'email' IN ('business@opuskeys.com')
--       OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
--     )
--   );
