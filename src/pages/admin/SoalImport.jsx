import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { materiService } from "../../services/materiService";
import { soalService } from "../../services/soalService";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

const sampleJson = `[
  {
    "nomor": 1,
    "topik": "Transformasi Fungsi",
    "subtopik": "Translasi dan Refleksi",
    "level_kognitif": "LOTS",
    "pertanyaan": "Tentukan bayangan fungsi ...",
    "pilihan_a": "...",
    "pilihan_b": "...",
    "pilihan_c": "...",
    "pilihan_d": "...",
    "pilihan_e": "...",
    "jawaban_benar": "a",
    "pembahasan": "..."
  }
]`;

const getOption = (row, key) =>
  row[`pilihan_${key}`] ??
  row.pilihan?.[key] ??
  row.opsi?.[key] ??
  row.options?.[key] ??
  "";

const getRows = (value) => {
  const parsed = JSON.parse(value);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.soal)) return parsed.soal;
  if (Array.isArray(parsed.questions)) return parsed.questions;
  throw new Error("JSON harus berupa array, atau object dengan field soal/questions.");
};

const normalizeRows = (value, fallbackMateriId) =>
  getRows(value).map((row, index) => ({
    materi_id: Number(row.materi_id || fallbackMateriId),
    nomor: Number(row.nomor ?? index + 1),
    topik: row.topik ?? "",
    subtopik: row.subtopik ?? "",
    level_kognitif: row.level_kognitif ?? row.level ?? "LOTS",
    pertanyaan: row.pertanyaan ?? row.question ?? "",
    pilihan_a: getOption(row, "a"),
    pilihan_b: getOption(row, "b"),
    pilihan_c: getOption(row, "c"),
    pilihan_d: getOption(row, "d"),
    pilihan_e: getOption(row, "e"),
    jawaban_benar: (row.jawaban_benar ?? row.jawaban ?? row.answer ?? "a")
      .toString()
      .toLowerCase(),
    pembahasan: row.pembahasan ?? row.explanation ?? "",
  }));

const validateRows = (rows) => {
  const required = ["materi_id", "nomor", "pertanyaan", "jawaban_benar", "pembahasan"];

  rows.forEach((row, index) => {
    required.forEach((field) => {
      if (!row[field]) {
        throw new Error(`Baris ${index + 1}: field ${field} wajib diisi.`);
      }
    });
    ["a", "b", "c", "d", "e"].forEach((key) => {
      if (!row[`pilihan_${key}`]) {
        throw new Error(`Baris ${index + 1}: pilihan_${key} wajib diisi.`);
      }
    });
    if (!["a", "b", "c", "d", "e"].includes(row.jawaban_benar)) {
      throw new Error(`Baris ${index + 1}: jawaban_benar harus a, b, c, d, atau e.`);
    }
  });
};

const SoalImport = () => {
  const navigate = useNavigate();
  const [materiOptions, setMateriOptions] = useState([]);
  const [materiId, setMateriId] = useState("");
  const [jsonText, setJsonText] = useState(sampleJson);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    materiService.list().then((materi) => {
      const sorted = [...materi].sort((a, b) =>
        a.kode_bahan_ajar.localeCompare(b.kode_bahan_ajar),
      );
      setMateriOptions(sorted);
      if (sorted.length > 0) setMateriId(sorted[0].id);
    });
  }, []);

  const previewRows = useMemo(() => {
    try {
      return normalizeRows(jsonText, materiId);
    } catch {
      return [];
    }
  }, [jsonText, materiId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const rows = normalizeRows(jsonText, materiId);
      validateRows(rows);
      setSaving(true);
      await soalService.createMany(rows);
      navigate("/admin/soal");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Helmet>
        <title>Import Soal | Admin Bahan Ajar Pradita</title>
      </Helmet>
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
        Import Soal
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Materi Default
          </label>
          <select
            required
            value={materiId}
            onChange={(e) => setMateriId(Number(e.target.value))}
            className={inputClass}
          >
            {materiOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.kode_bahan_ajar} - {m.topik}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            JSON Soal
          </label>
          <textarea
            required
            rows={18}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <p className="text-sm text-slate-500">
          Terdeteksi {previewRows.length} soal siap import.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950 disabled:opacity-60"
          >
            {saving ? "Mengimpor..." : "Import Soal"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/soal")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default SoalImport;
