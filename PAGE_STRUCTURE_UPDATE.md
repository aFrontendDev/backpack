# Page Structure Update - Component Pattern

Pages now follow the same folder structure as components, with each page having its own directory containing both `.astro` and `.css` files.

## New Structure

```
src/pages/
├── index.astro           # Home page (root route /)
├── _index.css            # Home page styles
├── login/                # Login page directory
│   ├── index.astro       # → Route: /login
│   └── _login.css        # Login styles
├── register/             # Register page directory
│   ├── index.astro       # → Route: /register
│   └── _register.css     # Register styles
├── dashboard/            # Dashboard page directory
│   ├── index.astro       # → Route: /dashboard
│   └── _dashboard.css    # Dashboard styles
└── api/                  # API routes
    ├── auth/
    └── data/
```

## Pattern Explanation

### Folder-based Pages (login/, register/, dashboard/)

```
pages/login/
├── index.astro    # Main page file
└── _login.css     # Page-specific styles
```

- **`index.astro`** = Route `/login`
- **`_login.css`** = Styles (underscore prefix tells Astro to ignore as route)

### Root-level Pages (index.astro)

```
pages/
├── index.astro    # Route: /
└── _index.css     # Styles
```

- Stays at root level (can't create an `index/` folder)
- CSS file prefixed with `_` to avoid route conflicts

## Why Underscore Prefix?

Astro treats the `pages/` directory as routes. Any file in `pages/` becomes a route:
- `pages/about.astro` → `/about`
- `pages/contact.css` → `/contact.css` ⚠️ (tries to create a route)

**Solution:** Prefix non-route files with `_`:
- `pages/_contact.css` → Ignored by routing system ✅

This is an Astro convention for "private" files in the pages directory.

## Comparison: Before vs After

### Before (Mixed Organization)

```
src/
├── pages/
│   ├── index.astro
│   ├── login.astro
│   ├── register.astro
│   └── dashboard.astro
└── styles/pages/
    ├── index.css
    ├── login.css
    ├── register.css
    └── dashboard.css
```

**Problems:**
- Pages and styles separated
- Have to navigate between directories
- Harder to find related files

### After (Co-located)

```
src/pages/
├── index.astro + _index.css
├── login/
│   ├── index.astro
│   └── _login.css
├── register/
│   ├── index.astro
│   └── _register.css
└── dashboard/
    ├── index.astro
    └── _dashboard.css
```

**Benefits:**
✅ Pages and styles together
✅ Easy to find everything related to a page
✅ Matches component structure
✅ Scalable for adding more files (types, utils, etc.)

## Import Pattern

Each page imports its own CSS:

```astro
---
// pages/login/index.astro
import Layout from '../../layouts/Layout.astro';
import './_login.css';  // 👈 Co-located CSS
---

<Layout title="Login">
  <!-- Template -->
</Layout>
```

## Matches Component Pattern

Now pages and components follow the same structure:

### Component

```
components/Button/
├── Button.astro
├── Button.css
├── Button.types.ts
└── index.ts
```

### Page

```
pages/login/
├── index.astro
└── _login.css
```

Both have:
- Dedicated folder
- Astro file for template
- CSS file for styles
- Can add more files (types, utils) as needed

## Benefits

### 1. **Consistency**
Same pattern for components and pages

### 2. **Co-location**
Everything for a page/feature in one place

### 3. **Scalability**
Easy to add page-specific files:

```
pages/dashboard/
├── index.astro
├── _dashboard.css
├── _dashboard.types.ts      # 🆕 Add types
├── _dashboard.utils.ts      # 🆕 Add utilities
└── _components/             # 🆕 Add page-specific components
    └── DataTable.astro
```

### 4. **Clarity**
No confusion about which CSS belongs to which page

### 5. **Maintainability**
Delete a page = delete its folder (everything goes with it)

## File Naming Convention

| File Type | Pattern | Example |
|-----------|---------|---------|
| **Page route** | `index.astro` | `login/index.astro` → `/login` |
| **Page styles** | `_[name].css` | `login/_login.css` |
| **Page types** | `_[name].types.ts` | `login/_login.types.ts` |
| **Page utils** | `_[name].utils.ts` | `login/_login.utils.ts` |
| **Page components** | `_components/` | `login/_components/` |

**Rule:** Prefix anything that's NOT a route with `_`

## Routes Created

| Directory | Route | File |
|-----------|-------|------|
| `pages/` | `/` | `index.astro` |
| `pages/login/` | `/login` | `index.astro` |
| `pages/register/` | `/register` | `index.astro` |
| `pages/dashboard/` | `/dashboard` | `index.astro` |

CSS files are imported but don't create routes (thanks to `_` prefix).

## Migration Notes

### Old Import
```astro
import '../styles/pages/login.css';
```

### New Import
```astro
import './_login.css';
```

**Benefits:**
- Relative path (shorter)
- Co-located (easier to maintain)
- Follows component pattern

## Future Expansion

### Adding Page-Specific TypeScript

```typescript
// pages/dashboard/_dashboard.types.ts
export interface DashboardData {
  key: string;
  value: any;
}
```

```astro
---
// pages/dashboard/index.astro
import type { DashboardData } from './_dashboard.types';
import './_dashboard.css';
---
```

### Adding Page-Specific Components

```
pages/dashboard/
├── index.astro
├── _dashboard.css
└── _components/
    ├── DataCard.astro
    └── DataTable.astro
```

```astro
---
// pages/dashboard/index.astro
import DataCard from './_components/DataCard.astro';
import './_dashboard.css';
---
```

## Best Practices

### ✅ DO:
- Use `index.astro` for main page file
- Prefix non-route files with `_`
- Keep page-specific code in page folder
- Follow same pattern as components

### ❌ DON'T:
- Create routes accidentally (forget `_` prefix)
- Mix page styles with global styles
- Put shared components in page folders (use `src/components/`)

## Comparison to Other Frameworks

### Next.js (App Router)
```
app/login/
├── page.tsx
├── layout.tsx
└── loading.tsx
```

### SvelteKit
```
routes/login/
├── +page.svelte
├── +page.ts
└── +layout.svelte
```

### Our Astro Pattern
```
pages/login/
├── index.astro
└── _login.css
```

**Advantage:** Similar co-location pattern, familiar to developers from other frameworks.

## Status

✅ All pages restructured
✅ All imports updated
✅ No Astro warnings
✅ Server running clean
✅ Pattern matches components

**Your entire codebase now follows a consistent, scalable structure!** 🎉
