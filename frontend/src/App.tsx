import { Routes, Route } from "react-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage.tsx";
import DashboardPage from "@/pages/regular-user/DashboardPage";
import DashboardAdminPage from "@/pages/admin/DashboardAdminPage";
import Layout from "./components/Layout";
import AdminLayout from "@/components/AdminLayout";



function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>

          <Route element={<ProtectedRoute allowedRoles={["not_admin"]} />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard-admin" element={<DashboardAdminPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
