import React from "react";
import { FaSearch, FaCalendarAlt, FaCalendarWeek } from "react-icons/fa";

export default function TableFilters({
  filterScope,
  setFilterScope,
  scopeMenuOpen,
  setScopeMenuOpen,
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  view,
  setView,
}) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
      <div className="relative">
        <button
          onClick={() => setScopeMenuOpen((o) => !o)}
          className="flex items-center gap-2 border border-gray-300 bg-white rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
        >
          <FaCalendarAlt className="text-gray-600" />
          {filterScope === "all" ? "Todos Agendamentos" : "Hoje e Futuros"}
        </button>
        {scopeMenuOpen && (
          <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <button
              onClick={() => {
                setFilterScope("all");
                setScopeMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Todos Agendamentos
            </button>
            <button
              onClick={() => {
                setFilterScope("future");
                setScopeMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Hoje e Futuros
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 bg-white rounded-md px-4 py-2 text-gray-700"
        >
          {["Todos", "Confirmado", "Pendente", "Cancelado", "Finalizado"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>

        <button
          onClick={() => setView("list")}
          className={`p-2 rounded-md ${
            view === "list"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaCalendarAlt />
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`p-2 rounded-md ${
            view === "calendar"
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaCalendarWeek />
        </button>
      </div>
    </div>
  );
}
