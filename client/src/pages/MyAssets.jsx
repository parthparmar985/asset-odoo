import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MyAssets = () => {
  const { user } = useContext(AuthContext);
  const [myAllocations, setMyAllocations] = useState([]);

  useEffect(() => {
    fetchMyAssets();
  }, [user]);

  const fetchMyAssets = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Fetch all allocations and filter for current user
      const { data } = await axios.get('/api/allocations', config);
      const activeMine = data.filter(a => 
        a.status === 'Active' && 
        a.allocatedToUser?._id === user._id
      );
      setMyAllocations(activeMine);
    } catch (error) {
      toast.error('Error fetching your assets');
    }
  };

  const handleReturnRequest = (assetName) => {
    toast.success(`Return request initiated for ${assetName}`);
  };

  const styles = {
    container: {
      padding: '1.5rem',
      fontFamily: "'Outfit', sans-serif",
      maxWidth: '1000px'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#1E293B'
    },
    card: {
      border: '1.5px solid #1E293B',
      borderRadius: '16px',
      padding: '1.5rem',
      backgroundColor: '#F8FAFC',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    assetInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    name: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1E293B'
    },
    details: {
      fontSize: '0.875rem',
      color: '#64748B'
    },
    btnReturn: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#FFFFFF',
      color: '#1E293B',
      fontWeight: '500',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <h2 style={styles.title}>My Assigned Assets</h2>
      
      {myAllocations.length === 0 && (
        <div style={{ color: '#64748B' }}>You currently have no assets assigned to you.</div>
      )}

      {myAllocations.map(alloc => (
        <div key={alloc._id} style={styles.card}>
          <div style={styles.assetInfo}>
            <div style={styles.name}>{alloc.asset?.name} ({alloc.asset?.tag})</div>
            <div style={styles.details}>Category: {alloc.asset?.category?.name || alloc.asset?.category}</div>
            <div style={styles.details}>
              Allocated On: {format(new Date(alloc.allocationDate), 'MMM dd, yyyy')}
            </div>
            {alloc.expectedReturnDate && (
              <div style={styles.details}>
                Expected Return: {format(new Date(alloc.expectedReturnDate), 'MMM dd, yyyy')}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={styles.btnReturn} onClick={() => handleReturnRequest(alloc.asset?.name)}>
              Request Return
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAssets;
