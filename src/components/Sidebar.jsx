import {
  FaHome,
  FaCalendarAlt,
  FaBriefcase,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { logoutUser, createCheckoutSession } from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const [user, setUser] = useState({ name: "", email: "" });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.error("Erro ao buscar usuário", error);
      }
    };
    fetchUser();
  }, []);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 ${
      isActive ? "bg-indigo-100 font-medium" : ""
    }`;

  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Erro ao sair:", err);
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  const handleUpgrade = async () => {
    if (!user.email) return;

    try {
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID;
      const checkoutUrl = await createCheckoutSession(priceId, user.email);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Falha ao iniciar o pagamento:", err);
      alert("Não foi possível iniciar o pagamento. Tente novamente.");
    }
  };

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className={`fixed z-40 md:static top-0 left-0 h-full w-64 bg-white border-r flex flex-col justify-between transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="px-6 pt-6 flex justify-between items-center md:block">
        <div className="text-2xl font-bold text-indigo-600">PetCare</div>
        <button className="md:hidden text-gray-500" onClick={onClose}>
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">
            Geral
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/dashboard" className={navLinkClass}>
                <FaHome className="w-5 h-5" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/appointments" className={navLinkClass}>
                <FaCalendarAlt className="w-5 h-5" />
                Agendamentos
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={navLinkClass}>
                <FaBriefcase className="w-5 h-5" />
                Serviços
              </NavLink>
            </li>

            {user.role !== "collaborator" && (
              <li>
                <NavLink to="/collaborators" className={navLinkClass}>
                  <FaUsers className="w-5 h-5" />
                  Colaboradores
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        <div className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">
            Suporte
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink to="/settings" className={navLinkClass}>
                <FaCog className="w-5 h-5" />
                Configurações
              </NavLink>
            </li>
            <li>
              <NavLink to="/help" className={navLinkClass}>
                <FaQuestionCircle className="w-5 h-5" />
                Ajuda
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mx-4 mb-6 p-4 bg-indigo-50 rounded-lg text-center">
        {user.role === "collaborator" ? (
          <p className="text-gray-500 font-semibold">
            Upgrade indisponível para colaboradores
          </p>
        ) : ["active", "trialing"].includes(user.subscription?.status) ? (
          <p className="text-green-600 font-semibold">
            Plano Premium ativo{" "}
            {user.subscription?.status === "trialing" && "(Teste)"}
          </p>
        ) : (
          <button
            onClick={handleUpgrade}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Upgrade
          </button>
        )}
      </div>

      <div className="px-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg w-full"
        >
          <FaSignOutAlt className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
