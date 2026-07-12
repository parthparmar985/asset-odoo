import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  // Mock data for analytics
  const utilizationData = [
    { name: 'Jan', Active: 4000, Idle: 2400 },
    { name: 'Feb', Active: 3000, Idle: 1398 },
    { name: 'Mar', Active: 2000, Idle: 9800 },
    { name: 'Apr', Active: 2780, Idle: 3908 },
    { name: 'May', Active: 1890, Idle: 4800 },
    { name: 'Jun', Active: 2390, Idle: 3800 },
    { name: 'Jul', Active: 3490, Idle: 4300 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Furniture', value: 300 },
    { name: 'Vehicles', value: 300 },
    { name: 'Hardware', value: 200 },
  ];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#0EA5E9'];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2>Reports & Analytics</h2>
        <button className="btn btn-outline">Export PDF</button>
      </div>

      <div className="grid-cols-3">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 className="mb-4">Asset Utilization Trends</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="Active" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Idle" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Assets by Category</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 3' }}>
          <h3 className="mb-4">Department-wise Allocation Summary</h3>
          <p style={{ color: 'var(--text-muted)' }}>Detailed tabular report will go here...</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
