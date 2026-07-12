import Allocation from '../models/Allocation.js';
import Asset from '../models/Asset.js';

export const createAllocation = async (req, res) => {
  try {
    const { assetId, allocatedToUser, allocatedToDept, expectedReturnDate } = req.body;
    
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    
    if (asset.status === 'Allocated') {
      return res.status(400).json({ message: 'Asset is already allocated. Request transfer instead.' });
    }
    
    const allocation = new Allocation({
      asset: assetId,
      allocatedToUser,
      allocatedToDept,
      allocatedBy: req.user._id,
      expectedReturnDate
    });
    
    const createdAllocation = await allocation.save();
    
    asset.status = 'Allocated';
    await asset.save();
    
    res.status(201).json(createdAllocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const returnAsset = async (req, res) => {
  try {
    const allocation = await Allocation.findById(req.params.id);
    if (!allocation) return res.status(404).json({ message: 'Allocation not found' });
    
    const { checkInNotes, condition } = req.body;
    
    allocation.status = 'Returned';
    allocation.returnDate = new Date();
    allocation.checkInNotes = checkInNotes;
    await allocation.save();
    
    const asset = await Asset.findById(allocation.asset);
    if (asset) {
      asset.status = 'Available';
      if (condition) asset.condition = condition;
      await asset.save();
    }
    
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find({}).populate('asset').populate('allocatedToUser', 'name').populate('allocatedToDept', 'name');
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
