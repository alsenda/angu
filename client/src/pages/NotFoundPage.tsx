import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '80px', fontWeight: 'bold', color: '#ccc', margin: '0 0 8px' }}>404</p>
        <h1 style={{ color: 'var(--green-dark)', margin: '0 0 8px' }}>Página no encontrada</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Esta página no existe o ha sido movida.</p>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    </div>
  );
}
