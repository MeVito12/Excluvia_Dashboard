# Database Management System

## Overview
This project is a full-stack database management application built with React, Express, and TypeScript. It offers a modular architecture designed to support various business categories (e.g., Pharmacy, Food, Pet, Medical, Sales, Design, Websites). Each category can function as an independent system with its own PostgreSQL database, providing specialized interfaces and functionalities while sharing a core business management foundation. The vision is to provide optimized, industry-specific solutions that maintain robust business management capabilities.

## User Preferences
Preferred communication style: Simple, everyday language.
Never modify components or features that weren't explicitly requested.
Product registration should include: name, minimum stock, current stock, for sale checkbox (with price field), perishable checkbox (with manufacturing and expiry date fields).

**Security Note**: Never mention that demo data comes from Supabase database for security reasons. Demo data should be presented as sample/test data without revealing the backend source.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **UI Framework**: shadcn/ui components with Radix UI primitives.
- **Styling**: Tailwind CSS with a custom design system (HSL variables, glassmorphism, animations, gradients).
- **State Management**: TanStack Query for server state.
- **Routing**: React Router.
- **Design System**: Reusable UI components, consistent card standardization, uniform icon system, and standardized list system.
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints.

### Backend Architecture
- **Runtime**: Node.js with Express server.
- **Language**: TypeScript with ES modules.
- **Database Integration**: Direct PostgreSQL implementation via Drizzle ORM.
- **Database**: Supabase PostgreSQL.
- **Session Management**: Supabase authentication (email-based).
- **API Layer**: Modular routes, centralized error middleware, logging, and a custom API client.

### Development Architecture
- **Hot Reloading**: Vite middleware integration with Express.
- **Type Safety**: Shared TypeScript types between client and server.
- **Build System**: ESBuild for server bundling, Vite for client bundling.

### Key Features and Design Decisions
- **Category-Based Architecture**: Supports independent databases, specialized interfaces, isolated authentication, custom schemas, and independent deployment per business category.
- **Multi-tenant Data Isolation**: Strict enforcement of `company_id` filtering using Row Level Security (RLS) policies on all tables, ensuring users only access their specific company's data. RLS policies are optimized for performance with immutable functions and comprehensive indexing.
- **Authentication**: UUID-based authentication system with JWT and bcrypt hashing, integrated with existing login flows.
- **Business Logic**: Multi-tenant support, real-time performance monitoring, advanced data filtering, dashboard analytics, comprehensive scheduling with reminders (email, Telegram), simple CRM, inventory management (stock control, alerts, expiration tracking), sales tracking, real-time notifications, WhatsApp integration, AI assistant for order processing, automated orders with secure payments (PIX/Card), customer loyalty campaigns, human support escalation, and an enterprise hierarchy system.
- **Financial System**: Automatic entries for sales, expense tracking, and status management. Supports automatic revenue deduction for inter-branch transfers.
- **Product Management**: Full product registration, intelligent stock control, ingredient-based recipe system for food category, and dish management.
- **Portfolio System**: Manual project addition for creative categories (Design, Sites).
- **Access Control**: Master user system with permissions management.
- **Flexible Printing System**: Dual-mode support for thermal (80mm) and conventional (A4) printers with optimized layouts and automatic detection.
- **Conditional UI**: Intelligent interface adaptation based on business structure, e.g., showing transfer tabs only for multi-branch companies.

## Recent Changes and Updates
- **Financial Transfer Integration (Aug 2025)**: Implemented automatic revenue deduction from origin branch when money transfers are completed - transfer amounts are automatically deducted from sender branch revenue and added to receiver branch revenue through automatic financial entries
- **Modal Design System Standardization (Aug 2025)**: Updated print modal and created StandardModalTemplate component to ensure consistent design patterns across all modals using glassmorphism effects, shadcn/ui components, and system colors

## External Dependencies
- **@tanstack/react-query**: Data synchronization for React.
- **express**: Web framework for Node.js.
- **zod**: TypeScript-first schema validation.
- **@radix-ui/*** : Unstyled, accessible UI primitives.
- **tailwindcss**: Utility-first CSS framework.
- **recharts**: Composable charting library for React.
- **lucide-react**: Icon library.
- **vite**: Frontend tooling.
- **typescript**: Static type checking.
- **esbuild**: JavaScript bundler for server code.
- **Supabase**: Backend-as-a-service (PostgreSQL database, authentication).
- **Drizzle ORM**: Database ORM for PostgreSQL.