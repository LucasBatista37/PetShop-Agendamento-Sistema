import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddService() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, duration, description } = form;

    if (!name || !price || !duration) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("services") || "[]");
    stored.push({
      id: Date.now(),
      name,
      price: parseFloat(price),
      duration: parseInt(duration, 10),
      description,
    });
    localStorage.setItem("services", JSON.stringify(stored));

    navigate("/services", { replace: true });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Adicionar Novo Serviço</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
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

          {/* Preço & Duração */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço (R$) *</label>
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
              <label className="block text-sm font-medium text-gray-700">Duração (min) *</label>
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
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detalhes do serviço"
              rows={4}
              className="mt-1 w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Ações */}
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
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
