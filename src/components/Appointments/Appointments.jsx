import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { parse, startOfWeek, getDay, startOfDay } from "date-fns";
import ptLocale from "date-fns/locale/pt";
import { dateFnsLocalizer } from "react-big-calendar";
import { AppointmentTable, ViewToggle } from "@/components/Appointments";
import CalendarComponent from "@/components/Appointments/CalendarComponent";
import NewAppointmentModal from "@/components/Appointments/NewAppointmentModal/NewAppointmentModal";
import { FaCalendarAlt, FaCalendarWeek } from "react-icons/fa";

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
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Erro ao carregar agendamentos"))
      .finally(() => setLoading(false));
  }, []);

  const api = axios.create({
    baseURL: "http://localhost:5000/api/appointments",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const createAppointment = async (data) => {
    try {
      const res = await api.post("/", {
        petName: data.petName,
        species: data.species,
        breed: data.breed,
        notes: data.notes,
        size: data.size,
        ownerName: data.ownerName,
        ownerPhone: data.ownerPhone,
        baseService: data.baseService._id,
        extraServices: data.extraServices.map((s) => s._id),
        date: data.date,
        time: data.time,
        status: "Pendente",
      });
      setAppointments((p) => [...p, res.data]);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar agendamento");
    }
  };

  const updateAppointment = async (id, data) => {
    try {
      const res = await api.put(`/${id}`, {
        ...data,
        baseService: data.baseService._id,
        extraServices: data.extraServices.map((s) => s._id),
      });
      setAppointments((p) => p.map((a) => (a._id === id ? res.data : a)));
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar agendamento");
    }
  };

  const patchStatus = (id, status) => {
    const appt = appointments.find((a) => a._id === id);
    if (appt) updateAppointment(id, { ...appt, status });
  };
  const finalizeAppointment = (id) => patchStatus(id, "Finalizado");

  const handleSave = (data) =>
    modalData?._id
      ? updateAppointment(modalData._id, data).then(() => setModalData(null))
      : createAppointment(data).then(() => setModalData(null));

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
            typeof a.baseService === "object"
              ? a.baseService.name
              : a.baseService
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
