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

  // Define Kanban columns
  const COLUMNS = ['Pending', 'Approved', 'In Progress', 'Resolved'];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const { data } = await axios.get('/api/maintenance', config);
      
      if (isManager) {
        setRequests(data);
      } else {
        setRequests(data.filter(r => r.requestedBy?._id === user._id));
      }

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
      fontFamily: "'Outfit', sans-serif",
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
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
      borderRadius: '8px',
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
    kanbanBoard: {
      display: 'flex',
      gap: '1.5rem',
      overflowX: 'auto',
      paddingBottom: '1rem',
      flexGrow: 1,
      minHeight: '600px'
    },
    column: {
      minWidth: '280px',
      width: '280px',
      backgroundColor: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    columnHeader: {
      padding: '1rem',
      fontWeight: '600',
      color: '#475569',
      borderBottom: '1px solid #E2E8F0',
      textAlign: 'center',
      textTransform: 'capitalize'
    },
    cardList: {
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      flexGrow: 1,
      overflowY: 'auto'
    },
    card: (status) => ({
      backgroundColor: status === 'Resolved' ? '#D1FAE5' : '#FFFFFF',
      border: '1.5px solid #1E293B',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }),
    cardTag: {
      fontWeight: '700',
      fontSize: '0.85rem',
      color: '#1E293B'
    },
    cardDesc: {
      fontSize: '0.9rem',
      color: '#334155',
      lineHeight: '1.4'
    },
    cardMeta: {
      fontSize: '0.8rem',
      color: '#64748B'
    },
    actionBtn: {
      marginTop: '0.5rem',
      padding: '0.4rem',
      borderRadius: '6px',
      border: '1px solid #CBD5E1',
      backgroundColor: '#F1F5F9',
      fontSize: '0.8rem',
      fontWeight: '500',
      cursor: 'pointer',
      textAlign: 'center'
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
      border: '1px solid #CBD5E1',
      backgroundColor: '#FFFFFF',
      fontSize: '0.95rem',
      outline: 'none',
      marginBottom: '1rem'
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Maintenance Management</h2>
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

      {/* KANBAN BOARD */}
      <div style={styles.kanbanBoard}>
        {COLUMNS.map(colStatus => {
          const colRequests = requests.filter(r => r.status === colStatus);
          return (
            <div key={colStatus} style={styles.column}>
              <div style={styles.columnHeader}>{colStatus}</div>
              <div style={styles.cardList}>
                {colRequests.map(req => (
                  <div key={req._id} style={styles.card(req.status)}>
                    <div style={styles.cardTag}>{req.asset?.tag || 'Asset'}</div>
                    <div style={styles.cardDesc}>{req.issueDescription}</div>
                    
                    {req.technicianAssigned && (
                       <div style={styles.cardMeta}>tech: {req.technicianAssigned}</div>
                    )}
                    
                    {req.status === 'Resolved' && (
                       <div style={styles.cardMeta}>resolved {format(new Date(req.updatedAt), 'd MMM')}</div>
                    )}

                    {/* Action buttons for Managers to move cards */}
                    {isManager && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                        {req.status === 'Pending' && (
                          <button style={styles.actionBtn} onClick={() => handleStatusUpdate(req._id, 'Approved')}>Approve &rarr;</button>
                        )}
                        {req.status === 'Approved' && (
                          <button style={styles.actionBtn} onClick={() => handleStatusUpdate(req._id, 'In Progress')}>Start Work &rarr;</button>
                        )}
                        {req.status === 'In Progress' && (
                          <button style={styles.actionBtn} onClick={() => handleStatusUpdate(req._id, 'Resolved')}>Resolve &rarr;</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
        Approving a card moves the asset to under maintenance, resolving return it to available.
      </div>
    </div>
  );
};

export default Maintenance;
