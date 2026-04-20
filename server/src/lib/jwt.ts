import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface TokenPayload {
  userId: string;
  tenantId: string;
  role: string;
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}
