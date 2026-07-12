import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileSearch } from 'lucide-react';
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
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [auditsRes, deptsRes, usersRes] = await Promise.all([
        axios.get('/api/audits', config).catch(() => ({ data: [] })),
        axios.get('/api/departments', config).catch(() => ({ data: [] })),
        axios.get('/api/auth', config).catch(() => ({ data: [] }))
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Asset Audits</h2>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <FileSearch size={18} /> {showForm ? 'Cancel' : 'New Audit Cycle'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-6" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <h3>Create Audit Cycle</h3>
          <form onSubmit={handleCreateAudit} className="mt-4 grid-cols-2">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Audit Name</label>
              <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Department Scope (Optional)</label>
              <select className="form-input" value={formData.departmentScope} onChange={e => setFormData({...formData, departmentScope: e.target.value})}>
                <option value="">All Departments</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Auditors</label>
              <select multiple className="form-input" value={formData.assignedAuditors} onChange={handleAuditorChange} style={{ height: '80px' }} required>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
              <small style={{ color: 'var(--text-muted)' }}>Hold Ctrl/Cmd to select multiple</small>
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-input" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">Start Audit Cycle</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Scope</th>
                <th style={{ padding: '0.75rem' }}>Auditors</th>
                <th style={{ padding: '0.75rem' }}>Date Range</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {audits.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center' }}>No audit cycles found.</td></tr>
              ) : (
                audits.map(a => (
                  <tr key={a._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{a.name}</td>
                    <td style={{ padding: '0.75rem' }}>{a.departmentScope?.name || 'All'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.assignedAuditors?.length || 0} assigned</td>
                    <td style={{ padding: '0.75rem' }}>
                      {format(new Date(a.startDate), 'MMM dd')} - {format(new Date(a.endDate), 'MMM dd')}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${a.status === 'Open' ? 'badge-warning' : 'badge-success'}`}>
                        {a.status}
                      </span>
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

export default Audits;
