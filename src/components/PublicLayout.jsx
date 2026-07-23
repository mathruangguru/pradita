import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import ruangguruLogo from "../assets/ruangguru-logo.png";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src={ruangguruLogo}
              alt="ruangguru"
              className="h-7 w-auto shrink-0"
            />
            <span className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              Bahan Ajar Pradita
            </span>
          </Link>
          <Link
            to="/admin/login"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 sm:px-3.5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
