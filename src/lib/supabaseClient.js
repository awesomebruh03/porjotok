import { createClient } from "@supabase/supabase-js";

// Vite exposes only VITE_-prefixed variables to the browser. Keep this file
// import-safe when the project is not configured yet: `supabase` is null and
// the admin shows a setup notice instead of crashing the public site.
const url = import.meta.env.VITE_SUPABASE_URL ?? "";
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "";

export const supabaseConfigured = Boolean(url && key);

export const supabase = supabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Hash routing owns the URL fragment, so do not let the client try to
        // read auth tokens out of it.
        detectSessionInUrl: false,
      },
    })
  : null;
