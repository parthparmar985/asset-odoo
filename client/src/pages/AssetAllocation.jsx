import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
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

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [allocsRes, assetsRes, usersRes] = await Promise.all([
        axios.get('/api/allocations', config),
        axios.get('/api/assets', config),
        axios.get('/api/auth/users', config)
      ]);
      setAllocations(allocsRes.data);
      setAssets(assetsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    if(!selectedAssetId) {
        toast.error('Please select an asset first');
        return;
    }

    // Logic for Transfer Request
    if (isConflict) {
      if(!transferTo) {
        toast.error('Please select an employee for transfer');
        return;
      }
      toast.success('Transfer request submitted for approval (Mocked)');
      setTransferTo('');
      setReason('');
      return;
    }

    // Logic for Standard Allocation
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/allocations', { assetId: selectedAssetId, allocatedToUser: transferTo, expectedReturnDate }, config);
      toast.success('Asset allocated successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error allocating asset');
    }
  };

  const handleReturn = async (allocId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/allocations/${allocId}/return`, { condition: 'Good', checkInNotes: 'Returned via dashboard' }, config);
      toast.success('Asset returned successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error returning asset');
    }
  };

  const selectedAssetObj = assets.find(a => a._id === selectedAssetId);
  const activeAllocation = selectedAssetObj ? allocations.find(a => a.asset?._id === selectedAssetId && a.status === 'Active') : null;
  const isConflict = !!activeAllocation;
  const currentHolder = activeAllocation ? activeAllocation.allocatedToUser?.name : '';

  const styles = {
    container: {
      padding: '1.5rem',
      fontFamily: "'Outfit', sans-serif",
      maxWidth: '900px'
    },
    label: {
      display: 'block',
      color: '#64748B',
      fontSize: '0.9rem',
      marginBottom: '0.25rem'
    },
    input: {
      width: '100%',
      padding: '0.6rem 1rem',
      borderRadius: '8px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#FFFFFF',
      fontSize: '0.95rem',
      outline: 'none',
      marginBottom: '1.5rem'
    },
    errorBanner: {
      backgroundColor: '#FEE2E2',
      border: '1.5px solid #DC2626',
      borderRadius: '12px',
      padding: '1rem',
      color: '#DC2626',
      fontSize: '0.9rem',
      marginBottom: '2rem',
      lineHeight: '1.5'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem'
    },
    textarea: {
      width: '100%',
      padding: '0.6rem 1rem',
      borderRadius: '12px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#FFFFFF',
      minHeight: '100px',
      resize: 'none',
      marginBottom: '1.5rem'
    },
    submitBtn: {
      padding: '0.6rem 1.5rem',
      borderRadius: '8px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#D1FAE5',
      color: '#065F46',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      display: 'inline-block'
    },
    historyTitle: {
      fontSize: '1.1rem',
      color: '#1E293B',
      marginBottom: '0.5rem',
      marginTop: '3rem'
    },
    historyLine: {
      borderBottom: '1.5px solid #E2E8F0',
      marginBottom: '1rem'
    },
    historyItem: {
      fontSize: '0.9rem',
      color: '#475569',
      marginBottom: '0.5rem'
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      
      <div>
        <label style={styles.label}>Asset</label>
        <select style={styles.input} value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
          <option value="">Select Asset...</option>
          {assets.map(a => (
            <option key={a._id} value={a._id}>{a.tag} - {a.name} ({a.status})</option>
          ))}
        </select>
      </div>

      {isConflict && (
        <div style={styles.errorBanner}>
          <div>Already Allocated to {currentHolder}</div>
          <div>Direct re-allocation is blocked - submit a transfer request below</div>
        </div>
      )}

      {selectedAssetId && (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#1E293B' }}>
            {isConflict ? 'Transfer Request' : 'New Allocation'}
          </div>
          
          <form onSubmit={handleAllocate}>
            <div style={styles.row}>
              {isConflict ? (
                <div>
                  <label style={styles.label}>From</label>
                  <input type="text" style={styles.input} value={currentHolder} disabled />
                </div>
              ) : (
                <div>
                  <label style={styles.label}>Expected Return Date</label>
                  <input type="date" style={styles.input} value={expectedReturnDate} onChange={e => setExpectedReturnDate(e.target.value)} />
                </div>
              )}
              
              <div>
                <label style={styles.label}>To</label>
                <select style={styles.input} value={transferTo} onChange={e => setTransferTo(e.target.value)}>
                  <option value="">Select Employee....</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
            </div>

            {isConflict && (
              <div>
                <label style={styles.label}>Reason</label>
                <textarea 
                  style={styles.textarea} 
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>
            )}

            <button type="submit" style={styles.submitBtn}>
              {isConflict ? 'Submit Request' : 'Allocate Asset'}
            </button>
          </form>
        </>
      )}

      <div style={styles.historyTitle}>Allocation history</div>
      <div style={styles.historyLine}></div>
      {allocations.map(alloc => (
        <div key={alloc._id} style={{...styles.historyItem, display: 'flex', justifyContent: 'space-between'}}>
          <span>
            {format(new Date(alloc.createdAt), 'MMM dd')} - {alloc.status === 'Active' ? 'Allocated to' : 'Returned by'} {alloc.allocatedToUser?.name} - {alloc.asset?.name}
          </span>
          {alloc.status === 'Active' && ['Admin', 'Asset Manager'].includes(user?.role) && (
            <button onClick={() => handleReturn(alloc._id)} style={{ fontSize: '0.8rem', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Mark Returned
            </button>
          )}
        </div>
      ))}
      {allocations.length === 0 && <div style={{ color: '#94A3B8' }}>No history found.</div>}

    </div>
  );
};

export default AssetAllocation;
