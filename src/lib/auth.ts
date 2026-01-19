import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import { db } from './db';

const adapter = new BetterSqlite3Adapter(db, {
  user: 'users',
  session: 'sessions'
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD, // Only send cookie over HTTPS (in production)
      httpOnly: true,               // JavaScript cannot access cookie (prevents XSS theft)
      sameSite: 'lax'               // Cookie not sent on cross-site requests (prevents CSRF)
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username
    };
  }
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
    };
  }
}
