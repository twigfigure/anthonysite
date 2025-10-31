import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yhdupznwngzzharprxyp.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZHVwem53bmd6emhhcnByeHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTI3NjYsImV4cCI6MjA3NjAyODc2Nn0.eGFINm_CpgHOMZVtnUV7IZ16BkYyfqvxKZMjsSirhOc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationSQL = readFileSync(
      join(__dirname, 'supabase/migrations/20241031000000_add_hunter_affinities.sql'),
      'utf8'
    );

    console.log('Running migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('Migration completed successfully!');
    console.log('Result:', data);
  } catch (err) {
    console.error('Error running migration:', err);
    process.exit(1);
  }
}

runMigration();
