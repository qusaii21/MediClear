import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kzovbnxjiifsogvzimgv.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6b3ZibnhqaWlmc29ndnppbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3ODYzODAsImV4cCI6MjA1OTM2MjM4MH0.UCFx5noiijrYSr7w98YgaDB054b6njdFYqzbF8vEE8A"; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);