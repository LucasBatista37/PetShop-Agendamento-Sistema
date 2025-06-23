import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { createService } from "@/api/api";

export default function AddServiceModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    extra: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", price: "", duration: "", description: "", extra: false });
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, price, duration } = form;
    if (!name || !price || !duration) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      setLoading(true);
      const res = await createService({
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration, 10),
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Erro ao adicionar serviço. Tente novamente.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <Dialog.Panel className="relative w-full sm:max-w-lg h-full sm:h-auto bg-white flex flex-col rounded-none sm:rounded-lg shadow-lg">
        <header className="sticky top-0 bg-white/95 px-4 sm:px-6 py-4 flex items-center justify-between rounded-none sm:rounded-t-lg z-10">
          <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-800">
            Adicionar Serviço
          </Dialog.Title>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
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
                id="extra"
                checked={form.extra}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="extra" className="ml-2 block text-sm text-gray-700">
                É um serviço extra?
              </label>
            </div>
          </form>
        </div>

        <footer className="sticky bottom-0 bg-white/95 px-4 sm:px-6 py-4 flex justify-end gap-2 rounded-none sm:rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}
