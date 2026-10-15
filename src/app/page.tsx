import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Public home page. For now it lists the areas stored in the database.
// Ticket 03 turns each area into a link that shows its collections.

// Build the page when someone visits it, not when the site is built.
// The areas live in the database and can change, and the build should not
// need database keys just to succeed.
export const dynamic = "force-dynamic";

export default async function Home() {
  // TEMP DIAGNOSTIC: show the setup error on the page instead of a bare 500.
  let supabase;
  try {
    supabase = await createClient();
  } catch (e) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-8">
        <p className="text-sm">
          {e instanceof Error ? e.message : "Setup error."}
        </p>
      </main>
    );
  }
  const { data: areas, error } = await supabase
    .from("areas")
    .select("id, name")
    .order("name");

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
          <CardTitle>Areas</CardTitle>
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
                <li key={area.id}>{area.name}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
