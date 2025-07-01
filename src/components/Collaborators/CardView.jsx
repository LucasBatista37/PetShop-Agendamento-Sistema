import React from "react";
import { FaEllipsisV } from "react-icons/fa";

export default function CardView({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((c) => (
        <div
          key={c.id}
          className="rounded-lg border border-gray-200 p-4 relative group hover:shadow transition"
        >
          <div className="absolute top-3 right-3">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => alert(`Ações para ${c.name}`)}
            >
              <FaEllipsisV />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase">
              {c.name?.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-800">{c.name}</div>
              <div className="text-sm text-gray-500">{c.email}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center gap-2 bg-gray-100 text-sm px-2 py-1 rounded-full font-medium text-gray-700">
              {c.department}
            </span>
            <span
              className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                c.status === "Ativo"
                  ? "bg-blue-100 text-blue-700"
                  : c.status === "Freelance"
                  ? "bg-green-100 text-green-700"
                  : c.status === "Estágio"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-pink-100 text-pink-700"
              }`}
            >
              {c.status}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-1">
            <strong>Cargo:</strong> {c.role}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Data de Entrada:</strong>{" "}
            {new Date(c.joinedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
