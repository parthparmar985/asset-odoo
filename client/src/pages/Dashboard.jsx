import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Calendar, Wrench, ArrowRightLeft, Clock, Plus, FileText, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ available: 0, allocated: 0, maintenance: 0, activeBookings: 0, upcomingReturns: 0, total: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [overdueReturns, setOverdueReturns] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [assetsRes, allocRes, bookRes, maintRes] = await Promise.all([
          axios.get('/api/assets', config).catch(() => ({ data: [] })),
          axios.get('/api/allocations', config).catch(() => ({ data: [] })),
          axios.get('/api/bookings', config).catch(() => ({ data: [] })),
          axios.get('/api/maintenance', config).catch(() => ({ data: [] }))
        ]);

        const assets = assetsRes.data;
        const allocations = allocRes.data;
        const bookings = bookRes.data;
        const maintenance = maintRes.data;

        const now = new Date();
        const overdue = [];
        let upcomingCount = 0;

        allocations.forEach(alloc => {
          if (alloc.status === 'Active' && alloc.expectedReturnDate) {
            const returnDate = new Date(alloc.expectedReturnDate);
            if (returnDate < now) {
              const diff = differenceInDays(now, returnDate);
              overdue.push({ ...alloc, daysOverdue: diff });
            } else {
              upcomingCount++;
            }
          }
        });
        
        setOverdueReturns(overdue.sort((a,b) => b.daysOverdue - a.daysOverdue).slice(0, 4));

        setStats({
          available: assets.filter(a => a.status === 'Available').length,
          allocated: assets.filter(a => a.status === 'Allocated').length,
          maintenance: assets.filter(a => a.status === 'Under Maintenance').length,
          activeBookings: bookings.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing').length,
          upcomingReturns: upcomingCount,
          total: assets.length
        });

        // Activity mock from real data
        const activity = [];
        allocations.slice(0, 2).forEach(a => {
          activity.push({ icon: <ArrowRightLeft size={16}/>, color: '#4318FF', text: `${a.asset?.tag || 'Asset'} allocated to ${a.allocatedToUser?.name}`, time: 'Recent', subtext: `By ${a.allocatedByUser?.name || 'Admin'}` });
        });
        bookings.slice(0, 1).forEach(b => {
          activity.push({ icon: <Calendar size={16}/>, color: '#05CD99', text: `${b.asset?.name || 'Resource'} booked`, time: 'Recent', subtext: b.purpose });
        });
        maintenance.slice(0, 1).forEach(m => {
          activity.push({ icon: <Wrench size={16}/>, color: '#FFCE20', text: `Maintenance req for ${m.asset?.name || 'Asset'}`, time: 'Recent', subtext: `Status: ${m.status}` });
        });
        setRecentActivity(activity);

        setUpcomingBookings(bookings.filter(b => b.status === 'Upcoming').slice(0, 3));

      } catch (error) { toast.error('Error fetching dashboard data'); }
    };
    if (user) fetchDashboardData();
  }, [user]);

  const p_available = stats.total ? Math.round((stats.available / stats.total) * 100) : 0;
  const p_allocated = stats.total ? Math.round((stats.allocated / stats.total) * 100) : 0;
  const p_maint = stats.total ? Math.round((stats.maintenance / stats.total) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Welcome back, {user?.name || 'Admin'}! 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Here's what's happening with your assets today.
          </p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {[ 
          { label: 'Available Assets', val: stats.available, icon: <Box size={22}/>, color: '#4318FF', bg: '#F4F7FE' },
          { label: 'Allocated Assets', val: stats.allocated, icon: <ArrowRightLeft size={22}/>, color: '#39B8FF', bg: '#E1F4FF' },
          { label: 'Under Maintenance', val: stats.maintenance, icon: <Wrench size={22}/>, color: '#FFCE20', bg: '#FFF8D6' },
          { label: 'Active Bookings', val: stats.activeBookings, icon: <Calendar size={22}/>, color: '#05CD99', bg: '#E2F9F1' },
          { label: 'Upcoming Returns', val: stats.upcomingReturns, icon: <Clock size={22}/>, color: '#8B5CF6', bg: '#F5F3FF' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', backgroundColor: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>{s.val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Asset Status Overview - Pie Chart alternative with conic-gradient */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Asset Status Overview</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '2rem' }}>
            <div style={{ 
              width: 140, height: 140, borderRadius: '50%', position: 'relative',
              background: `conic-gradient(#4318FF 0% ${p_available}%, #39B8FF ${p_available}% ${p_available + p_allocated}%, #FFCE20 ${p_available + p_allocated}% ${p_available + p_allocated + p_maint}%, #E2E8F0 ${p_available + p_allocated + p_maint}% 100%)`
            }}>
              <div style={{ position: 'absolute', inset: 25, backgroundColor: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{stats.total}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><div style={{width: 8, height: 8, borderRadius: '50%', background: '#4318FF'}}/> Available <span style={{fontWeight: 700, marginLeft: 'auto'}}>{stats.available}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><div style={{width: 8, height: 8, borderRadius: '50%', background: '#39B8FF'}}/> Allocated <span style={{fontWeight: 700, marginLeft: 'auto'}}>{stats.allocated}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><div style={{width: 8, height: 8, borderRadius: '50%', background: '#FFCE20'}}/> Maintenance <span style={{fontWeight: 700, marginLeft: 'auto'}}>{stats.maintenance}</span></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Recent Activity</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.length === 0 && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No recent activity.</div>}
            {recentActivity.map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: `${act.color}15`, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {act.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.text}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.subtext}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{act.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Returns */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Overdue Returns</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {overdueReturns.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No overdue assets.</div>
            ) : overdueReturns.map((alloc, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box size={16} color="var(--text-muted)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{alloc.asset?.tag || 'Asset'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alloc.allocatedToUser?.name}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--danger)' }}>{alloc.daysOverdue} Days</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>Overdue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Upcoming Bookings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Upcoming Bookings</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}>View Calendar</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {upcomingBookings.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No upcoming bookings.</div>
            ) : upcomingBookings.map((b, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{b.startTime ? format(new Date(b.startTime), 'hh:mm a') : ''}</span>
                  <span>{b.endTime ? format(new Date(b.endTime), 'hh:mm a') : ''}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{b.asset?.name || 'Resource'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{b.purpose}</div>
                <span className="badge badge-success">Upcoming</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1.25rem 0' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div onClick={() => navigate('/assets')} style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: 'var(--primary-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Plus size={18} color="var(--primary-color)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Register New Asset</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Add a new asset</div>
              </div>
            </div>
            <div onClick={() => navigate('/bookings')} style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#E2F9F1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={18} color="#05CD99" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Book Resource</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Book shared resource</div>
              </div>
            </div>
            <div onClick={() => navigate('/maintenance')} style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#FFF8D6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Wrench size={18} color="#B8860B" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Raise Maintenance</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Report an issue</div>
              </div>
            </div>
            <div onClick={() => navigate('/logs')} style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#FCECEB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users size={18} color="#EE5D50" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Manage Users</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>User & role management</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
