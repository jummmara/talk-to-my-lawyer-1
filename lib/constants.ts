export const DEFAULT_LOGO_SRC = 'https://mxhccjykkxbdvchmpqej.supabase.co/storage/v1/object/sign/hh/TALK%20LOGO.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMWRkYjc5OS02OTBjLTQzZGYtOWRmZi01ZGFkZjQ4ODk5YjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJoaC9UQUxLIExPR08ud2VicCIsImlhdCI6MTc2NDg1NDY2OCwiZXhwIjoxNzk2MzkwNjY4fQ.QS5KZxipeL6TCtNE_LlMW6dqdSQf81BHRuFdd-onBOQ'
export const DEFAULT_LOGO_ALT = 'Talk-To-My-Lawyer logo'

/**
 * Letter type definitions used across the application
 */
export const LETTER_TYPES = [
  { value: 'demand_letter', label: 'Demand Letter', price: 299 },
  { value: 'cease_desist', label: 'Cease & Desist', price: 299 },
  { value: 'contract_breach', label: 'Contract Breach Notice', price: 299 },
  { value: 'eviction_notice', label: 'Eviction Notice', price: 299 },
  { value: 'employment_dispute', label: 'Employment Dispute', price: 299 },
  { value: 'consumer_complaint', label: 'Consumer Complaint', price: 299 },
] as const

/**
 * Subscription plan configurations
 */
export const SUBSCRIPTION_PLANS = [
  { letters: 1, price: 299, planType: 'one_time', popular: false, name: 'Single Letter' },
  { letters: 4, price: 299, planType: 'standard_4_month', popular: true, name: 'Monthly Plan' },
  { letters: 8, price: 599, planType: 'premium_8_month', popular: false, name: 'Yearly Plan' },
] as const
