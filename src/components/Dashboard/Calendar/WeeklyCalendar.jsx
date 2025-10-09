import { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const WeeklyCalendar = ({ date, setDate }) => {
  const [start, setStart] = useState(startOfWeek(date, { weekStartsOn: 1 }));

  useEffect(() => {
    setStart(startOfWeek(date, { weekStartsOn: 1 }));
  }, [date]);

  const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  const short = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const nav = (d) => setStart((s) => (d > 0 ? addWeeks(s, 1) : subWeeks(s, 1)));

  const monthYear = format(start, "MMMM yyyy", { locale: ptBR });
  const displayMonth = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">{displayMonth}</h3>
        <div className="flex gap-2">
          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => nav(d)}
              className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs"
            >
              {d === -1 ? "<" : ">"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1 text-[10px] text-gray-500 font-medium text-center">
        {short.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <button
            key={d.toISOString()}
            onClick={() => setDate(d)}
            className={`aspect-square rounded-full text-[11px] font-medium transition focus:outline-none ${
              isSameDay(d, date)
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {format(d, "d")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
