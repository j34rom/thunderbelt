-- Security: slow down password guessing on the admin sign-in.
-- Run in Supabase -> SQL Editor -> New query -> paste -> Run.
--
-- The website records each WRONG password. After 5 wrong tries for one
-- email, or 20 from one visitor address, sign-in is blocked for 15
-- minutes. Emails and addresses are stored only as one-way hashes.
--
-- Trade-off: anyone who knows an admin's email could deliberately fail
-- 5 times to block that admin for 15 minutes. That is a delay, not a
-- break-in, and far better than unlimited password guessing.
--
-- To undo:
--   drop function if exists login_blocked(text, text);
--   drop function if exists login_record_failure(text, text);
--   drop table if exists login_attempts;

-- 1. The table ------------------------------------------------------
create table if not exists login_attempts (
  id          bigint generated always as identity primary key,
  key         text not null check (key ~ '^[0-9a-f]{64}$'),
  created_at  timestamptz not null default now()
);

create index if not exists login_attempts_key_time_idx
  on login_attempts (key, created_at);

-- 2. Row Level Security ---------------------------------------------
-- On, with NO policies and NO table permissions: nobody can read or
-- change this table through the website's public key. Only the two
-- functions below touch it.
alter table login_attempts enable row level security;
revoke all on login_attempts from anon, authenticated;

-- 3. The two functions ----------------------------------------------
-- "security definer" lets them use the table even though visitors
-- cannot. "set search_path = ''" is a safety setting for such functions.

create or replace function login_blocked(p_email_key text, p_ip_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.login_attempts
      where key = p_email_key
        and created_at > now() - interval '15 minutes') >= 5
    or
    (select count(*) from public.login_attempts
      where key = p_ip_key
        and created_at > now() - interval '15 minutes') >= 20;
$$;

create or replace function login_record_failure(p_email_key text, p_ip_key text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Tidy up: nothing older than a day is ever needed.
  delete from public.login_attempts where created_at < now() - interval '1 day';
  insert into public.login_attempts (key) values (p_email_key), (p_ip_key);
end;
$$;

-- 4. Who may call them ---------------------------------------------
-- The sign-in page runs before anyone is signed in, so visitors (anon)
-- must be able to call both.
revoke all on function login_blocked(text, text) from public;
revoke all on function login_record_failure(text, text) from public;
grant execute on function login_blocked(text, text) to anon, authenticated;
grant execute on function login_record_failure(text, text) to anon, authenticated;
