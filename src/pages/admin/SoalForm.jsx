import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { soalService } from "../../services/soalService";
import { materiService } from "../../services/materiService";
import MarkdownLatex from "../../components/MarkdownLatex";

const emptyForm = {
  materi_id: "",
  nomor: 1,
  topik: "",
  subtopik: "",
  level_kognitif: "LOTS",
  pertanyaan: "",
  pilihan_a: "",
  pilihan_b: "",
  pilihan_c: "",
  pilihan_d: "",
  pilihan_e: "",
  jawaban_benar: "a",
  is_multi_answer: false,
  pembahasan: "",
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

const PreviewBox = ({ children }) => (
  <div className="mt-1 min-h-[42px] rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
    <MarkdownLatex>{children || "*(pratinjau)*"}</MarkdownLatex>
  </div>
);

const SoalForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [materiOptions, setMateriOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      materiService.list(),
      isEdit ? soalService.get(id) : Promise.resolve(null),
    ]).then(([materi, row]) => {
      setMateriOptions(
        [...materi].sort((a, b) => a.kode_bahan_ajar.localeCompare(b.kode_bahan_ajar)),
      );
      if (row) {
        setForm({
          ...row,
          is_multi_answer: (row.jawaban_benar ?? "").includes(","),
        });
      } else if (materi.length > 0) {
        setForm((prev) => ({ ...prev, materi_id: materi[0].id }));
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    const value =
      field === "materi_id" || field === "nomor"
        ? Number(e.target.value)
        : field === "is_multi_answer"
          ? e.target.checked
          : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    delete payload.is_multi_answer;
    if (isEdit) {
      await soalService.update(id, payload);
    } else {
      await soalService.create(payload);
    }
    setSaving(false);
    navigate("/admin/soal");
  };

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div className="max-w-4xl">
      <Helmet>
        <title>{`${isEdit ? "Edit Soal" : "Tambah Soal"} | Admin Bahan Ajar Pradita`}</title>
      </Helmet>

      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
        {isEdit ? "Edit Soal" : "Tambah Soal"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Materi
            </label>
            <select
              required
              value={form.materi_id}
              onChange={handleChange("materi_id")}
              className={inputClass}
            >
              {materiOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.kode_bahan_ajar} — {m.topik}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nomor
            </label>
            <input
              type="number"
              min={1}
              required
              value={form.nomor}
              onChange={handleChange("nomor")}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Topik
            </label>
            <input
              value={form.topik}
              onChange={handleChange("topik")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Subtopik
            </label>
            <input
              value={form.subtopik}
              onChange={handleChange("subtopik")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Level Kognitif
            </label>
            <select
              value={form.level_kognitif}
              onChange={handleChange("level_kognitif")}
              className={inputClass}
            >
              <option value="LOTS">LOTS</option>
              <option value="MOTS">MOTS</option>
              <option value="HOTS">HOTS</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Pertanyaan{" "}
              <span className="font-normal text-slate-400">
                (Markdown + LaTeX, gunakan $...$ / $$...$$)
              </span>
            </label>
            <textarea
              required
              rows={6}
              value={form.pertanyaan}
              onChange={handleChange("pertanyaan")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Pratinjau
            </label>
            <PreviewBox>{form.pertanyaan}</PreviewBox>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Pilihan Jawaban
          </label>
          <div className="mt-2 space-y-2">
            {["a", "b", "c", "d", "e"].map((huruf) => (
              <div key={huruf} className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-sm font-semibold uppercase text-slate-400">
                    {huruf}
                  </span>
                  <textarea
                    required
                    rows={1}
                    value={form[`pilihan_${huruf}`]}
                    onChange={handleChange(`pilihan_${huruf}`)}
                    className={inputClass}
                  />
                </div>
                <PreviewBox>{form[`pilihan_${huruf}`]}</PreviewBox>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.is_multi_answer}
              onChange={handleChange("is_multi_answer")}
              className="h-4 w-4 rounded border-slate-300"
            />
            Bisa memilih lebih dari 1 jawaban
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Jawaban Benar
            </label>
            {form.is_multi_answer ? (
              <input
                value={form.jawaban_benar}
                onChange={handleChange("jawaban_benar")}
                placeholder="a,c,e"
                className={`${inputClass} uppercase`}
              />
            ) : (
              <select
                value={form.jawaban_benar}
                onChange={handleChange("jawaban_benar")}
                className={`${inputClass} uppercase`}
              >
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
                <option value="e">E</option>
              </select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Pembahasan
            </label>
            <textarea
              required
              rows={10}
              value={form.pembahasan}
              onChange={handleChange("pembahasan")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Pratinjau
            </label>
            <PreviewBox>{form.pembahasan}</PreviewBox>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
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

export default SoalForm;
