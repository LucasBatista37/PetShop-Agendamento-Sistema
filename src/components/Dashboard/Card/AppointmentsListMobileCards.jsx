import React, { useMemo } from "react";
import { isSameDay, format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    const d = new Date(raw);
    return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return null;
}

function colorForStatus(statusRaw) {
  const s = (statusRaw || "").toLowerCase();

  if (["finalizado", "concluído", "concluido"].some(k => s.includes(k))) {
    return {
      bar: "bg-emerald-400",
      ring: "rgba(16,185,129,0.25)",        
      pillBg: "bg-emerald-50",
      pillText: "text-emerald-700",
      pillBorder: "border-emerald-200",
      label: "Concluído",
    };
  }
  if (s.includes("pendente")) {
    return {
      bar: "bg-amber-400",
      ring: "rgba(245,158,11,0.25)",
      pillBg: "bg-amber-50",
      pillText: "text-amber-700",
      pillBorder: "border-amber-200",
      label: "Pendente",
    };
  }
  if (s.includes("cancel")) {
    return {
      bar: "bg-red-400",
      ring: "rgba(239,68,68,0.25)",
      pillBg: "bg-red-50",
      pillText: "text-red-700",
      pillBorder: "border-red-200",
      label: "Cancelado",
    };
  }
  return {
    bar: "bg-indigo-400",
    ring: "rgba(99,102,241,0.22)",
    pillBg: "bg-indigo-50",
    pillText: "text-indigo-700",
    pillBorder: "border-indigo-200",
    label: "Confirmado",
  };
}

function timeOf(appt) {
  if (appt?.time) return appt.time; 
  const raw = getRawDateField(appt);
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d)) return "—";
  return format(d, "HH:mm");
}

function titleOf(appt) {
  const p = appt?.petName || "Pet";
  const breed = appt?.breed;
  const species = appt?.species;
  let t = p;
  if (breed) t += ` – ${breed}`;
  if (!breed && species) t += ` – ${species}`;
  return t;
}

export default function AppointmentsListMobileCards({ date, appointments = [] }) {
  const items = useMemo(() => {
    const list = appointments.filter((a) => {
      const day = normalizeApptDay(getRawDateField(a));
      return day && isSameDay(day, date);
    });
    return list.sort((a, b) => (timeOf(a) > timeOf(b) ? 1 : -1));
  }, [appointments, date]);

  const header = (() => {
    const full = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const [d, m, y] = full.split(" de ");
    return `${d} de ${m.charAt(0).toUpperCase() + m.slice(1)} de ${y}`;
  })();

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Agendamentos de {header}
        </h3>
      </div>

      {items.length === 0 && (
        <p className="text-gray-500 text-sm">Nenhum agendamento.</p>
      )}

      <ul className="space-y-3">
        {items.map((it) => {
          const color = colorForStatus(it.status);
          const serviceName = it?.baseService?.name || "Serviço";

          return (
            <li
              key={it._id || `${getRawDateField(it)}-${it.petName}`}
              className="relative bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex items-start gap-3"
              style={{ boxShadow: `inset 0 0 0 2px ${color.ring}` }} 
            >
              <div className={`w-1.5 rounded-full ${color.bar}`} />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">{timeOf(it)}</div>

                  <span
                    className={[
                      "text-[11px] px-2 py-0.5 rounded-full border",
                      color.pillBg,
                      color.pillText,
                      color.pillBorder,
                    ].join(" ")}
                  >
                    {color.label}
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {titleOf(it)}
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  {serviceName} • {it.ownerName || "Cliente"}
                </p>
              </div>

            </li>
          );
        })}
      </ul>
    </section>
  );
}
