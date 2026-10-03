import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * A Supabase client is only created when env vars are present. When absent
 * (e.g. first-run before the project is provisioned) the app falls back to
 * seed/sample data so the dashboard still renders.
 */
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null

export const hasSupabase = Boolean(supabase)

/** Base URL for invoking edge functions (scenarios / advice / daily-fetch). */
export const functionsBase = url ? `${url}/functions/v1` : null
