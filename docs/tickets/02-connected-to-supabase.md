# 02 — Connected to Supabase

**What to build:** The site reads real areas from the database. A
resident opening the home page sees the list of areas.

**Blocked by:** 01

**Status:** done

- [x] The Supabase URL and publishable key are set locally
      (`.env.local`) and in Vercel, and Vercel has been redeployed.
- [x] The `areas` table exists with Row Level Security on, and anyone
      can read it; nobody can write through the website.
- [x] The team's real areas are loaded through a numbered SQL file.
- [x] The home page shows the area list from the database.
- [x] No service_role or `sb_secret_` key appears anywhere.
- [x] Works on the live URL
