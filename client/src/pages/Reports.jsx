import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Printer, TrendingUp, Box, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [deptData, setDeptData] = useState([]);

  // Premium Dashboard Colors
  const COLORS = ['#4318FF', '#39B8FF', '#05CD99', '#FFCE20', '#EE5D50', '#8B5CF6'];

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [assetsRes, allocRes] = await Promise.all([
          axios.get('/api/assets', config).catch(() => ({ data: [] })),
          axios.get('/api/allocations', config).catch(() => ({ data: [] }))
        ]);

        const assets = assetsRes.data;
        const allocations = allocRes.data;

        // Process Category Data for Bar Chart
        const catMap = {};
        assets.forEach(a => {
          const cat = a.category?.name || 'Uncategorized';
          catMap[cat] = (catMap[cat] || 0) + 1;
        });
        setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, count: value })));

        // Process Status Data for Bar Chart
        const statMap = { Available: 0, Allocated: 0, 'Under Maintenance': 0, Retired: 0 };
        assets.forEach(a => {
          if (statMap[a.status] !== undefined) statMap[a.status]++;
        });
        setStatusData([
          { name: 'Available', Total: statMap['Available'], color: '#05CD99' },
          { name: 'Allocated', Total: statMap['Allocated'], color: '#4318FF' },
          { name: 'Maintenance', Total: statMap['Under Maintenance'], color: '#FFCE20' }
        ]);

        // Process Department Data (from active allocations)
        const deptMap = {};
        allocations.forEach(alloc => {
          if (alloc.status === 'Active') {
            const dept = alloc.allocatedToUser?.department?.name || alloc.allocatedToUser?.department || 'General';
            deptMap[dept] = (deptMap[dept] || 0) + 1;
          }
        });
        setDeptData(Object.entries(deptMap).map(([name, count]) => ({ name, Active: count })));

        setLoading(false);
      } catch (error) {
        toast.error('Failed to generate real-time reports');
        setLoading(false);
      }
    };

    if (user) fetchReportData();
  }, [user]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#fff', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: entry.color || entry.payload.color || '#4318FF' }} />
              <span style={{ fontWeight: 600 }}>{entry.name}:</span>
              <span style={{ fontWeight: 800, color: '#0F172A' }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>Loading premium graphs...</div>;

  return (
    <div className="animate-fade-in printable-report" style={{ paddingBottom: '2rem' }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-report, .printable-report * { visibility: visible; }
          .printable-report { position: absolute; left: 0; top: 0; width: 100%; padding: 2rem; background: white; }
          .no-print { display: none !important; }
          .card { box-shadow: none !important; border: 1px solid #E2E8F0 !important; break-inside: avoid; }
        }
        .recharts-cartesian-axis-tick-value { font-family: 'Outfit', sans-serif; font-size: 0.75rem; fill: #64748B; font-weight: 500; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Reports & Analytics</h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '0.25rem' }}>Dynamic enterprise metrics and visual insights</p>
        </div>
        <button className="btn btn-primary no-print" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px', padding: '0.75rem 1.5rem', backgroundColor: '#4318FF' }}>
          <Printer size={18} /> Export PDF Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Assets by Category - Vertical Bar Graph */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: '#F0F9FF', color: '#39B8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box size={20} /></div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1E293B' }}>Assets by Category</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Distribution across asset types</p>
            </div>
          </div>
          <div style={{ height: '320px', width: '100%' }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={12} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={12} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                  <Bar dataKey="count" name="Total Assets" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>No data available</div>}
          </div>
        </div>

        {/* Overall Asset Status - Horizontal Bar Graph */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={20} /></div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1E293B' }}>Status Overview</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Current state of all assets</p>
            </div>
          </div>
          <div style={{ height: '320px', width: '100%' }}>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                  <Bar dataKey="Total" radius={[0, 6, 6, 0]} barSize={32}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>No data available</div>}
          </div>
        </div>
      </div>

      {/* Department-wise Allocations - Large Premium Bar Graph */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={20} /></div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1E293B' }}>Department Allocation Trends</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Active assets currently allocated per department</p>
          </div>
        </div>
        <div style={{ height: '380px', width: '100%' }}>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={12} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={12} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                <Bar dataKey="Active" name="Active Allocations" fill="#4318FF" radius={[8, 8, 0, 0]} maxBarSize={60}>
                   {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>No active allocations found</div>}
        </div>
      </div>
    </div>
  );
};

export default Reports;
