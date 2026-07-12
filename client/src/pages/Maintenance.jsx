import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Wrench } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    assetId: '', issueDescription: '', priority: 'Medium'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [requestsRes, assetsRes] = await Promise.all([
        axios.get('/api/maintenance', config).catch(() => ({ data: [] })),
        axios.get('/api/assets', config).catch(() => ({ data: [] }))
      ]);
      setRequests(requestsRes.data);
      setAssets(assetsRes.data);
    } catch (error) {
      console.error('Error fetching data');
    }
  };

  const handleRaiseRequest = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/maintenance', formData, config);
      setShowForm(false);
      setFormData({ assetId: '', issueDescription: '', priority: 'Medium' });
      toast.success('Maintenance request raised successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error raising request');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/maintenance/${id}/status`, { status }, config);
      toast.success(`Request status updated to ${status}`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Maintenance Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Wrench size={18} /> {showForm ? 'Cancel' : 'Raise Request'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <h3>New Maintenance Request</h3>
          <form onSubmit={handleRaiseRequest} className="mt-4 grid-cols-2">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Asset</label>
              <select className="form-input" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})} required>
                <option value="">Select Asset</option>
                {assets.map(a => <option key={a._id} value={a._id}>{a.tag} - {a.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Issue Description</label>
              <textarea 
                className="form-input" 
                rows="3" 
                value={formData.issueDescription} 
                onChange={e => setFormData({...formData, issueDescription: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">Submit Request</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Asset</th>
                <th style={{ padding: '0.75rem' }}>Requested By</th>
                <th style={{ padding: '0.75rem' }}>Issue</th>
                <th style={{ padding: '0.75rem' }}>Priority</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '1.5rem', textAlign: 'center' }}>No requests found.</td></tr>
              ) : (
                requests.map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{r.asset?.tag} - {r.asset?.name}</td>
                    <td style={{ padding: '0.75rem' }}>{r.requestedBy?.name}</td>
                    <td style={{ padding: '0.75rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.issueDescription}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${r.priority === 'Critical' || r.priority === 'High' ? 'badge-danger' : 'badge-warning'}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${
                        r.status === 'Pending' ? 'badge-warning' : 
                        r.status === 'Resolved' ? 'badge-success' : 
                        r.status === 'Approved' || r.status === 'In Progress' ? 'badge-info' : 'badge-danger'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {(user?.role === 'Admin' || user?.role === 'Asset Manager') && r.status === 'Pending' && (
                        <div className="flex gap-4">
                          <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleStatusUpdate(r._id, 'Approved')}>Approve</button>
                          <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleStatusUpdate(r._id, 'Rejected')}>Reject</button>
                        </div>
                      )}
                      {(user?.role === 'Admin' || user?.role === 'Asset Manager') && r.status === 'Approved' && (
                        <button className="btn btn-info" style={{ backgroundColor: '#0EA5E9', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: 'none', borderRadius: 'var(--radius-md)' }} onClick={() => handleStatusUpdate(r._id, 'Resolved')}>Mark Resolved</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
