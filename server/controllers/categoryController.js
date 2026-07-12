import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, customFields } = req.body;
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) return res.status(400).json({ message: 'Category already exists' });
    
    const category = new Category({ name, description, customFields });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
