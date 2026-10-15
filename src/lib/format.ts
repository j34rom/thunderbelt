// Shared by the public schedule and the admin page, so a collection
// always looks the same in both.

export const COLLECTION_TYPE_LABELS: Record<string, string> = {
  pickup: "Pick-up",
  dropoff: "Drop-off",
};

// Times are shown in Philippine time, whatever the server's clock says.
const dateTime = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Asia/Manila",
});
const dateOnly = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeZone: "Asia/Manila",
});

export function formatDateTime(value: string) {
  return dateTime.format(new Date(value));
}

export function formatDate(value: string) {
  return dateOnly.format(new Date(value));
}

// The value a date-and-time box needs ("2026-10-17T14:00") for a stored
// time, in Philippine time. The Philippines has no daylight saving, so it
// is always exactly 8 hours ahead of UTC.
export function toManilaInputValue(value: string) {
  const manila = new Date(new Date(value).getTime() + 8 * 60 * 60 * 1000);
  return manila.toISOString().slice(0, 16);
}
