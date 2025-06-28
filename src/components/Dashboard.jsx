import React, { useState, useEffect } from "react";
import WeeklyCalendar from "./Dashboard/Calendar/WeeklyCalendar";
import Last7DaysChart from "./Dashboard/Chart/Last7DaysChart";
import PetImageCard from "./Dashboard/Card/PetImageCard";
import AppointmentsList from "./Dashboard/Card/AppointmentsList";
import ServiceBarChart from "./Dashboard/Chart/ServiceBarChart";
import StatusPieChart from "./Dashboard/Chart/StatusPieChart";
import { fetchDashboardStats } from "@/api/api";

export default function DashboardAgendamentos() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-gray-500 text-center">Carregando dashboard...</p>
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
