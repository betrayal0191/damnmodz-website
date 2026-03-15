import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

async function main() {
  const env = loadEnv();
  const DATABASE_URL = env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ Missing DATABASE_URL in .env.local');
    process.exit(1);
  }

  console.log('🔗 Connecting to PostgreSQL...');
  const client = new pg.Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const sqlPath = resolve(__dirname, 'migrations', '001_initial_schema.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('📦 Running migrations...');
    await client.query(sql);
    console.log('✅ All tables created successfully');
    console.log('✅ Indexes created');
    console.log('✅ Triggers created');
    console.log('✅ Owner user seeded');
    console.log('✅ Site content seeded');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
