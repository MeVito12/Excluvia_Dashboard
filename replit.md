# Database Management System

## Overview

This is a full-stack database management application built with React, Express, and TypeScript. It provides a dashboard for monitoring database metrics, user activity, and system performance across multiple companies. Key capabilities include multi-tenant support, comprehensive data visualization, real-time metrics, advanced search and filtering, and a robust notification system. The application aims to offer a complete business management solution covering appointment scheduling, inventory, sales, customer service, and financial tracking for various business categories.

## User Preferences

Preferred communication style: Simple, everyday language.
Never modify components or features that weren't explicitly requested.
Product registration should include: name, minimum stock, current stock, for sale checkbox (with price field), perishable checkbox (with manufacturing and expiry date fields).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system (consistent color scheme using HSL variables, modern design touches like glassmorphism, animations, gradients)
- **State Management**: TanStack Query for server state management
- **Routing**: React Router
- **Design System**: Comprehensive set of reusable UI components, consistent card standardization (metric-card-standard, list-card, standard-card), uniform icon system, and standardized list system across sections.
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints.

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database Integration**: Direct PostgreSQL implementation via Drizzle ORM
- **Database**: Supabase PostgreSQL databases
- **Session Management**: Configured for Supabase authentication (email-based)
- **API Layer**: Modular route organization, centralized error middleware, request/response logging, and a custom API client for seamless backend communication with dynamic user ID handling.

### Development Architecture
- **Hot Reloading**: Vite middleware integration with Express
- **Type Safety**: Shared TypeScript types between client and server
- **Build System**: ESBuild for server bundling, Vite for client bundling

### Key Components
- **Storage Layer**: In-memory storage system with mock data (for development/demonstration) or direct Supabase integration for live data.
- **Business Logic**: Multi-tenant support with company-based data filtering; real-time performance monitoring; advanced data filtering; dashboard analytics; complete scheduling system with reminders and platform integrations (Google Calendar, Doctoralia, Outlook); email and Telegram reminders; simple CRM; comprehensive inventory management with stock control, low stock alerts, and expiration tracking; sales tracking with reports; real-time notifications for stock/sales/client activity; WhatsApp integration with menu access; AI assistant for automatic responses and order processing; automated orders with secure payments (PIX/Card); customer loyalty campaigns; human support escalation; and a complete enterprise hierarchy system (backend only).
- **UI Components**: Charts and metrics displays using Recharts; Lucide-React for icons.
- **Financial System**: Automatic financial entries for sales (income), expense tracking, and pending/overdue status.
- **Product Management**: Full product registration, intelligent stock control, ingredient-based recipe system for food category, and comprehensive dish management with ingredient selection and automatic stock deduction.
- **Portfolio System**: For creative categories (Design, Sites), manual project addition with images, links, descriptions, and categorization.
- **Access Control**: Master user system with permissions management (ControleSection) to configure regular user access to sections.

## External Dependencies

- **@tanstack/react-query**: Data synchronization for React
- **express**: Web framework for Node.js
- **zod**: TypeScript-first schema validation
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **recharts**: Composable charting library for React
- **lucide-react**: Icon library
- **vite**: Frontend tooling
- **typescript**: Static type checking
- **esbuild**: JavaScript bundler for server code
- **Supabase**: Backend-as-a-service (PostgreSQL database, authentication)
- **Drizzle ORM**: Database ORM for PostgreSQL