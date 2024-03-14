import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://keodgmfziankdgtebpao.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlb2RnbWZ6aWFua2RndGVicGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzU5MTMsImV4cCI6MjAyNTkxMTkxM30.qXD1M9L0iq7GSrcpjjjJMszFdNNZIMIe4AhczINSqX0";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
