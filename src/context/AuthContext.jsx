import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { authService } from "../services/authService";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const newSession = await authService.login(email, password);
    setSession(newSession);
    return newSession;
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
