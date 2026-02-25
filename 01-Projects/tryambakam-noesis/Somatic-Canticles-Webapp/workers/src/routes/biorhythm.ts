import { Hono } from 'hono';
import type { Env, ApiResponse, BiorhythmData } from '../types';
import {
  calculateBiorhythm,
  calculateBiorhythmRange,
  getBiorhythmStatus,
  saveBiorhythmSnapshot,
  getLatestBiorhythmSnapshot,
  getBiorhythmHistory
} from '../lib/biorhythm';
import { verifyToken, extractBearerToken } from '../lib/auth';
import { getUserById } from '../lib/auth';

const biorhythm = new Hono<{ Bindings: Env }>();

// Middleware to verify auth
async function authMiddleware(c: any, next: any) {
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

  c.set('user', payload);
  await next();
}

// Get current biorhythm for authenticated user
biorhythm.get('/current', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const userData = await getUserById(c.env.DB, user.userId);

    if (!userData || !userData.birth_date) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Birth date not set'
      }, 400);
    }

    const birthDate = new Date(userData.birth_date);
    const bioData = calculateBiorhythm(birthDate);

    // Save snapshot
    await saveBiorhythmSnapshot(c.env.DB, {
      id: crypto.randomUUID(),
      user_id: user.userId,
      physical: bioData.physical,
      emotional: bioData.emotional,
      intellectual: bioData.intellectual,
      calculated_at: new Date().toISOString()
    });

    return c.json<ApiResponse<{
      biorhythm: BiorhythmData;
      status: {
        physical: ReturnType<typeof getBiorhythmStatus>;
        emotional: ReturnType<typeof getBiorhythmStatus>;
        intellectual: ReturnType<typeof getBiorhythmStatus>;
      };
    }>>({
      success: true,
      data: {
        biorhythm: bioData,
        status: {
          physical: getBiorhythmStatus(bioData.physical),
          emotional: getBiorhythmStatus(bioData.emotional),
          intellectual: getBiorhythmStatus(bioData.intellectual)
        }
      }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to calculate biorhythm'
    }, 500);
  }
});

// Get biorhythm for a specific date
biorhythm.get('/date/:date', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const dateParam = c.req.param('date');
    const targetDate = new Date(dateParam);

    if (isNaN(targetDate.getTime())) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid date format'
      }, 400);
    }

    const userData = await getUserById(c.env.DB, user.userId);

    if (!userData || !userData.birth_date) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Birth date not set'
      }, 400);
    }

    const birthDate = new Date(userData.birth_date);
    const bioData = calculateBiorhythm(birthDate, targetDate);

    return c.json<ApiResponse<{
      date: string;
      biorhythm: BiorhythmData;
      status: {
        physical: ReturnType<typeof getBiorhythmStatus>;
        emotional: ReturnType<typeof getBiorhythmStatus>;
        intellectual: ReturnType<typeof getBiorhythmStatus>;
      };
    }>>({
      success: true,
      data: {
        date: dateParam,
        biorhythm: bioData,
        status: {
          physical: getBiorhythmStatus(bioData.physical),
          emotional: getBiorhythmStatus(bioData.emotional),
          intellectual: getBiorhythmStatus(bioData.intellectual)
        }
      }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to calculate biorhythm'
    }, 500);
  }
});

// Get biorhythm range
biorhythm.get('/range', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const days = parseInt(c.req.query('days') || '30', 10);
    
    if (days < 1 || days > 365) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Days must be between 1 and 365'
      }, 400);
    }

    const userData = await getUserById(c.env.DB, user.userId);

    if (!userData || !userData.birth_date) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Birth date not set'
      }, 400);
    }

    const birthDate = new Date(userData.birth_date);
    const startDate = new Date();
    const range = calculateBiorhythmRange(birthDate, startDate, days);

    return c.json<ApiResponse<{
      range: typeof range;
    }>>({
      success: true,
      data: { range }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to calculate biorhythm range'
    }, 500);
  }
});

// Get biorhythm history/snapshots
biorhythm.get('/history', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const limit = parseInt(c.req.query('limit') || '30', 10);

    const history = await getBiorhythmHistory(c.env.DB, user.userId, limit);

    return c.json<ApiResponse<{
      history: typeof history;
    }>>({
      success: true,
      data: { history }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to get biorhythm history'
    }, 500);
  }
});

// Get latest snapshot
biorhythm.get('/latest', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const latest = await getLatestBiorhythmSnapshot(c.env.DB, user.userId);

    if (!latest) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'No biorhythm data found'
      }, 404);
    }

    return c.json<ApiResponse<{
      snapshot: typeof latest;
    }>>({
      success: true,
      data: { snapshot: latest }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to get latest biorhythm'
    }, 500);
  }
});

export default biorhythm;
