import React, { useState } from 'react'
import { Calendar, Views, Navigate } from 'react-big-calendar'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import AppointmentDetails from './AppointmentDetails'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  const views = [
    { label: 'Mês', value: Views.MONTH },
    { label: 'Semana', value: Views.WEEK },
    { label: 'Dia', value: Views.DAY },
  ]

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 border-b gap-4">
      <div className="flex items-center gap-2">
        <ToolbarBtn onClick={() => onNavigate(Navigate.TODAY)} primary>
          Hoje
        </ToolbarBtn>
        <ToolbarBtn onClick={() => onNavigate(Navigate.PREV)}>
          <FaChevronLeft /> Anterior
        </ToolbarBtn>
        <ToolbarBtn onClick={() => onNavigate(Navigate.NEXT)}>
          Próximo <FaChevronRight />
        </ToolbarBtn>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 text-center">{label}</h3>

      <div className="flex gap-2">
        {views.map(v => (
          <ToolbarBtn
            key={v.value}
            active={view === v.value}
            onClick={() => onView(v.value)}
          >
            {v.label}
          </ToolbarBtn>
        ))}
      </div>
    </div>
  )
}

const ToolbarBtn = ({ children, onClick, primary, active }) => {
  let base =
    'px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-colors'
  if (primary)
    base +=
      ' bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-medium'
  else if (active)
    base +=
      ' bg-indigo-100 text-indigo-700 font-medium border border-indigo-200'
  else base += ' bg-white text-gray-700 hover:bg-gray-100 border'

  return (
    <button onClick={onClick} className={base}>
      {children}
    </button>
  )
}

export default function CalendarComponent({ localizer, events }) {
  const [currentView, setCurrentView] = useState(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selected, setSelected] = useState(null)

  const eventStyleGetter = event => ({
    style: {
      backgroundColor:
        {
          Confirmado: '#34D399',
          Pendente: '#FBBF24',
          Cancelado: '#F87171',
        }[event.status] || '#6B7280',
      borderRadius: 6,
      color: '#fff',
      padding: '0 6px',
    },
  })

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Calendário de Agendamentos
      </h2>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <Calendar
          localizer={localizer}
          culture="pt-BR"
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={setCurrentDate}
          view={currentView}
          onView={setCurrentView}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          popup
          selectable
          onSelectEvent={setSelected}
          eventPropGetter={eventStyleGetter}
          style={{ height: 600 }}
          components={{ toolbar: CustomToolbar }}
          messages={{
            today: 'Hoje',
            previous: 'Anterior',
            next: 'Próximo',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'Nenhum agendamento neste período.',
            showMore: total => `+${total} mais`,
          }}
          dayLayoutAlgorithm="no-overlap"
          formats={{
            dayHeaderFormat: (date, _, __, ___) =>
              format(date, 'EEEE, dd/MM', { locale: ptBR }),
            dayRangeHeaderFormat: (range, _, __, ___) =>
              `${format(range.start, 'dd/MM', { locale: ptBR })} — ${format(
                range.end,
                'dd/MM',
                { locale: ptBR },
              )}`,
          }}
        />
      </div>

      <AppointmentDetails
        open={!!selected}
        data={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
