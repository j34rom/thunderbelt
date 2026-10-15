import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for SERVER code — server components, route handlers,
 * server actions. Reads and writes the auth cookie so logged-in users
 * stay logged in.
 *
 * Still the anon key, on purpose. Never put the service_role key in this
 * project: it bypasses Row Level Security entirely.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // TEMP DIAGNOSTIC: names only, never values. Remove once the Vercel
    // variables are confirmed working.
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !anonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ].filter(Boolean);
    const similar = Object.keys(process.env).filter((name) =>
      /supa|anon|public|base|url|key/i.test(name),
    );
    throw new Error(
      `Supabase env vars missing: ${missing.join(", ")}. ` +
        `Similar names the server can see: ${similar.join(", ") || "none"}. ` +
        "Copy .env.example to .env.local and fill in the values from your " +
        "Supabase project (click Connect). Add them in Vercel too.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a server component, where cookies are read-only.
          // Safe to ignore if you refresh sessions in middleware.
        }
      },
    },
  });
}
