import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; 
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "@/utils/Toast";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const navigate = useNavigate(); 

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      notifyError("Token ou e-mail inválido");
      navigate("/login"); 
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return notifyError("As senhas não coincidem");
    }
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password`, {
        email,
        token,
        newPassword: password,
      });
      notifySuccess("Senha redefinida com sucesso!");
      navigate("/login"); 
    } catch (err) {
      notifyError(err.response?.data?.message || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Nova Senha
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600">Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Digite a nova senha"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            aria-label="Mostrar/Ocultar senha"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600">
            Confirmar Senha
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Confirme a nova senha"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            aria-label="Mostrar/Ocultar confirmação"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Processando..." : "Redefinir Senha"}
        </button>
      </form>
    </div>
  );
}
