import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// The two checks every admin page needs, in one place:
//   1. Are you signed in at all?  (no -> sent to the sign-in page)
//   2. Are you listed in the admins table?
// This only decides what the PAGE shows. The real protection is Row Level
// Security in the database, which checks again on every change.
export async function getAdminContext() {
  const supabase = await createClient();

  // getUser() asks Supabase to confirm who you are, so it cannot be faked
  // by editing the cookie in the browser.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Row Level Security lets you read only your own row here, so a row
  // coming back means you are an admin.
  const { data: adminRow, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    supabase,
    user,
    isAdmin: !error && adminRow !== null,
    checkFailed: Boolean(error),
  };
}
