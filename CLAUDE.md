# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
bun run dev
```
Starts the Nuxt development server on http://localhost:3000

### Build Commands
```bash
bun run build        # Build for production
bun run generate     # Generate static site
bun run preview      # Preview production build
```

### Storybook
```bash
bun run storybook       # Start Storybook dev server on port 6006
bun run build-storybook # Build Storybook for production
```

## Architecture Overview

This is a Nuxt 3 application for a sports-focused social platform called Olympsis. The architecture follows a component-driven approach with clear separation of concerns:

### Core Structure
- **Pages**: Vue pages using Nuxt file-based routing (`/pages/`)
- **Components**: Reusable Vue components organized by feature area (`/components/`)
- **Data Layer**: Models, services, and facades for API communication (`/data/`)
- **Stores**: Pinia stores for state management (`/stores/`)
- **Composables**: Vue composables for shared logic (`/composables/`)

### Key Architectural Patterns

#### Model-Service-Store Architecture
- **Models**: TypeScript classes extending `Codable` for data serialization (`/data/models/`)
- **Services**: API interaction classes for each domain (Events, Clubs, Venues, etc.) (`/data/services/`)
- **Stores**: Pinia stores manage application state with caching (`/stores/`)

#### Authentication & Session Management
- Authentication handled through Firebase via `useAuthStore()` and `useSessionStore()`
- Global middleware (`01.setup.global.ts`) manages auth state and routing
- Session store includes centralized model caching via `useModelStore()`

#### Component Organization
Components are organized by feature areas:
- **Events**: Event creation, display, and management
- **Groups**: Club and organization management
- **Profile**: User profile and settings
- **System**: App-wide dialogs and utilities

#### State Management
- **Auth Store**: User authentication state
- **Session Store**: User session data and cached models
- **Model Store**: Centralized caching for Events, Clubs, Venues, Organizations
- **Groups View Model**: Specific state for groups functionality

### Key Technologies
- **Nuxt 3**: Vue.js framework with SSR/SSG capabilities
- **Pinia**: State management
- **PrimeVue**: UI component library with Aura theme
- **Firebase**: Authentication and backend services
- **Storybook**: Component development and documentation
- **Sentry**: Error monitoring and performance tracking

### Route Configuration
- Static routes (about, terms, privacy) are prerendered
- Dynamic routes like `/events/[id]` and `/groups/search/[id]` use SSR
- App routes (home, groups, profile) are client-side only (ssr: false)
- Root `/` redirects to `/signin`

### Development Patterns
- Components include Storybook stories for documentation
- Enum-based type safety for sports, events, groups, etc. (`/data/Enums.ts`)
- Global middleware handles authentication and session initialization
- Location services integrated with Apple MapKit
- Comprehensive error handling with Sentry integration

### Testing
No specific test framework is configured. The project relies on TypeScript for type safety and Storybook for component testing.