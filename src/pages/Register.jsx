import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "@/components/Modal";
import api, { setAuthToken } from "@/api/api";
import { notifySuccess, notifyError } from "@/utils/Toast";
import { helpTopics } from "@/data/helpData";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const termos = helpTopics[5];
  const politica = helpTopics[6];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, phone, password, confirmPassword, acceptTerms } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    if (!acceptTerms) {
      setError(
        "Você deve aceitar os Termos de Uso e a Política de Privacidade."
      );
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });
      if (data.token) {
        setAuthToken(data.token);
      }
      notifySuccess(
        "Cadastro realizado! Verifique seu e-mail para ativar sua conta."
      );
      navigate("/verifique-email", { replace: true });
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      let message = err.response?.data?.message || "Erro ao registrar.";

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        message = backendErrors[0].msg;
      }

      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
          Criar uma conta
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-500">
          Cadastre-se para começar a usar o PetCare
        </p>
      </div>

      {error && (
        <div className="mb-6 text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Nome
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            E-mail
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@exemplo.com"
              className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Telefone (opcional)
          </label>
          <div className="relative">
            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(11) 99999-0000"
              className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Senha
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 pl-11 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Confirmar Senha
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 pl-11 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={form.acceptTerms}
            onChange={handleChange}
            className="mt-1 mr-2"
            required
          />
          <p className="text-sm text-gray-600">
            Eu li e aceito os{" "}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-indigo-600 hover:underline"
            >
              Termos de Uso
            </button>{" "}
            e a{" "}
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="text-indigo-600 hover:underline"
            >
              Política de Privacidade
            </button>
            .
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      <p className="mt-10 text-sm text-center text-gray-500">
        Já possui conta?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-indigo-600 font-medium hover:underline cursor-pointer"
        >
          Entrar
        </span>
      </p>

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title={termos.title}
      >
        <div className="space-y-4">
          {termos.details.map((item) => (
            <div key={item.id}>
              <h3 className="font-semibold text-gray-800">{item.heading}</h3>
              <p className="text-gray-600 text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title={politica.title}
      >
        <div className="space-y-4">
          {politica.details.map((item) => (
            <div key={item.id}>
              <h3 className="font-semibold text-gray-800">{item.heading}</h3>
              <p className="text-gray-600 text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
