import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://opbpdrudzhaljokrqtge.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYnBkcnVkemhhbGpva3JxdGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTI4NzEsImV4cCI6MjA1ODA2ODg3MX0.Mw12YrBv-NCwDRTdE9qvmr98ZG-1XV-rlIsssF9wXBM";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
