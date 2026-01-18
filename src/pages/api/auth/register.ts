import type { APIRoute } from 'astro';
import { lucia } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { generateId } from 'lucia';
import { hash } from '@node-rs/bcrypt';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    // Validate input
    if (
      typeof username !== 'string' ||
      username.length < 3 ||
      username.length > 31 ||
      !/^[a-zA-Z0-9_-]+$/.test(username)
    ) {
      return new Response(
        JSON.stringify({
          error: 'Invalid username. Must be 3-31 characters and contain only letters, numbers, hyphens, and underscores.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
      return new Response(
        JSON.stringify({
          error: 'Invalid password. Must be between 6 and 255 characters.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 10);
    const userId = generateId(15);

    try {
      // Insert user into database
      db.prepare(
        'INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)'
      ).run(userId, username, passwordHash, Date.now());

      // Create session
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Registration successful'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (e: any) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return new Response(
          JSON.stringify({
            error: 'Username already exists'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw e;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred during registration'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
