import { format } from "date-fns";

const AppointmentsList = ({ date, appointments = [] }) => {
  const selectedDate = format(date, "yyyy-MM-dd");

  const filtered = appointments.filter(
    (a) => format(new Date(a.date), "yyyy-MM-dd") === selectedDate
  );

  return (
    <>
      <h2 className="text-sm font-semibold text-gray-800 mb-2">
        Agendamentos de {format(date, "dd/MM/yyyy")}
      </h2>
      <ul className="space-y-3 overflow-auto pr-1 flex-1 text-sm">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum agendamento.</p>
        )}
        {filtered.map((it) => (
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
