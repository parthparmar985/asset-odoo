import React from 'react';
import { format } from 'date-fns';

const ActivityLogs = () => {
  // Mock data for activity logs
  const logs = [
    { id: 1, user: 'Admin User', action: 'Created Department', target: 'Engineering', time: new Date() },
    { id: 2, user: 'Asset Manager', action: 'Allocated Asset', target: 'AF-0012 to John Doe', time: new Date(Date.now() - 3600000) },
    { id: 3, user: 'John Doe', action: 'Raised Maintenance Request', target: 'AF-0012', time: new Date(Date.now() - 86400000) },
    { id: 4, user: 'Jane Smith', action: 'Booked Resource', target: 'Conference Room A', time: new Date(Date.now() - 172800000) },
    { id: 5, user: 'Admin User', action: 'Registered Asset', target: 'AF-0013', time: new Date(Date.now() - 259200000) },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2>System Activity Logs</h2>
        <div className="form-input" style={{ width: '300px' }}>
          <input type="text" placeholder="Search logs..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
        </div>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Timestamp</th>
                <th style={{ padding: '0.75rem' }}>User</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
                <th style={{ padding: '0.75rem' }}>Target</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                    {format(log.time, 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{log.user}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-info">{log.action}</span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
