# Deployment Guide

This project is set up so the frontend and backend can run from one host.

## What the app needs

- `frontend/` is static HTML/CSS/JS.
- `backend/` is an Express server that serves the frontend and exposes `/api/events` and `/api/rsvps`.
- Supabase stores the data and auth session.

## Recommended hosting setup

Use one Node host for the full app. The simplest options are:

- Render
- Railway
- Heroku

Vercel is better for static frontends. Because this app uses an Express backend, a single Node host is the easier path.

## Backend environment variables

Set these in your host dashboard for the backend service:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `PORT`

Important:

- Keep `SUPABASE_SERVICE_ROLE_KEY` private.
- Do not commit real secret values to git.

## How to deploy

1. Push the repo to GitHub.
2. Create a new Node web service on Render or Railway.
3. Point it at the repo root, or at `backend/` if your host asks for a subdirectory.
4. Set the environment variables above.
5. Use `npm install` and `npm start` as the build/start commands if the host asks.
6. Deploy and open the provided live URL.

## How the frontend reaches the backend

The frontend already uses:

- `frontend/create.js` -> `POST /api/events`
- `frontend/events.js` -> `GET /api/events` and `DELETE /api/events/:id`
- `frontend/registration.js` -> Supabase auth

Because the backend serves the frontend, the browser and API can share the same origin in production.

## Supabase database setup

The database must already contain the `events` and `rsvps` tables.

If the SQL has already been run in Supabase, you do not need to do it again on deploy.

## Live URL

The live URL comes from the host you deploy to, not from Supabase.

Once deployed, share that URL with your team and use it for demo day.