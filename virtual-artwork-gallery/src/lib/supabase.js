import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn(
        'WARNING: Missing Supabase environment variables. Check your .env.local file. ' +
        'Using a placeholder client; database operations will fail until environment variables are configured.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);