import { Route, Routes } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/public/Home";
import MateriDetail from "./pages/public/MateriDetail";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import MateriList from "./pages/admin/MateriList";
import MateriForm from "./pages/admin/MateriForm";
import LinksList from "./pages/admin/LinksList";
import LinksForm from "./pages/admin/LinksForm";
import SoalList from "./pages/admin/SoalList";
import SoalForm from "./pages/admin/SoalForm";
import SoalImport from "./pages/admin/SoalImport";
import SiswaList from "./pages/admin/SiswaList";
import SiswaForm from "./pages/admin/SiswaForm";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/materi/:id" element={<MateriDetail />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="materi" element={<MateriList />} />
        <Route path="materi/new" element={<MateriForm />} />
        <Route path="materi/:id/edit" element={<MateriForm />} />
        <Route path="links" element={<LinksList />} />
        <Route path="links/new" element={<LinksForm />} />
        <Route path="links/:id/edit" element={<LinksForm />} />
        <Route path="soal" element={<SoalList />} />
        <Route path="soal/new" element={<SoalForm />} />
        <Route path="soal/import" element={<SoalImport />} />
        <Route path="soal/:id/edit" element={<SoalForm />} />
        <Route path="siswa" element={<SiswaList />} />
        <Route path="siswa/new" element={<SiswaForm />} />
        <Route path="siswa/:id/edit" element={<SiswaForm />} />
      </Route>
    </Routes>
  );
};

export default App;
