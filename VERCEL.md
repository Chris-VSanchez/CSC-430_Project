# Deploy to Vercel

This app is now configured for Vercel. The frontend uses Supabase SDK directly (no backend API).

## Quick Start

1. **Run RLS SQL in Supabase** (one time only)
   - Open Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `sql/enable_rls.sql`
   - Run the SQL block
   - This locks down the events table so users only see/modify their own events

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Refactor for Vercel: use Supabase SDK directly"
   git push
   ```

3. **Connect repo to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Select your GitHub repo (Chris-VSanchez/CSC-430_Project)
   - Click "Import"

4. **Set project settings in Vercel**
   - Framework Preset: Other
   - Root Directory: leave as the repo root
   - Build Command: leave empty
   - Output Directory: leave empty
   - The included `vercel.json` redirects `/` to `frontend/index.html` and maps the top-level HTML pages into the frontend folder

5. **Deploy**
   - Click "Deploy"
   - Vercel gives you a live URL like `csc-430-project.vercel.app`

6. **Your app is live!**
   - Team opens the Vercel URL
   - Auth is via Supabase (email/password sign-in on `registration.html`)
   - All data is read directly from Supabase with RLS protecting access

## Architecture

- **Frontend**: `frontend/` contains all HTML, CSS, JS files. Vercel serves the app through redirect rules in `vercel.json`.
- **Auth**: Supabase (email/password via `registration.html`)
- **Database**: Supabase (Postgres) with RLS policies so users only see their own events
- **Backend**: None needed. Frontend talks directly to Supabase.

## Environment Variables (if needed)

No environment variables required for this setup. Supabase URL and Anon Key are already in `frontend/create.js` and `frontend/events.js`.

## Troubleshooting

- **"Events not appearing"**: Check that RLS SQL was run in Supabase. Without RLS policies, the app won't have permission to read/write.
- **"Cannot sign in"**: Confirm Supabase auth is enabled in the Supabase dashboard.
- **CORS errors**: Should not happen since frontend talks directly to Supabase, not an API.
