import express from 'express';
import { 
  getSwappableSlots, 
  createSwapRequest, 
  respondToSwapRequest, 
  getMySwapRequests 
} from '../controllers/swapController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/swappable-slots', authenticate, getSwappableSlots);
router.post('/swap-request', authenticate, createSwapRequest);
router.post('/swap-response/:requestId', authenticate, respondToSwapRequest);
router.get('/my-swap-requests', authenticate, getMySwapRequests);

export default router;