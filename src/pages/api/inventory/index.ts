import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import crypto from 'node:crypto';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const user = locals.user;

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please log in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const items = db.prepare(`
      SELECT * FROM inventory_items
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(user.id);

    return new Response(
      JSON.stringify({
        success: true,
        data: items
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get inventory error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while retrieving inventory items' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const user = locals.user;

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please log in.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
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
    const id = crypto.randomUUID();

    db.prepare(`
      INSERT INTO inventory_items (id, user_id, name, brand, weight_g, category, is_owned, url, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      user.id,
      name,
      brand || '',
      parseFloat(weight_g) || 0,
      category || '',
      is_owned === false ? 0 : 1, // default true
      url || '',
      notes || '',
      now,
      now
    );

    const newItem = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(id);

    return new Response(
      JSON.stringify({
        success: true,
        data: newItem
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Create inventory item error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while creating inventory item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
