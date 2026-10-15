"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { deleteCollection, type DeleteState } from "./actions";

const initialState: DeleteState = { error: null };

export function DeleteButton({ id, place }: { id: string; place: string }) {
  const [state, formAction, pending] = useActionState(
    deleteCollection,
    initialState,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        // Deleting cannot be undone, so ask first.
        if (!window.confirm(`Delete "${place}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting…" : "Delete"}
      </Button>
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
