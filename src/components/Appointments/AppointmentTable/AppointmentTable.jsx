import React, { useState, useMemo } from "react";
import IconButton from "../IconButton";
import AppointmentDetails from "../AppointmentDetails";
import TableFilters from "./TableFilters";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
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
            paginatedData.map((appointment, idx) => (
              <TableRow
                key={appointment._id}
                appointment={appointment}
                index={startIndex + idx}
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
