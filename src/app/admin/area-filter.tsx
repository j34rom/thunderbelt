import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Area = { id: string; name: string };

// Picks which area's collections the admin list shows, like the area
// picker on the public page. The choice lives in the address (?area=...),
// so it survives a refresh. No area picked means "All areas".
export function AreaFilter({
  areas,
  selectedId,
}: {
  areas: Area[];
  selectedId: string | undefined;
}) {
  const selected = areas.find((area) => area.id === selectedId);

  const options = [
    { id: undefined, name: "All areas", href: "/admin" },
    ...areas.map((area) => ({
      id: area.id,
      name: area.name,
      href: `/admin?area=${area.id}`,
    })),
  ];

  return (
    <Card className="mt-3">
      <CardContent className="space-y-1 pt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Showing
        </p>
        <p className="text-lg font-semibold leading-tight">
          {selected?.name ?? "All areas"}
        </p>
        <details className="group pt-1">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm font-medium text-primary [&::-webkit-details-marker]:hidden">
            Change area
            <ChevronDown
              className="h-4 w-4 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <ul className="mt-2 space-y-2">
            {options.map((option) => {
              const isSelected = option.id === selected?.id;
              return (
                <li key={option.id ?? "all"}>
                  <Link
                    href={option.href}
                    aria-current={isSelected ? "page" : undefined}
                    className={`flex min-h-12 items-center justify-between gap-2 rounded-md border px-3 py-3 text-sm ${
                      isSelected
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-border"
                    }`}
                  >
                    {option.name}
                    {isSelected && <Check className="h-4 w-4" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </details>
      </CardContent>
    </Card>
  );
}
