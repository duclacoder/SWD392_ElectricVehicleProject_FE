import { Routes, Route } from "react-router-dom";
import  HomePage  from "../../pages/Home";
import  LoginPage  from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};
