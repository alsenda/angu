import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const heroSlides = [
  { src: 'https://autoescuelaangu.com/img/fachada.jpg', alt: 'Fachada de Autoescuela Angu' },
  { src: 'https://autoescuelaangu.com/img/imagenfecebook.png', alt: 'Grupo de estudiantes' },
  { src: 'https://autoescuelaangu.com/img/alunnos1.jpg', alt: 'Clase práctica' },
];

const courses = [
  {
    id: 'course-teoria-general',
    title: 'Teoría General de Conducción',
    description: 'Domina el código de la circulación, señales de tráfico y normas básicas para el examen teórico.',
    lessons: 6,
    tests: 1,
    xp: 500,
    difficulty: 2,
    icon: '🚗',
    photo: 'https://autoescuelaangu.com/img/alunnos1.jpg',
    available: true,
  },
  {
    id: 'course-senales',
    title: 'Señales de Tráfico',
    description: 'Domina todas las señales: verticales, horizontales, semáforos y señales de los agentes.',
    lessons: 5,
    tests: 1,
    xp: 400,
    difficulty: 3,
    icon: '🚦',
    photo: 'https://autoescuelaangu.com/img/alunnos.jpg',
    available: true,
  },
  {
    id: 'course-mecanica',
    title: 'Mecánica y Seguridad Vial',
    description: 'Funcionamiento del vehículo, mantenimiento preventivo y técnicas de conducción segura.',
    lessons: 0,
    tests: 0,
    xp: 350,
    difficulty: 2,
    icon: '🔧',
    photo: 'https://autoescuelaangu.com/img/fachada.jpg',
    available: false,
  },
];

const journeySteps = [
  {
    number: '1',
    icon: '📝',
    title: 'Regístrate',
    desc: 'Crea tu perfil gratuito y accede a todos los contenidos.',
    xp: '+50 XP al unirte',
  },
  {
    number: '2',
    icon: '📖',
    title: 'Estudia',
    desc: 'Lecciones en vídeo a tu ritmo. Avanza cuando quieras.',
    xp: '+100 XP por lección',
  },
  {
    number: '3',
    icon: '✏️',
    title: 'Practica',
    desc: 'Tests que simulan el examen real de la DGT.',
    xp: '+200 XP por test',
  },
  {
    number: '4',
    icon: '🏆',
    title: '¡Aprueba!',
    desc: 'Llega al examen con confianza y consigue tu carnet B.',
    xp: '+500 XP al aprobar',
  },
];

const team = [
  {
    name: 'Angu',
    role: 'Profesora de Teoría',
    bio: 'Te guiará paso a paso para que domines todos los conocimientos del código de circulación y aprendas con confianza.',
    photo: 'https://autoescuelaangu.com/img/imagen-profesora.jpg',
    skills: ['Código de Circulación', 'Señales de Tráfico', 'Test DGT'],
    badge: '⭐ Profesora destacada',
  },
  {
    name: 'Instructor de Prácticas',
    role: 'Instructor Vial',
    bio: 'Con paciencia y experiencia te preparará para superar el examen práctico de la DGT con total seguridad.',
    photo: 'https://autoescuelaangu.com/img/alunnos.jpg',
    skills: ['Conducción Urbana', 'Autovía', 'Maniobras DGT'],
    badge: '🏆 +500 alumnos aprobados',
  },
];

const stats = [
  { icon: '🎓', value: '847+', label: 'Alumnos aprobados' },
  { icon: '📈', value: '94%', label: 'Tasa de éxito' },
  { icon: '⭐', value: '4.9/5', label: 'Valoración Google' },
  { icon: '📅', value: '15+', label: 'Años de experiencia' },
];

