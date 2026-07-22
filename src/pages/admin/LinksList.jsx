import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Plus, Pencil, Trash2 } from "lucide-react";
import { linksService } from "../../services/linksService";

const TIPE_TONES = {
  cg: "bg-blue-50 text-blue-900",
  bs: "bg-amber-50 text-amber-800",
};

const LinksList = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    linksService.list().then((rows) => setLinks(rows.sort((a, b) => a.id - b.id)));

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus link ini?")) return;
    await linksService.remove(id);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Link Materi</h1>
        <Link
          to="/admin/links/new"
          className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950"
        >
          <Plus className="h-4 w-4" />
          Tambah Link
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Kode Bahan Ajar</th>
              <th className="px-4 py-2.5 font-medium">Topik</th>
              <th className="px-4 py-2.5 font-medium">Tipe</th>
              <th className="px-4 py-2.5 font-medium">Link</th>
              <th className="px-4 py-2.5 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  Memuat...
                </td>
              </tr>
            )}
            {!loading && links.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  Belum ada link.
                </td>
              </tr>
            )}
            {links.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {item.materi?.kode_bahan_ajar ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {item.materi?.topik ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase ${TIPE_TONES[item.tipe] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {item.tipe}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex max-w-xs items-center gap-1 truncate text-slate-500 hover:text-blue-900"
                  >
                    <span className="truncate">{item.link}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/links/${item.id}/edit`}
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

export default LinksList;
