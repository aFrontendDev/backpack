# Component Structure Guide

This document explains the new component-based architecture of the Backpack App.

## Philosophy

Each component is self-contained with its own folder containing:
- **`.astro`** - Template and logic
- **`.css`** - Component-specific styles
- **`.types.ts`** - TypeScript type definitions
- **`index.ts`** - Barrel export for cleaner imports

## Directory Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.astro       # Component template
│   │   ├── Button.css         # Component styles
│   │   ├── Button.types.ts    # TypeScript types
│   │   └── index.ts           # Barrel export
│   ├── Card/
│   │   ├── Card.astro
│   │   ├── Card.css
│   │   ├── Card.types.ts
│   │   └── index.ts
│   ├── FormGroup/
│   │   ├── FormGroup.astro
│   │   ├── FormGroup.css
│   │   ├── FormGroup.types.ts
│   │   └── index.ts
│   ├── Input/
│   │   ├── Input.astro
│   │   ├── Input.css
│   │   ├── Input.types.ts
│   │   └── index.ts
│   └── Message/
│       ├── Message.astro
│       ├── Message.css
│       ├── Message.types.ts
│       └── index.ts
├── styles/
│   └── global.css             # Global styles and utilities
└── pages/
    └── ...                    # Pages use components
```

## Available Components

### Button

A reusable button component with variants.

**Props:**
- `type?: 'button' | 'submit' | 'reset'` - Button type (default: 'button')
- `variant?: 'primary' | 'secondary' | 'danger'` - Visual variant (default: 'primary')
- `disabled?: boolean` - Disabled state
- `class?: string` - Additional CSS classes
- `id?: string` - HTML ID attribute

**Usage:**
```astro
---
import Button from '../components/Button/Button.astro';
---

<Button type="submit" variant="primary">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
```

**CSS Classes:**
- `.button` - Base class
- `.primary` - Primary variant (green)
- `.secondary` - Secondary variant (blue)
- `.danger` - Danger variant (red)
- `.full-width` - Makes button full width

---

### Card

A container component with shadow and padding.

**Props:**
- `class?: string` - Additional CSS classes
- `padding?: 'small' | 'medium' | 'large'` - Padding size (default: 'medium')

**Usage:**
```astro
---
import Card from '../components/Card/Card.astro';
---

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>

<Card padding="large">
  <p>Card with large padding</p>
</Card>
```

---

### Input

A styled input field component.

**Props:**
- `type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'` - Input type (default: 'text')
- `name: string` - Input name (required)
- `id?: string` - HTML ID (defaults to name)
- `placeholder?: string` - Placeholder text
- `required?: boolean` - Required field
- `disabled?: boolean` - Disabled state
- `value?: string` - Input value
- `minlength?: number` - Minimum length
- `maxlength?: number` - Maximum length
- `pattern?: string` - Validation pattern
- `class?: string` - Additional CSS classes

**Usage:**
```astro
---
import Input from '../components/Input/Input.astro';
---

<Input
  type="text"
  name="username"
  placeholder="Enter username"
  required
  minlength={3}
  maxlength={31}
/>
```

---

### FormGroup

A wrapper component for form fields with label and hints.

**Props:**
- `label?: string` - Field label
- `htmlFor?: string` - Label's `for` attribute
- `hint?: string` - Helper text below input
- `error?: string` - Error message (overrides hint)
- `required?: boolean` - Adds asterisk to label
- `class?: string` - Additional CSS classes

**Usage:**
```astro
---
import FormGroup from '../components/FormGroup/FormGroup.astro';
import Input from '../components/Input/Input.astro';
---

<FormGroup
  label="Username"
  htmlFor="username"
  hint="3-31 characters"
  required
>
  <Input name="username" id="username" />
</FormGroup>
```

---

### Message

A status message component for success/error/info/warning messages.

**Props:**
- `type?: 'success' | 'error' | 'info' | 'warning'` - Message type (default: 'info')
- `id?: string` - HTML ID
- `class?: string` - Additional CSS classes

**Usage:**
```astro
---
import Message from '../components/Message/Message.astro';
---

<Message type="success">Operation successful!</Message>
<Message type="error">Something went wrong</Message>

<!-- For dynamic messages with JavaScript -->
<Message id="dynamic-message" />
```

