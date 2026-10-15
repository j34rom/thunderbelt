"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CollectionFormState } from "./actions";

type Area = { id: string; name: string };

// What an existing collection looks like when we edit it. The date is
// already in the form a date-and-time box needs ("2026-10-17T14:00").
type ExistingCollection = {
  id: string;
  area_id: string;
  type: string;
  place: string;
  starts_at: string;
  note: string | null;
};

const initialState: CollectionFormState = { error: null, saved: false };

// The plain browser dropdown, dressed like the other inputs.
const selectClass =
  "flex h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-base md:text-sm";

// One form for adding AND editing a collection. Pass `collection` to edit.
export function CollectionForm({
  areas,
  action,
  submitLabel,
  collection,
}: {
  areas: Area[];
  action: (
    state: CollectionFormState,
    formData: FormData,
  ) => Promise<CollectionFormState>;
  submitLabel: string;
  collection?: ExistingCollection;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // After adding, clear the form ready for the next one. (When editing, the
  // page moves back to the list instead.)
  useEffect(() => {
    if (state.saved && !collection) formRef.current?.reset();
  }, [state, collection]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {collection && <input type="hidden" name="id" value={collection.id} />}

      <div className="space-y-2">
        <Label htmlFor="area_id">Area</Label>
        <select
          id="area_id"
          name="area_id"
          required
          defaultValue={collection?.area_id ?? ""}
          className={selectClass}
        >
          <option value="">Choose an area…</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          name="type"
          required
          defaultValue={collection?.type ?? "dropoff"}
          className={selectClass}
        >
          <option value="dropoff">Drop-off (bring it somewhere)</option>
          <option value="pickup">Pick-up (the truck comes)</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="place">Place</Label>
        <Input
          id="place"
          name="place"
          required
          maxLength={200}
          defaultValue={collection?.place}
          placeholder="e.g. Barangay hall, covered court"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="starts_at">Date and time (Philippine time)</Label>
        <Input
          id="starts_at"
          name="starts_at"
          type="datetime-local"
          required
          defaultValue={collection?.starts_at}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          name="note"
          maxLength={500}
          defaultValue={collection?.note ?? ""}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.saved && !collection && (
        <p role="status" className="text-sm">
          Saved. It now shows on the public schedule.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
