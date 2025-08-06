# Database Management System

## Overview

This is a full-stack database management application built with React, Express, and TypeScript. Originally designed as a unified system, it now supports a modular architecture that can be divided into separate category-specific applications. Each category (Farmácia, Alimentício, Pet, Médico, Vendas, Design, Sites) can operate as an independent system with its own database, providing specialized interfaces and functionality while maintaining the core business management capabilities.

## Category-Based Architecture

The system now supports division into independent applications by business category:

### Available Categories:
- **💊 Farmácia**: Medication management, prescriptions, expiry control
- **🍽️ Alimentício**: Menu management, orders, delivery, ingredients
- **🐕 Pet & Veterinário**: Pet records, appointments, medical history
- **⚕️ Médico & Saúde**: Patient records, consultations, prescriptions
- **💼 Vendas**: Sales management, commissions, targets
- **🎨 Design Gráfico**: Portfolio, projects, client management
- **🌐 Criação de Sites**: Web projects, domains, hosting

### Category System Features:
- **Independent Databases**: Each category has its own PostgreSQL database
- **Specialized Interfaces**: Custom UI/UX for each business type
- **Isolated Authentication**: Separate login systems per category
- **Custom Schemas**: Database models optimized for each category
- **Independent Deployment**: Each system can be deployed separately

## User Preferences

Preferred communication style: Simple, everyday language.
Never modify components or features that weren't explicitly requested.
Product registration should include: name, minimum stock, current stock, for sale checkbox (with price field), perishable checkbox (with manufacturing and expiry date fields).

**Security Note**: Never mention that demo data comes from Supabase database for security reasons. Demo data should be presented as sample/test data without revealing the backend source.

**Category Systems**: The user has requested the ability to split the main system into separate category-based applications, each with independent database access while maintaining core functionality. This allows for specialized business management systems optimized for specific industries.

**Demo Data Implementation (Aug 2025)**: Created comprehensive demo data for all 7 business categories with proper data segregation:
- Each demo profile has realistic products, sales, financial entries, clients, and appointments
- All data properly filtered by company_id ensuring complete separation between businesses
- Status variations implemented (available, low stock, out of stock, expired, near expiry)
- Realistic business scenarios for each category (pharmacy medications, pet supplies, medical equipment, etc.)

**Cloudflare Workers Migration (Aug 2025)**: Completed full migration setup for production deployment:
- Created comprehensive Worker structure with all API routes (auth, products, clients, sales, financial, categories)
- Configured wrangler.toml for fullstack React + Node.js deployment
- Integrated Supabase authentication and database access
- Prepared static assets serving and single-page app routing
- Ready for custom domain deployment with global edge distribution

## Database Error Handling & Security

Common database errors encountered and solutions implemented:
- **client_type constraint**: Only accepts 'individual' or 'company' (default: 'individual')
- **Foreign key violations**: Always validate product_id, client_id, and user IDs exist before insertion
- **Required fields**: appointments need 'type' field, financial entries need proper status values
- **Data validation**: Implemented comprehensive validation schemas to prevent constraint violations
- **Error recovery**: Created robust error handling with detailed error messages and validation hints
- **Schema Consistency (Aug 2025)**: Fixed critical inconsistency between database (snake_case) and TypeScript (camelCase), ensuring all interfaces use snake_case matching database field names
- **Multi-tenant Data Isolation**: Eliminated data mixing between companies by removing fallback to company_id=1, ensuring strict data separation by actual user company_id

**Data Security Fix (Aug 2025)**: Resolved critical data leakage issue where users could see data from multiple companies:
- Fixed all API endpoints to strictly enforce company_id filtering based on authenticated user
- Added mandatory company_id validation preventing data access without proper company association
- Implemented user lookup fallback to ensure company_id is always derived from authenticated session
- All dashboard metrics now show accurate company-specific data (R$ 191.936,15 in sales, R$ 26.781,00 in revenue for demo company)

**Conditional UI Implementation (Aug 2025)**: Implemented intelligent interface adaptation based on business structure:
- **Transfer tabs**: Only appear in Estoque and Financeiro when company has multiple branches (>1)
- **Tab navigation**: Completely hidden in Estoque when no branches exist (single-page view)
- **Smart fallback**: Auto-redirects to main tabs if user tries accessing transfer tabs without branches
- **Consistent logic**: Applied across both Inventory and Financial sections for uniform experience

**Demo System Removal (Aug 2025)**: Removed demonstration functionality for production version:
- **Demo button**: Removed from login interface
- **Demo modal**: Completely removed demo profile selection interface
- **Demo profiles**: Removed all demo profile definitions and related code
- **Demo login**: Removed automatic demo login functionality
- **Clean interface**: Login now focuses only on production user authentication

