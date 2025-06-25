import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiX, FiSend } from "react-icons/fi";
import { notifySuccess, notifyError } from "../../utils/Toast";
import { sendSupportMessage } from "@/api/api";

export default function SupportMessageModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const submit = async () => {
    setLoading(true);
    if (!form.name || !form.email || !form.subject || !form.message) {
      notifyError("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }
    try {
      await sendSupportMessage(form);
      notifySuccess("Mensagem enviada! Responderemos em breve 🙂");
      setForm({ name: "", email: "", subject: "", message: "" });
      onClose();
    } catch (err) {
      console.error("Erro ao enviar suporte:", err);
      notifyError(
        err.response?.data?.message || "Erro ao enviar. Tente novamente."
      );
    } finally {
      setLoading(false);
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

      <Dialog.Panel
        className="
        relative
        w-full h-full
        sm:max-w-lg sm:h-auto
        bg-white flex flex-col
        rounded-none sm:rounded-xl
        shadow-lg
      "
      >
        <header
          className="
          sticky top-0
          bg-white/95
          px-4 sm:px-6 py-4
          flex items-center justify-between
          rounded-none sm:rounded-t-xl
          z-10
        "
        >
          <Dialog.Title className="text-xl font-semibold text-gray-800">
            Fale com o Suporte
          </Dialog.Title>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded hover:bg-gray-100 text-gray-500"
          >
            <FiX size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Seu nome *"
            className={inputBase}
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Seu e-mail *"
            className={inputBase}
          />
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Assunto *"
            className={inputBase}
          />
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Descreva o problema ou a dúvida *"
            className={inputBase}
          />
        </div>

        <footer
          className="
          sticky bottom-0
          bg-white/95
          px-4 sm:px-6 py-4
          rounded-none sm:rounded-b-xl
        "
        >
          <button
            disabled={loading}
            onClick={submit}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md disabled:opacity-50"
          >
            <FiSend />
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </footer>
      </Dialog.Panel>
    </Dialog>
  );
}
