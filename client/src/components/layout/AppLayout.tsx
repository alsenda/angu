import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/courses',   label: 'Mis Cursos' },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <div className="app-wrapper">
      {/* Overlay */}
      <div
        className={`sidebar-overlay${open ? ' show' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`app-sidebar${open ? ' open' : ''}`}>
        <Link to="/" className="app-sidebar-logo" onClick={() => setOpen(false)}>
          <img src="https://autoescuelaangu.com/img/logo.jpg" alt="Logo" />
          Autoescuela Angu
        </Link>

        <nav className="app-sidebar-nav">
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`app-sidebar-link${isActive(to) ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={`app-sidebar-link${isActive('/admin') ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              Panel Admin
            </Link>
          )}
        </nav>

        <div className="app-sidebar-user">
          <p className="app-sidebar-user-name">{user?.name}</p>
          <p className="app-sidebar-user-email">{user?.email}</p>
          <Button onClick={handleLogout}>Cerrar sesión</Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="app-content">
        {/* Mobile header */}
        <div className="app-mobile-header">
          <button className="app-mobile-hamburger" onClick={() => setOpen(true)}>☰</button>
          <span className="app-mobile-header-title">Autoescuela Angu</span>
        </div>

        <main className="app-page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.15)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '6px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: '13px',
        width: '100%',
      }}
    >
      {children}
    </button>
  );
}
