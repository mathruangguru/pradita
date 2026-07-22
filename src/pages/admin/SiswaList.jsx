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

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-[640px] text-left text-sm">
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
    </div>
  );
};

export default SiswaList;
