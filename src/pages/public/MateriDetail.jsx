import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  FileText,
} from "lucide-react";
import { materiService } from "../../services/materiService";
import { linksService } from "../../services/linksService";
import { soalService } from "../../services/soalService";
import SoalCard from "../../components/SoalCard";

const SOAL_GROUP_SIZE = 10;

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

const MateriDetail = () => {
  const { id } = useParams();
  const [materi, setMateri] = useState(undefined);
  const [links, setLinks] = useState([]);
  const [soal, setSoal] = useState([]);
  const [activeSoalIndex, setActiveSoalIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    materiService.get(id).then((row) => {
      if (ignore) return;

      setMateri(row);
      if (row) {
        linksService.listByMateriId(row.id).then((items) => {
          if (!ignore) setLinks(items);
        });
        soalService.listByMateriId(row.id).then((items) => {
          if (ignore) return;
          setSoal(items);
          setActiveSoalIndex(0);
        });
      }
    });

    return () => {
      ignore = true;
    };
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

  const activeGroupStart =
    Math.floor(activeSoalIndex / SOAL_GROUP_SIZE) * SOAL_GROUP_SIZE;
  const visibleSoal = soal.slice(
    activeGroupStart,
    activeGroupStart + SOAL_GROUP_SIZE,
  );
  const activeSoal = soal[activeSoalIndex];
  const canMoveToPreviousGroup = activeGroupStart > 0;
  const canMoveToPreviousSoal = activeSoalIndex > 0;
  const canMoveToNextSoal = activeSoalIndex < soal.length - 1;
  const canMoveToNextGroup = activeGroupStart + SOAL_GROUP_SIZE < soal.length;

  const goToSoal = (index) => {
    setActiveSoalIndex(Math.min(Math.max(index, 0), soal.length - 1));
  };

  return (
    <article className="max-w-3xl">
      <Helmet>
        <title>{`${materi.topik} | Bahan Ajar Pradita`}</title>
      </Helmet>

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
            {materi.mata_pelajaran}
          </span>
          <span className="text-xs text-slate-400">
            Pertemuan {materi.pertemuan}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {materi.topik}
        </h1>
        <p className="mt-2 leading-relaxed text-slate-700">
          {materi.subtopik}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
          <div>
            <dt className="text-slate-400">Kode Bahan Ajar</dt>
            <dd className="mt-0.5 font-medium text-slate-700">
              {materi.kode_bahan_ajar}
            </dd>
          </div>
          {materi.penggunaan && (
            <div>
              <dt className="text-slate-400">Penggunaan</dt>
              <dd className="mt-0.5 font-medium text-slate-700">
                {formatDate(materi.penggunaan)}
              </dd>
            </div>
          )}
        </dl>

        {links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            {links.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Link {item.tipe.toUpperCase()}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>

      {soal.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Latihan Soal
          </h2>
          <nav
            aria-label="Navigasi latihan soal"
            className="flex items-center justify-between gap-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-4"
          >
            <div className="flex items-center gap-2">
              {canMoveToPreviousGroup && (
                <button
                  type="button"
                  onClick={() => goToSoal(activeGroupStart - SOAL_GROUP_SIZE)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Ke 10 soal sebelumnya"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
              )}
              {canMoveToPreviousSoal && (
                <button
                  type="button"
                  onClick={() => goToSoal(activeSoalIndex - 1)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Ke soal sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex min-w-max items-center justify-center gap-2">
              {visibleSoal.map((item, index) => {
                const soalIndex = activeGroupStart + index;
                const isActive = soalIndex === activeSoalIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSoal(soalIndex)}
                    className={`h-11 w-11 shrink-0 rounded-xl text-base transition ${
                      isActive
                        ? "bg-slate-50 font-semibold text-slate-950 shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Ke soal nomor ${item.nomor}`}
                  >
                    {item.nomor}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {canMoveToNextSoal && (
                <button
                  type="button"
                  onClick={() => goToSoal(activeSoalIndex + 1)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Ke soal berikutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
              {canMoveToNextGroup && (
                <button
                  type="button"
                  onClick={() => goToSoal(activeGroupStart + SOAL_GROUP_SIZE)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Ke 10 soal berikutnya"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </nav>

          {activeSoal && <SoalCard key={activeSoal.id} soal={activeSoal} />}
        </div>
      )}
    </article>
  );
};

export default MateriDetail;
