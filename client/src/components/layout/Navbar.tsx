import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    close();
  };

  return (
    <header className="navbar">
      <img
        className="logo"
        src="https://autoescuelaangu.com/img/logo.jpg"
        alt="Logo Autoescuela Angu"
      />
      <span className="title">Autoescuela Angu</span>

      <nav style={{ marginLeft: 'auto', display: 'contents' }}>
        <ul className={`ul-nav${open ? ' show' : ''}`}>
          <li><Link to="/" onClick={close}>Inicio</Link></li>
          <li><Link to="/courses" onClick={close}>Cursos</Link></li>

          {user ? (
            <>
              <li>
                <button onClick={() => { navigate('/dashboard'); close(); }}>
                  Mi área
                </button>
              </li>
              {user.role === 'ADMIN' && (
                <li>
                  <button onClick={() => { navigate('/admin'); close(); }}>
                    Admin
                  </button>
                </li>
              )}
              <li>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={() => { navigate('/login'); close(); }}>
                  Iniciar sesión
                </button>
              </li>
              <li>
                <button
                  className="nav-cta"
                  onClick={() => { navigate('/register'); close(); }}
                >
                  Registrarse gratis
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
        aria-expanded={open}
      >
        {open ? '✕' : '☰'}
      </button>
    </header>
  );
}
