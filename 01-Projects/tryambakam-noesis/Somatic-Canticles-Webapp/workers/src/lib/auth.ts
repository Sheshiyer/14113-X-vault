import type { AuthPayload, User } from '../types';
import { executeFirst, executeRun } from './db';

// JWT-like simple token handling (for demo purposes)
// In production, use a proper JWT library or Cloudflare's built-in auth

const TOKEN_SECRET = 'your-secret-key-change-in-production';

export function generateToken(payload: AuthPayload): string {
  // Simple base64 encoding for demo
  // In production, use proper JWT signing
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }));
  const signature = btoa(`${header}.${body}.${TOKEN_SECRET}`);
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, body, signature] = parts;
    const expectedSignature = btoa(`${header}.${body}.${TOKEN_SECRET}`);
    
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(atob(body));
    
    if (payload.exp < Date.now()) return null;
    
    return {
      userId: payload.userId,
      email: payload.email
    };
  } catch {
    return null;
  }
}

export function extractBearerToken(header: string | null): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

// Password hashing (simple, for demo - use bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + TOKEN_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

// Database operations
export async function getUserByEmail(
  db: D1Database,
  email: string
): Promise<User | null> {
  return await executeFirst<User>(
    db,
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
}

export async function getUserById(
  db: D1Database,
  id: string
): Promise<User | null> {
  return await executeFirst<User>(
    db,
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
}

export async function createUser(
  db: D1Database,
  user: {
    id: string;
    email: string;
    password_hash: string;
    name?: string;
    birth_date?: string;
  }
): Promise<void> {
  await executeRun(
    db,
    `INSERT INTO users (id, email, password_hash, name, birth_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [user.id, user.email, user.password_hash, user.name || null, user.birth_date || null]
  );
}

export async function updateUser(
  db: D1Database,
  id: string,
  updates: {
    name?: string;
    birth_date?: string;
  }
): Promise<void> {
  const fields: string[] = [];
  const values: (string | null)[] = [];
  
  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.birth_date !== undefined) {
    fields.push('birth_date = ?');
    values.push(updates.birth_date);
  }
  
  if (fields.length === 0) return;
  
  fields.push('updated_at = datetime("now")');
  values.push(id);
  
  await executeRun(
    db,
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}
