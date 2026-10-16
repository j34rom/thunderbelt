# Demo day checklist

One page. Print it or keep it on your phone. No passwords in this file.

- **Live site:** https://thunderbelt-jgm3.vercel.app/
- **Admin sign-in:** https://thunderbelt-jgm3.vercel.app/admin
- **Pitch:** [PITCH.md](PITCH.md)

## The day before

- [ ] Open the live site on your phone. Do you see your three areas?
- [ ] Open the Supabase dashboard. If it says the project is **paused**,
      click **Restore** and wait a couple of minutes. (Free projects pause
      after about a week without activity.)
- [ ] Sign in at `/admin` with an admin account. Do you see the **Admin**
      card? Sign out again.
- [ ] Delete the **TEST drop-off** in North Fundador.
- [ ] Make sure every admin who will be at the demo has signed in at least
      once and can see the Admin card.
- [ ] Save the Supabase, Vercel and GitHub logins somewhere you can reach
      from any device (a password manager, not a text file in this repo).
- [ ] Turn on two-step verification for GitHub, Vercel and Supabase.
- [ ] Check the clock on the demo laptop and phone is set to "automatic". A
      clock that is hours off keeps signing admins out.
- [ ] Clear old wrong-password tries: in the Supabase SQL Editor, run
      `delete from login_attempts;`
- [ ] Ask three to five neighbours where they put their bottle and whether
      they know the next drop-off. Write down what they say.
- [ ] Practise the pitch out loud, with a timer.

## One hour before

- [ ] Phone charged, and brightness up.
- [ ] Open the live site on the phone and on the laptop. Both load?
- [ ] Sign in as admin on the device you will demo on, and leave it signed in.
- [ ] Do **not** add real-looking fake data. Only enter schedules you
      actually know.
- [ ] Have the pitch open, and the live URL ready to type or share.

## The demo, in order (about three minutes)

1. Open the home page on your phone. Say who it is for.
2. Pick an area. Show the upcoming schedule.
3. Pick an area with nothing. Show the friendly empty message.
4. Go to `/admin`. Add a drop-off for Saturday at 2 PM in your area.
5. Go back to the home page, pick the same area, and show it at the top.
6. Edit it (change the place), then delete it, if there is time.
7. Scroll to the footer: the contact email, so residents can send updates.

## If something goes wrong

| What you see | What to do |
|---|---|
| "The schedule is not available right now" | Supabase may be paused. Open the Supabase dashboard and click **Restore**. If it is not paused, check Vercel's environment variables (see README). |
| An area shows no collections | The date may be in the past. Past collections are hidden. Add a future one. |
| Admin says "Not an admin" | That account is not in the `admins` table. Use the account that works, and fix the others later (README, "Set up the database"). |
| Sign-in fails | Check the email and password. A wrong password and a wrong email show the same message on purpose. |
| "Too many failed attempts" | Five wrong passwords for one email block it for 15 minutes. To lift it now, run `delete from login_attempts;` in the Supabase SQL Editor. |
| Admin keeps signing you out | The device's clock is probably wrong. Set the date, time and time zone to automatic. |
| No Wi-Fi | Use your phone's mobile data. If there is no signal at all, show screenshots of the working site and say it is live. Keep screenshots saved on your phone. |
| The site is down and you cannot fix it | Stay calm. Explain the problem, show screenshots, and give the live URL. A working live site matters, but the problem and the person matter more. |

## Backup plan

Before the demo, take screenshots on your phone of:
- the home page with an area selected and a schedule showing
- the empty-area message
- the admin page with the Add form
- the footer

## Questions you may get

Answers are in [PITCH.md](PITCH.md), under "Hard questions". The two to
be readiest for are "Is this a real problem, or just yours?" and "Where
does the schedule come from?"
