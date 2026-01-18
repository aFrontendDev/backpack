import type { APIRoute } from 'astro';
import { lucia } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return new Response(
        JSON.stringify({
          error: 'No active session'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await lucia.invalidateSession(sessionId);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logout successful'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred during logout'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
