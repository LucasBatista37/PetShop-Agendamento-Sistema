import React from "react";
import { FiBarChart2, FiCalendar } from "react-icons/fi";

export default function VisionTabs({ view, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Visão"
      className="w-full rounded-2xl bg-gray-100/80 ring-1 ring-gray-200 p-1.5 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-1.5">
        <button
          role="tab"
          aria-selected={view === "dashboard"}
          onClick={() => onChange("dashboard")}
          className={`w-full rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1 transition-all
            ${view === "dashboard" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:bg-white/60"}`}
        >
          <FiBarChart2 className="text-base text-indigo-600" />
          <span>Dashboard</span>
        </button>

        <button
          role="tab"
          aria-selected={view === "bookings"}
          onClick={() => onChange("bookings")}
          className={`w-full rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1 transition-all
            ${view === "bookings" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:bg-white/60"}`}
        >
          <FiCalendar className="text-base text-indigo-600" />
          <span>Agendamentos</span>
        </button>
      </div>
    </div>
  );
}
