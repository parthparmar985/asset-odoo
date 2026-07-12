import Booking from '../models/Booking.js';
import Asset from '../models/Asset.js';

export const createBooking = async (req, res) => {
  try {
    const { assetId, startTime, endTime, purpose } = req.body;
    
    const asset = await Asset.findById(assetId);
    if (!asset || !asset.isShared) {
      return res.status(400).json({ message: 'Asset is not available for booking' });
    }
    
    // Check overlap
    const overlap = await Booking.findOne({
      asset: assetId,
      status: { $in: ['Upcoming', 'Ongoing'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });
    
    if (overlap) {
      return res.status(400).json({ message: 'Time slot overlaps with an existing booking' });
    }
    
    const booking = new Booking({
      asset: assetId,
      user: req.user._id,
      startTime,
      endTime,
      purpose
    });
    
    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('asset').populate('user', 'name');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
