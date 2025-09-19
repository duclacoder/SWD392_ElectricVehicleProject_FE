import { Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import HomePage from "../../pages/Home";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};
