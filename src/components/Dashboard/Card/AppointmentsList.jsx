import React, { useState } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ITEMS_PER_PAGE = 3;

// Pega o campo de data, qualquer que seja o nome
function getRawDateField(a) {
  return (
    a?.date ?? a?.datetime ?? a?.startDate ?? a?.start ?? a?.createdAt ?? null
  );
}

// >>> Normaliza para "dia local" (ignora fuso da string)
function normalizeApptDay(raw) {
  if (!raw) return null;

  if (raw instanceof Date) {
    return new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
  }
  if (typeof raw === "number") {
    const d = new Date(raw);
    return isNaN(d)
      ? null
      : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  if (typeof raw === "string") {
    // Extrai YYYY-MM-DD do começo da string (cobre "2025-06-10", "2025-06-10T00:00:00Z", etc.)
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = Number(m[1]),
        mo = Number(m[2]) - 1,
        da = Number(m[3]);
      return new Date(y, mo, da); // meia-noite LOCAL do dia informado
    }
    // fallback
    const d = new Date(raw);
    return isNaN(d)
      ? null
      : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return null;
}

export default function AppointmentsList({ date, appointments = [] }) {
  const filtered = appointments.filter((a) => {
    const day = normalizeApptDay(getRawDateField(a));
    return day && isSameDay(day, date);
  });

  const [page, setPage] = useState(0);
  const maxPage = Math.max(
    0,
    Math.floor((filtered.length - 1) / ITEMS_PER_PAGE)
  );
  const paginatedItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );
  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(maxPage, p + 1));

  const full = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const [dayPart, monthPart, yearPart] = full.split(" de ");
  const monthCap = monthPart.charAt(0).toUpperCase() + monthPart.slice(1);
  const headerDate = `${dayPart} de ${monthCap} de ${yearPart}`;

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Agendamentos de {headerDate}
        </h2>
        {filtered.length > ITEMS_PER_PAGE && (
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className="p-1 text-gray-600 disabled:text-gray-300"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNext}
              disabled={page === maxPage}
              className="p-1 text-gray-600 disabled:text-gray-300"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-3 overflow-hidden text-sm">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum agendamento.</p>
        )}
        {paginatedItems.map((it) => {
          const timeStr = it.time ?? "—";
          return (
            <li
              key={it._id || `${getRawDateField(it)}-${it.petName}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium text-gray-800 mb-1">
                  {it.petName} – {it.status}
                </p>
                <p className="text-xs text-gray-500">{timeStr}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
