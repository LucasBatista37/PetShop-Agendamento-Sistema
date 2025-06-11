import { Dialog } from "@headlessui/react";
import { FiX, FiSend } from "react-icons/fi";
import { useState } from "react";
import { notifySuccess, notifyError } from "../../utils/Toast";
import { sendSupportMessage } from "../../Api/api";

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
    try {
      if (!form.name || !form.email || !form.subject || !form.message) {
        notifyError("Preencha todos os campos obrigatórios.");
        setLoading(false);
        return;
      }

      await sendSupportMessage(form);
      notifySuccess("Mensagem enviada! Responderemos em breve 🙂");
      setForm({ name: "", email: "", subject: "", message: "" });
      onClose();
    } catch {
      notifyError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-xl p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Fechar"
        >
          <FiX size={20} />
        </button>

        <Dialog.Title className="text-xl font-semibold text-gray-800">
          Fale com o Suporte
        </Dialog.Title>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Seu nome *"
          className={input}
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Seu e-mail *"
          className={input}
          required
        />
        <input
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="Assunto *"
          className={input}
          required
        />
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Descreva o problema ou a dúvida *"
          className={input}
          required
        />

        <button
          disabled={loading}
          onClick={submit}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          <FiSend />
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}
