import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'], default: 'Upcoming' },
  purpose: { type: String }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
