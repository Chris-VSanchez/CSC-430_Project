-- Enable RLS on events and rsvps tables
-- Safe to run multiple times

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can SELECT their own events" ON public.events;
DROP POLICY IF EXISTS "Users can INSERT their own events" ON public.events;
DROP POLICY IF EXISTS "Users can DELETE their own events" ON public.events;
DROP POLICY IF EXISTS "Users can UPDATE their own events" ON public.events;

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

DROP POLICY IF EXISTS "Users can SELECT their own RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Users can INSERT their own RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Users can DELETE their own RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Users can UPDATE their own RSVPs" ON public.rsvps;

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
