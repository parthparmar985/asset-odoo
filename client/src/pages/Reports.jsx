import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [deptData, setDeptData] = useState([]);

  const COLORS = ['#4318FF', '#05CD99', '#FFCE20', '#EE5D50', '#8B5CF6', '#39B8FF'];

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [assetsRes, allocRes] = await Promise.all([
          axios.get('/api/assets', config),
          axios.get('/api/allocations', config)
        ]);

        const assets = assetsRes.data;
        const allocations = allocRes.data;

        // Process Category Data
        const catMap = {};
        assets.forEach(a => {
          const cat = a.category?.name || 'Uncategorized';
          catMap[cat] = (catMap[cat] || 0) + 1;
        });
        setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

        // Process Status Data (Simulating utilization over time using current status)
        const statMap = { Available: 0, Allocated: 0, 'Under Maintenance': 0, Retired: 0 };
        assets.forEach(a => {
          if (statMap[a.status] !== undefined) statMap[a.status]++;
        });
        setStatusData([
          { name: 'Available', value: statMap['Available'] },
          { name: 'Allocated', value: statMap['Allocated'] },
          { name: 'Maintenance', value: statMap['Under Maintenance'] }
        ]);

        // Process Department Data (from active allocations)
        const deptMap = {};
        allocations.forEach(alloc => {
          if (alloc.status === 'Active') {
            const dept = alloc.allocatedToUser?.department || 'General';
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

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dynamic reports...</div>;

  return (
    <div className="animate-fade-in printable-report" style={{ paddingBottom: '2rem' }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-report, .printable-report * { visibility: visible; }
          .printable-report { position: absolute; left: 0; top: 0; width: 100%; padding: 2rem; background: white; }
          .no-print { display: none !important; }
          .card { box-shadow: none !important; border: 1px solid #ccc !important; break-inside: avoid; }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Reports & Analytics
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Real-time insights and exportable PDFs
          </p>
        </div>
        <button className="btn btn-primary no-print" onClick={handleExportPDF}>
          <Printer size={16} /> Export PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem' }}>Assets by Category</h3>
          <div style={{ height: '300px' }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No data available</div>}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem' }}>Overall Asset Status</h3>
          <div style={{ height: '300px' }}>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No data available</div>}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.5rem' }}>Department-wise Active Allocations</h3>
        <div style={{ height: '350px' }}>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend />
                <Bar dataKey="Active" fill="#4318FF" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No active allocations found</div>}
        </div>
      </div>
    </div>
  );
};

export default Reports;
