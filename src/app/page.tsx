import Link from "next/link";
import { Check, ChevronDown, MapPin, Truck } from "lucide-react";
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

// How each type of collection looks: a coloured tag with an icon, so a
// pick-up and a drop-off can be told apart at a glance.
const TYPE_STYLES: Record<
  string,
  { icon: typeof Truck; className: string }
> = {
  pickup: {
    icon: Truck,
    className:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  },
  dropoff: {
    icon: MapPin,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
};

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

  // The list of areas. Shown on its own before an area is picked, and
  // tucked behind "Change area" afterwards.
  const areaList = error ? (
    <p className="text-sm">
      Could not load areas right now. Please try again later.
    </p>
  ) : areas.length === 0 ? (
    <p className="text-sm">No areas have been added yet.</p>
  ) : (
    <ul className="space-y-2">
      {areas.map((area) => {
        const isSelected = area.id === selected?.id;
        return (
          <li key={area.id}>
            <Link
              href={`/?area=${area.id}`}
              aria-current={isSelected ? "page" : undefined}
              className={`flex min-h-12 items-center justify-between gap-2 rounded-md border px-3 py-3 text-sm ${
                isSelected
                  ? "border-primary bg-primary/10 font-semibold"
                  : "border-border"
              }`}
            >
              {area.name}
              {isSelected && <Check className="h-4 w-4" aria-hidden />}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Recycling schedule
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick your area to see when and where to take your recyclables.
      </p>

      {selected ? (
        // Once an area is picked, keep it to one line so the schedule is
        // right below, not a scroll away on a phone.
        <Card className="mt-6">
          <CardContent className="space-y-1 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Your area
            </p>
            <p className="text-lg font-semibold leading-tight">
              {selected.name}
            </p>
            <details className="group pt-1">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm font-medium text-primary [&::-webkit-details-marker]:hidden">
                Change area
                <ChevronDown
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="mt-2">{areaList}</div>
            </details>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your area</CardTitle>
          </CardHeader>
          <CardContent>{areaList}</CardContent>
        </Card>
      )}

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
              {collections.map((collection) => {
                const style = TYPE_STYLES[collection.type];
                const Icon = style?.icon;
                return (
                  <li key={collection.id}>
                    <Card>
                      <CardHeader>
                        <span
                          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            style?.className ?? "bg-muted text-foreground"
                          }`}
                        >
                          {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
                          {COLLECTION_TYPE_LABELS[collection.type] ??
                            collection.type}
                        </span>
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
                );
              })}
            </ul>
          )}
        </section>
      )}

      <footer className="mt-10 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">About.</span> Built by
          a student team for neighbours in North Fundador, South Fundador and
          Poblacion, Leganes. We keep the schedule up to date, and every
          collection shows when it was last updated.
        </p>
        <p>
          <span className="font-medium text-foreground">Help us improve.</span>{" "}
          Tell us what works and what doesn&apos;t in a 1-minute survey.{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScJC6Kz-k9Pfb4fI1MQutjmxgHskR4do9gE4ArjdDsY6P35zw/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Take the survey
          </a>
          .
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
