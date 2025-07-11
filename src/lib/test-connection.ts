import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testConnection() {
  console.log('Attempting to connect to Supabase...');

  try {
    const { supabase } = await import('./supabaseClient');
    const { data, error } = await supabase.rpc('get_schema_names');

    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Available schemas:', data);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('An unexpected error occurred:', e.message);
    } else {
      console.error('An unexpected error occurred:', e);
    }
  }
}

testConnection();