import React from 'react'

export default function StepReview({ data }) {
  return (
    <div className="space-y-2 text-sm">
      <h3 className="font-medium mb-2">Resumo</h3>
      <p><strong>Pet:</strong> {data.pet.name} ({data.pet.species})</p>
      <p><strong>Serviço:</strong> {data.service.base}</p>
      {data.service.extras.length > 0 && (
        <p><strong>Extras:</strong> {data.service.extras.join(', ')}</p>
      )}
      <p><strong>Data:</strong> {data.schedule.date} às {data.schedule.time}</p>
    </div>
  )
}
