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
```

## Architecture

### Application Structure

```
src/
├── App.tsx              # Root component with RouterProvider
├── main.tsx             # Application entry point
├── router/              # React Router configuration
│   └── index.tsx        # Route definitions with nested routes
├── components/
│   ├── layout/          # Layout components (Layout, Menu, Header, SubNav, Content)
│   ├── ui/              # Reusable UI components (Table)
│   └── forms/           # Form components
├── pages/               # Page components organized by feature
│   ├── Home/
│   └── Experience/      # CRUD pages (List, Create, Edit)
├── types/               # TypeScript type definitions organized by domain
│   ├── ui/              # UI component types
│   ├── layout/          # Layout component types
│   └── pages/           # Page-specific types
├── config/              # Configuration files (MenuItems)
├── services/            # API/data services
└── utils/               # Utility functions
```

### Key Architectural Patterns

**Layout System:**

- `Layout` component wraps all routes using React Router's `<Outlet />`
- Consists of: `Menu` (sidebar navigation), `Header`, optional `SubNav`, and `Content` area
- Menu items are configured centrally in `src/config/MenuItems.tsx`

**Routing:**

- Declarative routing with `createBrowserRouter` from React Router v7
- Nested routes for feature modules (e.g., `/experiences` with child routes for list/create/edit)
- Layout component applied at root level with nested children

**Type Organization:**

- Types are organized by domain (ui, layout, pages) rather than co-located with components
- Each subdomain gets its own directory (e.g., `types/ui/table/`)

**Component Export Pattern:**

- Components use barrel exports: each component folder has an `index.tsx` that re-exports the main component
- Import from folder name: `import Table from '../ui/Table'` rather than `import Table from '../ui/Table/Table'`

### Reusable Components

**Table Component (`components/ui/Table/Table.tsx`):**

- Generic table with TypeScript generics: `Table<T>`
- Features: sorting, pagination, loading states, empty states, row click handlers
- Configurable via `TableProps`: columns with custom render functions, sortable columns, pagination settings
- Used for list views across the application

## Code Quality Standards

- **TypeScript Strict Mode:** All compiler strict options enabled, including `noUnusedLocals` and `noUnusedParameters`
- **ESLint:** Uses flat config format with TypeScript ESLint, React Hooks rules, and Prettier integration
- **Prettier:** Enforced via ESLint with error level (single quotes, 2-space tabs, 80 char width, LF line endings)
- **React Compiler:** Enabled for automatic React optimizations (affects dev/build performance)

## Important Notes

- React Compiler plugin is enabled in Vite config, which impacts build/dev performance but provides automatic optimizations
- TypeScript uses project references pattern with separate configs for app (`tsconfig.app.json`) and tooling (`tsconfig.node.json`)
- All `.tsx` files must follow strict TypeScript settings with no unused variables/parameters
- ESLint runs in fix mode by default with `npm run lint`
