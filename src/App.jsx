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

function App() {
  return (
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
      </Route>

      <Route path="/" element={<Navigate to="/login " replace />} />

      <Route path="*" element={<p className="p-6">Página não encontrada</p>} />
    </Routes>
  );
}

export default App;
