import { Hono } from 'hono';
import type { Env, LoginInput, RegisterInput, ApiResponse, User } from '../types';
import {
  generateToken,
  verifyToken,
  extractBearerToken,
  hashPassword,
  verifyPassword,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser
} from '../lib/auth';

const auth = new Hono<{ Bindings: Env }>();

// Helper to generate UUID
function generateUUID(): string {
  return crypto.randomUUID();
}

// Register new user
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json<RegisterInput>();
    const { email, password, name, birth_date } = body;

    if (!email || !password) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Email and password are required'
      }, 400);
    }

    // Check if user exists
    const existingUser = await getUserByEmail(c.env.DB, email);
    if (existingUser) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'User already exists'
      }, 409);
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const userId = generateUUID();

    await createUser(c.env.DB, {
      id: userId,
      email,
      password_hash: passwordHash,
      name,
      birth_date
    });

    // Generate token
    const token = generateToken({ userId, email });

    return c.json<ApiResponse<{ token: string; user: { id: string; email: string; name: string | null } }>>({
      success: true,
      data: {
        token,
        user: { id: userId, email, name: name || null }
      }
    }, 201);
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Registration failed'
    }, 500);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json<LoginInput>();
    const { email, password } = body;

    if (!email || !password) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Email and password are required'
      }, 400);
    }

    // Get user
    const user = await getUserByEmail(c.env.DB, email);
    if (!user) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid credentials'
      }, 401);
    }

    // Verify password (in production, compare hashed passwords)
    const isValid = await verifyPassword(password, (user as unknown as { password_hash: string }).password_hash);
    if (!isValid) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid credentials'
      }, 401);
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return c.json<ApiResponse<{ token: string; user: { id: string; email: string; name: string | null } }>>({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name }
      }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Login failed'
    }, 500);
  }
});

// Get current user
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractBearerToken(authHeader);

    if (!token) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized'
      }, 401);
    }

    const payload = verifyToken(token);
    if (!payload) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid token'
      }, 401);
    }

    const user = await getUserById(c.env.DB, payload.userId);
    if (!user) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'User not found'
      }, 404);
    }

    return c.json<ApiResponse<Omit<User, 'password_hash'>>>({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        birth_date: user.birth_date,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to get user'
    }, 500);
  }
});

// Update user profile
auth.patch('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractBearerToken(authHeader);

    if (!token) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized'
      }, 401);
    }

    const payload = verifyToken(token);
    if (!payload) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid token'
      }, 401);
    }

    const body = await c.req.json<{ name?: string; birth_date?: string }>();
    await updateUser(c.env.DB, payload.userId, body);

    const updatedUser = await getUserById(c.env.DB, payload.userId);

    return c.json<ApiResponse<Omit<User, 'password_hash'>>>({
      success: true,
      data: {
        id: updatedUser!.id,
        email: updatedUser!.email,
        name: updatedUser!.name,
        birth_date: updatedUser!.birth_date,
        created_at: updatedUser!.created_at,
        updated_at: updatedUser!.updated_at
      }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to update user'
    }, 500);
  }
});

export default auth;
