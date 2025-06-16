import "./App.css";
import "./index.css";

import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./components/Dashboard";
import Appointments from "./components/Appointments/Appointments";
import AddService from "./components/Services/AddService";
import ServicesConfig from "./components/Services/ServicesConfig";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import EmailVerify from "./pages/EmailVerify";
import HelpCenter from "./components/Help/HelpCenter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountSettings from "./components/Settings/Settings";
import ForgotPassword from "./components/Settings/ForgotPassword";
import ResetPassword from "./components/Settings/ResetPassword";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/services" element={<ServicesConfig />} />
          <Route path="/services/new" element={<AddService />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/verifique-email" element={<VerifyEmail />} />
          <Route path="/email-verificado" element={<EmailVerify />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="*"
          element={<p className="p-6">Página não encontrada</p>}
        />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
