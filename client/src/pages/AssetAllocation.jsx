import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { ArrowRightLeft, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AssetAllocation = () => {
  const { user } = useContext(AuthContext);
  const [allocations, setAllocations] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [reason, setReason] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const [aRes, asRes, uRes] = await Promise.all([
        axios.get('/api/allocations', cfg),
        axios.get('/api/assets', cfg),
        axios.get('/api/auth/users', cfg),
      ]);
      setAllocations(aRes.data);
      setAssets(asRes.data);
      setUsers(uRes.data);
    } catch { toast.error('Failed to fetch data'); }
  };

  const selectedAsset = assets.find(a => a._id === selectedAssetId);
  const activeAlloc = selectedAsset ? allocations.find(a => (a.asset?._id === selectedAssetId || a.asset === selectedAssetId) && a.status === 'Active') : null;
  const isConflict = !!activeAlloc;

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedAssetId) { toast.error('Please select an asset'); return; }
    if (!transferTo) { toast.error('Please select an employee'); return; }
    if (isConflict) { toast.success('Transfer request submitted!'); setTransferTo(''); setReason(''); return; }
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/allocations', { assetId: selectedAssetId, allocatedToUser: transferTo, expectedReturnDate }, cfg);
      toast.success('Asset allocated successfully!');
      setSelectedAssetId(''); setTransferTo(''); setExpectedReturnDate('');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Allocation failed'); }
  };

  const handleReturn = async (allocId) => {
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/allocations/${allocId}/return`, { condition: 'Good', checkInNotes: 'Returned via dashboard' }, cfg);
      toast.success('Asset returned!');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Return failed'); }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.6rem', margin: 0 }}>Asset Allocations</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Allocate, transfer, and track asset assignments</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Allocation Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowRightLeft size={18} color="var(--primary-color)" />
            {isConflict ? 'Transfer Request' : 'New Allocation'}
          </h3>

          {/* Asset Selector */}
          <div className="form-group">
            <label className="form-label">Select Asset</label>
            <select className="form-input" value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
              <option value="">Choose an asset...</option>
              {assets.map(a => (
                <option key={a._id} value={a._id}>{a.tag} — {a.name} ({a.status})</option>
              ))}
            </select>
          </div>

          {/* Conflict Warning */}
          {isConflict && (
            <div style={{ backgroundColor: 'var(--danger-light)', border: '1.5px solid var(--danger)', borderRadius: '12px', padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <AlertTriangle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--danger)', lineHeight: 1.5 }}>
                <strong>Already allocated</strong> to {activeAlloc?.allocatedToUser?.name || 'an employee'}.<br />
                You can submit a transfer request below.
              </div>
            </div>
          )}

          {selectedAssetId && (
            <form onSubmit={handleAllocate}>
              {isConflict && (
                <div className="form-group">
                  <label className="form-label">Current Holder</label>
                  <input className="form-input" value={activeAlloc?.allocatedToUser?.name || ''} disabled style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">{isConflict ? 'Transfer To' : 'Allocate To'}</label>
                <select className="form-input" value={transferTo} onChange={e => setTransferTo(e.target.value)}>
                  <option value="">Select employee...</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              {!isConflict && (
                <div className="form-group">
                  <label className="form-label">Expected Return Date</label>
                  <input type="date" className="form-input" value={expectedReturnDate} onChange={e => setExpectedReturnDate(e.target.value)} />
                </div>
              )}
              {isConflict && (
                <div className="form-group">
                  <label className="form-label">Reason for Transfer</label>
                  <textarea className="form-input" rows={3} style={{ resize: 'none' }} value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain the reason for transfer..." />
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {isConflict ? 'Submit Transfer Request' : 'Allocate Asset'}
              </button>
            </form>
          )}
        </div>

        {/* Allocation History */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Allocation History</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Employee</th>
                  <th>Allocated On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map(alloc => (
                  <tr key={alloc._id}>
                    <td style={{ fontWeight: 600 }}>{alloc.asset?.name || '—'}<br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{alloc.asset?.tag}</span></td>
                    <td>{alloc.allocatedToUser?.name || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{alloc.createdAt ? format(new Date(alloc.createdAt), 'dd MMM yyyy') : '—'}</td>
                    <td>
                      <span className={`badge ${alloc.status === 'Active' ? 'badge-success' : 'badge-muted'}`}>{alloc.status}</span>
                    </td>
                    <td>
                      {alloc.status === 'Active' && ['Admin', 'Asset Manager'].includes(user?.role) && (
                        <button onClick={() => handleReturn(alloc._id)} className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <RotateCcw size={13} /> Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {allocations.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>No allocation records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
