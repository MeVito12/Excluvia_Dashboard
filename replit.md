# Database Management System

## Overview

This is a full-stack database management application built with React, Express, and TypeScript. The application provides a dashboard for monitoring database metrics, user activity, and system performance across multiple companies. It features a modern UI built with shadcn/ui components and Tailwind CSS, with comprehensive data visualization using Recharts.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **Session Management**: PostgreSQL session store with connect-pg-simple

### Development Architecture
- **Hot Reloading**: Vite middleware integration with Express
- **Type Safety**: Shared TypeScript types between client and server
- **Build System**: ESBuild for server bundling, Vite for client bundling

## Key Components

### Database Layer
- **ORM**: Drizzle ORM provides type-safe database operations
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migrations**: Automated schema migrations with drizzle-kit
- **Connection**: Neon serverless PostgreSQL database

### API Layer
- **Storage Interface**: Abstracted storage layer with both memory and database implementations
- **Route Registration**: Modular route organization in `server/routes.ts`
- **Error Handling**: Centralized error middleware with proper status codes
- **Logging**: Request/response logging with performance metrics

### UI Components
- **Design System**: Consistent color scheme using HSL variables
- **Component Library**: Comprehensive set of reusable UI components
- **Data Visualization**: Charts and metrics displays using Recharts
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Business Logic
- **Multi-tenant Support**: Company-based data filtering and display
- **Real-time Metrics**: Performance monitoring and alerting
- **Search and Filtering**: Advanced data filtering capabilities
- **Dashboard Analytics**: Comprehensive business intelligence views

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests through the storage interface
3. **Database Operations**: Drizzle ORM executes type-safe SQL operations
4. **Data Transformation**: Server formats data before sending to client
5. **UI Updates**: React components update based on query results
6. **State Management**: TanStack Query handles caching and synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon
- **drizzle-orm**: Type-safe ORM with excellent TypeScript support
- **@tanstack/react-query**: Powerful data synchronization for React
- **express**: Fast, unopinionated web framework for Node.js

### UI Dependencies
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **recharts**: Composable charting library for React
- **lucide-react**: Beautiful and consistent icon library

### Development Dependencies
- **vite**: Next generation frontend tooling
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for server code

## Deployment Strategy

### Build Process
1. **Client Build**: Vite bundles React application to `dist/public`
2. **Server Build**: ESBuild bundles Express server to `dist/index.js`
3. **Type Checking**: TypeScript validates all code before deployment
4. **Asset Optimization**: Vite optimizes images, CSS, and JavaScript

### Production Configuration
- **Environment Variables**: Database URL and other secrets via environment
- **Static Assets**: Express serves Vite-built frontend in production
- **Database Migrations**: Automated schema deployment with drizzle-kit
- **Error Handling**: Production-ready error responses and logging

### Development Workflow
- **Hot Module Replacement**: Instant updates during development
- **TypeScript Watching**: Real-time type checking and error reporting
- **Database Sync**: Easy schema synchronization with `npm run db:push`

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```