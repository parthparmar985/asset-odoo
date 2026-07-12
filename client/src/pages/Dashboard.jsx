import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    available: 0,
    allocated: 0,
    maintenance: 0,
    activeBookings: 0,
    pendingTransfers: 0,
    upcomingReturns: 0,
    overdueAssets: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const [assetsRes, allocRes, bookRes, maintRes] = await Promise.all([
          axios.get('/api/assets', config),
          axios.get('/api/allocations', config),
          axios.get('/api/bookings', config),
          axios.get('/api/maintenance', config)
        ]);

        const assets = assetsRes.data;
        const allocations = allocRes.data;
        const bookings = bookRes.data;
        const maintenance = maintRes.data;

        let overdueCount = 0;
        let upcomingCount = 0;
        const now = new Date();

        allocations.forEach(alloc => {
          if (alloc.status === 'Active' && alloc.expectedReturnDate) {
            const returnDate = new Date(alloc.expectedReturnDate);
            if (returnDate < now) {
              overdueCount++;
            } else {
              upcomingCount++;
            }
          }
        });

        setStats({
          available: assets.filter(a => a.status === 'Available').length,
          allocated: assets.filter(a => a.status === 'Allocated').length,
          maintenance: assets.filter(a => a.status === 'Under Maintenance').length,
          activeBookings: bookings.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing').length,
          pendingTransfers: 0, // Mock for now as transfers aren't fully implemented
          upcomingReturns: upcomingCount,
          overdueAssets: overdueCount
        });

        // Generate some recent activity
        const activity = [];
        allocations.slice(0, 2).forEach(a => {
          activity.push(`${a.asset?.name} - allocated to ${a.allocatedToUser?.name}`);
        });
        bookings.slice(0, 1).forEach(b => {
          activity.push(`Booking confirmed for ${b.asset?.name} - ${b.purpose}`);
        });
        setRecentActivity(activity);

      } catch (error) {
        toast.error('Error fetching dashboard data');
      }
    };

    fetchDashboardData();
  }, [user]);

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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    card: {
      border: '1.5px solid #1E293B',
      borderRadius: '16px',
      padding: '1rem 1.5rem',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100px'
    },
    cardTitle: {
      fontSize: '0.875rem',
      color: '#475569',
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    cardValue: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1E293B'
    },
    alertBar: {
      backgroundColor: '#FEE2E2',
      border: '1.5px solid #1E293B',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      color: '#DC2626',
      fontWeight: '500',
      fontSize: '0.9rem',
      marginBottom: '1.5rem'
    },
    actionRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2.5rem'
    },
    actionPill: (isPrimary) => ({
      padding: '0.6rem 1.5rem',
      borderRadius: '24px',
      border: '1.5px solid #1E293B',
      backgroundColor: isPrimary ? '#E2F0EA' : '#FFFFFF',
      color: '#1E293B',
      fontWeight: '600',
      fontSize: '0.875rem',
      cursor: 'pointer'
    }),
    activityTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#1E293B'
    },
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      fontSize: '0.9rem',
      color: '#334155'
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <h2 style={styles.title}>Today's Overview</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Available</div>
          <div style={styles.cardValue}>{stats.available}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Allocated</div>
          <div style={styles.cardValue}>{stats.allocated}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Under Maintenance</div>
          <div style={styles.cardValue}>{stats.maintenance}</div>
        </div>
        
        <div style={styles.card}>
          <div style={styles.cardTitle}>Active Bookings</div>
          <div style={styles.cardValue}>{stats.activeBookings}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Pending Transfers</div>
          <div style={styles.cardValue}>{stats.pendingTransfers}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Upcoming returns</div>
          <div style={styles.cardValue}>{stats.upcomingReturns}</div>
        </div>
      </div>

      {stats.overdueAssets > 0 && (
        <div style={styles.alertBar}>
          {stats.overdueAssets} assets overdue for return - flagged for follow-up
        </div>
      )}

      <div style={styles.actionRow}>
        {['Admin', 'Asset Manager'].includes(user?.role) && (
          <button style={styles.actionPill(true)} onClick={() => navigate('/assets')}>
            + register asset
          </button>
        )}
        <button style={styles.actionPill(false)} onClick={() => navigate('/bookings')}>
          Book resource
        </button>
        <button style={styles.actionPill(false)} onClick={() => navigate('/maintenance')}>
          Raise requests
        </button>
      </div>

      <h2 style={styles.activityTitle}>Recent Activity</h2>
      <div style={styles.activityList}>
        {recentActivity.length === 0 && <div>No recent activity.</div>}
        {recentActivity.map((act, index) => (
          <div key={index}>{act}</div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
