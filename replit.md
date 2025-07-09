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
- **Database Integration**: Prepared for multiple Supabase database connections
- **Database**: Multiple Supabase PostgreSQL databases (configured via environment)
- **Session Management**: Will be configured for Supabase authentication

### Development Architecture
- **Hot Reloading**: Vite middleware integration with Express
- **Type Safety**: Shared TypeScript types between client and server
- **Build System**: ESBuild for server bundling, Vite for client bundling

## Key Components

### Database Layer
- **Integration**: Multiple Supabase database connections
- **Schema**: TypeScript interfaces in `shared/schema.ts` prepared for Supabase
- **Database**: Multiple Supabase PostgreSQL databases
- **Connection**: Multi-database connection manager with environment-based configuration

### API Layer
- **Storage Interface**: Abstracted storage layer prepared for Supabase multi-database integration
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
- **Appointment Management**: Complete scheduling system with automatic reminders
- **Notification System**: Email and Telegram reminder delivery
- **Platform Integrations**: Support for Google Calendar, Doctoralia, and Outlook
- **Simple CRM**: Basic client information management without complexity
- **Inventory Management**: Complete stock control with low stock alerts and expiration tracking
- **Sales Management**: Sales tracking with daily/weekly reports and client management
- **Real-time Notifications**: Instant alerts for stock, sales, and client activity
- **WhatsApp Integration**: Complete customer service via WhatsApp with menu access
- **AI Assistant 24/7**: Intelligent bot for automatic responses and order processing
- **Automated Orders**: Secure payments via PIX/Card with automatic kitchen integration
- **Customer Loyalty**: Personalized campaigns and promotions for client retention
- **Human Support**: Intelligent escalation to human agents when needed

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests through the storage interface
3. **Database Operations**: Drizzle ORM executes type-safe SQL operations
4. **Data Transformation**: Server formats data before sending to client
5. **UI Updates**: React components update based on query results
6. **State Management**: TanStack Query handles caching and synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for Neon
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
- June 30, 2025. Added mock authentication system with login form, user context, and logout functionality
- June 30, 2025. Migrated from Supabase to SQLite internal database for better reliability
- June 30, 2025. Migrated from SQLite to PostgreSQL with Neon serverless driver for production scalability
- June 30, 2025. Implemented complete appointment management system with automatic reminders, platform integrations (Google Calendar, Doctoralia, Outlook), and notification settings (Email/Telegram)
- June 30, 2025. Removed current database implementation and prepared codebase for Supabase multi-database integration
- June 30, 2025. Implemented complete inventory management system with stock control, sales tracking, client management, and real-time notifications. Added new Estoque section with products, sales, clients, and reports management. Enhanced Dashboard with appointment reminders and instant notifications. Updated Reports section with daily/weekly sales reports.
- June 30, 2025. Implemented comprehensive customer service system with new Atendimento section featuring: WhatsApp integration with menu access, AI assistant 24/7 for automatic responses, automated order processing with secure payments, customer loyalty campaigns, and intelligent human support escalation. All systems are prepared for Supabase multi-database integration.
- June 30, 2025. Created comprehensive mock data across all business categories (pet, medical, food, technology) with advanced filtering capabilities. Updated inventory section with 12 diverse products, 8 categorized sales, 9 clients from different segments, and 7 scheduled appointments. Implemented category-based filters for products, sales, and clients with search functionality. Enhanced Dashboard metrics to reflect multi-category business operations.
- July 02, 2025. Removed system-wide category filters and implemented category-specific filters based on login selection. Updated all sections to show only data relevant to selected business category. Each category now has appropriate filter types (e.g., Pet: ração/medicamentos; Sales: eletrônicos/vestuário). Changed "Tecnologia" category to "Vendas" with sales-specific services and products. Configured system to always show category selection screen for demonstration purposes.
- July 02, 2025. Massively expanded mock data for "Vendas" category with comprehensive commercial scenarios: 21 diverse products (electronics, apparel, home goods, books), 19 extensive sales transactions with corporate/retail/educational clients, 21 detailed sales clients including distributors and corporate accounts, 19 commercial appointments (meetings, demos, follow-ups, deliveries), 16 extensive WhatsApp conversations with realistic business communications, and 20 comprehensive business activities covering sales processes, negotiations, inventory, partnerships, and performance metrics. All data reflects realistic B2B and B2C commercial operations.
- July 02, 2025. Implemented universal intelligent bot system for all 6 business categories with category-specific functionalities and automated responses. Added advanced IA features including triaging, automatic scheduling, personalized recommendations, and instant order processing.
- July 02, 2025. Applied modern design touches while preserving current color scheme: added glassmorphism effects, subtle animations, gradient backgrounds, hover transformations, and modern scrollbars.
- July 02, 2025. Created uniform icon system throughout the application using ModernIcon component with category-specific colors, backgrounds, and animations. Standardized all icons except sidebar which maintains white color scheme.
- July 02, 2025. Completely recreated the design system from scratch with modern UI components, consistent color palette based on brand colors (purple primary, green secondary), and standardized component classes. Implemented new tab navigation system that works properly across all sections (Atendimento: Mensagens/Cardápios/Automação, Estoque: Produtos/Vendas/Clientes/Relatórios, Agendamentos: Agenda/Lembretes/Integrações/Notificações). All sections now use unified styling with app-section containers, main-card components, tab-navigation, metric-cards, and proper responsive design. Fixed all navigation issues and ensured visual consistency throughout the entire application.
- July 02, 2025. Implemented comprehensive inventory management system with expiry tracking and stock control: added product valuation alerts, perishable product monitoring with countdown timers, visual status indicators (expired, near expiry, low stock, in stock), automatic restock alerts, and category-specific filtering. Enhanced product data structure to support expiry dates, minimum stock levels, and perishable flags with appropriate visual warnings and action buttons.
- July 02, 2025. Added customer loyalty and campaign management system to Atendimento section: implemented Fidelização tab with campaign creation tools, customer retention metrics, active campaign tracking, and promotional templates. System includes discount campaigns, seasonal promotions, customer reactivation tools, and comprehensive analytics for conversion rates and customer engagement across all business categories.
- July 02, 2025. Enhanced sharing capabilities for catalogs/menus: added direct link sharing and QR code generation for cardápios (food category) and catálogos (other categories), implemented modal system for sharing options, and added copy-to-clipboard functionality for easy distribution to customers.
- July 02, 2025. Added payment integration tab for food delivery categories: implemented PIX and credit card payment tracking, transaction history, payment method configuration, and automated payment processing display for alimentício category businesses.
- July 02, 2025. Expanded mock data coverage across all 6 business categories with comprehensive product inventories: Pet (ração, medicamentos, acessórios), Medical (analgésicos, antibióticos, equipamentos), Technology (componentes, monitores, armazenamento), Education (livros, material didático, papelaria), Beauty (cabelos, maquiagem, perfumaria), Food & Sales categories with realistic stock levels, pricing, expiry dates, and varied inventory status for comprehensive testing and demonstration.
- July 02, 2025. Massively expanded Dashboard and Graphics sections with comprehensive business intelligence: Added category-specific metrics (revenue, growth, satisfaction), dual metric grids with 8 key performance indicators, detailed appointment scheduling with 4 commitments per category, intelligent notification system with urgent/attention/new alerts, and enhanced data visualization. Graphics section now includes 8 dynamic metrics, 4 detailed charts (bar, pie, line, area), top 10 products ranking with category-specific items, and comprehensive sales analytics with real-time data per business category.
- July 03, 2025. Added Doctoralia integration for veterinary profiles: Extended Doctoralia platform integration to support both medical (saude) and veterinary (pet) categories in the scheduling integrations tab. Updated integration counter and descriptions to reflect category-specific platform usage (medical vs veterinary).
- July 03, 2025. Implemented comprehensive real-time integration system: Created shared integration types and activity logs system with real-time monitoring for email (SendGrid), WhatsApp Business, Telegram Bot, Google Calendar, Doctoralia, and payment systems. Enhanced scheduling integrations tab with detailed status monitoring, error tracking, and automated sync logging. Updated activity section with integration-specific logs, statistics, and filtering capabilities. All integrations now show real-time performance metrics, connection status, and historical activity logs across all business categories.
- July 03, 2025. Implemented advanced inventory management system with edit/delete functionality and category-specific behavior: Added full product editing modal with real-time updates, product deletion with confirmation, and product creation capabilities. Removed inventory functionality from design and sites categories (Design Gráfico/Criação de Sites) with informative portfolio management interface. Created automatic integration between inventory and catalogs for product-based categories (pet, medico, tecnologia, vendas) - products from stock automatically appear in Atendimento catalogs with stock levels and alerts. Maintained manual cardápio management for alimenticio category with add/edit/deactivate/delete options. Enhanced UI with stock status indicators, low stock warnings, and synchronized product information across sections.
- July 03, 2025. Implemented professional portfolio system for Design Gráfico and Criação de Sites categories: Replaced catalog functionality with dedicated portfolio section allowing manual addition of projects with images, links, descriptions and categorization. Added portfolio tab in Atendimento section with visual project gallery, sharing capabilities via link/QR code, and project management tools. Portfolio includes category-specific options (branding/impressos/digital for design, website/e-commerce/landing for sites), image preview with fallback, external link access, and comprehensive project information display. Maintained consistent sharing and management interface across all business categories.
- July 03, 2025. Completely removed Estoque section from sidebar menu for Design Gráfico and Criação de Sites categories: Implemented conditional menu filtering based on selected business category, ensuring creative service categories only display relevant sections (Dashboard, Gráficos, Atividade, Agendamentos, Atendimento). This provides a cleaner, category-appropriate interface for portfolio-based businesses without inventory management needs.
- July 03, 2025. Removed Lembretes tab from Agendamentos section: Streamlined scheduling interface by removing redundant lembretes functionality, maintaining only Agenda and Notificações tabs for cleaner user experience and simplified navigation.
- July 03, 2025. Enhanced appointment functionality and export system: Removed "+ Novo Compromisso" button from Dashboard section for cleaner interface. Implemented fully functional appointment creation modal in Agendamentos section with complete form fields (title, client, date, time, type, notes) and proper validation. Upgraded export system across all sections with professional CSV formatting including executive summaries, detailed headers, comprehensive data structure, and custom success modals with visual feedback. Export files now include timestamps, statistics, and formatted professional appearance suitable for business reporting.
- July 03, 2025. Implemented comprehensive inventory management system with complete product lifecycle control: Added full product registration with name, quantity, manufacturing date, and optional expiry date for perishables. Created intelligent stock control with manual adjustment capabilities (add/remove) and automatic deduction for sales. Implemented real-time sales processing with stock validation and automated inventory updates. Enhanced ingredient-based recipe system for food category with proportional deduction from stock when menu items are prepared. Added standardized action buttons (edit, stock control, sales processing, delete) with consistent design and functionality across all product management interfaces.
- July 07, 2025. Completed migration preparation for Bolt platform: Created comprehensive migration documentation (BOLT_MIGRATION.md), detailed setup configuration (bolt-setup.json), optimized package.json for Bolt compatibility, and step-by-step migration checklist. Prepared simplified Vite configuration for Bolt environment. Migration package includes complete dependency mapping, environment setup instructions, security considerations, and testing protocols for all 6 business categories. Ready for seamless transfer to Bolt platform.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```