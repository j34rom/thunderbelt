import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { COLLECTION_TYPE_LABELS, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "./actions";
import { AddCollectionForm } from "./add-collection-form";

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

  // Only admins need the areas and the collections.
  const { data: areas } = isAdmin
    ? await supabase.from("areas").select("id, name").order("name")
    : { data: null };
  const { data: collections } = isAdmin
    ? await supabase
        .from("collections")
        .select("id, area_id, type, place, starts_at, note")
        .order("starts_at", { ascending: false })
    : { data: null };

  const areaName = new Map((areas ?? []).map((area) => [area.id, area.name]));

  return (
    <main className="mx-auto w-full max-w-xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {error ? "Could not check access" : isAdmin ? "Admin" : "Not an admin"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>Signed in as {user.email}.</p>
          {error ? (
            // A failed lookup is not the same as "not an admin", so say so.
            <p>
              Something went wrong while checking whether this account is an
              admin. Please refresh the page and try again.
            </p>
          ) : !isAdmin ? (
            <p>
              This account is not on the admin list, so it cannot change the
              schedule. Ask the team to add it.
            </p>
          ) : null}
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>

      {isAdmin && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Add a collection</CardTitle>
            </CardHeader>
            <CardContent>
              <AddCollectionForm areas={areas ?? []} />
            </CardContent>
          </Card>

          <section aria-label="All collections">
            <h2 className="text-lg font-semibold tracking-tight">
              All collections
            </h2>
            {!collections || collections.length === 0 ? (
              <p className="mt-3 text-sm">Nothing added yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {collections.map((collection) => (
                  <li key={collection.id}>
                    <Card>
                      <CardContent className="space-y-1 pt-6 text-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {COLLECTION_TYPE_LABELS[collection.type] ??
                            collection.type}{" "}
                          · {areaName.get(collection.area_id) ?? "Unknown area"}
                        </p>
                        <p className="font-semibold">{collection.place}</p>
                        <p>{formatDateTime(collection.starts_at)}</p>
                        {collection.note && <p>{collection.note}</p>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
