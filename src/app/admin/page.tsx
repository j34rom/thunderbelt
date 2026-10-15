import Link from "next/link";
import { getAdminContext } from "@/lib/admin";
import {
  COLLECTION_TYPE_LABELS,
  formatDate,
  formatDateTime,
} from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addCollection, signOut } from "./actions";
import { CollectionForm } from "./collection-form";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase, user, isAdmin, checkFailed } = await getAdminContext();

  // Only admins need the areas and the collections.
  const { data: areas } = isAdmin
    ? await supabase.from("areas").select("id, name").order("name")
    : { data: null };
  const { data: collections } = isAdmin
    ? await supabase
        .from("collections")
        .select("id, area_id, type, place, starts_at, note, updated_at")
        .order("starts_at", { ascending: false })
    : { data: null };

  const areaName = new Map((areas ?? []).map((area) => [area.id, area.name]));

  return (
    <main className="mx-auto w-full max-w-xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {checkFailed
              ? "Could not check access"
              : isAdmin
                ? "Admin"
                : "Not an admin"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>Signed in as {user.email}.</p>
          {checkFailed ? (
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
              <CollectionForm
                areas={areas ?? []}
                action={addCollection}
                submitLabel="Add collection"
              />
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
                        <p className="text-xs text-muted-foreground">
                          Last updated {formatDate(collection.updated_at)}
                        </p>
                        <div className="flex items-start gap-2 pt-3">
                          <Link
                            href={`/admin/collections/${collection.id}/edit`}
                            className="inline-flex h-9 items-center justify-center rounded-[var(--radius)] border border-border px-3 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <DeleteButton
                            id={collection.id}
                            place={collection.place}
                          />
                        </div>
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
