import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { acceptInvite } from "@/api/api";
import { toast } from "react-toastify";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      console.log("Dados enviados:", { ...form, email, token });

      await acceptInvite({ ...form, email, token });
      toast.success("Convite aceito! Agora você pode fazer login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao aceitar convite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Aceitar Convite</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Seu nome"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Crie uma senha"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Aceitar convite"}
        </button>
      </form>
    </div>
  );
}
