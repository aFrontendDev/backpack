# Frontend Architecture Overview

## Current Structure

Your app now follows a **component-driven architecture** with complete separation of concerns.

```
backpack-app/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.astro     # ✨ Template & Logic
│   │   │   ├── Button.css       # 🎨 Styles
│   │   │   ├── Button.types.ts  # 📝 TypeScript Types
│   │   │   └── index.ts         # 📦 Barrel Export
│   │   ├── Card/
│   │   ├── FormGroup/
│   │   ├── Input/
│   │   └── Message/
│   │
│   ├── pages/                   # Route-based pages
│   │   ├── index.astro          # Home page
│   │   ├── login.astro          # Login page
│   │   ├── register.astro       # Register page
│   │   ├── dashboard.astro      # Dashboard page
│   │   └── api/                 # API endpoints
│   │       ├── auth/
│   │       └── data/
│   │
│   ├── layouts/                 # Page layouts
│   │   └── Layout.astro         # Base layout
│   │
│   ├── styles/                  # Global styles
│   │   └── global.css           # Reset, utilities, typography
│   │
│   ├── lib/                     # Backend utilities
│   │   ├── auth.ts              # Authentication setup
│   │   └── db.ts                # Database setup
│   │
│   ├── middleware/              # Server middleware
│   │   └── index.ts             # Session validation
│   │
│   └── env.d.ts                 # TypeScript global types
│
└── database.db                  # SQLite database
```

## Component Anatomy

Each component follows this pattern:

### File Structure
```
ComponentName/
├── ComponentName.astro     # Template + Props + Logic
├── ComponentName.css       # Scoped styles
├── ComponentName.types.ts  # TypeScript interface
└── index.ts                # Export (optional, for cleaner imports)
```

### Example: Button Component

**Button.types.ts** - Type definitions
```typescript
export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  class?: string;
}
```

**Button.css** - Component styles
```css
.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  /* ... */
}

.button.primary {
  background-color: #4CAF50;
  color: white;
}
```

**Button.astro** - Template and logic
```astro
---
import type { ButtonProps } from './Button.types';
import './Button.css';

interface Props extends ButtonProps {}

const { type = 'button', variant = 'primary', ... } = Astro.props;
---

<button type={type} class={`button ${variant}`}>
  <slot />
</button>
```

**index.ts** - Barrel export
```typescript
export { default as Button } from './Button.astro';
export type { ButtonProps } from './Button.types';
```

## Benefits of This Structure

### ✅ Separation of Concerns
- **Template** (.astro) - What it renders
- **Styles** (.css) - How it looks
- **Types** (.types.ts) - What props it accepts

### ✅ Easy to Maintain
- Find everything related to a component in one folder
- Clear boundaries between components
- Self-documenting through types

### ✅ Reusable
- Import components anywhere
- Compose components together
- Consistent API across the app

### ✅ Type-Safe
- Full TypeScript support
- Autocomplete for props
- Catch errors at build time

### ✅ Migration-Ready
This structure makes it **trivial** to migrate to Vue or React later:

**Current (Astro):**
```astro
<!-- Button.astro -->
---
import type { ButtonProps } from './Button.types';
const { variant = 'primary', children } = Astro.props;
---
<button class={`button ${variant}`}>
  <slot />
</button>
```

**Future React:**
```tsx
// Button.tsx
import type { ButtonProps } from './Button.types';
import './Button.css';

export function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button className={`button ${variant}`}>
      {children}
    </button>
  );
}
```

**Future Vue:**
```vue
<!-- Button.vue -->
<script setup lang="ts">
import type { ButtonProps } from './Button.types';
const { variant = 'primary' } = defineProps<ButtonProps>();
</script>

<template>
  <button :class="['button', variant]">
    <slot />
  </button>
</template>

<style src="./Button.css"></style>
```

## Usage Examples

### Simple Page Structure

```astro
---
// src/pages/example.astro
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card/Card.astro';
import Button from '../components/Button/Button.astro';
---

<Layout title="Example Page">
  <main class="container">
    <Card>
      <h1>Page Title</h1>
      <p>Some content here</p>
      <Button variant="primary">Click Me</Button>
    </Card>
  </main>
</Layout>
```

### Form Example

