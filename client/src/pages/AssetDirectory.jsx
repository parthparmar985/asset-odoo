import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const AssetDirectory = () => {
  const { user } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', serialNumber: '', condition: 'New', location: '', isShared: false, department: ''
  });

  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [assetsRes, catsRes, deptsRes] = await Promise.all([
        axios.get('/api/assets', config),
        axios.get('/api/categories', config),
        axios.get('/api/departments', config)
      ]);
      setAssets(assetsRes.data);
      setCategories(catsRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/assets', formData, config);
      setShowForm(false);
      setFormData({ name: '', category: '', serialNumber: '', condition: 'New', location: '', isShared: false, department: '' });
      toast.success('Asset registered successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error registering asset');
    }
  };

  const styles = {
    container: {
      padding: '1.5rem',
      fontFamily: "'Outfit', sans-serif",
    },
    headerRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      alignItems: 'center'
    },
    searchBar: {
      flex: 1,
      padding: '0.6rem 1rem',
      borderRadius: '8px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#F1F5F9',
      fontSize: '0.9rem',
      outline: 'none'
    },
    registerBtn: {
      padding: '0.6rem 1.25rem',
      borderRadius: '12px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#E2F0EA',
      color: '#1E293B',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      whiteSpace: 'nowrap'
    },
    filterRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem'
    },
    filterPill: {
      padding: '0.4rem 2rem',
      borderRadius: '20px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#FFFFFF',
      color: '#1E293B',
      fontSize: '0.875rem',
      cursor: 'pointer'
    },
    tableHeader: {
      backgroundColor: '#F1F0EA',
      borderRadius: '12px',
      border: '1.5px solid #1E293B',
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1.5fr',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem'
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1.5fr',
      padding: '0.875rem 1.5rem',
      alignItems: 'center',
      borderBottom: '1px solid #E2E8F0',
      color: '#334155',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      
      {/* Header Row */}
      <div style={styles.headerRow}>
        <input 
          type="text" 
          placeholder="Search by tag, serial, or QR code.." 
          style={styles.searchBar} 
        />
        {['Admin', 'Asset Manager'].includes(user?.role) && (
          <button style={styles.registerBtn} onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> Register Asset
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ padding: '1.5rem', border: '1.5px solid #1E293B', borderRadius: '16px', marginBottom: '2rem', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#1E293B' }}>Register New Asset</h3>
          <form onSubmit={handleRegister} className="grid-cols-3">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-input" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                <option value="">(Optional)</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Serial Number</label>
              <input type="text" className="form-input" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="form-group flex items-center mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isShared} onChange={e => setFormData({...formData, isShared: e.target.checked})} />
                Shared / Bookable Resource
              </label>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 3', marginTop: '1rem' }}>
              <button type="submit" style={styles.registerBtn}>Save Asset</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Row */}
      <div style={styles.filterRow}>
        <button style={styles.filterPill}>Category</button>
        <button style={styles.filterPill}>Status</button>
        <button style={styles.filterPill}>Department</button>
      </div>

      {/* Table */}
      <div>
        <div style={styles.tableHeader}>
          <div>Tag</div>
          <div>Name</div>
          <div>Category</div>
          <div>Status</div>
          <div>Location</div>
        </div>
        
        {assets.map((asset, index) => (
          <div key={asset._id || index} style={styles.tableRow}>
            <div style={{ fontFamily: 'monospace' }}>{asset.tag}</div>
            <div>{asset.name}</div>
            <div>{asset.category?.name || asset.category || '--'}</div>
            <div>{asset.status}</div>
            <div>{asset.location || '--'}</div>
          </div>
        ))}
        {assets.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No assets found.</div>}
      </div>

    </div>
  );
};

export default AssetDirectory;
