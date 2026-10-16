import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminContext } from "@/lib/admin";
import { toManilaInputValue } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateCollection } from "../../../actions";
import { CollectionForm } from "../../../collection-form";

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({
  params,
}: PageProps<"/admin/collections/[id]/edit">) {
  const { id } = await params;
  const { supabase, isAdmin } = await getAdminContext();

  // Only admins edit. Everyone else goes back to the admin page, which
  // explains why they cannot.
  if (!isAdmin) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-8">
        <p className="text-sm">
          This account is not an admin, so it cannot edit collections.{" "}
          <Link href="/admin" className="underline">
            Back
          </Link>
        </p>
      </main>
    );
  }

  const [
    { data: areas, error: areasError },
    { data: collection, error: collectionError },
  ] = await Promise.all([
    supabase.from("areas").select("id, name").order("name"),
    supabase
      .from("collections")
      .select("id, area_id, type, place, starts_at, note")
      .eq("id", id)
      .maybeSingle(),
  ]);

  // A failed lookup is not the same as a missing row.
  if (areasError || collectionError) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-8">
        <p role="alert" className="text-sm">
          Could not load this collection. Please refresh and try again.{" "}
          <Link href="/admin" className="underline">
            Back
          </Link>
        </p>
      </main>
    );
  }

  // A made-up or already-deleted id.
  if (!collection) notFound();

  return (
    <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-8">
      <Link href="/admin" className="text-sm underline">
        ← Back to all collections
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit collection</CardTitle>
        </CardHeader>
        <CardContent>
          <CollectionForm
            areas={areas ?? []}
            action={updateCollection}
            submitLabel="Save changes"
            collection={{
              ...collection,
              starts_at: toManilaInputValue(collection.starts_at),
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
