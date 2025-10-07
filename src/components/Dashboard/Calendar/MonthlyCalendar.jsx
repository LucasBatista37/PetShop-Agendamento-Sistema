import React, { useMemo, useEffect, useState } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday, format
} from "date-fns";
import { ptBR } from "date-fns/locale";

// helpers para normalizar a data (ignora fuso)
function getRawDateField(a) {
  return a?.date ?? a?.datetime ?? a?.startDate ?? a?.start ?? a?.createdAt ?? null;
}
function normalizeApptDay(raw) {
  if (!raw) return null;
  if (raw instanceof Date) return new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
  if (typeof raw === "number") {
    const d = new Date(raw);
    return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  if (typeof raw === "string") {
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2]-1, +m[3]);
    const d = new Date(raw);
    return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return null;
}

export default function MonthlyCalendar({ date, setDate, appointments = [] }) {
  // mês em visualização (navegação independente do dia selecionado)
  const [viewMonth, setViewMonth] = useState(date);

  useEffect(() => {
    // se mudou externamente, acompanha
    if (date.getMonth() !== viewMonth.getMonth() || date.getFullYear() !== viewMonth.getFullYear()) {
      setViewMonth(date);
    }
  }, [date]); // eslint-disable-line

  const daysGrid = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let d = gridStart;
    while (d <= gridEnd) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  }, [viewMonth]);

  // mapa de contagem de agendamentos por dia (para os pontinhos)
  const countByDay = useMemo(() => {
    const map = new Map();
    for (const a of appointments) {
      const d = normalizeApptDay(getRawDateField(a));
      if (!d) continue;
      const key = d.toDateString(); // chave local
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [appointments]);

  const weekLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const headerLabel = (() => {
    const m = format(viewMonth, "MMMM yyyy", { locale: ptBR });
    return m.charAt(0).toUpperCase() + m.slice(1);
  })();

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Calendário</h3>
          <p className="text-xs text-gray-500">{headerLabel}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMonth((m) => subMonths(m, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            ‹
          </button>
          <button
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1 text-[10px] text-gray-500 font-medium text-center">
        {weekLabels.map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysGrid.map((d) => {
          const inMonth = isSameMonth(d, viewMonth);
          const selected = isSameDay(d, date);
          const today = isToday(d);
          const hasAppts = countByDay.get(d.toDateString()) > 0;

          return (
            <button
              key={d.toISOString()}
              onClick={() => setDate(d)}
              className={[
                "aspect-square rounded-xl text-[11px] font-medium transition flex flex-col items-center justify-center",
                selected
                  ? "bg-indigo-600 text-white shadow"
                  : inMonth
                    ? "text-gray-800 hover:bg-gray-100"
                    : "text-gray-400 hover:bg-gray-100"
              ].join(" ")}
              aria-label={format(d, "PPP", { locale: ptBR })}
            >
              <span className="leading-none">{format(d, "d")}</span>
              {/* hoje com aro sutil */}
              {today && !selected && <span className="mt-0.5 block w-1.5 h-1.5 rounded-full bg-indigo-400/60" />}
              {/* pontinho de agendamento */}
              {hasAppts && <span className="mt-0.5 block w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}
