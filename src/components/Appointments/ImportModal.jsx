import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { importAppointments } from "@/api/api";
import { notifySuccess, notifyError } from "@/utils/Toast";

export default function ImportModal({ isOpen, onClose }) {
  const [importing, setImporting] = useState(false);

  const handleFile = async (e) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setImporting(true);
    try {
      await importAppointments(file);
      notifySuccess("Arquivo enviado com sucesso! Aguarde o processamento.");
      onClose();
    } catch (err) {
      console.error("Erro ao importar:", err);
      notifyError(err.response?.data?.message || "Erro ao importar arquivo");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <Dialog.Panel className="relative w-full max-w-sm bg-white rounded-lg shadow-lg p-6 space-y-4">
        <Dialog.Title className="text-lg font-semibold text-gray-800">
          Importar Agendamentos
        </Dialog.Title>
        <div className="flex flex-col gap-3">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFile}
            className="w-full border rounded-md px-3 py-2 text-gray-700"
          />
          {importing && (
            <p className="text-sm text-gray-500">Enviando arquivo...</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-gray-600 hover:text-gray-800 transition"
        >
          Cancelar
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}
