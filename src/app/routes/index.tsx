import { Route, Routes } from "react-router-dom";
import AdminDashboardPage from "../../pages/Admin/Dashboard";
import AdminUserPage from "../../pages/Admin/Users";
import LoginPage from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import HomePage from "../../pages/Home";
import { AdminLayout } from "../layouts/AdminLayout";
import AuctionPage from "../../pages/Auction";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboardPage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <AdminUserPage />
          </AdminLayout>
        }
      />
      <Route path="/auction" element={<AuctionPage />} />

    </Routes>
  );
};
