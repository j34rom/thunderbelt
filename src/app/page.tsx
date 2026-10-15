import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  COLLECTION_TYPE_LABELS,
  formatDate,
  formatDateTime,
} from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Public home page. A resident picks an area and sees its upcoming
// pick-ups and drop-offs. The chosen area is kept in the address
// (?area=...) so it works on any phone and can be shared as a link.

// Build the page when someone visits it, not when the site is built.
// The data lives in the database and can change, and the build should not
// need database keys just to succeed.
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  // If the site is not configured yet (for example the Supabase variables
  // are missing in Vercel), show a plain message instead of a bare 500.
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-8">
        <p className="text-sm">
          The schedule is not available right now. Please try again later.
        </p>
      </main>
    );
  }

  const { data: areas, error } = await supabase
    .from("areas")
    .select("id, name")
    .order("name");

  // Only trust an area id that is really in our list.
  const { area: areaParam } = await searchParams;
  const areaId = typeof areaParam === "string" ? areaParam : undefined;
  const selected = areas?.find((area) => area.id === areaId);

  const { data: collections, error: collectionsError } = selected
    ? await supabase
        .from("collections")
        .select("id, type, place, starts_at, note, updated_at")
        .eq("area_id", selected.id)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at")
    : { data: null, error: null };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Recycling schedule
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick your area to see when and where to take your recyclables.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your area</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm">
              Could not load areas right now. Please try again later.
            </p>
          ) : areas.length === 0 ? (
            <p className="text-sm">No areas have been added yet.</p>
          ) : (
            <ul className="space-y-2">
              {areas.map((area) => (
                <li key={area.id}>
                  <Link
                    href={`/?area=${area.id}`}
                    aria-current={area.id === selected?.id ? "page" : undefined}
                    className={`block rounded-md border border-border px-3 py-3 text-sm ${
                      area.id === selected?.id ? "font-semibold" : ""
                    }`}
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {selected && (
        <section className="mt-6" aria-label={`Collections for ${selected.name}`}>
          <h2 className="text-lg font-semibold tracking-tight">
            Upcoming in {selected.name}
          </h2>

          {collectionsError ? (
            <p className="mt-3 text-sm">
              Could not load the schedule right now. Please try again later.
            </p>
          ) : !collections || collections.length === 0 ? (
            <p className="mt-3 text-sm">
              No collections posted for this area yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {collections.map((collection) => (
                <li key={collection.id}>
                  <Card>
                    <CardHeader>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {COLLECTION_TYPE_LABELS[collection.type] ??
                          collection.type}
                      </p>
                      <CardTitle>{collection.place}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p>{formatDateTime(collection.starts_at)}</p>
                      {collection.note && <p>{collection.note}</p>}
                      <p className="text-xs text-muted-foreground">
                        Last updated {formatDate(collection.updated_at)}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <footer className="mt-10 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">About.</span> Built by
          a student team to help neighbours find out when and where to take
          their recyclables.
        </p>
        <p>
          <span className="font-medium text-foreground">Contact.</span> Know
          about a new pick-up or drop-off, or spot a wrong date? Email us at{" "}
          <a href="mailto:thunderbolt691@gmail.com" className="underline">
            thunderbolt691@gmail.com
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
