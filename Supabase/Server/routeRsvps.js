// src/routes/rsvps.js
import express from 'express';
import { rsvpToEvent, getMyRsvps, deleteMyRsvp } from 'rsvpsController.js';
import { requireAuth } from 'authMiddleware.js';

const router = express.Router();

router.use(requireAuth); // all routes below require login

router.post('/', rsvpToEvent);              // create/update own RSVP
router.get('/me', getMyRsvps);              // list own RSVPs
router.delete('/event/:eventId', deleteMyRsvp); // delete own RSVP for an event

export default router;