import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  tag: { type: String, required: true, unique: true }, // e.g., AF-0001
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  serialNumber: { type: String },
  acquisitionDate: { type: Date },
  acquisitionCost: { type: Number },
  condition: { type: String, enum: ['New', 'Good', 'Fair', 'Poor', 'Broken'], default: 'Good' },
  location: { type: String },
  isShared: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed'], 
    default: 'Available' 
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  photoUrl: { type: String },
  notes: { type: String }
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
