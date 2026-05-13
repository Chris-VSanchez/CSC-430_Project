import express from 'express';
import { getAllEvents, createEvent, deleteEvent } from 'eventsController.js';
import { requireAuth } from 'authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getAllEvents);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);

export default router;