// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkffnvsgfijoimqytblf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmZudnNnZmlqb2ltcXl0YmxmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI5NzUwOSwiZXhwIjoyMDY1ODczNTA5fQ.m2R4PtTDyaeA6rMRmcwWY3yCH-MKS6QriL2NROLHSmU';

export const supabase = createClient(supabaseUrl, supabaseKey);

//Access key ID: 25adf8215579e0e568ebf53116cec20d
//Secret access key: 32a362c631a1792105fa71980a0fb1e8cc3147628e2d8ee5cc81e1c9d26c43e2