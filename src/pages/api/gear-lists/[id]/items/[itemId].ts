import type { APIRoute } from 'astro';
import { db } from '../../../../../lib/db';

export const PUT: APIRoute = async ({ request, params, locals }) => {
  if (!locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id: listId, itemId: listItemId } = params;
  if (!listId || !listItemId) {
    return new Response(JSON.stringify({ error: 'List ID and List Item ID required' }), { status: 400 });
  }

  try {
    // Verify list ownership
    const list = db
      .prepare('SELECT id FROM gear_lists WHERE id = ? AND user_id = ?')
      .get(listId, locals.session.userId);

    if (!list) {
      return new Response(JSON.stringify({ error: 'List not found or unauthorized' }), { status: 404 });
    }

    const data = await request.json();
    const quantity = parseInt(data.quantity, 10);

    if (isNaN(quantity) || quantity < 1) {
      return new Response(JSON.stringify({ error: 'Invalid quantity' }), { status: 400 });
    }

    const now = Date.now();

    const result = db.prepare(`
      UPDATE gear_list_items
      SET quantity = ?, updated_at = ?
      WHERE id = ? AND list_id = ?
    `).run(quantity, now, listItemId, listId);

    if (result.changes === 0) {
       return new Response(JSON.stringify({ error: 'Item not found in list' }), { status: 404 });
    }

    const updatedItem = db.prepare(`
      SELECT 
        gli.id as list_item_id, 
        gli.quantity, 
        i.* 
      FROM gear_list_items gli
      JOIN inventory_items i ON gli.item_id = i.id
      WHERE gli.id = ?
    `).get(listItemId);

    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    console.error('Error updating list item:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id: listId, itemId: listItemId } = params;
  if (!listId || !listItemId) {
    return new Response(JSON.stringify({ error: 'List ID and List Item ID required' }), { status: 400 });
  }

  try {
    // Verify list ownership
    const list = db
      .prepare('SELECT id FROM gear_lists WHERE id = ? AND user_id = ?')
      .get(listId, locals.session.userId);

    if (!list) {
      return new Response(JSON.stringify({ error: 'List not found or unauthorized' }), { status: 404 });
    }

    const result = db
      .prepare('DELETE FROM gear_list_items WHERE id = ? AND list_id = ?')
      .run(listItemId, listId);

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Item not found in list' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error deleting list item:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
