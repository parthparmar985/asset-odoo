import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Search, Tag, MapPin, Package, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColor = {
  Available: 'badge-success',
  Allocated: 'badge-primary',
  'Under Maintenance': 'badge-warning',
  Retired: 'badge-muted',
};

const AssetDirectory = () => {
  const { user } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '', category: '', serialNumber: '', condition: 'New',
    location: '', isShared: false, department: ''
  });

  useEffect(() => { if (user) fetchData(); }, [user]);

  useEffect(() => {
    let list = assets;
    if (search) list = list.filter(a =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.tag?.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'All') list = list.filter(a => a.status === statusFilter);
    setFiltered(list);
  }, [assets, search, statusFilter]);

  const fetchData = async () => {
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      const [aRes, cRes, dRes] = await Promise.all([
        axios.get('/api/assets', cfg),
        axios.get('/api/categories', cfg).catch(() => ({ data: [] })),
        axios.get('/api/departments', cfg).catch(() => ({ data: [] })),
      ]);
      setAssets(aRes.data);
      setCategories(cRes.data);
      setDepartments(dRes.data);
    } catch { toast.error('Failed to fetch assets'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const cfg = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/assets', formData, cfg);
      setShowForm(false);
      setFormData({ name: '', category: '', serialNumber: '', condition: 'New', location: '', isShared: false, department: '' });
      toast.success('Asset registered!');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error registering asset'); }
  };

  const statuses = ['All', 'Available', 'Allocated', 'Under Maintenance', 'Retired'];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.6rem' }}>Asset Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            {assets.length} total assets registered
          </p>
        </div>
        {['Admin', 'Asset Manager'].includes(user?.role) && (
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            <Plus size={16} /> Register Asset
          </button>
        )}
      </div>

      {/* Register Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Register New Asset</h3>
          <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Asset Name *</label>
              <input className="form-input" required placeholder="e.g. MacBook Pro" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-input" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                <option value="">Optional</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Serial Number</label>
              <input className="form-input" placeholder="e.g. SN-20240101" value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="e.g. Floor 3, Rack B" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select className="form-input" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                {['New', 'Good', 'Fair', 'Poor'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                <input type="checkbox" checked={formData.isShared} onChange={e => setFormData({ ...formData, isShared: e.target.checked })} style={{ accentColor: 'var(--primary-color)', width: 16, height: 16 }} />
                Shared / Bookable Resource
              </label>
              <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto' }}>Save Asset</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters + Search */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 200, backgroundColor: 'var(--bg-main)', border: '1.5px solid var(--border-color)', borderRadius: '10px', padding: '0.5rem 0.85rem' }}>
            <Search size={15} color="var(--text-muted)" />
            <input type="text" placeholder="Search by name, tag, serial..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '0.875rem', fontFamily: 'Outfit,sans-serif', color: 'var(--text-main)' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: '1.5px solid', transition: 'var(--transition)',
                  borderColor: statusFilter === s ? 'var(--primary-color)' : 'var(--border-color)',
                  backgroundColor: statusFilter === s ? 'var(--primary-color)' : 'transparent',
                  color: statusFilter === s ? '#fff' : 'var(--text-muted)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tag</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Location</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => (
                <tr key={asset._id}>
                  <td><span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-color)' }}>{asset.tag || '—'}</span></td>
                  <td style={{ fontWeight: 600 }}>{asset.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{asset.category?.name || '—'}</td>
                  <td><span className={`badge ${statusColor[asset.status] || 'badge-muted'}`}>{asset.status}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{asset.location || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{asset.condition || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No assets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetDirectory;