**UUID Authentication System Implementation (Aug 2025)**: Developed comprehensive UUID-based authentication as requested by user:
- Created new auth_users, auth_companies, and auth_branches tables with UUID primary keys
- Implemented JWT-based authentication with bcrypt password hashing
- Built complete authentication middleware and storage layer for UUID system
- Migrated ALL existing users from integer IDs to UUID system (10 users migrated)
- Integrated UUID authentication with existing login system (UUID first, integer fallback)
- UUID system now active for all logins with better security than integer IDs
- All demo users migrated: master@sistema.com, junior@mercadocentral.com.br, demo.farmacia@sistema.com, etc.

**Row Level Security (RLS) Implementation:**
- RLS enabled on all tables (users, companies, products, sales, clients, appointments, financial_entries)
- Unified policies for optimal performance (one policy per table instead of multiple)
- Company-based data isolation using auth.email() and user lookup
- Service role bypass for development operations
- Performance optimized with proper indexing on foreign keys
- Automatic data filtering ensures users only see their company's data

**RLS Performance Optimization (Aug 2025)**: Eliminated multiple permissive policies warnings:
- **Consolidated policies**: Removed all duplicate `temp_allow_all` policies causing performance warnings
- **Unified approach**: Each table now has exactly one optimized policy covering all operations (SELECT, INSERT, UPDATE, DELETE)
- **Type-aware functions**: Created both `get_user_company_uuid()` and `get_user_company_optimized()` for proper UUID/integer mapping
- **Zero warnings**: Database now runs without "multiple permissive policies" performance alerts
- **Maintained security**: All company-based data isolation preserved while improving query performance

**Database Index Optimization (Aug 2025)**: Added comprehensive foreign key indexes for optimal query performance:
- **23+ indexes created**: Covered all foreign key relationships across main tables (branches, clients, products, sales, users, financial_entries, loyalty system)
- **Query performance**: Eliminated "unindexed foreign keys" warnings from Supabase database linter
- **Multi-field coverage**: Indexed company_id, branch_id, created_by, client_id, and loyalty system relationships
- **B-tree indexes**: All indexes use optimized B-tree structure for fast lookup and JOIN operations
- **Duplicates removed**: Eliminated duplicate indexes to prevent redundant maintenance overhead
- **Production ready**: Database now has comprehensive indexing strategy for high-performance operations

**RLS Policy Advanced Optimization (Aug 2025)**: Resolved auth re-evaluation performance warnings:
- **IMMUTABLE functions**: Created `is_authorized_for_company()` and `current_user_is_service_role()` with IMMUTABLE attribute
- **Zero reavaliations**: Completely eliminated `current_setting('role')` and repetitive `auth.email()` calls per query row
- **Performance boost**: Resolved "Auth RLS Initialization Plan" warnings across all 7 main tables  
- **Service role optimized**: Dedicated function for service role access without performance penalties
- **Maintained security**: Company-based data isolation preserved with dramatically improved query performance at scale

**Database Index Cleanup (Aug 2025)**: Removed unused indexes for optimal database performance:
- **20+ unused indexes removed**: Eliminated all indexes flagged as unused by Supabase database linter
- **Write performance improved**: Reduced overhead during INSERT/UPDATE operations by removing unnecessary index maintenance
- **Storage optimized**: Freed database storage space previously occupied by unused indexes
- **Essential indexes preserved**: Kept only actively used indexes that improve query performance
- **Zero unused index warnings**: Database now maintains only beneficial indexes for production efficiency

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
- **Storage Layer**: Database integration with comprehensive data management and secure multi-tenant architecture.
- **Business Logic**: Multi-tenant support with company-based data filtering; real-time performance monitoring; advanced data filtering; dashboard analytics; complete scheduling system with reminders and platform integrations (Google Calendar, Doctoralia, Outlook); email and Telegram reminders; simple CRM; comprehensive inventory management with stock control, low stock alerts, and expiration tracking; sales tracking with reports; real-time notifications for stock/sales/client activity; WhatsApp integration with menu access; AI assistant for automatic responses and order processing; automated orders with secure payments (PIX/Card); customer loyalty campaigns; human support escalation; and a complete enterprise hierarchy system (backend only).
- **UI Components**: Charts and metrics displays using Recharts; Lucide-React for icons.
- **Financial System**: Automatic financial entries for sales (income), expense tracking, and pending/overdue status.
- **Product Management**: Full product registration, intelligent stock control, ingredient-based recipe system for food category, and comprehensive dish management with ingredient selection and automatic stock deduction.
- **Portfolio System**: For creative categories (Design, Sites), manual project addition with images, links, descriptions, and categorization.
- **Access Control**: Master user system with permissions management (ControleSection) to configure regular user access to sections.
- **Flexible Printing System**: Dual-mode printing support for both thermal (80mm) and conventional (A4) printers with optimized layouts for each format, automatic printer detection, and user-selectable printing options.

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