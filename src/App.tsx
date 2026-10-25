import { Navigate, Route, Routes } from "react-router-dom";
import PortfolioApp from "./PortfolioApp";
import AdminLogin from "./admin/AdminLogin";
import AdminMFA from "./admin/AdminMFA";
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioApp />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/mfa" element={<AdminMFA />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
