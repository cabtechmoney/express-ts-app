import dotenv from 'dotenv';

dotenv.config();

let cachedClient: any = null;

const fallbackSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

export const getSupabase = () => {
  if (!cachedClient) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase credentials are missing. Falling back to demo data.');
      return null;
    }

    try {
      const parsed = new URL(supabaseUrl);
      const hostname = parsed.hostname.toLowerCase();

      if (!hostname.includes('supabase.co') || hostname.includes('example')) {
        console.warn('Supabase URL is invalid or not reachable. Falling back to demo data.');
        return null;
      }

      const { createClient } = require('@supabase/supabase-js');
      cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (error: any) {
      console.warn('Supabase unavailable. Falling back to demo data:', error?.message || error);
      return null;
    }
  }

  return cachedClient;
};

export default getSupabase;
export { fallbackSupabaseUrl };
