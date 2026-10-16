# Thunderbelt — Recycling Schedule (working title)

**Live site:** https://thunderbelt-jgm3.vercel.app/

A phone-friendly website for residents who do not know when or where to
take their recyclables. A resident picks their area and sees the upcoming
pick-up and drop-off collections for it. The team (the admins) keeps the
schedule up to date.

- The problem and who it is for: [docs/PROBLEM.md](docs/PROBLEM.md)
- What we built: [docs/SPEC.md](docs/SPEC.md)
- Ideas we parked on purpose: [docs/LATER.md](docs/LATER.md)

Built for the PHINMA AI Builder Workshop with Next.js, Tailwind CSS,
Supabase and Vercel.

## How it works

- **Residents** open the home page, pick an area and read the schedule.
  They never sign in, and the site stores no personal data about them.
- **Admins** sign in at `/admin` with an email and password. They can add,
  edit and delete collections.
- **Security** is Row Level Security in the database: anyone can read areas
  and collections, but only people listed in the `admins` table can change
  collections. Nobody can change areas or admins through the website.

## Run it on your laptop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Copy `.env.example` to `.env.local` and fill in the Project URL and the
publishable key (it starts with `sb_publishable_`) from your Supabase
project (**Connect**). The key goes in `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Never commit `.env.local`, and never put a `service_role` or `sb_secret_`
key anywhere in this project.

Add the **same two variables** in Vercel (**Settings → Environment
Variables**, with **Production** ticked), then redeploy.

## Set up the database

In the Supabase dashboard, open **SQL Editor**, and run the files in
`supabase/sql/` in number order, pasting the **contents** of each file:

| File | What it does |
|------|--------------|
| `002-create-areas.sql` | the areas table (public read-only) |
| `003-seed-areas.sql` | the team's areas |
| `004-create-collections.sql` | the collections table and one test row |
| `005-create-admins.sql` | the admins table |
| `006-admins-can-add-collections.sql` | admins may add collections |
| `007-admins-can-edit-and-delete.sql` | admins may edit and delete |
| `008-limit-public-columns.sql` | the public can no longer read `created_by` (admin ids) |
| `009-limit-update-columns.sql` | admins may edit only the form's five fields |
| `010-login-attempt-limit.sql` | blocks sign-in for 15 minutes after 5 wrong passwords |

After `004`, delete the **TEST drop-off** from the Table Editor (or from
the admin page) so it does not show on the live schedule.

Then, under **Authentication**:
1. Turn **off** "Allow new users to sign up" (Sign In / Providers → Email).
2. Create an account for each admin (Users → Add user, tick Auto Confirm).
3. Make each one an admin in the SQL Editor (the exact line is at the
   bottom of `005-create-admins.sql`). Do not save email addresses in
   the repo.

## When something breaks

- **Build fails on Vercel but works locally:** run `npm run build`. It is
  the exact command Vercel runs.
- **The live site says the schedule is not available:** the environment
  variables are missing in Vercel, or you did not redeploy after adding
  them. Check the variable names letter by letter.
- **"permission denied for table" from Supabase:** the table needs a
  `grant` as well as Row Level Security. See the SQL files for the pattern.
- **An admin sees "Not an admin":** their account is not in the `admins`
  table yet.
- **`npm audit` shows warnings:** they are in the development toolchain
  only. Ignore them; the "fix" breaks the project.
