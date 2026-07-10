import { createClient } from "@supabase/supabase-js";

// Lazy initialization — process.env is populated by dotenv AFTER ESM imports resolve,
// so we must read env vars at call time, not at module load time.
let _supabase = undefined;

function getClient() {
  if (_supabase === undefined) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
      _supabase = null;
    } else {
      _supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      });
    }
  }
  return _supabase;
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    const client = getClient();
    if (!client) throw new Error("Database not configured — set Supabase env vars");
    return client[prop];
  },
});

export function isDbReady() {
  return getClient() !== null;
}
