import { Routes, Route } from "react-router-dom";
import  HomePage  from "../../pages/Home";
import  LoginPage  from "../../pages/Auth";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};
