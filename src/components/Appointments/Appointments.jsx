import React, { useEffect, useMemo, useState } from "react";
import { parseISO, startOfWeek, getDay, startOfDay } from "date-fns";
import ptLocale from "date-fns/locale/pt";
import { dateFnsLocalizer } from "react-big-calendar";
import { AppointmentTable } from "@/components/Appointments";
import CalendarComponent from "@/components/Appointments/CalendarComponent";
import NewAppointmentModal from "@/components/Appointments/NewAppointmentModal/NewAppointmentModal";
import ImportModal from "./ImportModal";
import ExportModal from "./ExportModal";
import {
  fetchAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "@/api/api";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "../../utils/Toast";
import * as XLSX from "xlsx";
import { FaFileExport, FaFileImport, FaPlus } from "react-icons/fa";
import PrimaryButton from "@/components/ui/PrimaryButton";

const locales = { pt: ptLocale };
const localizer = dateFnsLocalizer({
  format: (date, formatStr) => date.toLocaleString(),
  parse: (value, formatStr) => parseISO(value),
  startOfWeek: (date) => startOfWeek(date, { locale: ptLocale }),
  getDay,
  locales,
});

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [filterScope, setFilterScope] = useState("all");
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [modalData, setModalData] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAppointments({ page: currentPage, limit: rowsPerPage })
      .then((res) => {
        setAppointments(res.data.data || []);
        setTotalPages(res.data.totalPages);
        setTotalDocs(res.data.totalItems);
      })
      .catch(() => setError("Erro ao carregar agendamentos"))
      .finally(() => setLoading(false));
  }, [currentPage, rowsPerPage]);

  const patchStatus = (id, status) => {
    const appt = appointments.find((a) => a._id === id);
    if (!appt) return;
    updateAppointment(id, { ...appt, status })
      .then((res) => {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? res.data : a))
        );
        notifySuccess("Status atualizado com sucesso");
      })
      .catch(() => notifyError("Erro ao atualizar status"));
  };
  const finalizeAppointment = (id) => patchStatus(id, "Finalizado");

  const handleSave = (data) => {
    if (modalData?._id) {
      updateAppointment(modalData._id, data)
        .then((res) => {
          setAppointments((prev) =>
            prev.map((a) => (a._id === modalData._id ? res.data : a))
          );
          notifySuccess("Agendamento atualizado com sucesso");
          setModalData(null);
        })
        .catch(() => notifyError("Erro ao atualizar agendamento"));
    } else {
      createAppointment(data)
        .then((res) => {
          setAppointments((prev) => [...prev, res.data]);
          notifySuccess("Agendamento criado com sucesso");
          setModalData(null);
        })
        .catch(() => notifyError("Erro ao criar agendamento"));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Deseja excluir este agendamento?")) return;
    deleteAppointment(id)
      .then(() => {
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        notifySuccess("Agendamento excluído com sucesso");
      })
      .catch(() => notifyError("Erro ao excluir agendamento"));
  };

  const today = startOfDay(new Date());
  const filtered = useMemo(() => {
    const base = appointments.filter((a) => {
      if (filterScope === "future") {
        const dateObj = startOfDay(parseISO(a.date));
        if (dateObj < today) return false;
      }
      if (filterStatus !== "Todos" && a.status !== filterStatus) return false;
      const term = search.toLowerCase();
      return (
        a.petName.toLowerCase().includes(term) ||
        a.ownerName.toLowerCase().includes(term) ||
        a.date.includes(term)
      );
    });
    return base.sort((a, b) => {
      const dtA = new Date(`${a.date}T${a.time}`);
      const dtB = new Date(`${b.date}T${b.time}`);
      return dtB - dtA;
    });
  }, [appointments, filterScope, filterStatus, search, today]);

  const events = useMemo(
    () =>
      appointments.map((a) => {
        const start = parseISO(a.date);
        const [h, m] = a.time.split(":").map(Number);
        start.setHours(h, m);
        return {
          ...a,
          title: `${a.petName} - ${
            a.baseService?.name || a.baseService || "Serviço desconhecido"
          }`,
          start,
          end: new Date(start.getTime() + 60 * 60 * 1000),
        };
      }),
    [appointments]
  );

  const exportCSV = () => {
    if (filtered.length === 0) {
      notifyError("Nenhum agendamento para exportar.");
      return;
    }
    const headers = [
      "Pet",
      "Dono",
      "Telefone",
      "Serviço Base",
      "Serviços Extras",
      "Data",
      "Hora",
      "Status",
      "Notas",
    ];
    const rows = filtered.map((a) => [
      a.petName,
      a.ownerName,
      a.ownerPhone,
      a.baseService?.name || a.baseService || "-",
      a.extraServices?.map((e) => e.name || e).join(", ") || "-",
      a.date,
      a.time,
      a.status,
      a.notes || "-",
    ]);
    const csv =
      [headers, ...rows]
        .map((r) =>
          r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agendamentos.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifySuccess("Exportação CSV concluída!");
  };

  const exportXLSX = () => {
    if (filtered.length === 0) {
      notifyError("Nenhum agendamento para exportar.");
      return;
    }
    const aoa = [
      [
        "Pet",
        "Dono",
        "Telefone",
        "Serviço Base",
        "Serviços Extras",
        "Data",
        "Hora",
        "Status",
        "Notas",
      ],
      ...filtered.map((a) => [
        a.petName,
        a.ownerName,
        a.ownerPhone,
        a.baseService?.name || a.baseService || "-",
        a.extraServices?.map((e) => e.name || e).join(", ") || "-",
        a.date,
        a.time,
        a.status,
        a.notes || "-",
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agendamentos");
    XLSX.writeFile(wb, "agendamentos.xlsx");
    notifySuccess("Exportação Excel concluída!");
  };

  if (loading)
    return <p className="p-4 text-gray-500 text-center">Carregando...</p>;
  if (error) return <p className="p-4 text-red-600 text-center">{error}</p>;

  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <header className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Gerenciamento de Agendamentos
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <PrimaryButton
                onClick={() => setImportModalOpen(true)}
                icon={FaFileImport}
                color="blue-600"
              >
                Importar
              </PrimaryButton>

              <PrimaryButton
                onClick={() => setExportModalOpen(true)}
                icon={FaFileExport}
                color="green-600"
              >
                Exportar
              </PrimaryButton>

              <PrimaryButton
                onClick={() => setModalData({})}
                icon={FaPlus}
                color="indigo-600"
              >
                Novo
              </PrimaryButton>
            </div>
          </div>
        </header>

        {view === "list" ? (
          <AppointmentTable
            data={appointments}
            onConfirm={(id) => patchStatus(id, "Confirmado")}
            onEdit={(appt) => setModalData(appt)}
            onCancel={(id) => patchStatus(id, "Cancelado")}
            onStatusChange={patchStatus}
            onDelete={handleDelete}
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
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalPages={totalPages}
            onReload={() =>
              fetchAppointments({ page: currentPage, limit: rowsPerPage }).then(
                (res) => {
                  setAppointments(res.data.data);
                  setTotalPages(res.data.totalPages);
                  setTotalDocs(res.data.totalItems);
                }
              )
            }
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 h-[70vh]">
              <CalendarComponent
                localizer={localizer}
                events={events}
                onFinalize={finalizeAppointment}
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
            </div>
          </div>
        )}

        <ImportModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
        />
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onExportCSV={exportCSV}
          onExportXLSX={exportXLSX}
        />

        <NewAppointmentModal
          isOpen={modalData !== null}
          initialData={modalData}
          onClose={() => setModalData(null)}
          appointments={appointments}
          onSave={handleSave}
        />
      </div>

      <ToastContainer position="bottom-right" />
    </>
  );
}
