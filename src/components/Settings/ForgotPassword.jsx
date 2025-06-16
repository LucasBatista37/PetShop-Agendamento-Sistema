import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "@/utils/Toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return notifyError("Digite seu e-mail para recuperar a senha");
    }
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/forgot-password`, { email });
      setSent(true);
      notifySuccess("Link de recuperação enviado! Verifique seu e-mail.");
    } catch (err) {
      notifyError(err.response?.data?.message || "Erro ao enviar link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Recuperar Senha</h1>
      {sent ? (
        <p className="text-green-600 text-center">
          Enviamos um link para <strong>{email}</strong>. Verifique sua caixa de entrada.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-600">E-mail cadastrado</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="seu@exemplo.com"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      )}
    </div>
  );
}