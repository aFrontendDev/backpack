import type { APIRoute } from 'astro';
import { lucia } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { hash } from '@node-rs/bcrypt';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const tokenRaw = formData.get('token');
    const passwordRaw = formData.get('password');

    const token = typeof tokenRaw === 'string' ? tokenRaw.trim() : '';
    const password = typeof passwordRaw === 'string' ? passwordRaw.trim() : '';

    if (!token) {
      return new Response(
        JSON.stringify({
          error: 'Invalid or missing reset token'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 12 || password.length > 255) {
      return new Response(
        JSON.stringify({
          error: 'Password must be between 12 and 255 characters.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the token
    const resetToken = db
      .prepare('SELECT * FROM password_reset_tokens WHERE id = ?')
      .get(token) as { id: string; user_id: string; expires_at: number } | undefined;

    if (!resetToken) {
      return new Response(
        JSON.stringify({
          error: 'Invalid or expired reset link. Please request a new one.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired
    if (resetToken.expires_at < Date.now()) {
      // Clean up expired token
      db.prepare('DELETE FROM password_reset_tokens WHERE id = ?').run(token);
      return new Response(
        JSON.stringify({
          error: 'This reset link has expired. Please request a new one.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash the new password
    const passwordHash = await hash(password, 10);

    // Update the user's password
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(
      passwordHash,
      resetToken.user_id
    );

    // Delete the used token
    db.prepare('DELETE FROM password_reset_tokens WHERE id = ?').run(token);

    // Invalidate all existing sessions for this user
    await lucia.invalidateUserSessions(resetToken.user_id);

    // Create a new session and log them in
    const session = await lucia.createSession(resetToken.user_id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password reset successful. You are now logged in.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred. Please try again.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
