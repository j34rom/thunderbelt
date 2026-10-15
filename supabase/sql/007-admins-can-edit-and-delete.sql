-- Ticket 06: let admins (and only admins) edit and delete collections.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.

-- 1. Table permissions (grants) ---------------------------------------
-- Signed-in people may attempt an update or delete. The policies below
-- decide whether it is actually allowed. People who are not signed in
-- get no permission at all.
grant update, delete on collections to authenticated;

-- 2. Row Level Security policies ----------------------------------------
-- Update: only admins. "using" says which existing rows you may touch,
-- "with check" says what the row may look like afterwards. Updates need
-- both. Anyone who is not an admin matches no rows.
drop policy if exists "admins can edit collections" on collections;
create policy "admins can edit collections"
  on collections for update
  to authenticated
  using (
    exists (
      select 1 from admins
      where admins.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from admins
      where admins.user_id = (select auth.uid())
    )
  );

-- Delete: only admins.
drop policy if exists "admins can delete collections" on collections;
create policy "admins can delete collections"
  on collections for delete
  to authenticated
  using (
    exists (
      select 1 from admins
      where admins.user_id = (select auth.uid())
    )
  );

-- "Last updated" changes by itself on every edit: the trigger from 004
-- sets updated_at, so nothing more is needed here.
