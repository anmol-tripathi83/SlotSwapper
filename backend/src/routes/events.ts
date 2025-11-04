import express from 'express';
import { createEvent, getMyEvents, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createEvent);
router.get('/my-events', authenticate, getMyEvents);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;