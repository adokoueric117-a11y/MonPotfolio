import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Les variables NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY sont requises.");
  }

  return createClient(url, serviceRoleKey);
}