# 03 — See the schedule

**What to build:** A resident picks their area and sees the upcoming
pick-ups and drop-offs for it, soonest first.

**Blocked by:** 02

**Status:** todo

- [ ] The `collections` table exists with Row Level Security on.
      Anyone can read; nobody can write yet.
- [ ] One test collection is added through SQL.
- [ ] Picking an area shows its upcoming collections, soonest first,
      with type, place, date and time, note and "last updated".
- [ ] Past collections are hidden.
- [ ] An area with no collections shows "No collections posted for this
      area yet."
- [ ] The page is comfortable to use on a phone.
- [ ] Works on the live URL