**JavaScript Usage:**
```javascript
const message = document.getElementById('dynamic-message');
message.textContent = 'Success!';
message.classList.add('success', 'visible');
```

---

## Global Styles

Located in `src/styles/global.css`, includes:

### Typography
- Base font family and sizing
- Heading styles (h1-h6)
- Link styles

### Layout Utilities
- `.container` - Max-width container with padding
- `.text-center` - Center text alignment

### Spacing Utilities
- `.mt-{1-4}` - Margin top (0.5rem to 2rem)
- `.mb-{1-4}` - Margin bottom (0.5rem to 2rem)
- `.p-{1-4}` - Padding (0.5rem to 2rem)

### Flexbox Utilities
- `.flex` - Display flex
- `.flex-column` - Flex direction column
- `.flex-center` - Center items both ways
- `.gap-{1-3}` - Gap between flex items

---

## Creating New Components

### Step-by-step guide:

1. **Create component folder:**
   ```bash
   mkdir -p src/components/MyComponent
   ```

2. **Create type definitions (`MyComponent.types.ts`):**
   ```typescript
   export interface MyComponentProps {
     text: string;
     variant?: 'default' | 'special';
     class?: string;
   }
   ```

3. **Create styles (`MyComponent.css`):**
   ```css
   .my-component {
     padding: 1rem;
     border-radius: 4px;
   }

   .my-component.default {
     background: white;
   }

   .my-component.special {
     background: lightblue;
   }
   ```

4. **Create component (`MyComponent.astro`):**
   ```astro
   ---
   import type { MyComponentProps } from './MyComponent.types';
   import './MyComponent.css';

   interface Props extends MyComponentProps {}

   const {
     text,
     variant = 'default',
     class: className = '',
     ...rest
   } = Astro.props;

   const classes = `my-component ${variant} ${className}`.trim();
   ---

   <div class={classes} {...rest}>
     {text}
     <slot />
   </div>
   ```

5. **Create barrel export (`index.ts`):**
   ```typescript
   export { default as MyComponent } from './MyComponent.astro';
   export type { MyComponentProps } from './MyComponent.types';
   ```

6. **Use in pages:**
   ```astro
   ---
   import MyComponent from '../components/MyComponent/MyComponent.astro';
   ---

   <MyComponent text="Hello!" variant="special">
     Optional child content
   </MyComponent>
   ```

---

## Best Practices

### 1. Component Naming
- Use PascalCase for component folders and files
- Match file names to component name (e.g., `Button.astro` not `button.astro`)

### 2. Props
- Always define TypeScript types in `.types.ts`
- Provide sensible defaults
- Use `class` prop to allow style extensions
- Spread `...rest` to allow additional HTML attributes

### 3. Styles
- Keep styles scoped to the component
- Use BEM-like naming: `.component`, `.component.variant`
- Avoid deep nesting
- Use CSS custom properties for theming

### 4. Slots
- Use `<slot />` for child content when appropriate
- Consider named slots for complex components

### 5. Accessibility
- Add proper ARIA attributes
- Ensure keyboard navigation works
- Use semantic HTML elements

---

## Migrating to Vue/React

Since components are already separated by concern (template, styles, types), migrating to Vue or React is straightforward:

### Current (Astro):
```
Button/
├── Button.astro       # Template + logic
├── Button.css         # Styles
└── Button.types.ts    # Types
```

### Future (React):
```
Button/
├── Button.tsx         # Component + logic (combine .astro + .types.ts)
├── Button.module.css  # Styles (CSS modules)
└── index.ts           # Export
```

### Future (Vue):
```
Button/
├── Button.vue         # SFC (template + script + style)
├── Button.types.ts    # Types (if needed separately)
└── index.ts           # Export
```

The separation makes it easy to:
1. Copy type definitions as-is
2. Translate Astro templates to JSX/Vue template syntax
3. Keep or adapt CSS as needed
4. Maintain the same component API

---

## Next Steps

Consider adding:
- **Component library documentation** (Storybook, etc.)
- **Unit tests** for components
- **Shared theme file** for colors and spacing
- **More complex components** (Modal, Dropdown, Table, etc.)
- **Component composition examples**
