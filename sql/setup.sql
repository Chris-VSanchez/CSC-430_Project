-- SQL setup for CSC-430_Project
-- Creates `events` and `rsvps` tables and recommended RLS policies
-- Run this in the Supabase SQL editor. It is idempotent where possible.

-- enable uuid generator
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- EVENTS table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz,
  location text,
  image text,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events (user_id);

-- Add FK to auth.users if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'events_user_id_fkey' AND table_name = 'events'
  ) THEN
    ALTER TABLE public.events
      ADD CONSTRAINT events_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- RSVPS table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  user_id uuid,
  status text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON public.rsvps (event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user_id ON public.rsvps (user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'rsvps_event_id_fkey' AND table_name = 'rsvps'
  ) THEN
    ALTER TABLE public.rsvps
      ADD CONSTRAINT rsvps_event_id_fkey
      FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'rsvps_user_id_fkey' AND table_name = 'rsvps'
  ) THEN
    ALTER TABLE public.rsvps
      ADD CONSTRAINT rsvps_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- RLS is not applied in this schema file.
-- After running this file, run `sql/enable_rls.sql` to enable and create policies.
