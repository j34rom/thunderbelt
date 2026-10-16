-- Security housekeeping: write the "nobody" rule for login_attempts down.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- 010 turned Row Level Security on for login_attempts but gave it no
-- policy. That already means nobody can use the table directly, and only
-- the two functions in 010 (which run with the table owner's rights) touch
-- it. This file makes that rule explicit, as the project rules ask, and
-- stops Supabase's advisor from warning about a table with no policy.
--
-- Nothing changes in how the site works.
--
-- To undo: drop policy if exists "no direct access" on login_attempts;

drop policy if exists "no direct access" on login_attempts;
create policy "no direct access"
  on login_attempts for all
  to anon, authenticated
  using (false)
  with check (false);
