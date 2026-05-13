import express from 'express';
import { rsvpToEvent, getMyRsvps, deleteMyRsvp } from 'rsvpsController.js';
import { requireAuth } from 'authMiddleware.js';

const router = express.Router();

router.use(requireAuth); // all routes below require login

router.post('/', rsvpToEvent);
router.get('/me', getMyRsvps);
router.delete('/event/:eventId', deleteMyRsvp);

export default router;