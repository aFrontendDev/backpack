import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

// Max payload size: 1MB
const MAX_PAYLOAD_SIZE = 1024 * 1024;

export const POST: APIRoute = async ({ request, locals }) => {
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

    // Check content length before parsing
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE) {
      return new Response(
        JSON.stringify({
          error: 'Payload too large. Maximum size is 1MB.'
        }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof key !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Invalid key'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (value === undefined || value === null) {
      return new Response(
        JSON.stringify({
          error: 'Invalid value'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = Date.now();
    const valueStr = JSON.stringify(value);

    // Insert or update data
    db.prepare(`
      INSERT INTO user_data (user_id, key, value, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at
    `).run(user.id, key, valueStr, now, now);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data saved successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Save data error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while saving data'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
