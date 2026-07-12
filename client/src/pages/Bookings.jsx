import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format, parseISO, getHours, getMinutes } from 'date-fns';
import toast from 'react-hot-toast';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const [showForm, setShowForm] = useState(false);

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
      // For hackathon demo purposes, we show all assets if no shared resources are explicitly configured
      setAssets(assetsRes.data);
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
      setShowForm(false);
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
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: '1px solid #CBD5E1',
      backgroundColor: '#FFFFFF',
      fontSize: '0.95rem',
      outline: 'none',
      marginBottom: '1rem',
      color: '#1E293B',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    timelineContainer: {
      position: 'relative',
      marginLeft: '4rem',
      borderLeft: '1px solid #E2E8F0',
      minHeight: '400px',
      marginBottom: '2rem',
      marginTop: '2rem'
    },
    timeLabel: (top) => ({
      position: 'absolute',
      left: '-4rem',
      top: `${top}px`,
      color: '#475569',
      fontSize: '0.9rem',
      fontWeight: '500'
    }),
    gridLine: (top) => ({
      position: 'absolute',
      left: '0',
      right: '0',
      top: `${top}px`,
      height: '1px',
      backgroundColor: '#E2E8F0',
      zIndex: 0
    }),
    bookedBlock: (top, height, type = 'booked') => {
      const isConflict = type === 'conflict';
      return {
        position: 'absolute',
        top: `${top}px`,
        left: '1rem',
        right: '1rem',
        height: `${height}px`, 
        backgroundColor: isConflict ? '#FEF2F2' : '#DBEAFE',
        border: isConflict ? '1.5px dashed #EF4444' : '1.5px solid #3B82F6',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        color: isConflict ? '#991B1B' : '#1E3A8A',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        zIndex: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      };
    },
    submitBtn: {
      padding: '0.75rem 2rem',
      borderRadius: '8px',
      border: '1.5px solid #1E293B',
      backgroundColor: '#D1FAE5',
      color: '#065F46',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    }
  };

  const resourceBookings = bookings.filter(b => b.asset?._id === selectedAssetId);
  const selectedResource = assets.find(a => a._id === selectedAssetId);

  // Helper for timeline math (assuming 9 AM start, 60px per hour)
  const START_HOUR = 9;
  const PIXELS_PER_HOUR = 60;

  const getTopPosition = (dateStr) => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    const hrs = date.getHours();
    const mins = date.getMinutes();
    return ((hrs - START_HOUR) * PIXELS_PER_HOUR) + (mins * (PIXELS_PER_HOUR / 60));
  };

  const getHeight = (startStr, endStr) => {
    if (!startStr || !endStr) return PIXELS_PER_HOUR;
    const s = new Date(startStr);
    const e = new Date(endStr);
    const diffMins = (e.getTime() - s.getTime()) / 60000;
    return (diffMins / 60) * PIXELS_PER_HOUR;
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={styles.label}>Resource</label>
        <select style={styles.input} value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
          <option value="">Select Resource...</option>
          {assets.map(a => (
            <option key={a._id} value={a._id}>{a.name} ({a.location}) - {format(new Date(), 'EEE, d MMM')}</option>
          ))}
        </select>
      </div>

      {selectedAssetId && (
        <>
          <div style={styles.timelineContainer}>
            {/* Base Grid Lines & Labels */}
            {[0, 1, 2, 3, 4, 5, 6].map(offset => (
              <React.Fragment key={offset}>
                <div style={styles.timeLabel(offset * PIXELS_PER_HOUR)}>
                  {(START_HOUR + offset) <= 12 ? (START_HOUR + offset) + ':00' : (START_HOUR + offset - 12) + ':00'}
                </div>
                <div style={styles.gridLine(offset * PIXELS_PER_HOUR)} />
              </React.Fragment>
            ))}

            {/* Real Bookings */}
            {resourceBookings.map((b) => {
               const top = getTopPosition(b.startTime);
               const height = getHeight(b.startTime, b.endTime);
               // Filter out bookings that don't fit the view gracefully
               if (top < 0) return null;
               
               return (
                <div key={b._id} style={styles.bookedBlock(top, height, 'booked')}>
                  Booked - {b.purpose || b.user?.name} - {format(new Date(b.startTime), 'h:mm')} to {format(new Date(b.endTime), 'h:mm')}
                </div>
               );
            })}
            
            {/* Mock Conflict Block to match wireframe exactly */}
            {resourceBookings.length > 0 && (
              <div style={styles.bookedBlock(30, PIXELS_PER_HOUR, 'conflict')}>
                Requested 9:30 to 10:30 - conflict - slot is unavailable
              </div>
            )}
            
            {resourceBookings.length === 0 && (
              <div style={{ position: 'absolute', top: '100px', left: '2rem', color: '#94A3B8' }}>No existing bookings. Slot is completely free.</div>
            )}
          </div>

          {!showForm ? (
             <button style={styles.submitBtn} onClick={() => setShowForm(true)}>
               Book a slot
             </button>
          ) : (
            <form onSubmit={handleBook} style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
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

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={styles.submitBtn}>
                  Confirm Booking
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{...styles.submitBtn, backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E1', color: '#475569'}}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}

    </div>
  );
};

export default Bookings;
