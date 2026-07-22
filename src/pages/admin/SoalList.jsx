import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { soalService } from "../../services/soalService";

const LEVEL_TONES = {
  LOTS: "bg-green-100 text-green-700",
  MOTS: "bg-amber-100 text-amber-700",
  HOTS: "bg-rose-100 text-rose-700",
};

const SoalList = () => {
  const [soal, setSoal] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    soalService.list().then((rows) =>
      setSoal(
        rows.sort(
          (a, b) => a.materi_id - b.materi_id || a.nomor - b.nomor,
        ),
      ),
    );

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus soal ini?")) return;
    await soalService.remove(id);
    refresh();
  };

  return (
    <div>
      <Helmet>
        <title>Soal | Admin Bahan Ajar Pradita</title>
      </Helmet>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Soal</h1>
        <Link
          to="/admin/soal/new"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Soal
        </Link>
      </div>

      <div className="mt-5 hidden rounded-xl border border-slate-200 bg-white sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Kode Bahan Ajar</th>
              <th className="px-4 py-2.5 font-medium">No.</th>
              <th className="px-4 py-2.5 font-medium">Subtopik</th>
              <th className="px-4 py-2.5 font-medium">Level</th>
              <th className="px-4 py-2.5 font-medium">Jawaban</th>
              <th className="px-4 py-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={6}>
                  Memuat...
                </td>
              </tr>
            )}
            {!loading && soal.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={6}>
                  Belum ada soal.
                </td>
              </tr>
            )}
            {soal.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {item.materi?.kode_bahan_ajar ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">{item.nomor}</td>
                <td className="px-4 py-3 text-slate-600">
                  {item.subtopik ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_TONES[item.level_kognitif] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {item.level_kognitif ?? "-"}
                  </span>
                </td>
                <td className="px-4 py-3 uppercase text-slate-600">
                  {item.jawaban_benar}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/soal/${item.id}/edit`}
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
        {!loading && soal.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Belum ada soal.
          </p>
        )}
        {soal.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-slate-800">
                  {item.materi?.kode_bahan_ajar ?? "-"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Soal No. {item.nomor}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.subtopik ?? "-"}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_TONES[item.level_kognitif] ?? "bg-slate-100 text-slate-600"}`}
              >
                {item.level_kognitif ?? "-"}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Jawaban:{" "}
              <span className="font-semibold uppercase text-slate-700">
                {item.jawaban_benar}
              </span>
            </p>
            <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
              <Link
                to={`/admin/soal/${item.id}/edit`}
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
        ))}
      </div>
    </div>
  );
};

export default SoalList;
