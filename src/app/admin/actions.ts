"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { error: string | null };

// Signs an admin in with email and password. Runs on the server, so the
// password is only ever sent to Supabase.
export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Same message for a wrong email and a wrong password, on purpose.
    return { error: "Email or password is incorrect." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export type AddCollectionState = { error: string | null; saved: boolean };

// Adds one collection. Everything the admin typed is checked here, and the
// database checks again: Row Level Security only lets admins insert.
export async function addCollection(
  _previous: AddCollectionState,
  formData: FormData,
): Promise<AddCollectionState> {
  const areaId = String(formData.get("area_id") ?? "");
  const type = String(formData.get("type") ?? "");
  const place = String(formData.get("place") ?? "").trim();
  const startsAtLocal = String(formData.get("starts_at") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!areaId) return { error: "Choose an area.", saved: false };
  if (type !== "pickup" && type !== "dropoff") {
    return { error: "Choose pick-up or drop-off.", saved: false };
  }
  if (!place) return { error: "Enter the place.", saved: false };
  if (place.length > 200) {
    return { error: "The place is too long (200 letters at most).", saved: false };
  }
  if (note.length > 500) {
    return { error: "The note is too long (500 letters at most).", saved: false };
  }

  // The date box gives "2026-10-17T14:00". The team enters Philippine time,
  // so we say so (+08:00) before storing it.
  const startsAt = new Date(`${startsAtLocal}:00+08:00`);
  if (!startsAtLocal || Number.isNaN(startsAt.getTime())) {
    return { error: "Enter a valid date and time.", saved: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { error } = await supabase.from("collections").insert({
    area_id: areaId,
    type,
    place,
    starts_at: startsAt.toISOString(),
    note: note || null,
    created_by: user.id,
  });

  if (error) {
    // Most likely: this account is not an admin, or the area does not exist.
    return {
      error: "Could not save. Make sure you are signed in as an admin.",
      saved: false,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { error: null, saved: true };
}
