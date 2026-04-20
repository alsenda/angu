import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(requireAuth);

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const test = await prisma.test.findFirst({
    where: { id: req.params.id, course: { tenantId: req.user!.tenantId } },
    include: {
      questions: { orderBy: { order: 'asc' } },
      course: { select: { title: true, id: true } },
    },
  });
  if (!test) {
    res.status(404).json({ error: 'Test no encontrado' });
    return;
  }

  const questions = test.questions.map((q) => ({
    ...q,
    options: JSON.parse(q.options),
    correctAnswer: undefined,
    explanation: undefined,
  }));

  res.json({ ...test, questions });
});

const submitSchema = z.object({
  answers: z.record(z.string()),
});

router.post('/:id/submit', async (req: AuthRequest, res: Response) => {
  const body = submitSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.flatten() });
    return;
  }

  const test = await prisma.test.findFirst({
    where: { id: req.params.id, course: { tenantId: req.user!.tenantId } },
    include: { questions: true },
  });
  if (!test) {
    res.status(404).json({ error: 'Test no encontrado' });
    return;
  }

  const { answers } = body.data;
  let correct = 0;
  const results = test.questions.map((q) => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correct++;
    return { questionId: q.id, selected, correct: isCorrect, correctAnswer: q.correctAnswer, explanation: q.explanation };
  });

  const score = (correct / test.questions.length) * 100;
  const passed = score >= test.passingScore;

  const attempt = await prisma.testAttempt.create({
    data: {
      userId: req.user!.userId,
      testId: test.id,
      score,
      passed,
      answers: JSON.stringify(answers),
    },
  });

  res.json({ attemptId: attempt.id, score, passed, correct, total: test.questions.length, results });
});

router.get('/:id/attempts/:attemptId', async (req: AuthRequest, res: Response) => {
  const attempt = await prisma.testAttempt.findFirst({
    where: { id: req.params.attemptId, userId: req.user!.userId, testId: req.params.id },
    include: { test: { include: { questions: true } } },
  });
  if (!attempt) {
    res.status(404).json({ error: 'Intento no encontrado' });
    return;
  }

  const answers: Record<string, string> = JSON.parse(attempt.answers);
  const results = attempt.test.questions.map((q) => ({
    questionId: q.id,
    text: q.text,
    options: JSON.parse(q.options),
    selected: answers[q.id],
    correct: answers[q.id] === q.correctAnswer,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  res.json({ score: attempt.score, passed: attempt.passed, completedAt: attempt.completedAt, results });
});

export default router;
