import { Route, Routes } from "react-router-dom";
import AdminAuctionPage from "../../pages/Admin/Auctions";
import AdminAuctionsFeePage from "../../pages/Admin/AuctionsFee";
import AdminDashboardPage from "../../pages/Admin/Dashboard";
import AdminUserPage from "../../pages/Admin/Users";
import AdminVehiclePage from "../../pages/Admin/Vehicles";
import AuctionPage from "../../pages/Auction";
import AuctionDetail from "../../pages/Auction/UI/AuctionDetailPage.tsx";
import LoginPage from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import GoogleInfo from "../../pages/Auth/Register/GoogleInfo";
import OtpConfirm from "../../pages/Auth/Register/OtpConfirm";
import HomePage from "../../pages/Home";
import PostDetail from "../../pages/Post/DetailPost.tsx";
import PostVehicleSale from "../../pages/Post/index.tsx";
import PostList from "../../pages/Post/PostList.tsx";
import AddCar from "../../pages/Profile/AddCar";
import InspectionFee from "../../pages/Profile/InspectionFee.tsx";
import ProfilePage from "../../pages/Profile/Profile";
import TransactionHistory from "../../pages/Profile/TransactionHistory";
import UpdateCar from "../../pages/Profile/UpdateCar.tsx";
import ViewBattery from "../../pages/Profile/ViewBattery";
import ViewCar from "../../pages/Profile/ViewCar";
import ViewCarDetails from "../../pages/Profile/ViewCarDetails.tsx";
import ViewInspectionFee from "../../pages/Profile/ViewInspectionFee.tsx";
import { AdminLayout } from "../layouts/AdminLayout";
import PostPackagePage from "../../pages/Admin/PostPackage/index.tsx";
import PackageStore from "../../pages/Packages/index.tsx";
import PackagePricingPage from "../../pages/Packages/index.tsx";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-confirm" element={<OtpConfirm />} />
      <Route path="/google-info" element={<GoogleInfo />} />
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

      <Route path="/InspectionFee" element={<InspectionFee />} />
      <Route
        path="/ViewInspectionFee/:inspectionFeeId"
        element={<ViewInspectionFee />}
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
      <Route path="/post" element={<PostVehicleSale />} />
      <Route path="/posts" element={<PostList />} />
      <Route path="/userpost/:id" element={<PostDetail />} />
      <Route
        path="/admin/vehicles"
        element={
          <AdminLayout>
            <AdminVehiclePage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/auctions-fee"
        element={
          <AdminLayout>
            <AdminAuctionsFeePage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/auctions"
        element={
          <AdminLayout>
            <AdminAuctionPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/postPackages"
        element={
          <AdminLayout>
            <PostPackagePage />
          </AdminLayout>
        }
      />
      <Route path="/packages" element={<PackagePricingPage />} />

    </Routes>
  );
};
