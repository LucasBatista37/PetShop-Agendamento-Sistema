import { format } from "date-fns";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ITEMS_PER_PAGE = 3;

const AppointmentsList = ({ date, appointments = [] }) => {
  const selectedDate = format(date, "yyyy-MM-dd");

  const filtered = appointments.filter(
    (a) => format(new Date(a.date), "yyyy-MM-dd") === selectedDate
  );

  const [page, setPage] = useState(0);

  const maxPage = Math.floor((filtered.length - 1) / ITEMS_PER_PAGE);

  const paginatedItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(maxPage, p + 1));

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Agendamentos de {format(date, "dd/MM/yyyy")}
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
        {paginatedItems.map((it) => (
          <li
            key={it._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div>
              <p className="font-medium text-gray-800 mb-1">
                {it.petName} – {it.status}
              </p>
              <p className="text-xs text-gray-500">{it.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AppointmentsList;
