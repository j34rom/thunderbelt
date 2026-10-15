# 02 — Connected to Supabase

**What to build:** The site reads real areas from the database. A
resident opening the home page sees the list of areas.

**Blocked by:** 01

**Status:** todo

- [ ] The Supabase URL and publishable key are set locally
      (`.env.local`) and in Vercel, and Vercel has been redeployed.
- [ ] The `areas` table exists with Row Level Security on, and anyone
      can read it; nobody can write through the website.
- [ ] The team's real areas are loaded through a numbered SQL file.
- [ ] The home page shows the area list from the database.
- [ ] No service_role or `sb_secret_` key appears anywhere.
- [ ] Works on the live URL
