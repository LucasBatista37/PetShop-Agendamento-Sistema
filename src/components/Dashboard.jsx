import React, { useEffect, useState, useMemo, useRef } from "react";
import WeeklyCalendar from "./Dashboard/Calendar/WeeklyCalendar";
import Last7DaysChart from "./Dashboard/Chart/Last7DaysChart";
import PetImageCard from "./Dashboard/Card/PetImageCard";
import AppointmentsList from "./Dashboard/Card/AppointmentsList";
import ServiceBarChart from "./Dashboard/Chart/ServiceBarChart";
import StatusPieChart from "./Dashboard/Chart/StatusPieChart";
import { fetchDashboardStats } from "@/api/api";
import StatusMessage from "../utils/StatusMessage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiCalendar,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiList,
  FiFilter,
  FiChevronDown,
  FiRotateCcw,
} from "react-icons/fi";

function MonthYearFilter({
  value,
  onChange,
  variant = "button",
  align = "end",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => thisYear - 2 + i);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const [temp, setTemp] = useState(
    () => value ?? { month: new Date().getMonth(), year: thisYear }
  );
  useEffect(() => {
    if (value) setTemp(value);
  }, [value]);

  const label = `${months[value.month]} / ${value.year}`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Filtro por mês e ano"
      >
        <span>{label}</span>
        <FiChevronDown
          className={`text-gray-600 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Filtro por mês e ano"
          className={[
            "absolute z-30 mt-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl",
            align === "end" ? "right-0" : "left-0",
            "w-[min(18rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-auto",
          ].join(" ")}
          style={{ top: "calc(100% + 0px)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Mês</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={temp.month}
                onChange={(e) =>
                  setTemp((t) => ({ ...t, month: Number(e.target.value) }))
                }
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label className="block text-xs text-gray-500 mb-1">Ano</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={temp.year}
                onChange={(e) =>
                  setTemp((t) => ({ ...t, year: Number(e.target.value) }))
                }
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-lg px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900"
              onClick={() => {
                onChange(temp);
                setOpen(false);
              }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileView({ stats, date, setDate }) {
  const [view, setView] = useState("dashboard");

  const now = new Date();
  const [monthYear, setMonthYear] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  const toDate = (val) => {
    if (!val) return null;
    const d = typeof val === "number" ? new Date(val) : new Date(String(val));
    return isNaN(d) ? null : d;
  };
  const getItemDate = (item) =>
    toDate(
      item.date ||
        item.datetime ||
        item.startDate ||
        item.start ||
        item.createdAt
    );

  const filteredAppointments = useMemo(() => {
    if (!monthYear) return stats.allAppointments || [];
    return (stats.allAppointments || []).filter((a) => {
      const d = getItemDate(a);
      return (
        d &&
        d.getMonth() === monthYear.month &&
        d.getFullYear() === monthYear.year
      );
    });
  }, [stats.allAppointments, monthYear]);

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
    if (!monthYear) return null;
    const days = new Date(monthYear.year, monthYear.month + 1, 0).getDate();
    const arr = Array.from({ length: days }, (_, i) => ({
      day: String(i + 1).padStart(2, "0"),
      count: 0,
    }));
    for (const a of filteredAppointments) {
      const d = getItemDate(a);
      if (
        d &&
        d.getMonth() === monthYear.month &&
        d.getFullYear() === monthYear.year
      ) {
        arr[d.getDate() - 1].count += 1;
      }
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

  const motionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.18 },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
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
            variant="button"
            align="end"
          />
        </div>

        <div
          role="tablist"
          aria-label="Visão"
          className="w-full rounded-2xl bg-gray-100/80 ring-1 ring-gray-200 p-1.5 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-1.5">
            <button
              role="tab"
              aria-selected={view === "dashboard"}
              onClick={() => setView("dashboard")}
              className={`w-full rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1 transition-all
        ${
          view === "dashboard"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:bg-white/60"
        }`}
            >
              <FiBarChart2 className="text-base text-indigo-600" />
              <span>Dashboard</span>
            </button>

            <button
              role="tab"
              aria-selected={view === "bookings"}
              onClick={() => setView("bookings")}
              className={`w-full rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1 transition-all
        ${
          view === "bookings"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:bg-white/60"
        }`}
            >
              <FiCalendar className="text-base text-indigo-600" />
              <span>Agendamentos</span>
            </button>
          </div>
        </div>
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

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-base font-semibold text-gray-700 mb-3 text-center">
                  {monthYear
                    ? `Agendamentos — ${String(monthYear.month + 1).padStart(
                        2,
                        "0"
                      )}/${monthYear.year}`
                    : "Agendamentos - Últimos 7 dias"}
                </h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    {monthYear ? (
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
                    ) : (
                      <BarChart
                        data={stats.last7Days.map((d) => ({
                          date: d.date,
                          count: d.count,
                        }))}
                      >
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#7C3AED"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {view === "bookings" && (
            <motion.div key="mobile-bookings" {...motionProps}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-3">
                <WeeklyCalendar date={date} setDate={setDate} compact />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Agendamentos do Dia
                </h3>
                <AppointmentsList
                  date={date}
                  appointments={filteredAppointments}
                  mobile
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

function DesktopView({ stats, date, setDate }) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Dashboard Banho &amp; Tosa
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6 order-2 lg:order-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Last7DaysChart
                data={stats.last7Days.map((item) => ({
                  day: item.date,
                  total: item.count,
                }))}
              />
            </div>
            <ServiceBarChart
              data={stats.services.map((item) => ({
                service: item.service,
                total: item.count,
              }))}
            />
            <StatusPieChart
              data={stats.statusCounts.map((item) => ({
                status: item.status,
                total: item.count,
              }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 order-1 lg:order-none">
          <PetImageCard imageSrc="https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0" />
          <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col flex-1">
            <WeeklyCalendar date={date} setDate={setDate} />
            <hr className="my-4" />
            <AppointmentsList
              date={date}
              appointments={stats.allAppointments}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default function DashboardAgendamentos() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [stats, setStats] = useState({
    allAppointments: [],
    last7Days: [],
    services: [],
    statusCounts: [],
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    setIsMobile(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  if (loading || error) {
    return (
      <StatusMessage
        loading={loading}
        error={error}
        loadingMessage="Carregando dashboard..."
        className="p-6"
      />
    );
  }

  return isMobile ? (
    <MobileView stats={stats} date={date} setDate={setDate} />
  ) : (
    <DesktopView stats={stats} date={date} setDate={setDate} />
  );
}

function StatCard({ icon, label, value, color = "indigo" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-lg bg-${color}-100`}
        >
          {icon}
        </div>
      </div>
      <span className="text-lg font-semibold text-gray-800">{value}</span>
    </div>
  );
}
