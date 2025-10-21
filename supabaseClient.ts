import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://esghazhqzdfpevbbzute.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZ2hhemhxemRmcGV2YmJ6dXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5Nzc2MjksImV4cCI6MjA3NjU1MzYyOX0.2w_W-6r2SWoZMXgjV14JuAWSvPANYktMuH6V_vwUcLc';

export const supabase = createClient(supabaseUrl, supabaseKey);