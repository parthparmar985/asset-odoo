import mongoose from 'mongoose';

const allocationSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  allocatedToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  allocatedToDept: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expectedReturnDate: { type: Date },
  returnDate: { type: Date },
  status: { type: String, enum: ['Active', 'Returned', 'Transfer Pending'], default: 'Active' },
  checkOutNotes: { type: String },
  checkInNotes: { type: String }
}, { timestamps: true });

const Allocation = mongoose.model('Allocation', allocationSchema);
export default Allocation;
