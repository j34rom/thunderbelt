-- Ticket 04: who is allowed to be an admin.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- Before this: public sign-ups are OFF and each admin has an account
-- under Authentication -> Users. This table is the second lock: having
-- an account is not enough, a person must also be listed here.

-- 1. The table ------------------------------------------------------

create table if not exists admins (
  user_id  uuid primary key references auth.users(id) on delete cascade
);

-- 2. Row Level Security ---------------------------------------------
alter table admins enable row level security;

-- A signed-in person may read ONLY their own row. That is how the
-- website (and, later, the collections policies) can ask "is this
-- person an admin?" without letting anyone list all admins.
drop policy if exists "admins can read their own row" on admins;
create policy "admins can read their own row"
  on admins for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 3. Table permission (a "grant") -------------------------------------
-- Read-only, and only for signed-in people. Visitors who are not signed
-- in get nothing, and nobody can add or remove admins through the
-- website: that is done in the SQL Editor only.
grant select on admins to authenticated;

-- 4. Adding an admin (do this in the SQL Editor, do NOT save emails in
--    this file) ------------------------------------------------------
--
--   insert into admins (user_id)
--   select id from auth.users
--   where email in ('first@example.com', 'second@example.com')
--   on conflict do nothing;
--
-- Replace the example emails with the real ones. To remove an admin:
--
--   delete from admins
--   where user_id = (select id from auth.users where email = 'x@example.com');
