# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SMG Cup Championship frontend - a Next.js 16 application for a football tournament platform. Uses Apollo Client for GraphQL data fetching with SSR support.

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npx tsc --noEmit     # TypeScript type checking
npm run format       # Format code with Prettier
npm run codegen      # Regenerate GraphQL types from production schema
npm run codegen:dev  # Regenerate from local dev schema (localhost:4000)
```

## Architecture

### App Structure (Next.js App Router)

Routes use layout groups in `src/app/`:
- `(navbar-layout)/` - Public pages with main navigation
- `(admin-layout)/` - Admin panel with separate navigation
- `(auth-layout)/` - Login/register pages
- `(gamemode-layout)/` - Game-specific views

### Domain-Driven Organization

Each feature lives in `src/domains/{feature}/`:
- `contracts.ts` - TypeScript interfaces for the domain
- `{Feature}View.tsx` - Client component wrapper
- `{Feature}ViewUi.tsx` - UI/presentation component
- `ssr/` - Server-side data fetching functions
- `mappers/` - Transform GraphQL responses to domain contracts
- `components/` - Domain-specific components

Example flow: Page → SSR function → Apollo query → Mapper → Domain contract → View component

**SSR Data Fetching:**
- Use `getClient()` from `@/lib/initializeApollo` in server components/SSR functions
- SSR functions typically live in `ssr/get{Feature}PageData.ts`
- Data is fetched server-side and passed as props to client components

### GraphQL Layer

**Schema & Types:**
- `.graphql` files in `src/graphql/queries/` and `src/graphql/mutations/`
- Running `npm run codegen` generates:
  - `src/generated/types.ts` - Base GraphQL types
  - `*.generated.ts` files next to each `.graphql` file
  - `src/graphql/index.ts` - Auto-generated barrel export of all operations (via `codegen:utils`)
- The codegen process also generates query enums and utility files automatically

**Apollo Clients:**
- `src/lib/initializeApollo.ts` - SSR client (for server components/data fetching)
  - Use `getClient()` from this file in SSR functions
- `src/lib/apollo.ts` - Browser client with WebSocket subscriptions
  - Used automatically via `ApolloNextAppProvider` in `app/providers.tsx`
- Import hooks from `@apollo/client/react` (not `@apollo/client`)
  - Example: `import { useQuery, useMutation } from '@apollo/client/react'`

**Adding a new query/mutation:**
1. Create `.graphql` file in appropriate folder (`src/graphql/queries/` or `src/graphql/mutations/`)
2. Run `npm run codegen` (or `npm run codegen:dev` for local development)
3. Import typed document and types from `@/graphql`
   - Example: `import { GetMatchesDocument, type GetMatchesQuery } from '@/graphql'`

### Authentication

**AuthContext (`src/contexts/AuthContext.tsx`):**
- Provides `user`, `isAuthenticated`, `isLoading`, `logout()`, `refetchUser()`
- Fetches current user via `GetMe` query when token exists
- Token stored in `auth_token` cookie (7-day expiration)

```tsx
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, isLoading, logout } = useAuth();
```

**Middleware (`src/middleware.ts`):**
- Protects routes requiring authentication (redirects to `/login?redirect={path}`)
- Redirects authenticated users away from auth pages (`/login`, `/register`)
- Protected routes defined in `PROTECTED_ROUTES` array
- Add new protected routes to both `PROTECTED_ROUTES` and `config.matcher`

**User Domain (`src/domains/user/`):**
- `contracts.ts` - `User` type definition
- `mappers/mapUser.ts` - Maps GraphQL user response to domain type

### UI Components

- Shadcn/UI components in `src/components/ui/` (radix-nova style)
- Tailwind CSS v4 for styling
- lucide-react for icons
- Path alias: `@/` maps to `src/`
