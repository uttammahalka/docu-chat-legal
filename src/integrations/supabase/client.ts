// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://owbdnfawwxgzytpiginf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93YmRuZmF3d3hnenl0cGlnaW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzA5NjIsImV4cCI6MjA2OTM0Njk2Mn0.s5ocIv3U-QnZ5YIVXgbyWsU1WlnX5rRW1aJmhb-YE0g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});