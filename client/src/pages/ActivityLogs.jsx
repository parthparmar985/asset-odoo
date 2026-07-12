import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ActivityLogs = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [assetsRes, allocRes, bookRes, maintRes] = await Promise.all([
          axios.get('/api/assets', config).catch(() => ({ data: [] })),
          axios.get('/api/allocations', config).catch(() => ({ data: [] })),
          axios.get('/api/bookings', config).catch(() => ({ data: [] })),
          axios.get('/api/maintenance', config).catch(() => ({ data: [] }))
        ]);

        const timeline = [];

        assetsRes.data.forEach(a => {
          if (a.createdAt) timeline.push({ id: `a_${a._id}`, user: 'System / Admin', action: 'Registered Asset', target: a.name, time: new Date(a.createdAt) });
        });
        allocRes.data.forEach(a => {
          if (a.createdAt) timeline.push({ id: `al_${a._id}`, user: a.allocatedByUser?.name || 'Admin', action: 'Allocated Asset', target: `${a.asset?.tag || 'Asset'} to ${a.allocatedToUser?.name}`, time: new Date(a.createdAt) });
          if (a.status === 'Returned' && a.updatedAt) timeline.push({ id: `ret_${a._id}`, user: a.allocatedToUser?.name || 'User', action: 'Returned Asset', target: a.asset?.tag || 'Asset', time: new Date(a.updatedAt) });
        });
        bookRes.data.forEach(b => {
          if (b.createdAt) timeline.push({ id: `b_${b._id}`, user: b.user?.name || 'User', action: 'Booked Resource', target: `${b.asset?.name} (${b.purpose})`, time: new Date(b.createdAt) });
          if (b.status === 'Cancelled' && b.updatedAt) timeline.push({ id: `bc_${b._id}`, user: b.user?.name || 'User', action: 'Cancelled Booking', target: b.asset?.name || 'Resource', time: new Date(b.updatedAt) });
        });
        maintRes.data.forEach(m => {
          if (m.createdAt) timeline.push({ id: `m_${m._id}`, user: m.requestedBy?.name || 'User', action: 'Raised Maintenance', target: m.asset?.name || 'Asset', time: new Date(m.createdAt) });
          if (m.status === 'Resolved' && m.updatedAt) timeline.push({ id: `mr_${m._id}`, user: 'Admin / Manager', action: 'Resolved Maintenance', target: m.asset?.name || 'Asset', time: new Date(m.updatedAt) });
        });

        timeline.sort((a, b) => b.time - a.time);
        setLogs(timeline);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load activity logs');
        setLoading(false);
      }
    };
    if (user) fetchLogs();
  }, [user]);

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.target.toLowerCase().includes(search.toLowerCase()) || 
    l.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>System Activity Logs</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Real-time event tracking</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 280, backgroundColor: 'var(--bg-card)', border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '0.6rem 1rem' }}>
          <Search size={16} color="var(--text-muted)" />
          <input type="text" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', color: 'var(--text-main)' }} />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading real-time logs...</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{format(log.time, 'MMM dd, yyyy HH:mm')}</td>
                    <td style={{ fontWeight: 600 }}>{log.user}</td>
                    <td><span className="badge badge-primary" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}>{log.action}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{log.target}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No logs found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
