import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); 

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = form;
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      setAuthToken(res.data.accessToken);
      setUser(res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-verification", { email: form.email });
      alert("E-mail de verificação reenviado. Verifique sua caixa de entrada.");
    } catch {
      alert("Erro ao reenviar e-mail.");
    }
  };

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
          Bem-vindo ao PetCare
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-500">
          Use seu e-mail e senha para entrar
        </p>
      </div>

      {error && (
        <div className="mb-6 text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            E-mail
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@exemplo.com"
              className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Senha
          </label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"} // 👈 alterna
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 pl-11 pr-10 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {error.includes("não verificado") && (
        <button
          onClick={handleResend}
          className="mt-4 w-full text-center text-indigo-600 hover:underline"
        >
          Reenviar e-mail de verificação
        </button>
      )}

      <button
        type="button"
        onClick={() => navigate("/forgot-password")}
        className="mt-4 w-full text-center text-indigo-600 hover:underline"
      >
        Esqueci minha senha
      </button>

      <p className="mt-10 text-sm text-center text-gray-500">
        Não possui conta?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-indigo-600 font-medium hover:underline cursor-pointer"
        >
          Cadastre-se
        </span>
      </p>
    </>
  );
}
