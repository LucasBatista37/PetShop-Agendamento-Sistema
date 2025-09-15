import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "@/utils/Toast";
import api, { setAuthToken } from "@/api/api";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [form, setForm] = useState({ name: "", phone: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setAuthToken(token);
    }
  }, [navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/auth/me");
        const user = data.user || data;
        const { name = "", email = "", phone = "" } = user;
        setProfile({ name, email, phone });
        setForm({ name, phone });
      } catch (err) {
        notifyError(err.response?.data?.message || "Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await api.put("/auth/me", form);
      const user = data.user || data;
      const { name = "", email = "", phone = "" } = user;
      setProfile({ name, email, phone });
      notifySuccess("Perfil atualizado com sucesso");
    } catch (err) {
      notifyError(err.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      return notifyError("A nova senha e a confirmação não são iguais");
    }
    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      setPasswords({ current: "", new: "", confirm: "" });
      notifySuccess("Senha alterada com sucesso");
    } catch (err) {
      notifyError(err.response?.data?.message || "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/auth/me");
      notifySuccess("Conta excluída com sucesso");
      navigate("/login", { replace: true });
    } catch (err) {
      notifyError(err.response?.data?.message || "Erro ao excluir conta");
    } finally {
      setDeleting(false);
      setConfirmModalOpen(false);
    }
  };

  if (loading) {
    return (
      <p className="p-6 text-gray-500 text-center">
        Carregando configurações...
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Configurações de Conta
        </h1>
      </header>

      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Informações Pessoais
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nome
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              E-mail
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="mt-1 w-full bg-gray-100 border rounded-md px-3 py-2 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Telefone
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button
          onClick={handleUpdate}
          className="mt-6 bg-indigo-600 px-6 py-2 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Salvar alterações
        </button>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Alterar Senha
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {["current", "new", "confirm"].map((type, idx) => (
            <div
              key={type}
              className={`relative ${
                type === "confirm" ? "md:col-span-2" : ""
              }`}
            >
              <label className="block text-sm font-medium text-gray-600">
                {type === "current"
                  ? "Senha Atual"
                  : type === "new"
                  ? "Nova Senha"
                  : "Confirmar Nova Senha"}
              </label>
              <input
                type={
                  (type === "current" && showCurrent) ||
                  (type === "new" && showNew) ||
                  (type === "confirm" && showConfirm)
                    ? "text"
                    : "password"
                }
                value={passwords[type]}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, [type]: e.target.value }))
                }
                placeholder={
                  type === "current"
                    ? "Digite sua senha atual"
                    : type === "new"
                    ? "Digite a nova senha"
                    : "Confirme a nova senha"
                }
                className="mt-1 w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() =>
                  type === "current"
                    ? setShowCurrent((v) => !v)
                    : type === "new"
                    ? setShowNew((v) => !v)
                    : setShowConfirm((v) => !v)
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                aria-label="Mostrar/Esconder senha"
              >
                {(type === "current" && showCurrent) ||
                (type === "new" && showNew) ||
                (type === "confirm" && showConfirm) ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-600 mt-2">
          <Link
            to="/forgot-password"
            className="text-indigo-600 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </p>

        <button
          onClick={handlePasswordChange}
          className="mt-6 bg-indigo-600 px-6 py-2 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Alterar Senha
        </button>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
        <h2 className="text-xl font-medium text-red-600 mb-4">Excluir Conta</h2>
        <p className="text-sm text-gray-600 mb-4">
          Esta ação é permanente e apagará todos os seus dados.
        </p>
        <button
          onClick={() => setConfirmModalOpen(true)}
          className="bg-red-600 px-6 py-2 text-white rounded-md hover:bg-red-700 transition"
        >
          Excluir Conta
        </button>
      </section>

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir Conta"
        message="Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={deleting}
      />
    </div>
  );
}
