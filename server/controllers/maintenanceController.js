import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Asset from '../models/Asset.js';

export const createMaintenanceRequest = async (req, res) => {
  try {
    const { assetId, issueDescription, priority } = req.body;
    
    const request = new MaintenanceRequest({
      asset: assetId,
      requestedBy: req.user._id,
      issueDescription,
      priority
    });
    
    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { status, resolutionNotes, technicianAssigned } = req.body;
    const request = await MaintenanceRequest.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = status;
    if (resolutionNotes) request.resolutionNotes = resolutionNotes;
    if (technicianAssigned) request.technicianAssigned = technicianAssigned;
    
    if (status === 'Approved') {
      request.approvedBy = req.user._id;
      const asset = await Asset.findById(request.asset);
      if (asset) {
        asset.status = 'Under Maintenance';
        await asset.save();
      }
    } else if (status === 'Resolved') {
      const asset = await Asset.findById(request.asset);
      if (asset) {
        asset.status = 'Available';
        await asset.save();
      }
    }
    
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({}).populate('asset').populate('requestedBy', 'name');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
