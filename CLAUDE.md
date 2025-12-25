# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Talk-To-My-Lawyer** is an AI-powered legal letter generation platform that provides professional legal document drafting services with mandatory attorney review. The platform follows a SaaS model with subscription-based pricing and includes employee referral functionality.

**Multi-Admin System**: The platform supports multiple admin users who share the same admin dashboard for reviewing and approving letters.

## Tech Stack

- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration
- **AI**: OpenAI GPT-4 Turbo via Vercel AI Gateway
- **Email**: Brevo (primary), with Resend, SendGrid, and SMTP providers available
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
   - Admin (letter reviewers) - **Multiple admins supported**
   - Employee (referral system)
   - Role-based routing and permissions
   - Admin access controlled by `role = 'admin'` in database

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

2. **Admin Access**
   - Test admin login with multiple admin accounts
   - Verify each admin can access `/secure-admin-gateway`
   - Test admin actions (approve, reject, review letters)

3. **Letter Generation**
   - Test each letter type with various inputs
   - Verify AI generation via Vercel AI Gateway
   - Test attorney review process
   - Verify PDF generation and download

3. **Payment Processing**
   - Test subscription creation with Stripe test cards
   - Verify subscription upgrades/downgrades
   - Test payment failure scenarios
   - Verify webhooks handling

4. **Email Services**
   - Test email delivery with configured provider (Brevo, Resend, SendGrid, or SMTP)
   - Verify email templates and formatting
   - Test fallback to console provider in development

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
- Vercel AI Gateway provides automatic retries and fallback handling

## Security Considerations

- All API routes require authentication
- Rate limiting is implemented using Upstash Redis
- CSRF protection is enabled
- Content Security Policy headers are configured
- Input validation uses Zod schemas
- Database uses Row Level Security (RLS)

## Admin User Management

### Creating Admin Users

The platform uses a **multi-admin system** where multiple users can share admin duties.

**To create an admin user:**
```bash
npx dotenv-cli -e .env.local -- npx tsx scripts/create-additional-admin.ts <email> <password>
```

**Example:**
```bash
npx dotenv-cli -e .env.local -- npx tsx scripts/create-additional-admin.ts admin@company.com SecurePass123!
```

### How Admin Authentication Works

1. **User Account**: Admins are regular Supabase Auth users with `role = 'admin'` in the profiles table
2. **Portal Key**: All admins share a common `ADMIN_PORTAL_KEY` for additional security
3. **Shared Dashboard**: All admins access the same dashboard at `/secure-admin-gateway`

### Admin Login Process

1. Navigate to `/secure-admin-gateway/login`
2. Enter email & password (individual Supabase Auth credentials)
3. Enter Admin Portal Key (from environment variables)
4. Access shared admin dashboard

### Database Schema for Admins

```sql
-- Admin users are identified by role in profiles table
SELECT id, email, role FROM profiles WHERE role = 'admin';

-- To promote a user to admin:
UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';
```