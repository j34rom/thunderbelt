-- Ticket 03: collections (pick-ups and drop-offs) for each area.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.

-- 1. The table ------------------------------------------------------
-- A collection is one scheduled pick-up (the truck comes to you) or
-- drop-off (you bring your recyclables somewhere).

create table if not exists collections (
  id          uuid primary key default gen_random_uuid(),
  area_id     uuid not null references areas(id) on delete cascade,
  type        text not null check (type in ('pickup', 'dropoff')),
  place       text not null,
  starts_at   timestamptz not null,
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id) default auth.uid()
);

-- Makes "show this area's upcoming collections" fast.
create index if not exists collections_area_starts_idx
  on collections (area_id, starts_at);

-- 2. Keep "last updated" honest ---------------------------------------
-- Every time a row is edited, the database sets updated_at itself, so
-- nobody has to remember to.

create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists collections_set_updated_at on collections;
create trigger collections_set_updated_at
  before update on collections
  for each row execute function set_updated_at();

-- 3. Row Level Security ---------------------------------------------
alter table collections enable row level security;

-- Anyone, signed in or not, may read collections.
drop policy if exists "anyone can read collections" on collections;
create policy "anyone can read collections"
  on collections for select
  to anon, authenticated
  using (true);

-- 4. Table permission (a "grant") -------------------------------------
-- Read-only for the website's roles. Adding, editing and deleting come
-- later, for admins only (tickets 04 and 05), with their own policies.
grant select on collections to anon, authenticated;

-- 5. One TEST collection -----------------------------------------------
-- So you can see the schedule working. It is clearly labelled. Delete it
-- from the Table Editor once you add real ones.
insert into collections (area_id, type, place, starts_at, note)
select id, 'dropoff', 'TEST drop-off point (delete me)',
       now() + interval '3 days', 'This is a test entry.'
from areas
where name = 'North Fundador, Iloilo City'
  and not exists (
    select 1 from collections where place = 'TEST drop-off point (delete me)'
  );
