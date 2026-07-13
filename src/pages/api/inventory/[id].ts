import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    const user = locals.user;
    const { id } = params;

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please log in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Item ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const item = db.prepare('SELECT user_id FROM inventory_items WHERE id = ?').get(id) as { user_id: string } | undefined;

    if (!item) {
      return new Response(
        JSON.stringify({ error: 'Item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (item.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { name, brand, weight_g, category, is_owned, url, notes } = body;

    if (!name || typeof name !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid name' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = Date.now();

    db.prepare(`
      UPDATE inventory_items
      SET name = ?, brand = ?, weight_g = ?, category = ?, is_owned = ?, url = ?, notes = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `).run(
      name,
      brand || '',
      parseFloat(weight_g) || 0,
      category || '',
      is_owned === false ? 0 : 1,
      url || '',
      notes || '',
      now,
      id,
      user.id
    );

    const updatedItem = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(id);

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedItem
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update inventory item error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while updating inventory item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const user = locals.user;
    const { id } = params;

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please log in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Item ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const item = db.prepare('SELECT user_id FROM inventory_items WHERE id = ?').get(id) as { user_id: string } | undefined;

    if (!item) {
      return new Response(
        JSON.stringify({ error: 'Item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (item.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    db.prepare('DELETE FROM inventory_items WHERE id = ? AND user_id = ?').run(id, user.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Item deleted successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete inventory item error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while deleting inventory item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
