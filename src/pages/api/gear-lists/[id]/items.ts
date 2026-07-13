import type { APIRoute } from 'astro';
import { db } from '../../../../lib/db';
import { generateId } from 'lucia';

export const POST: APIRoute = async ({ request, params, locals }) => {
  if (!locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const listId = params.id;
  if (!listId) {
    return new Response(JSON.stringify({ error: 'List ID required' }), { status: 400 });
  }

  try {
    // Verify ownership of the list
    const list = db
      .prepare('SELECT id FROM gear_lists WHERE id = ? AND user_id = ?')
      .get(listId, locals.session.userId);

    if (!list) {
      return new Response(JSON.stringify({ error: 'List not found or unauthorized' }), { status: 404 });
    }

    const data = await request.json();
    const itemId = data.item_id;
    const quantity = data.quantity || 1;

    if (!itemId) {
      return new Response(JSON.stringify({ error: 'Item ID is required' }), { status: 400 });
    }

    // Verify ownership of the item
    const item = db
      .prepare('SELECT id FROM inventory_items WHERE id = ? AND user_id = ?')
      .get(itemId, locals.session.userId);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Item not found or unauthorized' }), { status: 404 });
    }

    const id = generateId(15);
    const now = Date.now();

    db.prepare(`
      INSERT INTO gear_list_items (id, list_id, item_id, quantity, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, listId, itemId, quantity, now, now);

    const newItem = db.prepare(`
      SELECT 
        gli.id as list_item_id, 
        gli.quantity, 
        i.* 
      FROM gear_list_items gli
      JOIN inventory_items i ON gli.item_id = i.id
      WHERE gli.id = ?
    `).get(id);

    return new Response(JSON.stringify(newItem), { status: 201 });
  } catch (error) {
    console.error('Error adding item to list:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
