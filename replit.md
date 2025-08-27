# Overview

This is a full-stack e-commerce application for "PremiumMen" - an online store selling premium vanilla products and luxury underwear. The application is built with a modern React frontend and Express.js backend, designed to provide a smooth shopping experience with cart functionality, Stripe payment processing, and order management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **State Management**: React Context API for cart state management, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for JSON parsing and request logging
- **Storage Layer**: Abstract storage interface with in-memory implementation (MemStorage class)
- **API Structure**: RESTful endpoints for order creation and retrieval
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

## Data Layer
- **Database Schema**: Drizzle ORM with PostgreSQL dialect
- **Tables**: Users (authentication) and Orders (e-commerce transactions)
- **Type Safety**: Zod schemas for runtime validation and TypeScript type inference
- **Migration Support**: Drizzle Kit for database schema management

## Authentication & Authorization
- Currently using a basic user schema with username/password fields
- Session management infrastructure in place with connect-pg-simple for PostgreSQL session storage
- Authentication middleware ready for implementation

## External Dependencies
- **Stripe Integration**: Complete payment processing setup with React Stripe.js components
- **Database**: Neon serverless PostgreSQL for production data storage
- **Development Tools**: Replit-specific plugins for development environment integration
- **UI Libraries**: Comprehensive Radix UI component collection for accessible interface elements
- **Form Handling**: React Hook Form with Zod resolvers for type-safe form validation

## Key Design Decisions
- **Monorepo Structure**: Shared schema between client and server for type consistency
- **Component Architecture**: Reusable UI components with consistent design system
- **Cart Management**: Client-side cart state with context provider for real-time updates
- **Payment Flow**: Stripe integration with proper error handling and success states
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Type Safety**: End-to-end TypeScript with shared types and runtime validation