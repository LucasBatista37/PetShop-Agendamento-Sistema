import React, { useState, useMemo } from 'react'
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaEllipsisV,
  FaSearch,
  FaCalendarAlt,
  FaCalendarWeek,
} from 'react-icons/fa'
import { format, startOfWeek, getDay, parse } from 'date-fns'
import ptLocale from 'date-fns/locale/pt'
import { dateFnsLocalizer } from 'react-big-calendar'
import CalendarComponent from './CalendarComponent'
import NewAppointmentModal from './NewAppointmentModal/NewAppointmentModal'

const locales = { pt: ptLocale }
const localizer = dateFnsLocalizer({
  format,
  parse: (value, fmt) => parse(value, fmt, new Date(), { locale: ptLocale }),
  startOfWeek: date => startOfWeek(date, { locale: ptLocale }),
  getDay,
  locales,
})

const mockAppointments = [
  {
    id: 1,
    petName: 'Maxi',
    ownerName: 'Carlos Silva',
    phone: '(11) 98765-4321',
    service: 'Banho + Tosa Completa',
    extras: ['Cortar Unha', 'Hidratação'],
    date: '2025-04-28',
    time: '14:00',
    price: 'R$ 120,00',
    status: 'Pendente',
    notes: 'Pet muito agitado.',
  },
  {
    id: 2,
    petName: 'Lulu',
    ownerName: 'Ana Souza',
    phone: '(11) 91234-5678',
    service: 'Banho Simples',
    extras: [],
    date: '2025-04-28',
    time: '15:30',
    price: 'R$ 70,00',
    status: 'Confirmado',
    notes: '',
  },
]

export default function Appointments() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [view, setView]               = useState('list')
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [search, setSearch]             = useState('')
  const [showModal, setShowModal]       = useState(false)

  const events = useMemo(
    () =>
      appointments.map(a => {
        const [hour, minute] = a.time.split(':')
        const start = new Date(`${a.date}T${a.time}`)
        const end   = new Date(start.getTime() + 60 * 60 * 1000)
        return {
          id: a.id,
          title: `${a.petName} - ${a.service}`,
          start,
          end,
          status: a.status,
        }
      }),
    [appointments],
  )

  const filtered = appointments.filter(a => {
    const matchesStatus =
      filterStatus === 'Todos' || a.status === filterStatus
    const term = search.toLowerCase()
    const matchesSearch =
      a.petName.toLowerCase().includes(term) ||
      a.ownerName.toLowerCase().includes(term) ||
      a.date.includes(term)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">
          Gerenciamento de Agendamentos
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pet, cliente ou data"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64
                         focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 bg-white rounded-md px-4 py-2 text-gray-700"
          >
            <option>Todos</option>
            <option>Confirmado</option>
            <option>Pendente</option>
            <option>Cancelado</option>
          </select>

          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-md ${
              view === 'list'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaCalendarAlt />
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`p-2 rounded-md ${
              view === 'calendar'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <FaCalendarWeek />
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            + Novo
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Pet</th>
                <th className="py-3 px-4 text-left text-gray-600">Dono</th>
                <th className="py-3 px-4 text-left text-gray-600">Serviço</th>
                <th className="py-3 px-4 text-left text-gray-600">Data / Hora</th>
                <th className="py-3 px-4 text-left text-gray-600">Preço</th>
                <th className="py-3 px-4 text-left text-gray-600">Status</th>
                <th className="py-3 px-4 text-left text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map(a => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {a.petName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span>{a.ownerName}</span>
                        <span className="text-xs text-gray-400">{a.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span>{a.service}</span>
                        {a.extras.length > 0 && (
                          <span className="text-xs text-gray-500">
                            Extras: {a.extras.join(', ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {format(new Date(`${a.date}T${a.time}`), 'dd/MM/yyyy')} às{' '}
                      {a.time}
                    </td>
                    <td className="py-3 px-4">{a.price}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.status === 'Confirmado'
                            ? 'bg-green-100 text-green-600'
                            : a.status === 'Pendente'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          title="Confirmar"
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          title="Editar"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          title="Cancelar"
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                        <button
                          title="Mais detalhes"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FaEllipsisV />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <CalendarComponent localizer={localizer} events={events} />
      )}

      <NewAppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        appointments={appointments}
        onSave={newAppt => setAppointments(prev => [...prev, newAppt])}
      />
    </div>
  )
}
