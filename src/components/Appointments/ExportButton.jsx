import React from "react";

export default function ExportButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </button>
  );
}
