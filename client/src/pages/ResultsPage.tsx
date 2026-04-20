import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Button from '../components/ui/Button';

interface QuestionResult {
  questionId: string;
  text: string;
  options: { id: string; text: string }[];
  selected: string;
  correct: boolean;
  correctAnswer: string;
  explanation: string | null;
}

interface Results {
  score: number;
  passed: boolean;
  completedAt: string;
  results: QuestionResult[];
}

export default function ResultsPage() {
  const { id: testId, attemptId } = useParams<{ id: string; attemptId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Results | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/tests/${testId}/attempts/${attemptId}`).then((r) => setData(r.data));
  }, [testId, attemptId]);

  if (!data) return <p>Cargando resultados...</p>;

  const correct = data.results.filter((r) => r.correct).length;
  const total = data.results.length;

  return (
    <div>
      <h1>{Math.round(data.score)}% — {data.passed ? 'Aprobado' : 'Suspenso'}</h1>
      <p>{correct} respuestas correctas de {total}</p>

      <div>
        <Button onClick={() => navigate(`/tests/${testId}`)}>Repetir test</Button>
        {' '}
        <Button onClick={() => navigate('/dashboard')}>Ir al dashboard</Button>
      </div>

      <h2>Revisión de respuestas</h2>
      <ol>
        {data.results.map((r, i) => (
          <li key={r.questionId}>
            <button onClick={() => setExpanded(expanded === r.questionId ? null : r.questionId)}>
              {r.correct ? '[✓]' : '[✗]'} {i + 1}. {r.text}
            </button>
            {!r.correct && (
              <p>Tu respuesta: {r.options.find((o) => o.id === r.selected)?.text ?? 'Sin responder'}</p>
            )}
            {expanded === r.questionId && (
              <div>
                {!r.correct && (
                  <p>Respuesta correcta: {r.options.find((o) => o.id === r.correctAnswer)?.text}</p>
                )}
                {r.explanation && <p>Explicación: {r.explanation}</p>}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
