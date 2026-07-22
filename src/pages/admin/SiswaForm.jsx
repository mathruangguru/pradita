import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { siswaService } from "../../services/siswaService";

const emptyForm = {
  nama: "",
  email: "",
  status: "active",
};

const SiswaForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    siswaService.get(id).then((row) => {
      if (row) setForm(row);
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (isEdit) {
      await siswaService.update(id, form);
    } else {
      await siswaService.create(form);
    }
    setSaving(false);
    navigate("/admin/siswa");
  };

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div className="max-w-xl">
      <Helmet>
        <title>{`${isEdit ? "Edit Siswa" : "Tambah Siswa"} | Admin Bahan Ajar Pradita`}</title>
      </Helmet>

      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
        {isEdit ? "Edit Siswa" : "Tambah Siswa"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Nama
          </label>
          <input
            required
            value={form.nama}
            onChange={handleChange("nama")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
            onClick={() => navigate("/admin/siswa")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiswaForm;
