import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import MarkdownLatex from "./MarkdownLatex";

const LEVEL_TONES = {
  LOTS: "bg-green-100 text-green-700",
  MOTS: "bg-amber-100 text-amber-700",
  HOTS: "bg-rose-100 text-rose-700",
};

const OPTIONS = ["a", "b", "c", "d", "e"];

const getCorrectAnswers = (soal) =>
  (soal.jawaban_benar ?? "")
    .split(",")
    .map((answer) => answer.trim().toLowerCase())
    .filter(Boolean);

const SoalCard = ({ soal }) => {
  const [showPembahasan, setShowPembahasan] = useState(false);
  const correctAnswers = getCorrectAnswers(soal);
  const isMultiAnswer = correctAnswers.length > 1;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-800">
          Soal No. {soal.nomor}
        </span>
        {soal.level_kognitif && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_TONES[soal.level_kognitif] ?? "bg-slate-100 text-slate-600"}`}
          >
            {soal.level_kognitif}
          </span>
        )}
        {isMultiAnswer && (
          <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700">
            Multi-jawaban
          </span>
        )}
        {soal.subtopik && (
          <span className="text-xs text-slate-400">{soal.subtopik}</span>
        )}
      </div>

      <div className="mt-3">
        <MarkdownLatex>{soal.pertanyaan}</MarkdownLatex>
      </div>

      <div className="mt-3 space-y-1.5">
        {OPTIONS.map((huruf) => (
          <div key={huruf} className="flex gap-2">
            <span className="shrink-0 text-sm font-medium uppercase text-slate-500">
              {isMultiAnswer ? "□" : `${huruf}.`}
            </span>
            <MarkdownLatex className="flex-1">
              {soal[`pilihan_${huruf}`]}
            </MarkdownLatex>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowPembahasan((v) => !v)}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-900 hover:underline"
      >
        {showPembahasan ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
        {showPembahasan ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {showPembahasan && (
        <div className="mt-3 rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-semibold text-green-700">
            Jawaban benar: {correctAnswers.join(", ").toUpperCase()}
          </p>
          <div className="mt-2">
            <MarkdownLatex>{soal.pembahasan}</MarkdownLatex>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoalCard;
