import React, { useState } from 'react'
import { Calendar, Views } from 'react-big-calendar'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  const viewOptions = [
    { label: 'Mês', value: Views.MONTH },
    { label: 'Semana', value: Views.WEEK },
    { label: 'Dia', value: Views.DAY },
  ]

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-100 border-b border-gray-300 gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('TODAY')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          Hoje
        </button>
        <button
          onClick={() => onNavigate('PREV')}
          className="flex items-center gap-1 bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400 text-sm"
        >
          <FaChevronLeft size={14} />
          Anterior
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="flex items-center gap-1 bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400 text-sm"
        >
          Próximo
          <FaChevronRight size={14} />
        </button>
      </div>

      <div className="text-lg font-semibold text-gray-700 text-center">{label}</div>

      <div className="flex items-center gap-2">
        {viewOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onView(opt.value)}
            className={`px-3 py-2 rounded text-sm ${
              view === opt.value
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const CalendarComponent = ({ localizer, events }) => {
  const [currentView, setCurrentView] = useState(Views.MONTH)
  const [currentDate, setCurrentDate]   = useState(new Date())   

  const eventStyleGetter = (event) => {
    let backgroundColor = '#6B7280'
    if (event.status === 'Confirmado') backgroundColor = '#34D399'
    else if (event.status === 'Pendente') backgroundColor = '#FBBF24'
    else if (event.status === 'Cancelado') backgroundColor = '#F87171'
    return { style: { backgroundColor, borderRadius: '6px', color: '#fff', padding: '0 5px' } }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Calendário de Agendamentos</h2>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}                     
          onNavigate={(newDate) => setCurrentDate(newDate)} 
          view={currentView}
          onView={(v) => setCurrentView(v)}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          popup
          eventPropGetter={eventStyleGetter}
          style={{ height: 600 }}
          messages={{
            next: 'Próximo',
            previous: 'Anterior',
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            date: 'Data',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'Nenhum agendamento neste período.',
            showMore: (total) => `+ Ver mais (${total})`,
          }}
          components={{ toolbar: CustomToolbar }}
        />
      </div>
    </div>
  )
}

export default CalendarComponent
