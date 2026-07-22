import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
  { value: "pertemuan", label: "Pertemuan" },
];

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const MateriList = () => {
  const [materi, setMateri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMataPelajaran, setActiveMataPelajaran] = useState(null);
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
      acc[item.mata_pelajaran] = acc[item.mata_pelajaran] ?? {
        mataPelajaran: item.mata_pelajaran,
        count: 0,
      };
      acc[item.mata_pelajaran].count += 1;
      return acc;
    }, {}),
  );

  const recent = [...materi]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 3);

  const filtered = materi
    .filter(
      (item) =>
        !activeMataPelajaran || item.mata_pelajaran === activeMataPelajaran,
    )
    .filter((item) => statusFilter === "all" || item.status === statusFilter)
    .sort((a, b) =>
      sortBy === "pertemuan"
        ? a.pertemuan - b.pertemuan
        : new Date(b.updated_at) - new Date(a.updated_at),
    );

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div>
      <Helmet>
        <title>Materi | Admin Bahan Ajar Pradita</title>
      </Helmet>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Materi
        </h1>
        <Link
          to="/admin/materi/new"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Materi
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
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

        {activeMataPelajaran && (
          <button
            onClick={() => setActiveMataPelajaran(null)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800"
          >
            {activeMataPelajaran}
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Mata Pelajaran
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {folders.map((folder, i) => (
          <button
            key={folder.mataPelajaran}
            onClick={() =>
              setActiveMataPelajaran(
                activeMataPelajaran === folder.mataPelajaran
                  ? null
                  : folder.mataPelajaran,
              )
            }
            className={`rounded-xl border bg-white p-4 text-left transition hover:shadow-sm ${
              activeMataPelajaran === folder.mataPelajaran
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
              {folder.mataPelajaran}
            </p>
            <p className="text-sm text-slate-400">{folder.count} Materi</p>
          </button>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Terbaru
      </h2>
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {recent.map((item) => (
          <Link
            key={item.id}
            to={`/admin/materi/${item.id}/edit`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">
                {item.topik}
              </p>
              <p className="text-xs text-slate-400">
                Pertemuan {item.pertemuan}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Semua Materi
      </h2>
      <div className="hidden rounded-xl border border-slate-200 bg-white sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Pertemuan</th>
              <th className="px-4 py-2.5 font-medium">Topik</th>
              <th className="px-4 py-2.5 font-medium">Mata Pelajaran</th>
              <th className="px-4 py-2.5 font-medium">Penggunaan</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={6}>
                  Tidak ada materi yang cocok.
                </td>
              </tr>
            )}
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-600">
                  {item.pertemuan}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-800">
                        {item.topik}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.subtopik}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {item.mata_pelajaran}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(item.penggunaan)}
                </td>
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/materi/${item.id}/edit`}
                      className="text-slate-400 hover:text-blue-900"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
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
      <div className="space-y-3 sm:hidden">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Tidak ada materi yang cocok.
          </p>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800">{item.topik}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.subtopik}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <p>Pertemuan {item.pertemuan}</p>
                  <p>{item.mata_pelajaran}</p>
                  <p className="col-span-2">
                    {formatDate(item.penggunaan) ?? "Tanpa tanggal"}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
                  <Link
                    to={`/admin/materi/${item.id}/edit`}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-900"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MateriList;
