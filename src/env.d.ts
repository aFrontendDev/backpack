/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import('lucia').User | null;
    session: import('lucia').Session | null;
  }
}

// Optional: Add custom environment variables for TypeScript autocomplete
interface ImportMetaEnv {
  // Built-in Astro variables (already available, just documenting)
  readonly MODE: 'development' | 'production';
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly BASE_URL: string;

  // Add your custom variables here (if you create a .env file)
  // readonly DATABASE_PATH: string;
  // readonly PUBLIC_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
