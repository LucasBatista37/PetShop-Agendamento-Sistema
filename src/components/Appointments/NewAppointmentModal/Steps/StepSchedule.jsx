import React, { useMemo, useRef } from "react";
import { format } from "date-fns";
import { FiCalendar, FiClock } from "react-icons/fi";

export default function StepSchedule({
  data,
  onChange,
  freeTimes = [],
  errors = {},
}) {
  const todayIso = format(new Date(), "yyyy-MM-dd");
  const dateRef = useRef(null);

  const setDateIfEmptyAndOpen = () => {
    if (!data?.date) {
      onChange?.({ ...data, date: todayIso, time: data?.time ?? "" });
    }
    const el = dateRef.current;
    if (el && typeof el.showPicker === "function") {
      el.showPicker();
    } else if (el) {
      el.focus();
      setTimeout(() => el.click?.(), 0);
    }
  };

  const { hourOptions, minutesByHour } = useMemo(() => {
    const map = new Map();
    for (const t of freeTimes || []) {
      const [h, m] = String(t).split(":");
      if (!h || !m) continue;
      if (!map.has(h)) map.set(h, new Set());
      map.get(h).add(m.padStart(2, "0"));
    }
    const hours = Array.from(map.keys()).sort((a, b) => Number(a) - Number(b));
    const minutesByHour = {};
    for (const h of hours) {
      minutesByHour[h] = Array.from(map.get(h)).sort((a, b) => Number(a) - Number(b));
    }
    return { hourOptions: hours, minutesByHour };
  }, [freeTimes]);

  const defaultHourOptions = useMemo(
    () => Array.from({ length: 13 }, (_, i) => String(i + 8).padStart(2, "0")), // 08..20
    []
  );
  const defaultMinuteOptions = ["00", "15", "30", "45"];

  // quebra o time atual
  const [currHour, currMinute] = useMemo(() => {
    if (!data?.time) return ["", ""];
    const [h, m] = String(data.time).split(":");
    return [h?.padStart(2, "0") || "", m?.padStart(2, "0") || ""];
  }, [data?.time]);

  const effectiveHourOptions =
    (hourOptions?.length ? hourOptions : defaultHourOptions);

  const effectiveMinuteOptions = useMemo(() => {
    if (!data?.date) return [];
    if (hourOptions?.length) {
      if (!currHour || !minutesByHour[currHour]) {
        // caso não haja hora selecionada ainda, usa minutos da primeira hora disponível
        const firstHour = hourOptions[0];
        return minutesByHour[firstHour] || [];
      }
      return minutesByHour[currHour] || [];
    }
    return defaultMinuteOptions;
  }, [
    data?.date,
    hourOptions,
    minutesByHour,
    currHour,
    defaultMinuteOptions,
  ]);

  const handleDateChange = (e) => {
    const newDate = e.target.value || todayIso;
    let nextTime = data?.time || "";
    if (freeTimes?.length && effectiveHourOptions.length > 0) {
      const h = effectiveHourOptions[0];
      const ms = minutesByHour[h] || [];
      const m = ms[0] || "00";
      nextTime = `${h}:${m}`;
    } else if (!nextTime) {
      // define um padrão agradável
      nextTime = "09:00";
    }
    onChange?.({ ...data, date: newDate, time: nextTime });
  };

  const handleHourChange = (e) => {
    const h = String(e.target.value).padStart(2, "0");
    const mins = hourOptions?.length ? (minutesByHour[h] || []) : defaultMinuteOptions;
    const m = mins[0] || "00";
    onChange?.({ ...data, time: `${h}:${m}` });
  };

  const handleMinuteChange = (e) => {
    const m = String(e.target.value).padStart(2, "0");
    const h = currHour || (effectiveHourOptions[0] ?? "09");
    onChange?.({ ...data, time: `${h}:${m}` });
  };

  const hasTimeAnyOption =
    (hourOptions?.length && Object.keys(minutesByHour).length) ||
    effectiveHourOptions.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>

        {errors.date && <p className="text-red-600 text-sm mb-1">{errors.date}</p>}

        <div
          className="relative"
          onClick={setDateIfEmptyAndOpen}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setDateIfEmptyAndOpen()}
          role="button"
          tabIndex={0}
          aria-label="Abrir seletor de data"
        >
          <input
            id="schedule-date"
            ref={dateRef}
            type="date"
            value={data?.date || ""}
            onChange={handleDateChange}
            onFocus={setDateIfEmptyAndOpen}
            className="w-full rounded-lg border border-gray-300 pl-11 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={todayIso}
            min={todayIso} 
          />
          <FiCalendar
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Clique para escolher a data (hoje é sugerido automaticamente).
        </p>
      </div>

      {data?.date && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Horário</label>
          {errors.time && <p className="text-red-600 text-sm mt-1">{errors.time}</p>}

          <div className="mt-2 grid grid-cols-2 gap-3">
            {/* Hora */}
            <div>
              <div className="relative">
                <FiClock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <select
                  value={currHour || ""}
                  onChange={handleHourChange}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {!currHour && <option value="">Hora</option>}
                  {effectiveHourOptions.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Selecione a <strong>hora</strong>.</p>
            </div>

            <div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  :
                </span>
                <select
                  value={currMinute || ""}
                  onChange={handleMinuteChange}
                  disabled={!currHour && hourOptions?.length}
                  className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  {!currMinute && <option value="">Min</option>}
                  {effectiveMinuteOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Depois, selecione os <strong>minutos</strong>.</p>
            </div>
          </div>

          {data?.date && !hasTimeAnyOption && (
            <p className="text-sm text-amber-600 mt-2">
              Nenhum horário disponível para esta data.
            </p>
          )}

          {data?.time && (
            <p className="text-sm text-gray-600 mt-2">
              Selecionado: <span className="font-medium">{data.date}</span>{" "}
              às <span className="font-medium">{data.time}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
