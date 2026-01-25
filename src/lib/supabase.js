
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    console.error("CRITICAL ERROR: Invalid Supabase URL:", supabaseUrl);
    // Fallback to prevent white screen crash, although functionality will break
    throw new Error(`Invalid Supabase URL in .env: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
