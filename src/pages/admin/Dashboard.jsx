import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, FileEdit, Users, FileText } from "lucide-react";
import { materiService } from "../../services/materiService";
import { userService } from "../../services/userService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([materiService.list(), userService.list()]).then(
      ([materi, users]) => {
        setStats({
          totalMateri: materi.length,
          published: materi.filter((m) => m.status === "published").length,
          draft: materi.filter((m) => m.status === "draft").length,
          totalUsers: users.length,
        });
        setRecent(
          [...materi]
            .sort((a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt))
            .slice(0, 4),
        );
      },
    );
  }, []);

  if (!stats) return <p className="text-slate-500">Memuat...</p>;

  const cards = [
    { label: "Total Materi", value: stats.totalMateri, icon: BookOpen, tone: "bg-blue-50 text-blue-900" },
    { label: "Published", value: stats.published, icon: CheckCircle2, tone: "bg-green-50 text-green-600" },
    { label: "Draft", value: stats.draft, icon: FileEdit, tone: "bg-amber-50 text-amber-600" },
    { label: "Total Pengguna", value: stats.totalUsers, icon: Users, tone: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ringkasan bahan ajar dan pengguna.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.tone}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Materi Terbaru
        </h2>
        <Link
          to="/admin/materi"
          className="text-sm font-medium text-blue-900 hover:underline"
        >
          Lihat semua
        </Link>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recent.map((item) => (
          <Link
            key={item.Id}
            to={`/admin/materi/${item.Id}/edit`}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FileText className="h-4 w-4" />
            </div>
            <p className="mt-3 truncate text-sm font-medium text-slate-800">
              {item.judul}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {new Date(item.UpdatedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
