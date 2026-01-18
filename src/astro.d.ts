/// <reference types="astro/client" />

// Ensure TypeScript knows .astro files can be imported
declare module '*.astro' {
  const component: any;
  export default component;
}
