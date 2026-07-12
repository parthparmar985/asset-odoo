import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileSearch, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Audits = () => {
  const { user } = useContext(AuthContext);
  const [audits, setAudits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '', departmentScope: '', startDate: '', endDate: '', assignedAuditors: []
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [auditsRes, deptsRes, usersRes] = await Promise.all([
        axios.get('/api/audits', config).catch(() => ({ data: [] })),
        axios.get('/api/departments', config).catch(() => ({ data: [] })),
        axios.get('/api/auth/users', config).catch(() => ({ data: [] }))
      ]);
      setAudits(auditsRes.data);
      setDepartments(deptsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data');
    }
  };

  const handleCreateAudit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/audits', formData, config);
      setShowForm(false);
      setFormData({ name: '', departmentScope: '', startDate: '', endDate: '', assignedAuditors: [] });
      toast.success('Audit cycle created successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating audit');
    }
  };

  const handleAuditorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({ ...formData, assignedAuditors: selectedOptions });
  };

  const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    title: { fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0F172A' },
    subtitle: { color: '#64748B', fontSize: '0.95rem', marginTop: '0.25rem' },
    addButton: {
      padding: '0.6rem 1.5rem', borderRadius: '20px', border: '1.5px solid #1E293B', backgroundColor: '#E2F0EA',
      color: '#1E293B', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
    },
    tableHeader: { backgroundColor: '#F1F0EA', borderRadius: '12px', border: '1.5px solid #1E293B', display: 'grid', padding: '0.75rem 1.5rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' },
    tableRow: { display: 'grid', padding: '1rem 1.5rem', alignItems: 'center', borderBottom: '1px solid #E2E8F0', color: '#334155' },
    badge: (status) => ({ display: 'inline-block', padding: '0.25rem 1rem', borderRadius: '20px', border: `1.5px solid ${status === 'Open' ? '#FFCE20' : '#10B981'}`, backgroundColor: 'transparent', color: '#1E293B', fontSize: '0.75rem', fontWeight: '600' }),
    formCard: { backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    input: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%', outline: 'none', fontSize: '0.95rem', color: '#0F172A', marginTop: '0.25rem' }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1rem', fontFamily: "'Outfit', sans-serif" }}>
      
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Asset Audits</h2>
          <p style={styles.subtitle}>Manage and track inventory audit cycles</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Asset Manager') && (
          <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? 'Close' : 'New Audit Cycle'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSearch size={20} color="#4318FF" /> Create New Audit Cycle
          </h3>
          <form onSubmit={handleCreateAudit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Audit Name</label>
              <input type="text" style={styles.input} placeholder="e.g. Q3 IT Assets Audit" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div>
              <label style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Department Scope (Optional)</label>
              <select style={{...styles.input, backgroundColor: '#fff'}} value={formData.departmentScope} onChange={e => setFormData({...formData, departmentScope: e.target.value})}>
                <option value="">All Departments (Entire Organization)</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Assigned Auditors</label>
              <select multiple style={{...styles.input, height: 'auto', minHeight: '80px', backgroundColor: '#fff'}} value={formData.assignedAuditors} onChange={handleAuditorChange} required>
                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
              </select>
              <small style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>Hold Ctrl/Cmd to select multiple</small>
            </div>

            <div>
              <label style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Start Date</label>
              <input type="date" style={styles.input} value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
            </div>

            <div>
              <label style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>End Date</label>
              <input type="date" style={styles.input} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" style={{ ...styles.addButton, backgroundColor: '#4318FF', color: '#fff', border: 'none', padding: '0.75rem 2rem' }}>
                Start Audit Cycle
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <div style={{ ...styles.tableHeader, gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr' }}>
          <div>Audit Name</div>
          <div>Scope</div>
          <div>Auditors</div>
          <div>Date Range</div>
          <div>Status</div>
        </div>
        
        {audits.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            No audit cycles found. Click "New Audit Cycle" to start one.
          </div>
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            {audits.map((a, i) => (
              <div key={a._id} style={{ ...styles.tableRow, gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr', borderBottom: i === audits.length - 1 ? 'none' : '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: '600', color: '#1E293B' }}>{a.name}</div>
                <div>{a.departmentScope?.name || 'All Departments'}</div>
                <div>{a.assignedAuditors?.length || 0} assigned</div>
                <div style={{ fontSize: '0.9rem' }}>
                  {a.startDate ? format(new Date(a.startDate), 'MMM dd, yyyy') : '--'} - {a.endDate ? format(new Date(a.endDate), 'MMM dd, yyyy') : '--'}
                </div>
                <div>
                  <span style={styles.badge(a.status)}>{a.status || 'Open'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Audits;
