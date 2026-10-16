-- Security: stop the public from reading who created each collection.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- Before this, anyone with the site's public key could ask the database
-- for the created_by column and learn the admins' account ids. The public
-- pages never show it, so the public only needs the columns below.
-- Signed-in admins keep full read access (see 004).

revoke select on collections from anon;

grant select (id, area_id, type, place, starts_at, note, updated_at)
  on collections to anon;
