import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Folder } from "lucide-react";
import { materiService } from "../../services/materiService";

const FOLDER_TONES = [
  "bg-blue-50 text-blue-900",
  "bg-amber-50 text-amber-700",
  "bg-slate-200 text-slate-700",
];

const Home = () => {
  const [materi, setMateri] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    materiService.list().then((rows) => {
      setMateri(rows.filter((row) => row.status === "published"));
      setLoading(false);
    });
  }, []);

  const grouped = materi.reduce((acc, row) => {
    acc[row.kategori] = acc[row.kategori] ?? [];
    acc[row.kategori].push(row);
    return acc;
  }, {});

  if (loading) {
    return <p className="text-slate-500">Memuat bahan ajar...</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bahan Ajar</h1>
        <p className="mt-1 text-slate-500">
          Kumpulan materi pembelajaran yang tersedia saat ini.
        </p>
      </div>

      {Object.entries(grouped).map(([kategori, items], i) => (
        <section key={kategori}>
          <div className="mb-3 flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-md ${FOLDER_TONES[i % FOLDER_TONES.length]}`}
            >
              <Folder className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {kategori}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items
              .sort((a, b) => a.urutan - b.urutan)
              .map((item) => (
                <Link
                  key={item.Id}
                  to={`/materi/${item.Id}`}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-slate-900">
                      {item.judul}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.deskripsi}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ))}

      {materi.length === 0 && (
        <p className="text-slate-500">Belum ada bahan ajar yang tersedia.</p>
      )}
    </div>
  );
};

export default Home;
