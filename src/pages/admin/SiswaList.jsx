import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { siswaService } from "../../services/siswaService";

const AVATAR_TONES = [
  "bg-blue-100 text-blue-900",
  "bg-amber-100 text-amber-800",
  "bg-slate-200 text-slate-700",
];

const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const SiswaList = () => {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    siswaService.list().then((rows) => setSiswa(rows.sort((a, b) => a.id - b.id)));

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus siswa ini?")) return;
    await siswaService.remove(id);
    refresh();
  };

  return (
    <div>
      <Helmet>
        <title>Pengguna | Admin Bahan Ajar Pradita</title>
      </Helmet>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Pengguna
        </h1>
        <Link
          to="/admin/siswa/new"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Siswa
        </Link>
      </div>

      <div className="mt-5 hidden rounded-xl border border-slate-200 bg-white sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Nama</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={4}>
                  Memuat...
                </td>
              </tr>
            )}
            {!loading && siswa.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={4}>
                  Belum ada siswa.
                </td>
              </tr>
            )}
            {siswa.map((item, i) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
                    >
                      {initials(item.nama)}
                    </div>
                    <span className="font-medium text-slate-800">
                      {item.nama}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{item.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/siswa/${item.id}/edit`}
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
      <div className="mt-5 space-y-3 sm:hidden">
        {loading && (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Memuat...
          </p>
        )}
        {!loading && siswa.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Belum ada siswa.
          </p>
        )}
        {siswa.map((item, i) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
              >
                {initials(item.nama)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800">{item.nama}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {item.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
                  <Link
                    to={`/admin/siswa/${item.id}/edit`}
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

export default SiswaList;
