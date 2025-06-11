import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oovvqckbjobhnynjeiew.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vdnZxY2tiam9iaG55bmplaWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTAyMDQsImV4cCI6MjA2NDIyNjIwNH0.r99vENMvxb5ozK-YxAVFzew-KwifRzeeLi_Gzklm3aQ";

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
