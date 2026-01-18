# Backpack App - Getting Started

A full-stack application built with Bun, Astro, and Lucia authentication.

## Features

- 🔐 User authentication (register, login, logout)
- 💾 SQLite database for user data
- 🚀 Server-side rendering with Astro
- ⚡ Fast runtime with Bun
- 📦 API endpoints for data management

## Project Structure

```
backpack-app/
├── src/
│   ├── layouts/
│   │   └── Layout.astro          # Base layout component
│   ├── lib/
│   │   ├── auth.ts               # Lucia authentication setup
│   │   └── db.ts                 # SQLite database setup
│   ├── middleware/
│   │   └── index.ts              # Session validation middleware
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login.ts      # Login endpoint
│   │   │   │   ├── register.ts   # Registration endpoint
│   │   │   │   └── logout.ts     # Logout endpoint
│   │   │   └── data/
│   │   │       ├── save.ts       # Save user data
│   │   │       ├── get.ts        # Retrieve user data
│   │   │       └── delete.ts     # Delete user data
│   │   ├── index.astro           # Home page
│   │   ├── login.astro           # Login page
│   │   ├── register.astro        # Registration page
│   │   └── dashboard.astro       # User dashboard
│   └── env.d.ts                  # TypeScript definitions
├── database.db                   # SQLite database (created automatically)
└── astro.config.mjs             # Astro configuration
```

## Getting Started

### 1. Start the development server

```bash
bun run dev
```

The app will be available at `http://localhost:4321`

### 2. Create an account

- Visit `/register` to create a new account
- Username: 3-31 characters, alphanumeric with hyphens/underscores
- Password: minimum 6 characters

### 3. Explore the features

- **Home page**: Shows authentication status
- **Dashboard**: Save, view, and delete key-value data
- **API endpoints**: Available for programmatic access

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
  - Body: `FormData` with `username` and `password`

- `POST /api/auth/login` - Login
  - Body: `FormData` with `username` and `password`

- `POST /api/auth/logout` - Logout
  - No body required

### Data Management

- `POST /api/data/save` - Save data
  - Body: `{ "key": "string", "value": any }`
  - Requires authentication

- `GET /api/data/get` - Get data
  - Query param: `key` (optional, omit to get all data)
  - Requires authentication

- `DELETE /api/data/delete` - Delete data
  - Query param: `key` (required)
  - Requires authentication

## Database Schema

### users
- `id` - Unique user ID
- `username` - Unique username
- `password_hash` - Hashed password (using Bun's password hasher)
- `created_at` - Registration timestamp

### sessions
- `id` - Session ID
- `user_id` - Reference to user
- `expires_at` - Session expiration time

### user_data
- `id` - Auto-incrementing ID
- `user_id` - Reference to user
- `key` - Data key
- `value` - JSON-encoded value
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Technologies Used

- **Bun**: JavaScript runtime and package manager
- **Astro**: Web framework for building fast websites
- **Lucia**: Authentication library
- **better-sqlite3**: SQLite database driver
- **TypeScript**: Type safety

## Development Tips

- The database file `database.db` is created automatically in the project root
- Sessions are validated on every request via middleware
- All user data is scoped to the authenticated user
- Passwords are hashed using Bun's built-in password hasher

## Building for Production

```bash
bun run build
```

To preview the production build:

```bash
bun run preview
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
