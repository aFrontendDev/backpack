import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const user = locals.user;

    if (!user) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized. Please log in.'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const key = url.searchParams.get('key');

    if (key) {
      // Get specific key
      const row = db.prepare(`
        SELECT value FROM user_data
        WHERE user_id = ? AND key = ?
      `).get(user.id, key) as { value: string } | undefined;

      if (!row) {
        return new Response(
          JSON.stringify({
            error: 'Data not found'
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            key,
            value: JSON.parse(row.value)
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Get all data for user
      const rows = db.prepare(`
        SELECT key, value FROM user_data
        WHERE user_id = ?
        ORDER BY updated_at DESC
      `).all(user.id) as Array<{ key: string; value: string }>;

      const data = rows.reduce((acc, row) => {
        acc[row.key] = JSON.parse(row.value);
        return acc;
      }, {} as Record<string, any>);

      return new Response(
        JSON.stringify({
          success: true,
          data
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Get data error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while retrieving data'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
