-- Ticket 02: the team's real areas.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- To add another area later, add a line to the list below and run this
-- file again. Areas that already exist are skipped, so it is safe to
-- re-run.

insert into areas (name) values
  ('North Fundador, Iloilo City'),
  ('South Fundador, Iloilo City'),
  ('Poblacion, Leganes, Iloilo')
on conflict (name) do nothing;
