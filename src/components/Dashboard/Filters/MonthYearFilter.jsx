import React, { useEffect, useState, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function MonthYearFilter({ value, onChange, align = "end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => thisYear - 2 + i);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const clamp11 = (n) => Math.max(0, Math.min(11, Math.trunc(Number(n) || 0)));

  // Normaliza qualquer forma de entrada para estado interno { month: 0..11, year }
  const normalizeIn = (v) => {
    if (!v || typeof v !== "object") {
      return { month: new Date().getMonth(), year: thisYear };
    }
    const y = Number(v.year) || thisYear;

    let m0;
    if ("month0" in v) {
      m0 = Number(v.month0);
    } else if ("month" in v) {
      const m = Number(v.month);
      // Se vier 1–12, converte para 0–11; se vier 0–11, mantém
      m0 = m > 11 ? m - 1 : m;
    } else {
      m0 = new Date().getMonth();
    }

    return { month: clamp11(m0), year: y };
  };

  const [temp, setTemp] = useState(() => normalizeIn(value));
  // Sempre que "value" mudar (em qualquer formato), sincroniza
  useEffect(() => {
    setTemp(normalizeIn(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.month0, value?.month, value?.year]);

  // O que mostramos no botão (prioriza value, mas normalizado)
  const display = normalizeIn(value ?? temp);
  const label = `${months[display.month]} / ${display.year}`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Filtro por mês e ano"
      >
        <span>{label}</span>
        <FiChevronDown
          className={`text-gray-600 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Filtro por mês e ano"
          className={[
            "absolute z-30 mt-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl",
            align === "end" ? "right-0" : "left-0",
            "w-[min(18rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-auto",
          ].join(" ")}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Mês</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={temp.month} // sempre 0..11
                onChange={(e) =>
                  setTemp((t) => ({ ...t, month: clamp11(e.target.value) }))
                }
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label className="block text-xs text-gray-500 mb-1">Ano</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={temp.year}
                onChange={(e) =>
                  setTemp((t) => ({ ...t, year: Number(e.target.value) }))
                }
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
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
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900"
              onClick={() => {
                // Emite ambos formatos (month0 e month) para evitar ambiguidade no pai
                onChange?.({
                  month0: temp.month, // 0..11
                  month: temp.month + 1, // 1..12
                  year: temp.year,
                });
                setOpen(false);
              }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
