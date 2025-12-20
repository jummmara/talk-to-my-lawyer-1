# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Talk-To-My-Lawyer** is an AI-powered legal letter generation platform that provides professional legal document drafting services with mandatory attorney review. The platform follows a SaaS model with subscription-based pricing and includes employee referral functionality.

## Tech Stack

- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration
- **AI**: OpenAI GPT-4 Turbo with Google Generative AI as fallback
- **Email**: SendGrid with nodemailer fallback
- **Rate Limiting**: Upstash Redis
- **Package Manager**: pnpm

## Common Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Database migrations
pnpm db:migrate

# Validate environment variables
pnpm validate-env

# Health check
pnpm health-check
```

## Architecture Overview

### Project Structure

- **`/app/`** - Main application directory (Next.js App Router)
  - `api/` - API routes organized by feature
  - `auth/` - Authentication pages (login, signup, password reset)
  - `dashboard/` - User dashboard and management interfaces
  - `secure-admin-gateway/` - Admin portal with restricted access
- **`/components/`** - Reusable React components (using shadcn/ui)
- **`/lib/`** - Utility libraries and server-side configurations
  - `ai/` - AI service integrations
  - `auth/` - Authentication utilities
  - `email/` - Email service providers
  - `security/` - Security and validation utilities
- **`/scripts/`** - Database migration scripts (SQL)
- **`/supabase/`** - Supabase-specific migrations
- **`/styles/`** - Global styles and Tailwind configuration

### Key Features

1. **User Authentication & Roles**
   - Subscriber (regular users)
   - Admin (letter reviewers)
   - Employee (referral system)
   - Role-based routing and permissions

2. **Letter Generation Workflow**
   - User selects letter type (Demand, Cease & Desist, etc.)
   - AI generates draft using OpenAI
   - Attorney review process
   - PDF generation and delivery
   - Email notifications

3. **Subscription System**
   - Tiered pricing (Single letter, Monthly, Yearly)
   - Letter allowance tracking
   - Stripe payment integration
   - Automatic subscription management

4. **Employee Referral System**
   - Commission tracking
   - Payout requests
   - Coupon generation
   - Performance analytics

### API Routes Organization

- `/api/letters/` - CRUD operations for letters
- `/api/auth/` - Authentication endpoints
- `/api/subscriptions/` - Subscription management
- `/api/admin/` - Admin-only endpoints
- `/api/employee/` - Employee functionality
- `/api/cron/` - Scheduled tasks (email processing)

## Manual Testing Guidelines

Since this project uses manual testing, follow these guidelines:

### Testing Workflows

1. **Authentication Flow**
   - Test user registration and login
   - Verify password reset functionality
   - Test role-based access control
   - Validate session management

2. **Letter Generation**
   - Test each letter type with various inputs
   - Verify AI generation and fallback to Google AI if needed
   - Test attorney review process
   - Verify PDF generation and download

3. **Payment Processing**
   - Test subscription creation with Stripe test cards
   - Verify subscription upgrades/downgrades
   - Test payment failure scenarios
   - Verify webhooks handling

4. **Email Services**
   - Test SendGrid email delivery
   - Verify nodemailer fallback
   - Test email templates and formatting

### Test Data Management

- Use test email addresses: `test+{type}@example.com`
- Stripe test cards available at: https://stripe.com/docs/testing
- Use Supabase local development for isolated testing

### Key Test Scenarios

1. **Edge Cases**
   - Network failures during AI generation
   - Payment processing interruptions
   - Email service outages
   - Database constraint violations

2. **Security Testing**
   - Input validation and sanitization
   - Rate limiting effectiveness
   - Authentication bypass attempts
   - SQL injection prevention

## Important Notes

- All database migrations must be run in sequence
- Environment variables must be validated before starting the app
- Stripe webhooks require proper endpoint configuration
- AI services have rate limits - implement proper retry logic
- Always test with both OpenAI and Google AI fallback

## Security Considerations

- All API routes require authentication
- Rate limiting is implemented using Upstash Redis
- CSRF protection is enabled
- Content Security Policy headers are configured
- Input validation uses Zod schemas
- Database uses Row Level Security (RLS)