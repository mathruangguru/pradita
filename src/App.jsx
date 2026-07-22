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
import UserList from "./pages/admin/UserList";
import UserForm from "./pages/admin/UserForm";

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
        <Route path="users" element={<UserList />} />
        <Route path="users/new" element={<UserForm />} />
        <Route path="users/:id/edit" element={<UserForm />} />
      </Route>
    </Routes>
  );
};

export default App;
