import { Route, Routes } from "react-router-dom";
import AdminDashboardPage from "../../pages/Admin/Dashboard";
import AdminUserPage from "../../pages/Admin/Users";
import LoginPage from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import OtpConfirm from "../../pages/Auth/Register/OtpConfirm";
import HomePage from "../../pages/Home";
import { AdminLayout } from "../layouts/AdminLayout";
import AuctionPage from "../../pages/Auction";
import ProfilePage from "../../pages/Profile/Profile";
import AddCar from "../../pages/Profile/AddCar";
import TransactionHistory from "../../pages/Profile/TransactionHistory";
import ViewBattery from "../../pages/Profile/ViewBattery";
import ViewCar from "../../pages/Profile/ViewCar";
import ViewCarDetails from "../../pages/Profile/ViewCarDetails.tsx";
import UpdateCar from "../../pages/Profile/UpdateCar.tsx";
import AuctionDetail from "../../pages/Auction/UI/AuctionDetailPage.tsx";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-confirm" element={<OtpConfirm />} />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboardPage />
          </AdminLayout>
        }
      />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/AddCar" element={<AddCar />} />
      <Route path="/TransactionHistory" element={<TransactionHistory />} />
      <Route path="/ViewBattery" element={<ViewBattery />} />
      <Route path="/ViewCar" element={<ViewCar />} />
      <Route
        path="/ViewCarDetails/:userId/:vehicleId"
        element={<ViewCarDetails />}
      />
      <Route path="/UpdateCar/:userId/:vehicleId" element={<UpdateCar />} />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <AdminUserPage />
          </AdminLayout>
        }
      />
      <Route path="/auction" element={<AuctionPage />} />
      <Route path="/auction/:id" element={<AuctionDetail />} />
    </Routes>
  );
};
