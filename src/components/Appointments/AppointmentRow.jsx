import IconButton from './IconButton'
import { FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa'
import { format, parseISO } from 'date-fns'

export default function AppointmentRow({ appointment, onConfirm, onEdit, onCancel }) {
  const { id, petName, ownerName, phone, service, extras, date, time, price, status } = appointment

  const statusClass = {
    Confirmado: "bg-green-100 text-green-600",
    Pendente:   "bg-yellow-100 text-yellow-600",
    Cancelado:  "bg-red-100 text-red-600",
  }[status]

  return (
    <tr className="border-b odd:bg-gray-50/40">
      <td className="py-3 px-4 font-semibold text-gray-800">{petName}</td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span>{ownerName}</span>
          <span className="text-xs text-gray-400">{phone}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span>{service}</span>
          {!!extras.length && (
            <span className="text-xs text-gray-500">
              Extras: {extras.join(", ")}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">{format(parseISO(date), "dd/MM/yyyy")} às {time}</td>
      <td className="py-3 px-4">{price}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{status}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {status !== 'Confirmado' && (
            <IconButton
              title="Confirmar"
              onClick={() => onConfirm(id)}
              icon={FaCheckCircle}
              className="text-green-600 hover:text-green-800"
            />
          )}
          <IconButton
            title="Editar / Remarcar"
            onClick={() => onEdit(appointment)}
            icon={FaEdit}
            className="text-blue-600 hover:text-blue-800"
          />
          {status !== 'Cancelado' && (
            <IconButton
              title="Cancelar"
              onClick={() =>
                window.confirm("Cancelar este agendamento?") && onCancel(id)
              }
              icon={FaTrash}
              className="text-red-500 hover:text-red-700"
            />
          )}
        </div>
      </td>
    </tr>
  )
}
