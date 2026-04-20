import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(requireAuth);

router.get('/', async (req: AuthRequest, res: Response) => {
  const courses = await prisma.course.findMany({
    where: { tenantId: req.user!.tenantId, published: true },
    include: { _count: { select: { lessons: true, tests: true } } },
    orderBy: { order: 'asc' },
  });
  res.json(courses);
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const course = await prisma.course.findFirst({
    where: { id: req.params.id, tenantId: req.user!.tenantId, published: true },
    include: {
      lessons: { orderBy: { order: 'asc' } },
      tests: { include: { _count: { select: { questions: true } } }, orderBy: { createdAt: 'asc' } },
    },
  });
  if (!course) {
    res.status(404).json({ error: 'Curso no encontrado' });
    return;
  }

  const progress = await prisma.lessonProgress.findMany({
    where: { userId: req.user!.userId, lesson: { courseId: course.id } },
  });
  const progressMap = Object.fromEntries(progress.map((p) => [p.lessonId, p]));

  res.json({ ...course, progressMap });
});

router.get('/:id/lessons/:lessonId', async (req: AuthRequest, res: Response) => {
  const lesson = await prisma.lesson.findFirst({
    where: { id: req.params.lessonId, courseId: req.params.id },
    include: { course: { select: { title: true, id: true } } },
  });
  if (!lesson) {
    res.status(404).json({ error: 'Lección no encontrada' });
    return;
  }

  const allLessons = await prisma.lesson.findMany({
    where: { courseId: req.params.id },
    orderBy: { order: 'asc' },
    select: { id: true, title: true, order: true, duration: true },
  });

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: req.user!.userId, lessonId: lesson.id } },
  });

  res.json({ lesson, allLessons, progress });
});

export default router;
