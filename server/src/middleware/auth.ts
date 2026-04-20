import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import { AuthRequest } from '../types';

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  try {
    const token = header.slice(7);
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acceso restringido' });
      return;
    }
    next();
  });
}
