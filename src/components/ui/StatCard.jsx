import React from "react";

export default function StatCard({ icon, label, value, color = "indigo" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <div className={`w-6 h-6 flex items-center justify-center rounded-lg bg-${color}-100`}>
          {icon}
        </div>
      </div>
      <span className="text-lg font-semibold text-gray-800">{value}</span>
    </div>
  );
}
