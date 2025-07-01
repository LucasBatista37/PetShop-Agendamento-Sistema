import {
  FaHome,
  FaCalendarAlt,
  FaBriefcase,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/api";
import { FaUsers } from "react-icons/fa";

export default function Sidebar({ isOpen, onClose }) {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside
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
            <li>
              <NavLink to="/collaborators" className={navLinkClass}>
                <FaUsers className="w-5 h-5" />
                Colaboradores
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">
            Suporte
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100"
              >
                <FaCog className="w-5 h-5" />
                Configurações
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/help"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100"
              >
                <FaQuestionCircle className="w-5 h-5" />
                Ajuda
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

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
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg w-full"
        >
          <FaSignOutAlt className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
