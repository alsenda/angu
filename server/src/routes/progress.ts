import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(requireAuth);

const updateSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean().optional(),
  watchedSeconds: z.number().optional(),
});

router.post('/lesson', async (req: AuthRequest, res: Response) => {
  const body = updateSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.flatten() });
    return;
  }
  const { lessonId, completed, watchedSeconds } = body.data;

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: req.user!.userId, lessonId } },
    create: { userId: req.user!.userId, lessonId, completed: completed ?? false, watchedSeconds: watchedSeconds ?? 0 },
    update: {
      ...(completed !== undefined && { completed }),
      ...(watchedSeconds !== undefined && { watchedSeconds }),
    },
  });

  res.json(progress);
});

router.get('/summary', async (req: AuthRequest, res: Response) => {
  const [completed, totalLessons, attempts] = await Promise.all([
    prisma.lessonProgress.count({ where: { userId: req.user!.userId, completed: true } }),
    prisma.lesson.count({ where: { course: { tenantId: req.user!.tenantId, published: true } } }),
    prisma.testAttempt.findMany({
      where: { userId: req.user!.userId },
      orderBy: { completedAt: 'desc' },
      take: 5,
      include: { test: { select: { title: true } } },
    }),
  ]);

  const passedTests = await prisma.testAttempt.count({ where: { userId: req.user!.userId, passed: true } });
  const totalAttempts = await prisma.testAttempt.count({ where: { userId: req.user!.userId } });

  res.json({
    lessonsCompleted: completed,
    totalLessons,
    passedTests,
    totalAttempts,
    recentAttempts: attempts,
  });
});

export default router;
