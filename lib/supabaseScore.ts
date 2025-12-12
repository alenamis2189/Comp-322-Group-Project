import { createClient } from '@supabase/supabase-js';

/* database credentials and storage to link to project -fg */
const SUPABASE_URL = 'https://hxzxqbmkgdcknkunhnon.supabase.co';
const SUPABASE_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4enhxYm1rZ2Rja25rdW5obm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NjEwNDksImV4cCI6MjA4MTAzNzA0OX0.iADNGf47dCj6pgqZxuPpeqMFF_NWYaBwQD4R9a1RCEU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
