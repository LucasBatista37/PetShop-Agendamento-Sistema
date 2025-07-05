import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FiX, FiUserPlus } from "react-icons/fi";

export default function AddCollaboratorModal({ isOpen, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setDepartment("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!email || !department) return;
    try {
      setLoading(true);
      await onSave({ email, department });
      setEmail("");
      setDepartment("");
    } catch (err) {
      console.error("Erro ao enviar convite:", err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const inputBase =
    "w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <Dialog.Panel className="relative w-full h-full sm:max-w-md sm:h-auto bg-white flex flex-col rounded-none sm:rounded-xl shadow-lg">
        {/* Header */}
        <header className="sticky top-0 bg-white/95 px-4 py-4 flex items-center justify-between rounded-t-xl z-10">
          <Dialog.Title className="text-xl font-semibold text-gray-800">
            Convidar Colaborador
          </Dialog.Title>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded hover:bg-gray-100 text-gray-500"
          >
            <FiX size={20} />
          </button>
        </header>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <input
            type="email"
            placeholder="E-mail do colaborador *"
            className={inputBase}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Departamento *"
            className={inputBase}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        {/* Rodapé */}
        <footer className="sticky bottom-0 bg-white/95 px-4 py-4 rounded-b-xl">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md disabled:opacity-50"
          >
            <FiUserPlus />
            {loading ? "Enviando..." : "Enviar convite"}
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}
