import {
  FaHome,
  FaCalendarAlt,
  FaDog,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaChartLine,
  FaBolt,
  FaCog,
  FaShieldAlt,
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
                to="/pets"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 ${
                    isActive ? "bg-indigo-100 font-medium" : ""
                  }`
                }
              >
                <FaDog className="w-5 h-5" />
                Pets
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <p className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">
            Tools
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/product"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100"
              >
                <FaBoxOpen className="w-5 h-5" />
                Produto
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/invoice"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100"
              >
                <FaFileInvoiceDollar className="w-5 h-5" />
                Faturas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analytics"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100"
              >
                <FaChartLine className="w-5 h-5" />
                Analytics
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/automation"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100"
              >
                <FaBolt className="w-5 h-5" />
                Automação{" "}
                <span className="ml-auto text-xs bg-indigo-200 text-indigo-800 px-1 rounded">
                  Beta
                </span>
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
                to="/security"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100"
              >
                <FaShieldAlt className="w-5 h-5" />
                Segurança
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

      <div className="mx-4 mb-6 p-4 bg-indigo-50 rounded-lg text-center">
        <p className="text-sm text-indigo-700 mb-2">Use nosso plano Pro!</p>
        <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Upgrade
        </button>
      </div>

      <div className="px-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/avatar-placeholder.png"
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">Rafael Almeida</p>
            <p className="text-xs text-gray-500">@raphael.k.business</p>
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
