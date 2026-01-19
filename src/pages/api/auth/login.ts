import type { APIRoute } from 'astro';
import { lucia } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { verify } from '@node-rs/bcrypt';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const usernameRaw = formData.get('username');
    const passwordRaw = formData.get('password');

    if (typeof usernameRaw !== 'string' || typeof passwordRaw !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Invalid credentials'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const username = usernameRaw.trim();
    const password = passwordRaw.trim();

    // Find user
    const user = db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username) as { id: string; username: string; password_hash: string } | undefined;

    if (!user) {
      return new Response(
        JSON.stringify({
          error: 'Invalid username or password'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify password
    const validPassword = await verify(password, user.password_hash);

    if (!validPassword) {
      return new Response(
        JSON.stringify({
          error: 'Invalid username or password'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login successful'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred during login'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
