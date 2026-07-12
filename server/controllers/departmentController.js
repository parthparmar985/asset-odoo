import Department from '../models/Department.js';

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('head', 'name email')
      .populate('parentDepartment', 'name');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, head, parentDepartment, status } = req.body;
    const departmentExists = await Department.findOne({ name });
    if (departmentExists) return res.status(400).json({ message: 'Department already exists' });
    
    const department = new Department({ name, head, parentDepartment, status });
    const createdDepartment = await department.save();
    res.status(201).json(createdDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { name, head, parentDepartment, status } = req.body;
    const department = await Department.findById(req.params.id);
    if (department) {
      department.name = name || department.name;
      department.head = head || department.head;
      department.parentDepartment = parentDepartment || department.parentDepartment;
      department.status = status || department.status;
      const updatedDepartment = await department.save();
      res.json(updatedDepartment);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
