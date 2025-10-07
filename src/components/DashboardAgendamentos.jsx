import React, { useEffect, useState } from "react";
import StatusMessage from "@/utils/StatusMessage";
import { fetchDashboardStats } from "@/api/api";
import MobileView from "./Dashboard/Mobile/MobileView";
import DesktopView from "./Dashboard/Desktop/DesktopView";

export default function DashboardAgendamentos() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(
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
