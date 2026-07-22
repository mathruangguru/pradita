import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Folder,
  FileText,
  Plus,
  Filter,
  ArrowUpDown,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { materiService } from "../../services/materiService";

const FOLDER_TONES = [
  "bg-blue-50 text-blue-900",
  "bg-amber-50 text-amber-700",
  "bg-slate-200 text-slate-700",
];

const statusOptions = [
  { value: "all", label: "Semua Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const sortOptions = [
  { value: "latest", label: "Terbaru" },
  { value: "judul", label: "Judul (A-Z)" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const MateriList = () => {
  const [materi, setMateri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKategori, setActiveKategori] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const refresh = () =>
    materiService.list().then((rows) => setMateri(rows));

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus materi ini?")) return;
    await materiService.remove(id);
    refresh();
  };

  const folders = Object.values(
    materi.reduce((acc, item) => {
      acc[item.kategori] = acc[item.kategori] ?? {
        kategori: item.kategori,
        count: 0,
      };
      acc[item.kategori].count += 1;
      return acc;
    }, {}),
  );

  const recent = [...materi]
    .sort((a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt))
    .slice(0, 3);

  const filtered = materi
    .filter((item) => !activeKategori || item.kategori === activeKategori)
    .filter((item) => statusFilter === "all" || item.status === statusFilter)
    .sort((a, b) =>
      sortBy === "judul"
        ? a.judul.localeCompare(b.judul)
        : new Date(b.UpdatedAt) - new Date(a.UpdatedAt),
    );

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Materi</h1>
        <Link
          to="/admin/materi/new"
          className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950"
        >
          <Plus className="h-4 w-4" />
          Tambah Materi
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => {
              setFilterOpen((v) => !v);
              setSortOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            {statusOptions.find((o) => o.value === statusFilter)?.label}
          </button>
          {filterOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-md">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setFilterOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-slate-50 ${
                    statusFilter === opt.value
                      ? "font-medium text-blue-900"
                      : "text-slate-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setSortOpen((v) => !v);
              setFilterOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ArrowUpDown className="h-4 w-4" />
            Urutkan: {sortOptions.find((o) => o.value === sortBy)?.label}
          </button>
          {sortOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-md">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setSortOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-slate-50 ${
                    sortBy === opt.value
                      ? "font-medium text-blue-900"
                      : "text-slate-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeKategori && (
          <button
            onClick={() => setActiveKategori(null)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800"
          >
            {activeKategori}
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Kategori
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {folders.map((folder, i) => (
          <button
            key={folder.kategori}
            onClick={() =>
              setActiveKategori(
                activeKategori === folder.kategori ? null : folder.kategori,
              )
            }
            className={`rounded-xl border bg-white p-4 text-left transition hover:shadow-sm ${
              activeKategori === folder.kategori
                ? "border-amber-400 ring-1 ring-amber-400"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${FOLDER_TONES[i % FOLDER_TONES.length]}`}
            >
              <Folder className="h-5 w-5" />
            </div>
            <p className="mt-3 font-medium text-slate-800">
              {folder.kategori}
            </p>
            <p className="text-sm text-slate-400">{folder.count} Materi</p>
          </button>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Terbaru
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {recent.map((item) => (
          <Link
            key={item.Id}
            to={`/admin/materi/${item.Id}/edit`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">
                {item.judul}
              </p>
              <p className="text-xs text-slate-400">
                {formatDate(item.UpdatedAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Semua Materi
      </h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Judul</th>
              <th className="px-4 py-2.5 font-medium">Kategori</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Diperbarui</th>
              <th className="px-4 py-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  Tidak ada materi yang cocok.
                </td>
              </tr>
            )}
            {filtered.map((item) => (
              <tr
                key={item.Id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="font-medium text-slate-800">
                      {item.judul}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{item.kategori}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(item.UpdatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/materi/${item.Id}/edit`}
                      className="text-slate-400 hover:text-blue-900"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.Id)}
                      className="text-slate-400 hover:text-red-600"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MateriList;
