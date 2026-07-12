import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [bookRes, assetsRes] = await Promise.all([
        axios.get('/api/bookings', config),
        axios.get('/api/assets', config)
      ]);
      setBookings(bookRes.data);
      setAssets(assetsRes.data.filter(a => a.isShared));
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/bookings', { assetId: selectedAssetId, startTime, endTime, purpose }, config);
      setStartTime('');
      setEndTime('');
      setPurpose('');
      toast.success('Resource booked successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking resource (Conflict detected)');
    }
  };

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
      marginBottom: '1rem'
    },
    timelineContainer: {
      position: 'relative',
      marginLeft: '3rem',
      borderLeft: '1px solid transparent',
      marginBottom: '3rem',
      marginTop: '2rem'
    },
    timeLabel: (top) => ({
      position: 'absolute',
      left: '-3rem',
      top: `${top}px`,
      color: '#475569',
      fontSize: '0.85rem'
    }),
    bookedBlock: (top, height) => ({
      position: 'absolute',
      top: `${top}px`,
      left: '1rem',
      right: '1rem',
      height: `${height}px`, 
      backgroundColor: '#BFDBFE',
      border: '1.5px solid #1E293B',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      color: '#1E293B',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      zIndex: 2,
      overflow: 'hidden'
    }),
    submitBtn: {
      padding: '0.6rem 2rem',
      borderRadius: '8px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#D1FAE5',
      color: '#065F46',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    }
  };

  // Filter bookings for the selected resource to show on timeline
  const resourceBookings = bookings.filter(b => b.asset?._id === selectedAssetId);

  return (
    <div style={styles.container} className="animate-fade-in">
      
      <div>
        <label style={styles.label}>Resource</label>
        <select style={styles.input} value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
          <option value="">Select Resource...</option>
          {assets.map(a => (
            <option key={a._id} value={a._id}>{a.name} ({a.location})</option>
          ))}
        </select>
      </div>

      {selectedAssetId && (
        <>
          <div style={styles.timelineContainer}>
            {/* Visual Timeline Mockup with generic blocks for real bookings */}
            <div style={styles.timeLabel(0)}>AM</div>
            <div style={styles.timeLabel(80)}>Mid</div>
            <div style={styles.timeLabel(160)}>PM</div>

            {resourceBookings.map((b, idx) => {
               // highly simplified visualization for the hackathon
               const top = idx * 60; 
               return (
                <div key={b._id} style={styles.bookedBlock(top, 50)}>
                  Booked - {b.user?.name} - {format(new Date(b.startTime), 'HH:mm')}
                </div>
               );
            })}
            
            {resourceBookings.length === 0 && (
              <div style={{ color: '#94A3B8', padding: '1rem', fontSize: '0.9rem' }}>No existing bookings. Slot is completely free.</div>
            )}
          </div>

          <form onSubmit={handleBook}>
            <div style={styles.row}>
              <div>
                <label style={styles.label}>Start Time</label>
                <input type="datetime-local" style={styles.input} required value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div>
                <label style={styles.label}>End Time</label>
                <input type="datetime-local" style={styles.input} required value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>
            
            <div>
              <label style={styles.label}>Purpose</label>
              <input type="text" style={styles.input} required value={purpose} onChange={e => setPurpose(e.target.value)} />
            </div>

            <button type="submit" style={styles.submitBtn}>
              Book a slot
            </button>
          </form>
        </>
      )}

    </div>
  );
};

export default Bookings;
