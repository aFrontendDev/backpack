# Backpack App

A modern full-stack web application built with Bun, Astro, and component-driven architecture.

## 🚀 Quick Start

```bash
# Install dependencies (already done)
bun install

# Start development server
bun run dev
```

Visit **http://localhost:4321** to see your app!

## 📚 Documentation

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide for using the app
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Detailed setup and features guide

### Frontend Architecture
- **[FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)** - Complete architecture overview
- **[COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)** - Component API reference
- **[REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md)** - What changed and why

## ✨ Features

### Backend
- 🔐 **Authentication** - Register, login, logout with Lucia
- 💾 **SQLite Database** - Fast, serverless data storage
- 🔒 **Secure Sessions** - HTTP-only cookies with validation
- 🚀 **Bun Runtime** - Fast JavaScript runtime
- 📡 **RESTful API** - Clean API endpoints for data management

### Frontend
- 🧩 **Component Library** - Reusable UI components
- 🎨 **Separated Styles** - Each component has its own CSS
- 📝 **TypeScript** - Full type safety
- ⚡ **Fast Reload** - Instant updates during development
- 📱 **Responsive** - Works on all devices

## 🗂️ Project Structure

```
backpack-app/
├── src/
│   ├── components/          # 🆕 Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── FormGroup/
│   │   ├── Input/
│   │   └── Message/
│   ├── styles/              # 🆕 Global styles
│   │   └── global.css
│   ├── pages/               # Route-based pages
│   │   ├── index.astro      # Home page
│   │   ├── login.astro      # Login page
│   │   ├── register.astro   # Registration page
│   │   ├── dashboard.astro  # User dashboard
│   │   └── api/             # API endpoints
│   ├── layouts/             # Page layouts
│   ├── lib/                 # Backend utilities
│   └── middleware/          # Server middleware
├── database.db              # SQLite database
└── [docs]                   # Documentation files
```

## 🎯 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Bun | Fast JavaScript runtime & package manager |
| **Framework** | Astro | SSR web framework |
| **Auth** | Lucia | Session-based authentication |
| **Database** | SQLite | Lightweight serverless database |
| **Styling** | CSS | Component-scoped + global utilities |
| **Types** | TypeScript | Type safety throughout |

## 📖 Component Library

### Available Components

- **Button** - Primary, secondary, danger variants
- **Card** - Container with shadow and padding options
- **Input** - Styled form inputs with validation
- **FormGroup** - Label + input wrapper with hints
- **Message** - Success/error/info/warning messages

See [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md) for detailed API docs.

## 🛠️ Development

### Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run preview  # Preview production build
```

### Environment Variables

Built-in Astro variables (no `.env` needed):
- `import.meta.env.PROD` - `true` in production
- `import.meta.env.DEV` - `true` in development
- `import.meta.env.MODE` - `'development'` or `'production'`

See `.env.example` for custom environment variables.

## 🔐 Authentication Flow

1. **Register** → Hash password → Create user → Create session → Set cookie
2. **Login** → Verify password → Create session → Set cookie
3. **Middleware** → Validate session on every request → Populate `Astro.locals.user`
4. **Logout** → Invalidate session → Clear cookie

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Data Management
- `POST /api/data/save` - Save user data
- `GET /api/data/get` - Retrieve data (all or by key)
- `DELETE /api/data/delete` - Delete data by key

## 🎨 Styling

### Component Styles
Each component has its own CSS file:
```
Button/
├── Button.astro
├── Button.css       # Component-specific styles
└── Button.types.ts
```

### Global Utilities
Available throughout the app:
```css
.container      /* Max-width centered container */
.text-center    /* Center text */
.mt-1 to .mt-4  /* Margin top */
.mb-1 to .mb-4  /* Margin bottom */
.flex           /* Display flex */
.gap-1 to .gap-3 /* Gap between items */
```

## 🔄 Migration Path

The component structure makes migrating to React/Vue straightforward:

**Current (Astro):**
```
Button/
├── Button.astro     # Template + logic
├── Button.css       # Styles
└── Button.types.ts  # Types
```

**Future (React):**
```
Button/
├── Button.tsx       # Component
├── Button.css       # Styles (same)
└── Button.types.ts  # Types (same)
```

See [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) for details.

## 📝 Creating New Components

1. Create component folder: `src/components/MyComponent/`
2. Add files:
   - `MyComponent.types.ts` - TypeScript interface
   - `MyComponent.css` - Component styles
   - `MyComponent.astro` - Template and logic
   - `index.ts` - Barrel export
3. Use in pages: `import MyComponent from '../components/MyComponent/MyComponent.astro'`

Full guide in [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md).

## 🤝 Contributing

1. Create feature branch
2. Follow existing component patterns
3. Update documentation
4. Test thoroughly
5. Submit PR

## 📄 License

MIT

## 🙏 Built With

- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Astro](https://astro.build) - Modern web framework
- [Lucia](https://lucia-auth.com) - Auth library
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - SQLite driver

---

**Happy coding!** 🎉

For questions or issues, refer to the documentation files listed above.
