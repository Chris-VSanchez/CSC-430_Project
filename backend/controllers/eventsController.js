// src/controllers/eventsController.js
import { supabase } from '../supabaseClient.js';

export const getAllEvents = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('event_date', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

export const createEvent = async (req, res) => {
  const userId = req.user.id;
  const { title, description, event_date, location, image } = req.body;

  if (!title || !event_date) {
    return res.status(400).json({ error: 'title and event_date are required' });
  }

  const { data, error } = await supabase
    .from('events')
    .insert([
      { title, description, event_date, location, image, user_id: userId }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

export const deleteEvent = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const { data: ownedEvent, error: lookupError } = await supabase
    .from('events')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (lookupError) {
    return res.status(500).json({ error: lookupError.message });
  }

  if (!ownedEvent) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(204).send();
};

