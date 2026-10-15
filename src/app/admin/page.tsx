import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

// The admin page. Two checks, in order:
//   1. Are you signed in at all?  (no -> sign-in page)
//   2. Are you listed in the admins table?  (no -> told you are not an admin)
export default async function AdminPage() {
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

  const isAdmin = !error && adminRow !== null;

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isAdmin ? "Admin" : "Not an admin"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>Signed in as {user.email}.</p>
          {isAdmin ? (
            <p>
              You can manage the schedule here. Adding, editing and deleting
              collections comes next.
            </p>
          ) : (
            <p>
              This account is not on the admin list, so it cannot change the
              schedule. Ask the team to add it.
            </p>
          )}
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
