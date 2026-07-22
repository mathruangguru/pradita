import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { linksService } from "../../services/linksService";
import { materiService } from "../../services/materiService";

const emptyForm = {
  materi_id: "",
  tipe: "cg",
  link: "",
};

const LinksForm = () => {
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
      isEdit ? linksService.get(id) : Promise.resolve(null),
    ]).then(([materi, row]) => {
      setMateriOptions(
        [...materi].sort((a, b) => a.kode_bahan_ajar.localeCompare(b.kode_bahan_ajar)),
      );
      if (row) {
        setForm({
          materi_id: row.materi_id,
          tipe: row.tipe,
          link: row.link,
        });
      } else if (materi.length > 0) {
        setForm((prev) => ({ ...prev, materi_id: materi[0].id }));
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    const value =
      field === "materi_id" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (isEdit) {
      await linksService.update(id, form);
    } else {
      await linksService.create(form);
    }
    setSaving(false);
    navigate("/admin/links");
  };

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div className="max-w-xl">
      <Helmet>
        <title>{`${isEdit ? "Edit Link" : "Tambah Link"} | Admin Bahan Ajar Pradita`}</title>
      </Helmet>

      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
        {isEdit ? "Edit Link" : "Tambah Link"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Materi
          </label>
          <select
            required
            value={form.materi_id}
            onChange={handleChange("materi_id")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            Tipe
          </label>
          <select
            value={form.tipe}
            onChange={handleChange("tipe")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="cg">CG</option>
            <option value="bs">BS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Link
          </label>
          <input
            type="url"
            required
            value={form.link}
            onChange={handleChange("link")}
            placeholder="https://drive.google.com/..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
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
            onClick={() => navigate("/admin/links")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default LinksForm;
