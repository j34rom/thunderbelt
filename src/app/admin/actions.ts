"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin";
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

export type CollectionFormState = { error: string | null; saved: boolean };
export type DeleteState = { error: string | null };

// Reads and checks the collection form. Adding and editing share this, so
// both follow the same rules. The database checks again either way.
function readCollectionForm(formData: FormData) {
  const areaId = String(formData.get("area_id") ?? "");
  const type = String(formData.get("type") ?? "");
  const place = String(formData.get("place") ?? "").trim();
  const startsAtLocal = String(formData.get("starts_at") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!areaId) return { error: "Choose an area." };
  if (type !== "pickup" && type !== "dropoff") {
    return { error: "Choose pick-up or drop-off." };
  }
  if (!place) return { error: "Enter the place." };
  if (place.length > 200) {
    return { error: "The place is too long (200 letters at most)." };
  }
  if (note.length > 500) {
    return { error: "The note is too long (500 letters at most)." };
  }

  // The date box gives "2026-10-17T14:00". The team enters Philippine time,
  // so we say so (+08:00) before storing it.
  const startsAt = new Date(`${startsAtLocal}:00+08:00`);
  if (!startsAtLocal || Number.isNaN(startsAt.getTime())) {
    return { error: "Enter a valid date and time." };
  }

  return {
    values: {
      area_id: areaId,
      type,
      place,
      starts_at: startsAt.toISOString(),
      note: note || null,
    },
  };
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}

// A second lock for adding and deleting: signed in AND listed as an admin.
// Row Level Security in the database still checks again. Returns null for
// anyone who is not an admin.
async function requireAdmin() {
  const { supabase, user, isAdmin } = await getAdminContext();
  return isAdmin ? { supabase, user } : null;
}

const NOT_ADMIN = "Only admins can do this.";

const SAVE_FAILED = "Could not save. Make sure you are signed in as an admin.";

// Adds one collection. Row Level Security only lets admins insert.
export async function addCollection(
  _previous: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  const form = readCollectionForm(formData);
  if (!form.values) return { error: form.error, saved: false };

  const admin = await requireAdmin();
  if (!admin) return { error: NOT_ADMIN, saved: false };

  const { error } = await admin.supabase
    .from("collections")
    .insert({ ...form.values, created_by: admin.user.id });

  if (error) return { error: SAVE_FAILED, saved: false };

  revalidatePath("/admin");
  revalidatePath("/");
  return { error: null, saved: true };
}

// Saves changes to one collection, then returns to the admin list.
export async function updateCollection(
  _previous: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  const id = String(formData.get("id") ?? "");
  const form = readCollectionForm(formData);
  if (!form.values) return { error: form.error, saved: false };

  const { supabase } = await requireUser();
  // .select() hands back the rows that changed. If Row Level Security
  // refused the change, the database does not complain; it simply changes
  // nothing, so we check that a row really came back.
  const { data, error } = await supabase
    .from("collections")
    .update(form.values)
    .eq("id", id)
    .select("id");

  if (error || !data || data.length === 0) {
    return { error: SAVE_FAILED, saved: false };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// Deletes one collection. Row Level Security only lets admins delete.
export async function deleteCollection(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  const id = String(formData.get("id") ?? "");

  const admin = await requireAdmin();
  if (!admin) return { error: NOT_ADMIN };

  const { data, error } = await admin.supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !data || data.length === 0) {
    return { error: "Could not delete. Make sure you are signed in as an admin." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { error: null };
}
