import { createHash } from "node:crypto";
import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

// Limits wrong-password guessing on the admin sign-in. The counting lives in
// the database (supabase/sql/010-login-attempt-limit.sql), so it works even
// though Vercel runs the site on many short-lived servers.
//
// We keep two counters: one per email address and one per visitor address
// (IP). Both are stored as a one-way hash, so the table never holds a real
// email or IP.

export const BLOCKED_MESSAGE =
  "Too many failed attempts. Please wait 15 minutes and try again.";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function loginKeys(email: string) {
  const forwarded = (await headers()).get("x-forwarded-for");
  // Vercel puts the visitor's address first in this header.
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return {
    p_email_key: hash(`email:${email.toLowerCase()}`),
    p_ip_key: hash(`ip:${ip}`),
  };
}

type Keys = Awaited<ReturnType<typeof loginKeys>>;

// True when this email or visitor has failed too many times recently.
// If the database function is missing (010 not run yet) this returns false,
// so a missing file never locks the team out of their own site.
export async function isLoginBlocked(supabase: SupabaseClient, keys: Keys) {
  const { data, error } = await supabase.rpc("login_blocked", keys);
  return !error && data === true;
}

export async function recordLoginFailure(supabase: SupabaseClient, keys: Keys) {
  await supabase.rpc("login_record_failure", keys);
}
