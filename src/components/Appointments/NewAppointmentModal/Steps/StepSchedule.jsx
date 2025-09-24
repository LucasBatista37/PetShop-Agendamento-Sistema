import React from "react";
import { format } from "date-fns";

export default function StepSchedule({
  data,
  onChange,
  freeTimes,
  errors = {},
}) {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-4">
      {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
      <input
        type="date"
        value={data.date}
        onChange={(e) =>
          onChange({ ...data, date: e.target.value, time: "09:00" })
        } 
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      {data.date && (
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Horário</label>
          {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}
          <select
            value={data.time || "09:00"}
            onChange={(e) => onChange({ ...data, time: e.target.value })}
            className="border p-2 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecione um horário</option>
            {freeTimes.length === 0 ? (
              <option disabled>Nenhum horário livre</option>
            ) : (
              freeTimes.map((h) => <option key={h}>{h}</option>)
            )}
          </select>
        </div>
      )}
    </div>
  );
}
