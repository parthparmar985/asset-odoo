import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parentDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
