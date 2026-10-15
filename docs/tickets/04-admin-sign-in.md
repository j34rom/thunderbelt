# 04 — Admin sign-in

**What to build:** Team members sign in with email and password and reach
the admin page. Nobody else can.

**Blocked by:** 02

**Status:** done

- [x] The `admins` table exists with Row Level Security on. A signed-in
      user can read only their own row; nobody can write through the
      website.
- [x] Public sign-ups are turned off in Supabase, the team's admin
      accounts are created in the dashboard, and each is listed in
      `admins` through SQL.
- [x] The admin sign-in screen accepts email and password.
- [x] The admin page can only be opened by a signed-in admin; anyone
      else is sent to the sign-in screen.
- [x] Sign out works.
- [x] Works on the live URL

**Follow-up (team):** only one admin account is listed in `admins` so
far. Add the other four with the insert in
`supabase/sql/005-create-admins.sql`, then check each can sign in.
