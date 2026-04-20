import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import Button from '../../components/ui/Button';

interface Stats {
  students: number;
  courses: number;
  attempts: number;
  passRate: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: { progress: number; testAttempts: number };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data));
    api.get('/admin/students').then((r) => setStudents(r.data));
  }, []);

  return (
    <div>
      <Button onClick={() => navigate('/dashboard')}>← Volver</Button>
      <h1>Panel de administración</h1>

      {stats && (
        <ul>
          <li>Alumnos: {stats.students}</li>
          <li>Cursos: {stats.courses}</li>
          <li>Tests realizados: {stats.attempts}</li>
          <li>Tasa de aprobado: {stats.passRate}%</li>
        </ul>
      )}

      <h2>Alumnos registrados</h2>
      {students.length === 0 ? (
        <p>No hay alumnos aún.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Lecciones</th>
              <th>Tests</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s._count.progress}</td>
                <td>{s._count.testAttempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
