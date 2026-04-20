import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  footer?: React.ReactNode;
}

export default function AuthLayout({ children, title, footer }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/">
            <img src="https://autoescuelaangu.com/img/logo.jpg" alt="Logo Autoescuela Angu" />
          </Link>
          <Link to="/" className="auth-logo-name">Autoescuela Angu</Link>
        </div>
        <h2 className="auth-title">{title}</h2>
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
}
