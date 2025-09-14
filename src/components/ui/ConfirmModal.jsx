import React from "react";
import { Dialog } from "@headlessui/react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  message = "Você tem certeza que deseja prosseguir?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <Dialog.Panel className="relative w-full sm:max-w-md h-full sm:h-auto bg-white flex flex-col rounded-none sm:rounded-lg shadow-lg">
        <header className="sticky top-0 bg-white/95 px-4 sm:px-6 py-4 flex items-center justify-between rounded-none sm:rounded-t-lg z-10">
          <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-800">
            {title}
          </Dialog.Title>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-gray-600">{message}</p>
        </div>

        <footer className="sticky bottom-0 bg-white/95 px-4 sm:px-6 py-4 flex justify-end gap-2 rounded-none sm:rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processando..." : confirmText}
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}
