import React, { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AppointmentCard from "./AppointmentCard";

const ITEMS_PER_PAGE = 2;

function getRawDateField(a) {
  return (
    a?.date ?? a?.datetime ?? a?.startDate ?? a?.start ?? a?.createdAt ?? null
  );
}
function normalizeApptDay(raw) {
  if (!raw) return null;
  if (raw instanceof Date)
    return new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
  if (typeof raw === "number") {
    const d = new Date(raw);
    return isNaN(d)
      ? null
      : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  if (typeof raw === "string") {
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = +m[1],
        mo = +m[2] - 1,
        da = +m[3];
      return new Date(y, mo, da);
    }
    const d = new Date(raw);
    return isNaN(d)
      ? null
      : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return null;
}
function timeOf(appt) {
  if (appt?.time) return appt.time;
  const raw = getRawDateField(appt);
  if (!raw) return "—";
  const d = new Date(raw);
  return isNaN(d) ? "—" : format(d, "HH:mm");
}
function titleOf(appt) {
  const p = appt?.petName || "Pet";
  const breed = appt?.breed,
    species = appt?.species;
  let t = p;
  if (breed) t += ` – ${breed}`;
  if (!breed && species) t += ` – ${species}`;
  return t;
}

export default function AppointmentsList({
  date,
  appointments = [],
  isMobile = false,
}) {
  const filtered = appointments.filter((a) => {
    const day = normalizeApptDay(getRawDateField(a));
    return day && isSameDay(day, date);
  });

  const pageSize = isMobile ? Math.max(filtered.length, 1) : ITEMS_PER_PAGE;

  const [page, setPage] = useState(0);
  const maxPage = Math.max(0, Math.floor((filtered.length - 1) / pageSize));

  useEffect(() => {
    if (page > maxPage) setPage(0);
  }, [filtered.length, pageSize, maxPage]);

  useEffect(() => {
    setPage(0);
  }, [date, isMobile]);

  const paginatedItems = isMobile
    ? filtered
    : filtered.slice(page * pageSize, page * pageSize + pageSize);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(maxPage, p + 1));

  const full = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const [dayPart, monthPart, yearPart] = full.split(" de ");
  const monthCap = monthPart.charAt(0).toUpperCase() + monthPart.slice(1);
  const headerDate = `${dayPart} de ${monthCap} de ${yearPart}`;

  const totalPages = maxPage + 1;
  const currentPage = Math.min(page, maxPage) + 1;

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Agendamentos de {headerDate}
        </h2>

        {!isMobile && filtered.length > pageSize && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className="p-1 text-gray-600 disabled:text-gray-300"
              aria-label="Anterior"
            >
              <FaChevronLeft />
            </button>

            <span
              className="text-xs text-gray-400 select-none"
              aria-live="polite"
            >
              {currentPage}/{totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === maxPage}
              className="p-1 text-gray-600 disabled:text-gray-300"
              aria-label="Próximo"
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
          const key = it._id || `${getRawDateField(it)}-${it.petName}`;
          const time = timeOf(it);
          const title = titleOf(it);
          const subtitle = `${it?.baseService?.name || "Serviço"} • ${
            it.ownerName || "Cliente"
          }`;

          return (
            <AppointmentCard
              key={key}
              time={time}
              title={title}
              subtitle={subtitle}
              status={it.status}
            />
          );
        })}
      </ul>
    </>
  );
}
