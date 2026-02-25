import { Hono } from 'hono';
import type { Env, Progress, ApiResponse, CreateProgressInput, UpdateProgressInput } from '../types';
import { executeQuery, executeFirst, executeRun } from '../lib/db';
import { verifyToken, extractBearerToken } from '../lib/auth';

const progress = new Hono<{ Bindings: Env }>();

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

// Get user's progress
progress.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    
    const results = await executeQuery<Progress & { book_number: number; chapter_number: number; title: string }>(
      c.env.DB,
      `SELECT p.*, c.book_number, c.chapter_number, c.title 
       FROM progress p
       JOIN chapters c ON p.chapter_id = c.id
       WHERE p.user_id = ?
       ORDER BY c.book_number ASC, c.chapter_number ASC`,
      [user.userId]
    );

    return c.json<ApiResponse<{ progress: typeof results }>>({
      success: true,
      data: { progress: results }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch progress'
    }, 500);
  }
});

// Get progress for specific chapter
progress.get('/chapter/:chapterId', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const chapterId = c.req.param('chapterId');
    
    const result = await executeFirst<Progress>(
      c.env.DB,
      'SELECT * FROM progress WHERE user_id = ? AND chapter_id = ?',
      [user.userId, chapterId]
    );

    if (!result) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Progress not found'
      }, 404);
    }

    return c.json<ApiResponse<{ progress: Progress }>>({
      success: true,
      data: { progress: result }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch progress'
    }, 500);
  }
});

// Create or update progress
progress.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json<CreateProgressInput>();
    const { chapter_id, is_completed = false } = body;

    if (!chapter_id) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Chapter ID is required'
      }, 400);
    }

    // Check if progress exists
    const existing = await executeFirst<Progress>(
      c.env.DB,
      'SELECT * FROM progress WHERE user_id = ? AND chapter_id = ?',
      [user.userId, chapter_id]
    );

    if (existing) {
      // Update existing
      await executeRun(
        c.env.DB,
        `UPDATE progress 
         SET is_completed = ?, 
             completed_at = CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END,
             updated_at = datetime('now')
         WHERE id = ?`,
        [is_completed ? 1 : 0, is_completed ? 1 : 0, existing.id]
      );
    } else {
      // Create new
      const id = crypto.randomUUID();
      await executeRun(
        c.env.DB,
        `INSERT INTO progress (id, user_id, chapter_id, is_completed, completed_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END, datetime('now'), datetime('now'))`,
        [id, user.userId, chapter_id, is_completed ? 1 : 0, is_completed ? 1 : 0]
      );
    }

    const result = await executeFirst<Progress>(
      c.env.DB,
      'SELECT * FROM progress WHERE user_id = ? AND chapter_id = ?',
      [user.userId, chapter_id]
    );

    return c.json<ApiResponse<{ progress: Progress }>>({
      success: true,
      data: { progress: result! }
    }, existing ? 200 : 201);
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to save progress'
    }, 500);
  }
});

// Update progress
progress.patch('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');
    const body = await c.req.json<UpdateProgressInput>();
    const { is_completed } = body;

    // Verify ownership
    const existing = await executeFirst<Progress>(
      c.env.DB,
      'SELECT * FROM progress WHERE id = ? AND user_id = ?',
      [id, user.userId]
    );

    if (!existing) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Progress not found'
      }, 404);
    }

    await executeRun(
      c.env.DB,
      `UPDATE progress 
       SET is_completed = ?, 
           completed_at = CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END,
           updated_at = datetime('now')
       WHERE id = ?`,
      [is_completed ? 1 : 0, is_completed ? 1 : 0, id]
    );

    const result = await executeFirst<Progress>(
      c.env.DB,
      'SELECT * FROM progress WHERE id = ?',
      [id]
    );

    return c.json<ApiResponse<{ progress: Progress }>>({
      success: true,
      data: { progress: result! }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to update progress'
    }, 500);
  }
});

// Mark chapter as complete
progress.post('/chapter/:chapterId/complete', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const chapterId = c.req.param('chapterId');

    // Check if progress exists
    const existing = await executeFirst<Progress>(
      c.env.DB,
      'SELECT * FROM progress WHERE user_id = ? AND chapter_id = ?',
      [user.userId, chapterId]
    );

    if (existing) {
      await executeRun(
        c.env.DB,
        `UPDATE progress 
         SET is_completed = 1, 
             completed_at = datetime('now'),
             updated_at = datetime('now')
         WHERE id = ?`,
        [existing.id]
      );
    } else {
      const id = crypto.randomUUID();
      await executeRun(
        c.env.DB,
        `INSERT INTO progress (id, user_id, chapter_id, is_completed, completed_at, created_at, updated_at)
         VALUES (?, ?, ?, 1, datetime('now'), datetime('now'), datetime('now'))`,
        [id, user.userId, chapterId]
      );
    }

    const result = await executeFirst<Progress>(
      c.env.DB,
      'SELECT * FROM progress WHERE user_id = ? AND chapter_id = ?',
      [user.userId, chapterId]
    );

    return c.json<ApiResponse<{ progress: Progress }>>({
      success: true,
      data: { progress: result! }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to complete chapter'
    }, 500);
  }
});

// Get progress statistics
progress.get('/stats/overview', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    
    const stats = await executeFirst<{
      total_chapters: number;
      completed_chapters: number;
      completion_percentage: number;
    }>(
      c.env.DB,
      `SELECT 
        (SELECT COUNT(*) FROM chapters) as total_chapters,
        (SELECT COUNT(*) FROM progress WHERE user_id = ? AND is_completed = 1) as completed_chapters`,
      [user.userId]
    );

    const totalChapters = stats?.total_chapters || 0;
    const completedChapters = stats?.completed_chapters || 0;
    const percentage = totalChapters > 0 
      ? Math.round((completedChapters / totalChapters) * 100) 
      : 0;

    return c.json<ApiResponse<{
      stats: {
        total_chapters: number;
        completed_chapters: number;
        completion_percentage: number;
      }
    }>>({
      success: true,
      data: {
        stats: {
          total_chapters: totalChapters,
          completed_chapters: completedChapters,
          completion_percentage: percentage
        }
      }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch statistics'
    }, 500);
  }
});

// Delete progress
progress.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = c.req.param('id');

    // Verify ownership
    const existing = await executeFirst<Progress>(
      c.env.DB,
      'SELECT * FROM progress WHERE id = ? AND user_id = ?',
      [id, user.userId]
    );

    if (!existing) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Progress not found'
      }, 404);
    }

    await executeRun(c.env.DB, 'DELETE FROM progress WHERE id = ?', [id]);

    return c.json<ApiResponse<{ message: string }>>({
      success: true,
      data: { message: 'Progress deleted successfully' }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to delete progress'
    }, 500);
  }
});

export default progress;
