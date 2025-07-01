import React from "react";
import { FaEllipsisV } from "react-icons/fa";

export default function ListView({ data }) {
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
            <tr key={c.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase">
                    {c.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{c.name}</div>
                    <div className="text-sm text-gray-500">{c.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-2 bg-gray-100 text-sm px-2 py-1 rounded-full font-medium text-gray-700">
                  {c.department}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{c.role}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(c.joinedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
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
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => alert(`Ações para ${c.name}`)}
                >
                  <FaEllipsisV />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
