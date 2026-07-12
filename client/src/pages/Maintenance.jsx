import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [myAssets, setMyAssets] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '', issueDescription: '', priority: 'Low'
  });

  const isManager = ['Admin', 'Asset Manager'].includes(user?.role);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Fetch maintenance requests
      const { data } = await axios.get('/api/maintenance', config);
      
      if (isManager) {
        setRequests(data);
      } else {
        // Employee only sees their own requests
        setRequests(data.filter(r => r.requestedBy?._id === user._id));
      }

      // Fetch assets the user currently holds (for the dropdown)
      if (!isManager) {
        const allocRes = await axios.get('/api/allocations', config);
        const activeMine = allocRes.data.filter(a => 
          a.status === 'Active' && 
          a.allocatedToUser?._id === user._id
        ).map(a => a.asset);
        setMyAssets(activeMine);
      }
    } catch (error) {
      toast.error('Error fetching maintenance data');
    }
  };

  const handleRaiseRequest = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/maintenance', formData, config);
      setShowForm(false);
      setFormData({ assetId: '', issueDescription: '', priority: 'Low' });
      toast.success('Maintenance request submitted successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting request');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/maintenance/${id}/status`, { status: newStatus }, config);
      toast.success(`Request marked as ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  const styles = {
    container: {
      padding: '1.5rem',
      fontFamily: "'Outfit', sans-serif"
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1E293B'
    },
    btnPrimary: {
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
      gap: '0.25rem'
    },
    formCard: {
      padding: '1.5rem',
      border: '1.5px solid #1E293B',
      borderRadius: '16px',
      marginBottom: '2rem',
      backgroundColor: '#F8FAFC'
    },
    input: {
      width: '100%',
      padding: '0.6rem 1rem',
      borderRadius: '8px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#FFFFFF',
      fontSize: '0.95rem',
      outline: 'none',
      marginBottom: '1rem'
    },
    tableHeader: {
      backgroundColor: '#F1F0EA',
      borderRadius: '12px',
      border: '1.5px solid #1E293B',
      display: 'grid',
      gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 1fr',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem'
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 1fr',
      padding: '0.875rem 1.5rem',
      alignItems: 'center',
      borderBottom: '1px solid #E2E8F0',
      color: '#334155',
      fontSize: '0.9rem'
    },
    statusBadge: (status) => {
      let color = '#64748B';
      if(status === 'Pending') color = '#F59E0B';
      if(status === 'Approved' || status === 'In Progress') color = '#3B82F6';
      if(status === 'Resolved') color = '#10B981';
      if(status === 'Rejected') color = '#DC2626';
      
      return {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        border: `1.5px solid ${color}`,
        color: color,
        fontSize: '0.75rem',
        fontWeight: '600'
      };
    },
    actionBtn: (type) => ({
      padding: '0.25rem 0.75rem',
      borderRadius: '6px',
      border: `1px solid ${type === 'approve' ? '#10B981' : '#DC2626'}`,
      backgroundColor: 'transparent',
      color: type === 'approve' ? '#10B981' : '#DC2626',
      fontSize: '0.75rem',
      cursor: 'pointer',
      marginRight: '0.5rem'
    })
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Maintenance Requests</h2>
        {!isManager && (
          <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> Raise Request
          </button>
        )}
      </div>

      {showForm && !isManager && (
        <div style={styles.formCard}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#1E293B' }}>Report an Issue</h3>
          <form onSubmit={handleRaiseRequest} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>Select Asset</label>
              <select style={styles.input} required value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})}>
                <option value="">Choose an asset you hold...</option>
                {myAssets.map(a => <option key={a?._id} value={a?._id}>{a?.tag} - {a?.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>Priority</label>
              <select style={styles.input} required value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>Issue Description</label>
              <textarea 
                style={{ ...styles.input, minHeight: '80px', resize: 'none' }} 
                required 
                value={formData.issueDescription} 
                onChange={e => setFormData({...formData, issueDescription: e.target.value})}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" style={styles.btnPrimary}>Submit Request</button>
            </div>
          </form>
        </div>
      )}

      <div>
        <div style={styles.tableHeader}>
          <div>Asset</div>
          <div>Issue</div>
          <div>Requested By</div>
          <div>Date</div>
          <div>Status</div>
          {isManager && <div>Actions</div>}
        </div>
        
        {requests.map(req => (
          <div key={req._id} style={{ ...styles.tableRow, gridTemplateColumns: isManager ? '1.5fr 2fr 1fr 1fr 1fr 1fr' : '1.5fr 2fr 1fr 1fr 1fr' }}>
            <div style={{ fontWeight: '500' }}>{req.asset?.name} ({req.asset?.tag})</div>
            <div style={{ color: '#64748B' }}>{req.issueDescription}</div>
            <div>{req.requestedBy?.name}</div>
            <div>{format(new Date(req.createdAt), 'MMM dd, yyyy')}</div>
            <div>
              <span style={styles.statusBadge(req.status)}>{req.status}</span>
            </div>
            {isManager && (
              <div>
                {req.status === 'Pending' && (
                  <>
                    <button style={styles.actionBtn('approve')} onClick={() => handleStatusUpdate(req._id, 'Approved')}>Approve</button>
                    <button style={styles.actionBtn('reject')} onClick={() => handleStatusUpdate(req._id, 'Rejected')}>Reject</button>
                  </>
                )}
                {req.status === 'Approved' && (
                  <button style={styles.actionBtn('approve')} onClick={() => handleStatusUpdate(req._id, 'Resolved')}>Mark Resolved</button>
                )}
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No maintenance requests found.</div>}
      </div>

    </div>
  );
};

export default Maintenance;
