import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';

interface Summary {
  lessonsCompleted: number;
  totalLessons: number;
  passedTests: number;
  totalAttempts: number;
  recentAttempts: { id: string; score: number; passed: boolean; completedAt: string; test: { title: string } }[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  _count: { lessons: number; tests: number };
}

const courseImages = [
  'https://autoescuelaangu.com/img/alunnos1.jpg',
  'https://autoescuelaangu.com/img/alunnos.jpg',
  'https://autoescuelaangu.com/img/fachada.jpg',
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get('/progress/summary').then((r) => setSummary(r.data));
    api.get('/courses').then((r) => setCourses(r.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hola, {user?.name.split(' ')[0]}</h1>
        <p className="page-subtitle">Aquí tienes un resumen de tu progreso.</p>
      </div>

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{summary.lessonsCompleted}/{summary.totalLessons}</div>
            <div className="stat-label">Lecciones completadas</div>
            <ProgressBar value={summary.lessonsCompleted} max={summary.totalLessons || 1} showLabel />
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.totalAttempts}</div>
            <div className="stat-label">Tests realizados</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.passedTests}</div>
            <div className="stat-label">Tests aprobados</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {summary.totalAttempts > 0
                ? `${Math.round((summary.passedTests / summary.totalAttempts) * 100)}%`
                : '—'}
            </div>
            <div className="stat-label">Tasa de aprobado</div>
          </div>
        </div>
      )}

      {summary?.recentAttempts && summary.recentAttempts.length > 0 && (
        <section>
          <h2 className="section-heading">Últimos tests</h2>
          <div className="list-card">
            {summary.recentAttempts.map((a) => (
              <div key={a.id} className="list-item">
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '14px' }}>{a.test.title}</strong>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                    {new Date(a.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <span style={{ fontWeight: 600, marginRight: '8px' }}>{Math.round(a.score)}%</span>
                <Badge variant={a.passed ? 'success' : 'error'}>{a.passed ? 'Aprobado' : 'Suspenso'}</Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="section-heading">Mis cursos</h2>
        {courses.length === 0 ? (
          <p style={{ color: '#666' }}>No hay cursos disponibles aún.</p>
        ) : (
          <div className="course-grid">
            {courses.map((course, i) => (
              <div key={course.id} className="course-card" onClick={() => navigate(`/courses/${course.id}`)}>
                <img className="course-card-img" src={courseImages[i % courseImages.length]} alt={course.title} />
                <div className="course-card-body">
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-desc">{course.description}</p>
                  <span className="course-card-meta">{course._count.lessons} lecciones · {course._count.tests} tests</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
