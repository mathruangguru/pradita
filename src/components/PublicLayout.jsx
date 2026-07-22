import { Link, Outlet } from "react-router-dom";
import { GraduationCap, LayoutDashboard } from "lucide-react";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-semibold text-slate-900">
              Bahan Ajar Pradita
            </span>
          </Link>
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
