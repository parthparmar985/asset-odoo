import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { CalendarClock, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const statusCls = { Upcoming: 'badge-primary', Ongoing: 'badge-success', Completed: 'badge-muted', Cancelled: 'badge-danger' };

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const [bRes, aRes] = await Promise.all([
        axios.get('/api/bookings', cfg),
        axios.get('/api/assets', cfg),
      ]);
      setBookings(bRes.data);
      setAssets(aRes.data);
    } catch { toast.error('Failed to fetch bookings'); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedAssetId) { toast.error('Please select a resource'); return; }
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/bookings', { assetId: selectedAssetId, startTime, endTime, purpose }, cfg);
      toast.success('Resource booked successfully!');
      setShowForm(false); setSelectedAssetId(''); setStartTime(''); setEndTime(''); setPurpose('');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed — slot may be occupied'); }
  };

  const handleCancel = async (id) => {
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/bookings/${id}/cancel`, {}, cfg);
      toast.success('Booking cancelled');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed'); }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.6rem', margin: 0 }}>Resource Bookings</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Book shared resources like rooms, projectors, and equipment</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarClock size={18} color="var(--primary-color)" /> Book a Resource
          </h3>
          <form onSubmit={handleBook} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Resource</label>
              <select className="form-input" value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)} required>
                <option value="">Select a shared resource...</option>
                {assets.map(a => (
                  <option key={a._id} value={a._id}>
                    {a.name}{a.location ? ` (${a.location})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input type="datetime-local" className="form-input" required value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input type="datetime-local" className="form-input" required value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Purpose</label>
              <input type="text" className="form-input" placeholder="e.g. Team standup, Training session..." value={purpose} onChange={e => setPurpose(e.target.value)} required />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">Confirm Booking</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>All Bookings</h3>
          <span className="badge badge-primary">{bookings.length} total</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Booked By</th>
                <th>Start</th>
                <th>End</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td style={{ fontWeight: 600 }}>{b.asset?.name || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{b.user?.name || '—'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {b.startTime ? format(new Date(b.startTime), 'dd MMM, h:mm a') : '—'}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {b.endTime ? format(new Date(b.endTime), 'dd MMM, h:mm a') : '—'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.purpose || '—'}</td>
                  <td><span className={`badge ${statusCls[b.status] || 'badge-muted'}`}>{b.status}</span></td>
                  <td>
                    {['Upcoming', 'Ongoing'].includes(b.status) && (b.user?._id === user?._id || ['Admin', 'Asset Manager'].includes(user?.role)) && (
                      <button onClick={() => handleCancel(b._id)} className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
