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
