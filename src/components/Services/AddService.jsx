import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddService() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    extra: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, price, duration } = form;
    if (!name || !price || !duration) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para adicionar serviços.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/services",
        {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          duration: parseInt(form.duration, 10),
          extra: form.extra,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/services", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Erro ao adicionar serviço. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Adicionar Novo Serviço
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome do Serviço *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Banho Simples"
              className="mt-1 w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço (R$) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="70"
                className="mt-1 w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duração (min) *
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="40"
                className="mt-1 w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detalhes do serviço"
              rows={4}
              className="mt-1 w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="extra"
              checked={form.extra}
              onChange={handleChange}
              id="extra"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="extra" className="ml-2 block text-sm text-gray-700">
              É um serviço extra?
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
