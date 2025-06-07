import { useState } from "react";
import {
  FaCalendarDay,
  FaCalendarWeek,
  FaClock,
  FaClipboardList,
  FaEllipsisV,
  FaFilter,
  FaFileExport,
} from "react-icons/fa";
import { format, addDays } from "date-fns";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const mockAppointments = [
  { id: 1, time: "09:00", pet: "Maxi", service: "Banho Simples" },
  { id: 2, time: "10:30", pet: "Lulu", service: "Banho + Tosa" },
  { id: 3, time: "14:00", pet: "Bolt", service: "Tosa Higiênica" },
];

const mockWeekly = Array.from({ length: 7 }).map((_, i) => ({
  day: format(addDays(new Date(), i), "EEE"),
  count: Math.floor(Math.random() * 5) + 1,
}));

const mockByHour = [
  { hour: "08:00", count: 2 },
  { hour: "09:00", count: 3 },
  { hour: "10:00", count: 1 },
  { hour: "11:00", count: 4 },
  { hour: "12:00", count: 0 },
  { hour: "13:00", count: 2 },
];

const mockServices = [
  { service: "Banho Simples", count: 12 },
  { service: "Banho + Tosa", count: 8 },
  { service: "Tosa Higiênica", count: 5 },
];

const mockDaily = Array.from({ length: 7 }).map((_, i) => {
  const d = addDays(new Date(), i - 6);
  return {
    date: format(d, "dd/MM"),
    count: Math.floor(Math.random() * 10) + 1,
  };
});

const PIE_COLORS = ["#6366F1", "#10B981", "#F59E0B"];

export default function Dashboard() {
  const [period, setPeriod] = useState("Hoje");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 border-b pb-4 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">
          Painel de Administração
        </h1>
        <div className="flex items-center gap-3">
          <select
            className="border border-gray-300 bg-white rounded-md px-4 py-2 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option>Hoje</option>
            <option>Esta Semana</option>
            <option>Este Mês</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
            <FaFilter className="text-gray-600" /> Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
            <FaFileExport className="text-gray-600" /> Exportar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <FaCalendarDay className="text-indigo-600 w-5 h-5" />
              <h2 className="text-gray-700 font-medium">Agenda do Dia</h2>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <FaEllipsisV />
            </button>
          </div>
          <ul className="p-4 space-y-3">
            {mockAppointments.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between bg-gray-50 hover:bg-indigo-50 transition-colors rounded-lg px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {a.time} – {a.pet}
                  </p>
                  <p className="text-sm text-gray-500">{a.service}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <button className="hover:text-indigo-600">
                    <FaCalendarDay />
                  </button>
                  <button className="hover:text-red-500">
                    <FaClock />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <FaCalendarWeek className="text-indigo-600 w-5 h-5" />
              <h2 className="text-gray-700 font-medium">Agenda da Semana</h2>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <FaEllipsisV />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 p-4">
            {mockWeekly.map((d, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-gray-50 rounded-lg p-2 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-xs text-gray-500">{d.day}</span>
                <span className="mt-1 text-indigo-600 font-semibold">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm col-span-1 lg:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <FaClock className="text-indigo-600 w-5 h-5" />
              <h2 className="text-gray-700 font-medium">Pets por Horário</h2>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <FaEllipsisV />
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-gray-600">Horário</th>
                <th className="py-2 px-4 text-left text-gray-600">Qtd. Pets</th>
              </tr>
            </thead>
            <tbody>
              {mockByHour.map((h, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-2 px-4">{h.hour}</td>
                  <td className="py-2 px-4 font-semibold text-indigo-600">
                    {h.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <FaClipboardList className="text-indigo-600 w-5 h-5" />
              <h2 className="text-gray-700 font-medium">
                Serviços Solicitados
              </h2>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <FaEllipsisV />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {mockServices.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-gray-800">{s.service}</span>
                <span className="text-indigo-600 font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Agendamentos (7 dias)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={mockDaily}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} />
              <YAxis allowDecimals={false} tickLine={false} />
              <ReTooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Distribuição de Serviços
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockServices}
                dataKey="count"
                nameKey="service"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
                label
              >
                {mockServices.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
