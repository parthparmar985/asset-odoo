import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, Box, ArrowRightLeft, CalendarClock, Wrench, FileSearch, LogOut, BarChart3, Activity } from 'lucide-react';

const AppLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  ];

  if (['Admin', 'Asset Manager'].includes(user?.role)) {
    if (user?.role === 'Admin') {
      navItems.push({ name: 'Org Setup', path: '/org-setup', icon: <Users size={20} /> });
    }
    navItems.push(
      { name: 'All Assets', path: '/assets', icon: <Box size={20} /> },
      { name: 'Allocations', path: '/allocations', icon: <ArrowRightLeft size={20} /> }
    );
  } else {
    navItems.push(
      { name: 'My Assets', path: '/my-assets', icon: <Box size={20} /> }
    );
  }

  navItems.push(
    { name: 'Bookings', path: '/bookings', icon: <CalendarClock size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> }
  );

  if (['Admin', 'Asset Manager'].includes(user?.role)) {
    navItems.push(
      { name: 'Audits', path: '/audits', icon: <FileSearch size={20} /> },
      { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
      { name: 'Logs', path: '/logs', icon: <Activity size={20} /> }
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>AssetFlow</h2>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                borderRight: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                gap: '0.75rem',
                fontWeight: isActive ? '500' : '400',
                transition: 'var(--transition)'
              })}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user?.name}</div>
            <div style={{ color: 'var(--text-muted)' }}>{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline w-full" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="header">
          <h3 style={{ margin: 0, fontWeight: '500' }}>Welcome, {user?.name.split(' ')[0]}</h3>
          <div>
            <div className="badge badge-info">{user?.role} Mode</div>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
