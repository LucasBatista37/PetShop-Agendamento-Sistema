import React, { useState, useMemo } from "react";
import IconButton from "./IconButton";
import AppointmentDetails from "./AppointmentDetails";
import {
  FaEdit,
  FaEye,
  FaSearch,
  FaCalendarAlt,
  FaCalendarWeek,
  FaEllipsisV,
  FaTrash,
} from "react-icons/fa";
import { format, parseISO } from "date-fns";

export default function AppointmentTable({
  data = [],
  onEdit,
  onStatusChange,
  onDelete,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const paginatedData = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };
  const prevPage = () => goToPage(currentPage - 1);
  const nextPage = () => goToPage(currentPage + 1);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {selected && (
        <AppointmentDetails
          open={!!selected}
          data={selected}
          onClose={() => setSelected(null)}
        />
      )}

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

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Pet</th>
            <th className="px-6 py-3">Dono</th>
            <th className="px-6 py-3">Serviços</th>
            <th className="px-6 py-3">Data / Hora</th>
            <th className="px-6 py-3">Preço</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-gray-400">
                Nenhum agendamento encontrado.
              </td>
            </tr>
          ) : (
            paginatedData.map((appointment, idx) => {
              const {
                _id,
                petName,
                ownerName,
                ownerPhone,
                baseService,
                extraServices = [],
                date,
                time,
                price,
                status,
              } = appointment;

              const statusClass = {
                Confirmado: "bg-blue-100 text-blue-700",
                Pendente: "bg-yellow-100 text-yellow-700",
                Cancelado: "bg-red-100 text-red-700",
                Finalizado: "bg-green-100 text-green-700",
              }[status] || "bg-gray-100 text-gray-700";

              const baseServiceName =
                typeof baseService === "object"
                  ? baseService?.name
                  : "—";
              const extraServiceNames =
                Array.isArray(extraServices) &&
                extraServices
                  .map((e) => (typeof e === "object" ? e.name : ""))
                  .filter(Boolean)
                  .join(", ");

              return (
                <tr
                  key={_id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {startIndex + idx + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {petName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-800">{ownerName}</span>
                      <span className="text-xs text-gray-400">{ownerPhone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-800">
                        {baseServiceName || "—"}
                      </span>
                      {extraServiceNames && (
                        <span className="text-xs text-gray-500">
                          Extras: {extraServiceNames}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {format(parseISO(date), "dd/MM/yyyy")} às {time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {price ? `R$ ${price}` : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-flex items-center gap-2">
                      <IconButton
                        title="Visualizar"
                        onClick={() => setSelected(appointment)}
                        icon={FaEye}
                        className="text-gray-600 hover:text-indigo-600"
                      />
                      <IconButton
                        title="Editar"
                        onClick={() => onEdit(appointment)}
                        icon={FaEdit}
                        className="text-blue-600 hover:text-blue-800"
                      />
                      <IconButton
                        title="Excluir"
                        onClick={() => onDelete(_id)}
                        icon={FaTrash}
                        className="text-red-600 hover:text-red-800"
                      />
                      <div className="relative">
                        <IconButton
                          title="Alterar Status"
                          onClick={() =>
                            setStatusMenuOpen((open) =>
                              open === _id ? null : _id
                            )
                          }
                          icon={FaEllipsisV}
                          className="text-gray-600 hover:text-gray-900"
                        />
                        {statusMenuOpen === _id && (
                          <div className="absolute z-10 right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg">
                            {["Pendente", "Confirmado", "Finalizado", "Cancelado"].map(
                              (option) => (
                                <button
                                  key={option}
                                  onClick={() => {
                                    onStatusChange(_id, option);
                                    setStatusMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {option}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>Linhas por página:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="mt-1 block pl-2 pr-8 py-1 text-sm border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-1 rounded-md ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  page === currentPage
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-1 rounded-md ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
