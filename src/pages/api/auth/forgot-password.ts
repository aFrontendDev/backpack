import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { generateIdFromEntropySize } from 'lucia';
import { sendPasswordResetEmail } from '../../../lib/email';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const emailRaw = formData.get('email');

    const email = typeof emailRaw === 'string' ? emailRaw.trim().toLowerCase() : '';

    if (!email) {
      return new Response(
        JSON.stringify({
          error: 'Email is required'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email
    const user = db
      .prepare('SELECT id, email FROM users WHERE email = ?')
      .get(email) as { id: string; email: string } | undefined;

    // Always return success to prevent email enumeration
    const successResponse = new Response(
      JSON.stringify({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

    if (!user) {
      return successResponse;
    }

    // Delete any existing tokens for this user
    db.prepare('DELETE FROM password_reset_tokens WHERE user_id = ?').run(user.id);

    // Generate a secure token (32 bytes = 256 bits of entropy)
    const token = generateIdFromEntropySize(32);
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

    // Store the token
    db.prepare(
      'INSERT INTO password_reset_tokens (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).run(token, user.id, expiresAt);

    // Send the email
    await sendPasswordResetEmail(user.email, token);

    return successResponse;
  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred. Please try again.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
