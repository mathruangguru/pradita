import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { materiService } from "../../services/materiService";

const MateriDetail = () => {
  const { id } = useParams();
  const [materi, setMateri] = useState(undefined);

  useEffect(() => {
    materiService.get(id).then(setMateri);
  }, [id]);

  if (materi === undefined) {
    return <p className="text-slate-500">Memuat...</p>;
  }

  if (materi === null) {
    return (
      <div>
        <p className="text-slate-500">Materi tidak ditemukan.</p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-900 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
            <FileText className="h-4 w-4" />
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-950">
            {materi.kategori}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {materi.judul}
        </h1>
        <p className="mt-4 leading-relaxed text-slate-700">
          {materi.konten}
        </p>
      </div>
    </article>
  );
};

export default MateriDetail;
