import React, { useEffect, useState, useCallback } from "react";
import StatusMessage from "@/utils/StatusMessage";
import { fetchDashboardStats } from "@/api/api";
import MobileView from "./Dashboard/Mobile/MobileView";
import DesktopView from "./Dashboard/Desktop/DesktopView";

export default function DashboardAgendamentos() {
  const [date, setDate] = useState(() => new Date());
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
    byDayInMonth: [],
    totalAppointments: 0,
    totalRevenue: 0,
    peakHour: null,
    appliedFilter: null, 
  });

  const reloadStats = useCallback(
    async (params = {}, options = { silent: false }) => {
      const { silent = false } = options;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await fetchDashboardStats(params);
        setStats(res.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError("Erro ao carregar dados do dashboard.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    reloadStats(); 
  }, [reloadStats]);

  useEffect(() => {
    if (typeof window === "undefined") return;
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

  const commonProps = { stats, date, setDate };

  return isMobile ? (
    <MobileView
      {...commonProps}
      reloadStats={reloadStats}
    />
  ) : (
    <DesktopView {...commonProps} />
  );
}
