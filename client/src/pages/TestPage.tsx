import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Button from '../components/ui/Button';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  imageUrl?: string;
  order: number;
}

interface Test {
  id: string;
  title: string;
  timeLimit: number;
  questions: Question[];
  course: { id: string; title: string };
}

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleSubmit = useCallback(async (finalAnswers: Record<string, string>) => {
    if (!id || submitting) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const res = await api.post(`/tests/${id}/submit`, { answers: finalAnswers });
      navigate(`/tests/${id}/results/${res.data.attemptId}`);
    } catch {
      setSubmitting(false);
    }
  }, [id, submitting, navigate]);

  useEffect(() => {
    api.get(`/tests/${id}`).then((r) => {
      setTest(r.data);
      setTimeLeft(r.data.timeLimit * 60);
    });
  }, [id]);

  useEffect(() => {
    if (!timeLeft || !test) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [test, timeLeft, answers, handleSubmit]);

  if (!test) return <p>Cargando test...</p>;

  const question = test.questions[current];
  const answered = Object.keys(answers).length;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const next = () => {
    if (current < test.questions.length - 1) setCurrent(current + 1);
    else setShowConfirm(true);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div>
      <div>
        <strong>{test.title}</strong>
        {' — '}
        Tiempo: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {showConfirm && (
        <div>
          <p>
            Has respondido <strong>{answered}</strong> de <strong>{test.questions.length}</strong> preguntas.
            {answered < test.questions.length && <> Quedan <strong>{test.questions.length - answered}</strong> sin contestar.</>}
          </p>
          <Button onClick={() => setShowConfirm(false)}>Cancelar</Button>
          {' '}
          <Button loading={submitting} onClick={() => handleSubmit(answers)}>Entregar</Button>
        </div>
      )}

      <p>Pregunta {current + 1} de {test.questions.length} — {answered} respondidas</p>

      <p><strong>{question.text}</strong></p>

      <div>
        {question.options.map((opt) => {
          const selected = answers[question.id] === opt.id;
          return (
            <div key={opt.id}>
              <label>
                <input
                  type="radio"
                  name={question.id}
                  checked={selected}
                  onChange={() => selectAnswer(question.id, opt.id)}
                />
                {' '}{opt.text}
              </label>
            </div>
          );
        })}
      </div>

      <div>
        <Button onClick={prev} disabled={current === 0}>Anterior</Button>
        {' '}
        <Button onClick={next}>
          {current === test.questions.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
}
