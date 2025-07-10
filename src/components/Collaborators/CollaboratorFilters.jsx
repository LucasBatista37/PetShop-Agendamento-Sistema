import React from "react";
import { FaSearch, FaList, FaTh } from "react-icons/fa";

export default function CollaboratorFilters({
  search,
  setSearch,
  view,
  setView,
  total, 
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div className="text-gray-700 font-medium">
        Total de colaboradores: <span className="font-bold">{total}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome ou email"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={() => setView("list")}
          title="Exibir como lista"
          className={`p-2 rounded-md border ${
            view === "list"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "text-gray-600 hover:bg-gray-100 border-gray-300"
          }`}
        >
          <FaList />
        </button>
        <button
          onClick={() => setView("card")}
          title="Exibir como cards"
          className={`p-2 rounded-md border ${
            view === "card"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "text-gray-600 hover:bg-gray-100 border-gray-300"
          }`}
        >
          <FaTh />
        </button>
      </div>
    </div>
  );
}
