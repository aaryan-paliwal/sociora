import { createClient } from "@supabase/supabase-js";

/**
 * Sociora - Supabase Client Configuration
 * Supports browser client (public anonymous access) and server client (service-role or anon key).
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10
  );
}

/**
 * Standard client for browser/client-side access using anon key
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Server-only client for backend operations, preferring service role key if available
 */
export function createServerSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const keyToUse = supabaseServiceKey || supabaseAnonKey;
  return createClient(supabaseUrl, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
