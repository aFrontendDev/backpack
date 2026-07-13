import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'List ID required' }), { status: 400 });
  }

  try {
    const list = db
      .prepare('SELECT * FROM gear_lists WHERE id = ? AND user_id = ?')
      .get(id, locals.session.userId);

    if (!list) {
      return new Response(JSON.stringify({ error: 'List not found' }), { status: 404 });
    }

    // Join with inventory_items to get item details
    const items = db
      .prepare(`
        SELECT 
          gli.id as list_item_id, 
          gli.quantity, 
          i.* 
        FROM gear_list_items gli
        JOIN inventory_items i ON gli.item_id = i.id
        WHERE gli.list_id = ?
        ORDER BY i.category ASC, i.name ASC
      `)
      .all(id);

    return new Response(JSON.stringify({ ...list, items }), { status: 200 });
  } catch (error) {
    console.error('Error fetching gear list:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, params, locals }) => {
  if (!locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'List ID required' }), { status: 400 });
  }

  try {
    // Verify ownership
    const existing = db
      .prepare('SELECT id FROM gear_lists WHERE id = ? AND user_id = ?')
      .get(id, locals.session.userId);

    if (!existing) {
      return new Response(JSON.stringify({ error: 'List not found or unauthorized' }), { status: 404 });
    }

    const data = await request.json();
    const now = Date.now();
    const targetWeight = data.target_weight_g ? parseFloat(data.target_weight_g) : null;

    db.prepare(`
      UPDATE gear_lists 
      SET name = ?, description = ?, target_weight_g = ?, updated_at = ?
      WHERE id = ?
    `).run(
      data.name.trim(),
      data.description ? data.description.trim() : null,
      targetWeight,
      now,
      id
    );

    const updated = db.prepare('SELECT * FROM gear_lists WHERE id = ?').get(id);
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error('Error updating gear list:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'List ID required' }), { status: 400 });
  }

  try {
    const result = db
      .prepare('DELETE FROM gear_lists WHERE id = ? AND user_id = ?')
      .run(id, locals.session.userId);

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'List not found or unauthorized' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error deleting gear list:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
