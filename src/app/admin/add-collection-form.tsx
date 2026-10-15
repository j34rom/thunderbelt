"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addCollection, type AddCollectionState } from "./actions";

type Area = { id: string; name: string };

const initialState: AddCollectionState = { error: null, saved: false };

// The plain browser dropdown, dressed like the other inputs.
const selectClass =
  "flex h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-base md:text-sm";

export function AddCollectionForm({ areas }: { areas: Area[] }) {
  const [state, formAction, pending] = useActionState(
    addCollection,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form after a successful save, ready for the next one.
  useEffect(() => {
    if (state.saved) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="area_id">Area</Label>
        <select id="area_id" name="area_id" required className={selectClass}>
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
        <select id="type" name="type" required className={selectClass}>
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
          placeholder="e.g. Barangay hall, covered court"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="starts_at">Date and time (Philippine time)</Label>
        <Input id="starts_at" name="starts_at" type="datetime-local" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea id="note" name="note" maxLength={500} />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.saved && (
        <p role="status" className="text-sm">
          Saved. It now shows on the public schedule.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Add collection"}
      </Button>
    </form>
  );
}
