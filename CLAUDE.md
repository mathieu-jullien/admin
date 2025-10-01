# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React admin application for managing a personal/professional portfolio website. It uses React 19, TypeScript, Vite, React Router v7, and Tailwind CSS v4.

**Tech Stack:**

- React 19.1 with React Compiler (Babel plugin enabled)
- TypeScript 5.8 (strict mode)
- Vite 7 for build tooling
- React Router v7 for routing
- Tailwind CSS v4 with Vite plugin
- ESLint 9 + Prettier for code quality

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compilation + Vite build)
npm run build

# Preview production build
npm run preview

# Run linter and auto-fix issues
npm run lint

# Check for lint issues without fixing
npm run lint:check

# Format code with Prettier
npm run format

# Check formatting without fixing
npm run format:check

# Run both linting and formatting fixes
npm run lint:fix

# Install Husky git hooks (runs automatically after npm install)
npm run prepare
```

## Architecture

### Application Structure

```
src/
├── App.tsx              # Root component with AuthProvider + RouterProvider
├── main.tsx             # Application entry point
├── router/              # React Router configuration
│   └── index.tsx        # Route definitions with ProtectedRoute wrapping
├── components/
│   ├── auth/            # Authentication components (ProtectedRoute)
│   ├── layout/          # Layout components (Layout, Menu, Header, SubNav, Content)
│   ├── ui/              # Reusable UI components (Table)
│   └── forms/           # Form components
├── contexts/            # React Context providers
│   └── auth/            # Authentication context (AuthContext, AuthProvider)
├── hooks/               # Custom React hooks (useAuth)
├── pages/               # Page components organized by feature
│   ├── Auth/            # Authentication pages (Login)
│   ├── Error/           # Error pages (NotFound)
│   ├── Home/
│   └── Experience/      # CRUD pages (List, Create, Edit)
├── types/               # TypeScript type definitions organized by domain
│   ├── api/             # API types (errors, responses)
│   ├── auth/            # Authentication types (User, LoginCredentials)
│   ├── ui/              # UI component types
│   ├── layout/          # Layout component types
│   └── pages/           # Page-specific types
├── config/              # Configuration files (MenuItems, API config)
├── services/            # API/data services
│   ├── api/             # API client and endpoints configuration
│   ├── auth/            # Authentication service
│   └── experiences/     # Experience-specific services
└── utils/               # Utility functions (token management, etc.)
```

### Key Architectural Patterns

**Layout System:**

- `Layout` component wraps all routes using React Router's `<Outlet />`
- Consists of: `Menu` (sidebar navigation), `Header`, optional `SubNav`, and `Content` area
- Menu items are configured centrally in `src/config/MenuItems.tsx`

**Routing:**

- Declarative routing with `createBrowserRouter` from React Router v7
- Nested routes for feature modules (e.g., `/experiences` with child routes for list/create/edit)
- Protected routes wrapped with `ProtectedRoute` component that checks authentication
- Public routes for login (`/auth`) and error pages (`*` for 404)
- Automatic redirect to `/auth` for unauthenticated users

**Authentication System:**

- **Context-based architecture**: `AuthProvider` wraps entire app, provides authentication state via `AuthContext`
- **Custom hook**: `useAuth()` hook for accessing auth context (throws error if used outside provider)
- **JWT token management**: Stored in localStorage, auto-decoded to extract user info
- **Token validation**: Checks expiration on mount and validates before each API call
- **Protected routes**: `ProtectedRoute` component redirects to login if not authenticated
- **Auto-logout**: API client detects 401 responses, clears token, and redirects to login
- **Loading states**: Shows spinner during authentication check on app mount

**API Architecture:**

- **Centralized client**: `ApiClient` class with singleton instance (`apiClient`)
- **Automatic token injection**: JWT token added to Authorization header for all requests (except `/auth`)
- **Smart URL routing**: Uses `baseURL` for auth endpoints, `apiURL` for API endpoints
- **Error handling**: Custom `ApiException` class with status codes, error messages, and validation errors
- **Timeout management**: Configurable request timeout with AbortController
- **401 handling**: Auto-logout and redirect on unauthorized responses

**Type Organization:**

- Types are organized by domain (api, auth, ui, layout, pages) rather than co-located with components
- Each subdomain gets its own directory (e.g., `types/ui/table/`, `types/auth/`)
- Centralized type definitions make it easier to maintain consistency across the app

**Component Export Pattern:**

- Components use barrel exports: each component folder has an `index.tsx` that re-exports the main component
- Import from folder name: `import Table from '../ui/Table'` rather than `import Table from '../ui/Table/Table'`
- Contexts follow same pattern: `import { AuthProvider } from '../contexts/auth'`

### Reusable Components & Hooks

**Table Component (`components/ui/Table/Table.tsx`):**

- Generic table with TypeScript generics: `Table<T>`
- Features: sorting, pagination, loading states, empty states, row click handlers
- Configurable via `TableProps`: columns with custom render functions, sortable columns, pagination settings
- Used for list views across the application

**ProtectedRoute Component (`components/auth/ProtectedRoute.tsx`):**

- Wraps routes requiring authentication
- Shows loading spinner while checking auth state
- Redirects to `/auth` if user not authenticated
- Renders children if authenticated

**useAuth Hook (`hooks/useAuth.ts`):**

- Provides access to authentication context: `user`, `token`, `isAuthenticated`, `isLoading`, `login()`, `logout()`, `checkAuth()`
- Throws error if used outside `AuthProvider` to catch context misuse at development time
- Primary way to interact with authentication throughout the app

## Code Quality Standards

- **TypeScript Strict Mode:** All compiler strict options enabled, including `noUnusedLocals` and `noUnusedParameters`
- **ESLint:** Uses flat config format with TypeScript ESLint, React Hooks rules, and Prettier integration
- **Prettier:** Enforced via ESLint with error level (single quotes, 2-space tabs, 80 char width, LF line endings)
- **React Compiler:** Enabled for automatic React optimizations (affects dev/build performance)
- **Git Hooks (Husky + lint-staged):**
  - Pre-commit hook runs ESLint and Prettier on staged `.ts`/`.tsx` files
  - Auto-formats `.json`, `.md`, and `.css` files on commit
  - Ensures code quality before commits reach the repository

## Important Notes

- **React Compiler:** Plugin enabled in Vite config, impacts build/dev performance but provides automatic optimizations
- **TypeScript Project References:** Separate configs for app (`tsconfig.app.json`) and tooling (`tsconfig.node.json`)
- **Strict TypeScript:** All `.tsx` files must follow strict settings with no unused variables/parameters
- **ESLint Auto-fix:** `npm run lint` runs in fix mode by default
- **Authentication Flow:**
  - App checks auth on mount → shows loading → redirects if needed
  - All API requests (except `/auth`) automatically include JWT token
  - Token stored in localStorage and validated on each app load
  - 401 responses trigger automatic logout and redirect to login
- **Token Utilities:** Use `utils/token.ts` functions for all token operations (don't access localStorage directly)
