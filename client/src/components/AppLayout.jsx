import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Box, ArrowRightLeft, CalendarClock,
  Wrench, FileSearch, LogOut, BarChart3, Activity,
  Settings, Bell, Search, Hexagon, ChevronDown
} from 'lucide-react';

const AppLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [];

  navItems.push({ name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> });

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Organization Setup', path: '/org-setup', icon: <Users size={18} /> });
  }

  if (['Admin', 'Asset Manager'].includes(user?.role)) {
    navItems.push(
      { name: 'All Assets', path: '/assets', icon: <Box size={18} /> },
      { name: 'Allocations', path: '/allocations', icon: <ArrowRightLeft size={18} /> }
    );
  } else {
    navItems.push({ name: 'My Assets', path: '/my-assets', icon: <Box size={18} /> });
  }

  navItems.push(
    { name: 'Bookings', path: '/bookings', icon: <CalendarClock size={18} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={18} /> }
  );

  if (['Admin', 'Asset Manager'].includes(user?.role)) {
    navItems.push(
      { name: 'Audits', path: '/audits', icon: <FileSearch size={18} /> },
      { name: 'Reports & Analytics', path: '/reports', icon: <BarChart3 size={18} /> },
      { name: 'Activity Logs', path: '/logs', icon: <Activity size={18} /> }
    );
  }

  navItems.push({ name: 'Notifications', path: '/notifications', icon: <Bell size={18} /> });

  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div style={s.layout}>
      <style>{`
        .nav-link { display:flex;align-items:center;gap:0.75rem;padding:0.8rem 1.1rem;border-radius:12px;color:var(--text-muted);font-weight:500;font-size:0.88rem;transition:var(--transition);text-decoration:none;cursor:pointer; }
        .nav-link:hover { background:var(--primary-light);color:var(--primary-color); }
        .nav-link.active { background:var(--primary-color);color:#fff;font-weight:700; }
        .logout-btn:hover { background:var(--danger-light)!important; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        {/* Brand */}
        <div style={s.brand}>
          <Hexagon size={32} color="#fff" fill="var(--primary-color)" />
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--text-main)', lineHeight: 1 }}>AssetFlow</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>Enterprise Management</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={s.navList}>
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Settings */}
        <div style={{ marginBottom: '0.25rem' }}>
          <div className="nav-link" style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Settings size={18} /> Settings
          </div>
        </div>

        {/* User Profile */}
        <div style={s.userBlock}>
          <div style={s.avatar}>{userInitial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role}</div>
          </div>
          <button onClick={handleLogout} title="Logout" style={s.logoutIcon} className="logout-btn">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main style={s.main}>
        {/* HEADER */}
        <header style={s.header}>
          <div style={s.searchBar}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Search assets, users, bookings..." style={s.searchInput} />
            <span style={s.kbdHint}>⌘K</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={s.iconBtn}><Bell size={18} /></div>
            <div style={{ width: 1, height: 28, backgroundColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <div style={{ ...s.avatar, width: 34, height: 34, fontSize: '0.9rem', backgroundColor: 'var(--primary-color)', color: '#fff' }}>{userInitial}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{userName}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role}</div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={s.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const s = {
  layout:  { display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--bg-main)' },
  sidebar: { width: 260, minWidth: 260, height: '100vh', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', padding: '1.25rem', boxShadow: '2px 0 20px rgba(112,144,176,0.07)', overflowY: 'auto', overflowX: 'hidden', gap: '0.25rem' },
  brand:   { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.25rem 0.25rem 0' },
  navList: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' },
  userBlock: { display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' },
  avatar:  { width: 38, height: 38, minWidth: 38, borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' },
  logoutIcon: { background: 'transparent', border: '1.5px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
  header:  { padding: '0.85rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid rgba(0,0,0,0.02)', flexShrink: 0 },
  searchBar: { display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'var(--bg-main)', border: 'none', borderRadius: '30px', padding: '0.7rem 1.25rem', width: 280 },
  searchInput: { border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '0.875rem', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' },
  kbdHint: { fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', backgroundColor: 'var(--border-color)', borderRadius: '4px', padding: '0.15rem 0.4rem' },
  iconBtn: { width: 36, height: 36, borderRadius: '10px', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' },
  content: { flex: 1, overflowY: 'auto', padding: '1.75rem' },
};

export default AppLayout;
