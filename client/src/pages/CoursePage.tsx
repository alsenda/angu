import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { formatDuration } from '../lib/utils';

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  order: number;
}

interface Test {
  id: string;
  title: string;
  timeLimit: number;
  passingScore: number;
  _count: { questions: number };
}

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  tests: Test[];
  progressMap: Record<string, { completed: boolean }>;
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${id}`).then((r) => setCourse(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!course) return <p>Curso no encontrado.</p>;

  const completed = course.lessons.filter((l) => course.progressMap[l.id]?.completed).length;

  return (
    <div>
      <Link to="/dashboard">← Volver al dashboard</Link>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Progreso: {completed} de {course.lessons.length} lecciones <ProgressBar value={completed} max={course.lessons.length} showLabel /></p>

      <h2>Lecciones</h2>
      <ol>
        {course.lessons.map((lesson) => {
          const done = course.progressMap[lesson.id]?.completed;
          return (
            <li key={lesson.id}>
              <button onClick={() => navigate(`/courses/${course.id}/lessons/${lesson.id}`)}>
                {done ? '[✓] ' : ''}{lesson.title}
                {lesson.duration && ` (${formatDuration(lesson.duration)})`}
              </button>
            </li>
          );
        })}
      </ol>

      <h2>Tests</h2>
      {course.tests.length === 0 ? (
        <p>No hay tests en este curso aún.</p>
      ) : (
        <ul>
          {course.tests.map((test) => (
            <li key={test.id}>
              {test.title} — {test._count.questions} preguntas · {test.timeLimit} min{' '}
              <Button size="sm" onClick={() => navigate(`/tests/${test.id}`)}>Empezar test</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
