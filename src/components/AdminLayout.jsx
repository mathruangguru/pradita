import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  BookOpen,
  Link2,
  HelpCircle,
  Users,
  LogOut,
  Search,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ruangguruLogo from "../assets/ruangguru-logo.png";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/materi", label: "Materi", icon: BookOpen },
  { to: "/admin/links", label: "Link Materi", icon: Link2 },
  { to: "/admin/soal", label: "Soal", icon: HelpCircle },
  { to: "/admin/siswa", label: "Pengguna", icon: Users },
];

const initials = (name = "") => {
  const source = name.includes(" ")
    ? name.split(" ").map((part) => part[0]).join("")
    : name;
  return source.slice(0, 2).toUpperCase();
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email || "";

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside
        className={`fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white shadow-lg md:static md:flex-col md:border-r md:border-t-0 md:shadow-none md:transition-all ${
          collapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <div
          className={`hidden items-center border-b border-slate-100 p-4 md:flex ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          {collapsed ? (
            <span className="text-xl font-bold text-[#28b6c2]">rg</span>
          ) : (
            <img src={ruangguruLogo} alt="ruangguru" className="h-8 w-auto" />
          )}
        </div>

        <div className="hidden items-center gap-2 p-4 md:flex">
          {!collapsed && (
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            title={collapsed ? "Perluas" : "Ciutkan"}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="grid flex-1 grid-cols-5 gap-1 px-2 py-2 md:flex md:flex-col md:px-3 md:py-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[11px] font-medium transition-colors md:flex-row md:gap-3 md:px-3 md:py-2.5 md:text-sm ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                } ${collapsed ? "md:justify-center" : "md:justify-start"}`
              }
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span
                className={`max-w-full truncate ${collapsed ? "md:hidden" : ""}`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-slate-200 p-3 md:block">
          <div
            className={`flex items-center gap-3 rounded-lg px-2 py-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-950">
              {initials(displayName)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-500">Admin</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Keluar"
              className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-28 pt-5 sm:px-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
