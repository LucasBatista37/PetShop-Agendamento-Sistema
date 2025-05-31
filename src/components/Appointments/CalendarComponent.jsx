import React, { useState } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaCalendarWeek,
  FaSearch,
} from "react-icons/fa";
import AppointmentDetails from "./AppointmentDetails";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse: (value, formatStr) => parse(value, formatStr, new Date(), { locale: ptBR }),
  startOfWeek: (date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ToolbarBtn = ({ children, onClick, primary, active }) => {
  let base =
    "px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-colors";
  if (primary)
    base += " bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-medium";
  else if (active)
    base += " bg-indigo-100 text-indigo-700 font-medium border border-indigo-200";
  else base += " bg-white text-gray-700 hover:bg-gray-100 border";

  return (
    <button onClick={onClick} className={base} aria-label={typeof children === "string" ? children : undefined}>
      {children}
    </button>
  );
};

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  const views = [
    { label: "Mês", value: Views.MONTH },
    { label: "Semana", value: Views.WEEK },
    { label: "Dia", value: Views.DAY },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 border-b gap-4">
      <div className="flex items-center gap-2">
        <ToolbarBtn onClick={() => onNavigate("TODAY")} primary>
          Hoje
        </ToolbarBtn>
        <ToolbarBtn onClick={() => onNavigate("PREV")}> <FaChevronLeft /> Anterior </ToolbarBtn>
        <ToolbarBtn onClick={() => onNavigate("NEXT")}> Próximo <FaChevronRight /> </ToolbarBtn>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 text-center">{label}</h3>

      <div className="flex gap-2">
        {views.map((v) => (
          <ToolbarBtn key={v.value} active={view === v.value} onClick={() => onView(v.value)}>
            {v.label}
          </ToolbarBtn>
        ))}
      </div>
    </div>
  );
};

export default function CalendarComponent({
  events,
  onFinalize,
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
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor:
        {
          Confirmado: "#60A5FA",
          Pendente: "#FBBF24",
          Cancelado: "#F87171",
          Finalizado: "#34D399",
        }[event.status] || "#6B7280",
      borderRadius: 6,
      color: "#fff",
      padding: "0 6px",
    },
  });

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      {/* FILTROS MOVIDOS PARA CÁ */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <button onClick={() => setScopeMenuOpen((o) => !o)} className="flex items-center gap-2 border border-gray-300 bg-white rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
            <FaCalendarAlt className="text-gray-600" />
            {filterScope === "all" ? "Todos Agendamentos" : "Hoje e Futuros"}
          </button>
          {scopeMenuOpen && (
            <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <button onClick={() => { setFilterScope("all"); setScopeMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Todos Agendamentos</button>
              <button onClick={() => { setFilterScope("future"); setScopeMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Hoje e Futuros</button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-300 bg-white rounded-md px-4 py-2 text-gray-700">
            {["Todos", "Confirmado", "Pendente", "Cancelado", "Finalizado"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button onClick={() => setView("list")} className={`p-2 rounded-md ${view === "list" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}>
            <FaCalendarAlt />
          </button>
          <button onClick={() => setView("calendar")} className={`p-2 rounded-md ${view === "calendar" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}>
            <FaCalendarWeek />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <Calendar
          localizer={localizer}
          culture="pt-BR"
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={setCurrentDate}
          view={currentView}
          onView={setCurrentView}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          popup
          selectable
          onSelectEvent={setSelected}
          eventPropGetter={eventStyleGetter}
          style={{ height: 600 }}
          components={{ toolbar: CustomToolbar }}
          messages={{
            today: "Hoje",
            previous: "Anterior",
            next: "Próximo",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Nenhum agendamento neste período.",
            showMore: (total) => `+${total} mais`,
          }}
          formats={{
            dateFormat: "dd",
            dayFormat: (date) => format(date, "dd/MM", { locale: ptBR }),
            weekdayFormat: (date) => capitalize(format(date, "EEEE", { locale: ptBR })),
            monthHeaderFormat: (date) => capitalize(format(date, "MMMM yyyy", { locale: ptBR })),
            dayHeaderFormat: (date) => capitalize(format(date, "EEEE, dd MMMM", { locale: ptBR })),
            dayRangeHeaderFormat: ({ start, end }) => `${capitalize(format(start, "dd MMMM", { locale: ptBR }))} — ${capitalize(format(end, "dd MMMM", { locale: ptBR }))}`,
            agendaHeaderFormat: ({ start, end }) => `${format(start, "dd/MM/yyyy", { locale: ptBR })} - ${format(end, "dd/MM/yyyy", { locale: ptBR })}`,
            agendaDateFormat: (date) => format(date, "dd/MM", { locale: ptBR }),
            agendaTimeFormat: (date) => format(date, "HH:mm", { locale: ptBR }),
            agendaTimeRangeFormat: ({ start, end }) => `${format(start, "HH:mm", { locale: ptBR })} - ${format(end, "HH:mm", { locale: ptBR })}`,
          }}
        />
      </div>

      <AppointmentDetails open={!!selected} data={selected} onClose={() => setSelected(null)} onFinalize={onFinalize} />
    </div>
  );
}
