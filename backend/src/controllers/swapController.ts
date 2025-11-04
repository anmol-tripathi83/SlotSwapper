import { Response } from 'express';
import Event from '../models/Event';
import SwapRequest from '../models/SwapRequest';
import { AuthRequest } from '../middleware/auth';

export const getSwappableSlots = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const swappableSlots = await Event.find({
      status: 'SWAPPABLE',
      userId: { $ne: userId }
    }).populate('userId', 'name email');

    res.json(swappableSlots);
    return;
  } catch (error) {
    console.error('Get swappable slots error:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const createSwapRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    const requesterUserId = req.user?.userId;

    if (!requesterUserId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Verify both slots exist and are SWAPPABLE
    const [mySlot, theirSlot] = await Promise.all([
      Event.findOne({ _id: mySlotId, userId: requesterUserId, status: 'SWAPPABLE' }),
      Event.findOne({ _id: theirSlotId, status: 'SWAPPABLE' })
    ]);

    if (!mySlot) {
      res.status(404).json({ message: 'Your slot not found or not swappable' });
      return;
    }

    if (!theirSlot) {
      res.status(404).json({ message: 'Their slot not found or not swappable' });
      return;
    }

    if (theirSlot.userId.toString() === requesterUserId) {
      res.status(400).json({ message: 'Cannot swap with your own slot' });
      return;
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      requesterSlotId: mySlotId,
      requesteeSlotId: theirSlotId,
      status: 'PENDING',
      requesterUserId,
      requesteeUserId: theirSlot.userId
    });

    await swapRequest.save();

    // Update both slots to SWAP_PENDING
    await Promise.all([
      Event.findByIdAndUpdate(mySlotId, { status: 'SWAP_PENDING' }),
      Event.findByIdAndUpdate(theirSlotId, { status: 'SWAP_PENDING' })
    ]);

    // Populate the response with slot details
    await swapRequest.populate('requesterSlotId');
    await swapRequest.populate('requesteeSlotId');
    await swapRequest.populate('requesterUserId', 'name email');
    await swapRequest.populate('requesteeUserId', 'name email');

    res.status(201).json(swapRequest);
    return;
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const respondToSwapRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const swapRequest = await SwapRequest.findById(requestId)
      .populate('requesterSlotId')
      .populate('requesteeSlotId');

    if (!swapRequest) {
      res.status(404).json({ message: 'Swap request not found' });
      return;
    }

    if (swapRequest.requesteeUserId.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to respond to this request' });
      return;
    }

    if (swapRequest.status !== 'PENDING') {
      res.status(400).json({ message: 'Swap request already processed' });
      return;
    }

    if (accept) {
      // ACCEPT: Swap the owners
      swapRequest.status = 'ACCEPTED';
      await swapRequest.save();

      // Swap the user IDs of the two events
      await Promise.all([
        Event.findByIdAndUpdate(swapRequest.requesterSlotId._id, {
          userId: swapRequest.requesteeUserId,
          status: 'BUSY'
        }),
        Event.findByIdAndUpdate(swapRequest.requesteeSlotId._id, {
          userId: swapRequest.requesterUserId,
          status: 'BUSY'
        })
      ]);

      res.json({ message: 'Swap accepted successfully', swapRequest });
      return;
    } else {
      // REJECT: Reset slots back to SWAPPABLE
      swapRequest.status = 'REJECTED';
      await swapRequest.save();

      await Promise.all([
        Event.findByIdAndUpdate(swapRequest.requesterSlotId._id, { status: 'SWAPPABLE' }),
        Event.findByIdAndUpdate(swapRequest.requesteeSlotId._id, { status: 'SWAPPABLE' })
      ]);

      res.json({ message: 'Swap rejected', swapRequest });
      return;
    }
  } catch (error) {
    console.error('Respond to swap request error:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const getMySwapRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const [incomingRequests, outgoingRequests] = await Promise.all([
      // Requests where current user is the requestee
      SwapRequest.find({ requesteeUserId: userId })
        .populate('requesterSlotId')
        .populate('requesteeSlotId')
        .populate('requesterUserId', 'name email')
        .populate('requesteeUserId', 'name email')
        .sort({ createdAt: -1 }),
      
      // Requests where current user is the requester
      SwapRequest.find({ requesterUserId: userId })
        .populate('requesterSlotId')
        .populate('requesteeSlotId')
        .populate('requesterUserId', 'name email')
        .populate('requesteeUserId', 'name email')
        .sort({ createdAt: -1 })
    ]);

    res.json({
      incomingRequests,
      outgoingRequests
    });
    return;
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};