# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI App Catalog is a full-stack TypeScript application for cataloging and managing AI applications within a company. The platform consists of a Next.js frontend and Node.js/Express backend with PostgreSQL database.

## Architecture

- **Frontend**: Next.js 14 with React 18, TypeScript, Tailwind CSS, Zustand state management
- **Backend**: Node.js/Express with TypeScript, PostgreSQL, Redis caching, JWT authentication
- **Infrastructure**: Docker Compose development environment

## Common Commands

### Development

```bash
# Start entire development environment
npm run dev

# Start individual services
npm run dev:frontend    # Next.js on port 3000
npm run dev:backend     # Express on port 3001

# Docker environment
npm run docker:up       # Start all services (PostgreSQL, Redis, apps)
npm run docker:down     # Stop all services
```

### Testing

```bash
npm run test           # All tests
npm run test:e2e       # Playwright end-to-end tests

# Service-specific tests
cd frontend && npm run test    # Frontend Jest tests
cd backend && npm run test     # Backend Jest tests
```

### Code Quality

```bash
npm run lint           # Lint all code
npm run lint:fix       # Fix linting issues
npm run format         # Prettier formatting
```

### Database

```bash
npm run migrate        # Run database migrations
npm run seed          # Seed with initial data
```

### Production

```bash
npm run build         # Build both applications
npm run start         # Start production servers
```

## Key Architecture Patterns

### Frontend Structure

- **Pages**: Next.js app router in `frontend/src/app/`
- **Components**: Reusable UI components in `frontend/src/components/`
- **State Management**: Zustand stores for global state
- **API Layer**: SWR for data fetching, centralized in `frontend/src/lib/api/`
- **Types**: Shared TypeScript interfaces in `frontend/src/types/`

### Backend Structure

- **Controllers**: Route handlers in `backend/src/controllers/`
- **Services**: Business logic in `backend/src/services/`
- **Models**: Database models in `backend/src/models/`
- **Middleware**: Authentication, validation, error handling in `backend/src/middleware/`
- **Database**: Migrations in `database/migrations/`, seeds in `database/seeds/`

### Database Schema

Core entities with relationships:

- **Users**: Authentication with roles (user/admin/super_admin)
- **Apps**: AI applications with categories, reviews, usage tracking
- **Categories/Tags**: Hierarchical organization system
- **Reviews**: User feedback and ratings
- **Favorites**: User bookmarking system

### Authentication Flow

JWT-based authentication with role-based access control. Protected routes in both frontend and backend check user permissions.

### API Design

RESTful API with:

- Consistent error handling and status codes
- Request validation with Joi schemas
- Swagger documentation at `/api/docs`
- Rate limiting and security middleware

## Development Notes

### Environment Setup

Requires Node.js 18+, PostgreSQL 14+, and Redis. Use Docker Compose for local development to avoid manual setup.

### Testing Strategy

- **Unit Tests**: Jest for both frontend and backend
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright for user workflows
- **Coverage**: Configured for both services

### Code Standards

- TypeScript strict mode enabled
- ESLint with comprehensive rules
- Prettier for consistent formatting
- Husky git hooks with lint-staged for pre-commit checks

### Database Development

- Use migrations for schema changes (`npm run migrate`)
- Seed data available for development (`npm run seed`)
- Database reset: `npm run docker:down && npm run docker:up`