```astro
---
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card/Card.astro';
import FormGroup from '../components/FormGroup/FormGroup.astro';
import Input from '../components/Input/Input.astro';
import Button from '../components/Button/Button.astro';
import Message from '../components/Message/Message.astro';
---

<Layout title="Contact Form">
  <Card>
    <h1>Contact Us</h1>

    <form>
      <FormGroup label="Email" htmlFor="email" required>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="you@example.com"
          required
        />
      </FormGroup>

      <FormGroup
        label="Message"
        htmlFor="message"
        hint="Tell us what you think"
        required
      >
        <textarea name="message" id="message" rows="5"></textarea>
      </FormGroup>

      <Button type="submit">Send Message</Button>
      <Message id="form-message" />
    </form>
  </Card>
</Layout>
```

## Global Styles

**Location:** `src/styles/global.css`

Provides:
- **Reset** - Consistent cross-browser styles
- **Typography** - Base font, heading styles
- **Utilities** - Spacing, flexbox, text alignment

**Utility Classes:**
```css
/* Spacing */
.mt-1, .mt-2, .mt-3, .mt-4  /* Margin top */
.mb-1, .mb-2, .mb-3, .mb-4  /* Margin bottom */
.p-1, .p-2, .p-3, .p-4      /* Padding */

/* Layout */
.container      /* Max-width centered container */
.text-center    /* Center text */
.flex           /* Display flex */
.flex-column    /* Flex direction column */
.flex-center    /* Center flex items */
.gap-1, .gap-2, .gap-3  /* Gap between flex items */
```

## Page-Specific Styles

Keep minimal page-specific styles in `<style>` blocks:

```astro
<style>
  /* Only layout-specific styles here */
  .page-wrapper {
    max-width: 800px;
    margin: 0 auto;
  }

  /* Component styles go in component CSS files */
</style>
```

## State Management

Currently using:
- **Server-side**: Astro.locals for user/session data
- **Client-side**: Vanilla JavaScript for form handling

**Future considerations:**
- **Nanostores** - Lightweight state management for Astro
- **Zustand/Pinia** - If migrating to React/Vue
- **TanStack Query** - For API data fetching

## Styling Approach

**Current:** Vanilla CSS with:
- Component-scoped CSS files
- Global utilities
- BEM-like naming conventions

**Future options:**
- **Tailwind CSS** - Utility-first framework
- **CSS Modules** - Scoped styles with hashing
- **Styled Components** - CSS-in-JS (React)
- **UnoCSS** - Instant on-demand atomic CSS

## Next Steps for Enhanced FE

### 1. Add More Components
```
components/
├── Modal/           # Popup dialogs
├── Dropdown/        # Select menus
├── Toast/           # Notifications
├── Table/           # Data tables
├── Tabs/            # Tab navigation
└── Avatar/          # User avatars
```

### 2. Consider a UI Framework
- **Tailwind CSS** - Most popular utility framework
- **DaisyUI** - Tailwind component library
- **shadcn/ui** - Copy-paste components (React)

### 3. Add Animation
- **Motion One** - Lightweight animations
- **View Transitions API** - Native page transitions

### 4. Migrate to React/Vue
When ready, the component structure makes this easy:
1. Install framework integration: `bunx astro add react` or `bunx astro add vue`
2. Create new `.tsx` or `.vue` files alongside `.astro` files
3. Gradually migrate components one at a time
4. Components can coexist during migration

## Comparison: Before vs After

### Before ❌
```astro
<!-- Everything mixed together -->
<style>
  .button { ... }
  .card { ... }
  .input { ... }
  /* 100+ lines of CSS */
</style>

<div class="card">
  <button class="button">...</button>
  <input class="input" />
</div>

<script>
  // Inline scripts
</script>
```

### After ✅
```astro
---
import Card from '../components/Card/Card.astro';
import Button from '../components/Button/Button.astro';
import Input from '../components/Input/Input.astro';
---

<Card>
  <Button>...</Button>
  <Input name="..." />
</Card>

<style>
  /* Only page-specific layout */
</style>
```

## Documentation

- **`COMPONENT_STRUCTURE.md`** - Detailed component API reference
- **`FRONTEND_ARCHITECTURE.md`** (this file) - Architecture overview
- **`GETTING_STARTED.md`** - Project setup and features
- **`QUICK_START.md`** - Quick reference guide

---

**Your frontend is now production-ready with a scalable, maintainable architecture!** 🚀
