import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import Modal from "@/components/Modal"; // ajuste o caminho se necessário

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

  // Estados para abrir modais
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        phone,
        password,
      });
      alert("Cadastro realizado! Verifique seu e-mail para ativar sua conta.");
      navigate("/verifique-email", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar.");
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
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Confirmar Senha
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* ✅ Checkbox de aceitação */}
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

      {/* ✅ Modais */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Termos de Uso"
      >
        <p>
          Bem-vindo ao PetCare! Ao criar uma conta e utilizar nossos serviços,
          você concorda em cumprir integralmente estes Termos de Uso.
        </p>

        <p>
          <strong>1. Cadastro:</strong> Para utilizar nossa plataforma, é
          necessário fornecer informações verdadeiras, completas e atualizadas.
          Você é responsável por manter suas credenciais de acesso em segurança.
        </p>

        <p>
          <strong>2. Uso Adequado:</strong> É proibido utilizar o PetCare para
          qualquer finalidade ilegal, abusiva ou que infrinja direitos de
          terceiros. Qualquer violação poderá resultar em suspensão ou
          cancelamento de sua conta.
        </p>

        <p>
          <strong>3. Propriedade Intelectual:</strong> Todo o conteúdo da
          plataforma, incluindo textos, imagens, logotipos e códigos-fonte, é de
          propriedade exclusiva do PetCare ou de seus licenciadores, sendo
          protegido por leis de direitos autorais.
        </p>

        <p>
          <strong>4. Modificações:</strong> O PetCare se reserva o direito de
          alterar estes Termos de Uso a qualquer momento, sendo de
          responsabilidade do usuário verificar periodicamente as atualizações.
        </p>

        <p>
          <strong>5. Contato:</strong> Em caso de dúvidas ou sugestões sobre
          estes Termos, entre em contato com nossa equipe de suporte através dos
          canais oficiais.
        </p>

        <p>Última atualização: [Data Atual].</p>
      </Modal>

      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Política de Privacidade"
      >
        <p>
          Esta Política de Privacidade descreve como o PetCare coleta, utiliza,
          armazena e protege suas informações pessoais.
        </p>

        <p>
          <strong>1. Coleta de Informações:</strong> Coletamos informações
          pessoais fornecidas voluntariamente por você no momento do cadastro,
          como nome, e-mail e telefone. Também podemos coletar dados de uso e
          navegação para melhorar nossos serviços.
        </p>

        <p>
          <strong>2. Uso das Informações:</strong> Utilizamos seus dados para
          viabilizar a criação de conta, personalizar sua experiência, enviar
          comunicações importantes e fornecer suporte técnico.
        </p>

        <p>
          <strong>3. Compartilhamento:</strong> O PetCare não compartilha suas
          informações pessoais com terceiros, exceto quando necessário para
          cumprir obrigações legais ou mediante seu consentimento expresso.
        </p>

        <p>
          <strong>4. Segurança:</strong> Adotamos medidas de segurança técnicas
          e organizacionais para proteger seus dados contra acesso não
          autorizado, perda ou destruição.
        </p>

        <p>
          <strong>5. Direitos do Usuário:</strong> Você pode, a qualquer
          momento, acessar, corrigir ou excluir seus dados pessoais, bem como
          revogar o consentimento, entrando em contato com nossa equipe de
          suporte.
        </p>

        <p>
          <strong>6. Alterações:</strong> Esta Política poderá ser atualizada
          periodicamente. Recomenda-se revisá-la regularmente para estar ciente
          de eventuais modificações.
        </p>

        <p>Última atualização: [Data Atual].</p>
      </Modal>
    </>
  );
}
