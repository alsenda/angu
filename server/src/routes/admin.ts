import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAdmin } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(requireAdmin);

router.get('/stats', async (req: AuthRequest, res: Response) => {
  const tenantId = req.user!.tenantId;
  const [students, courses, attempts, completed] = await Promise.all([
    prisma.user.count({ where: { tenantId, role: 'STUDENT' } }),
    prisma.course.count({ where: { tenantId } }),
    prisma.testAttempt.count({ where: { user: { tenantId } } }),
    prisma.testAttempt.count({ where: { user: { tenantId }, passed: true } }),
  ]);
  res.json({ students, courses, attempts, passRate: attempts > 0 ? Math.round((completed / attempts) * 100) : 0 });
});

router.get('/students', async (req: AuthRequest, res: Response) => {
  const students = await prisma.user.findMany({
    where: { tenantId: req.user!.tenantId, role: 'STUDENT' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { progress: true, testAttempts: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(students);
});

router.get('/courses', async (req: AuthRequest, res: Response) => {
  const courses = await prisma.course.findMany({
    where: { tenantId: req.user!.tenantId },
    include: { _count: { select: { lessons: true, tests: true } } },
    orderBy: { order: 'asc' },
  });
  res.json(courses);
});

router.get('/tenant', async (req: AuthRequest, res: Response) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: req.user!.tenantId },
    select: { id: true, name: true, slug: true, logoUrl: true, primaryColor: true, city: true, phone: true, email: true },
  });
  res.json(tenant);
});

export default router;
