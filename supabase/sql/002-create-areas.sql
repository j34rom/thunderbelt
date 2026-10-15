-- Ticket 02: the list of areas residents can pick from.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.

-- 1. The table ------------------------------------------------------
-- An area is a barangay, purok or street name. Never a home address.

create table if not exists areas (
  id    uuid primary key default gen_random_uuid(),
  name  text not null unique
);

-- 2. Row Level Security ---------------------------------------------
-- Turn it on first. With it on and no policies, nobody can do anything.

alter table areas enable row level security;

-- Anyone (including people who are not signed in) may read areas.
-- This is the list shown on the public home page.
-- (Dropping first means this file can be run again without an error.)
drop policy if exists "anyone can read areas" on areas;
create policy "anyone can read areas"
  on areas for select
  to anon, authenticated
  using (true);

-- Deliberately NO insert, update or delete policy: nobody can change
-- areas through the website. The team adds areas in SQL (next file).
