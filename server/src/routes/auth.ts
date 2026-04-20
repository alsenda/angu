import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { requireAuth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  tenantSlug: z.string(),
});

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string(),
  tenantSlug: z.string(),
});

router.post('/register', async (req: Request, res: Response) => {
  const body = registerSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.flatten() });
    return;
  }
  const { name, email, password, tenantSlug } = body.data;

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) {
    res.status(404).json({ error: 'Escuela no encontrada' });
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email } },
  });
  if (existing) {
    res.status(409).json({ error: 'El email ya está en uso' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, tenantId: tenant.id },
  });

  const payload = { userId: user.id, tenantId: tenant.id, role: user.role };
  res.status(201).json({
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.post('/login', async (req: Request, res: Response) => {
  const body = loginSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.flatten() });
    return;
  }
  const { email, password, tenantSlug } = body.data;

  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (!tenant) {
    res.status(404).json({ error: 'Escuela no encontrada' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email } },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: 'Credenciales incorrectas' });
    return;
  }

  const payload = { userId: user.id, tenantId: tenant.id, role: user.role };
  res.json({
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token requerido' });
    return;
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }
    const newPayload = { userId: user.id, tenantId: user.tenantId, role: user.role };
    res.json({ accessToken: signAccessToken(newPayload) });
  } catch {
    res.status(401).json({ error: 'Refresh token inválido' });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  res.json(user);
});

export default router;
