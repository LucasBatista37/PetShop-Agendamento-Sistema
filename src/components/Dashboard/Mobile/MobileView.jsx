import React, { useMemo, useState, useEffect, useRef } from "react";
import MonthYearFilter from "../Filters/MonthYearFilter";
import VisionTabs from "./VisionTabs";
import StatCard from "@/components/ui/StatCard";
import WeeklyCalendar from "@/components/Dashboard/Calendar/WeeklyCalendar";
import MonthlyCalendar from "@/components/Dashboard/Calendar/MonthlyCalendar";
import AppointmentsList from "@/components/Dashboard/Card/AppointmentsList";
import { motion, AnimatePresence } from "framer-motion";
import { FiList, FiClock, FiPlus, FiDollarSign } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import DonutChart from "../Chart/DonutChart";

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

const formatBRL = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(n)
    : "—";

const toMonth0 = (m) => (m > 11 ? m - 1 : m);

export default function MobileView({ stats, date, setDate, reloadStats }) {
  const [view, setView] = useState("dashboard");
  const [calMode, setCalMode] = useState("weekly");

  const now = new Date();
  const [monthYear, setMonthYear] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  const reloadRef = useRef(reloadStats);
  useEffect(() => {
    reloadRef.current = reloadStats;
  }, [reloadStats]);

  useEffect(() => {
    const m = date.getMonth();
    const y = date.getFullYear();
    if (m !== monthYear.month || y !== monthYear.year) {
      setMonthYear({ month: m, year: y });
    }
  }, [date]);

  useEffect(() => {
    const applied = stats?.appliedFilter;
    if (
      applied &&
      applied.month0 === monthYear.month &&
      applied.year === monthYear.year
    ) {
      return;
    }
    reloadRef.current?.(
      { month: monthYear.month + 1, year: monthYear.year },
      { silent: true }
    );
  }, [monthYear.month, monthYear.year]);

  const allAppointments = stats?.allAppointments || [];
  const statusCounts = stats?.statusCounts || [];
  const byDayInMonth = stats?.byDayInMonth || null;

  const getCount = (label) =>
    statusCounts.find((s) => s.status === label)?.count || 0;

  const total =
    typeof stats?.totalAppointments === "number"
      ? stats.totalAppointments
      : allAppointments.length;

  const concluidos = getCount("Concluído");
  const confirmados = getCount("Confirmado");
  const cancelados = getCount("Cancelado");
  const pendentes = getCount("Pendente");

  const donutData = useMemo(
    () => [
      { name: "Confirmado", value: confirmados, color: "#6366F1" },
      { name: "Concluído", value: concluidos, color: "#10B981" },
      { name: "Pendente", value: pendentes, color: "#F59E0B" },
      { name: "Cancelado", value: cancelados, color: "#EF4444" },
    ],
    [confirmados, concluidos, pendentes, cancelados]
  );

  const monthDaysSeries = useMemo(() => {
    if (byDayInMonth && byDayInMonth.length) return byDayInMonth;
    const days = new Date(monthYear.year, monthYear.month + 1, 0).getDate();
    const arr = Array.from({ length: days }, (_, i) => ({
      day: String(i + 1).padStart(2, "0"),
      count: 0,
    }));
    for (const a of allAppointments) {
      const d = normalizeApptDay(getRawDateField(a));
      if (
        d &&
        d.getMonth() === monthYear.month &&
        d.getFullYear() === monthYear.year
      ) {
        arr[d.getDate() - 1].count += 1;
      }
    }
    return arr;
  }, [byDayInMonth, allAppointments, monthYear]);

  const hasEventsInMonth = useMemo(
    () => (monthDaysSeries || []).some((d) => d.count > 0),
    [monthDaysSeries]
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
            onChange={(v) =>
              setMonthYear({
                month: toMonth0(v.month),
                year: v.year,
              })
            }
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
                  icon={<FiDollarSign className="text-green-500" />}
                  label="Receita total"
                  value={formatBRL(stats?.totalRevenue)}
                  color="green"
                />
                <StatCard
                  icon={<FiList className="text-indigo-500" />}
                  label="Agendamentos"
                  value={
                    typeof stats?.totalAppointments === "number"
                      ? stats.totalAppointments
                      : total
                  }
                  color="indigo"
                />
                <StatCard
                  icon={<FiClock className="text-red-500" />}
                  label="Horário de pico"
                  value={stats?.peakHour || "—"}
                  color="red"
                />
                <StatCard
                  icon={<FiClock className="text-yellow-500" />}
                  label="Pendentes"
                  value={pendentes}
                  color="yellow"
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

                <div className="h-48 relative">
                  {!hasEventsInMonth && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-gray-500">
                        Sem agendamentos neste mês.
                      </p>
                    </div>
                  )}
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
                    appointments={allAppointments}
                  />
                )}
              </div>

              <div className="bg-transparent">
                <AppointmentsList
                  date={date}
                  appointments={allAppointments}
                  isMobile
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
