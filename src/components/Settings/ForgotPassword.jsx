import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "@/utils/Toast";
import { sendForgotPasswordLink } from "@/api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return notifyError("Digite seu e-mail para recuperar a senha");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email))
      return notifyError("Digite um e-mail válido");

    if (cooldown > 0) {
      return notifyError(`Espere ${cooldown} segundos para tentar de novo`);
    }

    setLoading(true);
    try {
      await sendForgotPasswordLink(email);
      notifySuccess("Link de recuperação enviado! Verifique seu e-mail.");
      setCooldown(60); 
    } catch (err) {
      notifyError(err.response?.data?.message || "Erro ao enviar link");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Recuperar Senha
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium text-gray-600">
          E-mail cadastrado
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="seu@exemplo.com"
        />
        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading
            ? "Enviando..."
            : cooldown > 0
            ? `Aguarde ${cooldown}s para reenviar`
            : "Enviar link"}
        </button>
      </form>
    </div>
  );
}
