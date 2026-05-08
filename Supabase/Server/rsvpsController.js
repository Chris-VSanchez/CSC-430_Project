// src/controllers/rsvpsController.js
import { supabase } from '../supabaseClient.js';

export const rsvpToEvent = async (req, res) => {
  const { event_id, status } = req.body;
  const userId = req.user.id;

  if (!event_id || !status) {
    return res.status(400).json({ error: 'event_id and status are required' });
  }

  if (!['yes', 'no'].includes(status)) {
    return res.status(400).json({ error: 'status must be yes or no' });
  }

  const { data, error } = await supabase
    .from('rsvps')
    .upsert(
      [{ event_id, user_id: userId, status }],
      { onConflict: 'event_id,user_id' }
    )
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

export const getMyRsvps = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('rsvps')
    .select('id, status, created_at, event_id')
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const deleteMyRsvp = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.params;

  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
};