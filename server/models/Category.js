import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  customFields: [{ type: String }], // e.g., ['Warranty Period', 'RAM Size']
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
