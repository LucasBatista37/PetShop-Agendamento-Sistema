import React from "react";
import Last7DaysChart from "@/components/Dashboard/Chart/Last7DaysChart";
import ServiceBarChart from "@/components/Dashboard/Chart/ServiceBarChart";
import DonutChart from "@/components/Dashboard/Chart/DonutChart";
import WeeklyCalendar from "@/components/Dashboard/Calendar/WeeklyCalendar";
import AppointmentsList from "@/components/Dashboard/Card/AppointmentsList";
import PetImageCard from "@/components/Dashboard/Card/PetImageCard";

function statusColor(status) {
  const s = (status || "").toLowerCase();
  if (["concluído", "concluido", "finalizado"].some((k) => s.includes(k)))
    return "#10B981";
  if (s.includes("pendente")) return "#F59E0B";
  if (s.includes("cancel")) return "#EF4444";
  return "#6366F1";
}

export default function DesktopView({ stats, date, setDate }) {
  const donutData = (stats.statusCounts || []).map((item) => ({
    name: item.status,
    value: item.count,
    color: statusColor(item.status),
  }));

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
                data={(stats.last7Days || []).map((item) => ({
                  day: item.date,
                  total: item.count,
                }))}
              />
            </div>

            <ServiceBarChart
              data={(stats.services || []).map((item) => ({
                service: item.service,
                total: item.count,
              }))}
            />

            <DonutChart
              title="Status dos agendamentos"
              data={donutData}
              compact
              legendPlacement="left"
              titleClassName="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 text-center"
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
