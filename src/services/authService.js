import { userService } from "./userService";

const SESSION_KEY = "pradita_session";

export const authService = {
  login: async (email, password) => {
    const users = await userService.list();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      throw new Error("Email atau password salah.");
    }
    if (user.role !== "admin") {
      throw new Error("Akun ini tidak memiliki akses admin.");
    }
    if (user.status !== "active") {
      throw new Error("Akun ini tidak aktif.");
    }
    const session = { Id: user.Id, nama: user.nama, email: user.email, role: user.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession: () => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  },
};
