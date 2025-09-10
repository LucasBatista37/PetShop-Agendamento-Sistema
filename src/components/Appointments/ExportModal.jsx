import { Dialog } from "@headlessui/react";

export default function ExportModal({ isOpen, onClose, onExportCSV, onExportXLSX }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <Dialog.Panel className="relative w-full max-w-sm bg-white rounded-lg shadow-lg p-6 space-y-4">
        <Dialog.Title className="text-lg font-semibold text-gray-800">
          Escolha o formato de exportação
        </Dialog.Title>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onExportCSV();
              onClose();
            }}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            CSV
          </button>
          <button
            onClick={() => {
              onExportXLSX();
              onClose();
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Planilha Excel
          </button>
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
