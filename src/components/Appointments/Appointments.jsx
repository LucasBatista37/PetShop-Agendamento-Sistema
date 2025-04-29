import React, { useState, useMemo } from "react";
import { format, parseISO, startOfWeek, getDay, parse } from "date-fns";
import ptLocale from "date-fns/locale/pt";
import { dateFnsLocalizer } from "react-big-calendar";
import {
  AppointmentTable,
  ViewToggle,
} from "@/components/Appointments"; 
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

const mockAppointments = [
  {
    id: 1,
    petName: "Maxi",
    ownerName: "Carlos Silva",
    phone: "(11) 98765-4321",
    service: "Banho + Tosa Completa",
    extras: ["Cortar Unha", "Hidratação"],
    date: "2025-05-05",
    time: "10:00",
    price: "R$ 120,00",
    status: "Pendente",
    notes: "Pet muito agitado.",
    species: "Cachorro",
    breed: "Labrador",
  },
  {
    id: 2,
    petName: "Lulu",
    ownerName: "Ana Souza",
    phone: "(11) 91234-5678",
    service: "Banho Simples",
    extras: [],
    date: "2025-05-05",
    time: "14:30",
    price: "R$ 70,00",
    status: "Confirmado",
    notes: "",
    species: "Cachorro",
    breed: "Poodle Toy",
  },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [view, setView] = useState("list");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null);

  const events = useMemo(
    () =>
      appointments.map((a) => {
        const start = new Date(`${a.date}T${a.time}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return { ...a, title: `${a.petName} - ${a.service}`, start, end };
      }),
    [appointments]
  );

  const filtered = appointments.filter((a) => {
    const statusOK = filterStatus === "Todos" || a.status === filterStatus;
    const term = search.toLowerCase();
    const textOK =
      a.petName.toLowerCase().includes(term) ||
      a.ownerName.toLowerCase().includes(term) ||
      a.date.includes(term);
    return statusOK && textOK;
  });

  const handleSave = (data) => {
    if (modalData) {
      setAppointments((prev) => prev.map((ap) => (ap.id === data.id ? data : ap)));
      alert("Agendamento atualizado!");
    } else {
      const id = Math.max(...appointments.map((a) => a.id)) + 1;
      setAppointments((prev) => [...prev, { ...data, id }]);
      alert("Agendamento criado!");
    }
    setModalData(null);
  };

  const handleConfirm = (id) =>
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Confirmado" } : a))
    );

  const handleCancel = (id) =>
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelado" } : a))
    );

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
            {["Todos", "Confirmado", "Pendente", "Cancelado"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <ViewToggle icon={FaCalendarAlt} view="list" curr={view} setView={setView} />
          <ViewToggle icon={FaCalendarWeek} view="calendar" curr={view} setView={setView} />

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
          onConfirm={handleConfirm}
          onEdit={(appt) => setModalData(appt)}
          onCancel={handleCancel}
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