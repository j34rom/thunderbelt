# Spec: Thunderbelt — Recycling Schedule (working title)

## Problem
A resident who wants to recycle does not know when or where to take
their recyclables. Pick-up and drop-off dates keep changing, nobody can
say who runs them, so bottles get thrown around or put in one bin.

## Solution
A phone-friendly website. A resident picks their area and sees the
upcoming pick-up and drop-off collections for it: what, where and when.
The team, as admin, keeps the schedule up to date.

## The user
The **resident**: a student or neighbour living in a residential area
with little waste management. Residents only read, and never sign in.
(The **admin** is the team that built the site; it is not a second
audience, just the people who keep the data right.)

## User stories
1. As a resident, I want to pick my area, so that I only see what is
   relevant to me.
2. As a resident, I want to see upcoming pick-ups and drop-offs for my
   area, soonest first, so that I know when and where to take my
   recycling.
3. As a resident, I want to see when each collection was last updated,
   so that I know whether to trust it.
4. As a resident, I want to use the site comfortably on my phone, so
   that I can check it on the spot.
5. As an admin, I want to sign in with my email and password, so that
   only the team can change the schedule.
6. As an admin, I want to add a collection (area, type, place, date and
   time, note), so that residents see it.
7. As an admin, I want to edit or delete a collection, so that the
   schedule stays correct when dates change.

## Screens
1. **Schedule (home, public).** Pick an area from a list. See the
   upcoming collections for it, soonest first. Each shows type
   (pick-up or drop-off), place, date and time, optional note and "last
   updated". Empty state: "No collections posted for this area yet."
   Past collections are hidden.
2. **Admin sign-in.** Email and password.
3. **Admin page.** List of all collections, with a form to add one
   (area, type, place, date and time, note), plus edit and delete for
   each, and sign out. Only reachable when signed in as an admin.

Areas are added in SQL, not in the app.

## Data
All tables have Row Level Security on.

**`areas`**
- `id`, `name` (unique): a barangay, purok or street name.
- Read: anyone. Write: nobody through the website (rows are added in
  SQL).

**`collections`**
- `id`, `area_id` (links to `areas`), `type` (`pickup` or `dropoff`),
  `place` (text), `starts_at` (date and time), `note` (optional),
  `created_at`, `updated_at`, `created_by` (the admin's user id).
- Read: anyone. Insert, update, delete: only admins.

**`admins`**
- `user_id` (links to the signed-in user).
- Read: a signed-in user may read only their own row (this is how
  the database checks "is this person an admin?"). Write: nobody through
  the website (rows are added in SQL).

## Login
Supabase Auth with email and password, for admins only. Public sign-ups
are turned off in the Supabase dashboard; the team creates the admin
accounts there and lists them in `admins`. Residents never sign in.
Password login is chosen over emailed links because the free plan
limits how many emails Supabase can send, which could lock the team out
during a demo.

## Done for the demo
On the LIVE Vercel URL, on a phone:
- [ ] The Schedule page loads and the area list shows the team's areas.
- [ ] Picking an area shows its upcoming collections, soonest first.
- [ ] An area with nothing shows the empty message.
- [ ] A team member signs in at the admin page.
- [ ] They add a drop-off for Saturday 2pm and it appears on the
      Schedule page.
- [ ] They edit and delete a collection.
- [ ] Someone who is not an admin cannot add, edit or delete (checked
      by trying while signed out).
- [ ] RLS is on for all three tables (no warnings in the Table Editor).
- [ ] No service_role or `sb_secret_` key anywhere; `.env.local` is not
      committed.

## Out of scope
- Resident accounts, sign-up, saved area
- Progress tracking, points and redeemable vouchers
- The incentives program and business partners
- Barangay officials as admins
- Residents posting their own collections
- Exact home addresses, maps and GPS "nearest" search
- Mobile numbers and SMS reminders
- Queue tracking
- Editing areas in the app
