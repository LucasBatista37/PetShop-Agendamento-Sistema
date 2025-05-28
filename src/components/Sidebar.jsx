import {
  FaHome,
  FaCalendarAlt,
  FaDog,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col justify-between">
      <div className="px-6 pt-6">
        <div className="text-2xl font-bold text-indigo-600">PetAgende</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">
            General
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 ${
                    isActive ? "bg-indigo-100 font-medium" : ""
                  }`
                }
              >
                <FaHome className="w-5 h-5" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/appointments"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 ${
                    isActive ? "bg-indigo-100 font-medium" : ""
                  }`
                }
              >
                <FaCalendarAlt className="w-5 h-5" />
                Agendamentos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 ${
                    isActive ? "bg-indigo-100 font-medium" : ""
                  }`
                }
              >
                <FaDog className="w-5 h-5" />
                Serviços
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">
            Support
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
          <img
            src="/avatar-placeholder.png"
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">Lucas Batista</p>
            <p className="text-xs text-gray-500">lucas.batista@gmail.com</p>
          </div>
        </div>
        <button className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg w-full">
          <FaSignOutAlt className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
