import { supabase } from "../lib/supabaseClient";

export const authService = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error("Email atau password salah.");
    return data.session;
  },

  logout: async () => {
    await supabase.auth.signOut();
  },
};
