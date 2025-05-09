import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ptLocale from "date-fns/locale/pt";
import { dateFnsLocalizer } from "react-big-calendar";
import { AppointmentTable, ViewToggle } from "@/components/Appointments";
import CalendarComponent from "@/components/Appointments/CalendarComponent";
import NewAppointmentModal from "@/components/Appointments/NewAppointmentModal/NewAppointmentModal";
import { FaCalendarAlt, FaCalendarWeek, FaSearch } from "react-icons/fa";

const locales = { pt: ptLocale };
const localizer = dateFnsLocalizer({
  format,
  parse: (v, fmt) => parse(v, fmt, new Date(), { locale: ptLocale }),
  startOfWeek: (d) => startOfWeek(d, { locale: ptLocale }),
  getDay,
  locales,
});

export default function Appointments() {
  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: "http://localhost:5000/api/appointments",
    headers: { Authorization: `Bearer ${token}` },
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("list");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/");
        setAppointments(res.data);
      } catch {
        setError("Erro ao carregar agendamentos");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const events = useMemo(
    () =>
      appointments.map((a) => {
        const start = new Date(a.date);
        const [h, m] = a.time.split(":").map(Number);
        start.setHours(h, m);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return {
          ...a,
          title: `${a.petName} - ${
            typeof a.baseService === "object"
              ? a.baseService.name
              : a.baseService
          }`,
          start,
          end,
        };
      }),
    [appointments]
  );

  const filtered = appointments.filter((a) => {
    if (filterStatus !== "Todos" && a.status !== filterStatus) return false;
    const term = search.toLowerCase();
    return (
      a.petName.toLowerCase().includes(term) ||
      a.ownerName.toLowerCase().includes(term) ||
      a.date.slice(0, 10).includes(term)
    );
  });

  const createAppointment = async (data) => {
    const payload = {
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
    };
    const res = await api.post("/", payload);
    setAppointments((prev) => [...prev, res.data]);
  };

  const updateAppointment = async (id, data) => {
    const payload = {
      ...data,
      baseService: data.baseService._id,
      extraServices: data.extraServices.map((s) => s._id),
    };
    const res = await api.put(`/${id}`, payload);
    setAppointments((prev) => prev.map((a) => (a._id === id ? res.data : a)));
  };

  const patchStatus = async (id, status) => {
    const target = appointments.find((a) => a._id === id);
    if (!target) return;
    await updateAppointment(id, { ...target, status });
  };

  const handleSave = async (data) => {
    if (modalData && modalData._id) {
      await updateAppointment(modalData._id, data);
    } else {
      await createAppointment(data);
    }
    setModalData(null);
  };

  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">
          Gerenciamento de Agendamentos
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar pet, cliente ou data"
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border bg-white rounded-md px-4 py-2 text-gray-700"
          >
            {["Todos", "Confirmado", "Pendente", "Cancelado", "Finalizado"].map(
              (s) => (
                <option key={s}>{s}</option>
              )
            )}
          </select>
          <ViewToggle
            icon={FaCalendarAlt}
            view="list"
            curr={view}
            setView={setView}
          />
          <ViewToggle
            icon={FaCalendarWeek}
            view="calendar"
            curr={view}
            setView={setView}
          />
          <button
            onClick={() => setModalData({})}
            className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
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
        />
      ) : (
        <CalendarComponent localizer={localizer} events={events} />
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
