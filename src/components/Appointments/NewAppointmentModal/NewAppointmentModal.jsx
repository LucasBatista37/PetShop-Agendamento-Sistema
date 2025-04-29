import React, { useState, useMemo } from 'react'
import { Dialog } from '@headlessui/react'
import { FaCheck, FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import StepPet from './steps/StepPet'
import StepService from './steps/StepService'
import StepSchedule from './steps/StepSchedule'
import StepReview from './steps/StepReview'

console.log({
  HeadlessUIDialog: !!Dialog,
  DialogPanel: Dialog.Panel,
  StepPet,
  StepService,
  StepSchedule,
  StepReview,
})

const STEPS = ['Pet', 'Serviço', 'Data', 'Revisão']

const defaultData = {
  pet: { name: '', species: 'Cachorro', breed: '', size: 'Pequeno', notes: '' },
  service: { base: '', extras: [] },
  schedule: { date: '', time: '' },
}

export default function NewAppointmentModal({ isOpen, onClose, onSave, appointments }) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState(defaultData)

  const freeTimes = useMemo(() => {
    if (!formData.schedule.date) return []
    const MAX_PER_HOUR = 3
    const dayAppts = appointments.filter(a => a.date === formData.schedule.date)
    const hours = Array.from({ length: 10 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`)
    return hours.filter(h => dayAppts.filter(a => a.time === h).length < MAX_PER_HOUR)
  }, [formData.schedule.date, appointments])

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep(s => Math.max(s - 1, 0))

  const save = () => {
    const id = Math.max(0, ...appointments.map(a => a.id)) + 1
    onSave({ id, ...formDataToAppointment(formData) })
    onClose()
    setStep(0)
    setFormData(defaultData)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

      <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-6">
        <Dialog.Title className="text-xl font-semibold text-gray-800">
          Novo Agendamento
        </Dialog.Title>

        {step === 0 && (
          <StepPet
            data={formData.pet}
            onChange={d => setFormData(f => ({ ...f, pet: d }))}
          />
        )}
        {step === 1 && (
          <StepService
            data={formData.service}
            onChange={d => setFormData(f => ({ ...f, service: d }))}
          />
        )}
        {step === 2 && (
          <StepSchedule
            data={formData.schedule}
            freeTimes={freeTimes}
            onChange={d => setFormData(f => ({ ...f, schedule: d }))}
          />
        )}
        {step === 3 && <StepReview data={formData} />}

        <div className="flex justify-between pt-4 border-t">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            <FaChevronLeft /> Voltar
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={
                (step === 0 && !formData.pet.name) ||
                (step === 1 && !formData.service.base) ||
                (step === 2 && !(formData.schedule.date && formData.schedule.time))
              }
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-40"
            >
              Próximo <FaChevronRight />
            </button>
          ) : (
            <button
              onClick={save}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <FaCheck /> Confirmar
            </button>
          )}
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

function formDataToAppointment({ pet, service, schedule }) {
  const priceMap = {
    'Banho Simples': 70,
    'Banho + Tosa higiênica': 90,
    'Banho + Tosa completa': 120,
  }
  const extrasPrice = {
    'Cortar unha': 15,
    'Limpar ouvidos': 10,
    'Hidratação': 20,
  }
  const basePrice   = priceMap[service.base] || 0
  const extrasTotal = service.extras.reduce((acc, e) => acc + (extrasPrice[e] || 0), 0)

  return {
    petName:    pet.name,
    ownerName:  '-',    
    phone:      '-',
    service:    service.base,
    extras:     service.extras,
    date:       schedule.date,
    time:       schedule.time,
    price:      `R$ ${(basePrice + extrasTotal).toFixed(2)}`,
    status:     'Pendente',
    notes:      pet.notes,
  }
}
