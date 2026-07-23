import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Folder } from "lucide-react";
import { materiService } from "../../services/materiService";

const FOLDER_TONES = [
  "bg-blue-50 text-blue-900",
  "bg-amber-50 text-amber-700",
  "bg-slate-200 text-slate-700",
];

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

const getDateOnly = (value) => {
  const date = value ? new Date(value) : new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

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
    acc[row.mata_pelajaran] = acc[row.mata_pelajaran] ?? [];
    acc[row.mata_pelajaran].push(row);
    return acc;
  }, {});
  const today = getDateOnly();
  const weekStart = new Date(today);
  const weekEnd = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  weekEnd.setDate(today.getDate() + 7);

  const weeklyMateri = materi
    .filter((item) => {
      if (!item.penggunaan) return false;
      const penggunaan = getDateOnly(item.penggunaan);
      return penggunaan >= weekStart && penggunaan <= weekEnd;
    })
    .sort((a, b) => new Date(a.penggunaan) - new Date(b.penggunaan));

  if (loading) {
    return <p className="text-slate-500">Memuat bahan ajar...</p>;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <Helmet>
        <title>Bahan Ajar | Bahan Ajar Pradita</title>
      </Helmet>

      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Bahan Ajar
        </h1>
        <p className="mt-1 text-slate-500">
          Kumpulan materi pembelajaran yang tersedia saat ini.
        </p>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-50 text-cyan-700">
            <Folder className="h-3.5 w-3.5" />
          </div>
          <h2 className="min-w-0 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Bahan Ajar Minggu Ini
          </h2>
        </div>
        {weeklyMateri.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {weeklyMateri.map((item) => (
              <Link
                key={item.id}
                to={`/materi/${item.id}`}
                className="flex items-stretch gap-3 rounded-xl border border-cyan-100 bg-white p-3 transition hover:border-cyan-300 hover:shadow-sm sm:gap-4 sm:p-4"
              >
                <div className="flex w-14 shrink-0 flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Pertemuan
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    {item.pertemuan}
                  </span>
                </div>
                <div className="min-w-0 border-l border-slate-100 pl-3 sm:pl-4">
                  <h3 className="font-medium text-slate-900">{item.topik}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.subtopik}
                  </p>
                  <p className="mt-2 text-xs text-cyan-700">
                    {formatDate(item.penggunaan)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Tidak ada bahan ajar dalam rentang H-7 sampai H+7.
          </p>
        )}
      </section>

      {Object.entries(grouped).map(([mataPelajaran, items], i) => (
        <section key={mataPelajaran}>
          <div className="mb-3 flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-md ${FOLDER_TONES[i % FOLDER_TONES.length]}`}
            >
              <Folder className="h-3.5 w-3.5" />
            </div>
            <h2 className="min-w-0 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {mataPelajaran}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items
              .sort((a, b) => a.pertemuan - b.pertemuan)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/materi/${item.id}`}
                  className="flex items-stretch gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue-300 hover:shadow-sm sm:gap-4 sm:p-4"
                >
                  <div className="flex w-14 shrink-0 flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Pertemuan
                    </span>
                    <span className="text-2xl font-bold text-slate-900">
                      {item.pertemuan}
                    </span>
                  </div>
                  <div className="min-w-0 border-l border-slate-100 pl-3 sm:pl-4">
                    <h3 className="font-medium text-slate-900">
                      {item.topik}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.subtopik}
                    </p>
                    {item.penggunaan && (
                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(item.penggunaan)}
                      </p>
                    )}
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
