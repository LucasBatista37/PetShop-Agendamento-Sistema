import React, { useState } from "react";
import TableFilters from "./TableFilters";
import Pagination from "./Pagination";
import TableRow from "./TableRow";
import { parseISO, format } from "date-fns";
import AppointmentDetails from "../AppointmentDetails";

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
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  totalPages,
  onReload,
}) {
  const [selected, setSelected] = useState(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);

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

      <TableFilters
        filterScope={filterScope}
        setFilterScope={setFilterScope}
        scopeMenuOpen={scopeMenuOpen}
        setScopeMenuOpen={setScopeMenuOpen}
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        view={view}
        setView={setView}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 hidden md:table">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Pet</th>
              <th className="px-4 py-2">Dono</th>
              <th className="px-4 py-2 hidden md:table-cell">Serviços</th>
              <th className="px-4 py-2 hidden sm:table-cell">Data / Hora</th>
              <th className="px-4 py-2 hidden lg:table-cell">Preço</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-2 text-center text-gray-400">
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            ) : (
              data.map((appointment, idx) => (
                <TableRow
                  key={appointment._id}
                  appointment={appointment}
                  index={(currentPage - 1) * rowsPerPage + idx}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  setSelected={setSelected}
                  statusMenuOpen={statusMenuOpen}
                  setStatusMenuOpen={setStatusMenuOpen}
                />
              ))
            )}
          </tbody>
        </table>

        <div className="md:hidden space-y-4 px-4 py-2">
          {data.map((appointment) => {
            const statusClass =
              {
                Confirmado: "bg-blue-100 text-blue-700",
                Pendente: "bg-yellow-100 text-yellow-700",
                Cancelado: "bg-red-100 text-red-700",
                Finalizado: "bg-green-100 text-green-700",
              }[appointment.status] || "bg-gray-100 text-gray-700";

            return (
              <div
                key={appointment._id}
                onClick={() => setSelected(appointment)}
                className="bg-white rounded-lg shadow p-4 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    {appointment.petName}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass}`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Dono: {appointment.ownerName}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Data: {format(parseISO(appointment.date), "dd/MM/yyyy")} às{" "}
                  {appointment.time}
                </div>
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEdit(appointment)}
                    className="flex-1 text-center py-1 bg-blue-100 rounded hover:bg-blue-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(appointment._id)}
                    className="flex-1 text-center py-1 bg-red-100 rounded hover:bg-red-200"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Pagination
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </div>
  );
}
