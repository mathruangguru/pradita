import { useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getSession());

  const login = async (email, password) => {
    const session = await authService.login(email, password);
    setUser(session);
    return session;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
