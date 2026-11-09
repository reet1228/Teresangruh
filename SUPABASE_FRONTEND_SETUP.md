# Teresangruh Supabase frontend connection

This project connects the existing RSVP form and host portal to the Supabase project.

## Environment variables
Set these in Vercel for Production, Preview and Development:
- `VITE_SUPABASE_URL=https://nozhmpwfjjjddcrkqnnl.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable key>`

The client also accepts the legacy `VITE_SUPABASE_ANON_KEY` variable.

## Supabase prerequisites
The SQL setup must already have been run. It creates `public.wedding_rsvps` and the private `guest-aadhaar` bucket, and allows public RSVP inserts/uploads while restricting reads to the designated admin email.

## Admin portal
The host portal now uses Supabase email/password authentication. Sign in with `Rithhinishacr7@gmail.com` and the password configured for that Supabase Auth user. There are no hardcoded host passcodes in the frontend.

## Deployment
1. Commit/push these project changes to the GitHub repository connected to Vercel, or upload this folder to your repository.
2. Confirm the two environment variables are present in Vercel.
3. Redeploy the Vercel project.
4. Submit a test RSVP with a non-sensitive test document first.
5. Sign in to the host portal, verify the record appears, open the test file and export Excel.

Aadhaar files are stored in the private `guest-aadhaar` bucket. Admin document links expire after 60 seconds. Excel includes file names/status only, not document URLs or Aadhaar numbers.
