import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const carouselImages = [
  { src: 'https://autoescuelaangu.com/img/fachada.jpg', alt: 'Fachada-autoescuela' },
  { src: 'https://autoescuelaangu.com/img/imagenfecebook.png', alt: 'Grupo-estudiantes-autoescuela' },
  { src: 'https://autoescuelaangu.com/img/alunnos1.jpg', alt: 'coche-prácticas' },
];

const courses = [
  {
    id: 'course-teoria-general',
    title: 'Teoría General de Conducción',
    description: 'Aprende los fundamentos del código de la circulación, señales de tráfico y normas básicas de conducción para el examen teórico.',
    lessons: 6,
    tests: 1,
    img: 'https://autoescuelaangu.com/img/alunnos1.jpg',
  },
  {
    id: 'course-senales',
    title: 'Señales de Tráfico',
    description: 'Domina todas las señales de tráfico: verticales, horizontales, semáforos y señales de los agentes.',
    lessons: 5,
    tests: 1,
    img: 'https://autoescuelaangu.com/img/alunnos.jpg',
  },
  {
    id: 'course-mecanica',
    title: 'Mecánica y Seguridad Vial',
    description: 'Conoce el funcionamiento básico del vehículo, mantenimiento preventivo y técnicas de conducción segura.',
    lessons: 0,
    tests: 0,
    img: 'https://autoescuelaangu.com/img/fachada.jpg',
  },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % carouselImages.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <Navbar />

      <main>
        {/* Carousel */}
        <div className="carousel">
          <div className="carousel-images" style={{ transform: `translateX(-${slide * 100}vw)` }}>
            {carouselImages.map((img) => (
              <img key={img.src} src={img.src} alt={img.alt} />
            ))}
          </div>
        </div>

        {/* Equipo */}
        <h2 className="enunciado">NUESTRO EQUIPO</h2>
        <div className="container-card">
          <div className="card">
            <img className="card-img" src="https://autoescuelaangu.com/img/imagen-profesora.jpg" alt="Angu, la profesora de teoría" />
            <div className="card-body">
              <h3 className="card-title">Hola soy Angu tu profesora</h3>
              <p>Nuestra experta en teoría, Angu, te guiará paso a paso para que domines los conocimientos necesarios.</p>
            </div>
          </div>
          <div className="card">
            <img className="card-img" src="https://autoescuelaangu.com/img/alunnos.jpg" alt="Profesor de prácticas con un alumno" />
            <div className="card-body">
              <h3 className="card-title">Profesor de Práctica</h3>
              <p>Con paciencia y experiencia, nuestro profesor de prácticas te preparará para el examen de la DGT.</p>
            </div>
          </div>
        </div>

        {/* Permiso B */}
        <div className="container-permiso">
          <div className="permiso">
            <h2>PERMISO DE CONDUCIR B</h2>
            <h3>Te preparamos para el Permiso de la clase B</h3>
            <h4>Con el B puedes conducir vehículos:</h4>
            <ul>
              <li>Turismos, furgones, autocaravanas y más, hasta 3.500 kg y 9 ocupantes.</li>
              <li>Turismos hasta 3.500 kg con remolque hasta 750 kg de MMA.</li>
              <li>Vehículos especiales agrícolas, ciclomotores y motos de 125 cc.</li>
            </ul>
          </div>
          <div className="requisitos">
            <h4>Requisitos</h4>
            <ol>
              <li>Tener un mínimo de 18 años.</li>
              <li>No estar legalmente inhabilitado para conducir.</li>
            </ol>
            <h4>Ventajas de la Autoescuela Angu</h4>
            <ul>
              <li>Los mejores profesores.</li>
              <li>Horario amplio y flexible con clases presenciales.</li>
              <li>Cursos intensivos y adaptados a las necesidades de cada alumno.</li>
              <li>Estamos en un lugar céntrico.</li>
              <li>Seguimiento personalizado.</li>
            </ul>
          </div>
        </div>

        {/* Cursos */}
        <h2 className="enunciado">NUESTROS CURSOS</h2>
        <div className="container-card" style={{ marginBottom: '20px' }}>
          {courses.map((course) => (
            <div
              key={course.id}
              className="card"
              style={{ cursor: 'pointer', height: 'auto' }}
              onClick={() => navigate(user ? `/courses/${course.id}` : '/login')}
            >
              <img className="card-img" src={course.img} alt={course.title} />
              <div className="card-body">
                <h3 className="card-title">{course.title}</h3>
                <p>{course.description}</p>
                <p style={{ color: 'var(--green-dark)', fontWeight: 'bold', fontSize: '14px' }}>
                  {course.lessons > 0 ? `${course.lessons} lecciones` : 'Próximamente'}
                  {course.tests > 0 ? ` · ${course.tests} test` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button
            onClick={() => navigate(user ? '/courses' : '/register')}
            style={{
              background: 'var(--green-dark)',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {user ? 'Ver todos los cursos' : 'Acceder a los cursos'}
          </button>
        </div>

        {/* Apps y reseñas */}
        <div className="app-reviews-section">
          <div className="containe_google contenedor-iconos">
            <h2 className="h1-servicios">Pincha el icono de la aplicación que necesites</h2>
            <a className="app-link" href="https://www.gestion.matferline.com/acceso/" target="_blank" rel="noreferrer">
              <img src="https://autoescuelaangu.com/img/logo_matferline.png" alt="Logo Matferline" width="150" />
            </a>
            <a className="app-link" href="https://play.google.com/store/search?q=facil%20auto&c=apps&hl=es_419&gl=US" target="_blank" rel="noreferrer">
              <img src="https://autoescuelaangu.com/img/Disponible-en-Google-Play.png" alt="Google Play" width="150" />
            </a>
            <a className="app-link" href="https://apps.apple.com/es/app/facil-auto/id6444221234" target="_blank" rel="noreferrer">
              <img src="https://autoescuelaangu.com/img/Consiguelo-en-el-App-Store.png" alt="App Store" width="150" />
            </a>
          </div>

          <div className="review-container">
            <h2>¡Nos Encantaría Escuchar Tu Opinión!</h2>
            <p>Tu opinión es muy importante para nosotros. Si has tenido una buena experiencia, por favor, déjanos una reseña en Google.</p>
            <a className="google-review-button" href="https://g.page/r/CbwoSA8d_3L_EAE/review" target="_blank" rel="noreferrer">
              <img className="icono-google" src="https://autoescuelaangu.com/img/icono-google.jpeg" alt="Google" width="30" />
              Deja tu Reseña en Google
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
