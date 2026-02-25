import { Hono } from 'hono';
import type { Env, Chapter, ApiResponse, CreateChapterInput } from '../types';
import { executeQuery, executeFirst, executeRun } from '../lib/db';

const chapters = new Hono<{ Bindings: Env }>();

// Get all chapters
chapters.get('/', async (c) => {
  try {
    const bookNumber = c.req.query('book');
    
    let query = 'SELECT * FROM chapters';
    const params: (string | number)[] = [];
    
    if (bookNumber) {
      query += ' WHERE book_number = ?';
      params.push(parseInt(bookNumber, 10));
    }
    
    query += ' ORDER BY book_number ASC, chapter_number ASC';
    
    const results = await executeQuery<Chapter>(c.env.DB, query, params);

    return c.json<ApiResponse<{ chapters: Chapter[] }>>({
      success: true,
      data: { chapters: results }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch chapters'
    }, 500);
  }
});

// Get chapter by ID
chapters.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const chapter = await executeFirst<Chapter>(
      c.env.DB,
      'SELECT * FROM chapters WHERE id = ?',
      [id]
    );

    if (!chapter) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Chapter not found'
      }, 404);
    }

    return c.json<ApiResponse<{ chapter: Chapter }>>({
      success: true,
      data: { chapter }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch chapter'
    }, 500);
  }
});

// Get chapter by book and chapter number
chapters.get('/book/:bookNumber/chapter/:chapterNumber', async (c) => {
  try {
    const bookNumber = parseInt(c.req.param('bookNumber'), 10);
    const chapterNumber = parseInt(c.req.param('chapterNumber'), 10);
    
    const chapter = await executeFirst<Chapter>(
      c.env.DB,
      'SELECT * FROM chapters WHERE book_number = ? AND chapter_number = ?',
      [bookNumber, chapterNumber]
    );

    if (!chapter) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Chapter not found'
      }, 404);
    }

    return c.json<ApiResponse<{ chapter: Chapter }>>({
      success: true,
      data: { chapter }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch chapter'
    }, 500);
  }
});

// Create new chapter (admin only - would need auth middleware in production)
chapters.post('/', async (c) => {
  try {
    const body = await c.req.json<CreateChapterInput>();
    const { book_number, chapter_number, title, content } = body;

    if (!book_number || !chapter_number || !title) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Book number, chapter number, and title are required'
      }, 400);
    }

    // Check if chapter already exists
    const existing = await executeFirst<Chapter>(
      c.env.DB,
      'SELECT * FROM chapters WHERE book_number = ? AND chapter_number = ?',
      [book_number, chapter_number]
    );

    if (existing) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Chapter already exists'
      }, 409);
    }

    const id = crypto.randomUUID();
    
    await executeRun(
      c.env.DB,
      `INSERT INTO chapters (id, book_number, chapter_number, title, content, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [id, book_number, chapter_number, title, content || '']
    );

    const chapter = await executeFirst<Chapter>(
      c.env.DB,
      'SELECT * FROM chapters WHERE id = ?',
      [id]
    );

    return c.json<ApiResponse<{ chapter: Chapter }>>({
      success: true,
      data: { chapter: chapter! }
    }, 201);
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to create chapter'
    }, 500);
  }
});

// Update chapter (admin only)
chapters.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<CreateChapterInput>>();
    
    const chapter = await executeFirst<Chapter>(
      c.env.DB,
      'SELECT * FROM chapters WHERE id = ?',
      [id]
    );

    if (!chapter) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Chapter not found'
      }, 404);
    }

    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.title !== undefined) {
      fields.push('title = ?');
      values.push(body.title);
    }
    if (body.content !== undefined) {
      fields.push('content = ?');
      values.push(body.content);
    }
    if (body.book_number !== undefined) {
      fields.push('book_number = ?');
      values.push(body.book_number);
    }
    if (body.chapter_number !== undefined) {
      fields.push('chapter_number = ?');
      values.push(body.chapter_number);
    }

    if (fields.length === 0) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'No fields to update'
      }, 400);
    }

    fields.push('updated_at = datetime("now")');
    values.push(id);

    await executeRun(
      c.env.DB,
      `UPDATE chapters SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const updated = await executeFirst<Chapter>(
      c.env.DB,
      'SELECT * FROM chapters WHERE id = ?',
      [id]
    );

    return c.json<ApiResponse<{ chapter: Chapter }>>({
      success: true,
      data: { chapter: updated! }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to update chapter'
    }, 500);
  }
});

// Delete chapter (admin only)
chapters.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const chapter = await executeFirst<Chapter>(
      c.env.DB,
      'SELECT * FROM chapters WHERE id = ?',
      [id]
    );

    if (!chapter) {
      return c.json<ApiResponse<null>>({
        success: false,
        error: 'Chapter not found'
      }, 404);
    }

    await executeRun(c.env.DB, 'DELETE FROM chapters WHERE id = ?', [id]);

    return c.json<ApiResponse<{ message: string }>>({
      success: true,
      data: { message: 'Chapter deleted successfully' }
    });
  } catch (error) {
    return c.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to delete chapter'
    }, 500);
  }
});

export default chapters;
