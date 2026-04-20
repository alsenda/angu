import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

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

export default function CoursesPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/courses').then((r) => setCourses(r.data)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <main style={{ padding: '60px 20px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="page-header">
          <h1 className="page-title">Cursos disponibles</h1>
          <p className="page-subtitle">Todo el contenido necesario para aprobar el examen teórico del carnet B.</p>
        </div>

        {!user && (
          <div className="content-card" style={{ marginBottom: '24px' }}>
            <div className="content-card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <strong>Acceso completo gratuito</strong>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#555' }}>Regístrate para ver todos los vídeos y tests.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>Iniciar sesión</Button>
                <Button size="sm" onClick={() => navigate('/register')}>Registrarse</Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: '#888' }}>Cargando...</p>
        ) : (
          <div className="course-grid">
            {courses.map((course, i) => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => user ? navigate(`/courses/${course.id}`) : navigate('/register')}
              >
                <img className="course-card-img" src={courseImages[i % courseImages.length]} alt={course.title} />
                <div className="course-card-body">
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-desc">{course.description}</p>
                  <span className="course-card-meta">{course._count.lessons} lecciones · {course._count.tests} tests</span>
                </div>
              </div>
            ))}

            {!user && (
              <>
                {[
                  { title: 'Señales de Tráfico', lessons: 5, tests: 1, img: courseImages[1] },
                  { title: 'Mecánica y Seguridad Vial', lessons: 4, tests: 1, img: courseImages[2] },
                ].map((c) => (
                  <div key={c.title} className="course-card" onClick={() => navigate('/register')} style={{ position: 'relative' }}>
                    <img className="course-card-img" src={c.img} alt={c.title} style={{ filter: 'blur(2px)' }} />
                    <div className="course-card-body">
                      <h3 className="course-card-title">{c.title}</h3>
                      <span className="course-card-meta">{c.lessons} lecciones · {c.tests} test</span>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.6)', borderRadius: '12px' }}>
                      <span style={{ background: 'white', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', color: 'var(--green-dark)' }}>
                        🔒 Regístrate para acceder
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
