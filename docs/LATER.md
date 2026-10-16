# Later

Good ideas that are not in the MVP.

Parking something here is a decision, not a loss. It is how the MVP
stays small enough to actually ship by Session 3.

## Original problem statement (team's words, kept for reference)
Residents have a hard time fitting recycling into their routine, finding
their own route to the right bins, finding drop-off sites, the lack of
incentives and poor communication with the waste officials, resulting in
low participation and inefficient waste management.

## Parked ideas

- **Resident accounts**: email sign-up and sign-in (no password), saving
  the resident's area.
- **Progress, points and vouchers**: residents see their progress, earn
  points and redeem vouchers. Needs a way to verify drop-offs and at
  least one real partner business that honors the vouchers.
- **Incentives program page**: show the full incentives program per area
  and barangay. Needs a real program to exist first.
- **Barangay officials as admins**: let officials add schedules. Talk to
  the barangay first (who runs pick-up and drop-off, and how changes are
  announced).
- **Residents posting collections**: neighbours report truck or drop-off
  sightings.
- **Exact addresses, maps and nearest drop-off by GPS.**
- **Mobile numbers and SMS reminders.**
- **Queue tracking** for long drop-off lines.

## Parked security ideas
From the security review. None is urgent; the site is safe to demo
without them.

- **Admin two-factor sign-in.** Supabase supports an authenticator-app
  code (TOTP). Needs a code-entry step after the password. Protects the
  admin accounts if a password leaks.
- **Admin check on the edit action.** `addCollection` and
  `deleteCollection` check "is this an admin" in the app; `updateCollection`
  relies only on the database policy. Add the same `requireAdmin` check
  there without changing the form.
- **Fuller Content-Security-Policy.** Today only `frame-ancestors 'none'`
  is set. A full policy (scripts, network calls, forms) needs a per-page
  nonce in `src/proxy.ts`. Try it in report-only mode first, and switch to
  enforcing once the browser console is clean.

## Task for the team (not code)
Ask the barangay hall or the truck crew who runs the pick-up and
drop-off, and how they announce changes. About 10 minutes, and it could
turn guesswork into the real schedule.
