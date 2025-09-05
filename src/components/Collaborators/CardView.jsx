import React from "react";
import { FaTrash } from "react-icons/fa";

export default function CardView({ data, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((c) => (
        <div
          key={c._id}
          className="rounded-lg border border-gray-200 p-4 relative group hover:shadow transition"
        >
          <div className="absolute top-3 right-3">
            <button
              title="Remover colaborador"
              className="text-red-600 hover:text-red-800"
              onClick={() => onDelete(c._id)}
            >
              <FaTrash />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase">
              {c.name?.charAt(0) || "?"}
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {c.name || "Sem nome"}
              </div>
              <div className="text-sm text-gray-500">{c.email}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center gap-2 bg-gray-100 text-sm px-2 py-1 rounded-full font-medium text-gray-700">
              {c.department || "—"}
            </span>
            <span
              className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                c.status === "Ativo"
                  ? "bg-blue-100 text-blue-700"
                  : c.status === "Pendente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-pink-100 text-pink-700"
              }`}
            >
              {c.status || "Pendente"}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-1">
            <strong>Cargo:</strong>{" "}
            {c.role === "admin" ? "Administrador" : "Colaborador"}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Data de Entrada:</strong>{" "}
            {c.inviteAcceptedAt
              ? new Date(c.inviteAcceptedAt).toLocaleDateString()
              : "Aguardando aceite"}
          </div>
        </div>
      ))}
    </div>
  );
}
