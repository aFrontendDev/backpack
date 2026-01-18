import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

export const DELETE: APIRoute = async ({ url, locals }) => {
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

    if (!key) {
      return new Response(
        JSON.stringify({
          error: 'Key parameter is required'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = db.prepare(`
      DELETE FROM user_data
      WHERE user_id = ? AND key = ?
    `).run(user.id, key);

    if (result.changes === 0) {
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
        message: 'Data deleted successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete data error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while deleting data'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
