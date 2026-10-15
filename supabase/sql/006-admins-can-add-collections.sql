-- Ticket 05: let admins (and only admins) add collections.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.

-- 1. Table permission (a "grant") -------------------------------------
-- Signed-in people may attempt an insert. Whether it is allowed is
-- decided by the policy below. People who are not signed in get no
-- insert permission at all.
grant insert on collections to authenticated;

-- 2. Row Level Security policy ------------------------------------------
-- An insert is allowed only when:
--   * the person is listed in the admins table, AND
--   * created_by is themselves (nobody can add rows in someone else's name).
-- Reading the admins table here works because each person may read their
-- own row (see 005).
drop policy if exists "admins can add collections" on collections;
create policy "admins can add collections"
  on collections for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from admins
      where admins.user_id = (select auth.uid())
    )
  );

-- Deliberately NO update or delete policy yet: that is ticket 06.
