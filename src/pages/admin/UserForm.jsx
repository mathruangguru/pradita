import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../services/userService";

const emptyForm = {
  nama: "",
  email: "",
  password: "",
  role: "siswa",
  status: "active",
};

const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    userService.get(id).then((row) => {
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
      await userService.update(id, form);
    } else {
      await userService.create(form);
    }
    setSaving(false);
    navigate("/admin/users");
  };

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900">
        {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
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
            Password
          </label>
          <input
            type="password"
            required={!isEdit}
            placeholder={isEdit ? "Kosongkan jika tidak diubah" : ""}
            value={form.password}
            onChange={handleChange("password")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              value={form.role}
              onChange={handleChange("role")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="siswa">Siswa</option>
              <option value="admin">Admin</option>
            </select>
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
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
