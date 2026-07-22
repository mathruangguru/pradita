import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { materiService } from "../../services/materiService";

const emptyForm = {
  mata_pelajaran: "",
  pertemuan: 1,
  topik: "",
  subtopik: "",
  kode_bahan_ajar: "",
  penggunaan: "",
  status: "draft",
};

const MateriForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    materiService.get(id).then((row) => {
      if (row) setForm({ ...row, penggunaan: row.penggunaan ?? "" });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    const value =
      field === "pertemuan" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, penggunaan: form.penggunaan || null };
    if (isEdit) {
      await materiService.update(id, payload);
    } else {
      await materiService.create(payload);
    }
    setSaving(false);
    navigate("/admin/materi");
  };

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div className="max-w-xl">
      <Helmet>
        <title>{`${isEdit ? "Edit Materi" : "Tambah Materi"} | Admin Bahan Ajar Pradita`}</title>
      </Helmet>

      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
        {isEdit ? "Edit Materi" : "Tambah Materi"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Mata Pelajaran
            </label>
            <input
              required
              value={form.mata_pelajaran}
              onChange={handleChange("mata_pelajaran")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Pertemuan
            </label>
            <input
              type="number"
              min={1}
              required
              value={form.pertemuan}
              onChange={handleChange("pertemuan")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Topik
          </label>
          <input
            required
            value={form.topik}
            onChange={handleChange("topik")}
            placeholder="[TKA] Transformasi Fungsi"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Subtopik
          </label>
          <input
            required
            value={form.subtopik}
            onChange={handleChange("subtopik")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Kode Bahan Ajar
            </label>
            <input
              required
              value={form.kode_bahan_ajar}
              onChange={handleChange("kode_bahan_ajar")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Penggunaan
            </label>
            <input
              type="date"
              value={form.penggunaan}
              onChange={handleChange("penggunaan")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={form.status}
            onChange={handleChange("status")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
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
            onClick={() => navigate("/admin/materi")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default MateriForm;
