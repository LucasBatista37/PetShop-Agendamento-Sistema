import React, { useEffect, useState, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function MonthYearFilter({ value, onChange, align = "end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => thisYear - 2 + i);

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const [temp, setTemp] = useState(() => value ?? { month: new Date().getMonth(), year: thisYear });
  useEffect(() => { if (value) setTemp(value); }, [value]);

  const label = `${months[value.month]} / ${value.year}`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Filtro por mês e ano"
      >
        <span>{label}</span>
        <FiChevronDown className={`text-gray-600 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Filtro por mês e ano"
          className={[
            "absolute z-30 mt-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl",
            align === "end" ? "right-0" : "left-0",
            "w-[min(18rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-auto"
          ].join(" ")}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Mês</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={temp.month}
                onChange={(e) => setTemp(t => ({ ...t, month: Number(e.target.value) }))}
              >
                {months.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
              </select>
            </div>
            <div className="w-28">
              <label className="block text-xs text-gray-500 mb-1">Ano</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={temp.year}
                onChange={(e) => setTemp(t => ({ ...t, year: Number(e.target.value) }))}
              >
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
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
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900"
              onClick={() => { onChange(temp); setOpen(false); }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
