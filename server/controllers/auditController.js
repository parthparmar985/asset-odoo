import AuditCycle from '../models/AuditCycle.js';

export const createAuditCycle = async (req, res) => {
  try {
    const { name, departmentScope, startDate, endDate, assignedAuditors } = req.body;
    const audit = new AuditCycle({
      name, departmentScope, startDate, endDate, assignedAuditors
    });
    
    const createdAudit = await audit.save();
    res.status(201).json(createdAudit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuditCycles = async (req, res) => {
  try {
    const audits = await AuditCycle.find({}).populate('departmentScope', 'name').populate('assignedAuditors', 'name');
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
