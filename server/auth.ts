import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  company_id?: string;
  branch_id?: string;
  role: string;
  business_category?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      company_id: user.company_id,
      branch_id: user.branch_id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acesso obrigatório' });
  }

  const token = authHeader.substring(7);
  const user = verifyToken(token);
  
  if (!user) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }

  (req as any).user = user;
  next();
}

export function extractUserFromRequest(req: Request): AuthUser | null {
  return (req as any).user || null;
}