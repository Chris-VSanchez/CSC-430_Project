-- WARNING: This script deletes existing data.
-- Use this when you want to fully redo schema + RLS from scratch.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS public.rsvps CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz,
  location text,
  image text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_events_user_id ON public.events (user_id);

CREATE TABLE public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_rsvps_event_id ON public.rsvps (event_id);
CREATE INDEX idx_rsvps_user_id ON public.rsvps (user_id);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can SELECT their own events"
  ON public.events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can INSERT their own events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can DELETE their own events"
  ON public.events
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can UPDATE their own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can SELECT their own RSVPs"
  ON public.rsvps
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can INSERT their own RSVPs"
  ON public.rsvps
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can DELETE their own RSVPs"
  ON public.rsvps
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can UPDATE their own RSVPs"
  ON public.rsvps
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
