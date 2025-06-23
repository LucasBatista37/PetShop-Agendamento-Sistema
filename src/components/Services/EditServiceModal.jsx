import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function EditServiceModal({ service, onClose, onSave }) {
  const [form, setForm] = useState(service);

  useEffect(() => setForm(service), [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, duration } = form;
    if (!name || !price || !duration) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    onSave({
      ...form,
      price: parseFloat(price),
      duration: parseInt(duration, 10),
    });
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full h-full sm:max-w-lg sm:h-auto bg-white flex flex-col rounded-none sm:rounded-lg shadow-lg"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <header className="sticky top-0 bg-white/95 px-4 sm:px-6 py-4 flex items-center justify-between rounded-none sm:rounded-t-lg z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Editar Serviço
            </h2>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="p-2 rounded hover:bg-gray-100 text-gray-500"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Preço (R$) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duração (min) *
                  </label>
                  <input
                    name="duration"
                    type="number"
                    value={form.duration}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
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
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="extra"
                  checked={form.extra}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                Serviço extra?
              </label>
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Salvar
            </button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
