import React from "react";

export default function DonutHeader({
  mode = "status",
  onChange = () => {},
  modes = ["status", "services"],
  titles = {
    status: "Status dos agendamentos",
    services: "Distribuição por serviços",
  },
  className = "",
}) {
  const showToggle = Array.isArray(modes) && modes.length > 1;
  const title = titles[mode] || "Distribuição";

  return (
    <div className={`mb-2 flex items-center justify-between gap-2 ${className}`}>
      <h3 className="text-sm md:text-base font-semibold text-gray-800">
        {title}
      </h3>

      {showToggle && (
        <div className="inline-flex rounded-lg bg-gray-100 p-1" role="tablist" aria-label="Alternar modo do donut">
          {modes.map((m, idx) => (
            <button
              key={`${m}-${idx}`}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => onChange(m)}
              className={[
                "px-3 py-2 text-xs md:text-sm font-medium rounded-md transition",
                mode === m ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900",
                idx > 0 ? "ml-1" : ""
              ].join(" ")}
            >
              {m === "status" ? "Status" : "Serviços"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
