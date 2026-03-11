/**
 * Setup script to create the products table and storage bucket in Supabase.
 * Uses `pg` for DDL statements and `@supabase/supabase-js` for storage.
 * 
 * Usage: node scripts/setup-supabase.mjs
 */

import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load env vars from .env.local ──────────────────────────────────────
function loadEnv() {
  const envPath = resolve(__dirname, '..', '.env.local');
  const content = readFileSync(envPath, 'utf-8');
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    vars[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }
  return vars;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project ref from URL (e.g., https://vswxctyuyuqdrjcegzwd.supabase.co)
const PROJECT_REF = new URL(SUPABASE_URL).hostname.split('.')[0];
const DB_PASSWORD = env.SUPABASE_DB_PASSWORD;

if (!DB_PASSWORD) {
  console.error('❌ Missing SUPABASE_DB_PASSWORD in .env.local');
  console.error('   Add it from: Supabase Dashboard → Project Settings → Database → Connection string');
  process.exit(1);
}

// Database connection via Supabase pooler (Session mode)
const DATABASE_URL = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-1-eu-west-1.pooler.supabase.com:6543/postgres`;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

console.log(`🔗 Supabase URL: ${SUPABASE_URL}`);
console.log(`📦 Project ref: ${PROJECT_REF}`);

// ── Create admin Supabase client (for storage) ─────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Step 1: Create products table via direct PostgreSQL connection ──────
async function createProductsTable() {
  console.log('\n📦 Step 1: Creating products table via PostgreSQL...');

  const client = new pg.Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('  ✅ Connected to database');

    // Read the SQL migration file
    const sqlPath = resolve(__dirname, '..', 'supabase', 'migrations', '001_create_products.sql');
    let sql = readFileSync(sqlPath, 'utf-8');

    // Remove comment lines that are storage-related (they start with --)
    // We'll handle storage separately via the Supabase client
    // Only keep the non-commented SQL
    const lines = sql.split('\n');
    const cleanLines = lines.filter(line => {
      const trimmed = line.trim();
      // Keep non-comment lines and SQL comment headers (-- N.)
      return !trimmed.startsWith('-- INSERT INTO storage') &&
             !trimmed.startsWith('-- CREATE POLICY') &&
             !trimmed.startsWith('-- ON storage') &&
             !trimmed.startsWith('-- USING') &&
             !trimmed.startsWith('-- WITH CHECK') &&
             !trimmed.startsWith('-- AND (') &&
             !trimmed.startsWith('-- OR (') &&
             !trimmed.startsWith('-- auth.jwt') &&
             !trimmed.startsWith('-- bucket_id') &&
             !trimmed.startsWith('-- )');
    });
    sql = cleanLines.join('\n');

    // Execute the full SQL as a single transaction
    await client.query(sql);
    console.log('  ✅ Products table created successfully');
    console.log('  ✅ Indexes created');
    console.log('  ✅ Updated_at trigger created');
    console.log('  ✅ RLS policies created');

    return true;
  } catch (err) {
    console.error('  ❌ Failed:', err.message);
    return false;
  } finally {
    await client.end();
  }
}

// ── Step 2: Create storage bucket ──────────────────────────────────────
async function createStorageBucket() {
  console.log('\n🪣 Step 2: Creating product-images storage bucket...');

  // Check if bucket already exists
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error('  ❌ Failed to list buckets:', listErr.message);
    return false;
  }

  const exists = buckets?.some((b) => b.id === 'product-images');
  if (exists) {
    console.log('  ℹ️  Bucket "product-images" already exists, skipping creation.');
  } else {
    const { error: createErr } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    });

    if (createErr) {
      console.error('  ❌ Failed to create bucket:', createErr.message);
      return false;
    }
    console.log('  ✅ Created "product-images" bucket (public, 5MB limit)');
  }

  return true;
}

// ── Step 3: Set up storage policies via direct SQL ─────────────────────
async function createStoragePolicies() {
  console.log('\n🔒 Step 3: Setting up storage bucket policies...');

  const client = new pg.Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();

    const policies = [
      {
        name: 'Anyone can view product images',
        sql: `
          DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
          CREATE POLICY "Anyone can view product images"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'product-images');
        `,
      },
      {
        name: 'Only owners can upload product images',
        sql: `
          DROP POLICY IF EXISTS "Only owners can upload product images" ON storage.objects;
          CREATE POLICY "Only owners can upload product images"
            ON storage.objects FOR INSERT
            WITH CHECK (
              bucket_id = 'product-images'
              AND (
                auth.jwt() ->> 'email' IN ('business@opuskeys.com')
                OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
              )
            );
        `,
      },
      {
        name: 'Only owners can update product images',
        sql: `
          DROP POLICY IF EXISTS "Only owners can update product images" ON storage.objects;
          CREATE POLICY "Only owners can update product images"
            ON storage.objects FOR UPDATE
            USING (
              bucket_id = 'product-images'
              AND (
                auth.jwt() ->> 'email' IN ('business@opuskeys.com')
                OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
              )
            );
        `,
      },
      {
        name: 'Only owners can delete product images',
        sql: `
          DROP POLICY IF EXISTS "Only owners can delete product images" ON storage.objects;
          CREATE POLICY "Only owners can delete product images"
            ON storage.objects FOR DELETE
            USING (
              bucket_id = 'product-images'
              AND (
                auth.jwt() ->> 'email' IN ('business@opuskeys.com')
                OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
              )
            );
        `,
      },
    ];

    for (const policy of policies) {
      try {
        await client.query(policy.sql);
        console.log(`  ✅ ${policy.name}`);
      } catch (err) {
        console.error(`  ❌ ${policy.name}: ${err.message}`);
      }
    }

    return true;
  } catch (err) {
    console.error('  ❌ Connection failed:', err.message);
    return false;
  } finally {
    await client.end();
  }
}

// ── Verify setup ───────────────────────────────────────────────────────
async function verify() {
  console.log('\n🔍 Verifying setup...');

  // Check products table exists
  const { data, error } = await supabase.from('products').select('id').limit(1);
  if (error) {
    console.error('  ❌ Products table check failed:', error.message);
  } else {
    console.log(`  ✅ Products table exists (${data.length} rows)`);
  }

  // Check storage bucket
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucket = buckets?.find((b) => b.id === 'product-images');
  if (bucket) {
    console.log(`  ✅ Storage bucket "product-images" exists (public: ${bucket.public})`);
  } else {
    console.error('  ❌ Storage bucket "product-images" not found');
  }
}

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 DamnModz Supabase Setup\n' + '='.repeat(40));

  const tableOk = await createProductsTable();
  const bucketOk = await createStorageBucket();

  if (tableOk) {
    await createStoragePolicies();
  }

  console.log('\n' + '='.repeat(40));
  await verify();

  console.log('\n✅ Setup complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
