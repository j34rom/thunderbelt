# 03 — See the schedule

**What to build:** A resident picks their area and sees the upcoming
pick-ups and drop-offs for it, soonest first.

**Blocked by:** 02

**Status:** done

- [x] The `collections` table exists with Row Level Security on.
      Anyone can read; nobody can write yet.
- [x] One test collection is added through SQL.
- [x] Picking an area shows its upcoming collections, soonest first,
      with type, place, date and time, note and "last updated".
- [x] Past collections are hidden.
- [x] An area with no collections shows "No collections posted for this
      area yet."
- [x] The page is comfortable to use on a phone.
- [x] Works on the live URL
