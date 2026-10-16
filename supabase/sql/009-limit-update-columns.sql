-- Security: admins may edit only the fields on the form.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- Before this, an admin (or someone using a stolen admin login) could also
-- rewrite id, created_by and created_at. The edit form only changes the
-- five columns below, so nothing visible changes. The "last updated" time
-- still changes by itself (the trigger from 004 sets it).
--
-- To undo: grant update on collections to authenticated;

revoke update on collections from authenticated;

grant update (area_id, type, place, starts_at, note)
  on collections to authenticated;
