import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { generateId } from 'lucia';

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const lists = db
      .prepare('SELECT * FROM gear_lists WHERE user_id = ? ORDER BY updated_at DESC')
      .all(locals.session.userId);

    return new Response(JSON.stringify(lists), { status: 200 });
  } catch (error) {
    console.error('Error fetching gear lists:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const data = await request.json();
    const id = generateId(15);
    const now = Date.now();

    if (!data.name || typeof data.name !== 'string') {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const targetWeight = data.target_weight_g ? parseFloat(data.target_weight_g) : null;

    db.prepare(`
      INSERT INTO gear_lists (id, user_id, name, description, target_weight_g, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      locals.session.userId,
      data.name.trim(),
      data.description ? data.description.trim() : null,
      targetWeight,
      now,
      now
    );

    const newList = db.prepare('SELECT * FROM gear_lists WHERE id = ?').get(id);

    return new Response(JSON.stringify(newList), { status: 201 });
  } catch (error) {
    console.error('Error creating gear list:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
