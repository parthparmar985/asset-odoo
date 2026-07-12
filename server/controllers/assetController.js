import Asset from '../models/Asset.js';

export const getAssets = async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { tag: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};
    
    const assets = await Asset.find({ ...keyword }).populate('category', 'name').populate('department', 'name');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('category', 'name').populate('department', 'name');
    if (asset) {
      res.json(asset);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAsset = async (req, res) => {
  try {
    const { name, category, serialNumber, acquisitionDate, acquisitionCost, condition, location, isShared, department, notes } = req.body;
    
    // Auto-generate tag logic
    const count = await Asset.countDocuments();
    const tag = `AF-${(count + 1).toString().padStart(4, '0')}`;
    
    const asset = new Asset({
      tag, name, category, serialNumber, acquisitionDate, acquisitionCost, condition, location, isShared, department, notes
    });
    
    const createdAsset = await asset.save();
    res.status(201).json(createdAsset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAssetStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const asset = await Asset.findById(req.params.id);
    if (asset) {
      asset.status = status;
      const updatedAsset = await asset.save();
      res.json(updatedAsset);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