function DifficultyStars({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <span className="course-difficulty" title={`Dificultad: ${level}/${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ opacity: i < level ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [xpWidth, setXpWidth] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setXpWidth(34), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleCourseClick = (course: typeof courses[0]) => {
    if (!course.available) return;
    navigate(user ? `/courses/${course.id}` : '/login');
  };

  return (
    <div>
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-slides">
            {heroSlides.map((img, i) => (
              <div
                key={img.src}
                className={`hero-slide${i === slide ? ' active' : ''}`}
                style={{ backgroundImage: `url(${img.src})` }}
                aria-hidden={i !== slide}
              />
            ))}
          </div>
          <div className="hero-overlay" />

          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Aprende · Gana XP · Aprueba
            </div>

            <h1 className="hero-title">
              Tu carnet de conducir<br />
              <span className="hero-gradient-text">te está esperando</span>
            </h1>

            <p className="hero-subtitle">
              Supera lecciones, gana puntos de experiencia y llega al examen de la DGT con total confianza.
            </p>

            <div className="hero-actions">
              <button
                className="btn-hero-primary"
                onClick={() => navigate(user ? '/courses' : '/register')}
              >
                {user ? 'Continuar mi aventura →' : 'Comenzar ahora →'}
              </button>
              <button
                className="btn-hero-secondary"
                onClick={() => navigate('/courses')}
              >
                Ver cursos
              </button>
            </div>

            <div className="hero-xp">
              <div className="hero-xp-label">
                <span>Tu progreso XP</span>
                <span className="hero-xp-value">
                  {user ? '340 / 1000 XP' : 'Regístrate para comenzar'}
                </span>
              </div>
              <div className="hero-xp-track">
                <div className="hero-xp-fill" style={{ width: user ? '34%' : `${xpWidth}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Strip ── */}
        <div className="home-stats">
          {stats.map((s) => (
            <div key={s.label} className="home-stat-pill">
              <span className="home-stat-icon">{s.icon}</span>
              <span className="home-stat-value">{s.value}</span>
              <span className="home-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Journey Steps ── */}
        <section className="home-section home-section-center">
          <span className="home-section-label">Tu ruta</span>
          <h2 className="home-section-title">Cuatro pasos hacia tu carnet</h2>
          <p className="home-section-subtitle">
            Un camino claro, guiado y gamificado desde el primer día hasta el examen.
          </p>

          <div className="journey-steps">
            {journeySteps.map((step) => (
              <div key={step.number} className="journey-step">
                <div className="journey-step-number">{step.number}</div>
                <span className="journey-step-icon">{step.icon}</span>
                <p className="journey-step-title">{step.title}</p>
                <p className="journey-step-desc">{step.desc}</p>
                <span className="journey-step-xp">⚡ {step.xp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Courses ── */}
        <section
          className="home-section home-section-center"
          style={{ background: 'var(--surface)', borderRadius: '24px', margin: '0 auto 0', maxWidth: '100%', padding: '72px 5%' }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <span className="home-section-label green">Misiones disponibles</span>
            <h2 className="home-section-title">Elige tu primer curso</h2>
            <p className="home-section-subtitle">
              Cada curso es una misión con XP, lecciones en vídeo y tests del examen real.
            </p>

            <div className="home-courses-grid">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="course-card-game"
                  onClick={() => handleCourseClick(course)}
                  style={{ opacity: course.available ? 1 : 0.85 }}
                >
                  <div className="course-card-game-header">
                    <img
                      className="course-card-game-photo"
                      src={course.photo}
                      alt={course.title}
                    />
                    <span className="course-card-game-icon">{course.icon}</span>
                    <span className="course-card-game-xp">⚡ +{course.xp} XP</span>
                  </div>

                  <div className="course-card-game-body">
                    <h3 className="course-card-game-title">{course.title}</h3>
                    <p className="course-card-game-desc">{course.description}</p>

                    <div className="course-card-game-meta">
                      <DifficultyStars level={course.difficulty} />
                      <span className="course-lessons-count">
                        {course.available
                          ? `${course.lessons} lecciones · ${course.tests} test`
                          : 'Próximamente'}
                      </span>
                    </div>

                    {course.available && (
                      <>
                        <div className="course-card-progress-label">Progreso</div>
                        <div className="course-card-progress-track">
                          <div className="course-card-progress-fill" style={{ width: '0%' }} />
                        </div>
                      </>
                    )}

                    {course.available ? (
                      <button className="course-card-cta">
                        {user ? 'Continuar misión →' : 'Iniciar misión →'}
                      </button>
                    ) : (
                      <div style={{ textAlign: 'center', paddingTop: 4 }}>
                        <span className="coming-soon-badge">🔒 Próximamente</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 36 }}>
              <button
                className="btn btn-primary btn-lg"
                style={{ borderRadius: 'var(--radius-full)' }}
                onClick={() => navigate(user ? '/courses' : '/register')}
              >
                {user ? 'Ver todos los cursos' : 'Registrarse gratis'}
              </button>
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="home-section home-section-center">
          <span className="home-section-label purple">Tu equipo</span>
          <h2 className="home-section-title">Los mejores instructores</h2>
          <p className="home-section-subtitle">
            Profesionales con años de experiencia preparando a alumnos para la DGT.
          </p>

          <div className="team-grid" style={{ maxWidth: 700, margin: '0 auto' }}>
            {team.map((member) => (
              <div key={member.name} className="team-card">
                <img
                  className="team-card-photo"
                  src={member.photo}
                  alt={member.name}
                />
                <div className="team-card-body">
                  <span className="team-card-role">🎓 {member.role}</span>
                  <h3 className="team-card-name">{member.name}</h3>
                  <p className="team-card-bio">{member.bio}</p>
                  <div className="team-card-skills">
                    {member.skills.map((skill) => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Permiso B Mission Brief ── */}
        <section className="mission-section">
          <div className="mission-inner">
            <div>
              <span className="mission-header-label">🎯 La misión principal</span>
              <h2 className="mission-title">Permiso de Conducir Clase B</h2>
              <p className="mission-subtitle">
                El carnet que te abre las puertas a la movilidad total. Te preparamos de principio a fin.
              </p>

              <div className="mission-vehicles">
                <div className="mission-vehicle">
                  <span className="mission-vehicle-icon">🚗</span>
                  Turismos, furgones y autocaravanas hasta 3.500 kg y 9 ocupantes
                </div>
                <div className="mission-vehicle">
                  <span className="mission-vehicle-icon">🚌</span>
                  Vehículos con remolque hasta 750 kg de MMA
                </div>
                <div className="mission-vehicle">
                  <span className="mission-vehicle-icon">🚜</span>
                  Vehículos agrícolas especiales
                </div>
                <div className="mission-vehicle">
                  <span className="mission-vehicle-icon">🛵</span>
                  Ciclomotores y motos hasta 125 cc
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="mission-card">
                <p className="mission-card-title">📋 Requisitos</p>
                <ul className="mission-card-list">
                  <li>Tener un mínimo de 18 años</li>
                  <li>No estar inhabilitado legalmente para conducir</li>
                </ul>
              </div>

              <div className="mission-card">
                <p className="mission-card-title">🏅 Ventajas de Autoescuela Angu</p>
                <ul className="mission-card-list">
                  <li>Los mejores profesores, siempre a tu lado</li>
                  <li>Horario amplio y flexible con clases presenciales</li>
                  <li>Cursos intensivos adaptados a cada alumno</li>
                  <li>Ubicación céntrica en Sanlúcar de Barrameda</li>
                  <li>Seguimiento personalizado hasta el examen</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Apps & Reviews ── */}
        <section className="social-section">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="app-card">
              <h3 className="app-card-title">Aplicaciones de estudio</h3>
              <p className="app-card-subtitle">Accede a tus herramientas de preparación para el examen DGT.</p>
              <div className="app-links">
                <a
                  className="app-link-item"
                  href="https://www.gestion.matferline.com/acceso/"
                  target="_blank"
                  rel="noreferrer"
                  title="Matferline — Gestión de expediente"
                >
                  <img src="https://autoescuelaangu.com/img/logo_matferline.png" alt="Matferline" width="140" />
                </a>
                <a
                  className="app-link-item"
                  href="https://play.google.com/store/search?q=facil%20auto&c=apps&hl=es_419&gl=US"
                  target="_blank"
                  rel="noreferrer"
                  title="Fácil Auto en Google Play"
                >
                  <img src="https://autoescuelaangu.com/img/Disponible-en-Google-Play.png" alt="Google Play" width="140" />
                </a>
                <a
                  className="app-link-item"
                  href="https://apps.apple.com/es/app/facil-auto/id6444221234"
                  target="_blank"
                  rel="noreferrer"
                  title="Fácil Auto en App Store"
                >
                  <img src="https://autoescuelaangu.com/img/Consiguelo-en-el-App-Store.png" alt="App Store" width="140" />
                </a>
              </div>
            </div>

            <div className="review-card">
              <h3 className="review-card-title">¿Ya eres alumno?</h3>
              <p className="review-card-text">
                Tu opinión nos ayuda a mejorar y a que otros alumnos nos encuentren. ¡Déjanos una reseña en Google!
              </p>
              <a
                className="google-review-btn"
                href="https://g.page/r/CbwoSA8d_3L_EAE/review"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://autoescuelaangu.com/img/icono-google.jpeg"
                  alt="Google"
                  width="22"
                  height="22"
                  style={{ borderRadius: 4 }}
                />
                Dejar reseña en Google
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
