import React, { useMemo, useState, useEffect, useRef } from "react";
import MonthYearFilter from "../Filters/MonthYearFilter";
import VisionTabs from "./VisionTabs";
import StatCard from "@/components/ui/StatCard";
import WeeklyCalendar from "@/components/Dashboard/Calendar/WeeklyCalendar";
import MonthlyCalendar from "@/components/Dashboard/Calendar/MonthlyCalendar";
import AppointmentsList from "@/components/Dashboard/Card/AppointmentsList";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiList,
  FiClock,
  FiPlus,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";
import DonutChart from "../Chart/DonutChart";
import ServicesDonutChart from "../Chart/ServicesDonutChart";
import Last7DaysChart from "../Chart/Last7DaysChart";
import DonutHeader from "@/components/Dashboard/Chart/DonutHeader";

const formatBRL = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(n)
    : "—";

const normalizeMonth0 = (v) => {
  if (v && typeof v === "object" && "month0" in v) return Number(v.month0) || 0;
  const m = Number(v?.month);
  if (m >= 1 && m <= 12) return m - 1;
  return Number(m) || 0;
};

export default function MobileView({ stats = {}, date, setDate, reloadStats }) {
  const [view, setView] = useState("dashboard");
  const [calMode, setCalMode] = useState("weekly");
  const [donutMode, setDonutMode] = useState("status");

  const [monthYear, setMonthYear] = useState(() => {
    const d = date instanceof Date ? date : new Date();
    return { month: d.getMonth(), year: d.getFullYear() };
  });

  const reloadRef = useRef(reloadStats);
  const lastRequestedRef = useRef({ month: null, year: null });

  useEffect(() => {
    reloadRef.current = reloadStats;
  }, [reloadStats]);

  useEffect(() => {
    if (!(date instanceof Date)) return;
    const m = date.getMonth();
    const y = date.getFullYear();
    if (m !== monthYear.month || y !== monthYear.year) {
      setMonthYear({ month: m, year: y });
    }
  }, [date]); 

  useEffect(() => {
    const applied = stats?.appliedFilter;
    const sameApplied =
      applied &&
      applied.month0 === monthYear.month &&
      applied.year === monthYear.year;

    const sameRequested =
      lastRequestedRef.current.month === monthYear.month &&
      lastRequestedRef.current.year === monthYear.year;

    if (sameApplied || sameRequested) return;
    if (typeof reloadRef.current !== "function") return;

    lastRequestedRef.current = { month: monthYear.month, year: monthYear.year };
    reloadRef.current(
      { month: monthYear.month + 1, year: monthYear.year },
      { silent: true }
    );
  }, [monthYear.month, monthYear.year, stats?.appliedFilter]); 

  const allAppointments = stats?.allAppointments || [];
  const statusCounts = stats?.statusCounts || [];
  const servicesRaw = stats?.services || [];
  const totalAppointments =
    typeof stats?.totalAppointments === "number"
      ? stats.totalAppointments
      : allAppointments.length;

  const norm = (s) =>
    (s || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const getCountBy = (includesAny = []) =>
    statusCounts.find((s) =>
      includesAny.some((k) => norm(s.status).includes(k))
    )?.count || 0;

  const concluidos = getCountBy(["concluido", "finalizado"]);
  const confirmados = getCountBy(["confirmado"]);
  const cancelados = getCountBy(["cancel"]);
  const pendentes = getCountBy(["pendente"]);

  const donutStatusData = useMemo(
    () => [
      { name: "Confirmado", value: confirmados, color: "#6366F1" },
      { name: "Concluído", value: concluidos, color: "#10B981" },
      { name: "Pendente", value: pendentes, color: "#F59E0B" },
      { name: "Cancelado", value: cancelados, color: "#EF4444" },
    ],
    [confirmados, concluidos, pendentes, cancelados]
  );
  const statusTotal = confirmados + concluidos + pendentes + cancelados;

  const donutServicesData = useMemo(() => {
    const arr = (servicesRaw || []).map((s, i) => ({
      name: s.name ?? s.label ?? s.service ?? `Serviço ${i + 1}`,
      value: Number(s.count ?? s.value ?? s.total ?? 0),
    }));
    return arr.sort((a, b) => b.value - a.value);
  }, [servicesRaw]);

  const servicesTotal = useMemo(
    () => donutServicesData.reduce((acc, d) => acc + (d.value || 0), 0),
    [donutServicesData]
  );

  const motionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.18 },
  };

  const headerNode = (
    <DonutHeader
      mode={donutMode}
      onChange={setDonutMode}
      modes={["status", "services"]}
      titles={{
        status: "Status dos agendamentos",
        services: "Distribuição por serviços",
      }}
    />
  );

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
                month: normalizeMonth0(v), // <<< CORRIGE o “voltar 1 mês”
                year: Number(v.year) || monthYear.year,
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
                  value={totalAppointments}
                  color="indigo"
                />
                <StatCard
                  icon={<FiClock className="text-purple-500" />}
                  label="Horário de pico"
                  value={stats?.peakHour || "—"}
                  color="purple"
                />
                <StatCard
                  icon={<FiAlertCircle className="text-yellow-500" />}
                  label="Pendentes"
                  value={pendentes}
                  color="yellow"
                />
              </div>

              {donutMode === "status" ? (
                <DonutChart
                  title=""
                  header={headerNode}
                  data={donutStatusData}
                  total={statusTotal}
                  legendPlacement="below"
                />
              ) : (
                <ServicesDonutChart
                  title=""
                  header={headerNode}
                  data={donutServicesData}
                  total={servicesTotal}
                  centerLabel="serviços"
                  legendPlacement="below"
                  percentPrecision={0}
                />
              )}

              {/* ESPAÇAMENTO dedicado para o gráfico de 7 dias */}
              <div className="mt-6 md:mt-8">
                <Last7DaysChart
                  data={stats?.last7Days || []}
                  title="Agendamentos — últimos 7 dias"
                  primaryColor="#7C3AED"
                />
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
                        aria-pressed={calMode === m}
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
