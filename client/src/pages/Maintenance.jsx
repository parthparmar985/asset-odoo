import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Wrench, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const COLUMNS = ['Pending', 'Approved', 'In Progress', 'Resolved'];

const colStyle = {
  Pending:     { bg: '#FFF8D6', border: '#FFCE20', dot: '#FFCE20', cls: 'badge-warning' },
  Approved:    { bg: '#E1F4FF', border: '#39B8FF', dot: '#39B8FF', cls: 'badge-primary' },
  'In Progress': { bg: '#F5F3FF', border: '#8B5CF6', dot: '#8B5CF6', cls: 'badge-primary' },
  Resolved:    { bg: '#E2F9F1', border: '#10B981', dot: '#10B981', cls: 'badge-success' },
};

const priorityColor = { Low: '#A3AED0', Medium: '#FFCE20', High: '#EE5D50', Critical: '#DC2626' };

const Maintenance = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [myAssets, setMyAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ assetId: '', issueDescription: '', priority: 'Low' });
  const isManager = ['Admin', 'Asset Manager'].includes(user?.role);

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/maintenance', cfg);
      setRequests(isManager ? data : data.filter(r => r.requestedBy?._id === user._id));
      if (!isManager) {
        const aRes = await axios.get('/api/allocations', cfg).catch(() => ({ data: [] }));
        setMyAssets(aRes.data.filter(a => a.status === 'Active' && a.allocatedToUser?._id === user._id).map(a => a.asset).filter(Boolean));
      }
    } catch { toast.error('Failed to fetch maintenance data'); }
  };

  const handleRaise = async (e) => {
    e.preventDefault();
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/maintenance', formData, cfg);
      setShowForm(false);
      setFormData({ assetId: '', issueDescription: '', priority: 'Low' });
      toast.success('Maintenance request submitted!');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit request'); }
  };

  const handleStatus = async (id, status) => {
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/maintenance/${id}`, { status }, cfg);
      toast.success(`Marked as ${status}`);
      fetchData();
    } catch { toast.error('Status update failed'); }
  };

  const colRequests = (col) => requests.filter(r => r.status === col);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.6rem', margin: 0 }}>Maintenance</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Track and manage asset maintenance requests</p>
        </div>
        {!isManager && (
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            <Plus size={16} /> Raise Request
          </button>
        )}
      </div>

      {/* Request Form */}
      {showForm && !isManager && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={18} color="var(--primary-color)" /> New Maintenance Request
          </h3>
          <form onSubmit={handleRaise} style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Asset</label>
              <select className="form-input" required value={formData.assetId} onChange={e => setFormData({ ...formData, assetId: e.target.value })}>
                <option value="">Select your asset...</option>
                {myAssets.map(a => <option key={a._id || a} value={a._id || a}>{a.name || 'Asset'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Issue Description</label>
              <textarea className="form-input" rows={3} required style={{ resize: 'none' }}
                placeholder="Describe the issue in detail..." value={formData.issueDescription}
                onChange={e => setFormData({ ...formData, issueDescription: e.target.value })} />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">Submit Request</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
        {COLUMNS.map(col => {
          const items = colRequests(col);
          const cs = colStyle[col];
          return (
            <div key={col}>
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: cs.dot }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{col}</span>
                <span style={{ marginLeft: 'auto', backgroundColor: cs.bg, color: cs.dot, border: `1px solid ${cs.border}`, borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700, padding: '0.1rem 0.5rem' }}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {items.map(req => (
                  <div key={req._id} className="card" style={{ padding: '1rem', borderLeft: `4px solid ${cs.dot}`, borderRadius: '14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                      {req.asset?.name || 'Asset'}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.6rem', lineHeight: 1.5 }}>
                      {req.issueDescription || '—'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: priorityColor[req.priority] || 'var(--text-muted)' }}>
                        ● {req.priority || 'Low'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {req.createdAt ? format(new Date(req.createdAt), 'dd MMM') : ''}
                      </span>
                    </div>
                    {req.requestedBy?.name && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>By {req.requestedBy.name}</div>
                    )}
                    {/* Manager Actions */}
                    {isManager && col !== 'Resolved' && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {col === 'Pending' && (
                          <button onClick={() => handleStatus(req._id, 'Approved')} className="btn btn-primary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.73rem', borderRadius: '8px' }}>Approve</button>
                        )}
                        {col === 'Approved' && (
                          <button onClick={() => handleStatus(req._id, 'In Progress')} className="btn btn-primary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.73rem', borderRadius: '8px' }}>Start</button>
                        )}
                        {col === 'In Progress' && (
                          <button onClick={() => handleStatus(req._id, 'Resolved')} className="btn btn-primary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.73rem', borderRadius: '8px', backgroundColor: 'var(--success)' }}>Resolve</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1.5px dashed var(--border-color)', borderRadius: '14px' }}>
                    No {col.toLowerCase()} requests
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Maintenance;
