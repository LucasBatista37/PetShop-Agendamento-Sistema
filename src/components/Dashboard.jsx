import React, { useEffect, useState } from "react";
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
} from "react-icons/fi";

export default function DashboardAgendamentos() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [view, setView] = useState("dashboard");
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

  const total = stats.allAppointments.length;
  const concluidos =
    stats.statusCounts.find((s) => s.status === "Concluído")?.count || 0;
  const cancelados =
    stats.statusCounts.find((s) => s.status === "Cancelado")?.count || 0;
  const pendentes =
    stats.statusCounts.find((s) => s.status === "Pendente")?.count || 0;

  const motionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.18 },
  };

  if (isMobile) {
    const viewName = view === "dashboard" ? "Dashboard" : "Agendamentos";
    const viewIcon = view === "dashboard" ? <FiBarChart2 /> : <FiCalendar />;

    return (
      <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="flex items-center gap-2 mb-2">
        <span className="text-indigo-600 text-xl">{viewIcon}</span>
        <h1 className="text-2xl font-semibold text-gray-800">{viewName}</h1>
        </div>

        <div
        role="tablist"
        aria-label="Visão"
        className="bg-white/80 border border-gray-200 rounded-full p-1 flex items-center space-x-1 shadow-sm"
        >
        <button
          role="tab"
          aria-selected={view === "dashboard"}
          onClick={() => setView("dashboard")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-all ${
          view === "dashboard"
            ? "bg-indigo-600 text-white shadow"
            : "text-gray-600"
          }`}
        >
          <FiBarChart2 className="text-base" /> Dashboard
        </button>

        <button
          role="tab"
          aria-selected={view === "bookings"}
          onClick={() => setView("bookings")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-all ${
          view === "bookings"
            ? "bg-indigo-600 text-white shadow"
            : "text-gray-600"
          }`}
        >
          <FiCalendar className="text-base" /> Agendamentos
        </button>
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
            Agendamentos - Últimos 7 dias
            </h2>
            <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
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
            appointments={stats.allAppointments}
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
        onClick={() => window.location.href = "/appointments"}
      >
        <FiPlus size={22} />
      </button>
      </div>
    );
  }

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
