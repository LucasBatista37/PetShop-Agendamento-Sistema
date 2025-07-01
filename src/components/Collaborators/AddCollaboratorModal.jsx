import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function AddCollaboratorModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Colaborador",
    department: "",
    status: "Pendente",
    joinedAt: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: Date.now() });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            Adicionar Colaborador
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <input
              name="department"
              placeholder="Departamento"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option>Administrador</option>
              <option>Colaborador</option>
            </select>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option>Ativo</option>
              <option>Pendente</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:underline"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
