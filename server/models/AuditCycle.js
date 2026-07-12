import mongoose from 'mongoose';

const auditCycleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  departmentScope: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  assignedAuditors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  items: [{
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
    status: { type: String, enum: ['Pending', 'Verified', 'Missing', 'Damaged'], default: 'Pending' },
    notes: { type: String }
  }]
}, { timestamps: true });

const AuditCycle = mongoose.model('AuditCycle', auditCycleSchema);
export default AuditCycle;
