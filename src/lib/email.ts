import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL || 'noreply@updates.packspace.co.uk';
const APP_URL = import.meta.env.PUBLIC_APP_URL || 'http://localhost:4321';

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
      text: `
Password Reset Request

You requested to reset your password. Visit the link below to set a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.
      `.trim()
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
