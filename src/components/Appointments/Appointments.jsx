import React, { useEffect, useMemo, useState } from "react";
import { parse, startOfWeek, getDay, startOfDay } from "date-fns";
import ptLocale from "date-fns/locale/pt";
import { dateFnsLocalizer } from "react-big-calendar";
import { AppointmentTable, ViewToggle } from "@/components/Appointments";
import CalendarComponent from "@/components/Appointments/CalendarComponent";
import NewAppointmentModal from "@/components/Appointments/NewAppointmentModal/NewAppointmentModal";
import {
  fetchAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "../../Api/api";
import { ToastContainer } from "react-toastify";
import { notifySuccess, notifyError } from "@/components/Toast";

const locales = { pt: ptLocale };
const localizer = dateFnsLocalizer({
  format: (d, fmt) => parse(d, fmt, new Date(), { locale: ptLocale }),
  parse: (v, fmt) => parse(v, fmt, new Date(), { locale: ptLocale }),
  startOfWeek: (d) => startOfWeek(d, { locale: ptLocale }),
  getDay,
  locales,
});

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [filterScope, setFilterScope] = useState("all");
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Erro ao carregar agendamentos"))
      .finally(() => setLoading(false));
  }, []);

  const patchStatus = (id, status) => {
    const appt = appointments.find((a) => a._id === id);
    if (appt) {
      updateAppointment(id, { ...appt, status })
        .then((res) => {
          setAppointments((prev) =>
            prev.map((a) => (a._id === id ? res.data : a))
          );
          notifySuccess("Status atualizado com sucesso");
        })
        .catch(() => notifyError("Erro ao atualizar status"));
    }
  };

  const finalizeAppointment = (id) => patchStatus(id, "Finalizado");

  const handleSave = (data) =>
    modalData?._id
      ? updateAppointment(modalData._id, data)
          .then((res) => {
            setAppointments((prev) =>
              prev.map((a) => (a._id === modalData._id ? res.data : a))
            );
            notifySuccess("Agendamento atualizado com sucesso");
            setModalData(null);
          })
          .catch(() => notifyError("Erro ao atualizar agendamento"))
      : createAppointment(data)
          .then((res) => {
            setAppointments((prev) => [...prev, res.data]);
            notifySuccess("Agendamento criado com sucesso");
            setModalData(null);
          })
          .catch(() => notifyError("Erro ao criar agendamento"));

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
        const [y, m, d] = a.date.slice(0, 10).split("-").map(Number);
        if (startOfDay(new Date(y, m - 1, d)) < today) return false;
      }
      if (filterStatus !== "Todos" && a.status !== filterStatus) return false;
      const term = search.toLowerCase();
      return (
        a.petName.toLowerCase().includes(term) ||
        a.ownerName.toLowerCase().includes(term) ||
        a.date.slice(0, 10).includes(term)
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
        const start = new Date(a.date);
        const [h, m] = a.time.split(":").map(Number);
        start.setHours(h, m);
        return {
          ...a,
          title: `${a.petName} - ${
            a.baseService && typeof a.baseService === "object"
              ? a.baseService.name
              : a.baseService || "Serviço desconhecido"
          }`,
          start,
          end: new Date(start.getTime() + 60 * 60 * 1000),
        };
      }),
    [appointments]
  );

  if (loading)
    return <p className="p-6 text-gray-500 text-center">Carregando...</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">
            Gerenciamento de Agendamentos
          </h1>
          <button
            onClick={() => setModalData({})}
            className="bg-indigo-600 px-6 py-2 text-lg text-white rounded-md hover:bg-indigo-700 transition"
          >
            + Novo
          </button>
        </div>
      </header>

      {view === "list" ? (
        <AppointmentTable
          data={filtered}
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
        />
      ) : (
        <CalendarComponent
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
      )}

      <NewAppointmentModal
        isOpen={modalData !== null}
        initialData={modalData}
        onClose={() => setModalData(null)}
        appointments={appointments}
        onSave={handleSave}
      />
    </div>
  );
}
