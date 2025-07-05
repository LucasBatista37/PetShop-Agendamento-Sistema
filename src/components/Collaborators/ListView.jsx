import React from "react";
import { FaTrash } from "react-icons/fa";

export default function ListView({ data, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-md overflow-hidden">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Departamento</th>
            <th className="px-4 py-3">Cargo</th>
            <th className="px-4 py-3">Data de Entrada</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((c) => (
            <tr key={c._id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase">
                    {c.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {c.name || "Sem nome"}
                    </div>
                    <div className="text-sm text-gray-500">{c.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-2 bg-gray-100 text-sm px-2 py-1 rounded-full font-medium text-gray-700">
                  {c.department || "—"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">
                {c.role === "admin" ? "Administrador" : "Colaborador"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {c.inviteAcceptedAt
                  ? new Date(c.inviteAcceptedAt).toLocaleDateString()
                  : "Aguardando aceite"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    c.status === "Ativo"
                      ? "bg-blue-100 text-blue-700"
                      : c.status === "Pendente"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-pink-100 text-pink-700"
                  }`}
                >
                  {c.status || "Pendente"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  title="Remover colaborador"
                  className="text-red-600 hover:text-red-800"
                  onClick={() => onDelete(c._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
