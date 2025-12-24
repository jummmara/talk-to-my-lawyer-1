/**
 * Reusable authentication utility to reduce code duplication across API routes
 */
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

export interface AuthenticationResult {
  authenticated: boolean
  user: User | null
  errorResponse: NextResponse | null
}

/**
 * Authenticate user and return result
 * Replaces duplicated pattern: const { data: { user }, error: authError } = await supabase.auth.getUser()
 * 
 * @returns AuthenticationResult with user info or error response
 */
export async function authenticateUser(): Promise<AuthenticationResult> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return {
      authenticated: false,
      user: null,
      errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  return {
    authenticated: true,
    user,
    errorResponse: null
  }
}

/**
 * Authenticate user or throw error response
 * Convenience function for routes that need to return early on auth failure
 * 
 * @throws NextResponse with 401 status if authentication fails
 * @returns Authenticated user
 */
export async function requireAuthentication(): Promise<User> {
  const result = await authenticateUser()
  
  if (!result.authenticated || !result.user) {
    throw result.errorResponse
  }
  
  return result.user
}
