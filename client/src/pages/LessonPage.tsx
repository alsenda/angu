import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import VideoPlayer from '../components/ui/VideoPlayer';
import Button from '../components/ui/Button';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
}

interface SidebarLesson {
  id: string;
  title: string;
  order: number;
}

interface Progress {
  completed: boolean;
}

interface Data {
  lesson: Lesson & { course: { id: string; title: string } };
  allLessons: SidebarLesson[];
  progress: Progress | null;
}

export default function LessonPage() {
  const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Data | null>(null);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    api.get(`/courses/${courseId}/lessons/${lessonId}`).then((r) => {
      setData(r.data);
      setCompleted(r.data.progress?.completed ?? false);
    });
  }, [courseId, lessonId]);

  const markComplete = async () => {
    if (!lessonId) return;
    setMarking(true);
    await api.post('/progress/lesson', { lessonId, completed: true });
    setCompleted(true);
    setMarking(false);
  };

  if (!data) return <p>Cargando...</p>;

  const { lesson, allLessons } = data;
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prev = allLessons[currentIdx - 1];
  const next = allLessons[currentIdx + 1];

  return (
    <div>
      <p>
        <Link to="/dashboard">Dashboard</Link>
        {' / '}
        <Link to={`/courses/${courseId}`}>{lesson.course.title}</Link>
        {' / '}
        {lesson.title}
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 2 }}>
          <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />

          <h1>{lesson.title}</h1>
          {lesson.description && <p>{lesson.description}</p>}

          {completed ? (
            <p>[Completada]</p>
          ) : (
            <Button size="sm" loading={marking} onClick={markComplete}>Marcar completada</Button>
          )}

          <div>
            {prev ? (
              <Button onClick={() => navigate(`/courses/${courseId}/lessons/${prev.id}`)}>← Anterior</Button>
            ) : <span />}
            {' '}
            {next ? (
              <Button onClick={() => navigate(`/courses/${courseId}/lessons/${next.id}`)}>Siguiente →</Button>
            ) : (
              <Button onClick={() => navigate(`/courses/${courseId}`)}>Volver al curso</Button>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Contenido del curso</h3>
          <ol>
            {allLessons.map((l) => (
              <li key={l.id}>
                <button onClick={() => navigate(`/courses/${courseId}/lessons/${l.id}`)}>
                  {l.id === lessonId ? <strong>{l.title}</strong> : l.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
