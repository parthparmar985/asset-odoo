import mongoose from 'mongoose';

const maintenanceRequestSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDescription: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'In Progress', 'Resolved'], default: 'Pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  technicianAssigned: { type: String },
  resolutionNotes: { type: String },
  photoUrl: { type: String }
}, { timestamps: true });

const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
export default MaintenanceRequest;
