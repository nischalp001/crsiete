// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkffnvsgfijoimqytblf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmZudnNnZmlqb2ltcXl0YmxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTc1MDksImV4cCI6MjA2NTg3MzUwOX0.VqM7taCWzkLojMo_xBj5sKPZjuXTkHPeN7bDub94nrQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
