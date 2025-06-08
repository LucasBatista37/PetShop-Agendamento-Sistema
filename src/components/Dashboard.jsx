// DashboardAgendamentos.jsx – versão final (banho & tosa)
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";

/* -------------------------------------------------------------
   MOCK DATA – troque pelo retorno real da sua API
------------------------------------------------------------- */
const appointments = [
  {
    id: 1,
    petName: "Maxi",
    date: "2025-06-03",
    time: "09:00",
    service: "Banho",
    status: "Pendente",
    revenue: 40,
  },
  {
    id: 2,
    petName: "Lulu",
    date: "2025-06-03",
    time: "14:00",
    service: "Tosa",
    status: "Confirmado",
    revenue: 60,
  },
  {
    id: 3,
    petName: "Thor",
    date: "2025-06-04",
    time: "16:00",
    service: "Banho + Tosa",
    status: "Finalizado",
    revenue: 90,
  },
  {
    id: 4,
    petName: "Mia",
    date: "2025-06-04",
    time: "11:00",
    service: "Banho",
    status: "Cancelado",
    revenue: 40,
  },
  {
    id: 5,
    petName: "Buddy",
    date: "2025-06-05",
    time: "10:00",
    service: "Banho",
    status: "Confirmado",
    revenue: 40,
  },
  {
    id: 6,
    petName: "Zoe",
    date: "2025-06-05",
    time: "15:00",
    service: "Tosa",
    status: "Pendente",
    revenue: 60,
  },
];

/* ----------------------- Componentes auxiliares ----------------------- */
const Btn = ({ onClick, children, active }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm border transition ${
      active
        ? "bg-indigo-600 text-white border-indigo-600"
        : "border-gray-300 text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

function WeeklyCalendar({ date, setDate }) {
  const [start, setStart] = useState(startOfWeek(date, { weekStartsOn: 1 }));
  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  const nav = (d) => setStart((s) => (d > 0 ? addWeeks(s, 1) : subWeeks(s, 1)));
  const short = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">
          {format(start, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => nav(d)}
              className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs"
            >
              {d === -1 ? "<" : ">"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1 text-[10px] text-gray-500 font-medium text-center">
        {short.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setDate(d)}
            className={`aspect-square rounded-full text-[11px] font-medium transition focus:outline-none ${
              isSameDay(d, date)
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {format(d, "d")}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardAgendamentos() {
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [date, setDate] = useState(new Date());

  // 1. Filtrar por status
  const filteredAppointments = useMemo(
    () =>
      statusFilter === "Todos"
        ? appointments
        : appointments.filter((a) => a.status === statusFilter),
    [statusFilter]
  );

  // 2. Série últimos 7 dias
  const last7Days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(today, -6 + i);
      const key = format(d, "yyyy-MM-dd");
      const total = appointments.filter((a) => a.date === key).length;
      return { day: format(d, "dd/MM"), total };
    });
  }, []);

  // 3. Distribuição de status
  const statusCounts = useMemo(() => {
    const counts = {};
    appointments.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, total]) => ({ status, total }));
  }, []);

  // 4. Serviços populares
  const serviceCounts = useMemo(() => {
    const counts = {};
    appointments.forEach((a) => {
      counts[a.service] = (counts[a.service] || 0) + 1;
    });
    return Object.entries(counts).map(([service, total]) => ({
      service,
      total,
    }));
  }, []);

  // 5. Período do dia
  const daypartCounts = useMemo(() => {
    const counters = { Manhã: 0, Tarde: 0, Noite: 0 };
    appointments.forEach((a) => {
      const h = parseInt(a.time.split(":")[0], 10);
      if (h < 12) counters.Manhã++;
      else if (h < 18) counters.Tarde++;
      else counters.Noite++;
    });
    return Object.entries(counters).map(([part, total]) => ({ part, total }));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">
          Dashboard Banho & Tosa
        </h1>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Filtro de Status */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Agendamentos
              </h2>
              <div className="flex gap-2">
                {[
                  "Todos",
                  "Pendente",
                  "Confirmado",
                  "Finalizado",
                  "Cancelado",
                ].map((s) => (
                  <Btn
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    active={statusFilter === s}
                  >
                    {s}
                  </Btn>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {filteredAppointments.length} agendamento(s) encontrados.
            </p>
          </section>

          {/* Grade de Gráficos */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Linha */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Últimos 7 dias
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={last7Days}>
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6366F1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Pizza */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Status dos agendamentos
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusCounts}
                    dataKey="total"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, percent }) =>
                      `${status}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusCounts.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={
                          ["#6366F1", "#10B981", "#F59E0B", "#EF4444"][idx % 4]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </section>

            {/* Barras Serviços */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Serviços mais solicitados
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={serviceCounts} margin={{ left: 0 }}>
                  <XAxis dataKey="service" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#6366F1"
                    maxBarSize={40}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* Barras Período */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Período do dia
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={daypartCounts} margin={{ left: 0 }}>
                  <XAxis dataKey="part" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#6366F1"
                    maxBarSize={40}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="flex flex-col gap-6">
          {/* Card Imagem do Pet */}
          <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100 h-64">
            <img
              src="https://images.unsplash.com/photo-1598133894009-95e763b2ef6a?auto=format&fit=crop&w=800&q=80"
              alt="Pet"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white text-lg font-semibold">Maxi</h3>
              <p className="text-white text-sm">Banho às 09:00</p>
            </div>
          </div>

          {/* Calendar & Lista do Dia */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
            <WeeklyCalendar date={date} setDate={setDate} />
            <hr className="my-4" />
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Agendamentos de {format(date, "dd/MM/yyyy")}
            </h2>
            <ul className="space-y-3 overflow-auto pr-1 flex-1 text-sm">
              {appointments
                .filter((a) => a.date === format(date, "yyyy-MM-dd"))
                .map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-800 mb-1">
                        {it.petName} – {it.service}
                      </p>
                      <p className="text-xs text-gray-500">{it.time}</p>
                    </div>
                    <span className="text-xs text-gray-500">{it.status}</span>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
