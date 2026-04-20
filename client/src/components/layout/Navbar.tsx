import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <img className="logo" src="https://autoescuelaangu.com/img/logo.jpg" alt="Logo de Autoescuela Angu" />
      <h1 className="title">Autoescuela Angu</h1>
      <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
      <ul className={`ul-nav${open ? ' show' : ''}`}>
        <li><Link to="/" onClick={() => setOpen(false)}>Inicio</Link></li>
        <li><Link to="/courses" onClick={() => setOpen(false)}>Cursos</Link></li>
        {user ? (
          <>
            <li><button onClick={() => { navigate('/dashboard'); setOpen(false); }}>Mi área</button></li>
            {user.role === 'ADMIN' && (
              <li><button onClick={() => { navigate('/admin'); setOpen(false); }}>Admin</button></li>
            )}
            <li><button onClick={handleLogout}>Cerrar sesión</button></li>
          </>
        ) : (
          <>
            <li><button onClick={() => { navigate('/login'); setOpen(false); }}>Iniciar sesión</button></li>
            <li><button onClick={() => { navigate('/register'); setOpen(false); }}>Registrarse</button></li>
          </>
        )}
      </ul>
    </header>
  );
}
