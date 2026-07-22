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

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-[760px] text-left text-sm">
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
    </div>
  );
};

export default SoalList;
