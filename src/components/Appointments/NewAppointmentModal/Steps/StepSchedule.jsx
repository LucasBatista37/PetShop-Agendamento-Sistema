import React from "react";
import { format } from "date-fns";

export default function StepSchedule({ data, onChange, freeTimes }) {
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-4">
      <input
        type="date"
        value={data.date}
        min={today}
        onChange={(e) => onChange({ ...data, date: e.target.value, time: "" })}
        className="border p-2 rounded w-full"
      />

      {data.date && (
        <>
          <h3 className="font-medium">Horário</h3>
          <select
            value={data.time}
            onChange={(e) => onChange({ ...data, time: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">Selecione um horário</option>
            {freeTimes.length === 0 ? (
              <option disabled>Nenhum horário livre</option>
            ) : (
              freeTimes.map((h) => <option key={h}>{h}</option>)
            )}
          </select>
        </>
      )}
    </div>
  );
}