import AppointmentRow from "./AppointmentRow";

export default function AppointmentTable({
  data,
  onConfirm,
  onEdit,
  onCancel,
}) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            {[
              "Pet",
              "Dono",
              "Serviço",
              "Data / Hora",
              "Preço",
              "Status",
              "Ações",
            ].map((h) => (
              <th key={h} className="py-3 px-4 text-left text-gray-600">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-4 text-center text-gray-500">
                Nenhum agendamento encontrado.
              </td>
            </tr>
          ) : (
            data.map((a) => (
              <AppointmentRow
                key={a._id} 
                appointment={a}
                onConfirm={onConfirm}
                onEdit={onEdit}
                onCancel={onCancel}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
