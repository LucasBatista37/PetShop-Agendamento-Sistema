import React, { useMemo, useState, useEffect } from "react";
import MonthYearFilter from "../Filters/MonthYearFilter";
import VisionTabs from "./VisionTabs";
import StatCard from "@/components/ui/StatCard";
import WeeklyCalendar from "@/components/Dashboard/Calendar/WeeklyCalendar";
import MonthlyCalendar from "@/components/Dashboard/Calendar/MonthlyCalendar";
import AppointmentsListMobileCards from "@/components/Dashboard/Card/AppointmentsListMobileCards";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiList,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPlus,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { isSameDay } from "date-fns";
import DonutChart from "../Chart/DonutChart";

export default function MobileView({ stats, date, setDate }) {
  const [view, setView] = useState("dashboard");
  const [calMode, setCalMode] = useState("weekly"); 

  const now = new Date();
  const [monthYear, setMonthYear] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  const getRawDateField = (a) =>
    a?.date ?? a?.datetime ?? a?.startDate ?? a?.start ?? a?.createdAt ?? null;
  const normalizeApptDay = (raw) => {
    if (!raw) return null;
    if (raw instanceof Date)
      return new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
    if (typeof raw === "number") {
      const d = new Date(raw);
      return isNaN(d)
        ? null
        : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    if (typeof raw === "string") {
      const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
      const d = new Date(raw);
      return isNaN(d)
        ? null
        : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    return null;
  };

  const filteredAppointments = useMemo(() => {
    const list = stats?.allAppointments || [];
    return list.filter((a) => {
      const d = normalizeApptDay(getRawDateField(a));
      return (
        d &&
        d.getMonth() === monthYear.month &&
        d.getFullYear() === monthYear.year
      );
    });
  }, [stats?.allAppointments, monthYear]);

  const dailyAppointments = useMemo(() => {
    const list = stats?.allAppointments || [];
    return list.filter((a) => {
      const d = normalizeApptDay(getRawDateField(a));
      return d && isSameDay(d, date);
    });
  }, [stats?.allAppointments, date]);

  useEffect(() => {
    const m = date.getMonth();
    const y = date.getFullYear();
    if (m !== monthYear.month || y !== monthYear.year)
      setMonthYear({ month: m, year: y });
  }, [date]); 

  const statusCountsFiltered = useMemo(() => {
    const map = { Concluído: 0, Cancelado: 0, Pendente: 0 };
    for (const a of filteredAppointments) {
      const s = a.status || a.situacao || a.state || "Pendente";
      if (map[s] != null) map[s] += 1;
    }
    return [
      { status: "Concluído", count: map["Concluído"] },
      { status: "Cancelado", count: map["Cancelado"] },
      { status: "Pendente", count: map["Pendente"] },
    ];
  }, [filteredAppointments]);

  const monthDaysSeries = useMemo(() => {
    const days = new Date(monthYear.year, monthYear.month + 1, 0).getDate();
    const arr = Array.from({ length: days }, (_, i) => ({
      day: String(i + 1).padStart(2, "0"),
      count: 0,
    }));
    for (const a of filteredAppointments) {
      const d = normalizeApptDay(getRawDateField(a));
      if (d) arr[d.getDate() - 1].count += 1;
    }
    return arr;
  }, [filteredAppointments, monthYear]);

  const total = filteredAppointments.length;
  const concluidos =
    statusCountsFiltered.find((s) => s.status === "Concluído")?.count || 0;
  const cancelados =
    statusCountsFiltered.find((s) => s.status === "Cancelado")?.count || 0;
  const pendentes =
    statusCountsFiltered.find((s) => s.status === "Pendente")?.count || 0;

  const donutData = useMemo(
    () => [
      { name: "Concluído", value: concluidos, color: "#10B981" },
      { name: "Pendente", value: pendentes, color: "#F59E0B" },
      { name: "Cancelado", value: cancelados, color: "#EF4444" },
    ],
    [concluidos, pendentes, cancelados]
  );

  const motionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.18 },
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-4 font-sans">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-800">
              {view === "dashboard" ? "Dashboard" : "Agendamentos"}
            </h1>
          </div>
          <MonthYearFilter
            value={monthYear}
            onChange={setMonthYear}
            align="end"
          />
        </div>
        <VisionTabs view={view} onChange={setView} />
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {view === "dashboard" && (
            <motion.div key="mobile-dash" {...motionProps}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <StatCard
                  icon={<FiList className="text-indigo-500" />}
                  label="Total"
                  value={total}
                  color="indigo"
                />
                <StatCard
                  icon={<FiCheckCircle className="text-green-500" />}
                  label="Concluídos"
                  value={concluidos}
                  color="green"
                />
                <StatCard
                  icon={<FiClock className="text-yellow-500" />}
                  label="Pendentes"
                  value={pendentes}
                  color="yellow"
                />
                <StatCard
                  icon={<FiXCircle className="text-red-500" />}
                  label="Cancelados"
                  value={cancelados}
                  color="red"
                />
              </div>

              <DonutChart
                title="Status dos agendamentos"
                data={donutData}
                total={total}
              />

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-base font-semibold text-gray-700 mb-3 text-center">
                  {`Agendamentos — ${String(monthYear.month + 1).padStart(
                    2,
                    "0"
                  )}/${monthYear.year}`}
                </h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthDaysSeries || []}>
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#7C3AED"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {view === "bookings" && (
            <motion.div key="mobile-bookings" {...motionProps}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Calendário
                  </h3>
                  <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                    {["weekly", "monthly"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setCalMode(m)}
                        className={[
                          "px-3 py-1.5 rounded-md text-xs font-medium transition",
                          calMode === m
                            ? "bg-white shadow text-gray-900"
                            : "text-gray-600",
                        ].join(" ")}
                      >
                        {m === "weekly" ? "Semanal" : "Mensal"}
                      </button>
                    ))}
                  </div>
                </div>

                {calMode === "weekly" ? (
                  <WeeklyCalendar date={date} setDate={setDate} />
                ) : (
                  <MonthlyCalendar
                    date={date}
                    setDate={setDate}
                    appointments={stats?.allAppointments || []}
                  />
                )}
              </div>

              <div className="bg-transparent">
                <AppointmentsListMobileCards
                  date={date}
                  appointments={stats?.allAppointments || []}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        aria-label="Novo agendamento"
        className="fixed right-4 bottom-6 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl"
        onClick={() => (window.location.href = "/appointments")}
      >
        <FiPlus size={22} />
      </button>
    </div>
  );
}
