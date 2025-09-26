import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vnranoaxjljrrxbznsam.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucmFub2F4amxqcnJ4Ynpuc2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTYwNTAsImV4cCI6MjA3NDQ3MjA1MH0.dEqYWKursKm_msnl_AZV70LcI0UHMlL-v5lXWLDCS00";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
